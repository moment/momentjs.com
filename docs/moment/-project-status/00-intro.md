---
title: Project Status
---

Moment.js has been successfully used in millions of projects, and we are happy to have contributed to making date and time better on the web.
As of September 2020, Moment gets over 12 million downloads per week!  However, Moment was built for the previous era of the JavaScript ecosystem.
The modern web looks much different these days.  Moment has evolved somewhat over the years, but it has essentially the same design as it did when it was created in 2011.
Given how many projects depend on it, *we choose to prioritize stability over new features*.

As an example, consider that Moment objects are *mutable*.  This is a common source of complaints about Moment.
We address it [in our usage guidance](/guides/#/lib-concepts/mutability/) but it still comes as a surprise to most new users.
Changing Moment to be immutable would be a breaking change for every one of the projects that use it.
Creating a "Moment v3" that was immutable would be a tremendous undertaking and would make Moment a different library entirely.
Since this has already been accomplished in other libraries, we feel that it is more important to retain the mutable API.

Another common argument against using Moment in modern applications is its size.  Moment doesn't work well with modern "tree shaking" algorithms, so it tends to increase the size of web application bundles.
If one needs internationalization or time zone support, Moment can get quite large.  Modern web browsers (and Node.js) expose internationalization and time zone support via the [`Intl`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl) object, codified as [ECMA-402](https://ecma-international.org/ecma-402/). Libraries like [Luxon](https://moment.github.io/luxon/) (and others) take advantage of this, reducing or removing the need to ship your own data files.

Recently, Chrome Dev Tools [started showing recommendations for replacing Moment](https://twitter.com/addyosmani/status/1304676118822174721) for the size alone.  We generally support this move.

You may also want to read:

- [*You Probably Don't Need Moment.js Anymore*](https://dockyard.com/blog/2020/02/14/you-probably-don-t-need-moment-js-anymore)
- [*You don't (may not) need Moment.js*](https://github.com/you-dont-need/You-Dont-Need-Momentjs/blob/master/README.md)
- [*Why you shouldn't use Moment.js...*](https://inventi.studio/en/blog/why-you-shouldnt-use-moment-js)
- [*4 alternatives to moment.js for internationalizing dates*](https://blog.logrocket.com/4-alternatives-to-moment-js-for-internationalizing-dates/)

The Moment team has discussed these issues at length.  We recognize that many existing projects may continue to use Moment, but we would like to discourage Moment from being used in new projects going forward.
Instead, we would like to [recommend alternatives](#/-project-status/recommendations/) that are excellent choices for use in modern applications today.
We would also like to promote the [`Temporal`](#/-project-status/future/) addition to the JavaScript language, which is looking for feedback and contributors.

**We now generally consider Moment to be a legacy project in maintenance mode.  It is not *dead*, but it is indeed *done*.**

In practice, this means:

- We will not be adding new features or capabilities.
- We will not be changing Moment's API to be immutable.
- We will not be addressing tree shaking or bundle size issues.
- We will not be making *any* major changes (no version 3).
- We may choose to not fix bugs or behavioral quirks, especially if they are long-standing known issues.

With specific regard to Moment's internationalization locale files:

- We may choose to not accept corrections to locale strings or localized date formats, especially if they have been argued successfully for their present form.
- You must make a new compelling argument for locale changes with significant, non-anecdotal evidence to support your position.
- If the string or format you are asking to change is reflected in the [CLDR](http://cldr.unicode.org/), then you must submit a change there *first* and have it accepted.

However, since we understand that Moment is well established in millions of existing projects:

- We *will* address critical security concerns as they arise.
- We *will* release data updates for Moment-Timezone following [IANA time zone database](https://www.iana.org/time-zones) releases.

### Reasons to keep using Moment

In most cases, you should not choose Moment for new projects.  However there are some possible reasons you might want to keep using it.

#### Browser support

Moment works well on Internet Explorer 8 and higher.  By contrast, Luxon only works on IE 10 and higher and requires a polyfill to do so.  [You can read more in Luxon's documentation.](https://moment.github.io/luxon/docs/manual/matrix.html)

Other libraries have also had issues with Safari, especially on mobile devices.  If you have a strong requirement to support older browsers, then you might want to stick with Moment for a bit longer.

However, [Day.js reports compatibility with IE8 and higher](https://day.js.org/docs/en/installation/installation) so you still may wish to consider that alternative.

#### Dependency by other libraries

Several other libraries, especially date pickers and graphing libraries, take Moment as a dependency.  If you are using such a component and cannot find an alternative, then you are already including Moment in your project.
Thus, it might make sense to continue using Moment throughout your project rather than including yet another date and time library.

#### Familiarity

If you are a long-time user of Moment, you may already understand its API and limitations well.  If so, and the aforementioned issues are not a concern for you, then you certainly can continue to use it.
