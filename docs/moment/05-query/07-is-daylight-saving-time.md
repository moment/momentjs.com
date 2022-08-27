---
title: Is Daylight Saving Time
version: 1.2.0
signature: |
  moment().isDST();
---


`moment#isDST` checks if the current moment is in daylight saving time.

**NOTE**: This function is a HACK. moment has no way of knowing if a given time
is in actual DST or not. Some time changes in a zone are DST related, some are
not, and without complete timezone information it can't know.

Moment currently checks the winter and summer time, and if the offset matches
the summer offset (and summer off is different than winter off), then it
reports DST. This works in vast majority of cases, but as mentioned above, is
not "correct" and won't work for all cases. So don't come to us complaining.

Event moment-timezone (at moment of writing 0.5.37) doesn't support DST info
(i.e is the clock officially in DST at a given moment or not), so for things to
get better some new stuff (and tzdata bundling) has to happen in
moment-timezone.

```javascript
moment([2011, 2, 12]).isDST(); // false, March 12 2011 is not DST
moment([2011, 2, 14]).isDST(); // true, March 14 2011 is DST
// This example is for "en" locale: https://www.timeanddate.com/time/dst/2011.html
```

