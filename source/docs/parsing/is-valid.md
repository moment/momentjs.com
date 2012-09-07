The main moment.js function is very flexible and will allow overflowing in parsing input. For example, `moment("2012-01-40", "YYYY-MM-DD")` will overflow the date value into the months, making the actual date Feb 9 (31 days in Jan + 9 days into Feb).

This can be useful when getting things like the 150th day of the year, or the 500th minute in a day, however, it can be problematic when trying to parse user input.

 `moment.fn.isValid()` was added to check if the input for a moment is actually valid input.


```javascript
moment(&quot;2011-10-10&quot;, &quot;YYYY-MM-DD&quot;).isValid(); // true
moment(&quot;2011-10-50&quot;, &quot;YYYY-MM-DD&quot;).isValid(); // false (bad day of month)
// with automatic iso parsing
moment(&quot;2011-10-10T10:20:90&quot;).isValid(); // false (bad seconds)
// passing in an array
moment([2011, 0 1]).isValid(); // true
moment([2011, 0 50]).isValid(); // false (bad day of month)
// strings that get passed to Date.parse()
moment(&quot;not a date&quot;).isValid(); // false
```


<span class="label label-info">Note:</span> the isValid method will not work after manipulating the moment object with any of the manipulation methods.


```javascript
moment(&quot;2011-10-10&quot;, &quot;YYYY-MM-DD&quot;).isValid(); // true
moment(&quot;2011-10-10&quot;, &quot;YYYY-MM-DD&quot;).date(20).isValid(); // false
```
