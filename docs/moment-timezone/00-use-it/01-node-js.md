---
title: Node.js
signature: |
  npm install moment-timezone
---

In Node.js, all the data is preloaded. No additional code is needed for loading data.

```javascript
var moment = require('moment-timezone'); // require
import moment from 'moment-timezone'; // ES6

moment().tz("America/Los_Angeles").format();
```

Note: if you want to work with a particular variation of moment timezone, for example using only data from 2012-2022, you will need to import it from the `builds` directory like so:

```javascript
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022';
```
