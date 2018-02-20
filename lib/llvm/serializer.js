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

    this.reset();
  }

  reset() {
    this.counters.block = new Counter();
    this.counters.instr = new Counter();
  }

  data(str) {
    let bytes = '';
    const value = str.value;
    for (let i = 0; i < value.length; i++) {
      const c = value[i];

      // Printable ASCII (Except `"` and `\`)
      if (0x20 <= c && c < 0x7f && c !== 0x22 && c !== 0x5c) {
        bytes += String.fromCharCode(c);
        continue;
      }

      const hi = (value[i] >> 4) & 0xf;
      const lo = value[i] & 0xf;
      bytes += '\\' + hi.toString(16) + lo.toString(16);
    }

    return `@${str.id} = private unnamed_addr constant ${str.type.type} ` +
      `c"${bytes}"`;
  }

  struct(s) {
    let out = `${s.type} = type {\n`;

    s.fields.forEach((field, index) => {
      const isLast = index === s.fields.length - 1;
      const comma = isLast ? '' : ',';

      out += `  ${field.type.type}${comma} ` +
        `; ${index} => ${JSON.stringify(field.name)}\n`;
    });

    out += '}';
    return out;
  }

  declaration(d) {
    const sig = d.type;

    const visibility = d.visibility ? d.visibility + ' ' : '';
    const cconv = d.cconv ? d.cconv + ' ' : '';
    const attributes = d.attributes ? ' ' + d.attributes : '';

    const params = sig.args.map((arg, index) => {
      const attribute = sig.attributes[index] ?
        ' ' + sig.attributes[index] : '';
      return arg.type + attribute;
    }).join(', ');

    return `declare ${visibility}${cconv}${sig.ret.type} ` +
      `@${d.name}(${params})${attributes}`;
  }

  function(fn) {
    let out = '';
    const sig = fn.type;

    const visibility = fn.visibility ? fn.visibility + ' ' : '';
    const cconv = fn.cconv ? fn.cconv + ' ' : '';
    const attributes = fn.attributes ? fn.attributes + ' ' : '';

    let params = fn.params.map((name, index) => {
      const arg = sig.args[index];
      const attribute = sig.attributes[index] ?
        ' ' + sig.attributes[index] : '';
      return `${arg.type}${attribute} %${name}`;
    }).join(', ');

    if (params.length > 80)
      params = '\n' + params.split(', ').map(p => '    ' + p).join(',\n');

    out += `define ${visibility}${cconv}${sig.ret.type} ` +
      `@${fn.name}(${params}) ${attributes}{\n`;

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

    out += '}';

    return out;
  }

  block(fn, b) {
    const index = b === fn.body ? null : this.counters.block.id(b);
    let out = '';

    if (index !== null) {
      const name = b.name === null ? '' : `_${b.name}`;
      out += `b${index}${name}:\n`;
    }

    assert.notStrictEqual(b.terminator, null,
      `Unterminated block: ${b.name || 'unnamed'}`);
    b.instructions.forEach((instr) => {
      out += '  ' + this.instruction(instr) + '\n';
    });

    out += '  ' + this.instruction(b.terminator);

    return out;
  }

  instruction(instr) {
    if (instr instanceof llvm.instructions.Comment)
      return `; ${instr.string}`;
    let out = '';

    if (!instr.isVoid)
      out += `%i${this.counters.instr.id(instr)} = `;
    out += `${instr.name}`;

    const args = instr.getArgs();
    args.forEach((group, index) => {
      const isLast = index === args.length - 1;

      if (Array.isArray(group))
        group.forEach(arg => out += ' ' + this.arg(instr, arg));
      else
        out += ' ' + this.arg(instr, group);

      if (!isLast)
        out += ',';
    });

    return out;
  }

  arg(instr, v) {
    if (v instanceof llvm.values.Function)
      return `@${v.name}`;

    if (v instanceof llvm.values.Declaration)
      return `@${v.name}`;

    if (v instanceof llvm.values.Arg)
      return `%${v.name}`;

    if (v instanceof llvm.values.Int)
      return v.value;

    if (v instanceof llvm.values.Ref)
      return `@${v.id}`;

    if (v instanceof llvm.values.BlockRef) {
      const name = v.block.name === null ? '' : `_${v.block.name}`;
      return `%b${this.counters.block.id(v.block)}${name}`;
    }

    if (v instanceof llvm.values.Struct) {
      let out = '{ ';
      out += v.values.map((pair) => {
        return this.arg(instr, pair[0].type) + ' ' + this.arg(instr, pair[1]);
      }).join(', ');
      out += ' }';
      return out;
    }

    if (v instanceof llvm.values.Null)
      return 'null';

    if (v instanceof llvm.types.Type)
      return v.type;

    if (v instanceof llvm.instructions.Instruction) {
      assert(!v.isVoid, 'void instruction argument');
      assert(this.counters.instr.seen(v) || instr.name === 'phi',
        `Instruction "${v.name}" doesn't dominate use in "${instr.name}"`);

      return `%i${this.counters.instr.id(v)}`;
    }

    if (v instanceof llvm.Block) {
      const name = v.name === null ? '' : `_${v.name}`;
      return `label %b${this.counters.block.id(v)}${name}`;
    }

    if (typeof v === 'string')
      return v;

    throw new Error(
      `Unexpected argument: "${v}" of instruction: "${instr.name}"`);
  }
}
module.exports = Serializer;
