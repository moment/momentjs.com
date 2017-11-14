---
title: Manipulate
---


Once you have a `Moment`, you may want to manipulate it in some way. There are a number of methods to help with this.

Moment.js uses the [fluent interface pattern](https://en.wikipedia.org/wiki/Fluent_interface), also known as [method chaining](https://en.wikipedia.org/wiki/Method_chaining). This allows you to do crazy things like the following.

```javascript
moment().add(7, 'days').subtract(1, 'months').year(2009).hours(0).minutes(0).seconds(0);
```

**Note:** It should be noted that moments are mutable. Calling any of the manipulation methods will change the original moment.

If you want to create a copy and manipulate it, you should use `moment#clone` before manipulating the moment. [More info on cloning.](#/parsing/moment-clone/)
