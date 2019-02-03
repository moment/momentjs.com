---
title: Unpacked Format
---

The unpacked format looks exactly like the [zone object](#/zone-object/).

The data below is for Los Angeles between 2014 and 2018.

<!-- skip-example -->

```js
{
	name    : 'America/Los_Angeles',
	abbrs   : ['PST', 'PDT','PST', 'PDT', 'PST', 'PDT', 'PST', 'PDT', 'PST', 'PDT', 'PST'],
	untils  : [1394359200000, 1414918800000, 1425808800000, 1446368400000, 1457863200000, 1478422800000, 1489312800000, 1509872400000, 1520762400000, 1541322000000, null],
	offsets : [480, 420, 480, 420, 480, 420, 480, 420, 480, 420, 480]
}
```

The lengths of `abbrs, untils, offsets` are all the same. The `offset` and `abbr` at
any index are only active while the timestamp is less than the `until` at that index.

An easy way to read this aloud is *"between `untils[n-1]` and `untils[n]`, the abbr should be `abbrs[n]` and
the offset should be `offsets[n]`"*.

Note that `untils` are measured in milliseconds and `offsets` are measured in minutes.
