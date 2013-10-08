Moment normally interprets input times as local times (or UTC times if `moment.utc()` is used). However, often the input string itself contains time zone information. `#parseZone` parses the time and then sets the zone according to the input string:

```js
moment.parseZone("2013-01-01T00:00:00-13:00").zone(); // 780
```

It is equivalent to:

```js
var s = "2013-01-01T00:00:00-13:00";
moment(s).zone(s);
```

**Note**: this method only works for a single string argument, not a string and format.
