---
title: Meteor
---

Modern [Meteor](https://www.meteor.com/) applications should install Moment
from npm:

```bash
meteor npm install --save moment
```

Then import it from an application module:

<!-- skip-example -->

```javascript
import moment from 'moment';

moment().format();
```

Existing applications that use [Atmosphere](https://atmospherejs.com/) can
continue to install the
[`momentjs:moment`](https://atmospherejs.com/momentjs/moment) package:

```bash
meteor add momentjs:moment
```
