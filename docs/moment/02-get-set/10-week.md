---
title: Week of Year
version: 2.0.0
signature: |
  moment().week(Number);
  moment().week(); // Number
  moment().weeks(Number);
  moment().weeks(); // Number
---


Gets or sets the week of the year.

Because different locales define week of year numbering differently, Moment.js added `moment#week` to get/set the localized week of the year.

The week of the year varies depending on which day is the first day of the week (Sunday, Monday, etc), and which week is the first week of the year.

For example, in the United States, Sunday is the first day of the week. The week with January 1st in it is the first week of the year.

In France, Monday is the first day of the week, and the week with January 4th is the first week of the year.

The output of `moment#week` will depend on the [locale](#/i18n) for that moment.

When setting the week of the year, the day of the week is retained.
