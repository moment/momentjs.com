---
title: Is Between
version: 2.9.0
signature: |
  //From 2.13.0 onward
  moment().isBetween(moment-like, moment-like);
  moment().isBetween(moment-like, moment-like, String);
  moment().isBetween(moment-like, moment-like, String, String);
  // where moment-like is Moment|String|Number|Date|Array
  
  //2.9.0 to 2.12.0
  moment().isBetween(moment-like, moment-like);
  moment().isBetween(moment-like, moment-like, String);
  // where moment-like is Moment|String|Number|Date|Array
---


Check if a moment is between two other moments, optionally looking at unit
scale (minutes, hours, days, etc).  The match is exclusive. The first two arguments will be parsed as moments, if not already so.

```javascript
moment('2010-10-20').isBetween('2010-10-19', '2010-10-25'); // true
```

If you want to limit the granularity to a unit other than milliseconds, pass the units as the third parameter.

```javascript
moment('2010-10-20').isBetween('2010-01-01', '2012-01-01', 'year'); // false
moment('2010-10-20').isBetween('2009-12-31', '2012-01-01', 'year'); // true
```

Like `moment#isSame`, `moment#isBefore`, `moment#isAfter` any of the units of
time that are supported for `moment#startOf` are supported for
`moment#isBetween`. Year, month, week, day, hour, minute, and second.

Version **2.13.0** introduces inclusivity. A ``[`` indicates inclusion of a value. A ``(`` indicates exclusion.
If the inclusivity parameter is used, both indicators must be passed.

```javascript
moment('2016-10-30').isBetween('2016-10-30', '2016-12-30', null, '()'); //false
moment('2016-10-30').isBetween('2016-10-30', '2016-12-30', null, '[)'); //true
moment('2016-10-30').isBetween('2016-01-01', '2016-10-30', null, '()'); //false
moment('2016-10-30').isBetween('2016-01-01', '2016-10-30', null, '(]'); //true
moment('2016-10-30').isBetween('2016-10-30', '2016-10-30', null, '[]'); //true
```

Note that in the event that the ``from`` and ``to`` parameters are the same, 
but the inclusivity parameters are different, false will preside.
```javascript
moment('2016-10-30').isBetween('2016-10-30', '2016-10-30', null, '(]'); //false
```

If the inclusivity parameter is not specified, Moment will default to ``()``.
