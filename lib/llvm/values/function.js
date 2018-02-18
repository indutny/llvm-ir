'use strict';

const assert = require('assert');

const values = require('./');
const llvm = require('../');

class Function extends values.Value {
  constructor(type, name, params) {
    super(type);

    assert.strictEqual(params.length, type.args.length,
      'Invalid argument count');

    this.name = llvm.utils.validate(name, 'Invalid function name');
    this.params = params.map((param) => {
      return llvm.utils.validate(param, 'Invalid argument name');
    });

    this.body = new llvm.Block(null, name);
    this.visibility = null;
    this.cconv = null;
    this.attributes = null;
  }

  arg(name) {
    for (let i = 0; i < this.params.length; i++) {
      const param = this.params[i];

      if (param === name)
        return new values.Arg(this.type.args[i], name);
    }

    throw new Error(`Argument ${name} not found`);
  }

  ref() {
    return new values.Ref(this.type, this.name);
  }
}
module.exports = Function;
