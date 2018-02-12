'use strict';

const assert = require('assert');

const types = require('./');

class Signature extends types.Type {
  constructor(ret, args) {
    assert(ret instanceof types.Type, 'return value must be a Type instance');

    args.forEach((arg, index) => {
      if (arg instanceof types.Void)
        throw new Error('`void` can\'t be a parameter');

      assert(arg instanceof types.Type,
        `Argument ${index} must be a Type instance`);
    });

    super(ret.type + ' (' + args.map(one => one.type).join(', ') + ')');

    this.ret = ret;
    this.args = args;
  }

  v() {
    throw new Error('Use `ir.fn(signature, ...)`');
  }
}
module.exports = Signature;
