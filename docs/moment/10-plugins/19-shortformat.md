---
title: Short Date Formatter
---

If you want to format times in a short way, you can use the [moment-shortformat](https://github.com/researchgate/moment-shortformat) plugin by [@researchgate](https://github.com/researchgate).

It is based on and similar to the moment.twitter plugin but has a different output.

```javascript
moment().subtract(5, 'hours').short();
// 5h ago
moment().add(5, 'hours').short();
// in 5h
```
You can also disable the use of the [relative time templates](#/customization/relative-time/)

```javascript
moment().subtract(1, 'hour').short(false);
// 1h
```

If the date is too far in the future or the past it will display like that

```javascript
moment().subtract(500, 'days').short();
// 5 Mar, 1970
```
