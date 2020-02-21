---
title: Getting Zones for country
signature: |
  moment.tz.zonesForCountry(String); // String[]
  moment.tz.zonesForCountry(String, { offset: true });
---

To get a list of time zones for some country, use `moment.tz.zonesForCountry()`.

```js
moment.tz.zonesForCountry('US');
```

By default this method returns zone names sorted alphabetically:

```js
["America/Adak", "America/Anchorage", ... "Pacific/Honolulu"]
```

To get also offsets, pass `{ offset: true }` as 2nd parameter:

```js
moment.tz.zonesForCountry('US', { offset: true });
```

it returns array of objects with name and offset:

```js
[
  { name: "America/Adak", offset: 600 },
  { name: 'America/Anchorage', offset: 540 },
  ...
  { name: "America/New_York", offset: 300 },
  ...,
  { name: 'Pacific/Honolulu', offset: 600 }
]
```

It's useful if you need to sort time zones by offset.

All country codes can be retrieved using method `moment.tz.countries()`
