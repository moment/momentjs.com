---
title: parseZone
version: 2.3.0
signature: |
  moment.parseZone()
  moment.parseZone(String)
  moment.parseZone(String, String)
  moment.parseZone(String, [String])
  moment.parseZone(String, String, Boolean)
  moment.parseZone(String, String, String, Boolean)
---


Moment normally interprets input times as local times (or UTC times if `moment.utc()` is used). However, often the input string itself contains time zone information. `#parseZone` parses the time and then sets the zone according to the input string.

```javascript
moment.parseZone("2013-01-01T00:00:00-13:00").utcOffset(); // -780 ("-13:00" in total minutes)
moment.parseZone('2013 01 01 05 -13:00', 'YYYY MM DD HH ZZ').utcOffset(); // -780  ("-13:00" in total minutes)
moment.parseZone('2013-01-01-13:00', ['DD MM YYYY ZZ', 'YYYY MM DD ZZ']).utcOffset(); // -780  ("-13:00" in total minutes);
```

It also allows you to pass locale and strictness arguments.

```javascript
moment.parseZone("2013 01 01 -13:00", 'YYYY MM DD ZZ', true).utcOffset(); // -780  ("-13:00" in total minutes)
moment.parseZone("2013-01-01-13:00", 'YYYY MM DD ZZ', true).utcOffset(); // NaN (doesn't pass the strictness check)
moment.parseZone("2013 01 01 -13:00", 'YYYY MM DD ZZ', 'fr', true).utcOffset(); // -780 (with locale and strictness argument)
moment.parseZone("2013 01 01 -13:00", ['DD MM YYYY ZZ', 'YYYY MM DD ZZ'], 'fr', true).utcOffset(); // -780 (with locale and strictness argument alongside an array of formats)
```

`moment.parseZone` is equivalent to parsing the string and using `moment#utcOffset` to parse the zone.

```javascript
var s = "2013-01-01T00:00:00-13:00";
moment(s).utcOffset(s);
```
