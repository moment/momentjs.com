Many of Moment's functions allow the caller to pass in aliases for unit enums. For example, all of these are equivalent:

```javascript
var m = moment();
m.get('y');
m.get('year');
m.get('years');
```

If you're extending the library, you may want access to Moment's facilities for that in order to better align your functionality with Moment's.

```javascript
moment.normalizeUnits('y');      // 'year'
moment.normalizeUnits('year');   // 'year'
moment.normalizeUnits('years');  // 'year'
```
