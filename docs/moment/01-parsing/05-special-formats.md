---
title: Special Formats
version: 2.7.0
signature: |
  moment(String, moment.CUSTOM_FORMAT, [String], [Boolean]);
  moment(String, moment.CUSTOM_FORMAT, [String[]], [Boolean]);
  moment(String, [..., moment.ISO_8601, ...], [String], [Boolean]);
  moment(String, [..., moment.ISO_8601, ...], [String[]], [Boolean]);
---

[ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) is a standard for time and duration display. Moment already supports parsing iso-8601 strings, but this can be specified explicitly in the format/list of formats when constructing a moment.

To specify iso-8601 parsing use `moment.ISO_8601` constant. More formats will be added in the future.

Examples:

```javascript
moment("2010-01-01T05:06:07", moment.ISO_8601);
moment("2010-01-01T05:06:07", ["YYYY", moment.ISO_8601]);
```
