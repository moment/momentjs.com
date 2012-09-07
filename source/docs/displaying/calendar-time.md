Calendar time is displays time relative to now, but slightly differently than `moment.fn.from`.

 `moment.fn.calendar` will format a date with different strings depending on how close to today the date is.

<table class="table table-striped table-bordered">
  <tr>
    <td>Last week</td>
    <td>Last Monday 2:30 AM</td>
  </tr>
  <tr>
    <td>The day before</td>
    <td>Yesterday 2:30 AM</td>
  </tr>
  <tr>
    <td>The same day</td>
    <td>Today 2:30 AM</td>
  </tr>
  <tr>
    <td>The next day</td>
    <td>Tomorrow 2:30 AM</td>
  </tr>
  <tr>
    <td>The next week</td>
    <td>Sunday 2:30 AM</td>
  </tr>
  <tr>
    <td>Everything else</td>
    <td>7/10/2011</td>
  </tr>
</table>

These strings are localized, and can be customized with [moment.calendar](#/customization/calendar/) or [moment.lang](#/i18n/changing-language/).