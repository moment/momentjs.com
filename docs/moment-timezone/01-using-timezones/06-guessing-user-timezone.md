---
title: Guessing user zone
signature: |
  moment.tz.guess();
---


Browser time zone detection is rather tricky to get right, as there is little information provided by the browser.

Moment Timezone uses `Date#getTimezoneOffset` and `Date#toString` on a handful of moments around the current year to gather as much information about the browser environment as possible. It then compares that information with all the time zone data loaded and returns the closest match. In case of ties, the time zone with the city with largest population is returned.

```js
moment.tz.guess(); // America/Chicago
```
