Sometimes, you want all the goodness of `moment.fn.from` but you don't want to have to create two moments, you just want to display a length of time.

Enter `moment.duration().humanize()`.

```javascript
moment.duration(1, "minutes").humanize(); // a minute
moment.duration(2, "minutes").humanize(); // 2 minutes
moment.duration(24, "hours").humanize();  // a day
```

By default, the return string is suffixless. If you want a suffix, pass in true as seen below.

```javascript
moment.duration(1, "minutes").humanize(true); // in a minute
```

For suffixes before now, pass in a negative number.

```javascript
moment.duration(-1, "minutes").humanize(true); // a minute ago
```
