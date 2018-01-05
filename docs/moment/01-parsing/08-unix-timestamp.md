---
title: Unix Timestamp (seconds)
version: 1.6.0
signature: |
  moment.unix(Number)
---


To create a moment from a Unix timestamp (*seconds* since the Unix Epoch), use `moment.unix(Number)`.

```javascript
var day = moment.unix(1318781876);
```

This is implemented as `moment(timestamp * 1000)`, so partial seconds in the input timestamp are included.

```javascript
var day = moment.unix(1318781876.721);
```

**Note:** Despite Unix timestamps being UTC-based, this function creates a moment object in *local* mode.  If you need UTC, then subsequently call `.utc()`, as in:

```javascript
var day = moment.unix(1318781876).utc();
```
