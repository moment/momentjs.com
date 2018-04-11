---
title: Validation
version: 1.7.0
signature: |
  moment().isValid();
---


Moment applies stricter initialization rules than the `Date` constructor.

```js
new Date(2013, 25, 14).toString(); // "Sat Feb 14 2015 00:00:00 GMT-0500 (EST)"
moment([2015, 25, 35]).format();   // 'Invalid date'
```

You can check whether the Moment considers the date invalid using `moment#isValid`. You can check the metrics used by `#isValid` using `moment#parsingFlags`, which returns an object.

The following parsing flags result in an invalid date:

 * `overflow`: An overflow of a date field, such as a 13th month, a 32nd day of the month (or a 29th of February on non-leap years), a 367th day of the year, etc. `overflow` contains the index of the invalid unit to match `#invalidAt` (see below); `-1` means no overflow.
 * `invalidMonth`: An invalid month name, such as ```moment('Marbruary', 'MMMM');```. Contains the invalid month string itself, or else null.
 * `empty`: An input string that contains nothing parsable, such as `moment('this is nonsense');`. Boolean.
 * `nullInput`: A `null` input, like `moment(null);`. Boolean.
 * `invalidFormat`: An empty list of formats, such as `moment('2013-05-25', [])`. Boolean.
 * `userInvalidated`: A date created explicitly as invalid, such as `moment.invalid()`. Boolean.

 In addition to the above, As of **2.13.0** the meridiem and parsedDateParts flags work together to determine date validity.
 * `meridiem`: Indicates what meridiem (AM/PM) was parsed, if any. String.
 * `parsedDateParts`: Returns an array of date parts parsed in descending order - i.e. parsedDateParts[0] === year. If no parts are present, but meridiem has value, date is invalid. Array.

Additionally, if the Moment is parsed in strict mode, these flags must be empty for the Moment to be valid:

 * `unusedTokens`: array of format substrings not found in the input string
 * `unusedInput`: array of input substrings not matched to the format string

**Note:** Moment's concept of validity became more strict and consistent between **2.2** and **2.3**.
**Note:** Validity is determined on moment creation. A modified moment (i.e. `moment().hour(NaN)`) will remain valid.

Additionally, you can use `moment#invalidAt` to determine which date unit overflowed.

```javascript
var m = moment("2011-10-10T10:20:90");
m.isValid(); // false
m.invalidAt(); // 5 for seconds
```

The return value has the following meaning:

<ol>
  <li>years</li>
  <li>months</li>
  <li>days</li>
  <li>hours</li>
  <li>minutes</li>
  <li>seconds</li>
  <li>milliseconds</li>
</ol>

**Note:** In case of multiple wrong units the first one is returned (because
days validity may depend on month, for example).

Invalid Moments
===============

If a moment is invalid, it behaves like a NaN in floating point operations.

All of the following produce invalid moments:
* `invalid.add(unit, value)`
* `another.add(invalid)`
* `invalid.clone()`
* `invalid.diff(another)`
* `invalid.endOf(unit)`
* `invalid.max(another)`
* `another.max(invalid)`
* `invalid.min(another)`
* `another.min(invalid)`
* `invalid.set(unit, value)`
* `invalid.startOf(unit)`
* `invalid.subtract(unit, value)`

The following produce a localized version of `'InvalidDate'`:
* `invalid.format(anyFmt)` results in `'Invalid Date'` in the current locale
* `invalid.from(another)`
* `another.from(invalid)`
* `invalid.fromNow(suffix)`
* `invalid.to(another)`
* `another.to(invalid)`
* `invalid.toNow(suffix)`
* `invalid.toISOString()`
* `invalid.toString()`

The following return `false`:
* `invalid.isAfter(another)`
* `invalid.isAfter(invalid)`
* `another.isAfter(invalid)`
* `invalid.isBefore(another)`
* `invalid.isBefore(invalid)`
* `another.isBefore(invalid)`
* `invalid.isBetween(another, another)`
* `invalid.isBetween(invalid, invalid)`
* `invalid.isSame(another)`
* `invalid.isSame(invalid)`
* `another.isSame(invalid)`
* `invalid.isSameOrAfter(another)`
* `invalid.isSameOrAfter(invalid)`
* `another.isSameOrAfter(invalid)`
* `invalid.isSameOrBefore(another)`
* `invalid.isSameOrBefore(invalid)`
* `another.isSameOrBefore(invalid)`

And these return `null` or `NaN` with some structure:
* `invalid.get(unit)` returns null, as all other named getters
* `invalid.toArray() === [NaN, NaN, NaN, NaN, NaN, NaN]`
* `invalid.toObject()` has all values set to `NaN`
* `invalid.toDate()` returns an invalid Date object
* `invalid.toJSON()` returns null
* `invalid.unix()` returns null
* `invalid.valueOf()` returns null
