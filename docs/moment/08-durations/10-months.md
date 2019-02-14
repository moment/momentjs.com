---
title: Months
version: 1.6.0
signature: |
  moment.duration().months();
  moment.duration().asMonths();
---


As with the other getters for durations, `moment.duration().months()` gets the months (0 - 11).

`moment.duration().asMonths()` gets the length of the duration in months.

Note that both `moment.duration().months()` and `moment.duration().asMonths()` return output that does not meet the ISO 8601 *nominal duration* or the RFC 5545 *duration* standards.
