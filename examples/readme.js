'use strict';

const ir = require('../').create();

const i32 = ir.i(32);

const sig = ir.signature(i32, [ i32 ]);

const fn = ir.fn(sig, 'fn_name', [ 'arg0' ]);
fn.body.terminate('ret', [ i32, fn.arg('arg0') ]);

console.log(ir.build());
