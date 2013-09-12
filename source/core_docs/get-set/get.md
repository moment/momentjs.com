String getter. In general

```javascript
moment().get(unit) === moment()[unit]()
```

Units are case insensitive, and support plural and short forms: year (years,
y), month (months, M), date (dates, d), hour (hours, h), minute (minutes, m),
second (seconds, s), millisecond (milliseconds, ms).
