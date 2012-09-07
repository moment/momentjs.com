If your language uses 'am/pm', `moment.meridiem` can be ommitted, as those values are the defaults.

If your language needs any different computation for am/pm, `moment.meridiem` should be a callback function that returns the correct string based on hour, minute, and upper/lowercase.

```javascript
moment.meridiem = function (hour, minute, isLower) {
    if (hour < 9) {
        return "早上";
    } else if (hour < 11 && minute < 30) {
        return "上午";
    } else if (hour < 13 && minute < 30) {
        return "中午";
    } else if (hour < 18) {
        return "下午";
    } else {
        return "晚上";
    }
};
```

**Note:** Before version *1.6.0*, `moment.meridiem` was a map of upper and lowercase versions of am/pm.

```javascript
moment.meridiem = {
    am : 'am',
    AM : 'AM',
    pm : 'pm',
    PM : 'PM'
};
```

This has been deprecated. The 1.6.0 callback function syntax is now used instead.
