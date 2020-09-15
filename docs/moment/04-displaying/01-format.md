---
title: Format
version: 1.0.0
signature: |
  moment().format();
  moment().format(String);
---


This is the most robust display option. It takes a string of tokens and replaces them with their corresponding values.

```javascript
moment().format();                                // "2014-09-08T08:02:17-05:00" (ISO 8601, no fractional seconds)
moment().format("dddd, MMMM Do YYYY, h:mm:ss a"); // "Sunday, February 14th 2010, 3:25:50 pm"
moment().format("ddd, hA");                       // "Sun, 3PM"
moment().format("[Today is] dddd");               // "Today is Sunday"
moment('gibberish').format('YYYY MM DD');         // "Invalid date"
```

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
      <td></td>
      <td>Qo</td>
      <td>1st 2nd 3rd 4th</td>
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
      <td></td>
      <td>YYYYYY</td>
      <td>-001970 -001971 ... +001907 +001971
        <br />
        <b>Note:</b> <a href="https://tc39.es/ecma262/#sec-expanded-years">Expanded Years</a> (Covering the full time value range of approximately 273,790 years forward or backward from 01 January, 1970)
      </td>
    </tr>
      <tr>
      <td></td>
      <td>Y</td>
      <td>1970 1971 ... 9999 +10000 +10001
        <br />
        <b>Note:</b> This complies with the ISO 8601 standard for dates past the year 9999
      </td>
    </tr>
    <tr>
      <td><b>Era Year</b></td>
      <td>y</td>
      <td>1 2 ... 2020 ... </td>
    </tr>
    <tr>
      <td><b>Era</b></td>
      <td>N, NN, NNN</td>
      <td> BC AD<br />
        <b>Note:</b> Abbr era name
      </td>
    </tr>
    <tr>
      <td></td>
      <td>NNNN</td>
      <td> Before Christ, Anno Domini <br />
        <b>Note:</b> Full era name
      </td>
    </tr>
    <tr>
      <td></td>
      <td>NNNNN</td>
      <td> BC AD<br />
        <b>Note:</b> Narrow era name
      </td>
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
      <td></td>
      <td>k</td>
      <td>1 2 ... 23 24</td>
    </tr>
    <tr>
      <td></td>
      <td>kk</td>
      <td>01 02 ... 23 24</td>
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
      <td>00 01 ... 98 99</td>
    </tr>
    <tr>
      <td></td>
      <td>SSS</td>
      <td>000 001 ... 998 999</td>
    </tr>
    <tr>
      <td></td>
      <td>SSSS ... SSSSSSSSS</td>
      <td>000[0..] 001[0..] ... 998[0..] 999[0..]</td>
    </tr>
    <tr>
      <td><b>Time Zone</b></td>
      <td>z or zz</td>
      <td>
        EST CST ... MST PST
        <br/>
        <b>Note:</b> as of <b>1.6.0</b>, the z/zz format tokens have been deprecated from plain moment objects. <a href="https://github.com/moment/moment/issues/162">Read more about it here.</a>
        However, they *do* work if you are using a specific time zone with the moment-timezone addon.
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
    <tr>
      <td><b>Unix Millisecond Timestamp</b></td>
      <td>x</td>
      <td>1360013296123</td>
    </tr>
  </tbody>
</table>

`X` was added in **2.0.0**.

`e E gg gggg GG GGGG` were added in **2.1.0**.

`x` was added in **2.8.4**.

`SSSS` to `SSSSSSSSS` were added in **2.10.5**. They display 3 significant
digits and the rest is filled with zeros.

`k` and `kk` were added in **2.13.0**.

#### Localized formats

Because preferred formatting differs based on locale, there are a few tokens that can be used to format a moment based on its locale.

There are upper and lower case variations on the same formats. The lowercase version is intended to be the shortened version of its uppercase counterpart.

<table class="table table-striped table-bordered">
  <tbody>
    <tr>
      <td><b>Time</b></td>
      <td>LT</td>
      <td>8:30 PM</td>
    </tr>
    <tr>
      <td><b>Time with seconds</b></td>
      <td>LTS</td>
      <td>8:30:25 PM</td>
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
      <td>September 4, 1986</td>
    </tr>
    <tr>
      <td></td>
      <td>ll</td>
      <td>Sep 4, 1986</td>
    </tr>
    <tr>
      <td><b>Month name, day of month, year, time</b></td>
      <td>LLL</td>
      <td>September 4, 1986 8:30 PM</td>
    </tr>
    <tr>
      <td></td>
      <td>lll</td>
      <td>Sep 4, 1986 8:30 PM</td>
    </tr>
    <tr>
      <td><b>Month name, day of month, day of week, year, time</b></td>
      <td>LLLL</td>
      <td>Thursday, September 4, 1986 8:30 PM</td>
    </tr>
    <tr>
      <td></td>
      <td>llll</td>
      <td>Thu, Sep 4, 1986 8:30 PM</td>
    </tr>
  </tbody>
</table>

`l ll lll llll` are available in **2.0.0**.
`LTS` was added in **2.8.4**.

#### Escaping characters

To escape characters in format strings, you can wrap the characters in square brackets.

```javascript
moment().format('[today] dddd'); // 'today Sunday'
```

#### Similarities and differences with LDML

**Note:** While these date formats are very similar to LDML date formats, there are a few minor differences regarding day of month, day of year, and day of week.

For a breakdown of a few different date formatting tokens across different locales, see [this chart of date formatting tokens.](https://docs.google.com/spreadsheet/ccc?key=0AtgZluze7WMJdDBOLUZfSFIzenIwOHNjaWZoeGFqbWc&amp;hl=en_US#gid=0)

#### Formatting speed

To compare Moment.js formatting speed against other libraries, check out [this comparison against other libraries](https://jsperf.com/date-formatting/49).

#### Other tokens

If you are more comfortable working with strftime instead of LDML-like parsing tokens, you can use Ben Oakes' plugin. [benjaminoakes/moment-strftime](https://github.com/benjaminoakes/moment-strftime).

#### Default format

Calling `moment#format` without a format will default to `moment.defaultFormat`. Out of the box, `moment.defaultFormat` is the ISO8601 format `YYYY-MM-DDTHH:mm:ssZ`.

As of version **2.13.0**, when in UTC mode, the default format is governed by `moment.defaultFormatUtc` which is in the format `YYYY-MM-DDTHH:mm:ss[Z]`. This returns ``Z`` as the offset, instead of ``+00:00``.

In certain instances, a local timezone (such as `Atlantic/Reykjavik`) may have a zero offset, and will be considered to be UTC. In such cases, it may be useful to set `moment.defaultFormat` and `moment.defaultFormatUtc` to use the same formatting.

Changing the value of `moment.defaultFormat` will only affect formatting, and will not affect parsing. for example:

```javascript
moment.defaultFormat = "DD.MM.YYYY HH:mm";
// parse with .toDate()
moment('20.07.2018 09:19').toDate() // Invalid date
// format the date string with the new defaultFormat then parse
moment('20.07.2018 09:19', moment.defaultFormat).toDate() // Fri Jul 20 2018 09:19:00 GMT+0300
```
