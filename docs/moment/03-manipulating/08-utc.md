---
title: UTC
version: 1.5.0
signature: |
  moment().utc();
  moment().utc(Boolean); // from 2.8.0
---


Sets a flag on the original moment to use UTC to display a moment instead of the original moment's time.

```javascript
var a = moment([2011, 0, 1, 8]);
a.hours(); // 8 PST
a.utc();
a.hours(); // 16 UTC
```

UTC can also be used to convert out of a fixed offset mode:

```javascript
moment.parseZone('2016-05-03T22:15:01+02:00').utc().format(); //"2016-05-03T20:15:01Z"
```

Passing `true` will change the time zone without changing the current time.

```javascript
moment.parseZone('2016-05-03T22:15:01+02:00').utc(true).format(); //"2016-05-03T22:15:01Z"
```

See [moment.utc()](#/parsing/utc/) for more information on UTC mode.
