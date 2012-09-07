If you know the format of an input string, you can use that to parse a moment.


```javascript
var day = moment(&quot;12-25-1995&quot;, &quot;MM-DD-YYYY&quot;);
```


The format parsing tokens are similar to the tokens for `moment.fn.format`.

The parser ignores non-alphanumeric characters, so both `moment("12-25-1995", "MM-DD-YYYY")`and `moment("12\\25\\1995", "MM-DD-YYYY")`will return the same thing.

<table class="table table-striped table-bordered">
  <tbody>
    <tr>
      <th>Input</th>
      <th>Output</th>
    </tr>
    <tr>
      <td>M or MM</td>
      <td>Month Number (1 - 12)</td>
    </tr>
    <tr>
      <td>MMM or MMMM</td>
      <td>Month Name (In currently language set by `moment.lang()`)</td>
    </tr>
    <tr>
      <td>D or DD</td>
      <td>Day of month</td>
    </tr>
    <tr>
      <td>DDD or DDDD</td>
      <td>Day of year</td>
    </tr>
    <tr>
      <td>d, dd, ddd, or dddd</td>
      <td>Day of week (NOTE: these tokens are not used to create the date, as there are 4-5 weeks in a month, and it would be impossible to get the date based off the day of the week)</td>
    </tr>
    <tr>
      <td>YY</td>
      <td>2 digit year (if greater than 70, will return 1900's, else 2000's)</td>
    </tr>
    <tr>
      <td>YYYY</td>
      <td>4 digit year</td>
    </tr>
    <tr>
      <td>a or A</td>
      <td>AM/PM</td>
    </tr>
    <tr>
      <td>H, HH</td>
      <td>24 hour time</td>
    </tr>
    <tr>
      <td>h, or hh</td>
      <td>12 hour time (use in conjunction with a or A)</td>
    </tr>
    <tr>
      <td>m or mm</td>
      <td>Minutes</td>
    </tr>
    <tr>
      <td>s or ss</td>
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
      <td>Z or ZZ</td>
      <td>Timezone offset as `+0700` or `+07:30`

Available in version <span class="label">1.2.0</span></td>
    </tr>
  </tbody>
</table>

Unless you specify a timezone offset, parsing a string will create a date in the current timezone.

A workaround to parse a string in UTC is to append `"+0000"` to the end of your input string, and add `"ZZ"` to the end of your format string.

<span class="label label-warning">Warning</span> Parsing a string with a format is by far the slowest method of creating a date. 
  If you have the ability to change the input, it is much faster (~15x) to 
  use milliseconds since the Unix Epoch or Unix timestamps.