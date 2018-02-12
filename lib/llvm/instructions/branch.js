'use strict';

const instructions = require('./');

class Branch extends instructions.Terminator {
  constructor(name, args) {
    super(name, args);

    this.left = null;
    this.right = null;
  }

  getArgs() {
    return super.getArgs().concat(this.left, this.right);
  }
}
module.exports = Branch;
