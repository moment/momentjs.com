By default, Moment.js comes with English language strings. If you need other languages, you can load them into Moment.js for later use.

To load a language, pass the key and the string values to `moment.lang`.

Note: More details on each of the parts of the language bundle can be found in the [customization](#/customization/) section.

```javascript
moment.lang('fr', {
    months : "Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Aout_Septembre_Octobre_Novembre_Décembre".split("_"),
    monthsShort : "Jan_Fev_Mar_Avr_Mai_Juin_Juil_Aou_Sep_Oct_Nov_Dec".split("_"),
    weekdays : "Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi".split("_"),
    weekdaysShort : "Dim_Lun_Mar_Mer_Jeu_Ven_Sam".split("_"),
    longDateFormat : {
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY HH:mm",
        LLLL : "dddd, D MMMM YYYY HH:mm"
    },
    meridiem : {
        AM : 'AM',
        am : 'am',
        PM : 'PM',
        pm : 'pm'
    },
    calendar : {
        sameDay: "[Ajourd'hui à] LT",
        nextDay: '[Demain à] LT',
        nextWeek: 'dddd [à] LT',
        lastDay: '[Hier à] LT',
        lastWeek: 'dddd [denier à] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : "in %s",
        past : "il y a %s",
        s : "secondes",
        m : "une minute",
        mm : "%d minutes",
        h : "une heure",
        hh : "%d heures",
        d : "un jour",
        dd : "%d jours",
        M : "un mois",
        MM : "%d mois",
        y : "une année",
        yy : "%d années"
    },
    ordinal : function (number) {
        return (~~ (number % 100 / 10) === 1) ? 'er' : 'ème';
    }
});
```

Once you load a language, it becomes the active language. To change active languages, simply call `moment.lang` with the key of a loaded language.

```javascript
moment.lang('fr');\n
moment(1316116057189).fromNow() // il y a une heure
moment.lang('en');
moment(1316116057189).fromNow() // an hour ago
```
