---
title: German Holiday (Feiertag)
signature: |
  npm install moment-feiertage --save
---


This (moment-feiertage) is a Moment.js plugin to determine if a date is a German holiday. Holidays are taken from Wikipedia (de). It's a bit complicated to determine if a date is a holiday, because religious holidays vary every year and differ within the 16 German states.

Made by [DaniSchenk](https://github.com/DaniSchenk).

```js
var someDateInSomeStates = moment('2018-11-01').isHoliday(['BW', 'SH', 'TH']);
/* returns {
  allStates: false,
  holidayName: 'Allerheiligen',
  holidayStates: [ 'BW' ],
  testedStates: [ 'BW', 'SH', 'TH' ]
}*/
```

The repository is located at [github.com/DaniSchenk/moment-feiertage](https://github.com/DaniSchenk/moment-feiertage).
