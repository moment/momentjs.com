---
title: Customize
---

Most users only need to load and select an existing locale. See [Changing locale globally](#/i18n/changing-locale/) for details.

As of **2.12.0**, you can modify an existing locale with `moment.updateLocale`.

```javascript
moment.updateLocale('en', {
  /**/
});
```

Any properties specified will be updated, while others will remain the same. This function does not affect moments that already exist. Calling `updateLocale` also changes the current global locale to the locale being updated, so new moments will use that locale.

To revert an update use:

```javascript
moment.updateLocale('en', null);
```

**2.12.0** deprecated passing a configuration object to `moment.locale()` to change an existing locale. To select a global locale, continue to use `moment.locale(localeName)`.

To create a custom locale, use `moment.defineLocale`. See [Creating a Custom Locale](#/customization/creating-a-custom-locale/) for details.

```javascript
moment.defineLocale('en-my-settings', {
    // customizations.
});
```
