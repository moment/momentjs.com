---
title: Abbreviation
signature: |
  zone.abbr(timestamp); // PST
---

Get the abbreviation for a given timestamp from a `Zone`.

```js
moment.tz.zone('America/Los_Angeles').abbr(1403465838805); // PDT
moment.tz.zone('America/Los_Angeles').abbr(1388563200000); // PST
```