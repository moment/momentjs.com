---
title: Timing of DST Jumps
---

Time zones that use daylight saving time (DST) vary about when they implement the time jumps.
You shouldn't assume that the rules you're familiar with from a local time zone translate to other zones.

One difference that often catches out developers is that some zones change clocks at midnight.
A good example comes from Jordan (`Asia/Amman`) in 2021:

* One second after `2021-03-25 23:59:59` was `2022-03-26 01:00:00` (DST started).
* One second after `2021-10-29 00:59:59` was `2022-10-29 00:00:00` (DST stopped).

This creates the situation where midnight at the start of March 26 **didn't happen**, while midnight on October 29 happened twice.

Moment Timezone accounts for these oddities as described in the ["Parsing Ambiguities" documentation](/timezone/docs/#/using-timezones/parsing-ambiguous-inputs/).
But applications can still have bugs when they make other assumptions about time jumps, especially regarding the start of a day.
So be aware that **a day doesn't always start at midnight**.
