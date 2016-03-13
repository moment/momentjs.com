---
title: Forgiving Mode
---

While strict mode works better in most situations, forgiving mode can be very useful when the format of the string being passed to moment may vary.

A common scenario where forgiving mode is useful is in situations where a third party API is providing the date, and the date format for that API could change.
Suppose that an API starts by sending dates in 'YYYY-MM-DD' format, and then later changes to 'MM/DD/YYYY' format.

In strict mode, the following code results in 'Invalid Date' being displayed:
```js
moment('01/12/2016', 'YYYY-MM-DD', true).format()
"Invalid date"
```

In forgiving mode using a format string, you get a wrong date:
```js
moment('01/12/2016', 'YYYY-MM-DD').format()
"2001-12-20T00:00:00-06:00"
```

The wrong date scenario in forgiving mode is certainly less obvious to the user, but by that token could go unnoticed for a long time.

When choosing between strict and forgiving mode, it is important to consider whether it is more important that dates be accurate, or that dates never display as "Invalid Date".