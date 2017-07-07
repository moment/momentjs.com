---
title: Offset
signature: |
  zone.offset(timestamp); // 480
---

Get the offset for a given timestamp from a `Zone`. POSIX compatibility requires that the offsets are inverted. Therefore, GMT-X will have an offset of `+X` and GMT+X will have an offset of `-X`.

```js
moment.tz.zone('America/Los_Angeles').offset(1403465838805); // 420
moment.tz.zone('America/Los_Angeles').offset(1388563200000); // 480
```
