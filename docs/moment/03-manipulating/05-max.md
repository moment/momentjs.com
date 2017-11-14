---
title: Maximum
version: 2.1.0-2.7.0
signature: |
  moment().max(Moment|String|Number|Date|Array);
---

**Note:** This function has been **deprecated** in **2.7.0**. Consider [`moment.min`](/docs/#/get-set/min/) instead.

------

Limits the moment to a maximum of another moment value. So `a.max(b)` is the same as `a = moment.min(a, b)` (note that `max` is converted to `min`).

Sometimes, server clocks are not quite in sync with client clocks. This ends up displaying humanized strings such as "in a few seconds" rather than "a few seconds ago". You can prevent that with `moment#max()`:

This is the counterpart for `moment#min`.

```javascript
var momentFromServer = moment(input);
var clampedMoment = momentFromServer.max();
```

You can pass anything to `moment#max` that you would pass to `moment()`.

```javascript
moment().max(moment().add(1, 'd'));
moment().max("2013-04-20T20:00:00+0800");
moment().max("Jan 1 2001", "MMM D YYYY");
moment().max(new Date(2012, 1, 8));
```
