Interval is a plugin that lets you create time intervals easily.

```javascript
// using two moment objects
var june2013 = moment.interval(moment('2013-06-01'), moment('2013-06-30'));

// using ISO 8601 expressions
var lastWeek = moment.interval('P1W/');

// relative to a moment instance
var tenHoursQuarantineStartingNow = moment().interval(moment.duration(10, 'hours'));
```

Full documentation and sources [here](http://github.com/luisfarzati/moment-interval).

It's available on npm like so:

```
npm install moment-interval
```

Or just grab the JS file from [here](https://raw.github.com/luisfarzati/moment-interval/master/src/moment-interval.js).