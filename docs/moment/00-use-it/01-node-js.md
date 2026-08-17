---
title: Node.js
---

```bash
npm install moment
```

CommonJS:

```javascript
const moment = require('moment');

moment().format();
```

Node.js ES modules require an `.mjs` file or `"type": "module"` in
`package.json`:

<!-- skip-example -->

```javascript
import moment from 'moment';

moment().format();
```

Moment 2.30.1 is published as CommonJS. The default import works through Node.js
[CommonJS interoperability](https://nodejs.org/api/esm.html#interoperability-with-commonjs);
Moment does not provide a native ES module entry point.

If you want to include Moment Timezone as well, see the
[separate Moment Timezone docs for Node.js](/timezone/docs/#/use-it/node-js/) with examples.
