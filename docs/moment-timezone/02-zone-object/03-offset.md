---
title: Offset
signature: |
  zone.utcOffset(timestamp); // 480
---

Get the offset for a given timestamp (in milliseconds) from a `Zone`.

```js
moment.tz.zone('America/Los_Angeles').utcOffset(1403465838805); // 420
moment.tz.zone('America/Los_Angeles').utcOffset(1388563200000); // 480
```

POSIX compatibility requires that the offsets are inverted. Therefore, Etc/GMT-X will have an offset of `+X` and Etc/GMT+X will have an offset of `-X`. This is a result of IANA's [Time Zone Database](https://github.com/eggert/tz/blob/2017b/etcetera#L36-L42) and not an arbitrary choice by Moment.js. Thus, using locality based identifiers is preferred over fixed-offset identifiers.

This is also described on the [Wikipedia entry for the database](https://en.wikipedia.org/wiki/Tz_database#Area):

> The special area of "Etc" is used for some administrative zones, particularly for "Etc/UTC" which represents [Coordinated Universal Time](https://en.wikipedia.org/wiki/Coordinated_Universal_Time). In order to conform with the [POSIX](https://en.wikipedia.org/wiki/POSIX) style, those zone names beginning with "Etc/GMT" have their sign reversed from the standard [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601#Time_offsets_from_UTC) convention. In the "Etc" area, zones west of GMT have a positive sign and those east have a negative sign in their name (e.g "Etc/GMT-14" is 14 hours ahead of GMT).

For example, using the `Europe/Madrid` identifier gives a different result from `Etc/GMT+1`.

```js
moment().tz('Etc/GMT+1').format('YYYY-MM-DD HH:mm ZZ');
// '2014-12-18 11:22 -0100'
moment().tz('Europe/Madrid').format('YYYY-MM-DD HH:mm ZZ');
// '2014-12-18 13:22 +0100'
```

