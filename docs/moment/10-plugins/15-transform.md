---
title: Transform
signature: |
  bower install moment-transform
---

[`moment-transform`](https://a----.github.io/moment-transform/) is a plugin that manipulated dates through patterns. You can use basic operations &ndash;set/add/subtract&ndash; on individual parts (hours, month, &hellip;) of a Moment instance.

```js
moment().transform('YYYY-MM-+01 00:00:00.000'); // Tonight at midnight
moment().transform('14:30:00.000'); // Today, 2:30 pm
moment().transform('YYYY-MM--30 00:00:00.000'); // 30 days ago
```

Optional parameters lets you specify custom patterns and force strict pattern usage (non-alphabetic characters are not mandatory in passed string by default).

```js
moment().transform('+01MMYYYY', 'DD/MM/YYYY', false); // Tomorrow, same time
moment().transform('+01MMYYYY', 'DD/MM/YYYY', true); // Invalid date
```

You can see it live [there](https://a----.github.io/moment-transform/) while the repository is [here](https://github.com/A----/moment-transform).
