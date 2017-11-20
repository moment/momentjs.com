---
title: Offset
signature: |
  zone.utcOffset(timestamp); // 480
---

Get the offset for a given timestamp from a `Zone`.

```js
moment.tz.zone('America/Los_Angeles').utcOffset(1403465838805); // 420
moment.tz.zone('America/Los_Angeles').utcOffset(1388563200000); // 480
```

POSIX compatibility requires that the offsets are inverted. Therefore, Etc/GMT-X will have an offset of `+X` and Etc/GMT+X will have an offset of `-X`. This is a result of IANA's [Time Zone Database](https://github.com/eggert/tz/blob/2017b/etcetera#L36-L42) and not an arbitrary choice by Moment.js. Thus, using locality based identifiers is preferred over fixed-offset identifiers.

For example, `moment().tz('Etc/GMT+1').format('YYYY-MM-DD HH:mm ZZ')` will return `2014-12-18 11:22 -0100` while `moment().tz('Europe/Madrid').format('YYYY-MM-DD HH:mm ZZ')` will return `2014-12-18 13:22 +0100`. The `Europe/Madrid` indentifer should be used instead of the `Etc/GMT+1` identifier. 
