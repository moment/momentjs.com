---
title: Node.js
---

```
npm install moment
```

```javascript
var moment = require('moment'); // require
moment().format(); 
```

Or in ES6 syntax:

 <!-- skip-example -->

```javascript
import moment from 'moment';
moment().format();
```

**Note:** if you want to work with a particular variation of moment timezone, for example using only data from 2012-2022, you will need to import it from the `builds` directory like so:

<!-- skip-example -->

 ```javascript
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022';
```

**Note:** In **2.4.0**, the globally exported moment object was **deprecated**.
It will be removed in next major release.
