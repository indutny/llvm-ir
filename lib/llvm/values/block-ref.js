'use strict';

const llvm = require('../');
const values = require('./');

class BlockRef extends values.Value {
  constructor(block) {
    super(new llvm.types.Void());

    this.block = block;
  }
}
module.exports = BlockRef;
