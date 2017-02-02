---
title: Browser
---


```
<script src="moment.js"></script>
<script>
	moment().format();
</script>
```

Moment.js is available on [cdnjs.com](https://cdnjs.com/libraries/moment.js). Remember though, unless you are using HTTP/2 then script concatenation into bundles is better as it minimizies the costs of HTTP/1 requests.
