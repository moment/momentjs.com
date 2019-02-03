---
title: Zone Object
---

In order to match a timestamp to an offset, Moment Timezone uses a `Zone` object.

Though you shouldn't even need to use it, this object's constructor is available
on the `moment.tz.Zone` namespace.

This object has 4 properties.

<!-- skip-example -->

```js
{
	name    : 'America/Los_Angeles',          // the unique identifier
	abbrs   : ['PDT', 'PST'],                 // the abbreviations
	untils  : [1414918800000, 1425808800000], // the timestamps in milliseconds
	offsets : [420, 480]                      // the offsets in minutes
}
```
