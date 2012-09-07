Loading languages in the browser just requires you to include the language files.

```
<script src="moment.min.js"></script>
<script src="lang/fr.js"></script>
<script src="lang/pt.js"></script>
```

There are minified versions of each of these languages. There is also a minified version of all of the languages bundled together.

```
<script src="moment.min.js"></script>
<script src="lang/all.min.js"></script>
```

Ideally, you would bundle all the files you need into one file to minimize http requests.

```
<script src="moment-fr-it.min.js"></script>;
```
