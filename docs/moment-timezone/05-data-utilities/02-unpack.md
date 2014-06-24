---
title: Unpack
signature: |
  moment.tz.unpack(PackedString); // UnpackedObject
---

This converts data in the [packed format](#/data-formats/packed-format/)
to the [unpacked format](#/data-formats/unpacked-format/).

```js
var packed = "Indian/Mauritius|LMT MUT MUST|-3O -40 -50|012121|-2xorO 34unO 14L0 12kr0 11z0";

moment.tz.unpack(packed);
// {
//     name    : 'Indian/Mauritius',
//     abbrs   : ['LMT', 'MUT', 'MUST', 'MUT', 'MUST', 'MUT'],
//     offsets : [-230, -240, -300, -240, -300, -240],
//     untils  : [-1988164200000, 403041600000, 417034800000, 1224972000000, 1238274000000, null]
// };
```