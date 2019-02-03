---
title: Creation Data
version: 2.11.0
signature: |
  moment().creationData();
---

After a moment object is created, all of the inputs can be accessed with
`creationData()` method:

<!-- skip-example -->

```javascript
moment("2013-01-02", "YYYY-MM-DD", true).creationData() === {
    input: "2013-01-02",
    format: "YYYY-MM-DD",
    locale: Locale obj,
    isUTC: false,
    strict: true
}
```
