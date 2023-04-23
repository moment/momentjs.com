---
title: Data Source
---

All time zone data in Moment Timezone comes from the [IANA Time Zone Database ("tzdb")](https://www.iana.org/time-zones).
Moment Timezone consumes the default data directly from the tzdb, using only the published releases.
The only changes the library makes are to convert the data to a [custom JSON format](/timezone/docs/#/data-formats/), and optionally restrict how many years of data to use.

Any pull requests that make changes to the compiled data files _without_ being derived from a tzdb release will be rejected.

If you think that the data used by Moment Timezone is incorrect, the ideal order of actions to follow is:

1. Make sure you've upgraded to the latest version of the library. We try to closely track the tzdb releases, so upgrading Moment Timezone resolves most cases of out-of-date data.
2. For data calculation problems, raise an issue in the [Moment Timezone issue tracker](https://github.com/moment/moment-timezone/issues).
3. For other problems (such as creating a new zone definition), search the [archives of the tzdb mailing list](https://mm.icann.org/pipermail/tz/). It's probable that new data changes or zone definitions are already being discussed, but haven't made it to a published release yet.
4. If there is nothing in the tzdb archives, send a message to the mailing list at <a href="mailto:tz@iana.org">tz@iana.org</a>.
