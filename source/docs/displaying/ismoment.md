If you want to check if a variable is a moment object, you can use `moment.isMoment()`.


```javascript
moment.isMoment() // false
moment.isMoment(new Date()) // false
moment.isMoment(moment()) // true
```
