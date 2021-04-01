---
title: The Future
---

## **Temporal** - Better dates and times in the JavaScript language!

One day soon, we hope there won't be a strong need for date and time libraries in JavaScript at all.  Instead, we will be able to use capabilities of the JavaScript language itself.
Though some capabilities are here today with [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) and [`Intl`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl), we know from experience and data that there is significant room for improvement.

The effort to make better date and time APIs in the JavaScript language is being done via [The ECMA TC39 Temporal Proposal](https://tc39.es/proposal-temporal/docs/index.html).
It is currently at Stage 3 of [the TC39 process](https://tc39.es/process-document/).

`Temporal` will be a new global object that acts as a top-level namespace (like `Math`).  It exposes many separate types of objects including `Temporal.Instant`, `Temporal.ZonedDateTime`, `Temporal.PlainDateTime`, `Temporal.PlainDate`, `Temporal.PlainTime`, `Temporal.TimeZone` and several others.  The [Temporal Cookbook](https://tc39.es/proposal-temporal/docs/cookbook.html) shows many "recipes" with examples of how these objects can be used in different scenarios.

You can try out Temporal today, via [a non-production polyfill](https://github.com/tc39/proposal-temporal/tree/main/polyfill).  Please give it a try, but don't use it in production (yet)!

Please provide feedback, and consider contributing to this effort - especially if you have experience using Moment or other date and time libraries!
