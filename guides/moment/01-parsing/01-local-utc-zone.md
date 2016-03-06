---
title: Local vs UTC vs Offset
---

Moment offers three functions for parsing dates, the basic moment function, moment.utc, and moment.parseZone.

If your date is in the user's local time, use the moment function:

```js
moment('2016-01-01T23:35:01');
```
This results in a date with a UTC offset that is the same as the local computer:
"2016-01-01T23:35:01-06:00"

If your date is in UTC, use moment.utc:
```js
moment.utc('2016-01-01T23:35:01');
```
This results in a date with a utc offset of +0:00:

"2016-01-01T23:35:01+00:00"

If your date format has a fixed timezone offset, use moment.parseZone:

```javascript
moment.parseZone("2013-01-01T00:00:00-13:00");
```
This results in a date with a fixed offset:

"2013-01-01T00:00:00-13:00"

