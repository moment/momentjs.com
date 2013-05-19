You can create a `Moment` with a pre-existing native Javascript `Date` object.

```javascript
var day = new Date(2011, 9, 16);
var dayWrapper = moment(day);
```

This is the fastest way to get a Moment.js wrapper.
