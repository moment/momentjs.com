If you don't know the exact format of an input string, but know it could be one of many, you can use an array of formats.

This is the same as [String + Format](#/parsing/string-format/), only it will try to match the input to multiple formats.

```javascript
moment("12-25-1995", ["MM-DD-YYYY", "YYYY-MM-DD"]);
```

This approach is fundamentally problematic in cases like the following, where there is a difference in big, medium, or little endian date formats.

```javascript
moment("05-06-1995", ["MM-DD-YYYY", "DD-MM-YYYY"]); // June 5th or May 6th?
moment("040506", ["MMDDYY", "DDMMYY", "YYMMDD"]); // Apr 5 2006, May 4 2006, or May 6 2004?
```

This is also the reason Moment.js does not do "magical" string parsing.

**Note:** Parsing multiple formats is considerably slower than parsing a single format. If you can avoid it, it is much faster to parse a single format.
