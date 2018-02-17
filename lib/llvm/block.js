'use strict';

const assert = require('assert');

const llvm = require('./');

class Block {
  constructor(parent, name) {
    this.parent = parent || null;
    this.name = name || null;
    this.children = null;

    this.instructions = [];
    this.terminator = null;
  }

  comment(text) {
    this.push(new llvm.instructions.Comment(text));
  }

  push(instr) {
    if (Array.isArray(instr))
      return instr.forEach(instr => this.push(instr));

    assert.strictEqual(this.terminator, null,
      `Can't push into terminated Block: "${this.name}"`);
    assert(instr instanceof llvm.instructions.Instruction,
      'Argument must be an Instruction instance');

    this.instructions.push(instr);
  }

  terminate(name, ...args) {
    assert.strictEqual(this.terminator, null,
      'Can\'t terminate terminated Block');

    const children = [];

    const replaceLabel = (arg) => {
      if (Array.isArray(arg))
        return arg.map(replaceLabel);

      if (arg instanceof llvm.instructions.Label) {
        const block = new Block(this, arg.name);
        children.push(block);
        return block;
      }

      return arg;
    };

    const mappedArgs = args.map(replaceLabel);

    this.children = children;
    this.terminator = new llvm.instructions.Terminator(name, mappedArgs);

    return this.children;
  }

  jump(name, ...args) {
    assert.strictEqual(this.terminator, null,
      'Can\'t jump from terminated Block');

    const target = new Block(this, 'target');
    this.children = [ target ];

    this.terminator = new llvm.instructions.Jump(name, args, target);
    this.terminator.target = target;

    return target;
  }

  branch(name, ...args) {
    assert.strictEqual(this.terminator, null,
      'Can\'t branch from terminated Block');

    const left = new Block(this, 'true');
    const right = new Block(this, 'false');
    this.children = [ left, right ];

    this.terminator = new llvm.instructions.Branch(name, args, left, right);
    this.terminator.left = left;
    this.terminator.right = right;

    return { left, right };
  }

  loop(name, to, ...args) {
    assert.strictEqual(this.terminator, null,
      'Can\'t jump from terminated Block');

    const start = new Block(this, 'loop');
    this.children = [ to ];

    this.terminator = new llvm.instructions.Loop(name, args, start);
    this.terminator.target = to;

    return to;
  }

  ref() {
    return new llvm.values.BlockRef(this);
  }
}
module.exports = Block;
