---
title: Node.js
signature: |
  npm install moment-timezone
---

In Node.js, all the data is preloaded. No additional code is needed for loading data.

```js
var moment = require('moment-timezone');
moment().tz("America/Los_Angeles").format();
```

In ECMAScript native module format (or in TypeScript):

<!-- skip-example -->

```js
import moment from 'moment-timezone';
moment().tz("America/Los_Angeles").format();
```

**Note:** You don't need to require/import the base `moment` library as well. Moment Timezone will
automatically load and extend the `moment` module, then return the modified instance.

Package managers like `npm` and `yarn` can sometimes create situations where multiple versions of
`moment` are installed. Importing _only_ from `moment-timezone` can help ensure that the same version
is used consistently.
See [this comment on issue #982](https://github.com/moment/moment-timezone/issues/982#issuecomment-1119540905)
for a much more detailed explanation, including steps to fix potential versioning problems.

<!-- skip-example -->

```js
// Unnecessary, can cause issues with package managers
import moment from 'moment';
import 'moment-timezone';

// Correct
import moment from 'moment-timezone';
```

You can also import just the library without any preloaded data.

<!-- skip-example -->

```js
import moment from 'moment-timezone/moment-timezone';
moment.tz.load(customData);
```
