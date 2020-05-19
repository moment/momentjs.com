---
title: Durations
---


Moment.js also has duration objects. Where a moment is defined as a single point in time, a duration is defined as a length of time.

Durations do not have a defined beginning and end date. They are contextless.

A duration is conceptually more similar to '2 hours' than to 'between 2 and 4 pm today'. As such, they are not a good solution to converting between units that depend on context.

For example, a year can be defined as 366 days, 365 days, 365.25 days, 12 months, or 52 weeks. Trying to convert years to days makes no sense without context. It is much better to use `moment#diff` for calculating days or years between two moments than to use `Durations`.

As [discussed here](https://github.com/moment/moment/issues/4815), the duration format for Moment.js differs very slightly from the specifications for ISO 8601 nominal duration and RFC 5545 duration.
