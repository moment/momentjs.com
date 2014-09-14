---
title: String
version: 1.0.0
signature: |
  moment(String);
---

When creating a moment from a string, we first check if the string matches known [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) formats, then fall back to `new Date(string)` if a known format is not found.

```javascript
var day = moment("1995-12-25");
```

**Warning:** Browser support for parsing strings [is inconsistent](http://dygraphs.com/date-formats.html). Because there is no specification on which formats should be supported, what works in some browsers will not work in other browsers.

<!--
**Note**: This has been the source of a lot of confusion, because moments created via `Date` constructor don't support `isValid` and also work unreliably. So it would be soon deprecated. From version 2.6.0 there is a way to prevent Date constructor usage -- just set `moment.createFromInputFallback` to an empty function.
-->

For consistent results parsing anything other than ISO 8601 strings, you should use [String + Format](#/parsing/string-format/).

#### Supported ISO 8601 strings

An ISO 8601 string requires a date part.

```
2013-02-08  # A calendar date part
2013-W06-5  # A week date part
2013-039    # An ordinal date part
```

A time part can also be included, separated from the date part by a space or a uppercase T.

```
2013-02-08T09            # An hour time part separated by a T
2013-02-08 09            # An hour time part separated by a space
2013-02-08 09:30         # An hour and minute time part
2013-02-08 09:30:26      # An hour, minute, and second time part
2013-02-08 09:30:26.123  # An hour, minute, second, and millisecond time part
```

Any of the date parts can have a time part.

```
2013-02-08 09  # A calendar date part and hour time part
2013-W06-5 09  # A week date part and hour time part
2013-039 09    # An ordinal date part and hour time part
```

If a time part is included, an offset from UTC can also be included as `+-HH:mm`, `+-HHmm`, or `Z`.

```
2013-02-08 09+07:00            # +-HH:mm
2013-02-08 09-0100             # +-HHmm
2013-02-08 09Z                 # Z
2013-02-08 09:30:26.123+07:00  # +-HH:mm
```

**Note:** Automatic cross browser ISO-8601 support was added in version **1.5.0**. Support for the week and ordinal formats was added in version **2.3.0**.

If a string does not match any of the above formats and is not able to be parsed with `Date.parse`, `moment#isValid` will return false.

```javascript
moment("not a real date").isValid(); // false
```
