`Language#relativeTime` should be an object of the replacement strings for `moment#from`.

```javascript
moment.lang('en', {
    relativeTime : {
        future: "in %s",
        past:   "%s ago",
        s:  "seconds",
        m:  "a minute",
        mm: "%d minutes",
        h:  "an hour",
        hh: "%d hours",
        d:  "a day",
        dd: "%d days",
        M:  "a month",
        MM: "%d months",
        y:  "a year",
        yy: "%d years"
    }
});
```

`Language#relativeTime.future` refers to the prefix/suffix for future dates, and `Language#relativeTime.past` refers to the prefix/suffix for past dates. For all others, a single character refers to the singular, and an double character refers to the plural.

If a language requires additional processing for a token, It can set the token as a function with the following signature.
The function should return a string.

```javascript
function (number, withoutSuffix, key, isFuture) {
    return string;
}
```

The `key` argument refers to the replacement key in the `Language#relativeTime ` object. (eg. `s m mm h`, etc.)

The `number` argument refers to the number of units for that key. For `m`, the number is the number of minutes, etc.

The `withoutSuffix` argument will be true if the token will be displayed without a suffix, and false if it will be displayed with a suffix. (The reason for the inverted logic is because the default behavior is to display with the suffix.)

The `isFuture` argument will be true if it is going to use the future suffix/prefix and false if it is going to use the past prefix/suffix. The `isFuture` argument was added in version **1.6.0**.
