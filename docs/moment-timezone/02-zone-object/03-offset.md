---
title: Offset
signature: |
  zone.offset(timestamp); // 480
---

Get the offset for a given timestamp from a `Zone`.

```js
moment.tz.zone('America/Los_Angeles').offset(1403465838805); // 420
moment.tz.zone('America/Los_Angeles').offset(1388563200000); // 480
```

POSIX compatibility requires that the offsets are inverted. Therefore, GMT-X will have an offset of `+X` and GMT+X will have an offset of `-X`. This is a result of IANA's [Time Zone Database](https://www.iana.org/time-zones) and not an arbitrary choice by Moment.js.

Therefore, `moment().tz('Etc/Gmt+1').format('YYYY-MM-DD HH:mm ZZ')` will return `2014-12-18 11:22 -0100` while `moment().tz('Europe/Madrid').format('YYYY-MM-DD HH:mm ZZ')` will return `2014-12-18 13:22 +0100`. The `Europe/Madrid` indentifer should be used instead of the `Etc/Gmt+1` identifier, which is incorrect.
