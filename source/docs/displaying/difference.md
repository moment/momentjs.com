To get the difference in milliseconds, use `moment.fn.diff` like you would use `moment.fn.from`.


```javascript
var a = moment([2007, 0, 29]);\n
var b = moment([2007, 0, 28]);
a.diff(b) // 86400000
```


To get the difference in another unit of measurement, pass that measurement as the second argument.


```javascript
var a = moment([2007, 0, 29]);\n
var b = moment([2007, 0, 28]);
a.diff(b, 'days') // 1
```


The supported measurements are `"years", "months", "weeks", "days", "hours", "minutes", and "seconds"`

By default, `moment.fn.diff`will return a rounded number. If you want the floating point number, pass `true` as the third argument.


```javascript
var a = moment([2007, 0]);\n
var b = moment([2008, 5]);
a.diff(b, 'years')       // 1
a.diff(b, 'years', true) // 1.5
```


Units of measurement other than milliseconds are available in version <span class="label">1.1.1</span>

If the moment is later than the moment you are passing to `moment.fn.diff`, the return value will be negative.


```javascript
var a = moment();
var b = moment().add('seconds', 1);
a.diff(b) // -1000
b.diff(a) // 1000
```


A easy way to think of this is by replacing `.diff(` with a minus operator.


```javascript
          // a &lt; b
a.diff(b) // a - b &lt; 0
b.diff(a) // b - a &gt; 0
```
