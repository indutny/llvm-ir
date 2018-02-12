'use strict';

const instructions = require('./');

class Jump extends instructions.Terminator {
  constructor(name, args) {
    super(name, args);

    this.target = null;
  }

  getArgs() {
    return super.getArgs().concat(this.target);
  }
}
module.exports = Jump;
