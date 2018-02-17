'use strict';

const instructions = require('./');

class Comment extends instructions.Instruction {
  constructor(string) {
    super('comment');

    if (/[\r\n]/.test(string))
      throw new Error('Comment can\'t have newline');

    this.string = string;
    this.isVoid = true;
  }
}
module.exports = Comment;


