---
title: Getting Zones for country
signature: |
  moment.tz.zonesForCountry(String); // String[]
  moment.tz.zonesForCountry(String, Boolean);
---

To get a list of time zones for some country, use `moment.tz.zonesForCountry()`.

```js
moment.tz.zonesForCountry('US');
```

By default this method returns zone names sorted alphabetically:

```js
["America/Adak", "America/Anchorage", ... "Pacific/Honolulu"]
```

To get also offsets, pass `true` as 2nd parameter:

```js
moment.tz.zonesForCountry('CN', true);
```

it returns array of objects with name and offset:

```js
[
   { name: "Asia/Shanghai", offset: -480 },
   { name: "Asia/Urumqi", offset: -360 }
]
```

It's useful if you need to sort time zones by offset.

All country codes can be retrieved using method `moment.tz.countries()`
