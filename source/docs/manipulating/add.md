Mutates the original moment by adding time.

This is a pretty robust function for adding time to an existing date.
To add time, pass the key of what time you want to add, and the amount you want to add.

```javascript
moment().add('days', 7);
```

There are some shorthand keys as well if you're into that whole brevity thing.

```javascript
moment().add('d', 7);
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
moment().add('days', 7).add('months', 1); // with chaining
moment().add({days:7,months:1}); // with object literal
```

There are no upper limits for the amounts, so you can overload any of the parameters.

```javascript
moment().add('milliseconds', 1000000); // a million milliseconds
moment().add('days', 360); // 360 days
```

#### Special considerations for months and years

If the day of the month on the original date is greater than the number of days in the final month,
the day of the month will change to the last day in the final month.

Example:

```javascript
moment([2010, 0, 31]);                  // January 31
moment([2010, 0, 31]).add('months', 1); // February 28
```

There are also special considerations to keep in mind when adding time that crosses over Daylight Savings Time.
If you are adding years, months, weeks, or days, the original hour will always match the added hour.

```javascript
var m = moment(new Date(2011, 2, 12, 5, 0, 0)); // the day before DST in the US
m.hours(); // 5
m.add('days', 1).hours(); // 5
```

If you are adding hours, minutes, seconds, or milliseconds, the assumption is that you want precision to the hour, and will result in a different hour.

```javascript
var m = moment(new Date(2011, 2, 12, 5, 0, 0)); // the day before DST in the US
m.hours(); // 5
m.add('hours', 24).hours(); // 6
```
