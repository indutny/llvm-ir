'use strict';

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
