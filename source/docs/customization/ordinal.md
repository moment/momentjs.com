`Language#ordinal` should be a function that returns the ordinal for a given number.

```javascript
moment.lang('en', {
    ordinal : function (number) {
        var b = number % 10;
        var output = (~~ (number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    }
});
```

As of **2.0.0**, the ordinal function should return both the number and the ordinal. Previously, only the ordinal was returned.

For more information on ordinal numbers, see [wikipedia](http://en.wikipedia.org/wiki/Ordinal_number_%28linguistics%29)
