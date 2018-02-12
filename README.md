# llvm-ir
[![Build Status](https://secure.travis-ci.org/indutny/llvm-ir.svg)](http://travis-ci.org/indutny/llvm-ir)
[![NPM version](https://badge.fury.io/js/llvm-ir.svg)](https://badge.fury.io/js/llvm-ir)

An API for generating LLVM IR.

## Usage

```js
const ir = require('llvm-ir').create();

const i32 = ir.i(32);

const sig = ir.signature(i32, [ i32 ]);

const fn = ir.fn(sig, 'fn_name', [ 'arg0' ]);
fn.body.terminate('ret', [ i32, fn.arg('arg0') ]);

console.log(ir.build());
// define i32 @fn_name(i32 %arg0) {
//   ret i32 %arg0
// }
```

#### LICENSE

This software is licensed under the MIT License.

Copyright Fedor Indutny, 2018.

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
USE OR OTHER DEALINGS IN THE SOFTWARE.
