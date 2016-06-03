---
title: Hijri Calendar
signature: |
  npm install moment-hijri
---


If you want to work with Hijri calendar then you can use `moment-hijri` plugin. `moment-hijri` is a moment plugin for the Hijri lunar calendar based on [Umm al-Qura](http://www.ummulqura.org.sa/) calculations. This plugin is developed by [Suhail Alkowaileet](https://github.com/xsoh).

When you install it, it will wrap `moment` and you will be able to parse Hijri dates. Here is a short example:

```js
m = moment('1410/8/28', 'iYYYY/iM/iD'); // Parse a Hijri date.
m.format('iYYYY/iM/iD [is] YYYY/M/D'); // 1410/8/28 is 1990/3/25
```

The repository is located at [github.com/xsoh/moment-hijri](https://github.com/xsoh/moment-hijri).
