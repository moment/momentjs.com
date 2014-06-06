---
title: Java DateFormat Parser
signature: |
  npm install moment-jdateformatparser
---


If you want to work with the `java.text.DateFormat` you can use this plugin. 


For example,

```javascript
moment("2013-12-24 14:30").formatWithJavaDateFormat("dd.MM.yyyy");  // returns the formatted date "24.12.2013"
moment().toJavaDateFormatString("DD.MM.YYYY");  // returns the Java format pattern "dd.MM.yyyy"
```

It's available on npm like so:

```
npm install moment-jdateformatparser
```

The repository is located at [github.com/MadMG/moment-jdateformatparser](https://github.com/MadMG/moment-jdateformatparser)