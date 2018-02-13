'use strict';

const values = require('./');
const llvm = require('../');

const i8 = new llvm.types.Int(8);

class CStr extends values.Value {
  constructor(id, value) {
    super(i8.array(value.length));

    // TODO(indutny): validate id
    this.id = id;
    this.value = value;
  }

  ref() {
    return new values.Ref(this.type, this.id);
  }
}
module.exports = CStr;
