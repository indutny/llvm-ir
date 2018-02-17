'use strict';

const llvm = require('../');
const values = require('./');

class Arg extends values.Value {
  constructor(type, name) {
    super(type);

    this.name = llvm.utils.validate(name, 'Invalid argument name');
  }
}
module.exports = Arg;
