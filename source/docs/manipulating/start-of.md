Mutates the original moment by setting it to the start of a unit of time.

```javascript
moment().startOf('year');   // set to January 1st, 12:00 am this year
moment().startOf('month');  // set to the first of this month, 12:00 am
moment().startOf('week');   // set to the first day of this week, 12:00 am
moment().startOf('day');    // set to 12:00 am today
moment().startOf('hour');   // set to now, but with 0 mins, 0 secs, and 0 ms
moment().startOf('minute'); // set to now, but with 0 seconds and 0 milliseconds
moment().startOf('second'); // same as moment().milliseconds(0);
```

These shortcuts are essentially the same as the following.

```javascript
moment().startOf('year');
moment().month(0).date(1).hours(0).minutes(0).seconds(0).milliseconds(0);
```

```javascript
moment().startOf('hour');
moment().minutes(0).seconds(0).milliseconds(0)
```

As of version **2.0.0**, `moment#startOf('day')` replaced `moment#sod`.

**Note:** `moment#startOf('week')` was added in version **2.0.0**.

As of version **2.1.0**, `moment#startOf('week')` uses the locale aware week start day.
