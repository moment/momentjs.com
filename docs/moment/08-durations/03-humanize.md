---
title: Humanize
version: 1.6.0
signature: |
  moment.duration().humanize();
  moment.duration().humanize(withSuffix);
  moment.duration().humanize(withSuffix, thresholds); // from 2.25.0
  moment.duration().humanize(thresholds);             // from 2.25.0
---


Sometimes, you want all the goodness of `moment#from` but you don't want to
have to create two moments, you just want to display a length of time.

Enter `moment.duration().humanize()`.

```javascript
moment.duration(1, "minutes").humanize(); // a minute
moment.duration(2, "minutes").humanize(); // 2 minutes
moment.duration(24, "hours").humanize();  // a day
```

By default, the return string is describing a duration `a month` (suffix-less).
If you want an oriented duration `in a month`, `a month ago` (with suffix),
pass in true as seen below.

```javascript
moment.duration(1, "minutes").humanize(true); // in a minute
```

For suffixes before now, pass in a negative number.

```javascript
moment.duration(-1, "minutes").humanize(true); // a minute ago
```

Invalid durations are humanized to the localized version of `Invalid Date`.

```javascript
moment.duration.invalid().humanize(); // Invalid Date
```

Humanize output can be configured with relative time thresholds. To specify
thresholds for a particular invocation of humanize, pass them as a sole
argument or after suffix arg:

```javascript
moment.duration(-1, 'week').humanize(true, {d: 7, w: 4}); // a week ago
moment.duration(-1, 'week').humanize({d: 7, w: 4}); // a week
```

**Note**: Passing thresholds in humanize was added in **2.25.0**.
