Mutates the original moment by changing the milliseconds.

There are a number of shortcut getter and setter functions.
Much like in jQuery, calling the function without paremeters causes it to function as a getter,
and calling with a parameter causes it to function as a setter.

These map to the corresponding function on the native`Date`object.

```javascript
moment().milliseconds(30) === new Date().setMilliseconds(30);
moment().milliseconds()   === new Date().getMilliseconds();
```

If you are in UTC mode, they will map to the UTC equivalent.

```javascript
moment.utc().milliseconds(30) === new Date().setUTCMilliseconds(30);
moment.utc().milliseconds()   === new Date().getUTCMilliseconds();
```

Accepts numbers from 0 to 999
