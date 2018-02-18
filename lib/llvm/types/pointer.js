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

    if (value instanceof llvm.instructions.Instruction) {
      assert(!value.isVoid,
        'Can\'t use void instruction as a pointer value');
      return value;
    }

    assert.strictEqual(value, null,
      'Only `null`, `ref`, and `instruction` are valid pointer values');
    return new llvm.values.Null(this);
  }
}
module.exports = Pointer;
