---
title: Parsing Ambiguities
---



Due to daylight saving time, there is a possibility that a time either does
not exist, or has existed twice.

In the spring, at the start of DST, clocks move forward an hour. In reality though, it
is not time that is moving, it is the offset moving.

Moving the offset forward gives the illusion that an hour has disappeared. As the
clock ticks, you can see it move from `1:58` to `1:59` to `3:00`. It is easier to
see what is actually happening when you include the offset.

```
1:58 -8
1:59 -8
3:00 -7
3:01 -7
```

The result is that any time between `1:59:59` and `3:00:00` never actually happened.
Moment Timezone accounts for this. If you try to parse a time that never existed,
it will round down an hour.

```js
moment.tz("2012-03-11 01:59:59", "America/New_York"); // 2012-03-11T01:59:59-05:00
moment.tz("2012-03-11 02:00:00", "America/New_York"); // 2012-03-11T01:00:00-05:00
moment.tz("2012-03-11 02:59:59", "America/New_York"); // 2012-03-11T01:59:59-05:00
moment.tz("2012-03-11 03:00:00", "America/New_York"); // 2012-03-11T03:00:00-04:00
```

In the fall, at the end of DST, clocks move backward an hour. Again, time is not
moving backwards, only the offset is. In this case, the illusion is that an hour repeats itself.

Again, it is easier to see what is actually happening when you include the offset.

```
1:58 -7
1:59 -7
1:00 -8
1:01 -8
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
