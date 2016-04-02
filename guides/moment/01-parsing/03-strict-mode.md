---
title: Strict Mode
---

Strict mode is the recommended mode for parsing dates. You should always use strict mode if your code base will allow it. 
More than half of the parser issues seen on GitHub and Stack Overflow can be fixed by strict mode.

In a later release, the parser will default to using strict mode.

Strict mode requires the input to the moment to exactly match the specified format, including separators. Strict mode is set by passing true as the third parameter to the moment function.

```js
moment('01/01/2016', 'MM/DD/YYYY', true).format()
"2016-01-01T00:00:00-06:00"
moment('01/01/2016 some text', 'MM/DD/YYYY', true).format()
"Invalid date"
```
Separator matching:
```js
//forgiving mode
moment('01-01-2016', 'MM/DD/YYYY', false).format()
"2016-01-01T00:00:00-06:00"
//strict mode
moment('01-01-2016', 'MM/DD/YYYY', true).format()
"Invalid date"
```

Scenarios fixed by strict mode:
```js
//UUID matches YYYYDDD because it starts with 7 digits
moment('5917238b-33ff-f849-cd63-80f4c9b37d0c', moment.ISO_8601).format()
"5917-08-26T00:00:00-05:00"
//strict mode fails because trailing data exists
moment('5917238b-33ff-f849-cd63-80f4c9b37d0c', moment.ISO_8601, true).format()
"Invalid date"
```
```js
//date has out of range value but is parsed anyways
moment('100110/09/2015', 'MM/DD/YYYY').format()
"2015-10-09T00:00:00-05:00"
//strict mode catches out of range issue
moment('100110/09/2015', 'MM/DD/YYYY', true).format()
"Invalid date"
```
```js
//wrong date is parsed because strict mode ignores trailing data
moment('2016-12-31 11:32 PM').format('LT')
"11:32 AM"
//trailing data is noticed
moment('2016-12-31 11:32 PM', moment.ISO_8601, true).format('LT')
"Invalid date"
```
