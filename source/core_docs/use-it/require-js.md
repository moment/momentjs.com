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

For version `2.5.x`, in case you use other plugins that rely on Moment but are
not AMD-compatible you may need to add [`wrapShim:
true`](https://github.com/jrburke/r.js/blob/b8a6982d2923ae8389355edaa50d2b7f8065a01a/build/example.build.js#L68-L78)
to your r.js config.
