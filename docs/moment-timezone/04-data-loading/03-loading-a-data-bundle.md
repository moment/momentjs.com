---
title: Loading a Data Bundle
signature: |
  moment.tz.load({
      zones : [],
      links : [],
      version : '2014e'
  });
---

The data for Moment Timezone comes from [the IANA Time Zone Database](https://www.iana.org/time-zones).
New versions are released periodically as time zone laws change in various countries.

The versions are named after the year and an incrementing letter. `2014a 2014b 2014c...`

In order to keep versions together, Moment Timezone has a bundled object format as well.

<!-- skip-example -->

```js
{
	version : '2014e',
	zones : [
		'America/Los_Angeles|PST PDT|80 70|0101|1Lzm0 1zb0 Op0',
		'America/New_York|EST EDT|50 40|0101|1Lz50 1zb0 Op0'
	],
	links : [
		'America/Los_Angeles|US/Pacific',
		'America/New_York|US/Eastern'
	]
}
```

To load a bundle into Moment Timezone, use `moment.tz.load`.

<!-- skip-example -->

```js
moment.tz.load({
	version : '2014e',
	zones : [...],
	links : [...]
})
```
