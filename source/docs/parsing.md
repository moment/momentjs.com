Instead of modifying the native `Date.prototype`, Moment.js creates a wrapper for the `Date` object.

Note: The Moment.js prototype is exposed through `moment.fn`. If you want to add your own functions, that is where you would put them.

To get this wrapper object, simply call `moment()` with one of the supported input types.