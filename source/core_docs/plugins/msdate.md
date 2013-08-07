If you are using OLE Automation dates, or "MSDates", check out Markit On Demand's plugin:

`moment-msdate`

Using this plugin formats OA dates into JavaScript dates and `moment` chaining is available.

For date:

`moment().fromOADate(41493)` returns `Wed Aug 07 2013 00:00:00 GMT-0600 (MDT)`

For precise date _and_ time:

`moment().fromOADate(41493.706892280097000)` returns `Wed Aug 07 2013 16:57:55 GMT-0600 (MDT)`

For Moment formatting:

```javascript
//convert OADate into JavaScript date
var jsDate = moment().fromOADate(41493.706892280097000);

//use Moment's awesomeness
var formattedDate = moment(jsDate).format('MMM Do YY);

//formattedDate === "Aug 7th 13"
```

This could easily be chained together as:

`moment().fromOADate(41493.706892280097000).format('MMM Do YY); //Aug 7th 13`

The repository is located at [github.com/markitondemand/moment-msdate](https://github.com/markitondemand/moment-msdate).
