If you are using OLE Automation dates in .NET check out Markit On Demand's plugin:

`moment-msdate`

Using this plugin allows you to format OA dates into JavaScript dates and vice-versa.

Convert a `moment` to an OA date:

`moment().toOADate();`

This API returns a floating-point number (the OA date).

Or, convert an OA date to a `moment`:

`moment.fromOADate(41493);` returns `Wed Aug 07 2013 00:00:00 GMT-0600 (MDT)`

For exact date _and_ time (time is the value right of the decimal):

`moment.fromOADate(41493.706892280097000);` returns `Wed Aug 07 2013 16:57:55 GMT-0600 (MDT)`

To use with Moment formatting:

```javascript
//convert OA Date into JavaScript date
var momentDate = moment.fromOADate(41493.706892280097000);

//use Moment's awesomeness
var formattedDate = momentDate.format('MMM Do YY);

//formattedDate === "Aug 7th 13"
```

This could easily be chained together as:

`moment.fromOADate(41493.706892280097000).format('MMM Do YY); //Aug 7th 13`

More information can be found on GitHub at [http://markitondemand.github.io/moment-msdate/](http://markitondemand.github.io/moment-msdate/).
