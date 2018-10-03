---
title: AM/PM
version: 1.6.0
signature: |
  // From 2.12.0 onward
  moment.updateLocale('en', {
      meridiem : Function
  });
  // From 2.8.1 to 2.11.2
  moment.locale('en', {
      meridiem : Function
  });

  // Deprecated in 2.8.1
  moment.lang('en', {
      meridiem : Function
  });
---


If your locale uses 'am/pm', `Locale#meridiem` can be omitted, as those values are the defaults.

If your locale needs any different computation for am/pm, `Locale#meridiem` should be a callback function that returns the correct string based on hour, minute, and upper/lowercase.

```javascript
moment.updateLocale('zh-cn', {
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

