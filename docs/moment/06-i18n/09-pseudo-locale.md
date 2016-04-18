---
title: Pseudo Locale
version: 2.13.0
signature: | 
    moment.locale('x-pseudo')
---

As of version **2.13.0** moment optionally includes a pseudo locale. This locale will populate the dates with very obviously changed data.
Pseudo locales can be useful when testing, as they make obvious what data has and has not been localized. Just include the pseudo-locale, and set moment's locale to x-pseudo.
Text from Moment will be very easy to spot.

```javascript
moment.locale('x-pseudo');
moment().format('LLL'); //14 F~ébrú~árý 2010 15:25
moment().fromNow(); //'á ~féw ~sécó~ñds á~gó'
moment().calendar(); //'T~ódá~ý át 02:00'
```