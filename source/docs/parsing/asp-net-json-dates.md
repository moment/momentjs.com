ASP.NET returns dates in json in the following formats: `/Date(1198908717056)/` or `/Date(1198908717056-0700)/`

If a string that matches this format is passed in, it will be parsed correctly.

```javascript
moment("/Date(1198908717056-0700)/").valueOf(); // 1198908717056
```
