Gets or sets the day of the week.

This method can be used to set the day of the week, with Sunday as 0 and Saturday as 6.

If the range is exceeded, it will bubble up to other weeks.

```javascript
moment().day(-7); // last Sunday (0 - 7)
moment().day(7); // next Sunday (0 + 7)
moment().day(10); // next Wednesday (3 + 7)
moment().day(24); // 3 Wednesdays from now (3 + 7 + 7 + 7)
```

*Note:* `Moment#date` is for the date of the month, and `Moment#day` is for the day of the week.
