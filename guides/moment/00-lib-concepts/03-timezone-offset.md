---
title: Time Zone vs Offset
---

Frequently, people are confused about the difference between time zones and UTC offsets. 

A UTC offset is a value that represents how far a particular date and time is from UTC. It is expressed in the format HH:mm most of the time.

A time zone is a geographical region where all people observe a legally mandated standard time. 

A time zone usually has more than one offset from UTC due to daylight saving time. Several time zones may have the same offset at some point during the year.
For example, the time zones America/Chicago, America/Denver, and America/Belize all have an offset of -06:00 at varying times. 
For this reason, it is impossible to infer a time zone from just an offset value.

The Moment.js core library provides functionality related to adjusting times based on an offset value. 
It does not provide support for adjusting dates based on time zone data - this is provided by the Moment TimeZone library.

<a href="https://stackoverflow.com/tags/timezone/info" target="_blank" >For an in depth description of this issue, see the Stack Overflow tag.</a>