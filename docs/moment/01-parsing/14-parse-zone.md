---
title: parseZone
version: 2.3.0
signature: |
  moment.parseZone()
  moment.parseZone(String)
  moment.parseZone(String, Format)
  moment.parseZone(String, Format[])
  moment.parseZone(String, Format, Strict)
---


Moment normally interprets input times as local times (or UTC times if `moment.utc()` is used). However, often the input string itself contains time zone information. `#parseZone` parses the time and then sets the zone according to the input string.

```javascript
moment.parseZone("2013-01-01T00:00:00-13:00").utcOffset(); // -780  ("-13:00" in total minutes)
moment.parseZone().format(); // 2016-07-16T00:26:26+05:30
moment.parseZone().format('ZZ') // +0530 (current time-zone)
moment.parseZone('2013-01-01T00:00:00-13:00').format(); // 2013-01-01T00:00:00-13:00
moment.parseZone('2013 01 01 05 -13:00', 'YYYY MM DD HH ZZ').format(); // 2013-01-01T05:00:00-13:00
moment.parseZone('2013-01-01-13:00', 'YYYY MM DD ZZ', true).format(); // Invalid date (doesn't strictly match the format)
moment.parseZone('2013-01-01-13:00', ['DD MM YYYY ZZ', 'YYYY MM DD ZZ']).format(); // 2013-01-01T00:00:00-13:00 (matches any one format in the array)
```
The `Strict` flag is false by default.

`moment.parseZone` is equivalent to parsing the string and using `moment#utcOffset` to parse the zone.

```javascript
var s = "2013-01-01T00:00:00-13:00";
moment(s).utcOffset(s);
```
