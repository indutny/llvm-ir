'use strict';

const assert = require('assert');

const types = require('./');
const llvm = require('../');

class Int extends types.Type {
  constructor(width) {
    assert.strictEqual(width | 0, width, 'Invalid integer width');
    assert.ok(width > 0, 'Integer width must be greater than zero');

    super('i' + width);

    this.width = width;
  }

  v(value) {
    return new llvm.values.Int(this, value);
  }
}
module.exports = Int;
