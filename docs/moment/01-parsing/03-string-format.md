---
title: String + Format
version: 1.0.0
signature: |
  moment(String, String);
  moment(String, String, String);
  moment(String, String, String[]);
  moment(String, String, Boolean);
  moment(String, String, String, Boolean);
---


If you know the format of an input string, you can use that to parse a moment.

```javascript
moment("12-25-1995", "MM-DD-YYYY");
```

The parser ignores non-alphanumeric characters by default, so both of the following will return the same thing.

```javascript
moment("12-25-1995", "MM-DD-YYYY");
moment("12/25/1995", "MM-DD-YYYY");
```

You may get unexpected results when parsing both date and time. The below example may not parse as you expect:
```javascript
moment('24/12/2019 09:15:00', "DD MM YYYY hh:mm:ss");
```

You can use strict mode, which will identify the parsing error and set the Moment object as invalid:
```javascript
moment('24/12/2019 09:15:00', "DD MM YYYY hh:mm:ss", true);
```

The parsing tokens are similar to the formatting tokens used in `moment#format`.

#### Year, month, and day tokens

*Tokens are case-sensitive.*

| Input       | Example          | Description |
| ----------- | ---------------- | ----------- |
| `YYYY`      | `2014`           | 4 or 2 digit year. Note: Only 4 digit can be parsed on `strict` mode |
| `YY`        | `14`             | 2 digit year |
| `Y`         | `-25`            | Year with any number of digits and sign |
| `Q`         | `1..4`           | Quarter of year. Sets month to first month in quarter. |
| `M MM`      | `1..12`          | Month number |
| `MMM MMMM`  | `Jan..December`  | Month name in locale set by `moment.locale()` |
| `D DD`      | `1..31`          | Day of month |
| `Do`        | `1st..31st`      | Day of month with ordinal |
| `DDD DDDD`  | `1..365`         | Day of year |
| `X`         | `1410715640.579` | Unix timestamp |
| `x`         | `1410715640579`  | Unix ms timestamp |

`YYYY` from version **2.10.5** supports 2 digit years, and converts them to a year
near 2000 (same as `YY`).

`Y` was added in **2.11.1**. It will match any number, signed or unsigned. It is useful for years that are not 4 digits or are before the common era. It can be used for any year.

#### Week year, week, and weekday tokens

For these, the lowercase tokens use the locale aware week start days, and the uppercase tokens use the [ISO week date](https://en.wikipedia.org/wiki/ISO_week_date) start days.

*Tokens are case-sensitive.*

| Input       | Example          | Description |
| ----------- | ---------------- | ----------- |
| `gggg`      | `2014`           | Locale 4 digit week year |
| `gg`        | `14`             | Locale 2 digit week year |
| `w ww`      | `1..53`          | Locale week of year |
| `e`         | `0..6`           | Locale day of week |
| `ddd dddd`  | `Mon...Sunday`   | Day name in locale set by `moment.locale()` |
| `GGGG`      | `2014`           | ISO 4 digit week year |
| `GG`        | `14`             | ISO 2 digit week year |
| `W WW`      | `1..53`          | ISO week of year |
| `E`         | `1..7`           | ISO day of week |


#### Locale aware formats

Locale aware date and time formats are also available using `LT LTS L LL LLL
LLLL`. They were added in version **2.2.1**, except `LTS` which was added
**2.8.4**.

*Tokens are case-sensitive.*

| Input          | Example                               | Description |
| -------------- | ------------------------------------- | ----------- |
| `L`            | `09/04/1986`                          | Date (in local format) |
| `LL`           | `September 4 1986`                    | Month name, day of month, year
| `LLL`          | `September 4 1986 8:30 PM`            | Month name, day of month, year, time|
| `LLLL`         | `Thursday, September 4 1986 8:30 PM`  | Day of week, month name, day of month, year, time	 |
| `LT`           | `8:30 PM`                            | Time (without seconds) |
| `LTS`          | `8:30:00 PM`                         | Time (with seconds) |

#### Hour, minute, second, millisecond, and offset tokens

*Tokens are case-sensitive.*

| Input                    | Example        | Description |
| ------------------------ | -------------- | ----------- |
| `H HH`                   | `0..23`        | Hours (24 hour time) |
| `h hh`                   | `1..12`        | Hours (12 hour time used with `a A`.) |
| `k kk`                   | `1..24`        | Hours (24 hour time from 1 to 24) |
| `a A`                    | `am pm`        | Post or ante meridiem (Note the one character `a p` are also considered valid) |
| `m mm`                   | `0..59`        | Minutes |
| `s ss`                   | `0..59`        | Seconds |
| `S SS SSS ... SSSSSSSSS` | `0..999999999` | Fractional seconds |
| `Z ZZ`                   | `+12:00`       | Offset from UTC as `+-HH:mm`, `+-HHmm`, or `Z` |

From version **2.10.5**: fractional second tokens length 4 up to 9 can parse
any number of digits, but will only consider the top 3 (milliseconds). Use if
you have the time printed with many fractional digits and want to consume the
input.

Note that the number of `S` characters provided is only relevant when parsing in strict mode.
In standard mode, `S`, `SS`, `SSS`, `SSSS` are all equivalent, and interpreted as fractions of a second.
For example, `.12` is always 120 milliseconds, passing `SS` will not cause it to be interpreted as 12 milliseconds.

`Z ZZ` were added in version **1.2.0**.

`S SS SSS` were added in version **1.6.0**.

`X` was added in version **2.0.0**.

`SSSSS ... SSSSSSSSS` were added in version **2.10.5**.

`k kk` were added in version **2.13.0**.

Unless you specify a time zone offset, parsing a string will create a date in the current time zone.

```js
moment("2010-10-20 4:30",       "YYYY-MM-DD HH:mm");   // parsed as 4:30 local time
moment("2010-10-20 4:30 +0000", "YYYY-MM-DD HH:mm Z"); // parsed as 4:30 UTC
```

#### Era Year related tokens

*Tokens are case-sensitive.*

| Input     | Examples      | Description    |
|-----------|---------------|----------------|
| y .. yyyy | `5 +5 -500`   | Years          |
| yo        | `5th 1st`     | Ordinal Years  |
| N         | `AD`          | Abbr Era name  |
| NN        | `AD`          | Abbr Era name  |
| NNN       | `AD`          | Abbr Era name  |
| NNNN      | `Anno Domini` | Full Era name  |
| NNNNN     | `AD`          | Narrow Era name |


Era support was added in **2.25.0**. The tokens/API are still in flux.

#### Notes and gotchas

If the moment that results from the parsed input does not exist, `moment#isValid` will return false.

```js
moment("2010 13",           "YYYY MM").isValid();     // false (not a real month)
moment("2010 11 31",        "YYYY MM DD").isValid();  // false (not a real day)
moment("2010 2 29",         "YYYY MM DD").isValid();  // false (not a leap year)
moment("2010 notamonth 29", "YYYY MMM DD").isValid(); // false (not a real month name)
```

As of version **2.0.0**, a locale key can be passed as the third parameter to `moment()` and `moment.utc()`.

```js
moment('2012 juillet', 'YYYY MMM', 'fr');
moment('2012 July',    'YYYY MMM', 'en');
moment('2012 July',    'YYYY MMM', ['qj', 'en']);
```

Moment's parser is very forgiving, and this can lead to undesired/unexpected behavior.

For example, the following behavior can be observed:

```javascript
moment('2016 is a date', 'YYYY-MM-DD').isValid() //true, 2016 was matched
```

Previous to **2.13.0** the parser exhibited the following behavior. This has been corrected.

```javascript
moment('I am spartacus', 'h:hh A').isValid();     //true - the 'am' matches the 'A' flag.
```

As of version **2.3.0**, you may specify a boolean for the last argument to make Moment use strict parsing. Strict parsing requires that the format and input match exactly, *including delimeters*.

```javascript
moment('It is 2012-05-25', 'YYYY-MM-DD').isValid();       // true
moment('It is 2012-05-25', 'YYYY-MM-DD', true).isValid(); // false
moment('2012-05-25',       'YYYY-MM-DD', true).isValid(); // true
moment('2012.05.25',       'YYYY-MM-DD', true).isValid(); // false
```

You can use both locale and strictness.

```javascript
moment('2012-10-14', 'YYYY-MM-DD', 'fr', true);
```

Strict parsing is frequently the best parsing option. For more information about choosing strict vs forgiving parsing, see the <a href="/guides/#/parsing/">parsing guide.</a>

#### Parsing two digit years

By default, two digit years above 68 are assumed to be in the 1900's and years 68 or below are assumed to be in the 2000's. This can be changed by replacing the `moment.parseTwoDigitYear` method. The only argument of this method is a string containing the two years input by the user, and should return the year as an integer.

```javascript
moment.parseTwoDigitYear = function(yearString) {
    return parseInt(yearString) + 2000;
}
```

#### Parsing glued hour and minutes

From version **2.11.0** parsing `hmm`, `Hmm`, `hmmss` and `Hmmss` is supported:

```javascript
moment("123", "hmm").format("HH:mm") === "01:23"
moment("1234", "hmm").format("HH:mm") === "12:34"
```
