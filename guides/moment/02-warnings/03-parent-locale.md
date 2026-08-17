---
title: Parent Locale Undefined
---

Warning removed since **2.16.0**.

A locale can be defined with a parent before the parent itself is defined or loaded. If the parent doesn't exist or can't be lazy loaded when the moment is created, the parent will default to the global locale.
