---
title: Immutable Moment.js
signature: |
  npm install moment-immutable --save
---


This plugin makes moment.js immutable by auto cloning the `Moment` during all mutable actions.

Made by [Smartin85](https://github.com/smartin85).

```js
// Without moment-immutable
var january1st = moment("2017-01-01");
var february1st = january1st.add(1, "month");

january1st.format();    // "2017-02-01T00:00:00+01:00" - oh no
february1st.format();   // "2017-02-01T00:00:00+01:00"

// With moment-immutable
var january1st = moment("2017-01-01");
var february1st = january1st.add(1, "month");

january1st.format();    // "2017-01-01T00:00:00+01:00" - yeah
february1st.format();   // "2017-02-01T00:00:00+01:00"
```

The repository is located at [github.com/smartin85/moment-immutable](https://github.com/smartin85/moment-immutable).
