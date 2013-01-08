Another range plugin is Isaac Cambron's library `Twix` . It has many range-related features but excels at formatting them readably. For example,

```javascript
var t = moment.twix("1/25/1982 9:30 AM", "1/25/1982 1:30 PM")
t.format();  // Jan 25, 1982, 9:30 AM - 1:30 PM
```

It also understands all-day events where the times aren't really relevant:

```javascript
var t = moment.twix('5/25/1982', '5/26/1982', true);
t.format(); // 'May 25 - 26, 1982'
```

Full documentation of all the options and features is here: [https://github.com/icambron/twix.js/wiki/Documentation](https://github.com/icambron/twix.js/wiki/Documentation).

It's available on npm like so:

```
npm install twix
```

Or just grab the JS file from [here](https://raw.github.com/icambron/twix.js/master/bin/twix.js).
