You can create a moment from a string that can be parsed by `Date.parse`.

```javascript
var day = moment("Dec 25, 1995");
```

**Warning** Browser support for this is inconsistent. Because there is no specification on which formats should be supported, what works in some browsers will not work in other browsers.

For more consistent results, you should use [String + Format](#/parsing/string-format/).

There is one exception. Moment.js does detect if you are using an ISO-8601 string and will parse that correctly without a format string.

The following ISO-8601 formats are supported across all browsers.

```javascript
"YYYY-MM-DD"
"YYYY-MM-DDTHH"
"YYYY-MM-DD HH"
"YYYY-MM-DDTHH:mm"
"YYYY-MM-DD HH:mm"
"YYYY-MM-DDTHH:mm:ss"
"YYYY-MM-DD HH:mm:ss"
"YYYY-MM-DDTHH:mm:ss.SSS"
"YYYY-MM-DD HH:mm:ss.SSS"
"YYYY-MM-DDTHH:mm:ss Z"
"YYYY-MM-DD HH:mm:ss Z"
```

**Note:** Automatic cross browser ISO-8601 support was added in version **1.5.0**

If a string does not match any of the above formats and is not able to be parsed with `Date.parse`, `moment#isValid` will return false.

```javascript
moment("not a real date").isValid(); // false
```
