---
title: Weeks
version: 1.6.0
signature: |
  moment.duration().weeks();
  moment.duration().asWeeks();
---


As with the other getters for durations, `moment.duration().weeks()` gets the weeks (0 - 4).

`moment.duration().asWeeks()` gets the length of the duration in weeks.

Pay attention that unlike the other getters for duration, weeks are counted as a subset of the days, and are not taken off the days count.

**Note:** The length of a duration in weeks is defined as 7 days.

Also note that both `moment.duration().weeks()` and `moment.duration().asWeeks()` return output that does not meet the ISO 8601 *nominal duration* or the RFC 5545 *duration* standards.
