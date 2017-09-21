---
title: Parse Date Format
signature: |
  npm install moment-parseformat
---


This plugin extracts the format of a date/time string. 

```javascript
var format = moment.parseFormat('Thursday, February 6th, 2014 9:20pm');
// dddd, MMMM Do, YYYY h:mma
moment().format(format); // format
```

That allows to create smart date inputs that let your users set a
Date/Time and lets you extract the user's preferred format for future usage.
Find an example usage of it at [minutes.io](https://minutes.io/new/Meeting).

The Plugin has been authored by [@gr2m](https://github.com/gr2m).
Links: [Demo](http://gr2m.github.io/moment-parseformat/) |
[Source](https://github.com/gr2m/moment.parseFormat)
