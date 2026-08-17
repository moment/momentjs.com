---
title: TypeScript
version: 2.13.0
---

As of version **2.13.0**, Moment includes TypeScript declarations.

Install Moment from npm:

```bash
npm install moment
```

Import and use Moment:

```typescript
import moment from 'moment';

const now = moment().format('LLLL');
```

Use a module configuration appropriate for your runtime. For Node.js, use
`"module": "nodenext"` or `"node16"`. For a bundler, use
`"module": "esnext"` with `"moduleResolution": "bundler"`. Modern
configurations should enable `esModuleInterop`; TypeScript 6 enables this
behavior automatically.

Projects that emit CommonJS with TypeScript 5 and explicitly disable
`esModuleInterop` can use TypeScript's typed CommonJS import syntax:

```typescript
import moment = require('moment');
```

#### Locale Imports

Import a locale before selecting it. Include the `.js` extension so the module
specifier also works in native Node.js ES modules:

```typescript
import moment from 'moment';
import 'moment/locale/pt-br.js';

moment.locale('pt-br');
console.log(moment.locale()); // pt-br
```

Moment's locale modules do not include declaration files. If
`noUncheckedSideEffectImports` is enabled, add an ambient declaration for each
locale to a `.d.ts` file included by the project:

```typescript
declare module 'moment/locale/pt-br.js';
```

See the TypeScript guidance for
[choosing compiler options](https://www.typescriptlang.org/docs/handbook/modules/guides/choosing-compiler-options.html)
for more information.
