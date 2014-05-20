Limits the moment to a maximum of another moment value.

*If using max to compare two moments, be aware that max returns the __earlier__ of the two.*

Sometimes, server clocks are not quite in sync with client clocks. This ends up displaying humanized strings such as "in a few seconds" rather than "a few seconds ago". You can prevent that with `moment#max()`:

```javascript
var momentFromServer = moment(input);
var clampedMoment = momentFromServer.max();
```

You can pass anything to `moment#max` that you would pass to `moment()`.

```javascript
moment().max(moment().add(1, 'd')).calendar()  // "Today at 10:27 AM"
moment().max("2013-04-20T20:00:00+0800");
moment().max("Jan 1 2001", "MMM D YYYY");
moment().max(new Date(2012, 1, 8));
```

**Note:** `moment#max` doesn't actually mutate the moment; it simply returns the input moment if the input moment is earlier, and `this` otherwise.
