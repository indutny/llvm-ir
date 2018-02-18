'use strict';

const llvm = require('../');
const values = require('./');

class Declaration extends values.Value {
  constructor(signature, name) {
    super(signature);

    this.name = llvm.utils.validate(name, 'Invalid function declaration name');
    this.visibility = null;
    this.attributes = null;
  }

  ref() {
    return new values.Ref(this.type, this.name);
  }
}
module.exports = Declaration;
