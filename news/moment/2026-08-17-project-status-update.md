---
title: Project Status Update
date: "2026-08-17"
published: August 17, 2026
---

It has been almost six years since we last wrote about the status of Moment.js.
That is a long time on the web, and the way software is written has changed in
ways we did not anticipate in 2020.

The most significant change is the arrival of AI-assisted and agentic software
development. Moment appears throughout the code, documentation, tutorials, and
questions on which coding agents learned. It is familiar to those systems, just
as it is familiar to generations of JavaScript developers. Agents now select
Moment, add it to projects, write code with it, and encounter it in existing
dependency trees, often without a person making a deliberate library choice.

Weekly downloads have more than tripled since our previous update. Download
counts have never been a precise measure of people or projects, and automated
workflows make them even less so. Still, we believe most of this new growth is
connected to agentic use, and the code being produced is real code that people
will need to run and maintain.

This has caused us to reconsider how we talk about Moment's long-term
maintenance. The spirit of our 2020 message has not changed: Moment is a legacy
project, and stability for existing users matters more than expanding its scope.
But we were shortsighted to say that there would never be a version 3, or to
rule out entire categories of technical work forever.

## What maintenance mode means

We are not accepting new user-facing features or capabilities. We also are not
redesigning Moment's mutable API or changing established behavior simply to
align it with newer API conventions. For the millions of projects that already
rely on Moment, predictability remains one of its most important features.

That does not mean every valid bug report will result in a change. Sometimes a
behavioral quirk has itself become part of what applications rely on. We will
weigh severity and expected benefit against compatibility risk, established
behavior, and the time available from volunteer maintainers. In some cases, the
most responsible maintenance decision will be to leave existing behavior alone.

It also does not mean the project must remain technically frozen. Maintainers
may undertake work on Moment's implementation, packaging, TypeScript
declarations, build and release tooling, bundle composition, or runtime support.
That work will be planned and initiated by the maintainers so that it can be
considered as a whole rather than arriving as disconnected modernization
proposals.

### Upcoming releases and version 3

We expect to publish some Moment 2.x maintenance updates soon. These will focus
on changes that can be delivered without breaking the compatibility promises of
the 2.x line.

There is also a class of bugs and technical maintenance tasks that we cannot fix
correctly in a 2.x release. Correcting them may change documented APIs,
long-established output, packaging behavior, or another contract covered by
semantic versioning. Even when the goal is maintenance, those changes require a
major version number.

For that reason, maintenance mode no longer categorically rules out Moment 3.0.
A 3.0 release would not restart feature development or turn Moment into a new
library. It would still be a maintenance release, using a major version where
semver requires us to acknowledge breaking changes honestly. We do not have a
Moment 3.0 schedule to announce today.

### Locale updates

Locale data has always depended on balancing published standards with the real
conventions of the people and cultures represented. Our preferred baseline is
the latest published [Unicode CLDR](https://cldr.unicode.org/) data, but CLDR is
not an absolute gate. We may use a different convention when strong,
authoritative language or cultural evidence shows that CLDR is stale,
inaccurate, or does not reflect documented usage.

We ask contributors to include supporting sources when they can, but sources
are not a requirement. Maintainers will independently validate proposed
behavior. If a proposal revisits a previous discussion or decision, please
explain what new context or evidence supports reconsidering it.

### Security and time zone data

Please submit security reports privately through the Moment repository's
[security page](https://github.com/moment/moment/security). We will acknowledge
and assess every report, and we will address critical security concerns that
affect Moment.js. Depending on severity, impact, practical mitigations,
compatibility risk, and maintainer capacity, other reports may result in a fix,
mitigation, documentation, or no code change.

Moment Timezone data updates will continue to follow
[IANA time zone database](https://www.iana.org/time-zones) releases.

<!-- Signoff -->

Moment is maintained by volunteers, so priorities and response times will
continue to depend on available capacity. We are grateful to everyone who has
used, supported, and contributed to the project over the years, and to everyone
helping us care for the software that still depends on it.
