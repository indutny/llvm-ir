'use strict';

const instructions = require('./');

class Terminator extends instructions.Instruction {
  constructor(name, args) {
    super(name, args);

    this.void();
  }
}
module.exports = Terminator;
