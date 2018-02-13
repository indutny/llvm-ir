'use strict';

const assert = require('assert');

const types = require('./');

class Array extends types.Type {
  constructor(of, length) {
    assert.strictEqual(length, length | 0, 'Non-integer array length');
    assert(length > 0, 'Non-positive array length');

    super(`[${length} x ${of.type}]`);

    this.of = of;
    this.length = length;
  }
}
module.exports = Array;
