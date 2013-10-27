```javascript
require.config({
    paths: {
        "moment": "path/to/moment",
    }
});
define(["moment"], function (moment) {
    moment().format();
});
```

Moment will still create a `moment` global, which is useful to plugins and other third-party code. If you wish to squash that global, use the `noGlobal` option on the module config.

```javascript
require.config({
  noGlobal: true
});
```

If you don't specify `noGlobal` then the globally exported moment will print
a deprecation warning. From next major release you'll have to export it
yourself if you want that behavior.
