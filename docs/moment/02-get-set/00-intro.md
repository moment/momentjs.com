---
title: Get + Set
---


Moment.js uses overloaded getters and setters. You may be familiar with this pattern from its use in jQuery.

Calling these methods without parameters acts as a getter, and calling them with a parameter acts as a setter.

These map to the corresponding function on the native `Date` object.

```javascript
moment().seconds(30).valueOf() === new Date().setSeconds(30);
moment().seconds()   === new Date().getSeconds();
```

If you are in [UTC mode](#/manipulating/utc/), they will map to the UTC equivalent.

```javascript
moment.utc().seconds(30).valueOf() === new Date().setUTCSeconds(30);
moment.utc().seconds()   === new Date().getUTCSeconds();
```

For convenience, both singular and plural method names exist as of version **2.0.0**.

**Note:** All of these methods mutate the original moment when used as setters.

**Note:** From **2.19.0** passing `NaN` to any setter is a no-op. Before
**2.19.0** it was invalidating the moment in a wrong way.
