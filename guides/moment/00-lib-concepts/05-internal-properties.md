---
title: Internal Properties
---

Moment objects have several internal properties that are prefixed with ``_``.

The most commonly viewed internal property is the ``_d`` property that holds the JavaScript Date that Moment wrappers. 
Frequently, developers are confused by console output of the value of ``_d``. 
Moment uses a technique called epoch shifting that causes this property to sometimes differ from the actual date value that the Moment reflects.
In particular if Moment TimeZone is in use, this property will almost never be the same as the actual value that Moment will output from its public ``.format()`` function.
As such, the values of ``_d`` and any other properties prefixed with ``_`` should not be used for any purpose. 

To print out the value of a Moment, use ``.format()``, ``.toString()`` or ``.toISOString()``.

To retrieve a native Date object from Moment, use ``.toDate()``. This function returns a properly shifted date for interaction with third party APIs.

