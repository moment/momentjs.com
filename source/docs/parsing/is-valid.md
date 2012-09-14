The main moment.js function is very flexible and will allow overflowing in parsing input. For example, `moment("2012-01-40", "YYYY-MM-DD")` will overflow the date value into the months, making the actual date Feb 9 (31 days in Jan + 9 days into Feb).

This can be useful when getting things like the 150th day of the year, or the 500th minute in a day, however, it can be problematic when trying to parse user input.

`moment.fn.isValid()` was added to check if the input for a moment is actually valid input.

```javascript
moment("2011-10-10", "YYYY-MM-DD").isValid(); // true
moment("2011-10-50", "YYYY-MM-DD").isValid(); // false (bad day of month)
// with automatic iso parsing
moment("2011-10-10T10:20:90").isValid(); // false (bad seconds)
// passing in an array
moment([2011, 0 1]).isValid(); // true
moment([2011, 0 50]).isValid(); // false (bad day of month)
// strings that get passed to Date.parse()
moment("not a date").isValid(); // false
```

**Note:** the isValid method will not work after manipulating the moment object with any of the manipulation methods.

```javascript
moment("2011-10-10", "YYYY-MM-DD").isValid(); // true
moment("2011-10-10", "YYYY-MM-DD").date(20).isValid(); // false
```
