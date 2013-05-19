To create a duration, call `moment.duration()` with the length of time in milliseconds.

```javascript
moment.duration(100); // 100 milliseconds
```

If you want to create a moment with a unit of measurement other than seconds, you can pass the unit of measurement as well.

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
