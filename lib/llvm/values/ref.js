'use strict';

const llvm = require('../');
const values = require('./');

class Ref extends values.Value {
  constructor(type, id) {
    super(type.ptr());

    this.id = llvm.utils.validate(id, 'Invalid reference name');
  }
}
module.exports = Ref;
