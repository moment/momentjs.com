---
title: Fiscal Quarters
---


If you ever have need for [Fiscal](https://en.wikipedia.org/wiki/Fiscal_year), Calendar or Academic quarters, you can use the [moment-fquarter](https://github.com/robgallen/moment-fquarter) plugin by [@robgallen](https://github.com/robgallen).

At its simplest, just call the fquarter method on any moment object. It returns a formatted string with April being the first quarter.

```javascript
moment("2013-01-01").fquarter();
// Q4 2012/13
```

You can pass in any month as the starting quarter, e.g. July

```javascript
moment("2013-01-01").fquarter(7);
// Q3 2012/13
```

If you want calendar quarters, start in January

```javascript
moment("2013-01-01").fquarter(1);
// Q1 2013
```
