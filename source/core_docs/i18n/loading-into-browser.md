Loading languages in the browser just requires you to include the language files.

```html
&lt;script src="moment.min.js">&lt;/script>
&lt;script src="lang/fr.js">&lt;/script>
&lt;script src="lang/pt.js">&lt;/script>
```

There are minified versions of each of these languages. There is also a minified version of all of the languages bundled together.

```html
&lt;script src="moment.min.js">&lt;/script>
&lt;script src="lang/all.min.js">&lt;/script>
```

Ideally, you would bundle all the files you need into one file to minimize http requests.

```html
&lt;script src="moment-fr-it.min.js">&lt;/script>
```
