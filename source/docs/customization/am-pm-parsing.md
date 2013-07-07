`Language#isPM` should return true if the input string is past 12 noon. This is used in parsing the `a A` tokens.

```javascript
moment.lang('en', {
    isPM : function (input) {
        return ((input + '').toLowerCase()[0] === 'p');
    }
});
```

To configure what strings should be parsed as input, set the `meridiemParse` property.

```javascript
moment.lang('en', {
    meridiemParse : /[ap]\.?m?\.?/i
});
```
