---
title: Days
version: 1.6.0
signature: |
  moment.duration().days();
  moment.duration().asDays();
---


As with the other getters for durations, `moment.duration().days()` gets the days (0 - 30).

`moment.duration().asDays()` gets the length of the duration in days.

Note that both `moment.duration().days()` and `moment.duration().asDays()` return output that does not meet the ISO 8601 *nominal duration* or the RFC 5545 *duration* standards.
