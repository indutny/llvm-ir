'use strict';

const assert = require('assert');

const values = require('./');
const llvm = require('../');

class Function extends values.Value {
  constructor(type, name, params) {
    super(type);

    assert.strictEqual(params.length, type.args.length);

    // TODO(indutny): validate name
    this.name = name;
    this.params = params;

    this.body = new llvm.Block();
    this.visibility = null;
    this.attributes = null;
  }

  arg(name) {
    for (let i = 0; i < this.params.length; i++) {
      const param = this.params[i];

      if (param)
        return new values.Arg(this.type.args[i], name);
    }

    throw new Error(`Argument ${name} not found`);
  }
}
module.exports = Function;
