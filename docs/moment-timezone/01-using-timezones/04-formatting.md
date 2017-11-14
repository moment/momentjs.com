---
title: Formatting Additions
signature: |
  moment.tz(String).format("Z z"); // -08:00 PST
  moment.tz(String).zoneAbbr();    // PST
  moment.tz(String).zoneName();    // PST
---


In addition to including the `+00:00` formatting information, Moment Timezone also
includes information for the abbreviated time zone name.

```js
moment.tz([2012, 0], 'America/New_York').format('z');    // EST
moment.tz([2012, 5], 'America/New_York').format('z');    // EDT
moment.tz([2012, 0], 'America/Los_Angeles').format('z'); // PST
moment.tz([2012, 5], 'America/Los_Angeles').format('z'); // PDT
```

Note that these abbreviations may change depending on the time zone offset. This helps to
distinguish offsets between places that may or may not use DST.

```js
// Denver observes DST
moment.tz([2012, 0], 'America/Denver').format('Z z');  // -07:00 MST
moment.tz([2012, 5], 'America/Denver').format('Z z');  // -06:00 MDT
// Phoenix does not observe DST
moment.tz([2012, 0], 'America/Phoenix').format('Z z'); // -07:00 MST
moment.tz([2012, 5], 'America/Phoenix').format('Z z'); // -07:00 MST
```

Note also that these abbreviations are not globally unique. Below, you can see that
both United States Central Standard Time and China Standard Time have the same abbreviation.

```js
moment.tz('2016-01-01', 'America/Chicago').format('z');    // CST
moment.tz('2016-01-01', 'Asia/Shanghai').format('z');      // CST
```

You can also use `moment#zoneAbbr` to get the zone abbreviation. This is what
moment.js uses when formatting the `z` token.

```js
moment.tz([2012, 0], 'America/New_York').zoneAbbr(); // EST
moment.tz([2012, 5], 'America/New_York').zoneAbbr(); // EDT
```

Moment.js also provides a hook for the long form time zone name. Because these strings
are generally localized, Moment Timezone does not provide any long names for zones.

To provide long form names, you can override `moment.fn.zoneName` and use the `zz` token.

```js
var abbrs = {
    EST : 'Eastern Standard Time',
    EDT : 'Eastern Daylight Time',
    CST : 'Central Standard Time',
    CDT : 'Central Daylight Time',
    MST : 'Mountain Standard Time',
    MDT : 'Mountain Daylight Time',
    PST : 'Pacific Standard Time',
    PDT : 'Pacific Daylight Time',
};

moment.fn.zoneName = function () {
    var abbr = this.zoneAbbr();
    return abbrs[abbr] || abbr;
};

moment.tz([2012, 0], 'America/New_York').format('zz');    // Eastern Standard Time
moment.tz([2012, 5], 'America/New_York').format('zz');    // Eastern Daylight Time
moment.tz([2012, 0], 'America/Los_Angeles').format('zz'); // Pacific Standard Time
moment.tz([2012, 5], 'America/Los_Angeles').format('zz'); // Pacific Daylight Time
```

Please note that the `z` formatting token will not always show the abbreviated time zone name, instead, will show the time offsets for each region.

```js
moment.tz('America/Los_Angeles').format('z')  // "PDT"     (abbreviation)
moment.tz('Asia/Magadan').format('z')         // "+11"     (3-char offset)
moment.tz('Asia/Colombo').format('z')         // "+0530"   (5-char offset)
```
