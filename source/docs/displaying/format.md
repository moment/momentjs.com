The most robust display option is `moment.fn.format`. It takes a string of tokens and replaces them with their corresponding values from the Date object.

```javascript
var a = moment([2010, 1, 14, 15, 25, 50, 125]);
a.format("dddd, MMMM Do YYYY, h:mm:ss a"); // "Sunday, February 14th 2010, 3:25:50 pm"
a.format("ddd, hA");                       // "Sun, 3PM"
```

<table class="table table-striped table-bordered">
  <tbody>
    <tr>
      <th>Token</th>
      <th>Output</th>
    </tr>
    <tr>
      <td><b>Month</b></td>
      <td></td>
    </tr>
    <tr>
      <td>M</td>
      <td>1 2 ... 11 12</td>
    </tr>
    <tr>
      <td>Mo</td>
      <td>1st 2nd ... 11th 12th</td>
    </tr>
    <tr>
      <td>MM</td>
      <td>01 02 ... 11 12</td>
    </tr>
    <tr>
      <td>MMM</td>
      <td>Jan Feb ... Nov Dec</td>
    </tr>
    <tr>
      <td>MMMM</td>
      <td>January February ... November December</td>
    </tr>
    <tr>
      <td><b>Day of Month</b></td>
      <td></td>
    </tr>
    <tr>
      <td>D</td>
      <td>1 2 ... 30 30</td>
    </tr>
    <tr>
      <td>Do</td>
      <td>1st 2nd ... 30th 31st</td>
    </tr>
    <tr>
      <td>DD</td>
      <td>01 02 ... 30 31</td>
    </tr>
    <tr>
      <td><b>Day of Year</b></td>
      <td></td>
    </tr>
    <tr>
      <td>DDD</td>
      <td>1 2 ... 364 365</td>
    </tr>
    <tr>
      <td>DDDo</td>
      <td>1st 2nd ... 364th 365th</td>
    </tr>
    <tr>
      <td>DDDD</td>
      <td>001 002 ... 364 365</td>
    </tr>
    <tr>
      <td><b>Day of Week</b></td>
      <td></td>
    </tr>
    <tr>
      <td>d</td>
      <td>0 1 ... 5 6</td>
    </tr>
    <tr>
      <td>do</td>
      <td>0th 1st ... 5th 6th</td>
    </tr>
    <tr>
      <td>ddd</td>
      <td>Sun Mon ... Fri Sat</td>
    </tr>
    <tr>
      <td>dddd</td>
      <td>Sunday Monday ... Friday Saturday</td>
    </tr>
    <tr>
      <td><b>Week of Year</b></td>
      <td></td>
    </tr>
    <tr>
      <td>w</td>
      <td>1 2 ... 52 53</td>
    </tr>
    <tr>
      <td>wo</td>
      <td>1st 2nd ... 52nd 53rd</td>
    </tr>
    <tr>
      <td>ww</td>
      <td>01 02 ... 52 53</td>
    </tr>
    <tr>
      <td><b>Year</b></td>
      <td></td>
    </tr>
    <tr>
      <td>YY</td>
      <td>70 71 ... 29 30</td>
    </tr>
    <tr>
      <td>YYYY</td>
      <td>1970 1971 ... 2029 2030</td>
    </tr>
    <tr>
      <td><b>AM/PM</b></td>
      <td></td>
    </tr>
    <tr>
      <td>A</td>
      <td>AM PM</td>
    </tr>
    <tr>
      <td>a</td>
      <td>am pm</td>
    </tr>
    <tr>
      <td><b>Hour</b></td>
      <td></td>
    </tr>
    <tr>
      <td>H</td>
      <td>0 1 ... 22 23</td>
    </tr>
    <tr>
      <td>HH</td>
      <td>00 01 ... 22 23</td>
    </tr>
    <tr>
      <td>h</td>
      <td>1 2 ... 11 12</td>
    </tr>
    <tr>
      <td>hh</td>
      <td>01 02 ... 11 12</td>
    </tr>
    <tr>
      <td><b>Minute</b></td>
      <td></td>
    </tr>
    <tr>
      <td>m</td>
      <td>0 1 ... 58 59</td>
    </tr>
    <tr>
      <td>mm</td>
      <td>00 01 ... 58 59</td>
    </tr>
    <tr>
      <td><b>Second</b></td>
      <td></td>
    </tr>
    <tr>
      <td>s</td>
      <td>0 1 ... 58 59</td>
    </tr>
    <tr>
      <td>ss</td>
      <td>00 01 ... 58 59</td>
    </tr>
    <tr>
      <td><b>Timezone</b></td>
      <td></td>
    </tr>
    <tr>
      <td>z or zz</td>
      <td>
        EST CST ... MST PST

        **Note:** as of *1.6.0*, the z/zz format tokens have been deprecated. [Read more about it here.](https://github.com/timrwood/moment/issues/162)
      </td>
    </tr>
    <tr>
      <td>Z</td>
      <td>-07:00 -06:00 ... +06:00 +07:00</td>
    </tr>
    <tr>
      <td>ZZ</td>
      <td>
        -0700 -0600 ... +0600 +0700

        Z and ZZ are available in version *1.2.0*
      </td>
    </tr>
    <tr>
      <td><b>Localized&nbsp;date&nbsp;format</b></td>
      <td></td>
    </tr>
    <tr>
      <td>LT</td>
      <td>
        8:30 PM

        LT is available in version *1.3.0*
      </td>
    </tr>
    <tr>
      <td>L</td>
      <td>07/10/1986</td>
    </tr>
    <tr>
      <td>LL</td>
      <td>July 10 1986</td>
    </tr>
    <tr>
      <td>LLL</td>
      <td>July 10 1986 8:30 PM</td>
    </tr>
    <tr>
      <td>LLLL</td>
      <td>
        Saturday, July 10 1986 8:30 PM

        L, LL, LLL, LLLL are available in version *1.3.0*
      </td>
    </tr>
  </tbody>
</table>

To escape characters in format strings, you can use a backslash before any character. NOTE: if you are using a string literal, you will need to escape the backslash, hence the double backslash below.

```javascript
moment().format('\\L'); // outputs 'L'
```

To escape multiple characters, you can wrap the characters in square brackets.

```javascript
moment().format('[today] DDDD'); // 'today Sunday'
```

**Note:** While these date formats are very similar to LDML date formats, there are a few minor differences regarding day of month, day of year, and day of week.

For a breakdown of a few different date formatting tokens, see [this chart of date formatting tokens.](https://docs.google.com/spreadsheet/ccc?key=0AtgZluze7WMJdDBOLUZfSFIzenIwOHNjaWZoeGFqbWc&amp;hl=en_US#gid=0)

To compare moment.js date formatting speeds against other libraries, check out [http://jsperf.com/date-formatting](http://jsperf.com/date-formatting) .

Baron Schwartz wrote a pretty cool date formatter that caches formatting functions to avoid expensive regex or string splitting. It's so much faster than any of the other libraries, that it's best to compare it on its own, rather than pollute the "best of the uncompiled" formatting libs.

Here's the [moment.js vs xaprb](http://jsperf.com/momentjs-vs-xaprb) performance tests, and here is the[article describing his methods.](http://www.xaprb.com/blog/2005/12/12/javascript-closures-for-runtime-efficiency/)

**Note:** Version *1.7.0* changed the formatter to use cached functions similar to Baron Schwartz' formatter.

Here are [the performance improvements](http://jsperf.com/momentjs-cached-format-functions) and [the comparison against other libraries](http://jsperf.com/date-formatting/8).

If you are more comfortable working with strftime instead of LDML-like parsing tokens, you can use Ben Oakes' plugin `moment-strftime` .

It is available on npm.

```
npm install moment-strftime
```

The repository is located at [benjaminoakes/moment-strftime](https://github.com/benjaminoakes/moment-strftime)

**Note:** As of version *1.5.0*, calling this function without any parameters will output ISO-8601.

It will use `moment.defaultFormat` to format the moment, which by default is `YYYY-MM-DDTHH:mm:ssZ`.
