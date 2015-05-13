---
title: Time from X
version: 1.0.0
signature: |
  moment().from(Moment|String|Number|Date|Array);
  moment().from(Moment|String|Number|Date|Array, Boolean);
---


You may want to display a moment in relation to a time other than now. In that case, you can use `moment#from`.

```javascript
var a = moment([2007, 0, 28]);
var b = moment([2007, 0, 29]);
a.from(b) // "a day ago"
```

The first parameter is anything you can pass to `moment()` or an actual `Moment`.

```javascript
var a = moment([2007, 0, 28]);
var b = moment([2007, 0, 29]);
a.from(b);                     // "a day ago"
a.from([2007, 0, 29]);         // "a day ago"
a.from(new Date(2007, 0, 29)); // "a day ago"
a.from("2007-01-29");          // "a day ago"
```

Like `moment#fromNow`, passing `true` as the second parameter returns value without the suffix. This is useful wherever you need to have a human readable length of time.

```javascript
var start = moment([2007, 0, 5]);
var end   = moment([2007, 0, 10]);
end.from(start);       // "in 5 days"
end.from(start, true); // "5 days"
```

From version **2.10.3**, if any of the endpoints are invalid the result is the
localized Invalid date string.
