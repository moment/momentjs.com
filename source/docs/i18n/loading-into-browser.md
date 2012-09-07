Loading languages in the browser just requires you to include the language files.

```
&lt;script src=&quot;moment.min.js&quot;&gt;&lt;/script&gt;
&lt;script src=&quot;lang/fr.js&quot;&gt;&lt;/script&gt;
&lt;script src=&quot;lang/pt.js&quot;&gt;&lt;/script&gt;
```

There are minified versions of each of these languages. There is also a minified version of all of the languages bundled together.

```
&lt;script src=&quot;moment.min.js&quot;&gt;&lt;/script&gt;
&lt;script src=&quot;lang/all.min.js&quot;&gt;&lt;/script&gt;
```

Ideally, you would bundle all the files you need into one file to minimize http requests.

```
&lt;script src=&quot;moment-fr-it.min.js&quot;&gt;&lt;/script&gt;
```
