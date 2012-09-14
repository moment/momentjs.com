Mutates the original moment by setting it to the start of a unit of time.

```javascript
moment().startOf('year'); // set to Jan 1 12:00:00.000 pm this year
moment().startOf('month'); // set to the first of this month, 12:00:00.000 pm
moment().startOf('day'); // set to 12:00:00.000 pm today
moment().startOf('hour'); // set to now, but with 0 mins, 0 secs, and 0 ms
moment().startOf('minute'); // set to now, but with 0 seconds and 0 milliseconds
moment().startOf('second'); // same as moment().milliseconds(0);
```

These shortcuts are essentially the same as the following.

```javascript
// these both set to the start of the year
moment().startOf('year');
moment().month(0).date(1).hours(0).minutes(0).seconds(0).milliseconds(0);
```

```javascript
// these both set to the start of the hour
moment().startOf('hour');
moment().minutes(0).seconds(0).milliseconds(0)
```

**Note:** As of version *2.0.0*, `moment.fn.startOf('day')` will replace `moment.fn.sod` and `moment.fn.endOf('day')` will replace `moment.fn.eod`.
