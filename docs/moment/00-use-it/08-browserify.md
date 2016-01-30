---
title: Browserify
---


```
npm install moment
```

```javascript
var moment = require('moment');
moment().format();
```

**Note:** There is a bug that prevents `moment.locale` from being loaded. 
```javascript
var moment = require('moment');
moment.locale('cs');
console.log(moment.locale()); // en
```

Use the workaround below

```javascript
var moment = require('moment');
require('moment/locale/cs');
console.log(moment.locale()); // cs
```
