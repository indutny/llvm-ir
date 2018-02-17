'use strict';

const assert = require('assert');

class Counter {
  constructor() {
    this.map = new Map();
  }

  id(value) {
    if (this.map.has(value))
      return this.map.get(value);

    const res = this.map.size;
    this.map.set(value, res);
    return res;
  }

  seen(value) {
    return this.map.has(value);
  }
}
exports.Counter = Counter;

exports.validate = (name, reason) => {
  assert(/^[.a-z_][.a-z0-9_]*$/.test(name),
    reason + ': ' + JSON.stringify(name));
  return name;
};
