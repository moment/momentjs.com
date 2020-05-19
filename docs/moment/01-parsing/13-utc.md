---
title: UTC
version: 1.5.0
signature: |
  moment.utc();
  moment.utc(Number);
  moment.utc(Number[]);
  moment.utc(String);
  moment.utc(String, String);
  moment.utc(String, String[]);
  moment.utc(String, String, String);
  moment.utc(String, String, String[]);
  moment.utc(String, String, Boolean);
  moment.utc(String, String, String, Boolean);
  moment.utc(Moment);
  moment.utc(Date);
---


By default, moment parses and displays in local time.

If you want to parse or display a moment in UTC, you can use `moment.utc()` instead of `moment()`.

This brings us to an interesting feature of Moment.js. UTC mode.

While in UTC mode, all display methods will display in UTC time instead of local time.

```javascript
moment().format();     // 2013-02-04T10:35:24-08:00
moment.utc().format(); // 2013-02-04T18:35:24+00:00
```

Additionally, while in UTC mode, all getters and setters will internally use the `Date#getUTC*` and `Date#setUTC*` methods instead of the `Date#get*` and `Date#set*` methods.

```javascript
moment.utc().seconds(30).valueOf() === new Date().setUTCSeconds(30);
moment.utc().seconds()   === new Date().getUTCSeconds();
```

It is important to note that though the displays differ above, they are both the same moment in time.

```javascript
var a = moment();
var b = moment.utc();
a.format();  // 2013-02-04T10:35:24-08:00
b.format();  // 2013-02-04T18:35:24+00:00
a.valueOf(); // 1360002924000
b.valueOf(); // 1360002924000
```

Any moment created with `moment.utc()` will be in UTC mode, and any moment created with `moment()` will not.

To switch from UTC to local time, you can use [moment#utc](#/manipulating/utc/) or [moment#local](#/manipulating/local/).

```javascript
var a = moment.utc([2011, 0, 1, 8]);
a.hours(); // 8 UTC
a.local();
a.hours(); // 0 PST
```
