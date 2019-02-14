---
title: Hours
version: 1.6.0
signature: |
  moment.duration().hours();
  moment.duration().asHours();
---


As with the other getters for durations, `moment.duration().hours()` gets the hours (0 - 23).

`moment.duration().asHours()` gets the length of the duration in hours.

Note that both `moment.duration().hours()` and `moment.duration().asHours()` return output that does not meet the ISO 8601 *nominal duration* or the RFC 5545 *duration* standards.
