---
title: Known Date Formats
---
If you know the format of the date string that you will be parsing, it is always the best choice to explicitly specify that format.

Examples:

```js
moment('01/01/2016', 'MM/DD/YYYY')
moment('2016-01-01 11:31:23 PM', 'YYYY-MM-DD hh:mm:ss a')
```

If your dates are in an ISO 8601 format, you can use a constant built into moment to indicate that:

```js
moment('2016-01-01 12:25:32', moment.ISO_8601)
```
ISO 8601 formats include, but are not limited to:
```
2013-02-08               # A calendar date part
2013-W06-5               # A week date part
2013-02-08T09            # An hour time part separated by a T
2013-02-08 09            # An hour time part separated by a space
2013-02-08 09:30:26      # An hour, minute, and second time part
2013-02-08 09+07:00      # +-HH:mm
```
<a href="/docs/#/parsing/string/"> See the API documentation on parsing strings for a full listing.</a>