// This file is used to configure markdown-doctest.
// It requires moment + moment-timezone and sets up all
// the implicit data used in the docs

var path = require('path');

var moment = require('moment');
var momentTimezone = require('moment-timezone');

require(path.join(__dirname, 'node_modules', 'moment-timezone', 'moment-timezone-utils'));

// Sometimes the docs deliberately call deprecated code. We don't want our
// output filled with deprecation noise.
moment.suppressDeprecationWarnings = true;

module.exports = {
  ignore: ['docs/moment/10-plugins/**/*', 'libs/**/*'],

  require: {
    moment: moment,
    'moment-timezone': momentTimezone,
    'moment/locale/cs': require('moment/locale/cs'),
    'moment/min/locales.min': require('moment/min/locales.min')
  },

  beforeEach: function () {
    // These examples break if we don't reset the locale before running them.
    //   guides/moment/00-lib-concepts/02-date-time-math.md
    //   guides/moment/01-parsing/05-multiple-formats.md
    moment.locale('cs');
  },

  globals: {
    moment: moment,

    // mock data used to ensure examples are runnable

    // docs/moment/02-get-set/19-get.md
    unit: 'seconds',

    // docs/moment/02-get-set/21-max.md
    fetchFriends: function () {
      return [
        {name: 'Dan', birthday: '11.12.1977'},
        {name: 'Mary', birthday: '11.12.1986'},
        {name: 'Stephan', birthday: '11.01.1993'}
      ];
    },

    // docs/moment/03-manipulating/05-max.md
    input: 'Jan 1 2001',

    // docs/moment/04-displaying/07-difference.md
    a: moment(),
    b: moment().add(1, 'seconds'),

    // docs/moment/06-i18n/08-locale-data.md
    localeData: moment.localeData(),
    aMoment: moment(),
    longOrShortMonthString: 'January',
    minShortOrLongWeekdayString: 'Monday',
    dateFormat: 'dd-mm-yyyy',
    amPmString: '12:30pm',
    hours: 12,
    minutes: 30,
    isLower: false,
    key: 'sameDay',
    key: 's',
    withoutSuffix: true,
    isFuture: true,
    number: 1,
    diff: moment(),
    relTime: moment.duration(1, 'seconds'),
    str: 'a',

    // docs/moment/08-durations/13-as.md
    // docs/moment/08-durations/14-get.md
    duration: moment.duration(1, 'seconds')
  },

  // None of the examples presently use ES6 features,
  // so we can disable babel for a speedup
  babel: false
}
