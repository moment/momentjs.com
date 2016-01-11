---
title: parseZone
version: 2.3.0
signature: |
  moment.parseZone(String)
---


Moment normally interprets input times as local times (or UTC times if `moment.utc()` is used). However, often the input string itself contains time zone information. `#parseZone` parses the time and then sets the zone according to the input string.

```javascript
moment.parseZone("2013-01-01T00:00:00-13:00").zone(); // 780
```

`moment.parseZone` is equivalent to parsing the string and using `moment#utcOffset` to parse the zone.

```javascript
var s = "2013-01-01T00:00:00-13:00";
moment(s).utcOffset(s);
```

**Note**: this method only works for a single string argument, not a string and format.
