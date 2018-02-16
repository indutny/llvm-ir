'use strict';

const assert = require('assert');

const llvm = require('../');
const types = require('./');

class Type {
  constructor(type) {
    this.type = type;
  }

  ptr() {
    return new types.Pointer(this);
  }

  array(length) {
    return new types.Array(this, length);
  }

  ref(name) {
    assert.equal(typeof name, 'string',
      '`ref()` first argument must be a string value');
    return new llvm.values.Ref(this, name);
  }

  v() {
    throw new Error('No instances of type can be created');
  }
}
module.exports = Type;
