---
title: Twix
signature: |
  npm install twix
---


Another range plugin is Isaac Cambron's library `Twix`. It has many
range-related features and excels at formatting ranges readably. For example,

```javascript
var t = moment("1/25/1982 9:30 AM").twix("1/25/1982 1:30 PM");
t.isCurrent(); // false
t.count('minutes'); // 241
t.format();  // 'Jan 25, 1982, 9:30 AM - 1:30 PM'
t.simpleFormat("h:m"); // '9:30 - 1:30'
```

Full documentation of all the options and features is [here](http://icambron.github.io/twix.js).

It's available on npm like so:

```
npm install twix
```

Or just grab the JS file from [here](https://raw.github.com/icambron/twix.js/master/dist/twix.js).
