# Moment.js Website

This repository contains the source for [momentjs.com](https://momentjs.com),
including the Moment.js and Moment Timezone documentation, guides, downloads,
and browser test pages.

## Architecture

The site is statically generated with Eleventy. Handlebars templates in `pages/`
render the documentation and guides from Markdown fragments in `docs/` and
`guides/`. Styles and browser scripts are built from `assets/`, and the complete
site is written to `build/`.

Moment and Moment Timezone are pinned as git submodules in `libs/`. They provide
the release files, locale data, and browser test suites published by the site.
pnpm installs the same checkouts as local packages for documentation tests, and
the build verifies that their versions match.

## Local development

Development requires Git, Node.js 24, and pnpm 11. Initialize the Moment and
Moment Timezone submodules, install the tooling, and start the development server:

```sh
git submodule update --init
pnpm install
pnpm serve
```

The site is available at `http://localhost:8080` and reloads when templates,
documentation, styles, or scripts change.

## Test documentation examples

`pnpm serve` automatically tests the JavaScript examples embedded in the
Markdown documentation when the server starts and whenever documentation
changes. To run the same checks once without starting the server, use:

```sh
pnpm doctest
```

Examples preceded by `<!-- skip-example -->` are counted but not run. These are
tool-specific examples or incomplete fragments that need an external runtime,
configuration, or data to execute.

## How to update Moment dependencies

Update each submodule to the desired release tag. For example, to use Moment
`2.30.1` and Moment Timezone `0.6.3`:

```sh
git -C libs/moment checkout 2.30.1
git -C libs/moment-timezone checkout 0.6.3
```

Then commit the updated submodule references.

## Contributing

Please make pull requests against the `master` branch. Website updates are
deployed automatically when a pull request is merged.
