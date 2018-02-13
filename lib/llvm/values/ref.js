'use strict';

const values = require('./');

class Ref extends values.Value {
  constructor(type, id) {
    super(type.ptr());

    // TODO(indutny): validate id
    this.id = id;
  }
}
module.exports = Ref;
