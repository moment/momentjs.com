You can create a moment from a string that can be parsed by `Date.parse`.


```javascript
var day = moment(&quot;Dec 25, 1995&quot;);
```


Browser support for this is somewhat inconsistent. If you are not getting consistent results, you can try using String + Format.

If you are trying to parse an ISO-8601 string, the following formats are supported across all browsers.


```javascript
&quot;YYYY-MM-DD&quot;
&quot;YYYY-MM-DDTHH&quot;
&quot;YYYY-MM-DDTHH:mm&quot;
&quot;YYYY-MM-DDTHH:mm:ss&quot;
&quot;YYYY-MM-DDTHH:mm:ss z&quot;
```


<span class="label label-info">Note:</span> Automatic cross browser ISO-8601 support was added in version <span class="label">1.5.0</span>