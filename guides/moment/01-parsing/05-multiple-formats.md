---
title: Multiple Formats
---

Moment's parser supports specifying multiple possible formats for a date string. This can be extremely useful for situations where a date may be coming from multiple data sources.
Just pass the formats as an array:

```js
moment('12 March, 2016', ['DDMMMMY', 'MMMMDDY']).format()
"2016-03-12T00:00:00-06:00"
moment('March 12, 2016', ['DDMMMMY', 'MMMMDDY']).format()
"2016-03-12T00:00:00-06:00"
```

In order for this functionality to work properly, moment must parse every format provided. Because of this, the more formats that are used, the longer that parsing takes.
Moment's heuristic for determining which format to use is as follows:

 * Prefer formats resulting in [valid](#/parsing/is-valid/) dates over invalid ones.
 * Prefer formats that parse more of the string than less and use more of the format than less, i.e. prefer stricter parsing.
 * Prefer formats earlier in the array than later.

