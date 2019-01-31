---
title: Create Links
signature: |
  moment.tz.createLinks(UnpackedBundle); // UnpackedBundle
---

In order to reduce duplication, we can create links out of two zones that share data.

<!-- skip-example -->

```js
var unlinked = {
    zones : [
        {name:"Zone/One",abbrs:["OST","ODT"],offsets:[60,120],untils:[403041600000,417034800000]},
        {name:"Zone/Two",abbrs:["OST","ODT"],offsets:[60,120],untils:[403041600000,417034800000]}
    ],
    links : [],
    version : "2014x-doc-example"
};

moment.tz.createLinks(unlinked);

{
    zones : [
        {name:"Zone/One",abbrs:["OST","ODT"],offsets:[60,120],untils:[403041600000,417034800000]}
    ],
    links : ["Zone/One|Zone/Two"],
    version : "2014x-doc-example"
}
```

This is especially useful when combined with `moment.tz.filterYears`, as older rules
that would have differentiated two Zones may not be in the filtered year range,
allowing them to be linked to save space.
