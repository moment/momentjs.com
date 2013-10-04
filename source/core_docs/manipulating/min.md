Retrieves the lesser of two moment values.

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

**Note:** `moment#min` doesn't actually mutate the moment; it simly returns the input moment if the input moment is earlier, and `this` otherwise.
