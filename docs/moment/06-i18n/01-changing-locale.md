---
title: Changing locale globally
version: 1.0.0
signature: |
  // From 2.8.1 onward
  moment.locale(String);
  moment.locale(String[]);
  moment.locale(String, Object);

  // Deprecated in 2.8.1
  moment.lang(String);
  moment.lang(String[]);
  moment.lang(String, Object);
---


By default, Moment.js comes with English (United States) locale strings. If you need other locales, you can load them into Moment.js for later use.

To load a locale, pass the key and the string values to `moment.locale`.

More details on each of the parts of the locale bundle can be found in the [customization](#/customization/) section.

```javascript
moment.locale('fr', {
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
        m : 'une minute',
        mm : '%d minutes',
        h : 'une heure',
        hh : '%d heures',
        d : 'un jour',
        dd : '%d jours',
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
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});
```

Once you load a locale, it becomes the active locale. To change active locales, simply call `moment.locale` with the key of a loaded locale.

```javascript
moment.locale('fr');
moment(1316116057189).fromNow(); // il y a une heure
moment.locale('en');
moment(1316116057189).fromNow(); // an hour ago
```

As of **2.21.0**, Moment will `console.warn` if the locale is unavailable.

As of **2.8.0**, changing the global locale doesn't affect existing instances.

```javascript
moment.locale('fr');
var m = moment(1316116057189);
m.fromNow(); // il y a une heure

moment.locale('en');
m.fromNow(); // il y a une heure
moment(1316116057189).fromNow(); // an hour ago
```

`moment.locale` returns the locale used. This is useful because Moment won't change locales if it doesn't know the one you specify.

```javascript
moment.locale('fr'); // 'fr'
moment.locale('tq'); // 'fr'
```

You may also specify a list of locales, and Moment will use the first one it has localizations for.

```javascript
moment.locale(['tq', 'fr']); // 'fr'
```

Moment will also try locale specifier substrings from most-specific to least-specific until it finds a locale it knows. This is useful when supplying Moment with a locale string pulled from the user's environment, such as `window.navigator.language`.

```javascript
moment.locale('en-NZ'); // 'en'
```

Finally, Moment will search intelligently through an array of locales and their substrings.

```javascript
moment.locale(['en-NZ', 'en-AU']); // 'en-au', not 'en'
```
