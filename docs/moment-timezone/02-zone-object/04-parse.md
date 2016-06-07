---
title: Parse Offset
signature: |
  zone.parse(timestamp); // 480
---

Parse an offset for a timestamp constructed from `Date.UTC` in that zone.

This is what Moment Timezone uses to parse input into a time zone. The process is
conceptually similar to the following.

Assume we want to find the exact moment of `March 19 2014 8:30 am` in New York.
Because the offset varies between `-04:00` and `-05:00` in New York, we don't know
what the offset was on March 19th.

Instead, we create a timestamp in UTC and pass that to `zone.parse`, which will
return the offset at that time.

```js
var zone = moment.tz.zone('America/New_York');
zone.parse(Date.UTC(2012, 2, 19, 8, 30)); // 240
```

This is the code that handles the cases referenced in the
[Parsing Ambiguities](#/using-timezones/parsing-ambiguous-inputs/) section above.

```js
var zone = moment.tz.zone('America/New_York');
zone.parse(Date.UTC(2012, 2, 11, 1, 59)); // 300
zone.parse(Date.UTC(2012, 2, 11, 2, 0)); // 240
```
