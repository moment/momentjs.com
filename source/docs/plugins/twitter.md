If you're trying to format times for tweets (or just like the way Twitter does it), use the awesome [moment.twitter](https://github.com/hijonathan/moment.twitter) plugin by [@hijonathan](https://github.com/hijonathan). It's a simple way to display both short and long versions of human-readable timestamps.

Simple example.

```
moment(moment() + (36e5 * 5)).twitter()
// 5 hours
```

Yes, it does smart pluralization.

```
moment(moment() + 36e5).twitter()
// 1 hour
```

Not short enough for you?

```
moment(moment() + (864e5 * 6)).twitterShort()
// 6d
```
