'use strict';

const values = require('./');
const llvm = require('../');

const i8 = new llvm.types.Int(8);

class Data extends values.Value {
  constructor(id, value) {
    super(i8.array(value.length));

    this.id = llvm.utils.validate(id, 'Invalid id of data');
    this.value = value;
  }

  ref() {
    return new values.Ref(this.type, this.id);
  }
}
module.exports = Data;
