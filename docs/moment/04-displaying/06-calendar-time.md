---
title: Calendar Time
version: 1.3.0
signature: |
  moment().calendar();
  moment().calendar(referenceTime);
  moment().calendar(referenceTime, formats);  // from 2.10.5
---


Calendar time displays time relative to a given `referenceTime` (defaults to now), but does so slightly differently than `moment#fromNow`.

`moment#calendar` will format a date with different strings depending on how close to `referenceTime`'s date (today by default) the date is.

<table class="table table-striped table-bordered">
  <tr>
    <td>Last week</td>
    <td>Last Monday at 2:30 AM</td>
  </tr>
  <tr>
    <td>The day before</td>
    <td>Yesterday at 2:30 AM</td>
  </tr>
  <tr>
    <td>The same day</td>
    <td>Today at 2:30 AM</td>
  </tr>
  <tr>
    <td>The next day</td>
    <td>Tomorrow at 2:30 AM</td>
  </tr>
  <tr>
    <td>The next week</td>
    <td>Sunday at 2:30 AM</td>
  </tr>
  <tr>
    <td>Everything else</td>
    <td>7/10/2011</td>
  </tr>
</table>

These strings are localized, and [can be customized](#/customization/calendar/).

From **2.10.5** moment supports specifying calendar output formats per
invocation:

```javascript
moment().calendar(null, {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'DD/MM/YYYY'
});
```
`sameElse` is used as the format when the moment is more than a week away from the `referenceTime`

**Note:** From version **2.14.0** the formats argument to calendar can be
a callback that is executed within the moment context with a single argument
now:

```javascript
moment().calendar(null, {
  sameDay: function (now) {
    if (this.isBefore(now)) {
      return '[Will Happen Today]';
    } else {
      return '[Happened Today]';
    }
    /* ... */
  }
});
```
