---
title: Inspect
version: 2.16.0
signature: |
  moment().inspect();
---

Returns a machine readable string, that can be evaluated to produce the same
moment. Because of the name its also used in node interactive shell to display
objects.

```javascript
moment().inspect() // 'moment("2016-11-09T22:23:27.861")'
moment.utc().inspect() // 'moment.utc("2016-11-10T06:24:10.638+00:00")'
moment.parseZone('2016-11-10T06:24:12.958+05:00').inspect() // 'moment.parseZone("2016-11-10T06:24:12.958+05:00")'
moment(new Date('nope')).inspect() // 'moment.invalid(/* Invalid Date */)'
moment('blah', 'YYYY').inspect() // 'moment.invalid(/* blah */)'
```

**Note:** This function is mostly intended for debugging, not all cases are
handled precisely.
