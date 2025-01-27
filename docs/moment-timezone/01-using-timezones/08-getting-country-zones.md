---
title: Getting Zones for country
signature: |
  moment.tz.zonesForCountry(String); // String[]
  moment.tz.zonesForCountry(String, Boolean);
---

To get a list of time zones for some country, use `moment.tz.zonesForCountry()`.
This takes an [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1) two-letter country code.

```js
moment.tz.zonesForCountry('US');
```

By default this method returns zone names sorted alphabetically:

```js
["America/Adak", "America/Anchorage", ... "Pacific/Honolulu"]
```

To also get offsets, pass `true` as the 2nd parameter:

```js
moment.tz.zonesForCountry('CN', true);
```

In this case, it returns an array of objects with the zone's name and its offset for the **current date and time**.

```js
[
   { name: "Asia/Shanghai", offset: -480 },
   { name: "Asia/Urumqi", offset: -360 }
]
```

It's useful if you need to sort time zones by offset, but be aware that the offsets can change throughout the year.

All known country codes in the data can be retrieved using method `moment.tz.countries()`.

**Note:** Sometimes these methods might return unexpected data.
See the [Countries and Zones guide](/timezone/guides/#/data-calculations/country-zones/) for more details.
