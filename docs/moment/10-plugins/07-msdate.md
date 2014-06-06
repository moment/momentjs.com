---
title: MSDate
---


If you are using OLE Automation dates in .NET check out Markit On Demand's `moment-msdate`. Using this plugin allows you to format OA dates into JavaScript dates and vice-versa.

Convert a `moment` to an OA date:

```javascript
moment().toOADate(); // a floating point number
```

Or, convert an OA date to a `moment`:

```javascript
moment.fromOADate(41493); // Wed Aug 07 2013 00:00:00 GMT-0600 (MDT)
```

More information and detailed docs can be found on GitHub at [http://markitondemand.github.io/moment-msdate/](http://markitondemand.github.io/moment-msdate/).
