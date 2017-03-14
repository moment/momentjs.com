---
title: As JSON
version: 2.9.0
signature: |
  moment.duration().toJSON();
---

When serializing a duration object to JSON, it will be represented as an
ISO8601 string.

```javascript
JSON.stringify({
    postDuration : moment.duration(5, 'm')
}); // '{"postDuration":"PT5M"}'
```

Invalid durations return `Invalid Date` as json representation.
