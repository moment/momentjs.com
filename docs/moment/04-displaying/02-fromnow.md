---
title: Time from now
version: 1.0.0
signature: |
  moment().fromNow();
  moment().fromNow(Boolean);
---


A common way of displaying time is handled by `moment#fromNow`. This is sometimes called timeago or relative time.

```javascript
moment([2007, 0, 29]).fromNow(); // 4 years ago
```

If you pass `true`, you can get the value without the suffix.

```javascript
moment([2007, 0, 29]).fromNow();     // 4 years ago
moment([2007, 0, 29]).fromNow(true); // 4 years
```

The base strings are [customized by the current locale](#/customization/relative-time/). Time is rounded to the nearest second.

The breakdown of which string is displayed for each length of time is outlined in the table below.

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
      <td>0 to 44 seconds</td>
      <td>s</td>
      <td>a few seconds ago</td>
    </tr>
    <tr>
      <td><i>unset</i></td>
      <td>ss</td>
      <td>44 seconds ago</td>
    </tr>
    <tr>
      <td>45 to 89 seconds</td>
      <td>m</td>
      <td>a minute ago</td>
    </tr>
    <tr>
      <td>90 seconds to 44 minutes</td>
      <td>mm</td>
      <td>2 minutes ago ... 44 minutes ago</td>
    </tr>
    <tr>
      <td>45 to 89 minutes</td>
      <td>h</td>
      <td>an hour ago</td>
    </tr>
    <tr>
      <td>90 minutes to 21 hours </td>
      <td>hh</td>
      <td>2 hours ago ... 21 hours ago</td>
    </tr>
    <tr>
      <td>22 to 35 hours</td>
      <td>d</td>
      <td>a day ago</td>
    </tr>
    <tr>
      <td>36 hours to 25 days</td>
      <td>dd</td>
      <td>2 days ago ... 25 days ago</td>
    </tr>
    <tr>
      <td>26 to 45 days</td>
      <td>M</td>
      <td>a month ago</td>
    </tr>
    <tr>
      <td>45 to 319 days</td>
      <td>MM</td>
      <td>2 months ago ... 10 months ago</td>
    </tr>
    <tr>
      <td>320 to 547 days (1.5 years)</td>
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

**Note:** From version **2.10.3**, if the target moment object is invalid the result is the localized Invalid date string.

**Note:** The `ss` key was added in **2.18.0**. It is an optional threshold. It will never display UNLESS the user manually sets the ss threshold. Until the `ss` threshold is set, it defaults to the value of the `s` threshold minus 1 (so, invisible to the user).


