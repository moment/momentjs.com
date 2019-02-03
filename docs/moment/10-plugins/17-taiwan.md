---
title: Taiwan Calendar
signature: |
  npm install moment-taiwan
---


If you want to work with Taiwan calendar system , you can use Bradwoo8621's plugin `moment-taiwan`.

When installed, it will wrap `moment` and moment will be able to format and parse Taiwan years. Here is a short example:

```js
m = moment('104/01/01', 'tYY/MM/DD') // Parse a Taiwan date
m.format('tYY/MM/DD [is] YYYY/M/D') // 104/01/01 is 2015/01/01

m.twYear() // 104
```

The repository is located at [github.com/bradwoo8621/moment-taiwan](https://github.com/bradwoo8621/moment-taiwan).
