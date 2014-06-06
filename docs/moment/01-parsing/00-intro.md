---
title: Parse
---


Instead of modifying the native `Date.prototype`, Moment.js creates a wrapper for the `Date` object. To get this wrapper object, simply call `moment()` with one of the supported input types.

The `Moment` prototype is exposed through `moment.fn`. If you want to add your own functions, that is where you would put them.

For ease of reference, any method on the `Moment.prototype` will be referenced in the docs as `moment#method`. So `Moment.prototype.format` == `moment.fn.format` == `moment#format`.

