---
title: Local vs UTC vs Offset
---

Moment offers three functions for parsing dates, the basic moment function, moment.utc, and moment.parseZone.

If you wish to interact with a date in the context of the user's local time, use the moment function.

```js
moment('2016-01-01T23:35:01');
```
This results in a date with a UTC offset that is the same as the local computer:

"2016-01-01T23:35:01-06:00"

If you wish to interact with the date as a UTC date, use moment.utc:
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

Note that if you use moment() or moment.utc() to parse a date with a specified offset, the date will be converted from that offset to either local or UTC:

This date is shifted by 8 hours, moving from +2 to -6 (the offset of the local machine)
```javascript
moment('2016-01-01T00:00:00+02:00').format()
"2015-12-31T16:00:00-06:00"
```

This date is shifted by 2 hours, moving from +2 to UTC
```javascript
moment.utc('2016-01-01T00:00:00+02:00').format()
"2015-12-31T22:00:00+00:00"
```