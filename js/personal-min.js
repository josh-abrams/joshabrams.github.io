// History
(function (t, s) {
    "use strict";
    var e = t.History = t.History || {},
        n = t.jQuery;
    if (void 0 !== e.Adapter) throw new Error("History.js Adapter has already been loaded...");
    e.Adapter = {
        bind: function (t, e, i) {
            n(t).bind(e, i)
        },
        trigger: function (t, e, i) {
            n(t).trigger(e, i)
        },
        extractEventData: function (t, e, i) {
            var n;
            return e && e.originalEvent && e.originalEvent[t] || i && i[t] || s
        },
        onDomLoad: function (t) {
            n(t)
        }
    }, void 0 !== e.init && e.init()
})(window),
function (r, i) {
    "use strict";
    var l = r.console || i,
        h = r.document,
        n = r.navigator,
        s = !1,
        o = r.setTimeout,
        a = r.clearTimeout,
        u = r.setInterval,
        c = r.clearInterval,
        d = r.JSON,
        p = r.alert,
        f = r.History = r.History || {},
        g = r.history;
    try {
        (s = r.sessionStorage).setItem("TEST", "1"), s.removeItem("TEST")
    } catch (t) {
        s = !1
    }
    if (d.stringify = d.stringify || d.encode, d.parse = d.parse || d.decode, void 0 !== f.init) throw new Error("History.js Core has already been loaded...");
    f.init = function (t) {
        return void 0 !== f.Adapter && (void 0 !== f.initCore && f.initCore(), void 0 !== f.initHtml4 && f.initHtml4(), !0)
    }, f.initCore = function (t) {
        if (void 0 !== f.initCore.initialized) return !1;
        if (f.initCore.initialized = !0, f.options = f.options || {}, f.options.hashChangeInterval = f.options.hashChangeInterval || 100, f.options.safariPollInterval = f.options.safariPollInterval || 500, f.options.doubleCheckInterval = f.options.doubleCheckInterval || 500, f.options.disableSuid = f.options.disableSuid || !1, f.options.storeInterval = f.options.storeInterval || 1e3, f.options.busyDelay = f.options.busyDelay || 250, f.options.debug = f.options.debug || !1, f.options.initialTitle = f.options.initialTitle || h.title, f.options.html4Mode = f.options.html4Mode || !1, f.options.delayInit = f.options.delayInit || !1, f.intervalList = [], f.clearAllIntervals = function () {
                var t, e = f.intervalList;
                if (null != e) {
                    for (t = 0; t < e.length; t++) c(e[t]);
                    f.intervalList = null
                }
            }, f.debug = function () {
                f.options.debug && f.log.apply(f, arguments)
            }, f.log = function (t) {
                var e = void 0 !== l && void 0 !== l.log && void 0 !== l.log.apply,
                    i = h.getElementById("log"),
                    n, s, o, r, a;
                for (e ? (n = (r = Array.prototype.slice.call(arguments)).shift(), void 0 !== l.debug ? l.debug.apply(l, [n, r]) : l.log.apply(l, [n, r])) : n = "\n" + t + "\n", s = 1, o = arguments.length; s < o; ++s) {
                    if ("object" == typeof (a = arguments[s]) && void 0 !== d) try {
                        a = d.stringify(a)
                    } catch (t) {}
                    n += "\n" + a + "\n"
                }
                return i ? (i.value += n + "\n-----\n", i.scrollTop = i.scrollHeight - i.clientHeight) : e || p(n), !0
            }, f.getInternetExplorerMajorVersion = function () {
                var t;
                return f.getInternetExplorerMajorVersion.cached = void 0 !== f.getInternetExplorerMajorVersion.cached ? f.getInternetExplorerMajorVersion.cached : function () {
                    for (var t = 3, e = h.createElement("div"), i = e.getElementsByTagName("i");
                        (e.innerHTML = "\x3c!--[if gt IE " + ++t + "]><i></i><![endif]--\x3e") && i[0];);
                    return 4 < t && t
                }()
            }, f.isInternetExplorer = function () {
                var t;
                return f.isInternetExplorer.cached = void 0 !== f.isInternetExplorer.cached ? f.isInternetExplorer.cached : Boolean(f.getInternetExplorerMajorVersion())
            }, f.options.html4Mode ? f.emulated = {
                pushState: !0,
                hashChange: !0
            } : f.emulated = {
                pushState: !Boolean(r.history && r.history.pushState && r.history.replaceState && !/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i.test(n.userAgent) && !/AppleWebKit\/5([0-2]|3[0-2])/i.test(n.userAgent)),
                hashChange: Boolean(!("onhashchange" in r || "onhashchange" in h) || f.isInternetExplorer() && f.getInternetExplorerMajorVersion() < 8)
            }, f.enabled = !f.emulated.pushState, f.bugs = {
                setHash: Boolean(!f.emulated.pushState && "Apple Computer, Inc." === n.vendor && /AppleWebKit\/5([0-2]|3[0-3])/.test(n.userAgent)),
                safariPoll: Boolean(!f.emulated.pushState && "Apple Computer, Inc." === n.vendor && /AppleWebKit\/5([0-2]|3[0-3])/.test(n.userAgent)),
                ieDoubleCheck: Boolean(f.isInternetExplorer() && f.getInternetExplorerMajorVersion() < 8),
                hashEscape: Boolean(f.isInternetExplorer() && f.getInternetExplorerMajorVersion() < 7)
            }, f.isEmptyObject = function (t) {
                for (var e in t)
                    if (t.hasOwnProperty(e)) return !1;
                return !0
            }, f.cloneObject = function (t) {
                var e, i;
                return i = t ? (e = d.stringify(t), d.parse(e)) : {}
            }, f.getRootUrl = function () {
                var t = h.location.protocol + "//" + (h.location.hostname || h.location.host);
                return h.location.port && (t += ":" + h.location.port), t += "/"
            }, f.getBaseHref = function () {
                var t = h.getElementsByTagName("base"),
                    e = null,
                    i = "";
                return 1 === t.length && (i = (e = t[0]).href.replace(/[^\/]+$/, "")), (i = i.replace(/\/+$/, "")) && (i += "/"), i
            }, f.getBaseUrl = function () {
                var t;
                return f.getBaseHref() || f.getBasePageUrl() || f.getRootUrl()
            }, f.getPageUrl = function () {
                var t, e, i;
                return i = ((f.getState(!1, !1) || {}).url || f.getLocationHref()).replace(/\/+$/, "").replace(/[^\/]+$/, function (t, e, i) {
                    return /\./.test(t) ? t : t + "/"
                })
            }, f.getBasePageUrl = function () {
                var t;
                return f.getLocationHref().replace(/[#\?].*/, "").replace(/[^\/]+$/, function (t, e, i) {
                    return /[^\/]$/.test(t) ? "" : t
                }).replace(/\/+$/, "") + "/"
            }, f.getFullUrl = function (t, e) {
                var i = t,
                    n = t.substring(0, 1);
                return e = void 0 === e || e, /[a-z]+\:\/\//.test(t) || (i = "/" === n ? f.getRootUrl() + t.replace(/^\/+/, "") : "#" === n ? f.getPageUrl().replace(/#.*/, "") + t : "?" === n ? f.getPageUrl().replace(/[\?#].*/, "") + t : e ? f.getBaseUrl() + t.replace(/^(\.\/)+/, "") : f.getBasePageUrl() + t.replace(/^(\.\/)+/, "")), i.replace(/\#$/, "")
            }, f.getShortUrl = function (t) {
                var e = t,
                    i = f.getBaseUrl(),
                    n = f.getRootUrl();
                return f.emulated.pushState && (e = e.replace(i, "")), e = e.replace(n, "/"), f.isTraditionalAnchor(e) && (e = "./" + e), e = e.replace(/^(\.\/)+/g, "./").replace(/\#$/, "")
            }, f.getLocationHref = function (t) {
                return (t = t || h).URL === t.location.href ? t.location.href : t.location.href === decodeURIComponent(t.URL) ? t.URL : t.location.hash && decodeURIComponent(t.location.href.replace(/^[^#]+/, "")) === t.location.hash ? t.location.href : -1 == t.URL.indexOf("#") && -1 != t.location.href.indexOf("#") ? t.location.href : t.URL || t.location.href
            }, f.store = {}, f.idToState = f.idToState || {}, f.stateToId = f.stateToId || {}, f.urlToId = f.urlToId || {}, f.storedStates = f.storedStates || [], f.savedStates = f.savedStates || [], f.normalizeStore = function () {
                f.store.idToState = f.store.idToState || {}, f.store.urlToId = f.store.urlToId || {}, f.store.stateToId = f.store.stateToId || {}
            }, f.getState = function (t, e) {
                void 0 === t && (t = !0), void 0 === e && (e = !0);
                var i = f.getLastSavedState();
                return !i && e && (i = f.createStateObject()), t && ((i = f.cloneObject(i)).url = i.cleanUrl || i.url), i
            }, f.getIdByState = function (t) {
                var e = f.extractId(t.url),
                    i;
                if (!e)
                    if (i = f.getStateString(t), void 0 !== f.stateToId[i]) e = f.stateToId[i];
                    else if (void 0 !== f.store.stateToId[i]) e = f.store.stateToId[i];
                else {
                    for (; e = (new Date).getTime() + String(Math.random()).replace(/\D/g, ""), void 0 !== f.idToState[e] || void 0 !== f.store.idToState[e];);
                    f.stateToId[i] = e, f.idToState[e] = t
                }
                return e
            }, f.normalizeState = function (t) {
                var e, i;
                return t && "object" == typeof t || (t = {}), void 0 !== t.normalized ? t : (t.data && "object" == typeof t.data || (t.data = {}), (e = {
                    normalized: !0
                }).title = t.title || "", e.url = f.getFullUrl(t.url ? t.url : f.getLocationHref()), e.hash = f.getShortUrl(e.url), e.data = f.cloneObject(t.data), e.id = f.getIdByState(e), e.cleanUrl = e.url.replace(/\??\&_suid.*/, ""), e.url = e.cleanUrl, i = !f.isEmptyObject(e.data), (e.title || i) && !0 !== f.options.disableSuid && (e.hash = f.getShortUrl(e.url).replace(/\??\&_suid.*/, ""), /\?/.test(e.hash) || (e.hash += "?"), e.hash += "&_suid=" + e.id), e.hashedUrl = f.getFullUrl(e.hash), (f.emulated.pushState || f.bugs.safariPoll) && f.hasUrlDuplicate(e) && (e.url = e.hashedUrl), e)
            }, f.createStateObject = function (t, e, i) {
                var n = {
                    data: t,
                    title: e,
                    url: i
                };
                return n = f.normalizeState(n)
            }, f.getStateById = function (t) {
                var e;
                return t = String(t), f.idToState[t] || f.store.idToState[t] || i
            }, f.getStateString = function (t) {
                var e, i, n;
                return i = {
                    data: (e = f.normalizeState(t)).data,
                    title: t.title,
                    url: t.url
                }, n = d.stringify(i)
            }, f.getStateId = function (t) {
                var e, i;
                return i = (e = f.normalizeState(t)).id
            }, f.getHashByState = function (t) {
                var e, i;
                return i = (e = f.normalizeState(t)).hash
            }, f.extractId = function (t) {
                var e, i, n, s;
                return s = -1 != t.indexOf("#") ? t.split("#")[0] : t, n = (i = /(.*)\&_suid=([0-9]+)$/.exec(s)) && i[1] || t, (e = i ? String(i[2] || "") : "") || !1
            }, f.isTraditionalAnchor = function (t) {
                var e;
                return !/[\/\?\.]/.test(t)
            }, f.extractState = function (t, e) {
                var i = null,
                    n, s;
                return e = e || !1, (n = f.extractId(t)) && (i = f.getStateById(n)), i || (s = f.getFullUrl(t), (n = f.getIdByUrl(s) || !1) && (i = f.getStateById(n)), !i && e && !f.isTraditionalAnchor(t) && (i = f.createStateObject(null, null, s))), i
            }, f.getIdByUrl = function (t) {
                var e;
                return f.urlToId[t] || f.store.urlToId[t] || i
            }, f.getLastSavedState = function () {
                return f.savedStates[f.savedStates.length - 1] || i
            }, f.getLastStoredState = function () {
                return f.storedStates[f.storedStates.length - 1] || i
            }, f.hasUrlDuplicate = function (t) {
                var e = !1,
                    i;
                return e = (i = f.extractState(t.url)) && i.id !== t.id
            }, f.storeState = function (t) {
                return f.urlToId[t.url] = t.id, f.storedStates.push(f.cloneObject(t)), t
            }, f.isLastSavedState = function (t) {
                var e = !1,
                    i, n, s;
                return f.savedStates.length && (e = (i = t.id) === (s = (n = f.getLastSavedState()).id)), e
            }, f.saveState = function (t) {
                return !f.isLastSavedState(t) && (f.savedStates.push(f.cloneObject(t)), !0)
            }, f.getStateByIndex = function (t) {
                var e = null;
                return e = void 0 === t ? f.savedStates[f.savedStates.length - 1] : t < 0 ? f.savedStates[f.savedStates.length + t] : f.savedStates[t]
            }, f.getCurrentIndex = function () {
                var t = null;
                return t = f.savedStates.length < 1 ? 0 : f.savedStates.length - 1
            }, f.getHash = function (t) {
                var e = f.getLocationHref(t),
                    i;
                return i = f.getHashByUrl(e)
            }, f.unescapeHash = function (t) {
                var e = f.normalizeHash(t);
                return e = decodeURIComponent(e)
            }, f.normalizeHash = function (t) {
                var e;
                return t.replace(/[^#]*#/, "").replace(/#.*/, "")
            }, f.setHash = function (t, e) {
                var i, n;
                return !1 !== e && f.busy() ? (f.pushQueue({
                    scope: f,
                    callback: f.setHash,
                    args: arguments,
                    queue: e
                }), !1) : (f.busy(!0), (i = f.extractState(t, !0)) && !f.emulated.pushState ? f.pushState(i.data, i.title, i.url, !1) : f.getHash() !== t && (f.bugs.setHash ? (n = f.getPageUrl(), f.pushState(null, null, n + "#" + t, !1)) : h.location.hash = t), f)
            }, f.escapeHash = function (t) {
                var e = f.normalizeHash(t);
                return e = r.encodeURIComponent(e), f.bugs.hashEscape || (e = e.replace(/\%21/g, "!").replace(/\%26/g, "&").replace(/\%3D/g, "=").replace(/\%3F/g, "?")), e
            }, f.getHashByUrl = function (t) {
                var e = String(t).replace(/([^#]*)#?([^#]*)#?(.*)/, "$2");
                return e = f.unescapeHash(e)
            }, f.setTitle = function (t) {
                var e = t.title,
                    i;
                e || (i = f.getStateByIndex(0)) && i.url === t.url && (e = i.title || f.options.initialTitle);
                try {
                    h.getElementsByTagName("title")[0].innerHTML = e.replace("<", "&lt;").replace(">", "&gt;").replace(" & ", " &amp; ")
                } catch (t) {}
                return h.title = e, f
            }, f.queues = [], f.busy = function (t) {
                if (void 0 !== t ? f.busy.flag = t : void 0 === f.busy.flag && (f.busy.flag = !1), !f.busy.flag) {
                    a(f.busy.timeout);
                    var n = function () {
                        var t, e, i;
                        if (!f.busy.flag)
                            for (t = f.queues.length - 1; 0 <= t; --t) 0 !== (e = f.queues[t]).length && (i = e.shift(), f.fireQueueItem(i), f.busy.timeout = o(n, f.options.busyDelay))
                    };
                    f.busy.timeout = o(n, f.options.busyDelay)
                }
                return f.busy.flag
            }, f.busy.flag = !1, f.fireQueueItem = function (t) {
                return t.callback.apply(t.scope || f, t.args || [])
            }, f.pushQueue = function (t) {
                return f.queues[t.queue || 0] = f.queues[t.queue || 0] || [], f.queues[t.queue || 0].push(t), f
            }, f.queue = function (t, e) {
                return "function" == typeof t && (t = {
                    callback: t
                }), void 0 !== e && (t.queue = e), f.busy() ? f.pushQueue(t) : f.fireQueueItem(t), f
            }, f.clearQueue = function () {
                return f.busy.flag = !1, f.queues = [], f
            }, f.stateChanged = !1, f.doubleChecker = !1, f.doubleCheckComplete = function () {
                return f.stateChanged = !0, f.doubleCheckClear(), f
            }, f.doubleCheckClear = function () {
                return f.doubleChecker && (a(f.doubleChecker), f.doubleChecker = !1), f
            }, f.doubleCheck = function (t) {
                return f.stateChanged = !1, f.doubleCheckClear(), f.bugs.ieDoubleCheck && (f.doubleChecker = o(function () {
                    return f.doubleCheckClear(), f.stateChanged || t(), !0
                }, f.options.doubleCheckInterval)), f
            }, f.safariStatePoll = function () {
                var t = f.extractState(f.getLocationHref()),
                    e;
                if (!f.isLastSavedState(t)) return (e = t) || (e = f.createStateObject()), f.Adapter.trigger(r, "popstate"), f
            }, f.back = function (t) {
                return !1 !== t && f.busy() ? (f.pushQueue({
                    scope: f,
                    callback: f.back,
                    args: arguments,
                    queue: t
                }), !1) : (f.busy(!0), f.doubleCheck(function () {
                    f.back(!1)
                }), g.go(-1), !0)
            }, f.forward = function (t) {
                return !1 !== t && f.busy() ? (f.pushQueue({
                    scope: f,
                    callback: f.forward,
                    args: arguments,
                    queue: t
                }), !1) : (f.busy(!0), f.doubleCheck(function () {
                    f.forward(!1)
                }), g.go(1), !0)
            }, f.go = function (t, e) {
                var i;
                if (0 < t)
                    for (i = 1; i <= t; ++i) f.forward(e);
                else {
                    if (!(t < 0)) throw new Error("History.go: History.go requires a positive or negative integer passed.");
                    for (i = -1; t <= i; --i) f.back(e)
                }
                return f
            }, f.emulated.pushState) {
            var e = function () {};
            f.pushState = f.pushState || e, f.replaceState = f.replaceState || e
        } else f.onPopState = function (t, e) {
            var i = !1,
                n = !1,
                s, o;
            return f.doubleCheckComplete(), (s = f.getHash()) ? ((o = f.extractState(s || f.getLocationHref(), !0)) ? f.replaceState(o.data, o.title, o.url, !1) : (f.Adapter.trigger(r, "anchorchange"), f.busy(!1)), f.expectedStateId = !1) : ((n = (i = f.Adapter.extractEventData("state", t, e) || !1) ? f.getStateById(i) : f.expectedStateId ? f.getStateById(f.expectedStateId) : f.extractState(f.getLocationHref())) || (n = f.createStateObject(null, null, f.getLocationHref())), f.expectedStateId = !1, f.isLastSavedState(n) ? (f.busy(!1), !1) : (f.storeState(n), f.saveState(n), f.setTitle(n), f.Adapter.trigger(r, "statechange"), f.busy(!1), !0))
        }, f.Adapter.bind(r, "popstate", f.onPopState), f.pushState = function (t, e, i, n) {
            if (f.getHashByUrl(i) && f.emulated.pushState) throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");
            if (!1 !== n && f.busy()) return f.pushQueue({
                scope: f,
                callback: f.pushState,
                args: arguments,
                queue: n
            }), !1;
            f.busy(!0);
            var s = f.createStateObject(t, e, i);
            return f.isLastSavedState(s) ? f.busy(!1) : (f.storeState(s), f.expectedStateId = s.id, g.pushState(s.id, s.title, s.url), f.Adapter.trigger(r, "popstate")), !0
        }, f.replaceState = function (t, e, i, n) {
            if (f.getHashByUrl(i) && f.emulated.pushState) throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");
            if (!1 !== n && f.busy()) return f.pushQueue({
                scope: f,
                callback: f.replaceState,
                args: arguments,
                queue: n
            }), !1;
            f.busy(!0);
            var s = f.createStateObject(t, e, i);
            return f.isLastSavedState(s) ? f.busy(!1) : (f.storeState(s), f.expectedStateId = s.id, g.replaceState(s.id, s.title, s.url), f.Adapter.trigger(r, "popstate")), !0
        };
        if (s) {
            try {
                f.store = d.parse(s.getItem("History.store")) || {}
            } catch (t) {
                f.store = {}
            }
            f.normalizeStore()
        } else f.store = {}, f.normalizeStore();
        f.Adapter.bind(r, "unload", f.clearAllIntervals), f.saveState(f.storeState(f.extractState(f.getLocationHref(), !0))), s && (f.onUnload = function () {
            var e, t, i;
            try {
                e = d.parse(s.getItem("History.store")) || {}
            } catch (t) {
                e = {}
            }
            for (t in e.idToState = e.idToState || {}, e.urlToId = e.urlToId || {}, e.stateToId = e.stateToId || {}, f.idToState) f.idToState.hasOwnProperty(t) && (e.idToState[t] = f.idToState[t]);
            for (t in f.urlToId) f.urlToId.hasOwnProperty(t) && (e.urlToId[t] = f.urlToId[t]);
            for (t in f.stateToId) f.stateToId.hasOwnProperty(t) && (e.stateToId[t] = f.stateToId[t]);
            f.store = e, f.normalizeStore(), i = d.stringify(e);
            try {
                s.setItem("History.store", i)
            } catch (t) {
                if (t.code !== DOMException.QUOTA_EXCEEDED_ERR) throw t;
                s.length && (s.removeItem("History.store"), s.setItem("History.store", i))
            }
        }, f.intervalList.push(u(f.onUnload, f.options.storeInterval)), f.Adapter.bind(r, "beforeunload", f.onUnload), f.Adapter.bind(r, "unload", f.onUnload)), f.emulated.pushState || (f.bugs.safariPoll && f.intervalList.push(u(f.safariStatePoll, f.options.safariPollInterval)), "Apple Computer, Inc." !== n.vendor && "Mozilla" !== (n.appCodeName || "") || (f.Adapter.bind(r, "hashchange", function () {
            f.Adapter.trigger(r, "popstate")
        }), f.getHash() && f.Adapter.onDomLoad(function () {
            f.Adapter.trigger(r, "hashchange")
        })))
    }, (!f.options || !f.options.delayInit) && f.init()
}(window),
function (t, e) {
    "function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", e) : "object" == typeof module && module.exports ? module.exports = e() : t.EvEmitter = e()
}("undefined" != typeof window ? window : this, function () {
    function t() {}
    var e = t.prototype;
    return e.on = function (t, e) {
        if (t && e) {
            var i = this._events = this._events || {},
                n = i[t] = i[t] || [];
            return -1 == n.indexOf(e) && n.push(e), this
        }
    }, e.once = function (t, e) {
        if (t && e) {
            this.on(t, e);
            var i = this._onceEvents = this._onceEvents || {},
                n;
            return (i[t] = i[t] || {})[e] = !0, this
        }
    }, e.off = function (t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
            var n = i.indexOf(e);
            return -1 != n && i.splice(n, 1), this
        }
    }, e.emitEvent = function (t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
            var n = 0,
                s = i[n];
            e = e || [];
            for (var o = this._onceEvents && this._onceEvents[t]; s;) {
                var r = o && o[s];
                r && (this.off(t, s), delete o[s]), s.apply(this, e), s = i[n += r ? 0 : 1]
            }
            return this
        }
    }, e.allOff = e.removeAllListeners = function () {
        delete this._events, delete this._onceEvents
    }, t
}),
function (e, i) {
    "use strict";
    "function" == typeof define && define.amd ? define(["ev-emitter/ev-emitter"], function (t) {
        return i(e, t)
    }) : "object" == typeof module && module.exports ? module.exports = i(e, require("ev-emitter")) : e.imagesLoaded = i(e, e.EvEmitter)
}("undefined" != typeof window ? window : this, function (e, t) {
    function n(t, e) {
        for (var i in e) t[i] = e[i];
        return t
    }

    function s(t) {
        var e = [];
        if (Array.isArray(t)) e = t;
        else if ("number" == typeof t.length)
            for (var i = 0; i < t.length; i++) e.push(t[i]);
        else e.push(t);
        return e
    }

    function o(t, e, i) {
        return this instanceof o ? ("string" == typeof t && (t = document.querySelectorAll(t)), this.elements = s(t), this.options = n({}, this.options), "function" == typeof e ? i = e : n(this.options, e), i && this.on("always", i), this.getImages(), a && (this.jqDeferred = new a.Deferred), void setTimeout(function () {
            this.check()
        }.bind(this))) : new o(t, e, i)
    }

    function i(t) {
        this.img = t
    }

    function r(t, e) {
        this.url = t, this.element = e, this.img = new Image
    }
    var a = e.jQuery,
        l = e.console;
    o.prototype = Object.create(t.prototype), o.prototype.options = {}, o.prototype.getImages = function () {
        this.images = [], this.elements.forEach(this.addElementImages, this)
    }, o.prototype.addElementImages = function (t) {
        "IMG" == t.nodeName && this.addImage(t), !0 === this.options.background && this.addElementBackgroundImages(t);
        var e = t.nodeType;
        if (e && h[e]) {
            for (var i = t.querySelectorAll("img"), n = 0; n < i.length; n++) {
                var s = i[n];
                this.addImage(s)
            }
            if ("string" == typeof this.options.background) {
                var o = t.querySelectorAll(this.options.background);
                for (n = 0; n < o.length; n++) {
                    var r = o[n];
                    this.addElementBackgroundImages(r)
                }
            }
        }
    };
    var h = {
        1: !0,
        9: !0,
        11: !0
    };
    return o.prototype.addElementBackgroundImages = function (t) {
        var e = getComputedStyle(t);
        if (e)
            for (var i = /url\((['"])?(.*?)\1\)/gi, n = i.exec(e.backgroundImage); null !== n;) {
                var s = n && n[2];
                s && this.addBackground(s, t), n = i.exec(e.backgroundImage)
            }
    }, o.prototype.addImage = function (t) {
        var e = new i(t);
        this.images.push(e)
    }, o.prototype.addBackground = function (t, e) {
        var i = new r(t, e);
        this.images.push(i)
    }, o.prototype.check = function () {
        function e(t, e, i) {
            setTimeout(function () {
                n.progress(t, e, i)
            })
        }
        var n = this;
        return this.progressedCount = 0, this.hasAnyBroken = !1, this.images.length ? void this.images.forEach(function (t) {
            t.once("progress", e), t.check()
        }) : void this.complete()
    }, o.prototype.progress = function (t, e, i) {
        this.progressedCount++, this.hasAnyBroken = this.hasAnyBroken || !t.isLoaded, this.emitEvent("progress", [this, t, e]), this.jqDeferred && this.jqDeferred.notify && this.jqDeferred.notify(this, t), this.progressedCount == this.images.length && this.complete(), this.options.debug && l && l.log("progress: " + i, t, e)
    }, o.prototype.complete = function () {
        var t = this.hasAnyBroken ? "fail" : "done";
        if (this.isComplete = !0, this.emitEvent(t, [this]), this.emitEvent("always", [this]), this.jqDeferred) {
            var e = this.hasAnyBroken ? "reject" : "resolve";
            this.jqDeferred[e](this)
        }
    }, i.prototype = Object.create(t.prototype), i.prototype.check = function () {
        var t;
        return this.getIsImageComplete() ? void this.confirm(0 !== this.img.naturalWidth, "naturalWidth") : (this.proxyImage = new Image, this.proxyImage.addEventListener("load", this), this.proxyImage.addEventListener("error", this), this.img.addEventListener("load", this), this.img.addEventListener("error", this), void(this.proxyImage.src = this.img.src))
    }, i.prototype.getIsImageComplete = function () {
        return this.img.complete && void 0 !== this.img.naturalWidth
    }, i.prototype.confirm = function (t, e) {
        this.isLoaded = t, this.emitEvent("progress", [this, this.img, e])
    }, i.prototype.handleEvent = function (t) {
        var e = "on" + t.type;
        this[e] && this[e](t)
    }, i.prototype.onload = function () {
        this.confirm(!0, "onload"), this.unbindEvents()
    }, i.prototype.onerror = function () {
        this.confirm(!1, "onerror"), this.unbindEvents()
    }, i.prototype.unbindEvents = function () {
        this.proxyImage.removeEventListener("load", this), this.proxyImage.removeEventListener("error", this), this.img.removeEventListener("load", this), this.img.removeEventListener("error", this)
    }, r.prototype = Object.create(i.prototype), r.prototype.check = function () {
        var t;
        this.img.addEventListener("load", this), this.img.addEventListener("error", this), this.img.src = this.url, this.getIsImageComplete() && (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"), this.unbindEvents())
    }, r.prototype.unbindEvents = function () {
        this.img.removeEventListener("load", this), this.img.removeEventListener("error", this)
    }, r.prototype.confirm = function (t, e) {
        this.isLoaded = t, this.emitEvent("progress", [this, this.element, e])
    }, o.makeJQueryPlugin = function (t) {
        (t = t || e.jQuery) && ((a = t).fn.imagesLoaded = function (t, e) {
            var i;
            return new o(this, t, e).jqDeferred.promise(a(this))
        })
    }, o.makeJQueryPlugin(), o
}),
function (e, i) {
    "function" == typeof define && define.amd ? define("jquery-bridget/jquery-bridget", ["jquery"], function (t) {
        return i(e, t)
    }) : "object" == typeof module && module.exports ? module.exports = i(e, require("jquery")) : e.jQueryBridget = i(e, e.jQuery)
}(window, function (t, e) {
    "use strict";

    function i(h, s, u) {
        function i(t, o, r) {
            var a, l = "$()." + h + '("' + o + '")';
            return t.each(function (t, e) {
                var i = u.data(e, h);
                if (i) {
                    var n = i[o];
                    if (n && "_" != o.charAt(0)) {
                        var s = n.apply(i, r);
                        a = void 0 === a ? s : a
                    } else c(l + " is not a valid method")
                } else c(h + " not initialized. Cannot call methods, i.e. " + l)
            }), void 0 !== a ? a : t
        }

        function n(t, n) {
            t.each(function (t, e) {
                var i = u.data(e, h);
                i ? (i.option(n), i._init()) : (i = new s(e, n), u.data(e, h, i))
            })
        }(u = u || e || t.jQuery) && (s.prototype.option || (s.prototype.option = function (t) {
            u.isPlainObject(t) && (this.options = u.extend(!0, this.options, t))
        }), u.fn[h] = function (t) {
            return "string" != typeof t ? (n(this, t), this) : i(this, t, r.call(arguments, 1));
            var e
        }, o(u))
    }

    function o(t) {
        !t || t && t.bridget || (t.bridget = i)
    }
    var r = Array.prototype.slice,
        n = t.console,
        c = void 0 === n ? function () {} : function (t) {
            n.error(t)
        };
    return o(e || t.jQuery), i
}),
function (t, e) {
    "function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", e) : "object" == typeof module && module.exports ? module.exports = e() : t.EvEmitter = e()
}("undefined" != typeof window ? window : this, function () {
    function t() {}
    var e = t.prototype;
    return e.on = function (t, e) {
        if (t && e) {
            var i = this._events = this._events || {},
                n = i[t] = i[t] || [];
            return -1 == n.indexOf(e) && n.push(e), this
        }
    }, e.once = function (t, e) {
        if (t && e) {
            this.on(t, e);
            var i = this._onceEvents = this._onceEvents || {},
                n;
            return (i[t] = i[t] || {})[e] = !0, this
        }
    }, e.off = function (t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
            var n = i.indexOf(e);
            return -1 != n && i.splice(n, 1), this
        }
    }, e.emitEvent = function (t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
            var n = 0,
                s = i[n];
            e = e || [];
            for (var o = this._onceEvents && this._onceEvents[t]; s;) {
                var r = o && o[s];
                r && (this.off(t, s), delete o[s]), s.apply(this, e), s = i[n += r ? 0 : 1]
            }
            return this
        }
    }, t
}),
function (t, e) {
    "use strict";
    "function" == typeof define && define.amd ? define("get-size/get-size", [], function () {
        return e()
    }) : "object" == typeof module && module.exports ? module.exports = e() : t.getSize = e()
}(window, function () {
    "use strict";

    function v(t) {
        var e = parseFloat(t),
            i;
        return -1 == t.indexOf("%") && !isNaN(e) && e
    }

    function t() {}

    function y() {
        for (var t = {
                width: 0,
                height: 0,
                innerWidth: 0,
                innerHeight: 0,
                outerWidth: 0,
                outerHeight: 0
            }, e = 0; e < C; e++) {
            var i;
            t[x[e]] = 0
        }
        return t
    }

    function _(t) {
        var e = getComputedStyle(t);
        return e || i("Style returned " + e + ". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"), e
    }

    function w() {
        if (!s) {
            s = !0;
            var t = document.createElement("div");
            t.style.width = "200px", t.style.padding = "1px 2px 3px 4px", t.style.borderStyle = "solid", t.style.borderWidth = "1px 2px 3px 4px", t.style.boxSizing = "border-box";
            var e = document.body || document.documentElement;
            e.appendChild(t);
            var i = _(t);
            n.isBoxSizeOuter = b = 200 == v(i.width), e.removeChild(t)
        }
    }

    function n(t) {
        if (w(), "string" == typeof t && (t = document.querySelector(t)), t && "object" == typeof t && t.nodeType) {
            var e = _(t);
            if ("none" == e.display) return y();
            var i = {};
            i.width = t.offsetWidth, i.height = t.offsetHeight;
            for (var n = i.isBorderBox = "border-box" == e.boxSizing, s = 0; s < C; s++) {
                var o = x[s],
                    r = e[o],
                    a = parseFloat(r);
                i[o] = isNaN(a) ? 0 : a
            }
            var l = i.paddingLeft + i.paddingRight,
                h = i.paddingTop + i.paddingBottom,
                u = i.marginLeft + i.marginRight,
                c = i.marginTop + i.marginBottom,
                d = i.borderLeftWidth + i.borderRightWidth,
                p = i.borderTopWidth + i.borderBottomWidth,
                f = n && b,
                g = v(e.width);
            !1 !== g && (i.width = g + (f ? 0 : l + d));
            var m = v(e.height);
            return !1 !== m && (i.height = m + (f ? 0 : h + p)), i.innerWidth = i.width - (l + d), i.innerHeight = i.height - (h + p), i.outerWidth = i.width + u, i.outerHeight = i.height + c, i
        }
    }
    var b, i = "undefined" == typeof console ? t : function (t) {
            console.error(t)
        },
        x = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"],
        C = x.length,
        s = !1;
    return n
}),
function (t, e) {
    "use strict";
    "function" == typeof define && define.amd ? define("desandro-matches-selector/matches-selector", e) : "object" == typeof module && module.exports ? module.exports = e() : t.matchesSelector = e()
}(window, function () {
    "use strict";
    var i = function () {
        var t = window.Element.prototype;
        if (t.matches) return "matches";
        if (t.matchesSelector) return "matchesSelector";
        for (var e = ["webkit", "moz", "ms", "o"], i = 0; i < e.length; i++) {
            var n, s = e[i] + "MatchesSelector";
            if (t[s]) return s
        }
    }();
    return function (t, e) {
        return t[i](e)
    }
}),
function (e, i) {
    "function" == typeof define && define.amd ? define("fizzy-ui-utils/utils", ["desandro-matches-selector/matches-selector"], function (t) {
        return i(e, t)
    }) : "object" == typeof module && module.exports ? module.exports = i(e, require("desandro-matches-selector")) : e.fizzyUIUtils = i(e, e.matchesSelector)
}(window, function (h, o) {
    var u = {
            extend: function (t, e) {
                for (var i in e) t[i] = e[i];
                return t
            },
            modulo: function (t, e) {
                return (t % e + e) % e
            },
            makeArray: function (t) {
                var e = [];
                if (Array.isArray(t)) e = t;
                else if (t && "object" == typeof t && "number" == typeof t.length)
                    for (var i = 0; i < t.length; i++) e.push(t[i]);
                else e.push(t);
                return e
            },
            removeFrom: function (t, e) {
                var i = t.indexOf(e); - 1 != i && t.splice(i, 1)
            },
            getParent: function (t, e) {
                for (; t != document.body;)
                    if (t = t.parentNode, o(t, e)) return t
            },
            getQueryElement: function (t) {
                return "string" == typeof t ? document.querySelector(t) : t
            },
            handleEvent: function (t) {
                var e = "on" + t.type;
                this[e] && this[e](t)
            },
            filterFindElements: function (t, n) {
                t = u.makeArray(t);
                var s = [];
                return t.forEach(function (t) {
                    if (t instanceof HTMLElement) {
                        if (!n) return void s.push(t);
                        o(t, n) && s.push(t);
                        for (var e = t.querySelectorAll(n), i = 0; i < e.length; i++) s.push(e[i])
                    }
                }), s
            },
            debounceMethod: function (t, e, n) {
                var s = t.prototype[e],
                    o = e + "Timeout";
                t.prototype[e] = function () {
                    var t = this[o];
                    t && clearTimeout(t);
                    var e = arguments,
                        i = this;
                    this[o] = setTimeout(function () {
                        s.apply(i, e), delete i[o]
                    }, n || 100)
                }
            },
            docReady: function (t) {
                var e = document.readyState;
                "complete" == e || "interactive" == e ? setTimeout(t) : document.addEventListener("DOMContentLoaded", t)
            },
            toDashed: function (t) {
                return t.replace(/(.)([A-Z])/g, function (t, e, i) {
                    return e + "-" + i
                }).toLowerCase()
            }
        },
        c = h.console;
    return u.htmlInit = function (a, l) {
        u.docReady(function () {
            var t = u.toDashed(l),
                s = "data-" + t,
                e = document.querySelectorAll("[" + s + "]"),
                i = document.querySelectorAll(".js-" + t),
                n = u.makeArray(e).concat(u.makeArray(i)),
                o = s + "-options",
                r = h.jQuery;
            n.forEach(function (e) {
                var t, i = e.getAttribute(s) || e.getAttribute(o);
                try {
                    t = i && JSON.parse(i)
                } catch (t) {
                    return void(c && c.error("Error parsing " + s + " on " + e.className + ": " + t))
                }
                var n = new a(e, t);
                r && r.data(e, l, n)
            })
        })
    }, u
}),
function (t, e) {
    "function" == typeof define && define.amd ? define("outlayer/item", ["ev-emitter/ev-emitter", "get-size/get-size"], e) : "object" == typeof module && module.exports ? module.exports = e(require("ev-emitter"), require("get-size")) : (t.Outlayer = {}, t.Outlayer.Item = e(t.EvEmitter, t.getSize))
}(window, function (t, e) {
    "use strict";

    function s(t) {
        for (var e in t) return !1;
        return !(e = null)
    }

    function i(t, e) {
        t && (this.element = t, this.layout = e, this.position = {
            x: 0,
            y: 0
        }, this._create())
    }

    function n(t) {
        return t.replace(/([A-Z])/g, function (t) {
            return "-" + t.toLowerCase()
        })
    }
    var o = document.documentElement.style,
        r = "string" == typeof o.transition ? "transition" : "WebkitTransition",
        a = "string" == typeof o.transform ? "transform" : "WebkitTransform",
        l = {
            WebkitTransition: "webkitTransitionEnd",
            transition: "transitionend"
        } [r],
        h = {
            transform: a,
            transition: r,
            transitionDuration: r + "Duration",
            transitionProperty: r + "Property",
            transitionDelay: r + "Delay"
        },
        u = i.prototype = Object.create(t.prototype);
    u.constructor = i, u._create = function () {
        this._transn = {
            ingProperties: {},
            clean: {},
            onEnd: {}
        }, this.css({
            position: "absolute"
        })
    }, u.handleEvent = function (t) {
        var e = "on" + t.type;
        this[e] && this[e](t)
    }, u.getSize = function () {
        this.size = e(this.element)
    }, u.css = function (t) {
        var e = this.element.style;
        for (var i in t) {
            var n;
            e[h[i] || i] = t[i]
        }
    }, u.getPosition = function () {
        var t = getComputedStyle(this.element),
            e = this.layout._getOption("originLeft"),
            i = this.layout._getOption("originTop"),
            n = t[e ? "left" : "right"],
            s = t[i ? "top" : "bottom"],
            o = this.layout.size,
            r = -1 != n.indexOf("%") ? parseFloat(n) / 100 * o.width : parseInt(n, 10),
            a = -1 != s.indexOf("%") ? parseFloat(s) / 100 * o.height : parseInt(s, 10);
        r = isNaN(r) ? 0 : r, a = isNaN(a) ? 0 : a, r -= e ? o.paddingLeft : o.paddingRight, a -= i ? o.paddingTop : o.paddingBottom, this.position.x = r, this.position.y = a
    }, u.layoutPosition = function () {
        var t = this.layout.size,
            e = {},
            i = this.layout._getOption("originLeft"),
            n = this.layout._getOption("originTop"),
            s = i ? "paddingLeft" : "paddingRight",
            o = i ? "left" : "right",
            r = i ? "right" : "left",
            a = this.position.x + t[s];
        e[o] = this.getXValue(a), e[r] = "";
        var l = n ? "paddingTop" : "paddingBottom",
            h = n ? "top" : "bottom",
            u = n ? "bottom" : "top",
            c = this.position.y + t[l];
        e[h] = this.getYValue(c), e[u] = "", this.css(e), this.emitEvent("layout", [this])
    }, u.getXValue = function (t) {
        var e = this.layout._getOption("horizontal");
        return this.layout.options.percentPosition && !e ? t / this.layout.size.width * 100 + "%" : t + "px"
    }, u.getYValue = function (t) {
        var e = this.layout._getOption("horizontal");
        return this.layout.options.percentPosition && e ? t / this.layout.size.height * 100 + "%" : t + "px"
    }, u._transitionTo = function (t, e) {
        this.getPosition();
        var i = this.position.x,
            n = this.position.y,
            s = parseInt(t, 10),
            o = parseInt(e, 10),
            r = s === this.position.x && o === this.position.y;
        if (this.setPosition(t, e), !r || this.isTransitioning) {
            var a = t - i,
                l = e - n,
                h = {};
            h.transform = this.getTranslate(a, l), this.transition({
                to: h,
                onTransitionEnd: {
                    transform: this.layoutPosition
                },
                isCleaning: !0
            })
        } else this.layoutPosition()
    }, u.getTranslate = function (t, e) {
        var i, n;
        return "translate3d(" + (t = this.layout._getOption("originLeft") ? t : -t) + "px, " + (e = this.layout._getOption("originTop") ? e : -e) + "px, 0)"
    }, u.goTo = function (t, e) {
        this.setPosition(t, e), this.layoutPosition()
    }, u.moveTo = u._transitionTo, u.setPosition = function (t, e) {
        this.position.x = parseInt(t, 10), this.position.y = parseInt(e, 10)
    }, u._nonTransition = function (t) {
        for (var e in this.css(t.to), t.isCleaning && this._removeStyles(t.to), t.onTransitionEnd) t.onTransitionEnd[e].call(this)
    }, u.transition = function (t) {
        if (parseFloat(this.layout.options.transitionDuration)) {
            var e = this._transn;
            for (var i in t.onTransitionEnd) e.onEnd[i] = t.onTransitionEnd[i];
            for (i in t.to) e.ingProperties[i] = !0, t.isCleaning && (e.clean[i] = !0);
            if (t.from) {
                this.css(t.from);
                var n = this.element.offsetHeight;
                n = null
            }
            this.enableTransition(t.to), this.css(t.to), this.isTransitioning = !0
        } else this._nonTransition(t)
    };
    var c = "opacity," + n(a);
    u.enableTransition = function () {
        if (!this.isTransitioning) {
            var t = this.layout.options.transitionDuration;
            t = "number" == typeof t ? t + "ms" : t, this.css({
                transitionProperty: c,
                transitionDuration: t,
                transitionDelay: this.staggerDelay || 0
            }), this.element.addEventListener(l, this, !1)
        }
    }, u.onwebkitTransitionEnd = function (t) {
        this.ontransitionend(t)
    }, u.onotransitionend = function (t) {
        this.ontransitionend(t)
    };
    var d = {
        "-webkit-transform": "transform"
    };
    u.ontransitionend = function (t) {
        if (t.target === this.element) {
            var e = this._transn,
                i = d[t.propertyName] || t.propertyName,
                n;
            if (delete e.ingProperties[i], s(e.ingProperties) && this.disableTransition(), i in e.clean && (this.element.style[t.propertyName] = "", delete e.clean[i]), i in e.onEnd) e.onEnd[i].call(this), delete e.onEnd[i];
            this.emitEvent("transitionEnd", [this])
        }
    }, u.disableTransition = function () {
        this.removeTransitionStyles(), this.element.removeEventListener(l, this, !1), this.isTransitioning = !1
    }, u._removeStyles = function (t) {
        var e = {};
        for (var i in t) e[i] = "";
        this.css(e)
    };
    var p = {
        transitionProperty: "",
        transitionDuration: "",
        transitionDelay: ""
    };
    return u.removeTransitionStyles = function () {
        this.css(p)
    }, u.stagger = function (t) {
        t = isNaN(t) ? 0 : t, this.staggerDelay = t + "ms"
    }, u.removeElem = function () {
        this.element.parentNode.removeChild(this.element), this.css({
            display: ""
        }), this.emitEvent("remove", [this])
    }, u.remove = function () {
        return r && parseFloat(this.layout.options.transitionDuration) ? (this.once("transitionEnd", function () {
            this.removeElem()
        }), void this.hide()) : void this.removeElem()
    }, u.reveal = function () {
        delete this.isHidden, this.css({
            display: ""
        });
        var t = this.layout.options,
            e = {},
            i;
        e[this.getHideRevealTransitionEndProperty("visibleStyle")] = this.onRevealTransitionEnd, this.transition({
            from: t.hiddenStyle,
            to: t.visibleStyle,
            isCleaning: !0,
            onTransitionEnd: e
        })
    }, u.onRevealTransitionEnd = function () {
        this.isHidden || this.emitEvent("reveal")
    }, u.getHideRevealTransitionEndProperty = function (t) {
        var e = this.layout.options[t];
        if (e.opacity) return "opacity";
        for (var i in e) return i
    }, u.hide = function () {
        this.isHidden = !0, this.css({
            display: ""
        });
        var t = this.layout.options,
            e = {},
            i;
        e[this.getHideRevealTransitionEndProperty("hiddenStyle")] = this.onHideTransitionEnd, this.transition({
            from: t.visibleStyle,
            to: t.hiddenStyle,
            isCleaning: !0,
            onTransitionEnd: e
        })
    }, u.onHideTransitionEnd = function () {
        this.isHidden && (this.css({
            display: "none"
        }), this.emitEvent("hide"))
    }, u.destroy = function () {
        this.css({
            position: "",
            left: "",
            right: "",
            top: "",
            bottom: "",
            transition: "",
            transform: ""
        })
    }, i
}),
function (s, o) {
    "use strict";
    "function" == typeof define && define.amd ? define("outlayer/outlayer", ["ev-emitter/ev-emitter", "get-size/get-size", "fizzy-ui-utils/utils", "./item"], function (t, e, i, n) {
        return o(s, t, e, i, n)
    }) : "object" == typeof module && module.exports ? module.exports = o(s, require("ev-emitter"), require("get-size"), require("fizzy-ui-utils"), require("./item")) : s.Outlayer = o(s, s.EvEmitter, s.getSize, s.fizzyUIUtils, s.Outlayer.Item)
}(window, function (t, e, o, r, n) {
    "use strict";

    function s(t, e) {
        var i = r.getQueryElement(t);
        if (i) {
            this.element = i, h && (this.$element = h(this.element)), this.options = r.extend({}, this.constructor.defaults), this.option(e);
            var n = ++c,
                s;
            this.element.outlayerGUID = n, (d[n] = this)._create(), this._getOption("initLayout") && this.layout()
        } else l && l.error("Bad element for " + this.constructor.namespace + ": " + (i || t))
    }

    function a(t) {
        function e() {
            t.apply(this, arguments)
        }
        return e.prototype = Object.create(t.prototype), e.prototype.constructor = e
    }

    function i(t) {
        if ("number" == typeof t) return t;
        var e = t.match(/(^\d*\.?\d*)(\w*)/),
            i = e && e[1],
            n = e && e[2],
            s;
        return i.length ? (i = parseFloat(i)) * (f[n] || 1) : 0
    }
    var l = t.console,
        h = t.jQuery,
        u = function () {},
        c = 0,
        d = {};
    s.namespace = "outlayer", s.Item = n, s.defaults = {
        containerStyle: {
            position: "relative"
        },
        initLayout: !0,
        originLeft: !0,
        originTop: !0,
        resize: !0,
        resizeContainer: !0,
        transitionDuration: "0.4s",
        hiddenStyle: {
            opacity: 0,
            transform: "scale(0.001)"
        },
        visibleStyle: {
            opacity: 1,
            transform: "scale(1)"
        }
    };
    var p = s.prototype;
    r.extend(p, e.prototype), p.option = function (t) {
        r.extend(this.options, t)
    }, p._getOption = function (t) {
        var e = this.constructor.compatOptions[t];
        return e && void 0 !== this.options[e] ? this.options[e] : this.options[t]
    }, s.compatOptions = {
        initLayout: "isInitLayout",
        horizontal: "isHorizontal",
        layoutInstant: "isLayoutInstant",
        originLeft: "isOriginLeft",
        originTop: "isOriginTop",
        resize: "isResizeBound",
        resizeContainer: "isResizingContainer"
    }, p._create = function () {
        var t;
        this.reloadItems(), this.stamps = [], this.stamp(this.options.stamp), r.extend(this.element.style, this.options.containerStyle), this._getOption("resize") && this.bindResize()
    }, p.reloadItems = function () {
        this.items = this._itemize(this.element.children)
    }, p._itemize = function (t) {
        for (var e = this._filterFindItemElements(t), i = this.constructor.Item, n = [], s = 0; s < e.length; s++) {
            var o, r = new i(e[s], this);
            n.push(r)
        }
        return n
    }, p._filterFindItemElements = function (t) {
        return r.filterFindElements(t, this.options.itemSelector)
    }, p.getItemElements = function () {
        return this.items.map(function (t) {
            return t.element
        })
    }, p.layout = function () {
        this._resetLayout(), this._manageStamps();
        var t = this._getOption("layoutInstant"),
            e = void 0 !== t ? t : !this._isLayoutInited;
        this.layoutItems(this.items, e), this._isLayoutInited = !0
    }, p._init = p.layout, p._resetLayout = function () {
        this.getSize()
    }, p.getSize = function () {
        this.size = o(this.element)
    }, p._getMeasurement = function (t, e) {
        var i, n = this.options[t];
        this[t] = n ? ("string" == typeof n ? i = this.element.querySelector(n) : n instanceof HTMLElement && (i = n), i ? o(i)[e] : n) : 0
    }, p.layoutItems = function (t, e) {
        t = this._getItemsForLayout(t), this._layoutItems(t, e), this._postLayout()
    }, p._getItemsForLayout = function (t) {
        return t.filter(function (t) {
            return !t.isIgnored
        })
    }, p._layoutItems = function (t, i) {
        if (this._emitCompleteOnItems("layout", t), t && t.length) {
            var n = [];
            t.forEach(function (t) {
                var e = this._getItemLayoutPosition(t);
                e.item = t, e.isInstant = i || t.isLayoutInstant, n.push(e)
            }, this), this._processLayoutQueue(n)
        }
    }, p._getItemLayoutPosition = function () {
        return {
            x: 0,
            y: 0
        }
    }, p._processLayoutQueue = function (t) {
        this.updateStagger(), t.forEach(function (t, e) {
            this._positionItem(t.item, t.x, t.y, t.isInstant, e)
        }, this)
    }, p.updateStagger = function () {
        var t = this.options.stagger;
        return null == t ? void(this.stagger = 0) : (this.stagger = i(t), this.stagger)
    }, p._positionItem = function (t, e, i, n, s) {
        n ? t.goTo(e, i) : (t.stagger(s * this.stagger), t.moveTo(e, i))
    }, p._postLayout = function () {
        this.resizeContainer()
    }, p.resizeContainer = function () {
        var t;
        if (this._getOption("resizeContainer")) {
            var e = this._getContainerSize();
            e && (this._setContainerMeasure(e.width, !0), this._setContainerMeasure(e.height, !1))
        }
    }, p._getContainerSize = u, p._setContainerMeasure = function (t, e) {
        if (void 0 !== t) {
            var i = this.size;
            i.isBorderBox && (t += e ? i.paddingLeft + i.paddingRight + i.borderLeftWidth + i.borderRightWidth : i.paddingBottom + i.paddingTop + i.borderTopWidth + i.borderBottomWidth), t = Math.max(t, 0), this.element.style[e ? "width" : "height"] = t + "px"
        }
    }, p._emitCompleteOnItems = function (e, t) {
        function i() {
            s.dispatchEvent(e + "Complete", null, [t])
        }

        function n() {
            ++r == o && i()
        }
        var s = this,
            o = t.length;
        if (t && o) {
            var r = 0;
            t.forEach(function (t) {
                t.once(e, n)
            })
        } else i()
    }, p.dispatchEvent = function (t, e, i) {
        var n = e ? [e].concat(i) : i;
        if (this.emitEvent(t, n), h)
            if (this.$element = this.$element || h(this.element), e) {
                var s = h.Event(e);
                s.type = t, this.$element.trigger(s, i)
            } else this.$element.trigger(t, i)
    }, p.ignore = function (t) {
        var e = this.getItem(t);
        e && (e.isIgnored = !0)
    }, p.unignore = function (t) {
        var e = this.getItem(t);
        e && delete e.isIgnored
    }, p.stamp = function (t) {
        (t = this._find(t)) && (this.stamps = this.stamps.concat(t), t.forEach(this.ignore, this))
    }, p.unstamp = function (t) {
        (t = this._find(t)) && t.forEach(function (t) {
            r.removeFrom(this.stamps, t), this.unignore(t)
        }, this)
    }, p._find = function (t) {
        return t ? ("string" == typeof t && (t = this.element.querySelectorAll(t)), t = r.makeArray(t)) : void 0
    }, p._manageStamps = function () {
        this.stamps && this.stamps.length && (this._getBoundingRect(), this.stamps.forEach(this._manageStamp, this))
    }, p._getBoundingRect = function () {
        var t = this.element.getBoundingClientRect(),
            e = this.size;
        this._boundingRect = {
            left: t.left + e.paddingLeft + e.borderLeftWidth,
            top: t.top + e.paddingTop + e.borderTopWidth,
            right: t.right - (e.paddingRight + e.borderRightWidth),
            bottom: t.bottom - (e.paddingBottom + e.borderBottomWidth)
        }
    }, p._manageStamp = u, p._getElementOffset = function (t) {
        var e = t.getBoundingClientRect(),
            i = this._boundingRect,
            n = o(t),
            s;
        return {
            left: e.left - i.left - n.marginLeft,
            top: e.top - i.top - n.marginTop,
            right: i.right - e.right - n.marginRight,
            bottom: i.bottom - e.bottom - n.marginBottom
        }
    }, p.handleEvent = r.handleEvent, p.bindResize = function () {
        t.addEventListener("resize", this), this.isResizeBound = !0
    }, p.unbindResize = function () {
        t.removeEventListener("resize", this), this.isResizeBound = !1
    }, p.onresize = function () {
        this.resize()
    }, r.debounceMethod(s, "onresize", 100), p.resize = function () {
        this.isResizeBound && this.needsResizeLayout() && this.layout()
    }, p.needsResizeLayout = function () {
        var t = o(this.element),
            e;
        return this.size && t && t.innerWidth !== this.size.innerWidth
    }, p.addItems = function (t) {
        var e = this._itemize(t);
        return e.length && (this.items = this.items.concat(e)), e
    }, p.appended = function (t) {
        var e = this.addItems(t);
        e.length && (this.layoutItems(e, !0), this.reveal(e))
    }, p.prepended = function (t) {
        var e = this._itemize(t);
        if (e.length) {
            var i = this.items.slice(0);
            this.items = e.concat(i), this._resetLayout(), this._manageStamps(), this.layoutItems(e, !0), this.reveal(e), this.layoutItems(i)
        }
    }, p.reveal = function (t) {
        if (this._emitCompleteOnItems("reveal", t), t && t.length) {
            var i = this.updateStagger();
            t.forEach(function (t, e) {
                t.stagger(e * i), t.reveal()
            })
        }
    }, p.hide = function (t) {
        if (this._emitCompleteOnItems("hide", t), t && t.length) {
            var i = this.updateStagger();
            t.forEach(function (t, e) {
                t.stagger(e * i), t.hide()
            })
        }
    }, p.revealItemElements = function (t) {
        var e = this.getItems(t);
        this.reveal(e)
    }, p.hideItemElements = function (t) {
        var e = this.getItems(t);
        this.hide(e)
    }, p.getItem = function (t) {
        for (var e = 0; e < this.items.length; e++) {
            var i = this.items[e];
            if (i.element == t) return i
        }
    }, p.getItems = function (t) {
        t = r.makeArray(t);
        var i = [];
        return t.forEach(function (t) {
            var e = this.getItem(t);
            e && i.push(e)
        }, this), i
    }, p.remove = function (t) {
        var e = this.getItems(t);
        this._emitCompleteOnItems("remove", e), e && e.length && e.forEach(function (t) {
            t.remove(), r.removeFrom(this.items, t)
        }, this)
    }, p.destroy = function () {
        var t = this.element.style;
        t.height = "", t.position = "", t.width = "", this.items.forEach(function (t) {
            t.destroy()
        }), this.unbindResize();
        var e = this.element.outlayerGUID;
        delete d[e], delete this.element.outlayerGUID, h && h.removeData(this.element, this.constructor.namespace)
    }, s.data = function (t) {
        var e = (t = r.getQueryElement(t)) && t.outlayerGUID;
        return e && d[e]
    }, s.create = function (t, e) {
        var i = a(s);
        return i.defaults = r.extend({}, s.defaults), r.extend(i.defaults, e), i.compatOptions = r.extend({}, s.compatOptions), i.namespace = t, i.data = s.data, i.Item = a(n), r.htmlInit(i, t), h && h.bridget && h.bridget(t, i), i
    };
    var f = {
        ms: 1,
        s: 1e3
    };
    return s.Item = n, s
}),
function (t, e) {
    "function" == typeof define && define.amd ? define(["outlayer/outlayer", "get-size/get-size"], e) : "object" == typeof module && module.exports ? module.exports = e(require("outlayer"), require("get-size")) : t.Masonry = e(t.Outlayer, t.getSize)
}(window, function (t, c) {
    var e = t.create("masonry");
    e.compatOptions.fitWidth = "isFitWidth";
    var i = e.prototype;
    return i._resetLayout = function () {
        this.getSize(), this._getMeasurement("columnWidth", "outerWidth"), this._getMeasurement("gutter", "outerWidth"), this.measureColumns(), this.colYs = [];
        for (var t = 0; t < this.cols; t++) this.colYs.push(0);
        this.maxY = 0, this.horizontalColIndex = 0
    }, i.measureColumns = function () {
        if (this.getContainerWidth(), !this.columnWidth) {
            var t = this.items[0],
                e = t && t.element;
            this.columnWidth = e && c(e).outerWidth || this.containerWidth
        }
        var i = this.columnWidth += this.gutter,
            n = this.containerWidth + this.gutter,
            s = n / i,
            o = i - n % i,
            r;
        s = Math[o && o < 1 ? "round" : "floor"](s), this.cols = Math.max(s, 1)
    }, i.getContainerWidth = function () {
        var t, e = this._getOption("fitWidth") ? this.element.parentNode : this.element,
            i = c(e);
        this.containerWidth = i && i.innerWidth
    }, i._getItemLayoutPosition = function (t) {
        t.getSize();
        var e = t.size.outerWidth % this.columnWidth,
            i, n = Math[e && e < 1 ? "round" : "ceil"](t.size.outerWidth / this.columnWidth);
        n = Math.min(n, this.cols);
        for (var s, o = this[this.options.horizontalOrder ? "_getHorizontalColPosition" : "_getTopColPosition"](n, t), r = {
                x: this.columnWidth * o.col,
                y: o.y
            }, a = o.y + t.size.outerHeight, l = n + o.col, h = o.col; h < l; h++) this.colYs[h] = a;
        return r
    }, i._getTopColPosition = function (t) {
        var e = this._getTopColGroup(t),
            i = Math.min.apply(Math, e);
        return {
            col: e.indexOf(i),
            y: i
        }
    }, i._getTopColGroup = function (t) {
        if (t < 2) return this.colYs;
        for (var e = [], i = this.cols + 1 - t, n = 0; n < i; n++) e[n] = this._getColGroupY(n, t);
        return e
    }, i._getColGroupY = function (t, e) {
        if (e < 2) return this.colYs[t];
        var i = this.colYs.slice(t, t + e);
        return Math.max.apply(Math, i)
    }, i._getHorizontalColPosition = function (t, e) {
        var i = this.horizontalColIndex % this.cols,
            n;
        i = 1 < t && i + t > this.cols ? 0 : i;
        var s = e.size.outerWidth && e.size.outerHeight;
        return this.horizontalColIndex = s ? i + t : this.horizontalColIndex, {
            col: i,
            y: this._getColGroupY(i, t)
        }
    }, i._manageStamp = function (t) {
        var e = c(t),
            i = this._getElementOffset(t),
            n, s = this._getOption("originLeft") ? i.left : i.right,
            o = s + e.outerWidth,
            r = Math.floor(s / this.columnWidth);
        r = Math.max(0, r);
        var a = Math.floor(o / this.columnWidth);
        a -= o % this.columnWidth ? 0 : 1, a = Math.min(this.cols - 1, a);
        for (var l, h = (this._getOption("originTop") ? i.top : i.bottom) + e.outerHeight, u = r; u <= a; u++) this.colYs[u] = Math.max(h, this.colYs[u])
    }, i._getContainerSize = function () {
        this.maxY = Math.max.apply(Math, this.colYs);
        var t = {
            height: this.maxY
        };
        return this._getOption("fitWidth") && (t.width = this._getContainerFitWidth()), t
    }, i._getContainerFitWidth = function () {
        for (var t = 0, e = this.cols; --e && 0 === this.colYs[e];) t++;
        return (this.cols - t) * this.columnWidth - this.gutter
    }, i.needsResizeLayout = function () {
        var t = this.containerWidth;
        return this.getContainerWidth(), t != this.containerWidth
    }, e
}),
/*
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 * http://benalman.com/projects/jquery-throttle-debounce-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
function (t, c) {
    var e = t.jQuery || t.Cowboy || (t.Cowboy = {}),
        n;
    e.throttle = n = function (o, r, a, l) {
        function t() {
            function t() {
                u = +new Date, a.apply(i, s)
            }

            function e() {
                h = c
            }
            var i = this,
                n = +new Date - u,
                s = arguments;
            l && !h && t(), h && clearTimeout(h), l === c && o < n ? t() : !0 !== r && (h = setTimeout(l ? e : t, l === c ? o - n : o))
        }
        var h, u = 0;
        return "boolean" != typeof r && (l = a, a = r, r = c), e.guid && (t.guid = a.guid = a.guid || e.guid++), t
    }, e.debounce = function (t, e, i) {
        return i === c ? n(t, e, !1) : n(t, i, !1 !== e)
    }
}(this),
function (_, t, n, l) {
    "use strict";

    function s(t, e) {
        this.element = t;
        var s = {};
        _.each(_(this.element).data(), function (t, e) {
            var i, n = function (t) {
                return t && t[0].toLowerCase() + t.slice(1)
            }(t.replace("fluidbox", ""));
            ("" !== n || null !== n) && ("false" == e ? e = !1 : "true" == e && (e = !0), s[n] = e)
        }), this.settings = _.extend({}, i, e, s), this.settings.viewportFill = Math.max(Math.min(parseFloat(this.settings.viewportFill), 1), 0), this.settings.stackIndex < this.settings.stackIndexDelta && (settings.stackIndexDelta = settings.stackIndex), this._name = o, this.init()
    }
    var w = _(t),
        o = (_(n), "fluidbox"),
        i = {
            immediateOpen: !1,
            loader: !1,
            maxWidth: 0,
            maxHeight: 0,
            resizeThrottle: 500,
            stackIndex: 1e3,
            stackIndexDelta: 10,
            viewportFill: .95
        },
        b = {},
        r = 0;
    ("undefined" == typeof console || "undefined" === console.warn) && (console = {}, console.warn = function () {}), _.isFunction(_.throttle) || console.warn("Fluidbox: The jQuery debounce/throttle plugin is not found/loaded. Even though Fluidbox works without it, the window resize event will fire extremely rapidly in browsers, resulting in significant degradation in performance upon viewport resize.");
    var e, h = function () {
            var t, e = n.createElement("fakeelement"),
                i = {
                    transition: "transitionend",
                    OTransition: "oTransitionEnd",
                    MozTransition: "transitionend",
                    WebkitTransition: "webkitTransitionEnd"
                };
            for (t in i)
                if (e.style[t] !== l) return i[t]
        }(),
        a = {
            dom: function () {
                var t = _("<div />", {
                    class: "fluidbox__wrap",
                    css: {
                        zIndex: this.settings.stackIndex - this.settings.stackIndexDelta
                    }
                });
                if (_(this.element).addClass("fluidbox--closed").wrapInner(t).find("img").first().css({
                        opacity: 1
                    }).addClass("fluidbox__thumb").after('<div class="fluidbox__ghost" />'), this.settings.loader) {
                    var e = _("<div />", {
                        class: "fluidbox__loader",
                        css: {
                            zIndex: 2
                        }
                    });
                    _(this.element).find(".fluidbox__wrap").append(e)
                }
            },
            prepareFb: function () {
                var t = this,
                    e = _(this.element);
                e.trigger("thumbloaddone.fluidbox"), a.measure.fbElements.call(this), t.bindEvents(), e.addClass("fluidbox--ready"), t.bindListeners(), e.trigger("ready.fluidbox")
            },
            measure: {
                viewport: function () {
                    b.viewport = {
                        w: w.width(),
                        h: w.height()
                    }
                },
                fbElements: function () {
                    var t = this,
                        e = _(this.element),
                        i = e.find("img").first(),
                        n = e.find(".fluidbox__ghost"),
                        s = e.find(".fluidbox__wrap");
                    t.instanceData.thumb = {
                        natW: i[0].naturalWidth,
                        natH: i[0].naturalHeight,
                        w: i.width(),
                        h: i.height()
                    }, n.css({
                        width: i.width(),
                        height: i.height(),
                        top: i.offset().top - s.offset().top + parseInt(i.css("borderTopWidth")) + parseInt(i.css("paddingTop")),
                        left: i.offset().left - s.offset().left + parseInt(i.css("borderLeftWidth")) + parseInt(i.css("paddingLeft"))
                    })
                }
            },
            checkURL: function (t) {
                var e = 0;
                return /[\s+]/g.test(t) ? (console.warn("Fluidbox: Fluidbox opening is halted because it has detected characters in your URL string that need to be properly encoded/escaped. Whitespace(s) have to be escaped manually. See RFC3986 documentation."), e = 1) : /[\"\'\(\)]/g.test(t) && (console.warn("Fluidbox: Fluidbox opening will proceed, but it has detected characters in your URL string that need to be properly encoded/escaped. These will be escaped for you. See RFC3986 documentation."), e = 0), e
            },
            formatURL: function (t) {
                return t.replace(/"/g, "%22").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29")
            }
        };
    _.extend(s.prototype, {
        init: function () {
            var t = this,
                e = _(this.element),
                i = e.find("img").first();
            if (a.measure.viewport(), (!t.instanceData || !t.instanceData.initialized) && e.is("a") && 1 === e.children().length && (e.children().is("img") || e.children().is("picture") && 1 === e.find("img").length) && "none" !== e.css("display") && "none" !== e.children().css("display") && "none" !== e.parents().css("display")) {
                e.removeClass("fluidbox--destroyed"), t.instanceData = {}, t.instanceData.initialized = !0, t.instanceData.originalNode = e.html(), r += 1, t.instanceData.id = r, e.addClass("fluidbox__instance-" + r), e.addClass("fluidbox--initialized"), a.dom.call(t), e.trigger("init.fluidbox");
                var n = new Image;
                0 < i.width() && 0 < i.height() ? a.prepareFb.call(t) : (n.onload = function () {
                    a.prepareFb.call(t)
                }, n.onerror = function () {
                    e.trigger("thumbloadfail.fluidbox")
                }, n.src = i.attr("src"))
            }
        },
        open: function () {
            var t = this,
                e = _(this.element),
                i = e.find("img").first(),
                n = e.find(".fluidbox__ghost"),
                s = e.find(".fluidbox__wrap");
            t.instanceData.state = 1, n.off(h), _(".fluidbox--opened").fluidbox("close");
            var o = _("<div />", {
                    class: "fluidbox__overlay",
                    css: {
                        zIndex: -1
                    }
                }),
                r;
            if (s.append(o), e.removeClass("fluidbox--closed").addClass("fluidbox--loading"), a.checkURL(i.attr("src"))) return t.close(), !1;
            n.css({
                "background-image": "url(" + a.formatURL(i.attr("src")) + ")",
                opacity: 1
            }), a.measure.fbElements.call(t), t.settings.immediateOpen ? (e.addClass("fluidbox--opened fluidbox--loaded").find(".fluidbox__wrap").css({
                zIndex: t.settings.stackIndex + t.settings.stackIndexDelta
            }), e.trigger("openstart.fluidbox"), t.compute(), i.css({
                opacity: 0
            }), _(".fluidbox__overlay").css({
                opacity: 1
            }), n.one(h, function () {
                e.trigger("openend.fluidbox")
            }), (r = new Image).onload = function () {
                if (e.trigger("imageloaddone.fluidbox"), 1 === t.instanceData.state) {
                    if (t.instanceData.thumb.natW = r.naturalWidth, t.instanceData.thumb.natH = r.naturalHeight, e.removeClass("fluidbox--loading"), a.checkURL(r.src)) return t.close({
                        error: !0
                    }), !1;
                    n.css({
                        "background-image": "url(" + a.formatURL(r.src) + ")"
                    }), t.compute()
                }
            }, r.onerror = function () {
                t.close({
                    error: !0
                }), e.trigger("imageloadfail.fluidbox"), e.trigger("delayedloadfail.fluidbox")
            }) : ((r = new Image).onload = function () {
                return e.trigger("imageloaddone.fluidbox"), e.removeClass("fluidbox--loading").addClass("fluidbox--opened fluidbox--loaded").find(".fluidbox__wrap").css({
                    zIndex: t.settings.stackIndex + t.settings.stackIndexDelta
                }), e.trigger("openstart.fluidbox"), a.checkURL(r.src) ? (t.close({
                    error: !0
                }), !1) : (n.css({
                    "background-image": "url(" + a.formatURL(r.src) + ")"
                }), t.instanceData.thumb.natW = r.naturalWidth, t.instanceData.thumb.natH = r.naturalHeight, t.compute(), i.css({
                    opacity: 0
                }), _(".fluidbox__overlay").css({
                    opacity: 1
                }), void n.one(h, function () {
                    e.trigger("openend.fluidbox")
                }))
            }, r.onerror = function () {
                t.close({
                    error: !0
                }), e.trigger("imageloadfail.fluidbox")
            }), r.src = e.attr("href")
        },
        compute: function () {
            var t = this,
                e = _(this.element),
                i = e.find("img").first(),
                n = e.find(".fluidbox__ghost"),
                s = e.find(".fluidbox__wrap"),
                o = t.instanceData.thumb.natW,
                r = t.instanceData.thumb.natH,
                a = t.instanceData.thumb.w,
                l = t.instanceData.thumb.h,
                h = o / r,
                u = b.viewport.w / b.viewport.h,
                c, d, p, f, g;
            0 < t.settings.maxWidth ? r = (o = t.settings.maxWidth) / h : 0 < t.settings.maxHeight && (o = (r = t.settings.maxHeight) * h), g = h < u ? (f = o * (l * (p = (c = r < b.viewport.h ? r : b.viewport.h * t.settings.viewportFill) / l) / r) / a, p) : (p = r * (a * (f = (d = o < b.viewport.w ? o : b.viewport.w * t.settings.viewportFill) / a) / o) / l, f), t.settings.maxWidth && t.settings.maxHeight && console.warn("Fluidbox: Both maxHeight and maxWidth are specified. You can only specify one. If both are specified, only the maxWidth property will be respected. This will not generate any error, but may cause unexpected sizing behavior.");
            var m = w.scrollTop() - i.offset().top + l * (g - 1) * .5 + .5 * (w.height() - l * g),
                v = a * (g - 1) * .5 + .5 * (w.width() - a * g) - i.offset().left,
                y = parseInt(100 * f) / 100 + "," + parseInt(100 * p) / 100;
            n.css({
                transform: "translate(" + parseInt(100 * v) / 100 + "px," + parseInt(100 * m) / 100 + "px) scale(" + y + ")",
                top: i.offset().top - s.offset().top,
                left: i.offset().left - s.offset().left
            }), e.find(".fluidbox__loader").css({
                transform: "translate(" + parseInt(100 * v) / 100 + "px," + parseInt(100 * m) / 100 + "px) scale(" + y + ")"
            }), e.trigger("computeend.fluidbox")
        },
        recompute: function () {
            this.compute()
        },
        close: function (t) {
            var e = this,
                i = _(this.element),
                n = i.find("img").first(),
                s = i.find(".fluidbox__ghost"),
                o = i.find(".fluidbox__wrap"),
                r = i.find(".fluidbox__overlay"),
                a = _.extend(null, {
                    error: !1
                }, t);
            return null !== e.instanceData.state && typeof e.instanceData.state != typeof l && 0 !== e.instanceData.state && (e.instanceData.state = 0, i.trigger("closestart.fluidbox"), i.removeClass(function (t, e) {
                return (e.match(/(^|\s)fluidbox--(opened|loaded|loading)+/g) || []).join(" ")
            }).addClass("fluidbox--closed"), s.css({
                transform: "translate(0,0) scale(1,1)",
                top: n.offset().top - o.offset().top + parseInt(n.css("borderTopWidth")) + parseInt(n.css("paddingTop")),
                left: n.offset().left - o.offset().left + parseInt(n.css("borderLeftWidth")) + parseInt(n.css("paddingLeft"))
            }), i.find(".fluidbox__loader").css({
                transform: "none"
            }), s.one(h, function () {
                s.css({
                    opacity: 0
                }), n.css({
                    opacity: 1
                }), r.remove(), o.css({
                    zIndex: e.settings.stackIndex - e.settings.stackIndexDelta
                }), i.trigger("closeend.fluidbox")
            }), a.error && s.trigger("transitionend"), void r.css({
                opacity: 0
            }))
        },
        bindEvents: function () {
            var e = this,
                t;
            _(this.element).on("click.fluidbox", function (t) {
                t.preventDefault(), e.instanceData.state && 0 !== e.instanceData.state ? e.close() : e.open()
            })
        },
        bindListeners: function () {
            var t = this,
                e = _(this.element),
                i = function () {
                    a.measure.viewport(), a.measure.fbElements.call(t), e.hasClass("fluidbox--opened") && t.compute()
                };
            _.isFunction(_.throttle) ? w.on("resize.fluidbox" + t.instanceData.id, _.throttle(t.settings.resizeThrottle, i)) : w.on("resize.fluidbox" + t.instanceData.id, i), e.on("reposition.fluidbox", function () {
                t.reposition()
            }), e.on("recompute.fluidbox, compute.fluidbox", function () {
                t.compute()
            }), e.on("destroy.fluidbox", function () {
                t.destroy()
            }), e.on("close.fluidbox", function () {
                t.close()
            })
        },
        unbind: function () {
            _(this.element).off("click.fluidbox reposition.fluidbox recompute.fluidbox compute.fluidbox destroy.fluidbox close.fluidbox"), w.off("resize.fluidbox" + this.instanceData.id)
        },
        reposition: function () {
            a.measure.fbElements.call(this)
        },
        destroy: function () {
            var t = this.instanceData.originalNode;
            this.unbind(), _.data(this.element, "plugin_" + o, null), _(this.element).removeClass(function (t, e) {
                return (e.match(/(^|\s)fluidbox[--|__]\S+/g) || []).join(" ")
            }).empty().html(t).addClass("fluidbox--destroyed").trigger("destroyed.fluidbox")
        },
        getMetadata: function () {
            return this.instanceData
        }
    }), _.fn[o] = function (e) {
        var i = arguments,
            n;
        return e === l || "object" == typeof e ? this.each(function () {
            _.data(this, "plugin_" + o) || _.data(this, "plugin_" + o, new s(this, e))
        }) : "string" != typeof e || "_" === e[0] || "init" === e ? this : (this.each(function () {
            var t = _.data(this, "plugin_" + o);
            t instanceof s && "function" == typeof t[e] ? n = t[e].apply(t, Array.prototype.slice.call(i, 1)) : console.warn('Fluidbox: The method "' + e + '" used is not defined in Fluidbox. Please make sure you are calling the correct public method.')
        }), n !== l ? n : this)
    }
}(jQuery, window, document),
function (l, i, s, o) {
    function h(t, e) {
        this.settings = null, this.options = l.extend({}, h.Defaults, e), this.$element = l(t), this._handlers = {}, this._plugins = {}, this._supress = {}, this._current = null, this._speed = null, this._coordinates = [], this._breakpoint = null, this._width = null, this._items = [], this._clones = [], this._mergers = [], this._widths = [], this._invalidated = {}, this._pipe = [], this._drag = {
            time: null,
            target: null,
            pointer: null,
            stage: {
                start: null,
                current: null
            },
            direction: null
        }, this._states = {
            current: {},
            tags: {
                initializing: ["busy"],
                animating: ["busy"],
                dragging: ["interacting"]
            }
        }, l.each(["onResize", "onThrottledResize"], l.proxy(function (t, e) {
            this._handlers[e] = l.proxy(this[e], this)
        }, this)), l.each(h.Plugins, l.proxy(function (t, e) {
            this._plugins[t.charAt(0).toLowerCase() + t.slice(1)] = new e(this)
        }, this)), l.each(h.Workers, l.proxy(function (t, e) {
            this._pipe.push({
                filter: e.filter,
                run: l.proxy(e.run, this)
            })
        }, this)), this.setup(), this.initialize()
    }
    h.Defaults = {
        items: 3,
        loop: !1,
        center: !1,
        rewind: !1,
        mouseDrag: !0,
        touchDrag: !0,
        pullDrag: !0,
        freeDrag: !1,
        margin: 0,
        stagePadding: 0,
        merge: !1,
        mergeFit: !0,
        autoWidth: !1,
        startPosition: 0,
        rtl: !1,
        smartSpeed: 250,
        fluidSpeed: !1,
        dragEndSpeed: !1,
        responsive: {},
        responsiveRefreshRate: 200,
        responsiveBaseElement: i,
        fallbackEasing: "swing",
        info: !1,
        nestedItemSelector: !1,
        itemElement: "div",
        stageElement: "div",
        refreshClass: "owl-refresh",
        loadedClass: "owl-loaded",
        loadingClass: "owl-loading",
        rtlClass: "owl-rtl",
        responsiveClass: "owl-responsive",
        dragClass: "owl-drag",
        itemClass: "owl-item",
        stageClass: "owl-stage",
        stageOuterClass: "owl-stage-outer",
        grabClass: "owl-grab"
    }, h.Width = {
        Default: "default",
        Inner: "inner",
        Outer: "outer"
    }, h.Type = {
        Event: "event",
        State: "state"
    }, h.Plugins = {}, h.Workers = [{
        filter: ["width", "settings"],
        run: function () {
            this._width = this.$element.width()
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function (t) {
            t.current = this._items && this._items[this.relative(this._current)]
        }
    }, {
        filter: ["items", "settings"],
        run: function () {
            this.$stage.children(".cloned").remove()
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function (t) {
            var e = this.settings.margin || "",
                i = !this.settings.autoWidth,
                n = this.settings.rtl,
                s = {
                    width: "auto",
                    "margin-left": n ? e : "",
                    "margin-right": n ? "" : e
                };
            !i && this.$stage.children().css(s), t.css = s
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function (t) {
            var e = (this.width() / this.settings.items).toFixed(3) - this.settings.margin,
                i = null,
                n = this._items.length,
                s = !this.settings.autoWidth,
                o = [];
            for (t.items = {
                    merge: !1,
                    width: e
                }; n--;) i = this._mergers[n], i = this.settings.mergeFit && Math.min(i, this.settings.items) || i, t.items.merge = 1 < i || t.items.merge, o[n] = s ? e * i : this._items[n].width();
            this._widths = o
        }
    }, {
        filter: ["items", "settings"],
        run: function () {
            var t = [],
                e = this._items,
                i = this.settings,
                n = Math.max(2 * i.items, 4),
                s = 2 * Math.ceil(e.length / 2),
                o = i.loop && e.length ? i.rewind ? n : Math.max(n, s) : 0,
                r = "",
                a = "";
            for (o /= 2; 0 < o;) t.push(this.normalize(t.length / 2, !0)), r += e[t[t.length - 1]][0].outerHTML, t.push(this.normalize(e.length - 1 - (t.length - 1) / 2, !0)), a = e[t[t.length - 1]][0].outerHTML + a, o -= 1;
            this._clones = t, l(r).addClass("cloned").appendTo(this.$stage), l(a).addClass("cloned").prependTo(this.$stage)
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function () {
            for (var t = this.settings.rtl ? 1 : -1, e = this._clones.length + this._items.length, i = -1, n = 0, s = 0, o = []; ++i < e;) n = o[i - 1] || 0, s = this._widths[this.relative(i)] + this.settings.margin, o.push(n + s * t);
            this._coordinates = o
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function () {
            var t = this.settings.stagePadding,
                e = this._coordinates,
                i = {
                    width: Math.ceil(Math.abs(e[e.length - 1])) + 2 * t,
                    "padding-left": t || "",
                    "padding-right": t || ""
                };
            this.$stage.css(i)
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function (t) {
            var e = this._coordinates.length,
                i = !this.settings.autoWidth,
                n = this.$stage.children();
            if (i && t.items.merge)
                for (; e--;) t.css.width = this._widths[this.relative(e)], n.eq(e).css(t.css);
            else i && (t.css.width = t.items.width, n.css(t.css))
        }
    }, {
        filter: ["items"],
        run: function () {
            this._coordinates.length < 1 && this.$stage.removeAttr("style")
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function (t) {
            t.current = t.current ? this.$stage.children().index(t.current) : 0, t.current = Math.max(this.minimum(), Math.min(this.maximum(), t.current)), this.reset(t.current)
        }
    }, {
        filter: ["position"],
        run: function () {
            this.animate(this.coordinates(this._current))
        }
    }, {
        filter: ["width", "position", "items", "settings"],
        run: function () {
            var t, e, i, n, s = this.settings.rtl ? 1 : -1,
                o = 2 * this.settings.stagePadding,
                r = this.coordinates(this.current()) + o,
                a = r + this.width() * s,
                l = [];
            for (i = 0, n = this._coordinates.length; i < n; i++) t = this._coordinates[i - 1] || 0, e = Math.abs(this._coordinates[i]) + o * s, (this.op(t, "<=", r) && this.op(t, ">", a) || this.op(e, "<", r) && this.op(e, ">", a)) && l.push(i);
            this.$stage.children(".active").removeClass("active"), this.$stage.children(":eq(" + l.join("), :eq(") + ")").addClass("active"), this.$stage.children(".center").removeClass("center"), this.settings.center && this.$stage.children().eq(this.current()).addClass("center")
        }
    }], h.prototype.initialize = function () {
        var t, e, i;
        (this.enter("initializing"), this.trigger("initialize"), this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl), this.settings.autoWidth && !this.is("pre-loading")) && (t = this.$element.find("img"), e = this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : o, i = this.$element.children(e).width(), t.length && i <= 0 && this.preloadAutoWidthImages(t));
        this.$element.addClass(this.options.loadingClass), this.$stage = l("<" + this.settings.stageElement + ' class="' + this.settings.stageClass + '"/>').wrap('<div class="' + this.settings.stageOuterClass + '"/>'), this.$element.append(this.$stage.parent()), this.replace(this.$element.children().not(this.$stage.parent())), this.$element.is(":visible") ? this.refresh() : this.invalidate("width"), this.$element.removeClass(this.options.loadingClass).addClass(this.options.loadedClass), this.registerEventHandlers(), this.leave("initializing"), this.trigger("initialized")
    }, h.prototype.setup = function () {
        var e = this.viewport(),
            t = this.options.responsive,
            i = -1,
            n = null;
        t ? (l.each(t, function (t) {
            t <= e && i < t && (i = Number(t))
        }), "function" == typeof (n = l.extend({}, this.options, t[i])).stagePadding && (n.stagePadding = n.stagePadding()), delete n.responsive, n.responsiveClass && this.$element.attr("class", this.$element.attr("class").replace(new RegExp("(" + this.options.responsiveClass + "-)\\S+\\s", "g"), "$1" + i))) : n = l.extend({}, this.options), this.trigger("change", {
            property: {
                name: "settings",
                value: n
            }
        }), this._breakpoint = i, this.settings = n, this.invalidate("settings"), this.trigger("changed", {
            property: {
                name: "settings",
                value: this.settings
            }
        })
    }, h.prototype.optionsLogic = function () {
        this.settings.autoWidth && (this.settings.stagePadding = !1, this.settings.merge = !1)
    }, h.prototype.prepare = function (t) {
        var e = this.trigger("prepare", {
            content: t
        });
        return e.data || (e.data = l("<" + this.settings.itemElement + "/>").addClass(this.options.itemClass).append(t)), this.trigger("prepared", {
            content: e.data
        }), e.data
    }, h.prototype.update = function () {
        for (var t = 0, e = this._pipe.length, i = l.proxy(function (t) {
                return this[t]
            }, this._invalidated), n = {}; t < e;)(this._invalidated.all || 0 < l.grep(this._pipe[t].filter, i).length) && this._pipe[t].run(n), t++;
        this._invalidated = {}, !this.is("valid") && this.enter("valid")
    }, h.prototype.width = function (t) {
        switch (t = t || h.Width.Default) {
            case h.Width.Inner:
            case h.Width.Outer:
                return this._width;
            default:
                return this._width - 2 * this.settings.stagePadding + this.settings.margin
        }
    }, h.prototype.refresh = function () {
        this.enter("refreshing"), this.trigger("refresh"), this.setup(), this.optionsLogic(), this.$element.addClass(this.options.refreshClass), this.update(), this.$element.removeClass(this.options.refreshClass), this.leave("refreshing"), this.trigger("refreshed")
    }, h.prototype.onThrottledResize = function () {
        i.clearTimeout(this.resizeTimer), this.resizeTimer = i.setTimeout(this._handlers.onResize, this.settings.responsiveRefreshRate)
    }, h.prototype.onResize = function () {
        return !!this._items.length && this._width !== this.$element.width() && !!this.$element.is(":visible") && (this.enter("resizing"), this.trigger("resize").isDefaultPrevented() ? (this.leave("resizing"), !1) : (this.invalidate("width"), this.refresh(), this.leave("resizing"), void this.trigger("resized")))
    }, h.prototype.registerEventHandlers = function () {
        l.support.transition && this.$stage.on(l.support.transition.end + ".owl.core", l.proxy(this.onTransitionEnd, this)), !1 !== this.settings.responsive && this.on(i, "resize", this._handlers.onThrottledResize), this.settings.mouseDrag && (this.$element.addClass(this.options.dragClass), this.$stage.on("mousedown.owl.core", l.proxy(this.onDragStart, this)), this.$stage.on("dragstart.owl.core selectstart.owl.core", function () {
            return !1
        })), this.settings.touchDrag && (this.$stage.on("touchstart.owl.core", l.proxy(this.onDragStart, this)), this.$stage.on("touchcancel.owl.core", l.proxy(this.onDragEnd, this)))
    }, h.prototype.onDragStart = function (t) {
        var e = null;
        3 !== t.which && (e = l.support.transform ? {
            x: (e = this.$stage.css("transform").replace(/.*\(|\)| /g, "").split(","))[16 === e.length ? 12 : 4],
            y: e[16 === e.length ? 13 : 5]
        } : (e = this.$stage.position(), {
            x: this.settings.rtl ? e.left + this.$stage.width() - this.width() + this.settings.margin : e.left,
            y: e.top
        }), this.is("animating") && (l.support.transform ? this.animate(e.x) : this.$stage.stop(), this.invalidate("position")), this.$element.toggleClass(this.options.grabClass, "mousedown" === t.type), this.speed(0), this._drag.time = (new Date).getTime(), this._drag.target = l(t.target), this._drag.stage.start = e, this._drag.stage.current = e, this._drag.pointer = this.pointer(t), l(s).on("mouseup.owl.core touchend.owl.core", l.proxy(this.onDragEnd, this)), l(s).one("mousemove.owl.core touchmove.owl.core", l.proxy(function (t) {
            var e = this.difference(this._drag.pointer, this.pointer(t));
            l(s).on("mousemove.owl.core touchmove.owl.core", l.proxy(this.onDragMove, this)), Math.abs(e.x) < Math.abs(e.y) && this.is("valid") || (t.preventDefault(), this.enter("dragging"), this.trigger("drag"))
        }, this)))
    }, h.prototype.onDragMove = function (t) {
        var e = null,
            i = null,
            n = null,
            s = this.difference(this._drag.pointer, this.pointer(t)),
            o = this.difference(this._drag.stage.start, s);
        this.is("dragging") && (t.preventDefault(), this.settings.loop ? (e = this.coordinates(this.minimum()), i = this.coordinates(this.maximum() + 1) - e, o.x = ((o.x - e) % i + i) % i + e) : (e = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum()), i = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum()), n = this.settings.pullDrag ? -1 * s.x / 5 : 0, o.x = Math.max(Math.min(o.x, e + n), i + n)), this._drag.stage.current = o, this.animate(o.x))
    }, h.prototype.onDragEnd = function (t) {
        var e = this.difference(this._drag.pointer, this.pointer(t)),
            i = this._drag.stage.current,
            n = 0 < e.x ^ this.settings.rtl ? "left" : "right";
        l(s).off(".owl.core"), this.$element.removeClass(this.options.grabClass), (0 !== e.x && this.is("dragging") || !this.is("valid")) && (this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed), this.current(this.closest(i.x, 0 !== e.x ? n : this._drag.direction)), this.invalidate("position"), this.update(), this._drag.direction = n, (3 < Math.abs(e.x) || 300 < (new Date).getTime() - this._drag.time) && this._drag.target.one("click.owl.core", function () {
            return !1
        })), this.is("dragging") && (this.leave("dragging"), this.trigger("dragged"))
    }, h.prototype.closest = function (i, n) {
        var s = -1,
            t = 30,
            o = this.width(),
            r = this.coordinates();
        return this.settings.freeDrag || l.each(r, l.proxy(function (t, e) {
            return "left" === n && e - 30 < i && i < e + 30 ? s = t : "right" === n && e - o - 30 < i && i < e - o + 30 ? s = t + 1 : this.op(i, "<", e) && this.op(i, ">", r[t + 1] || e - o) && (s = "left" === n ? t + 1 : t), -1 === s
        }, this)), this.settings.loop || (this.op(i, ">", r[this.minimum()]) ? s = i = this.minimum() : this.op(i, "<", r[this.maximum()]) && (s = i = this.maximum())), s
    }, h.prototype.animate = function (t) {
        var e = 0 < this.speed();
        this.is("animating") && this.onTransitionEnd(), e && (this.enter("animating"), this.trigger("translate")), l.support.transform3d && l.support.transition ? this.$stage.css({
            transform: "translate3d(" + t + "px,0px,0px)",
            transition: this.speed() / 1e3 + "s"
        }) : e ? this.$stage.animate({
            left: t + "px"
        }, this.speed(), this.settings.fallbackEasing, l.proxy(this.onTransitionEnd, this)) : this.$stage.css({
            left: t + "px"
        })
    }, h.prototype.is = function (t) {
        return this._states.current[t] && 0 < this._states.current[t]
    }, h.prototype.current = function (t) {
        if (t === o) return this._current;
        if (0 === this._items.length) return o;
        if (t = this.normalize(t), this._current !== t) {
            var e = this.trigger("change", {
                property: {
                    name: "position",
                    value: t
                }
            });
            e.data !== o && (t = this.normalize(e.data)), this._current = t, this.invalidate("position"), this.trigger("changed", {
                property: {
                    name: "position",
                    value: this._current
                }
            })
        }
        return this._current
    }, h.prototype.invalidate = function (t) {
        return "string" === l.type(t) && (this._invalidated[t] = !0, this.is("valid") && this.leave("valid")), l.map(this._invalidated, function (t, e) {
            return e
        })
    }, h.prototype.reset = function (t) {
        (t = this.normalize(t)) !== o && (this._speed = 0, this._current = t, this.suppress(["translate", "translated"]), this.animate(this.coordinates(t)), this.release(["translate", "translated"]))
    }, h.prototype.normalize = function (t, e) {
        var i = this._items.length,
            n = e ? 0 : this._clones.length;
        return !this.isNumeric(t) || i < 1 ? t = o : (t < 0 || i + n <= t) && (t = ((t - n / 2) % i + i) % i + n / 2), t
    }, h.prototype.relative = function (t) {
        return t -= this._clones.length / 2, this.normalize(t, !0)
    }, h.prototype.maximum = function (t) {
        var e, i, n, s = this.settings,
            o = this._coordinates.length;
        if (s.loop) o = this._clones.length / 2 + this._items.length - 1;
        else if (s.autoWidth || s.merge) {
            if (e = this._items.length)
                for (i = this._items[--e].width(), n = this.$element.width(); e-- && !((i += this._items[e].width() + this.settings.margin) > n););
            o = e + 1
        } else o = s.center ? this._items.length - 1 : this._items.length - s.items;
        return t && (o -= this._clones.length / 2), Math.max(o, 0)
    }, h.prototype.minimum = function (t) {
        return t ? 0 : this._clones.length / 2
    }, h.prototype.items = function (t) {
        return t === o ? this._items.slice() : (t = this.normalize(t, !0), this._items[t])
    }, h.prototype.mergers = function (t) {
        return t === o ? this._mergers.slice() : (t = this.normalize(t, !0), this._mergers[t])
    }, h.prototype.clones = function (i) {
        var e = this._clones.length / 2,
            n = e + this._items.length,
            s = function (t) {
                return t % 2 == 0 ? n + t / 2 : e - (t + 1) / 2
            };
        return i === o ? l.map(this._clones, function (t, e) {
            return s(e)
        }) : l.map(this._clones, function (t, e) {
            return t === i ? s(e) : null
        })
    }, h.prototype.speed = function (t) {
        return t !== o && (this._speed = t), this._speed
    }, h.prototype.coordinates = function (t) {
        var e, i = 1,
            n = t - 1;
        return t === o ? l.map(this._coordinates, l.proxy(function (t, e) {
            return this.coordinates(e)
        }, this)) : (this.settings.center ? (this.settings.rtl && (i = -1, n = t + 1), e = this._coordinates[t], e += (this.width() - e + (this._coordinates[n] || 0)) / 2 * i) : e = this._coordinates[n] || 0, e = Math.ceil(e))
    }, h.prototype.duration = function (t, e, i) {
        return 0 === i ? 0 : Math.min(Math.max(Math.abs(e - t), 1), 6) * Math.abs(i || this.settings.smartSpeed)
    }, h.prototype.to = function (t, e) {
        var i = this.current(),
            n = null,
            s = t - this.relative(i),
            o = (0 < s) - (s < 0),
            r = this._items.length,
            a = this.minimum(),
            l = this.maximum();
        this.settings.loop ? (!this.settings.rewind && Math.abs(s) > r / 2 && (s += -1 * o * r), (n = (((t = i + s) - a) % r + r) % r + a) !== t && n - s <= l && 0 < n - s && (i = n - s, t = n, this.reset(i))) : t = this.settings.rewind ? (t % (l += 1) + l) % l : Math.max(a, Math.min(l, t)), this.speed(this.duration(i, t, e)), this.current(t), this.$element.is(":visible") && this.update()
    }, h.prototype.next = function (t) {
        t = t || !1, this.to(this.relative(this.current()) + 1, t)
    }, h.prototype.prev = function (t) {
        t = t || !1, this.to(this.relative(this.current()) - 1, t)
    }, h.prototype.onTransitionEnd = function (t) {
        if (t !== o && (t.stopPropagation(), (t.target || t.srcElement || t.originalTarget) !== this.$stage.get(0))) return !1;
        this.leave("animating"), this.trigger("translated")
    }, h.prototype.viewport = function () {
        var t;
        return this.options.responsiveBaseElement !== i ? t = l(this.options.responsiveBaseElement).width() : i.innerWidth ? t = i.innerWidth : s.documentElement && s.documentElement.clientWidth ? t = s.documentElement.clientWidth : console.warn("Can not detect viewport width."), t
    }, h.prototype.replace = function (t) {
        this.$stage.empty(), this._items = [], t && (t = t instanceof jQuery ? t : l(t)), this.settings.nestedItemSelector && (t = t.find("." + this.settings.nestedItemSelector)), t.filter(function () {
            return 1 === this.nodeType
        }).each(l.proxy(function (t, e) {
            e = this.prepare(e), this.$stage.append(e), this._items.push(e), this._mergers.push(1 * e.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)
        }, this)), this.reset(this.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0), this.invalidate("items")
    }, h.prototype.add = function (t, e) {
        var i = this.relative(this._current);
        e = e === o ? this._items.length : this.normalize(e, !0), t = t instanceof jQuery ? t : l(t), this.trigger("add", {
            content: t,
            position: e
        }), t = this.prepare(t), 0 === this._items.length || e === this._items.length ? (0 === this._items.length && this.$stage.append(t), 0 !== this._items.length && this._items[e - 1].after(t), this._items.push(t), this._mergers.push(1 * t.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)) : (this._items[e].before(t), this._items.splice(e, 0, t), this._mergers.splice(e, 0, 1 * t.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)), this._items[i] && this.reset(this._items[i].index()), this.invalidate("items"), this.trigger("added", {
            content: t,
            position: e
        })
    }, h.prototype.remove = function (t) {
        (t = this.normalize(t, !0)) !== o && (this.trigger("remove", {
            content: this._items[t],
            position: t
        }), this._items[t].remove(), this._items.splice(t, 1), this._mergers.splice(t, 1), this.invalidate("items"), this.trigger("removed", {
            content: null,
            position: t
        }))
    }, h.prototype.preloadAutoWidthImages = function (t) {
        t.each(l.proxy(function (t, e) {
            this.enter("pre-loading"), e = l(e), l(new Image).one("load", l.proxy(function (t) {
                e.attr("src", t.target.src), e.css("opacity", 1), this.leave("pre-loading"), !this.is("pre-loading") && !this.is("initializing") && this.refresh()
            }, this)).attr("src", e.attr("src") || e.attr("data-src") || e.attr("data-src-retina"))
        }, this))
    }, h.prototype.destroy = function () {
        for (var t in this.$element.off(".owl.core"), this.$stage.off(".owl.core"), l(s).off(".owl.core"), !1 !== this.settings.responsive && (i.clearTimeout(this.resizeTimer), this.off(i, "resize", this._handlers.onThrottledResize)), this._plugins) this._plugins[t].destroy();
        this.$stage.children(".cloned").remove(), this.$stage.unwrap(), this.$stage.children().contents().unwrap(), this.$stage.children().unwrap(), this.$stage.remove(), this.$element.removeClass(this.options.refreshClass).removeClass(this.options.loadingClass).removeClass(this.options.loadedClass).removeClass(this.options.rtlClass).removeClass(this.options.dragClass).removeClass(this.options.grabClass).attr("class", this.$element.attr("class").replace(new RegExp(this.options.responsiveClass + "-\\S+\\s", "g"), "")).removeData("owl.carousel")
    }, h.prototype.op = function (t, e, i) {
        var n = this.settings.rtl;
        switch (e) {
            case "<":
                return n ? i < t : t < i;
            case ">":
                return n ? t < i : i < t;
            case ">=":
                return n ? t <= i : i <= t;
            case "<=":
                return n ? i <= t : t <= i
        }
    }, h.prototype.on = function (t, e, i, n) {
        t.addEventListener ? t.addEventListener(e, i, n) : t.attachEvent && t.attachEvent("on" + e, i)
    }, h.prototype.off = function (t, e, i, n) {
        t.removeEventListener ? t.removeEventListener(e, i, n) : t.detachEvent && t.detachEvent("on" + e, i)
    }, h.prototype.trigger = function (t, e, i, n, s) {
        var o = {
                item: {
                    count: this._items.length,
                    index: this.current()
                }
            },
            r = l.camelCase(l.grep(["on", t, i], function (t) {
                return t
            }).join("-").toLowerCase()),
            a = l.Event([t, "owl", i || "carousel"].join(".").toLowerCase(), l.extend({
                relatedTarget: this
            }, o, e));
        return this._supress[t] || (l.each(this._plugins, function (t, e) {
            e.onTrigger && e.onTrigger(a)
        }), this.register({
            type: h.Type.Event,
            name: t
        }), this.$element.trigger(a), this.settings && "function" == typeof this.settings[r] && this.settings[r].call(this, a)), a
    }, h.prototype.enter = function (t) {
        l.each([t].concat(this._states.tags[t] || []), l.proxy(function (t, e) {
            this._states.current[e] === o && (this._states.current[e] = 0), this._states.current[e]++
        }, this))
    }, h.prototype.leave = function (t) {
        l.each([t].concat(this._states.tags[t] || []), l.proxy(function (t, e) {
            this._states.current[e]--
        }, this))
    }, h.prototype.register = function (i) {
        if (i.type === h.Type.Event) {
            if (l.event.special[i.name] || (l.event.special[i.name] = {}), !l.event.special[i.name].owl) {
                var e = l.event.special[i.name]._default;
                l.event.special[i.name]._default = function (t) {
                    return !e || !e.apply || t.namespace && -1 !== t.namespace.indexOf("owl") ? t.namespace && -1 < t.namespace.indexOf("owl") : e.apply(this, arguments)
                }, l.event.special[i.name].owl = !0
            }
        } else i.type === h.Type.State && (this._states.tags[i.name] ? this._states.tags[i.name] = this._states.tags[i.name].concat(i.tags) : this._states.tags[i.name] = i.tags, this._states.tags[i.name] = l.grep(this._states.tags[i.name], l.proxy(function (t, e) {
            return l.inArray(t, this._states.tags[i.name]) === e
        }, this)))
    }, h.prototype.suppress = function (t) {
        l.each(t, l.proxy(function (t, e) {
            this._supress[e] = !0
        }, this))
    }, h.prototype.release = function (t) {
        l.each(t, l.proxy(function (t, e) {
            delete this._supress[e]
        }, this))
    }, h.prototype.pointer = function (t) {
        var e = {
            x: null,
            y: null
        };
        return (t = (t = t.originalEvent || t || i.event).touches && t.touches.length ? t.touches[0] : t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t).pageX ? (e.x = t.pageX, e.y = t.pageY) : (e.x = t.clientX, e.y = t.clientY), e
    }, h.prototype.isNumeric = function (t) {
        return !isNaN(parseFloat(t))
    }, h.prototype.difference = function (t, e) {
        return {
            x: t.x - e.x,
            y: t.y - e.y
        }
    }, l.fn.owlCarousel = function (e) {
        var n = Array.prototype.slice.call(arguments, 1);
        return this.each(function () {
            var t = l(this),
                i = t.data("owl.carousel");
            i || (i = new h(this, "object" == typeof e && e), t.data("owl.carousel", i), l.each(["next", "prev", "to", "destroy", "refresh", "replace", "add", "remove"], function (t, e) {
                i.register({
                    type: h.Type.Event,
                    name: e
                }), i.$element.on(e + ".owl.carousel.core", l.proxy(function (t) {
                    t.namespace && t.relatedTarget !== this && (this.suppress([e]), i[e].apply(this, [].slice.call(arguments, 1)), this.release([e]))
                }, i))
            })), "string" == typeof e && "_" !== e.charAt(0) && i[e].apply(i, n)
        })
    }, l.fn.owlCarousel.Constructor = h
}(window.Zepto || window.jQuery, window, document),
function (e, i, t, n) {
    var s = function (t) {
        this._core = t, this._interval = null, this._visible = null, this._handlers = {
            "initialized.owl.carousel": e.proxy(function (t) {
                t.namespace && this._core.settings.autoRefresh && this.watch()
            }, this)
        }, this._core.options = e.extend({}, s.Defaults, this._core.options), this._core.$element.on(this._handlers)
    };
    s.Defaults = {
        autoRefresh: !0,
        autoRefreshInterval: 500
    }, s.prototype.watch = function () {
        this._interval || (this._visible = this._core.$element.is(":visible"), this._interval = i.setInterval(e.proxy(this.refresh, this), this._core.settings.autoRefreshInterval))
    }, s.prototype.refresh = function () {
        this._core.$element.is(":visible") !== this._visible && (this._visible = !this._visible, this._core.$element.toggleClass("owl-hidden", !this._visible), this._visible && this._core.invalidate("width") && this._core.refresh())
    }, s.prototype.destroy = function () {
        var t, e;
        for (t in i.clearInterval(this._interval), this._handlers) this._core.$element.off(t, this._handlers[t]);
        for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
    }, e.fn.owlCarousel.Constructor.Plugins.AutoRefresh = s
}(window.Zepto || window.jQuery, window, document),
function (a, o, t, l) {
    var e = function (t) {
        this._core = t, this._loaded = [], this._handlers = {
            "initialized.owl.carousel change.owl.carousel resized.owl.carousel": a.proxy(function (t) {
                if (t.namespace && this._core.settings && this._core.settings.lazyLoad && (t.property && "position" == t.property.name || "initialized" == t.type))
                    for (var e = this._core.settings, i = e.center && Math.ceil(e.items / 2) || e.items, n = e.center && -1 * i || 0, s = (t.property && t.property.value !== l ? t.property.value : this._core.current()) + n, o = this._core.clones().length, r = a.proxy(function (t, e) {
                            this.load(e)
                        }, this); n++ < i;) this.load(o / 2 + this._core.relative(s)), o && a.each(this._core.clones(this._core.relative(s)), r), s++
            }, this)
        }, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers)
    };
    e.Defaults = {
        lazyLoad: !1
    }, e.prototype.load = function (t) {
        var e = this._core.$stage.children().eq(t),
            i = e && e.find(".owl-lazy");
        !i || -1 < a.inArray(e.get(0), this._loaded) || (i.each(a.proxy(function (t, e) {
            var i, n = a(e),
                s = 1 < o.devicePixelRatio && n.attr("data-src-retina") || n.attr("data-src");
            this._core.trigger("load", {
                element: n,
                url: s
            }, "lazy"), n.is("img") ? n.one("load.owl.lazy", a.proxy(function () {
                n.css("opacity", 1), this._core.trigger("loaded", {
                    element: n,
                    url: s
                }, "lazy")
            }, this)).attr("src", s) : ((i = new Image).onload = a.proxy(function () {
                n.css({
                    "background-image": 'url("' + s + '")',
                    opacity: "1"
                }), this._core.trigger("loaded", {
                    element: n,
                    url: s
                }, "lazy")
            }, this), i.src = s)
        }, this)), this._loaded.push(e.get(0)))
    }, e.prototype.destroy = function () {
        var t, e;
        for (t in this.handlers) this._core.$element.off(t, this.handlers[t]);
        for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
    }, a.fn.owlCarousel.Constructor.Plugins.Lazy = e
}(window.Zepto || window.jQuery, window, document),
function (o, t, e, i) {
    var n = function (t) {
        this._core = t, this._handlers = {
            "initialized.owl.carousel refreshed.owl.carousel": o.proxy(function (t) {
                t.namespace && this._core.settings.autoHeight && this.update()
            }, this),
            "changed.owl.carousel": o.proxy(function (t) {
                t.namespace && this._core.settings.autoHeight && "position" == t.property.name && this.update()
            }, this),
            "loaded.owl.lazy": o.proxy(function (t) {
                t.namespace && this._core.settings.autoHeight && t.element.closest("." + this._core.settings.itemClass).index() === this._core.current() && this.update()
            }, this)
        }, this._core.options = o.extend({}, n.Defaults, this._core.options), this._core.$element.on(this._handlers)
    };
    n.Defaults = {
        autoHeight: !1,
        autoHeightClass: "owl-height"
    }, n.prototype.update = function () {
        var t = this._core._current,
            e = t + this._core.settings.items,
            i = this._core.$stage.children().toArray().slice(t, e),
            n = [],
            s = 0;
        o.each(i, function (t, e) {
            n.push(o(e).height())
        }), s = Math.max.apply(null, n), this._core.$stage.parent().height(s).addClass(this._core.settings.autoHeightClass)
    }, n.prototype.destroy = function () {
        var t, e;
        for (t in this._handlers) this._core.$element.off(t, this._handlers[t]);
        for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
    }, o.fn.owlCarousel.Constructor.Plugins.AutoHeight = n
}(window.Zepto || window.jQuery, window, document),
function (c, t, e, i) {
    var n = function (t) {
        this._core = t, this._videos = {}, this._playing = null, this._handlers = {
            "initialized.owl.carousel": c.proxy(function (t) {
                t.namespace && this._core.register({
                    type: "state",
                    name: "playing",
                    tags: ["interacting"]
                })
            }, this),
            "resize.owl.carousel": c.proxy(function (t) {
                t.namespace && this._core.settings.video && this.isInFullScreen() && t.preventDefault()
            }, this),
            "refreshed.owl.carousel": c.proxy(function (t) {
                t.namespace && this._core.is("resizing") && this._core.$stage.find(".cloned .owl-video-frame").remove()
            }, this),
            "changed.owl.carousel": c.proxy(function (t) {
                t.namespace && "position" === t.property.name && this._playing && this.stop()
            }, this),
            "prepared.owl.carousel": c.proxy(function (t) {
                if (t.namespace) {
                    var e = c(t.content).find(".owl-video");
                    e.length && (e.css("display", "none"), this.fetch(e, c(t.content)))
                }
            }, this)
        }, this._core.options = c.extend({}, n.Defaults, this._core.options), this._core.$element.on(this._handlers), this._core.$element.on("click.owl.video", ".owl-video-play-icon", c.proxy(function (t) {
            this.play(t)
        }, this))
    };
    n.Defaults = {
        video: !1,
        videoHeight: !1,
        videoWidth: !1
    }, n.prototype.fetch = function (t, e) {
        var i = t.attr("data-vimeo-id") ? "vimeo" : t.attr("data-vzaar-id") ? "vzaar" : "youtube",
            n = t.attr("data-vimeo-id") || t.attr("data-youtube-id") || t.attr("data-vzaar-id"),
            s = t.attr("data-width") || this._core.settings.videoWidth,
            o = t.attr("data-height") || this._core.settings.videoHeight,
            r = t.attr("href");
        if (!r) throw new Error("Missing video URL.");
        if (-1 < (n = r.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/))[3].indexOf("youtu")) i = "youtube";
        else if (-1 < n[3].indexOf("vimeo")) i = "vimeo";
        else {
            if (!(-1 < n[3].indexOf("vzaar"))) throw new Error("Video URL not supported.");
            i = "vzaar"
        }
        n = n[6], this._videos[r] = {
            type: i,
            id: n,
            width: s,
            height: o
        }, e.attr("data-video", r), this.thumbnail(t, this._videos[r])
    }, n.prototype.thumbnail = function (e, t) {
        var i, n, s, o = t.width && t.height ? 'style="width:' + t.width + "px;height:" + t.height + 'px;"' : "",
            r = e.find("img"),
            a = "src",
            l = "",
            h = this._core.settings,
            u = function (t) {
                n = '<div class="owl-video-play-icon"></div>', i = h.lazyLoad ? '<div class="owl-video-tn ' + l + '" ' + a + '="' + t + '"></div>' : '<div class="owl-video-tn" style="opacity:1;background-image:url(' + t + ')"></div>', e.after(i), e.after(n)
            };
        if (e.wrap('<div class="owl-video-wrapper"' + o + "></div>"), this._core.settings.lazyLoad && (a = "data-src", l = "owl-lazy"), r.length) return u(r.attr(a)), r.remove(), !1;
        "youtube" === t.type ? (s = "//img.youtube.com/vi/" + t.id + "/hqdefault.jpg", u(s)) : "vimeo" === t.type ? c.ajax({
            type: "GET",
            url: "//vimeo.com/api/v2/video/" + t.id + ".json",
            jsonp: "callback",
            dataType: "jsonp",
            success: function (t) {
                s = t[0].thumbnail_large, u(s)
            }
        }) : "vzaar" === t.type && c.ajax({
            type: "GET",
            url: "//vzaar.com/api/videos/" + t.id + ".json",
            jsonp: "callback",
            dataType: "jsonp",
            success: function (t) {
                s = t.framegrab_url, u(s)
            }
        })
    }, n.prototype.stop = function () {
        this._core.trigger("stop", null, "video"), this._playing.find(".owl-video-frame").remove(), this._playing.removeClass("owl-video-playing"), this._playing = null, this._core.leave("playing"), this._core.trigger("stopped", null, "video")
    }, n.prototype.play = function (t) {
        var e, i, n = c(t.target).closest("." + this._core.settings.itemClass),
            s = this._videos[n.attr("data-video")],
            o = s.width || "100%",
            r = s.height || this._core.$stage.height();
        this._playing || (this._core.enter("playing"), this._core.trigger("play", null, "video"), n = this._core.items(this._core.relative(n.index())), this._core.reset(n.index()), "youtube" === s.type ? e = '<iframe width="' + o + '" height="' + r + '" src="//www.youtube.com/embed/' + s.id + "?autoplay=1&rel=0&v=" + s.id + '" frameborder="0" allowfullscreen></iframe>' : "vimeo" === s.type ? e = '<iframe src="//player.vimeo.com/video/' + s.id + '?autoplay=1" width="' + o + '" height="' + r + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>' : "vzaar" === s.type && (e = '<iframe frameborder="0"height="' + r + '"width="' + o + '" allowfullscreen mozallowfullscreen webkitAllowFullScreen src="//view.vzaar.com/' + s.id + '/player?autoplay=true"></iframe>'), c('<div class="owl-video-frame">' + e + "</div>").insertAfter(n.find(".owl-video")), this._playing = n.addClass("owl-video-playing"))
    }, n.prototype.isInFullScreen = function () {
        var t = e.fullscreenElement || e.mozFullScreenElement || e.webkitFullscreenElement;
        return t && c(t).parent().hasClass("owl-video-frame")
    }, n.prototype.destroy = function () {
        var t, e;
        for (t in this._core.$element.off("click.owl.video"), this._handlers) this._core.$element.off(t, this._handlers[t]);
        for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
    }, c.fn.owlCarousel.Constructor.Plugins.Video = n
}(window.Zepto || window.jQuery, window, document),
function (r, t, e, i) {
    var n = function (t) {
        this.core = t, this.core.options = r.extend({}, n.Defaults, this.core.options), this.swapping = !0, this.previous = i, this.next = i, this.handlers = {
            "change.owl.carousel": r.proxy(function (t) {
                t.namespace && "position" == t.property.name && (this.previous = this.core.current(), this.next = t.property.value)
            }, this),
            "drag.owl.carousel dragged.owl.carousel translated.owl.carousel": r.proxy(function (t) {
                t.namespace && (this.swapping = "translated" == t.type)
            }, this),
            "translate.owl.carousel": r.proxy(function (t) {
                t.namespace && this.swapping && (this.core.options.animateOut || this.core.options.animateIn) && this.swap()
            }, this)
        }, this.core.$element.on(this.handlers)
    };
    n.Defaults = {
        animateOut: !1,
        animateIn: !1
    }, n.prototype.swap = function () {
        if (1 === this.core.settings.items && r.support.animation && r.support.transition) {
            this.core.speed(0);
            var t, e = r.proxy(this.clear, this),
                i = this.core.$stage.children().eq(this.previous),
                n = this.core.$stage.children().eq(this.next),
                s = this.core.settings.animateIn,
                o = this.core.settings.animateOut;
            this.core.current() !== this.previous && (o && (t = this.core.coordinates(this.previous) - this.core.coordinates(this.next), i.one(r.support.animation.end, e).css({
                left: t + "px"
            }).addClass("animated owl-animated-out").addClass(o)), s && n.one(r.support.animation.end, e).addClass("animated owl-animated-in").addClass(s))
        }
    }, n.prototype.clear = function (t) {
        r(t.target).css({
            left: ""
        }).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut), this.core.onTransitionEnd()
    }, n.prototype.destroy = function () {
        var t, e;
        for (t in this.handlers) this.core.$element.off(t, this.handlers[t]);
        for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
    }, r.fn.owlCarousel.Constructor.Plugins.Animate = n
}(window.Zepto || window.jQuery, window, document),
function (n, s, e, t) {
    var i = function (t) {
        this._core = t, this._call = null, this._time = 0, this._timeout = 0, this._paused = !0, this._handlers = {
            "changed.owl.carousel": n.proxy(function (t) {
                t.namespace && "settings" === t.property.name ? this._core.settings.autoplay ? this.play() : this.stop() : t.namespace && "position" === t.property.name && this._paused && (this._time = 0)
            }, this),
            "initialized.owl.carousel": n.proxy(function (t) {
                t.namespace && this._core.settings.autoplay && this.play()
            }, this),
            "play.owl.autoplay": n.proxy(function (t, e, i) {
                t.namespace && this.play(e, i)
            }, this),
            "stop.owl.autoplay": n.proxy(function (t) {
                t.namespace && this.stop()
            }, this),
            "mouseover.owl.autoplay": n.proxy(function () {
                this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause()
            }, this),
            "mouseleave.owl.autoplay": n.proxy(function () {
                this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.play()
            }, this),
            "touchstart.owl.core": n.proxy(function () {
                this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause()
            }, this),
            "touchend.owl.core": n.proxy(function () {
                this._core.settings.autoplayHoverPause && this.play()
            }, this)
        }, this._core.$element.on(this._handlers), this._core.options = n.extend({}, i.Defaults, this._core.options)
    };
    i.Defaults = {
        autoplay: !1,
        autoplayTimeout: 5e3,
        autoplayHoverPause: !1,
        autoplaySpeed: !1
    }, i.prototype._next = function (t) {
        this._call = s.setTimeout(n.proxy(this._next, this, t), this._timeout * (Math.round(this.read() / this._timeout) + 1) - this.read()), this._core.is("busy") || this._core.is("interacting") || e.hidden || this._core.next(t || this._core.settings.autoplaySpeed)
    }, i.prototype.read = function () {
        return (new Date).getTime() - this._time
    }, i.prototype.play = function (t, e) {
        var i;
        this._core.is("rotating") || this._core.enter("rotating"), t = t || this._core.settings.autoplayTimeout, i = Math.min(this._time % (this._timeout || t), t), this._paused ? (this._time = this.read(), this._paused = !1) : s.clearTimeout(this._call), this._time += this.read() % t - i, this._timeout = t, this._call = s.setTimeout(n.proxy(this._next, this, e), t - i)
    }, i.prototype.stop = function () {
        this._core.is("rotating") && (this._time = 0, this._paused = !0, s.clearTimeout(this._call), this._core.leave("rotating"))
    }, i.prototype.pause = function () {
        this._core.is("rotating") && !this._paused && (this._time = this.read(), this._paused = !0, s.clearTimeout(this._call))
    }, i.prototype.destroy = function () {
        var t, e;
        for (t in this.stop(), this._handlers) this._core.$element.off(t, this._handlers[t]);
        for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
    }, n.fn.owlCarousel.Constructor.Plugins.autoplay = i
}(window.Zepto || window.jQuery, window, document),
function (o, t, e, i) {
    "use strict";
    var n = function (t) {
        this._core = t, this._initialized = !1, this._pages = [], this._controls = {}, this._templates = [], this.$element = this._core.$element, this._overrides = {
            next: this._core.next,
            prev: this._core.prev,
            to: this._core.to
        }, this._handlers = {
            "prepared.owl.carousel": o.proxy(function (t) {
                t.namespace && this._core.settings.dotsData && this._templates.push('<div class="' + this._core.settings.dotClass + '">' + o(t.content).find("[data-dot]").addBack("[data-dot]").attr("data-dot") + "</div>")
            }, this),
            "added.owl.carousel": o.proxy(function (t) {
                t.namespace && this._core.settings.dotsData && this._templates.splice(t.position, 0, this._templates.pop())
            }, this),
            "remove.owl.carousel": o.proxy(function (t) {
                t.namespace && this._core.settings.dotsData && this._templates.splice(t.position, 1)
            }, this),
            "changed.owl.carousel": o.proxy(function (t) {
                t.namespace && "position" == t.property.name && this.draw()
            }, this),
            "initialized.owl.carousel": o.proxy(function (t) {
                t.namespace && !this._initialized && (this._core.trigger("initialize", null, "navigation"), this.initialize(), this.update(), this.draw(), this._initialized = !0, this._core.trigger("initialized", null, "navigation"))
            }, this),
            "refreshed.owl.carousel": o.proxy(function (t) {
                t.namespace && this._initialized && (this._core.trigger("refresh", null, "navigation"), this.update(), this.draw(), this._core.trigger("refreshed", null, "navigation"))
            }, this)
        }, this._core.options = o.extend({}, n.Defaults, this._core.options), this.$element.on(this._handlers)
    };
    n.Defaults = {
        nav: !0,
        navText: ['<span aria-label="prev">&#x2039;</span>', '<span aria-label="next">&#x203a;</span>'],
        navSpeed: !1,
        navElement: 'button role="presentation"',
        navContainer: !1,
        navContainerClass: "owl-nav",
        navClass: ["owl-prev", "owl-next"],
        slideBy: 1,
        dotClass: "owl-dot",
        dotsClass: "owl-dots",
        dots: !0,
        dotsEach: !1,
        dotsData: !1,
        dotsSpeed: !1,
        dotsContainer: !1
    }, n.prototype.initialize = function () {
        var t, i = this._core.settings;
        for (t in this._controls.$relative = (i.navContainer ? o(i.navContainer) : o("<div>").addClass(i.navContainerClass).appendTo(this.$element)).addClass("disabled"), this._controls.$previous = o("<" + i.navElement + ">").addClass(i.navClass[0]).html(i.navText[0]).prependTo(this._controls.$relative).on("click", o.proxy(function (t) {
                this.prev(i.navSpeed)
            }, this)), this._controls.$next = o("<" + i.navElement + ">").addClass(i.navClass[1]).html(i.navText[1]).appendTo(this._controls.$relative).on("click", o.proxy(function (t) {
                this.next(i.navSpeed)
            }, this)), i.dotsData || (this._templates = [o("<button>").addClass(i.dotClass).append(o("<span>")).prop("outerHTML")]), this._controls.$absolute = (i.dotsContainer ? o(i.dotsContainer) : o("<div>").addClass(i.dotsClass).appendTo(this.$element)).addClass("disabled"), this._controls.$absolute.on("click", "button", o.proxy(function (t) {
                var e = o(t.target).parent().is(this._controls.$absolute) ? o(t.target).index() : o(t.target).parent().index();
                t.preventDefault(), this.to(e, i.dotsSpeed)
            }, this)), this._overrides) this._core[t] = o.proxy(this[t], this)
    }, n.prototype.destroy = function () {
        var t, e, i, n, s;
        for (t in s = this._core.settings, this._handlers) this.$element.off(t, this._handlers[t]);
        for (e in this._controls) "$relative" === e && s.navContainer ? this._controls[e].html("") : this._controls[e].remove();
        for (n in this.overides) this._core[n] = this._overrides[n];
        for (i in Object.getOwnPropertyNames(this)) "function" != typeof this[i] && (this[i] = null)
    }, n.prototype.update = function () {
        var t, e, i, n = this._core.clones().length / 2,
            s = n + this._core.items().length,
            o = this._core.maximum(!0),
            r = this._core.settings,
            a = r.center || r.autoWidth || r.dotsData ? 1 : r.dotsEach || r.items;
        if ("page" !== r.slideBy && (r.slideBy = Math.min(r.slideBy, r.items)), r.dots || "page" == r.slideBy)
            for (this._pages = [], t = n, i = e = 0; t < s; t++) {
                if (a <= e || 0 === e) {
                    if (this._pages.push({
                            start: Math.min(o, t - n),
                            end: t - n + a - 1
                        }), Math.min(o, t - n) === o) break;
                    e = 0, ++i
                }
                e += this._core.mergers(this._core.relative(t))
            }
    }, n.prototype.draw = function () {
        var t, e = this._core.settings,
            i = this._core.items().length <= e.items,
            n = this._core.relative(this._core.current()),
            s = e.loop || e.rewind;
        this._controls.$relative.toggleClass("disabled", !e.nav || i), e.nav && (this._controls.$previous.toggleClass("disabled", !s && n <= this._core.minimum(!0)), this._controls.$next.toggleClass("disabled", !s && n >= this._core.maximum(!0))), this._controls.$absolute.toggleClass("disabled", !e.dots || i), e.dots && (t = this._pages.length - this._controls.$absolute.children().length, e.dotsData && 0 !== t ? this._controls.$absolute.html(this._templates.join("")) : 0 < t ? this._controls.$absolute.append(new Array(t + 1).join(this._templates[0])) : t < 0 && this._controls.$absolute.children().slice(t).remove(), this._controls.$absolute.find(".active").removeClass("active"), this._controls.$absolute.children().eq(o.inArray(this.current(), this._pages)).addClass("active"))
    }, n.prototype.onTrigger = function (t) {
        var e = this._core.settings;
        t.page = {
            index: o.inArray(this.current(), this._pages),
            count: this._pages.length,
            size: e && (e.center || e.autoWidth || e.dotsData ? 1 : e.dotsEach || e.items)
        }
    }, n.prototype.current = function () {
        var i = this._core.relative(this._core.current());
        return o.grep(this._pages, o.proxy(function (t, e) {
            return t.start <= i && t.end >= i
        }, this)).pop()
    }, n.prototype.getPosition = function (t) {
        var e, i, n = this._core.settings;
        return "page" == n.slideBy ? (e = o.inArray(this.current(), this._pages), i = this._pages.length, t ? ++e : --e, e = this._pages[(e % i + i) % i].start) : (e = this._core.relative(this._core.current()), i = this._core.items().length, t ? e += n.slideBy : e -= n.slideBy), e
    }, n.prototype.next = function (t) {
        o.proxy(this._overrides.to, this._core)(this.getPosition(!0), t)
    }, n.prototype.prev = function (t) {
        o.proxy(this._overrides.to, this._core)(this.getPosition(!1), t)
    }, n.prototype.to = function (t, e, i) {
        var n;
        !i && this._pages.length ? (n = this._pages.length, o.proxy(this._overrides.to, this._core)(this._pages[(t % n + n) % n].start, e)) : o.proxy(this._overrides.to, this._core)(t, e)
    }, o.fn.owlCarousel.Constructor.Plugins.Navigation = n
}(window.Zepto || window.jQuery, window, document),
function (n, s, t, o) {
    "use strict";
    var e = function (t) {
        this._core = t, this._hashes = {}, this.$element = this._core.$element, this._handlers = {
            "initialized.owl.carousel": n.proxy(function (t) {
                t.namespace && "URLHash" === this._core.settings.startPosition && n(s).trigger("hashchange.owl.navigation")
            }, this),
            "prepared.owl.carousel": n.proxy(function (t) {
                if (t.namespace) {
                    var e = n(t.content).find("[data-hash]").addBack("[data-hash]").attr("data-hash");
                    if (!e) return;
                    this._hashes[e] = t.content
                }
            }, this),
            "changed.owl.carousel": n.proxy(function (t) {
                if (t.namespace && "position" === t.property.name) {
                    var i = this._core.items(this._core.relative(this._core.current())),
                        e = n.map(this._hashes, function (t, e) {
                            return t === i ? e : null
                        }).join();
                    if (!e || s.location.hash.slice(1) === e) return;
                    s.location.hash = e
                }
            }, this)
        }, this._core.options = n.extend({}, e.Defaults, this._core.options), this.$element.on(this._handlers), n(s).on("hashchange.owl.navigation", n.proxy(function (t) {
            var e = s.location.hash.substring(1),
                i = this._core.$stage.children(),
                n = this._hashes[e] && i.index(this._hashes[e]);
            n !== o && n !== this._core.current() && this._core.to(this._core.relative(n), !1, !0)
        }, this))
    };
    e.Defaults = {
        URLhashListener: !1
    }, e.prototype.destroy = function () {
        var t, e;
        for (t in n(s).off("hashchange.owl.navigation"), this._handlers) this._core.$element.off(t, this._handlers[t]);
        for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
    }, n.fn.owlCarousel.Constructor.Plugins.Hash = e
}(window.Zepto || window.jQuery, window, document),
function (s, t, e, o) {
    function i(t, i) {
        var n = !1,
            e = t.charAt(0).toUpperCase() + t.slice(1);
        return s.each((t + " " + a.join(e + " ") + e).split(" "), function (t, e) {
            if (r[e] !== o) return n = !i || e, !1
        }), n
    }

    function n(t) {
        return i(t, !0)
    }
    var r = s("<support>").get(0).style,
        a = "Webkit Moz O ms".split(" "),
        l = {
            transition: {
                end: {
                    WebkitTransition: "webkitTransitionEnd",
                    MozTransition: "transitionend",
                    OTransition: "oTransitionEnd",
                    transition: "transitionend"
                }
            },
            animation: {
                end: {
                    WebkitAnimation: "webkitAnimationEnd",
                    MozAnimation: "animationend",
                    OAnimation: "oAnimationEnd",
                    animation: "animationend"
                }
            }
        },
        h = function () {
            return !!i("transform")
        },
        u = function () {
            return !!i("perspective")
        },
        c, d = function () {
            return !!i("animation")
        };
    (function () {
        return !!i("transition")
    })() && (s.support.transition = new String(n("transition")), s.support.transition.end = l.transition.end[s.support.transition]), d() && (s.support.animation = new String(n("animation")), s.support.animation.end = l.animation.end[s.support.animation]), h() && (s.support.transform = new String(n("transform")), s.support.transform3d = u())
}(window.Zepto || window.jQuery, window, document),
function () {
    "use strict";

    function e(t) {
        if (!t) throw new Error("No options passed to Waypoint constructor");
        if (!t.element) throw new Error("No element option passed to Waypoint constructor");
        if (!t.handler) throw new Error("No handler option passed to Waypoint constructor");
        this.key = "waypoint-" + i, this.options = e.Adapter.extend({}, e.defaults, t), this.element = this.options.element, this.adapter = new e.Adapter(this.element), this.callback = t.handler, this.axis = this.options.horizontal ? "horizontal" : "vertical", this.enabled = this.options.enabled, this.triggerPoint = null, this.group = e.Group.findOrCreate({
            name: this.options.group,
            axis: this.axis
        }), this.context = e.Context.findOrCreateByElement(this.options.context), e.offsetAliases[this.options.offset] && (this.options.offset = e.offsetAliases[this.options.offset]), this.group.add(this), this.context.add(this), o[this.key] = this, i += 1
    }
    var i = 0,
        o = {};
    e.prototype.queueTrigger = function (t) {
        this.group.queueTrigger(this, t)
    }, e.prototype.trigger = function (t) {
        this.enabled && this.callback && this.callback.apply(this, t)
    }, e.prototype.destroy = function () {
        this.context.remove(this), this.group.remove(this), delete o[this.key]
    }, e.prototype.disable = function () {
        return this.enabled = !1, this
    }, e.prototype.enable = function () {
        return this.context.refresh(), this.enabled = !0, this
    }, e.prototype.next = function () {
        return this.group.next(this)
    }, e.prototype.previous = function () {
        return this.group.previous(this)
    }, e.invokeAll = function (t) {
        var e = [];
        for (var i in o) e.push(o[i]);
        for (var n = 0, s = e.length; n < s; n++) e[n][t]()
    }, e.destroyAll = function () {
        e.invokeAll("destroy")
    }, e.disableAll = function () {
        e.invokeAll("disable")
    }, e.enableAll = function () {
        for (var t in e.Context.refreshAll(), o) o[t].enabled = !0;
        return this
    }, e.refreshAll = function () {
        e.Context.refreshAll()
    }, e.viewportHeight = function () {
        return window.innerHeight || document.documentElement.clientHeight
    }, e.viewportWidth = function () {
        return document.documentElement.clientWidth
    }, e.adapters = [], e.defaults = {
        context: window,
        continuous: !0,
        enabled: !0,
        group: "default",
        horizontal: !1,
        offset: 0
    }, e.offsetAliases = {
        "bottom-in-view": function () {
            return this.context.innerHeight() - this.adapter.outerHeight()
        },
        "right-in-view": function () {
            return this.context.innerWidth() - this.adapter.outerWidth()
        }
    }, window.Waypoint = e
}(),
function () {
    "use strict";

    function i(t) {
        window.setTimeout(t, 1e3 / 60)
    }

    function e(t) {
        this.element = t, this.Adapter = v.Adapter, this.adapter = new this.Adapter(t), this.key = "waypoint-context-" + n, this.didScroll = !1, this.didResize = !1, this.oldScroll = {
            x: this.adapter.scrollLeft(),
            y: this.adapter.scrollTop()
        }, this.waypoints = {
            vertical: {},
            horizontal: {}
        }, t.waypointContextKey = this.key, s[t.waypointContextKey] = this, n += 1, v.windowContext || (v.windowContext = !0, v.windowContext = new e(window)), this.createThrottledScrollHandler(), this.createThrottledResizeHandler()
    }
    var n = 0,
        s = {},
        v = window.Waypoint,
        t = window.onload;
    e.prototype.add = function (t) {
        var e = t.options.horizontal ? "horizontal" : "vertical";
        this.waypoints[e][t.key] = t, this.refresh()
    }, e.prototype.checkEmpty = function () {
        var t = this.Adapter.isEmptyObject(this.waypoints.horizontal),
            e = this.Adapter.isEmptyObject(this.waypoints.vertical),
            i = this.element == this.element.window;
        t && e && !i && (this.adapter.off(".waypoints"), delete s[this.key])
    }, e.prototype.createThrottledResizeHandler = function () {
        function t() {
            e.handleResize(), e.didResize = !1
        }
        var e = this;
        this.adapter.on("resize.waypoints", function () {
            e.didResize || (e.didResize = !0, v.requestAnimationFrame(t))
        })
    }, e.prototype.createThrottledScrollHandler = function () {
        function t() {
            e.handleScroll(), e.didScroll = !1
        }
        var e = this;
        this.adapter.on("scroll.waypoints", function () {
            (!e.didScroll || v.isTouch) && (e.didScroll = !0, v.requestAnimationFrame(t))
        })
    }, e.prototype.handleResize = function () {
        v.Context.refreshAll()
    }, e.prototype.handleScroll = function () {
        var t = {},
            e = {
                horizontal: {
                    newScroll: this.adapter.scrollLeft(),
                    oldScroll: this.oldScroll.x,
                    forward: "right",
                    backward: "left"
                },
                vertical: {
                    newScroll: this.adapter.scrollTop(),
                    oldScroll: this.oldScroll.y,
                    forward: "down",
                    backward: "up"
                }
            };
        for (var i in e) {
            var n = e[i],
                s, o = n.newScroll > n.oldScroll ? n.forward : n.backward;
            for (var r in this.waypoints[i]) {
                var a = this.waypoints[i][r];
                if (null !== a.triggerPoint) {
                    var l = n.oldScroll < a.triggerPoint,
                        h = n.newScroll >= a.triggerPoint,
                        u, c;
                    (l && h || !l && !h) && (a.queueTrigger(o), t[a.group.id] = a.group)
                }
            }
        }
        for (var d in t) t[d].flushTriggers();
        this.oldScroll = {
            x: e.horizontal.newScroll,
            y: e.vertical.newScroll
        }
    }, e.prototype.innerHeight = function () {
        return this.element == this.element.window ? v.viewportHeight() : this.adapter.innerHeight()
    }, e.prototype.remove = function (t) {
        delete this.waypoints[t.axis][t.key], this.checkEmpty()
    }, e.prototype.innerWidth = function () {
        return this.element == this.element.window ? v.viewportWidth() : this.adapter.innerWidth()
    }, e.prototype.destroy = function () {
        var t = [];
        for (var e in this.waypoints)
            for (var i in this.waypoints[e]) t.push(this.waypoints[e][i]);
        for (var n = 0, s = t.length; n < s; n++) t[n].destroy()
    }, e.prototype.refresh = function () {
        var t, e = this.element == this.element.window,
            i = e ? void 0 : this.adapter.offset(),
            n = {};
        for (var s in this.handleScroll(), t = {
                horizontal: {
                    contextOffset: e ? 0 : i.left,
                    contextScroll: e ? 0 : this.oldScroll.x,
                    contextDimension: this.innerWidth(),
                    oldScroll: this.oldScroll.x,
                    forward: "right",
                    backward: "left",
                    offsetProp: "left"
                },
                vertical: {
                    contextOffset: e ? 0 : i.top,
                    contextScroll: e ? 0 : this.oldScroll.y,
                    contextDimension: this.innerHeight(),
                    oldScroll: this.oldScroll.y,
                    forward: "down",
                    backward: "up",
                    offsetProp: "top"
                }
            }) {
            var o = t[s];
            for (var r in this.waypoints[s]) {
                var a, l, h, u, c, d = this.waypoints[s][r],
                    p = d.options.offset,
                    f = d.triggerPoint,
                    g = 0,
                    m = null == f;
                d.element !== d.element.window && (g = d.adapter.offset()[o.offsetProp]), "function" == typeof p ? p = p.apply(d) : "string" == typeof p && (p = parseFloat(p), -1 < d.options.offset.indexOf("%") && (p = Math.ceil(o.contextDimension * p / 100))), a = o.contextScroll - o.contextOffset, d.triggerPoint = Math.floor(g + a - p), l = f < o.oldScroll, h = d.triggerPoint >= o.oldScroll, c = !l && !h, !m && (u = l && h) ? (d.queueTrigger(o.backward), n[d.group.id] = d.group) : !m && c ? (d.queueTrigger(o.forward), n[d.group.id] = d.group) : m && o.oldScroll >= d.triggerPoint && (d.queueTrigger(o.forward), n[d.group.id] = d.group)
            }
        }
        return v.requestAnimationFrame(function () {
            for (var t in n) n[t].flushTriggers()
        }), this
    }, e.findOrCreateByElement = function (t) {
        return e.findByElement(t) || new e(t)
    }, e.refreshAll = function () {
        for (var t in s) s[t].refresh()
    }, e.findByElement = function (t) {
        return s[t.waypointContextKey]
    }, window.onload = function () {
        t && t(), e.refreshAll()
    }, v.requestAnimationFrame = function (t) {
        var e;
        (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || i).call(window, t)
    }, v.Context = e
}(),
function () {
    "use strict";

    function r(t, e) {
        return t.triggerPoint - e.triggerPoint
    }

    function a(t, e) {
        return e.triggerPoint - t.triggerPoint
    }

    function e(t) {
        this.name = t.name, this.axis = t.axis, this.id = this.name + "-" + this.axis, this.waypoints = [], this.clearTriggerQueues(), i[this.axis][this.name] = this
    }
    var i = {
            vertical: {},
            horizontal: {}
        },
        n = window.Waypoint;
    e.prototype.add = function (t) {
        this.waypoints.push(t)
    }, e.prototype.clearTriggerQueues = function () {
        this.triggerQueues = {
            up: [],
            down: [],
            left: [],
            right: []
        }
    }, e.prototype.flushTriggers = function () {
        for (var t in this.triggerQueues) {
            var e = this.triggerQueues[t],
                i = "up" === t || "left" === t;
            e.sort(i ? a : r);
            for (var n = 0, s = e.length; n < s; n += 1) {
                var o = e[n];
                (o.options.continuous || n === e.length - 1) && o.trigger([t])
            }
        }
        this.clearTriggerQueues()
    }, e.prototype.next = function (t) {
        this.waypoints.sort(r);
        var e = n.Adapter.inArray(t, this.waypoints),
            i;
        return e === this.waypoints.length - 1 ? null : this.waypoints[e + 1]
    }, e.prototype.previous = function (t) {
        this.waypoints.sort(r);
        var e = n.Adapter.inArray(t, this.waypoints);
        return e ? this.waypoints[e - 1] : null
    }, e.prototype.queueTrigger = function (t, e) {
        this.triggerQueues[e].push(t)
    }, e.prototype.remove = function (t) {
        var e = n.Adapter.inArray(t, this.waypoints); - 1 < e && this.waypoints.splice(e, 1)
    }, e.prototype.first = function () {
        return this.waypoints[0]
    }, e.prototype.last = function () {
        return this.waypoints[this.waypoints.length - 1]
    }, e.findOrCreate = function (t) {
        return i[t.axis][t.name] || new e(t)
    }, n.Group = e
}(),
function () {
    "use strict";

    function i(t) {
        this.$element = n(t)
    }
    var n = window.jQuery,
        t = window.Waypoint;
    n.each(["innerHeight", "innerWidth", "off", "offset", "on", "outerHeight", "outerWidth", "scrollLeft", "scrollTop"], function (t, e) {
        i.prototype[e] = function () {
            var t = Array.prototype.slice.call(arguments);
            return this.$element[e].apply(this.$element, t)
        }
    }), n.each(["extend", "inArray", "isEmptyObject"], function (t, e) {
        i[e] = n[e]
    }), t.adapters.push({
        name: "jquery",
        Adapter: i
    }), t.Adapter = i
}(),
function () {
    "use strict";

    function t(s) {
        return function (t, e) {
            var i = [],
                n = t;
            return s.isFunction(t) && ((n = s.extend({}, e)).handler = t), this.each(function () {
                var t = s.extend({}, n, {
                    element: this
                });
                "string" == typeof t.context && (t.context = s(this).closest(t.context)[0]), i.push(new o(t))
            }), i
        }
    }
    var o = window.Waypoint;
    window.jQuery && (window.jQuery.fn.waypoint = t(window.jQuery)), window.Zepto && (window.Zepto.fn.waypoint = t(window.Zepto))
}(), //
//
// Personal JS
//
//
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Plugins
// @codekit-prepend "/plugins/history.js"
// @codekit-prepend "/plugins/imagesloaded.js"
// @codekit-prepend "/plugins/masonry.js"
// @codekit-prepend "/plugins/debounce.js"
// @codekit-prepend "/plugins/fluidbox.js"
// @codekit-prepend "/plugins/owl.js"
// @codekit-prepend "/plugins/waypoints.js"
function (o) {
    "use strict";
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Navigation
    // Global vars
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Page load
    function e() {
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Show content
        // Wait until first image has loaded
        o(".page__content").find(".hero__image").imagesLoaded({
                background: !0
            }, function () {
                // Portfolio grid layout
                o(".portfolio-wrap").imagesLoaded(function () {
                        o(".portfolio-wrap").masonry({
                            itemSelector: ".portfolio-item",
                            transitionDuration: 0
                        })
                    }),
                    // Blog grid layout
                    o(".blog-wrap").imagesLoaded(function () {
                        o(".blog-wrap").masonry({
                            itemSelector: ".blog-post",
                            transitionDuration: 0
                        })
                    }),
                    // Show the content
                    o("body").removeClass("loading"),
                    // Hide the menu
                    o("body").removeClass("menu--open")
            }),
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Active links
            // Switch active link states
            o(".active-link").removeClass("active-link"), o('a[href="' + i + '"]').addClass("active-link"),
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Galleries
            // Destroy all existing waypoints
            Waypoint.destroyAll();
        // Set up count for galleries to give them unique IDs
        var t = 0;
        // If there's a gallery
        o(".gallery").each(function () {
                // Get gallery element
                var i = o(this),
                    n = "gallery-" +
                    // Add ID via count
                    ++t;
                i.attr("id", n);
                // Gallery columns
                var s = i.attr("data-columns");
                // Set up gallery container
                i.append('<div class="gallery__wrap"></div>'),
                    // Add images to container
                    i.children("img").each(function () {
                        o(this).appendTo("#" + n + " .gallery__wrap")
                    }),
                    // Wrap images
                    i.find(".gallery__wrap img").each(function () {
                        var t = o(this).attr("src");
                        o(this).wrapAll('<div class="gallery__item"><a href="' + t + '" class="gallery__item__link"></div></div>').appendTo()
                    }),
                    // Wait for images to load
                    i.imagesLoaded(function () {
                        // If it's a single column gallery
                        if ("1" === s) {
                            // Add carousel class to gallery
                            i.addClass("gallery--carousel"),
                                // Add owl styles to gallery wrap
                                i.children(".gallery__wrap").addClass("owl-carousel"),
                                // Use carousel
                                i.children(".gallery__wrap").owlCarousel({
                                    items: 1,
                                    loop: !0,
                                    mouseDrag: !1,
                                    touchDrag: !0,
                                    pullDrag: !1,
                                    dots: !0,
                                    autoplay: !1,
                                    autoplayTimeout: 4000,
                                    autoHeight: !0,
                                    animateOut: "fadeOut"
                                });
                            // When scrolling over the bottom
                            var t = new Waypoint({
                                    element: document.getElementById(n),
                                    handler: function (t) {
                                        "down" === t &&
                                            // console.log('pause');
                                            // Pause this carousel
                                            i.children(".gallery__wrap").trigger("stop.owl.autoplay"), "up" === t &&
                                            // console.log('play');
                                            // Play this carousel
                                            i.children(".gallery__wrap").trigger("play.owl.autoplay")
                                    },
                                    offset: "-100%"
                                }),
                                e = new Waypoint({
                                    element: document.getElementById(n),
                                    handler: function (t) {
                                        "down" === t &&
                                            // console.log('play');
                                            // Play this carousel
                                            i.children(".gallery__wrap").trigger("play.owl.autoplay"), "up" === t &&
                                            // console.log('pause');
                                            // Pause this carousel
                                            i.children(".gallery__wrap").trigger("stop.owl.autoplay")
                                    },
                                    offset: "100%"
                                });
                            // When scrolling over the top
                        } else i.addClass("gallery--grid"),
                            // Use masonry layout
                            i.children(".gallery__wrap").masonry({
                                itemSelector: ".gallery__item",
                                transitionDuration: 0
                            }),
                            // Init fluidbox
                            i.find(".gallery__item__link").fluidbox({
                                loader: !0
                            });
                        // Show gallery once initialized
                        i.addClass("gallery--on")
                    })
            }),
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Images
            o(".single p > img").each(function () {
                var t = o(this).parent("p");
                o(this).insertAfter(t), o(this).wrapAll('<div class="image-wrap"></div>'), t.remove()
            }),
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Videos
            // For each iframe
            o(".single iframe").each(function () {
                // If it's YouTube or Vimeo
                if (0 <= o(this).attr("src").indexOf("youtube") || 0 <= o(this).attr("src").indexOf("vimeo")) {
                    var t = o(this).attr("width"),
                        e, i = o(this).attr("height") / t * 100;
                    // Wrap in video container
                    o(this).wrapAll('<div class="video-wrap"><div class="video" style="padding-bottom:' + i + '%;"></div></div>')
                }
            })
    }
    // Run functions on load
    var i = o("body").attr("data-page-url"),
        n = document.title,
        s = window.History;
    // State change event
    s.Adapter.bind(window, "statechange", function () {
            var t = s.getState();
            // console.log(state);
            // Loading state
            o("body").addClass("loading"),
                // Load the page
                o(".page-loader").load(t.hash + " .page__content", function () {
                    // Find transition time
                    var t;
                    // After current content fades out
                    // Scroll to top
                    o("body, html").animate({
                        scrollTop: 0
                    }, 300), setTimeout(function () {
                        // Remove old content
                        o(".page .page__content").remove(),
                            // Append new content
                            o(".page-loader .page__content").appendTo(".page"),
                            // Set page URL
                            o("body").attr("data-page-url", window.location.pathname),
                            // Update navTarget
                            i = o("body").attr("data-page-url"),
                            // Set page title
                            n = o(".page__content").attr("data-page-title"), document.title = n,
                            // Run page functions
                            e()
                    }, 400)
                })
        }),
        // On clicking a link
        o("body").hasClass("ajax-loading") && o(document).on("click", "a", function (t) {
            // Don't follow link
            t.preventDefault();
            // Get the link target
            var e = o(this).attr("href");
            // If link is external
            0 <= e.indexOf("http") ?
                // Go to the external link
                window.open(e, "_blank") : o(this).hasClass("js-no-ajax") ?
                // Use the given link
                window.location = e : o(this).hasClass("js-contact") ?
                // Open contact modal
                o(".modal--contact").addClass("modal--on") : o(this).hasClass("js-signup") ?
                // Open signup modal
                o(".modal--signup").addClass("modal--on") : o(this).is(".gallery__item__link") || (
                    // Change navTarget
                    i = e,
                    // Switch the URL via History
                    s.pushState(null, n, e))
        }),
        // Modals
        o(document).on("click", ".js-contact", function (t) {
            t.preventDefault(), o(".modal--contact").addClass("modal--on")
        }), o(document).on("click", ".js-signup", function (t) {
            t.preventDefault(), o(".modal--signup").addClass("modal--on")
        }), e(),
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Menu
        o(document).on("click", ".js-menu-toggle", function () {
            // If already open
            o("body").hasClass("menu--open") ? o("body").removeClass("menu--open") : o("body").addClass("menu--open")
        }), o(document).on("click", ".menu__list__item__link", function () {
            // If menu is open when you click a link on mobile
            o(".menu").hasClass("menu--open") && o(".menu").removeClass("menu--open")
        }),
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Listing post click
        // Click anywhere on the post to go to the link
        o(document).on("click", ".post", function () {
            var t = o(this).find(".post__title a").attr("href");
            o("body").hasClass("ajax-loading") ? (
                    // Change navTarget
                    i = t,
                    // Switch the URL via History
                    s.pushState(null, n, t)) :
                // Use the given link
                window.location = t
        }),
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Contact Form
        // Override the submit event
        o(document).on("submit", "#contact-form", function (t) {
            // Clear previous classes
            o(".contact-form__item--error").removeClass("contact-form__item--error");
            // Get form elements
            var e = o('.contact-form__input[name="email"]'),
                i = o('.contact-form__input[name="name"]'),
                n = o('.contact-form__textarea[name="message"]'),
                s = o(".contact-form__gotcha");
            // Validate email
            "" === e.val() && e.closest(".contact-form__item").addClass("contact-form__item--error"),
                // Validate name
                "" === i.val() && i.closest(".contact-form__item").addClass("contact-form__item--error"),
                // Validate message
                "" === n.val() && n.closest(".contact-form__item").addClass("contact-form__item--error"),
                // If all fields are filled, except gotcha
                "" !== e.val() && "" !== i.val() && "" !== n.val() && 0 === s.val().length ||
                // Stop submission
                t.preventDefault()
        })
}(jQuery);