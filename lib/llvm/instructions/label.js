'use strict';

const instructions = require('./');

class Label extends instructions.Instruction {
  constructor(name) {
    super('label');

    // TODO(indutny): validate
    this.name = name;
    this.isVoid = true;
  }
}
module.exports = Label;


