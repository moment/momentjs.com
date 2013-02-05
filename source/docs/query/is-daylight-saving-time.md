`moment#isDST` checks if the current moment is in daylight savings time.

```javascript
moment([2011, 2, 12]).isDST(); // false, March 12 2011 is not DST
moment([2011, 2, 14]).isDST(); // true, March 14 2011 is DST
```
