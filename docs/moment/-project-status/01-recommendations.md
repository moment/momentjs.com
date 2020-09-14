---
title: Recommendations
---

There are several great options to consider using instead of Moment.

When choosing, consider that:

- Some libraries are split into modules, plugins, or companion libraries.
- Some libraries use the ECMAScript [`Intl`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl) API for locales, time zones, or both.
- Some libraries still provide their own locale and time zone files like Moment and Moment-Timezone do.

**Here are the alternatives we recommend:**

### [Luxon](https://moment.github.io/luxon/)

Luxon can be thought of as the evolution of Moment.  It is authored by [Isaac Cambron](https://github.com/icambron), a long-time contributor to Moment.
Please read [*Why does Luxon exist?*](https://moment.github.io/luxon/docs/manual/why.html) and the [*For Moment users*](https://moment.github.io/luxon/docs/manual/moment.html) pages in the Luxon documentation.

- Locales: `Intl` provided
- Time Zones: `Intl` provided

### [Day.js](https://day.js.org/)

Day.js is designed to be a minimalist replacement for Moment.js, using a similar API.
It is not a drop-in replacement, but if you are used to using Moment's API and want to get moving quickly, consider using Day.js.

- Locales: Custom data files that can be individually imported
- Time Zones: `Intl` provided, via a plugin

### [date-fns](https://date-fns.org/)

Date-fns offers a series of functions for manipulating JavaScript [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) objects.  For more details, scroll to "Why date-fns?" on the date-fns home page.

- Locales: Custom data files that can be individually imported
- Time Zones: `Intl` provided, via a separate companion library

### [js-Joda](https://js-joda.github.io/js-joda/)

js-Joda is a JavaScript port of Java's [Three-Ten Backport](https://www.threeten.org/threetenbp/), which is the base for JSR-310 implementation of the Java SE 8 `java.time` package.
If you are familiar with [`java.time`](https://docs.oracle.com/javase/8/docs/api/java/time/package-summary.html), [Joda-Time](https://www.joda.org/joda-time/), or [Noda Time](https://nodatime.org/), you will find js-Joda comparable.

- Locales: Custom data files via add-on module
- Time Zones: Custom data files via add-on module

### No Library

JavaScript has always had a [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) object, defined ECMAScript (ECMA-262) specification [here](https://www.ecma-international.org/ecma-262/11.0/index.html#sec-date-objects).

When using `Date` objects, be aware of the following:

- The `Date` object internally represents a Unix timestamp with millisecond precision.  It offers functions that will convert to and from the system's local time zone, but it is *always* UTC internally.
  Unlike a `Moment` object, it *can not* be set to use another time zone; It has no concept of "mode".

- Using [`Date.parse`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date/parse), or [`new Date(<string>)`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date/Date#Timestamp_string)
  has been problematic and implemented inconsistently in the past.  The [current specification](https://www.ecma-international.org/ecma-262/11.0/index.html#sec-date-time-string-format) defines parsing a variation of ISO 8601 strings,
  where date-only forms (like `"2020-09-14"`) are parsed as UTC, instead of local time as they would be by ISO 8601.  Even then, not all modern implementations have implemented this specification correctly (e.g., Safari).
  Other types of strings *may* work, but parsing them is *implementation specific* and can vary significantly - especially with older browsers.  Depending on the implementation, and the components provided in the string, you may be surprised with the result.
  For these reasons, we agree with [MDN's statement](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date/Date#Timestamp_string) that **parsing strings with the `Date` object is strongly discouraged**.

Modern JavaScript environments will also implement the by [ECMA-402](https://www.ecma-international.org/ecma-402) specification, which provides the [`Intl`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl) object,
and defines behavioral options of the `Date` object's `toLocaleString`, `toLocaleDateString`, and `toLocaleTimeString` functions.

When using the `Intl` object, be aware of the following:

- Not every environment will implement the full specification.  In particular, Node.js environments require internationalization support provided by ICU.  See [the Node.js documentation](https://nodejs.org/docs/latest-v12.x/api/intl.html) for further details.
- The [ECMAScript Intl compatibility table (by kangax)](http://kangax.github.io/compat-table/esintl/) can be useful in determining which features are supported and which are not.
- Most newer environments provide IANA time zone support via the `timeZone` option in the `Intl.DateTimeFormat` constructor (and in `Date.toLocaleString`, `Date.toLocaleDateString`, and `Date.toLocaleTimeString`).
  This option can be used to take the internal UTC-based timestamp of a `Date` object and get a *string* that has been converted to a named time zone.  However, it *can not* be used to convert a `Date` object to a different time zone.

If the `Date` and `Intl` objects meet your needs and you fully understand their limitations, then you might consider using them directly.
