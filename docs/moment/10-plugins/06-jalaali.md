---
title: Jalaali Calendar
signature: |
  npm install moment-jalaali
---


If you want to work with Jalaali calendar system (Jalali, Persian, Khorshidi or Shamsi), you can use Behrang Noruzi Niya's plugin `moment-jalaali`.

When installed, it will wrap `moment` and moment will be able to format and parse Jalaali years and months. Here is a short example:

```js
var m = moment('1360/5/26', 'jYYYY/jM/jD'); // Parse a Jalaali date.
m.format('jYYYY/jM/jD [is] YYYY/M/D'); // 1360/5/26 is 1981/8/17
```

The repository is located at [github.com/behrang/moment-jalaali](https://github.com/behrang/moment-jalaali).
