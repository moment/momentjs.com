If you are using OLE Automation dates in .NET check out Markit On Demand's plugin:

`moment-msdate`

Using this plugin allows you to format OA dates into JavaScript dates and vice-versa.

Convert a `moment` to an OA date:

`moment().toOADate();`

This API returns a floating-point number (the OA date).

Or, convert an OA date to a `moment`:

`moment.fromOADate(41493);` returns `Wed Aug 07 2013 00:00:00 GMT-0600 (MDT)`

More information and detailed docs can be found on GitHub at [http://markitondemand.github.io/moment-msdate/](http://markitondemand.github.io/moment-msdate/).