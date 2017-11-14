---
title: As ISO 8601 String
version: 2.8.0
signature: |
  moment.duration().toISOString();
---

Returns duration in string as specified by [ISO 8601 standard](https://en.wikipedia.org/wiki/ISO_8601#Durations).

```javascript
moment.duration(1, 'd').toISOString() // "P1D"
```

Format ``PnYnMnDTnHnMnS`` description:

<table class="table table-striped table-bordered">
  <tbody>
    <tr>
      <th>Unit</th>
      <th>Meaning</th>
    </tr>
    <tr>
      <td>P</td>
      <td>_P_ stands for period. Placed at the start of the duration representation.</td>
    </tr>
    <tr>
      <td>Y</td>
      <td>Year</td>
    </tr>
    <tr>
      <td>M</td>
      <td>Month</td>
    </tr>
    <tr>
      <td>D</td>
      <td>Day</td>
    </tr>
    <tr>
      <td>T</td>
      <td>Designator that precedes the time components.</td>
    </tr>
    <tr>
      <td>H</td>
      <td>Hour</td>
    </tr>
    <tr>
      <td>M</td>
      <td>Minute</td>
    </tr>
    <tr>
      <td>S</td>
      <td>Second</td>
    </tr>
  </tbody>
</table>
