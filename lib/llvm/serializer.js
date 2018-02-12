'use strict';

const assert = require('assert');

const llvm = require('./');
const Counter = llvm.utils.Counter;

class Serializer {
  constructor() {
    this.counters = {
      block: null,
      instr: null
    };
  }

  cstr() {
    throw new Error('Not supported');
  }

  struct(s) {
    let out = `${s.type} = type {\n`;

    s.fields.forEach((field, index) => {
      const isLast = index === s.fields.length - 1;
      const comma = isLast ? '' : ',';

      out += `  ${field.type.type}${comma} ` +
        `; ${index} => ${JSON.stringify(field.name)}\n`;
    });

    out += '}\n';
    return out;
  }

  function(fn) {
    let out = '';
    const sig = fn.type;

    this.counters.block = new Counter();
    this.counters.instr = new Counter();

    let visibility = fn.visibility ? fn.visibility + ' ' : '';

    const params = fn.params.map((name, index) => {
      return `${sig.args[index].type} %${name}`;
    });

    out += `define ${visibility}${sig.ret.type} @${fn.name}(${params}) {\n`;

    const queue = [ fn.body ];
    const seen = new Set(queue);
    while (queue.length !== 0) {
      const block = queue.shift();
      out += this.block(fn, block) + '\n';

      block.children.forEach((child) => {
        if (seen.has(child))
          return;

        seen.add(child);
        queue.push(child);
      });
    }

    out += '}\n';

    this.counters.block = null;
    this.counters.instr = null;

    return out;
  }

  block(fn, b) {
    const index = b === fn.body ? null : this.counters.block.id(b);
    let out = '';

    if (index !== null)
      out += `b${index}:\n`;

    assert.notStrictEqual(b.terminator, null, 'Unterminated block');
    b.instructions.forEach((instr) => {
      out += '  ' + this.instruction(instr) + '\n';
    });

    out += '  ' + this.instruction(b.terminator);

    return out;
  }

  instruction(instr) {
    let out = '';

    assert(!this.counters.instr.seen(instr),
      'Instruction added to two blocks!');

    if (!instr.isVoid)
      out += `%i${this.counters.instr.id(instr)} = `;
    out += `${instr.name}`;

    const args = instr.getArgs();
    args.forEach((group, index) => {
      const isLast = index === args.length - 1;

      if (Array.isArray(group))
        group.forEach(arg => out += ' ' + this.arg(arg));
      else
        out += ' ' + this.arg(group);

      if (!isLast)
        out += ',';
    });

    return out;
  }

  arg(v) {
    if (v instanceof llvm.values.Function)
      return `@${v.name}`;

    if (v instanceof llvm.values.Arg)
      return `%${v.name}`;

    if (v instanceof llvm.values.Int)
      return v.value;

    if (v instanceof llvm.values.Null)
      return 'null';

    if (v instanceof llvm.types.Type)
      return v.type;

    if (v instanceof llvm.instructions.Instruction) {
      assert(!v.isVoid, 'void instruction argument');
      assert(this.counters.instr.seen(v),
        'Instruction doesn\'t dominate uses');

      return `%i${this.counters.instr.id(v)}`;
    }

    if (v instanceof llvm.Block)
      return `label %b${this.counters.block.id(v)}`;

    throw new Error('Unexpected instruction argument: ' + v);
  }
}
module.exports = Serializer;
