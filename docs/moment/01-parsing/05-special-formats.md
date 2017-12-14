---
title: Special Formats
version: 2.7.0
signature: |
  moment(String, moment.CUSTOM_FORMAT, [String], [Boolean]);
  moment(String, moment.HTML_FMT.DATETIME_LOCAL, [String], [Boolean]); // from 2.20.0
  moment(String, [..., moment.ISO_8601, ...], [String], [Boolean]);
---

[ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) is a standard for time and duration display. Moment already supports parsing iso-8601 strings, but this can be specified explicitly in the format/list of formats when constructing a moment.

To specify iso-8601 parsing use `moment.ISO_8601` constant. 

```javascript
moment("2010-01-01T05:06:07", moment.ISO_8601);
moment("2010-01-01T05:06:07", ["YYYY", moment.ISO_8601]);
```

As of version **2.20.0**, the following HTML5 formats are available:

| Constant                                    | Format                    | Example                 | Input Type     |
| -------------                               | -------------             | -------------           | -------------  |
| `moment.HTML5_FMT.DATETIME_LOCAL`           | `YYYY-MM-DDTHH:mm`        | 2017-12-14T16:34        |`<input type="datetime-local" />` |
| `moment.HTML5_FMT.DATETIME_LOCAL_SECONDS`   | `YYYY-MM-DDTHH:mm:ss`     | 2017-12-14T16:34:10     |`<input type="datetime-local" step="1" />` |
| `moment.HTML5_FMT.DATETIME_LOCAL_MS`        | `YYYY-MM-DDTHH:mm:ss.SSS` | 2017-12-14T16:34:10.234 |`<input type="datetime-local" step="0.001" />` |
| `moment.HTML5_FMT.DATE`                     | `YYYY-MM-DD`              | 2017-12-14              |`<input type="date" />` |
| `moment.HTML5_FMT.TIME`                     | `HH:mm`                   | 16:34                   |`<input type="time" />` |
| `moment.HTML5_FMT.TIME_SECONDS`             | `HH:mm:ss`                | 16:34:10                |`<input type="time" step="1" />` |
| `moment.HTML5_FMT.TIME_MS`                  | `HH:mm:ss.SSS`            | 16:34:10.234            |`<input type="time" step="0.001" />` |
| `moment.HTML5_FMT.WEEK`                     | `YYYY-[W]WW`              | 2017-W50                |`<input type="week" />` |
| `moment.HTML5_FMT.MONTH`                    | `YYYY-MM`                 | 2017-12                 |`<input type="month" />` |
