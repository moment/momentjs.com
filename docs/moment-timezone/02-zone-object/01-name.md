---
title: Name
signature: |
  zone.name; // America/Los_Angeles
---

The uniquely identifying name of the time zone.
See the [IANA Time Zone database naming guidelines](https://data.iana.org/time-zones/theory.html#naming)
for more details about the naming convention.

Note that the guidelines also say that these zone identifiers shouldn't be displayed directly to
end users:

> Inexperienced users are not expected to select these names unaided. Distributors should provide
> documentation and/or a simple selection interface that explains each name via a map or via
> descriptive text like "Czech Republic" instead of the timezone name `"Europe/Prague"`.

Providing a full list of translated zone names for every locale is outside the scope of Moment Timezone.
The [Unicode CLDR project](https://cldr.unicode.org/) contains locale-aware mappings for this purpose.
