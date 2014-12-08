/*
 Copyright 2014, KISSY v1.41
 MIT Licensed
 build time: Jan 6 13:21
 */
/**
 * @ignore
 * A seed where KISSY grows up from, KISS Yeah !
 * @author https://github.com/kissyteam/kissy/contributors
 */

/**
 * The KISSY global namespace object. you can use
 *
 *
 *      KISSY.each/mix
 *
 * to do basic operation. or
 *
 *
 *      KISSY.use('overlay,node', function(S, Overlay, Node){
 *          //
 *      });
 *
 * to do complex task with modules.
 * @singleton
 * @class KISSY
 */
/* exported KISSY */
/*jshint -W079 */
var KISSY = (function (undefined) {
    var host = this,
        S,
        guid = 0,
        EMPTY = '';

    /**
     * Log class for specified logger
     * @class KISSY.Logger
     * @private
     */

    /**
     * print debug log
     * @method
     * @param {String} str log str
     */

    /**
     * print info log
     * @method
     * @param {String} str log str
     */

    /**
     * print warn log
     * @method
     * @param {String} str log str
     */

    /**
     * print error log
     * @method
     * @param {String} str log str
     */

    function getLogger(logger) {
        var obj = {};
        for (var cat in loggerLevel) {
            /*jshint loopfunc: true*/
            (function (obj, cat) {
                obj[cat] = function (msg) {
                    return S.log(msg, cat, logger);
                };
            })(obj, cat);
        }
        return obj;
    }

    var loggerLevel = {
        'debug': 10,
        'info': 20,
        'warn': 30,
        'error': 40
    };

    S = {
        /**
         * The build time of the library.
         * NOTICE: '20140106132044' will replace with current timestamp when compressing.
         * @private
         * @type {String}
         */
        __BUILD_TIME: '20140106132044',

        /**
         * KISSY Environment.
         * @private
         * @type {Object}
         */
        Env: {
            host: host
        },

        /**
         * KISSY Config.
         * If load kissy.js, Config.debug defaults to true.
         * Else If load kissy-min.js, Config.debug defaults to false.
         * @private
         * @property {Object} Config
         * @property {Boolean} Config.debug
         * @member KISSY
         */
        Config: {
            debug: '@DEBUG@',
            fns: {}
        },

        /**
         * The version of the library.
         * NOTICE: '1.41' will replace with current version when compressing.
         * @type {String}
         */
        version: '1.41',

        /**
         * set KISSY configuration
         * @param {Object|String} configName Config object or config key.
         * @param {String} configName.base KISSY 's base path. Default: get from kissy(-min).js or seed(-min).js
         * @param {String} configName.tag KISSY 's timestamp for native module. Default: KISSY 's build time.
         * @param {Boolean} configName.debug whether to enable debug mod.
         * @param {Boolean} configName.combine whether to enable combo.
         * @param {Object} configName.logger logger config
         * @param {Object[]} configName.logger.excludes  exclude configs
         * @param {Object} configName.logger.excludes.0 a single exclude config
         * @param {RegExp} configName.logger.excludes.0.logger  matched logger will be excluded from logging
         * @param {KISSY.Logger.Level} configName.logger.excludes.0.minLevel  minimum logger level
         * @param {KISSY.Logger.Level} configName.logger.excludes.0.maxLevel  maximum logger level
         * @param {Object[]} configName.logger.includes include configs
         * @param {Object} configName.logger.includes.0 a single include config
         * @param {RegExp} configName.logger.includes.0.logger  matched logger will be included from logging
         * @param {KISSY.Logger.Level} configName.logger.excludes.0.minLevel  minimum logger level
         * @param {KISSY.Logger.Level} configName.logger.excludes.0.maxLevel  maximum logger level
         * @param {Object} configName.packages Packages definition with package name as the key.
         * @param {String} configName.packages.base Package base path.
         * @param {String} configName.packages.tag  Timestamp for this package's module file.
         * @param {String} configName.packages.debug Whether force debug mode for current package.
         * @param {String} configName.packages.combine Whether allow combine for current package modules.
         * @param {String} [configName.packages.ignorePackageNameInUri=false] whether remove packageName from module request uri,
         * can only be used in production mode.
         * @param [configValue] config value.
         *
         * for example:
         *     @example
         *     KISSY.config({
         *      combine: true,
         *      base: '',
         *      packages: {
         *          'gallery': {
         *              base: 'http://a.tbcdn.cn/s/kissy/gallery/'
         *          }
         *      },
         *      modules: {
         *          'gallery/x/y': {
         *              requires: ['gallery/x/z']
         *          }
         *      }
         *     });
         */
        config: function (configName, configValue) {
            var cfg,
                r,
                self = this,
                fn,
                Config = S.Config,
                configFns = Config.fns;
            if (S.isObject(configName)) {
                S.each(configName, function (configValue, p) {
                    fn = configFns[p];
                    if (fn) {
                        fn.call(self, configValue);
                    } else {
                        Config[p] = configValue;
                    }
                });
            } else {
                cfg = configFns[configName];
                if (configValue === undefined) {
                    if (cfg) {
                        r = cfg.call(self);
                    } else {
                        r = Config[configName];
                    }
                } else {
                    if (cfg) {
                        r = cfg.call(self, configValue);
                    } else {
                        Config[configName] = configValue;
                    }
                }
            }
            return r;
        },

        /**
         * Prints debug info.
         * @param msg {String} the message to log.
         * @param {String} [cat] the log category for the message. Default
         *        categories are 'info', 'warn', 'error', 'time' etc.
         * @param {String} [logger] the logger of the the message (opt)
         */
        log: function (msg, cat, logger) {
            if ('@DEBUG@') {
                var matched = 1;
                if (logger) {
                    var loggerCfg = S.Config.logger || {},
                        list, i, l, level, minLevel, maxLevel, reg;
                    cat = cat || 'debug';
                    level = loggerLevel[cat] || loggerLevel.debug;
                    if ((list = loggerCfg.includes)) {
                        matched = 0;
                        for (i = 0; i < list.length; i++) {
                            l = list[i];
                            reg = l.logger;
                            maxLevel = loggerLevel[l.maxLevel] || loggerLevel.error;
                            minLevel = loggerLevel[l.minLevel] || loggerLevel.debug;
                            if (minLevel <= level && maxLevel >= level && logger.match(reg)) {
                                matched = 1;
                                break;
                            }
                        }
                    } else if ((list = loggerCfg.excludes)) {
                        matched = 1;
                        for (i = 0; i < list.length; i++) {
                            l = list[i];
                            reg = l.logger;
                            maxLevel = loggerLevel[l.maxLevel] || loggerLevel.error;
                            minLevel = loggerLevel[l.minLevel] || loggerLevel.debug;
                            if (minLevel <= level && maxLevel >= level && logger.match(reg)) {
                                matched = 0;
                                break;
                            }
                        }
                    }
                    if (matched) {
                        msg = logger + ': ' + msg;
                    }
                }
                /*global console*/
                if (typeof console !== 'undefined' && console.log && matched) {
                    console[cat && console[cat] ? cat : 'log'](msg);
                    return msg;
                }
            }
            return undefined;
        },

        /**
         * get log instance for specified logger
         * @param {String} logger logger name
         * @returns {KISSY.Logger} log instance
         */
        'getLogger': function (logger) {
            return getLogger(logger);
        },

        /**
         * Throws error message.
         */
        error: function (msg) {
            if ('@DEBUG@') {
                // with stack info!
                throw msg instanceof  Error ? msg : new Error(msg);
            }
        },

        /*
         * Generate a global unique id.
         * @param {String} [pre] guid prefix
         * @return {String} the guid
         */
        guid: function (pre) {
            return (pre || EMPTY) + guid++;
        }
    };

    if ('@DEBUG@') {
        S.Config.logger = {
            excludes: [
                {
                    logger: /^s\/.*/,
                    maxLevel: 'info',
                    minLevel: 'debug'
                }
            ]
        };
    }

    /**
     * Logger level enum
     * @enum {String} KISSY.Logger.Level
     */
    S.Logger = /**@type Function
     @ignore */{};
    S.Logger.Level = {
        /**
         * debug level
         */
        'DEBUG': 'debug',
        /**
         * info level
         */
        INFO: 'info',
        /**
         * warn level
         */
        WARN: 'warn',
        /**
         * error level
         */
        ERROR: 'error'
    };

    return S;
})();/**
 * @ignore
 * object utilities of lang
 * @author yiminghe@gmail.com
 *
 */
(function (S, undefined) {
    var logger = S.getLogger('s/lang');
    var MIX_CIRCULAR_DETECTION = '__MIX_CIRCULAR',
        STAMP_MARKER = '__~ks_stamped',
        host = this,
        TRUE = true,
        EMPTY = '',
        Obj = Object,

        objectCreate = Obj.create,
    // error in native ie678, not in simulated ie9
        hasEnumBug = !({toString: 1}.propertyIsEnumerable('toString')),
        enumProperties = [
            'constructor',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'toString',
            'toLocaleString',
            'valueOf'
        ];

    mix(S, {
        /**
         * stamp a object by guid
         * @param {Object} o object needed to be stamped
         * @param {Boolean} [readOnly] while set marker on o if marker does not exist
         * @param {String} [marker] the marker will be set on Object
         * @return {String} guid associated with this object
         * @member KISSY
         */
        stamp: function (o, readOnly, marker) {
            marker = marker || STAMP_MARKER;
            var guid = o[marker];
            if (guid) {
                return guid;
            } else if (!readOnly) {
                try {
                    guid = o[marker] = S.guid(marker);
                }
                catch (e) {
                    guid = undefined;
                }
            }
            return guid;
        },


        /**
         * Get all the property names of o as array
         * @param {Object} o
         * @return {Array}
         * @member KISSY
         */
        keys: Obj.keys || function (o) {
            var result = [], p, i;

            for (p in o) {
                // S.keys(new XX())
                if (o.hasOwnProperty(p)) {
                    result.push(p);
                }
            }

            if (hasEnumBug) {
                for (i = enumProperties.length - 1; i >= 0; i--) {
                    p = enumProperties[i];
                    if (o.hasOwnProperty(p)) {
                        result.push(p);
                    }
                }
            }

            return result;
        },


        /**
         * Copies all the properties of s to r.
         * @method
         * @param {Object} r the augmented object
         * @param {Object} s the object need to augment
         * @param {Boolean|Object} [ov=TRUE] whether overwrite existing property or config.
         * @param {Boolean} [ov.overwrite=TRUE] whether overwrite existing property.
         * @param {String[]|Function} [ov.whitelist] array of white-list properties
         * @param {Boolean}[ov.deep=false] whether recursive mix if encounter object.
         * @param {String[]|Function} [wl] array of white-list properties
         * @param [deep=false] {Boolean} whether recursive mix if encounter object.
         * @return {Object} the augmented object
         * @member KISSY
         *
         * for example:
         *     @example
         *     var t = {};
         *     S.mix({x: {y: 2, z: 4}}, {x: {y: 3, a: t}}, {deep: TRUE}) => {x: {y: 3, z: 4, a: {}}}, a !== t
         *     S.mix({x: {y: 2, z: 4}}, {x: {y: 3, a: t}}, {deep: TRUE, overwrite: false}) => {x: {y: 2, z: 4, a: {}}}, a !== t
         *     S.mix({x: {y: 2, z: 4}}, {x: {y: 3, a: t}}, 1) => {x: {y: 3, a: t}}
         */
        mix: function (r, s, ov, wl, deep) {
            if (typeof ov === 'object') {
                wl = /**
                 @ignore
                 @type {String[]|Function}
                 */ov.whitelist;
                deep = ov.deep;
                ov = ov.overwrite;
            }

            if (wl && (typeof wl !== 'function')) {
                var originalWl = wl;
                wl = function (name, val) {
                    return S.inArray(name, originalWl) ? val : undefined;
                };
            }

            if (ov === undefined) {
                ov = TRUE;
            }

            var cache = [],
                c,
                i = 0;
            mixInternal(r, s, ov, wl, deep, cache);
            while ((c = cache[i++])) {
                delete c[MIX_CIRCULAR_DETECTION];
            }
            return r;
        },

        /**
         * Returns a new object containing all of the properties of
         * all the supplied objects. The properties from later objects
         * will overwrite those in earlier objects. Passing in a
         * single object will create a shallow copy of it.
         * @param {...Object} varArgs objects need to be merged
         * @return {Object} the new merged object
         * @member KISSY
         */
        merge: function (varArgs) {
            varArgs = S.makeArray(arguments);
            var o = {},
                i,
                l = varArgs.length;
            for (i = 0; i < l; i++) {
                S.mix(o, varArgs[i]);
            }
            return o;
        },

        /**
         * Applies prototype properties from the supplier to the receiver.
         * @param   {Object} r received object
         * @param   {...Object} varArgs object need to  augment
         *          {Boolean} [ov=TRUE] whether overwrite existing property
         *          {String[]} [wl] array of white-list properties
         * @return  {Object} the augmented object
         * @member KISSY
         */
        augment: function (r, varArgs) {
            var args = S.makeArray(arguments),
                len = args.length - 2,
                i = 1,
                proto,
                arg,
                ov = args[len],
                wl = args[len + 1];

            args[1] = varArgs;

            if (!S.isArray(wl)) {
                ov = wl;
                wl = undefined;
                len++;
            }
            if (typeof ov !== 'boolean') {
                ov = undefined;
                len++;
            }

            for (; i < len; i++) {
                arg = args[i];
                if ((proto = arg.prototype)) {
                    arg = S.mix({}, proto, true, removeConstructor);
                }
                S.mix(r.prototype, arg, ov, wl);
            }

            return r;
        },

        /**
         * Utility to set up the prototype, constructor and superclass properties to
         * support an inheritance strategy that can chain constructors and methods.
         * Static members will not be inherited.
         * @param r {Function} the object to modify
         * @param s {Function} the object to inherit
         * @param {Object} [px] prototype properties to add/override
         * @param {Object} [sx] static properties to add/override
         * @return r {Object}
         * @member KISSY
         */
        extend: function (r, s, px, sx) {
            if ('@DEBUG@') {
                if (!r) {
                    logger.error('extend r is null');
                }
                if (!s) {
                    logger.error('extend s is null');
                }
                if (!s || !r) {
                    return r;
                }
            }

            var sp = s.prototype,
                rp;

            // in case parent does not set constructor
            // eg: parent.prototype={};
            sp.constructor = s;

            // add prototype chain
            rp = createObject(sp, r);
            r.prototype = S.mix(rp, r.prototype);
            r.superclass = sp;

            // add prototype overrides
            if (px) {
                S.mix(rp, px);
            }

            // add object overrides
            if (sx) {
                S.mix(r, sx);
            }

            return r;
        },


        /**
         * Returns the namespace specified and creates it if it doesn't exist. Be careful
         * when naming packages. Reserved words may work in some browsers and not others.
         *
         * for example:
         *      @example
         *      S.namespace('KISSY.app'); // returns KISSY.app
         *      S.namespace('app.Shop'); // returns KISSY.app.Shop
         *      S.namespace('TB.app.Shop', TRUE); // returns TB.app.Shop
         *
         * @return {Object}  A reference to the last namespace object created
         * @member KISSY
         */
        namespace: function () {
            var args = S.makeArray(arguments),
                l = args.length,
                o = null, i, j, p,
                global = (args[l - 1] === TRUE && l--);

            for (i = 0; i < l; i++) {
                p = (EMPTY + args[i]).split('.');
                o = global ? host : this;
                for (j = (host[p[0]] === o) ? 1 : 0; j < p.length; ++j) {
                    o = o[p[j]] = o[p[j]] || { };
                }
            }
            return o;
        }

    });

    function Empty() {
    }

    function createObject(proto, constructor) {
        var newProto;
        if (objectCreate) {
            newProto = objectCreate(proto);
        } else {
            Empty.prototype = proto;
            newProto = new Empty();
        }
        newProto.constructor = constructor;
        return newProto;
    }

    function mix(r, s) {
        for (var i in s) {
            r[i] = s[i];
        }
    }

    function mixInternal(r, s, ov, wl, deep, cache) {
        if (!s || !r) {
            return r;
        }
        var i, p, keys, len;

        // 记录循环标志
        s[MIX_CIRCULAR_DETECTION] = r;

        // 记录被记录了循环标志的对像
        cache.push(s);

        // mix all properties
        keys = S.keys(s);
        len = keys.length;
        for (i = 0; i < len; i++) {
            p = keys[i];
            if (p !== MIX_CIRCULAR_DETECTION) {
                // no hasOwnProperty judge!
                _mix(p, r, s, ov, wl, deep, cache);
            }
        }

        return r;
    }

    function removeConstructor(k, v) {
        return k === 'constructor' ? undefined : v;
    }

    function _mix(p, r, s, ov, wl, deep, cache) {
        // 要求覆盖
        // 或者目的不存在
        // 或者深度mix
        if (ov || !(p in r) || deep) {
            var target = r[p],
                src = s[p];
            // prevent never-end loop
            if (target === src) {
                // S.mix({},{x:undefined})
                if (target === undefined) {
                    r[p] = target;
                }
                return;
            }
            if (wl) {
                src = wl.call(s, p, src);
            }
            // 来源是数组和对象，并且要求深度 mix
            if (deep && src && (S.isArray(src) || S.isPlainObject(src))) {
                if (src[MIX_CIRCULAR_DETECTION]) {
                    r[p] = src[MIX_CIRCULAR_DETECTION];
                } else {
                    // 目标值为对象或数组，直接 mix
                    // 否则 新建一个和源值类型一样的空数组/对象，递归 mix
                    var clone = target && (S.isArray(target) || S.isPlainObject(target)) ?
                        target :
                        (S.isArray(src) ? [] : {});
                    r[p] = clone;
                    mixInternal(clone, src, ov, wl, TRUE, cache);
                }
            } else if (src !== undefined && (ov || !(p in r))) {
                r[p] = src;
            }
        }
    }
})(KISSY);/**
 * @ignore
 * array utilities of lang
 * @author yiminghe@gmail.com
 *
 */
(function (S, undefined) {

    var TRUE = true,
        AP = Array.prototype,
        indexOf = AP.indexOf,
        lastIndexOf = AP.lastIndexOf,
        filter = AP.filter,
        every = AP.every,
        some = AP.some,
        map = AP.map,
        FALSE = false;

    S.mix(S, {
        /**
         * Executes the supplied function on each item in the array.
         * @param object {Object} the object to iterate
         * @param fn {Function} the function to execute on each item. The function
         *        receives three arguments: the value, the index, the full array.
         * @param {Object} [context]
         * @member KISSY
         */
        each: function (object, fn, context) {
            if (object) {
                var key,
                    val,
                    keys,
                    i = 0,
                    length = object && object.length,
                // do not use typeof obj == 'function': bug in phantomjs
                    isObj = length === undefined || S.type(object) === 'function';

                context = context || null;

                if (isObj) {
                    keys = S.keys(object);
                    for (; i < keys.length; i++) {
                        key = keys[i];
                        // can not use hasOwnProperty
                        if (fn.call(context, object[key], key, object) === FALSE) {
                            break;
                        }
                    }
                } else {
                    for (val = object[0];
                         i < length; val = object[++i]) {
                        if (fn.call(context, val, i, object) === FALSE) {
                            break;
                        }
                    }
                }
            }
            return object;
        },

        /**
         * Search for a specified value within an array.
         * @param item individual item to be searched
         * @method
         * @member KISSY
         * @param {Array} arr the array of items where item will be search
         * @return {number} item's index in array
         */
        indexOf: indexOf ?
            function (item, arr) {
                return indexOf.call(arr, item);
            } :
            function (item, arr) {
                for (var i = 0, len = arr.length; i < len; ++i) {
                    if (arr[i] === item) {
                        return i;
                    }
                }
                return -1;
            },

        /**
         * Returns the index of the last item in the array
         * that contains the specified value, -1 if the
         * value isn't found.
         * @method
         * @param item individual item to be searched
         * @param {Array} arr the array of items where item will be search
         * @return {number} item's last index in array
         * @member KISSY
         */
        lastIndexOf: (lastIndexOf) ?
            function (item, arr) {
                return lastIndexOf.call(arr, item);
            } :
            function (item, arr) {
                for (var i = arr.length - 1; i >= 0; i--) {
                    if (arr[i] === item) {
                        break;
                    }
                }
                return i;
            },

        /**
         * Returns a copy of the array with the duplicate entries removed
         * @param a {Array} the array to find the subset of unique for
         * @param [override] {Boolean} if override is TRUE, S.unique([a, b, a]) => [b, a].
         * if override is FALSE, S.unique([a, b, a]) => [a, b]
         * @return {Array} a copy of the array with duplicate entries removed
         * @member KISSY
         */
        unique: function (a, override) {
            var b = a.slice();
            if (override) {
                b.reverse();
            }
            var i = 0,
                n,
                item;

            while (i < b.length) {
                item = b[i];
                while ((n = S.lastIndexOf(item, b)) !== i) {
                    b.splice(n, 1);
                }
                i += 1;
            }

            if (override) {
                b.reverse();
            }
            return b;
        },

        /**
         * Search for a specified value index within an array.
         * @param item individual item to be searched
         * @param {Array} arr the array of items where item will be search
         * @return {Boolean} the item exists in arr
         * @member KISSY
         */
        inArray: function (item, arr) {
            return S.indexOf(item, arr) > -1;
        },

        /**
         * Executes the supplied function on each item in the array.
         * Returns a new array containing the items that the supplied
         * function returned TRUE for.
         * @member KISSY
         * @method
         * @param arr {Array} the array to iterate
         * @param fn {Function} the function to execute on each item
         * @param [context] {Object} optional context object
         * @return {Array} The items on which the supplied function returned TRUE.
         * If no items matched an empty array is returned.
         */
        filter: filter ?
            function (arr, fn, context) {
                return filter.call(arr, fn, context || this);
            } :
            function (arr, fn, context) {
                var ret = [];
                S.each(arr, function (item, i, arr) {
                    if (fn.call(context || this, item, i, arr)) {
                        ret.push(item);
                    }
                });
                return ret;
            },


        /**
         * Executes the supplied function on each item in the array.
         * Returns a new array containing the items that the supplied
         * function returned for.
         * @method
         * @param arr {Array} the array to iterate
         * @param fn {Function} the function to execute on each item
         * @param [context] {Object} optional context object
         * refer: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/map
         * @return {Array} The items on which the supplied function returned
         * @member KISSY
         */
        map: map ?
            function (arr, fn, context) {
                return map.call(arr, fn, context || this);
            } :
            function (arr, fn, context) {
                var len = arr.length,
                    res = new Array(len);
                for (var i = 0; i < len; i++) {
                    var el = typeof arr === 'string' ? arr.charAt(i) : arr[i];
                    if (el ||
                        //ie<9 in invalid when typeof arr == string
                        i in arr) {
                        res[i] = fn.call(context || this, el, i, arr);
                    }
                }
                return res;
            },


        /**
         * Executes the supplied function on each item in the array.
         * Returns a value which is accumulation of the value that the supplied
         * function returned.
         *
         * @param arr {Array} the array to iterate
         * @param callback {Function} the function to execute on each item
         * @param initialValue {number} optional context object
         * refer: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/reduce
         * @return {Array} The items on which the supplied function returned
         * @member KISSY
         */
        reduce: function (arr, callback, initialValue) {
            var len = arr.length;
            if (typeof callback !== 'function') {
                throw new TypeError('callback is not function!');
            }

            // no value to return if no initial value and an empty array
            if (len === 0 && arguments.length === 2) {
                throw new TypeError('arguments invalid');
            }

            var k = 0;
            var accumulator;
            if (arguments.length >= 3) {
                accumulator = initialValue;
            }
            else {
                do {
                    if (k in arr) {
                        accumulator = arr[k++];
                        break;
                    }

                    // if array contains no values, no initial value to return
                    k += 1;
                    if (k >= len) {
                        throw new TypeError();
                    }
                }
                while (TRUE);
            }

            while (k < len) {
                if (k in arr) {
                    accumulator = callback.call(undefined, accumulator, arr[k], k, arr);
                }
                k++;
            }

            return accumulator;
        },

        /**
         * Tests whether all elements in the array pass the test implemented by the provided function.
         * @method
         * @param arr {Array} the array to iterate
         * @param callback {Function} the function to execute on each item
         * @param [context] {Object} optional context object
         * @member KISSY
         * @return {Boolean} whether all elements in the array pass the test implemented by the provided function.
         */
        every: every ?
            function (arr, fn, context) {
                return every.call(arr, fn, context || this);
            } :
            function (arr, fn, context) {
                var len = arr && arr.length || 0;
                for (var i = 0; i < len; i++) {
                    if (i in arr && !fn.call(context, arr[i], i, arr)) {
                        return FALSE;
                    }
                }
                return TRUE;
            },

        /**
         * Tests whether some element in the array passes the test implemented by the provided function.
         * @method
         * @param arr {Array} the array to iterate
         * @param callback {Function} the function to execute on each item
         * @param [context] {Object} optional context object
         * @member KISSY
         * @return {Boolean} whether some element in the array passes the test implemented by the provided function.
         */
        some: some ?
            function (arr, fn, context) {
                return some.call(arr, fn, context || this);
            } :
            function (arr, fn, context) {
                var len = arr && arr.length || 0;
                for (var i = 0; i < len; i++) {
                    if (i in arr && fn.call(context, arr[i], i, arr)) {
                        return TRUE;
                    }
                }
                return FALSE;
            },
        /**
         * Converts object to a TRUE array.
         * @param o {object|Array} array like object or array
         * @return {Array} native Array
         * @member KISSY
         */
        makeArray: function (o) {
            if (o == null) {
                return [];
            }
            if (S.isArray(o)) {
                return o;
            }
            var lengthType = typeof o.length,
                oType = typeof o;
            // The strings and functions also have 'length'
            if (lengthType !== 'number' ||
                // form.elements in ie78 has nodeName 'form'
                // then caution select
                // o.nodeName
                // window
                o.alert ||
                oType === 'string' ||
                // https://github.com/ariya/phantomjs/issues/11478
                (oType === 'function' && !( 'item' in o && lengthType === 'number'))) {
                return [o];
            }
            var ret = [];
            for (var i = 0, l = o.length; i < l; i++) {
                ret[i] = o[i];
            }
            return ret;
        }
    });

})(KISSY);/**
 * @ignore
 * escape of lang
 * @author yiminghe@gmail.com
 *
 */
(function (S, undefined) {
    // IE doesn't include non-breaking-space (0xa0) in their \s character
    // class (as required by section 7.2 of the ECMAScript spec), we explicitly
    // include it in the regexp to enforce consistent cross-browser behavior.
    var logger = S.getLogger('s/lang');
    var SEP = '&',
        EMPTY = '',
        EQ = '=',

        TRUE = true,
    // FALSE = false,
        HEX_BASE = 16,
    // http://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet
    // http://wonko.com/post/html-escaping
        htmlEntities = {
            '&amp;': '&',
            '&gt;': '>',
            '&lt;': '<',
            '&#x60;': '`',
            '&#x2F;': '/',
            '&quot;': '"',
            /*jshint quotmark:false*/
            '&#x27;': "'"
        },
        reverseEntities = {},
        escapeReg,
        unEscapeReg,
    // - # $ ^ * ( ) + [ ] { } | \ , . ?
        escapeRegExp = /[\-#$\^*()+\[\]{}|\\,.?\s]/g;
    (function () {
        for (var k in htmlEntities) {
            reverseEntities[htmlEntities[k]] = k;
        }
    })();

    function isValidParamValue(val) {
        var t = typeof val;
        // If the type of val is null, undefined, number, string, boolean, return TRUE.
        return val == null || (t !== 'object' && t !== 'function');
    }

    function getEscapeReg() {
        if (escapeReg) {
            return escapeReg;
        }
        var str = EMPTY;
        S.each(htmlEntities, function (entity) {
            str += entity + '|';
        });
        str = str.slice(0, -1);
        escapeReg = new RegExp(str, 'g');
        return escapeReg;
    }

    function getUnEscapeReg() {
        if (unEscapeReg) {
            return unEscapeReg;
        }
        var str = EMPTY;
        S.each(reverseEntities, function (entity) {
            str += entity + '|';
        });
        str += '&#(\\d{1,5});';
        unEscapeReg = new RegExp(str, 'g');
        return unEscapeReg;
    }

    S.mix(S, {

        /**
         * Call encodeURIComponent to encode a url component
         * @param {String} s part of url to be encoded.
         * @return {String} encoded url part string.
         * @member KISSY
         */
        urlEncode: function (s) {
            return encodeURIComponent(String(s));
        },

        /**
         * Call decodeURIComponent to decode a url component
         * and replace '+' with space.
         * @param {String} s part of url to be decoded.
         * @return {String} decoded url part string.
         * @member KISSY
         */
        urlDecode: function (s) {
            return decodeURIComponent(s.replace(/\+/g, ' '));
        },

        /**
         * frequently used in taobao cookie about nick
         * @member KISSY
         * @return {String} un-unicode string.
         */
        fromUnicode: function (str) {
            return str.replace(/\\u([a-f\d]{4})/ig, function (m, u) {
                return  String.fromCharCode(parseInt(u, HEX_BASE));
            });
        },
        /**
         * get escaped string from html.
         * only escape
         *      & > < ` / " '
         * refer:
         *
         * [http://yiminghe.javaeye.com/blog/788929](http://yiminghe.javaeye.com/blog/788929)
         *
         * [http://wonko.com/post/html-escaping](http://wonko.com/post/html-escaping)
         * @param str {string} text2html show
         * @member KISSY
         * @return {String} escaped html
         */
        escapeHtml: function (str) {
            return (str + '').replace(getEscapeReg(), function (m) {
                return reverseEntities[m];
            });
        },

        /**
         * get escaped regexp string for construct regexp.
         * @param str
         * @member KISSY
         * @return {String} escaped regexp
         */
        escapeRegExp: function (str) {
            return str.replace(escapeRegExp, '\\$&');
        },

        /**
         * un-escape html to string.
         * only unescape
         *      &amp; &lt; &gt; &#x60; &#x2F; &quot; &#x27; &#\d{1,5}
         * @param str {string} html2text
         * @member KISSY
         * @return {String} un-escaped html
         */
        unEscapeHtml: function (str) {
            return str.replace(getUnEscapeReg(), function (m, n) {
                return htmlEntities[m] || String.fromCharCode(+n);
            });
        },
        /**
         * Creates a serialized string of an array or object.
         *
         * for example:
         *     @example
         *     {foo: 1, bar: 2}    // -> 'foo=1&bar=2'
         *     {foo: 1, bar: [2, 3]}    // -> 'foo=1&bar=2&bar=3'
         *     {foo: '', bar: 2}    // -> 'foo=&bar=2'
         *     {foo: undefined, bar: 2}    // -> 'foo=undefined&bar=2'
         *     {foo: TRUE, bar: 2}    // -> 'foo=TRUE&bar=2'
         *
         * @param {Object} o json data
         * @param {String} [sep='&'] separator between each pair of data
         * @param {String} [eq='='] separator between key and value of data
         * @param {Boolean} [serializeArray=true] whether add '[]' to array key of data
         * @return {String}
         * @member KISSY
         */
        param: function (o, sep, eq, serializeArray) {
            sep = sep || SEP;
            eq = eq || EQ;
            if (serializeArray === undefined) {
                serializeArray = TRUE;
            }
            var buf = [], key, i, v, len, val,
                encode = S.urlEncode;
            for (key in o) {

                val = o[key];
                key = encode(key);

                // val is valid non-array value
                if (isValidParamValue(val)) {
                    buf.push(key);
                    if (val !== undefined) {
                        buf.push(eq, encode(val + EMPTY));
                    }
                    buf.push(sep);
                }
                // val is not empty array
                else if (S.isArray(val) && val.length) {
                    for (i = 0, len = val.length; i < len; ++i) {
                        v = val[i];
                        if (isValidParamValue(v)) {
                            buf.push(key, (serializeArray ? encode('[]') : EMPTY));
                            if (v !== undefined) {
                                buf.push(eq, encode(v + EMPTY));
                            }
                            buf.push(sep);
                        }
                    }
                }
                // ignore other cases, including empty array, Function, RegExp, Date etc.

            }
            buf.pop();
            return buf.join(EMPTY);
        },

        /**
         * Parses a URI-like query string and returns an object composed of parameter/value pairs.
         *
         * for example:
         *      @example
         *      'section=blog&id=45'        // -> {section: 'blog', id: '45'}
         *      'section=blog&tag=js&tag=doc' // -> {section: 'blog', tag: ['js', 'doc']}
         *      'tag=ruby%20on%20rails'        // -> {tag: 'ruby on rails'}
         *      'id=45&raw'        // -> {id: '45', raw: ''}
         * @param {String} str param string
         * @param {String} [sep='&'] separator between each pair of data
         * @param {String} [eq='='] separator between key and value of data
         * @return {Object} json data
         * @member KISSY
         */
        unparam: function (str, sep, eq) {
            if (typeof str !== 'string' || !(str = S.trim(str))) {
                return {};
            }
            sep = sep || SEP;
            eq = eq || EQ;
            var ret = {},
                eqIndex,
                decode = S.urlDecode,
                pairs = str.split(sep),
                key, val,
                i = 0, len = pairs.length;

            for (; i < len; ++i) {
                eqIndex = pairs[i].indexOf(eq);
                if (eqIndex === -1) {
                    key = decode(pairs[i]);
                    val = undefined;
                } else {
                    // remember to decode key!
                    key = decode(pairs[i].substring(0, eqIndex));
                    val = pairs[i].substring(eqIndex + 1);
                    try {
                        val = decode(val);
                    } catch (e) {
                        logger.error('decodeURIComponent error : ' + val);
                        logger.error(e);
                    }
                    if (S.endsWith(key, '[]')) {
                        key = key.substring(0, key.length - 2);
                    }
                }
                if (key in ret) {
                    if (S.isArray(ret[key])) {
                        ret[key].push(val);
                    } else {
                        ret[key] = [ret[key], val];
                    }
                } else {
                    ret[key] = val;
                }
            }
            return ret;
        }
    });

    S.escapeHTML = S.escapeHtml;
    S.unEscapeHTML = S.unEscapeHtml;
})(KISSY);/**
 * @ignore
 * function utilities of lang
 * @author yiminghe@gmail.com
 *
 */
(function (S, undefined) {
    // ios Function.prototype.bind === undefined
    function bindFn(r, fn, obj) {
        function FNOP() {
        }

        var slice = [].slice,
            args = slice.call(arguments, 3),
            bound = function () {
                var inArgs = slice.call(arguments);
                return fn.apply(
                    this instanceof FNOP ? this :
                        // fix: y.x=S.bind(fn);
                        obj || this,
                    (r ? inArgs.concat(args) : args.concat(inArgs))
                );
            };
        FNOP.prototype = fn.prototype;
        bound.prototype = new FNOP();
        return bound;
    }

    S.mix(S, {
        /**
         * empty function
         * @member KISSY
         */
        noop: function () {
        },
        /**
         * Creates a new function that, when called, itself calls this function in the context of the provided this value,
         * with a given sequence of arguments preceding any provided when the new function was called.
         * refer: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
         * @param {Function} fn internal called function
         * @param {Object} obj context in which fn runs
         * @param {*...} var_args extra arguments
         * @member KISSY
         * @return {Function} new function with context and arguments
         */
        bind: bindFn(0, bindFn, null, 0),

        /**
         * Creates a new function that, when called, itself calls this function in the context of the provided this value,
         * with a given sequence of arguments preceding any provided when the new function was called.
         * refer: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
         * @param {Function} fn internal called function
         * @param {Object} obj context in which fn runs
         * @param {*...} var_args extra arguments
         * @member KISSY
         * @return {Function} new function with context and arguments
         */
        rbind: bindFn(0, bindFn, null, 1),

        /**
         * Executes the supplied function in the context of the supplied
         * object 'when' milliseconds later. Executes the function a
         * single time unless periodic is set to true.
         *
         * @param fn {Function|String} the function to execute or the name of the method in
         * the 'o' object to execute.
         *
         * @param [when=0] {Number} the number of milliseconds to wait until the fn is executed.
         *
         * @param {Boolean} [periodic] if true, executes continuously at supplied interval
         * until canceled.
         *
         * @param {Object} [context] the context object.
         *
         * @param [data] that is provided to the function. This accepts either a single
         * item or an array. If an array is provided, the function is executed with
         * one parameter for each array item. If you need to pass a single array
         * parameter, it needs to be wrapped in an array.
         *
         * @return {Object} a timer object. Call the cancel() method on this object to stop
         * the timer.
         *
         * @member KISSY
         */
        later: function (fn, when, periodic, context, data) {
            when = when || 0;
            var m = fn,
                d = S.makeArray(data),
                f,
                r;

            if (typeof fn === 'string') {
                m = context[fn];
            }

            if (!m) {
                S.error('method undefined');
            }

            f = function () {
                m.apply(context, d);
            };

            r = (periodic) ? setInterval(f, when) : setTimeout(f, when);

            return {
                id: r,
                interval: periodic,
                cancel: function () {
                    if (this.interval) {
                        clearInterval(r);
                    } else {
                        clearTimeout(r);
                    }
                }
            };
        },


        /**
         * Throttles a call to a method based on the time between calls.
         * @param {Function} fn The function call to throttle.
         * @param {Object} [context] context fn to run
         * @param {Number} [ms] The number of milliseconds to throttle the method call.
         * Passing a -1 will disable the throttle. Defaults to 150.
         * @return {Function} Returns a wrapped function that calls fn throttled.
         * @member KISSY
         */
        throttle: function (fn, ms, context) {
            ms = ms || 150;

            if (ms === -1) {
                return function () {
                    fn.apply(context || this, arguments);
                };
            }

            var last = S.now();

            return function () {
                var now = S.now();
                if (now - last > ms) {
                    last = now;
                    fn.apply(context || this, arguments);
                }
            };
        },

        /**
         * buffers a call between a fixed time
         * @param {Function} fn
         * @param {Number} ms
         * @param {Object} [context]
         * @return {Function} Returns a wrapped function that calls fn buffered.
         * @member KISSY
         */
        buffer: function (fn, ms, context) {
            ms = ms || 150;

            if (ms === -1) {
                return function () {
                    fn.apply(context || this, arguments);
                };
            }
            var bufferTimer = null;

            function f() {
                f.stop();
                bufferTimer = S.later(fn, ms, 0, context || this, arguments);
            }

            f.stop = function () {
                if (bufferTimer) {
                    bufferTimer.cancel();
                    bufferTimer = 0;
                }
            };

            return f;
        }
    });
})(KISSY);/**
 * @ignore
 *   lang
 * @author  yiminghe@gmail.com, lifesinger@gmail.com
 *
 */
(function (S, undefined) {

    var TRUE = true,
        FALSE = false,
        CLONE_MARKER = '__~ks_cloned',
        COMPARE_MARKER = '__~ks_compared';

    S.mix(S, {
        /**
         * Checks to see whether two object are equals.
         * @param a 比较目标1
         * @param b 比较目标2
         * @param [mismatchKeys] internal usage
         * @param [mismatchValues] internal usage
         * @return {Boolean} a.equals(b)
         * @member KISSY
         */
        equals: function (a, b, /*internal use*/mismatchKeys, /*internal use*/mismatchValues) {
            // inspired by jasmine
            mismatchKeys = mismatchKeys || [];
            mismatchValues = mismatchValues || [];

            if (a === b) {
                return TRUE;
            }
            if (a === undefined || a === null || b === undefined || b === null) {
                // need type coercion
                return a == null && b == null;
            }
            if (a instanceof Date && b instanceof Date) {
                return a.getTime() === b.getTime();
            }
            if (typeof a === 'string' && typeof b === 'string') {
                return (a === b);
            }
            if (typeof a === 'number' && typeof b === 'number') {
                return (a === b);
            }
            if (typeof a === 'object' && typeof b === 'object') {
                return compareObjects(a, b, mismatchKeys, mismatchValues);
            }
            // Straight check
            return (a === b);
        },

        /**
         * Creates a deep copy of a plain object or array. Others are returned untouched.
         * @param input
         * @member KISSY
         * @param {Function} [filter] filter function
         * @return {Object} the new cloned object
         * refer: http://www.w3.org/TR/html5/common-dom-interfaces.html#safe-passing-of-structured-data
         */
        clone: function (input, filter) {
            // 稍微改改就和规范一样了 :)
            // Let memory be an association list of pairs of objects,
            // initially empty. This is used to handle duplicate references.
            // In each pair of objects, one is called the source object
            // and the other the destination object.
            var memory = {},
                ret = cloneInternal(input, filter, memory);
            S.each(memory, function (v) {
                // 清理在源对象上做的标记
                v = v.input;
                if (v[CLONE_MARKER]) {
                    try {
                        delete v[CLONE_MARKER];
                    } catch (e) {
                        v[CLONE_MARKER] = undefined;
                    }
                }
            });
            memory = null;
            return ret;
        },

        /**
         * Gets current date in milliseconds.
         * @method
         * refer:  https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/now
         * http://j-query.blogspot.com/2011/02/timing-ecmascript-5-datenow-function.html
         * http://kangax.github.com/es5-compat-table/
         * @member KISSY
         * @return {Number} current time
         */
        now: Date.now || function () {
            return +new Date();
        }
    });

    function cloneInternal(input, f, memory) {
        var destination = input,
            isArray,
            isPlainObject,
            k,
            stamp;
        if (!input) {
            return destination;
        }

        // If input is the source object of a pair of objects in memory,
        // then return the destination object in that pair of objects .
        // and abort these steps.
        if (input[CLONE_MARKER]) {
            // 对应的克隆后对象
            return memory[input[CLONE_MARKER]].destination;
        } else if (typeof input === 'object') {
            // 引用类型要先记录
            var Constructor = input.constructor;
            if (S.inArray(Constructor, [Boolean, String, Number, Date, RegExp])) {
                destination = new Constructor(input.valueOf());
            }
            // ImageData , File, Blob , FileList .. etc
            else if ((isArray = S.isArray(input))) {
                destination = f ? S.filter(input, f) : input.concat();
            } else if ((isPlainObject = S.isPlainObject(input))) {
                destination = {};
            }
            // Add a mapping from input (the source object)
            // to output (the destination object) to memory.
            // 做标记
            // stamp can not be
            input[CLONE_MARKER] = (stamp = S.guid('c'));
            // 存储源对象以及克隆后的对象
            memory[stamp] = {destination: destination, input: input};
        }
        // If input is an Array object or an Object object,
        // then, for each enumerable property in input,
        // add a new property to output having the same name,
        // and having a value created from invoking the internal structured cloning algorithm recursively
        // with the value of the property as the 'input' argument and memory as the 'memory' argument.
        // The order of the properties in the input and output objects must be the same.

        // clone it
        if (isArray) {
            for (var i = 0; i < destination.length; i++) {
                destination[i] = cloneInternal(destination[i], f, memory);
            }
        } else if (isPlainObject) {
            for (k in input) {

                if (k !== CLONE_MARKER &&
                    (!f || (f.call(input, input[k], k, input) !== FALSE))) {
                    destination[k] = cloneInternal(input[k], f, memory);
                }

            }
        }

        return destination;
    }

    function compareObjects(a, b, mismatchKeys, mismatchValues) {
        // 两个比较过了，无需再比较，防止循环比较
        if (a[COMPARE_MARKER] === b && b[COMPARE_MARKER] === a) {
            return TRUE;
        }
        a[COMPARE_MARKER] = b;
        b[COMPARE_MARKER] = a;
        var hasKey = function (obj, keyName) {
            return (obj !== null && obj !== undefined) && obj[keyName] !== undefined;
        };
        for (var property in b) {

            if (!hasKey(a, property) && hasKey(b, property)) {
                mismatchKeys.push('expected has key ' + property + '", but missing from actual.');
            }

        }
        for (property in a) {

            if (!hasKey(b, property) && hasKey(a, property)) {
                mismatchKeys.push('expected missing key "' + property + '", but present in actual.');
            }

        }
        for (property in b) {

            if (property === COMPARE_MARKER) {
                continue;
            }
            if (!S.equals(a[property], b[property], mismatchKeys, mismatchValues)) {
                mismatchValues.push('"' + property + '" was "' +
                    (b[property] ? (b[property].toString()) : b[property]) +
                    '" in expected, but was "' +
                    (a[property] ? (a[property].toString()) : a[property]) + '" in actual.');
            }

        }
        if (S.isArray(a) && S.isArray(b) && a.length !== b.length) {
            mismatchValues.push('arrays were not the same length');
        }
        delete a[COMPARE_MARKER];
        delete b[COMPARE_MARKER];
        return (mismatchKeys.length === 0 && mismatchValues.length === 0);
    }

})(KISSY);
/**
 * @ignore
 * string utilities of lang
 * @author yiminghe@gmail.com
 *
 */
(function (S, undefined) {

    // IE doesn't include non-breaking-space (0xa0) in their \s character
    // class (as required by section 7.2 of the ECMAScript spec), we explicitly
    // include it in the regexp to enforce consistent cross-browser behavior.
    var RE_TRIM = /^[\s\xa0]+|[\s\xa0]+$/g,
        trim = String.prototype.trim,
        SUBSTITUTE_REG = /\\?\{([^{}]+)\}/g,
        EMPTY = '';

    S.mix(S, {
        /**
         * Removes the whitespace from the beginning and end of a string.
         * @method
         * @member KISSY
         */
        trim: trim ?
            function (str) {
                return str == null ? EMPTY : trim.call(str);
            } :
            function (str) {
                return str == null ? EMPTY : (str + '').replace(RE_TRIM, EMPTY);
            },

        /**
         * Substitutes keywords in a string using an object/array.
         * Removes undefined keywords and ignores escaped keywords.
         * @param {String} str template string
         * @param {Object} o json data
         * @member KISSY
         * @param {RegExp} [regexp] to match a piece of template string
         */
        substitute: function (str, o, regexp) {
            if (typeof str !== 'string' || !o) {
                return str;
            }

            return str.replace(regexp || SUBSTITUTE_REG, function (match, name) {
                if (match.charAt(0) === '\\') {
                    return match.slice(1);
                }
                return (o[name] === undefined) ? EMPTY : o[name];
            });
        },

        /** uppercase first character.
         * @member KISSY
         * @param s
         * @return {String}
         */
        ucfirst: function (s) {
            s += '';
            return s.charAt(0).toUpperCase() + s.substring(1);
        },
        /**
         * test whether a string start with a specified substring
         * @param {String} str the whole string
         * @param {String} prefix a specified substring
         * @return {Boolean} whether str start with prefix
         * @member KISSY
         */
        startsWith: function (str, prefix) {
            return str.lastIndexOf(prefix, 0) === 0;
        },

        /**
         * test whether a string end with a specified substring
         * @param {String} str the whole string
         * @param {String} suffix a specified substring
         * @return {Boolean} whether str end with suffix
         * @member KISSY
         */
        endsWith: function (str, suffix) {
            var ind = str.length - suffix.length;
            return ind >= 0 && str.indexOf(suffix, ind) === ind;
        }

    });
})(KISSY);/**
 * @ignore
 * type judgement
 * @author yiminghe@gmail.com, lifesinger@gmail.com
 *
 */
(function (S, undefined) {
    // [[Class]] -> type pairs
    var class2type = {},
        FALSE = false,
        noop = S.noop,
        OP = Object.prototype,
        toString = OP.toString;

    function hasOwnProperty(o, p) {
        return OP.hasOwnProperty.call(o, p);
    }

    S.mix(S, {
        /**
         * Determine the internal JavaScript [[Class]] of an object.
         * @member KISSY
         */
        type: function (o) {
            return o == null ?
                String(o) :
                class2type[toString.call(o)] || 'object';
        },

        /**
         * whether o === null
         * @param o
         * @member KISSY
         */
        isNull: function (o) {
            return o === null;
        },

        /**
         * whether o === undefined
         * @param o
         * @member KISSY
         */
        isUndefined: function (o) {
            return o === undefined;
        },

        /**
         * Checks to see if an object is empty.
         * @member KISSY
         */
        isEmptyObject: function (o) {
            for (var p in o) {
                if (p !== undefined) {
                    return FALSE;
                }
            }
            return true;
        },

        /**
         * Checks to see if an object is a plain object (created using '{}'
         * or 'new Object()' but not 'new FunctionClass()').
         * @member KISSY
         */
        isPlainObject: function (obj) {
            // Must be an Object.
            // Because of IE, we also have to check the presence of the constructor property.
            // Make sure that Dom nodes and window objects don't pass through, as well
            if (!obj || S.type(obj) !== 'object' || obj.nodeType ||
                /*jshint eqeqeq:false*/
                // must == for ie8
                obj.window == obj) {
                return FALSE;
            }

            var key, objConstructor;

            try {
                // Not own constructor property must be Object
                if ((objConstructor = obj.constructor) && !hasOwnProperty(obj, 'constructor') && !hasOwnProperty(objConstructor.prototype, 'isPrototypeOf')) {
                    return FALSE;
                }
            } catch (e) {
                // IE8,9 Will throw exceptions on certain host objects
                return FALSE;
            }

            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own.
            /*jshint noempty:false*/
            for (key in obj) {
            }

            return ((key === undefined) || hasOwnProperty(obj, key));
        }
    });

    if ('@DEBUG@') {
        S.mix(S, {
            /**
             * test whether o is boolean
             * @method
             * @param  o
             * @return {Boolean}
             * @member KISSY
             */
            isBoolean: noop,
            /**
             * test whether o is number
             * @method
             * @param  o
             * @return {Boolean}
             * @member KISSY
             */
            isNumber: noop,
            /**
             * test whether o is String
             * @method
             * @param  o
             * @return {Boolean}
             * @member KISSY
             */
            isString: noop,
            /**
             * test whether o is function
             * @method
             * @param  o
             * @return {Boolean}
             * @member KISSY
             */
            isFunction: noop,
            /**
             * test whether o is Array
             * @method
             * @param  o
             * @return {Boolean}
             * @member KISSY
             */
            isArray: noop,
            /**
             * test whether o is Date
             * @method
             * @param  o
             * @return {Boolean}
             * @member KISSY
             */
            isDate: noop,
            /**
             * test whether o is RegExp
             * @method
             * @param  o
             * @return {Boolean}
             * @member KISSY
             */
            isRegExp: noop,
            /**
             * test whether o is Object
             * @method
             * @param  o
             * @return {Boolean}
             * @member KISSY
             */
            isObject: noop
        });
    }

    S.each('Boolean Number String Function Date RegExp Object Array'.split(' '), function (name, lc) {
        // populate the class2type map
        class2type['[object ' + name + ']'] = (lc = name.toLowerCase());

        // add isBoolean/isNumber/...
        S['is' + name] = function (o) {
            return S.type(o) === lc;
        };
    });
    S.isArray = Array.isArray || S.isArray;
})(KISSY);/*
 setImmediate polyfill inspired by Q
 @author yiminghe@gmail.com
 */
(function (S) {
    /*global setImmediate*/
    /*global process */
    /*global MessageChannel */

    var queue = [];

    var flushing = 0;

    function flush() {
        var i = 0, item;
        while ((item = queue[i++])) {
            try {
                item();
            } catch (e) {
                S.log(e.stack || e, 'error');
                /*jshint loopfunc:true*/
                setTimeout(function () {
                    throw e;
                }, 0);
            }
        }
        if (i > 1) {
            queue = [];
        }
        flushing = 0;
    }

    /*
     setImmediate for loader and promise
     @param {Function} fn async function to call
     @private
     */
    S.setImmediate = function (fn) {
        queue.push(fn);
        if (!flushing) {
            flushing = 1;
            requestFlush();
        }
    };

    var requestFlush;
    if (typeof setImmediate === 'function') {
        requestFlush = function () {

            setImmediate(flush);
        };
    } else if (typeof process !== 'undefined' && typeof  process.nextTick === 'function') {
        requestFlush = function () {
            process.nextTick(flush);
        };
    } else if (typeof MessageChannel !== 'undefined') {
        // modern browsers
        // http://msdn.microsoft.com/en-us/library/windows/apps/hh441303.aspx
        var channel = new MessageChannel();
        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
        // working message ports the first time a page loads.
        channel.port1.onmessage = function () {
            requestFlush = realRequestFlush;
            channel.port1.onmessage = flush;
            flush();
        };
        var realRequestFlush = function () {
            // Opera requires us to provide a message payload, regardless of
            // whether we use it.
            channel.port2.postMessage(0);
        };
        requestFlush = function () {
            setTimeout(flush, 0);
            realRequestFlush();
        };

    } else {
        // old browsers
        requestFlush = function () {
            setTimeout(flush, 0);
        };
    }
})(KISSY);/**
 * @ignore
 * Port Node Utils For KISSY.
 * Note: Only posix mode.
 * @author yiminghe@gmail.com
 */
(function (S) {
    // [root, dir, basename, ext]
    var splitPathRe = /^(\/?)([\s\S]+\/(?!$)|\/)?((?:\.{1,2}$|[\s\S]+?)?(\.[^.\/]*)?)$/;


    // Remove .. and . in path array
    function normalizeArray(parts, allowAboveRoot) {
        // level above root
        var up = 0,
            i = parts.length - 1,
        // splice costs a lot in ie
        // use new array instead
            newParts = [],
            last;

        for (; i >= 0; i--) {
            last = parts[i];
            if (last !== '.') {
                if (last === '..') {
                    up++;
                } else if (up) {
                    up--;
                } else {
                    newParts[newParts.length] = last;
                }
            }
        }

        // if allow above root, has to add ..
        if (allowAboveRoot) {
            for (; up--; up) {
                newParts[newParts.length] = '..';
            }
        }

        newParts = newParts.reverse();

        return newParts;
    }

    /**
     * Path Utils For KISSY.
     * @class KISSY.Path
     * @singleton
     */
    var Path = S.Path = {
        /**
         * resolve([from ...], to)
         * @return {String} Resolved path.
         */
        resolve: function () {
            var resolvedPath = '',
                resolvedPathStr,
                i,
                args = (arguments),
                path,
                absolute = 0;

            for (i = args.length - 1; i >= 0 && !absolute; i--) {
                path = args[i];
                if (typeof path !== 'string' || !path) {
                    continue;
                }
                resolvedPath = path + '/' + resolvedPath;
                absolute = path.charAt(0) === '/';
            }

            resolvedPathStr = normalizeArray(S.filter(resolvedPath.split('/'), function (p) {
                return !!p;
            }), !absolute).join('/');

            return ((absolute ? '/' : '') + resolvedPathStr) || '.';
        },

        /**
         * normalize .. and . in path
         * @param {String} path Path tobe normalized
         *
         *
         *      'x/y/../z' => 'x/z'
         *      'x/y/z/../' => 'x/y/'
         *
         * @return {String}
         */
        normalize: function (path) {
            var absolute = path.charAt(0) === '/',
                trailingSlash = path.slice(-1) === '/';

            path = normalizeArray(S.filter(path.split('/'), function (p) {
                return !!p;
            }), !absolute).join('/');

            if (!path && !absolute) {
                path = '.';
            }

            if (path && trailingSlash) {
                path += '/';
            }


            return (absolute ? '/' : '') + path;
        },

        /**
         * join([path ...]) and normalize
         * @return {String}
         */
        join: function () {
            var args = S.makeArray(arguments);
            return Path.normalize(S.filter(args,function (p) {
                return p && (typeof p === 'string');
            }).join('/'));
        },

        /**
         * Get string which is to relative to from
         * @param {String} from
         * @param {String} to
         *
         *
         *      relative('x/','x/y/z') => 'y/z'
         *      relative('x/t/z','x/') => '../../'
         *
         * @return {String}
         */
        relative: function (from, to) {
            from = Path.normalize(from);
            to = Path.normalize(to);

            var fromParts = S.filter(from.split('/'), function (p) {
                    return !!p;
                }),
                path = [],
                sameIndex,
                sameIndex2,
                toParts = S.filter(to.split('/'), function (p) {
                    return !!p;
                }), commonLength = Math.min(fromParts.length, toParts.length);

            for (sameIndex = 0; sameIndex < commonLength; sameIndex++) {
                if (fromParts[sameIndex] !== toParts[sameIndex]) {
                    break;
                }
            }

            sameIndex2 = sameIndex;

            while (sameIndex < fromParts.length) {
                path.push('..');
                sameIndex++;
            }

            path = path.concat(toParts.slice(sameIndex2));

            path = path.join('/');

            return /**@type String  @ignore*/path;
        },

        /**
         * Get base name of path
         * @param {String} path
         * @param {String} [ext] ext to be stripped from result returned.
         * @return {String}
         */
        basename: function (path, ext) {
            var result = path.match(splitPathRe) || [],
                basename;
            basename = result[3] || '';
            if (ext && basename && basename.slice(-1 * ext.length) === ext) {
                basename = basename.slice(0, -1 * ext.length);
            }
            return basename;
        },

        /**
         * Get dirname of path
         * @param {String} path
         * @return {String}
         */
        dirname: function (path) {
            var result = path.match(splitPathRe) || [],
                root = result[1] || '',
                dir = result[2] || '';

            if (!root && !dir) {
                // No dirname
                return '.';
            }

            if (dir) {
                // It has a dirname, strip trailing slash
                dir = dir.substring(0, dir.length - 1);
            }

            return root + dir;
        },

        /**
         * Get extension name of file in path
         * @param {String} path
         * @return {String}
         */
        extname: function (path) {
            return (path.match(splitPathRe) || [])[4] || '';
        }
    };
})(KISSY);
/*
 Refer
 - https://github.com/joyent/node/blob/master/lib/path.js
 *//**
 * @ignore
 * Uri class for KISSY.
 * @author yiminghe@gmail.com
 */
(function (S, undefined) {
    var  logger= S.getLogger('s/uri');
    var reDisallowedInSchemeOrUserInfo = /[#\/\?@]/g,
        reDisallowedInPathName = /[#\?]/g,

    // ?? combo of taobao
        reDisallowedInQuery = /[#@]/g,
        reDisallowedInFragment = /#/g,

        URI_SPLIT_REG = new RegExp(
            '^' +
                /*
                 Scheme names consist of a sequence of characters beginning with a
                 letter and followed by any combination of letters, digits, plus
                 ('+'), period ('.'), or hyphen ('-').
                 */
                '(?:([\\w\\d+.-]+):)?' + // scheme

                '(?://' +
                /*
                 The authority component is preceded by a double slash ('//') and is
                 terminated by the next slash ('/'), question mark ('?'), or number
                 sign ('#') character, or by the end of the URI.
                 */
                '(?:([^/?#@]*)@)?' + // userInfo

                '(' +
                '[\\w\\d\\-\\u0100-\\uffff.+%]*' +
                '|' +
                // ipv6
                '\\[[^\\]]+\\]' +
                ')' + // hostname - restrict to letters,
                // digits, dashes, dots, percent
                // escapes, and unicode characters.
                '(?::([0-9]+))?' + // port
                ')?' +
                /*
                 The path is terminated
                 by the first question mark ('?') or number sign ('#') character, or
                 by the end of the URI.
                 */
                '([^?#]+)?' + // path. hierarchical part
                /*
                 The query component is indicated by the first question
                 mark ('?') character and terminated by a number sign ('#') character
                 or by the end of the URI.
                 */
                '(?:\\?([^#]*))?' + // query. non-hierarchical data
                /*
                 The fragment identifier component of a URI allows indirect
                 identification of a secondary resource by reference to a primary
                 resource and additional identifying information.

                 A
                 fragment identifier component is indicated by the presence of a
                 number sign ('#') character and terminated by the end of the URI.
                 */
                '(?:#(.*))?' + // fragment
                '$'),

        Path = S.Path,

        REG_INFO = {
            scheme: 1,
            userInfo: 2,
            hostname: 3,
            port: 4,
            path: 5,
            query: 6,
            fragment: 7
        };

    function parseQuery(self) {
        if (!self._queryMap) {
            self._queryMap = S.unparam(self._query);
        }
    }

    /**
     * @class KISSY.Uri.Query
     * Query data structure.
     * @param {String} [query] encoded query string(without question mask).
     */
    function Query(query) {
        this._query = query || '';
    }

    Query.prototype = {
        constructor: Query,

        /**
         * Cloned new instance.
         * @return {KISSY.Uri.Query}
         */
        clone: function () {
            return new Query(this.toString());
        },


        /**
         * reset to a new query string
         * @param {String} query
         * @chainable
         */
        reset: function (query) {
            var self = this;
            self._query = query || '';
            self._queryMap = null;
            return self;
        },

        /**
         * Parameter count.
         * @return {Number}
         */
        count: function () {
            var self = this,
                count = 0,
                _queryMap,
                k;
            parseQuery(self);
            _queryMap = self._queryMap;
            for (k in _queryMap) {

                if (S.isArray(_queryMap[k])) {
                    count += _queryMap[k].length;
                } else {
                    count++;
                }

            }
            return count;
        },

        /**
         * judge whether has query parameter
         * @param {String} [key]
         */
        has: function (key) {
            var self = this, _queryMap;
            parseQuery(self);
            _queryMap = self._queryMap;
            if (key) {
                return key in _queryMap;
            } else {
                return !S.isEmptyObject(_queryMap);
            }
        },

        /**
         * Return parameter value corresponding to current key
         * @param {String} [key]
         */
        get: function (key) {
            var self = this, _queryMap;
            parseQuery(self);
            _queryMap = self._queryMap;
            if (key) {
                return _queryMap[key];
            } else {
                return _queryMap;
            }
        },

        /**
         * Parameter names.
         * @return {String[]}
         */
        keys: function () {
            var self = this;
            parseQuery(self);
            return S.keys(self._queryMap);
        },

        /**
         * Set parameter value corresponding to current key
         * @param {String} key
         * @param value
         * @chainable
         */
        set: function (key, value) {
            var self = this, _queryMap;
            parseQuery(self);
            _queryMap = self._queryMap;
            if (typeof key === 'string') {
                self._queryMap[key] = value;
            } else {
                if (key instanceof Query) {
                    key = key.get();
                }
                S.each(key, function (v, k) {
                    _queryMap[k] = v;
                });
            }
            return self;
        },

        /**
         * Remove parameter with specified name.
         * @param {String} key
         * @chainable
         */
        remove: function (key) {
            var self = this;
            parseQuery(self);
            if (key) {
                delete self._queryMap[key];
            } else {
                self._queryMap = {};
            }
            return self;

        },

        /**
         * Add parameter value corresponding to current key
         * @param {String} key
         * @param value
         * @chainable
         */
        add: function (key, value) {
            var self = this,
                _queryMap,
                currentValue;
            if (typeof key === 'string') {
                parseQuery(self);
                _queryMap = self._queryMap;
                currentValue = _queryMap[key];
                if (currentValue === undefined) {
                    currentValue = value;
                } else {
                    currentValue = [].concat(currentValue).concat(value);
                }
                _queryMap[key] = currentValue;
            } else {
                if (key instanceof Query) {
                    key = key.get();
                }
                for (var k in key) {
                    self.add(k, key[k]);
                }
            }
            return self;
        },

        /**
         * Serialize query to string.
         * @param {Boolean} [serializeArray=true]
         * whether append [] to key name when value 's type is array
         */
        toString: function (serializeArray) {
            var self = this;
            parseQuery(self);
            return S.param(self._queryMap, undefined, undefined, serializeArray);
        }
    };

    function padding2(str) {
        return str.length === 1 ? '0' + str : str;
    }

    function equalsIgnoreCase(str1, str2) {
        return str1.toLowerCase() === str2.toLowerCase();
    }

    // www.ta#bao.com // => www.ta.com/#bao.com
    // www.ta%23bao.com
    // Percent-Encoding
    function encodeSpecialChars(str, specialCharsReg) {
        // encodeURI( ) is intended to encode complete URIs,
        // the following ASCII punctuation characters,
        // which have special meaning in URIs, are not escaped either:
        // ; / ? : @ & = + $ , #
        return encodeURI(str).replace(specialCharsReg, function (m) {
            return '%' + padding2(m.charCodeAt(0).toString(16));
        });
    }

    /**
     * @class KISSY.Uri
     * Uri class for KISSY.
     * Most of its interfaces are same with window.location.
     * @param {String|KISSY.Uri} [uriStr] Encoded uri string.
     */
    function Uri(uriStr) {

        if (uriStr instanceof  Uri) {
            return uriStr.clone();
        }

        var components, self = this;

        S.mix(self,
            {
                /**
                 * scheme such as 'http:'. aka protocol without colon
                 * @type {String}
                 */
                scheme: '',
                /**
                 * User credentials such as 'yiminghe:gmail'
                 * @type {String}
                 */
                userInfo: '',
                /**
                 * hostname such as 'docs.kissyui.com'. aka domain
                 * @type {String}
                 */
                hostname: '',
                /**
                 * Port such as '8080'
                 * @type {String}
                 */
                port: '',
                /**
                 * path such as '/index.htm'. aka pathname
                 * @type {String}
                 */
                path: '',
                /**
                 * Query object for search string. aka search
                 * @type {KISSY.Uri.Query}
                 */
                query: '',
                /**
                 * fragment such as '#!/test/2'. aka hash
                 */
                fragment: ''
            });

        components = Uri.getComponents(uriStr);

        S.each(components, function (v, key) {
            v = v || '';
            if (key === 'query') {
                // need encoded content
                self.query = new Query(v);
            } else {
                // https://github.com/kissyteam/kissy/issues/298
                try {
                    v = S.urlDecode(v);
                } catch (e) {
                    logger.error(e + 'urlDecode error : ' + v);
                }
                // need to decode to get data structure in memory
                self[key] = v;
            }
        });

        return self;
    }

    Uri.prototype = {
        constructor: Uri,

        /**
         * Return a cloned new instance.
         * @return {KISSY.Uri}
         */
        clone: function () {
            var uri = new Uri(), self = this;
            S.each(REG_INFO, function (index, key) {
                uri[key] = self[key];
            });
            uri.query = uri.query.clone();
            return uri;
        },


        /**
         * The reference resolution algorithm.rfc 5.2
         * return a resolved uri corresponding to current uri
         * @param {KISSY.Uri|String} relativeUri
         *
         * for example:
         *      @example
         *      this: 'http://y/yy/z.com?t=1#v=2'
         *      'https:/y/' => 'https:/y/'
         *      '//foo' => 'http://foo'
         *      'foo' => 'http://y/yy/foo'
         *      '/foo' => 'http://y/foo'
         *      '?foo' => 'http://y/yy/z.com?foo'
         *      '#foo' => http://y/yy/z.com?t=1#foo'
         *
         * @return {KISSY.Uri}
         */
        resolve: function (relativeUri) {

            if (typeof relativeUri === 'string') {
                relativeUri = new Uri(relativeUri);
            }

            var self = this,
                override = 0,
                lastSlashIndex,
                order = ['scheme', 'userInfo', 'hostname', 'port', 'path', 'query', 'fragment'],
                target = self.clone();

            S.each(order, function (o) {
                if (o === 'path') {
                    // relativeUri does not set for scheme/userInfo/hostname/port
                    if (override) {
                        target[o] = relativeUri[o];
                    } else {
                        var path = relativeUri.path;
                        if (path) {
                            // force to override target 's query with relative
                            override = 1;
                            if (!S.startsWith(path, '/')) {
                                if (target.hostname && !target.path) {
                                    // RFC 3986, section 5.2.3, case 1
                                    path = '/' + path;
                                } else if (target.path) {
                                    // RFC 3986, section 5.2.3, case 2
                                    lastSlashIndex = target.path.lastIndexOf('/');
                                    if (lastSlashIndex !== -1) {
                                        path = target.path.slice(0, lastSlashIndex + 1) + path;
                                    }
                                }
                            }
                            // remove .. / .  as part of the resolution process
                            target.path = Path.normalize(path);
                        }
                    }
                } else if (o === 'query') {
                    if (override || relativeUri.query.toString()) {
                        target.query = relativeUri.query.clone();
                        override = 1;
                    }
                } else if (override || relativeUri[o]) {
                    target[o] = relativeUri[o];
                    override = 1;
                }
            });

            return target;

        },

        /**
         * Get scheme part
         */
        getScheme: function () {
            return this.scheme;
        },

        /**
         * Set scheme part
         * @param {String} scheme
         * @chainable
         */
        setScheme: function (scheme) {
            this.scheme = scheme;
            return this;
        },

        /**
         * Return hostname
         * @return {String}
         */
        getHostname: function () {
            return this.hostname;
        },

        /**
         * Set hostname
         * @param {String} hostname
         * @chainable
         */
        setHostname: function (hostname) {
            this.hostname = hostname;
            return this;
        },

        /**
         * Set user info
         * @param {String} userInfo
         * @chainable
         */
        'setUserInfo': function (userInfo) {
            this.userInfo = userInfo;
            return this;
        },

        /**
         * Get user info
         * @return {String}
         */
        getUserInfo: function () {
            return this.userInfo;
        },

        /**
         * Set port
         * @param {String} port
         * @chainable
         */
        'setPort': function (port) {
            this.port = port;
            return this;
        },

        /**
         * Get port
         * @return {String}
         */
        'getPort': function () {
            return this.port;
        },

        /**
         * Set path
         * @param {string} path
         * @chainable
         */
        setPath: function (path) {
            this.path = path;
            return this;
        },

        /**
         * Get path
         * @return {String}
         */
        getPath: function () {
            return this.path;
        },

        /**
         * Set query
         * @param {String|KISSY.Uri.Query} query
         * @chainable
         */
        'setQuery': function (query) {
            if (typeof query === 'string') {
                if (S.startsWith(query, '?')) {
                    query = query.slice(1);
                }
                query = new Query(encodeSpecialChars(query, reDisallowedInQuery));
            }
            this.query = query;
            return this;
        },

        /**
         * Get query
         * @return {KISSY.Uri.Query}
         */
        getQuery: function () {
            return this.query;
        },

        /**
         * Get fragment
         * @return {String}
         */
        getFragment: function () {
            return this.fragment;
        },

        /**
         * Set fragment
         * @param {String} fragment
         * @chainable
         */
        'setFragment': function (fragment) {
            var self = this;
            if (S.startsWith(fragment, '#')) {
                fragment = fragment.slice(1);
            }
            self.fragment = fragment;
            return self;
        },

        /**
         * Judge whether two uri has same domain.
         * @param {KISSY.Uri} other
         * @return {Boolean}
         */
        isSameOriginAs: function (other) {
            var self = this;
            // port and hostname has to be same
            return equalsIgnoreCase(self.hostname, other.hostname) &&
                equalsIgnoreCase(self.scheme, other.scheme) &&
                equalsIgnoreCase(self.port, other.port);
        },

        /**
         * Serialize to string.
         * See rfc 5.3 Component Recomposition.
         * But kissy does not differentiate between undefined and empty.
         * @param {Boolean} [serializeArray=true]
         * whether append [] to key name when value 's type is array
         * @return {String}
         */
        toString: function (serializeArray) {

            var out = [],
                self = this,
                scheme,
                hostname,
                path,
                port,
                fragment,
                query,
                userInfo;

            if ((scheme = self.scheme)) {
                out.push(encodeSpecialChars(scheme, reDisallowedInSchemeOrUserInfo));
                out.push(':');
            }

            if ((hostname = self.hostname)) {
                out.push('//');
                if ((userInfo = self.userInfo)) {
                    out.push(encodeSpecialChars(userInfo, reDisallowedInSchemeOrUserInfo));
                    out.push('@');
                }

                out.push(encodeURIComponent(hostname));

                if ((port = self.port)) {
                    out.push(':');
                    out.push(port);
                }
            }

            if ((path = self.path)) {
                if (hostname && !S.startsWith(path, '/')) {
                    path = '/' + path;
                }
                path = Path.normalize(path);
                out.push(encodeSpecialChars(path, reDisallowedInPathName));
            }

            if ((query = ( self.query.toString.call(self.query, serializeArray)))) {
                out.push('?');
                out.push(query);
            }

            if ((fragment = self.fragment)) {
                out.push('#');
                out.push(encodeSpecialChars(fragment, reDisallowedInFragment));
            }

            return out.join('');
        }
    };

    Uri.Query = Query;

    Uri.getComponents = function (url) {
        url = url || '';
        var m = url.match(URI_SPLIT_REG) || [],
            ret = {};
        S.each(REG_INFO, function (index, key) {
            ret[key] = m[index];
        });
        return ret;
    };

    S.Uri = Uri;
})(KISSY);
/*
 Refer
 - application/x-www-form-urlencoded
 - http://www.ietf.org/rfc/rfc3986.txt
 - http://en.wikipedia.org/wiki/URI_scheme
 - http://unixpapa.com/js/querystring.html
 - http://code.stephenmorley.org/javascript/parsing-query-strings-for-get-data/
 - same origin: http://tools.ietf.org/html/rfc6454
 *//**
 * @ignore
 * ua
 */
(function (S, undefined) {
    /*global process*/

    var win = S.Env.host,
        doc = win.document,
        navigator = win.navigator,
        ua = navigator && navigator.userAgent || '';

    function numberify(s) {
        var c = 0;
        // convert '1.2.3.4' to 1.234
        return parseFloat(s.replace(/\./g, function () {
            return (c++ === 0) ? '.' : '';
        }));
    }

    function setTridentVersion(ua, UA) {
        var core, m;
        UA[core = 'trident'] = 0.1; // Trident detected, look for revision

        // Get the Trident's accurate version
        if ((m = ua.match(/Trident\/([\d.]*)/)) && m[1]) {
            UA[core] = numberify(m[1]);
        }

        UA.core = core;
    }

    function getIEVersion(ua) {
        var m, v;
        if ((m = ua.match(/MSIE ([^;]*)|Trident.*; rv(?:\s|:)?([0-9.]+)/)) &&
            (v = (m[1] || m[2]))) {
            return numberify(v);
        }
        return 0;
    }

    function getDescriptorFromUserAgent(ua) {
        var EMPTY = '',
            os,
            core = EMPTY,
            shell = EMPTY, m,
            IE_DETECT_RANGE = [6, 9],
            ieVersion,
            v,
            end,
            VERSION_PLACEHOLDER = '{{version}}',
            IE_DETECT_TPL = '<!--[if IE ' + VERSION_PLACEHOLDER + ']><' + 's></s><![endif]-->',
            div = doc && doc.createElement('div'),
            s = [];
        /**
         * KISSY UA
         * @class KISSY.UA
         * @singleton
         */
        var UA = {
            /**
             * webkit version
             * @type undefined|Number
             * @member KISSY.UA
             */
            webkit: undefined,
            /**
             * trident version
             * @type undefined|Number
             * @member KISSY.UA
             */
            trident: undefined,
            /**
             * gecko version
             * @type undefined|Number
             * @member KISSY.UA
             */
            gecko: undefined,
            /**
             * presto version
             * @type undefined|Number
             * @member KISSY.UA
             */
            presto: undefined,
            /**
             * chrome version
             * @type undefined|Number
             * @member KISSY.UA
             */
            chrome: undefined,
            /**
             * safari version
             * @type undefined|Number
             * @member KISSY.UA
             */
            safari: undefined,
            /**
             * firefox version
             * @type undefined|Number
             * @member KISSY.UA
             */
            firefox: undefined,
            /**
             * ie version
             * @type undefined|Number
             * @member KISSY.UA
             */
            ie: undefined,
            /**
             * ie document mode
             * @type undefined|Number
             * @member KISSY.UA
             */
            ieMode: undefined,
            /**
             * opera version
             * @type undefined|Number
             * @member KISSY.UA
             */
            opera: undefined,
            /**
             * mobile browser. apple, android.
             * @type String
             * @member KISSY.UA
             */
            mobile: undefined,
            /**
             * browser render engine name. webkit, trident
             * @type String
             * @member KISSY.UA
             */
            core: undefined,
            /**
             * browser shell name. ie, chrome, firefox
             * @type String
             * @member KISSY.UA
             */
            shell: undefined,

            /**
             * PhantomJS version number
             * @type undefined|Number
             * @member KISSY.UA
             */
            phantomjs: undefined,

            /**
             * operating system. android, ios, linux, windows
             * @type string
             * @member KISSY.UA
             */
            os: undefined,

            /**
             * ipad ios version
             * @type Number
             * @member KISSY.UA
             */
            ipad: undefined,
            /**
             * iphone ios version
             * @type Number
             * @member KISSY.UA
             */
            iphone: undefined,
            /**
             * ipod ios
             * @type Number
             * @member KISSY.UA
             */
            ipod: undefined,
            /**
             * ios version
             * @type Number
             * @member KISSY.UA
             */
            ios: undefined,

            /**
             * android version
             * @type Number
             * @member KISSY.UA
             */
            android: undefined,

            /**
             * nodejs version
             * @type Number
             * @member KISSY.UA
             */
            nodejs: undefined
        };

        // ejecta
        if (div && div.getElementsByTagName) {
            // try to use IE-Conditional-Comment detect IE more accurately
            // IE10 doesn't support this method, @ref: http://blogs.msdn.com/b/ie/archive/2011/07/06/html5-parsing-in-ie10.aspx
            div.innerHTML = IE_DETECT_TPL.replace(VERSION_PLACEHOLDER, '');
            s = div.getElementsByTagName('s');
        }

        if (s.length > 0) {

            setTridentVersion(ua, UA);

            // Detect the accurate version
            // 注意：
            //  UA.shell = ie, 表示外壳是 ie
            //  但 UA.ie = 7, 并不代表外壳是 ie7, 还有可能是 ie8 的兼容模式
            //  对于 ie8 的兼容模式，还要通过 documentMode 去判断。但此处不能让 UA.ie = 8, 否则
            //  很多脚本判断会失误。因为 ie8 的兼容模式表现行为和 ie7 相同，而不是和 ie8 相同
            for (v = IE_DETECT_RANGE[0], end = IE_DETECT_RANGE[1]; v <= end; v++) {
                div.innerHTML = IE_DETECT_TPL.replace(VERSION_PLACEHOLDER, v);
                if (s.length > 0) {
                    UA[shell = 'ie'] = v;
                    break;
                }
            }

            // https://github.com/kissyteam/kissy/issues/321
            // win8 embed app
            if (!UA.ie && (ieVersion = getIEVersion(ua))) {
                UA[shell = 'ie'] = ieVersion;
            }

        } else {
            // WebKit
            if ((m = ua.match(/AppleWebKit\/([\d.]*)/)) && m[1]) {
                UA[core = 'webkit'] = numberify(m[1]);

                if ((m = ua.match(/OPR\/(\d+\.\d+)/)) && m[1]) {
                    UA[shell = 'opera'] = numberify(m[1]);
                }
                // Chrome
                else if ((m = ua.match(/Chrome\/([\d.]*)/)) && m[1]) {
                    UA[shell = 'chrome'] = numberify(m[1]);
                }
                // Safari
                else if ((m = ua.match(/\/([\d.]*) Safari/)) && m[1]) {
                    UA[shell = 'safari'] = numberify(m[1]);
                }

                // Apple Mobile
                if (/ Mobile\//.test(ua) && ua.match(/iPad|iPod|iPhone/)) {
                    UA.mobile = 'apple'; // iPad, iPhone or iPod Touch

                    m = ua.match(/OS ([^\s]*)/);
                    if (m && m[1]) {
                        UA.ios = numberify(m[1].replace('_', '.'));
                    }
                    os = 'ios';
                    m = ua.match(/iPad|iPod|iPhone/);
                    if (m && m[0]) {
                        UA[m[0].toLowerCase()] = UA.ios;
                    }
                } else if (/ Android/i.test(ua)) {
                    if (/Mobile/.test(ua)) {
                        os = UA.mobile = 'android';
                    }
                    m = ua.match(/Android ([^\s]*);/);
                    if (m && m[1]) {
                        UA.android = numberify(m[1]);
                    }
                }
                // Other WebKit Mobile Browsers
                else if ((m = ua.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/))) {
                    UA.mobile = m[0].toLowerCase(); // Nokia N-series, Android, webOS, ex: NokiaN95
                }

                if ((m = ua.match(/PhantomJS\/([^\s]*)/)) && m[1]) {
                    UA.phantomjs = numberify(m[1]);
                }
            }
            // NOT WebKit
            else {
                // Presto
                // ref: http://www.useragentstring.com/pages/useragentstring.php
                if ((m = ua.match(/Presto\/([\d.]*)/)) && m[1]) {
                    UA[core = 'presto'] = numberify(m[1]);

                    // Opera
                    if ((m = ua.match(/Opera\/([\d.]*)/)) && m[1]) {
                        UA[shell = 'opera'] = numberify(m[1]); // Opera detected, look for revision

                        if ((m = ua.match(/Opera\/.* Version\/([\d.]*)/)) && m[1]) {
                            UA[shell] = numberify(m[1]);
                        }

                        // Opera Mini
                        if ((m = ua.match(/Opera Mini[^;]*/)) && m) {
                            UA.mobile = m[0].toLowerCase(); // ex: Opera Mini/2.0.4509/1316
                        }
                        // Opera Mobile
                        // ex: Opera/9.80 (Windows NT 6.1; Opera Mobi/49; U; en) Presto/2.4.18 Version/10.00
                        // issue: 由于 Opera Mobile 有 Version/ 字段，可能会与 Opera 混淆，同时对于 Opera Mobile 的版本号也比较混乱
                        else if ((m = ua.match(/Opera Mobi[^;]*/)) && m) {
                            UA.mobile = m[0];
                        }
                    }

                    // NOT WebKit or Presto
                } else {
                    // MSIE
                    // 由于最开始已经使用了 IE 条件注释判断，因此落到这里的唯一可能性只有 IE10+
                    // and analysis tools in nodejs
                    if ((ieVersion = getIEVersion(ua))) {
                        UA[shell = 'ie'] = ieVersion;
                        setTridentVersion(ua, UA);
                        // NOT WebKit, Presto or IE
                    } else {
                        // Gecko
                        if ((m = ua.match(/Gecko/))) {
                            UA[core = 'gecko'] = 0.1; // Gecko detected, look for revision
                            if ((m = ua.match(/rv:([\d.]*)/)) && m[1]) {
                                UA[core] = numberify(m[1]);
                                if (/Mobile|Tablet/.test(ua)) {
                                    UA.mobile = 'firefox';
                                }
                            }
                            // Firefox
                            if ((m = ua.match(/Firefox\/([\d.]*)/)) && m[1]) {
                                UA[shell = 'firefox'] = numberify(m[1]);
                            }
                        }
                    }
                }
            }
        }

        if (!os) {
            if ((/windows|win32/i).test(ua)) {
                os = 'windows';
            } else if ((/macintosh|mac_powerpc/i).test(ua)) {
                os = 'macintosh';
            } else if ((/linux/i).test(ua)) {
                os = 'linux';
            } else if ((/rhino/i).test(ua)) {
                os = 'rhino';
            }
        }

        UA.os = os;
        UA.core = UA.core || core;
        UA.shell = shell;
        UA.ieMode = UA.ie && doc.documentMode || UA.ie;

        return UA;
    }

    var UA = KISSY.UA = getDescriptorFromUserAgent(ua);

    // nodejs
    if (typeof process === 'object') {
        var versions, nodeVersion;

        if ((versions = process.versions) && (nodeVersion = versions.node)) {
            UA.os = process.platform;
            UA.nodejs = numberify(nodeVersion);
        }
    }

    // use by analysis tools in nodejs
    UA.getDescriptorFromUserAgent = getDescriptorFromUserAgent;

    var browsers = [
            // browser core type
            'webkit',
            'trident',
            'gecko',
            'presto',
            // browser type
            'chrome',
            'safari',
            'firefox',
            'ie',
            'opera'
        ],
        documentElement = doc && doc.documentElement,
        className = '';
    if (documentElement) {
        S.each(browsers, function (key) {
            var v = UA[key];
            if (v) {
                className += ' ks-' + key + (parseInt(v) + '');
                className += ' ks-' + key;
            }
        });
        if (S.trim(className)) {
            documentElement.className = S.trim(documentElement.className + className);
        }
    }
})(KISSY);

/*
 NOTES:
 2013.07.08 yiminghe@gmail.com
 - support ie11 and opera(using blink)

 2013.01.17 yiminghe@gmail.com
 - expose getDescriptorFromUserAgent for analysis tool in nodejs

 2012.11.27 yiminghe@gmail.com
 - moved to seed for conditional loading and better code share

 2012.11.21 yiminghe@gmail.com
 - touch and os support

 2011.11.08 gonghaocn@gmail.com
 - ie < 10 使用条件注释判断内核，更精确

 2010.03
 - jQuery, YUI 等类库都推荐用特性探测替代浏览器嗅探。特性探测的好处是能自动适应未来设备和未知设备，比如
 if(document.addEventListener) 假设 IE9 支持标准事件，则代码不用修改，就自适应了“未来浏览器”。
 对于未知浏览器也是如此。但是，这并不意味着浏览器嗅探就得彻底抛弃。当代码很明确就是针对已知特定浏览器的，
 同时并非是某个特性探测可以解决时，用浏览器嗅探反而能带来代码的简洁，同时也也不会有什么后患。总之，一切
 皆权衡。
 - UA.ie && UA.ie < 8 并不意味着浏览器就不是 IE8, 有可能是 IE8 的兼容模式。进一步的判断需要使用 documentMode.
 */
/**
 * @ignore
 * detect if current browser supports various features.
 * @author yiminghe@gmail.com
 */
(function (S, undefined) {
    var Env = S.Env,
        win = Env.host,
        UA = S.UA,
        VENDORS = [
            '',
            'Webkit',
            'Moz',
            'O',
            // ms is special .... !
            'ms'
        ],
    // nodejs
        doc = win.document || {},
        isMsPointerSupported,
    // ie11
        isPointerSupported,
        transitionProperty,
        transformProperty,
        transitionPrefix,
        transformPrefix,
        isTransform3dSupported,
        documentElement = doc.documentElement,
        documentElementStyle,
        isClassListSupportedState = true,
        isQuerySelectorSupportedState = false,
    // phantomjs issue: http://code.google.com/p/phantomjs/issues/detail?id=375
        isTouchEventSupportedState = ('ontouchstart' in doc) && !(UA.phantomjs),
        ie = UA.ieMode;

    if (documentElement) {
        if (documentElement.querySelector &&
            // broken ie8
            ie !== 8) {
            isQuerySelectorSupportedState = true;
        }
        documentElementStyle = documentElement.style;

        S.each(VENDORS, function (val) {
            var transition = val ? val + 'Transition' : 'transition',
                transform = val ? val + 'Transform' : 'transform';
            if (transitionPrefix === undefined &&
                transition in documentElementStyle) {
                transitionPrefix = val;
                transitionProperty = transition;
            }
            if (transformPrefix === undefined &&
                transform in documentElementStyle) {
                transformPrefix = val;
                transformProperty = transform;
            }
        });

        isClassListSupportedState = 'classList' in documentElement;
        var navigator = (win.navigator || {});
        isMsPointerSupported = 'msPointerEnabled' in navigator;
        isPointerSupported = 'pointerEnabled' in navigator;

        if (transformProperty) {
            // https://gist.github.com/lorenzopolidori/3794226
            // ie9 does not support 3d transform
            // http://msdn.microsoft.com/en-us/ie/ff468705
            var el = doc.createElement('p');
            documentElement.insertBefore(el, documentElement.firstChild);
            el.style[transformProperty] = 'translate3d(1px,1px,1px)';
            var computedStyle = win.getComputedStyle(el);
            var has3d = computedStyle.getPropertyValue(transformProperty) || computedStyle[transformProperty];
            documentElement.removeChild(el);
            isTransform3dSupported = (has3d !== undefined && has3d.length > 0 && has3d !== 'none');
        }
    }

    /**
     * browser features detection
     * @class KISSY.Features
     * @private
     * @singleton
     */
    S.Features = {
        // http://blogs.msdn.com/b/ie/archive/2011/09/20/touch-input-for-ie10-and-metro-style-apps.aspx
        /**
         * whether support microsoft pointer event.
         * @type {Boolean}
         */
        isMsPointerSupported: function () {
            // ie11 onMSPointerDown but e.type==pointerdown
            return isMsPointerSupported;
        },

        /**
         * whether support microsoft pointer event (ie11).
         * @type {Boolean}
         */
        isPointerSupported: function () {
            // ie11
            return isPointerSupported;
        },

        /**
         * whether support touch event.
         * @return {Boolean}
         */
        isTouchEventSupported: function () {
            return isTouchEventSupportedState;
        },

        isTouchGestureSupported: function () {
            return isTouchEventSupportedState || isPointerSupported || isMsPointerSupported;
        },

        /**
         * whether support device motion event
         * @returns {boolean}
         */
        isDeviceMotionSupported: function () {
            return !!win.DeviceMotionEvent;
        },

        /**
         * whether support hashchange event
         * @returns {boolean}
         */
        'isHashChangeSupported': function () {
            // ie8 支持 hashchange
            // 但 ie8 以上切换浏览器模式到 ie7（兼容模式），
            // 会导致 'onhashchange' in window === true，但是不触发事件
            return ( 'onhashchange' in win) && (!ie || ie > 7);
        },

        /**
         * whether support css transition
         * @returns {boolean}
         */
        'isTransitionSupported': function () {
            return transitionPrefix !== undefined;
        },

        /**
         * whether support css transform
         * @returns {boolean}
         */
        'isTransformSupported': function () {
            return transformPrefix !== undefined;
        },

        /**
         * whether support css transform 3d
         * @returns {boolean}
         */
        'isTransform3dSupported': function () {
            return isTransform3dSupported;
        },

        /**
         * whether support class list api
         * @returns {boolean}
         */
        'isClassListSupported': function () {
            return isClassListSupportedState;
        },

        /**
         * whether support querySelectorAll
         * @returns {boolean}
         */
        'isQuerySelectorSupported': function () {
            // force to use js selector engine
            return !S.config('dom/selector') &&
                isQuerySelectorSupportedState;
        },

        /**
         * whether is ie and ie version is less than specified version
         * @param {Number} v specified ie version to be compared
         * @returns {boolean}
         */
        'isIELessThan': function (v) {
            return !!(ie && ie < v);
        },

        /**
         * get css transition browser prefix if support css transition
         * @returns {String}
         */
        'getTransitionPrefix': function () {
            return transitionPrefix;
        },

        /**
         * get css transform browser prefix if support css transform
         * @returns {String}
         */
        'getTransformPrefix': function () {
            return transformPrefix;
        },

        /**
         * get css transition property if support css transition
         * @returns {String}
         */
        'getTransitionProperty': function () {
            return transitionProperty;
        },

        /**
         * get css transform property if support css transform
         * @returns {String}
         */
        'getTransformProperty': function () {
            return transformProperty;
        }
    };
})(KISSY);/**
 * @ignore
 * setup data structure for kissy loader
 * @author yiminghe@gmail.com
 */
(function (S) {
    var Loader = S.Loader = {};

    /**
     * Loader Status Enum
     * @enum {Number} KISSY.Loader.Status
     */
    Loader.Status = {
        /** error */
        'ERROR': -1,
        /** init */
        'INIT': 0,
        /** loading */
        'LOADING': 1,
        /** loaded */
        'LOADED': 2,
        /**dependencies are loaded or attached*/
        'READY_TO_ATTACH': 3,
        /** attaching */
        'ATTACHING': 4,
        /** attached */
        'ATTACHED': 5
    };
})(KISSY);/**
 * @ignore
 * Utils for kissy loader
 * @author yiminghe@gmail.com
 */
(function (S) {
    var Loader = S.Loader,
        Path = S.Path,
        host = S.Env.host,
        TRUE = !0,
        FALSE = !1,
        startsWith = S.startsWith,
        data = Loader.Status,
        ATTACHED = data.ATTACHED,
        READY_TO_ATTACH = data.READY_TO_ATTACH,
        LOADED = data.LOADED,
        ATTACHING = data.ATTACHING,
        ERROR = data.ERROR,
        /**
         * @class KISSY.Loader.Utils
         * Utils for KISSY Loader
         * @singleton
         * @private
         */
            Utils = Loader.Utils = {},
        doc = host.document;

    // http://wiki.commonjs.org/wiki/Packages/Mappings/A
    // 如果模块名以 / 结尾，自动加 index
    function addIndexAndRemoveJsExt(s) {
        if (typeof s === 'string') {
            return addIndexAndRemoveJsExtFromName(s);
        } else {
            var ret = [],
                i = 0,
                l = s.length;
            for (; i < l; i++) {
                ret[i] = addIndexAndRemoveJsExtFromName(s[i]);
            }
            return ret;
        }
    }

    function addIndexAndRemoveJsExtFromName(name) {
        // 'x/' 'x/y/z/'
        if (name.charAt(name.length - 1) === '/') {
            name += 'index';
        }
        if (S.endsWith(name, '.js')) {
            name = name.slice(0, -3);
        }
        return name;
    }

    function pluginAlias(runtime, name) {
        var index = name.indexOf('!');
        if (index !== -1) {
            var pluginName = name.substring(0, index);
            name = name.substring(index + 1);
            S.use(pluginName, {
                sync: true,
                success: function (S, Plugin) {
                    if (Plugin.alias) {
                        //noinspection JSReferencingMutableVariableFromClosure
                        name = Plugin.alias(runtime, name, pluginName);
                    }
                }
            });
        }
        return name;
    }

    S.mix(Utils, {
        /**
         * get document head
         * @return {HTMLElement}
         */
        docHead: function () {
            return doc.getElementsByTagName('head')[0] || doc.documentElement;
        },

        /**
         * Get absolute path of dep module.similar to {@link KISSY.Path#resolve}
         * @param {String} moduleName current module 's name
         * @param {String|String[]} depName dependency module 's name
         * @return {String|String[]} normalized dependency module 's name
         */
        normalDepModuleName: function (moduleName, depName) {
            var i = 0, l;

            if (!depName) {
                return depName;
            }

            if (typeof depName === 'string') {
                if (startsWith(depName, '../') || startsWith(depName, './')) {
                    // x/y/z -> x/y/
                    return Path.resolve(Path.dirname(moduleName), depName);
                }

                return Path.normalize(depName);
            }

            for (l = depName.length; i < l; i++) {
                depName[i] = Utils.normalDepModuleName(moduleName, depName[i]);
            }
            return depName;
        },

        /**
         * create modules info
         * @param runtime Module container, such as KISSY
         * @param {String[]} modNames to be created module names
         */
        createModulesInfo: function (runtime, modNames) {
            S.each(modNames, function (m) {
                Utils.createModuleInfo(runtime, m);
            });
        },

        /**
         * create single module info
         * @param runtime Module container, such as KISSY
         * @param {String} modName to be created module name
         * @param {Object} [cfg] module config
         * @return {KISSY.Loader.Module}
         */
        createModuleInfo: function (runtime, modName, cfg) {
            modName = addIndexAndRemoveJsExtFromName(modName);

            var mods = runtime.Env.mods,
                module = mods[modName];

            if (module) {
                return module;
            }

            // 防止 cfg 里有 tag，构建 fullpath 需要
            mods[modName] = module = new Loader.Module(S.mix({
                name: modName,
                runtime: runtime
            }, cfg));

            return module;
        },

        /**
         * Get modules exports
         * @param runtime Module container, such as KISSY
         * @param {String[]} modNames module names
         * @return {Array} modules exports
         */
        getModules: function (runtime, modNames) {
            var mods = [runtime], module,
                unalias,
                allOk,
                m,
                runtimeMods = runtime.Env.mods;

            S.each(modNames, function (modName) {
                module = runtimeMods[modName];
                if (!module || module.getType() !== 'css') {
                    unalias = Utils.unalias(runtime, modName);
                    allOk = S.reduce(unalias, function (a, n) {
                        m = runtimeMods[n];
                        // allow partial module (circular dependency)
                        return a && m && m.status >= ATTACHING;
                    }, true);
                    if (allOk) {
                        mods.push(runtimeMods[unalias[0]].exports);
                    } else {
                        mods.push(null);
                    }
                } else {
                    mods.push(undefined);
                }
            });

            return mods;
        },

        /**
         * attach modules and their dependency modules recursively
         * @param {String[]} modNames module names
         * @param runtime Module container, such as KISSY
         */
        attachModsRecursively: function (modNames, runtime) {
            var i,
                l = modNames.length;
            for (i = 0; i < l; i++) {
                Utils.attachModRecursively(modNames[i], runtime);
            }
        },

        checkModsLoadRecursively: function (modNames, runtime, stack, errorList, cache) {
            // for debug. prevent circular dependency
            stack = stack || [];
            // for efficiency. avoid duplicate non-attach check
            cache = cache || {};
            var i,
                s = 1,
                l = modNames.length,
                stackDepth = stack.length;
            for (i = 0; i < l; i++) {
                s = s && Utils.checkModLoadRecursively(modNames[i], runtime, stack, errorList, cache);
                stack.length = stackDepth;
            }
            return !!s;
        },

        checkModLoadRecursively: function (modName, runtime, stack, errorList, cache) {
            var mods = runtime.Env.mods,
                status,
                m = mods[modName];
            if (modName in cache) {
                return cache[modName];
            }
            if (!m) {
                cache[modName] = FALSE;
                return FALSE;
            }
            status = m.status;
            if (status === ERROR) {
                errorList.push(m);
                cache[modName] = FALSE;
                return FALSE;
            }
            if (status >= READY_TO_ATTACH) {
                cache[modName] = TRUE;
                return TRUE;
            }
            if (status !== LOADED) {
                cache[modName] = FALSE;
                return FALSE;
            }
            if ('@DEBUG@') {
                if (S.inArray(modName, stack)) {
                    S.log('find cyclic dependency between mods: ' + stack, 'warn');
                    cache[modName] = TRUE;
                    return TRUE;
                }
                stack.push(modName);
            }

            if (Utils.checkModsLoadRecursively(m.getNormalizedRequires(),
                runtime, stack, errorList, cache)) {
                m.status = READY_TO_ATTACH;
                cache[modName] = TRUE;
                return TRUE;
            }

            cache[modName] = FALSE;
            return FALSE;
        },

        /**
         * attach module and its dependency modules recursively
         * @param {String} modName module name
         * @param runtime Module container, such as KISSY
         */
        attachModRecursively: function (modName, runtime) {
            var mods = runtime.Env.mods,
                status,
                m = mods[modName];
            status = m.status;
            // attached or circular dependency
            if (status >= ATTACHING) {
                return;
            }
            m.status = ATTACHING;
            if (m.cjs) {
                // commonjs format will call require in module code again
                Utils.attachMod(runtime, m);
            } else {
                Utils.attachModsRecursively(m.getNormalizedRequires(), runtime);
                Utils.attachMod(runtime, m);
            }
        },

        /**
         * Attach specified module.
         * @param runtime Module container, such as KISSY
         * @param {KISSY.Loader.Module} module module instance
         */
        attachMod: function (runtime, module) {
            var factory = module.factory,
                exports;

            if (typeof factory === 'function') {
                // compatible and efficiency
                // KISSY.add('h5-lodge-wifi/libs/seed',function(S,undefined){})
                var require;
                if (module.requires && module.requires.length) {
                    require = S.bind(module.require, module);
                }
                // 需要解开 index，相对路径
                // 但是需要保留 alias，防止值不对应
                //noinspection JSUnresolvedFunction
                exports = factory.apply(module,
                    // KISSY.add(function(S){module.require}) lazy initialize
                    (module.cjs ? [runtime, require, module.exports, module] : Utils.getModules(runtime, module.getRequiresWithAlias())));
                if (exports !== undefined) {
                    //noinspection JSUndefinedPropertyAssignment
                    module.exports = exports;
                }
            } else {
                //noinspection JSUndefinedPropertyAssignment
                module.exports = factory;
            }

            module.status = ATTACHED;
        },

        /**
         * Get module names as array.
         * @param {String|String[]} modNames module names array or  module names string separated by ','
         * @return {String[]}
         */
        getModNamesAsArray: function (modNames) {
            if (typeof modNames === 'string') {
                modNames = modNames.replace(/\s+/g, '').split(',');
            }
            return modNames;
        },

        /**
         * normalize module names
         * 1. add index : / => /index
         * 2. unalias : core => dom,event,ua
         * 3. relative to absolute : ./x => y/x
         * @param {KISSY} runtime Global KISSY instance
         * @param {String|String[]} modNames Array of module names
         *  or module names string separated by comma
         * @param {String} [refModName]
         * @return {String[]} normalized module names
         */
        normalizeModNames: function (runtime, modNames, refModName) {
            return Utils.unalias(runtime,
                Utils.normalizeModNamesWithAlias(runtime, modNames, refModName));
        },

        /**
         * unalias module name.
         * @param runtime Module container, such as KISSY
         * @param {String|String[]} names moduleNames
         * @return {String[]} unalias module names
         */
        unalias: function (runtime, names) {
            var ret = [].concat(names),
                i,
                m,
                alias,
                ok = 0,
                j,
                mods = runtime.Env.mods;
            while (!ok) {
                ok = 1;
                for (i = ret.length - 1; i >= 0; i--) {
                    if ((m = mods[ret[i]]) && ('alias' in m)) {
                        ok = 0;
                        alias = m.alias;
                        if (typeof alias === 'string') {
                            alias = [alias];
                        }
                        for (j = alias.length - 1; j >= 0; j--) {
                            if (!alias[j]) {
                                alias.splice(j, 1);
                            }
                        }
                        ret.splice.apply(ret, [i, 1].concat(addIndexAndRemoveJsExt(alias)));
                    }
                }
            }
            return ret;
        },

        /**
         * normalize module names with alias
         * @param runtime Module container, such as KISSY
         * @param {String[]} modNames module names
         * @param [refModName] module to be referred if module name path is relative
         * @return {String[]} normalize module names with alias
         */
        normalizeModNamesWithAlias: function (runtime, modNames, refModName) {
            var ret = [], i, l;
            if (modNames) {
                // 1. index map
                for (i = 0, l = modNames.length; i < l; i++) {
                    // conditional loader
                    // requires:[window.localStorage?"local-storage":""]
                    if (modNames[i]) {
                        ret.push(pluginAlias(runtime, addIndexAndRemoveJsExt(modNames[i])));
                    }
                }
            }
            // 2. relative to absolute (optional)
            if (refModName) {
                ret = Utils.normalDepModuleName(refModName, ret);
            }
            return ret;
        },

        /**
         * register module with factory
         * @param runtime Module container, such as KISSY
         * @param {String} name module name
         * @param {Function|*} factory module's factory or exports
         * @param [config] module config, such as dependency
         */
        registerModule: function (runtime, name, factory, config) {
            name = addIndexAndRemoveJsExtFromName(name);

            var mods = runtime.Env.mods,
                module = mods[name];

            if (module && module.factory !== undefined) {
                S.log(name + ' is defined more than once', 'warn');
                return;
            }

            // 没有 use，静态载入的 add 可能执行
            Utils.createModuleInfo(runtime, name);

            module = mods[name];

            // 注意：通过 S.add(name[, factory[, config]]) 注册的代码，无论是页面中的代码，
            // 还是 js 文件里的代码，add 执行时，都意味着该模块已经 LOADED
            S.mix(module, {
                name: name,
                status: LOADED,
                factory: factory
            });

            S.mix(module, config);
        },

        /**
         * Returns hash code of a string djb2 algorithm
         * @param {String} str
         * @returns {String} hash code
         */
        getHash: function (str) {
            var hash = 5381,
                i;
            for (i = str.length; --i > -1;) {
                hash = ((hash << 5) + hash) + str.charCodeAt(i);
                /* hash * 33 + char */
            }
            return hash + '';
        },

        getRequiresFromFn: function (fn) {
            var requires = [];
            // Remove comments from the callback string,
            // look for require calls, and pull them into the dependencies,
            // but only if there are function args.
            fn.toString()
                .replace(commentRegExp, '')
                .replace(requireRegExp, function (match, dep) {
                    requires.push(getRequireVal(dep));
                });
            return requires;
        }
    });

    var commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,
        requireRegExp = /[^.'"]\s*require\s*\(([^)]+)\)/g;

    function getRequireVal(str) {
        var m;
        // simple string
        if (!(m = str.match(/^\s*["']([^'"\s]+)["']\s*$/))) {
            S.error('can not find required mod in require call: ' + str);
        }
        return  m[1];
    }
})(KISSY);/**
 * @ignore
 * setup data structure for kissy loader
 * @author yiminghe@gmail.com
 */
(function (S) {
    var Loader = S.Loader,
        Path = S.Path,
        IGNORE_PACKAGE_NAME_IN_URI = 'ignorePackageNameInUri',
        Utils = Loader.Utils;

    function forwardSystemPackage(self, property) {
        return property in self ?
            self[property] :
            self.runtime.Config[property];
    }

    /**
     * @class KISSY.Loader.Package
     * @private
     * This class should not be instantiated manually.
     */
    function Package(cfg) {
        S.mix(this, cfg);
    }

    Package.prototype = {
        constructor: Package,

        reset: function (cfg) {
            S.mix(this, cfg);
        },

        /**
         * Tag for package.
         * tag can not contain ".", eg: Math.random() !
         * @return {String}
         */
        getTag: function () {
            return forwardSystemPackage(this, 'tag');
        },

        /**
         * Get package name.
         * @return {String}
         */
        getName: function () {
            return this.name;
        },

        /**
         * Get package base.
         * @return {String}
         */
        'getBase': function () {
            return forwardSystemPackage(this, 'base');
        },

        getPrefixUriForCombo: function () {
            var self = this,
                packageName = self.name;
            return self.getBase() + (
                packageName && !self.isIgnorePackageNameInUri() ?
                    (packageName + '/') :
                    ''
                );
        },

        /**
         * get package uri
         */
        getPackageUri: function () {
            var self = this;
            if (!self.packageUri) {
                self.packageUri = new S.Uri(this.getPrefixUriForCombo());
            }
            return self.packageUri;
        },

        /**
         * Get package baseUri
         * @return {KISSY.Uri}
         */
        getBaseUri: function () {
            return forwardSystemPackage(this, 'baseUri');
        },

        /**
         * Whether is debug for this package.
         * @return {Boolean}
         */
        isDebug: function () {
            return forwardSystemPackage(this, 'debug');
        },

        /**
         *  whether request mod file without insert package name into package base
         *  @return {Boolean}
         */
        isIgnorePackageNameInUri: function () {
            return forwardSystemPackage(this, IGNORE_PACKAGE_NAME_IN_URI);
        },

        /**
         * Get charset for package.
         * @return {String}
         */
        getCharset: function () {
            return forwardSystemPackage(this, 'charset');
        },

        /**
         * Whether modules are combined for this package.
         * @return {Boolean}
         */
        isCombine: function () {
            return forwardSystemPackage(this, 'combine');
        },

        /**
         * Get package group (for combo).
         * @returns {String}
         */
        getGroup: function () {
            return forwardSystemPackage(this, 'group');
        }
    };

    Loader.Package = Package;

    /**
     * @class KISSY.Loader.Module
     * @private
     * This class should not be instantiated manually.
     */
    function Module(cfg) {
        var module = this;
        /**
         * exports of this module
         */
        module.exports = {};

        /**
         * status of current modules
         */
        module.status = Loader.Status.INIT;

        /**
         * name of this module
         */
        module.name = undefined;
        /**
         * factory of this module
         */
        module.factory = undefined;
        // lazy initialize and commonjs module format
        module.cjs = 1;
        S.mix(module, cfg);
        module.waitedCallbacks = [];
    }

    Module.prototype = {
        kissy: 1,

        constructor: Module,

        /**
         * resolve module by name.
         * @param {String|String[]} relativeName relative module's name
         * @param {Function|Object} fn KISSY.use callback
         * @returns {String} resolved module name
         */
        'use': function (relativeName, fn) {
            relativeName = Utils.getModNamesAsArray(relativeName);
            return KISSY.use(Utils.normalDepModuleName(this.name, relativeName), fn);
        },

        /**
         * resolve path
         * @param {String} relativePath relative path
         * @returns {KISSY.Uri} resolve uri
         */
        'resolve': function (relativePath) {
            return this.getFullPathUri().resolve(relativePath);
        },

        // use by xtemplate include
        'resolveByName': function (relativeName) {
            return Utils.normalDepModuleName(this.name, relativeName);
        },

        /**
         * require other modules from current modules
         * @param {String} moduleName name of module to be required
         * @returns {*} required module exports
         */
        require: function (moduleName) {
            return S.require(moduleName, this.name);
        },

        wait: function (callback) {
            this.waitedCallbacks.push(callback);
        },

        notifyAll: function () {
            var callback;
            var len = this.waitedCallbacks.length,
                i = 0;
            for (; i < len; i++) {
                callback = this.waitedCallbacks[i];
                try {
                    callback(this);
                } catch (e) {
                    S.log(e.stack || e, 'error');
                    /*jshint loopfunc:true*/
                    setTimeout(function () {
                        throw e;
                    }, 0);
                }
            }
            this.waitedCallbacks = [];
        },

        /**
         * Get the type if current Module
         * @return {String} css or js
         */
        getType: function () {
            var self = this,
                v = self.type;
            if (!v) {
                if (Path.extname(self.name).toLowerCase() === '.css') {
                    v = 'css';
                } else {
                    v = 'js';
                }
                self.type = v;
            }
            return v;
        },

        /**
         * Get the fullpath uri of current module if load dynamically
         * @return {KISSY.Uri}
         */
        getFullPathUri: function () {
            var self = this,
                t,
                fullPathUri,
                packageBaseUri,
                packageInfo,
                packageName,
                path;
            if (!self.fullPathUri) {
                // fullpath can be specified
                if (self.fullpath) {
                    fullPathUri = new S.Uri(self.fullpath);
                } else {
                    packageInfo = self.getPackage();
                    packageBaseUri = packageInfo.getBaseUri();
                    path = self.getPath();
                    // #262
                    if (packageInfo.isIgnorePackageNameInUri() &&
                        // native mod does not allow ignore package name
                        (packageName = packageInfo.name)) {
                        path = Path.relative(packageName, path);
                    }
                    fullPathUri = packageBaseUri.resolve(path);
                    if ((t = self.getTag())) {
                        t += '.' + self.getType();
                        fullPathUri.query.set('t', t);
                    }
                }
                self.fullPathUri = fullPathUri;
            }
            return self.fullPathUri;
        },

        /**
         * Get the fullpath of current module if load dynamically
         * @return {String}
         */
        getFullPath: function () {
            var self = this,
                fullPathUri;
            if (!self.fullpath) {
                fullPathUri = self.getFullPathUri();
                self.fullpath = fullPathUri.toString();
            }
            return self.fullpath;
        },

        /**
         * Get the path (without package base)
         * @return {String}
         */
        getPath: function () {
            var self = this;
            return self.path || (self.path = defaultComponentJsName(self));
        },

        /**
         * Get the name of current module
         * @return {String}
         */
        getName: function () {
            return this.name;
        },

        /**
         * Get the package which current module belongs to.
         * @return {KISSY.Loader.Package}
         */
        getPackage: function () {
            var self = this;
            return self.packageInfo ||
                (self.packageInfo = getPackage(self.runtime, self.name));
        },

        /**
         * Get the tag of current module.
         * tag can not contain ".", eg: Math.random() !
         * @return {String}
         */
        getTag: function () {
            var self = this;
            return self.tag || self.getPackage().getTag();
        },

        /**
         * Get the charset of current module
         * @return {String}
         */
        getCharset: function () {
            var self = this;
            return self.charset || self.getPackage().getCharset();
        },

        /**
         * get alias required module names
         * @returns {String[]} alias required module names
         */
        getRequiresWithAlias: function () {
            var self = this,
                requiresWithAlias = self.requiresWithAlias,
                requires = self.requires;
            if (!requires || requires.length === 0) {
                return requires || [];
            } else if (!requiresWithAlias) {
                self.requiresWithAlias = requiresWithAlias =
                    Utils.normalizeModNamesWithAlias(self.runtime, requires, self.name);
            }
            return requiresWithAlias;
        },

        /**
         * Get module objects required by this module
         * @return {KISSY.Loader.Module[]}
         */
        getRequiredMods: function () {
            var self = this,
                runtime = self.runtime;
            return S.map(self.getNormalizedRequires(), function (r) {
                return Utils.createModuleInfo(runtime, r);
            });
        },

        /**
         * Get module names required by this module
         * @return {String[]}
         */
        getNormalizedRequires: function () {
            var self = this,
                normalizedRequires,
                normalizedRequiresStatus = self.normalizedRequiresStatus,
                status = self.status,
                requires = self.requires;
            if (!requires || requires.length === 0) {
                return requires || [];
            } else if ((normalizedRequires = self.normalizedRequires) &&
                // 事先声明的依赖不能当做 loaded 状态下真正的依赖
                (normalizedRequiresStatus === status)) {
                return normalizedRequires;
            } else {
                self.normalizedRequiresStatus = status;
                self.normalizedRequires = Utils.normalizeModNames(self.runtime, requires, self.name);
                return self.normalizedRequires;
            }
        }
    };

    Loader.Module = Module;

    function defaultComponentJsName(m) {
        var name = m.name,
            extname = '.' + m.getType(),
            min = '-min';

        name = Path.join(Path.dirname(name), Path.basename(name, extname));

        if (m.getPackage().isDebug()) {
            min = '';
        }

        return name + min + extname;
    }

    var systemPackage = new Package({
        name: '',
        runtime: S
    });

    function getPackage(self, modName) {
        var packages = self.config('packages'),
            modNameSlash = modName + '/',
            pName = '',
            p;
        for (p in packages) {
            if (S.startsWith(modNameSlash, p + '/') && p.length > pName.length) {
                pName = p;
            }
        }
        return packages[pName] || systemPackage;
    }
})(KISSY);/**
 * @ignore
 * script/css load across browser
 * @author yiminghe@gmail.com
 */
(function (S) {
    var   logger = S.getLogger('s/loader/getScript');
    var CSS_POLL_INTERVAL = 30,
        UA = S.UA,

        Utils = S.Loader.Utils,
    // central poll for link node
        timer = 0,
    // node.id:{callback:callback,node:node}
        monitors = {};

    function startCssTimer() {
        if (!timer) {
            logger.debug('start css poll timer');
            cssPoll();
        }
    }

    function isCssLoaded(node, url) {
        var loaded = 0;
        if (UA.webkit) {
            // http://www.w3.org/TR/Dom-Level-2-Style/stylesheets.html
            if (node.sheet) {
                logger.debug('webkit css poll loaded: ' + url);
                loaded = 1;
            }
        } else if (node.sheet) {
            try {
                var cssRules = node.sheet.cssRules;
                if (cssRules) {
                    logger.debug('same domain css poll loaded: ' + url);
                    loaded = 1;
                }
            } catch (ex) {
                var exName = ex.name;
                logger.debug('css poll exception: ' + exName + ' ' + ex.code + ' ' + url);
                // http://www.w3.org/TR/dom/#dom-domexception-code
                if (// exName == 'SecurityError' ||
                // for old firefox
                    exName === 'NS_ERROR_DOM_SECURITY_ERR') {
                    logger.debug('css poll exception: ' + exName + 'loaded : ' + url);
                    loaded = 1;
                }
            }
        }
        return loaded;
    }

    // single thread is ok
    function cssPoll() {
        for (var url in monitors) {
            var callbackObj = monitors[url],
                node = callbackObj.node;
            if (isCssLoaded(node, url)) {
                if (callbackObj.callback) {
                    callbackObj.callback.call(node);
                }
                delete monitors[url];
            }
        }

        if (S.isEmptyObject(monitors)) {
            logger.debug('clear css poll timer');
            timer = 0;
        } else {
            timer = setTimeout(cssPoll, CSS_POLL_INTERVAL);
        }
    }

    // refer : http://lifesinger.org/lab/2011/load-js-css/css-preload.html
    // 暂时不考虑如何判断失败，如 404 等
    Utils.pollCss = function (node, callback) {
        var href = node.href,
            arr;
        arr = monitors[href] = {};
        arr.node = node;
        arr.callback = callback;
        startCssTimer();
    };

    Utils.isCssLoaded = isCssLoaded;
})(KISSY);
/*
 References:
 - http://unixpapa.com/js/dyna.html
 - http://www.blaze.io/technical/ies-premature-execution-problem/

 `onload` event is supported in WebKit since 535.23
 - https://bugs.webkit.org/show_activity.cgi?id=38995
 `onload/onerror` event is supported since Firefox 9.0
 - https://bugzilla.mozilla.org/show_bug.cgi?id=185236
 - https://developer.mozilla.org/en/HTML/Element/link#Stylesheet_load_events

 monitor css onload across browsers.issue about 404 failure.
 - firefox not ok（4 is wrong）：
 - http://yearofmoo.com/2011/03/cross-browser-stylesheet-preloading/
 - all is ok
 - http://lifesinger.org/lab/2011/load-js-css/css-preload.html
 - others
 - http://www.zachleat.com/web/load-css-dynamically/
 *//**
 * @ignore
 * getScript support for css and js callback after load
 * @author yiminghe@gmail.com
 */
(function (S) {
    var MILLISECONDS_OF_SECOND = 1000,
        doc = S.Env.host.document,
        Utils = S.Loader.Utils,
        Path = S.Path,
        jsCssCallbacks = {},
        headNode,
        UA = S.UA;

    /**
     * Load a javascript/css file from the server using a GET HTTP request,
     * then execute it.
     *
     * for example:
     *      @example
     *      getScript(url, success, charset);
     *      // or
     *      getScript(url, {
     *          charset: string
     *          success: fn,
     *          error: fn,
     *          timeout: number
     *      });
     *
     * Note 404/500 status in ie<9 will trigger success callback.
     * If you want a jsonp operation, please use {@link KISSY.IO} instead.
     *
     * @param {String} url resource's url
     * @param {Function|Object} [success] success callback or config
     * @param {Function} [success.success] success callback
     * @param {Function} [success.error] error callback
     * @param {Number} [success.timeout] timeout (s)
     * @param {String} [success.charset] charset of current resource
     * @param {String} [charset] charset of current resource
     * @return {HTMLElement} script/style node
     * @member KISSY
     */
    S.getScript = function (url, success, charset) {
        // can not use KISSY.Uri, url can not be encoded for some url
        // eg: /??dom.js,event.js , ? , should not be encoded
        var config = success,
            css = 0,
            error,
            timeout,
            attrs,
            callbacks,
            timer;

        if (S.startsWith(Path.extname(url).toLowerCase(), '.css')) {
            css = 1;
        }

        if (S.isPlainObject(config)) {
            success = config.success;
            error = config.error;
            timeout = config.timeout;
            charset = config.charset;
            attrs = config.attrs;
        }

        callbacks = jsCssCallbacks[url] = jsCssCallbacks[url] || [];

        callbacks.push([success, error]);

        if (callbacks.length > 1) {
            return callbacks.node;
        }

        var node = doc.createElement(css ? 'link' : 'script'),
            clearTimer = function () {
                if (timer) {
                    timer.cancel();
                    timer = undefined;
                }
            };

        if (attrs) {
            S.each(attrs, function (v, n) {
                node.setAttribute(n, v);
            });
        }

        if (charset) {
            node.charset = charset;
        }

        if (css) {
            node.href = url;
            node.rel = 'stylesheet';
        } else {
            node.src = url;
            node.async = true;
        }

        callbacks.node = node;

        var end = function (error) {
            var index = error,
                fn;
            clearTimer();
            S.each(jsCssCallbacks[url], function (callback) {
                if ((fn = callback[index])) {
                    fn.call(node);
                }
            });
            delete jsCssCallbacks[url];
        };

        var useNative = 'onload' in node;
        // onload for webkit 535.23  Firefox 9.0
        // https://bugs.webkit.org/show_activity.cgi?id=38995
        // https://bugzilla.mozilla.org/show_bug.cgi?id=185236
        // https://developer.mozilla.org/en/HTML/Element/link#Stylesheet_load_events
        // phantomjs 1.7 == webkit 534.34
        var forceCssPoll = S.Config.forceCssPoll || (UA.webkit && UA.webkit < 536);

        if (css && forceCssPoll && useNative) {
            useNative = false;
        }

        function onload() {
            var readyState = node.readyState;
            if (!readyState ||
                readyState === 'loaded' ||
                readyState === 'complete') {
                node.onreadystatechange = node.onload = null;
                end(0);
            }
        }

        //标准浏览器 css and all script
        if (useNative) {
            node.onload = onload;
            node.onerror = function () {
                node.onerror = null;
                end(1);
            };
        }
        // old chrome/firefox for css
        else if (css) {
            Utils.pollCss(node, function () {
                end(0);
            });
        } else {
            node.onreadystatechange = onload;
        }

        if (timeout) {
            timer = S.later(function () {
                end(1);
            }, timeout * MILLISECONDS_OF_SECOND);
        }
        if (!headNode) {
            headNode = Utils.docHead();
        }
        if (css) {
            // css order matters
            // so can not use css in head
            headNode.appendChild(node);
        } else {
            // can use js in head
            headNode.insertBefore(node, headNode.firstChild);
        }
        return node;
    };
})(KISSY);
/*
 yiminghe@gmail.com refactor@2012-03-29
 - 考虑连续重复请求单个 script 的情况，内部排队

 yiminghe@gmail.com 2012-03-13
 - getScript
 - 404 in ie<9 trigger success , others trigger error
 - syntax error in all trigger success
 *//**
 * @ignore
 * Declare config info for KISSY.
 * @author yiminghe@gmail.com
 */
(function (S, undefined) {
    var Loader = S.Loader,
        Utils = Loader.Utils,
        host = S.Env.host,
        location = host.location,
        simulatedLocation,
        locationHref,
        configFns = S.Config.fns;

    if (!S.UA.nodejs && location && (locationHref = location.href)) {
        simulatedLocation = new S.Uri(locationHref);
    }

    S.Config.loadModsFn = function (rs, config) {
        S.getScript(rs.fullpath, config);
    };

    configFns.packages = function (config) {
        var name,
            Config = this.Config,
            ps = Config.packages = Config.packages || {};
        if (config) {
            S.each(config, function (cfg, key) {
                // 兼容数组方式
                name = cfg.name || key;
                // 兼容 path
                var baseUri = normalizeBase(cfg.base || cfg.path);

                cfg.name = name;
                cfg.base = baseUri.toString();
                cfg.baseUri = baseUri;
                cfg.runtime = S;
                delete cfg.path;
                if (ps[name]) {
                    ps[name].reset(cfg);
                } else {
                    ps[name] = new Loader.Package(cfg);
                }
            });
            return undefined;
        } else if (config === false) {
            Config.packages = {};
            return undefined;
        } else {
            return ps;
        }
    };

    configFns.modules = function (modules) {
        var self = this;
        if (modules) {
            S.each(modules, function (modCfg, modName) {
                var mod = Utils.createModuleInfo(self, modName, modCfg);
                // #485, invalid after add
                if (mod.status === Loader.Status.INIT) {
                    S.mix(mod, modCfg);
                }
            });
        }
    };

    configFns.base = function (base) {
        var self = this,
            Config = self.Config,
            baseUri;
        if (!base) {
            return Config.base;
        }
        baseUri = normalizeBase(base);
        Config.base = baseUri.toString();
        Config.baseUri = baseUri;
        return undefined;
    };

    function normalizeBase(base) {
        var baseUri;
        base = base.replace(/\\/g, '/');
        if (base.charAt(base.length - 1) !== '/') {
            base += '/';
        }
        if (simulatedLocation) {
            baseUri = simulatedLocation.resolve(base);
        } else {
            // add scheme for S.Uri
            // currently only for nodejs
            if (!S.startsWith(base, 'file:')) {
                base = 'file:' + base;
            }
            baseUri = new S.Uri(base);
        }
        return baseUri;
    }
})(KISSY);
/**
 * combo loader for KISSY. using combo to load module files.
 * @ignore
 * @author yiminghe@gmail.com
 */
(function (S, undefined) {
    // ie11 is a new one!
    var oldIE = S.UA.ieMode < 10;

    function loadScripts(runtime, rss, callback, charset, timeout) {
        var count = rss && rss.length,
            errorList = [],
            successList = [];

        function complete() {
            if (!(--count)) {
                callback(successList, errorList);
            }
        }

        S.each(rss, function (rs) {
            var mod;
            var config = {
                timeout: timeout,
                success: function () {
                    successList.push(rs);
                    if (mod && currentMod) {
                        // standard browser(except ie9) fire load after KISSY.add immediately
                        logger.debug('standard browser get mod name after load : ' + mod.name);
                        Utils.registerModule(runtime, mod.name, currentMod.factory, currentMod.config);
                        currentMod = undefined;
                    }
                    complete();
                },
                error: function () {
                    errorList.push(rs);
                    complete();
                },
                charset: charset
            };
            if (!rs.combine) {
                mod = rs.mods[0];
                if (mod.getType() === 'css') {
                    mod = undefined;
                }
                else if (oldIE) {
                    startLoadModName = mod.name;
                    startLoadModTime = S.now();
                    config.attrs = {
                        'data-mod-name': mod.name
                    };
                }
            }
            S.Config.loadModsFn(rs, config);
        });
    }

    var logger = S.getLogger('s/loader');
    var Loader = S.Loader,

        Status = Loader.Status,
        Utils = Loader.Utils,
        getHash = Utils.getHash,
        LOADING = Status.LOADING,
        LOADED = Status.LOADED,
        READY_TO_ATTACH = Status.READY_TO_ATTACH,
        ERROR = Status.ERROR,
        groupTag = S.now();

    ComboLoader.groupTag = groupTag;

    /**
     * @class KISSY.Loader.ComboLoader
     * using combo to load module files
     * @param runtime KISSY
     * @param waitingModules
     * @private
     */
    function ComboLoader(runtime, waitingModules) {
        S.mix(this, {
            runtime: runtime,
            waitingModules: waitingModules
        });
    }

    var currentMod;
    var startLoadModName;
    var startLoadModTime;

    function checkKISSYRequire(config, factory) {
        // use require primitive statement
        // function(S,require){require('node')}
        if (!config && typeof factory === 'function' && factory.length > 1) {
            var requires = Utils.getRequiresFromFn(factory);
            if (requires.length) {
                config = config || {};
                config.requires = requires;
            }
        } else {
            // KISSY.add(function(){},{requires:[]})
            if (config && config.requires && !config.cjs) {
                config.cjs = 0;
            }
        }
        return config;
    }

    ComboLoader.add = function (name, factory, config, runtime, argsLen) {
        // KISSY.add('xx',[],function(){});
        if (argsLen === 3 && S.isArray(factory)) {
            var tmp = factory;
            factory = config;
            config = {
                requires: tmp,
                cjs: 1
            };
        }
        // KISSY.add(function(){}), KISSY.add('a'), KISSY.add(function(){},{requires:[]})
        if (typeof name === 'function' || argsLen === 1) {
            config = factory;
            factory = name;
            config = checkKISSYRequire(config, factory);
            if (oldIE) {
                // http://groups.google.com/group/commonjs/browse_thread/thread/5a3358ece35e688e/43145ceccfb1dc02#43145ceccfb1dc02
                name = findModuleNameByInteractive();
                // S.log('oldIE get modName by interactive: ' + name);
                Utils.registerModule(runtime, name, factory, config);
                startLoadModName = null;
                startLoadModTime = 0;
            } else {
                // 其他浏览器 onload 时，关联模块名与模块定义
                currentMod = {
                    factory: factory,
                    config: config
                };
            }
        } else {
            // KISSY.add('x',function(){},{requires:[]})
            if (oldIE) {
                startLoadModName = null;
                startLoadModTime = 0;
            } else {
                currentMod = undefined;
            }
            config = checkKISSYRequire(config, factory);
            Utils.registerModule(runtime, name, factory, config);
        }
    };

    // oldIE 特有，找到当前正在交互的脚本，根据脚本名确定模块名
    // 如果找不到，返回发送前那个脚本
    function findModuleNameByInteractive() {
        var scripts = S.Env.host.document.getElementsByTagName('script'),
            re,
            i,
            name,
            script;

        for (i = scripts.length - 1; i >= 0; i--) {
            script = scripts[i];
            if (script.readyState === 'interactive') {
                re = script;
                break;
            }
        }
        if (re) {
            name = re.getAttribute('data-mod-name');
        } else {
            // sometimes when read module file from cache,
            // interactive status is not triggered
            // module code is executed right after inserting into dom
            // i has to preserve module name before insert module script into dom,
            // then get it back here
            logger.debug('can not find interactive script,time diff : ' + (S.now() - startLoadModTime));
            logger.debug('old_ie get mod name from cache : ' + startLoadModName);
            name = startLoadModName;
        }
        return name;
    }

    function debugRemoteModules(rss) {
        S.each(rss, function (rs) {
            var ms = [];
            S.each(rs.mods, function (m) {
                if (m.status === LOADED) {
                    ms.push(m.name);
                }
            });
            if (ms.length) {
                logger.info('load remote modules: "' + ms.join(', ') + '" from: "' + rs.fullpath + '"');
            }
        });
    }

    function getCommonPrefix(str1, str2) {
        str1 = str1.split(/\//);
        str2 = str2.split(/\//);
        var l = Math.min(str1.length, str2.length);
        for (var i = 0; i < l; i++) {
            if (str1[i] !== str2[i]) {
                break;
            }
        }
        return str1.slice(0, i).join('/') + '/';
    }

    S.augment(ComboLoader, {
        /**
         * load modules asynchronously
         */
        use: function (normalizedModNames) {
            var self = this,
                allModNames,
                comboUrls,
                timeout = S.Config.timeout,
                runtime = self.runtime;

            allModNames = S.keys(self.calculate(normalizedModNames));

            Utils.createModulesInfo(runtime, allModNames);

            comboUrls = self.getComboUrls(allModNames);

            // load css first to avoid page blink
            S.each(comboUrls.css, function (cssOne) {
                loadScripts(runtime, cssOne, function (success, error) {
                    if ('@DEBUG@') {
                        debugRemoteModules(success);
                    }

                    S.each(success, function (one) {
                        S.each(one.mods, function (mod) {
                            Utils.registerModule(runtime, mod.name, S.noop);
                            // notify all loader instance
                            mod.notifyAll();
                        });
                    });

                    S.each(error, function (one) {
                        S.each(one.mods, function (mod) {
                            var msg = mod.name +
                                ' is not loaded! can not find module in path : ' +
                                one.fullpath;
                            S.log(msg, 'error');
                            mod.status = ERROR;
                            // notify all loader instance
                            mod.notifyAll();
                        });
                    });
                }, cssOne.charset, timeout);
            });

            // jss css download in parallel
            S.each(comboUrls.js, function (jsOne) {
                loadScripts(runtime, jsOne, function (success) {
                    if ('@DEBUG@') {
                        debugRemoteModules(success);
                    }

                    S.each(jsOne, function (one) {
                        S.each(one.mods, function (mod) {
                            // fix #111
                            // https://github.com/kissyteam/kissy/issues/111
                            if (!mod.factory) {
                                var msg = mod.name +
                                    ' is not loaded! can not find module in path : ' +
                                    one.fullpath;
                                S.log(msg, 'error');
                                mod.status = ERROR;
                            }
                            // notify all loader instance
                            mod.notifyAll();
                        });
                    });
                }, jsOne.charset, timeout);
            });
        },

        /**
         * calculate dependency
         */
        calculate: function (modNames, cache, ret) {
            var i,
                m,
                mod,
                modStatus,
                self = this,
                waitingModules = self.waitingModules,
                runtime = self.runtime;

            ret = ret || {};
            // 提高性能，不用每个模块都再次全部依赖计算
            // 做个缓存，每个模块对应的待动态加载模块
            cache = cache || {};

            for (i = 0; i < modNames.length; i++) {
                m = modNames[i];
                if (cache[m]) {
                    continue;
                }
                cache[m] = 1;
                mod = Utils.createModuleInfo(runtime, m);
                modStatus = mod.status;
                if (modStatus >= READY_TO_ATTACH) {
                    continue;
                }
                if (modStatus !== LOADED) {
                    if (!waitingModules.contains(m)) {
                        if (modStatus !== LOADING) {
                            mod.status = LOADING;
                            ret[m] = 1;
                        }
                        /*jshint loopfunc:true*/
                        mod.wait(function (mod) {
                            waitingModules.remove(mod.name);
                            // notify current loader instance
                            waitingModules.notifyAll();
                        });
                        waitingModules.add(m);
                    }
                }
                self.calculate(mod.getNormalizedRequires(), cache, ret);
            }

            return ret;
        },

        /**
         * get combo mods for modNames
         */
        getComboMods: function (modNames, comboPrefixes) {
            var comboMods = {},
                packageUri,
                runtime = this.runtime,
                i = 0,
                l = modNames.length,
                modName, mod, packageInfo, type, typedCombos, mods,
                tag, charset, packagePath,
                packageName, group, fullpath;

            for (; i < l; ++i) {
                modName = modNames[i];
                mod = Utils.createModuleInfo(runtime, modName);
                type = mod.getType();
                fullpath = mod.getFullPath();
                packageInfo = mod.getPackage();
                packageName = packageInfo.name;
                charset = packageInfo.getCharset();
                tag = packageInfo.getTag();
                group = packageInfo.getGroup();
                packagePath = packageInfo.getPrefixUriForCombo();
                packageUri = packageInfo.getPackageUri();

                var comboName = packageName;
                // whether group packages can be combined (except default package and non-combo modules)
                if ((mod.canBeCombined = packageInfo.isCombine() &&
                    S.startsWith(fullpath, packagePath)) && group) {
                    // combined package name
                    comboName = group + '_' + charset + '_' + groupTag;

                    var groupPrefixUri;
                    if ((groupPrefixUri = comboPrefixes[comboName])) {
                        if (groupPrefixUri.isSameOriginAs(packageUri)) {
                            groupPrefixUri.setPath(getCommonPrefix(groupPrefixUri.getPath(),
                                packageUri.getPath()));
                        } else {
                            comboName = packageName;
                            comboPrefixes[packageName] = packageUri;
                        }
                    } else {
                        comboPrefixes[comboName] = packageUri.clone();
                    }
                } else {
                    comboPrefixes[packageName] = packageUri;
                }

                typedCombos = comboMods[type] = comboMods[type] || {};
                if (!(mods = typedCombos[comboName])) {
                    mods = typedCombos[comboName] = [];
                    mods.charset = charset;
                    mods.tags = [tag]; // [package tag]
                } else {
                    if (!(mods.tags.length === 1 && mods.tags[0] === tag)) {
                        mods.tags.push(tag);
                    }
                }
                mods.push(mod);
            }

            return comboMods;
        },

        /**
         * Get combo urls
         */
        getComboUrls: function (modNames) {
            var runtime = this.runtime,
                Config = runtime.Config,
                comboPrefix = Config.comboPrefix,
                comboSep = Config.comboSep,
                maxFileNum = Config.comboMaxFileNum,
                maxUrlLength = Config.comboMaxUrlLength;

            var comboPrefixes = {};
            // {type, {comboName, [modInfo]}}}
            var comboMods = this.getComboMods(modNames, comboPrefixes);
            // {type, {comboName, [url]}}}
            var comboRes = {};

            // generate combo urls
            for (var type in comboMods) {
                comboRes[type] = {};
                for (var comboName in comboMods[type]) {
                    var currentComboUrls = [];
                    var currentComboMods = [];
                    var mods = comboMods[type][comboName];
                    var tags = mods.tags;
                    var tag = tags.length > 1 ? getHash(tags.join('')) : tags[0];

                    var suffix = (tag ? '?t=' + encodeURIComponent(tag) + '.' + type : ''),
                        suffixLength = suffix.length,
                        basePrefix = comboPrefixes[comboName].toString(),
                        baseLen = basePrefix.length,
                        prefix = basePrefix + comboPrefix,
                        res = comboRes[type][comboName] = [];

                    var l = prefix.length;
                    res.charset = mods.charset;
                    res.mods = [];

                    /*jshint loopfunc:true*/
                    var pushComboUrl = function () {
                        //noinspection JSReferencingMutableVariableFromClosure
                        res.push({
                            combine: 1,
                            fullpath: prefix + currentComboUrls.join(comboSep) + suffix,
                            mods: currentComboMods
                        });
                    };

                    for (var i = 0; i < mods.length; i++) {
                        var currentMod = mods[i];
                        res.mods.push(currentMod);
                        var fullpath = currentMod.getFullPath();
                        if (!currentMod.canBeCombined) {
                            res.push({
                                combine: 0,
                                fullpath: fullpath,
                                mods: [currentMod]
                            });
                            continue;
                        }
                        // ignore query parameter
                        var path = fullpath.slice(baseLen).replace(/\?.*$/, '');
                        currentComboUrls.push(path);
                        currentComboMods.push(currentMod);

                        if (currentComboUrls.length > maxFileNum ||
                            (l + currentComboUrls.join(comboSep).length + suffixLength > maxUrlLength)) {
                            currentComboUrls.pop();
                            currentComboMods.pop();
                            pushComboUrl();
                            currentComboUrls = [];
                            currentComboMods = [];
                            i--;
                        }
                    }
                    if (currentComboUrls.length) {
                        pushComboUrl();
                    }
                }
            }
            return comboRes;
        }
    });

    Loader.ComboLoader = ComboLoader;
})(KISSY);
/*
 2013-09-11
 - union simple loader and combo loader

 2013-07-25 阿古, yiminghe
 - support group combo for packages

 2013-06-04 yiminghe@gmail.com
 - refactor merge combo loader and simple loader
 - support error callback

 2012-02-20 yiminghe note:
 - three status
 0: initialized
 LOADED: load into page
 ATTACHED: factory executed
 *//**
 * @ignore
 * mix loader into KISSY and infer KISSY baseUrl if not set
 * @author yiminghe@gmail.com
 */
(function (S, undefined) {
    var    logger = S.getLogger('s/loader');
    var Loader = S.Loader,
        Env = S.Env,

        Utils = Loader.Utils,
        processImmediate = S.setImmediate,
        ComboLoader = Loader.ComboLoader;

    function WaitingModules(fn) {
        S.mix(this, {
            fn: fn,
            waitMods: {}
        });
    }

    WaitingModules.prototype = {
        constructor: WaitingModules,

        notifyAll: function () {
            var self = this,
                fn = self.fn;
            if (fn && S.isEmptyObject(self.waitMods)) {
                self.fn = null;
                fn();
            }
        },

        add: function (modName) {
            this.waitMods[modName] = 1;
        },

        remove: function (modName) {
            delete this.waitMods[modName];
        },

        contains: function (modName) {
            return this.waitMods[modName];
        }
    };

    Loader.WaitingModules = WaitingModules;

    S.mix(S, {
        /**
         * Registers a module with the KISSY global.
         * @param {String} name module name.
         * it must be set if combine is true in {@link KISSY#config}
         * @param {Function} factory module definition function that is used to return
         * exports of this module
         * @param {KISSY} factory.S KISSY global instance
         * @param {Object} [cfg] module optional config data
         * @param {String[]} cfg.requires this module's required module name list
         * @member KISSY
         *
         *
         *      // dom module's definition
         *      KISSY.add('dom', function(S, xx){
         *          return {css: function(el, name, val){}};
         *      },{
         *          requires:['xx']
         *      });
         */
        add: function (name, factory, cfg) {
            ComboLoader.add(name, factory, cfg, S, arguments.length);
        },
        /**
         * Attached one or more modules to global KISSY instance.
         * @param {String|String[]} modNames moduleNames. 1-n modules to bind(use comma to separate)
         * @param {Function} success callback function executed
         * when KISSY has the required functionality.
         * @param {KISSY} success.S KISSY instance
         * @param success.x... modules exports
         * @member KISSY
         *
         *
         *      // loads and attached overlay,dd and its dependencies
         *      KISSY.use('overlay,dd', function(S, Overlay){});
         */
        use: function (modNames, success) {
            var normalizedModNames,
                loader,
                error,
                sync,
                tryCount = 0,
                finalSuccess,
                waitingModules = new WaitingModules(loadReady);

            if (S.isPlainObject(success)) {
                //noinspection JSUnresolvedVariable
                sync = success.sync;
                //noinspection JSUnresolvedVariable
                error = success.error;
                //noinspection JSUnresolvedVariable
                success = success.success;
            }

            finalSuccess = function () {
                success.apply(S, Utils.getModules(S, modNames));
            };

            modNames = Utils.getModNamesAsArray(modNames);
            modNames = Utils.normalizeModNamesWithAlias(S, modNames);

            normalizedModNames = Utils.unalias(S, modNames);

            function loadReady() {
                ++tryCount;
                var errorList = [],
                    start = S.now(),
                    ret;
                ret = Utils.checkModsLoadRecursively(normalizedModNames, S, undefined, errorList);
                logger.debug(tryCount + ' check duration ' + (S.now() - start));
                if (ret) {
                    Utils.attachModsRecursively(normalizedModNames, S);
                    if (success) {
                        if (sync) {
                            finalSuccess();
                        } else {
                            // standalone error trace
                            processImmediate(finalSuccess);
                        }
                    }
                } else if (errorList.length) {
                    if (error) {
                        if (sync) {
                            error.apply(S, errorList);
                        } else {
                            processImmediate(function () {
                                error.apply(S, errorList);
                            });
                        }
                    }
                } else {
                    logger.debug(tryCount + ' reload ' + modNames);
                    waitingModules.fn = loadReady;
                    loader.use(normalizedModNames);
                }
            }

            loader = new ComboLoader(S, waitingModules);

            // in case modules is loaded statically
            // synchronous check
            // but always async for loader
            if (sync) {
                waitingModules.notifyAll();
            } else {
                processImmediate(function () {
                    waitingModules.notifyAll();
                });
            }
            return S;
        },

        /**
         * get module exports from KISSY module cache
         * @param {String} moduleName module name
         * @param {String} refName internal usage
         * @member KISSY
         * @return {*} exports of specified module
         */
        require: function (moduleName, refName) {
            if (moduleName) {
                var moduleNames = Utils.unalias(S, Utils.normalizeModNamesWithAlias(S, [moduleName], refName));
                Utils.attachModsRecursively(moduleNames, S);
                return Utils.getModules(S, moduleNames)[1];
            }
        }
    });

    Env.mods = {}; // all added mods
})(KISSY);

/*
 2013-06-04 yiminghe@gmail.com
 - refactor merge combo loader and simple loader
 - support error callback
 *//**
 * @ignore
 * init loader, set config
 */
(function (S) {
    var doc = S.Env.host && S.Env.host.document;
    // var logger = S.getLogger('s/loader');
    var Utils = S.Loader.Utils;
    var TIMESTAMP = '20140106132044';
    var defaultComboPrefix = '??';
    var defaultComboSep = ',';

    function returnJson(s) {
        /*jshint evil:true*/
        return (new Function('return ' + s))();
    }

    var baseReg = /^(.*)(seed|kissy)(?:-min)?\.js[^/]*/i,
        baseTestReg = /(seed|kissy)(?:-min)?\.js/i;

    function getBaseInfoFromOneScript(script) {
        // can not use KISSY.Uri
        // /??x.js,dom.js for tbcdn
        var src = script.src || '';
        if (!src.match(baseTestReg)) {
            return 0;
        }

        var baseInfo = script.getAttribute('data-config');

        if (baseInfo) {
            baseInfo = returnJson(baseInfo);
        } else {
            baseInfo = {};
        }

        var comboPrefix = baseInfo.comboPrefix || defaultComboPrefix;
        var comboSep = baseInfo.comboSep || defaultComboSep;

        var parts ,
            base,
            index = src.indexOf(comboPrefix);

        // no combo
        if (index === -1) {
            base = src.replace(baseReg, '$1');
        } else {
            base = src.substring(0, index);
            // a.tbcdn.cn??y.js, ie does not insert / after host
            // a.tbcdn.cn/combo? comboPrefix=/combo?
            if (base.charAt(base.length - 1) !== '/') {
                base += '/';
            }
            parts = src.substring(index + comboPrefix.length).split(comboSep);
            S.each(parts, function (part) {
                if (part.match(baseTestReg)) {
                    base += part.replace(baseReg, '$1');
                    return false;
                }
                return undefined;
            });
        }

        if (!('tag' in baseInfo)) {
            var queryIndex = src.lastIndexOf('?t=');
            if (queryIndex !== -1) {
                var query = src.substring(queryIndex + 1);
                // kissy 's tag will be determined by build time and user specified tag
                baseInfo.tag = Utils.getHash(TIMESTAMP + query);
            }
        }

        baseInfo.base = baseInfo.base || base;

        return baseInfo;
    }

    /**
     * get base from seed.js
     * @return {Object} base for kissy
     * @ignore
     *
     * for example:
     *      @example
     *      http://a.tbcdn.cn/??s/kissy/x.y.z/seed-min.js,p/global/global.js
     *      note about custom combo rules, such as yui3:
     *      combo-prefix='combo?' combo-sep='&'
     */
    function getBaseInfo() {
        // get base from current script file path
        // notice: timestamp
        var scripts = doc.getElementsByTagName('script'),
            i,
            info;

        for (i = scripts.length - 1; i >= 0; i--) {
            if ((info = getBaseInfoFromOneScript(scripts[i]))) {
                return info;
            }
        }

        S.log('must load kissy by file name in browser environment: seed.js or seed-min.js', 'error');
        return null;
    }

    S.config({
        comboPrefix: defaultComboPrefix,
        comboSep: defaultComboSep,
        charset: 'utf-8',
        lang: 'zh-cn'
    });

    if (S.UA.nodejs) {
        // nodejs: no tag
        // noinspection JSUnresolvedVariable
        S.config({
            charset: 'utf-8',
            /*global __dirname*/
            base: __dirname.replace(/\\/g, '/').replace(/\/$/, '') + '/'
        });
        // ejecta
    } else if (doc && doc.getElementsByTagName) {
        // will transform base to absolute path
        S.config(S.mix({
            // 2k(2048) url length
            comboMaxUrlLength: 2000,
            // file limit number for a single combo url
            comboMaxFileNum: 40
        }, getBaseInfo()));
    }
})(KISSY);/**
 * @ignore
 * i18n plugin for kissy loader
 * @author yiminghe@gmail.com
 */
KISSY.add('i18n', {
    alias: function (S, name) {
        return name + '/i18n/' + S.Config.lang;
    }
});/**
 * this code can only run at browser environment
 * @ignore
 * @author lifesinger@gmail.com, yiminghe@gmail.com
 */
(function (S, undefined) {
    var logger = S.getLogger('s/web');
    var win = S.Env.host,

        UA = S.UA,
        doc = win.document,
        docElem = doc && doc.documentElement,
        location = win.location,
        EMPTY = '',
        domReady = 0,
        callbacks = [],
    // The number of poll times.
        POLL_RETIRES = 500,
    // The poll interval in milliseconds.
        POLL_INTERVAL = 40,
    // #id or id
        RE_ID_STR = /^#?([\w-]+)$/,
        RE_NOT_WHITESPACE = /\S/,
        standardEventModel = !!(doc && doc.addEventListener),
        DOM_READY_EVENT = 'DOMContentLoaded',
        READY_STATE_CHANGE_EVENT = 'readystatechange',
        LOAD_EVENT = 'load',
        COMPLETE = 'complete',
        addEventListener = standardEventModel ? function (el, type, fn) {
            el.addEventListener(type, fn, false);
        } : function (el, type, fn) {
            el.attachEvent('on' + type, fn);
        },
        removeEventListener = standardEventModel ? function (el, type, fn) {
            el.removeEventListener(type, fn, false);
        } : function (el, type, fn) {
            el.detachEvent('on' + type, fn);
        };

    S.mix(S, {
        /**
         * A crude way of determining if an object is a window
         * @member KISSY
         */
        isWindow: function (obj) {
            // must use == for ie8
            /*jshint eqeqeq:false*/
            return obj != null && obj == obj.window;
        },

        /**
         * get xml representation of data
         * @param {String} data
         * @member KISSY
         */
        parseXML: function (data) {
            // already a xml
            if (data.documentElement) {
                return data;
            }
            var xml;
            try {
                // Standard
                if (win.DOMParser) {
                    xml = new DOMParser().parseFromString(data, 'text/xml');
                } else { // IE
                    /*global ActiveXObject*/
                    xml = new ActiveXObject('Microsoft.XMLDOM');
                    xml.async = false;
                    xml.loadXML(data);
                }
            } catch (e) {
                logger.error('parseXML error :');
                logger.error(e);
                xml = undefined;
            }
            if (!xml || !xml.documentElement || xml.getElementsByTagName('parsererror').length) {
                S.error('Invalid XML: ' + data);
            }
            return xml;
        },

        /**
         * Evaluates a script in a global context.
         * @member KISSY
         */
        globalEval: function (data) {
            if (data && RE_NOT_WHITESPACE.test(data)) {
                // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
                // http://msdn.microsoft.com/en-us/library/ie/ms536420(v=vs.85).aspx always return null
                /*jshint evil:true*/
                if (win.execScript) {
                    win.execScript(data);
                } else {
                    (function (data) {
                        win.eval.call(win, data);
                    })(data);
                }
            }
        },

        /**
         * Specify a function to execute when the Dom is fully loaded.
         * @param fn {Function} A function to execute after the Dom is ready
         * @chainable
         * @member KISSY
         */
        ready: function (fn) {
            if (domReady) {
                try {
                    fn(S);
                } catch (e) {
                    S.log(e.stack || e, 'error');
                    setTimeout(function () {
                        throw e;
                    }, 0);
                }
            } else {
                callbacks.push(fn);
            }
            return this;
        },

        /**
         * Executes the supplied callback when the item with the supplied id is found.
         * @param id {String} The id of the element, or an array of ids to look for.
         * @param fn {Function} What to execute when the element is found.
         * @member KISSY
         */
        available: function (id, fn) {
            id = (id + EMPTY).match(RE_ID_STR)[1];
            var retryCount = 1;
            var timer = S.later(function () {
                if (++retryCount > POLL_RETIRES) {
                    timer.cancel();
                    return;
                }
                var node = doc.getElementById(id);
                if (node) {
                    fn(node);
                    timer.cancel();
                }
            }, POLL_INTERVAL, true);
        }
    });

    function fireReady() {
        if (domReady) {
            return;
        }
        // nodejs
        if (doc && !UA.nodejs) {
            removeEventListener(win, LOAD_EVENT, fireReady);
        }
        domReady = 1;
        for (var i = 0; i < callbacks.length; i++) {
            try {
                callbacks[i](S);
            } catch (e) {
                S.log(e.stack || e, 'error');
                /*jshint loopfunc:true*/
                setTimeout(function () {
                    throw e;
                }, 0);
            }
        }
    }

    //  Binds ready events.
    function bindReady() {
        // Catch cases where ready() is called after the
        // browser event has already occurred.
        if (!doc || doc.readyState === COMPLETE) {
            fireReady();
            return;
        }

        // A fallback to window.onload, that will always work
        addEventListener(win, LOAD_EVENT, fireReady);

        // w3c mode
        if (standardEventModel) {
            var domReady = function () {
                removeEventListener(doc, DOM_READY_EVENT, domReady);
                fireReady();
            };

            addEventListener(doc, DOM_READY_EVENT, domReady);
        }
        // IE event model is used
        else {
            var stateChange = function () {
                if (doc.readyState === COMPLETE) {
                    removeEventListener(doc, READY_STATE_CHANGE_EVENT, stateChange);
                    fireReady();
                }
            };

            // ensure firing before onload (but completed after all inner iframes is loaded)
            // maybe late but safe also for iframes
            addEventListener(doc, READY_STATE_CHANGE_EVENT, stateChange);

            // If IE and not a frame
            // continually check to see if the document is ready
            var notframe,
                doScroll = docElem && docElem.doScroll;

            try {
                notframe = (win.frameElement === null);
            } catch (e) {
                notframe = false;
            }

            // can not use in iframe,parent window is dom ready so doScroll is ready too
            if (doScroll && notframe) {
                var readyScroll = function () {
                    try {
                        // Ref: http://javascript.nwbox.com/IEContentLoaded/
                        doScroll('left');
                        fireReady();
                    } catch (ex) {
                        setTimeout(readyScroll, POLL_INTERVAL);
                    }
                };
                readyScroll();
            }
        }
    }

    // If url contains '?ks-debug', debug mode will turn on automatically.
    if (location && (location.search || EMPTY).indexOf('ks-debug') !== -1) {
        S.Config.debug = true;
    }

    // bind on start
    // in case when you bind but the DOMContentLoaded has triggered
    // then you has to wait onload
    // worst case no callback at all
    bindReady();

    if (UA.ie) {
        try {
            doc.execCommand('BackgroundImageCache', false, true);
        } catch (e) {
        }
    }
})(KISSY, undefined);
/**
 * @ignore
 * Default KISSY Gallery and core alias.
 * @author yiminghe@gmail.com
 */
(function (S) {
    // compatibility
    S.config({
        modules: {
            core: {
                alias: ['dom', 'event', 'io', 'anim', 'base', 'node', 'json', 'ua', 'cookie']
            },
            ajax: {
                alias: 'io'
            },
            'rich-base': {
                alias: 'base'
            }
        }
    });
    if (typeof location !== 'undefined') {
        var https = S.startsWith(location.href, 'https');
        var prefix = https ? 'https://s.tbcdn.cn/s/kissy/' : 'http://a.tbcdn.cn/s/kissy/';
        S.config({
            packages: {
                gallery: {
                    base: prefix
                },
                mobile: {
                    base: prefix
                }
            }
        });
    }
})(KISSY);

/*jshint indent:false*/
(function(config,Features,UA){
    config({
        'anim/transition?':{
            alias:KISSY.Features.isTransitionSupported() ? 'anim/transition' : ''
        }
    });/*Generated By KISSY Module Compiler*/
    config({
        'anim': {requires: ['anim/base','anim/timer','anim/transition?']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'anim/base': {requires: ['dom','promise']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'anim/timer': {requires: ['dom','anim/base']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'anim/transition': {requires: ['dom','event/dom','anim/base']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'attribute': {requires: ['event/custom']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'base': {requires: ['attribute']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'button': {requires: ['node','component/control']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'color': {requires: ['attribute']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'combobox': {requires: ['node','component/control','menu','attribute','io']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'component/container': {requires: ['component/control','component/manager']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'component/control': {requires: ['node','base','promise','component/manager','xtemplate/runtime']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'component/extension/align': {requires: ['node']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'component/extension/content-render': {requires: ['component/extension/content-xtpl']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'component/extension/delegate-children': {requires: ['node','component/manager']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'component/plugin/drag': {requires: ['dd']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'component/plugin/resize': {requires: ['resizable']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'date/format': {requires: ['date/gregorian','i18n!date']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'date/gregorian': {requires: ['i18n!date']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'date/picker': {requires: ['node','date/gregorian','i18n!date/picker','component/control','date/format','date/picker-xtpl']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'date/popup-picker': {requires: ['date/picker-xtpl','date/picker','component/extension/shim','component/extension/align']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'dd': {requires: ['node','base']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'dd/plugin/constrain': {requires: ['node','base']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'dd/plugin/proxy': {requires: ['node','dd','base']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'dd/plugin/scroll': {requires: ['node','dd','base']}
    });
    config({
        'dom/basic': {
            'alias': [
                'dom/base',
                Features.isIELessThan(9) ? 'dom/ie' : '',
                Features.isClassListSupported() ? '' : 'dom/class-list'
            ]
        },
        'dom': {
            'alias': [
                'dom/basic',
                !Features.isQuerySelectorSupported() ? 'dom/selector' : ''
            ]
        }
    });/*Generated By KISSY Module Compiler*/
    config({
        'dom/class-list': {requires: ['dom/base']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'dom/ie': {requires: ['dom/base']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'dom/selector': {requires: ['dom/basic']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'editor': {requires: ['node','html-parser','component/control']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'event': {requires: ['event/dom','event/custom']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'event/custom': {requires: ['event/base']}
    });
    config({
        'event/dom': {
            'alias': [
                'event/dom/base',
                Features.isTouchGestureSupported() ?
                    'event/dom/touch' : '',
                Features.isDeviceMotionSupported() ?
                    'event/dom/shake' : '',
                Features.isHashChangeSupported() ?
                    '' : 'event/dom/hashchange',
                Features.isIELessThan(9) ?
                    'event/dom/ie' : '',
                UA.ie ? '' : 'event/dom/focusin'
            ]
        }
    });/*Generated By KISSY Module Compiler*/
    config({
        'event/dom/base': {requires: ['event/base','dom']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'event/dom/focusin': {requires: ['event/dom/base']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'event/dom/hashchange': {requires: ['event/dom/base','dom']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'event/dom/ie': {requires: ['event/dom/base','dom']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'event/dom/shake': {requires: ['event/dom/base']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'event/dom/touch': {requires: ['event/dom/base','dom']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'filter-menu': {requires: ['menu','component/extension/content-xtpl','component/extension/content-render']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'io': {requires: ['dom','event/custom','promise','event/dom']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'kison': {requires: ['base']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'menu': {requires: ['node','component/container','component/extension/delegate-children','component/control','component/extension/content-render','component/extension/content-xtpl','component/extension/align','component/extension/shim']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'menubutton': {requires: ['node','button','component/extension/content-xtpl','component/extension/content-render','menu']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'mvc': {requires: ['io','json','attribute','node']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'node': {requires: ['dom','event/dom','anim']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'overlay': {requires: ['component/container','component/extension/shim','component/extension/align','node','component/extension/content-xtpl','component/extension/content-render']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'resizable': {requires: ['node','base','dd']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'resizable/plugin/proxy': {requires: ['node','base']}
    });
    config({
        'scroll-view': {
            alias: Features.isTouchGestureSupported() ? 'scroll-view/drag' : 'scroll-view/base'
        }
    });/*Generated By KISSY Module Compiler*/
    config({
        'scroll-view/base': {requires: ['node','anim','component/container','component/extension/content-render']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'scroll-view/drag': {requires: ['scroll-view/base','node','anim']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'scroll-view/plugin/pull-to-refresh': {requires: ['base']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'scroll-view/plugin/scrollbar': {requires: ['base','node','component/control']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'separator': {requires: ['component/control']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'split-button': {requires: ['component/container','button','menubutton']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'stylesheet': {requires: ['dom']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'swf': {requires: ['dom','json','attribute']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'tabs': {requires: ['component/container','toolbar','button']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'toolbar': {requires: ['component/container','component/extension/delegate-children','node']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'tree': {requires: ['node','component/container','component/extension/content-xtpl','component/extension/content-render','component/extension/delegate-children']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'xtemplate': {requires: ['xtemplate/runtime','xtemplate/compiler']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'xtemplate/compiler': {requires: ['xtemplate/runtime']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'xtemplate/nodejs': {requires: ['xtemplate']}
    });
    /*Generated By KISSY Module Compiler*/
    config({
        'xtemplate/runtime': {requires: ['path']}
    });

})(function(c){
    KISSY.config('modules', c);
},KISSY.Features,KISSY.UA);
/**
 * @ignore
 * 1. export KISSY 's functionality to module system
 * 2. export light-weighted json parse
 */
(function (S) {
    S.add('ua', function () {
        return S.UA;
    });

    S.add('uri', function () {
        return S.Uri;
    });

    S.add('path', function () {
        return S.Path;
    });

    var UA = S.UA,
        Env = S.Env,
        win = Env.host,
    /*global global*/
        nativeJson = ((UA.nodejs && typeof global === 'object') ? global : win).JSON;

    // ie 8.0.7600.16315@win7 json bug!
    if (UA.ieMode < 9) {
        nativeJson = null;
    }

    if (nativeJson) {
        S.add('json', function () {
            S.JSON = nativeJson;
            return nativeJson;
        });
        // light weight json parse
        S.parseJson = function (data) {
            return nativeJson.parse(data);
        };
    } else {
        // Json RegExp
        var INVALID_CHARS_REG = /^[\],:{}\s]*$/,
            INVALID_BRACES_REG = /(?:^|:|,)(?:\s*\[)+/g,
            INVALID_ESCAPES_REG = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
            INVALID_TOKENS_REG = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g;
        S.parseJson = function (data) {
            if (data === null) {
                return data;
            }
            if (typeof data === 'string') {
                // for ie
                data = S.trim(data);
                if (data) {
                    // from json2
                    if (INVALID_CHARS_REG.test(data.replace(INVALID_ESCAPES_REG, '@')
                        .replace(INVALID_TOKENS_REG, ']')
                        .replace(INVALID_BRACES_REG, ''))) {
                        /*jshint evil:true*/
                        return ( new Function('return ' + data) )();
                    }
                }
            }
            return S.error('Invalid Json: ' + data);
        };
    }

    // exports for nodejs
    if (S.UA.nodejs) {
        S.KISSY = S;
        /*global module*/
        module.exports = S;
    }
})(KISSY);

/*
 Copyright 2013, KISSY v1.40dev
 MIT Licensed
 build time: Sep 18 00:20
 */
/*
 Combined processedModules by KISSY Module Compiler: 

 event/custom/observer
 event/custom/object
 event/custom/observable
 event/custom/target
 event/custom
 */

/**
 * @ignore
 * Observer for custom event
 * @author yiminghe@gmail.com
 */
KISSY.add('event/custom/observer', function (S, BaseEvent) {

    /**
     * Observer for custom event
     * @class KISSY.Event.CustomEvent.Observer
     * @extends KISSY.Event.Observer
     * @private
     */
    function CustomEventObserver() {
        CustomEventObserver.superclass.constructor.apply(this, arguments);
    }

    S.extend(CustomEventObserver, BaseEvent.Observer, {
        keys:['fn','context','groups']
    });

    return CustomEventObserver;

}, {
    requires: ['event/base']
});
/**
 * @ignore
 * simple custom event object for custom event mechanism.
 * @author yiminghe@gmail.com
 */
KISSY.add('event/custom/object', function (S, BaseEvent) {

    /**
     * Do not new by yourself.
     *
     * Custom event object.
     * @private
     * @class KISSY.Event.CustomEvent.Object
     * @param {Object} data data which will be mixed into custom event instance
     * @extends KISSY.Event.Object
     */
    function CustomEventObject(data) {
        CustomEventObject.superclass.constructor.call(this);
        S.mix(this, data);
        /**
         * source target of current event
         * @property  target
         * @type {KISSY.Event.CustomEvent.Target}
         */
        /**
         * current target which processes current event
         * @property currentTarget
         * @type {KISSY.Event.CustomEvent.Target}
         */
    }

    S.extend(CustomEventObject, BaseEvent.Object);

    return CustomEventObject;

}, {
    requires: ['event/base']
});
/**
 * @ignore
 * custom event mechanism for kissy.
 * refer: http://www.w3.org/TR/domcore/#interface-customevent
 * @author yiminghe@gmail.com
 */
KISSY.add('event/custom/observable', function (S, CustomEventObserver, CustomEventObject, BaseEvent) {
    var Utils = BaseEvent.Utils;
    var undefined = undefined;

    /**
     * custom event for registering and un-registering observer for specified event on normal object.
     * @class KISSY.Event.CustomEvent.CustomEventObservable
     * @extends KISSY.Event.Observable
     * @private
     */
    function CustomEventObservable() {
        var self = this;
        CustomEventObservable.superclass.constructor.apply(self, arguments);
        self.defaultFn = null;
        self.defaultTargetOnly = false;

        /**
         * whether this event can bubble.
         * Defaults to: true
         * @cfg {Boolean} bubbles
         */
        self.bubbles = true;
        /**
         * event target which binds current custom event
         * @cfg {KISSY.Event.CustomEvent.Target} currentTarget
         */
    }

    S.extend(CustomEventObservable, BaseEvent.Observable, {
        /**
         * add a observer to custom event's observers
         * @param {Object} cfg {@link KISSY.Event.CustomEvent.Observer} 's config
         */
        on: function (cfg) {
            var observer = /**@ignore
             @type KISSY.Event.CustomEvent.Observer*/new CustomEventObserver(cfg);
            if (S.Config.debug) {
                if (!observer.fn) {
                    S.error('lack event handler for ' + this.type);
                }
            }
            if (this.findObserver(observer) == -1) {
                this.observers.push(observer);
            }
        },

        /**
         * notify current custom event 's observers and then bubble up if this event can bubble.
         * @param {KISSY.Event.CustomEvent.Object} eventData
         * @return {*} return false if one of custom event 's observers (include bubbled) else
         * return last value of custom event 's observers (include bubbled) 's return value.
         */
        fire: function (eventData) {
            eventData = eventData || {};

            var self = this,
                bubbles = self.bubbles,
                currentTarget = self.currentTarget,
                parents,
                parentsLen,
                type = self.type,
                defaultFn = self.defaultFn,
                i,
                customEventObject = eventData,
                gRet, ret;

            eventData.type = type;

            if (!(customEventObject instanceof  CustomEventObject)) {
                customEventObject.target = currentTarget;
                customEventObject = new CustomEventObject(customEventObject);
            }

            customEventObject.currentTarget = currentTarget;

            ret = self.notify(customEventObject);

            if (gRet !== false && ret != undefined) {
                gRet = ret;
            }

            // gRet === false prevent
            if (bubbles && !customEventObject.isPropagationStopped()) {

                parents = currentTarget.getTargets();

                parentsLen = parents && parents.length || 0;

                for (i = 0; i < parentsLen && !customEventObject.isPropagationStopped(); i++) {

                    ret = parents[i].fire(type, customEventObject);

                    // false ä¼˜å…ˆè¿”å›ž
                    if (gRet !== false && ret !== undefined) {
                        gRet = ret;
                    }

                }
            }

            // bubble first
            // parent defaultFn first
            // child defaultFn last
            if (defaultFn && !customEventObject.isDefaultPrevented()) {
                var target=customEventObject.target,
                    lowestCustomEventObservable = target.getCustomEventObservable(customEventObject.type);
                if ((!self.defaultTargetOnly && !lowestCustomEventObservable.defaultTargetOnly) ||
                    currentTarget == target) {
                    // default value as final value if possible
                    gRet = defaultFn.call(currentTarget, customEventObject);
                }
            }

            return gRet;

        },

        /**
         * notify current event 's observers
         * @param {KISSY.Event.CustomEvent.Object} event
         * @return {*} return false if one of custom event 's observers  else
         * return last value of custom event 's observers 's return value.
         */
        notify: function (event) {
            // duplicate,in case detach itself in one observer
            var observers = [].concat(this.observers),
                ret,
                gRet,
                len = observers.length,
                i;

            for (i = 0; i < len && !event.isImmediatePropagationStopped(); i++) {
                ret = observers[i].notify(event, this);
                if (gRet !== false && ret !== undefined) {
                    gRet = ret;
                }
            }

            return gRet;
        },

        /**
         * remove some observers from current event 's observers by observer config param
         * @param {Object} cfg {@link KISSY.Event.CustomEvent.Observer} 's config
         */
        detach: function (cfg) {
            var groupsRe,
                self = this,
                fn = cfg.fn,
                context = cfg.context,
                currentTarget = self.currentTarget,
                observers = self.observers,
                groups = cfg.groups;

            if (!observers.length) {
                return;
            }

            if (groups) {
                groupsRe = Utils.getGroupsRe(groups);
            }

            var i, j, t, observer, observerContext, len = observers.length;

            // ç§»é™¤ fn
            if (fn || groupsRe) {
                context = context || currentTarget;

                for (i = 0, j = 0, t = []; i < len; ++i) {
                    observer = observers[i];
                    observerContext = observer.context || currentTarget;
                    if (
                        (context != observerContext) ||
                            // æŒ‡å®šäº†å‡½æ•°ï¼Œå‡½æ•°ä¸ç›¸ç­‰ï¼Œä¿ç•™
                            (fn && fn != observer.fn) ||
                            // æŒ‡å®šäº†åˆ é™¤çš„æŸäº›ç»„ï¼Œè€Œè¯¥ observer ä¸å±žäºŽè¿™äº›ç»„ï¼Œä¿ç•™ï¼Œå¦åˆ™åˆ é™¤
                            (groupsRe && !observer.groups.match(groupsRe))
                        ) {
                        t[j++] = observer;
                    }
                }

                self.observers = t;
            } else {
                // å…¨éƒ¨åˆ é™¤
                self.reset();
            }

            // does not need to clear memory if customEvent has no observer
            // customEvent has defaultFn .....!
            // self.checkMemory();
        }
    });

    return CustomEventObservable;
}, {
    requires: [ './observer', './object', 'event/base']
});
/**
 * @ignore
 * 2012-10-26 yiminghe@gmail.com
 *  - custom event can bubble by default!
 */
/**
 * @ignore
 * custom event target for publish and subscribe
 * @author yiminghe@gmail.com
 */
KISSY.add('event/custom/target', function (S, BaseEvent, CustomEventObservable) {
    var Utils = BaseEvent.Utils,
        splitAndRun = Utils.splitAndRun,
        undefined = undefined,
        KS_BUBBLE_TARGETS = '__~ks_bubble_targets';

    /**
     * EventTarget provides the implementation for any object to publish, subscribe and fire to custom events,
     * and also allows other EventTargets to target the object with events sourced from the other object.
     *
     * EventTarget is designed to be used with S.augment to allow events to be listened to and fired by name.
     *
     * This makes it possible for implementing code to subscribe to an event that either has not been created yet,
     * or will not be created at all.
     *
     *
     *
     *      @example
     *      KISSY.use('event',function(S,Event){
     *          var target = S.mix({}, Event.Target);
     *          target.on('ok',function(){
     *              document.writeln('ok fired @'+new Date());
     *          });
     *          target.fire('ok');
     *      });
     *
     *
     * @class KISSY.Event.CustomEvent.Target
     */
    function Target() {
    }

    var KS_CUSTOM_EVENTS = '__~ks_custom_events';

    Target.prototype = {
        constructor: Target,

        isTarget: 1,

        /**
         * Get custom event for specified event
         * @private
         * @param {String} type event type
         * @param {Boolean} [create] whether create custom event on fly
         * @return {KISSY.Event.CustomEvent.CustomEventObservable}
         */
        getCustomEventObservable: function (type, create) {
            var target = this,
                customEvent,
                customEventObservables = target.getCustomEvents();
            customEvent = customEventObservables && customEventObservables[type];
            if (!customEvent && create) {
                customEvent = customEventObservables[type] = new CustomEventObservable({
                    currentTarget: target,
                    type: type
                });
            }
            return customEvent;
        },

        /**
         * Fire a custom event by name.
         * The callback functions will be executed from the context specified when the event was created,
         * and the {@link KISSY.Event.CustomEvent.Object} created will be mixed with eventData
         * @method fire
         * @param {String} type The type of the event
         * @param {Object} [eventData] The data will be mixed with {@link KISSY.Event.CustomEvent.Object} created
         * @return {*} If any listen returns false, then the returned value is false. else return the last listener's returned value
         */
        fire: function (type, eventData) {
            var self = this,
                ret = undefined,
                targets = self.getTargets(),
                hasTargets = targets && targets.length;

            eventData = eventData || {};

            splitAndRun(type, function (type) {

                var r2, customEventObservable;

                Utils.fillGroupsForEvent(type, eventData);

                type = eventData.type;

                // default bubble true
                // if bubble false, it must has customEvent structure set already
                customEventObservable = self.getCustomEventObservable(type);

                // optimize performance for empty event listener
                if (!customEventObservable && !hasTargets) {
                    return;
                }

                if (customEventObservable) {

                    if (!customEventObservable.hasObserver() && !customEventObservable.defaultFn) {

                        if (customEventObservable.bubbles && !hasTargets || !customEventObservable.bubbles) {
                            return;
                        }

                    }

                } else {
                    // in case no publish custom event but we need bubble
                    // because bubbles defaults to true!
                    customEventObservable = new CustomEventObservable({
                        currentTarget: self,
                        type: type
                    });
                }

                r2 = customEventObservable.fire(eventData);

                if (ret !== false && r2 !== undefined) {
                    ret = r2;
                }

            });

            return ret;
        },

        /**
         * Creates a new custom event of the specified type
         * @method publish
         * @param {String} type The type of the event
         * @param {Object} cfg Config params
         * @param {Boolean} [cfg.bubbles=true] whether or not this event bubbles
         * @param {Function} [cfg.defaultFn] this event's default action
         * @chainable
         */
        publish: function (type, cfg) {
            var customEventObservable,
                self = this;

            splitAndRun(type, function (t) {
                customEventObservable = self.getCustomEventObservable(t, true);
                S.mix(customEventObservable, cfg)
            });

            return self;
        },

        /**
         * Registers another EventTarget as a bubble target.
         * @method addTarget
         * @param {KISSY.Event.CustomEvent.Target} anotherTarget Another EventTarget instance to add
         * @chainable
         */
        addTarget: function (anotherTarget) {
            var self = this,
                targets = self.getTargets();
            if (!S.inArray(anotherTarget, targets)) {
                targets.push(anotherTarget);
            }
            return self;
        },

        /**
         * Removes a bubble target
         * @method removeTarget
         * @param {KISSY.Event.CustomEvent.Target} anotherTarget Another EventTarget instance to remove
         * @chainable
         */
        removeTarget: function (anotherTarget) {
            var self = this,
                targets = self.getTargets(),
                index = S.indexOf(anotherTarget, targets);
            if (index != -1) {
                targets.splice(index, 1);
            }
            return self;
        },

        /**
         * all targets where current target's events bubble to
         * @private
         * @return {KISSY.Event.CustomEvent.Target[]}
         */
        getTargets: function () {
            return this[KS_BUBBLE_TARGETS]||(this[KS_BUBBLE_TARGETS]=[]);
        },

        getCustomEvents:function(){
            return this[KS_CUSTOM_EVENTS]||(this[KS_CUSTOM_EVENTS]={});
        },

        /**
         * Subscribe a callback function to a custom event fired by this object or from an object that bubbles its events to this object.
         * @method on
         * @param {String} type The name of the event
         * @param {Function} fn The callback to execute in response to the event
         * @param {Object} [context] this object in callback
         * @chainable
         */
        on: function (type, fn, context) {
            var self = this;
            Utils.batchForType(function (type, fn, context) {
                var cfg = Utils.normalizeParam(type, fn, context),
                    customEvent;
                type = cfg.type;
                customEvent = self.getCustomEventObservable(type, true);
                if (customEvent) {
                    customEvent.on(cfg);
                }
            }, 0, type, fn, context);
            return self; // chain
        },

        /**
         * Detach one or more listeners from the specified event
         * @method detach
         * @param {String} type The name of the event
         * @param {Function} [fn] The subscribed function to un-subscribe. if not supplied, all observers will be removed.
         * @param {Object} [context] The custom object passed to subscribe.
         * @chainable
         */
        detach: function (type, fn, context) {
            var self = this;
            Utils.batchForType(function (type, fn, context) {
                var cfg = Utils.normalizeParam(type, fn, context),
                    customEvents,
                    customEvent;
                type = cfg.type;
                if (type) {
                    customEvent = self.getCustomEventObservable(type, true);
                    if (customEvent) {
                        customEvent.detach(cfg);
                    }
                } else {
                    customEvents = self.getCustomEvents();
                    S.each(customEvents, function (customEvent) {
                        customEvent.detach(cfg);
                    });
                }
            }, 0, type, fn, context);

            return self; // chain
        }
    };

    return Target;
}, {
    requires: ['event/base', './observable']
});
/*
 yiminghe: 2012-10-24
 - implement defaultFn for custom event

 yiminghe: 2011-10-17
 - implement bubble for custom event
 */
/**
 * @ignore
 * custom facade
 * @author yiminghe@gmail.com
 */
KISSY.add('event/custom', function (S, Target) {
    return {
        Target: Target,

        /**
         * global event target
         * @property {KISSY.Event.CustomEvent.Target} global
         * @member KISSY.Event.CustomEvent
         */
        global: new Target(),

        /**
         * @property {KISSY.Event.CustomEvent.Target} targetObject
         * @member KISSY.Event.CustomEvent
         */
        targetObject: S.mix({}, Target.prototype, true, function (k, v) {
            return k == 'constructor' ? undefined : v;
        })
    };
}, {
    requires: ['./custom/target']
});

/*
 Copyright 2013, KISSY v1.40dev
 MIT Licensed
 build time: Sep 18 00:20
 */
/*
 Combined processedModules by KISSY Module Compiler: 

 event/base/utils
 event/base/object
 event/base/observer
 event/base/observable
 event/base
 */

/**
 * @ignore
 * utils for event
 * @author yiminghe@gmail.com
 */
KISSY.add('event/base/utils', function (S) {

    var splitAndRun, getGroupsRe;

    function getTypedGroups(type) {
        if (type.indexOf('.') < 0) {
            return [type, ''];
        }
        var m = type.match(/([^.]+)?(\..+)?$/),
            t = m[1],
            ret = [t],
            gs = m[2];
        if (gs) {
            gs = gs.split('.').sort();
            ret.push(gs.join('.'));
        } else {
            ret.push('');
        }
        return ret;
    }

    return {

        splitAndRun: splitAndRun = function (type, fn) {
            if (S.isArray(type)) {
                S.each(type, fn);
                return;
            }
            type = S.trim(type);
            if (type.indexOf(' ') == -1) {
                fn(type);
            } else {
                S.each(type.split(/\s+/), fn);
            }
        },

        normalizeParam: function (type, fn, context) {
            var cfg = fn || {};

            if (typeof fn === 'function') {
                cfg = {
                    fn: fn,
                    context: context
                };
            } else {
                // copy
                cfg = S.merge(cfg);
            }

            var typedGroups = getTypedGroups(type);

            type = typedGroups[0];

            cfg.groups = typedGroups[1];

            cfg.type = type;

            return cfg;
        },

        batchForType: function (fn, num) {
            var args = S.makeArray(arguments),
                types = args[2 + num];
            // in case null
            if (types && typeof types == 'object') {
                S.each(types, function (value, type) {
                    var args2 = [].concat(args);
                    args2.splice(0, 2);
                    args2[num] = type;
                    args2[num + 1] = value;
                    fn.apply(null, args2);
                });
            } else {
                splitAndRun(types, function (type) {
                    var args2 = [].concat(args);
                    args2.splice(0, 2);
                    args2[num] = type;
                    fn.apply(null, args2);
                });
            }
        },

        fillGroupsForEvent: function (type, eventData) {
            var typedGroups = getTypedGroups(type),
                _ks_groups = typedGroups[1];

            if (_ks_groups) {
                _ks_groups = getGroupsRe(_ks_groups);
                eventData._ks_groups = _ks_groups;
            }

            eventData.type = typedGroups[0];
        },

        getGroupsRe: getGroupsRe = function (groups) {
            return new RegExp(groups.split('.').join('.*\\.') + '(?:\\.|$)');
        }

    };

});
/**
 * @ignore
 * base event object for custom and dom event.
 * @author yiminghe@gmail.com
 */
KISSY.add('event/base/object', function (S, undefined) {

    var FALSE_FN = function f_f() {
        return false;
    }, TRUE_FN = function t_f() {
        return true;
    };

    /**
     * @class KISSY.Event.Object
     * @private
     * KISSY 's base event object for custom and dom event.
     */
    function EventObject() {

        var self = this;

        self.timeStamp = S.now();
        /**
         * target
         * @property target
         * @member KISSY.Event.Object
         */
        self.target = undefined;
        /**
         * currentTarget
         * @property currentTarget
         * @member KISSY.Event.Object
         */
        self.currentTarget = undefined;
        /**
         * current event type
         * @property type
         * @type {String}
         * @member KISSY.Event.Object
         */
    }

    EventObject.prototype = {
        constructor: EventObject,
        /**
         * Flag for preventDefault that is modified during fire event. if it is true, the default behavior for this event will be executed.
         * @method
         * @member KISSY.Event.Object
         */
        isDefaultPrevented: FALSE_FN,
        /**
         * Flag for stopPropagation that is modified during fire event. true means to stop propagation to bubble targets.
         * @method
         * @member KISSY.Event.Object
         */
        isPropagationStopped: FALSE_FN,
        /**
         * Flag for stopImmediatePropagation that is modified during fire event. true means to stop propagation to bubble targets and other listener.
         * @method
         * @member KISSY.Event.Object
         */
        isImmediatePropagationStopped: FALSE_FN,

        /**
         * Prevents the event's default behavior
         * @member KISSY.Event.Object
         */
        preventDefault: function () {
            this.isDefaultPrevented = TRUE_FN;
        },

        /**
         * Stops the propagation to the next bubble target
         * @member KISSY.Event.Object
         */
        stopPropagation: function () {
            this.isPropagationStopped = TRUE_FN;
        },

        /**
         * Stops the propagation to the next bubble target and
         * prevents any additional listeners from being executed
         * on the current target.
         * @member KISSY.Event.Object
         */
        stopImmediatePropagation: function () {
            var self = this;
            self.isImmediatePropagationStopped = TRUE_FN;
            // fixed 1.2
            // call stopPropagation implicitly
            self.stopPropagation();
        },

        /**
         * Stops the event propagation and prevents the default
         * event behavior.
         * @param  {Boolean} [immediate] if true additional listeners on the current target will not be executed
         * @member KISSY.Event.Object
         */
        halt: function (immediate) {
            var self = this;
            if (immediate) {
                self.stopImmediatePropagation();
            } else {
                self.stopPropagation();
            }
            self.preventDefault();
        }
    };

    return EventObject;

});
/**
 * @ignore
 * observer for event.
 * @author yiminghe@gmail.com
 */
KISSY.add('event/base/observer', function (S, undefined) {

    /**
     * KISSY 's base observer for handle user-specified function
     * @private
     * @class KISSY.Event.Observer
     * @param {Object} cfg
     */
    function Observer(cfg) {
        S.mix(this, cfg);

        /**
         * context in which observer's fn runs
         * @cfg {Object} context
         */
        /**
         * current observer's user-defined function
         * @cfg {Function} fn
         */
        /**
         * whether un-observer current observer once after running observer's user-defined function
         * @cfg {Boolean} once
         */
        /**
         * groups separated by '.' which current observer belongs
         * @cfg {String} groups
         */
    }

    Observer.prototype = {

        constructor: Observer,

        /**
         * whether current observer equals s2
         * @param {KISSY.Event.Observer} s2 another observer
         * @return {Boolean}
         */
        equals: function (s2) {
            var s1 = this;
            return !!S.reduce(s1.keys, function (v, k) {
                return v && (s1[k] === s2[k]);
            }, 1);
        },

        /**
         * simple run current observer's user-defined function
         * @param {KISSY.Event.Object} event
         * @param {KISSY.Event.Observable} ce
         * @return {*} return value of current observer's user-defined function
         */
        simpleNotify: function (event, ce) {
            var ret,
                self = this;
            ret = self.fn.call(self.context || ce.currentTarget, event, self.data);
            if (self.once) {
                //noinspection JSUnresolvedFunction
                ce.removeObserver(self);
            }
            return ret;
        },

        /**
         * current observer's notification.
         * @protected
         * @param {KISSY.Event.Object} event
         * @param {KISSY.Event.Observable} ce
         */
        notifyInternal: function (event, ce) {
            var ret = this.simpleNotify(event, ce);
            // return false 等价 preventDefault + stopPropagation
            if (ret === false) {
                event.halt();
            }
            return ret;
        },

        /**
         * run current observer's user-defined function
         * @param event
         * @param ce
         */
        notify: function (event, ce) {
            var self = this,
                _ks_groups = event._ks_groups;

            // handler's group does not match specified groups (at fire step)
            if (_ks_groups && (!self.groups || !(self.groups.match(_ks_groups)))) {
                return undefined;
            }

            return self.notifyInternal(event, ce);
        }

    };

    return Observer;

});
/**
 * @ignore
 * base custom event mechanism for kissy
 * @author yiminghe@gmail.com
 */
KISSY.add('event/base/observable', function (S) {

    /**
     * base custom event for registering and un-registering observer for specified event.
     * @class KISSY.Event.Observable
     * @private
     * @param {Object} cfg custom event's attribute
     */
    function Observable(cfg) {
        var self = this;
        self.currentTarget = null;
        S.mix(self, cfg);
        self.reset();
        /**
         * current event type
         * @cfg {String} type
         */
    }

    Observable.prototype = {

        constructor: Observable,

        /**
         * whether current event has observers
         * @return {Boolean}
         */
        hasObserver: function () {
            return !!this.observers.length;
        },

        /**
         * reset current event's status
         */
        reset: function () {
            var self = this;
            self.observers = [];
        },

        /**
         * remove one observer from current event's observers
         * @param {KISSY.Event.Observer} observer
         */
        removeObserver: function (observer) {
            var self = this,
                i,
                observers = self.observers,
                len = observers.length;
            for (i = 0; i < len; i++) {
                if (observers[i] == observer) {
                    observers.splice(i, 1);
                    break;
                }
            }
            self.checkMemory();
        },

        /**
         * check memory after detach
         * @private
         */
        checkMemory: function () {

        },

        /**
         * Search for a specified observer within current event's observers
         * @param {KISSY.Event.Observer} observer
         * @return {Number} observer's index in observers
         */
        findObserver: function (observer) {
            var observers = this.observers, i;

            for (i = observers.length - 1; i >= 0; --i) {
                /*
                 If multiple identical EventListeners are registered on the same EventTarget
                 with the same parameters the duplicate instances are discarded.
                 They do not cause the EventListener to be called twice
                 and since they are discarded
                 they do not need to be removed with the removeEventListener method.
                 */
                if (observer.equals(observers[i])) {
                    return i;
                }
            }

            return -1;
        }
    };

    return Observable;

});
/**
 * @ignore
 * scalable event framework for kissy (refer Dom3 Events)
 * @author yiminghe@gmail.com
 */
KISSY.add('event/base', function (S, Utils, Object, Observer, Observable) {
    /**
     * The event utility provides functions to add and remove event listeners.
     * @class KISSY.Event
     * @singleton
     */
    return {
        Utils: Utils,
        Object: Object,
        Observer: Observer,
        Observable: Observable
    };
}, {
    requires: ['./base/utils', './base/object', './base/observer', './base/observable']
});


/*
 yiminghe@gmail.com: 2012-10-24
 - 重构，新架构，自定义事件，Dom 事件分离

 yiminghe@gmail.com: 2011-12-15
 - 重构，粒度更细，新的架构

 2011-11-24
 - 自定义事件和 dom 事件操作彻底分离
 - TODO: group event from Dom3 Events

 2011-06-07
 - refer : http://www.w3.org/TR/2001/WD-Dom-Level-3-Events-20010823/events.html
 - 重构
 - eventHandler 一个元素一个而不是一个元素一个事件一个，节省内存
 - 减少闭包使用，prevent ie 内存泄露？
 - 增加 fire ，模拟冒泡处理 dom 事件
 */

/*
 Copyright 2013, KISSY v1.40
 MIT Licensed
 build time: Oct 29 14:13
 */
/*
 Combined processedModules by KISSY Module Compiler: 

 base/attribute
 base
 */

/**
 * @ignore
 * attribute management
 * @author yiminghe@gmail.com, lifesinger@gmail.com
 */
KISSY.add('base/attribute', function (S, undefined) {
    // atomic flag
    var INVALID = {};

    var FALSE = false;

    function normalFn(host, method) {
        if (typeof method == 'string') {
            return host[method];
        }
        return method;
    }

    function whenAttrChangeEventName(when, name) {
        return when + S.ucfirst(name) + 'Change';
    }

    // fire attribute value change
    function __fireAttrChange(self, when, name, prevVal, newVal, subAttrName, attrName, data) {
        attrName = attrName || name;
        return self.fire(whenAttrChangeEventName(when, name), S.mix({
            attrName: attrName,
            subAttrName: subAttrName,
            prevVal: prevVal,
            newVal: newVal
        }, data));
    }

    function ensureNonEmpty(obj, name, doNotCreate) {
        var ret = obj[name];
        if (!doNotCreate && !ret) {
            obj[name] = ret = {};
        }
        return ret || {};
    }

    /*
     o, [x,y,z] => o[x][y][z]
     */
    function getValueByPath(o, path) {
        for (var i = 0, len = path.length;
             o != undefined && i < len;
             i++) {
            o = o[path[i]];
        }
        return o;
    }

    /*
     o, [x,y,z], val => o[x][y][z]=val
     */
    function setValueByPath(o, path, val) {
        var len = path.length - 1,
            s = o;
        if (len >= 0) {
            for (var i = 0; i < len; i++) {
                o = o[path[i]];
            }
            if (o != undefined) {
                o[path[i]] = val;
            } else {
                s = undefined;
            }
        }
        return s;
    }

    function getPathNamePair(name) {
        var path;

        if (name.indexOf('.') !== -1) {
            path = name.split('.');
            name = path.shift();
        }

        return {
            path: path,
            name: name
        };
    }

    function getValueBySubValue(prevVal, path, value) {
        var tmp = value;
        if (path) {
            if (prevVal === undefined) {
                tmp = {};
            } else {
                tmp = S.clone(prevVal);
            }
            setValueByPath(tmp, path, value);
        }
        return tmp;
    }

    function prepareDefaultSetFn(self, name) {
        var defaultBeforeFns = ensureNonEmpty(self, '__defaultBeforeFns');
        if (defaultBeforeFns[name]) {
            return;
        }
        defaultBeforeFns[name] = 1;
        var beforeChangeEventName = whenAttrChangeEventName('before', name);
        self.publish(beforeChangeEventName, {
            defaultFn: defaultSetFn
        });
    }

    function setInternal(self, name, value, opts, attrs) {
        var path,
            subVal,
            prevVal,
            pathNamePair = getPathNamePair(name),
            fullName = name;

        name = pathNamePair.name;
        path = pathNamePair.path;
        prevVal = self.get(name);

        prepareDefaultSetFn(self, name);

        if (path) {
            subVal = getValueByPath(prevVal, path);
        }

        // if no change, just return
        // pass equal check to fire change event
        if (!opts.force) {
            if (!path && prevVal === value) {
                return undefined;
            } else if (path && subVal === value) {
                return undefined;
            }
        }

        value = getValueBySubValue(prevVal, path, value);

        var beforeEventObject = S.mix({
            attrName: name,
            subAttrName: fullName,
            prevVal: prevVal,
            newVal: value,
            _opts: opts,
            _attrs: attrs,
            target: self
        }, opts.data);

        // check before event
        if (opts['silent']) {
            if (FALSE === defaultSetFn.call(self, beforeEventObject)) {
                return FALSE;
            }
        } else {
            if (FALSE === self.fire(whenAttrChangeEventName('before', name), beforeEventObject)) {
                return FALSE;
            }
        }

        return self;
    }

    function defaultSetFn(e) {
        // only consider itself, not bubbling!
        if (e.target !== this) {
            return undefined;
        }
        var self = this,
            value = e.newVal,
            prevVal = e.prevVal,
            name = e.attrName,
            fullName = e.subAttrName,
            attrs = e._attrs,
            opts = e._opts;

        // set it
        var ret = self.setInternal(name, value);

        if (ret === FALSE) {
            return ret;
        }

        // fire after event
        if (!opts['silent']) {
            value = self.__attrVals[name];
            __fireAttrChange(self, 'after', name, prevVal, value, fullName, null, opts.data);
            if (attrs) {
                attrs.push({
                    prevVal: prevVal,
                    newVal: value,
                    attrName: name,
                    subAttrName: fullName
                });
            } else {
                __fireAttrChange(self,
                    '', '*',
                    [prevVal], [value],
                    [fullName], [name],
                    opts.data);
            }
        }

        return undefined;
    }

    /**
     * @class KISSY.Base.Attribute
     * @override KISSY.Base
     */
    return {
        INVALID: INVALID,

        /**
         * get un-cloned attr config collections
         * @return {Object}
         * @private
         */
        getAttrs: function () {
            return this.__attrs;
        },

        /**
         * get un-cloned attr value collections
         * @return {Object}
         */
        getAttrVals: function () {
            var self = this,
                o = {},
                a,
                attrs = self.__attrs;
            for (a in attrs) {
                o[a] = self.get(a);
            }
            return o;
        },

        /**
         * Adds an attribute with the provided configuration to the host object.
         * @param {String} name attrName
         * @param {Object} attrConfig The config supports the following properties
         * @param [attrConfig.value] simple object or system native object
         * @param [attrConfig.valueFn] a function which can return current attribute 's default value
         * @param {Function} [attrConfig.setter] call when set attribute 's value
         * pass current attribute 's value as parameter
         * if return value is not undefined,set returned value as real value
         * @param {Function} [attrConfig.getter] call when get attribute 's value
         * pass current attribute 's value as parameter
         * return getter's returned value to invoker
         * @param {Function} [attrConfig.validator]  call before set attribute 's value
         * if return false,cancel this set action
         * @param {Boolean} [override] whether override existing attribute config ,default true
         * @chainable
         */
        addAttr: function (name, attrConfig, override) {
            var self = this,
                attrs = self.__attrs,
                attr,
                cfg = S.clone(attrConfig);
            if (attr = attrs[name]) {
                S.mix(attr, cfg, override);
            } else {
                attrs[name] = cfg;
            }
            return self;
        },

        /**
         * Configures a group of attributes, and sets initial values.
         * @param {Object} attrConfigs  An object with attribute name/configuration pairs.
         * @param {Object} initialValues user defined initial values
         * @chainable
         */
        addAttrs: function (attrConfigs, initialValues) {
            var self = this;
            S.each(attrConfigs, function (attrConfig, name) {
                self.addAttr(name, attrConfig);
            });
            if (initialValues) {
                self.set(initialValues);
            }
            return self;
        },

        /**
         * Checks if the given attribute has been added to the host.
         * @param {String} name attribute name
         * @return {Boolean}
         */
        hasAttr: function (name) {
            return this.__attrs.hasOwnProperty(name);
        },

        /**
         * Removes an attribute from the host object.
         * @chainable
         */
        removeAttr: function (name) {
            var self = this;
            var __attrVals = self.__attrVals;
            var __attrs = self.__attrs;

            if (self.hasAttr(name)) {
                delete __attrs[name];
                delete __attrVals[name];
            }

            return self;
        },


        /**
         * Sets the value of an attribute.
         * @param {String|Object} name attribute 's name or attribute name and value map
         * @param [value] attribute 's value
         * @param {Object} [opts] some options
         * @param {Boolean} [opts.silent] whether fire change event
         * @param {Function} [opts.error] error handler
         * @return {Boolean} whether pass validator
         */
        set: function (name, value, opts) {
            var self = this;
            if (S.isPlainObject(name)) {
                opts = value;
                opts = opts || {};
                var all = Object(name),
                    attrs = [],
                    e,
                    errors = [];
                for (name in all) {
                    // bulk validation
                    // if any one failed,all values are not set
                    if ((e = validate(self, name, all[name], all)) !== undefined) {
                        errors.push(e);
                    }
                }
                if (errors.length) {
                    if (opts['error']) {
                        opts['error'](errors);
                    }
                    return FALSE;
                }
                for (name in all) {
                    setInternal(self, name, all[name], opts, attrs);
                }
                var attrNames = [],
                    prevVals = [],
                    newVals = [],
                    subAttrNames = [];
                S.each(attrs, function (attr) {
                    prevVals.push(attr.prevVal);
                    newVals.push(attr.newVal);
                    attrNames.push(attr.attrName);
                    subAttrNames.push(attr.subAttrName);
                });
                if (attrNames.length) {
                    __fireAttrChange(self,
                        '',
                        '*',
                        prevVals,
                        newVals,
                        subAttrNames,
                        attrNames,
                        opts.data);
                }
                return self;
            }
            opts = opts || {};
            // validator check
            e = validate(self, name, value);

            if (e !== undefined) {
                if (opts['error']) {
                    opts['error'](e);
                }
                return FALSE;
            }
            return setInternal(self, name, value, opts);
        },

        /**
         * internal use, no event involved, just set.
         * override by model
         * @protected
         */
        setInternal: function (name, value) {
            var self = this,
                setValue = undefined,
            // if host does not have meta info corresponding to (name,value)
            // then register on demand in order to collect all data meta info
            // ä¸€å®šè¦æ³¨å†Œå±žæ€§å…ƒæ•°æ®ï¼Œå¦åˆ™å…¶ä»–æ¨¡å—é€šè¿‡ _attrs ä¸èƒ½æžšä¸¾åˆ°æ‰€æœ‰æœ‰æ•ˆå±žæ€§
            // å› ä¸ºå±žæ€§åœ¨å£°æ˜Žæ³¨å†Œå‰å¯ä»¥ç›´æŽ¥è®¾ç½®å€¼
                attrConfig = ensureNonEmpty(self.__attrs, name),
                setter = attrConfig['setter'];

            // if setter has effect
            if (setter && (setter = normalFn(self, setter))) {
                setValue = setter.call(self, value, name);
            }

            if (setValue === INVALID) {
                return FALSE;
            }

            if (setValue !== undefined) {
                value = setValue;
            }

            // finally set
            self.__attrVals[name] = value;

            return undefined;
        },

        /**
         * Gets the current value of the attribute.
         * @param {String} name attribute 's name
         * @return {*}
         */
        get: function (name) {
            var self = this,
                dot = '.',
                path,
                attrVals = self.__attrVals,
                attrConfig,
                getter, ret;

            if (name.indexOf(dot) !== -1) {
                path = name.split(dot);
                name = path.shift();
            }

            attrConfig = ensureNonEmpty(self.__attrs, name, 1);
            getter = attrConfig['getter'];

            // get user-set value or default value
            //user-set value takes privilege
            ret = name in attrVals ?
                attrVals[name] :
                getDefAttrVal(self, name);

            // invoke getter for this attribute
            if (getter && (getter = normalFn(self, getter))) {
                ret = getter.call(self, ret, name);
            }

            if (!(name in attrVals) && ret !== undefined) {
                attrVals[name] = ret;
            }

            if (path) {
                ret = getValueByPath(ret, path);
            }

            return ret;
        },

        /**
         * Resets the value of an attribute.just reset what addAttr set
         * (not what invoker set when call new Xx(cfg))
         * @param {String} name name of attribute
         * @param {Object} [opts] some options
         * @param {Boolean} [opts.silent] whether fire change event
         * @chainable
         */
        reset: function (name, opts) {
            var self = this;

            if (typeof name == 'string') {
                if (self.hasAttr(name)) {
                    // if attribute does not have default value, then set to undefined
                    return self.set(name, getDefAttrVal(self, name), opts);
                }
                else {
                    return self;
                }
            }

            opts = /**@type Object
             @ignore*/(name);

            var attrs = self.__attrs,
                values = {};

            // reset all
            for (name in attrs) {
                values[name] = getDefAttrVal(self, name);
            }

            self.set(values, opts);
            return self;
        }
    };

    // get default attribute value from valueFn/value
    function getDefAttrVal(self, name) {
        var attrs = self.__attrs,
            attrConfig = ensureNonEmpty(attrs, name, 1),
            valFn = attrConfig.valueFn,
            val;

        if (valFn && (valFn = normalFn(self, valFn))) {
            val = valFn.call(self);
            if (val !== /**
             @ignore
             @type Function
             */undefined) {
                attrConfig.value = val;
            }
            delete attrConfig.valueFn;
            attrs[name] = attrConfig;
        }

        return attrConfig.value;
    }

    function validate(self, name, value, all) {
        var path, prevVal, pathNamePair;

        pathNamePair = getPathNamePair(name);

        name = pathNamePair.name;
        path = pathNamePair.path;

        if (path) {
            prevVal = self.get(name);
            value = getValueBySubValue(prevVal, path, value);
        }
        var attrConfig = ensureNonEmpty(self.__attrs, name),
            e,
            validator = attrConfig['validator'];
        if (validator && (validator = normalFn(self, validator))) {
            e = validator.call(self, value, name, all);
            // undefined and true validate successfully
            if (e !== undefined && e !== true) {
                return e;
            }
        }
        return undefined;
    }
});

/*
 2011-10-18
 get/set sub attribute value ,set('x.y',val) x æœ€å¥½ä¸º {} ï¼Œä¸è¦æ˜¯ new Clz() å‡ºæ¥çš„
 add validator
 */
/**
 * @ignore
 * KISSY Class System
 * @author yiminghe@gmail.com
 */
KISSY.add('base', function (S, Attribute, CustomEvent) {
    var ATTRS = 'ATTRS',
        ucfirst = S.ucfirst,
        ON_SET = '_onSet',
        noop = S.noop,
        RE_DASH = /(?:^|-)([a-z])/ig;

    function replaceToUpper() {
        return arguments[1].toUpperCase();
    }

    function CamelCase(name) {
        return name.replace(RE_DASH, replaceToUpper);
    }

    function __getHook(method, reverse) {
        return function (origFn) {
            return function wrap() {
                var self = this;
                if (reverse) {
                    origFn.apply(self, arguments);
                } else {
                    self.callSuper.apply(self, arguments);
                }
                // can not use wrap in old ie
                var extensions = arguments.callee.__owner__.__extensions__ || [];
                if (reverse) {
                    extensions.reverse();
                }
                callExtensionsMethod(self, extensions, method, arguments);
                if (reverse) {
                    self.callSuper.apply(self, arguments);
                } else {
                    origFn.apply(self, arguments);
                }
            };
        }
    }

    /**
     * @class KISSY.Base
     * @extend KISSY.Event.CustomEvent.Target
     *
     * A base class which objects requiring attributes, extension, plugin, custom event support can
     * extend.
     * attributes configured
     * through the static {@link KISSY.Base#static-ATTRS} property for each class
     * in the hierarchy will be initialized by Base.
     */
    function Base(config) {
        var self = this,
            c = self.constructor;
        Base.superclass.constructor.apply(this, arguments);
        self.__attrs = {};
        self.__attrVals = {};
        // save user config
        self.userConfig = config;
        // define
        while (c) {
            addAttrs(self, c[ATTRS]);
            c = c.superclass ? c.superclass.constructor : null;
        }
        // initial attr
        initAttrs(self, config);
        // setup listeners
        var listeners = self.get("listeners");
        for (var n in listeners) {
            self.on(n, listeners[n]);
        }
        // initializer
        self.initializer();
        // call plugins
        constructPlugins(self);
        callPluginsMethod.call(self, 'pluginInitializer');
        // bind attr change
        self.bindInternal();
        // sync attr
        self.syncInternal();
    }

    S.augment(Base, Attribute);

    S.extend(Base, CustomEvent.Target, {
        initializer: noop,

        '__getHook': __getHook,

        __callPluginsMethod: callPluginsMethod,

        'callSuper': function () {
            var method, obj,
                self = this,
                args = arguments;

            if (typeof self == 'function' && self.__name__) {
                method = self;
                obj = args[0];
                args = Array.prototype.slice.call(args, 1);
            } else {
                method = arguments.callee.caller;
                if (method.__wrapped__) {
                    method = method.caller;
                }
                obj = self;
            }

            var name = method.__name__;
            if (!name) {
                //S.log('can not find method name for callSuper [' + self.constructor.name + ']: ' + method.toString());
                return undefined;
            }
            var member = method.__owner__.superclass[name];
            if (!member) {
                //S.log('can not find method [' + name + '] for callSuper: ' + method.__owner__.name);
                return undefined;
            }

            return member.apply(obj, args || []);
        },

        /**
         * bind attribute change event
         * @protected
         */
        bindInternal: function () {
            var self = this,
                attrs = self['getAttrs'](),
                attr, m;

            for (attr in attrs) {
                m = ON_SET + ucfirst(attr);
                if (self[m]) {
                    // è‡ªåŠ¨ç»‘å®šäº‹ä»¶åˆ°å¯¹åº”å‡½æ•°
                    self.on('after' + ucfirst(attr) + 'Change', onSetAttrChange);
                }
            }
        },

        /**
         * sync attribute change event
         * @protected
         */
        syncInternal: function () {
            var self = this,
                cs = [],
                i,
                c = self.constructor,
                attrs = self.getAttrs();

            while (c) {
                cs.push(c);
                c = c.superclass && c.superclass.constructor;
            }

            cs.reverse();

            // from super class to sub class
            for (i = 0; i < cs.length; i++) {
                var ATTRS = cs[i].ATTRS || {};
                for (var attributeName in ATTRS) {
                    if (attributeName in attrs) {
                        var attributeValue,
                            onSetMethod;
                        var onSetMethodName = ON_SET + ucfirst(attributeName);
                        // å­˜åœ¨æ–¹æ³•ï¼Œå¹¶ä¸”ç”¨æˆ·è®¾ç½®äº†åˆå§‹å€¼æˆ–è€…å­˜åœ¨é»˜è®¤å€¼ï¼Œå°±åŒæ­¥çŠ¶æ€
                        if ((onSetMethod = self[onSetMethodName]) &&
                            // ç”¨æˆ·å¦‚æžœè®¾ç½®äº†æ˜¾å¼ä¸åŒæ­¥ï¼Œå°±ä¸åŒæ­¥ï¼Œ
                            // æ¯”å¦‚ä¸€äº›å€¼ä»Ž html ä¸­è¯»å–ï¼Œä¸éœ€è¦åŒæ­¥å†æ¬¡è®¾ç½®
                            attrs[attributeName].sync !== 0 &&
                            (attributeValue = self.get(attributeName)) !== undefined) {
                            onSetMethod.call(self, attributeValue);
                        }
                    }
                }
            }
        },

        /**
         * plugin a new plugins to current instance
         * @param {Function|Object} plugin
         * @chainable
         */
        'plug': function (plugin) {
            var self = this;
            if (typeof plugin === 'function') {
                plugin = new plugin();
            }
            // initialize plugin
            if (plugin['pluginInitializer']) {
                plugin['pluginInitializer'](self);
            }
            self.get('plugins').push(plugin);
            return self;
        },

        /**
         * unplug by pluginId or plugin instance.
         * if called with no parameter, then destroy all plugins.
         * @param {Object|String} [plugin]
         * @chainable
         */
        'unplug': function (plugin) {
            var plugins = [],
                self = this,
                isString = typeof plugin == 'string';

            S.each(self.get('plugins'), function (p) {
                var keep = 0, pluginId;
                if (plugin) {
                    if (isString) {
                        // user defined takes priority
                        pluginId = p.get && p.get('pluginId') || p.pluginId;
                        if (pluginId != plugin) {
                            plugins.push(p);
                            keep = 1;
                        }
                    } else {
                        if (p != plugin) {
                            plugins.push(p);
                            keep = 1;
                        }
                    }
                }

                if (!keep) {
                    p.pluginDestructor(self);
                }
            });

            self.setInternal('plugins', plugins);
            return self;
        },

        /**
         * get specified plugin instance by id
         * @param {String} id pluginId of plugin instance
         * @return {Object}
         */
        'getPlugin': function (id) {
            var plugin = null;
            S.each(this.get('plugins'), function (p) {
                // user defined takes priority
                var pluginId = p.get && p.get('pluginId') || p.pluginId;
                if (pluginId == id) {
                    plugin = p;
                    return false;
                }
                return undefined;
            });
            return plugin;
        },

        destructor: S.noop,

        destroy: function () {
            var self = this;
            if (!self.get('destroyed')) {
                callPluginsMethod.call(self, 'pluginDestructor');
                self.destructor();
                self.set('destroyed', true);
                self.fire('destroy');
                self.detach();
            }
        }
    });

    S.mix(Base, {
        __hooks__: {
            initializer: __getHook(),
            destructor: __getHook('__destructor', true)
        },

        ATTRS: {
            /**
             * Plugins for current component.
             * @cfg {Function[]/Object[]} plugins
             */
            /**
             * @ignore
             */
            plugins: {
                value: []
            },

            destroyed: {
                value: false
            },

            /**
             * Config listener on created.
             *
             * for example:
             *
             *      {
             *          click:{
             *              context:{x:1},
             *              fn:function(){
             *                  alert(this.x);
             *              }
             *          }
             *      }
             *      // or
             *      {
             *          click:function(){
             *              alert(this.x);
             *          }
             *      }
             *
             * @cfg {Object} listeners
             */
            /**
             * @ignore
             */
            listeners: {
                value: []
            }
        },

        /**
         * create a new class from extensions and static/prototype properties/methods.
         * @param {Function[]} [extensions] extension classes
         * @param {Object} [px] key-value map for prototype properties/methods.
         * @param {Object} [sx] key-value map for static properties/methods.
         * @param {String} [sx.name] new Class's name.
         * @return {Function} new class which extend called, it also has a static extend method
         * @static
         *
         * for example:
         *
         *      var Parent = Base.extend({
         *          isParent: 1
         *      });
         *      var Child = Parent.extend({
         *          isChild: 1,
         *          isParent: 0
         *      })
         */
        extend: function extend(extensions, px, sx) {
            var SuperClass = this,
                name,
                SubClass;
            if (!S.isArray(extensions)) {
                sx = px;
                px = /**@type {Object}
                 @ignore*/extensions;
                extensions = [];
            }
            sx = sx || {};
            name = sx.name || 'BaseDerived';
            px = S.merge(px);
            if (px.hasOwnProperty('constructor')) {
                SubClass = px.constructor;
            } else {
                // debug mode, give the right name for constructor
                // refer : http://limu.iteye.com/blog/1136712
                if ('@DEBUG@') {
                    eval("SubClass = function " + CamelCase(name) + "(){ " +
                        "this.callSuper.apply(this, arguments);}");
                } else {
                    SubClass = function () {
                        this.callSuper.apply(this, arguments);
                    };
                }
            }
            px.constructor = SubClass;
            // wrap method to get owner and name
            var hooks = SuperClass.__hooks__;
            if (hooks) {
                sx.__hooks__ = S.merge(hooks, sx.__hooks__);
            }
            SubClass.__extensions__ = extensions;
            wrapProtoForSuper(px, SubClass, sx.__hooks__ || {});
            var sp = SuperClass.prototype;
            // process inheritedStatics
            var inheritedStatics = sp['__inheritedStatics__'] = sp['__inheritedStatics__'] || sx['inheritedStatics'];
            if (sx['inheritedStatics'] && inheritedStatics !== sx['inheritedStatics']) {
                S.mix(inheritedStatics, sx['inheritedStatics']);
            }
            if (inheritedStatics) {
                S.mix(SubClass, inheritedStatics);
            }
            delete sx['inheritedStatics'];
            // extend
            S.extend(SubClass, SuperClass, px, sx);
            // merge extensions
            if (extensions.length) {
                var attrs = {},
                    prototype = {};
                // [ex1,ex2]ï¼Œæ‰©å±•ç±»åŽé¢çš„ä¼˜å…ˆï¼Œex2 å®šä¹‰çš„è¦†ç›– ex1 å®šä¹‰çš„
                // ä¸»ç±»æœ€ä¼˜å…ˆ
                S.each(extensions['concat'](SubClass), function (ext) {
                    if (ext) {
                        // åˆå¹¶ ATTRS åˆ°ä¸»ç±»
                        // ä¸è¦†ç›–ä¸»ç±»ä¸Šçš„å®šä¹‰(ä¸»ç±»ä½äºŽ constructors æœ€åŽ)
                        // å› ä¸ºç»§æ‰¿å±‚æ¬¡ä¸Šæ‰©å±•ç±»æ¯”ä¸»ç±»å±‚æ¬¡é«˜
                        // æ³¨æ„ï¼šæœ€å¥½ value å¿…é¡»æ˜¯ç®€å•å¯¹è±¡ï¼Œè‡ªå®šä¹‰ new å‡ºæ¥çš„å¯¹è±¡å°±ä¼šæœ‰é—®é¢˜
                        // (ç”¨ function return å‡ºæ¥)!
                        // a {y:{value:2}} b {y:{value:3,getter:fn}}
                        // b is a extension of a
                        // =>
                        // a {y:{value:2,getter:fn}}
                        S.each(ext[ATTRS], function (v, name) {
                            var av = attrs[name] = attrs[name] || {};
                            S.mix(av, v);
                        });
                        // æ–¹æ³•åˆå¹¶
                        var exp = ext.prototype,
                            p;
                        for (p in exp) {
                            // do not mess with parent class
                            if (exp.hasOwnProperty(p)) {
                                prototype[p] = exp[p];
                            }
                        }
                    }
                });
                SubClass[ATTRS] = attrs;
                prototype.constructor = SubClass;
                S.augment(SubClass, prototype);
            }
            SubClass.extend = SubClass.extend || extend;
            SubClass.addMembers = addMembers;
            return SubClass;
        }
    });

    function addMembers(px) {
        var SubClass = this;
        wrapProtoForSuper(px, SubClass, SubClass.__hooks__ || {});
        S.mix(SubClass.prototype, px);
    }

    /**
     * The default set of attributes which will be available for instances of this class, and
     * their configuration
     *
     * By default if the value is an object literal or an array it will be 'shallow' cloned, to
     * protect the default value.
     *
     *      for example:
     *      @example
     *      {
     *          x:{
     *              value: // default value
     *              valueFn: // default function to get value
     *              getter: // getter function
     *              setter: // setter function
     *          }
     *      }
     *
     * @property ATTRS
     * @member KISSY.Base
     * @static
     * @type {Object}
     */

    function onSetAttrChange(e) {
        var self = this,
            method;
        // ignore bubbling
        if (e.target == self) {
            method = self[ON_SET + e.type.slice(5).slice(0, -6)];
            method.call(self, e.newVal, e);
        }
    }

    function addAttrs(host, attrs) {
        if (attrs) {
            for (var attr in attrs) {
                // å­ç±»ä¸Šçš„ ATTRS é…ç½®ä¼˜å…ˆ
                // çˆ¶ç±»åŽåŠ ï¼Œçˆ¶ç±»ä¸è¦†ç›–å­ç±»çš„ç›¸åŒè®¾ç½®
                // å±žæ€§å¯¹è±¡ä¼š merge
                // a: {y: {getter: fn}}, b: {y: {value: 3}}
                // b extends a
                // =>
                // b {y: {value: 3, getter: fn}}
                host.addAttr(attr, attrs[attr], false);
            }
        }
    }

    function initAttrs(host, config) {
        if (config) {
            for (var attr in config) {
                // ç”¨æˆ·è®¾ç½®ä¼šè°ƒç”¨ setter/validator çš„ï¼Œä½†ä¸ä¼šè§¦å‘å±žæ€§å˜åŒ–äº‹ä»¶
                host.setInternal(attr, config[attr]);
            }
        }
    }

    function constructPlugins(self) {
        var plugins = self.get('plugins');
        S.each(plugins, function (plugin, i) {
            if (typeof plugin === 'function') {
                plugins[i] = new plugin();
            }
        });
    }

    function wrapper(fn) {
        return function () {
            return fn.apply(this, arguments);
        }
    }

    function wrapProtoForSuper(px, SubClass, hooks) {
        var extensions = SubClass.__extensions__;
        if (extensions.length) {
            for (p in hooks) {
                px[p] = px[p] || noop;
            }
        }
        // in case px contains toString
        for (var p in hooks) {
            if (p in px) {
                px[p] = hooks[p](px[p]);
            }
        }
        S.each(px, function (v, p) {
            if (typeof v == 'function') {
                var wrapped = 0;
                if (v.__owner__) {
                    var originalOwner = v.__owner__;
                    delete v.__owner__;
                    delete v.__name__;
                    wrapped = v.__wrapped__ = 1;
                    var newV = wrapper(v);
                    newV.__owner__ = originalOwner;
                    newV.__name__ = p;
                    originalOwner.prototype[p] = newV;
                } else if (v.__wrapped__) {
                    wrapped = 1;
                }
                if (wrapped) {
                    px[p] = v = wrapper(v);
                }
                v.__owner__ = SubClass;
                v.__name__ = p;
            }
        });
    }

    function callPluginsMethod(method) {
        var len,
            self = this,
            plugins = self.get('plugins');
        if (len = plugins.length) {
            for (var i = 0; i < len; i++) {
                plugins[i][method] && plugins[i][method](self);
            }
        }
    }

    function callExtensionsMethod(self, extensions, method, args) {
        var len;
        if (len = extensions && extensions.length) {
            for (var i = 0; i < len; i++) {
                var fn = extensions[i] && (
                    !method ?
                        extensions[i] :
                        extensions[i].prototype[method]
                    );
                if (fn) {
                    fn.apply(self, args || []);
                }
            }
        }
    }

    S.Base = Base;

    return Base;
}, {
    requires: ['base/attribute', 'event/custom']
});
/**
 * @ignore
 * 2013-08-12 yiminghe@gmail.com
 * - merge rich-base and base
 * - callSuper inspired by goto100
 */

/* Zepto v1.0-1-ga3cab6c - polyfill zepto detect event ajax form fx - zeptojs.com/license */


;(function(undefined){
    if (String.prototype.trim === undefined) // fix for iOS 3.2
        String.prototype.trim = function(){ return this.replace(/^\s+|\s+$/g, '') }

    // For iOS 3.x
    // from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce
    if (Array.prototype.reduce === undefined)
        Array.prototype.reduce = function(fun){
            if(this === void 0 || this === null) throw new TypeError()
            var t = Object(this), len = t.length >>> 0, k = 0, accumulator
            if(typeof fun != 'function') throw new TypeError()
            if(len == 0 && arguments.length == 1) throw new TypeError()

            if(arguments.length >= 2)
                accumulator = arguments[1]
            else
                do{
                    if(k in t){
                        accumulator = t[k++]
                        break
                    }
                    if(++k >= len) throw new TypeError()
                } while (true)

            while (k < len){
                if(k in t) accumulator = fun.call(undefined, accumulator, t[k], k, t)
                k++
            }
            return accumulator
        }

})()

var Zepto = (function() {
    var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter,
        document = window.document,
        elementDisplay = {}, classCache = {},
        getComputedStyle = document.defaultView.getComputedStyle,
        cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
        fragmentRE = /^\s*<(\w+|!)[^>]*>/,
        tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        rootNodeRE = /^(?:body|html)$/i,

    // special attributes that should be get/set via method calls
        methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

        adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
        table = document.createElement('table'),
        tableRow = document.createElement('tr'),
        containers = {
            'tr': document.createElement('tbody'),
            'tbody': table, 'thead': table, 'tfoot': table,
            'td': tableRow, 'th': tableRow,
            '*': document.createElement('div')
        },
        readyRE = /complete|loaded|interactive/,
        classSelectorRE = /^\.([\w-]+)$/,
        idSelectorRE = /^#([\w-]*)$/,
        tagSelectorRE = /^[\w-]+$/,
        class2type = {},
        toString = class2type.toString,
        zepto = {},
        camelize, uniq,
        tempParent = document.createElement('div')

    zepto.matches = function(element, selector) {
        if (!element || element.nodeType !== 1) return false
        var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
            element.oMatchesSelector || element.matchesSelector
        if (matchesSelector) return matchesSelector.call(element, selector)
        // fall back to performing a selector:
        var match, parent = element.parentNode, temp = !parent
        if (temp) (parent = tempParent).appendChild(element)
        match = ~zepto.qsa(parent, selector).indexOf(element)
        temp && tempParent.removeChild(element)
        return match
    }

    function type(obj) {
        return obj == null ? String(obj) :
            class2type[toString.call(obj)] || "object"
    }

    function isFunction(value) { return type(value) == "function" }
    function isWindow(obj)     { return obj != null && obj == obj.window }
    function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
    function isObject(obj)     { return type(obj) == "object" }
    function isPlainObject(obj) {
        return isObject(obj) && !isWindow(obj) && obj.__proto__ == Object.prototype
    }
    function isArray(value) { return value instanceof Array }
    function likeArray(obj) { return typeof obj.length == 'number' }

    function compact(array) { return filter.call(array, function(item){ return item != null }) }
    function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
    camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
    function dasherize(str) {
        return str.replace(/::/g, '/')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
            .replace(/([a-z\d])([A-Z])/g, '$1_$2')
            .replace(/_/g, '-')
            .toLowerCase()
    }
    uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }

    function classRE(name) {
        return name in classCache ?
            classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
    }

    function maybeAddPx(name, value) {
        return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
    }

    function defaultDisplay(nodeName) {
        var element, display
        if (!elementDisplay[nodeName]) {
            element = document.createElement(nodeName)
            document.body.appendChild(element)
            display = getComputedStyle(element, '').getPropertyValue("display")
            element.parentNode.removeChild(element)
            display == "none" && (display = "block")
            elementDisplay[nodeName] = display
        }
        return elementDisplay[nodeName]
    }

    function children(element) {
        return 'children' in element ?
            slice.call(element.children) :
            $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
    }

    // `$.zepto.fragment` takes a html string and an optional tag name
    // to generate DOM nodes nodes from the given html string.
    // The generated DOM nodes are returned as an array.
    // This function can be overriden in plugins for example to make
    // it compatible with browsers that don't support the DOM fully.
    zepto.fragment = function(html, name, properties) {
        if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
        if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
        if (!(name in containers)) name = '*'

        var nodes, dom, container = containers[name]
        container.innerHTML = '' + html
        dom = $.each(slice.call(container.childNodes), function(){
            container.removeChild(this)
        })
        if (isPlainObject(properties)) {
            nodes = $(dom)
            $.each(properties, function(key, value) {
                if (methodAttributes.indexOf(key) > -1) nodes[key](value)
                else nodes.attr(key, value)
            })
        }
        return dom
    }

    // `$.zepto.Z` swaps out the prototype of the given `dom` array
    // of nodes with `$.fn` and thus supplying all the Zepto functions
    // to the array. Note that `__proto__` is not supported on Internet
    // Explorer. This method can be overriden in plugins.
    zepto.Z = function(dom, selector) {
        dom = dom || []
        dom.__proto__ = $.fn
        dom.selector = selector || ''
        return dom
    }

    // `$.zepto.isZ` should return `true` if the given object is a Zepto
    // collection. This method can be overriden in plugins.
    zepto.isZ = function(object) {
        return object instanceof zepto.Z
    }

    // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
    // takes a CSS selector and an optional context (and handles various
    // special cases).
    // This method can be overriden in plugins.
    zepto.init = function(selector, context) {
        // If nothing given, return an empty Zepto collection
        if (!selector) return zepto.Z()
        // If a function is given, call it when the DOM is ready
        else if (isFunction(selector)) return $(document).ready(selector)
        // If a Zepto collection is given, juts return it
        else if (zepto.isZ(selector)) return selector
        else {
            var dom
            // normalize array if an array of nodes is given
            if (isArray(selector)) dom = compact(selector)
            // Wrap DOM nodes. If a plain object is given, duplicate it.
            else if (isObject(selector))
                dom = [isPlainObject(selector) ? $.extend({}, selector) : selector], selector = null
            // If it's a html fragment, create nodes from it
            else if (fragmentRE.test(selector))
                dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
            // If there's a context, create a collection on that context first, and select
            // nodes from there
            else if (context !== undefined) return $(context).find(selector)
            // And last but no least, if it's a CSS selector, use it to select nodes.
            else dom = zepto.qsa(document, selector)
            // create a new Zepto collection from the nodes found
            return zepto.Z(dom, selector)
        }
    }

    // `$` will be the base `Zepto` object. When calling this
    // function just call `$.zepto.init, which makes the implementation
    // details of selecting nodes and creating Zepto collections
    // patchable in plugins.
    $ = function(selector, context){
        return zepto.init(selector, context)
    }

    function extend(target, source, deep) {
        for (key in source)
            if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
                if (isPlainObject(source[key]) && !isPlainObject(target[key]))
                    target[key] = {}
                if (isArray(source[key]) && !isArray(target[key]))
                    target[key] = []
                extend(target[key], source[key], deep)
            }
            else if (source[key] !== undefined) target[key] = source[key]
    }

    // Copy all but undefined properties from one or more
    // objects to the `target` object.
    $.extend = function(target){
        var deep, args = slice.call(arguments, 1)
        if (typeof target == 'boolean') {
            deep = target
            target = args.shift()
        }
        args.forEach(function(arg){ extend(target, arg, deep) })
        return target
    }

    // `$.zepto.qsa` is Zepto's CSS selector implementation which
    // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
    // This method can be overriden in plugins.
    zepto.qsa = function(element, selector){
        var found
        return (isDocument(element) && idSelectorRE.test(selector)) ?
            ( (found = element.getElementById(RegExp.$1)) ? [found] : [] ) :
            (element.nodeType !== 1 && element.nodeType !== 9) ? [] :
                slice.call(
                    classSelectorRE.test(selector) ? element.getElementsByClassName(RegExp.$1) :
                        tagSelectorRE.test(selector) ? element.getElementsByTagName(selector) :
                            element.querySelectorAll(selector)
                )
    }

    function filtered(nodes, selector) {
        return selector === undefined ? $(nodes) : $(nodes).filter(selector)
    }

    $.contains = function(parent, node) {
        return parent !== node && parent.contains(node)
    }

    function funcArg(context, arg, idx, payload) {
        return isFunction(arg) ? arg.call(context, idx, payload) : arg
    }

    function setAttribute(node, name, value) {
        value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
    }

    // access className property while respecting SVGAnimatedString
    function className(node, value){
        var klass = node.className,
            svg   = klass && klass.baseVal !== undefined

        if (value === undefined) return svg ? klass.baseVal : klass
        svg ? (klass.baseVal = value) : (node.className = value)
    }

    // "true"  => true
    // "false" => false
    // "null"  => null
    // "42"    => 42
    // "42.5"  => 42.5
    // JSON    => parse if valid
    // String  => self
    function deserializeValue(value) {
        var num
        try {
            return value ?
                value == "true" ||
                    ( value == "false" ? false :
                        value == "null" ? null :
                            !isNaN(num = Number(value)) ? num :
                                /^[\[\{]/.test(value) ? $.parseJSON(value) :
                                    value )
                : value
        } catch(e) {
            return value
        }
    }

    $.type = type
    $.isFunction = isFunction
    $.isWindow = isWindow
    $.isArray = isArray
    $.isPlainObject = isPlainObject

    $.isEmptyObject = function(obj) {
        var name
        for (name in obj) return false
        return true
    }

    $.inArray = function(elem, array, i){
        return emptyArray.indexOf.call(array, elem, i)
    }

    $.camelCase = camelize
    $.trim = function(str) { return str.trim() }

    // plugin compatibility
    $.uuid = 0
    $.support = { }
    $.expr = { }

    $.map = function(elements, callback){
        var value, values = [], i, key
        if (likeArray(elements))
            for (i = 0; i < elements.length; i++) {
                value = callback(elements[i], i)
                if (value != null) values.push(value)
            }
        else
            for (key in elements) {
                value = callback(elements[key], key)
                if (value != null) values.push(value)
            }
        return flatten(values)
    }

    $.each = function(elements, callback){
        var i, key
        if (likeArray(elements)) {
            for (i = 0; i < elements.length; i++)
                if (callback.call(elements[i], i, elements[i]) === false) return elements
        } else {
            for (key in elements)
                if (callback.call(elements[key], key, elements[key]) === false) return elements
        }

        return elements
    }

    $.grep = function(elements, callback){
        return filter.call(elements, callback)
    }

    if (window.JSON) $.parseJSON = JSON.parse

    // Populate the class2type map
    $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
        class2type[ "[object " + name + "]" ] = name.toLowerCase()
    })

    // Define methods that will be available on all
    // Zepto collections
    $.fn = {
        // Because a collection acts like an array
        // copy over these useful array functions.
        forEach: emptyArray.forEach,
        reduce: emptyArray.reduce,
        push: emptyArray.push,
        sort: emptyArray.sort,
        indexOf: emptyArray.indexOf,
        concat: emptyArray.concat,

        // `map` and `slice` in the jQuery API work differently
        // from their array counterparts
        map: function(fn){
            return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
        },
        slice: function(){
            return $(slice.apply(this, arguments))
        },

        ready: function(callback){
            if (readyRE.test(document.readyState)) callback($)
            else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
            return this
        },
        get: function(idx){
            return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
        },
        toArray: function(){ return this.get() },
        size: function(){
            return this.length
        },
        remove: function(){
            return this.each(function(){
                if (this.parentNode != null)
                    this.parentNode.removeChild(this)
            })
        },
        each: function(callback){
            emptyArray.every.call(this, function(el, idx){
                return callback.call(el, idx, el) !== false
            })
            return this
        },
        filter: function(selector){
            if (isFunction(selector)) return this.not(this.not(selector))
            return $(filter.call(this, function(element){
                return zepto.matches(element, selector)
            }))
        },
        add: function(selector,context){
            return $(uniq(this.concat($(selector,context))))
        },
        is: function(selector){
            return this.length > 0 && zepto.matches(this[0], selector)
        },
        not: function(selector){
            var nodes=[]
            if (isFunction(selector) && selector.call !== undefined)
                this.each(function(idx){
                    if (!selector.call(this,idx)) nodes.push(this)
                })
            else {
                var excludes = typeof selector == 'string' ? this.filter(selector) :
                    (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
                this.forEach(function(el){
                    if (excludes.indexOf(el) < 0) nodes.push(el)
                })
            }
            return $(nodes)
        },
        has: function(selector){
            return this.filter(function(){
                return isObject(selector) ?
                    $.contains(this, selector) :
                    $(this).find(selector).size()
            })
        },
        eq: function(idx){
            return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
        },
        first: function(){
            var el = this[0]
            return el && !isObject(el) ? el : $(el)
        },
        last: function(){
            var el = this[this.length - 1]
            return el && !isObject(el) ? el : $(el)
        },
        find: function(selector){
            var result, $this = this
            if (typeof selector == 'object')
                result = $(selector).filter(function(){
                    var node = this
                    return emptyArray.some.call($this, function(parent){
                        return $.contains(parent, node)
                    })
                })
            else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
            else result = this.map(function(){ return zepto.qsa(this, selector) })
            return result
        },
        closest: function(selector, context){
            var node = this[0], collection = false
            if (typeof selector == 'object') collection = $(selector)
            while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
                node = node !== context && !isDocument(node) && node.parentNode
            return $(node)
        },
        parents: function(selector){
            var ancestors = [], nodes = this
            while (nodes.length > 0)
                nodes = $.map(nodes, function(node){
                    if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
                        ancestors.push(node)
                        return node
                    }
                })
            return filtered(ancestors, selector)
        },
        parent: function(selector){
            return filtered(uniq(this.pluck('parentNode')), selector)
        },
        children: function(selector){
            return filtered(this.map(function(){ return children(this) }), selector)
        },
        contents: function() {
            return this.map(function() { return slice.call(this.childNodes) })
        },
        siblings: function(selector){
            return filtered(this.map(function(i, el){
                return filter.call(children(el.parentNode), function(child){ return child!==el })
            }), selector)
        },
        empty: function(){
            return this.each(function(){ this.innerHTML = '' })
        },
        // `pluck` is borrowed from Prototype.js
        pluck: function(property){
            return $.map(this, function(el){ return el[property] })
        },
        show: function(){
            return this.each(function(){
                this.style.display == "none" && (this.style.display = null)
                if (getComputedStyle(this, '').getPropertyValue("display") == "none")
                    this.style.display = defaultDisplay(this.nodeName)
            })
        },
        replaceWith: function(newContent){
            return this.before(newContent).remove()
        },
        wrap: function(structure){
            var func = isFunction(structure)
            if (this[0] && !func)
                var dom   = $(structure).get(0),
                    clone = dom.parentNode || this.length > 1

            return this.each(function(index){
                $(this).wrapAll(
                    func ? structure.call(this, index) :
                        clone ? dom.cloneNode(true) : dom
                )
            })
        },
        wrapAll: function(structure){
            if (this[0]) {
                $(this[0]).before(structure = $(structure))
                var children
                // drill down to the inmost element
                while ((children = structure.children()).length) structure = children.first()
                $(structure).append(this)
            }
            return this
        },
        wrapInner: function(structure){
            var func = isFunction(structure)
            return this.each(function(index){
                var self = $(this), contents = self.contents(),
                    dom  = func ? structure.call(this, index) : structure
                contents.length ? contents.wrapAll(dom) : self.append(dom)
            })
        },
        unwrap: function(){
            this.parent().each(function(){
                $(this).replaceWith($(this).children())
            })
            return this
        },
        clone: function(){
            return this.map(function(){ return this.cloneNode(true) })
        },
        hide: function(){
            return this.css("display", "none")
        },
        toggle: function(setting){
            return this.each(function(){
                var el = $(this)
                    ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
            })
        },
        prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
        next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
        html: function(html){
            return html === undefined ?
                (this.length > 0 ? this[0].innerHTML : null) :
                this.each(function(idx){
                    var originHtml = this.innerHTML
                    $(this).empty().append( funcArg(this, html, idx, originHtml) )
                })
        },
        text: function(text){
            return text === undefined ?
                (this.length > 0 ? this[0].textContent : null) :
                this.each(function(){ this.textContent = text })
        },
        attr: function(name, value){
            var result
            return (typeof name == 'string' && value === undefined) ?
                (this.length == 0 || this[0].nodeType !== 1 ? undefined :
                    (name == 'value' && this[0].nodeName == 'INPUT') ? this.val() :
                        (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
                    ) :
                this.each(function(idx){
                    if (this.nodeType !== 1) return
                    if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
                    else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
                })
        },
        removeAttr: function(name){
            return this.each(function(){ this.nodeType === 1 && setAttribute(this, name) })
        },
        prop: function(name, value){
            return (value === undefined) ?
                (this[0] && this[0][name]) :
                this.each(function(idx){
                    this[name] = funcArg(this, value, idx, this[name])
                })
        },
        data: function(name, value){
            var data = this.attr('data-' + dasherize(name), value)
            return data !== null ? deserializeValue(data) : undefined
        },
        val: function(value){
            return (value === undefined) ?
                (this[0] && (this[0].multiple ?
                    $(this[0]).find('option').filter(function(o){ return this.selected }).pluck('value') :
                    this[0].value)
                    ) :
                this.each(function(idx){
                    this.value = funcArg(this, value, idx, this.value)
                })
        },
        offset: function(coordinates){
            if (coordinates) return this.each(function(index){
                var $this = $(this),
                    coords = funcArg(this, coordinates, index, $this.offset()),
                    parentOffset = $this.offsetParent().offset(),
                    props = {
                        top:  coords.top  - parentOffset.top,
                        left: coords.left - parentOffset.left
                    }

                if ($this.css('position') == 'static') props['position'] = 'relative'
                $this.css(props)
            })
            if (this.length==0) return null
            var obj = this[0].getBoundingClientRect()
            return {
                left: obj.left + window.pageXOffset,
                top: obj.top + window.pageYOffset,
                width: Math.round(obj.width),
                height: Math.round(obj.height)
            }
        },
        css: function(property, value){
            if (arguments.length < 2 && typeof property == 'string')
                return this[0] && (this[0].style[camelize(property)] || getComputedStyle(this[0], '').getPropertyValue(property))

            var css = ''
            if (type(property) == 'string') {
                if (!value && value !== 0)
                    this.each(function(){ this.style.removeProperty(dasherize(property)) })
                else
                    css = dasherize(property) + ":" + maybeAddPx(property, value)
            } else {
                for (key in property)
                    if (!property[key] && property[key] !== 0)
                        this.each(function(){ this.style.removeProperty(dasherize(key)) })
                    else
                        css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
            }

            return this.each(function(){ this.style.cssText += ';' + css })
        },
        index: function(element){
            return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
        },
        hasClass: function(name){
            return emptyArray.some.call(this, function(el){
                return this.test(className(el))
            }, classRE(name))
        },
        addClass: function(name){
            return this.each(function(idx){
                classList = []
                var cls = className(this), newName = funcArg(this, name, idx, cls)
                newName.split(/\s+/g).forEach(function(klass){
                    if (!$(this).hasClass(klass)) classList.push(klass)
                }, this)
                classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
            })
        },
        removeClass: function(name){
            return this.each(function(idx){
                if (name === undefined) return className(this, '')
                classList = className(this)
                funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
                    classList = classList.replace(classRE(klass), " ")
                })
                className(this, classList.trim())
            })
        },
        toggleClass: function(name, when){
            return this.each(function(idx){
                var $this = $(this), names = funcArg(this, name, idx, className(this))
                names.split(/\s+/g).forEach(function(klass){
                    (when === undefined ? !$this.hasClass(klass) : when) ?
                        $this.addClass(klass) : $this.removeClass(klass)
                })
            })
        },
        scrollTop: function(){
            if (!this.length) return
            return ('scrollTop' in this[0]) ? this[0].scrollTop : this[0].scrollY
        },
        position: function() {
            if (!this.length) return

            var elem = this[0],
            // Get *real* offsetParent
                offsetParent = this.offsetParent(),
            // Get correct offsets
                offset       = this.offset(),
                parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

            // Subtract element margins
            // note: when an element has margin: auto the offsetLeft and marginLeft
            // are the same in Safari causing offset.left to incorrectly be 0
            offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
            offset.left -= parseFloat( $(elem).css('margin-left') ) || 0

            // Add offsetParent borders
            parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
            parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0

            // Subtract the two offsets
            return {
                top:  offset.top  - parentOffset.top,
                left: offset.left - parentOffset.left
            }
        },
        offsetParent: function() {
            return this.map(function(){
                var parent = this.offsetParent || document.body
                while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
                    parent = parent.offsetParent
                return parent
            })
        }
    }

    // for now
    $.fn.detach = $.fn.remove

        // Generate the `width` and `height` functions
    ;['width', 'height'].forEach(function(dimension){
        $.fn[dimension] = function(value){
            var offset, el = this[0],
                Dimension = dimension.replace(/./, function(m){ return m[0].toUpperCase() })
            if (value === undefined) return isWindow(el) ? el['inner' + Dimension] :
                isDocument(el) ? el.documentElement['offset' + Dimension] :
                    (offset = this.offset()) && offset[dimension]
            else return this.each(function(idx){
                el = $(this)
                el.css(dimension, funcArg(this, value, idx, el[dimension]()))
            })
        }
    })

    function traverseNode(node, fun) {
        fun(node)
        for (var key in node.childNodes) traverseNode(node.childNodes[key], fun)
    }

    // Generate the `after`, `prepend`, `before`, `append`,
    // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
    adjacencyOperators.forEach(function(operator, operatorIndex) {
        var inside = operatorIndex % 2 //=> prepend, append

        $.fn[operator] = function(){
            // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
            var argType, nodes = $.map(arguments, function(arg) {
                    argType = type(arg)
                    return argType == "object" || argType == "array" || arg == null ?
                        arg : zepto.fragment(arg)
                }),
                parent, copyByClone = this.length > 1
            if (nodes.length < 1) return this

            return this.each(function(_, target){
                parent = inside ? target : target.parentNode

                // convert all methods to a "before" operation
                target = operatorIndex == 0 ? target.nextSibling :
                    operatorIndex == 1 ? target.firstChild :
                        operatorIndex == 2 ? target :
                            null

                nodes.forEach(function(node){
                    if (copyByClone) node = node.cloneNode(true)
                    else if (!parent) return $(node).remove()

                    traverseNode(parent.insertBefore(node, target), function(el){
                        if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
                            (!el.type || el.type === 'text/javascript') && !el.src)
                            window['eval'].call(window, el.innerHTML)
                    })
                })
            })
        }

        // after    => insertAfter
        // prepend  => prependTo
        // before   => insertBefore
        // append   => appendTo
        $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
            $(html)[operator](this)
            return this
        }
    })

    zepto.Z.prototype = $.fn

    // Export internal API functions in the `$.zepto` namespace
    zepto.uniq = uniq
    zepto.deserializeValue = deserializeValue
    $.zepto = zepto

    return $
})()

window.Zepto = Zepto
'$' in window || (window.$ = Zepto)

;(function($){
    function detect(ua){
        var os = this.os = {}, browser = this.browser = {},
            webkit = ua.match(/WebKit\/([\d.]+)/),
            android = ua.match(/(Android)\s+([\d.]+)/),
            ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
            iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
            webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
            touchpad = webos && ua.match(/TouchPad/),
            kindle = ua.match(/Kindle\/([\d.]+)/),
            silk = ua.match(/Silk\/([\d._]+)/),
            blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
            bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
            rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
            playbook = ua.match(/PlayBook/),
            chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
            firefox = ua.match(/Firefox\/([\d.]+)/)

        // Todo: clean this up with a better OS/browser seperation:
        // - discern (more) between multiple browsers on android
        // - decide if kindle fire in silk mode is android or not
        // - Firefox on Android doesn't specify the Android version
        // - possibly devide in os, device and browser hashes

        if (browser.webkit = !!webkit) browser.version = webkit[1]

        if (android) os.android = true, os.version = android[2]
        if (iphone) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
        if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
        if (webos) os.webos = true, os.version = webos[2]
        if (touchpad) os.touchpad = true
        if (blackberry) os.blackberry = true, os.version = blackberry[2]
        if (bb10) os.bb10 = true, os.version = bb10[2]
        if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
        if (playbook) browser.playbook = true
        if (kindle) os.kindle = true, os.version = kindle[1]
        if (silk) browser.silk = true, browser.version = silk[1]
        if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
        if (chrome) browser.chrome = true, browser.version = chrome[1]
        if (firefox) browser.firefox = true, browser.version = firefox[1]

        os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) || (firefox && ua.match(/Tablet/)))
        os.phone  = !!(!os.tablet && (android || iphone || webos || blackberry || bb10 ||
            (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) || (firefox && ua.match(/Mobile/))))
    }

    detect.call($, navigator.userAgent)
    // make available to unit tests
    $.__detect = detect

})(Zepto)

;(function($){
    var $$ = $.zepto.qsa, handlers = {}, _zid = 1, specialEvents={},
        hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

    specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

    function zid(element) {
        return element._zid || (element._zid = _zid++)
    }
    function findHandlers(element, event, fn, selector) {
        event = parse(event)
        if (event.ns) var matcher = matcherFor(event.ns)
        return (handlers[zid(element)] || []).filter(function(handler) {
            return handler
                && (!event.e  || handler.e == event.e)
                && (!event.ns || matcher.test(handler.ns))
                && (!fn       || zid(handler.fn) === zid(fn))
                && (!selector || handler.sel == selector)
        })
    }
    function parse(event) {
        var parts = ('' + event).split('.')
        return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
    }
    function matcherFor(ns) {
        return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
    }

    function eachEvent(events, fn, iterator){
        if ($.type(events) != "string") $.each(events, iterator)
        else events.split(/\s/).forEach(function(type){ iterator(type, fn) })
    }

    function eventCapture(handler, captureSetting) {
        return handler.del &&
            (handler.e == 'focus' || handler.e == 'blur') ||
            !!captureSetting
    }

    function realEvent(type) {
        return hover[type] || type
    }

    function add(element, events, fn, selector, getDelegate, capture){
        var id = zid(element), set = (handlers[id] || (handlers[id] = []))
        eachEvent(events, fn, function(event, fn){
            var handler   = parse(event)
            handler.fn    = fn
            handler.sel   = selector
            // emulate mouseenter, mouseleave
            if (handler.e in hover) fn = function(e){
                var related = e.relatedTarget
                if (!related || (related !== this && !$.contains(this, related)))
                    return handler.fn.apply(this, arguments)
            }
            handler.del   = getDelegate && getDelegate(fn, event)
            var callback  = handler.del || fn
            handler.proxy = function (e) {
                var result = callback.apply(element, [e].concat(e.data))
                if (result === false) e.preventDefault(), e.stopPropagation()
                return result
            }
            handler.i = set.length
            set.push(handler)
            element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
        })
    }
    function remove(element, events, fn, selector, capture){
        var id = zid(element)
        eachEvent(events || '', fn, function(event, fn){
            findHandlers(element, event, fn, selector).forEach(function(handler){
                delete handlers[id][handler.i]
                element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
            })
        })
    }

    $.event = { add: add, remove: remove }

    $.proxy = function(fn, context) {
        if ($.isFunction(fn)) {
            var proxyFn = function(){ return fn.apply(context, arguments) }
            proxyFn._zid = zid(fn)
            return proxyFn
        } else if (typeof context == 'string') {
            return $.proxy(fn[context], fn)
        } else {
            throw new TypeError("expected function")
        }
    }

    $.fn.bind = function(event, callback){
        return this.each(function(){
            add(this, event, callback)
        })
    }
    $.fn.unbind = function(event, callback){
        return this.each(function(){
            remove(this, event, callback)
        })
    }
    $.fn.one = function(event, callback){
        return this.each(function(i, element){
            add(this, event, callback, null, function(fn, type){
                return function(){
                    var result = fn.apply(element, arguments)
                    remove(element, type, fn)
                    return result
                }
            })
        })
    }

    var returnTrue = function(){return true},
        returnFalse = function(){return false},
        ignoreProperties = /^([A-Z]|layer[XY]$)/,
        eventMethods = {
            preventDefault: 'isDefaultPrevented',
            stopImmediatePropagation: 'isImmediatePropagationStopped',
            stopPropagation: 'isPropagationStopped'
        }
    function createProxy(event) {
        var key, proxy = { originalEvent: event }
        for (key in event)
            if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

        $.each(eventMethods, function(name, predicate) {
            proxy[name] = function(){
                this[predicate] = returnTrue
                return event[name].apply(event, arguments)
            }
            proxy[predicate] = returnFalse
        })
        return proxy
    }

    // emulates the 'defaultPrevented' property for browsers that have none
    function fix(event) {
        if (!('defaultPrevented' in event)) {
            event.defaultPrevented = false
            var prevent = event.preventDefault
            event.preventDefault = function() {
                this.defaultPrevented = true
                prevent.call(this)
            }
        }
    }

    $.fn.delegate = function(selector, event, callback){
        return this.each(function(i, element){
            add(element, event, callback, selector, function(fn){
                return function(e){
                    var evt, match = $(e.target).closest(selector, element).get(0)
                    if (match) {
                        evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
                        return fn.apply(match, [evt].concat([].slice.call(arguments, 1)))
                    }
                }
            })
        })
    }
    $.fn.undelegate = function(selector, event, callback){
        return this.each(function(){
            remove(this, event, callback, selector)
        })
    }

    $.fn.live = function(event, callback){
        $(document.body).delegate(this.selector, event, callback)
        return this
    }
    $.fn.die = function(event, callback){
        $(document.body).undelegate(this.selector, event, callback)
        return this
    }

    $.fn.on = function(event, selector, callback){
        return !selector || $.isFunction(selector) ?
            this.bind(event, selector || callback) : this.delegate(selector, event, callback)
    }
    $.fn.off = function(event, selector, callback){
        return !selector || $.isFunction(selector) ?
            this.unbind(event, selector || callback) : this.undelegate(selector, event, callback)
    }

    $.fn.trigger = function(event, data){
        if (typeof event == 'string' || $.isPlainObject(event)) event = $.Event(event)
        fix(event)
        event.data = data
        return this.each(function(){
            // items in the collection might not be DOM elements
            // (todo: possibly support events on plain old objects)
            if('dispatchEvent' in this) this.dispatchEvent(event)
        })
    }

    // triggers event handlers on current element just as if an event occurred,
    // doesn't trigger an actual event, doesn't bubble
    $.fn.triggerHandler = function(event, data){
        var e, result
        this.each(function(i, element){
            e = createProxy(typeof event == 'string' ? $.Event(event) : event)
            e.data = data
            e.target = element
            $.each(findHandlers(element, event.type || event), function(i, handler){
                result = handler.proxy(e)
                if (e.isImmediatePropagationStopped()) return false
            })
        })
        return result
    }

        // shortcut methods for `.bind(event, fn)` for each event type
    ;('focusin focusout load resize scroll unload click dblclick '+
        'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
        'change select keydown keypress keyup error').split(' ').forEach(function(event) {
            $.fn[event] = function(callback) {
                return callback ?
                    this.bind(event, callback) :
                    this.trigger(event)
            }
        })

    ;['focus', 'blur'].forEach(function(name) {
        $.fn[name] = function(callback) {
            if (callback) this.bind(name, callback)
            else this.each(function(){
                try { this[name]() }
                catch(e) {}
            })
            return this
        }
    })

    $.Event = function(type, props) {
        if (typeof type != 'string') props = type, type = props.type
        var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
        if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
        event.initEvent(type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null)
        event.isDefaultPrevented = function(){ return this.defaultPrevented }
        return event
    }

})(Zepto)

;(function($){
    var jsonpID = 0,
        document = window.document,
        key,
        name,
        rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        scriptTypeRE = /^(?:text|application)\/javascript/i,
        xmlTypeRE = /^(?:text|application)\/xml/i,
        jsonType = 'application/json',
        htmlType = 'text/html',
        blankRE = /^\s*$/

    // trigger a custom event and return false if it was cancelled
    function triggerAndReturn(context, eventName, data) {
        var event = $.Event(eventName)
        $(context).trigger(event, data)
        return !event.defaultPrevented
    }

    // trigger an Ajax "global" event
    function triggerGlobal(settings, context, eventName, data) {
        if (settings.global) return triggerAndReturn(context || document, eventName, data)
    }

    // Number of active Ajax requests
    $.active = 0

    function ajaxStart(settings) {
        if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
    }
    function ajaxStop(settings) {
        if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
    }

    // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
    function ajaxBeforeSend(xhr, settings) {
        var context = settings.context
        if (settings.beforeSend.call(context, xhr, settings) === false ||
            triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
            return false

        triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
    }
    function ajaxSuccess(data, xhr, settings) {
        var context = settings.context, status = 'success'
        settings.success.call(context, data, status, xhr)
        triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
        ajaxComplete(status, xhr, settings)
    }
    // type: "timeout", "error", "abort", "parsererror"
    function ajaxError(error, type, xhr, settings) {
        var context = settings.context
        settings.error.call(context, xhr, type, error)
        triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error])
        ajaxComplete(type, xhr, settings)
    }
    // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
    function ajaxComplete(status, xhr, settings) {
        var context = settings.context
        settings.complete.call(context, xhr, status)
        triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
        ajaxStop(settings)
    }

    // Empty function, used as default callback
    function empty() {}

    $.ajaxJSONP = function(options){
        if (!('type' in options)) return $.ajax(options)

        var callbackName = 'jsonp' + (++jsonpID),
            script = document.createElement('script'),
            cleanup = function() {
                clearTimeout(abortTimeout)
                $(script).remove()
                delete window[callbackName]
            },
            abort = function(type){
                cleanup()
                // In case of manual abort or timeout, keep an empty function as callback
                // so that the SCRIPT tag that eventually loads won't result in an error.
                if (!type || type == 'timeout') window[callbackName] = empty
                ajaxError(null, type || 'abort', xhr, options)
            },
            xhr = { abort: abort }, abortTimeout

        if (ajaxBeforeSend(xhr, options) === false) {
            abort('abort')
            return false
        }

        window[callbackName] = function(data){
            cleanup()
            ajaxSuccess(data, xhr, options)
        }

        script.onerror = function() { abort('error') }

        script.src = options.url.replace(/=\?/, '=' + callbackName)
        $('head').append(script)

        if (options.timeout > 0) abortTimeout = setTimeout(function(){
            abort('timeout')
        }, options.timeout)

        return xhr
    }

    $.ajaxSettings = {
        // Default type of request
        type: 'GET',
        // Callback that is executed before request
        beforeSend: empty,
        // Callback that is executed if the request succeeds
        success: empty,
        // Callback that is executed the the server drops error
        error: empty,
        // Callback that is executed on request complete (both: error and success)
        complete: empty,
        // The context for the callbacks
        context: null,
        // Whether to trigger "global" Ajax events
        global: true,
        // Transport
        xhr: function () {
            return new window.XMLHttpRequest()
        },
        // MIME types mapping
        accepts: {
            script: 'text/javascript, application/javascript',
            json:   jsonType,
            xml:    'application/xml, text/xml',
            html:   htmlType,
            text:   'text/plain'
        },
        // Whether the request is to another domain
        crossDomain: false,
        // Default timeout
        timeout: 0,
        // Whether data should be serialized to string
        processData: true,
        // Whether the browser should be allowed to cache GET responses
        cache: true,
    }

    function mimeToDataType(mime) {
        if (mime) mime = mime.split(';', 2)[0]
        return mime && ( mime == htmlType ? 'html' :
            mime == jsonType ? 'json' :
                scriptTypeRE.test(mime) ? 'script' :
                    xmlTypeRE.test(mime) && 'xml' ) || 'text'
    }

    function appendQuery(url, query) {
        return (url + '&' + query).replace(/[&?]{1,2}/, '?')
    }

    // serialize payload and append it to the URL for GET requests
    function serializeData(options) {
        if (options.processData && options.data && $.type(options.data) != "string")
            options.data = $.param(options.data, options.traditional)
        if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
            options.url = appendQuery(options.url, options.data)
    }

    $.ajax = function(options){
        var settings = $.extend({}, options || {})
        for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

        ajaxStart(settings)

        if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
            RegExp.$2 != window.location.host

        if (!settings.url) settings.url = window.location.toString()
        serializeData(settings)
        if (settings.cache === false) settings.url = appendQuery(settings.url, '_=' + Date.now())

        var dataType = settings.dataType, hasPlaceholder = /=\?/.test(settings.url)
        if (dataType == 'jsonp' || hasPlaceholder) {
            if (!hasPlaceholder) settings.url = appendQuery(settings.url, 'callback=?')
            return $.ajaxJSONP(settings)
        }

        var mime = settings.accepts[dataType],
            baseHeaders = { },
            protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
            xhr = settings.xhr(), abortTimeout

        if (!settings.crossDomain) baseHeaders['X-Requested-With'] = 'XMLHttpRequest'
        if (mime) {
            baseHeaders['Accept'] = mime
            if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
            xhr.overrideMimeType && xhr.overrideMimeType(mime)
        }
        if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
            baseHeaders['Content-Type'] = (settings.contentType || 'application/x-www-form-urlencoded')
        settings.headers = $.extend(baseHeaders, settings.headers || {})

        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4) {
                xhr.onreadystatechange = empty;
                clearTimeout(abortTimeout)
                var result, error = false
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
                    dataType = dataType || mimeToDataType(xhr.getResponseHeader('content-type'))
                    result = xhr.responseText

                    try {
                        // http://perfectionkills.com/global-eval-what-are-the-options/
                        if (dataType == 'script')    (1,eval)(result)
                        else if (dataType == 'xml')  result = xhr.responseXML
                        else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
                    } catch (e) { error = e }

                    if (error) ajaxError(error, 'parsererror', xhr, settings)
                    else ajaxSuccess(result, xhr, settings)
                } else {
                    ajaxError(null, xhr.status ? 'error' : 'abort', xhr, settings)
                }
            }
        }

        var async = 'async' in settings ? settings.async : true
        xhr.open(settings.type, settings.url, async)

        for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name])

        if (ajaxBeforeSend(xhr, settings) === false) {
            xhr.abort()
            return false
        }

        if (settings.timeout > 0) abortTimeout = setTimeout(function(){
            xhr.onreadystatechange = empty
            xhr.abort()
            ajaxError(null, 'timeout', xhr, settings)
        }, settings.timeout)

        // avoid sending empty string (#319)
        xhr.send(settings.data ? settings.data : null)
        return xhr
    }

    // handle optional data/success arguments
    function parseArguments(url, data, success, dataType) {
        var hasData = !$.isFunction(data)
        return {
            url:      url,
            data:     hasData  ? data : undefined,
            success:  !hasData ? data : $.isFunction(success) ? success : undefined,
            dataType: hasData  ? dataType || success : success
        }
    }

    $.get = function(url, data, success, dataType){
        return $.ajax(parseArguments.apply(null, arguments))
    }

    $.post = function(url, data, success, dataType){
        var options = parseArguments.apply(null, arguments)
        options.type = 'POST'
        return $.ajax(options)
    }

    $.getJSON = function(url, data, success){
        var options = parseArguments.apply(null, arguments)
        options.dataType = 'json'
        return $.ajax(options)
    }

    $.fn.load = function(url, data, success){
        if (!this.length) return this
        var self = this, parts = url.split(/\s/), selector,
            options = parseArguments(url, data, success),
            callback = options.success
        if (parts.length > 1) options.url = parts[0], selector = parts[1]
        options.success = function(response){
            self.html(selector ?
                $('<div>').html(response.replace(rscript, "")).find(selector)
                : response)
            callback && callback.apply(self, arguments)
        }
        $.ajax(options)
        return this
    }

    var escape = encodeURIComponent

    function serialize(params, obj, traditional, scope){
        var type, array = $.isArray(obj)
        $.each(obj, function(key, value) {
            type = $.type(value)
            if (scope) key = traditional ? scope : scope + '[' + (array ? '' : key) + ']'
            // handle data in serializeArray() format
            if (!scope && array) params.add(value.name, value.value)
            // recurse into nested objects
            else if (type == "array" || (!traditional && type == "object"))
                serialize(params, value, traditional, key)
            else params.add(key, value)
        })
    }

    $.param = function(obj, traditional){
        var params = []
        params.add = function(k, v){ this.push(escape(k) + '=' + escape(v)) }
        serialize(params, obj, traditional)
        return params.join('&').replace(/%20/g, '+')
    }
})(Zepto)

;(function ($) {
    $.fn.serializeArray = function () {
        var result = [], el
        $( Array.prototype.slice.call(this.get(0).elements) ).each(function () {
            el = $(this)
            var type = el.attr('type')
            if (this.nodeName.toLowerCase() != 'fieldset' &&
                !this.disabled && type != 'submit' && type != 'reset' && type != 'button' &&
                ((type != 'radio' && type != 'checkbox') || this.checked))
                result.push({
                    name: el.attr('name'),
                    value: el.val()
                })
        })
        return result
    }

    $.fn.serialize = function () {
        var result = []
        this.serializeArray().forEach(function (elm) {
            result.push( encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value) )
        })
        return result.join('&')
    }

    $.fn.submit = function (callback) {
        if (callback) this.bind('submit', callback)
        else if (this.length) {
            var event = $.Event('submit')
            this.eq(0).trigger(event)
            if (!event.defaultPrevented) this.get(0).submit()
        }
        return this
    }

})(Zepto)

;(function($, undefined){
    var prefix = '', eventPrefix, endEventName, endAnimationName,
        vendors = { Webkit: 'webkit', Moz: '', O: 'o', ms: 'MS' },
        document = window.document, testEl = document.createElement('div'),
        supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
        transform,
        transitionProperty, transitionDuration, transitionTiming,
        animationName, animationDuration, animationTiming,
        cssReset = {}

    function dasherize(str) { return downcase(str.replace(/([a-z])([A-Z])/, '$1-$2')) }
    function downcase(str) { return str.toLowerCase() }
    function normalizeEvent(name) { return eventPrefix ? eventPrefix + name : downcase(name) }

    $.each(vendors, function(vendor, event){
        if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
            prefix = '-' + downcase(vendor) + '-'
            eventPrefix = event
            return false
        }
    })

    transform = prefix + 'transform'
    cssReset[transitionProperty = prefix + 'transition-property'] =
        cssReset[transitionDuration = prefix + 'transition-duration'] =
            cssReset[transitionTiming   = prefix + 'transition-timing-function'] =
                cssReset[animationName      = prefix + 'animation-name'] =
                    cssReset[animationDuration  = prefix + 'animation-duration'] =
                        cssReset[animationTiming    = prefix + 'animation-timing-function'] = ''

    $.fx = {
        off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
        speeds: { _default: 400, fast: 200, slow: 600 },
        cssPrefix: prefix,
        transitionEnd: normalizeEvent('TransitionEnd'),
        animationEnd: normalizeEvent('AnimationEnd')
    }

    $.fn.animate = function(properties, duration, ease, callback){
        if ($.isPlainObject(duration))
            ease = duration.easing, callback = duration.complete, duration = duration.duration
        if (duration) duration = (typeof duration == 'number' ? duration :
            ($.fx.speeds[duration] || $.fx.speeds._default)) / 1000
        return this.anim(properties, duration, ease, callback)
    }

    $.fn.anim = function(properties, duration, ease, callback){
        var key, cssValues = {}, cssProperties, transforms = '',
            that = this, wrappedCallback, endEvent = $.fx.transitionEnd

        if (duration === undefined) duration = 0.4
        if ($.fx.off) duration = 0

        if (typeof properties == 'string') {
            // keyframe animation
            cssValues[animationName] = properties
            cssValues[animationDuration] = duration + 's'
            cssValues[animationTiming] = (ease || 'linear')
            endEvent = $.fx.animationEnd
        } else {
            cssProperties = []
            // CSS transitions
            for (key in properties)
                if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') '
                else cssValues[key] = properties[key], cssProperties.push(dasherize(key))

            if (transforms) cssValues[transform] = transforms, cssProperties.push(transform)
            if (duration > 0 && typeof properties === 'object') {
                cssValues[transitionProperty] = cssProperties.join(', ')
                cssValues[transitionDuration] = duration + 's'
                cssValues[transitionTiming] = (ease || 'linear')
            }
        }

        wrappedCallback = function(event){
            if (typeof event !== 'undefined') {
                if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
                $(event.target).unbind(endEvent, wrappedCallback)
            }
            $(this).css(cssReset)
            callback && callback.call(this)
        }
        if (duration > 0) this.bind(endEvent, wrappedCallback)

        // trigger page reflow so new elements can animate
        this.size() && this.get(0).clientLeft

        this.css(cssValues)

        if (duration <= 0) setTimeout(function() {
            that.each(function(){ wrappedCallback.call(this) })
        }, 0)

        return this
    }

    testEl = null
})(Zepto)

//     Zepto.js
//     (c) 2010-2013 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($){
    var touch = {},
        touchTimeout, tapTimeout, swipeTimeout, longTapTimeout,
        longTapDelay = 750,
        gesture

    function swipeDirection(x1, x2, y1, y2) {
        return Math.abs(x1 - x2) >=
            Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
    }

    function longTap() {
        longTapTimeout = null
        if (touch.last) {
            touch.el.trigger('longTap')
            touch = {}
        }
    }

    function cancelLongTap() {
        if (longTapTimeout) clearTimeout(longTapTimeout)
        longTapTimeout = null
    }

    function cancelAll() {
        if (touchTimeout) clearTimeout(touchTimeout)
        if (tapTimeout) clearTimeout(tapTimeout)
        if (swipeTimeout) clearTimeout(swipeTimeout)
        if (longTapTimeout) clearTimeout(longTapTimeout)
        touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null
        touch = {}
    }

    function isPrimaryTouch(event){
        return event.pointerType == event.MSPOINTER_TYPE_TOUCH && event.isPrimary
    }

    $(document).ready(function(){
        var now, delta, deltaX = 0, deltaY = 0, firstTouch

        if ('MSGesture' in window) {
            gesture = new MSGesture()
            gesture.target = document.body
        }

        $(document)
            .bind('MSGestureEnd', function(e){
                var swipeDirectionFromVelocity =
                    e.velocityX > 1 ? 'Right' : e.velocityX < -1 ? 'Left' : e.velocityY > 1 ? 'Down' : e.velocityY < -1 ? 'Up' : null;
                if (swipeDirectionFromVelocity) {
                    touch.el.trigger('swipe')
                    touch.el.trigger('swipe'+ swipeDirectionFromVelocity)
                }
            })
            .on('touchstart MSPointerDown', function(e){
                if(e.type == 'MSPointerDown' && !isPrimaryTouch(e)) return;
                firstTouch = e.type == 'MSPointerDown' ? e : e.touches[0]
                now = Date.now()
                delta = now - (touch.last || now)
                touch.el = $('tagName' in firstTouch.target ?
                    firstTouch.target : firstTouch.target.parentNode)
                touchTimeout && clearTimeout(touchTimeout)
                touch.x1 = firstTouch.pageX
                touch.y1 = firstTouch.pageY
                if (delta > 0 && delta <= 250) touch.isDoubleTap = true
                touch.last = now
                longTapTimeout = setTimeout(longTap, longTapDelay)
                // adds the current touch contact for IE gesture recognition
                if (gesture && e.type == 'MSPointerDown') gesture.addPointer(e.pointerId);
            })
            .on('touchmove MSPointerMove', function(e){
                if(e.type == 'MSPointerMove' && !isPrimaryTouch(e)) return;
                firstTouch = e.type == 'MSPointerMove' ? e : e.touches[0]
                cancelLongTap()
                touch.x2 = firstTouch.pageX
                touch.y2 = firstTouch.pageY

                deltaX += Math.abs(touch.x1 - touch.x2)
                deltaY += Math.abs(touch.y1 - touch.y2)
            })
            .on('touchend MSPointerUp', function(e){
                if(e.type == 'MSPointerUp' && !isPrimaryTouch(e)) return;
                cancelLongTap()

                // swipe
                if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
                    (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))

                    swipeTimeout = setTimeout(function() {
                        touch.el.trigger('swipe')
                        touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
                        touch = {}
                    }, 0)

                // normal tap
                else if ('last' in touch)
                // don't fire tap when delta position changed by more than 30 pixels,
                // for instance when moving to a point and back to origin
                    if (deltaX < 30 && deltaY < 30) {
                        // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
                        // ('tap' fires before 'scroll')
                        tapTimeout = setTimeout(function() {

                            // trigger universal 'tap' with the option to cancelTouch()
                            // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
                            var event = $.Event('tap')
                            event.cancelTouch = cancelAll
                            touch.el.trigger(event)

                            // trigger double tap immediately
                            if (touch.isDoubleTap) {
                                touch.el.trigger('doubleTap')
                                touch = {}
                            }

                            // trigger single tap after 250ms of inactivity
                            else {
                                touchTimeout = setTimeout(function(){
                                    touchTimeout = null
                                    touch.el.trigger('singleTap')
                                    touch = {}
                                }, 250)
                            }
                        }, 0)
                    } else {
                        touch = {}
                    }
                deltaX = deltaY = 0

            })
            // when the browser window loses focus,
            // for example when a modal dialog is shown,
            // cancel all ongoing events
            .on('touchcancel MSPointerCancel', cancelAll)

        // scrolling the window indicates intention of the user
        // to scroll, not tap or swipe, so cancel all ongoing events
        $(window).on('scroll', cancelAll)
    })

    ;['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown',
        'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(eventName){
            $.fn[eventName] = function(callback){ return this.on(eventName, callback) }
        })
})(Zepto)

//     Zepto.js
//     (c) 2010-2013 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($){
    if ($.os.ios) {
        var gesture = {}, gestureTimeout

        function parentIfText(node){
            return 'tagName' in node ? node : node.parentNode
        }

        $(document).bind('gesturestart', function(e){
            var now = Date.now(), delta = now - (gesture.last || now)
            gesture.target = parentIfText(e.target)
            gestureTimeout && clearTimeout(gestureTimeout)
            gesture.e1 = e.scale
            gesture.last = now
        }).bind('gesturechange', function(e){
                gesture.e2 = e.scale
            }).bind('gestureend', function(e){
                if (gesture.e2 > 0) {
                    Math.abs(gesture.e1 - gesture.e2) != 0 && $(gesture.target).trigger('pinch') &&
                    $(gesture.target).trigger('pinch' + (gesture.e1 - gesture.e2 > 0 ? 'In' : 'Out'))
                    gesture.e1 = gesture.e2 = gesture.last = 0
                } else if ('last' in gesture) {
                    gesture = {}
                }
            })

        ;['pinch', 'pinchIn', 'pinchOut'].forEach(function(m){
            $.fn[m] = function(callback){ return this.bind(m, callback) }
        })
    }
})(Zepto)

;(function() {
    // fixed by liuhuo.gk for MI3 browser
    var m, ua = navigator.userAgent;
    if((m = ua.match(/Safari\/([\d.]*)/)) && m[1] && ua.match(/XiaoMi/igm)) {
        KISSY.UA.webkit = parseFloat(m[1]);
    }
})();
