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

**Note:** In **2.4.0**, the globally exported moment object was **deprecated**.
It will be removed in next major release.

If you want to include Moment Timezone as well, see the
[separate Moment Timezone docs for Node.js](/timezone/docs/#/use-it/node-js/) with examples.
