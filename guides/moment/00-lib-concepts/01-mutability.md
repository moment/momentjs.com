---
title: Mutability
version: 1.0.0
---

The moment object in Moment.js is mutable. This means that operations like add, subtract, or set change the original moment object.
When first using Moment.js many developers are confused by scenarios like this:

```js
var a = moment('2016-01-01'); 
var b = a.add(1, 'week'); 
a.format();
"2016-01-08T00:00:00-06:00"
```

As you can see, adding one week mutated ``a``. To avoid situations like that, clone the moment before performing date math:

```js
var a = moment('2016-01-01'); 
var b = a.clone().add(1, 'week'); 
a.format();
"2016-01-01T00:00:00-06:00"
```