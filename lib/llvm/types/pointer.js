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
    if (value instanceof llvm.values.Ref) {
      if (value.type.type === this.type)
        return value;

      throw new Error(`Pointer type mismatch, expected: ${this.type}, ` +
        `got: ${value.type.type}`);
    }

    assert.strictEqual(value, null, 'Only `null` pointer value is possible');
    return new llvm.values.Null(this);
  }
}
module.exports = Pointer;
