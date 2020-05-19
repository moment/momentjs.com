---
title: Guessing user zone
signature: |
  moment.tz.guess();
  moment.tz.guess(Boolean);
---


Moment Timezone uses the Internationalization API (`Intl.DateTimeFormat().resolvedOptions().timeZone`) in [supported browsers](http://caniuse.com/#feat=internationalization) to determine the user's time zone.

On other browsers, time zone detection is rather tricky to get right, as there is little information provided by those browsers. For those, it will use `Date#getTimezoneOffset` and `Date#toString` on a handful of moments around the current year to gather as much information about the browser environment as possible. It then compares that information with all the time zone data loaded and returns the closest match. In case of ties, the time zone with the city with largest population is returned.

By default Moment Timezone caches the detected timezone. This means that subsequent calls to `moment.tz.guess()` will always return the same value.

You can call `moment.tz.guess()` with an optional boolean argument "ignoreCache". If set to true, the cache will be ignored and overwritten with the new value.

```js
moment.tz.guess(); // America/Chicago
// suppose the client's timezone changes to Europe/Berlin
moment.tz.guess(); // America/Chicago
moment.tz.guess(true); // Europe/Berlin
moment.tz.guess(); // Europe/Berlin
```
