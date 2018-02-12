'use strict';

const assert = require('assert');

const llvm = require('./');

class Block {
  constructor(parent) {
    this.parent = parent || null;
    this.children = null;

    this.instructions = [];
    this.terminator = null;
  }

  push(instr) {
    if (Array.isArray(instr))
      return instr.forEach(instr => this.push(instr));

    assert.strictEqual(this.terminator, null,
      'Can\'t push into terminated Block');
    assert(instr instanceof llvm.instructions.Instruction,
      'Argument must be an Instruction instance');

    this.instructions.push(instr);
  }

  terminate(name, ...args) {
    assert.strictEqual(this.terminator, null,
      'Can\'t terminate terminated Block');

    this.children = [];
    this.terminator = new llvm.instructions.Terminator(name, args);
  }

  jump(name, ...args) {
    assert.strictEqual(this.terminator, null,
      'Can\'t jump from terminated Block');

    const target = new Block(this);
    this.children = [ target ];

    this.terminator = new llvm.instructions.Jump(name, args, target);
    this.terminator.target = target;

    return target;
  }

  branch(name, ...args) {
    assert.strictEqual(this.terminator, null,
      'Can\'t branch from terminated Block');

    const left = new Block(this);
    const right = new Block(this);
    this.children = [ left, right ];

    this.terminator = new llvm.instructions.Branch(name, args, left, right);
    this.terminator.left = left;
    this.terminator.right = right;

    return { left, right };
  }
}
module.exports = Block;
