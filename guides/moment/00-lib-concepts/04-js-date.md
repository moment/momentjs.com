---
title: JavaScript Date
---

Moment.js provides a wrapper for the native JavaScript date object. 
In doing this, Moment.js extends the functionality and also accounts for several deficiencies in the object.

Parsing is notably unpredictable with native date. For instance, suppose I am using a computer in the United States, but I have a date in DD/MM/YYYY format.

```js
var a = new Date('01/12/2016'); //December 1 2016 in DD/MM/YYYY format
//"Tue Jan 12 2016 00:00:00 GMT-0600 (Central Standard Time)"
```
There is no good work-around for this behavior with the native Date object.
Moment's parser handles it just fine though:
```js
moment('01/12/2016', 'DD/MM/YYYY', true).format()
"2016-12-01T00:00:00-06:00"
```


In addition, the ECMA Script 5 Specification makes an unusual assertion about the offset of ISO 8601 dates:

>The value of an absent time zone offset is "Z"

Effectively what this means is that ISO 8601 dates without an offset are to be treated as UTC values, creating the following oddity:

```js
//US local format
var a = new Date('1/1/2016'); 
//"Fri Jan 01 2016 00:00:00 GMT-0600 (Central Standard Time)"

//ISO 8601
var a = new Date('2016-01-01');
//"Thu Dec 31 2015 18:00:00 GMT-0600 (Central Standard Time)"
```

The ES2015 spec fixes this mistake, bringing it in line with the ISO8601 specification, which specifies local time absent of offset. 
This is in it's own way bad as it has numerous negative back compatibility implications.

With Moment, the date is always interpreted as local time, unless you specify otherwise. This is not something that will change with the adoption of ES2015.

```js
moment('2016-01-01')
//"2016-01-01T00:00:00-06:00"
```

Arithmetic is another area where the native Date object is lacking. The Date object actually provides no API for this. Instead, it relies on overflowing date values.
Suppose you wanted to add 1 day to April 30, 2016. With the date object you would do the following:

```js
var a = new Date('4/30/2016'); 
a.setDate(a.getDate() + 1);
```
This does the trick, but is somewhat unintuitive.
Moment provides an API to add/subtract:
```js
moment('4/30/2016', 'MM/DD/YYYY').add(1, 'day')
//"2016-05-01T00:00:00-05:00"
```
