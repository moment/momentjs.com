---
title: Browser
---

Serve a downloaded copy of Moment from your application:

```html
<script src="/vendor/moment.min.js"></script>
<script>
  moment().format();
</script>
```

The script exposes Moment as the global `moment`.

Moment 2 aims to retain broad browser compatibility, including best-effort
compatibility with Internet Explorer 8 and later. This is a compatibility goal,
not a guarantee that every browser is continuously tested. Applications should
test Moment in their required environments.

Alternatively, Moment is available from [cdnjs](https://cdnjs.com/libraries/moment.js)
and [jsDelivr](https://www.jsdelivr.com/package/npm/moment):

<div class="docs-tabs" data-docs-tabs>
  <div class="docs-tabs-list" role="tablist" aria-label="CDN provider">
    <button type="button" class="docs-tab" id="browser-cdnjs-tab" role="tab" aria-selected="true" aria-controls="browser-cdnjs-panel">cdnjs</button>
    <button type="button" class="docs-tab" id="browser-jsdelivr-tab" role="tab" aria-selected="false" aria-controls="browser-jsdelivr-panel" tabindex="-1">jsDelivr</button>
  </div>
  <div class="docs-tab-panel" id="browser-cdnjs-panel" role="tabpanel" aria-labelledby="browser-cdnjs-tab">
    <pre><code class="language-html">&lt;script
  src="%%MOMENT_CDNJS_URL%%"
  integrity="%%MOMENT_CDNJS_INTEGRITY%%"
  crossorigin="anonymous"
&gt;&lt;/script&gt;
&lt;script&gt;
  moment().format();
&lt;/script&gt;</code></pre>
  </div>
  <div class="docs-tab-panel" id="browser-jsdelivr-panel" role="tabpanel" aria-labelledby="browser-jsdelivr-tab" hidden>
    <pre><code class="language-html">&lt;script
  src="%%MOMENT_JSDELIVR_URL%%"
  integrity="%%MOMENT_JSDELIVR_INTEGRITY%%"
  crossorigin="anonymous"
&gt;&lt;/script&gt;
&lt;script&gt;
  moment().format();
&lt;/script&gt;</code></pre>
  </div>
</div>

The core file includes English only. Load individual locale files after Moment,
or use `min/moment-with-locales.min.js` if the application requires all locales.
