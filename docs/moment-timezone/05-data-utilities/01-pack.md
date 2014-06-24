---
title: Pack
signature: |
  moment.tz.pack(UnpackedObject); // PackedString
---

This converts data in the [unpacked format](#/data-formats/unpacked-format/)
to the [packed format](#/data-formats/packed-format/).

```js
var unpacked = {
	name    : 'Indian/Mauritius',
	abbrs   : ['LMT', 'MUT', 'MUST', 'MUT', 'MUST', 'MUT'],
	offsets : [-230, -240, -300, -240, -300, -240],
	untils  : [-1988164200000, 403041600000, 417034800000, 1224972000000, 1238274000000, null]
};
moment.tz.pack(unpacked); // "Indian/Mauritius|LMT MUT MUST|-3O -40 -50|012121|-2xorO 34unO 14L0 12kr0 11z0"
```