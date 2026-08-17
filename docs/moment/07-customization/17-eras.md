---
title: Eras
version: 2.25.0
signature: |
  moment.updateLocale('en', {
      eras: [{
          since:  '0001-01-01',
          until:  +Infinity,
          offset: 1,
          name:   'Anno Domini',
          narrow: 'AD',
          abbr:   'AD'
      }, {
          until:   -Infinity,
          since:  '0000-12-31',
          offset: 1,
          name:   'Before Christ',
          narrow: 'BC',
          abbr:   'BC'
      }],
  });
---

Specify Eras for a particular locale. An era is a time interval with name and
year numbering. Absolute year number (like 2020) can also be specified as 2020
AD: the 2020th year of the era AD. Similarly the absolute year number -0500 can
be described as 501 BC, the 501st year from the BC era.

```javascript
eras: [{
    since:  '0001-01-01', // the start of the era
    until:  +Infinity,    // the end of the era, can be +/-Infinity
    offset: 1,            // added to year to (mostly) avoid 0 era years
    name:   'Anno Domini',// full name of era
    narrow: 'AD',         // narrow name of era
    abbr:   'AD'          // abbreviated name of era
}]
```

`since` and `until` govern the direction of the era. As in the case of `BC` it
grows toward `-Infinity`, thus `since` > `until`. For eras that
increment toward +Infinity `since` < `until`.

Parsing/formatting of eras is accomplished with `yo`, `y*` and `N*` tokens.

**Note**: The era-related APIs are subject to change.
