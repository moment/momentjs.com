---
title: Local
version: 1.5.0
signature: |
  moment().local();
  moment().local(Boolean); // from 2.8.0
---


Sets a flag on the original moment to use local time to display a moment instead of the original moment's time.

```javascript
var a = moment.utc([2011, 0, 1, 8]);
a.hours(); // 8 UTC
a.local();
a.hours(); // 0 PST
```

Local can also be used to convert out of a fixed offset mode:

```javascript
moment.parseZone('2016-05-03T22:15:01+02:00').local().format(); // "2016-05-03T15:15:01-05:00"
```

Passing `true` will change the time zone without changing the current time.

```javascript
moment.parseZone('2016-05-03T22:15:01+02:00').local(true).format(); //"2016-05-03T22:15:01-05:00"
```

See [moment.utc()](#/parsing/utc/) for more information on UTC mode.
