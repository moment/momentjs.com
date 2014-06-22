---
title: Node.js
signature: |
  npm install moment-timezone
---

In Node.js, all the data is preloaded. No additional code is needed for loading data.

```javascript
var moment = require('moment-timezone');
moment().tz("America/Los_Angeles").format();
```
