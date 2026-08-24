---
title: Creating a Custom Locale
version: 2.8.0
signature: |
  moment.defineLocale(String, Object);
  moment.defineLocale(String, null);
---

To create a custom locale, pass the locale key and configuration to `moment.defineLocale`.

More details on each part of the locale configuration can be found in the other customization sections.

```javascript
moment.defineLocale('fr-custom', {
    months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
    monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
    monthsParseExact : true,
    weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
    weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
    weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Aujourd’hui à] LT',
        nextDay : '[Demain à] LT',
        nextWeek : 'dddd [à] LT',
        lastDay : '[Hier à] LT',
        lastWeek : 'dddd [dernier à] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'dans %s',
        past : 'il y a %s',
        s : 'quelques secondes',
        ss : '%d secondes',
        m : 'une minute',
        mm : '%d minutes',
        h : 'une heure',
        hh : '%d heures',
        d : 'un jour',
        dd : '%d jours',
        w : 'une semaine',
        ww : '%d semaines',
        M : 'un mois',
        MM : '%d mois',
        y : 'un an',
        yy : '%d ans'
    },
    dayOfMonthOrdinalParse : /\d{1,2}(er|e)/,
    ordinal : function (number) {
        return number + (number === 1 ? 'er' : 'e');
    },
    meridiemParse : /PD|MD/,
    isPM : function (input) {
        return input.charAt(0) === 'M';
    },
    // In case the meridiem units are not separated around 12, then implement
    // this function (look at locale/id.js for an example).
    // meridiemHour : function (hour, meridiem) {
    //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
    // },
    meridiem : function (hours, minutes, isLower) {
        return hours < 12 ? 'PD' : 'MD';
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // Used to determine first week of the year.
    }
});
```

Details about `week.dow` and `week.doy` can be found in the [First Day of Week and First Week of Year](#/customization/dow-doy/) section.

As of **2.12.0**, a locale can inherit from a parent locale.

```javascript
moment.defineLocale('en-foo', {
  parentLocale: 'en',
  /* */
});
```

Properties that are not specified in the locale will be inherited from the parent locale.

As of **2.16.0**, a locale can be defined with a parent that hasn't itself been defined or loaded.

```javascript
moment.defineLocale('fakeLocale', {parentLocale:'xyz'})
```

As of **2.21.0**, when creating a moment with the custom locale, Moment will attempt to lazy load the parent if it exists. If the parent cannot be loaded, the custom locale remains unavailable and the moment uses the global locale instead.

You can remove a previously defined locale by passing `null` as the second argument. The deleted locale will no longer be available for use.

```javascript
moment.defineLocale('en-my-settings', null);
```

Use `moment.updateLocale` instead when changing an existing locale definition.
