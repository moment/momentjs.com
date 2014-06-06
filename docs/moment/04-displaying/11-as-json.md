---
title: As JSON
version: 2.0.0
signature: |
  moment().toJSON();
---


When serializing an object to JSON, if there is a `Moment` object, it will be represented as an ISO8601 string.

```javascript
JSON.stringify({
    postDate : moment()
}); // {"postDate":"2013-02-04T22:44:30.652Z"}
```
