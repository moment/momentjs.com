---
title: Webpack
---

```bash
npm install moment
```

<!-- prettier-ignore -->
<div class="docs-tabs" data-docs-tabs>
  <div class="docs-tabs-list" role="tablist" aria-label="Module format">
    <button type="button" class="docs-tab" id="webpack-install-esm-tab" role="tab" aria-selected="true" aria-controls="webpack-install-esm-panel">ES modules</button>
    <button type="button" class="docs-tab" id="webpack-install-cjs-tab" role="tab" aria-selected="false" aria-controls="webpack-install-cjs-panel" tabindex="-1">CommonJS</button>
  </div>
  <div class="docs-tab-panel" id="webpack-install-esm-panel" role="tabpanel" aria-labelledby="webpack-install-esm-tab">
    <pre><code class="language-javascript">import moment from 'moment';
&#32;
moment().format();</code></pre>
  </div>
  <div class="docs-tab-panel" id="webpack-install-cjs-panel" role="tabpanel" aria-labelledby="webpack-install-cjs-tab" hidden>
    <pre><code class="language-javascript">const moment = require('moment');
&#32;
moment().format();</code></pre>
  </div>
</div>

The configuration examples in this section target Webpack 5 or newer. For older
versions, see the Webpack 4 section at the bottom of this section.

### Locales

Moment uses a dynamic locale lookup, so Webpack includes every Moment locale by
default. This is the simplest option, and it allows `moment.locale` to select
any included locale at runtime. It also produces the largest bundle.

If your application chooses from a known list of locales at runtime, use
Webpack's
[`ContextReplacementPlugin`](https://webpack.js.org/plugins/context-replacement-plugin/)
to limit which locales are included. Only locales in the allowlist will be
available to `moment.locale`.

If the locale is known at build time, use Webpack's built-in `IgnorePlugin` to
remove the dynamic lookup:

<!-- prettier-ignore -->
<div class="docs-tabs" data-docs-tabs>
  <div class="docs-tabs-list" role="tablist" aria-label="Webpack configuration format">
    <button type="button" class="docs-tab" id="webpack-ignore-esm-tab" role="tab" aria-selected="true" aria-controls="webpack-ignore-esm-panel">ES modules</button>
    <button type="button" class="docs-tab" id="webpack-ignore-cjs-tab" role="tab" aria-selected="false" aria-controls="webpack-ignore-cjs-panel" tabindex="-1">CommonJS</button>
  </div>
  <div class="docs-tab-panel" id="webpack-ignore-esm-panel" role="tabpanel" aria-labelledby="webpack-ignore-esm-tab">
    <pre><code class="language-javascript">// webpack.config.mjs
import webpack from 'webpack';
&#32;
export default {
&#32;&#32;plugins: [
&#32;&#32;&#32;&#32;new webpack.IgnorePlugin({
&#32;&#32;&#32;&#32;&#32;&#32;resourceRegExp: /^\.\/locale$/,
&#32;&#32;&#32;&#32;&#32;&#32;contextRegExp: /moment$/,
&#32;&#32;&#32;&#32;}),
&#32;&#32;],
};</code></pre>
  </div>
  <div class="docs-tab-panel" id="webpack-ignore-cjs-panel" role="tabpanel" aria-labelledby="webpack-ignore-cjs-tab" hidden>
    <pre><code class="language-javascript">// webpack.config.js
const webpack = require('webpack');
&#32;
module.exports = {
&#32;&#32;plugins: [
&#32;&#32;&#32;&#32;new webpack.IgnorePlugin({
&#32;&#32;&#32;&#32;&#32;&#32;resourceRegExp: /^\.\/locale$/,
&#32;&#32;&#32;&#32;&#32;&#32;contextRegExp: /moment$/,
&#32;&#32;&#32;&#32;}),
&#32;&#32;],
};</code></pre>
  </div>
</div>

Import each locale the application uses explicitly:

<!-- prettier-ignore -->
<div class="docs-tabs" data-docs-tabs>
  <div class="docs-tabs-list" role="tablist" aria-label="Module format">
    <button type="button" class="docs-tab" id="webpack-locale-esm-tab" role="tab" aria-selected="true" aria-controls="webpack-locale-esm-panel">ES modules</button>
    <button type="button" class="docs-tab" id="webpack-locale-cjs-tab" role="tab" aria-selected="false" aria-controls="webpack-locale-cjs-panel" tabindex="-1">CommonJS</button>
  </div>
  <div class="docs-tab-panel" id="webpack-locale-esm-panel" role="tabpanel" aria-labelledby="webpack-locale-esm-tab">
    <pre><code class="language-javascript">import moment from 'moment';
import 'moment/locale/fr';
&#32;
moment.locale('fr');
moment().format('LL');</code></pre>
  </div>
  <div class="docs-tab-panel" id="webpack-locale-cjs-panel" role="tabpanel" aria-labelledby="webpack-locale-cjs-tab" hidden>
    <pre><code class="language-javascript">const moment = require('moment');
require('moment/locale/fr');
&#32;
moment.locale('fr');
moment().format('LL');</code></pre>
  </div>
</div>

With this configuration, only imported locales are available. Import fewer
locale files if the resulting bundle is still larger than needed.

### Warnings from dependencies

Some libraries include Moment in their generated files without including its
`locale` directory. Webpack may report `Can't resolve './locale'` when an
application uses one of these libraries. Moment itself and any locales already
included by the library will continue to work. The embedded copy cannot load
additional locales from the missing directory.

Importing `moment/locale/fr` in the application may not help in this case. If
the library bundled its own Moment instance, the import adds French to the
application's instance rather than the library's copy.

If the library cannot be updated, add
[`ignoreWarnings`](https://webpack.js.org/configuration/other-options/#ignorewarnings)
to the application's Webpack 5 configuration. This hides the warning, but does
not make additional locales available. Limit the filter to the affected
dependency:

<!-- prettier-ignore -->
<div class="docs-tabs" data-docs-tabs>
  <div class="docs-tabs-list" role="tablist" aria-label="Webpack configuration format">
    <button type="button" class="docs-tab" id="webpack-warnings-esm-tab" role="tab" aria-selected="true" aria-controls="webpack-warnings-esm-panel">ES modules</button>
    <button type="button" class="docs-tab" id="webpack-warnings-cjs-tab" role="tab" aria-selected="false" aria-controls="webpack-warnings-cjs-panel" tabindex="-1">CommonJS</button>
  </div>
  <div class="docs-tab-panel" id="webpack-warnings-esm-panel" role="tabpanel" aria-labelledby="webpack-warnings-esm-tab">
    <pre><code class="language-javascript">// webpack.config.mjs
export default {
&#32;&#32;ignoreWarnings: [
&#32;&#32;&#32;&#32;{
&#32;&#32;&#32;&#32;&#32;&#32;module: /[\\/]the-dependency[\\/]/,
&#32;&#32;&#32;&#32;&#32;&#32;message: /Can't resolve '\.\/locale'/,
&#32;&#32;&#32;&#32;},
&#32;&#32;],
};</code></pre>
  </div>
  <div class="docs-tab-panel" id="webpack-warnings-cjs-panel" role="tabpanel" aria-labelledby="webpack-warnings-cjs-tab" hidden>
    <pre><code class="language-javascript">// webpack.config.js
module.exports = {
&#32;&#32;ignoreWarnings: [
&#32;&#32;&#32;&#32;{
&#32;&#32;&#32;&#32;&#32;&#32;module: /[\\/]the-dependency[\\/]/,
&#32;&#32;&#32;&#32;&#32;&#32;message: /Can't resolve '\.\/locale'/,
&#32;&#32;&#32;&#32;},
&#32;&#32;],
};</code></pre>
  </div>
</div>

Replace `the-dependency` with the name of the package that includes Moment. Do
not suppress all missing-module warnings.

The `ignoreWarnings` option only hides the message. If you know the library does
not need to load additional Moment locales, use `IgnorePlugin` to tell Webpack
to skip the missing request:

<!-- prettier-ignore -->
<div class="docs-tabs" data-docs-tabs>
  <div class="docs-tabs-list" role="tablist" aria-label="Webpack configuration format">
    <button type="button" class="docs-tab" id="webpack-dependency-ignore-esm-tab" role="tab" aria-selected="true" aria-controls="webpack-dependency-ignore-esm-panel">ES modules</button>
    <button type="button" class="docs-tab" id="webpack-dependency-ignore-cjs-tab" role="tab" aria-selected="false" aria-controls="webpack-dependency-ignore-cjs-panel" tabindex="-1">CommonJS</button>
  </div>
  <div class="docs-tab-panel" id="webpack-dependency-ignore-esm-panel" role="tabpanel" aria-labelledby="webpack-dependency-ignore-esm-tab">
    <pre><code class="language-javascript">// webpack.config.mjs
import webpack from 'webpack';
&#32;
export default {
&#32;&#32;plugins: [
&#32;&#32;&#32;&#32;new webpack.IgnorePlugin({
&#32;&#32;&#32;&#32;&#32;&#32;checkResource(resource, context) {
&#32;&#32;&#32;&#32;&#32;&#32;&#32;&#32;return (
&#32;&#32;&#32;&#32;&#32;&#32;&#32;&#32;&#32;&#32;resource === './locale' &amp;&amp;
&#32;&#32;&#32;&#32;&#32;&#32;&#32;&#32;&#32;&#32;/[\\/]the-dependency[\\/]/.test(context)
&#32;&#32;&#32;&#32;&#32;&#32;&#32;&#32;);
&#32;&#32;&#32;&#32;&#32;&#32;},
&#32;&#32;&#32;&#32;}),
&#32;&#32;],
};</code></pre>
  </div>
  <div class="docs-tab-panel" id="webpack-dependency-ignore-cjs-panel" role="tabpanel" aria-labelledby="webpack-dependency-ignore-cjs-tab" hidden>
    <pre><code class="language-javascript">// webpack.config.js
const webpack = require('webpack');
&#32;
module.exports = {
&#32;&#32;plugins: [
&#32;&#32;&#32;&#32;new webpack.IgnorePlugin({
&#32;&#32;&#32;&#32;&#32;&#32;checkResource(resource, context) {
&#32;&#32;&#32;&#32;&#32;&#32;&#32;&#32;return (
&#32;&#32;&#32;&#32;&#32;&#32;&#32;&#32;&#32;&#32;resource === './locale' &amp;&amp;
&#32;&#32;&#32;&#32;&#32;&#32;&#32;&#32;&#32;&#32;/[\\/]the-dependency[\\/]/.test(context)
&#32;&#32;&#32;&#32;&#32;&#32;&#32;&#32;);
&#32;&#32;&#32;&#32;&#32;&#32;},
&#32;&#32;&#32;&#32;}),
&#32;&#32;],
};</code></pre>
  </div>
</div>

This also leaves additional locales unavailable to the embedded Moment copy.
Keep the rule limited to the affected dependency so that it does not change
locale loading for the application's own Moment instance or for other
dependencies.

Use either `ignoreWarnings` or `IgnorePlugin`, not both. A matching
`IgnorePlugin` prevents the warning, so `ignoreWarnings` is not needed.

### Webpack 4

Webpack 4 users should use a CommonJS `webpack.config.js`. For compatibility
with all Webpack 4 releases, pass regular expressions directly to
`IgnorePlugin`. For example, to remove Moment's dynamic locale lookup:

<!-- skip-example -->

```javascript
const webpack = require('webpack');

module.exports = {
    plugins: [new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)],
};
```

Webpack 4 does not support `ignoreWarnings`. To hide only the dependency warning
described above, use
[`stats.warningsFilter`](https://v4.webpack.js.org/configuration/stats/#statswarningsfilter):

<!-- skip-example -->

```javascript
module.exports = {
    stats: {
        warningsFilter: (warning) =>
            /[\\/]the-dependency[\\/]/.test(warning) &&
            /Can't resolve '\.\/locale'/.test(warning),
    },
};
```

Alternatively, prevent that request with a dependency-specific `IgnorePlugin`:

<!-- skip-example -->

```javascript
const webpack = require('webpack');

module.exports = {
    plugins: [
        new webpack.IgnorePlugin(
            /^\.\/locale$/,
            /[\\/]the-dependency[\\/]/
        ),
    ],
};
```

As with the Webpack 5 options, use either `stats.warningsFilter` or
`IgnorePlugin`, not both.
