---
title: Parse
---


Instead of modifying the native `Date.prototype`, Moment.js creates a wrapper for the `Date` object. To get this wrapper object, simply call `moment()` with one of the supported input types.

The `Moment` prototype is exposed through `moment.fn`. If you want to add your own functions, that is where you would put them.

For ease of reference, any method on the `Moment.prototype` will be referenced in the docs as `moment#method`. So `Moment.prototype.format` == `moment.fn.format` == `moment#format`.

**Please read:**
* `moment(...)` is local mode. Ambiguous input (without offset) is assumed to be local time. Unambiguous input (with offset) is adjusted to local time.
* `moment.utc(...)` is utc mode. Ambiguous input is assumed to be UTC. Unambiguous input is adjusted to UTC.
* `moment.parseZone()` keep the input zone passed in. Ambiguous input is assumed to be UTC.
* `moment.tz(...)` with the moment-timezone plugin can parse input in a specific time zone.

Keep in mind that a time zone and a time zone offset are two different things. An offset of -08:00 doesn't necessarily mean you are in the US Pacific time zone.

[See the Parsing Guide for additional information](https://momentjs.com/guides/#/parsing/).
