'use strict';

const llvm = require('../');

const instructions = require('./');

class Label extends instructions.Instruction {
  constructor(name) {
    super('label');

    this.name = llvm.utils.validate(name, 'Invalid label name');
    this.isVoid = true;
  }
}
module.exports = Label;


