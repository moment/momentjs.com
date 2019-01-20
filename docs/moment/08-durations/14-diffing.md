---
title: Using Duration with Diff
version: 2.1.0
signature: |
  var duration = moment.duration(x.diff(y))
---

You can also use duration with `moment#diff` to get the duration between two moments. To do so, simply pass the `moment#diff` method into `moment#duration` as follows:

```javascript
  var x = new moment()
  var y = new moment()
  var duration = moment.duration(x.diff(y))
  // returns duration object with the duration between x and y
```

See [here](#/displaying/difference/) for more information about `moment#diff`.
