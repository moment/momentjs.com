---
title: Adding a Zone
signature: |
  moment.tz.add(PackedZoneString)
  moment.tz.add(PackedZoneString[])
---

To add zone data to Moment Timezone, use `moment.tz.add`.

```js
moment.tz.add('America/Los_Angeles|PST PDT|80 70|0101|1Lzm0 1zb0 Op0');
```

To add more than one zone, pass an array of packed data.

```js
moment.tz.add([
	'America/Los_Angeles|PST PDT|80 70|0101|1Lzm0 1zb0 Op0',
	'America/New_York|EST EDT|50 40|0101|1Lz50 1zb0 Op0'
]);
```
**Note: The above zone data is sample data and is not up to date.
Reference the [moment-timezone source](https://github.com/moment/moment-timezone/blob/develop/data/packed/latest.json) for up to date data.**