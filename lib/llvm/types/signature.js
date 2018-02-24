'use strict';

const assert = require('assert');

const types = require('./');

class Signature extends types.Type {
  constructor(ret, args) {
    assert(ret instanceof types.Type, 'return value must be a Type instance');

    const attributes = [];
    args = args.map((arg, index) => {
      if (arg instanceof types.Void)
        throw new Error('`void` can\'t be a parameter');

      if (Array.isArray(arg)) {
        assert.strictEqual(arg.length, 2,
          'Invalid argument, must be either a `type` or `[ type, attr ]`');

        const attr = arg[1];
        arg = arg[0];

        assert.strictEqual(typeof attr, 'string', 'Attribute must be a string');
        attributes.push(attr);
      } else {
        attributes.push(null);
      }

      assert(arg instanceof types.Type,
        `Argument ${index} must be a Type instance`);
      return arg;
    });

    super(ret.type + ' (' + args.map(one => one.type).join(', ') + ')');

    this.ret = ret;
    this.args = args;
    this.attributes = attributes;
  }

  isEqual(to) {
    assert(to instanceof Signature,
      '`isEqual()` takes Signature as the first argument');

    if (this.ret.type !== to.ret.type)
      return false;

    if (this.args.length !== to.args.length)
      return false;

    return this.args.every((arg, i) => {
      return arg.type === to.args[i].type;
    });
  }

  v() {
    throw new Error('Use `ir.fn(signature, ...)`');
  }
}
module.exports = Signature;
