---
title: Link Format
---

In order to reduce duplication, the Moment Timezone data packer will create links
out of two zones that share data that is exactly the same.

This data is the two zone names separated by a pipe.

```js
moment.tz.add('America/Los_Angeles|PST PDT|80 70|01010101010|1Lzm0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0');
moment.tz.link('America/Los_Angeles|US/Pacific');
moment.tz("2013-12-01", "America/Los_Angeles").format(); // 2013-12-01T00:00:00-08:00
moment.tz("2013-12-01", "US/Pacific").format();          // 2013-12-01T00:00:00-08:00
```
