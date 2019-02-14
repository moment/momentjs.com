---
title: Minutes
version: 1.6.0
signature: |
  moment.duration().minutes();
  moment.duration().asMinutes();
---


As with the other getters for durations, `moment.duration().minutes()` gets the minutes (0 - 59).

`moment.duration().asMinutes()` gets the length of the duration in minutes.

Note that both `moment.duration().minutes()` and `moment.duration().asMinutes()` return output that does not meet the ISO 8601 *nominal duration* or the RFC 5545 *duration* standards.
