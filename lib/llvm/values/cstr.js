'use strict';

const values = require('./');
const llvm = require('../');

const i8 = new llvm.types.Int(8);

class CStr extends values.Value {
  constructor(value) {
    super(i8.array(value.length));

    this.value = value;
  }
}
module.exports = CStr;
