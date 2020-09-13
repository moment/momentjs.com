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

Date-fns offers a series of functions for manipulating JavaScript `Date` objects.  For more details, scroll to "Why date-fns?" on the date-fns home page.

- Locales: Custom data files that can be individually imported
- Time Zones: `Intl` provided, via a separate companion library

### [js-Joda](https://js-joda.github.io/js-joda/)

js-Joda is a JavaScript port of Java's [Three-Ten Backport](https://www.threeten.org/threetenbp/), which is the base for JSR-310 implementation of the Java SE 8 `java.time` package.
If you are familiar with [`java.time`](https://docs.oracle.com/javase/8/docs/api/java/time/package-summary.html), [Joda-Time](https://www.joda.org/joda-time/), or [Noda Time](https://nodatime.org/), you will find js-Joda comparable.

- Locales: Custom data files via add-on module
- Time Zones: Custom data files via add-on module

### No Library

JavaScript has always had a `Date` object.  Its not perfect, but it has evolved somewhat over time.  Parsing strings is still problematic, so be careful there.

Additionally, most modern browsers now support the [`Intl`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl) API, which works great for formatting strings in different locales and time zones.

If the `Date` and `Intl` objects meet your needs, and you fully understand their limitations, then you should consider using them directly.
