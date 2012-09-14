To get the native Date object that Moment.js wraps, use `moment.fn.toDate`.

```javascript
moment([2007, 0, 29]).toDate(); // returns native Date object
```

Note: `moment.fn.native` has been replaced by `moment.fn.toDate` and has been deprecated as of *1.6.0*.
