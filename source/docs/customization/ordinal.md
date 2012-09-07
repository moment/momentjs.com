`moment.ordinal` should be a function that returns the ordinal for a given number.

```javascript
moment.ordinal = function (number) {
    var b = number % 10;
    return (~~ (number % 100 / 10) === 1) ? 'th' :
        (b === 1) ? 'st' :
        (b === 2) ? 'nd' :
        (b === 3) ? 'rd' : 'th';
};
```

For more information on ordinal numbers, see [wikipedia](http://en.wikipedia.org/wiki/Ordinal_number_%28linguistics%29)
