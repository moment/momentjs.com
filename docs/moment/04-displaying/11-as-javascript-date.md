---
title: As Javascript Date
version: 1.0.0
signature: |
  moment().toDate();
---


To get a copy of the native Date object that Moment.js wraps, use `moment#toDate`.

This will return a copy of the `Date` that the moment uses, so any changes to that `Date` will not cause moment to change. If you want to change the moment `Date`, see `moment#manipulate` or `moment#set`.

`moment#native` has been replaced by `moment#toDate` and has been deprecated as of **1.6.0**.
