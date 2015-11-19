---
title: String + Format
version: 1.0.0
signature: |
  moment(String, String);
  moment(String, String, String);
  moment(String, String, Boolean);
  moment(String, String, String, Boolean);
---


If you know the format of an input string, you can use that to parse a moment.

```javascript
moment("12-25-1995", "MM-DD-YYYY");
```

The parser ignores non-alphanumeric characters, so both of the following will return the same thing.

```javascript
moment("12-25-1995", "MM-DD-YYYY");
moment("12/25/1995", "MM-DD-YYYY");
```

The parsing tokens are similar to the formatting tokens used in `moment#format`.

#### Year, month, and day tokens

| Input       | Example          | Description |
| ----------- | ---------------- | ----------- |
| `YYYY`      | `2014`           | 4 or 2 digit year |
| `YY`        | `14`             | 2 digit year |
| `Q`         | `1..4`           | Quarter of year. Sets month to first month in quarter. |
| `M MM`      | `1..12`          | Month number |
| `MMM MMMM`  | `Jan..December`  | Month name in locale set by `moment.locale()` |
| `D DD`      | `1..31`          | Day of month |
| `Do`        | `1st..31st`      | Day of month with ordinal |
| `DDD DDDD`  | `1..365`         | Day of year |
| `X`         | `1410715640.579` | Unix timestamp |
| `x`         | `1410715640579`  | Unix ms timestamp |

`YYYY` from version `2.10.5` supports 2 digit years, and converts them to a year
near 2000 (same as `YY`).

#### Week year, week, and weekday tokens

For these, the lowercase tokens use the locale aware week start days, and the uppercase tokens use the [ISO week date](http://en.wikipedia.org/wiki/ISO_week_date) start days.

| Input       | Example          | Description |
| ----------- | ---------------- | ----------- |
| `gggg`      | `2014`           | Locale 4 digit week year |
| `gg`        | `14`             | Locale 2 digit week year |
| `w ww`      | `1..53`          | Locale week of year |
| `e`         | `1..7`           | Locale day of week |
| `ddd dddd`  | `Mon...Sunday`   | Day name in locale set by `moment.locale()` |
| `GGGG`      | `2014`           | ISO 4 digit week year |
| `GG`        | `14`             | ISO 2 digit week year |
| `W WW`      | `1..53`          | ISO week of year |
| `E`         | `1..7`           | ISO day of week |

#### Hour, minute, second, millisecond, and offset tokens

| Input          | Example  | Description |
| -------------- | -------- | ----------- |
| `H HH`         | `0..23`  | 24 hour time |
| `h hh`         | `1..12`  | 12 hour time used with `a A`. |
| `a A`          | `am pm`  | Post or ante meridiem |
| `m mm`         | `0..59`  | Minutes |
| `s ss`         | `0..59`  | Seconds |
| `S`            | `0..9`   | Tenths of a second |
| `SS`           | `0..99`  | Hundreds of a second |
| `SSS`          | `0..999` | Thousandths of a second |
| `SSSS`         | `0000..9999` | fractional seconds |
| `Z ZZ`         | `+12:00` | Offset from UTC as `+-HH:mm`, `+-HHmm`, or `Z` |

From version **2.10.5**: fractional second tokens length 4 up to 9 can parse
any number of digits, but will only consider the top 3 (milliseconds). Use if
you have the time printed with many fractional digits and want to consume the
input.

Locale aware date and time formats are also available using `LT LTS L LL LLL
LLLL`. They were added in version **2.2.1**, except `LTS` which was added
**2.8.4**.

`Z ZZ` were added in version `1.2.0`.

`S SS SSS` were added in version `1.6.0`.

`X` was added in version `2.0.0`.

Unless you specify a timezone offset, parsing a string will create a date in the current timezone.

```js
moment("2010-10-20 4:30",       "YYYY-MM-DD HH:mm");   // parsed as 4:30 local time
moment("2010-10-20 4:30 +0000", "YYYY-MM-DD HH:mm Z"); // parsed as 4:30 UTC
```

If the moment that results from the parsed input does not exist, `moment#isValid` will return false.

```js
moment("2010 13",           "YYYY MM").isValid();     // false (not a real month)
moment("2010 11 31",        "YYYY MM DD").isValid();  // false (not a real day)
moment("2010 2 29",         "YYYY MM DD").isValid();  // false (not a leap year)
moment("2010 notamonth 29", "YYYY MMM DD").isValid(); // false (not a real month name)
```

As of version `2.0.0`, a locale key can be passed as the third parameter to `moment()` and `moment.utc()`.

```js
moment('2012 juillet', 'YYYY MMM', 'fr');
moment('2012 July',    'YYYY MMM', 'en');
```

#### Strict parsing

Moment's parser is very forgiving, and this can lead to undesired behavior. As of version `2.3.0`, you may specify a boolean for the last argument to make Moment use strict parsing. Strict parsing requires that the format and input match exactly including delimiters.

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

#### Parsing two digit years

By default, two digit years above 68 are assumed to be in the 1900's and years 68 or below are assumed to be in the 2000's. This can be changed by replacing the `moment.parseTwoDigitYear` method.
