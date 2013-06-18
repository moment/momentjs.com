Set the minimum value for a moment.

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
