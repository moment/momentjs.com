You can create a moment from a string that can be parsed by `Date.parse`.

```javascript
var day = moment("Dec 25, 1995");
```

Browser support for this is inconsistent. If you are not getting consistent results, you can try using String + Format.

If you are trying to parse an ISO-8601 string, the following formats are supported across all browsers.

```javascript
"YYYY-MM-DD"
"YYYY-MM-DDTHH"
"YYYY-MM-DDTHH:mm"
"YYYY-MM-DDTHH:mm:ss"
"YYYY-MM-DDTHH:mm:ss Z"
```

**Note:** Automatic cross browser ISO-8601 support was added in version <span class="label">1.5.0</span>

If there are errors when parsing, `moment.fn.isValid` will return false.

```javascript
moment("not a real date").isValid(); // false
```
