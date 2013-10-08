Another important piece of validation is to know if the date has been moved by a DST. For example, in most of the United States:

```javascript
moment('2013-03-10 2:30', 'YYYY-MM-DD HH:mm').format(); //=> '2013-03-10T01:30:00-05:00'
```

This is because daylight savings time shifts the time from 2:00 to 3:00, so 2:30 isn't a real time. The resulting time is browser-dependent, either adjusting the time forward or backwards. Use `moment#isDSTShifted` to test for this condition.

**Note:** before 2.3.0, Moment objects in this condition always returned `false` for `moment#isValid`; they now return `true`.
