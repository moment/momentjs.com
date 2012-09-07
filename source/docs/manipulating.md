Once you have a Moment.js wrapper object, you may want to manipulate it in some way. There are a number of`moment.fn` methods to help with this.

All manipulation methods are chainable, so you can do crazy things like this.


```javascript
moment().add('days', 7).subtract('months', 1).year(2009).hours(0).minutes(0).seconds(0);
```


<span class="label label-info">Note:</span> It should be noted that moments are mutable. Calling any of the manipulation methods will change the original moment.

If you want to create a copy and manipulate it, you should use`moment.fn.clone` before manipulating the moment.[More info on cloning.](#/parsing/cloning/)