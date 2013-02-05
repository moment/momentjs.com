ASP.NET returns dates in JSON as `/Date(1198908717056)/` or `/Date(1198908717056-0700)/`

If a string that matches this format is passed in, it will be parsed correctly.

```javascript
moment("/Date(1198908717056-0700)/"); // December 28 2007 10:11 PM
```
