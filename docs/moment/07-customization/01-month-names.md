---
title: Month Names
version: 1.0.0
signature: |
  // From 2.12.0 onward
  moment.updateLocale('en', {
      months : String[]
  });
  moment.updateLocale('en', {
      months : Function
  });
  moment.updateLocale('en', {
      months : {
          format : String[],
          standalone : String[]
      }
  });
  // From 2.11.0
  moment.locale('en', {
      months : {
          format : String[],
          standalone : String[]
      }
  });
  // From 2.8.1 to 2.11.2
  moment.locale('en', {
      months : String[]
  });
  moment.locale('en', {
      months : Function
  });

  // Deprecated in 2.8.1
  moment.lang('en', {
      months : String[]
  });
  moment.lang('en', {
      months : Function
  });
---


`Locale#months` should be an array of the month names.

```javascript
moment.updateLocale('en', {
    months : [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ]
});
```

If you need more processing to calculate the name of the month, (for example, if there is different grammar for different formats), `Locale#months` can be a function with the following signature. It should always return a month name.

```javascript
moment.updateLocale('en', {
    months : function (momentToFormat, format) {
        // momentToFormat is the moment currently being formatted
        // format is the formatting string
        if (/^MMMM/.test(format)) { // if the format starts with 'MMMM'
            return nominative[momentToFormat.month()];
        } else {
            return subjective[momentToFormat.month()];
        }
    }
});
```

From version **2.11.0** months can also be an object, specifying `standalone` and `format` forms (nominative and accusative). The regular expression that is run on the format to check whether to use the `format` form is `/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/`. From version **2.14.0** a different one can be specified with the `isFormat` key.

```javascript
moment.updateLocale('en', {
    months : {
         format: 'sausio_vasario_kovo_balandžio_gegužės_birželio_liepos_rugpjūčio_rugsėjo_spalio_lapkričio_gruodžio'.split('_'),
         standalone: 'sausis_vasaris_kovas_balandis_gegužė_birželis_liepa_rugpjūtis_rugsėjis_spalis_lapkritis_gruodis'.split('_'),
         isFormat: /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?|MMMM?(\[[^\[\]]*\]|\s+)+D[oD]?/  // from 2.14.0
    }
});
```
