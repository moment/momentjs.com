---
title: Twitter
---


If you're trying to format times for tweets like the way Twitter does, you can use the [moment.twitter](https://github.com/hijonathan/moment.twitter) plugin by [@hijonathan](https://github.com/hijonathan).

It's a simple way to display both short and long versions of human-readable timestamps.

```javascript
moment().subtract('hours', 5).twitter();
// 5 hours
```

Yes, it does smart pluralization.

```javascript
moment().subtract('hour', 1).twitter();
// 1 hour
```

Not short enough for you?

```javascript
moment().subtract('days', 6).twitterShort();
// 6d
```
