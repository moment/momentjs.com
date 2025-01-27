---
title: Limited Data Ranges
---

By default, Moment Timezone includes all the data from the IANA tzdb (see [Data Source](#/data-calculations/data-source/)).
This covers past data as far back as the 1800s for some zones, and future data up to the year 2499.
This is usually more data than required by most applications, so there are also some pre-built data bundles available with more limited year ranges.
These are listed on the [project homepage](/timezone) and the ["Where to use it" documentation](/timezone/docs/#/use-it)
(or you can use [utility functions](/timezone/docs/#/data-utilities/filter-years/) to create custom date ranges).

A question that often pops up with these limited bundles is: **What happens for dates outside the range of the data?**
For example, if the loaded data only covers 2012 to 2022, and a date is calculated for 2023, or 2010, what is the calculated UTC offset for that date?

Due to the structure of the [data format](/timezone/docs/#/data-formats/), the time zone rules at the boundaries of the data range are
assumed to extended infinitely into the past and future. This produces the following behaviour:

* For dates before the start of the data range, the first rule found in the data for that time zone is used.
* For dates after the end of the data range, the last rule found in the data for that time zone is used.

As an example, let's say a project is using a data file that covers only 2015 to 2025, and wants to calculate the time in Sydney, Australia some time in 2026.

* The zone `Australia/Sydney` has a base (standard) offset of `UTC+10:00` from April to September each year.
  Daylight Saving Time (DST) in Sydney applies from October to March, putting the offset at `UTC+11:00`.
* Since DST is active when a year ends, and therefore when the data range ends, the DST offset will be used for all future dates.
* Therefore, calculating a date in 2026 from January to March will get an offset of `UTC+11:00`. This is correct, but only _by accident_.
  Calculating a date after March in 2026 will still get an offset of `UTC+11:00`, even though the real value should be `UTC+10:00`.
  This is when bugs will start to appear.

The best fix for these calculation problems is to make sure you're using a data range that covers all the dates your project needs.
