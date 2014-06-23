---
title: Data Utilities
---

Because of the complexity of the packed and unpacked data formats, Moment Timezone
has some heavily tested utility functions for working with the data.

Methods for unpacking data are included with the core library, as they are needed
in order to use the library.

Methods for packing and subsetting the data are included in an additional
`moment-timezone-utils.js` file. This file adds some more methods to the `moment.tz`
namespace.

```js
// in moment-timezone.js
moment.tz.unpack
moment.tz.unpackBase60
// in moment-timezone-utils.js
moment.tz.pack
moment.tz.packBase60
moment.tz.createLinks
moment.tz.filterYears
moment.tz.filterLinkPack
```
