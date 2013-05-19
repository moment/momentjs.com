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
