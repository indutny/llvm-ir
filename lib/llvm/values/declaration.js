'use strict';

const values = require('./');

class Declaration extends values.Value {
  constructor(signature, name) {
    super(signature);

    // TODO(indutny): validate name
    this.name = name;
    this.attributes = null;
  }

  ref() {
    return new values.Ref(this.type, this.name);
  }
}
module.exports = Declaration;
