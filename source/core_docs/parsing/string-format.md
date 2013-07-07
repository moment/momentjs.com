If you know the format of an input string, you can use that to parse a moment.

```javascript
moment("12-25-1995", "MM-DD-YYYY");
```

The parser ignores non-alphanumeric characters, so both of the following will return the same thing.

```javascript
moment("12-25-1995", "MM-DD-YYYY");
moment("12\25\1995", "MM-DD-YYYY");
```

The parsing tokens are similar to the formatting tokens used in `moment#format`.

<table class="table table-striped table-bordered">
  <tbody>
    <tr>
      <th>Input</th>
      <th>Output</th>
    </tr>
    <tr>
      <td>M, MM</td>
      <td>Month Number (1 - 12)</td>
    </tr>
    <tr>
      <td>MMM, MMMM</td>
      <td>Month Name (In currently language set by `moment.lang()`)</td>
    </tr>
    <tr>
      <td>D, DD</td>
      <td>Day of month</td>
    </tr>
    <tr>
      <td>DDD, DDDD</td>
      <td>Day of year</td>
    </tr>
    <tr>
      <td>d, dd, ddd, dddd</td>
      <td>Day of week (NOTE: the input for these tokens is ignored, as there are 4-5 weeks in a month, and it would be impossible to get the day of the month based off the day of the week)</td>
    </tr>
    <tr>
      <td>YY</td>
      <td>2 digit year (if greater than 68 will return 1900's, otherwise 2000's)</td>
    </tr>
    <tr>
      <td>YYYY</td>
      <td>4 digit year</td>
    </tr>
    <tr>
      <td>a, A</td>
      <td>AM/PM</td>
    </tr>
    <tr>
      <td>H, HH</td>
      <td>24 hour time</td>
    </tr>
    <tr>
      <td>h, hh</td>
      <td>12 hour time (use in conjunction with a or A)</td>
    </tr>
    <tr>
      <td>m, mm</td>
      <td>Minutes</td>
    </tr>
    <tr>
      <td>s, ss</td>
      <td>Seconds</td>
    </tr>
    <tr>
      <td>S</td>
      <td>Deciseconds (1/10th of a second)</td>
    </tr>
    <tr>
      <td>SS</td>
      <td>Centiseconds (1/100th of a second)</td>
    </tr>
    <tr>
      <td>SSS</td>
      <td>Milliseconds (1/1000th of a second)</td>
    </tr>
    <tr>
      <td>Z, ZZ</td>
      <td>
        Timezone offset as `+07:00` or `+0700`
      </td>
    </tr>
    <tr>
      <td>X</td>
      <td>
        Unix timestamp
      </td>
    </tr>
  </tbody>
</table>

`Z ZZ` were added in **1.2.0**. `S SS SSS` were added in **1.6.0**. `X` was added in `2.0.0`.

Unless you specify a timezone offset, parsing a string will create a date in the current timezone.

```javascript
moment("2010-10-20 4:30", "YYYY-MM-DD HH:mm"); // parsed as 4:30 local time
moment("2010-10-20 4:30 +0000", "YYYY-MM-DD HH:mm Z"); // parsed as 4:30 GMT
```

If the moment that results from the parsed input does not exist, `moment#isValid` will return false.

```javascript
moment("2010 13", "YYYY MM").isValid(); // false (not a real month)
moment("2010 11 31", "YYYY MM DD").isValid(); // false (not a real day)
moment("2010 2 29", "YYYY MM DD").isValid(); // false (not a leap year)
moment("2010 notamonth 29", "YYYY MMM DD").isValid(); // false (not a real month name)
```

As of version **2.0.0**, a language key can be passed as the third parameter to `moment()` and `moment.utc()`.

```javascript
moment('2012 juillet', 'YYYY MMM', 'fr');
moment('2012 July', 'YYYY MMM', 'en');
```
