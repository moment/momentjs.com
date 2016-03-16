---
title: Zone
---

```
moment().zone is deprecated, 
use moment().utcOffset instead.
```

This deprecation was made for purposes of clarity. 

The result of ``moment().zone()`` is an integer that indicates the number of minutes that a given moment is offset from UTC, with the sign inverted (US moments result in a positive value). 

Using ``moment().zone(number)`` to set the offset will set the offset on the date, also using an inverted sign.

Because a time zone is not the same thing as an offset, the name was changed to utcOffset. At that time the sign was corrected to reflect the actual direction of the UTC offset.

```js
moment().zone()
360
//is replaced by
moment().utcOffset()
-360

moment().zone(420)
//is replaced by 
moment().utcOffset(-420)
```
[For more information on time zone vs offset, see the Time Zone vs Offset guide.](#/lib-concepts/timezone-offset/)

<a href="https://github.com/moment/moment/issues/1779" target="_blank">View original GitHub issue.</a>