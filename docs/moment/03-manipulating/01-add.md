---
title: Add
version: 1.0.0
signature: |
  moment().add(Number, String);
  moment().add(Duration);
  moment().add(Object);
---


Mutates the original moment by adding time.

This is a pretty robust function for adding time to an existing moment. To add time, pass the key of what time you want to add, and the amount you want to add.

```javascript
moment().add(7, 'days');
```

There are some shorthand keys as well if you're into that whole brevity thing.

```javascript
moment().add(7, 'd');
```

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
      <td>quarters</td>
      <td>Q</td>
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

If you want to add multiple different keys at the same time, you can pass them in as an object literal.

```javascript
moment().add(7, 'days').add(1, 'months'); // with chaining
moment().add({days:7,months:1}); // with object literal
```

There are no upper limits for the amounts, so you can overload any of the parameters.

```javascript
moment().add(1000000, 'milliseconds'); // a million milliseconds
moment().add(360, 'days'); // 360 days
```

#### Special considerations for months and years

If the day of the month on the original date is greater than the number of days in the final month,
the day of the month will change to the last day in the final month.

```javascript
moment([2010, 0, 31]);                  // January 31
moment([2010, 0, 31]).add(1, 'months'); // February 28
```

There are also special considerations to keep in mind when adding time that crosses over daylight saving time.
If you are adding years, months, weeks, or days, the original hour will always match the added hour.

```javascript
var m = moment(new Date(2011, 2, 12, 5, 0, 0)); // the day before DST in the US
m.hours(); // 5
m.add(1, 'days').hours(); // 5
```

If you are adding hours, minutes, seconds, or milliseconds, the assumption is that you want precision to the hour, and will result in a different hour.

```javascript
var m = moment(new Date(2011, 2, 12, 5, 0, 0)); // the day before DST in the US
m.hours(); // 5
m.add(24, 'hours').hours(); // 6 (but you may have to set the timezone first)
```

Alternatively, you can use [durations](#/durations/) to add to moments.

```javascript
var duration = moment.duration({'days' : 1});
moment([2012, 0, 31]).add(duration); // February 1
```

Before version **2.8.0**, the `moment#add(String, Number)` syntax was also supported. It has been deprecated in favor of `moment#add(Number, String)`.

```javascript
moment().add('seconds', 1); // Deprecated in 2.8.0
moment().add(1, 'seconds');
```

As of **2.12.0** when decimal values are passed for days and months, they are rounded to the nearest integer.
Weeks, quarters, and years are converted to days or months, and then rounded to the nearest integer.

```javascript
moment().add(1.5, 'months') == moment().add(2, 'months')
moment().add(.7, 'years') == moment().add(8, 'months') //.7*12 = 8.4, rounded to 8
```
