---
title: Time zone Offset
version: From 1.2.0, deprecated 2.9.0
signature: |
  moment().zone();
  moment().zone(Number|String);
---

**Note:** This function has been **deprecated** in **2.9.0**. Consider [`moment.fn.utcOffset`](/docs/#/manipulating/utc-offset/) instead.

Get the time zone offset in minutes.

```javascript
moment().zone(); // (60, 120, 240, etc.)
```

As of version **2.1.0**, it is possible to set the offset by passing in the number of minutes offset from GMT.

```javascript
moment().zone(120);
```

If the input is less than `16` and greater than `-16`, it will interpret your input as hours instead.

```javascript
// these are equivalent
moment().zone(480);
moment().zone(8);
```

It is also possible to set the zone from a string.

```javascript
moment().zone("-08:00");
```

`moment#zone` will search the string for the first match of `+00:00 +0000 -00:00 -0000`, so you can even pass an ISO8601 formatted string and the moment will be changed to that zone.

```javascript
moment().zone("2013-03-07T07:00:00-08:00");
```
