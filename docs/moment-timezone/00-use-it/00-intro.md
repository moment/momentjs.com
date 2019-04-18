---
title: Where to use it
---


To use moment-timezone, you will need `moment@2.9.0+`, `moment-timezone.js`, and the `moment-timezone` data.

For convenience, there are builds available on [momentjs.com/timezone/](/timezone/) with all the zone data or a subset of the data.

- `moment-timezone-with-data.js` is recommended for server environments (Node.js) and covers all years available.
- `moment-timezone-with-data-10-year-range.js` is recommend for most browser environments, covering +/- 5 years from the year published.
- `moment-timezone-with-data-1970-2030.js` covers a 60 year range, for those that need more data but not the larger file size of the full data file.

If you use one of the above files, you still need `moment.js`, but you do not need `moment-timezone.js` because it is included.

