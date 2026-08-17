# Moment.js Website

This repository contains the source for [momentjs.com](https://momentjs.com),
including the Moment.js and Moment Timezone documentation, guides, downloads,
and release files.

## Architecture

The site is statically generated with [Eleventy](https://www.11ty.dev/).
[Handlebars](https://handlebarsjs.com/) templates in `pages/` render the
documentation and guides from Markdown fragments in `docs/` and `guides/`, and
dated News announcements from `news/`. Styles and browser scripts are built from
`assets/`, and the complete site is written to `build/`.

Moment and Moment Timezone are pinned npm dependencies. Their packages provide
the release files, locale data, and runtime used by documentation tests.

## Local development

Development requires Git, Node.js 24, and pnpm 11. Install the dependencies and
start the development server:

```sh
pnpm install
pnpm serve
```

The site is available at `http://localhost:8080` and reloads when templates,
documentation, styles, or scripts change.

## Test documentation examples

`pnpm serve` automatically tests the JavaScript examples embedded in the
Markdown documentation and announcements when the server starts and whenever
that content changes. To run the same checks once without starting the server,
use:

```sh
pnpm doctest
```

Examples preceded by `<!-- skip-example -->` are counted but not run. These are
tool-specific examples or incomplete fragments that need an external runtime,
configuration, or data to execute.

## How to update Moment dependencies

Update both packages to the desired release versions. For example:

```sh
pnpm add --save-dev --save-exact moment@2.30.1 moment-timezone@0.6.3
```

Commit the resulting `package.json` and `pnpm-lock.yaml` changes.

## Contributing

Please make pull requests against the `master` branch. Website updates are
deployed automatically when a pull request is merged.
