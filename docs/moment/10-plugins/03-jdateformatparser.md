---
title: Java DateFormat Parser
signature: |
  npm install moment-jdateformatparser
---


If you want to work with the `java.text.DateFormat` you can use this plugin.


For example,

```javascript
moment("2013-12-24 14:30").formatWithJDF("dd.MM.yyyy");  // returns the formatted date "24.12.2013"
moment().toJDFString("DD.MM.YYYY");  // returns the Java format pattern "dd.MM.yyyy"
```

The repository is located at [github.com/MadMG/moment-jdateformatparser](https://github.com/MadMG/moment-jdateformatparser).
