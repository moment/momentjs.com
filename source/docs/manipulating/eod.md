**Note:** As of version <span class="label">2.0.0</span>,`moment.fn.endOf('day')` will replace `moment.fn.eod`.

Set the time to the end of the day.


```javascript
moment().eod(); // set the time to 11:59:59.999 pm tonight
```


This is essentially the same as the following.


```javascript
moment().hours(23).minutes(59).seconds(59).milliseconds(999);
```
