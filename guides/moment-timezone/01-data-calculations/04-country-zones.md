---
title: Countries and Zones
---

Moment Timezone's [country-related APIs](/timezone/docs/#/using-timezones/getting-country-zones/) rely on known associations between zones and countries, which come directly from the IANA tzdb (see [Data Source](#/data-calculations/data-source/)).

The mapping of zones to countries exposes a subtle nuance in the tzdb structure that doesn't match a lot of people's mental model of the data.
This can sometimes catch out users who see something unexpected in the country data and assume it must be a bug.

The key principle is that zone identifiers like `Europe/Berlin` and `Asia/Tokyo` are **labels** for regions of the world where the clocks have agreed since 1970.
These regions are not specifically tied to a single country, and can span multiple countries if needed.
This would be equally true if the labels didn't have city names at all, but instead were named something like `Europe/Zone073`.
The city name is simply an aid to users to make the database more human-readable.

The tzdb defines which countries use each time zone.
But because the zones are named after cities, this can be easily misinterpreted to mean that a city is in multiple countries, which is incorrect.

As an example, let's look at a line from the source [`zone1970.tab`](https://data.iana.org/time-zones/data/zone1970.tab):

```
CZ,SK	+5005+01426	Europe/Prague
```

This line is **not** indicating that the city of Prague is in both Czechia and Slovakia.
It is saying that a time zone region—where clocks have agreed since 1970—can be used in both Czechia and Slovakia, and happens to have the _label_ of `Europe/Prague`.

Moment Timezone also includes the backwards-compatibility data listed in the older (and deprecated) [`zone.tab`](https://data.iana.org/time-zones/data/zone.tab).
This includes the line:

```
SK	+4809+01707	Europe/Bratislava
```

The `Europe/Bratislava` zone is an alias of `Europe/Prague`, so there's no difference in the processed time zone data.

All this means that the results from Moment Timezone's country APIs can give some seemingly-unintuitive results that are correct according to the data model:

```js
moment.tz.zonesForCountry('CZ'); // ["Europe/Prague"]
moment.tz.zonesForCountry('SK'); // ["Europe/Bratislava", "Europe/Prague"]

moment.tz.zone('Europe/Bratislava').countries(); // ["SK"]
moment.tz.zone('Europe/Prague').countries();     // ["CZ", "SK"]
```
