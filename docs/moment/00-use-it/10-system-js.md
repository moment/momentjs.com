---
title: System.js
---

To load moment, place it in the path specified by your System.config in the baseURL configuration.
Then import it into your page.

<!-- skip-example -->

```js
<script src="system.js"></script>
<script>
  System.config({
    baseURL: '/app'
  });

  System.import('moment.js');
 </script>
```


If you need moment to be loaded as global, you can do this with the meta configuration:

<!-- skip-example -->

```javascript
System.config({
  meta: {
    'moment': { format: 'global' }
  }
});
```

Alternatively, to provide Moment as a global to only a specific dependency, you can do this:

<!-- skip-example -->

```javascript
System.config({
  meta: {
    'path/to/global-file.js': {
      globals: {
        moment: 'moment'
      }
    }
  }
});
```
