'use strict';

const assert = require('assert');

const types = require('./');
const llvm = require('../');

class TyArray extends types.Type {
  constructor(of, length) {
    assert.strictEqual(length, length | 0, 'Non-integer array length');
    assert(length > 0, 'Non-positive array length');

    super(`[${length} x ${of.type}]`);

    this.of = of;
    this.length = length;
  }

  v(elems) {
    assert(Array.isArray(elems),
      '`array.v()` argument must be an array');
    assert.strictEqual(elems.length, this.length,
      'Invalid array value length');

    return new llvm.values.Array(this, elems);
  }
}
module.exports = TyArray;
