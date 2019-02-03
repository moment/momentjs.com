---
title: Filter Years
signature: |
  moment.tz.filterYears(UnpackedZone, Number, Number); // UnpackedZone
---

By default, Moment Timezone includes all the data from
[the IANA Time Zone Database](https://www.iana.org/time-zones). This includes data
from 1900 to 2038. The data for all these years may not be necessary for your use case.

`moment.tz.filterYears` can be used to filter out data for years outside a certain range.

<!-- skip-example -->

```js
var all    = { name : "America/Los_Angeles", abbrs : [...], offsets : [...] untils : [...]};
var subset = moment.tz.filterYears(all, 2012, 2016);
all.untils.length;    // 186
subset.untils.length; // 11
```

If only one year is passed, it will be used for the start and end year.

<!-- skip-example -->

```js
var all    = { name : "America/Los_Angeles", abbrs : [...], offsets : [...] untils : [...]};
var subset = moment.tz.filterYears(all, 2012);
all.untils.length;    // 186
subset.untils.length; // 3
```
