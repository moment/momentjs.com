---
title: First Day of Week and First Week of Year
version: 1.0.0
signature: |
  // From 2.12.0 onward
  moment.updateLocale('en', {
      week : {
          dow : Int,
          doy : Int
       }
  });
  // From 2.8.1 to 2.11.2
  moment.locale('en', {
      week : {
          dow : Int,
          doy : Int
      }
  });

  // Deprecated in 2.8.1
  moment.lang('en', {
      week : {
          dow : Int,
          doy : Int
      }
  });
---

`Locale#week.dow` should be an integer representing the first day of the week, 0 is Sunday, 1 is Monday, ..., 6 is Saturday.

`Locale#week.doy` should be an integer. `doy` is used together with `dow` to determine the first week of the year. `doy` is calculated as `7 + dow - janX`, where `janX` is the first day of January that must belong to the first week of the year.

```javascript
// ISO-8601, Europe
moment.updateLocale("en", { week: {
  dow: 1, // First day of week is Monday
  doy: 4  // First week of year must contain 4 January (7 + 1 - 4)
}});

// US, Canada
moment.updateLocale("en", { week: {
  dow: 0, // First day of week is Sunday
  doy: 6  // First week of year must contain 1 January (7 + 0 - 1)
}});

// Many Arab countries
moment.updateLocale("en", { week: {
  dow: 6, // First day of week is Saturday
  doy: 12 // First week of year must contain 1 January (7 + 6 - 1)
}});

// Also common
moment.updateLocale("en", { week: {
  dow: 1, // First day of week is Monday
  doy: 7  // First week of year must contain 1 January (7 + 1 - 1)
}});
```
