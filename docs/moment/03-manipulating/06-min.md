---
title: Minimum
version: 2.1.0-2.7.0
signature: |
  moment().min(Moment|String|Number|Date|Array);
---

**Note:** This function has been **deprecated** in **2.7.0**. Consider [`moment.max`](/docs/#/get-set/max/) instead.

------

Limits the moment to a minimum of another moment value. So `a.min(b)` is the same as `a = moment.max(a, b)` (note that `min` is converted to `max`).

This is the counterpart for `moment#max`.

```javascript
moment().min("2013-04-20T20:00:00+0800");
```

This can be used in conjunction with `moment#max` to clamp a moment to a range.

```javascript
var start  = moment().startOf('week');
var end    = moment().endOf('week');
var actual = moment().min(start).max(end);
```
