---
title: Week Year
version: 2.1.0
signature: |
  moment().weekYear(Number);
  moment().weekYear(); // Number
---


Gets or sets the week-year according to the locale.

Because the first day of the first week does not always fall on the first day of the year, sometimes the week-year will differ from the month year.

For example, in the US, the week that contains Jan 1 is always the first week. In the US, weeks also start on Sunday. If Jan 1 was a Monday, Dec 31 would belong to the same week as Jan 1, and thus the same week-year as Jan 1. Dec 30 would have a different week-year than Dec 31.
