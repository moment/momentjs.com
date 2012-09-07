`moment.relativeTime` should be an object of the replacement strings for `moment.fn.from`.


```javascript
moment.relativeTime = {\n
    future: &quot;in %s&quot;,
    past: &quot;%s ago&quot;,
    s: &quot;seconds&quot;,
    m: &quot;a minute&quot;,
    mm: &quot;%d minutes&quot;,
    h: &quot;an hour&quot;,
    hh: &quot;%d hours&quot;,
    d: &quot;a day&quot;,
    dd: &quot;%d days&quot;,
    M: &quot;a month&quot;,
    MM: &quot;%d months&quot;,
    y: &quot;a year&quot;,
    yy: &quot;%d years&quot;
};
```


`future` refers to the prefix/suffix for future dates, and `past` refers to the prefix/suffix for past dates. For all others, a single character refers to the singular, and an double character refers to the plural.

  If a language requires additional processing for a token, It can set the token as a function with the following signature. 
  The function should return a string.


```javascript
function(number, withoutSuffix, key, isFuture) {\n
    return string;
}
```


The `key` variable refers to the replacement key in the `relativeTime ` object. (eg. 's', 'm', 'mm', 'h', etc.)

The `number` variable refers to the number of units for that key. For 'm', the number is the number of minutes, etc.

The `withoutSuffix` variable will be true if the token will be displayed without a suffix, and false if it will be displayed with a suffix. 
  (The reason for the inverted logic is because the default behavior is to display with the suffix.)

The `isFuture` parameter will be true if it is going to use the future suffix/prefix and false if it is going to use the past prefix/suffix.

<span class="label label-info">Note:</span> the `isFuture` parameter was added in version <span class="label">1.6.0</span>.