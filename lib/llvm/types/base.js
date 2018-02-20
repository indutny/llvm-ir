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

  isInt() { return this instanceof types.Int; }
  isArray() { return this instanceof types.Array; }
  isPointer() { return this instanceof types.Pointer; }
  isSignature() { return this instanceof types.Signature; }
  isStruct() { return this instanceof types.Struct; }
  isVoid() { return this instanceof types.Void; }
}
module.exports = Type;
