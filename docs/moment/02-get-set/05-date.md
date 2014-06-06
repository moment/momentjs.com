---
title: Date of Month
version: 1.0.0
signature: |
  moment().date(Number);
  moment().date(); // Number
  moment().dates(Number);
  moment().dates(); // Number
---


Gets or sets the day of the month.

Accepts numbers from 1 to 31. If the range is exceeded, it will bubble up to the months.

**Note:** `Moment#date` is for the date of the month, and `Moment#day` is for the day of the week.
