---
title: Time to now
version: 2.10.3
signature: |
  moment().toNow();
  moment().toNow(Boolean);
---


A common way of displaying time is handled by `moment#toNow`. This is sometimes called timeago or relative time.

This is similar to [`moment.fromNow`](/docs/#/displaying/fromnow/), but gives
the opposite interval: `a.fromNow() = - a.toNow()`.

This is similar to [`moment.to`](/docs/#/displaying/to/), but is special-cased
for the current time. Use `moment.to`, if you want to control the two end
points of the interval.

```javascript
moment([2007, 0, 29]).toNow(); // in 4 years
```

If you pass `true`, you can get the value without the prefix.

```javascript
moment([2007, 0, 29]).toNow();     // in 4 years
moment([2007, 0, 29]).toNow(true); // 4 years
```

The base strings are [customized by the current locale](#/customization/relative-time/).

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
      <td>in seconds</td>
    </tr>
    <tr>
      <td>45 to 89 seconds</td>
      <td>m</td>
      <td>in a minute</td>
    </tr>
    <tr>
      <td>90 seconds to 44 minutes</td>
      <td>mm</td>
      <td>in 2 minutes ... in 44 minutes</td>
    </tr>
    <tr>
      <td>45 to 89 minutes</td>
      <td>h</td>
      <td>in an hour</td>
    </tr>
    <tr>
      <td>90 minutes to 21 hours </td>
      <td>hh</td>
      <td>in 2 hours ... in 21 hours</td>
    </tr>
    <tr>
      <td>22 to 35 hours</td>
      <td>d</td>
      <td>in a day</td>
    </tr>
    <tr>
      <td>36 hours to 25 days</td>
      <td>dd</td>
      <td>in 2 days ... in 25 days</td>
    </tr>
    <tr>
      <td>26 to 45 days</td>
      <td>M</td>
      <td>in a month</td>
    </tr>
    <tr>
      <td>45 to 319 days</td>
      <td>MM</td>
      <td>in 2 months ... in 10 months</td>
    </tr>
    <tr>
      <td>320 to 547 days (1.5 years)</td>
      <td>y</td>
      <td>in a year</td>
    </tr>
    <tr>
      <td>548 days+</td>
      <td>yy</td>
      <td>in 2 years ... in 20 years</td>
    </tr>
  </tbody>
</table>

From version **2.10.3**, if the target moment object is invalid the result is
the localized Invalid date string.
