---
title: Parsing Ambiguities
---



Due to daylight saving time, there is a possibility that a time either does
not exist, or has existed twice.

### Spring Forward

In the spring, at the start of DST, clocks move forward an hour. In reality though, it
is not time that is moving, it is the offset moving.

Moving the offset forward gives the illusion that an hour has disappeared. As the
clock ticks, you can see it move from `1:58` to `1:59` to `3:00`. It is easier to
see what is actually happening when you include the offset.

```
1:58 -5
1:59 -5
3:00 -4
3:01 -4
```

The result is that any time between `1:59:59` and `3:00:00` never actually happened.
Moment Timezone accounts for this. If you try to parse a time that never existed,
it will skip forward by the amount of the DST gap (usually 1 hour).

```js
moment.tz("2012-03-11 01:59:59", "America/New_York").format() // 2012-03-11T01:59:59-05:00
moment.tz("2012-03-11 02:00:00", "America/New_York").format() // 2012-03-11T03:00:00-04:00
moment.tz("2012-03-11 02:59:59", "America/New_York").format() // 2012-03-11T03:59:59-04:00
moment.tz("2012-03-11 03:00:00", "America/New_York").format() // 2012-03-11T03:00:00-04:00
```

In this example, the two o'clock hour doesn't exist, so it is treated as equivalent to the three o'clock hour.

### Fall Back

In the fall, at the end of DST, clocks move backward an hour. Again, time is not
moving backwards, only the offset is. In this case, the illusion is that an hour repeats itself.

Again, it is easier to see what is actually happening when you include the offset.

```
1:58 -4
1:59 -4
1:00 -5
1:01 -5
```

Moment Timezone handles this by always using the earlier instance of a duplicated hour.

```js
moment.tz("2012-11-04 00:59:59", "America/New_York"); // 2012-11-04T00:59:59-04:00
moment.tz("2012-11-04 01:00:00", "America/New_York"); // 2012-11-04T01:00:00-04:00
moment.tz("2012-11-04 01:59:59", "America/New_York"); // 2012-11-04T01:59:59-04:00
moment.tz("2012-11-04 02:00:00", "America/New_York"); // 2012-11-04T02:00:00-05:00
```

You won't be able to create a moment with the later instance of the duplicated hour unless you
include the offset when parsing.

```js
moment.tz("2012-11-04 01:00:00-04:00", "America/New_York"); // 2012-11-04T01:00:00-04:00
moment.tz("2012-11-04 01:00:00-05:00", "America/New_York"); // 2012-11-04T01:00:00-05:00
```
