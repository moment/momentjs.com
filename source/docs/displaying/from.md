Another common way of displaying time, sometimes called timeago, is handled by `moment.fn.from`.


```javascript
var a = moment([2007, 0, 29]);\n
var b = moment([2007, 0, 28]);
a.from(b) // &quot;a day ago&quot;
```


The first parameter is anything you can pass to `moment()`or a Moment.js object.


```javascript
var a = moment([2007, 0, 29]);\n
var b = moment([2007, 0, 28]);
a.from(b);                     // &quot;a day ago&quot;
a.from([2007, 0, 28]);         // &quot;a day ago&quot;
a.from(new Date(2007, 0, 28)); // &quot;a day ago&quot;
a.from(&quot;1-28-2007&quot;);           // &quot;a day ago&quot;
```


  NOTE: Because it only accepts one parameter to pass in the date info, 
  if you need to use String + Format or String + Formats, you should create a Moment.js 
  object first and then call `moment.fn.from`


```javascript
var a = moment();\n
var b = moment(&quot;10-10-1900&quot;, &quot;MM-DD-YYYY&quot;);
a.from(b);
```


If you pass `true`as the second parameter, you can get the value without the suffix. This is useful wherever you need to have a human readable length of time.


```javascript
var start = moment([2007, 0, 5]);\n
var end = moment([2007, 0, 10]);
start.from(end);       // &quot;in 5 days&quot;
start.from(end, true); // &quot;5 days&quot;
```


The base strings are customized by `moment.lang`or by modifying the values directly using `moment.relativeTime`.

The breakdown of which string is displayed when is outlined in the table below.

<table class="table table-striped table-bordered">
  <thead>
    <tr>
      <th>Range</th>
      <th>Key</th>
      <th>Sample Output</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0 to 45 seconds</td>
      <td>s</td>
      <td>seconds ago</td>
    </tr>
    <tr>
      <td>45 to 90 seconds</td>
      <td>m</td>
      <td>a minute ago</td>
    </tr>
    <tr>
      <td>90 seconds to 45 minutes</td>
      <td>mm</td>
      <td>2 minutes ago ... 45 minutes ago</td>
    </tr>
    <tr>
      <td>45 to 90 minutes</td>
      <td>h</td>
      <td>an hour ago</td>
    </tr>
    <tr>
      <td>90 minutes to 22 hours </td>
      <td>hh</td>
      <td>2 hours ago ... 22 hours ago</td>
    </tr>
    <tr>
      <td>22 to 36 hours</td>
      <td>d</td>
      <td>a day ago</td>
    </tr>
    <tr>
      <td>36 hours to 25 days</td>
      <td>dd</td>
      <td>2 days ago ... 25 days ago</td>
    </tr>
    <tr>
      <td>25 to 45 days</td>
      <td>M</td>
      <td>a month ago</td>
    </tr>
    <tr>
      <td>45 to 345 days</td>
      <td>MM</td>
      <td>2 months ago ... 11 months ago</td>
    </tr>
    <tr>
      <td>345 to 547 days (1.5 years)</td>
      <td>y</td>
      <td>a year ago</td>
    </tr>
    <tr>
      <td>548 days+</td>
      <td>yy</td>
      <td>2 years ago ... 20 years ago</td>
    </tr>
  </tbody>
</table>