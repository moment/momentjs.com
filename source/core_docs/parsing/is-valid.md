The main `moment()` function is very flexible and will allow overflowing in parsing input. For example, `moment("2012-01-40", "YYYY-MM-DD")` will overflow the date value into the months, making the actual moment Feb 9 (31 days in Jan + 9 days into Feb).

This can be useful when getting things like the 150th day of the year, or the 500th minute in a day, however, it can be problematic when trying to parse user input.

`moment#isValid` was added to check if the input for a moment is indeed a valid date.

**Note:** It is not intended to be used to validate that the input string matches the format string. Because the strictness of format matching can vary depending on the application and business requirements, this sort of validation is not included in Moment.js.

Instead, `moment#isValid` answers questions like "Does March 32nd exist?" and "Does February 29th 2011 exist?".

```javascript
moment("2011-10-10", "YYYY-MM-DD").isValid(); // true
moment("2011-10-50", "YYYY-MM-DD").isValid(); // false (bad day of month)
```

It works with ISO 8601 parsing.

```javascript
moment("2011-10-10T10:20:90").isValid(); // false (bad seconds)
```

It works with an array of numbers that mirror the parameters passed to `new Date()`.

```javascript
moment([2011, 0, 1]).isValid(); // true
moment([2011, 0, 50]).isValid(); // false (bad day of month)
```

It also works with a string that gets passed to `Date.parse()`

```javascript
moment("not a date").isValid(); // false
```

**Note:** The `moment#isValid` method will not work after manipulating the moment object with any of the manipulation methods.

```javascript
moment("2011-10-10", "YYYY-MM-DD").isValid(); // true
moment("2011-10-10", "YYYY-MM-DD").date(20).isValid(); // false
```
