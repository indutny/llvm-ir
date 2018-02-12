'use strict';

class Instruction {
  constructor(name, args) {
    this.name = name;
    this.args = args;

    // Has void return value
    this.isVoid = false;
  }

  void() {
    this.isVoid = true;
    return this;
  }

  getArgs() {
    return this.args;
  }
}
module.exports = Instruction;
