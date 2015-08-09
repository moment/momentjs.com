---
title: As JSON
version: 2.0.0
signature: |
  moment().toJSON();
---


When serializing an object to JSON, if there is a `Moment` object, it will be represented as an ISO8601 string, adjusted to UTC.

```javascript
JSON.stringify({
    postDate : moment()
}); // '{"postDate":"2013-02-04T22:44:30.652Z"}'
```

If instead you would like an ISO8601 string that reflects the moment's `utcOffset()`, then you can modify the `toJSON` function like this:

```javascript
moment.fn.toJSON = function() { return this.format(); }
```

This changes the behavior as follows:

```javascript
JSON.stringify({
    postDate : moment()
}); // '{"postDate":"2013-02-04T14:44:30-08:00"}'
```
