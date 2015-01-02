---
title: Is Leap Year
version: 1.0.0
signature: |
  moment().isLeapYear();
---


`moment#isLeapYear` returns `true` if that year is a leap year, and `false` if it is not.

```javascript
moment([2000]).isLeapYear() // true
moment([2001]).isLeapYear() // false
moment([2100]).isLeapYear() // false
```
