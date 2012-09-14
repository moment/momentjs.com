**Note:** As of version *2.0.0*, `moment.fn.startOf('day')` will replace `moment.fn.sod`.

Set the time to the start of the day.

```javascript
moment().sod(); // set the time to last midnight
```

This is essentially the same as the following.

```javascript
moment().hours(0).minutes(0).seconds(0).milliseconds(0);
```
