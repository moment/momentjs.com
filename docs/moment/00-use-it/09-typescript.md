---
title: Typescript
version: 2.13.0
---

As of version **2.13.0**, Moment includes a typescript definition file.

Install via NPM
```
npm install moment
```

Import and use in your Typescript file
<!-- skip-example -->

```javascript
const moment = require('moment');

let now = moment().format('LLLL');
```

**Note:** If you have trouble importing moment

For _Typescript 2.x_ try adding ```"moduleResolution": "node"``` in ```compilerOptions``` in your ```tsconfig.json``` file

For _Typescript 1.x_ try adding ```"allowSyntheticDefaultImports": true``` in ```compilerOptions``` in your ```tsconfig.json``` file and then use the syntax
<!-- skip-example -->

```javascript
import moment from 'moment';
```

**Locale Import**

To use `moment.locale` you first need to import the language you are targeting.

<!-- skip-example -->

```javascript
import * as moment from 'moment';
import 'moment/locale/pt-br';

console.log(moment.locale()); // en
moment.locale('fr');
console.log(moment.locale()); // fr
moment.locale('pt-br');
console.log(moment.locale()); // pt-br
```
