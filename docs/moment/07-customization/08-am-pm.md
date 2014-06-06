---
title: AM/PM
version: 1.6.0
signature: |
  moment.lang('en', {
      meridiem : Function
  });
---


If your language uses 'am/pm', `Language#meridiem` can be ommitted, as those values are the defaults.

If your language needs any different computation for am/pm, `Language#meridiem` should be a callback function that returns the correct string based on hour, minute, and upper/lowercase.

```javascript
moment.lang('zh-cn', {
    meridiem : function (hour, minute, isLowercase) {
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
    }
});
```

Before version **1.6.0**, `Language#meridiem` was a map of upper and lowercase versions of am/pm.

```javascript
moment.lang('en', {
    meridiem : {
        am : 'am',
        AM : 'AM',
        pm : 'pm',
        PM : 'PM'
    }
});
```

This has been deprecated. The **1.6.0** callback function syntax is now used instead.
