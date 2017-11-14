---
title: Creating
version: 1.6.0
signature: |
  moment.duration(Number, String);
  moment.duration(Number);
  moment.duration(Object);
  moment.duration(String);
---


To create a duration, call `moment.duration()` with the length of time in milliseconds.

```javascript
moment.duration(100); // 100 milliseconds
```

If you want to create a moment with a unit of measurement other than milliseconds, you can pass the unit of measurement as well.

```javascript
moment.duration(2, 'seconds');
moment.duration(2, 'minutes');
moment.duration(2, 'hours');
moment.duration(2, 'days');
moment.duration(2, 'weeks');
moment.duration(2, 'months');
moment.duration(2, 'years');
```

The same shorthand for `moment#add` and `moment#subtract` works here as well.

<table class="table table-striped table-bordered">
  <tbody>
    <tr>
      <th>Key</th>
      <th>Shorthand</th>
    </tr>
    <tr>
      <td>years</td>
      <td>y</td>
    </tr>
    <tr>
      <td>months</td>
      <td>M</td>
    </tr>
    <tr>
      <td>weeks</td>
      <td>w</td>
    </tr>
    <tr>
      <td>days</td>
      <td>d</td>
    </tr>
    <tr>
      <td>hours</td>
      <td>h</td>
    </tr>
    <tr>
      <td>minutes</td>
      <td>m</td>
    </tr>
    <tr>
      <td>seconds</td>
      <td>s</td>
    </tr>
    <tr>
      <td>milliseconds</td>
      <td>ms</td>
    </tr>
  </tbody>
</table>

Much like `moment#add`, you can pass an object of values if you need multiple different units of measurement.

```javascript
moment.duration({
    seconds: 2,
    minutes: 2,
    hours: 2,
    days: 2,
    weeks: 2,
    months: 2,
    years: 2
});
```

As of **2.1.0**, moment supports parsing ASP.NET style time spans. The following formats are supported.

The format is an hour, minute, second string separated by colons like `23:59:59`. The number of days can be prefixed with a dot separator like so `7.23:59:59`. Partial seconds are supported as well `23:59:59.999`.

```javascript
moment.duration('23:59:59');
moment.duration('23:59:59.999');
moment.duration('7.23:59:59.999');
moment.duration('23:59'); // added in 2.3.0
```

As of **2.3.0**, moment also supports parsing [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601#Time_intervals) durations.

```javascript
moment.duration('P1Y2M3DT4H5M6S');
moment.duration('P1M');
```

As of **2.11.0**, duration format strings with a space between days and rest
is supported.

```javascript
moment.duration('7 23:59:59.999');
```

As of **2.13.0**, mixed negative and positive signs are supported when parsing durations.

```javascript
moment.duration('PT-6H3M')
```

As of **2.18.0**, invalid durations are supported, similarly to invalid
moments. To create an invalid duration you can pass `NaN` for a value of
a unit.

In upcoming releases expect invalid durations to cover more cases (like
null values for units).

```javascript
moment.duration(NaN);
moment.duration(NaN, 'days');
moment.duration.invalid();
```