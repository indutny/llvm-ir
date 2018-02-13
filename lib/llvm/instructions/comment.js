'use strict';

const instructions = require('./');

class Comment extends instructions.Instruction {
  constructor(string) {
    super('comment');

    // TODO(indutny): validate
    this.string = string;
    this.isVoid = true;
  }
}
module.exports = Comment;


