---
title: Format
version: 1.0.0
signature: |
  moment().format();
  moment().format(String);
---


This is the most robust display option. It takes a string of tokens and replaces them with their corresponding values.

```javascript
moment().format("dddd, MMMM Do YYYY, h:mm:ss a"); // "Sunday, February 14th 2010, 3:25:50 pm"
moment().format("ddd, hA");                       // "Sun, 3PM"
moment('gibberish').format('YYYY MM DD');         // "Invalid date"
```

There are a couple conventions used with the naming of the

<table class="table table-striped table-bordered">
  <tbody>
    <tr>
      <th></th>
      <th>Token</th>
      <th>Output</th>
    </tr>
    <tr>
      <td><b>Month</b></td>
      <td>M</td>
      <td>1 2 ... 11 12</td>
    </tr>
    <tr>
      <td></td>
      <td>Mo</td>
      <td>1st 2nd ... 11th 12th</td>
    </tr>
    <tr>
      <td></td>
      <td>MM</td>
      <td>01 02 ... 11 12</td>
    </tr>
    <tr>
      <td></td>
      <td>MMM</td>
      <td>Jan Feb ... Nov Dec</td>
    </tr>
    <tr>
      <td></td>
      <td>MMMM</td>
      <td>January February ... November December</td>
    </tr>
    <tr>
      <td><b>Quarter</b></td>
      <td>Q</td>
      <td>1 2 3 4</td>
    </tr>
    <tr>
      <td><b>Day of Month</b></td>
      <td>D</td>
      <td>1 2 ... 30 31</td>
    </tr>
    <tr>
      <td></td>
      <td>Do</td>
      <td>1st 2nd ... 30th 31st</td>
    </tr>
    <tr>
      <td></td>
      <td>DD</td>
      <td>01 02 ... 30 31</td>
    </tr>
    <tr>
      <td><b>Day of Year</b></td>
      <td>DDD</td>
      <td>1 2 ... 364 365</td>
    </tr>
    <tr>
      <td></td>
      <td>DDDo</td>
      <td>1st 2nd ... 364th 365th</td>
    </tr>
    <tr>
      <td></td>
      <td>DDDD</td>
      <td>001 002 ... 364 365</td>
    </tr>
    <tr>
      <td><b>Day of Week</b></td>
      <td>d</td>
      <td>0 1 ... 5 6</td>
    </tr>
    <tr>
      <td></td>
      <td>do</td>
      <td>0th 1st ... 5th 6th</td>
    </tr>
    <tr>
      <td></td>
      <td>dd</td>
      <td>Su Mo ... Fr Sa</td>
    </tr>
    <tr>
      <td></td>
      <td>ddd</td>
      <td>Sun Mon ... Fri Sat</td>
    </tr>
    <tr>
      <td></td>
      <td>dddd</td>
      <td>Sunday Monday ... Friday Saturday</td>
    </tr>
    <tr>
      <td><b>Day of Week (Locale)</b></td>
      <td>e</td>
      <td>0 1 ... 5 6</td>
    </tr>
    <tr>
      <td><b>Day of Week (ISO)</b></td>
      <td>E</td>
      <td>1 2 ... 6 7</td>
    </tr>
    <tr>
      <td><b>Week of Year</b></td>
      <td>w</td>
      <td>1 2 ... 52 53</td>
    </tr>
    <tr>
      <td></td>
      <td>wo</td>
      <td>1st 2nd ... 52nd 53rd</td>
    </tr>
    <tr>
      <td></td>
      <td>ww</td>
      <td>01 02 ... 52 53</td>
    </tr>
    <tr>
      <td><b>Week of Year (ISO)</b></td>
      <td>W</td>
      <td>1 2 ... 52 53</td>
    </tr>
    <tr>
      <td></td>
      <td>Wo</td>
      <td>1st 2nd ... 52nd 53rd</td>
    </tr>
    <tr>
      <td></td>
      <td>WW</td>
      <td>01 02 ... 52 53</td>
    </tr>
    <tr>
      <td><b>Year</b></td>
      <td>YY</td>
      <td>70 71 ... 29 30</td>
    </tr>
    <tr>
      <td></td>
      <td>YYYY</td>
      <td>1970 1971 ... 2029 2030</td>
    </tr>
    <tr>
      <td><b>Week Year</b></td>
      <td>gg</td>
      <td>70 71 ... 29 30</td>
    </tr>
    <tr>
      <td></td>
      <td>gggg</td>
      <td>1970 1971 ... 2029 2030</td>
    </tr>
    <tr>
      <td><b>Week Year (ISO)</b></td>
      <td>GG</td>
      <td>70 71 ... 29 30</td>
    </tr>
    <tr>
      <td></td>
      <td>GGGG</td>
      <td>1970 1971 ... 2029 2030</td>
    </tr>
    <tr>
      <td><b>AM/PM</b></td>
      <td>A</td>
      <td>AM PM</td>
    </tr>
    <tr>
      <td></td>
      <td>a</td>
      <td>am pm</td>
    </tr>
    <tr>
      <td><b>Hour</b></td>
      <td>H</td>
      <td>0 1 ... 22 23</td>
    </tr>
    <tr>
      <td></td>
      <td>HH</td>
      <td>00 01 ... 22 23</td>
    </tr>
    <tr>
      <td></td>
      <td>h</td>
      <td>1 2 ... 11 12</td>
    </tr>
    <tr>
      <td></td>
      <td>hh</td>
      <td>01 02 ... 11 12</td>
    </tr>
    <tr>
      <td><b>Minute</b></td>
      <td>m</td>
      <td>0 1 ... 58 59</td>
    </tr>
    <tr>
      <td></td>
      <td>mm</td>
      <td>00 01 ... 58 59</td>
    </tr>
    <tr>
      <td><b>Second</b></td>
      <td>s</td>
      <td>0 1 ... 58 59</td>
    </tr>
    <tr>
      <td></td>
      <td>ss</td>
      <td>00 01 ... 58 59</td>
    </tr>
    <tr>
      <td><b>Fractional Second</b></td>
      <td>S</td>
      <td>0 1 ... 8 9</td>
    </tr>
    <tr>
      <td></td>
      <td>SS</td>
      <td>0 1 ... 98 99</td>
    </tr>
    <tr>
      <td></td>
      <td>SSS</td>
      <td>0 1 ... 998 999</td>
    </tr>
    <tr>
      <td><b>Timezone</b></td>
      <td>z or zz</td>
      <td>
        EST CST ... MST PST
        <br/>
        <b>Note:</b> as of <b>1.6.0</b>, the z/zz format tokens have been deprecated. <a href="https://github.com/moment/moment/issues/162">Read more about it here.</a>
      </td>
    </tr>
    <tr>
      <td></td>
      <td>Z</td>
      <td>-07:00 -06:00 ... +06:00 +07:00</td>
    </tr>
    <tr>
      <td></td>
      <td>ZZ</td>
      <td>
        -0700 -0600 ... +0600 +0700
      </td>
    </tr>
    <tr>
      <td><b>Unix Timestamp</b></td>
      <td>X</td>
      <td>1360013296</td>
    </tr>
  </tbody>
</table>

`Z ZZ` were added in **1.2.0**.

`S SS SSS` were added in **1.6.0**.

`X` was added in **2.0.0**.

`e E gg gggg GG GGGG` were added in **2.1.0**.

#### Localized formats

Because preferred formatting differs based on locale, there are a few tokens that can be used to format a moment based on its language.

There are upper and lower case variations on the same formats. The lowercase version is intended to be the shortened version of its uppercase counterpart.

<table class="table table-striped table-bordered">
  <tbody>
    <tr>
      <td><b>Time</b></td>
      <td>LT</td>
      <td>8:30 PM</td>
    </tr>
    <tr>
      <td><b>Month numeral, day of month, year</b></td>
      <td>L</td>
      <td>09/04/1986</td>
    </tr>
    <tr>
      <td></td>
      <td>l</td>
      <td>9/4/1986</td>
    </tr>
    <tr>
      <td><b>Month name, day of month, year</b></td>
      <td>LL</td>
      <td>September 4 1986</td>
    </tr>
    <tr>
      <td></td>
      <td>ll</td>
      <td>Sep 4 1986</td>
    </tr>
    <tr>
      <td><b>Month name, day of month, year, time</b></td>
      <td>LLL</td>
      <td>September 4 1986 8:30 PM</td>
    </tr>
    <tr>
      <td></td>
      <td>lll</td>
      <td>Sep 4 1986 8:30 PM</td>
    </tr>
    <tr>
      <td><b>Month name, day of month, day of week, year, time</b></td>
      <td>LLLL</td>
      <td>Thursday, September 4 1986 8:30 PM</td>
    </tr>
    <tr>
      <td></td>
      <td>llll</td>
      <td>Thu, Sep 4 1986 8:30 PM</td>
    </tr>
  </tbody>
</table>

`L LL LLL LLLL LT` are available in version **1.3.0**. `l ll lll llll` are available in **2.0.0**.

#### Escaping characters

To escape characters in format strings, you can wrap the characters in square brackets.

```javascript
moment().format('[today] dddd'); // 'today Sunday'
```

#### Similarities and differences with LDML

**Note:** While these date formats are very similar to LDML date formats, there are a few minor differences regarding day of month, day of year, and day of week.

For a breakdown of a few different date formatting tokens across different languages, see [this chart of date formatting tokens.](https://docs.google.com/spreadsheet/ccc?key=0AtgZluze7WMJdDBOLUZfSFIzenIwOHNjaWZoeGFqbWc&amp;hl=en_US#gid=0)

#### Formatting speed

To compare Moment.js formatting speed against other libraries, check out [this comparison against other libraries](http://jsperf.com/date-formatting/8).

#### Other tokens

If you are more comfortable working with strftime instead of LDML-like parsing tokens, you can use Ben Oakes' plugin. [benjaminoakes/moment-strftime](https://github.com/benjaminoakes/moment-strftime).

#### Default format

As of version **1.5.0**, calling `moment#format` without a format will default to `moment.defaultFormat`. Out of the box, `moment.defaultFormat` is the ISO8601 format `YYYY-MM-DDTHH:mm:ssZ`.
