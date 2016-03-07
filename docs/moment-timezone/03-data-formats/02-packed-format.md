---
title: Packed Format
---

The packed format represents an unpacked zone in a single string.

The data below is for Los Angeles between 2014 and 2018. More time zones can be seen [here](https://github.com/moment/moment-timezone/blob/develop/data/packed/latest.json)

```js
'America/Los_Angeles|PST PDT|80 70|01010101010|1Lzm0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0'
```

In order to save as many bytes as possible, we used a very compact format to store the data.

The data is split into 5 sections separated by pipes.


| # | Type                   | Example                       |
|---|------------------------|-------------------------------|
| 0 | Name                   | `America/Los_Angeles`
| 1 | Abbr Map               | `PST PDT`
| 2 | Offset Map             | `80 70`
| 3 | Abbr/Offset&nbsp;Index | `01010101010`
| 4 | Timestamp Diff         | `1Lzm0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0`

**Name:** The canonical name of the time zone.

**Abbr Map:** A space separated list of all the abbreviations ever used in this time zone.

**Offset Map:** A space separated list of all the offsets ever used in this time zone in minutes in base 60.

**Abbr/Offset Index:** A tightly packed array of indices into the offset and abbr maps. These are also in base 60.

**Timestamp Diffs:** This is where the timestamps are stored.

Because we are dealing with a sorted list of timestamps, we just store the
diff from the last timestamps rather than storing the full timestamps.

The first item in the array is a unix timestamp in minutes.
All items after the first item are numbers of minutes to be added
to the previous value during unpacking. All items are stored in base 60.

As you may have seen from the example above, the timestamp diffs tend to duplicate
the same values from year to year. These duplications allow gzip to compress the
data even further than if we used full timestamps.

### Base 60?

You may be wondering why base 60 is used. Base 62 is a fairly common tool for ascii
data compression, using `a-z` to represent `10-35` and `A-Z` to represent `36-61`.

While it may have saved a few bytes to use base 62, much of the data
in Moment Timezone maps nicely to multiples of 60.

There are 60 minutes in an hour and 60 seconds in a minute. 3 hours is `30`
minutes in base 60 and `300` seconds in base 60 instead of `180` and `10800` in
base 10 or `2U` and `2Oc` in base 62.
