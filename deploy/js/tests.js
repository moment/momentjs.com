/*!
 * Nodeunit
 * https://github.com/caolan/nodeunit
 * Copyright (c) 2010 Caolan McMahon
 * MIT Licensed
 *
 * json2.js
 * http://www.JSON.org/json2.js
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */
nodeunit = (function(){
/*
    http://www.JSON.org/json2.js
    2010-11-17

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false, regexp: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

var JSON = {};

(function () {
    "use strict";

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
var assert = this.assert = {};
var types = {};
var core = {};
var nodeunit = {};
var reporter = {};
/*global setTimeout: false, console: false */
(function () {

    var async = {};

    // global on the server, window in the browser
    var root = this,
        previous_async = root.async;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = async;
    }
    else {
        root.async = async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    //// cross-browser compatiblity functions ////

    var _forEach = function (arr, iterator) {
        if (arr.forEach) {
            return arr.forEach(iterator);
        }
        for (var i = 0; i < arr.length; i += 1) {
            iterator(arr[i], i, arr);
        }
    };

    var _map = function (arr, iterator) {
        if (arr.map) {
            return arr.map(iterator);
        }
        var results = [];
        _forEach(arr, function (x, i, a) {
            results.push(iterator(x, i, a));
        });
        return results;
    };

    var _reduce = function (arr, iterator, memo) {
        if (arr.reduce) {
            return arr.reduce(iterator, memo);
        }
        _forEach(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    };

    var _keys = function (obj) {
        if (Object.keys) {
            return Object.keys(obj);
        }
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    var _indexOf = function (arr, item) {
        if (arr.indexOf) {
            return arr.indexOf(item);
        }
        for (var i = 0; i < arr.length; i += 1) {
            if (arr[i] === item) {
                return i;
            }
        }
        return -1;
    };

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////
    if (typeof process === 'undefined' || !(process.nextTick)) {
        async.nextTick = function (fn) {
            setTimeout(fn, 0);
        };
    }
    else {
        async.nextTick = process.nextTick;
    }

    async.forEach = function (arr, iterator, callback) {
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        _forEach(arr, function (x) {
            iterator(x, function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed === arr.length) {
                        callback();
                    }
                }
            });
        });
    };

    async.forEachSeries = function (arr, iterator, callback) {
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        var iterate = function () {
            iterator(arr[completed], function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed === arr.length) {
                        callback();
                    }
                    else {
                        iterate();
                    }
                }
            });
        };
        iterate();
    };


    var doParallel = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.forEach].concat(args));
        };
    };
    var doSeries = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.forEachSeries].concat(args));
        };
    };


    var _asyncMap = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (err, v) {
                results[x.index] = v;
                callback(err);
            });
        }, function (err) {
            callback(err, results);
        });
    };
    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);


    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.reduce = function (arr, memo, iterator, callback) {
        async.forEachSeries(arr, function (x, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    };
    // inject alias
    async.inject = async.reduce;
    // foldl alias
    async.foldl = async.reduce;

    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, function (x) {
            return x;
        }).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };
    // foldr alias
    async.foldr = async.reduceRight;

    var _filter = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.filter = doParallel(_filter);
    async.filterSeries = doSeries(_filter);
    // select alias
    async.select = async.filter;
    async.selectSeries = async.filterSeries;

    var _reject = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (!v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.reject = doParallel(_reject);
    async.rejectSeries = doSeries(_reject);

    var _detect = function (eachfn, arr, iterator, main_callback) {
        eachfn(arr, function (x, callback) {
            iterator(x, function (result) {
                if (result) {
                    main_callback(x);
                }
                else {
                    callback();
                }
            });
        }, function (err) {
            main_callback();
        });
    };
    async.detect = doParallel(_detect);
    async.detectSeries = doSeries(_detect);

    async.some = function (arr, iterator, main_callback) {
        async.forEach(arr, function (x, callback) {
            iterator(x, function (v) {
                if (v) {
                    main_callback(true);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(false);
        });
    };
    // any alias
    async.any = async.some;

    async.every = function (arr, iterator, main_callback) {
        async.forEach(arr, function (x, callback) {
            iterator(x, function (v) {
                if (!v) {
                    main_callback(false);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(true);
        });
    };
    // all alias
    async.all = async.every;

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                var fn = function (left, right) {
                    var a = left.criteria, b = right.criteria;
                    return a < b ? -1 : a > b ? 1 : 0;
                };
                callback(null, _map(results.sort(fn), function (x) {
                    return x.value;
                }));
            }
        });
    };

    async.auto = function (tasks, callback) {
        callback = callback || function () {};
        var keys = _keys(tasks);
        if (!keys.length) {
            return callback(null);
        }

        var completed = [];

        var listeners = [];
        var addListener = function (fn) {
            listeners.unshift(fn);
        };
        var removeListener = function (fn) {
            for (var i = 0; i < listeners.length; i += 1) {
                if (listeners[i] === fn) {
                    listeners.splice(i, 1);
                    return;
                }
            }
        };
        var taskComplete = function () {
            _forEach(listeners, function (fn) {
                fn();
            });
        };

        addListener(function () {
            if (completed.length === keys.length) {
                callback(null);
            }
        });

        _forEach(keys, function (k) {
            var task = (tasks[k] instanceof Function) ? [tasks[k]]: tasks[k];
            var taskCallback = function (err) {
                if (err) {
                    callback(err);
                    // stop subsequent errors hitting callback multiple times
                    callback = function () {};
                }
                else {
                    completed.push(k);
                    taskComplete();
                }
            };
            var requires = task.slice(0, Math.abs(task.length - 1)) || [];
            var ready = function () {
                return _reduce(requires, function (a, x) {
                    return (a && _indexOf(completed, x) !== -1);
                }, true);
            };
            if (ready()) {
                task[task.length - 1](taskCallback);
            }
            else {
                var listener = function () {
                    if (ready()) {
                        removeListener(listener);
                        task[task.length - 1](taskCallback);
                    }
                };
                addListener(listener);
            }
        });
    };

    async.waterfall = function (tasks, callback) {
        if (!tasks.length) {
            return callback();
        }
        callback = callback || function () {};
        var wrapIterator = function (iterator) {
            return function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    var args = Array.prototype.slice.call(arguments, 1);
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    async.nextTick(function () {
                        iterator.apply(null, args);
                    });
                }
            };
        };
        wrapIterator(async.iterator(tasks))();
    };

    async.parallel = function (tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor === Array) {
            async.map(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args || null);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            async.forEach(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.series = function (tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor === Array) {
            async.mapSeries(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args || null);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            async.forEachSeries(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.iterator = function (tasks) {
        var makeCallback = function (index) {
            var fn = function () {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            };
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        };
        return makeCallback(0);
    };

    async.apply = function (fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function () {
            return fn.apply(
                null, args.concat(Array.prototype.slice.call(arguments))
            );
        };
    };

    var _concat = function (eachfn, arr, fn, callback) {
        var r = [];
        eachfn(arr, function (x, cb) {
            fn(x, function (err, y) {
                r = r.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, r);
        });
    };
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        if (test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.whilst(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.until = function (test, iterator, callback) {
        if (!test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.until(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.queue = function (worker, concurrency) {
        var workers = 0;
        var tasks = [];
        var q = {
            concurrency: concurrency,
            push: function (data, callback) {
                tasks.push({data: data, callback: callback});
                async.nextTick(q.process);
            },
            process: function () {
                if (workers < q.concurrency && tasks.length) {
                    var task = tasks.splice(0, 1)[0];
                    workers += 1;
                    worker(task.data, function () {
                        workers -= 1;
                        if (task.callback) {
                            task.callback.apply(task, arguments);
                        }
                        q.process();
                    });
                }
            },
            length: function () {
                return tasks.length;
            }
        };
        return q;
    };

    var _console_fn = function (name) {
        return function (fn) {
            var args = Array.prototype.slice.call(arguments, 1);
            fn.apply(null, args.concat([function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (typeof console !== 'undefined') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _forEach(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            }]));
        };
    };
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        hasher = hasher || function (x) {
            return x;
        };
        return function () {
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (key in memo) {
                callback.apply(null, memo[key]);
            }
            else {
                fn.apply(null, args.concat([function () {
                    memo[key] = arguments;
                    callback.apply(null, arguments);
                }]));
            }
        };
    };

}());
(function(exports){
/**
 * This file is based on the node.js assert module, but with some small
 * changes for browser-compatibility
 * THIS FILE SHOULD BE BROWSER-COMPATIBLE JS!
 */


/**
 * Added for browser compatibility
 */

var _keys = function(obj){
    if(Object.keys) return Object.keys(obj);
    if (typeof obj != 'object' && typeof obj != 'function') {
        throw new TypeError('-');
    }
    var keys = [];
    for(var k in obj){
        if(obj.hasOwnProperty(k)) keys.push(k);
    }
    return keys;
};



// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


var pSlice = Array.prototype.slice;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = exports;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({message: message, actual: actual, expected: expected})

assert.AssertionError = function AssertionError (options) {
  this.name = "AssertionError";
  this.message = options.message;
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
};
// code from util.inherits in node
assert.AssertionError.super_ = Error;


// EDITED FOR BROWSER COMPATIBILITY: replaced Object.create call
// TODO: test what effect this may have
var ctor = function () { this.constructor = assert.AssertionError; };
ctor.prototype = Error.prototype;
assert.AssertionError.prototype = new ctor();


assert.AssertionError.prototype.toString = function() {
  if (this.message) {
    return [this.name+":", this.message].join(' ');
  } else {
    return [ this.name+":"
           , JSON.stringify(this.expected )
           , this.operator
           , JSON.stringify(this.actual)
           ].join(" ");
  }
};

// assert.AssertionError instanceof Error

assert.AssertionError.__proto__ = Error.prototype;

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

assert.ok = function ok(value, message) {
  if (!!!value) fail(value, true, message, "==", assert.ok);
};

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, "==", assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, "!=", assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, "deepEqual", assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  // 7.3. Other pairs that do not both pass typeof value == "object",
  // equivalence is determined by ==.
  } else if (typeof actual != 'object' && typeof expected != 'object') {
    return actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical "prototype" property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isUndefinedOrNull (value) {
  return value === null || value === undefined;
}

function isArguments (object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv (a, b) {
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  // an identical "prototype" property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  try{
    var ka = _keys(a),
      kb = _keys(b),
      key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key] ))
       return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, "notDeepEqual", assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, "===", assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as determined by !==.
// assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, "!==", assert.notStrictEqual);
  }
};

function _throws (shouldThrow, block, err, message) {
  var exception = null,
      threw = false,
      typematters = true;

  message = message || "";

  //handle optional arguments
  if (arguments.length == 3) {
    if (typeof(err) == "string") {
      message = err;
      typematters = false;
    }
  } else if (arguments.length == 2) {
    typematters = false;
  }

  try {
    block();
  } catch (e) {
    threw = true;
    exception = e;
  }

  if (shouldThrow && !threw) {
    fail( "Missing expected exception"
        + (err && err.name ? " ("+err.name+")." : '.')
        + (message ? " " + message : "")
        );
  }
  if (!shouldThrow && threw && typematters && exception instanceof err) {
    fail( "Got unwanted exception"
        + (err && err.name ? " ("+err.name+")." : '.')
        + (message ? " " + message : "")
        );
  }
  if ((shouldThrow && threw && typematters && !(exception instanceof err)) ||
      (!shouldThrow && threw)) {
    throw exception;
  }
};

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function (err) { if (err) {throw err;}};
})(assert);
(function(exports){
/*!
 * Nodeunit
 * Copyright (c) 2010 Caolan McMahon
 * MIT Licensed
 *
 * THIS FILE SHOULD BE BROWSER-COMPATIBLE JS!
 * You can use @REMOVE_LINE_FOR_BROWSER to remove code from the browser build.
 * Only code on that line will be removed, its mostly to avoid requiring code
 * that is node specific
 */

/**
 * Module dependencies
 */

//var assert = require('./assert'),     //@REMOVE_LINE_FOR_BROWSER
//    async = require('../deps/async'); //@REMOVE_LINE_FOR_BROWSER


/**
 * Creates assertion objects representing the result of an assert call.
 * Accepts an object or AssertionError as its argument.
 *
 * @param {object} obj
 * @api public
 */

exports.assertion = function (obj) {
    return {
        method: obj.method || '',
        message: obj.message || (obj.error && obj.error.message) || '',
        error: obj.error,
        passed: function () {
            return !this.error;
        },
        failed: function () {
            return Boolean(this.error);
        }
    };
};

/**
 * Creates an assertion list object representing a group of assertions.
 * Accepts an array of assertion objects.
 *
 * @param {Array} arr
 * @param {Number} duration
 * @api public
 */

exports.assertionList = function (arr, duration) {
    var that = arr || [];
    that.failures = function () {
        var failures = 0;
        for (var i = 0; i < this.length; i += 1) {
            if (this[i].failed()) {
                failures += 1;
            }
        }
        return failures;
    };
    that.passes = function () {
        return that.length - that.failures();
    };
    that.duration = duration || 0;
    return that;
};

/**
 * Create a wrapper function for assert module methods. Executes a callback
 * after the it's complete with an assertion object representing the result.
 *
 * @param {Function} callback
 * @api private
 */

var assertWrapper = function (callback) {
    return function (new_method, assert_method, arity) {
        return function () {
            var message = arguments[arity - 1];
            var a = exports.assertion({method: new_method, message: message});
            try {
                assert[assert_method].apply(null, arguments);
            }
            catch (e) {
                a.error = e;
            }
            callback(a);
        };
    };
};

/**
 * Creates the 'test' object that gets passed to every test function.
 * Accepts the name of the test function as its first argument, followed by
 * the start time in ms, the options object and a callback function.
 *
 * @param {String} name
 * @param {Number} start
 * @param {Object} options
 * @param {Function} callback
 * @api public
 */

exports.test = function (name, start, options, callback) {
    var expecting;
    var a_list = [];

    var wrapAssert = assertWrapper(function (a) {
        a_list.push(a);
        if (options.log) {
            async.nextTick(function () {
                options.log(a);
            });
        }
    });

    var test = {
        done: function (err) {
            if (expecting !== undefined && expecting !== a_list.length) {
                var e = new Error(
                    'Expected ' + expecting + ' assertions, ' +
                    a_list.length + ' ran'
                );
                var a1 = exports.assertion({method: 'expect', error: e});
                a_list.push(a1);
                if (options.log) {
                    async.nextTick(function () {
                        options.log(a1);
                    });
                }
            }
            if (err) {
                var a2 = exports.assertion({error: err});
                a_list.push(a2);
                if (options.log) {
                    async.nextTick(function () {
                        options.log(a2);
                    });
                }
            }
            var end = new Date().getTime();
            async.nextTick(function () {
                var assertion_list = exports.assertionList(a_list, end - start);
                options.testDone(name, assertion_list);
                callback(null, a_list);
            });
        },
        ok: wrapAssert('ok', 'ok', 2),
        same: wrapAssert('same', 'deepEqual', 3),
        equals: wrapAssert('equals', 'equal', 3),
        expect: function (num) {
            expecting = num;
        },
        _assertion_list: a_list
    };
    // add all functions from the assert module
    for (var k in assert) {
        if (assert.hasOwnProperty(k)) {
            test[k] = wrapAssert(k, k, assert[k].length);
        }
    }
    return test;
};

/**
 * Ensures an options object has all callbacks, adding empty callback functions
 * if any are missing.
 *
 * @param {Object} opt
 * @return {Object}
 * @api public
 */

exports.options = function (opt) {
    var optionalCallback = function (name) {
        opt[name] = opt[name] || function () {};
    };

    optionalCallback('moduleStart');
    optionalCallback('moduleDone');
    optionalCallback('testStart');
    optionalCallback('testDone');
    //optionalCallback('log');

    // 'done' callback is not optional.

    return opt;
};
})(types);
(function(exports){
/*!
 * Nodeunit
 * Copyright (c) 2010 Caolan McMahon
 * MIT Licensed
 *
 * THIS FILE SHOULD BE BROWSER-COMPATIBLE JS!
 * You can use @REMOVE_LINE_FOR_BROWSER to remove code from the browser build.
 * Only code on that line will be removed, its mostly to avoid requiring code
 * that is node specific
 */

/**
 * Module dependencies
 */

//var async = require('../deps/async'), //@REMOVE_LINE_FOR_BROWSER
//    types = require('./types');       //@REMOVE_LINE_FOR_BROWSER


/**
 * Added for browser compatibility
 */

var _keys = function (obj) {
    if (Object.keys) {
        return Object.keys(obj);
    }
    var keys = [];
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
            keys.push(k);
        }
    }
    return keys;
};


var _copy = function (obj) {
    var nobj = {};
    var keys = _keys(obj);
    for (var i = 0; i <  keys.length; i += 1) {
        nobj[keys[i]] = obj[keys[i]];
    }
    return nobj;
};


/**
 * Runs a test function (fn) from a loaded module. After the test function
 * calls test.done(), the callback is executed with an assertionList as its
 * second argument.
 *
 * @param {String} name
 * @param {Function} fn
 * @param {Object} opt
 * @param {Function} callback
 * @api public
 */

exports.runTest = function (name, fn, opt, callback) {
    var options = types.options(opt);

    options.testStart(name);
    var start = new Date().getTime();
    var test = types.test(name, start, options, callback);

    try {
        fn(test);
    }
    catch (e) {
        test.done(e);
    }
};

/**
 * Takes an object containing test functions or other test suites as properties
 * and runs each in series. After all tests have completed, the callback is
 * called with a list of all assertions as the second argument.
 *
 * If a name is passed to this function it is prepended to all test and suite
 * names that run within it.
 *
 * @param {String} name
 * @param {Object} suite
 * @param {Object} opt
 * @param {Function} callback
 * @api public
 */

exports.runSuite = function (name, suite, opt, callback) {
    var keys = _keys(suite);

    async.concatSeries(keys, function (k, cb) {
        var prop = suite[k], _name;

        _name = name ? [].concat(name, k) : [k];

        _name.toString = function () {
            // fallback for old one
            return this.join(' - ');
        };

        if (typeof prop === 'function') {
            var in_name = false;
            for (var i = 0; i < _name.length; i += 1) {
                if (_name[i] === opt.testspec) {
                    in_name = true;
                }
            }
            if (!opt.testspec || in_name) {
                if (opt.moduleStart) {
                    opt.moduleStart();
                }
                exports.runTest(_name, suite[k], opt, cb);
            }
            else {
                return cb();
            }
        }
        else {
            exports.runSuite(_name, suite[k], opt, cb);
        }
    }, callback);
};

/**
 * Run each exported test function or test suite from a loaded module.
 *
 * @param {String} name
 * @param {Object} mod
 * @param {Object} opt
 * @param {Function} callback
 * @api public
 */

exports.runModule = function (name, mod, opt, callback) {
    var options = _copy(types.options(opt));

    var _run = false;
    var _moduleStart = options.moduleStart;
    function run_once() {
        if (!_run) {
            _run = true;
            _moduleStart(name);
        }
    }
    options.moduleStart = run_once;

    var start = new Date().getTime();

    exports.runSuite(null, mod, options, function (err, a_list) {
        var end = new Date().getTime();
        var assertion_list = types.assertionList(a_list, end - start);
        options.moduleDone(name, assertion_list);
        callback(null, a_list);
    });
};

/**
 * Treats an object literal as a list of modules keyed by name. Runs each
 * module and finished with calling 'done'. You can think of this as a browser
 * safe alternative to runFiles in the nodeunit module.
 *
 * @param {Object} modules
 * @param {Object} opt
 * @api public
 */

// TODO: add proper unit tests for this function
exports.runModules = function (modules, opt) {
    var all_assertions = [];
    var options = types.options(opt);
    var start = new Date().getTime();

    async.concatSeries(_keys(modules), function (k, cb) {
        exports.runModule(k, modules[k], options, cb);
    },
    function (err, all_assertions) {
        var end = new Date().getTime();
        options.done(types.assertionList(all_assertions, end - start));
    });
};


/**
 * Wraps a test function with setUp and tearDown functions.
 * Used by testCase.
 *
 * @param {Function} setUp
 * @param {Function} tearDown
 * @param {Function} fn
 * @api private
 */

var wrapTest = function (setUp, tearDown, fn) {
    return function (test) {
        var context = {};
        if (tearDown) {
            var done = test.done;
            test.done = function (err) {
                try {
                    tearDown.call(context, function (err2) {
                        if (err && err2) {
                            test._assertion_list.push(
                                types.assertion({error: err})
                            );
                            return done(err2);
                        }
                        done(err || err2);
                    });
                }
                catch (e) {
                    done(e);
                }
            };
        }
        if (setUp) {
            setUp.call(context, function (err) {
                if (err) {
                    return test.done(err);
                }
                fn.call(context, test);
            });
        }
        else {
            fn.call(context, test);
        }
    };
};


/**
 * Wraps a group of tests with setUp and tearDown functions.
 * Used by testCase.
 *
 * @param {Function} setUp
 * @param {Function} tearDown
 * @param {Object} group
 * @api private
 */

var wrapGroup = function (setUp, tearDown, group) {
    var tests = {};
    var keys = _keys(group);
    for (var i = 0; i < keys.length; i += 1) {
        var k = keys[i];
        if (typeof group[k] === 'function') {
            tests[k] = wrapTest(setUp, tearDown, group[k]);
        }
        else if (typeof group[k] === 'object') {
            tests[k] = wrapGroup(setUp, tearDown, group[k]);
        }
    }
    return tests;
};


/**
 * Utility for wrapping a suite of test functions with setUp and tearDown
 * functions.
 *
 * @param {Object} suite
 * @return {Object}
 * @api public
 */

exports.testCase = function (suite) {
    var setUp = suite.setUp;
    var tearDown = suite.tearDown;
    delete suite.setUp;
    delete suite.tearDown;
    return wrapGroup(setUp, tearDown, suite);
};
})(core);
(function(exports){
/*!
 * Nodeunit
 * Copyright (c) 2010 Caolan McMahon
 * MIT Licensed
 *
 * THIS FILE SHOULD BE BROWSER-COMPATIBLE JS!
 * You can use @REMOVE_LINE_FOR_BROWSER to remove code from the browser build.
 * Only code on that line will be removed, its mostly to avoid requiring code
 * that is node specific
 */


/**
 * NOTE: this test runner is not listed in index.js because it cannot be
 * used with the command-line tool, only inside the browser.
 */


/**
 * Reporter info string
 */

exports.info = "Browser-based test reporter";


/**
 * Run all tests within each module, reporting the results
 *
 * @param {Array} files
 * @api public
 */

exports.run = function (modules, options) {
    var start = new Date().getTime();

    function setText(el, txt) {
        if ('innerText' in el) {
            el.innerText = txt;
        }
        else if ('textContent' in el){
            el.textContent = txt;
        }
    }

    function getOrCreate(tag, id) {
        var el = document.getElementById(id);
        if (!el) {
            el = document.createElement(tag);
            el.id = id;
            document.body.appendChild(el);
        }
        return el;
    };

    var header = getOrCreate('h1', 'nodeunit-header');
    var banner = getOrCreate('h2', 'nodeunit-banner');
    var userAgent = getOrCreate('h2', 'nodeunit-userAgent');
    var tests = getOrCreate('ol', 'nodeunit-tests');
    var result = getOrCreate('p', 'nodeunit-testresult');

    setText(userAgent, navigator.userAgent);

    nodeunit.runModules(modules, {
        moduleStart: function (name) {
            /*var mheading = document.createElement('h2');
            mheading.innerText = name;
            results.appendChild(mheading);
            module = document.createElement('ol');
            results.appendChild(module);*/
        },
        testDone: function (name, assertions) {
            var test = document.createElement('li');
            var strong = document.createElement('strong');
            strong.innerHTML = name + ' <b style="color: black;">(' +
                '<b class="fail">' + assertions.failures() + '</b>, ' +
                '<b class="pass">' + assertions.passes() + '</b>, ' +
                assertions.length +
            ')</b>';
            test.className = assertions.failures() ? 'fail': 'pass';
            test.appendChild(strong);

            var aList = document.createElement('ol');
            aList.style.display = 'none';
            test.onclick = function () {
                var d = aList.style.display;
                aList.style.display = (d == 'none') ? 'block': 'none';
            };
            for (var i=0; i<assertions.length; i++) {
                var li = document.createElement('li');
                var a = assertions[i];
                if (a.failed()) {
                    li.innerHTML = (a.message || a.method || 'no message') +
                        '<pre>' + (a.error.stack || a.error) + '</pre>';
                    li.className = 'fail';
                }
                else {
                    li.innerHTML = a.message || a.method || 'no message';
                    li.className = 'pass';
                }
                aList.appendChild(li);
            }
            test.appendChild(aList);
            tests.appendChild(test);
        },
        done: function (assertions) {
            var end = new Date().getTime();
            var duration = end - start;

            var failures = assertions.failures();
            banner.className = failures ? 'fail': 'pass';

            result.innerHTML = 'Tests completed in ' + duration +
                ' milliseconds.<br/><span class="passed">' +
                assertions.passes() + '</span> assertions of ' +
                '<span class="all">' + assertions.length + '<span> passed, ' +
                assertions.failures() + ' failed.';
        }
    });
};
})(reporter);
nodeunit = core;
nodeunit.assert = assert;
nodeunit.reporter = reporter;
nodeunit.run = reporter.run;
return nodeunit; })();
var moment = require("../../moment");

exports.add_subtract = {
    "add and subtract short" : function(test) {
        test.expect(12);

        var a = moment();
        a.year(2011);
        a.month(9);
        a.date(12);
        a.hours(6);
        a.minutes(7);
        a.seconds(8);
        a.milliseconds(500);

        test.equal(a.add({ms:50}).milliseconds(), 550, 'Add milliseconds');
        test.equal(a.add({s:1}).seconds(), 9, 'Add seconds');
        test.equal(a.add({m:1}).minutes(), 8, 'Add minutes');
        test.equal(a.add({h:1}).hours(), 7, 'Add hours');
        test.equal(a.add({d:1}).date(), 13, 'Add date');
        test.equal(a.add({w:1}).date(), 20, 'Add week');
        test.equal(a.add({M:1}).month(), 10, 'Add month');
        test.equal(a.add({y:1}).year(), 2012, 'Add year');

        var b = moment([2010, 0, 31]).add({M:1});
        var c = moment([2010, 1, 28]).subtract({M:1});

        test.equal(b.month(), 1, 'add month, jan 31st to feb 28th');
        test.equal(b.date(), 28, 'add month, jan 31st to feb 28th');
        test.equal(c.month(), 0, 'subtract month, feb 28th to jan 28th');
        test.equal(c.date(), 28, 'subtract month, feb 28th to jan 28th');
        test.done();
    },

    "add and subtract long" : function(test) {
        test.expect(8);

        var a = moment();
        a.year(2011);
        a.month(9);
        a.date(12);
        a.hours(6);
        a.minutes(7);
        a.seconds(8);
        a.milliseconds(500);

        test.equal(a.add({milliseconds:50}).milliseconds(), 550, 'Add milliseconds');
        test.equal(a.add({seconds:1}).seconds(), 9, 'Add seconds');
        test.equal(a.add({minutes:1}).minutes(), 8, 'Add minutes');
        test.equal(a.add({hours:1}).hours(), 7, 'Add hours');
        test.equal(a.add({days:1}).date(), 13, 'Add date');
        test.equal(a.add({weeks:1}).date(), 20, 'Add week');
        test.equal(a.add({months:1}).month(), 10, 'Add month');
        test.equal(a.add({years:1}).year(), 2012, 'Add year');
        test.done();
    },

    "add and subtract string long" : function(test) {
        test.expect(9);

        var a = moment();
        a.year(2011);
        a.month(9);
        a.date(12);
        a.hours(6);
        a.minutes(7);
        a.seconds(8);
        a.milliseconds(500);

        var b = a.clone();

        test.equal(a.add('milliseconds', 50).milliseconds(), 550, 'Add milliseconds');
        test.equal(a.add('seconds', 1).seconds(), 9, 'Add seconds');
        test.equal(a.add('minutes', 1).minutes(), 8, 'Add minutes');
        test.equal(a.add('hours', 1).hours(), 7, 'Add hours');
        test.equal(a.add('days', 1).date(), 13, 'Add date');
        test.equal(a.add('weeks', 1).date(), 20, 'Add week');
        test.equal(a.add('months', 1).month(), 10, 'Add month');
        test.equal(a.add('years', 1).year(), 2012, 'Add year');
        test.equal(b.add('days', '01').date(), 13, 'Add date');
        test.done();
    },

    "add and subtract string short" : function(test) {
        test.expect(8);

        var a = moment();
        a.year(2011);
        a.month(9);
        a.date(12);
        a.hours(6);
        a.minutes(7);
        a.seconds(8);
        a.milliseconds(500);

        test.equal(a.add('ms', 50).milliseconds(), 550, 'Add milliseconds');
        test.equal(a.add('s', 1).seconds(), 9, 'Add seconds');
        test.equal(a.add('m', 1).minutes(), 8, 'Add minutes');
        test.equal(a.add('h', 1).hours(), 7, 'Add hours');
        test.equal(a.add('d', 1).date(), 13, 'Add date');
        test.equal(a.add('w', 1).date(), 20, 'Add week');
        test.equal(a.add('M', 1).month(), 10, 'Add month');
        test.equal(a.add('y', 1).year(), 2012, 'Add year');
        test.done();
    },

    "add across DST" : function(test) {
        test.expect(3);

        var a = moment(new Date(2011, 2, 12, 5, 0, 0));
        var b = moment(new Date(2011, 2, 12, 5, 0, 0));
        var c = moment(new Date(2011, 2, 12, 5, 0, 0));
        var d = moment(new Date(2011, 2, 12, 5, 0, 0));
        a.add('days', 1);
        b.add('hours', 24);
        c.add('months', 1);
        test.equal(a.hours(), 5, 'adding days over DST difference should result in the same hour');
        if (b.isDST() && !d.isDST()) {
            test.equal(b.hours(), 6, 'adding hours over DST difference should result in a different hour');
        } else {
            test.equal(b.hours(), 5, 'adding hours over DST difference should result in a same hour if the timezone does not have daylight savings time');
        }
        test.equal(c.hours(), 5, 'adding months over DST difference should result in the same hour');
        test.done();
    }
};
var moment = require("../../moment");

exports.create = {
    "array" : function(test) {
        test.expect(8);
        test.ok(moment([2010]).native() instanceof Date, "[2010]");
        test.ok(moment([2010, 1]).native() instanceof Date, "[2010, 1]");
        test.ok(moment([2010, 1, 12]).native() instanceof Date, "[2010, 1, 12]");
        test.ok(moment([2010, 1, 12, 1]).native() instanceof Date, "[2010, 1, 12, 1]");
        test.ok(moment([2010, 1, 12, 1, 1]).native() instanceof Date, "[2010, 1, 12, 1, 1]");
        test.ok(moment([2010, 1, 12, 1, 1, 1]).native() instanceof Date, "[2010, 1, 12, 1, 1, 1]");
        test.ok(moment([2010, 1, 12, 1, 1, 1, 1]).native() instanceof Date, "[2010, 1, 12, 1, 1, 1, 1]");
        test.deepEqual(moment(new Date(2010, 1, 14, 15, 25, 50, 125)), moment([2010, 1, 14, 15, 25, 50, 125]), "constructing with array === constructing with new Date()");
        test.done();
    },

    "number" : function(test) {
        test.expect(2);
        test.ok(moment(1000).native() instanceof Date, "1000");
        test.ok((moment(1000).valueOf() === 1000), "testing valueOf");
        test.done();
    },

    "date" : function(test) {
        test.expect(1);
        test.ok(moment(new Date()).native() instanceof Date, "new Date()");
        test.done();
    },

    "moment" : function(test) {
        test.expect(2);
        test.ok(moment(moment()).native() instanceof Date, "moment(moment())");
        test.ok(moment(moment(moment())).native() instanceof Date, "moment(moment(moment()))");
        test.done();
    },

    "undefined" : function(test) {
        test.expect(1);
        test.ok(moment().native() instanceof Date, "undefined");
        test.done();
    },

    "string without format" : function(test) {
        test.expect(2);
        test.ok(moment("Aug 9, 1995").native() instanceof Date, "Aug 9, 1995");
        test.ok(moment("Mon, 25 Dec 1995 13:30:00 GMT").native() instanceof Date, "Mon, 25 Dec 1995 13:30:00 GMT");
        test.done();
    },

    "string without format - json" : function(test) {
        test.expect(5);
        test.equal(moment("Date(1325132654000)").valueOf(), 1325132654000, "Date(1325132654000)");
        test.equal(moment("Date(-1325132654000)").valueOf(), -1325132654000, "Date(-1325132654000)");
        test.equal(moment("/Date(1325132654000)/").valueOf(), 1325132654000, "/Date(1325132654000)/");
        test.equal(moment("/Date(1325132654000+0700)/").valueOf(), 1325132654000, "/Date(1325132654000+0700)/");
        test.equal(moment("/Date(1325132654000-0700)/").valueOf(), 1325132654000, "/Date(1325132654000-0700)/");
        test.done();
    },

    "string with format" : function(test) {
        test.expect(23);
        moment.lang('en');
        var a = [
                ['MM-DD-YYYY',          '12-02-1999'],
                ['DD-MM-YYYY',          '12-02-1999'],
                ['DD/MM/YYYY',          '12/02/1999'],
                ['DD_MM_YYYY',          '12_02_1999'],
                ['DD:MM:YYYY',          '12:02:1999'],
                ['D-M-YY',              '2-2-99'],
                ['YY',                  '99'],
                ['DDD-YYYY',            '300-1999'],
                ['DD-MM-YYYY h:m:s',    '12-02-1999 2:45:10'],
                ['DD-MM-YYYY h:m:s a',  '12-02-1999 2:45:10 am'],
                ['DD-MM-YYYY h:m:s a',  '12-02-1999 2:45:10 pm'],
                ['h:mm a',              '12:00 pm'],
                ['h:mm a',              '12:30 pm'],
                ['h:mm a',              '12:00 am'],
                ['h:mm a',              '12:30 am'],
                ['HH:mm',               '12:00'],
                ['YYYY-MM-DDTHH:mm:ss', '2011-11-11T11:11:11'],
                ['MM-DD-YYYY \\M',      '12-02-1999 M'],
                ['ddd MMM DD HH:mm:ss YYYY', 'Tue Apr 07 22:52:51 2009'],
                ['HH:mm:ss',            '12:00:00'],
                ['HH:mm:ss',            '12:30:00'],
                ['HH:mm:ss',            '00:00:00'],
                ['HH:mm:ss',            '00:30:00']
            ],
            i;
        for (i = 0; i < a.length; i++) {
            test.equal(moment(a[i][1], a[i][0]).format(a[i][0]), a[i][1], a[i][0] + ' ---> ' + a[i][1]);
        }
        test.done();
    },

    "string with format (timezone)" : function(test) {
        test.expect(8);
        test.equal(moment('5 -0700', 'H ZZ').native().getUTCHours(), 12, 'parse hours "5 -0700" ---> "H ZZ"');
        test.equal(moment('5 -07:00', 'H Z').native().getUTCHours(), 12, 'parse hours "5 -07:00" ---> "H Z"');
        test.equal(moment('5 -0730', 'H ZZ').native().getUTCMinutes(), 30, 'parse hours "5 -0730" ---> "H ZZ"');
        test.equal(moment('5 -07:30', 'H Z').native().getUTCMinutes(), 30, 'parse hours "5 -07:30" ---> "H Z"');
        test.equal(moment('5 +0100', 'H ZZ').native().getUTCHours(), 4, 'parse hours "5 +0100" ---> "H ZZ"');
        test.equal(moment('5 +01:00', 'H Z').native().getUTCHours(), 4, 'parse hours "5 +01:00" ---> "H Z"');
        test.equal(moment('5 +0130', 'H ZZ').native().getUTCMinutes(), 30, 'parse hours "5 +0130" ---> "H ZZ"');
        test.equal(moment('5 +01:30', 'H Z').native().getUTCMinutes(), 30, 'parse hours "5 +01:30" ---> "H Z"');
        test.done();
    },

    "string with format (timezone offset)" : function(test) {
        test.expect(3);
        var a = new Date(Date.UTC(2011, 0, 1, 1));
        var b = moment('2011 1 1 0 -01:00', 'YYYY MM DD HH Z');
        test.equal(a.getHours(), b.hours(), 'date created with utc == parsed string with timezone offset');
        test.equal(+a, +b, 'date created with utc == parsed string with timezone offset');
        var c = moment('2011 2 1 10 -05:00', 'YYYY MM DD HH Z');
        var d = moment('2011 2 1 8 -07:00', 'YYYY MM DD HH Z');
        test.equal(c.hours(), d.hours(), '10 am central time == 8 am pacific time');
        test.done();
    },

    "string with array of formats" : function(test) {
        test.expect(3);
        test.equal(moment('13-02-1999', ['MM-DD-YYYY', 'DD-MM-YYYY']).format('MM DD YYYY'), '02 13 1999', 'switching month and day');
        test.equal(moment('02-13-1999', ['MM/DD/YYYY', 'YYYY-MM-DD', 'MM-DD-YYYY']).format('MM DD YYYY'), '02 13 1999', 'year last');
        test.equal(moment('1999-02-13', ['MM/DD/YYYY', 'YYYY-MM-DD', 'MM-DD-YYYY']).format('MM DD YYYY'), '02 13 1999', 'year first');
        test.done();
    },

    "string with format - years" : function(test) {
        test.expect(2);
        test.equal(moment('71', 'YY').format('YYYY'), '1971', '71 > 1971');
        test.equal(moment('69', 'YY').format('YYYY'), '2069', '69 > 2069');
        test.done();
    },

    "implicit cloning" : function(test) {
        test.expect(2);
        var momentA = moment([2011, 10, 10]);
        var momentB = moment(momentA);
        momentA.month(5);
        test.equal(momentB.month(), 10, "Calling moment() on a moment will create a clone");
        test.equal(momentA.month(), 5, "Calling moment() on a moment will create a clone");
        test.done();
    },

    "explicit cloning" : function(test) {
        test.expect(2);
        var momentA = moment([2011, 10, 10]);
        var momentB = momentA.clone();
        momentA.month(5);
        test.equal(momentB.month(), 10, "Calling moment() on a moment will create a clone");
        test.equal(momentA.month(), 5, "Calling moment() on a moment will create a clone");
        test.done();
    },

    "parsing iso" : function(test) {
        var offset = moment([2011, 9, 08]).zone();
        var pad = function(input) {
            if (input < 10) {
                return '0' + input;
            }
            return '' + input;
        }
        var hourOffset = Math.floor(offset / 60);
        var minOffset = offset - (hourOffset * 60);
        var tz = (offset > 0) ? '-' + pad(hourOffset) + ':' + pad(minOffset) : '+' + pad(-hourOffset) + ':' + pad(-minOffset);
        var tz2 = tz.replace(':', '');
        var formats = [
            ['2011-10-08',                '2011-10-08T00:00:00' + tz],
            ['2011-10-08T18',             '2011-10-08T18:00:00' + tz],
            ['2011-10-08T18:04',          '2011-10-08T18:04:00' + tz],
            ['2011-10-08T18:04:20',       '2011-10-08T18:04:20' + tz],
            ['2011-10-08T18:04' + tz,     '2011-10-08T18:04:00' + tz],
            ['2011-10-08T18:04:20' + tz,  '2011-10-08T18:04:20' + tz],
            ['2011-10-08T18:04' + tz2,    '2011-10-08T18:04:00' + tz],
            ['2011-10-08T18:04:20' + tz2, '2011-10-08T18:04:20' + tz],
        ];
        test.expect(formats.length);
        for (var i = 0; i < formats.length; i++) {
            test.equal(moment(formats[i][0]).format('YYYY-MM-DDTHH:mm:ssZ'), formats[i][1], "moment should be able to parse ISO " + formats[i][0]);
        }
        test.done();
    },

    "null" : function(test) {
        test.expect(3);
        test.equal(moment(''), null, "Calling moment('')");
        test.equal(moment(null), null, "Calling moment(null)");
        test.equal(moment('', 'YYYY-MM-DD'), null, "Calling moment('', 'YYYY-MM-DD')");
        test.done();
    }
};
var moment = require("../../moment");

exports.days_in_month = {
    "days in month" : function(test) {
        test.expect(12);
        var months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        for (var i = 0; i < 12; i++) {
            test.equal(moment([2011, i]).daysInMonth(),
                       months[i],
                       moment([2011, i]).format('L') + "should have " + months[i] + " days.")
        }
        test.done();
    },

    "days in month leap years" : function(test) {
        test.expect(4);
        test.equal(moment([2010, 1]).daysInMonth(), 28, "Feb 2010 should have 29 days");
        test.equal(moment([2100, 1]).daysInMonth(), 28, "Feb 2100 should have 29 days");
        test.equal(moment([2008, 1]).daysInMonth(), 29, "Feb 2008 should have 29 days");
        test.equal(moment([2000, 1]).daysInMonth(), 29, "Feb 2000 should have 29 days");
        test.done();
    }
};
var moment = require("../../moment");

exports.diff = {
    "diff" : function(test) {
        test.expect(5);

        test.equal(moment(1000).diff(0), 1000, "1 second - 0 = 1000");
        test.equal(moment(1000).diff(500), 500, "1 second - .5 second = -500");
        test.equal(moment(0).diff(1000), -1000, "0 - 1 second = -1000");
        test.equal(moment(new Date(1000)).diff(1000), 0, "1 second - 1 second = 0");
        var oneHourDate = new Date(),
        nowDate = new Date();
        oneHourDate.setHours(oneHourDate.getHours() + 1);
        test.equal(moment(oneHourDate).diff(nowDate), 60 * 60 * 1000, "1 hour from now = 360000");
        test.done();
    },

    "diff key after" : function(test) {
        test.expect(9);

        test.equal(moment([2010]).diff([2011], 'years'), -1, "year diff");
        test.equal(moment([2010]).diff([2011, 6], 'years', true), -1.5, "year diff, float");
        test.equal(moment([2010]).diff([2010, 2], 'months'), -2, "month diff");
        test.equal(moment([2010]).diff([2010, 0, 7], 'weeks'), -1, "week diff");
        test.equal(moment([2010]).diff([2010, 0, 21], 'weeks'), -3, "week diff");
        test.equal(moment([2010]).diff([2010, 0, 4], 'days'), -3, "day diff");
        test.equal(moment([2010]).diff([2010, 0, 1, 4], 'hours'), -4, "hour diff");
        test.equal(moment([2010]).diff([2010, 0, 1, 0, 5], 'minutes'), -5, "minute diff");
        test.equal(moment([2010]).diff([2010, 0, 1, 0, 0, 6], 'seconds'), -6, "second diff");
        test.done();
    },

    "diff key before" : function(test) {
        test.expect(9);

        test.equal(moment([2011]).diff([2010], 'years'), 1, "year diff");
        test.equal(moment([2011, 6]).diff([2010], 'years', true), 1.5, "year diff, float");
        test.equal(moment([2010, 2]).diff([2010], 'months'), 2, "month diff");
        test.equal(moment([2010, 0, 4]).diff([2010], 'days'), 3, "day diff");
        test.equal(moment([2010, 0, 7]).diff([2010], 'weeks'), 1, "week diff");
        test.equal(moment([2010, 0, 21]).diff([2010], 'weeks'), 3, "week diff");
        test.equal(moment([2010, 0, 1, 4]).diff([2010], 'hours'), 4, "hour diff");
        test.equal(moment([2010, 0, 1, 0, 5]).diff([2010], 'minutes'), 5, "minute diff");
        test.equal(moment([2010, 0, 1, 0, 0, 6]).diff([2010], 'seconds'), 6, "second diff");
        test.done();
    },

    "diff month" : function(test) {
        test.expect(1);

        test.equal(moment([2011, 0, 31]).diff([2011, 2, 1], 'months'), -1, "month diff");
        test.done();
    },

    "diff across DST" : function(test) {
        test.expect(2);

        test.equal(moment([2012, 2, 24]).diff([2012, 2, 10], 'weeks', true), 2, "diff weeks across DST");
        test.equal(moment([2012, 2, 24]).diff([2012, 2, 10], 'days', true), 14, "diff weeks across DST");
        test.done();
    },

    "diff overflow" : function(test) {
        test.expect(4);

        test.equal(moment([2011]).diff([2010], 'months'), 12, "month diff");
        test.equal(moment([2010, 0, 2]).diff([2010], 'hours'), 24, "hour diff");
        test.equal(moment([2010, 0, 1, 2]).diff([2010], 'minutes'), 120, "minute diff");
        test.equal(moment([2010, 0, 1, 0, 4]).diff([2010], 'seconds'), 240, "second diff");
        test.done();
    }
};
var moment = require("../../moment");

exports.format = {
    "format YY" : function(test) {
        test.expect(1);

        var b = moment(new Date(2009, 1, 14, 15, 25, 50, 125));
        test.equal(b.format('YY'), '09', 'YY ---> 09');
        test.done();
    },

    "format escape brackets" : function(test) {
        test.expect(5);

        var b = moment(new Date(2009, 1, 14, 15, 25, 50, 125));
        test.equal(b.format('[day]'), 'day', 'Single bracket');
        test.equal(b.format('[day] YY [YY]'), 'day 09 YY', 'Double bracket');
        test.equal(b.format('[YY'), '[09', 'Un-ended bracket');
        test.equal(b.format('[[YY]]'), '[YY]', 'Double nested brackets');
        test.equal(b.format('[[]'), '[', 'Escape open bracket');
        test.done();
    },

    "format timezone" : function(test) {
        test.expect(4);

        var b = moment(new Date(2010, 1, 14, 15, 25, 50, 125));
        var explanation = 'moment().format("z") = ' + b.format('z') + ' It should be something like "PST"'
        if (moment().zone() === -60) {
            explanation += "For UTC+1 this is a known issue, see https://github.com/timrwood/moment/issues/162";
        }
        test.ok(b.format('z').match(/^[A-Z]{3,6}$/), explanation);
        test.ok(b.format('zz').match(/^[A-Z]{3,6}$/), explanation);
        test.ok(b.format('Z').match(/^[\+\-]\d\d:\d\d$/), b.format('Z') + ' should be something like "+07:30"');
        test.ok(b.format('ZZ').match(/^[\+\-]\d{4}$/), b.format('ZZ') + ' should be something like "+0700"');
        test.done();
    },

    "format multiple with zone" : function(test) {
        test.expect(1);

        var b = moment('2012-10-08 -1200', ['YYYY ZZ', 'YYYY-MM-DD ZZ']);
        test.equals(b.format('YYYY-MM'), '2012-10', 'Parsing multiple formats should not crash with different sized formats');
        test.done();
    },

    "isDST" : function(test) {
        test.expect(2);

        var janOffset = new Date(2011, 0, 1).getTimezoneOffset(),
            julOffset = new Date(2011, 6, 1).getTimezoneOffset(),
            janIsDst = janOffset < julOffset,
            julIsDst = julOffset < janOffset,
            jan1 = moment([2011]),
            jul1 = moment([2011, 6]);

        if (janIsDst && julIsDst) {
            test.ok(0, 'January and July cannot both be in DST');
            test.ok(0, 'January and July cannot both be in DST');
        } else if (janIsDst) {
            test.ok(jan1.isDST(), 'January 1 is DST');
            test.ok(!jul1.isDST(), 'July 1 is not DST');
        } else if (julIsDst) {
            test.ok(!jan1.isDST(), 'January 1 is not DST');
            test.ok(jul1.isDST(), 'July 1 is DST');
        } else {
            test.ok(!jan1.isDST(), 'January 1 is not DST');
            test.ok(!jul1.isDST(), 'July 1 is not DST');
        }
        test.done();
    },

    "zone" : function(test) {
        test.expect(3);

        if (moment().zone() > 0) {
            test.ok(moment().format('ZZ').indexOf('-') > -1, 'When the zone() offset is greater than 0, the ISO offset should be less than zero');
        }
        if (moment().zone() < 0) {
            test.ok(moment().format('ZZ').indexOf('+') > -1, 'When the zone() offset is less than 0, the ISO offset should be greater than zero');
        }
        if (moment().zone() == 0) {
            test.ok(moment().format('ZZ').indexOf('+') > -1, 'When the zone() offset is equal to 0, the ISO offset should be positive zero');
        }
        if (moment().zone() === 0) {
           test.equal(moment().zone(), 0, 'moment.fn.zone should be a multiple of 30 (was ' + moment().zone() + ')');
        } else {
           test.equal(moment().zone() % 30, 0, 'moment.fn.zone should be a multiple of 30 (was ' + moment().zone() + ')');
        }
        test.equal(moment().zone(), new Date().getTimezoneOffset(), 'zone should equal getTimezoneOffset');
        test.done();
    },

    "default format" : function(test) {
        test.expect(1);
        var isoRegex = /\d{4}.\d\d.\d\dT\d\d.\d\d.\d\d[\+\-]\d\d:\d\d/;
        test.ok(isoRegex.exec(moment().format()), "default format (" + moment().format() + ") should match ISO");
        test.done();
    }
};
var moment = require("../../moment");

exports.getters_setters = {
    "getters" : function(test) {
        test.expect(8);

        var a = moment([2011, 9, 12, 6, 7, 8, 9]);
        test.equal(a.year(), 2011, 'year');
        test.equal(a.month(), 9, 'month');
        test.equal(a.date(), 12, 'date');
        test.equal(a.day(), 3, 'day');
        test.equal(a.hours(), 6, 'hour');
        test.equal(a.minutes(), 7, 'minute');
        test.equal(a.seconds(), 8, 'second');
        test.equal(a.milliseconds(), 9, 'milliseconds');
        test.done();
    },

    "setters" : function(test) {
        test.expect(8);

        var a = moment();
        a.year(2011);
        a.month(9);
        a.date(12);
        a.hours(6);
        a.minutes(7);
        a.seconds(8);
        a.milliseconds(9);
        test.equal(a.year(), 2011, 'year');
        test.equal(a.month(), 9, 'month');
        test.equal(a.date(), 12, 'date');
        test.equal(a.day(), 3, 'day');
        test.equal(a.hours(), 6, 'hour');
        test.equal(a.minutes(), 7, 'minute');
        test.equal(a.seconds(), 8, 'second');
        test.equal(a.milliseconds(), 9, 'milliseconds');
        test.done();
    },

    "setters - falsey values" : function(test) {
        test.expect(1);

        var a = moment();
        // ensure minutes wasn't coincidentally 0 already
        a.minutes(1);
        a.minutes(0);
        test.equal(a.minutes(), 0, 'falsey value');
        test.done();
    },

    "chaining setters" : function(test) {
        test.expect(7);

        var a = moment();
        a.year(2011)
         .month(9)
         .date(12)
         .hours(6)
         .minutes(7)
         .seconds(8);
        test.equal(a.year(), 2011, 'year');
        test.equal(a.month(), 9, 'month');
        test.equal(a.date(), 12, 'date');
        test.equal(a.day(), 3, 'day');
        test.equal(a.hours(), 6, 'hour');
        test.equal(a.minutes(), 7, 'minute');
        test.equal(a.seconds(), 8, 'second');
        test.done();
    },

    "day setter" : function(test) {
        test.expect(18);

        var a = moment([2011, 0, 15]);
        test.equal(moment(a).day(0).date(), 9, 'set from saturday to sunday');
        test.equal(moment(a).day(6).date(), 15, 'set from saturday to saturday');
        test.equal(moment(a).day(3).date(), 12, 'set from saturday to wednesday');

        a = moment([2011, 0, 9]);
        test.equal(moment(a).day(0).date(), 9, 'set from sunday to sunday');
        test.equal(moment(a).day(6).date(), 15, 'set from sunday to saturday');
        test.equal(moment(a).day(3).date(), 12, 'set from sunday to wednesday');

        a = moment([2011, 0, 12]);
        test.equal(moment(a).day(0).date(), 9, 'set from wednesday to sunday');
        test.equal(moment(a).day(6).date(), 15, 'set from wednesday to saturday');
        test.equal(moment(a).day(3).date(), 12, 'set from wednesday to wednesday');

        test.equal(moment(a).day(-7).date(), 2, 'set from wednesday to last sunday');
        test.equal(moment(a).day(-1).date(), 8, 'set from wednesday to last saturday');
        test.equal(moment(a).day(-4).date(), 5, 'set from wednesday to last wednesday');

        test.equal(moment(a).day(7).date(), 16, 'set from wednesday to next sunday');
        test.equal(moment(a).day(13).date(), 22, 'set from wednesday to next saturday');
        test.equal(moment(a).day(10).date(), 19, 'set from wednesday to next wednesday');

        test.equal(moment(a).day(14).date(), 23, 'set from wednesday to second next sunday');
        test.equal(moment(a).day(20).date(), 29, 'set from wednesday to second next saturday');
        test.equal(moment(a).day(17).date(), 26, 'set from wednesday to second next wednesday');
        test.done();
    }
};
var moment = require("../../moment");

exports.humanize_duration = {
    "humanize duration" : function(test) {
        test.expect(32);
        moment.lang('en');
        test.equal(moment.humanizeDuration(44, "seconds"),  "a few seconds", "44 seconds = a few seconds");
        test.equal(moment.humanizeDuration(45, "seconds"),  "a minute",      "45 seconds = a minute");
        test.equal(moment.humanizeDuration(89, "seconds"),  "a minute",      "89 seconds = a minute");
        test.equal(moment.humanizeDuration(90, "seconds"),  "2 minutes",     "90 seconds = 2 minutes");
        test.equal(moment.humanizeDuration(44, "minutes"),  "44 minutes",    "44 minutes = 44 minutes");
        test.equal(moment.humanizeDuration(45, "minutes"),  "an hour",       "45 minutes = an hour");
        test.equal(moment.humanizeDuration(89, "minutes"),  "an hour",       "89 minutes = an hour");
        test.equal(moment.humanizeDuration(90, "minutes"),  "2 hours",       "90 minutes = 2 hours");
        test.equal(moment.humanizeDuration(5, "hours"),     "5 hours",       "5 hours = 5 hours");
        test.equal(moment.humanizeDuration(21, "hours"),    "21 hours",      "21 hours = 21 hours");
        test.equal(moment.humanizeDuration(22, "hours"),    "a day",         "22 hours = a day");
        test.equal(moment.humanizeDuration(35, "hours"),    "a day",         "35 hours = a day");
        test.equal(moment.humanizeDuration(36, "hours"),    "2 days",        "36 hours = 2 days");
        test.equal(moment.humanizeDuration(1, "days"),      "a day",         "1 day = a day");
        test.equal(moment.humanizeDuration(5, "days"),      "5 days",        "5 days = 5 days");
        test.equal(moment.humanizeDuration(1, "weeks"),     "7 days",        "1 week = 7 days");
        test.equal(moment.humanizeDuration(25, "days"),     "25 days",       "25 days = 25 days");
        test.equal(moment.humanizeDuration(26, "days"),     "a month",       "26 days = a month");
        test.equal(moment.humanizeDuration(30, "days"),     "a month",       "30 days = a month");
        test.equal(moment.humanizeDuration(45, "days"),     "a month",       "45 days = a month");
        test.equal(moment.humanizeDuration(46, "days"),     "2 months",      "46 days = 2 months");
        test.equal(moment.humanizeDuration(74, "days"),     "2 months",      "75 days = 2 months");
        test.equal(moment.humanizeDuration(76, "days"),     "3 months",      "76 days = 3 months");
        test.equal(moment.humanizeDuration(1, "months"),    "a month",       "1 month = a month");
        test.equal(moment.humanizeDuration(5, "months"),    "5 months",      "5 months = 5 months");
        test.equal(moment.humanizeDuration(344, "days"),    "11 months",     "344 days = 11 months");
        test.equal(moment.humanizeDuration(345, "days"),    "a year",        "345 days = a year");
        test.equal(moment.humanizeDuration(547, "days"),    "a year",        "547 days = a year");
        test.equal(moment.humanizeDuration(548, "days"),    "2 years",       "548 days = 2 years");
        test.equal(moment.humanizeDuration(1, "years"),     "a year",        "1 year = a year");
        test.equal(moment.humanizeDuration(5, "years"),     "5 years",       "5 years = 5 years");
        test.equal(moment.humanizeDuration(7200000),        "2 hours",     "7200000 = 2 minutes");
        test.done();
    },

    "humanize duration with suffix" : function(test) {
        test.expect(2);
        moment.lang('en');
        test.equal(moment.humanizeDuration(44, "seconds", true),  "in a few seconds", "44 seconds = a few seconds");
        test.equal(moment.humanizeDuration(-44, "seconds", true),  "a few seconds ago", "44 seconds = a few seconds");
        test.done();
    }
};
var moment = require("../../moment");

exports.leapyear = {
    "leap year" : function(test) {
        test.expect(4);

        test.equal(moment([2010, 0, 1]).isLeapYear(), false, '2010');
        test.equal(moment([2100, 0, 1]).isLeapYear(), false, '2100');
        test.equal(moment([2008, 0, 1]).isLeapYear(), true, '2008');
        test.equal(moment([2000, 0, 1]).isLeapYear(), true, '2000');
        test.done();
    }
};
var moment = require("../../moment");

exports.eod_sod = {
    "sod" : function(test) {
        test.expect(7);

        var m = moment(new Date(2011, 1, 2, 3, 4, 5, 6)).sod();
        test.equal(m.year(), 2011, "keep the year");
        test.equal(m.month(), 1, "keep the month");
        test.equal(m.date(), 2, "keep the day");
        test.equal(m.hours(), 0, "strip out the hours"); 
        test.equal(m.minutes(), 0, "strip out the minutes"); 
        test.equal(m.seconds(), 0, "strip out the seconds"); 
        test.equal(m.milliseconds(), 0, "strip out the milliseconds");
        test.done();
    },

    "eod" : function(test) {
        test.expect(7);

        var m = moment(new Date(2011, 1, 2, 3, 4, 5, 6)).eod();
        test.equal(m.year(), 2011, "keep the year");
        test.equal(m.month(), 1, "keep the month");
        test.equal(m.date(), 2, "keep the day");
        test.equal(m.hours(), 23, "set the hours"); 
        test.equal(m.minutes(), 59, "set the minutes"); 
        test.equal(m.seconds(), 59, "set the seconds"); 
        test.equal(m.milliseconds(), 999, "set the seconds");
        test.done();
    }
};
var moment = require("../../moment");

exports.utc = {
    "utc and local" : function(test) {
        test.expect(5);

        var m = moment(Date.UTC(2011, 1, 2, 3, 4, 5, 6));
        m.utc();
        // utc
        test.equal(m.date(), 2, "the day should be correct for utc");
        test.equal(m.hours(), 3, "the hours should be correct for utc");

        // local
        m.local();
        if (moment().zone() > 180) {
            test.equal(m.date(), 1, "the day should be correct for utc");
        } else {
            test.equal(m.date(), 2, "the day should be correct for utc");
        }
        var expected = (24 + 3 - Math.floor(moment().zone() / 60)) % 24;
        test.equal(m.hours(), expected, "the hours (" + m.hours() + ") should be correct for utc");
        test.equal(moment().utc().zone(), 0, "timezone in utc should always be zero");
        test.done();
    },

    "creating with utc" : function(test) {
        test.expect(6);

        var m = moment.utc([2011, 1, 2, 3, 4, 5, 6]);
        test.equal(m.date(), 2, "the day should be correct for utc array");
        test.equal(m.hours(), 3, "the hours should be correct for utc array");

        m = moment.utc("2011-02-02 3:04:05", "YYYY-MM-DD HH:mm:ss");
        test.equal(m.date(), 2, "the day should be correct for utc parsing format");
        test.equal(m.hours(), 3, "the hours should be correct for utc parsing format");

        m = moment.utc("2011-02-02T03:04:05+00:00");
        test.equal(m.date(), 2, "the day should be correct for utc parsing iso");
        test.equal(m.hours(), 3, "the hours should be correct for utc parsing iso");

        test.done();
    }
};
var moment = require("../../moment");


    /**************************************************
      Català
     *************************************************/

exports["lang:ca"] = {
    "parse" : function(test) {
        test.expect(96);
        moment.lang('ca');
    
        var tests = "Gener Gen._Febrer Febr._Març Mar._Abril Abr._Maig Mai._Juny Jun._Juliol Jul._Agost Ag._Setembre Set._Octubre Oct._Novembre Nov._Desembre Des.".split("_");
    
        var i;
        function equalTest(input, mmm, i) {
            test.equal(moment(input, mmm).month(), i, input + ' should be month ' + (i + 1));
        }
        for (i = 0; i < 12; i++) {
            tests[i] = tests[i].split(' ');
            equalTest(tests[i][0], 'MMM', i);
            equalTest(tests[i][1], 'MMM', i);
            equalTest(tests[i][0], 'MMMM', i);
            equalTest(tests[i][1], 'MMMM', i);
            equalTest(tests[i][0].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][0].toLocaleUpperCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleUpperCase(), 'MMMM', i);
        }
        test.done();
    },

    "format ordinal" : function(test) {
        test.expect(31);
        moment.lang('ca');
        test.equal(moment([2011, 0, 1]).format('DDDo'), '1º', '1º');
        test.equal(moment([2011, 0, 2]).format('DDDo'), '2º', '2º');
        test.equal(moment([2011, 0, 3]).format('DDDo'), '3º', '3º');
        test.equal(moment([2011, 0, 4]).format('DDDo'), '4º', '4º');
        test.equal(moment([2011, 0, 5]).format('DDDo'), '5º', '5º');
        test.equal(moment([2011, 0, 6]).format('DDDo'), '6º', '6º');
        test.equal(moment([2011, 0, 7]).format('DDDo'), '7º', '7º');
        test.equal(moment([2011, 0, 8]).format('DDDo'), '8º', '8º');
        test.equal(moment([2011, 0, 9]).format('DDDo'), '9º', '9º');
        test.equal(moment([2011, 0, 10]).format('DDDo'), '10º', '10º');
    
        test.equal(moment([2011, 0, 11]).format('DDDo'), '11º', '11º');
        test.equal(moment([2011, 0, 12]).format('DDDo'), '12º', '12º');
        test.equal(moment([2011, 0, 13]).format('DDDo'), '13º', '13º');
        test.equal(moment([2011, 0, 14]).format('DDDo'), '14º', '14º');
        test.equal(moment([2011, 0, 15]).format('DDDo'), '15º', '15º');
        test.equal(moment([2011, 0, 16]).format('DDDo'), '16º', '16º');
        test.equal(moment([2011, 0, 17]).format('DDDo'), '17º', '17º');
        test.equal(moment([2011, 0, 18]).format('DDDo'), '18º', '18º');
        test.equal(moment([2011, 0, 19]).format('DDDo'), '19º', '19º');
        test.equal(moment([2011, 0, 20]).format('DDDo'), '20º', '20º');
    
        test.equal(moment([2011, 0, 21]).format('DDDo'), '21º', '21º');
        test.equal(moment([2011, 0, 22]).format('DDDo'), '22º', '22º');
        test.equal(moment([2011, 0, 23]).format('DDDo'), '23º', '23º');
        test.equal(moment([2011, 0, 24]).format('DDDo'), '24º', '24º');
        test.equal(moment([2011, 0, 25]).format('DDDo'), '25º', '25º');
        test.equal(moment([2011, 0, 26]).format('DDDo'), '26º', '26º');
        test.equal(moment([2011, 0, 27]).format('DDDo'), '27º', '27º');
        test.equal(moment([2011, 0, 28]).format('DDDo'), '28º', '28º');
        test.equal(moment([2011, 0, 29]).format('DDDo'), '29º', '29º');
        test.equal(moment([2011, 0, 30]).format('DDDo'), '30º', '30º');
    
        test.equal(moment([2011, 0, 31]).format('DDDo'), '31º', '31º');
        test.done();
    },

    "format month" : function(test) {
        test.expect(12);
        moment.lang('ca');
        var expected = "Gener Gen._Febrer Febr._Març Mar._Abril Abr._Maig Mai._Juny Jun._Juliol Jul._Agost Ag._Setembre Set._Octubre Oct._Novembre Nov._Desembre Des.".split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, i, 0]).format('MMMM MMM'), expected[i], expected[i]);
        }
        test.done();
    },

    "format week" : function(test) {
        test.expect(7);
        moment.lang('ca');
        var expected = "Diumenge Dg._Dilluns Dl._Dimarts Dt._Dimecres Dc._Dijous Dj._Divendres Dv._Dissabte Ds.".split("_");
    
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, 0, 2 + i]).format('dddd ddd'), expected[i], expected[i]);
        }
        test.done();
    },

    "from" : function(test) {
        test.expect(30);
        moment.lang('ca');
        var start = moment([2007, 1, 28]);
        test.equal(start.from(moment([2007, 1, 28]).add({s:44}), true),  "uns segons", "44 seconds = a few seconds");
        test.equal(start.from(moment([2007, 1, 28]).add({s:45}), true),  "un minut",      "45 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:89}), true),  "un minut",      "89 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:90}), true),  "2 minuts",     "90 seconds = 2 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:44}), true),  "44 minuts",    "44 minutes = 44 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:45}), true),  "una hora",       "45 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:89}), true),  "una hora",       "89 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:90}), true),  "2 hores",       "90 minutes = 2 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:5}), true),   "5 hores",       "5 hours = 5 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:21}), true),  "21 hores",      "21 hours = 21 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:22}), true),  "un dia",         "22 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:35}), true),  "un dia",         "35 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:36}), true),  "2 dies",        "36 hours = 2 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:1}), true),   "un dia",         "1 day = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({d:5}), true),   "5 dies",        "5 days = 5 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:25}), true),  "25 dies",       "25 days = 25 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:26}), true),  "un mes",       "26 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:30}), true),  "un mes",       "30 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:45}), true),  "un mes",       "45 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:46}), true),  "2 mesos",      "46 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:74}), true),  "2 mesos",      "75 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:76}), true),  "3 mesos",      "76 days = 3 months");
        test.equal(start.from(moment([2007, 1, 28]).add({M:1}), true),   "un mes",       "1 month = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({M:5}), true),   "5 mesos",      "5 months = 5 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:344}), true), "11 mesos",     "344 days = 11 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:345}), true), "un any",        "345 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:547}), true), "un any",        "547 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:548}), true), "2 anys",       "548 days = 2 years");
        test.equal(start.from(moment([2007, 1, 28]).add({y:1}), true),   "un any",        "1 year = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({y:5}), true),   "5 anys",       "5 years = 5 years");
        test.done();
    },

    "suffix" : function(test) {
        test.expect(2);
        moment.lang('ca');
        test.equal(moment(30000).from(0), "en uns segons",  "prefix");
        test.equal(moment(0).from(30000), "fa uns segons", "suffix");
        test.done();
    },

    "now from now" : function(test) {
        test.expect(1);
        moment.lang('ca');
        test.equal(moment().fromNow(), "fa uns segons",  "now from now should display as in the past");
        test.done();
    },

    "fromNow" : function(test) {
        test.expect(2);
        moment.lang('ca');
        test.equal(moment().add({s:30}).fromNow(), "en uns segons", "en uns segons");
        test.equal(moment().add({d:5}).fromNow(), "en 5 dies", "en 5 dies");
        test.done();
    },

    "calendar day" : function(test) {
        test.expect(7);
        moment.lang('ca');
    
        var a = moment().hours(2).minutes(0).seconds(0);
    
        test.equal(moment(a).calendar(),                         "avui a les 2:00",     "today at the same time");
        test.equal(moment(a).add({ m: 25 }).calendar(),          "avui a les 2:25",     "Now plus 25 min");
        test.equal(moment(a).add({ h: 1 }).calendar(),           "avui a les 3:00",     "Now plus 1 hour");
        test.equal(moment(a).add({ d: 1 }).calendar(),           "demà a les 2:00",  "tomorrow at the same time");
        test.equal(moment(a).add({ d: 1, h : -1 }).calendar(),   "demà a la 1:00",   "tomorrow minus 1 hour");
        test.equal(moment(a).subtract({ h: 1 }).calendar(),      "avui a la 1:00",      "Now minus 1 hour");
        test.equal(moment(a).subtract({ d: 1 }).calendar(),      "ahir a les 2:00",    "yesterday at the same time");
        test.done();
    },

    "calendar next week" : function(test) {
        test.expect(15);
        moment.lang('ca');
    
        var i;
        var m;
    
        for (i = 2; i < 7; i++) {
            m = moment().add({ d: i });
            test.equal(m.calendar(),       m.format('dddd [a ' + ((m.hours() !== 1) ? 'les' : 'la') + '] LT'),  "Today + " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('dddd [a ' + ((m.hours() !== 1) ? 'les' : 'la') + '] LT'),  "Today + " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('dddd [a ' + ((m.hours() !== 1) ? 'les' : 'la') + '] LT'),  "Today + " + i + " days end of day");
        }
        test.done();
    },

    "calendar last week" : function(test) {
        test.expect(15);
        moment.lang('ca');
    
        for (i = 2; i < 7; i++) {
            m = moment().subtract({ d: i });
            test.equal(m.calendar(),       m.format('[el] dddd [passat a ' + ((m.hours() !== 1) ? 'les' : 'la') + '] LT'),  "Today - " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('[el] dddd [passat a ' + ((m.hours() !== 1) ? 'les' : 'la') + '] LT'),  "Today - " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('[el] dddd [passat a ' + ((m.hours() !== 1) ? 'les' : 'la') + '] LT'),  "Today - " + i + " days end of day");
        }
        test.done();
    },

    "calendar all else" : function(test) {
        test.expect(4);
        moment.lang('ca');
        var weeksAgo = moment().subtract({ w: 1 });
        var weeksFromNow = moment().add({ w: 1 });
    
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "1 week ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 1 week");
    
        weeksAgo = moment().subtract({ w: 2 });
        weeksFromNow = moment().add({ w: 2 });
    
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "2 weeks ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 2 weeks");
    test.done();
    }
};var moment = require("../../moment");


    /**************************************************
      Danish
     *************************************************/

exports["lang:da"] = {
    "parse" : function(test) {
        test.expect(96);
        moment.lang('da');
        var tests = 'Januar Jan_Februar Feb_Marts Mar_April Apr_Maj Maj_Juni Jun_Juli Jul_August Aug_September Sep_Oktober Okt_November Nov_December Dec'.split("_");
        var i;
        function equalTest(input, mmm, i) {
            test.equal(moment(input, mmm).month(), i, input + ' should be month ' + (i + 1));
        }
        for (i = 0; i < 12; i++) {
            tests[i] = tests[i].split(' ');
            equalTest(tests[i][0], 'MMM', i);
            equalTest(tests[i][1], 'MMM', i);
            equalTest(tests[i][0], 'MMMM', i);
            equalTest(tests[i][1], 'MMMM', i);
            equalTest(tests[i][0].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][0].toLocaleUpperCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleUpperCase(), 'MMMM', i);
        }
        test.done();
    },

    "format" : function(test) {
        test.expect(18);
        moment.lang('da');
        var a = [
                ['dddd \\den MMMM Do YYYY, h:mm:ss a', 'Søndag den Februar 14. 2010, 3:25:50 pm'],
                ['ddd hA',                             'Søn 3PM'],
                ['M Mo MM MMMM MMM',                   '2 2. 02 Februar Feb'],
                ['YYYY YY',                            '2010 10'],
                ['D Do DD',                            '14 14. 14'],
                ['d do dddd ddd',                      '0 0. Søndag Søn'],
                ['DDD DDDo DDDD',                      '45 45. 045'],
                ['w wo ww',                            '8 8. 08'],
                ['h hh',                               '3 03'],
                ['H HH',                               '15 15'],
                ['m mm',                               '25 25'],
                ['s ss',                               '50 50'],
                ['a A',                                'pm PM'],
                ['[den] DDDo \\d\\ag på året',           'den 45. dag på året'],
                ['L',                                  '14/02/2010'],
                ['LL',                                 '14 Februar 2010'],
                ['LLL',                                '14 Februar 2010 3:25 PM'],
                ['LLLL',                               'Søndag 14. Februar, 2010 3:25 PM']
            ],
            b = moment(new Date(2010, 1, 14, 15, 25, 50, 125)),
            i;
        for (i = 0; i < a.length; i++) {
            test.equal(b.format(a[i][0]), a[i][1], a[i][0] + ' ---> ' + a[i][1]);
        }
        test.done();
    },

    "format ordinal" : function(test) {
        test.expect(31);
        moment.lang('da');
        test.equal(moment([2011, 0, 1]).format('DDDo'), '1.', '1.');
        test.equal(moment([2011, 0, 2]).format('DDDo'), '2.', '2.');
        test.equal(moment([2011, 0, 3]).format('DDDo'), '3.', '3.');
        test.equal(moment([2011, 0, 4]).format('DDDo'), '4.', '4.');
        test.equal(moment([2011, 0, 5]).format('DDDo'), '5.', '5.');
        test.equal(moment([2011, 0, 6]).format('DDDo'), '6.', '6.');
        test.equal(moment([2011, 0, 7]).format('DDDo'), '7.', '7.');
        test.equal(moment([2011, 0, 8]).format('DDDo'), '8.', '8.');
        test.equal(moment([2011, 0, 9]).format('DDDo'), '9.', '9.');
        test.equal(moment([2011, 0, 10]).format('DDDo'), '10.', '10.');
    
        test.equal(moment([2011, 0, 11]).format('DDDo'), '11.', '11.');
        test.equal(moment([2011, 0, 12]).format('DDDo'), '12.', '12.');
        test.equal(moment([2011, 0, 13]).format('DDDo'), '13.', '13.');
        test.equal(moment([2011, 0, 14]).format('DDDo'), '14.', '14.');
        test.equal(moment([2011, 0, 15]).format('DDDo'), '15.', '15.');
        test.equal(moment([2011, 0, 16]).format('DDDo'), '16.', '16.');
        test.equal(moment([2011, 0, 17]).format('DDDo'), '17.', '17.');
        test.equal(moment([2011, 0, 18]).format('DDDo'), '18.', '18.');
        test.equal(moment([2011, 0, 19]).format('DDDo'), '19.', '19.');
        test.equal(moment([2011, 0, 20]).format('DDDo'), '20.', '20.');
    
        test.equal(moment([2011, 0, 21]).format('DDDo'), '21.', '21.');
        test.equal(moment([2011, 0, 22]).format('DDDo'), '22.', '22.');
        test.equal(moment([2011, 0, 23]).format('DDDo'), '23.', '23.');
        test.equal(moment([2011, 0, 24]).format('DDDo'), '24.', '24.');
        test.equal(moment([2011, 0, 25]).format('DDDo'), '25.', '25.');
        test.equal(moment([2011, 0, 26]).format('DDDo'), '26.', '26.');
        test.equal(moment([2011, 0, 27]).format('DDDo'), '27.', '27.');
        test.equal(moment([2011, 0, 28]).format('DDDo'), '28.', '28.');
        test.equal(moment([2011, 0, 29]).format('DDDo'), '29.', '29.');
        test.equal(moment([2011, 0, 30]).format('DDDo'), '30.', '30.');
    
        test.equal(moment([2011, 0, 31]).format('DDDo'), '31.', '31.');
        test.done();
    },

    "format month" : function(test) {
        test.expect(12);
        moment.lang('da');
        var expected = 'Januar Jan_Februar Feb_Marts Mar_April Apr_Maj Maj_Juni Jun_Juli Jul_August Aug_September Sep_Oktober Okt_November Nov_December Dec'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, i, 0]).format('MMMM MMM'), expected[i], expected[i]);
        }
        test.done();
    },

    "format week" : function(test) {
        test.expect(7);
        moment.lang('da');
        var expected = 'Søndag Søn_Mandag Man_Tirsdag Tir_Onsdag Ons_Torsdag Tor_Fredag Fre_Lørdag Lør'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, 0, 2 + i]).format('dddd ddd'), expected[i], expected[i]);
        }
        test.done();
    },

    "from" : function(test) {
        test.expect(30);
        moment.lang('da');
        var start = moment([2007, 1, 28]);
        test.equal(start.from(moment([2007, 1, 28]).add({s:44}), true),  "få sekunder", "44 seconds = a few seconds");
        test.equal(start.from(moment([2007, 1, 28]).add({s:45}), true),  "minut",       "45 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:89}), true),  "minut",       "89 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:90}), true),  "2 minutter",  "90 seconds = 2 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:44}), true),  "44 minutter", "44 minutes = 44 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:45}), true),  "time",        "45 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:89}), true),  "time",        "89 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:90}), true),  "2 timer",     "90 minutes = 2 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:5}), true),   "5 timer",     "5 hours = 5 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:21}), true),  "21 timer",    "21 hours = 21 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:22}), true),  "dag",         "22 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:35}), true),  "dag",         "35 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:36}), true),  "2 dage",      "36 hours = 2 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:1}), true),   "dag",         "1 day = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({d:5}), true),   "5 dage",      "5 days = 5 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:25}), true),  "25 dage",     "25 days = 25 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:26}), true),  "månede",      "26 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:30}), true),  "månede",      "30 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:45}), true),  "månede",      "45 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:46}), true),  "2 måneder",   "46 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:74}), true),  "2 måneder",   "75 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:76}), true),  "3 måneder",   "76 days = 3 months");
        test.equal(start.from(moment([2007, 1, 28]).add({M:1}), true),   "månede",      "1 month = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({M:5}), true),   "5 måneder",   "5 months = 5 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:344}), true), "11 måneder",  "344 days = 11 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:345}), true), "år",          "345 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:547}), true), "år",          "547 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:548}), true), "2 år",        "548 days = 2 years");
        test.equal(start.from(moment([2007, 1, 28]).add({y:1}), true),   "år",          "1 year = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({y:5}), true),   "5 år",        "5 years = 5 years");
        test.done();
    },

    "suffix" : function(test) {
        test.expect(2);
        moment.lang('da');
        test.equal(moment(30000).from(0), "om få sekunder",  "prefix");
        test.equal(moment(0).from(30000), "få sekunder siden", "suffix");
        test.done();
    },

    "now from now" : function(test) {
        test.expect(1);
        moment.lang('da');
        test.equal(moment().fromNow(), "få sekunder siden",  "now from now should display as in the past");
        test.done();
    },

    "fromNow" : function(test) {
        test.expect(2);
        moment.lang('da');
        test.equal(moment().add({s:30}).fromNow(), "om få sekunder", "in a few seconds");
        test.equal(moment().add({d:5}).fromNow(), "om 5 dage", "in 5 days");
    test.done();
    }
};var moment = require("../../moment");


    /**************************************************
      German
     *************************************************/

exports["lang:de"] = {
    "parse" : function(test) {
        test.expect(96);
        moment.lang('de');
        var tests = 'Januar Jan._Februar Febr._März Mrz._April Apr._Mai Mai_Juni Jun._Juli Jul._August Aug._September Sept._Oktober Okt._November Nov._Dezember Dez.'.split("_");
        var i;
        function equalTest(input, mmm, i) {
            test.equal(moment(input, mmm).month(), i, input + ' should be month ' + (i + 1));
        }
        for (i = 0; i < 12; i++) {
            tests[i] = tests[i].split(' ');
            equalTest(tests[i][0], 'MMM', i);
            equalTest(tests[i][1], 'MMM', i);
            equalTest(tests[i][0], 'MMMM', i);
            equalTest(tests[i][1], 'MMMM', i);
            equalTest(tests[i][0].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][0].toLocaleUpperCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleUpperCase(), 'MMMM', i);
        }
        test.done();
    },

    "format" : function(test) {
        test.expect(18);
        moment.lang('de');
        var a = [
                ['dddd, Do MMMM YYYY, h:mm:ss a',      'Sonntag, 14. Februar 2010, 3:25:50 pm'],
                ['ddd, hA',                            'So., 3PM'],
                ['M Mo MM MMMM MMM',                   '2 2. 02 Februar Febr.'],
                ['YYYY YY',                            '2010 10'],
                ['D Do DD',                            '14 14. 14'],
                ['d do dddd ddd',                      '0 0. Sonntag So.'],
                ['DDD DDDo DDDD',                      '45 45. 045'],
                ['w wo ww',                            '8 8. 08'],
                ['h hh',                               '3 03'],
                ['H HH',                               '15 15'],
                ['m mm',                               '25 25'],
                ['s ss',                               '50 50'],
                ['a A',                                'pm PM'],
                ['t\\he DDDo \\d\\ay of t\\he ye\\ar', 'the 45. day of the year'],
                ['L',                                  '14.02.2010'],
                ['LL',                                 '14. Februar 2010'],
                ['LLL',                                '14. Februar 2010 15:25 Uhr'],
                ['LLLL',                               'Sonntag, 14. Februar 2010 15:25 Uhr']
            ],
            b = moment(new Date(2010, 1, 14, 15, 25, 50, 125)),
            i;
        for (i = 0; i < a.length; i++) {
            test.equal(b.format(a[i][0]), a[i][1], a[i][0] + ' ---> ' + a[i][1]);
        }
        test.done();
    },

    "format ordinal" : function(test) {
        test.expect(31);
        moment.lang('de');
        test.equal(moment([2011, 0, 1]).format('DDDo'), '1.', '1.');
        test.equal(moment([2011, 0, 2]).format('DDDo'), '2.', '2.');
        test.equal(moment([2011, 0, 3]).format('DDDo'), '3.', '3.');
        test.equal(moment([2011, 0, 4]).format('DDDo'), '4.', '4.');
        test.equal(moment([2011, 0, 5]).format('DDDo'), '5.', '5.');
        test.equal(moment([2011, 0, 6]).format('DDDo'), '6.', '6.');
        test.equal(moment([2011, 0, 7]).format('DDDo'), '7.', '7.');
        test.equal(moment([2011, 0, 8]).format('DDDo'), '8.', '8.');
        test.equal(moment([2011, 0, 9]).format('DDDo'), '9.', '9.');
        test.equal(moment([2011, 0, 10]).format('DDDo'), '10.', '10.');
    
        test.equal(moment([2011, 0, 11]).format('DDDo'), '11.', '11.');
        test.equal(moment([2011, 0, 12]).format('DDDo'), '12.', '12.');
        test.equal(moment([2011, 0, 13]).format('DDDo'), '13.', '13.');
        test.equal(moment([2011, 0, 14]).format('DDDo'), '14.', '14.');
        test.equal(moment([2011, 0, 15]).format('DDDo'), '15.', '15.');
        test.equal(moment([2011, 0, 16]).format('DDDo'), '16.', '16.');
        test.equal(moment([2011, 0, 17]).format('DDDo'), '17.', '17.');
        test.equal(moment([2011, 0, 18]).format('DDDo'), '18.', '18.');
        test.equal(moment([2011, 0, 19]).format('DDDo'), '19.', '19.');
        test.equal(moment([2011, 0, 20]).format('DDDo'), '20.', '20.');
    
        test.equal(moment([2011, 0, 21]).format('DDDo'), '21.', '21.');
        test.equal(moment([2011, 0, 22]).format('DDDo'), '22.', '22.');
        test.equal(moment([2011, 0, 23]).format('DDDo'), '23.', '23.');
        test.equal(moment([2011, 0, 24]).format('DDDo'), '24.', '24.');
        test.equal(moment([2011, 0, 25]).format('DDDo'), '25.', '25.');
        test.equal(moment([2011, 0, 26]).format('DDDo'), '26.', '26.');
        test.equal(moment([2011, 0, 27]).format('DDDo'), '27.', '27.');
        test.equal(moment([2011, 0, 28]).format('DDDo'), '28.', '28.');
        test.equal(moment([2011, 0, 29]).format('DDDo'), '29.', '29.');
        test.equal(moment([2011, 0, 30]).format('DDDo'), '30.', '30.');
    
        test.equal(moment([2011, 0, 31]).format('DDDo'), '31.', '31.');
        test.done();
    },

    "format month" : function(test) {
        test.expect(12);
        moment.lang('de');
        var expected = 'Januar Jan._Februar Febr._März Mrz._April Apr._Mai Mai_Juni Jun._Juli Jul._August Aug._September Sept._Oktober Okt._November Nov._Dezember Dez.'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, i, 0]).format('MMMM MMM'), expected[i], expected[i]);
        }
        test.done();
    },

    "format week" : function(test) {
        test.expect(7);
        moment.lang('de');
        var expected = 'Sonntag So._Montag Mo._Dienstag Di._Mittwoch Mi._Donnerstag Do._Freitag Fr._Samstag Sa.'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, 0, 2 + i]).format('dddd ddd'), expected[i], expected[i]);
        }
        test.done();
    },

    "from" : function(test) {
        test.expect(30);
        moment.lang('de');
        var start = moment([2007, 1, 28]);
        test.equal(start.from(moment([2007, 1, 28]).add({s:44}), true),  "ein paar Sekunden",  "44 seconds = a few seconds");
        test.equal(start.from(moment([2007, 1, 28]).add({s:45}), true),  "einer Minute",       "45 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:89}), true),  "einer Minute",       "89 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:90}), true),  "2 Minuten",          "90 seconds = 2 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:44}), true),  "44 Minuten",         "44 minutes = 44 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:45}), true),  "einer Stunde",       "45 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:89}), true),  "einer Stunde",       "89 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:90}), true),  "2 Stunden",          "90 minutes = 2 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:5}), true),   "5 Stunden",          "5 hours = 5 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:21}), true),  "21 Stunden",         "21 hours = 21 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:22}), true),  "einem Tag",          "22 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:35}), true),  "einem Tag",          "35 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:36}), true),  "2 Tagen",            "36 hours = 2 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:1}), true),   "einem Tag",          "1 day = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({d:5}), true),   "5 Tagen",            "5 days = 5 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:25}), true),  "25 Tagen",           "25 days = 25 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:26}), true),  "einem Monat",        "26 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:30}), true),  "einem Monat",        "30 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:45}), true),  "einem Monat",        "45 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:46}), true),  "2 Monaten",          "46 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:74}), true),  "2 Monaten",          "75 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:76}), true),  "3 Monaten",          "76 days = 3 months");
        test.equal(start.from(moment([2007, 1, 28]).add({M:1}), true),   "einem Monat",        "1 month = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({M:5}), true),   "5 Monaten",          "5 months = 5 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:344}), true), "11 Monaten",         "344 days = 11 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:345}), true), "einem Jahr",         "345 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:547}), true), "einem Jahr",         "547 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:548}), true), "2 Jahren",           "548 days = 2 years");
        test.equal(start.from(moment([2007, 1, 28]).add({y:1}), true),   "einem Jahr",         "1 year = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({y:5}), true),   "5 Jahren",           "5 years = 5 years");
        test.done();
    },

    "suffix" : function(test) {
        test.expect(2);
        moment.lang('de');
        test.equal(moment(30000).from(0), "in ein paar Sekunden", "prefix");
        test.equal(moment(0).from(30000), "vor ein paar Sekunden", "suffix");
        test.done();
    },

    "fromNow" : function(test) {
        test.expect(2);
        moment.lang('de');
        test.equal(moment().add({s:30}).fromNow(), "in ein paar Sekunden", "in a few seconds");
        test.equal(moment().add({d:5}).fromNow(), "in 5 Tagen", "in 5 days");
        test.done();
    },

    "calendar day" : function(test) {
        test.expect(6);
        moment.lang('de');
    
        var a = moment().hours(2).minutes(0).seconds(0);
    
        test.equal(moment(a).calendar(),                     "Heute um 2:00 Uhr",   "today at the same time");
        test.equal(moment(a).add({ m: 25 }).calendar(),      "Heute um 2:25 Uhr",   "Now plus 25 min");
        test.equal(moment(a).add({ h: 1 }).calendar(),       "Heute um 3:00 Uhr",   "Now plus 1 hour");
        test.equal(moment(a).add({ d: 1 }).calendar(),       "Morgen um 2:00 Uhr",  "tomorrow at the same time");
        test.equal(moment(a).subtract({ h: 1 }).calendar(),  "Heute um 1:00 Uhr",   "Now minus 1 hour");
        test.equal(moment(a).subtract({ d: 1 }).calendar(),  "Gestern um 2:00 Uhr", "yesterday at the same time");
        test.done();
    },

    "calendar next week" : function(test) {
        test.expect(15);
        moment.lang('de');
    
        var i;
        var m;
    
        for (i = 2; i < 7; i++) {
            m = moment().add({ d: i });
            test.equal(m.calendar(),       m.format('dddd [um] LT'),  "Today + " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('dddd [um] LT'),  "Today + " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('dddd [um] LT'),  "Today + " + i + " days end of day");
        }
        test.done();
    },

    "calendar last week" : function(test) {
        test.expect(15);
        moment.lang('de');
    
        for (i = 2; i < 7; i++) {
            m = moment().subtract({ d: i });
            test.equal(m.calendar(),       m.format('[letzten] dddd [um] LT'),  "Today + " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('[letzten] dddd [um] LT'),  "Today + " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('[letzten] dddd [um] LT'),  "Today + " + i + " days end of day");
        }
        test.done();
    },

    "calendar all else" : function(test) {
        test.expect(4);
        moment.lang('de');
        var weeksAgo = moment().subtract({ w: 1 });
        var weeksFromNow = moment().add({ w: 1 });
        
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "1 week ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 1 week");
    
        weeksAgo = moment().subtract({ w: 2 });
        weeksFromNow = moment().add({ w: 2 });
        
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "2 weeks ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 2 weeks");
    test.done();
    }
};var moment = require("../../moment");


    /**************************************************
      English
     *************************************************/

exports["lang:en-gb"] = {
    "parse" : function(test) {
        test.expect(96);
        moment.lang('en-gb');
        var tests = 'January Jan_February Feb_March Mar_April Apr_May May_June Jun_July Jul_August Aug_September Sep_October Oct_November Nov_December Dec'.split("_");
        var i;
        function equalTest(input, mmm, i) {
            test.equal(moment(input, mmm).month(), i, input + ' should be month ' + (i + 1));
        }
        for (i = 0; i < 12; i++) {
            tests[i] = tests[i].split(' ');
            equalTest(tests[i][0], 'MMM', i);
            equalTest(tests[i][1], 'MMM', i);
            equalTest(tests[i][0], 'MMMM', i);
            equalTest(tests[i][1], 'MMMM', i);
            equalTest(tests[i][0].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][0].toLocaleUpperCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleUpperCase(), 'MMMM', i);
        }
        test.done();
    },

    "format" : function(test) {
        test.expect(18);
        moment.lang('en-gb');
        var a = [
                ['dddd, MMMM Do YYYY, h:mm:ss a',      'Sunday, February 14th 2010, 3:25:50 pm'],
                ['ddd, hA',                            'Sun, 3PM'],
                ['M Mo MM MMMM MMM',                   '2 2nd 02 February Feb'],
                ['YYYY YY',                            '2010 10'],
                ['D Do DD',                            '14 14th 14'],
                ['d do dddd ddd',                      '0 0th Sunday Sun'],
                ['DDD DDDo DDDD',                      '45 45th 045'],
                ['w wo ww',                            '8 8th 08'],
                ['h hh',                               '3 03'],
                ['H HH',                               '15 15'],
                ['m mm',                               '25 25'],
                ['s ss',                               '50 50'],
                ['a A',                                'pm PM'],
                ['t\\he DDDo \\d\\ay of t\\he ye\\ar', 'the 45th day of the year'],
                ['L',                                  '14/02/2010'],
                ['LL',                                 '14 February 2010'],
                ['LLL',                                '14 February 2010 3:25 PM'],
                ['LLLL',                               'Sunday, 14 February 2010 3:25 PM']
            ],
            b = moment(new Date(2010, 1, 14, 15, 25, 50, 125)),
            i;
        for (i = 0; i < a.length; i++) {
            test.equal(b.format(a[i][0]), a[i][1], a[i][0] + ' ---> ' + a[i][1]);
        }
        test.done();
    },

    "format ordinal" : function(test) {
        test.expect(31);
        moment.lang('en-gb');
        test.equal(moment([2011, 0, 1]).format('DDDo'), '1st', '1st');
        test.equal(moment([2011, 0, 2]).format('DDDo'), '2nd', '2nd');
        test.equal(moment([2011, 0, 3]).format('DDDo'), '3rd', '3rd');
        test.equal(moment([2011, 0, 4]).format('DDDo'), '4th', '4th');
        test.equal(moment([2011, 0, 5]).format('DDDo'), '5th', '5th');
        test.equal(moment([2011, 0, 6]).format('DDDo'), '6th', '6th');
        test.equal(moment([2011, 0, 7]).format('DDDo'), '7th', '7th');
        test.equal(moment([2011, 0, 8]).format('DDDo'), '8th', '8th');
        test.equal(moment([2011, 0, 9]).format('DDDo'), '9th', '9th');
        test.equal(moment([2011, 0, 10]).format('DDDo'), '10th', '10th');
    
        test.equal(moment([2011, 0, 11]).format('DDDo'), '11th', '11th');
        test.equal(moment([2011, 0, 12]).format('DDDo'), '12th', '12th');
        test.equal(moment([2011, 0, 13]).format('DDDo'), '13th', '13th');
        test.equal(moment([2011, 0, 14]).format('DDDo'), '14th', '14th');
        test.equal(moment([2011, 0, 15]).format('DDDo'), '15th', '15th');
        test.equal(moment([2011, 0, 16]).format('DDDo'), '16th', '16th');
        test.equal(moment([2011, 0, 17]).format('DDDo'), '17th', '17th');
        test.equal(moment([2011, 0, 18]).format('DDDo'), '18th', '18th');
        test.equal(moment([2011, 0, 19]).format('DDDo'), '19th', '19th');
        test.equal(moment([2011, 0, 20]).format('DDDo'), '20th', '20th');
    
        test.equal(moment([2011, 0, 21]).format('DDDo'), '21st', '21st');
        test.equal(moment([2011, 0, 22]).format('DDDo'), '22nd', '22nd');
        test.equal(moment([2011, 0, 23]).format('DDDo'), '23rd', '23rd');
        test.equal(moment([2011, 0, 24]).format('DDDo'), '24th', '24th');
        test.equal(moment([2011, 0, 25]).format('DDDo'), '25th', '25th');
        test.equal(moment([2011, 0, 26]).format('DDDo'), '26th', '26th');
        test.equal(moment([2011, 0, 27]).format('DDDo'), '27th', '27th');
        test.equal(moment([2011, 0, 28]).format('DDDo'), '28th', '28th');
        test.equal(moment([2011, 0, 29]).format('DDDo'), '29th', '29th');
        test.equal(moment([2011, 0, 30]).format('DDDo'), '30th', '30th');
    
        test.equal(moment([2011, 0, 31]).format('DDDo'), '31st', '31st');
        test.done();
    },

    "format month" : function(test) {
        test.expect(12);
        moment.lang('en-gb');
        var expected = 'January Jan_February Feb_March Mar_April Apr_May May_June Jun_July Jul_August Aug_September Sep_October Oct_November Nov_December Dec'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, i, 0]).format('MMMM MMM'), expected[i], expected[i]);
        }
        test.done();
    },

    "format week" : function(test) {
        test.expect(7);
        moment.lang('en-gb');
        var expected = 'Sunday Sun_Monday Mon_Tuesday Tue_Wednesday Wed_Thursday Thu_Friday Fri_Saturday Sat'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, 0, 2 + i]).format('dddd ddd'), expected[i], expected[i]);
        }
        test.done();
    },

    "from" : function(test) {
        test.expect(30);
        moment.lang('en-gb');
        var start = moment([2007, 1, 28]);
        test.equal(start.from(moment([2007, 1, 28]).add({s:44}), true),  "a few seconds", "44 seconds = a few seconds");
        test.equal(start.from(moment([2007, 1, 28]).add({s:45}), true),  "a minute",      "45 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:89}), true),  "a minute",      "89 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:90}), true),  "2 minutes",     "90 seconds = 2 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:44}), true),  "44 minutes",    "44 minutes = 44 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:45}), true),  "an hour",       "45 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:89}), true),  "an hour",       "89 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:90}), true),  "2 hours",       "90 minutes = 2 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:5}), true),   "5 hours",       "5 hours = 5 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:21}), true),  "21 hours",      "21 hours = 21 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:22}), true),  "a day",         "22 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:35}), true),  "a day",         "35 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:36}), true),  "2 days",        "36 hours = 2 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:1}), true),   "a day",         "1 day = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({d:5}), true),   "5 days",        "5 days = 5 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:25}), true),  "25 days",       "25 days = 25 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:26}), true),  "a month",       "26 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:30}), true),  "a month",       "30 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:45}), true),  "a month",       "45 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:46}), true),  "2 months",      "46 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:74}), true),  "2 months",      "75 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:76}), true),  "3 months",      "76 days = 3 months");
        test.equal(start.from(moment([2007, 1, 28]).add({M:1}), true),   "a month",       "1 month = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({M:5}), true),   "5 months",      "5 months = 5 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:344}), true), "11 months",     "344 days = 11 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:345}), true), "a year",        "345 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:547}), true), "a year",        "547 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:548}), true), "2 years",       "548 days = 2 years");
        test.equal(start.from(moment([2007, 1, 28]).add({y:1}), true),   "a year",        "1 year = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({y:5}), true),   "5 years",       "5 years = 5 years");
        test.done();
    },

    "suffix" : function(test) {
        test.expect(2);
        moment.lang('en-gb');
        test.equal(moment(30000).from(0), "in a few seconds",  "prefix");
        test.equal(moment(0).from(30000), "a few seconds ago", "suffix");
        test.done();
    },

    "now from now" : function(test) {
        test.expect(1);
        moment.lang('en-gb');
        test.equal(moment().fromNow(), "a few seconds ago",  "now from now should display as in the past");
        test.done();
    },

    "fromNow" : function(test) {
        test.expect(2);
        moment.lang('en-gb');
        test.equal(moment().add({s:30}).fromNow(), "in a few seconds", "in a few seconds");
        test.equal(moment().add({d:5}).fromNow(), "in 5 days", "in 5 days");
        test.done();
    },

    "calendar day" : function(test) {
        test.expect(6);
        moment.lang('en-gb');
    
        var a = moment().hours(2).minutes(0).seconds(0);
    
        test.equal(moment(a).calendar(),                     "Today at 2:00 AM",     "today at the same time");
        test.equal(moment(a).add({ m: 25 }).calendar(),      "Today at 2:25 AM",     "Now plus 25 min");
        test.equal(moment(a).add({ h: 1 }).calendar(),       "Today at 3:00 AM",     "Now plus 1 hour");
        test.equal(moment(a).add({ d: 1 }).calendar(),       "Tomorrow at 2:00 AM",  "tomorrow at the same time");
        test.equal(moment(a).subtract({ h: 1 }).calendar(),  "Today at 1:00 AM",     "Now minus 1 hour");
        test.equal(moment(a).subtract({ d: 1 }).calendar(),  "Yesterday at 2:00 AM", "yesterday at the same time");
        test.done();
    },

    "calendar next week" : function(test) {
        test.expect(15);
        moment.lang('en-gb');
    
        var i;
        var m;
    
        for (i = 2; i < 7; i++) {
            m = moment().add({ d: i });
            test.equal(m.calendar(),       m.format('dddd [at] LT'),  "Today + " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('dddd [at] LT'),  "Today + " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('dddd [at] LT'),  "Today + " + i + " days end of day");
        }
        test.done();
    },

    "calendar last week" : function(test) {
        test.expect(15);
        moment.lang('en-gb');
    
        for (i = 2; i < 7; i++) {
            m = moment().subtract({ d: i });
            test.equal(m.calendar(),       m.format('[last] dddd [at] LT'),  "Today - " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('[last] dddd [at] LT'),  "Today - " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('[last] dddd [at] LT'),  "Today - " + i + " days end of day");
        }
        test.done();
    },

    "calendar all else" : function(test) {
        test.expect(4);
        moment.lang('en-gb');
        var weeksAgo = moment().subtract({ w: 1 });
        var weeksFromNow = moment().add({ w: 1 });
        
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "1 week ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 1 week");
    
        weeksAgo = moment().subtract({ w: 2 });
        weeksFromNow = moment().add({ w: 2 });
        
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "2 weeks ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 2 weeks");
    test.done();
    }
};var moment = require("../../moment");


    /**************************************************
      English
     *************************************************/

exports["lang:en"] = {
    "parse" : function(test) {
        test.expect(96);
        moment.lang('en');
        var tests = 'January Jan_February Feb_March Mar_April Apr_May May_June Jun_July Jul_August Aug_September Sep_October Oct_November Nov_December Dec'.split("_");
        var i;
        function equalTest(input, mmm, i) {
            test.equal(moment(input, mmm).month(), i, input + ' should be month ' + (i + 1));
        }
        for (i = 0; i < 12; i++) {
            tests[i] = tests[i].split(' ');
            equalTest(tests[i][0], 'MMM', i);
            equalTest(tests[i][1], 'MMM', i);
            equalTest(tests[i][0], 'MMMM', i);
            equalTest(tests[i][1], 'MMMM', i);
            equalTest(tests[i][0].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][0].toLocaleUpperCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleUpperCase(), 'MMMM', i);
        }
        test.done();
    },

    "format" : function(test) {
        test.expect(18);
        moment.lang('en');
        var a = [
                ['dddd, MMMM Do YYYY, h:mm:ss a',      'Sunday, February 14th 2010, 3:25:50 pm'],
                ['ddd, hA',                            'Sun, 3PM'],
                ['M Mo MM MMMM MMM',                   '2 2nd 02 February Feb'],
                ['YYYY YY',                            '2010 10'],
                ['D Do DD',                            '14 14th 14'],
                ['d do dddd ddd',                      '0 0th Sunday Sun'],
                ['DDD DDDo DDDD',                      '45 45th 045'],
                ['w wo ww',                            '8 8th 08'],
                ['h hh',                               '3 03'],
                ['H HH',                               '15 15'],
                ['m mm',                               '25 25'],
                ['s ss',                               '50 50'],
                ['a A',                                'pm PM'],
                ['t\\he DDDo \\d\\ay of t\\he ye\\ar', 'the 45th day of the year'],
                ['L',                                  '02/14/2010'],
                ['LL',                                 'February 14 2010'],
                ['LLL',                                'February 14 2010 3:25 PM'],
                ['LLLL',                               'Sunday, February 14 2010 3:25 PM']
            ],
            b = moment(new Date(2010, 1, 14, 15, 25, 50, 125)),
            i;
        for (i = 0; i < a.length; i++) {
            test.equal(b.format(a[i][0]), a[i][1], a[i][0] + ' ---> ' + a[i][1]);
        }
        test.done();
    },

    "format ordinal" : function(test) {
        test.expect(31);
        moment.lang('en');
        test.equal(moment([2011, 0, 1]).format('DDDo'), '1st', '1st');
        test.equal(moment([2011, 0, 2]).format('DDDo'), '2nd', '2nd');
        test.equal(moment([2011, 0, 3]).format('DDDo'), '3rd', '3rd');
        test.equal(moment([2011, 0, 4]).format('DDDo'), '4th', '4th');
        test.equal(moment([2011, 0, 5]).format('DDDo'), '5th', '5th');
        test.equal(moment([2011, 0, 6]).format('DDDo'), '6th', '6th');
        test.equal(moment([2011, 0, 7]).format('DDDo'), '7th', '7th');
        test.equal(moment([2011, 0, 8]).format('DDDo'), '8th', '8th');
        test.equal(moment([2011, 0, 9]).format('DDDo'), '9th', '9th');
        test.equal(moment([2011, 0, 10]).format('DDDo'), '10th', '10th');
    
        test.equal(moment([2011, 0, 11]).format('DDDo'), '11th', '11th');
        test.equal(moment([2011, 0, 12]).format('DDDo'), '12th', '12th');
        test.equal(moment([2011, 0, 13]).format('DDDo'), '13th', '13th');
        test.equal(moment([2011, 0, 14]).format('DDDo'), '14th', '14th');
        test.equal(moment([2011, 0, 15]).format('DDDo'), '15th', '15th');
        test.equal(moment([2011, 0, 16]).format('DDDo'), '16th', '16th');
        test.equal(moment([2011, 0, 17]).format('DDDo'), '17th', '17th');
        test.equal(moment([2011, 0, 18]).format('DDDo'), '18th', '18th');
        test.equal(moment([2011, 0, 19]).format('DDDo'), '19th', '19th');
        test.equal(moment([2011, 0, 20]).format('DDDo'), '20th', '20th');
    
        test.equal(moment([2011, 0, 21]).format('DDDo'), '21st', '21st');
        test.equal(moment([2011, 0, 22]).format('DDDo'), '22nd', '22nd');
        test.equal(moment([2011, 0, 23]).format('DDDo'), '23rd', '23rd');
        test.equal(moment([2011, 0, 24]).format('DDDo'), '24th', '24th');
        test.equal(moment([2011, 0, 25]).format('DDDo'), '25th', '25th');
        test.equal(moment([2011, 0, 26]).format('DDDo'), '26th', '26th');
        test.equal(moment([2011, 0, 27]).format('DDDo'), '27th', '27th');
        test.equal(moment([2011, 0, 28]).format('DDDo'), '28th', '28th');
        test.equal(moment([2011, 0, 29]).format('DDDo'), '29th', '29th');
        test.equal(moment([2011, 0, 30]).format('DDDo'), '30th', '30th');
    
        test.equal(moment([2011, 0, 31]).format('DDDo'), '31st', '31st');
        test.done();
    },

    "format month" : function(test) {
        test.expect(12);
        moment.lang('en');
        var expected = 'January Jan_February Feb_March Mar_April Apr_May May_June Jun_July Jul_August Aug_September Sep_October Oct_November Nov_December Dec'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, i, 0]).format('MMMM MMM'), expected[i], expected[i]);
        }
        test.done();
    },

    "format week" : function(test) {
        test.expect(7);
        moment.lang('en');
        var expected = 'Sunday Sun_Monday Mon_Tuesday Tue_Wednesday Wed_Thursday Thu_Friday Fri_Saturday Sat'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, 0, 2 + i]).format('dddd ddd'), expected[i], expected[i]);
        }
        test.done();
    },

    "from" : function(test) {
        test.expect(30);
        moment.lang('en');
        var start = moment([2007, 1, 28]);
        test.equal(start.from(moment([2007, 1, 28]).add({s:44}), true),  "a few seconds", "44 seconds = a few seconds");
        test.equal(start.from(moment([2007, 1, 28]).add({s:45}), true),  "a minute",      "45 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:89}), true),  "a minute",      "89 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:90}), true),  "2 minutes",     "90 seconds = 2 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:44}), true),  "44 minutes",    "44 minutes = 44 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:45}), true),  "an hour",       "45 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:89}), true),  "an hour",       "89 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:90}), true),  "2 hours",       "90 minutes = 2 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:5}), true),   "5 hours",       "5 hours = 5 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:21}), true),  "21 hours",      "21 hours = 21 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:22}), true),  "a day",         "22 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:35}), true),  "a day",         "35 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:36}), true),  "2 days",        "36 hours = 2 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:1}), true),   "a day",         "1 day = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({d:5}), true),   "5 days",        "5 days = 5 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:25}), true),  "25 days",       "25 days = 25 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:26}), true),  "a month",       "26 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:30}), true),  "a month",       "30 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:45}), true),  "a month",       "45 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:46}), true),  "2 months",      "46 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:74}), true),  "2 months",      "75 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:76}), true),  "3 months",      "76 days = 3 months");
        test.equal(start.from(moment([2007, 1, 28]).add({M:1}), true),   "a month",       "1 month = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({M:5}), true),   "5 months",      "5 months = 5 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:344}), true), "11 months",     "344 days = 11 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:345}), true), "a year",        "345 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:547}), true), "a year",        "547 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:548}), true), "2 years",       "548 days = 2 years");
        test.equal(start.from(moment([2007, 1, 28]).add({y:1}), true),   "a year",        "1 year = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({y:5}), true),   "5 years",       "5 years = 5 years");
        test.done();
    },

    "suffix" : function(test) {
        test.expect(2);
        moment.lang('en');
        test.equal(moment(30000).from(0), "in a few seconds",  "prefix");
        test.equal(moment(0).from(30000), "a few seconds ago", "suffix");
        test.done();
    },

    "now from now" : function(test) {
        test.expect(1);
        moment.lang('en');
        test.equal(moment().fromNow(), "a few seconds ago",  "now from now should display as in the past");
        test.done();
    },

    "fromNow" : function(test) {
        test.expect(2);
        moment.lang('en');
        test.equal(moment().add({s:30}).fromNow(), "in a few seconds", "in a few seconds");
        test.equal(moment().add({d:5}).fromNow(), "in 5 days", "in 5 days");
        test.done();
    },

    "calendar day" : function(test) {
        test.expect(6);
        moment.lang('en');
    
        var a = moment().hours(2).minutes(0).seconds(0);
    
        test.equal(moment(a).calendar(),                     "Today at 2:00 AM",     "today at the same time");
        test.equal(moment(a).add({ m: 25 }).calendar(),      "Today at 2:25 AM",     "Now plus 25 min");
        test.equal(moment(a).add({ h: 1 }).calendar(),       "Today at 3:00 AM",     "Now plus 1 hour");
        test.equal(moment(a).add({ d: 1 }).calendar(),       "Tomorrow at 2:00 AM",  "tomorrow at the same time");
        test.equal(moment(a).subtract({ h: 1 }).calendar(),  "Today at 1:00 AM",     "Now minus 1 hour");
        test.equal(moment(a).subtract({ d: 1 }).calendar(),  "Yesterday at 2:00 AM", "yesterday at the same time");
        test.done();
    },

    "calendar next week" : function(test) {
        test.expect(15);
        moment.lang('en');
    
        var i;
        var m;
    
        for (i = 2; i < 7; i++) {
            m = moment().add({ d: i });
            test.equal(m.calendar(),       m.format('dddd [at] LT'),  "Today + " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('dddd [at] LT'),  "Today + " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('dddd [at] LT'),  "Today + " + i + " days end of day");
        }
        test.done();
    },

    "calendar last week" : function(test) {
        test.expect(15);
        moment.lang('en');
    
        for (i = 2; i < 7; i++) {
            m = moment().subtract({ d: i });
            test.equal(m.calendar(),       m.format('[last] dddd [at] LT'),  "Today - " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('[last] dddd [at] LT'),  "Today - " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('[last] dddd [at] LT'),  "Today - " + i + " days end of day");
        }
        test.done();
    },

    "calendar all else" : function(test) {
        test.expect(4);
        moment.lang('en');
        var weeksAgo = moment().subtract({ w: 1 });
        var weeksFromNow = moment().add({ w: 1 });
        
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "1 week ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 1 week");
    
        weeksAgo = moment().subtract({ w: 2 });
        weeksFromNow = moment().add({ w: 2 });
        
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "2 weeks ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 2 weeks");
    test.done();
    }
};var moment = require("../../moment");


    /**************************************************
      Spanish
     *************************************************/

exports["lang:es"] = {
    "parse" : function(test) {
        test.expect(96);
        moment.lang('es');
        var tests = 'Enero Ene._Febrero Feb._Marzo Mar._Abril Abr._Mayo May._Junio Jun._Julio Jul._Agosto Ago._Septiembre Sep._Octubre Oct._Noviembre Nov._Diciembre Dic.'.split("_");
        var i;
        function equalTest(input, mmm, i) {
            test.equal(moment(input, mmm).month(), i, input + ' should be month ' + (i + 1));
        }
        for (i = 0; i < 12; i++) {
            tests[i] = tests[i].split(' ');
            equalTest(tests[i][0], 'MMM', i);
            equalTest(tests[i][1], 'MMM', i);
            equalTest(tests[i][0], 'MMMM', i);
            equalTest(tests[i][1], 'MMMM', i);
            equalTest(tests[i][0].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][0].toLocaleUpperCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleUpperCase(), 'MMMM', i);
        }
        test.done();
    },

    "format ordinal" : function(test) {
        test.expect(31);
        moment.lang('es');
        test.equal(moment([2011, 0, 1]).format('DDDo'), '1º', '1º');
        test.equal(moment([2011, 0, 2]).format('DDDo'), '2º', '2º');
        test.equal(moment([2011, 0, 3]).format('DDDo'), '3º', '3º');
        test.equal(moment([2011, 0, 4]).format('DDDo'), '4º', '4º');
        test.equal(moment([2011, 0, 5]).format('DDDo'), '5º', '5º');
        test.equal(moment([2011, 0, 6]).format('DDDo'), '6º', '6º');
        test.equal(moment([2011, 0, 7]).format('DDDo'), '7º', '7º');
        test.equal(moment([2011, 0, 8]).format('DDDo'), '8º', '8º');
        test.equal(moment([2011, 0, 9]).format('DDDo'), '9º', '9º');
        test.equal(moment([2011, 0, 10]).format('DDDo'), '10º', '10º');
    
        test.equal(moment([2011, 0, 11]).format('DDDo'), '11º', '11º');
        test.equal(moment([2011, 0, 12]).format('DDDo'), '12º', '12º');
        test.equal(moment([2011, 0, 13]).format('DDDo'), '13º', '13º');
        test.equal(moment([2011, 0, 14]).format('DDDo'), '14º', '14º');
        test.equal(moment([2011, 0, 15]).format('DDDo'), '15º', '15º');
        test.equal(moment([2011, 0, 16]).format('DDDo'), '16º', '16º');
        test.equal(moment([2011, 0, 17]).format('DDDo'), '17º', '17º');
        test.equal(moment([2011, 0, 18]).format('DDDo'), '18º', '18º');
        test.equal(moment([2011, 0, 19]).format('DDDo'), '19º', '19º');
        test.equal(moment([2011, 0, 20]).format('DDDo'), '20º', '20º');
    
        test.equal(moment([2011, 0, 21]).format('DDDo'), '21º', '21º');
        test.equal(moment([2011, 0, 22]).format('DDDo'), '22º', '22º');
        test.equal(moment([2011, 0, 23]).format('DDDo'), '23º', '23º');
        test.equal(moment([2011, 0, 24]).format('DDDo'), '24º', '24º');
        test.equal(moment([2011, 0, 25]).format('DDDo'), '25º', '25º');
        test.equal(moment([2011, 0, 26]).format('DDDo'), '26º', '26º');
        test.equal(moment([2011, 0, 27]).format('DDDo'), '27º', '27º');
        test.equal(moment([2011, 0, 28]).format('DDDo'), '28º', '28º');
        test.equal(moment([2011, 0, 29]).format('DDDo'), '29º', '29º');
        test.equal(moment([2011, 0, 30]).format('DDDo'), '30º', '30º');
    
        test.equal(moment([2011, 0, 31]).format('DDDo'), '31º', '31º');
        test.done();
    },

    "format month" : function(test) {
        test.expect(12);
        moment.lang('es');
        var expected = 'Enero Ene._Febrero Feb._Marzo Mar._Abril Abr._Mayo May._Junio Jun._Julio Jul._Agosto Ago._Septiembre Sep._Octubre Oct._Noviembre Nov._Diciembre Dic.'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, i, 0]).format('MMMM MMM'), expected[i], expected[i]);
        }
        test.done();
    },

    "format week" : function(test) {
        test.expect(7);
        moment.lang('es');
        var expected = 'Domingo Dom._Lunes Lun._Martes Mar._Miércoles Mié._Jueves Jue._Viernes Vie._Sábado Sáb.'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, 0, 2 + i]).format('dddd ddd'), expected[i], expected[i]);
        }
        test.done();
    },

    "from" : function(test) {
        test.expect(30);
        moment.lang('es');
        var start = moment([2007, 1, 28]);
        test.equal(start.from(moment([2007, 1, 28]).add({s:44}), true),  "unos segundos", "44 seconds = a few seconds");
        test.equal(start.from(moment([2007, 1, 28]).add({s:45}), true),  "un minuto",      "45 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:89}), true),  "un minuto",      "89 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:90}), true),  "2 minutos",     "90 seconds = 2 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:44}), true),  "44 minutos",    "44 minutes = 44 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:45}), true),  "una hora",       "45 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:89}), true),  "una hora",       "89 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:90}), true),  "2 horas",       "90 minutes = 2 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:5}), true),   "5 horas",       "5 hours = 5 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:21}), true),  "21 horas",      "21 hours = 21 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:22}), true),  "un día",         "22 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:35}), true),  "un día",         "35 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:36}), true),  "2 días",        "36 hours = 2 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:1}), true),   "un día",         "1 day = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({d:5}), true),   "5 días",        "5 days = 5 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:25}), true),  "25 días",       "25 days = 25 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:26}), true),  "un mes",       "26 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:30}), true),  "un mes",       "30 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:45}), true),  "un mes",       "45 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:46}), true),  "2 meses",      "46 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:74}), true),  "2 meses",      "75 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:76}), true),  "3 meses",      "76 days = 3 months");
        test.equal(start.from(moment([2007, 1, 28]).add({M:1}), true),   "un mes",       "1 month = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({M:5}), true),   "5 meses",      "5 months = 5 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:344}), true), "11 meses",     "344 days = 11 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:345}), true), "un año",        "345 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:547}), true), "un año",        "547 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:548}), true), "2 años",       "548 days = 2 years");
        test.equal(start.from(moment([2007, 1, 28]).add({y:1}), true),   "un año",        "1 year = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({y:5}), true),   "5 años",       "5 years = 5 years");
        test.done();
    },

    "suffix" : function(test) {
        test.expect(2);
        moment.lang('es');
        test.equal(moment(30000).from(0), "en unos segundos",  "prefix");
        test.equal(moment(0).from(30000), "hace unos segundos", "suffix");
        test.done();
    },

    "now from now" : function(test) {
        test.expect(1);
        moment.lang('es');
        test.equal(moment().fromNow(), "hace unos segundos",  "now from now should display as in the past");
        test.done();
    },

    "fromNow" : function(test) {
        test.expect(2);
        moment.lang('es');
        test.equal(moment().add({s:30}).fromNow(), "en unos segundos", "en unos segundos");
        test.equal(moment().add({d:5}).fromNow(), "en 5 días", "en 5 días");
        test.done();
    },

    "calendar day" : function(test) {
        test.expect(7);
        moment.lang('es');
    
        var a = moment().hours(2).minutes(0).seconds(0);
    
        test.equal(moment(a).calendar(),                         "hoy a las 2:00",     "today at the same time");
        test.equal(moment(a).add({ m: 25 }).calendar(),          "hoy a las 2:25",     "Now plus 25 min");
        test.equal(moment(a).add({ h: 1 }).calendar(),           "hoy a las 3:00",     "Now plus 1 hour");
        test.equal(moment(a).add({ d: 1 }).calendar(),           "mañana a las 2:00",  "tomorrow at the same time");
        test.equal(moment(a).add({ d: 1, h : -1 }).calendar(),   "mañana a la 1:00",   "tomorrow minus 1 hour");
        test.equal(moment(a).subtract({ h: 1 }).calendar(),      "hoy a la 1:00",      "Now minus 1 hour");
        test.equal(moment(a).subtract({ d: 1 }).calendar(),      "ayer a las 2:00",    "yesterday at the same time");
        test.done();
    },

    "calendar next week" : function(test) {
        test.expect(15);
        moment.lang('es');
    
        var i;
        var m;
    
        for (i = 2; i < 7; i++) {
            m = moment().add({ d: i });
            test.equal(m.calendar(),       m.format('dddd [a la' + ((m.hours() !== 1) ? 's' : '') + '] LT'),  "Today + " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('dddd [a la' + ((m.hours() !== 1) ? 's' : '') + '] LT'),  "Today + " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('dddd [a la' + ((m.hours() !== 1) ? 's' : '') + '] LT'),  "Today + " + i + " days end of day");
        }
        test.done();
    },

    "calendar last week" : function(test) {
        test.expect(15);
        moment.lang('es');
    
        for (i = 2; i < 7; i++) {
            m = moment().subtract({ d: i });
            test.equal(m.calendar(),       m.format('[el] dddd [pasado a la' + ((m.hours() !== 1) ? 's' : '') + '] LT'),  "Today - " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('[el] dddd [pasado a la' + ((m.hours() !== 1) ? 's' : '') + '] LT'),  "Today - " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('[el] dddd [pasado a la' + ((m.hours() !== 1) ? 's' : '') + '] LT'),  "Today - " + i + " days end of day");
        }
        test.done();
    },

    "calendar all else" : function(test) {
        test.expect(4);
        moment.lang('es');
        var weeksAgo = moment().subtract({ w: 1 });
        var weeksFromNow = moment().add({ w: 1 });
        
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "1 week ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 1 week");
    
        weeksAgo = moment().subtract({ w: 2 });
        weeksFromNow = moment().add({ w: 2 });
        
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "2 weeks ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 2 weeks");
    test.done();
    }
};var moment = require("../../moment");


    /**************************************************
      Euskara
     *************************************************/

exports["lang:eu"] = {
    "parse" : function(test) {
        test.expect(96);
        moment.lang('eu');
        var tests = 'urtarrila urt._otsaila ots._martxoa mar._apirila api._maiatza mai._ekaina eka._uztaila uzt._abuztua abu._iraila ira._urria urr._azaroa aza._abendua abe.'.split("_");
        var i;
        function equalTest(input, mmm, i) {
            test.equal(moment(input, mmm).month(), i, input + ' should be month ' + (i + 1));
        }
        for (i = 0; i < 12; i++) {
            tests[i] = tests[i].split(' ');
            equalTest(tests[i][0], 'MMM', i);
            equalTest(tests[i][1], 'MMM', i);
            equalTest(tests[i][0], 'MMMM', i);
            equalTest(tests[i][1], 'MMMM', i);
            equalTest(tests[i][0].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][0].toLocaleUpperCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleUpperCase(), 'MMMM', i);
        }
        test.done();
    },

    "format" : function(test) {
        test.expect(18);
        moment.lang('eu');
        var a = [
                ['dddd, MMMM Do YYYY, h:mm:ss a',      'igandea, otsaila 14. 2010, 3:25:50 pm'],
                ['ddd, hA',                            'ig., 3PM'],
                ['M Mo MM MMMM MMM',                   '2 2. 02 otsaila ots.'],
                ['YYYY YY',                            '2010 10'],
                ['D Do DD',                            '14 14. 14'],
                ['d do dddd ddd',                      '0 0. igandea ig.'],
                ['DDD DDDo DDDD',                      '45 45. 045'],
                ['w wo ww',                            '8 8. 08'],
                ['h hh',                               '3 03'],
                ['H HH',                               '15 15'],
                ['m mm',                               '25 25'],
                ['s ss',                               '50 50'],
                ['a A',                                'pm PM'],
                ['t\\he DDDo \\d\\ay of t\\he ye\\ar', 'the 45. day of the year'],
                ['L',                                  '2010-02-14'],
                ['LL',                                 '2010ko otsailaren 14a'],
                ['LLL',                                '2010ko otsailaren 14a 15:25'],
                ['LLLL',                               'igandea, 2010ko otsailaren 14a 15:25']
            ],
            b = moment(new Date(2010, 1, 14, 15, 25, 50, 125)),
            i;
        for (i = 0; i < a.length; i++) {
            test.equal(b.format(a[i][0]), a[i][1], a[i][0] + ' ---> ' + a[i][1]);
        }
        test.done();
    },

    "format ordinal" : function(test) {
        test.expect(31);
        moment.lang('eu');
        test.equal(moment([2011, 0, 1]).format('DDDo'), '1.', '1.');
        test.equal(moment([2011, 0, 2]).format('DDDo'), '2.', '2.');
        test.equal(moment([2011, 0, 3]).format('DDDo'), '3.', '3.');
        test.equal(moment([2011, 0, 4]).format('DDDo'), '4.', '4.');
        test.equal(moment([2011, 0, 5]).format('DDDo'), '5.', '5.');
        test.equal(moment([2011, 0, 6]).format('DDDo'), '6.', '6.');
        test.equal(moment([2011, 0, 7]).format('DDDo'), '7.', '7.');
        test.equal(moment([2011, 0, 8]).format('DDDo'), '8.', '8.');
        test.equal(moment([2011, 0, 9]).format('DDDo'), '9.', '9.');
        test.equal(moment([2011, 0, 10]).format('DDDo'), '10.', '10.');
    
        test.equal(moment([2011, 0, 11]).format('DDDo'), '11.', '11.');
        test.equal(moment([2011, 0, 12]).format('DDDo'), '12.', '12.');
        test.equal(moment([2011, 0, 13]).format('DDDo'), '13.', '13.');
        test.equal(moment([2011, 0, 14]).format('DDDo'), '14.', '14.');
        test.equal(moment([2011, 0, 15]).format('DDDo'), '15.', '15.');
        test.equal(moment([2011, 0, 16]).format('DDDo'), '16.', '16.');
        test.equal(moment([2011, 0, 17]).format('DDDo'), '17.', '17.');
        test.equal(moment([2011, 0, 18]).format('DDDo'), '18.', '18.');
        test.equal(moment([2011, 0, 19]).format('DDDo'), '19.', '19.');
        test.equal(moment([2011, 0, 20]).format('DDDo'), '20.', '20.');
    
        test.equal(moment([2011, 0, 21]).format('DDDo'), '21.', '21.');
        test.equal(moment([2011, 0, 22]).format('DDDo'), '22.', '22.');
        test.equal(moment([2011, 0, 23]).format('DDDo'), '23.', '23.');
        test.equal(moment([2011, 0, 24]).format('DDDo'), '24.', '24.');
        test.equal(moment([2011, 0, 25]).format('DDDo'), '25.', '25.');
        test.equal(moment([2011, 0, 26]).format('DDDo'), '26.', '26.');
        test.equal(moment([2011, 0, 27]).format('DDDo'), '27.', '27.');
        test.equal(moment([2011, 0, 28]).format('DDDo'), '28.', '28.');
        test.equal(moment([2011, 0, 29]).format('DDDo'), '29.', '29.');
        test.equal(moment([2011, 0, 30]).format('DDDo'), '30.', '30.');
    
        test.equal(moment([2011, 0, 31]).format('DDDo'), '31.', '31.');
        test.done();
    },

    "format month" : function(test) {
        test.expect(12);
        moment.lang('eu');
        var expected = 'urtarrila urt._otsaila ots._martxoa mar._apirila api._maiatza mai._ekaina eka._uztaila uzt._abuztua abu._iraila ira._urria urr._azaroa aza._abendua abe.'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, i, 0]).format('MMMM MMM'), expected[i], expected[i]);
        }
        test.done();
    },

    "format week" : function(test) {
        test.expect(7);
        moment.lang('eu');
        var expected = 'igandea ig._astelehena al._asteartea ar._asteazkena az._osteguna og._ostirala ol._larunbata lr.'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, 0, 2 + i]).format('dddd ddd'), expected[i], expected[i]);
        }
        test.done();
    },

    "from" : function(test) {
        test.expect(30);
        moment.lang('eu');
        var start = moment([2007, 1, 28]);
        test.equal(start.from(moment([2007, 1, 28]).add({s:44}), true),  "segundo batzuk", "44 seconds = a few seconds");
        test.equal(start.from(moment([2007, 1, 28]).add({s:45}), true),  "minutu bat",     "45 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:89}), true),  "minutu bat",     "89 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:90}), true),  "2 minutu",       "90 seconds = 2 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:44}), true),  "44 minutu",      "44 minutes = 44 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:45}), true),  "ordu bat",       "45 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:89}), true),  "ordu bat",       "89 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:90}), true),  "2 ordu",         "90 minutes = 2 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:5}), true),   "5 ordu",         "5 hours = 5 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:21}), true),  "21 ordu",        "21 hours = 21 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:22}), true),  "egun bat",       "22 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:35}), true),  "egun bat",       "35 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:36}), true),  "2 egun",         "36 hours = 2 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:1}), true),   "egun bat",       "1 day = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({d:5}), true),   "5 egun",         "5 days = 5 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:25}), true),  "25 egun",        "25 days = 25 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:26}), true),  "hilabete bat",   "26 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:30}), true),  "hilabete bat",   "30 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:45}), true),  "hilabete bat",   "45 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:46}), true),  "2 hilabete",     "46 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:74}), true),  "2 hilabete",     "75 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:76}), true),  "3 hilabete",     "76 days = 3 months");
        test.equal(start.from(moment([2007, 1, 28]).add({M:1}), true),   "hilabete bat",   "1 month = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({M:5}), true),   "5 hilabete",     "5 months = 5 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:344}), true), "11 hilabete",    "344 days = 11 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:345}), true), "urte bat",       "345 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:547}), true), "urte bat",       "547 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:548}), true), "2 urte",         "548 days = 2 years");
        test.equal(start.from(moment([2007, 1, 28]).add({y:1}), true),   "urte bat",       "1 year = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({y:5}), true),   "5 urte",         "5 years = 5 years");
        test.done();
    },

    "suffix" : function(test) {
        test.expect(2);
        moment.lang('eu');
        test.equal(moment(30000).from(0), "segundo batzuk barru",  "prefix");
        test.equal(moment(0).from(30000), "duela segundo batzuk", "suffix");
        test.done();
    },

    "now from now" : function(test) {
        test.expect(1);
        moment.lang('eu');
        test.equal(moment().fromNow(), "duela segundo batzuk",  "now from now should display as in the past");
        test.done();
    },

    "fromNow" : function(test) {
        test.expect(2);
        moment.lang('eu');
        test.equal(moment().add({s:30}).fromNow(), "segundo batzuk barru", "in seconds");
        test.equal(moment().add({d:5}).fromNow(), "5 egun barru", "in 5 days");
        test.done();
    },

    "calendar day" : function(test) {
        test.expect(6);
        moment.lang('eu');
    
        var a = moment().hours(2).minutes(0).seconds(0);
    
        test.equal(moment(a).calendar(),                     "gaur 02:00etan",  "today at the same time");
        test.equal(moment(a).add({ m: 25 }).calendar(),      "gaur 02:25etan",  "now plus 25 min");
        test.equal(moment(a).add({ h: 1 }).calendar(),       "gaur 03:00etan",  "now plus 1 hour");
        test.equal(moment(a).add({ d: 1 }).calendar(),       "bihar 02:00etan", "tomorrow at the same time");
        test.equal(moment(a).subtract({ h: 1 }).calendar(),  "gaur 01:00etan",  "now minus 1 hour");
        test.equal(moment(a).subtract({ d: 1 }).calendar(),  "atzo 02:00etan",  "yesterday at the same time");
        test.done();
    },

    "calendar next week" : function(test) {
        test.expect(15);
        moment.lang('eu');
    
        var i;
        var m;
    
        for (i = 2; i < 7; i++) {
            m = moment().add({ d: i });
            test.equal(m.calendar(),       m.format('dddd LT[etan]'),  "Today + " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('dddd LT[etan]'),  "Today + " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('dddd LT[etan]'),  "Today + " + i + " days end of day");
        }
        test.done();
    },

    "calendar last week" : function(test) {
        test.expect(15);
        moment.lang('eu');
    
        for (i = 2; i < 7; i++) {
            m = moment().subtract({ d: i });
            test.equal(m.calendar(),       m.format('[aurreko] dddd LT[etan]'),  "Today - " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('[aurreko] dddd LT[etan]'),  "Today - " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('[aurreko] dddd LT[etan]'),  "Today - " + i + " days end of day");
        }
        test.done();
    },

    "calendar all else" : function(test) {
        test.expect(4);
        moment.lang('eu');
        var weeksAgo = moment().subtract({ w: 1 });
        var weeksFromNow = moment().add({ w: 1 });
        
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "1 week ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 1 week");
    
        weeksAgo = moment().subtract({ w: 2 });
        weeksFromNow = moment().add({ w: 2 });
        
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "2 weeks ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 2 weeks");
    test.done();
    }
};var moment = require("../../moment");


    /**************************************************
      French
     *************************************************/

exports["lang:fr"] = {
    "parse" : function(test) {
        test.expect(96);
        moment.lang('fr');
        var tests = 'janvier janv._février févr._mars mars_avril avr._mai mai_juin juin_juillet juil._août août_septembre sept._octobre oct._novembre nov._décembre déc.'.split("_");
        var i;
        function equalTest(input, mmm, i) {
            test.equal(moment(input, mmm).month(), i, input + ' should be month ' + (i + 1));
        }
        for (i = 0; i < 12; i++) {
            tests[i] = tests[i].split(' ');
            equalTest(tests[i][0], 'MMM', i);
            equalTest(tests[i][1], 'MMM', i);
            equalTest(tests[i][0], 'MMMM', i);
            equalTest(tests[i][1], 'MMMM', i);
            equalTest(tests[i][0].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][0].toLocaleUpperCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleUpperCase(), 'MMMM', i);
        }
        test.done();
    },

    "format" : function(test) {
        test.expect(18);
        moment.lang('fr');
        var a = [
                ['dddd, MMMM Do YYYY, h:mm:ss a',      'dimanche, février 14ème 2010, 3:25:50 pm'],
                ['ddd, hA',                            'dim., 3PM'],
                ['M Mo MM MMMM MMM',                   '2 2ème 02 février févr.'],
                ['YYYY YY',                            '2010 10'],
                ['D Do DD',                            '14 14ème 14'],
                ['d do dddd ddd',                      '0 0ème dimanche dim.'],
                ['DDD DDDo DDDD',                      '45 45ème 045'],
                ['w wo ww',                            '8 8ème 08'],
                ['h hh',                               '3 03'],
                ['H HH',                               '15 15'],
                ['m mm',                               '25 25'],
                ['s ss',                               '50 50'],
                ['a A',                                'pm PM'],
                ['t\\he DDDo \\d\\ay of t\\he ye\\ar', 'the 45ème day of the year'],
                ['L',                                  '14/02/2010'],
                ['LL',                                 '14 février 2010'],
                ['LLL',                                '14 février 2010 15:25'],
                ['LLLL',                               'dimanche 14 février 2010 15:25']
            ],
            b = moment(new Date(2010, 1, 14, 15, 25, 50, 125)),
            i;
        for (i = 0; i < a.length; i++) {
            test.equal(b.format(a[i][0]), a[i][1], a[i][0] + ' ---> ' + a[i][1]);
        }
        test.done();
    },

    "format ordinal" : function(test) {
        test.expect(31);
        moment.lang('fr');
        test.equal(moment([2011, 0, 1]).format('DDDo'), '1er', '1er');
        test.equal(moment([2011, 0, 2]).format('DDDo'), '2ème', '2ème');
        test.equal(moment([2011, 0, 3]).format('DDDo'), '3ème', '3ème');
        test.equal(moment([2011, 0, 4]).format('DDDo'), '4ème', '4ème');
        test.equal(moment([2011, 0, 5]).format('DDDo'), '5ème', '5ème');
        test.equal(moment([2011, 0, 6]).format('DDDo'), '6ème', '6ème');
        test.equal(moment([2011, 0, 7]).format('DDDo'), '7ème', '7ème');
        test.equal(moment([2011, 0, 8]).format('DDDo'), '8ème', '8ème');
        test.equal(moment([2011, 0, 9]).format('DDDo'), '9ème', '9ème');
        test.equal(moment([2011, 0, 10]).format('DDDo'), '10ème', '10ème');
    
        test.equal(moment([2011, 0, 11]).format('DDDo'), '11ème', '11ème');
        test.equal(moment([2011, 0, 12]).format('DDDo'), '12ème', '12ème');
        test.equal(moment([2011, 0, 13]).format('DDDo'), '13ème', '13ème');
        test.equal(moment([2011, 0, 14]).format('DDDo'), '14ème', '14ème');
        test.equal(moment([2011, 0, 15]).format('DDDo'), '15ème', '15ème');
        test.equal(moment([2011, 0, 16]).format('DDDo'), '16ème', '16ème');
        test.equal(moment([2011, 0, 17]).format('DDDo'), '17ème', '17ème');
        test.equal(moment([2011, 0, 18]).format('DDDo'), '18ème', '18ème');
        test.equal(moment([2011, 0, 19]).format('DDDo'), '19ème', '19ème');
        test.equal(moment([2011, 0, 20]).format('DDDo'), '20ème', '20ème');
    
        test.equal(moment([2011, 0, 21]).format('DDDo'), '21ème', '21ème');
        test.equal(moment([2011, 0, 22]).format('DDDo'), '22ème', '22ème');
        test.equal(moment([2011, 0, 23]).format('DDDo'), '23ème', '23ème');
        test.equal(moment([2011, 0, 24]).format('DDDo'), '24ème', '24ème');
        test.equal(moment([2011, 0, 25]).format('DDDo'), '25ème', '25ème');
        test.equal(moment([2011, 0, 26]).format('DDDo'), '26ème', '26ème');
        test.equal(moment([2011, 0, 27]).format('DDDo'), '27ème', '27ème');
        test.equal(moment([2011, 0, 28]).format('DDDo'), '28ème', '28ème');
        test.equal(moment([2011, 0, 29]).format('DDDo'), '29ème', '29ème');
        test.equal(moment([2011, 0, 30]).format('DDDo'), '30ème', '30ème');
    
        test.equal(moment([2011, 0, 31]).format('DDDo'), '31ème', '31ème');
        test.done();
    },

    "format month" : function(test) {
        test.expect(12);
        moment.lang('fr');
        var expected = 'janvier janv._février févr._mars mars_avril avr._mai mai_juin juin_juillet juil._août août_septembre sept._octobre oct._novembre nov._décembre déc.'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, i, 0]).format('MMMM MMM'), expected[i], expected[i]);
        }
        test.done();
    },

    "format week" : function(test) {
        test.expect(7);
        moment.lang('fr');
        var expected = 'dimanche dim._lundi lun._mardi mar._mercredi mer._jeudi jeu._vendredi ven._samedi sam.'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, 0, 2 + i]).format('dddd ddd'), expected[i], expected[i]);
        }
        test.done();
    },

    "from" : function(test) {
        test.expect(30);
        moment.lang('fr');
        var start = moment([2007, 1, 28]);
        test.equal(start.from(moment([2007, 1, 28]).add({s:44}), true),  "quelques secondes", "44 seconds = a few seconds");
        test.equal(start.from(moment([2007, 1, 28]).add({s:45}), true),  "une minute",   "45 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:89}), true),  "une minute",   "89 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:90}), true),  "2 minutes",  "90 seconds = 2 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:44}), true),  "44 minutes", "44 minutes = 44 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:45}), true),  "une heure",    "45 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:89}), true),  "une heure",    "89 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:90}), true),  "2 heures",    "90 minutes = 2 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:5}), true),   "5 heures",    "5 hours = 5 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:21}), true),  "21 heures",   "21 hours = 21 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:22}), true),  "un jour",      "22 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:35}), true),  "un jour",      "35 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:36}), true),  "2 jours",     "36 hours = 2 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:1}), true),   "un jour",      "1 day = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({d:5}), true),   "5 jours",     "5 days = 5 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:25}), true),  "25 jours",    "25 days = 25 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:26}), true),  "un mois",    "26 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:30}), true),  "un mois",    "30 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:45}), true),  "un mois",    "45 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:46}), true),  "2 mois",   "46 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:74}), true),  "2 mois",   "75 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:76}), true),  "3 mois",   "76 days = 3 months");
        test.equal(start.from(moment([2007, 1, 28]).add({M:1}), true),   "un mois",    "1 month = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({M:5}), true),   "5 mois",   "5 months = 5 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:344}), true), "11 mois",  "344 days = 11 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:345}), true), "une année",     "345 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:547}), true), "une année",     "547 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:548}), true), "2 années",    "548 days = 2 years");
        test.equal(start.from(moment([2007, 1, 28]).add({y:1}), true),   "une année",     "1 year = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({y:5}), true),   "5 années",    "5 years = 5 years");
        test.done();
    },

    "suffix" : function(test) {
        test.expect(2);
        moment.lang('fr');
        test.equal(moment(30000).from(0), "dans quelques secondes", "prefix");
        test.equal(moment(0).from(30000), "il y a quelques secondes", "suffix");
        test.done();
    },

    "fromNow" : function(test) {
        test.expect(2);
        moment.lang('fr');
        test.equal(moment().add({s:30}).fromNow(), "dans quelques secondes", "in a few seconds");
        test.equal(moment().add({d:5}).fromNow(), "dans 5 jours", "in 5 days");
        test.done();
    },

    "same day" : function(test) {
        test.expect(6);
        moment.lang('fr');
    
        var a = moment().hours(2).minutes(0).seconds(0);
    
        test.equal(moment(a).calendar(),                     "Ajourd'hui à 02:00",     "today at the same time");
        test.equal(moment(a).add({ m: 25 }).calendar(),      "Ajourd'hui à 02:25",     "Now plus 25 min");
        test.equal(moment(a).add({ h: 1 }).calendar(),       "Ajourd'hui à 03:00",     "Now plus 1 hour");
        test.equal(moment(a).add({ d: 1 }).calendar(),       "Demain à 02:00",         "tomorrow at the same time");
        test.equal(moment(a).subtract({ h: 1 }).calendar(),  "Ajourd'hui à 01:00",     "Now minus 1 hour");
        test.equal(moment(a).subtract({ d: 1 }).calendar(),  "Hier à 02:00",           "yesterday at the same time");
        test.done();
    },

    "same next week" : function(test) {
        test.expect(15);
        moment.lang('fr');
    
        var i;
        var m;
    
        for (i = 2; i < 7; i++) {
            m = moment().add({ d: i });
            test.equal(m.calendar(),       m.format('dddd [à] LT'),  "Today + " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('dddd [à] LT'),  "Today + " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('dddd [à] LT'),  "Today + " + i + " days end of day");
        }
        test.done();
    },

    "same last week" : function(test) {
        test.expect(15);
        moment.lang('fr');
    
        for (i = 2; i < 7; i++) {
            m = moment().subtract({ d: i });
            test.equal(m.calendar(),       m.format('dddd [dernier à] LT'),  "Today - " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('dddd [dernier à] LT'),  "Today - " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('dddd [dernier à] LT'),  "Today - " + i + " days end of day");
        }
        test.done();
    },

    "same all else" : function(test) {
        test.expect(4);
        moment.lang('fr');
        var weeksAgo = moment().subtract({ w: 1 });
        var weeksFromNow = moment().add({ w: 1 });
        
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "1 week ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 1 week");
    
        weeksAgo = moment().subtract({ w: 2 });
        weeksFromNow = moment().add({ w: 2 });
        
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "2 weeks ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 2 weeks");
    test.done();
    }
};var moment = require("../../moment");


    /**************************************************
      Galego
     *************************************************/

exports["lang:gl"] = {
    "parse" : function(test) {
        test.expect(96);
        moment.lang('gl');
        var tests = "Xaneiro Xan._Febreiro Feb._Marzo Mar._Abril Abr._Maio Mai._Xuño Xuñ._Xullo Xul._Agosto Ago._Setembro Set._Octubro Out._Novembro Nov._Decembro Dec.".split("_");
    
        var i;
        function equalTest(input, mmm, i) {
            test.equal(moment(input, mmm).month(), i, input + ' should be month ' + (i + 1));
        }
        for (i = 0; i < 12; i++) {
            tests[i] = tests[i].split(' ');
            equalTest(tests[i][0], 'MMM', i);
            equalTest(tests[i][1], 'MMM', i);
            equalTest(tests[i][0], 'MMMM', i);
            equalTest(tests[i][1], 'MMMM', i);
            equalTest(tests[i][0].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][0].toLocaleUpperCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleUpperCase(), 'MMMM', i);
        }
        test.done();
    },

    "format ordinal" : function(test) {
        test.expect(31);
        moment.lang('es');
        test.equal(moment([2011, 0, 1]).format('DDDo'), '1º', '1º');
        test.equal(moment([2011, 0, 2]).format('DDDo'), '2º', '2º');
        test.equal(moment([2011, 0, 3]).format('DDDo'), '3º', '3º');
        test.equal(moment([2011, 0, 4]).format('DDDo'), '4º', '4º');
        test.equal(moment([2011, 0, 5]).format('DDDo'), '5º', '5º');
        test.equal(moment([2011, 0, 6]).format('DDDo'), '6º', '6º');
        test.equal(moment([2011, 0, 7]).format('DDDo'), '7º', '7º');
        test.equal(moment([2011, 0, 8]).format('DDDo'), '8º', '8º');
        test.equal(moment([2011, 0, 9]).format('DDDo'), '9º', '9º');
        test.equal(moment([2011, 0, 10]).format('DDDo'), '10º', '10º');
    
        test.equal(moment([2011, 0, 11]).format('DDDo'), '11º', '11º');
        test.equal(moment([2011, 0, 12]).format('DDDo'), '12º', '12º');
        test.equal(moment([2011, 0, 13]).format('DDDo'), '13º', '13º');
        test.equal(moment([2011, 0, 14]).format('DDDo'), '14º', '14º');
        test.equal(moment([2011, 0, 15]).format('DDDo'), '15º', '15º');
        test.equal(moment([2011, 0, 16]).format('DDDo'), '16º', '16º');
        test.equal(moment([2011, 0, 17]).format('DDDo'), '17º', '17º');
        test.equal(moment([2011, 0, 18]).format('DDDo'), '18º', '18º');
        test.equal(moment([2011, 0, 19]).format('DDDo'), '19º', '19º');
        test.equal(moment([2011, 0, 20]).format('DDDo'), '20º', '20º');
    
        test.equal(moment([2011, 0, 21]).format('DDDo'), '21º', '21º');
        test.equal(moment([2011, 0, 22]).format('DDDo'), '22º', '22º');
        test.equal(moment([2011, 0, 23]).format('DDDo'), '23º', '23º');
        test.equal(moment([2011, 0, 24]).format('DDDo'), '24º', '24º');
        test.equal(moment([2011, 0, 25]).format('DDDo'), '25º', '25º');
        test.equal(moment([2011, 0, 26]).format('DDDo'), '26º', '26º');
        test.equal(moment([2011, 0, 27]).format('DDDo'), '27º', '27º');
        test.equal(moment([2011, 0, 28]).format('DDDo'), '28º', '28º');
        test.equal(moment([2011, 0, 29]).format('DDDo'), '29º', '29º');
        test.equal(moment([2011, 0, 30]).format('DDDo'), '30º', '30º');
    
        test.equal(moment([2011, 0, 31]).format('DDDo'), '31º', '31º');
        test.done();
    },

    "format month" : function(test) {
        test.expect(12);
        moment.lang('gl');
        var expected = "Xaneiro Xan._Febreiro Feb._Marzo Mar._Abril Abr._Maio Mai._Xuño Xuñ._Xullo Xul._Agosto Ago._Setembro Set._Octubro Out._Novembro Nov._Decembro Dec.".split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, i, 0]).format('MMMM MMM'), expected[i], expected[i]);
        }
        test.done();
    },

    "format week" : function(test) {
        test.expect(7);
        moment.lang('gl');
        var expected = "Domingo Dom._Luns Lun._Martes Mar._Mércores Mér._Xoves Xov._Venres Ven._Sábado Sáb.".split("_");
    
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, 0, 2 + i]).format('dddd ddd'), expected[i], expected[i]);
        }
        test.done();
    },

    "from" : function(test) {
        test.expect(30);
        moment.lang('gl');
        var start = moment([2007, 1, 28]);
    
        test.equal(start.from(moment([2007, 1, 28]).add({s:44}), true),  "uns segundo", "44 seconds = a few seconds");
        test.equal(start.from(moment([2007, 1, 28]).add({s:45}), true),  "un minuto",      "45 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:89}), true),  "un minuto",      "89 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:90}), true),  "2 minutos",     "90 seconds = 2 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:44}), true),  "44 minutos",    "44 minutes = 44 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:45}), true),  "unha hora",       "45 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:89}), true),  "unha hora",       "89 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:90}), true),  "2 horas",       "90 minutes = 2 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:5}), true),   "5 horas",       "5 hours = 5 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:21}), true),  "21 horas",      "21 hours = 21 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:22}), true),  "un día",         "22 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:35}), true),  "un día",         "35 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:36}), true),  "2 días",        "36 hours = 2 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:1}), true),   "un día",         "1 day = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({d:5}), true),   "5 días",        "5 days = 5 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:25}), true),  "25 días",       "25 days = 25 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:26}), true),  "un mes",       "26 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:30}), true),  "un mes",       "30 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:45}), true),  "un mes",       "45 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:46}), true),  "2 meses",      "46 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:74}), true),  "2 meses",      "75 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:76}), true),  "3 meses",      "76 days = 3 months");
        test.equal(start.from(moment([2007, 1, 28]).add({M:1}), true),   "un mes",       "1 month = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({M:5}), true),   "5 meses",      "5 months = 5 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:344}), true), "11 meses",     "344 days = 11 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:345}), true), "un ano",        "345 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:547}), true), "un ano",        "547 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:548}), true), "2 anos",       "548 days = 2 years");
        test.equal(start.from(moment([2007, 1, 28]).add({y:1}), true),   "un ano",        "1 year = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({y:5}), true),   "5 anos",       "5 years = 5 years");
        test.done();
    },

    "suffix" : function(test) {
        test.expect(2);
        moment.lang('gl');
        test.equal(moment(30000).from(0), "en uns segundo",  "prefix");
        test.equal(moment(0).from(30000), "fai uns segundo", "suffix");
        test.done();
    },

    "now from now" : function(test) {
        test.expect(1);
        moment.lang('gl');
        test.equal(moment().fromNow(), "fai uns segundo",  "now from now should display as in the past");
        test.done();
    },

    "fromNow" : function(test) {
        test.expect(2);
        moment.lang('gl');
        test.equal(moment().add({s:30}).fromNow(), "en uns segundo", "en unos segundos");
        test.equal(moment().add({d:5}).fromNow(), "en 5 días", "en 5 días");
        test.done();
    },

    "calendar day" : function(test) {
        test.expect(7);
        moment.lang('gl');
    
        var a = moment().hours(2).minutes(0).seconds(0);
    
        test.equal(moment(a).calendar(),                         "hoxe ás 2:00",     "today at the same time");
        test.equal(moment(a).add({ m: 25 }).calendar(),          "hoxe ás 2:25",     "Now plus 25 min");
        test.equal(moment(a).add({ h: 1 }).calendar(),           "hoxe ás 3:00",     "Now plus 1 hour");
        test.equal(moment(a).add({ d: 1 }).calendar(),           "mañá ás 2:00",  "tomorrow at the same time");
        test.equal(moment(a).add({ d: 1, h : -1 }).calendar(),   "mañá a 1:00",   "tomorrow minus 1 hour");
        test.equal(moment(a).subtract({ h: 1 }).calendar(),      "hoxe a 1:00",      "Now minus 1 hour");
        test.equal(moment(a).subtract({ d: 1 }).calendar(),      "onte á 2:00",    "yesterday at the same time");
        test.done();
    },

    "calendar next week" : function(test) {
        test.expect(15);
        moment.lang('gl');
    
        var i;
        var m;
    
        for (i = 2; i < 7; i++) {
            m = moment().add({ d: i });
            test.equal(m.calendar(),       m.format('dddd [' + ((m.hours() !== 1) ? 'ás' : 'a') + '] LT'),  "Today + " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('dddd [' + ((m.hours() !== 1) ? 'ás' : 'a') + '] LT'),  "Today + " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('dddd [' + ((m.hours() !== 1) ? 'ás' : 'a') + '] LT'),  "Today + " + i + " days end of day");
        }
        test.done();
    },

    "calendar last week" : function(test) {
        test.expect(15);
        moment.lang('gl');
    
        for (i = 2; i < 7; i++) {
            m = moment().subtract({ d: i });
            test.equal(m.calendar(),       m.format('[o] dddd [pasado ' + ((m.hours() !== 1) ? 'ás' : 'a') + '] LT'),  "Today - " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('[o] dddd [pasado ' + ((m.hours() !== 1) ? 'ás' : 'a') + '] LT'),  "Today - " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('[o] dddd [pasado ' + ((m.hours() !== 1) ? 'ás' : 'a') + '] LT'),  "Today - " + i + " days end of day");
        }
        test.done();
    },

    "calendar all else" : function(test) {
        test.expect(4);
        moment.lang('gl');
        var weeksAgo = moment().subtract({ w: 1 });
        var weeksFromNow = moment().add({ w: 1 });
    
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "1 week ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 1 week");
    
        weeksAgo = moment().subtract({ w: 2 });
        weeksFromNow = moment().add({ w: 2 });
    
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "2 weeks ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 2 weeks");
    test.done();
    }
};var moment = require("../../moment");


    /**************************************************
      Italian
     *************************************************/

exports["lang:it"] = {
    "parse" : function(test) {
        test.expect(96);
        moment.lang('it');
        var tests = 'Gennaio Gen_Febbraio Feb_Marzo Mar_Aprile Apr_Maggio Mag_Giugno Giu_Luglio Lug_Agosto Ago_Settebre Set_Ottobre Ott_Novembre Nov_Dicembre Dic'.split("_");
        var i;
        function equalTest(input, mmm, i) {
            test.equal(moment(input, mmm).month(), i, input + ' should be month ' + (i + 1));
        }
        for (i = 0; i < 12; i++) {
            tests[i] = tests[i].split(' ');
            equalTest(tests[i][0], 'MMM', i);
            equalTest(tests[i][1], 'MMM', i);
            equalTest(tests[i][0], 'MMMM', i);
            equalTest(tests[i][1], 'MMMM', i);
            equalTest(tests[i][0].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][0].toLocaleUpperCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleUpperCase(), 'MMMM', i);
        }
        test.done();
    },

    "format" : function(test) {
        test.expect(18);
        moment.lang('it');
        var a = [
                ['dddd, MMMM Do YYYY, h:mm:ss a',      'Domenica, Febbraio 14º 2010, 3:25:50 pm'],
                ['ddd, hA',                            'Dom, 3PM'],
                ['M Mo MM MMMM MMM',                   '2 2º 02 Febbraio Feb'],
                ['YYYY YY',                            '2010 10'],
                ['D Do DD',                            '14 14º 14'],
                ['d do dddd ddd',                      '0 0º Domenica Dom'],
                ['DDD DDDo DDDD',                      '45 45º 045'],
                ['w wo ww',                            '8 8º 08'],
                ['h hh',                               '3 03'],
                ['H HH',                               '15 15'],
                ['m mm',                               '25 25'],
                ['s ss',                               '50 50'],
                ['a A',                                'pm PM'],
                ['t\\he DDDo \\d\\ay of t\\he ye\\ar', 'the 45º day of the year'],
                ['L',                                  '14/02/2010'],
                ['LL',                                 '14 Febbraio 2010'],
                ['LLL',                                '14 Febbraio 2010 15:25'],
                ['LLLL',                               'Domenica, 14 Febbraio 2010 15:25']
            ],
            b = moment(new Date(2010, 1, 14, 15, 25, 50, 125)),
            i;
        for (i = 0; i < a.length; i++) {
            test.equal(b.format(a[i][0]), a[i][1], a[i][0] + ' ---> ' + a[i][1]);
        }
        test.done();
    },

    "format ordinal" : function(test) {
        test.expect(31);
        moment.lang('it');
        test.equal(moment([2011, 0, 1]).format('DDDo'), '1º', '1º');
        test.equal(moment([2011, 0, 2]).format('DDDo'), '2º', '2º');
        test.equal(moment([2011, 0, 3]).format('DDDo'), '3º', '3º');
        test.equal(moment([2011, 0, 4]).format('DDDo'), '4º', '4º');
        test.equal(moment([2011, 0, 5]).format('DDDo'), '5º', '5º');
        test.equal(moment([2011, 0, 6]).format('DDDo'), '6º', '6º');
        test.equal(moment([2011, 0, 7]).format('DDDo'), '7º', '7º');
        test.equal(moment([2011, 0, 8]).format('DDDo'), '8º', '8º');
        test.equal(moment([2011, 0, 9]).format('DDDo'), '9º', '9º');
        test.equal(moment([2011, 0, 10]).format('DDDo'), '10º', '10º');
    
        test.equal(moment([2011, 0, 11]).format('DDDo'), '11º', '11º');
        test.equal(moment([2011, 0, 12]).format('DDDo'), '12º', '12º');
        test.equal(moment([2011, 0, 13]).format('DDDo'), '13º', '13º');
        test.equal(moment([2011, 0, 14]).format('DDDo'), '14º', '14º');
        test.equal(moment([2011, 0, 15]).format('DDDo'), '15º', '15º');
        test.equal(moment([2011, 0, 16]).format('DDDo'), '16º', '16º');
        test.equal(moment([2011, 0, 17]).format('DDDo'), '17º', '17º');
        test.equal(moment([2011, 0, 18]).format('DDDo'), '18º', '18º');
        test.equal(moment([2011, 0, 19]).format('DDDo'), '19º', '19º');
        test.equal(moment([2011, 0, 20]).format('DDDo'), '20º', '20º');
    
        test.equal(moment([2011, 0, 21]).format('DDDo'), '21º', '21º');
        test.equal(moment([2011, 0, 22]).format('DDDo'), '22º', '22º');
        test.equal(moment([2011, 0, 23]).format('DDDo'), '23º', '23º');
        test.equal(moment([2011, 0, 24]).format('DDDo'), '24º', '24º');
        test.equal(moment([2011, 0, 25]).format('DDDo'), '25º', '25º');
        test.equal(moment([2011, 0, 26]).format('DDDo'), '26º', '26º');
        test.equal(moment([2011, 0, 27]).format('DDDo'), '27º', '27º');
        test.equal(moment([2011, 0, 28]).format('DDDo'), '28º', '28º');
        test.equal(moment([2011, 0, 29]).format('DDDo'), '29º', '29º');
        test.equal(moment([2011, 0, 30]).format('DDDo'), '30º', '30º');
    
        test.equal(moment([2011, 0, 31]).format('DDDo'), '31º', '31º');
        test.done();
    },

    "format month" : function(test) {
        test.expect(12);
        moment.lang('it');
        var expected = 'Gennaio Gen_Febbraio Feb_Marzo Mar_Aprile Apr_Maggio Mag_Giugno Giu_Luglio Lug_Agosto Ago_Settebre Set_Ottobre Ott_Novembre Nov_Dicembre Dic'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, i, 0]).format('MMMM MMM'), expected[i], expected[i]);
        }
        test.done();
    },

    "format week" : function(test) {
        test.expect(7);
        moment.lang('it');
        var expected = 'Domenica Dom_Lunedi Lun_Martedi Mar_Mercoledi Mer_Giovedi Gio_Venerdi Ven_Sabato Sab'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, 0, 2 + i]).format('dddd ddd'), expected[i], expected[i]);
        }
        test.done();
    },

    "from" : function(test) {
        test.expect(30);
        moment.lang('it');
        var start = moment([2007, 1, 28]);
        test.equal(start.from(moment([2007, 1, 28]).add({s:44}), true),  "secondi",    "44 seconds = seconds");
        test.equal(start.from(moment([2007, 1, 28]).add({s:45}), true),  "un minuto",   "45 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:89}), true),  "un minuto",   "89 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:90}), true),  "2 minuti",  "90 seconds = 2 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:44}), true),  "44 minuti", "44 minutes = 44 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:45}), true),  "un ora",    "45 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:89}), true),  "un ora",    "89 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:90}), true),  "2 ore",    "90 minutes = 2 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:5}), true),   "5 ore",    "5 hours = 5 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:21}), true),  "21 ore",   "21 hours = 21 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:22}), true),  "un giorno",      "22 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:35}), true),  "un giorno",      "35 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:36}), true),  "2 giorni",     "36 hours = 2 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:1}), true),   "un giorno",      "1 day = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({d:5}), true),   "5 giorni",     "5 days = 5 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:25}), true),  "25 giorni",    "25 days = 25 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:26}), true),  "un mese",    "26 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:30}), true),  "un mese",    "30 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:45}), true),  "un mese",    "45 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:46}), true),  "2 mesi",   "46 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:74}), true),  "2 mesi",   "75 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:76}), true),  "3 mesi",   "76 days = 3 months");
        test.equal(start.from(moment([2007, 1, 28]).add({M:1}), true),   "un mese",    "1 month = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({M:5}), true),   "5 mesi",   "5 months = 5 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:344}), true), "11 mesi",  "344 days = 11 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:345}), true), "un anno",     "345 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:547}), true), "un anno",     "547 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:548}), true), "2 anni",    "548 days = 2 years");
        test.equal(start.from(moment([2007, 1, 28]).add({y:1}), true),   "un anno",     "1 year = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({y:5}), true),   "5 anni",    "5 years = 5 years");
        test.done();
    },

    "suffix" : function(test) {
        test.expect(2);
        moment.lang('it');
        test.equal(moment(30000).from(0), "in secondi", "prefix");
        test.equal(moment(0).from(30000), "secondi fa", "suffix");
        test.done();
    },

    "fromNow" : function(test) {
        test.expect(2);
        moment.lang('it');
        test.equal(moment().add({s:30}).fromNow(), "in secondi", "in seconds");
        test.equal(moment().add({d:5}).fromNow(), "in 5 giorni", "in 5 days");
        test.done();
    },

    "calendar day" : function(test) {
        test.expect(6);
        moment.lang('it');
    
        var a = moment().hours(2).minutes(0).seconds(0);
    
        test.equal(moment(a).calendar(),                     "Oggi alle 02:00",     "today at the same time");
        test.equal(moment(a).add({ m: 25 }).calendar(),      "Oggi alle 02:25",     "Now plus 25 min");
        test.equal(moment(a).add({ h: 1 }).calendar(),       "Oggi alle 03:00",     "Now plus 1 hour");
        test.equal(moment(a).add({ d: 1 }).calendar(),       "Domani alle 02:00",   "tomorrow at the same time");
        test.equal(moment(a).subtract({ h: 1 }).calendar(),  "Oggi alle 01:00",     "Now minus 1 hour");
        test.equal(moment(a).subtract({ d: 1 }).calendar(),  "Ieri alle 02:00",     "yesterday at the same time");
        test.done();
    },

    "calendar next week" : function(test) {
        test.expect(15);
        moment.lang('it');
    
        var i;
        var m;
    
        for (i = 2; i < 7; i++) {
            m = moment().add({ d: i });
            test.equal(m.calendar(),       m.format('dddd [alle] LT'),  "Today + " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('dddd [alle] LT'),  "Today + " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('dddd [alle] LT'),  "Today + " + i + " days end of day");
        }
        test.done();
    },

    "calendar last week" : function(test) {
        test.expect(15);
        moment.lang('it');
    
        for (i = 2; i < 7; i++) {
            m = moment().subtract({ d: i });
            test.equal(m.calendar(),       m.format('[lo scorso] dddd [alle] LT'),  "Today - " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('[lo scorso] dddd [alle] LT'),  "Today - " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('[lo scorso] dddd [alle] LT'),  "Today - " + i + " days end of day");
        }
        test.done();
    },

    "calendar all else" : function(test) {
        test.expect(4);
        moment.lang('it');
        var weeksAgo = moment().subtract({ w: 1 });
        var weeksFromNow = moment().add({ w: 1 });
        
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "1 week ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 1 week");
    
        weeksAgo = moment().subtract({ w: 2 });
        weeksFromNow = moment().add({ w: 2 });
        
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "2 weeks ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 2 weeks");
    test.done();
    }
};var moment = require("../../moment");


    /**************************************************
      Korean
     *************************************************/

exports["lang:kr"] = {
    "format" : function(test) {
        test.expect(18);
        moment.lang('kr');
        var a = [
                ['YYYY년 MMMM Do dddd a h:mm:ss',      '2010년 2월 14일 일요일 오후 3:25:50'],
                ['ddd A h',                            '일 오후 3'],
                ['M Mo MM MMMM MMM',                   '2 2일 02 2월 2월'],
                ['YYYY YY',                            '2010 10'],
                ['D Do DD',                            '14 14일 14'],
                ['d do dddd ddd',                      '0 0일 일요일 일'],
                ['DDD DDDo DDDD',                      '45 45일 045'],
                ['w wo ww',                            '8 8일 08'],
                ['h hh',                               '3 03'],
                ['H HH',                               '15 15'],
                ['m mm',                               '25 25'],
                ['s ss',                               '50 50'],
                ['a A',                                '오후 오후'],
                ['일년 중 DDDo째 되는 날', '일년 중 45일째 되는 날'],
                ['L',                                  '2010.02.14'],
                ['LL',                                 '2010년 2월 14일'],
                ['LLL',                                '2010년 2월 14일 오후 3시 25분'],
                ['LLLL',                               '2010년 2월 14일 일요일 오후 3시 25분']
            ],
            b = moment(new Date(2010, 1, 14, 15, 25, 50, 125)),
            i;
        for (i = 0; i < a.length; i++) {
            test.equal(b.format(a[i][0]), a[i][1], a[i][0] + ' ---> ' + a[i][1]);
        }
        test.done();
    },

    "format ordinal" : function(test) {
        test.expect(31);
        moment.lang('kr');
        test.equal(moment([2011, 0, 1]).format('DDDo'), '1일', '1일');
        test.equal(moment([2011, 0, 2]).format('DDDo'), '2일', '2일');
        test.equal(moment([2011, 0, 3]).format('DDDo'), '3일', '3일');
        test.equal(moment([2011, 0, 4]).format('DDDo'), '4일', '4일');
        test.equal(moment([2011, 0, 5]).format('DDDo'), '5일', '5일');
        test.equal(moment([2011, 0, 6]).format('DDDo'), '6일', '6일');
        test.equal(moment([2011, 0, 7]).format('DDDo'), '7일', '7일');
        test.equal(moment([2011, 0, 8]).format('DDDo'), '8일', '8일');
        test.equal(moment([2011, 0, 9]).format('DDDo'), '9일', '9일');
        test.equal(moment([2011, 0, 10]).format('DDDo'), '10일', '10일');
    
        test.equal(moment([2011, 0, 11]).format('DDDo'), '11일', '11일');
        test.equal(moment([2011, 0, 12]).format('DDDo'), '12일', '12일');
        test.equal(moment([2011, 0, 13]).format('DDDo'), '13일', '13일');
        test.equal(moment([2011, 0, 14]).format('DDDo'), '14일', '14일');
        test.equal(moment([2011, 0, 15]).format('DDDo'), '15일', '15일');
        test.equal(moment([2011, 0, 16]).format('DDDo'), '16일', '16일');
        test.equal(moment([2011, 0, 17]).format('DDDo'), '17일', '17일');
        test.equal(moment([2011, 0, 18]).format('DDDo'), '18일', '18일');
        test.equal(moment([2011, 0, 19]).format('DDDo'), '19일', '19일');
        test.equal(moment([2011, 0, 20]).format('DDDo'), '20일', '20일');
    
        test.equal(moment([2011, 0, 21]).format('DDDo'), '21일', '21일');
        test.equal(moment([2011, 0, 22]).format('DDDo'), '22일', '22일');
        test.equal(moment([2011, 0, 23]).format('DDDo'), '23일', '23일');
        test.equal(moment([2011, 0, 24]).format('DDDo'), '24일', '24일');
        test.equal(moment([2011, 0, 25]).format('DDDo'), '25일', '25일');
        test.equal(moment([2011, 0, 26]).format('DDDo'), '26일', '26일');
        test.equal(moment([2011, 0, 27]).format('DDDo'), '27일', '27일');
        test.equal(moment([2011, 0, 28]).format('DDDo'), '28일', '28일');
        test.equal(moment([2011, 0, 29]).format('DDDo'), '29일', '29일');
        test.equal(moment([2011, 0, 30]).format('DDDo'), '30일', '30일');
    
        test.equal(moment([2011, 0, 31]).format('DDDo'), '31일', '31일');
        test.done();
    },

    "format month" : function(test) {
        test.expect(12);
        moment.lang('kr');
        var expected = '1월 1월_2월 2월_3월 3월_4월 4월_5월 5월_6월 6월_7월 7월_8월 8월_9월 9월_10월 10월_11월 11월_12월 12월'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, i, 0]).format('MMMM MMM'), expected[i], expected[i]);
        }
        test.done();
    },

    "format week" : function(test) {
        test.expect(7);
        moment.lang('kr');
        var expected = '일요일 일_월요일 월_화요일 화_수요일 수_목요일 목_금요일 금_토요일 토'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, 0, 2 + i]).format('dddd ddd'), expected[i], expected[i]);
        }
        test.done();
    },

    "from" : function(test) {
        test.expect(30);
        moment.lang('kr');
        var start = moment([2007, 1, 28]);
        test.equal(start.from(moment([2007, 1, 28]).add({s:44}), true),  "몇초", "44초 = 몇초");
        test.equal(start.from(moment([2007, 1, 28]).add({s:45}), true),  "일분",      "45초 = 일분");
        test.equal(start.from(moment([2007, 1, 28]).add({s:89}), true),  "일분",      "89초 = 일분");
        test.equal(start.from(moment([2007, 1, 28]).add({s:90}), true),  "2분",     "90초 = 2분");
        test.equal(start.from(moment([2007, 1, 28]).add({m:44}), true),  "44분",    "44분 = 44분");
        test.equal(start.from(moment([2007, 1, 28]).add({m:45}), true),  "한시간",       "45분 = 한시간");
        test.equal(start.from(moment([2007, 1, 28]).add({m:89}), true),  "한시간",       "89분 = 한시간");
        test.equal(start.from(moment([2007, 1, 28]).add({m:90}), true),  "2시간",       "90분 = 2시간");
        test.equal(start.from(moment([2007, 1, 28]).add({h:5}), true),   "5시간",       "5시간 = 5시간");
        test.equal(start.from(moment([2007, 1, 28]).add({h:21}), true),  "21시간",      "21시간 = 21시간");
        test.equal(start.from(moment([2007, 1, 28]).add({h:22}), true),  "하루",         "22시간 = 하루");
        test.equal(start.from(moment([2007, 1, 28]).add({h:35}), true),  "하루",         "35시간 = 하루");
        test.equal(start.from(moment([2007, 1, 28]).add({h:36}), true),  "2일",        "36시간 = 2일");
        test.equal(start.from(moment([2007, 1, 28]).add({d:1}), true),   "하루",         "하루 = 하루");
        test.equal(start.from(moment([2007, 1, 28]).add({d:5}), true),   "5일",        "5일 = 5일");
        test.equal(start.from(moment([2007, 1, 28]).add({d:25}), true),  "25일",       "25일 = 25일");
        test.equal(start.from(moment([2007, 1, 28]).add({d:26}), true),  "한달",       "26일 = 한달");
        test.equal(start.from(moment([2007, 1, 28]).add({d:30}), true),  "한달",       "30일 = 한달");
        test.equal(start.from(moment([2007, 1, 28]).add({d:45}), true),  "한달",       "45일 = 한달");
        test.equal(start.from(moment([2007, 1, 28]).add({d:46}), true),  "2달",      "46일 = 2달");
        test.equal(start.from(moment([2007, 1, 28]).add({d:74}), true),  "2달",      "75일 = 2달");
        test.equal(start.from(moment([2007, 1, 28]).add({d:76}), true),  "3달",      "76일 = 3달");
        test.equal(start.from(moment([2007, 1, 28]).add({M:1}), true),   "한달",       "1달 = 한달");
        test.equal(start.from(moment([2007, 1, 28]).add({M:5}), true),   "5달",      "5달 = 5달");
        test.equal(start.from(moment([2007, 1, 28]).add({d:344}), true), "11달",     "344일 = 11달");
        test.equal(start.from(moment([2007, 1, 28]).add({d:345}), true), "일년",        "345일 = 일년");
        test.equal(start.from(moment([2007, 1, 28]).add({d:547}), true), "일년",        "547일 = 일년");
        test.equal(start.from(moment([2007, 1, 28]).add({d:548}), true), "2년",       "548일 = 2년");
        test.equal(start.from(moment([2007, 1, 28]).add({y:1}), true),   "일년",        "일년 = 일년");
        test.equal(start.from(moment([2007, 1, 28]).add({y:5}), true),   "5년",       "5년 = 5년");
        test.done();
    },

    "suffix" : function(test) {
        test.expect(2);
        moment.lang('kr');
        test.equal(moment(30000).from(0), "몇초 후",  "prefix");
        test.equal(moment(0).from(30000), "몇초 전", "suffix");
        test.done();
    },

    "now from now" : function(test) {
        test.expect(1);
        moment.lang('kr');
        test.equal(moment().fromNow(), "몇초 전",  "now from now should display as in the past");
        test.done();
    },

    "fromNow" : function(test) {
        test.expect(2);
        moment.lang('kr');
        test.equal(moment().add({s:30}).fromNow(), "몇초 후", "in a few seconds");
        test.equal(moment().add({d:5}).fromNow(), "5일 후", "in 5 days");
        test.done();
    },

    "calendar day" : function(test) {
        test.expect(6);
        moment.lang('kr');
    
        var a = moment().hours(2).minutes(0).seconds(0);
    
        test.equal(moment(a).calendar(),                     "오늘 오전 2시 00분",     "today at the same time");
        test.equal(moment(a).add({ m: 25 }).calendar(),      "오늘 오전 2시 25분",     "Now plus 25 min");
        test.equal(moment(a).add({ h: 1 }).calendar(),       "오늘 오전 3시 00분",     "Now plus 1 hour");
        test.equal(moment(a).add({ d: 1 }).calendar(),       "내일 오전 2시 00분",     "tomorrow at the same time");
        test.equal(moment(a).subtract({ h: 1 }).calendar(),  "오늘 오전 1시 00분",     "Now minus 1 hour");
        test.equal(moment(a).subtract({ d: 1 }).calendar(),  "어제 오전 2시 00분",     "yesterday at the same time");
        test.done();
    },

    "calendar next week" : function(test) {
        test.expect(15);
        moment.lang('kr');
    
        var i;
        var m;
    
        for (i = 2; i < 7; i++) {
            m = moment().add({ d: i });
            test.equal(m.calendar(),       m.format('dddd LT'),  "Today + " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('dddd LT'),  "Today + " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('dddd LT'),  "Today + " + i + " days end of day");
        }
        test.done();
    },

    "calendar last week" : function(test) {
        test.expect(15);
        moment.lang('kr');
    
        for (i = 2; i < 7; i++) {
            m = moment().subtract({ d: i });
            test.equal(m.calendar(),       m.format('지난주 dddd LT'),  "Today - " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('지난주 dddd LT'),  "Today - " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('지난주 dddd LT'),  "Today - " + i + " days end of day");
        }
        test.done();
    },

    "calendar all else" : function(test) {
        test.expect(4);
        moment.lang('kr');
        var weeksAgo = moment().subtract({ w: 1 });
        var weeksFromNow = moment().add({ w: 1 });
        
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "1 week ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 1 week");
    
        weeksAgo = moment().subtract({ w: 2 });
        weeksFromNow = moment().add({ w: 2 });
        
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "2 weeks ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 2 weeks");
    test.done();
    }
};var moment = require("../../moment");


    /**************************************************
      Norwegian bokmål
     *************************************************/

exports["lang:nb"] = {
    "parse" : function(test) {
        test.expect(96);
        moment.lang('nb');
        var tests = 'januar jan_februar feb_mars mar_april apr_mai mai_juni jun_juli jul_august aug_september sep_oktober okt_november nov_desember des'.split("_");
        var i;
        function equalTest(input, mmm, i) {
            test.equal(moment(input, mmm).month(), i, input + ' should be month ' + (i + 1));
        }
        for (i = 0; i < 12; i++) {
            tests[i] = tests[i].split(' ');
            equalTest(tests[i][0], 'MMM', i);
            equalTest(tests[i][1], 'MMM', i);
            equalTest(tests[i][0], 'MMMM', i);
            equalTest(tests[i][1], 'MMMM', i);
            equalTest(tests[i][0].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][0].toLocaleUpperCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleUpperCase(), 'MMMM', i);
        }
        test.done();
    },

    "format" : function(test) {
        test.expect(18);
        moment.lang('nb');
        var a = [
                ['dddd, MMMM Do YYYY, h:mm:ss a',      'søndag, februar 14. 2010, 3:25:50 pm'],
                ['ddd, hA',                            'søn, 3PM'],
                ['M Mo MM MMMM MMM',                   '2 2. 02 februar feb'],
                ['YYYY YY',                            '2010 10'],
                ['D Do DD',                            '14 14. 14'],
                ['d do dddd ddd',                      '0 0. søndag søn'],
                ['DDD DDDo DDDD',                      '45 45. 045'],
                ['w wo ww',                            '8 8. 08'],
                ['h hh',                               '3 03'],
                ['H HH',                               '15 15'],
                ['m mm',                               '25 25'],
                ['s ss',                               '50 50'],
                ['a A',                                'pm PM'],
                ['t\\he DDDo \\d\\ay of t\\he ye\\ar', 'the 45. day of the year'],
                ['L',                                  '2010-02-14'],
                ['LL',                                 '14 februar 2010'],
                ['LLL',                                '14 februar 2010 15:25'],
                ['LLLL',                               'søndag 14 februar 2010 15:25']
            ],
            b = moment(new Date(2010, 1, 14, 15, 25, 50, 125)),
            i;
        for (i = 0; i < a.length; i++) {
            test.equal(b.format(a[i][0]), a[i][1], a[i][0] + ' ---> ' + a[i][1]);
        }
        test.done();
    },

    "format ordinal" : function(test) {
        test.expect(31);
        moment.lang('nb');
        test.equal(moment([2011, 0, 1]).format('DDDo'), '1.', '1.');
        test.equal(moment([2011, 0, 2]).format('DDDo'), '2.', '2.');
        test.equal(moment([2011, 0, 3]).format('DDDo'), '3.', '3.');
        test.equal(moment([2011, 0, 4]).format('DDDo'), '4.', '4.');
        test.equal(moment([2011, 0, 5]).format('DDDo'), '5.', '5.');
        test.equal(moment([2011, 0, 6]).format('DDDo'), '6.', '6.');
        test.equal(moment([2011, 0, 7]).format('DDDo'), '7.', '7.');
        test.equal(moment([2011, 0, 8]).format('DDDo'), '8.', '8.');
        test.equal(moment([2011, 0, 9]).format('DDDo'), '9.', '9.');
        test.equal(moment([2011, 0, 10]).format('DDDo'), '10.', '10.');
    
        test.equal(moment([2011, 0, 11]).format('DDDo'), '11.', '11.');
        test.equal(moment([2011, 0, 12]).format('DDDo'), '12.', '12.');
        test.equal(moment([2011, 0, 13]).format('DDDo'), '13.', '13.');
        test.equal(moment([2011, 0, 14]).format('DDDo'), '14.', '14.');
        test.equal(moment([2011, 0, 15]).format('DDDo'), '15.', '15.');
        test.equal(moment([2011, 0, 16]).format('DDDo'), '16.', '16.');
        test.equal(moment([2011, 0, 17]).format('DDDo'), '17.', '17.');
        test.equal(moment([2011, 0, 18]).format('DDDo'), '18.', '18.');
        test.equal(moment([2011, 0, 19]).format('DDDo'), '19.', '19.');
        test.equal(moment([2011, 0, 20]).format('DDDo'), '20.', '20.');
    
        test.equal(moment([2011, 0, 21]).format('DDDo'), '21.', '21.');
        test.equal(moment([2011, 0, 22]).format('DDDo'), '22.', '22.');
        test.equal(moment([2011, 0, 23]).format('DDDo'), '23.', '23.');
        test.equal(moment([2011, 0, 24]).format('DDDo'), '24.', '24.');
        test.equal(moment([2011, 0, 25]).format('DDDo'), '25.', '25.');
        test.equal(moment([2011, 0, 26]).format('DDDo'), '26.', '26.');
        test.equal(moment([2011, 0, 27]).format('DDDo'), '27.', '27.');
        test.equal(moment([2011, 0, 28]).format('DDDo'), '28.', '28.');
        test.equal(moment([2011, 0, 29]).format('DDDo'), '29.', '29.');
        test.equal(moment([2011, 0, 30]).format('DDDo'), '30.', '30.');
    
        test.equal(moment([2011, 0, 31]).format('DDDo'), '31.', '31.');
        test.done();
    },

    "format month" : function(test) {
        test.expect(12);
        moment.lang('nb');
    	var expected = 'januar jan_februar feb_mars mar_april apr_mai mai_juni jun_juli jul_august aug_september sep_oktober okt_november nov_desember des'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, i, 0]).format('MMMM MMM'), expected[i], expected[i]);
        }
        test.done();
    },

    "format week" : function(test) {
        test.expect(7);
        moment.lang('nb');
        var expected = 'søndag søn_mandag man_tirsdag tir_onsdag ons_torsdag tor_fredag fre_lørdag lør'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, 0, 2 + i]).format('dddd ddd'), expected[i], expected[i]);
        }
        test.done();
    },

    "from" : function(test) {
        test.expect(30);
        moment.lang('nb');
        var start = moment([2007, 1, 28]);
        test.equal(start.from(moment([2007, 1, 28]).add({s:44}), true),  "noen sekunder", "44 sekunder = a few seconds");
        test.equal(start.from(moment([2007, 1, 28]).add({s:45}), true),  "ett minutt",      "45 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:89}), true),  "ett minutt",      "89 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:90}), true),  "2 minutter",     "90 seconds = 2 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:44}), true),  "44 minutter",    "44 minutes = 44 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:45}), true),  "en time",       "45 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:89}), true),  "en time",       "89 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:90}), true),  "2 timer",       "90 minutes = 2 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:5}), true),   "5 timer",       "5 hours = 5 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:21}), true),  "21 timer",      "21 hours = 21 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:22}), true),  "en dag",         "22 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:35}), true),  "en dag",         "35 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:36}), true),  "2 dager",        "36 hours = 2 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:1}), true),   "en dag",         "1 day = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({d:5}), true),   "5 dager",        "5 days = 5 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:25}), true),  "25 dager",       "25 days = 25 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:26}), true),  "en måned",       "26 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:30}), true),  "en måned",       "30 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:45}), true),  "en måned",       "45 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:46}), true),  "2 måneder",      "46 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:74}), true),  "2 måneder",      "75 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:76}), true),  "3 måneder",      "76 days = 3 months");
        test.equal(start.from(moment([2007, 1, 28]).add({M:1}), true),   "en måned",       "1 month = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({M:5}), true),   "5 måneder",      "5 months = 5 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:344}), true), "11 måneder",     "344 days = 11 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:345}), true), "ett år",        "345 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:547}), true), "ett år",        "547 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:548}), true), "2 år",       "548 days = 2 years");
        test.equal(start.from(moment([2007, 1, 28]).add({y:1}), true),   "ett år",        "1 year = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({y:5}), true),   "5 år",       "5 years = 5 years");
        test.done();
    },

    "suffix" : function(test) {
        test.expect(2);
        moment.lang('nb');
        test.equal(moment(30000).from(0), "om noen sekunder",  "prefix");
        test.equal(moment(0).from(30000), "for noen sekunder siden", "suffix");
        test.done();
    },

    "now from now" : function(test) {
        test.expect(1);
        moment.lang('nb');
        test.equal(moment().fromNow(), "for noen sekunder siden",  "now from now should display as in the past");
        test.done();
    },

    "fromNow" : function(test) {
        test.expect(2);
        moment.lang('nb');
        test.equal(moment().add({s:30}).fromNow(), "om noen sekunder", "in a few seconds");
        test.equal(moment().add({d:5}).fromNow(), "om 5 dager", "in 5 days");
        test.done();
    },

    "calendar day" : function(test) {
        test.expect(6);
        moment.lang('nb');
    
        var a = moment().hours(2).minutes(0).seconds(0);
    
        test.equal(moment(a).calendar(),                     "I dag klokken 02:00",     "today at the same time");
        test.equal(moment(a).add({ m: 25 }).calendar(),      "I dag klokken 02:25",     "Now plus 25 min");
        test.equal(moment(a).add({ h: 1 }).calendar(),       "I dag klokken 03:00",     "Now plus 1 hour");
        test.equal(moment(a).add({ d: 1 }).calendar(),       "I morgen klokken 02:00",  "tomorrow at the same time");
        test.equal(moment(a).subtract({ h: 1 }).calendar(),  "I dag klokken 01:00",     "Now minus 1 hour");
        test.equal(moment(a).subtract({ d: 1 }).calendar(),  "I går klokken 02:00",     "yesterday at the same time");
        test.done();
    },

    "calendar next week" : function(test) {
        test.expect(15);
        moment.lang('nb');
    
        var i;
        var m;
    
        for (i = 2; i < 7; i++) {
            m = moment().add({ d: i });
            test.equal(m.calendar(),       m.format('dddd [klokken] LT'),  "Today + " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('dddd [klokken] LT'),  "Today + " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('dddd [klokken] LT'),  "Today + " + i + " days end of day");
        }
        test.done();
    },

    "calendar last week" : function(test) {
        test.expect(15);
        moment.lang('nb');
    
        for (i = 2; i < 7; i++) {
            m = moment().subtract({ d: i });
            test.equal(m.calendar(),       m.format('[Forrige] dddd [klokken] LT'),  "Today - " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('[Forrige] dddd [klokken] LT'),  "Today - " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('[Forrige] dddd [klokken] LT'),  "Today - " + i + " days end of day");
        }
        test.done();
    },

    "calendar all else" : function(test) {
        test.expect(4);
        moment.lang('nb');
        var weeksAgo = moment().subtract({ w: 1 });
        var weeksFromNow = moment().add({ w: 1 });
        
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "1 week ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 1 week");
    
        weeksAgo = moment().subtract({ w: 2 });
        weeksFromNow = moment().add({ w: 2 });
        
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "2 weeks ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 2 weeks");
    test.done();
    }
};var moment = require("../../moment");


    /**************************************************
      Dutch
     *************************************************/

exports["lang:nl"] = {
    "parse" : function(test) {
        test.expect(96);
        moment.lang('nl');
        var tests = 'januari jan._februari feb._maart mar._april apr._mei mei._juni jun._juli jul._augustus aug._september sep._oktober okt._november nov._december dec.'.split("_");
        var i;
        function equalTest(input, mmm, i) {
            test.equal(moment(input, mmm).month(), i, input + ' should be month ' + (i + 1));
        }
        for (i = 0; i < 12; i++) {
            tests[i] = tests[i].split(' ');
            equalTest(tests[i][0], 'MMM', i);
            equalTest(tests[i][1], 'MMM', i);
            equalTest(tests[i][0], 'MMMM', i);
            equalTest(tests[i][1], 'MMMM', i);
            equalTest(tests[i][0].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][0].toLocaleUpperCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleUpperCase(), 'MMMM', i);
        }
        test.done();
    },

    "format" : function(test) {
        test.expect(18);
        moment.lang('nl');
        var a = [
                ['dddd, MMMM Do YYYY, HH:mm:ss',       'zondag, februari 14de 2010, 15:25:50'],
                ['ddd, HH',                            'zo., 15'],
                ['M Mo MM MMMM MMM',                   '2 2de 02 februari feb.'],
                ['YYYY YY',                            '2010 10'],
                ['D Do DD',                            '14 14de 14'],
                ['d do dddd ddd',                      '0 0de zondag zo.'],
                ['DDD DDDo DDDD',                      '45 45ste 045'],
                ['w wo ww',                            '8 8ste 08'],
                ['h hh',                               '3 03'],
                ['H HH',                               '15 15'],
                ['m mm',                               '25 25'],
                ['s ss',                               '50 50'],
                ['a A',                                'pm PM'],
                ['t\\he DDDo \\d\\ay of t\\he ye\\ar', 'the 45ste day of the year'],
                ['L',                                  '14-02-2010'],
                ['LL',                                 '14 februari 2010'],
                ['LLL',                                '14 februari 2010 15:25'],
                ['LLLL',                               'zondag 14 februari 2010 15:25']
            ],
            b = moment(new Date(2010, 1, 14, 15, 25, 50, 125)),
            i;
        for (i = 0; i < a.length; i++) {
            test.equal(b.format(a[i][0]), a[i][1], a[i][0] + ' ---> ' + a[i][1]);
        }
        test.done();
    },

    "format ordinal" : function(test) {
        test.expect(31);
        moment.lang('nl');
        test.equal(moment([2011, 0, 1]).format('DDDo'), '1ste', '1ste');
        test.equal(moment([2011, 0, 2]).format('DDDo'), '2de', '2de');
        test.equal(moment([2011, 0, 3]).format('DDDo'), '3de', '3de');
        test.equal(moment([2011, 0, 4]).format('DDDo'), '4de', '4de');
        test.equal(moment([2011, 0, 5]).format('DDDo'), '5de', '5de');
        test.equal(moment([2011, 0, 6]).format('DDDo'), '6de', '6de');
        test.equal(moment([2011, 0, 7]).format('DDDo'), '7de', '7de');
        test.equal(moment([2011, 0, 8]).format('DDDo'), '8ste', '8ste');
        test.equal(moment([2011, 0, 9]).format('DDDo'), '9de', '9de');
        test.equal(moment([2011, 0, 10]).format('DDDo'), '10de', '10de');
    
        test.equal(moment([2011, 0, 11]).format('DDDo'), '11de', '11de');
        test.equal(moment([2011, 0, 12]).format('DDDo'), '12de', '12de');
        test.equal(moment([2011, 0, 13]).format('DDDo'), '13de', '13de');
        test.equal(moment([2011, 0, 14]).format('DDDo'), '14de', '14de');
        test.equal(moment([2011, 0, 15]).format('DDDo'), '15de', '15de');
        test.equal(moment([2011, 0, 16]).format('DDDo'), '16de', '16de');
        test.equal(moment([2011, 0, 17]).format('DDDo'), '17de', '17de');
        test.equal(moment([2011, 0, 18]).format('DDDo'), '18de', '18de');
        test.equal(moment([2011, 0, 19]).format('DDDo'), '19de', '19de');
        test.equal(moment([2011, 0, 20]).format('DDDo'), '20ste', '20ste');
    
        test.equal(moment([2011, 0, 21]).format('DDDo'), '21ste', '21ste');
        test.equal(moment([2011, 0, 22]).format('DDDo'), '22ste', '22ste');
        test.equal(moment([2011, 0, 23]).format('DDDo'), '23ste', '23ste');
        test.equal(moment([2011, 0, 24]).format('DDDo'), '24ste', '24ste');
        test.equal(moment([2011, 0, 25]).format('DDDo'), '25ste', '25ste');
        test.equal(moment([2011, 0, 26]).format('DDDo'), '26ste', '26ste');
        test.equal(moment([2011, 0, 27]).format('DDDo'), '27ste', '27ste');
        test.equal(moment([2011, 0, 28]).format('DDDo'), '28ste', '28ste');
        test.equal(moment([2011, 0, 29]).format('DDDo'), '29ste', '29ste');
        test.equal(moment([2011, 0, 30]).format('DDDo'), '30ste', '30ste');
    
        test.equal(moment([2011, 0, 31]).format('DDDo'), '31ste', '31ste');
        test.done();
    },

    "format month" : function(test) {
        test.expect(12);
        moment.lang('nl');
        var expected = 'januari jan._februari feb._maart mar._april apr._mei mei._juni jun._juli jul._augustus aug._september sep._oktober okt._november nov._december dec.'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, i, 0]).format('MMMM MMM'), expected[i], expected[i]);
        }
        test.done();
    },

    "format week" : function(test) {
        test.expect(7);
        moment.lang('nl');
        var expected = 'zondag zo._maandag ma._dinsdag di._woensdag wo._donderdag do._vrijdag vr._zaterdag za.'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, 0, 2 + i]).format('dddd ddd'), expected[i], expected[i]);
        }
        test.done();
    },

    "from" : function(test) {
        test.expect(30);
        moment.lang('nl');
        var start = moment([2007, 1, 28]);
        test.equal(start.from(moment([2007, 1, 28]).add({s:44}), true),  "een paar seconden", "44 seconds = a few seconds");
        test.equal(start.from(moment([2007, 1, 28]).add({s:45}), true),  "één minuut",      "45 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:89}), true),  "één minuut",      "89 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:90}), true),  "2 minuten",     "90 seconds = 2 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:44}), true),  "44 minuten",    "44 minutes = 44 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:45}), true),  "één uur",       "45 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:89}), true),  "één uur",       "89 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:90}), true),  "2 uur",       "90 minutes = 2 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:5}), true),   "5 uur",       "5 hours = 5 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:21}), true),  "21 uur",      "21 hours = 21 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:22}), true),  "één dag",         "22 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:35}), true),  "één dag",         "35 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:36}), true),  "2 dagen",        "36 hours = 2 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:1}), true),   "één dag",         "1 day = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({d:5}), true),   "5 dagen",        "5 days = 5 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:25}), true),  "25 dagen",       "25 days = 25 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:26}), true),  "één maand",       "26 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:30}), true),  "één maand",       "30 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:45}), true),  "één maand",       "45 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:46}), true),  "2 maanden",      "46 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:74}), true),  "2 maanden",      "75 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:76}), true),  "3 maanden",      "76 days = 3 months");
        test.equal(start.from(moment([2007, 1, 28]).add({M:1}), true),   "één maand",       "1 month = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({M:5}), true),   "5 maanden",      "5 months = 5 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:344}), true), "11 maanden",     "344 days = 11 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:345}), true), "één jaar",        "345 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:547}), true), "één jaar",        "547 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:548}), true), "2 jaar",       "548 days = 2 years");
        test.equal(start.from(moment([2007, 1, 28]).add({y:1}), true),   "één jaar",        "1 year = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({y:5}), true),   "5 jaar",       "5 years = 5 years");
        test.done();
    },

    "suffix" : function(test) {
        test.expect(2);
        moment.lang('nl');
        test.equal(moment(30000).from(0), "over een paar seconden",  "prefix");
        test.equal(moment(0).from(30000), "een paar seconden geleden", "suffix");
        test.done();
    },

    "now from now" : function(test) {
        test.expect(1);
        moment.lang('nl');
        test.equal(moment().fromNow(), "een paar seconden geleden",  "now from now should display as in the past");
        test.done();
    },

    "fromNow" : function(test) {
        test.expect(2);
        moment.lang('nl');
        test.equal(moment().add({s:30}).fromNow(), "over een paar seconden", "in a few seconds");
        test.equal(moment().add({d:5}).fromNow(), "over 5 dagen", "in 5 days");
        test.done();
    },

    "calendar day" : function(test) {
        test.expect(6);
        moment.lang('nl');
    
        var a = moment().hours(2).minutes(0).seconds(0);
    
        test.equal(moment(a).calendar(),                     "Vandaag om 02:00",     "today at the same time");
        test.equal(moment(a).add({ m: 25 }).calendar(),      "Vandaag om 02:25",     "Now plus 25 min");
        test.equal(moment(a).add({ h: 1 }).calendar(),       "Vandaag om 03:00",     "Now plus 1 hour");
        test.equal(moment(a).add({ d: 1 }).calendar(),       "Morgen om 02:00",    "tomorrow at the same time");
        test.equal(moment(a).subtract({ h: 1 }).calendar(),  "Vandaag om 01:00",     "Now minus 1 hour");
        test.equal(moment(a).subtract({ d: 1 }).calendar(),  "Gisteren om 02:00",   "yesterday at the same time");
        test.done();
    },

    "calendar next week" : function(test) {
        test.expect(15);
        moment.lang('nl');
    
        var i;
        var m;
    
        for (i = 2; i < 7; i++) {
            m = moment().add({ d: i });
            test.equal(m.calendar(),       m.format('dddd [om] LT'),  "Today + " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('dddd [om] LT'),  "Today + " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('dddd [om] LT'),  "Today + " + i + " days end of day");
        }
        test.done();
    },

    "calendar last week" : function(test) {
        test.expect(15);
        moment.lang('nl');
    
        for (i = 2; i < 7; i++) {
            m = moment().subtract({ d: i });
            test.equal(m.calendar(),       m.format('[afgelopen] dddd [om] LT'),  "Today - " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('[afgelopen] dddd [om] LT'),  "Today - " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('[afgelopen] dddd [om] LT'),  "Today - " + i + " days end of day");
        }
        test.done();
    },

    "calendar all else" : function(test) {
        test.expect(4);
        moment.lang('nl');
        var weeksAgo = moment().subtract({ w: 1 });
        var weeksFromNow = moment().add({ w: 1 });
        
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "1 week ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 1 week");
    
        weeksAgo = moment().subtract({ w: 2 });
        weeksFromNow = moment().add({ w: 2 });
        
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "2 weeks ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 2 weeks");
    test.done();
    }
};var moment = require("../../moment");


    /**************************************************
      Polish
     *************************************************/

exports["lang:pl"] = {
    "parse" : function(test) {
        test.expect(96);
        moment.lang('pl');
        var tests = 'styczeń sty_luty lut_marzec mar_kwiecień kwi_maj maj_czerwiec cze_lipiec lip_sierpień sie_wrzesień wrz_październik paź_listopad lis_grudzień gru'.split("_");
        var i;
        function equalTest(input, mmm, i) {
            test.equal(moment(input, mmm).month(), i, input + ' should be month ' + (i + 1));
        }
        for (i = 0; i < 12; i++) {
            tests[i] = tests[i].split(' ');
            equalTest(tests[i][0], 'MMM', i);
            equalTest(tests[i][1], 'MMM', i);
            equalTest(tests[i][0], 'MMMM', i);
            equalTest(tests[i][1], 'MMMM', i);
            equalTest(tests[i][0].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][0].toLocaleUpperCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleUpperCase(), 'MMMM', i);
        }
        test.done();
    },

    "format" : function(test) {
        test.expect(18);
        moment.lang('pl');
        var a = [
                ['dddd, MMMM Do YYYY, h:mm:ss a',      'niedziela, luty 14. 2010, 3:25:50 pm'],
                ['ddd, hA',                            'nie, 3PM'],
                ['M Mo MM MMMM MMM',                   '2 2. 02 luty lut'],
                ['YYYY YY',                            '2010 10'],
                ['D Do DD',                            '14 14. 14'],
                ['d do dddd ddd',                      '0 0. niedziela nie'],
                ['DDD DDDo DDDD',                      '45 45. 045'],
                ['w wo ww',                            '8 8. 08'],
                ['h hh',                               '3 03'],
                ['H HH',                               '15 15'],
                ['m mm',                               '25 25'],
                ['s ss',                               '50 50'],
                ['a A',                                'pm PM'],
                ['t\\he DDDo \\d\\ay of t\\he ye\\ar', 'the 45. day of the year'],
                ['L',                                  '14-02-2010'],
                ['LL',                                 '14 luty 2010'],
                ['LLL',                                '14 luty 2010 15:25'],
                ['LLLL',                               'niedziela, 14 luty 2010 15:25']
            ],
            b = moment(new Date(2010, 1, 14, 15, 25, 50, 125)),
            i;
        for (i = 0; i < a.length; i++) {
            test.equal(b.format(a[i][0]), a[i][1], a[i][0] + ' ---> ' + a[i][1]);
        }
        test.done();
    },

    "format ordinal" : function(test) {
        test.expect(31);
        moment.lang('pl');
        test.equal(moment([2011, 0, 1]).format('DDDo'), '1.', '1.');
        test.equal(moment([2011, 0, 2]).format('DDDo'), '2.', '2.');
        test.equal(moment([2011, 0, 3]).format('DDDo'), '3.', '3.');
        test.equal(moment([2011, 0, 4]).format('DDDo'), '4.', '4.');
        test.equal(moment([2011, 0, 5]).format('DDDo'), '5.', '5.');
        test.equal(moment([2011, 0, 6]).format('DDDo'), '6.', '6.');
        test.equal(moment([2011, 0, 7]).format('DDDo'), '7.', '7.');
        test.equal(moment([2011, 0, 8]).format('DDDo'), '8.', '8.');
        test.equal(moment([2011, 0, 9]).format('DDDo'), '9.', '9.');
        test.equal(moment([2011, 0, 10]).format('DDDo'), '10.', '10.');
    
        test.equal(moment([2011, 0, 11]).format('DDDo'), '11.', '11.');
        test.equal(moment([2011, 0, 12]).format('DDDo'), '12.', '12.');
        test.equal(moment([2011, 0, 13]).format('DDDo'), '13.', '13.');
        test.equal(moment([2011, 0, 14]).format('DDDo'), '14.', '14.');
        test.equal(moment([2011, 0, 15]).format('DDDo'), '15.', '15.');
        test.equal(moment([2011, 0, 16]).format('DDDo'), '16.', '16.');
        test.equal(moment([2011, 0, 17]).format('DDDo'), '17.', '17.');
        test.equal(moment([2011, 0, 18]).format('DDDo'), '18.', '18.');
        test.equal(moment([2011, 0, 19]).format('DDDo'), '19.', '19.');
        test.equal(moment([2011, 0, 20]).format('DDDo'), '20.', '20.');
    
        test.equal(moment([2011, 0, 21]).format('DDDo'), '21.', '21.');
        test.equal(moment([2011, 0, 22]).format('DDDo'), '22.', '22.');
        test.equal(moment([2011, 0, 23]).format('DDDo'), '23.', '23.');
        test.equal(moment([2011, 0, 24]).format('DDDo'), '24.', '24.');
        test.equal(moment([2011, 0, 25]).format('DDDo'), '25.', '25.');
        test.equal(moment([2011, 0, 26]).format('DDDo'), '26.', '26.');
        test.equal(moment([2011, 0, 27]).format('DDDo'), '27.', '27.');
        test.equal(moment([2011, 0, 28]).format('DDDo'), '28.', '28.');
        test.equal(moment([2011, 0, 29]).format('DDDo'), '29.', '29.');
        test.equal(moment([2011, 0, 30]).format('DDDo'), '30.', '30.');
    
        test.equal(moment([2011, 0, 31]).format('DDDo'), '31.', '31.');
        test.done();
    },

    "format month" : function(test) {
        test.expect(12);
        moment.lang('pl');
        var expected = 'styczeń sty_luty lut_marzec mar_kwiecień kwi_maj maj_czerwiec cze_lipiec lip_sierpień sie_wrzesień wrz_październik paź_listopad lis_grudzień gru'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, i, 0]).format('MMMM MMM'), expected[i], expected[i]);
        }
        test.done();
    },

    "format week" : function(test) {
        test.expect(7);
        moment.lang('pl');
        var expected = 'niedziela nie_poniedziałek pon_wtorek wt_środa śr_czwartek czw_piątek pt_sobota sb'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, 0, 2 + i]).format('dddd ddd'), expected[i], expected[i]);
        }
        test.done();
    },

    "from" : function(test) {
        test.expect(30);
        moment.lang('pl');
        var start = moment([2007, 1, 28]);
        test.equal(start.from(moment([2007, 1, 28]).add({s:44}), true),  "kilka sekund",  "44 seconds = a few seconds");
        test.equal(start.from(moment([2007, 1, 28]).add({s:45}), true),  "minuta",        "45 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:89}), true),  "minuta",        "89 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:90}), true),  "2 minuty",      "90 seconds = 2 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:44}), true),  "44 minuty",     "44 minutes = 44 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:45}), true),  "godzina",       "45 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:89}), true),  "godzina",       "89 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:90}), true),  "2 godziny",     "90 minutes = 2 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:5}), true),   "5 godzin",      "5 hours = 5 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:21}), true),  "21 godzin",     "21 hours = 21 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:22}), true),  "1 dzień",       "22 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:35}), true),  "1 dzień",       "35 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:36}), true),  "2 dni",         "36 hours = 2 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:1}), true),   "1 dzień",       "1 day = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({d:5}), true),   "5 dni",         "5 days = 5 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:25}), true),  "25 dni",        "25 days = 25 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:26}), true),  "miesiąc",       "26 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:30}), true),  "miesiąc",       "30 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:45}), true),  "miesiąc",       "45 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:46}), true),  "2 miesiące",    "46 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:74}), true),  "2 miesiące",    "75 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:76}), true),  "3 miesiące",    "76 days = 3 months");
        test.equal(start.from(moment([2007, 1, 28]).add({M:1}), true),   "miesiąc",       "1 month = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({M:5}), true),   "5 miesięcy",    "5 months = 5 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:344}), true), "11 miesięcy",   "344 days = 11 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:345}), true), "rok",           "345 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:547}), true), "rok",           "547 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:548}), true), "2 lata",        "548 days = 2 years");
        test.equal(start.from(moment([2007, 1, 28]).add({y:1}), true),   "rok",           "1 year = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({y:5}), true),   "5 lat",         "5 years = 5 years");
        test.done();
    },

    "suffix" : function(test) {
        test.expect(2);
        moment.lang('pl');
        test.equal(moment(30000).from(0), "za kilka sekund",  "prefix");
        test.equal(moment(0).from(30000), "kilka sekund temu", "suffix");
        test.done();
    },

    "now from now" : function(test) {
        test.expect(1);
        moment.lang('pl');
        test.equal(moment().fromNow(), "kilka sekund temu",  "now from now should display as in the past");
        test.done();
    },

    "fromNow" : function(test) {
        test.expect(3);
        moment.lang('pl');
        test.equal(moment().add({s:30}).fromNow(), "za kilka sekund", "in a few seconds");
        test.equal(moment().add({h:1}).fromNow(), "za godzinę", "in an hour");
        test.equal(moment().add({d:5}).fromNow(), "za 5 dni", "in 5 days");
        test.done();
    },

    "calendar day" : function(test) {
        test.expect(6);
        moment.lang('pl');
    
        var a = moment().hours(2).minutes(0).seconds(0);
    
        test.equal(moment(a).calendar(),                     "Dziś o 02:00",     "today at the same time");
        test.equal(moment(a).add({ m: 25 }).calendar(),      "Dziś o 02:25",     "Now plus 25 min");
        test.equal(moment(a).add({ h: 1 }).calendar(),       "Dziś o 03:00",     "Now plus 1 hour");
        test.equal(moment(a).add({ d: 1 }).calendar(),       "Jutro o 02:00",  "tomorrow at the same time");
        test.equal(moment(a).subtract({ h: 1 }).calendar(),  "Dziś o 01:00",     "Now minus 1 hour");
        test.equal(moment(a).subtract({ d: 1 }).calendar(),  "Wczoraj o 02:00",     "yesterday at the same time");
        test.done();
    },

    "calendar next week" : function(test) {
        test.expect(15);
        moment.lang('pl');
    
        var i;
        var m;
    
        for (i = 2; i < 7; i++) {
            m = moment().add({ d: i });
            test.equal(m.calendar(),       m.format('[W] dddd [o] LT'),  "Today + " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('[W] dddd [o] LT'),  "Today + " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('[W] dddd [o] LT'),  "Today + " + i + " days end of day");
        }
        test.done();
    },

    "calendar last week" : function(test) {
        test.expect(15);
        moment.lang('pl');
    
        for (i = 2; i < 7; i++) {
            m = moment().subtract({ d: i });
            test.equal(m.calendar(),       m.format('[W zeszły/łą] dddd [o] LT'),  "Today - " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('[W zeszły/łą] dddd [o] LT'),  "Today - " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('[W zeszły/łą] dddd [o] LT'),  "Today - " + i + " days end of day");
        }
        test.done();
    },

    "calendar all else" : function(test) {
        test.expect(4);
        moment.lang('pl');
        var weeksAgo = moment().subtract({ w: 1 });
        var weeksFromNow = moment().add({ w: 1 });
        
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "1 week ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 1 week");
    
        weeksAgo = moment().subtract({ w: 2 });
        weeksFromNow = moment().add({ w: 2 });
        
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "2 weeks ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 2 weeks");
    test.done();
    }
};var moment = require("../../moment");


    /**************************************************
      Portuguese
     *************************************************/

exports["lang:pt"] = {
    "parse" : function(test) {
        test.expect(96);
        moment.lang('pt');
        var tests = 'Janeiro Jan_Fevereiro Fev_Março Mar_Abril Abr_Maio Mai_Junho Jun_Julho Jul_Agosto Ago_Setembro Set_Outubro Out_Novembro Nov_Dezembro Dez'.split("_");
        var i;
        function equalTest(input, mmm, i) {
            test.equal(moment(input, mmm).month(), i, input + ' should be month ' + (i + 1));
        }
        for (i = 0; i < 12; i++) {
            tests[i] = tests[i].split(' ');
            equalTest(tests[i][0], 'MMM', i);
            equalTest(tests[i][1], 'MMM', i);
            equalTest(tests[i][0], 'MMMM', i);
            equalTest(tests[i][1], 'MMMM', i);
            equalTest(tests[i][0].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][0].toLocaleUpperCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleUpperCase(), 'MMMM', i);
        }
        test.done();
    },

    "format" : function(test) {
        test.expect(18);
        moment.lang('pt');
        var a = [
                ['dddd, MMMM Do YYYY, h:mm:ss a',      'Domingo, Fevereiro 14º 2010, 3:25:50 pm'],
                ['ddd, hA',                            'Dom, 3PM'],
                ['M Mo MM MMMM MMM',                   '2 2º 02 Fevereiro Fev'],
                ['YYYY YY',                            '2010 10'],
                ['D Do DD',                            '14 14º 14'],
                ['d do dddd ddd',                      '0 0º Domingo Dom'],
                ['DDD DDDo DDDD',                      '45 45º 045'],
                ['w wo ww',                            '8 8º 08'],
                ['h hh',                               '3 03'],
                ['H HH',                               '15 15'],
                ['m mm',                               '25 25'],
                ['s ss',                               '50 50'],
                ['a A',                                'pm PM'],
                ['t\\he DDDo \\d\\ay of t\\he ye\\ar', 'the 45º day of the year'],
                ['L',                                  '14/02/2010'],
                ['LL',                                 '14 de Fevereiro de 2010'],
                ['LLL',                                '14 de Fevereiro de 2010 15:25'],
                ['LLLL',                               'Domingo, 14 de Fevereiro de 2010 15:25']
            ],
            b = moment(new Date(2010, 1, 14, 15, 25, 50, 125)),
            i;
        for (i = 0; i < a.length; i++) {
            test.equal(b.format(a[i][0]), a[i][1], a[i][0] + ' ---> ' + a[i][1]);
        }
        test.done();
    },

    "format ordinal" : function(test) {
        test.expect(31);
        moment.lang('pt');
        test.equal(moment([2011, 0, 1]).format('DDDo'), '1º', '1º');
        test.equal(moment([2011, 0, 2]).format('DDDo'), '2º', '2º');
        test.equal(moment([2011, 0, 3]).format('DDDo'), '3º', '3º');
        test.equal(moment([2011, 0, 4]).format('DDDo'), '4º', '4º');
        test.equal(moment([2011, 0, 5]).format('DDDo'), '5º', '5º');
        test.equal(moment([2011, 0, 6]).format('DDDo'), '6º', '6º');
        test.equal(moment([2011, 0, 7]).format('DDDo'), '7º', '7º');
        test.equal(moment([2011, 0, 8]).format('DDDo'), '8º', '8º');
        test.equal(moment([2011, 0, 9]).format('DDDo'), '9º', '9º');
        test.equal(moment([2011, 0, 10]).format('DDDo'), '10º', '10º');
    
        test.equal(moment([2011, 0, 11]).format('DDDo'), '11º', '11º');
        test.equal(moment([2011, 0, 12]).format('DDDo'), '12º', '12º');
        test.equal(moment([2011, 0, 13]).format('DDDo'), '13º', '13º');
        test.equal(moment([2011, 0, 14]).format('DDDo'), '14º', '14º');
        test.equal(moment([2011, 0, 15]).format('DDDo'), '15º', '15º');
        test.equal(moment([2011, 0, 16]).format('DDDo'), '16º', '16º');
        test.equal(moment([2011, 0, 17]).format('DDDo'), '17º', '17º');
        test.equal(moment([2011, 0, 18]).format('DDDo'), '18º', '18º');
        test.equal(moment([2011, 0, 19]).format('DDDo'), '19º', '19º');
        test.equal(moment([2011, 0, 20]).format('DDDo'), '20º', '20º');
    
        test.equal(moment([2011, 0, 21]).format('DDDo'), '21º', '21º');
        test.equal(moment([2011, 0, 22]).format('DDDo'), '22º', '22º');
        test.equal(moment([2011, 0, 23]).format('DDDo'), '23º', '23º');
        test.equal(moment([2011, 0, 24]).format('DDDo'), '24º', '24º');
        test.equal(moment([2011, 0, 25]).format('DDDo'), '25º', '25º');
        test.equal(moment([2011, 0, 26]).format('DDDo'), '26º', '26º');
        test.equal(moment([2011, 0, 27]).format('DDDo'), '27º', '27º');
        test.equal(moment([2011, 0, 28]).format('DDDo'), '28º', '28º');
        test.equal(moment([2011, 0, 29]).format('DDDo'), '29º', '29º');
        test.equal(moment([2011, 0, 30]).format('DDDo'), '30º', '30º');
    
        test.equal(moment([2011, 0, 31]).format('DDDo'), '31º', '31º');
        test.done();
    },

    "format month" : function(test) {
        test.expect(12);
        moment.lang('pt');
        var expected = 'Janeiro Jan_Fevereiro Fev_Março Mar_Abril Abr_Maio Mai_Junho Jun_Julho Jul_Agosto Ago_Setembro Set_Outubro Out_Novembro Nov_Dezembro Dez'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, i, 0]).format('MMMM MMM'), expected[i], expected[i]);
        }
        test.done();
    },

    "format week" : function(test) {
        test.expect(7);
        moment.lang('pt');
        var expected = 'Domingo Dom_Segunda-feira Seg_Terça-feira Ter_Quarta-feira Qua_Quinta-feira Qui_Sexta-feira Sex_Sábado Sáb'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, 0, 2 + i]).format('dddd ddd'), expected[i], expected[i]);
        }
        test.done();
    },

    "from" : function(test) {
        test.expect(30);
        moment.lang('pt');
        var start = moment([2007, 1, 28]);
        test.equal(start.from(moment([2007, 1, 28]).add({s:44}), true),  "segundos",    "44 seconds = seconds");
        test.equal(start.from(moment([2007, 1, 28]).add({s:45}), true),  "um minuto",   "45 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:89}), true),  "um minuto",   "89 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:90}), true),  "2 minutos",  "90 seconds = 2 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:44}), true),  "44 minutos", "44 minutes = 44 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:45}), true),  "uma hora",    "45 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:89}), true),  "uma hora",    "89 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:90}), true),  "2 horas",    "90 minutes = 2 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:5}), true),   "5 horas",    "5 hours = 5 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:21}), true),  "21 horas",   "21 hours = 21 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:22}), true),  "um dia",      "22 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:35}), true),  "um dia",      "35 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:36}), true),  "2 dias",     "36 hours = 2 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:1}), true),   "um dia",      "1 day = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({d:5}), true),   "5 dias",     "5 days = 5 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:25}), true),  "25 dias",    "25 days = 25 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:26}), true),  "um mês",    "26 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:30}), true),  "um mês",    "30 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:45}), true),  "um mês",    "45 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:46}), true),  "2 meses",   "46 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:74}), true),  "2 meses",   "75 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:76}), true),  "3 meses",   "76 days = 3 months");
        test.equal(start.from(moment([2007, 1, 28]).add({M:1}), true),   "um mês",    "1 month = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({M:5}), true),   "5 meses",   "5 months = 5 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:344}), true), "11 meses",  "344 days = 11 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:345}), true), "um ano",     "345 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:547}), true), "um ano",     "547 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:548}), true), "2 anos",    "548 days = 2 years");
        test.equal(start.from(moment([2007, 1, 28]).add({y:1}), true),   "um ano",     "1 year = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({y:5}), true),   "5 anos",    "5 years = 5 years");
        test.done();
    },

    "suffix" : function(test) {
        test.expect(2);
        moment.lang('pt');
        test.equal(moment(30000).from(0), "em segundos", "prefix");
        test.equal(moment(0).from(30000), "segundos atrás", "suffix");
        test.done();
    },

    "fromNow" : function(test) {
        test.expect(2);
        moment.lang('pt');
        test.equal(moment().add({s:30}).fromNow(), "em segundos", "in seconds");
        test.equal(moment().add({d:5}).fromNow(), "em 5 dias", "in 5 days");
        test.done();
    },

    "calendar day" : function(test) {
        test.expect(6);
        moment.lang('pt');
    
        var a = moment().hours(2).minutes(0).seconds(0);
    
        test.equal(moment(a).calendar(),                     "Hoje às 02:00",     "today at the same time");
        test.equal(moment(a).add({ m: 25 }).calendar(),      "Hoje às 02:25",     "Now plus 25 min");
        test.equal(moment(a).add({ h: 1 }).calendar(),       "Hoje às 03:00",     "Now plus 1 hour");
        test.equal(moment(a).add({ d: 1 }).calendar(),       "Amanhã às 02:00",  "tomorrow at the same time");
        test.equal(moment(a).subtract({ h: 1 }).calendar(),  "Hoje às 01:00",     "Now minus 1 hour");
        test.equal(moment(a).subtract({ d: 1 }).calendar(),  "Ontem às 02:00",     "yesterday at the same time");
        test.done();
    },

    "calendar next week" : function(test) {
        test.expect(15);
        moment.lang('pt');
    
        var i;
        var m;
    
        for (i = 2; i < 7; i++) {
            m = moment().add({ d: i });
            test.equal(m.calendar(),       m.format('dddd [às] LT'),  "Today + " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('dddd [às] LT'),  "Today + " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('dddd [às] LT'),  "Today + " + i + " days end of day");
        }
        test.done();
    },

    "calendar last week" : function(test) {
        test.expect(15);
        moment.lang('pt');
    
        for (i = 2; i < 7; i++) {
            m = moment().subtract({ d: i });
            test.equal(m.calendar(),       m.format((m.day() === 0 || m.day() === 6) ? '[Último] dddd [às] LT' : '[Última] dddd [às] LT'),  "Today - " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format((m.day() === 0 || m.day() === 6) ? '[Último] dddd [às] LT' : '[Última] dddd [às] LT'),  "Today - " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format((m.day() === 0 || m.day() === 6) ? '[Último] dddd [às] LT' : '[Última] dddd [às] LT'),  "Today - " + i + " days end of day");
        }
        test.done();
    },

    "calendar all else" : function(test) {
        test.expect(4);
        moment.lang('pt');
        var weeksAgo = moment().subtract({ w: 1 });
        var weeksFromNow = moment().add({ w: 1 });
        
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "1 week ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 1 week");
    
        weeksAgo = moment().subtract({ w: 2 });
        weeksFromNow = moment().add({ w: 2 });
        
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "2 weeks ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 2 weeks");
    test.done();
    }
};var moment = require("../../moment");


    /**************************************************
      Russian
     *************************************************/

exports["lang:ru"] = {
    "parse" : function(test) {
        test.expect(96);
        moment.lang('ru');
        var tests = 'январь янв_февраль фев_март мар_апрель апр_май май_июнь июн_июль июл_август авг_сентябрь сен_октябрь окт_ноябрь ноя_декабрь дек'.split("_");
        var i;
        function equalTest(input, mmm, i) {
            test.equal(moment(input, mmm).month(), i, input + ' should be month ' + (i + 1));
        }
        for (i = 0; i < 12; i++) {
            tests[i] = tests[i].split(' ');
            equalTest(tests[i][0], 'MMM', i);
            equalTest(tests[i][1], 'MMM', i);
            equalTest(tests[i][0], 'MMMM', i);
            equalTest(tests[i][1], 'MMMM', i);
            equalTest(tests[i][0].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][0].toLocaleUpperCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleUpperCase(), 'MMMM', i);
        }
        test.done();
    },

    "format" : function(test) {
        test.expect(18);
        moment.lang('ru');
        var a = [
                ['dddd, MMMM Do YYYY, h:mm:ss a',      'воскресенье, февраль 14. 2010, 3:25:50 pm'],
                ['ddd, hA',                            'вск, 3PM'],
                ['M Mo MM MMMM MMM',                   '2 2. 02 февраль фев'],
                ['YYYY YY',                            '2010 10'],
                ['D Do DD',                            '14 14. 14'],
                ['d do dddd ddd',                      '0 0. воскресенье вск'],
                ['DDD DDDo DDDD',                      '45 45. 045'],
                ['w wo ww',                            '8 8. 08'],
                ['h hh',                               '3 03'],
                ['H HH',                               '15 15'],
                ['m mm',                               '25 25'],
                ['s ss',                               '50 50'],
                ['a A',                                'pm PM'],
                ['t\\he DDDo \\d\\ay of t\\he ye\\ar', 'the 45. day of the year'],
                ['L',                                  '14-02-2010'],
                ['LL',                                 '14 февраль 2010'],
                ['LLL',                                '14 февраль 2010 15:25'],
                ['LLLL',                               'воскресенье, 14 февраль 2010 15:25']
            ],
            b = moment(new Date(2010, 1, 14, 15, 25, 50, 125)),
            i;
        for (i = 0; i < a.length; i++) {
            test.equal(b.format(a[i][0]), a[i][1], a[i][0] + ' ---> ' + a[i][1]);
        }
        test.done();
    },

    "format ordinal" : function(test) {
        test.expect(31);
        moment.lang('ru');
        test.equal(moment([2011, 0, 1]).format('DDDo'), '1.', '1.');
        test.equal(moment([2011, 0, 2]).format('DDDo'), '2.', '2.');
        test.equal(moment([2011, 0, 3]).format('DDDo'), '3.', '3.');
        test.equal(moment([2011, 0, 4]).format('DDDo'), '4.', '4.');
        test.equal(moment([2011, 0, 5]).format('DDDo'), '5.', '5.');
        test.equal(moment([2011, 0, 6]).format('DDDo'), '6.', '6.');
        test.equal(moment([2011, 0, 7]).format('DDDo'), '7.', '7.');
        test.equal(moment([2011, 0, 8]).format('DDDo'), '8.', '8.');
        test.equal(moment([2011, 0, 9]).format('DDDo'), '9.', '9.');
        test.equal(moment([2011, 0, 10]).format('DDDo'), '10.', '10.');

        test.equal(moment([2011, 0, 11]).format('DDDo'), '11.', '11.');
        test.equal(moment([2011, 0, 12]).format('DDDo'), '12.', '12.');
        test.equal(moment([2011, 0, 13]).format('DDDo'), '13.', '13.');
        test.equal(moment([2011, 0, 14]).format('DDDo'), '14.', '14.');
        test.equal(moment([2011, 0, 15]).format('DDDo'), '15.', '15.');
        test.equal(moment([2011, 0, 16]).format('DDDo'), '16.', '16.');
        test.equal(moment([2011, 0, 17]).format('DDDo'), '17.', '17.');
        test.equal(moment([2011, 0, 18]).format('DDDo'), '18.', '18.');
        test.equal(moment([2011, 0, 19]).format('DDDo'), '19.', '19.');
        test.equal(moment([2011, 0, 20]).format('DDDo'), '20.', '20.');

        test.equal(moment([2011, 0, 21]).format('DDDo'), '21.', '21.');
        test.equal(moment([2011, 0, 22]).format('DDDo'), '22.', '22.');
        test.equal(moment([2011, 0, 23]).format('DDDo'), '23.', '23.');
        test.equal(moment([2011, 0, 24]).format('DDDo'), '24.', '24.');
        test.equal(moment([2011, 0, 25]).format('DDDo'), '25.', '25.');
        test.equal(moment([2011, 0, 26]).format('DDDo'), '26.', '26.');
        test.equal(moment([2011, 0, 27]).format('DDDo'), '27.', '27.');
        test.equal(moment([2011, 0, 28]).format('DDDo'), '28.', '28.');
        test.equal(moment([2011, 0, 29]).format('DDDo'), '29.', '29.');
        test.equal(moment([2011, 0, 30]).format('DDDo'), '30.', '30.');

        test.equal(moment([2011, 0, 31]).format('DDDo'), '31.', '31.');
        test.done();
    },

    "format month" : function(test) {
        test.expect(12);
        moment.lang('ru');
        var expected = 'январь янв_февраль фев_март мар_апрель апр_май май_июнь июн_июль июл_август авг_сентябрь сен_октябрь окт_ноябрь ноя_декабрь дек'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, i, 0]).format('MMMM MMM'), expected[i], expected[i]);
        }
        test.done();
    },

    "format week" : function(test) {
        test.expect(7);
        moment.lang('ru');
        var expected = 'воскресенье вск_понедельник пнд_вторник втр_среда срд_четверг чтв_пятница птн_суббота суб'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, 0, 2 + i]).format('dddd ddd'), expected[i], expected[i]);
        }
        test.done();
    },

    "from" : function(test) {
        test.expect(32);
        moment.lang('ru');
        var start = moment([2007, 1, 28]);
        test.equal(start.from(moment([2007, 1, 28]).add({s:44}), true),  "несколько секунд",    "44 seconds = seconds");
        test.equal(start.from(moment([2007, 1, 28]).add({s:45}), true),  "минута",   "45 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:89}), true),  "минута",   "89 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:90}), true),  "2 минуты",  "90 seconds = 2 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:44}), true),  "44 минуты", "44 minutes = 44 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:45}), true),  "час",    "45 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:89}), true),  "час",    "89 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:90}), true),  "2 часа",    "90 minutes = 2 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:5}), true),   "5 часов",    "5 hours = 5 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:21}), true),  "21 час",   "21 hours = 21 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:22}), true),  "день",      "22 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:35}), true),  "день",      "35 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:36}), true),  "2 дня",     "36 hours = 2 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:1}), true),   "день",      "1 day = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({d:5}), true),   "5 дней",     "5 days = 5 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:11}), true),  "11 дней",     "11 days = 11 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:21}), true),  "21 день",     "21 days = 21 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:25}), true),  "25 дней",    "25 days = 25 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:26}), true),  "месяц",    "26 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:30}), true),  "месяц",    "30 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:45}), true),  "месяц",    "45 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:46}), true),  "2 месяца",   "46 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:74}), true),  "2 месяца",   "75 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:76}), true),  "3 месяца",   "76 days = 3 months");
        test.equal(start.from(moment([2007, 1, 28]).add({M:1}), true),   "месяц",    "1 month = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({M:5}), true),   "5 месяцев",   "5 months = 5 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:344}), true), "11 месяцев",  "344 days = 11 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:345}), true), "год",     "345 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:547}), true), "год",     "547 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:548}), true), "2 года",    "548 days = 2 years");
        test.equal(start.from(moment([2007, 1, 28]).add({y:1}), true),   "год",     "1 year = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({y:5}), true),   "5 лет",    "5 years = 5 years");
        test.done();
    },

    "suffix" : function(test) {
        test.expect(2);
        moment.lang('ru');
        test.equal(moment(30000).from(0), "через несколько секунд", "prefix");
        test.equal(moment(0).from(30000), "несколько секунд назад", "suffix");
        test.done();
    },

    "fromNow" : function(test) {
        test.expect(2);
        moment.lang('ru');
        test.equal(moment().add({s:30}).fromNow(), "через несколько секунд", "in seconds");
        test.equal(moment().add({d:5}).fromNow(), "через 5 дней", "in 5 days");
        test.done();
    },

    "calendar day" : function(test) {
        test.expect(6);
        moment.lang('ru');

        var a = moment().hours(2).minutes(0).seconds(0);

        test.equal(moment(a).calendar(),                     "Сегодня в 02:00",     "today at the same time");
        test.equal(moment(a).add({ m: 25 }).calendar(),      "Сегодня в 02:25",     "Now plus 25 min");
        test.equal(moment(a).add({ h: 1 }).calendar(),       "Сегодня в 03:00",     "Now plus 1 hour");
        test.equal(moment(a).add({ d: 1 }).calendar(),       "Завтра в 02:00",      "tomorrow at the same time");
        test.equal(moment(a).subtract({ h: 1 }).calendar(),  "Сегодня в 01:00",     "Now minus 1 hour");
        test.equal(moment(a).subtract({ d: 1 }).calendar(),  "Вчера в 02:00",       "yesterday at the same time");
        test.done();
    },

    "calendar next week" : function(test) {
        test.expect(15);
        moment.lang('ru');

        var i;
        var m;

        function makeFormat(d) {
            return d.day() === 1 ? '[Во] dddd [в] LT' : '[В] dddd [в] LT';
        }

        for (i = 2; i < 7; i++) {
            m = moment().add({ d: i });
            test.equal(m.calendar(),       m.format(makeFormat(m)),  "Today + " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format(makeFormat(m)),  "Today + " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format(makeFormat(m)),  "Today + " + i + " days end of day");
        }
        test.done();
    },

    "calendar last week" : function(test) {
        test.expect(15);
        moment.lang('ru');

        var i;
        var m;

        function makeFormat(d) {
            switch (d.day()) {
            case 0:
            case 1:
            case 3:
                return '[В прошлый] dddd [в] LT';
            case 6:
                return '[В прошлое] dddd [в] LT';
            default:
                return '[В прошлую] dddd [в] LT';
            }
        }

        for (i = 2; i < 7; i++) {
            m = moment().subtract({ d: i });
            test.equal(m.calendar(),       m.format(makeFormat(m)),  "Today - " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format(makeFormat(m)),  "Today - " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format(makeFormat(m)),  "Today - " + i + " days end of day");
        }
        test.done();
    },

    "calendar all else" : function(test) {
        test.expect(4);
        moment.lang('ru');
        var weeksAgo = moment().subtract({ w: 1 });
        var weeksFromNow = moment().add({ w: 1 });

        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "1 week ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 1 week");

        weeksAgo = moment().subtract({ w: 2 });
        weeksFromNow = moment().add({ w: 2 });

        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "2 weeks ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 2 weeks");
    test.done();
    }
};var moment = require("../../moment");


    /**************************************************
      English
     *************************************************/

exports["lang:sv"] = {
    "parse" : function(test) {
        test.expect(96);
        moment.lang('sv');
        var tests = 'januari jan_februari feb_mars mar_april apr_maj maj_juni jun_juli jul_augusti aug_september sep_oktober okt_november nov_december dec'.split("_");
        var i;
        function equalTest(input, mmm, i) {
            test.equal(moment(input, mmm).month(), i, input + ' should be month ' + (i + 1));
        }
        for (i = 0; i < 12; i++) {
            tests[i] = tests[i].split(' ');
            equalTest(tests[i][0], 'MMM', i);
            equalTest(tests[i][1], 'MMM', i);
            equalTest(tests[i][0], 'MMMM', i);
            equalTest(tests[i][1], 'MMMM', i);
            equalTest(tests[i][0].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][0].toLocaleUpperCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleUpperCase(), 'MMMM', i);
        }
        test.done();
    },

    "format" : function(test) {
        test.expect(18);
        moment.lang('sv');
        var a = [
                ['dddd, MMMM Do YYYY, h:mm:ss a',      'söndag, februari 14e 2010, 3:25:50 pm'],
                ['ddd, hA',                            'sön, 3PM'],
                ['M Mo MM MMMM MMM',                   '2 2a 02 februari feb'],
                ['YYYY YY',                            '2010 10'],
                ['D Do DD',                            '14 14e 14'],
                ['d do dddd ddd',                      '0 0e söndag sön'],
                ['DDD DDDo DDDD',                      '45 45e 045'],
                ['w wo ww',                            '8 8e 08'],
                ['h hh',                               '3 03'],
                ['H HH',                               '15 15'],
                ['m mm',                               '25 25'],
                ['s ss',                               '50 50'],
                ['a A',                                'pm PM'],
                ['t\\he DDDo \\d\\ay of t\\he ye\\ar', 'the 45e day of the year'],
                ['L',                                  '2010-02-14'],
                ['LL',                                 '14 februari 2010'],
                ['LLL',                                '14 februari 2010 15:25'],
                ['LLLL',                               'söndag 14 februari 2010 15:25']
            ],
            b = moment(new Date(2010, 1, 14, 15, 25, 50, 125)),
            i;
        for (i = 0; i < a.length; i++) {
            test.equal(b.format(a[i][0]), a[i][1], a[i][0] + ' ---> ' + a[i][1]);
        }
        test.done();
    },

    "format ordinal" : function(test) {
        test.expect(31);
        moment.lang('sv');
        test.equal(moment([2011, 0, 1]).format('DDDo'), '1a', '1a');
        test.equal(moment([2011, 0, 2]).format('DDDo'), '2a', '2a');
        test.equal(moment([2011, 0, 3]).format('DDDo'), '3e', '3e');
        test.equal(moment([2011, 0, 4]).format('DDDo'), '4e', '4e');
        test.equal(moment([2011, 0, 5]).format('DDDo'), '5e', '5e');
        test.equal(moment([2011, 0, 6]).format('DDDo'), '6e', '6e');
        test.equal(moment([2011, 0, 7]).format('DDDo'), '7e', '7e');
        test.equal(moment([2011, 0, 8]).format('DDDo'), '8e', '8e');
        test.equal(moment([2011, 0, 9]).format('DDDo'), '9e', '9e');
        test.equal(moment([2011, 0, 10]).format('DDDo'), '10e', '10e');
    
        test.equal(moment([2011, 0, 11]).format('DDDo'), '11e', '11e');
        test.equal(moment([2011, 0, 12]).format('DDDo'), '12e', '12e');
        test.equal(moment([2011, 0, 13]).format('DDDo'), '13e', '13e');
        test.equal(moment([2011, 0, 14]).format('DDDo'), '14e', '14e');
        test.equal(moment([2011, 0, 15]).format('DDDo'), '15e', '15e');
        test.equal(moment([2011, 0, 16]).format('DDDo'), '16e', '16e');
        test.equal(moment([2011, 0, 17]).format('DDDo'), '17e', '17e');
        test.equal(moment([2011, 0, 18]).format('DDDo'), '18e', '18e');
        test.equal(moment([2011, 0, 19]).format('DDDo'), '19e', '19e');
        test.equal(moment([2011, 0, 20]).format('DDDo'), '20e', '20e');
    
        test.equal(moment([2011, 0, 21]).format('DDDo'), '21a', '21a');
        test.equal(moment([2011, 0, 22]).format('DDDo'), '22a', '22a');
        test.equal(moment([2011, 0, 23]).format('DDDo'), '23e', '23e');
        test.equal(moment([2011, 0, 24]).format('DDDo'), '24e', '24e');
        test.equal(moment([2011, 0, 25]).format('DDDo'), '25e', '25e');
        test.equal(moment([2011, 0, 26]).format('DDDo'), '26e', '26e');
        test.equal(moment([2011, 0, 27]).format('DDDo'), '27e', '27e');
        test.equal(moment([2011, 0, 28]).format('DDDo'), '28e', '28e');
        test.equal(moment([2011, 0, 29]).format('DDDo'), '29e', '29e');
        test.equal(moment([2011, 0, 30]).format('DDDo'), '30e', '30e');
    
        test.equal(moment([2011, 0, 31]).format('DDDo'), '31a', '31a');
        test.done();
    },

    "format month" : function(test) {
        test.expect(12);
        moment.lang('sv');
    	var expected = 'januari jan_februari feb_mars mar_april apr_maj maj_juni jun_juli jul_augusti aug_september sep_oktober okt_november nov_december dec'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, i, 0]).format('MMMM MMM'), expected[i], expected[i]);
        }
        test.done();
    },

    "format week" : function(test) {
        test.expect(7);
        moment.lang('sv');
        var expected = 'söndag sön_måndag mån_tisdag tis_onsdag ons_torsdag tor_fredag fre_lördag lör'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, 0, 2 + i]).format('dddd ddd'), expected[i], expected[i]);
        }
        test.done();
    },

    "from" : function(test) {
        test.expect(30);
        moment.lang('sv');
        var start = moment([2007, 1, 28]);
        test.equal(start.from(moment([2007, 1, 28]).add({s:44}), true),  "några sekunder", "44 sekunder = a few seconds");
        test.equal(start.from(moment([2007, 1, 28]).add({s:45}), true),  "en minut",      "45 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:89}), true),  "en minut",      "89 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:90}), true),  "2 minuter",     "90 seconds = 2 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:44}), true),  "44 minuter",    "44 minutes = 44 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:45}), true),  "en timme",       "45 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:89}), true),  "en timme",       "89 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:90}), true),  "2 timmar",       "90 minutes = 2 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:5}), true),   "5 timmar",       "5 hours = 5 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:21}), true),  "21 timmar",      "21 hours = 21 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:22}), true),  "en dag",         "22 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:35}), true),  "en dag",         "35 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:36}), true),  "2 dagar",        "36 hours = 2 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:1}), true),   "en dag",         "1 day = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({d:5}), true),   "5 dagar",        "5 days = 5 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:25}), true),  "25 dagar",       "25 days = 25 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:26}), true),  "en månad",       "26 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:30}), true),  "en månad",       "30 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:45}), true),  "en månad",       "45 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:46}), true),  "2 månader",      "46 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:74}), true),  "2 månader",      "75 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:76}), true),  "3 månader",      "76 days = 3 months");
        test.equal(start.from(moment([2007, 1, 28]).add({M:1}), true),   "en månad",       "1 month = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({M:5}), true),   "5 månader",      "5 months = 5 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:344}), true), "11 månader",     "344 days = 11 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:345}), true), "ett år",        "345 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:547}), true), "ett år",        "547 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:548}), true), "2 år",       "548 days = 2 years");
        test.equal(start.from(moment([2007, 1, 28]).add({y:1}), true),   "ett år",        "1 year = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({y:5}), true),   "5 år",       "5 years = 5 years");
        test.done();
    },

    "suffix" : function(test) {
        test.expect(2);
        moment.lang('sv');
        test.equal(moment(30000).from(0), "om några sekunder",  "prefix");
        test.equal(moment(0).from(30000), "för några sekunder sen", "suffix");
        test.done();
    },

    "now from now" : function(test) {
        test.expect(1);
        moment.lang('sv');
        test.equal(moment().fromNow(), "för några sekunder sen",  "now from now should display as in the past");
        test.done();
    },

    "fromNow" : function(test) {
        test.expect(2);
        moment.lang('sv');
        test.equal(moment().add({s:30}).fromNow(), "om några sekunder", "in a few seconds");
        test.equal(moment().add({d:5}).fromNow(), "om 5 dagar", "in 5 days");
        test.done();
    },

    "calendar day" : function(test) {
        test.expect(6);
        moment.lang('sv');
    
        var a = moment().hours(2).minutes(0).seconds(0);
    
        test.equal(moment(a).calendar(),                     "Idag klockan 02:00",     "today at the same time");
        test.equal(moment(a).add({ m: 25 }).calendar(),      "Idag klockan 02:25",     "Now plus 25 min");
        test.equal(moment(a).add({ h: 1 }).calendar(),       "Idag klockan 03:00",     "Now plus 1 hour");
        test.equal(moment(a).add({ d: 1 }).calendar(),       "Imorgon klockan 02:00",  "tomorrow at the same time");
        test.equal(moment(a).subtract({ h: 1 }).calendar(),  "Idag klockan 01:00",     "Now minus 1 hour");
        test.equal(moment(a).subtract({ d: 1 }).calendar(),  "Igår klockan 02:00",     "yesterday at the same time");
        test.done();
    },

    "calendar next week" : function(test) {
        test.expect(15);
        moment.lang('sv');
    
        var i;
        var m;
    
        for (i = 2; i < 7; i++) {
            m = moment().add({ d: i });
            test.equal(m.calendar(),       m.format('dddd [klockan] LT'),  "Today + " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('dddd [klockan] LT'),  "Today + " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('dddd [klockan] LT'),  "Today + " + i + " days end of day");
        }
        test.done();
    },

    "calendar last week" : function(test) {
        test.expect(15);
        moment.lang('sv');
    
        for (i = 2; i < 7; i++) {
            m = moment().subtract({ d: i });
            test.equal(m.calendar(),       m.format('[Förra] dddd [en klockan] LT'),  "Today - " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('[Förra] dddd [en klockan] LT'),  "Today - " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('[Förra] dddd [en klockan] LT'),  "Today - " + i + " days end of day");
        }
        test.done();
    },

    "calendar all else" : function(test) {
        test.expect(4);
        moment.lang('sv');
        var weeksAgo = moment().subtract({ w: 1 });
        var weeksFromNow = moment().add({ w: 1 });
        
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "1 week ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 1 week");
    
        weeksAgo = moment().subtract({ w: 2 });
        weeksFromNow = moment().add({ w: 2 });
        
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "2 weeks ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 2 weeks");
    test.done();
    }
};var moment = require("../../moment");


    /**************************************************
      Turkish
     *************************************************/

exports["lang:tr"] = {
    "parse" : function(test) {
        test.expect(96);
        moment.lang('tr');
        var tests = 'Ocak Oca_Şubat Şub_Mart Mar_Nisan Nis_Mayıs May_Haziran Haz_Temmuz Tem_Ağustos Ağu_Eylül Eyl_Ekim Eki_Kasım Kas_Aralık Ara'.split("_");
        var i;
        function equalTest(input, mmm, i) {
            test.equal(moment(input, mmm).month(), i, input + ' should be month ' + (i + 1));
        }
        for (i = 0; i < 12; i++) {
            tests[i] = tests[i].split(' ');
            equalTest(tests[i][0], 'MMM', i);
            equalTest(tests[i][1], 'MMM', i);
            equalTest(tests[i][0], 'MMMM', i);
            equalTest(tests[i][1], 'MMMM', i);
            equalTest(tests[i][0].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][0].toLocaleUpperCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleUpperCase(), 'MMMM', i);
        }
        test.done();
    },

    "format" : function(test) {
        test.expect(18);
        moment.lang('tr');
        var a = [
                ['dddd, MMMM Do YYYY, h:mm:ss a',      'Pazar, Şubat 14th 2010, 3:25:50 pm'],
                ['ddd, hA',                            'Paz, 3PM'],
                ['M Mo MM MMMM MMM',                   '2 2nd 02 Şubat Şub'],
                ['YYYY YY',                            '2010 10'],
                ['D Do DD',                            '14 14th 14'],
                ['d do dddd ddd',                      '0 0th Pazar Paz'],
                ['DDD DDDo DDDD',                      '45 45th 045'],
                ['w wo ww',                            '8 8th 08'],
                ['h hh',                               '3 03'],
                ['H HH',                               '15 15'],
                ['m mm',                               '25 25'],
                ['s ss',                               '50 50'],
                ['a A',                                'pm PM'],
                ['t\\he DDDo \\d\\ay of t\\he ye\\ar', 'the 45th day of the year'],
                ['L',                                  '14.02.2010'],
                ['LL',                                 '14 Şubat 2010'],
                ['LLL',                                '14 Şubat 2010 15:25'],
                ['LLLL',                               'Pazar, 14 Şubat 2010 15:25']
            ],
            b = moment(new Date(2010, 1, 14, 15, 25, 50, 125)),
            i;
        for (i = 0; i < a.length; i++) {
            test.equal(b.format(a[i][0]), a[i][1], a[i][0] + ' ---> ' + a[i][1]);
        }
        test.done();
    },

    "format ordinal" : function(test) {
        test.expect(31);
        moment.lang('tr');
        test.equal(moment([2011, 0, 1]).format('DDDo'), '1st', '1st');
        test.equal(moment([2011, 0, 2]).format('DDDo'), '2nd', '2nd');
        test.equal(moment([2011, 0, 3]).format('DDDo'), '3rd', '3rd');
        test.equal(moment([2011, 0, 4]).format('DDDo'), '4th', '4th');
        test.equal(moment([2011, 0, 5]).format('DDDo'), '5th', '5th');
        test.equal(moment([2011, 0, 6]).format('DDDo'), '6th', '6th');
        test.equal(moment([2011, 0, 7]).format('DDDo'), '7th', '7th');
        test.equal(moment([2011, 0, 8]).format('DDDo'), '8th', '8th');
        test.equal(moment([2011, 0, 9]).format('DDDo'), '9th', '9th');
        test.equal(moment([2011, 0, 10]).format('DDDo'), '10th', '10th');
    
        test.equal(moment([2011, 0, 11]).format('DDDo'), '11th', '11th');
        test.equal(moment([2011, 0, 12]).format('DDDo'), '12th', '12th');
        test.equal(moment([2011, 0, 13]).format('DDDo'), '13th', '13th');
        test.equal(moment([2011, 0, 14]).format('DDDo'), '14th', '14th');
        test.equal(moment([2011, 0, 15]).format('DDDo'), '15th', '15th');
        test.equal(moment([2011, 0, 16]).format('DDDo'), '16th', '16th');
        test.equal(moment([2011, 0, 17]).format('DDDo'), '17th', '17th');
        test.equal(moment([2011, 0, 18]).format('DDDo'), '18th', '18th');
        test.equal(moment([2011, 0, 19]).format('DDDo'), '19th', '19th');
        test.equal(moment([2011, 0, 20]).format('DDDo'), '20th', '20th');
    
        test.equal(moment([2011, 0, 21]).format('DDDo'), '21st', '21st');
        test.equal(moment([2011, 0, 22]).format('DDDo'), '22nd', '22nd');
        test.equal(moment([2011, 0, 23]).format('DDDo'), '23rd', '23rd');
        test.equal(moment([2011, 0, 24]).format('DDDo'), '24th', '24th');
        test.equal(moment([2011, 0, 25]).format('DDDo'), '25th', '25th');
        test.equal(moment([2011, 0, 26]).format('DDDo'), '26th', '26th');
        test.equal(moment([2011, 0, 27]).format('DDDo'), '27th', '27th');
        test.equal(moment([2011, 0, 28]).format('DDDo'), '28th', '28th');
        test.equal(moment([2011, 0, 29]).format('DDDo'), '29th', '29th');
        test.equal(moment([2011, 0, 30]).format('DDDo'), '30th', '30th');
    
        test.equal(moment([2011, 0, 31]).format('DDDo'), '31st', '31st');
        test.done();
    },

    "format month" : function(test) {
        test.expect(12);
        moment.lang('tr');
        var expected = 'Ocak Oca_Şubat Şub_Mart Mar_Nisan Nis_Mayıs May_Haziran Haz_Temmuz Tem_Ağustos Ağu_Eylül Eyl_Ekim Eki_Kasım Kas_Aralık Ara'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, i, 0]).format('MMMM MMM'), expected[i], expected[i]);
        }
        test.done();
    },

    "format week" : function(test) {
        test.expect(7);
        moment.lang('tr');
        var expected = 'Pazar Paz_Pazartesi Pts_Salı Sal_Çarşamba Çar_Perşembe Per_Cuma Cum_Cumartesi Cts'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, 0, 2 + i]).format('dddd ddd'), expected[i], expected[i]);
        }
        test.done();
    },

    "from" : function(test) {
        test.expect(30);
        moment.lang('tr');
        var start = moment([2007, 1, 28]);
        test.equal(start.from(moment([2007, 1, 28]).add({s:44}), true),  "birkaç saniye", "44 seconds = a few seconds");
        test.equal(start.from(moment([2007, 1, 28]).add({s:45}), true),  "bir dakika",      "45 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:89}), true),  "bir dakika",      "89 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:90}), true),  "2 dakika",     "90 seconds = 2 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:44}), true),  "44 dakika",    "44 minutes = 44 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:45}), true),  "bir saat",       "45 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:89}), true),  "bir saat",       "89 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:90}), true),  "2 saat",       "90 minutes = 2 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:5}), true),   "5 saat",       "5 hours = 5 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:21}), true),  "21 saat",      "21 hours = 21 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:22}), true),  "bir gün",         "22 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:35}), true),  "bir gün",         "35 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:36}), true),  "2 gün",        "36 hours = 2 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:1}), true),   "bir gün",         "1 day = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({d:5}), true),   "5 gün",        "5 days = 5 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:25}), true),  "25 gün",       "25 days = 25 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:26}), true),  "bir ay",       "26 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:30}), true),  "bir ay",       "30 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:45}), true),  "bir ay",       "45 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:46}), true),  "2 ay",      "46 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:74}), true),  "2 ay",      "75 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:76}), true),  "3 ay",      "76 days = 3 months");
        test.equal(start.from(moment([2007, 1, 28]).add({M:1}), true),   "bir ay",       "1 month = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({M:5}), true),   "5 ay",      "5 months = 5 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:344}), true), "11 ay",     "344 days = 11 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:345}), true), "bir yıl",        "345 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:547}), true), "bir yıl",        "547 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:548}), true), "2 yıl",       "548 days = 2 years");
        test.equal(start.from(moment([2007, 1, 28]).add({y:1}), true),   "bir yıl",        "1 year = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({y:5}), true),   "5 yıl",       "5 years = 5 years");
        test.done();
    },

    "suffix" : function(test) {
        test.expect(2);
        moment.lang('tr');
        test.equal(moment(30000).from(0), "birkaç saniye sonra",  "prefix");
        test.equal(moment(0).from(30000), "birkaç saniye önce", "suffix");
        test.done();
    },

    "now from now" : function(test) {
        test.expect(1);
        moment.lang('tr');
        test.equal(moment().fromNow(), "birkaç saniye önce",  "now from now should display as in the past");
        test.done();
    },

    "fromNow" : function(test) {
        test.expect(2);
        moment.lang('tr');
        test.equal(moment().add({s:30}).fromNow(), "birkaç saniye sonra", "in a few seconds");
        test.equal(moment().add({d:5}).fromNow(), "5 gün sonra", "in 5 days");
        test.done();
    },

    "calendar day" : function(test) {
        test.expect(6);
        moment.lang('tr');
    
        var a = moment().hours(2).minutes(0).seconds(0);
    
        test.equal(moment(a).calendar(),                     "bugün saat 02:00",     "today at the same time");
        test.equal(moment(a).add({ m: 25 }).calendar(),      "bugün saat 02:25",     "Now plus 25 min");
        test.equal(moment(a).add({ h: 1 }).calendar(),       "bugün saat 03:00",     "Now plus 1 hour");
        test.equal(moment(a).add({ d: 1 }).calendar(),       "yarın saat 02:00",  "tomorrow at the same time");
        test.equal(moment(a).subtract({ h: 1 }).calendar(),  "bugün saat 01:00",     "Now minus 1 hour");
        test.equal(moment(a).subtract({ d: 1 }).calendar(),  "dün 02:00", "yesterday at the same time");
        test.done();
    },

    "calendar next week" : function(test) {
        test.expect(15);
        moment.lang('tr');
    
        var i;
        var m;
    
        for (i = 2; i < 7; i++) {
            m = moment().add({ d: i });
            test.equal(m.calendar(),       m.format('[haftaya] dddd [saat] LT'),  "Today + " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('[haftaya] dddd [saat] LT'),  "Today + " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('[haftaya] dddd [saat] LT'),  "Today + " + i + " days end of day");
        }
        test.done();
    },

    "calendar last week" : function(test) {
        test.expect(15);
        moment.lang('tr');
    
        for (i = 2; i < 7; i++) {
            m = moment().subtract({ d: i });
            test.equal(m.calendar(),       m.format('[geçen hafta] dddd [saat] LT'),  "Today - " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('[geçen hafta] dddd [saat] LT'),  "Today - " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('[geçen hafta] dddd [saat] LT'),  "Today - " + i + " days end of day");
        }
        test.done();
    },

    "calendar all else" : function(test) {
        test.expect(4);
        moment.lang('tr');
        var weeksAgo = moment().subtract({ w: 1 });
        var weeksFromNow = moment().add({ w: 1 });
        
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "1 week ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 1 week");
    
        weeksAgo = moment().subtract({ w: 2 });
        weeksFromNow = moment().add({ w: 2 });
        
        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  "2 weeks ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 2 weeks");
    test.done();
    }
};var moment = require("../../moment");


    /**************************************************
      Traditional Chineseins
     *************************************************/

exports["lang:zh-cn"] = {
    "parse" : function(test) {
        test.expect(96);
        moment.lang('zh-cn');
        var tests = '一月 一月_二月 二月_三月 三月_四月 四月_五月 五月_六月 六月_七月 七月_八月 八月_九月 九月_十月 十月_十一月 十一月_十二月 十二月'.split("_");
        var i;
        function equalTest(input, mmm, i) {
            test.equal(moment(input, mmm).month(), i, input + ' should be month ' + (i + 1));
        }
        for (i = 0; i < 12; i++) {
            tests[i] = tests[i].split(' ');
            equalTest(tests[i][0], 'MMM', i);
            equalTest(tests[i][1], 'MMM', i);
            equalTest(tests[i][0], 'MMMM', i);
            equalTest(tests[i][1], 'MMMM', i);
            equalTest(tests[i][0].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][0].toLocaleUpperCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleUpperCase(), 'MMMM', i);
        }
        test.done();
    },

    "format" : function(test) {
        test.expect(18);
        moment.lang('zh-cn');
        var a = [
                ['dddd, MMMM Do YYYY, a h:mm:ss',      '星期日, 二月 14. 2010, 下午 3:25:50'],
                ['ddd, Ah',                            '周日, 下午3'],
                ['M Mo MM MMMM MMM',                   '2 2. 02 二月 二月'],
                ['YYYY YY',                            '2010 10'],
                ['D Do DD',                            '14 14. 14'],
                ['d do dddd ddd',                      '0 0. 星期日 周日'],
                ['DDD DDDo DDDD',                      '45 45. 045'],
                ['w wo ww',                            '8 8. 08'],
                ['h hh',                               '3 03'],
                ['H HH',                               '15 15'],
                ['m mm',                               '25 25'],
                ['s ss',                               '50 50'],
                ['a A',                                '下午 下午'],
                ['t\\he DDDo \\d\\ay of t\\he ye\\ar', 'the 45. day of the year'],
                ['L',                                  '14/02/2010'],
                ['LL',                                 '14 二月 2010'],
                ['LLL',                                '14 二月 2010 3:25 下午'],
                ['LLLL',                               '星期日, 14 二月 2010 3:25 下午']
            ],
            b = moment(new Date(2010, 1, 14, 15, 25, 50, 125)),
            i;
        for (i = 0; i < a.length; i++) {
            test.equal(b.format(a[i][0]), a[i][1], a[i][0] + ' ---> ' + a[i][1]);
        }
        test.done();
    },

    "format month" : function(test) {
        test.expect(12);
        moment.lang('zh-cn');
        var expected = '一月 一月_二月 二月_三月 三月_四月 四月_五月 五月_六月 六月_七月 七月_八月 八月_九月 九月_十月 十月_十一月 十一月_十二月 十二月'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, i, 0]).format('MMMM MMM'), expected[i], expected[i]);
        }
        test.done();
    },

    "format week" : function(test) {
        test.expect(7);
        moment.lang('zh-cn');
        var expected = '星期日 周日_星期一 周一_星期二 周二_星期三 周三_星期四 周四_星期五 周五_星期六 周六'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, 0, 2 + i]).format('dddd ddd'), expected[i], expected[i]);
        }
        test.done();
    },

    "from" : function(test) {
        test.expect(30);
        moment.lang('zh-cn');
        var start = moment([2007, 1, 28]);
        test.equal(start.from(moment([2007, 1, 28]).add({s:44}), true),  "数秒",   "44 seconds = a few seconds");
        test.equal(start.from(moment([2007, 1, 28]).add({s:45}), true),  "一分钟", "45 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:89}), true),  "一分钟", "89 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:90}), true),  "2分钟",  "90 seconds = 2 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:44}), true),  "44分钟", "44 minutes = 44 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:45}), true),  "一小时", "45 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:89}), true),  "一小时", "89 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:90}), true),  "2小时",  "90 minutes = 2 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:5}), true),   "5小时",  "5 hours = 5 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:21}), true),  "21小时", "21 hours = 21 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:22}), true),  "一天",   "22 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:35}), true),  "一天",   "35 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:36}), true),  "2天",   "36 hours = 2 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:1}), true),   "一天",   "1 day = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({d:5}), true),   "5天",   "5 days = 5 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:25}), true),  "25天",  "25 days = 25 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:26}), true),  "一个月", "26 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:30}), true),  "一个月", "30 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:45}), true),  "一个月", "45 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:46}), true),  "2月",  "46 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:74}), true),  "2月",  "75 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:76}), true),  "3月",  "76 days = 3 months");
        test.equal(start.from(moment([2007, 1, 28]).add({M:1}), true),   "一个月", "1 month = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({M:5}), true),   "5月",  "5 months = 5 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:344}), true), "11月", "344 days = 11 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:345}), true), "一年",   "345 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:547}), true), "一年",   "547 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:548}), true), "2年",   "548 days = 2 years");
        test.equal(start.from(moment([2007, 1, 28]).add({y:1}), true),   "一年",   "1 year = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({y:5}), true),   "5年",   "5 years = 5 years");
        test.done();
    },

    "suffix" : function(test) {
        test.expect(2);
        moment.lang('zh-cn');
        test.equal(moment(30000).from(0), "数秒后",  "prefix");
        test.equal(moment(0).from(30000), "数秒前", "suffix");
        test.done();
    },

    "now from now" : function(test) {
        test.expect(1);
        moment.lang('zh-cn');
        test.equal(moment().fromNow(), "数秒前",  "now from now should display as in the past");
        test.done();
    },

    "fromNow" : function(test) {
        test.expect(2);
        moment.lang('zh-cn');
        test.equal(moment().add({s:30}).fromNow(), "数秒后", "in a few seconds");
        test.equal(moment().add({d:5}).fromNow(), "5天后", "in 5 days");
        test.done();
    },

    "calendar day" : function(test) {
        test.expect(6);
        moment.lang('zh-cn');

        var a = moment().hours(2).minutes(0).seconds(0);

        test.equal(moment(a).calendar(),                     "今天 2:00 上午",     "today at the same time");
        test.equal(moment(a).add({ m: 25 }).calendar(),      "今天 2:25 上午",     "Now plus 25 min");
        test.equal(moment(a).add({ h: 1 }).calendar(),       "今天 3:00 上午",     "Now plus 1 hour");
        test.equal(moment(a).add({ d: 1 }).calendar(),       "明天 2:00 上午",     "tomorrow at the same time");
        test.equal(moment(a).subtract({ h: 1 }).calendar(),  "今天 1:00 上午",     "Now minus 1 hour");
        test.equal(moment(a).subtract({ d: 1 }).calendar(),  "昨天 2:00 上午",     "yesterday at the same time");
        test.done();
    },

    "calendar next week" : function(test) {
        test.expect(15);
        moment.lang('zh-cn');

        var i;
        var m;

        for (i = 2; i < 7; i++) {
            m = moment().add({ d: i });
            test.equal(m.calendar(),       m.format('[下]dddd LT'),  "Today + " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('[下]dddd LT'),  "Today + " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('[下]dddd LT'),  "Today + " + i + " days end of day");
        }
        test.done();
    },

    "calendar last week" : function(test) {
        test.expect(15);
        moment.lang('zh-cn');

        for (i = 2; i < 7; i++) {
            m = moment().subtract({ d: i });
            test.equal(m.calendar(),       m.format('[上]dddd LT'),  "Today - " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('[上]dddd LT'),  "Today - " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('[上]dddd LT'),  "Today - " + i + " days end of day");
        }
        test.done();
    },

    "calendar all else" : function(test) {
        test.expect(4);
        moment.lang('zh-cn');
        var weeksAgo = moment().subtract({ w: 1 });
        var weeksFromNow = moment().add({ w: 1 });

        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),      "1 week ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 1 week");

        weeksAgo = moment().subtract({ w: 2 });
        weeksFromNow = moment().add({ w: 2 });

        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),      "2 weeks ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 2 weeks");
    test.done();
    }
};var moment = require("../../moment");


    /**************************************************
      Traditional Chineseins
     *************************************************/

exports["lang:zh-tw"] = {
    "parse" : function(test) {
        test.expect(96);
        moment.lang('zh-tw');
        var tests = '一月 一月_二月 二月_三月 三月_四月 四月_五月 五月_六月 六月_七月 七月_八月 八月_九月 九月_十月 十月_十一月 十一月_十二月 十二月'.split("_");
        var i;
        function equalTest(input, mmm, i) {
            test.equal(moment(input, mmm).month(), i, input + ' should be month ' + (i + 1));
        }
        for (i = 0; i < 12; i++) {
            tests[i] = tests[i].split(' ');
            equalTest(tests[i][0], 'MMM', i);
            equalTest(tests[i][1], 'MMM', i);
            equalTest(tests[i][0], 'MMMM', i);
            equalTest(tests[i][1], 'MMMM', i);
            equalTest(tests[i][0].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleLowerCase(), 'MMMM', i);
            equalTest(tests[i][0].toLocaleUpperCase(), 'MMMM', i);
            equalTest(tests[i][1].toLocaleUpperCase(), 'MMMM', i);
        }
        test.done();
    },

    "format" : function(test) {
        test.expect(18);
        moment.lang('zh-tw');
        var a = [
                ['dddd, MMMM Do YYYY, a h:mm:ss',      '星期日, 二月 14 2010, 下午 3:25:50'],
                ['ddd, Ah',                            '週日, 下午3'],
                ['M Mo MM MMMM MMM',                   '2 2 02 二月 二月'],
                ['YYYY YY',                            '2010 10'],
                ['D Do DD',                            '14 14 14'],
                ['d do dddd ddd',                      '0 0 星期日 週日'],
                ['DDD DDDo DDDD',                      '45 45 045'],
                ['w wo ww',                            '8 8 08'],
                ['h hh',                               '3 03'],
                ['H HH',                               '15 15'],
                ['m mm',                               '25 25'],
                ['s ss',                               '50 50'],
                ['a A',                                '下午 下午'],
                ['t\\he DDDo \\d\\ay of t\\he ye\\ar', 'the 45 day of the year'],
                ['L',                                  '14/02/2010'],
                ['LL',                                 '14 二月 2010'],
                ['LLL',                                '14 二月 2010 3:25 下午'],
                ['LLLL',                               '星期日, 14 二月 2010 3:25 下午']
            ],
            b = moment(new Date(2010, 1, 14, 15, 25, 50, 125)),
            i;
        for (i = 0; i < a.length; i++) {
            test.equal(b.format(a[i][0]), a[i][1], a[i][0] + ' ---> ' + a[i][1]);
        }
        test.done();
    },

    "format month" : function(test) {
        test.expect(12);
        moment.lang('zh-tw');
        var expected = '一月 一月_二月 二月_三月 三月_四月 四月_五月 五月_六月 六月_七月 七月_八月 八月_九月 九月_十月 十月_十一月 十一月_十二月 十二月'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, i, 0]).format('MMMM MMM'), expected[i], expected[i]);
        }
        test.done();
    },

    "format week" : function(test) {
        test.expect(7);
        moment.lang('zh-tw');
        var expected = '星期日 週日_星期一 週一_星期二 週二_星期三 週三_星期四 週四_星期五 週五_星期六 週六'.split("_");
        var i;
        for (i = 0; i < expected.length; i++) {
            test.equal(moment([2011, 0, 2 + i]).format('dddd ddd'), expected[i], expected[i]);
        }
        test.done();
    },

    "from" : function(test) {
        test.expect(30);
        moment.lang('zh-tw');
        var start = moment([2007, 1, 28]);
        test.equal(start.from(moment([2007, 1, 28]).add({s:44}), true),  "幾秒",   "44 seconds = a few seconds");
        test.equal(start.from(moment([2007, 1, 28]).add({s:45}), true),  "一分鐘", "45 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:89}), true),  "一分鐘", "89 seconds = a minute");
        test.equal(start.from(moment([2007, 1, 28]).add({s:90}), true),  "2分鐘",  "90 seconds = 2 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:44}), true),  "44分鐘", "44 minutes = 44 minutes");
        test.equal(start.from(moment([2007, 1, 28]).add({m:45}), true),  "一小時", "45 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:89}), true),  "一小時", "89 minutes = an hour");
        test.equal(start.from(moment([2007, 1, 28]).add({m:90}), true),  "2小時",  "90 minutes = 2 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:5}), true),   "5小時",  "5 hours = 5 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:21}), true),  "21小時", "21 hours = 21 hours");
        test.equal(start.from(moment([2007, 1, 28]).add({h:22}), true),  "一天",   "22 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:35}), true),  "一天",   "35 hours = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({h:36}), true),  "2天",   "36 hours = 2 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:1}), true),   "一天",   "1 day = a day");
        test.equal(start.from(moment([2007, 1, 28]).add({d:5}), true),   "5天",   "5 days = 5 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:25}), true),  "25天",  "25 days = 25 days");
        test.equal(start.from(moment([2007, 1, 28]).add({d:26}), true),  "一個月", "26 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:30}), true),  "一個月", "30 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:45}), true),  "一個月", "45 days = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({d:46}), true),  "2個月",  "46 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:74}), true),  "2個月",  "75 days = 2 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:76}), true),  "3個月",  "76 days = 3 months");
        test.equal(start.from(moment([2007, 1, 28]).add({M:1}), true),   "一個月", "1 month = a month");
        test.equal(start.from(moment([2007, 1, 28]).add({M:5}), true),   "5個月",  "5 months = 5 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:344}), true), "11個月", "344 days = 11 months");
        test.equal(start.from(moment([2007, 1, 28]).add({d:345}), true), "一年",   "345 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:547}), true), "一年",   "547 days = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({d:548}), true), "2年",   "548 days = 2 years");
        test.equal(start.from(moment([2007, 1, 28]).add({y:1}), true),   "一年",   "1 year = a year");
        test.equal(start.from(moment([2007, 1, 28]).add({y:5}), true),   "5年",   "5 years = 5 years");
        test.done();
    },

    "suffix" : function(test) {
        test.expect(2);
        moment.lang('zh-tw');
        test.equal(moment(30000).from(0), "幾秒後",  "prefix");
        test.equal(moment(0).from(30000), "幾秒前", "suffix");
        test.done();
    },

    "now from now" : function(test) {
        test.expect(1);
        moment.lang('zh-tw');
        test.equal(moment().fromNow(), "幾秒前",  "now from now should display as in the past");
        test.done();
    },

    "fromNow" : function(test) {
        test.expect(2);
        moment.lang('zh-tw');
        test.equal(moment().add({s:30}).fromNow(), "幾秒後", "in a few seconds");
        test.equal(moment().add({d:5}).fromNow(), "5天後", "in 5 days");
        test.done();
    },

    "calendar day" : function(test) {
        test.expect(6);
        moment.lang('zh-tw');

        var a = moment().hours(2).minutes(0).seconds(0);

        test.equal(moment(a).calendar(),                     "今天 2:00 上午",     "today at the same time");
        test.equal(moment(a).add({ m: 25 }).calendar(),      "今天 2:25 上午",     "Now plus 25 min");
        test.equal(moment(a).add({ h: 1 }).calendar(),       "今天 3:00 上午",     "Now plus 1 hour");
        test.equal(moment(a).add({ d: 1 }).calendar(),       "明天 2:00 上午",     "tomorrow at the same time");
        test.equal(moment(a).subtract({ h: 1 }).calendar(),  "今天 1:00 上午",     "Now minus 1 hour");
        test.equal(moment(a).subtract({ d: 1 }).calendar(),  "昨天 2:00 上午",     "yesterday at the same time");
        test.done();
    },

    "calendar next week" : function(test) {
        test.expect(15);
        moment.lang('zh-tw');

        var i;
        var m;

        for (i = 2; i < 7; i++) {
            m = moment().add({ d: i });
            test.equal(m.calendar(),       m.format('[下]dddd LT'),  "Today + " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('[下]dddd LT'),  "Today + " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('[下]dddd LT'),  "Today + " + i + " days end of day");
        }
        test.done();
    },

    "calendar last week" : function(test) {
        test.expect(15);
        moment.lang('zh-tw');

        for (i = 2; i < 7; i++) {
            m = moment().subtract({ d: i });
            test.equal(m.calendar(),       m.format('[上]dddd LT'),  "Today - " + i + " days current time");
            m.hours(0).minutes(0).seconds(0).milliseconds(0);
            test.equal(m.calendar(),       m.format('[上]dddd LT'),  "Today - " + i + " days beginning of day");
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            test.equal(m.calendar(),       m.format('[上]dddd LT'),  "Today - " + i + " days end of day");
        }
        test.done();
    },

    "calendar all else" : function(test) {
        test.expect(4);
        moment.lang('zh-tw');
        var weeksAgo = moment().subtract({ w: 1 });
        var weeksFromNow = moment().add({ w: 1 });

        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),      "1 week ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 1 week");

        weeksAgo = moment().subtract({ w: 2 });
        weeksFromNow = moment().add({ w: 2 });

        test.equal(weeksAgo.calendar(),       weeksAgo.format('L'),      "2 weeks ago");
        test.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  "in 2 weeks");
    test.done();
    }
};(function(){
    var banner = $('#nodeunit-banner');
    var tests = $('#nodeunit-tests');

    $('#nodeunit-userAgent').html(navigator.userAgent);

    var start = moment();
    var passed = 0;
    var failed = 0;

    function updateTest(_passed, _failed) {
        var duration = moment().diff(start);
        passed += _passed;
        failed += _failed;
        if (failed) {
            banner.removeClass('alert-info');
            banner.addClass('alert-error');
        }
        banner.html('<h3>' + passed + ' passed.</h3><h3>' + failed + ' failed.</h3><h3>' + duration + ' milliseconds.</h3>');
    }

    nodeunit.runModules(exports, {
        moduleStart : function (name) {
            tests.append('<h3>' + name + '</h3>');
        },
        testDone : function (name, assertions) {
            var testEl = $('<li>'),
                testHtml = '',
                assertUl = $('<ul>'),
                assertLi,
                assertHtml = '';
                assert;
            
            // each test
            testHtml += '<div><strong>' + name + '</strong> ';
            if (assertions.failures()) {
                testEl.addClass('fail open');
                testHtml += assertions.passes() + ' passed,';
                testHtml += assertions.failures() + ' failed.</div>';
            } else {
                testHtml += 'All ' + assertions.passes() + ' passed.</div>';
            }
            testEl.addClass('test');
            testEl.html(testHtml);

            // each assert
            for (var i = 0; i < assertions.length; i++) {
                assertLi = $('<li>');
                assertHtml = '';
                assert = assertions[i];
                if (assert.failed()) {
                    assertHtml += (assert.message || assert.method || 'no message');
                    assertHtml += '<pre>' + (assert.error.stack || assert.error) + '</pre>';
                    assertLi.html(assertHtml);
                    assertLi.addClass('fail');
                } else {
                    assertLi.html(assert.message || assert.method || 'no message');
                    assertLi.addClass('pass');
                }
                assertUl.append(assertLi);
            }

            testEl.append(assertUl);
            tests.append(testEl);
            updateTest(assertions.passes(), assertions.failures());
        },
        done : function (assertions) {
            var duration = moment().diff(start);
            var failures = assertions.failures();

            if (failures || true) {
                banner.after("<p class='alert alert-error'>Hmm, looks like some of the unit tests are failing.<br/><br/>" +
                    "It's hard to catch all the bugs across all timezones, so if you have a minute, " + 
                    "please submit an issue with your user agent, timezone, and the failing test here.<br/><br/>" + 
                    "<a class='btn' href='https://github.com/timrwood/moment/issues'>github.com/timrwood/moment/issues</a>" + 
                    "<br/><br/>Thanks!</p>");
            }

            banner.addClass(failures ? 'fail': 'pass');
            updateTest(assertions.passes(), assertions.failures() + 1);
        }
    });

    tests.on('click', 'li.test', {}, function(){
        $(this).toggleClass('open');
    });
})();