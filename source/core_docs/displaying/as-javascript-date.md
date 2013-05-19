To get the native Date object that Moment.js wraps, use `moment#toDate`.

This will return the `Date` that the moment uses, so any changes to that `Date` will cause the moment to change. If you want a `Date` that is a copy, use `moment#clone` before you use `moment#toDate`.

`moment#native` has been replaced by `moment#toDate` and has been deprecated as of **1.6.0**.
