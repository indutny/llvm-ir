'use strict';

const types = require('./');
const llvm = require('../');

const assert = require('assert');

class Pointer extends types.Type {
  constructor(to) {
    super(to.type + '*');

    this.to = to;
  }

  v(value) {
    assert.strictEqual(value, null, 'Only `null` pointer value is possible');
    return new llvm.values.Null(this);
  }
}
module.exports = Pointer;
