---
title: Relative Time Thresholds
version: 2.7.0
signature: |
  moment.relativeTimeThreshold(unit);  // getter
  moment.relativeTimeThreshold(unit, limit);  // setter
---

`duration.humanize` has thresholds which define when a unit is considered a minute, an hour and so on. For example, by default more than 45 seconds is considered a minute, more than 22 hours is considered a day and so on. To change those cutoffs use `moment.relativeTimeThreshold(unit, limit)` where unit is one of `s`, `m`, `h`, `d`, `M`.

<table>
  <tbody>
    <tr>
      <th>unit</th>
      <th>meaning</th>
      <th>usage</th>
    </tr>
    <tr>
      <td>s</td>
      <td>seconds</td>
      <td>least number of seconds to be considered a minute</td>
    </tr>
    <tr>
      <td>m</td>
      <td>minutes</td>
      <td>least number of minutes to be considered an hour</td>
    </tr>
    <tr>
      <td>h</td>
      <td>hours</td>
      <td>least number of hours to be considered a day</td>
    </tr>
    <tr>
      <td>d</td>
      <td>days</td>
      <td>least number of days to be considered a month</td>
    </tr>
    <tr>
      <td>M</td>
      <td>months</td>
      <td>least number of months to be considered a year</td>
    </tr>
  </tbody>
</table>

```javascript
  // Retrieve existing thresholds
  moment.relativeTimeThreshold('s');  // 45
  moment.relativeTimeThreshold('m');  // 45
  moment.relativeTimeThreshold('h');  // 22
  moment.relativeTimeThreshold('d');  // 26
  moment.relativeTimeThreshold('M');  // 11

  // Set new thresholds
  moment.relativeTimeThreshold('s', 40);
  moment.relativeTimeThreshold('m', 40);
  moment.relativeTimeThreshold('h', 20);
  moment.relativeTimeThreshold('d', 25);
  moment.relativeTimeThreshold('M', 10);
```

**NOTE**: Retrieving thresholds was added in **2.8.1**.
