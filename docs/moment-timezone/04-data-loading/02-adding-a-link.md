---
title: Adding a Link
signature: |
  moment.tz.link(PackedLinkString)
  moment.tz.link(PackedLinkString[])
---

To link two zone names to the same data, use `moment.tz.link`.

The strings passed in should be in the [link format](#/data-formats/link-format/):
the two zone names separated by a pipe.

```js
moment.tz.link('America/Los_Angeles|US/Pacific');
```

To add more than one link at a time, pass an array of link strings.

```js
moment.tz.link([
	'America/Los_Angeles|US/Pacific',
	'America/New_York|US/Eastern'
]);
```
