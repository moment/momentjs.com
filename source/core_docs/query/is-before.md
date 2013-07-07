Check if a moment is before another moment.

```javascript
moment('2010-10-20').isBefore('2010-10-21'); // true
```

If you want to limit the granularity to a unit other than milliseconds, pass the units as the second parameter.

```javascript
moment('2010-10-20').isBefore('2010-12-31', 'year'); // false
moment('2010-10-20').isBefore('2011-01-01', 'year'); // true
```

Like `moment#isAfter` and `moment#isSame`, any of the units of time that are supported for `moment#startOf` are supported for `moment#isBefore`. Year, month, week, day, hour, minute, and second.

If nothing is passed to `moment#isBefore`, it will default to the current time.

```javascript
moment().isBefore(); // false
```
