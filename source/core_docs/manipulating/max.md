Set the maximum value for a moment.

Sometimes, server clocks are not quite in sync with client clocks. This ends up displaying humanized strings such as "in a few seconds" rather than "a few seconds ago".

`moment#max` was added to allow you to set the maximum value for a moment.

```javascript
var momentFromServer = moment(input);
var now = moment();
var clampedMoment = momentFromServer.max(now);
```

You can pass anything to `moment#max` that you would pass to `moment()`.

```javascript
moment().max("2013-04-20T20:00:00+0800");
moment().max("Jan 1 2001", "MMM D YYYY");
```
