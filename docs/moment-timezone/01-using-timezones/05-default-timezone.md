---
title: Default time zone
signature: |
  moment.tz.setDefault(String);
---


By default, `moment` objects are created in the local time zone.  
Local time zone - it's a time zone which is set in a browser or on your `node.js` server.

To change the default time zone, use `moment.tz.setDefault` with a valid
time zone.

```js
moment.tz.setDefault("America/New_York");
```

To reset the default time zone to local, use `moment.tz.setDefault` with no arguments.

```js
moment.tz.setDefault();
```

This is a global setting (shared by all modules).

Subsequent calls to `moment.tz.setDefault` will not affect existing `moment`
objects or their clones.
