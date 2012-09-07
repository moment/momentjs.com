This is just a map to `moment.fn.from(new Date())`


```javascript
moment([2007, 0, 29]).fromNow(); // 4 years ago
```


Like `moment.fn.from`, if you pass `true`as the second parameter, you can get the value without the suffix.


```javascript
moment([2007, 0, 29]).fromNow();     // 4 years ago\n
moment([2007, 0, 29]).fromNow(true); // 4 years
```
