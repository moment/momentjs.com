---
title: Filter Years, Create Links, and Pack
signature: |
  moment.tz.filterLinkPack(UnpackedBundle, Number, Number); // PackedBundle
---

The packing, link creation, and subsetting of years are all tools for compressing data
to be transported to the client.

The `moment.tz.filterLinkPack` method combines all these into one simple interface.
Pass in an unpacked bundle, start year, and end year and get a filtered, linked, packed bundle back.

This is what is being used to compress the output for the [bundled data + library files on the
homepage](/timezone/).