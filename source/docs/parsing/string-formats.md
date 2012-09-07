If you don't know the exact format of an input string, but know it could be one of many, you can use an array of formats.

This is the same as String + Format, only it will try to match the input to multiple formats.


```javascript
var day = moment(&quot;12-25-1995&quot;, [&quot;MM-DD-YYYY&quot;, &quot;YYYY-MM-DD&quot;]);
```


This approach is fundamentally problematic in cases like the following, where there is a difference in big, medium, or little endian date formats.


```javascript
var day = moment(&quot;05-06-1995&quot;, [&quot;MM-DD-YYYY&quot;, &quot;DD-MM-YYYY&quot;]); // June 5th or May 6th?
```


<span class="label label-warning">Warning</span> THIS IS SLOW. This should only be used as a last line of defense.