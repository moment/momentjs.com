---
title: Seconds
version: 1.6.0
signature: |
  moment.duration().seconds();
  moment.duration().asSeconds();
---


To get the number of seconds in a duration, use `moment.duration().seconds()`.

It will return a number between 0 and 59.

```javascript
moment.duration(500).seconds(); // 0
moment.duration(1500).seconds(); // 1
moment.duration(15000).seconds(); // 15
```

If you want the length of the duration in seconds, use `moment.duration().asSeconds()` instead.

```javascript
moment.duration(500).asSeconds(); // 0.5
moment.duration(1500).asSeconds(); // 1.5
moment.duration(15000).asSeconds(); // 15
```
