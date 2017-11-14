---
title: Timer
signature: |
  npm install moment-timer
---


This is a Moment.js plugin that allows the use of timers, which offer much more control than the native JavaScript timers.
It's basically a rewrite of JavaScripts own setInterval and setTimeout.

For example,

```javascript
var timer = moment.duration(5, "seconds").timer({loop: true}, function() {
  // Callback
});
```

The repository is located at [github.com/SeverinDK/moment-timer](https://github.com/SeverinDK/moment-timer).
