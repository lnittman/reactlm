/* React LLM - A floating chat interface powered by Gemini - MIT License */
"use strict";
var ReactLLM = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    init: () => init
  });

  // ../../node_modules/.pnpm/preact@10.26.9/node_modules/preact/dist/preact.module.js
  var n;
  var l;
  var u;
  var t;
  var i;
  var r;
  var o;
  var e;
  var f;
  var c;
  var s;
  var a;
  var h;
  var p = {};
  var v = [];
  var y = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
  var w = Array.isArray;
  function d(n3, l5) {
    for (var u4 in l5) n3[u4] = l5[u4];
    return n3;
  }
  function g(n3) {
    n3 && n3.parentNode && n3.parentNode.removeChild(n3);
  }
  function _(l5, u4, t4) {
    var i4, r4, o4, e4 = {};
    for (o4 in u4) "key" == o4 ? i4 = u4[o4] : "ref" == o4 ? r4 = u4[o4] : e4[o4] = u4[o4];
    if (arguments.length > 2 && (e4.children = arguments.length > 3 ? n.call(arguments, 2) : t4), "function" == typeof l5 && null != l5.defaultProps) for (o4 in l5.defaultProps) void 0 === e4[o4] && (e4[o4] = l5.defaultProps[o4]);
    return m(l5, e4, i4, r4, null);
  }
  function m(n3, t4, i4, r4, o4) {
    var e4 = { type: n3, props: t4, key: i4, ref: r4, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o4 ? ++u : o4, __i: -1, __u: 0 };
    return null == o4 && null != l.vnode && l.vnode(e4), e4;
  }
  function k(n3) {
    return n3.children;
  }
  function x(n3, l5) {
    this.props = n3, this.context = l5;
  }
  function S(n3, l5) {
    if (null == l5) return n3.__ ? S(n3.__, n3.__i + 1) : null;
    for (var u4; l5 < n3.__k.length; l5++) if (null != (u4 = n3.__k[l5]) && null != u4.__e) return u4.__e;
    return "function" == typeof n3.type ? S(n3) : null;
  }
  function C(n3) {
    var l5, u4;
    if (null != (n3 = n3.__) && null != n3.__c) {
      for (n3.__e = n3.__c.base = null, l5 = 0; l5 < n3.__k.length; l5++) if (null != (u4 = n3.__k[l5]) && null != u4.__e) {
        n3.__e = n3.__c.base = u4.__e;
        break;
      }
      return C(n3);
    }
  }
  function M(n3) {
    (!n3.__d && (n3.__d = true) && i.push(n3) && !$.__r++ || r != l.debounceRendering) && ((r = l.debounceRendering) || o)($);
  }
  function $() {
    for (var n3, u4, t4, r4, o4, f4, c4, s5 = 1; i.length; ) i.length > s5 && i.sort(e), n3 = i.shift(), s5 = i.length, n3.__d && (t4 = void 0, o4 = (r4 = (u4 = n3).__v).__e, f4 = [], c4 = [], u4.__P && ((t4 = d({}, r4)).__v = r4.__v + 1, l.vnode && l.vnode(t4), O(u4.__P, t4, r4, u4.__n, u4.__P.namespaceURI, 32 & r4.__u ? [o4] : null, f4, null == o4 ? S(r4) : o4, !!(32 & r4.__u), c4), t4.__v = r4.__v, t4.__.__k[t4.__i] = t4, z(f4, t4, c4), t4.__e != o4 && C(t4)));
    $.__r = 0;
  }
  function I(n3, l5, u4, t4, i4, r4, o4, e4, f4, c4, s5) {
    var a4, h4, y4, w4, d4, g3, _3 = t4 && t4.__k || v, m3 = l5.length;
    for (f4 = P(u4, l5, _3, f4, m3), a4 = 0; a4 < m3; a4++) null != (y4 = u4.__k[a4]) && (h4 = -1 == y4.__i ? p : _3[y4.__i] || p, y4.__i = a4, g3 = O(n3, y4, h4, i4, r4, o4, e4, f4, c4, s5), w4 = y4.__e, y4.ref && h4.ref != y4.ref && (h4.ref && q(h4.ref, null, y4), s5.push(y4.ref, y4.__c || w4, y4)), null == d4 && null != w4 && (d4 = w4), 4 & y4.__u || h4.__k === y4.__k ? f4 = A(y4, f4, n3) : "function" == typeof y4.type && void 0 !== g3 ? f4 = g3 : w4 && (f4 = w4.nextSibling), y4.__u &= -7);
    return u4.__e = d4, f4;
  }
  function P(n3, l5, u4, t4, i4) {
    var r4, o4, e4, f4, c4, s5 = u4.length, a4 = s5, h4 = 0;
    for (n3.__k = new Array(i4), r4 = 0; r4 < i4; r4++) null != (o4 = l5[r4]) && "boolean" != typeof o4 && "function" != typeof o4 ? (f4 = r4 + h4, (o4 = n3.__k[r4] = "string" == typeof o4 || "number" == typeof o4 || "bigint" == typeof o4 || o4.constructor == String ? m(null, o4, null, null, null) : w(o4) ? m(k, { children: o4 }, null, null, null) : null == o4.constructor && o4.__b > 0 ? m(o4.type, o4.props, o4.key, o4.ref ? o4.ref : null, o4.__v) : o4).__ = n3, o4.__b = n3.__b + 1, e4 = null, -1 != (c4 = o4.__i = L(o4, u4, f4, a4)) && (a4--, (e4 = u4[c4]) && (e4.__u |= 2)), null == e4 || null == e4.__v ? (-1 == c4 && (i4 > s5 ? h4-- : i4 < s5 && h4++), "function" != typeof o4.type && (o4.__u |= 4)) : c4 != f4 && (c4 == f4 - 1 ? h4-- : c4 == f4 + 1 ? h4++ : (c4 > f4 ? h4-- : h4++, o4.__u |= 4))) : n3.__k[r4] = null;
    if (a4) for (r4 = 0; r4 < s5; r4++) null != (e4 = u4[r4]) && 0 == (2 & e4.__u) && (e4.__e == t4 && (t4 = S(e4)), B(e4, e4));
    return t4;
  }
  function A(n3, l5, u4) {
    var t4, i4;
    if ("function" == typeof n3.type) {
      for (t4 = n3.__k, i4 = 0; t4 && i4 < t4.length; i4++) t4[i4] && (t4[i4].__ = n3, l5 = A(t4[i4], l5, u4));
      return l5;
    }
    n3.__e != l5 && (l5 && n3.type && !u4.contains(l5) && (l5 = S(n3)), u4.insertBefore(n3.__e, l5 || null), l5 = n3.__e);
    do {
      l5 = l5 && l5.nextSibling;
    } while (null != l5 && 8 == l5.nodeType);
    return l5;
  }
  function L(n3, l5, u4, t4) {
    var i4, r4, o4 = n3.key, e4 = n3.type, f4 = l5[u4];
    if (null === f4 && null == n3.key || f4 && o4 == f4.key && e4 == f4.type && 0 == (2 & f4.__u)) return u4;
    if (t4 > (null != f4 && 0 == (2 & f4.__u) ? 1 : 0)) for (i4 = u4 - 1, r4 = u4 + 1; i4 >= 0 || r4 < l5.length; ) {
      if (i4 >= 0) {
        if ((f4 = l5[i4]) && 0 == (2 & f4.__u) && o4 == f4.key && e4 == f4.type) return i4;
        i4--;
      }
      if (r4 < l5.length) {
        if ((f4 = l5[r4]) && 0 == (2 & f4.__u) && o4 == f4.key && e4 == f4.type) return r4;
        r4++;
      }
    }
    return -1;
  }
  function T(n3, l5, u4) {
    "-" == l5[0] ? n3.setProperty(l5, null == u4 ? "" : u4) : n3[l5] = null == u4 ? "" : "number" != typeof u4 || y.test(l5) ? u4 : u4 + "px";
  }
  function j(n3, l5, u4, t4, i4) {
    var r4, o4;
    n: if ("style" == l5) if ("string" == typeof u4) n3.style.cssText = u4;
    else {
      if ("string" == typeof t4 && (n3.style.cssText = t4 = ""), t4) for (l5 in t4) u4 && l5 in u4 || T(n3.style, l5, "");
      if (u4) for (l5 in u4) t4 && u4[l5] == t4[l5] || T(n3.style, l5, u4[l5]);
    }
    else if ("o" == l5[0] && "n" == l5[1]) r4 = l5 != (l5 = l5.replace(f, "$1")), o4 = l5.toLowerCase(), l5 = o4 in n3 || "onFocusOut" == l5 || "onFocusIn" == l5 ? o4.slice(2) : l5.slice(2), n3.l || (n3.l = {}), n3.l[l5 + r4] = u4, u4 ? t4 ? u4.u = t4.u : (u4.u = c, n3.addEventListener(l5, r4 ? a : s, r4)) : n3.removeEventListener(l5, r4 ? a : s, r4);
    else {
      if ("http://www.w3.org/2000/svg" == i4) l5 = l5.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if ("width" != l5 && "height" != l5 && "href" != l5 && "list" != l5 && "form" != l5 && "tabIndex" != l5 && "download" != l5 && "rowSpan" != l5 && "colSpan" != l5 && "role" != l5 && "popover" != l5 && l5 in n3) try {
        n3[l5] = null == u4 ? "" : u4;
        break n;
      } catch (n4) {
      }
      "function" == typeof u4 || (null == u4 || false === u4 && "-" != l5[4] ? n3.removeAttribute(l5) : n3.setAttribute(l5, "popover" == l5 && 1 == u4 ? "" : u4));
    }
  }
  function F(n3) {
    return function(u4) {
      if (this.l) {
        var t4 = this.l[u4.type + n3];
        if (null == u4.t) u4.t = c++;
        else if (u4.t < t4.u) return;
        return t4(l.event ? l.event(u4) : u4);
      }
    };
  }
  function O(n3, u4, t4, i4, r4, o4, e4, f4, c4, s5) {
    var a4, h4, p5, v5, y4, _3, m3, b2, S2, C3, M2, $2, P2, A3, H, L2, T3, j3 = u4.type;
    if (null != u4.constructor) return null;
    128 & t4.__u && (c4 = !!(32 & t4.__u), o4 = [f4 = u4.__e = t4.__e]), (a4 = l.__b) && a4(u4);
    n: if ("function" == typeof j3) try {
      if (b2 = u4.props, S2 = "prototype" in j3 && j3.prototype.render, C3 = (a4 = j3.contextType) && i4[a4.__c], M2 = a4 ? C3 ? C3.props.value : a4.__ : i4, t4.__c ? m3 = (h4 = u4.__c = t4.__c).__ = h4.__E : (S2 ? u4.__c = h4 = new j3(b2, M2) : (u4.__c = h4 = new x(b2, M2), h4.constructor = j3, h4.render = D), C3 && C3.sub(h4), h4.props = b2, h4.state || (h4.state = {}), h4.context = M2, h4.__n = i4, p5 = h4.__d = true, h4.__h = [], h4._sb = []), S2 && null == h4.__s && (h4.__s = h4.state), S2 && null != j3.getDerivedStateFromProps && (h4.__s == h4.state && (h4.__s = d({}, h4.__s)), d(h4.__s, j3.getDerivedStateFromProps(b2, h4.__s))), v5 = h4.props, y4 = h4.state, h4.__v = u4, p5) S2 && null == j3.getDerivedStateFromProps && null != h4.componentWillMount && h4.componentWillMount(), S2 && null != h4.componentDidMount && h4.__h.push(h4.componentDidMount);
      else {
        if (S2 && null == j3.getDerivedStateFromProps && b2 !== v5 && null != h4.componentWillReceiveProps && h4.componentWillReceiveProps(b2, M2), !h4.__e && null != h4.shouldComponentUpdate && false === h4.shouldComponentUpdate(b2, h4.__s, M2) || u4.__v == t4.__v) {
          for (u4.__v != t4.__v && (h4.props = b2, h4.state = h4.__s, h4.__d = false), u4.__e = t4.__e, u4.__k = t4.__k, u4.__k.some(function(n4) {
            n4 && (n4.__ = u4);
          }), $2 = 0; $2 < h4._sb.length; $2++) h4.__h.push(h4._sb[$2]);
          h4._sb = [], h4.__h.length && e4.push(h4);
          break n;
        }
        null != h4.componentWillUpdate && h4.componentWillUpdate(b2, h4.__s, M2), S2 && null != h4.componentDidUpdate && h4.__h.push(function() {
          h4.componentDidUpdate(v5, y4, _3);
        });
      }
      if (h4.context = M2, h4.props = b2, h4.__P = n3, h4.__e = false, P2 = l.__r, A3 = 0, S2) {
        for (h4.state = h4.__s, h4.__d = false, P2 && P2(u4), a4 = h4.render(h4.props, h4.state, h4.context), H = 0; H < h4._sb.length; H++) h4.__h.push(h4._sb[H]);
        h4._sb = [];
      } else do {
        h4.__d = false, P2 && P2(u4), a4 = h4.render(h4.props, h4.state, h4.context), h4.state = h4.__s;
      } while (h4.__d && ++A3 < 25);
      h4.state = h4.__s, null != h4.getChildContext && (i4 = d(d({}, i4), h4.getChildContext())), S2 && !p5 && null != h4.getSnapshotBeforeUpdate && (_3 = h4.getSnapshotBeforeUpdate(v5, y4)), L2 = a4, null != a4 && a4.type === k && null == a4.key && (L2 = N(a4.props.children)), f4 = I(n3, w(L2) ? L2 : [L2], u4, t4, i4, r4, o4, e4, f4, c4, s5), h4.base = u4.__e, u4.__u &= -161, h4.__h.length && e4.push(h4), m3 && (h4.__E = h4.__ = null);
    } catch (n4) {
      if (u4.__v = null, c4 || null != o4) if (n4.then) {
        for (u4.__u |= c4 ? 160 : 128; f4 && 8 == f4.nodeType && f4.nextSibling; ) f4 = f4.nextSibling;
        o4[o4.indexOf(f4)] = null, u4.__e = f4;
      } else for (T3 = o4.length; T3--; ) g(o4[T3]);
      else u4.__e = t4.__e, u4.__k = t4.__k;
      l.__e(n4, u4, t4);
    }
    else null == o4 && u4.__v == t4.__v ? (u4.__k = t4.__k, u4.__e = t4.__e) : f4 = u4.__e = V(t4.__e, u4, t4, i4, r4, o4, e4, c4, s5);
    return (a4 = l.diffed) && a4(u4), 128 & u4.__u ? void 0 : f4;
  }
  function z(n3, u4, t4) {
    for (var i4 = 0; i4 < t4.length; i4++) q(t4[i4], t4[++i4], t4[++i4]);
    l.__c && l.__c(u4, n3), n3.some(function(u5) {
      try {
        n3 = u5.__h, u5.__h = [], n3.some(function(n4) {
          n4.call(u5);
        });
      } catch (n4) {
        l.__e(n4, u5.__v);
      }
    });
  }
  function N(n3) {
    return "object" != typeof n3 || null == n3 || n3.__b && n3.__b > 0 ? n3 : w(n3) ? n3.map(N) : d({}, n3);
  }
  function V(u4, t4, i4, r4, o4, e4, f4, c4, s5) {
    var a4, h4, v5, y4, d4, _3, m3, b2 = i4.props, k3 = t4.props, x2 = t4.type;
    if ("svg" == x2 ? o4 = "http://www.w3.org/2000/svg" : "math" == x2 ? o4 = "http://www.w3.org/1998/Math/MathML" : o4 || (o4 = "http://www.w3.org/1999/xhtml"), null != e4) {
      for (a4 = 0; a4 < e4.length; a4++) if ((d4 = e4[a4]) && "setAttribute" in d4 == !!x2 && (x2 ? d4.localName == x2 : 3 == d4.nodeType)) {
        u4 = d4, e4[a4] = null;
        break;
      }
    }
    if (null == u4) {
      if (null == x2) return document.createTextNode(k3);
      u4 = document.createElementNS(o4, x2, k3.is && k3), c4 && (l.__m && l.__m(t4, e4), c4 = false), e4 = null;
    }
    if (null == x2) b2 === k3 || c4 && u4.data == k3 || (u4.data = k3);
    else {
      if (e4 = e4 && n.call(u4.childNodes), b2 = i4.props || p, !c4 && null != e4) for (b2 = {}, a4 = 0; a4 < u4.attributes.length; a4++) b2[(d4 = u4.attributes[a4]).name] = d4.value;
      for (a4 in b2) if (d4 = b2[a4], "children" == a4) ;
      else if ("dangerouslySetInnerHTML" == a4) v5 = d4;
      else if (!(a4 in k3)) {
        if ("value" == a4 && "defaultValue" in k3 || "checked" == a4 && "defaultChecked" in k3) continue;
        j(u4, a4, null, d4, o4);
      }
      for (a4 in k3) d4 = k3[a4], "children" == a4 ? y4 = d4 : "dangerouslySetInnerHTML" == a4 ? h4 = d4 : "value" == a4 ? _3 = d4 : "checked" == a4 ? m3 = d4 : c4 && "function" != typeof d4 || b2[a4] === d4 || j(u4, a4, d4, b2[a4], o4);
      if (h4) c4 || v5 && (h4.__html == v5.__html || h4.__html == u4.innerHTML) || (u4.innerHTML = h4.__html), t4.__k = [];
      else if (v5 && (u4.innerHTML = ""), I("template" == t4.type ? u4.content : u4, w(y4) ? y4 : [y4], t4, i4, r4, "foreignObject" == x2 ? "http://www.w3.org/1999/xhtml" : o4, e4, f4, e4 ? e4[0] : i4.__k && S(i4, 0), c4, s5), null != e4) for (a4 = e4.length; a4--; ) g(e4[a4]);
      c4 || (a4 = "value", "progress" == x2 && null == _3 ? u4.removeAttribute("value") : null != _3 && (_3 !== u4[a4] || "progress" == x2 && !_3 || "option" == x2 && _3 != b2[a4]) && j(u4, a4, _3, b2[a4], o4), a4 = "checked", null != m3 && m3 != u4[a4] && j(u4, a4, m3, b2[a4], o4));
    }
    return u4;
  }
  function q(n3, u4, t4) {
    try {
      if ("function" == typeof n3) {
        var i4 = "function" == typeof n3.__u;
        i4 && n3.__u(), i4 && null == u4 || (n3.__u = n3(u4));
      } else n3.current = u4;
    } catch (n4) {
      l.__e(n4, t4);
    }
  }
  function B(n3, u4, t4) {
    var i4, r4;
    if (l.unmount && l.unmount(n3), (i4 = n3.ref) && (i4.current && i4.current != n3.__e || q(i4, null, u4)), null != (i4 = n3.__c)) {
      if (i4.componentWillUnmount) try {
        i4.componentWillUnmount();
      } catch (n4) {
        l.__e(n4, u4);
      }
      i4.base = i4.__P = null;
    }
    if (i4 = n3.__k) for (r4 = 0; r4 < i4.length; r4++) i4[r4] && B(i4[r4], u4, t4 || "function" != typeof n3.type);
    t4 || g(n3.__e), n3.__c = n3.__ = n3.__e = void 0;
  }
  function D(n3, l5, u4) {
    return this.constructor(n3, u4);
  }
  function E(u4, t4, i4) {
    var r4, o4, e4, f4;
    t4 == document && (t4 = document.documentElement), l.__ && l.__(u4, t4), o4 = (r4 = "function" == typeof i4) ? null : i4 && i4.__k || t4.__k, e4 = [], f4 = [], O(t4, u4 = (!r4 && i4 || t4).__k = _(k, null, [u4]), o4 || p, p, t4.namespaceURI, !r4 && i4 ? [i4] : o4 ? null : t4.firstChild ? n.call(t4.childNodes) : null, e4, !r4 && i4 ? i4 : o4 ? o4.__e : t4.firstChild, r4, f4), z(e4, u4, f4);
  }
  n = v.slice, l = { __e: function(n3, l5, u4, t4) {
    for (var i4, r4, o4; l5 = l5.__; ) if ((i4 = l5.__c) && !i4.__) try {
      if ((r4 = i4.constructor) && null != r4.getDerivedStateFromError && (i4.setState(r4.getDerivedStateFromError(n3)), o4 = i4.__d), null != i4.componentDidCatch && (i4.componentDidCatch(n3, t4 || {}), o4 = i4.__d), o4) return i4.__E = i4;
    } catch (l6) {
      n3 = l6;
    }
    throw n3;
  } }, u = 0, t = function(n3) {
    return null != n3 && null == n3.constructor;
  }, x.prototype.setState = function(n3, l5) {
    var u4;
    u4 = null != this.__s && this.__s != this.state ? this.__s : this.__s = d({}, this.state), "function" == typeof n3 && (n3 = n3(d({}, u4), this.props)), n3 && d(u4, n3), null != n3 && this.__v && (l5 && this._sb.push(l5), M(this));
  }, x.prototype.forceUpdate = function(n3) {
    this.__v && (this.__e = true, n3 && this.__h.push(n3), M(this));
  }, x.prototype.render = k, i = [], o = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e = function(n3, l5) {
    return n3.__v.__b - l5.__v.__b;
  }, $.__r = 0, f = /(PointerCapture)$|Capture$/i, c = 0, s = F(false), a = F(true), h = 0;

  // ../../node_modules/.pnpm/preact@10.26.9/node_modules/preact/hooks/dist/hooks.module.js
  var t2;
  var r2;
  var u2;
  var i2;
  var o2 = 0;
  var f2 = [];
  var c2 = l;
  var e2 = c2.__b;
  var a2 = c2.__r;
  var v2 = c2.diffed;
  var l2 = c2.__c;
  var m2 = c2.unmount;
  var s2 = c2.__;
  function p2(n3, t4) {
    c2.__h && c2.__h(r2, n3, o2 || t4), o2 = 0;
    var u4 = r2.__H || (r2.__H = { __: [], __h: [] });
    return n3 >= u4.__.length && u4.__.push({}), u4.__[n3];
  }
  function T2(n3, r4) {
    var u4 = p2(t2++, 7);
    return C2(u4.__H, r4) && (u4.__ = n3(), u4.__H = r4, u4.__h = n3), u4.__;
  }
  function j2() {
    for (var n3; n3 = f2.shift(); ) if (n3.__P && n3.__H) try {
      n3.__H.__h.forEach(z2), n3.__H.__h.forEach(B2), n3.__H.__h = [];
    } catch (t4) {
      n3.__H.__h = [], c2.__e(t4, n3.__v);
    }
  }
  c2.__b = function(n3) {
    r2 = null, e2 && e2(n3);
  }, c2.__ = function(n3, t4) {
    n3 && t4.__k && t4.__k.__m && (n3.__m = t4.__k.__m), s2 && s2(n3, t4);
  }, c2.__r = function(n3) {
    a2 && a2(n3), t2 = 0;
    var i4 = (r2 = n3.__c).__H;
    i4 && (u2 === r2 ? (i4.__h = [], r2.__h = [], i4.__.forEach(function(n4) {
      n4.__N && (n4.__ = n4.__N), n4.u = n4.__N = void 0;
    })) : (i4.__h.forEach(z2), i4.__h.forEach(B2), i4.__h = [], t2 = 0)), u2 = r2;
  }, c2.diffed = function(n3) {
    v2 && v2(n3);
    var t4 = n3.__c;
    t4 && t4.__H && (t4.__H.__h.length && (1 !== f2.push(t4) && i2 === c2.requestAnimationFrame || ((i2 = c2.requestAnimationFrame) || w2)(j2)), t4.__H.__.forEach(function(n4) {
      n4.u && (n4.__H = n4.u), n4.u = void 0;
    })), u2 = r2 = null;
  }, c2.__c = function(n3, t4) {
    t4.some(function(n4) {
      try {
        n4.__h.forEach(z2), n4.__h = n4.__h.filter(function(n5) {
          return !n5.__ || B2(n5);
        });
      } catch (r4) {
        t4.some(function(n5) {
          n5.__h && (n5.__h = []);
        }), t4 = [], c2.__e(r4, n4.__v);
      }
    }), l2 && l2(n3, t4);
  }, c2.unmount = function(n3) {
    m2 && m2(n3);
    var t4, r4 = n3.__c;
    r4 && r4.__H && (r4.__H.__.forEach(function(n4) {
      try {
        z2(n4);
      } catch (n5) {
        t4 = n5;
      }
    }), r4.__H = void 0, t4 && c2.__e(t4, r4.__v));
  };
  var k2 = "function" == typeof requestAnimationFrame;
  function w2(n3) {
    var t4, r4 = function() {
      clearTimeout(u4), k2 && cancelAnimationFrame(t4), setTimeout(n3);
    }, u4 = setTimeout(r4, 35);
    k2 && (t4 = requestAnimationFrame(r4));
  }
  function z2(n3) {
    var t4 = r2, u4 = n3.__c;
    "function" == typeof u4 && (n3.__c = void 0, u4()), r2 = t4;
  }
  function B2(n3) {
    var t4 = r2;
    n3.__c = n3.__(), r2 = t4;
  }
  function C2(n3, t4) {
    return !n3 || n3.length !== t4.length || t4.some(function(t5, r4) {
      return t5 !== n3[r4];
    });
  }

  // ../../node_modules/.pnpm/@preact+signals-core@1.10.0/node_modules/@preact/signals-core/dist/signals-core.module.js
  var i3 = Symbol.for("preact-signals");
  function t3() {
    if (!(s3 > 1)) {
      var i4, t4 = false;
      while (void 0 !== h2) {
        var r4 = h2;
        h2 = void 0;
        f3++;
        while (void 0 !== r4) {
          var o4 = r4.o;
          r4.o = void 0;
          r4.f &= -3;
          if (!(8 & r4.f) && c3(r4)) try {
            r4.c();
          } catch (r5) {
            if (!t4) {
              i4 = r5;
              t4 = true;
            }
          }
          r4 = o4;
        }
      }
      f3 = 0;
      s3--;
      if (t4) throw i4;
    } else s3--;
  }
  var o3 = void 0;
  function n2(i4) {
    var t4 = o3;
    o3 = void 0;
    try {
      return i4();
    } finally {
      o3 = t4;
    }
  }
  var h2 = void 0;
  var s3 = 0;
  var f3 = 0;
  var v3 = 0;
  function e3(i4) {
    if (void 0 !== o3) {
      var t4 = i4.n;
      if (void 0 === t4 || t4.t !== o3) {
        t4 = { i: 0, S: i4, p: o3.s, n: void 0, t: o3, e: void 0, x: void 0, r: t4 };
        if (void 0 !== o3.s) o3.s.n = t4;
        o3.s = t4;
        i4.n = t4;
        if (32 & o3.f) i4.S(t4);
        return t4;
      } else if (-1 === t4.i) {
        t4.i = 0;
        if (void 0 !== t4.n) {
          t4.n.p = t4.p;
          if (void 0 !== t4.p) t4.p.n = t4.n;
          t4.p = o3.s;
          t4.n = void 0;
          o3.s.n = t4;
          o3.s = t4;
        }
        return t4;
      }
    }
  }
  function u3(i4, t4) {
    this.v = i4;
    this.i = 0;
    this.n = void 0;
    this.t = void 0;
    this.W = null == t4 ? void 0 : t4.watched;
    this.Z = null == t4 ? void 0 : t4.unwatched;
  }
  u3.prototype.brand = i3;
  u3.prototype.h = function() {
    return true;
  };
  u3.prototype.S = function(i4) {
    var t4 = this, r4 = this.t;
    if (r4 !== i4 && void 0 === i4.e) {
      i4.x = r4;
      this.t = i4;
      if (void 0 !== r4) r4.e = i4;
      else n2(function() {
        var i5;
        null == (i5 = t4.W) || i5.call(t4);
      });
    }
  };
  u3.prototype.U = function(i4) {
    var t4 = this;
    if (void 0 !== this.t) {
      var r4 = i4.e, o4 = i4.x;
      if (void 0 !== r4) {
        r4.x = o4;
        i4.e = void 0;
      }
      if (void 0 !== o4) {
        o4.e = r4;
        i4.x = void 0;
      }
      if (i4 === this.t) {
        this.t = o4;
        if (void 0 === o4) n2(function() {
          var i5;
          null == (i5 = t4.Z) || i5.call(t4);
        });
      }
    }
  };
  u3.prototype.subscribe = function(i4) {
    var t4 = this;
    return E2(function() {
      var r4 = t4.value, n3 = o3;
      o3 = void 0;
      try {
        i4(r4);
      } finally {
        o3 = n3;
      }
    });
  };
  u3.prototype.valueOf = function() {
    return this.value;
  };
  u3.prototype.toString = function() {
    return this.value + "";
  };
  u3.prototype.toJSON = function() {
    return this.value;
  };
  u3.prototype.peek = function() {
    var i4 = o3;
    o3 = void 0;
    try {
      return this.value;
    } finally {
      o3 = i4;
    }
  };
  Object.defineProperty(u3.prototype, "value", { get: function() {
    var i4 = e3(this);
    if (void 0 !== i4) i4.i = this.i;
    return this.v;
  }, set: function(i4) {
    if (i4 !== this.v) {
      if (f3 > 100) throw new Error("Cycle detected");
      this.v = i4;
      this.i++;
      v3++;
      s3++;
      try {
        for (var r4 = this.t; void 0 !== r4; r4 = r4.x) r4.t.N();
      } finally {
        t3();
      }
    }
  } });
  function d2(i4, t4) {
    return new u3(i4, t4);
  }
  function c3(i4) {
    for (var t4 = i4.s; void 0 !== t4; t4 = t4.n) if (t4.S.i !== t4.i || !t4.S.h() || t4.S.i !== t4.i) return true;
    return false;
  }
  function a3(i4) {
    for (var t4 = i4.s; void 0 !== t4; t4 = t4.n) {
      var r4 = t4.S.n;
      if (void 0 !== r4) t4.r = r4;
      t4.S.n = t4;
      t4.i = -1;
      if (void 0 === t4.n) {
        i4.s = t4;
        break;
      }
    }
  }
  function l3(i4) {
    var t4 = i4.s, r4 = void 0;
    while (void 0 !== t4) {
      var o4 = t4.p;
      if (-1 === t4.i) {
        t4.S.U(t4);
        if (void 0 !== o4) o4.n = t4.n;
        if (void 0 !== t4.n) t4.n.p = o4;
      } else r4 = t4;
      t4.S.n = t4.r;
      if (void 0 !== t4.r) t4.r = void 0;
      t4 = o4;
    }
    i4.s = r4;
  }
  function y2(i4, t4) {
    u3.call(this, void 0);
    this.x = i4;
    this.s = void 0;
    this.g = v3 - 1;
    this.f = 4;
    this.W = null == t4 ? void 0 : t4.watched;
    this.Z = null == t4 ? void 0 : t4.unwatched;
  }
  y2.prototype = new u3();
  y2.prototype.h = function() {
    this.f &= -3;
    if (1 & this.f) return false;
    if (32 == (36 & this.f)) return true;
    this.f &= -5;
    if (this.g === v3) return true;
    this.g = v3;
    this.f |= 1;
    if (this.i > 0 && !c3(this)) {
      this.f &= -2;
      return true;
    }
    var i4 = o3;
    try {
      a3(this);
      o3 = this;
      var t4 = this.x();
      if (16 & this.f || this.v !== t4 || 0 === this.i) {
        this.v = t4;
        this.f &= -17;
        this.i++;
      }
    } catch (i5) {
      this.v = i5;
      this.f |= 16;
      this.i++;
    }
    o3 = i4;
    l3(this);
    this.f &= -2;
    return true;
  };
  y2.prototype.S = function(i4) {
    if (void 0 === this.t) {
      this.f |= 36;
      for (var t4 = this.s; void 0 !== t4; t4 = t4.n) t4.S.S(t4);
    }
    u3.prototype.S.call(this, i4);
  };
  y2.prototype.U = function(i4) {
    if (void 0 !== this.t) {
      u3.prototype.U.call(this, i4);
      if (void 0 === this.t) {
        this.f &= -33;
        for (var t4 = this.s; void 0 !== t4; t4 = t4.n) t4.S.U(t4);
      }
    }
  };
  y2.prototype.N = function() {
    if (!(2 & this.f)) {
      this.f |= 6;
      for (var i4 = this.t; void 0 !== i4; i4 = i4.x) i4.t.N();
    }
  };
  Object.defineProperty(y2.prototype, "value", { get: function() {
    if (1 & this.f) throw new Error("Cycle detected");
    var i4 = e3(this);
    this.h();
    if (void 0 !== i4) i4.i = this.i;
    if (16 & this.f) throw this.v;
    return this.v;
  } });
  function w3(i4, t4) {
    return new y2(i4, t4);
  }
  function _2(i4) {
    var r4 = i4.u;
    i4.u = void 0;
    if ("function" == typeof r4) {
      s3++;
      var n3 = o3;
      o3 = void 0;
      try {
        r4();
      } catch (t4) {
        i4.f &= -2;
        i4.f |= 8;
        g2(i4);
        throw t4;
      } finally {
        o3 = n3;
        t3();
      }
    }
  }
  function g2(i4) {
    for (var t4 = i4.s; void 0 !== t4; t4 = t4.n) t4.S.U(t4);
    i4.x = void 0;
    i4.s = void 0;
    _2(i4);
  }
  function p3(i4) {
    if (o3 !== this) throw new Error("Out-of-order effect");
    l3(this);
    o3 = i4;
    this.f &= -2;
    if (8 & this.f) g2(this);
    t3();
  }
  function b(i4) {
    this.x = i4;
    this.u = void 0;
    this.s = void 0;
    this.o = void 0;
    this.f = 32;
  }
  b.prototype.c = function() {
    var i4 = this.S();
    try {
      if (8 & this.f) return;
      if (void 0 === this.x) return;
      var t4 = this.x();
      if ("function" == typeof t4) this.u = t4;
    } finally {
      i4();
    }
  };
  b.prototype.S = function() {
    if (1 & this.f) throw new Error("Cycle detected");
    this.f |= 1;
    this.f &= -9;
    _2(this);
    a3(this);
    s3++;
    var i4 = o3;
    o3 = this;
    return p3.bind(this, i4);
  };
  b.prototype.N = function() {
    if (!(2 & this.f)) {
      this.f |= 2;
      this.o = h2;
      h2 = this;
    }
  };
  b.prototype.d = function() {
    this.f |= 8;
    if (!(1 & this.f)) g2(this);
  };
  b.prototype.dispose = function() {
    this.d();
  };
  function E2(i4) {
    var t4 = new b(i4);
    try {
      t4.c();
    } catch (i5) {
      t4.d();
      throw i5;
    }
    return t4.d.bind(t4);
  }

  // ../../node_modules/.pnpm/@preact+signals@1.3.2_preact@10.26.9/node_modules/@preact/signals/dist/signals.module.js
  var v4;
  var s4;
  function l4(i4, n3) {
    l[i4] = n3.bind(null, l[i4] || function() {
    });
  }
  function d3(i4) {
    if (s4) s4();
    s4 = i4 && i4.S();
  }
  function h3(i4) {
    var r4 = this, f4 = i4.data, o4 = useSignal(f4);
    o4.value = f4;
    var e4 = T2(function() {
      var i5 = r4.__v;
      while (i5 = i5.__) if (i5.__c) {
        i5.__c.__$f |= 4;
        break;
      }
      r4.__$u.c = function() {
        var i6, t4 = r4.__$u.S(), f5 = e4.value;
        t4();
        if (t(f5) || 3 !== (null == (i6 = r4.base) ? void 0 : i6.nodeType)) {
          r4.__$f |= 1;
          r4.setState({});
        } else r4.base.data = f5;
      };
      return w3(function() {
        var i6 = o4.value.value;
        return 0 === i6 ? 0 : true === i6 ? "" : i6 || "";
      });
    }, []);
    return e4.value;
  }
  h3.displayName = "_st";
  Object.defineProperties(u3.prototype, { constructor: { configurable: true, value: void 0 }, type: { configurable: true, value: h3 }, props: { configurable: true, get: function() {
    return { data: this };
  } }, __b: { configurable: true, value: 1 } });
  l4("__b", function(i4, r4) {
    if ("string" == typeof r4.type) {
      var n3, t4 = r4.props;
      for (var f4 in t4) if ("children" !== f4) {
        var o4 = t4[f4];
        if (o4 instanceof u3) {
          if (!n3) r4.__np = n3 = {};
          n3[f4] = o4;
          t4[f4] = o4.peek();
        }
      }
    }
    i4(r4);
  });
  l4("__r", function(i4, r4) {
    d3();
    var n3, t4 = r4.__c;
    if (t4) {
      t4.__$f &= -2;
      if (void 0 === (n3 = t4.__$u)) t4.__$u = n3 = function(i5) {
        var r5;
        E2(function() {
          r5 = this;
        });
        r5.c = function() {
          t4.__$f |= 1;
          t4.setState({});
        };
        return r5;
      }();
    }
    v4 = t4;
    d3(n3);
    i4(r4);
  });
  l4("__e", function(i4, r4, n3, t4) {
    d3();
    v4 = void 0;
    i4(r4, n3, t4);
  });
  l4("diffed", function(i4, r4) {
    d3();
    v4 = void 0;
    var n3;
    if ("string" == typeof r4.type && (n3 = r4.__e)) {
      var t4 = r4.__np, f4 = r4.props;
      if (t4) {
        var o4 = n3.U;
        if (o4) for (var e4 in o4) {
          var u4 = o4[e4];
          if (void 0 !== u4 && !(e4 in t4)) {
            u4.d();
            o4[e4] = void 0;
          }
        }
        else n3.U = o4 = {};
        for (var a4 in t4) {
          var c4 = o4[a4], s5 = t4[a4];
          if (void 0 === c4) {
            c4 = p4(n3, a4, s5, f4);
            o4[a4] = c4;
          } else c4.o(s5, f4);
        }
      }
    }
    i4(r4);
  });
  function p4(i4, r4, n3, t4) {
    var f4 = r4 in i4 && void 0 === i4.ownerSVGElement, o4 = d2(n3);
    return { o: function(i5, r5) {
      o4.value = i5;
      t4 = r5;
    }, d: E2(function() {
      var n4 = o4.value.value;
      if (t4[r4] !== n4) {
        t4[r4] = n4;
        if (f4) i4[r4] = n4;
        else if (n4) i4.setAttribute(r4, n4);
        else i4.removeAttribute(r4);
      }
    }) };
  }
  l4("unmount", function(i4, r4) {
    if ("string" == typeof r4.type) {
      var n3 = r4.__e;
      if (n3) {
        var t4 = n3.U;
        if (t4) {
          n3.U = void 0;
          for (var f4 in t4) {
            var o4 = t4[f4];
            if (o4) o4.d();
          }
        }
      }
    } else {
      var e4 = r4.__c;
      if (e4) {
        var u4 = e4.__$u;
        if (u4) {
          e4.__$u = void 0;
          u4.d();
        }
      }
    }
    i4(r4);
  });
  l4("__h", function(i4, r4, n3, t4) {
    if (t4 < 3 || 9 === t4) r4.__$f |= 2;
    i4(r4, n3, t4);
  });
  x.prototype.shouldComponentUpdate = function(i4, r4) {
    var n3 = this.__$u, t4 = n3 && void 0 !== n3.s;
    for (var f4 in r4) return true;
    if (this.__f || "boolean" == typeof this.u && true === this.u) {
      if (!(t4 || 2 & this.__$f || 4 & this.__$f)) return true;
      if (1 & this.__$f) return true;
    } else {
      if (!(t4 || 4 & this.__$f)) return true;
      if (3 & this.__$f) return true;
    }
    for (var o4 in i4) if ("__source" !== o4 && i4[o4] !== this.props[o4]) return true;
    for (var e4 in this.props) if (!(e4 in i4)) return true;
    return false;
  };
  function useSignal(i4) {
    return T2(function() {
      return d2(i4);
    }, []);
  }

  // ../../node_modules/.pnpm/marked@11.2.0/node_modules/marked/lib/marked.esm.js
  function _getDefaults() {
    return {
      async: false,
      breaks: false,
      extensions: null,
      gfm: true,
      hooks: null,
      pedantic: false,
      renderer: null,
      silent: false,
      tokenizer: null,
      walkTokens: null
    };
  }
  var _defaults = _getDefaults();
  function changeDefaults(newDefaults) {
    _defaults = newDefaults;
  }
  var escapeTest = /[&<>"']/;
  var escapeReplace = new RegExp(escapeTest.source, "g");
  var escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/;
  var escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, "g");
  var escapeReplacements = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  var getEscapeReplacement = (ch) => escapeReplacements[ch];
  function escape$1(html2, encode) {
    if (encode) {
      if (escapeTest.test(html2)) {
        return html2.replace(escapeReplace, getEscapeReplacement);
      }
    } else {
      if (escapeTestNoEncode.test(html2)) {
        return html2.replace(escapeReplaceNoEncode, getEscapeReplacement);
      }
    }
    return html2;
  }
  var unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;
  function unescape(html2) {
    return html2.replace(unescapeTest, (_3, n3) => {
      n3 = n3.toLowerCase();
      if (n3 === "colon")
        return ":";
      if (n3.charAt(0) === "#") {
        return n3.charAt(1) === "x" ? String.fromCharCode(parseInt(n3.substring(2), 16)) : String.fromCharCode(+n3.substring(1));
      }
      return "";
    });
  }
  var caret = /(^|[^\[])\^/g;
  function edit(regex, opt) {
    let source = typeof regex === "string" ? regex : regex.source;
    opt = opt || "";
    const obj = {
      replace: (name, val) => {
        let valSource = typeof val === "string" ? val : val.source;
        valSource = valSource.replace(caret, "$1");
        source = source.replace(name, valSource);
        return obj;
      },
      getRegex: () => {
        return new RegExp(source, opt);
      }
    };
    return obj;
  }
  function cleanUrl(href) {
    try {
      href = encodeURI(href).replace(/%25/g, "%");
    } catch (e4) {
      return null;
    }
    return href;
  }
  var noopTest = { exec: () => null };
  function splitCells(tableRow, count) {
    const row = tableRow.replace(/\|/g, (match, offset, str) => {
      let escaped = false;
      let curr = offset;
      while (--curr >= 0 && str[curr] === "\\")
        escaped = !escaped;
      if (escaped) {
        return "|";
      } else {
        return " |";
      }
    }), cells = row.split(/ \|/);
    let i4 = 0;
    if (!cells[0].trim()) {
      cells.shift();
    }
    if (cells.length > 0 && !cells[cells.length - 1].trim()) {
      cells.pop();
    }
    if (count) {
      if (cells.length > count) {
        cells.splice(count);
      } else {
        while (cells.length < count)
          cells.push("");
      }
    }
    for (; i4 < cells.length; i4++) {
      cells[i4] = cells[i4].trim().replace(/\\\|/g, "|");
    }
    return cells;
  }
  function rtrim(str, c4, invert) {
    const l5 = str.length;
    if (l5 === 0) {
      return "";
    }
    let suffLen = 0;
    while (suffLen < l5) {
      const currChar = str.charAt(l5 - suffLen - 1);
      if (currChar === c4 && !invert) {
        suffLen++;
      } else if (currChar !== c4 && invert) {
        suffLen++;
      } else {
        break;
      }
    }
    return str.slice(0, l5 - suffLen);
  }
  function findClosingBracket(str, b2) {
    if (str.indexOf(b2[1]) === -1) {
      return -1;
    }
    let level = 0;
    for (let i4 = 0; i4 < str.length; i4++) {
      if (str[i4] === "\\") {
        i4++;
      } else if (str[i4] === b2[0]) {
        level++;
      } else if (str[i4] === b2[1]) {
        level--;
        if (level < 0) {
          return i4;
        }
      }
    }
    return -1;
  }
  function outputLink(cap, link2, raw, lexer2) {
    const href = link2.href;
    const title = link2.title ? escape$1(link2.title) : null;
    const text = cap[1].replace(/\\([\[\]])/g, "$1");
    if (cap[0].charAt(0) !== "!") {
      lexer2.state.inLink = true;
      const token = {
        type: "link",
        raw,
        href,
        title,
        text,
        tokens: lexer2.inlineTokens(text)
      };
      lexer2.state.inLink = false;
      return token;
    }
    return {
      type: "image",
      raw,
      href,
      title,
      text: escape$1(text)
    };
  }
  function indentCodeCompensation(raw, text) {
    const matchIndentToCode = raw.match(/^(\s+)(?:```)/);
    if (matchIndentToCode === null) {
      return text;
    }
    const indentToCode = matchIndentToCode[1];
    return text.split("\n").map((node) => {
      const matchIndentInNode = node.match(/^\s+/);
      if (matchIndentInNode === null) {
        return node;
      }
      const [indentInNode] = matchIndentInNode;
      if (indentInNode.length >= indentToCode.length) {
        return node.slice(indentToCode.length);
      }
      return node;
    }).join("\n");
  }
  var _Tokenizer = class {
    // set by the lexer
    constructor(options2) {
      __publicField(this, "options");
      __publicField(this, "rules");
      // set by the lexer
      __publicField(this, "lexer");
      this.options = options2 || _defaults;
    }
    space(src) {
      const cap = this.rules.block.newline.exec(src);
      if (cap && cap[0].length > 0) {
        return {
          type: "space",
          raw: cap[0]
        };
      }
    }
    code(src) {
      const cap = this.rules.block.code.exec(src);
      if (cap) {
        const text = cap[0].replace(/^ {1,4}/gm, "");
        return {
          type: "code",
          raw: cap[0],
          codeBlockStyle: "indented",
          text: !this.options.pedantic ? rtrim(text, "\n") : text
        };
      }
    }
    fences(src) {
      const cap = this.rules.block.fences.exec(src);
      if (cap) {
        const raw = cap[0];
        const text = indentCodeCompensation(raw, cap[3] || "");
        return {
          type: "code",
          raw,
          lang: cap[2] ? cap[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : cap[2],
          text
        };
      }
    }
    heading(src) {
      const cap = this.rules.block.heading.exec(src);
      if (cap) {
        let text = cap[2].trim();
        if (/#$/.test(text)) {
          const trimmed = rtrim(text, "#");
          if (this.options.pedantic) {
            text = trimmed.trim();
          } else if (!trimmed || / $/.test(trimmed)) {
            text = trimmed.trim();
          }
        }
        return {
          type: "heading",
          raw: cap[0],
          depth: cap[1].length,
          text,
          tokens: this.lexer.inline(text)
        };
      }
    }
    hr(src) {
      const cap = this.rules.block.hr.exec(src);
      if (cap) {
        return {
          type: "hr",
          raw: cap[0]
        };
      }
    }
    blockquote(src) {
      const cap = this.rules.block.blockquote.exec(src);
      if (cap) {
        const text = rtrim(cap[0].replace(/^ *>[ \t]?/gm, ""), "\n");
        const top = this.lexer.state.top;
        this.lexer.state.top = true;
        const tokens = this.lexer.blockTokens(text);
        this.lexer.state.top = top;
        return {
          type: "blockquote",
          raw: cap[0],
          tokens,
          text
        };
      }
    }
    list(src) {
      let cap = this.rules.block.list.exec(src);
      if (cap) {
        let bull = cap[1].trim();
        const isordered = bull.length > 1;
        const list2 = {
          type: "list",
          raw: "",
          ordered: isordered,
          start: isordered ? +bull.slice(0, -1) : "",
          loose: false,
          items: []
        };
        bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`;
        if (this.options.pedantic) {
          bull = isordered ? bull : "[*+-]";
        }
        const itemRegex = new RegExp(`^( {0,3}${bull})((?:[	 ][^\\n]*)?(?:\\n|$))`);
        let raw = "";
        let itemContents = "";
        let endsWithBlankLine = false;
        while (src) {
          let endEarly = false;
          if (!(cap = itemRegex.exec(src))) {
            break;
          }
          if (this.rules.block.hr.test(src)) {
            break;
          }
          raw = cap[0];
          src = src.substring(raw.length);
          let line = cap[2].split("\n", 1)[0].replace(/^\t+/, (t4) => " ".repeat(3 * t4.length));
          let nextLine = src.split("\n", 1)[0];
          let indent = 0;
          if (this.options.pedantic) {
            indent = 2;
            itemContents = line.trimStart();
          } else {
            indent = cap[2].search(/[^ ]/);
            indent = indent > 4 ? 1 : indent;
            itemContents = line.slice(indent);
            indent += cap[1].length;
          }
          let blankLine = false;
          if (!line && /^ *$/.test(nextLine)) {
            raw += nextLine + "\n";
            src = src.substring(nextLine.length + 1);
            endEarly = true;
          }
          if (!endEarly) {
            const nextBulletRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`);
            const hrRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`);
            const fencesBeginRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:\`\`\`|~~~)`);
            const headingBeginRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}#`);
            while (src) {
              const rawLine = src.split("\n", 1)[0];
              nextLine = rawLine;
              if (this.options.pedantic) {
                nextLine = nextLine.replace(/^ {1,4}(?=( {4})*[^ ])/g, "  ");
              }
              if (fencesBeginRegex.test(nextLine)) {
                break;
              }
              if (headingBeginRegex.test(nextLine)) {
                break;
              }
              if (nextBulletRegex.test(nextLine)) {
                break;
              }
              if (hrRegex.test(src)) {
                break;
              }
              if (nextLine.search(/[^ ]/) >= indent || !nextLine.trim()) {
                itemContents += "\n" + nextLine.slice(indent);
              } else {
                if (blankLine) {
                  break;
                }
                if (line.search(/[^ ]/) >= 4) {
                  break;
                }
                if (fencesBeginRegex.test(line)) {
                  break;
                }
                if (headingBeginRegex.test(line)) {
                  break;
                }
                if (hrRegex.test(line)) {
                  break;
                }
                itemContents += "\n" + nextLine;
              }
              if (!blankLine && !nextLine.trim()) {
                blankLine = true;
              }
              raw += rawLine + "\n";
              src = src.substring(rawLine.length + 1);
              line = nextLine.slice(indent);
            }
          }
          if (!list2.loose) {
            if (endsWithBlankLine) {
              list2.loose = true;
            } else if (/\n *\n *$/.test(raw)) {
              endsWithBlankLine = true;
            }
          }
          let istask = null;
          let ischecked;
          if (this.options.gfm) {
            istask = /^\[[ xX]\] /.exec(itemContents);
            if (istask) {
              ischecked = istask[0] !== "[ ] ";
              itemContents = itemContents.replace(/^\[[ xX]\] +/, "");
            }
          }
          list2.items.push({
            type: "list_item",
            raw,
            task: !!istask,
            checked: ischecked,
            loose: false,
            text: itemContents,
            tokens: []
          });
          list2.raw += raw;
        }
        list2.items[list2.items.length - 1].raw = raw.trimEnd();
        list2.items[list2.items.length - 1].text = itemContents.trimEnd();
        list2.raw = list2.raw.trimEnd();
        for (let i4 = 0; i4 < list2.items.length; i4++) {
          this.lexer.state.top = false;
          list2.items[i4].tokens = this.lexer.blockTokens(list2.items[i4].text, []);
          if (!list2.loose) {
            const spacers = list2.items[i4].tokens.filter((t4) => t4.type === "space");
            const hasMultipleLineBreaks = spacers.length > 0 && spacers.some((t4) => /\n.*\n/.test(t4.raw));
            list2.loose = hasMultipleLineBreaks;
          }
        }
        if (list2.loose) {
          for (let i4 = 0; i4 < list2.items.length; i4++) {
            list2.items[i4].loose = true;
          }
        }
        return list2;
      }
    }
    html(src) {
      const cap = this.rules.block.html.exec(src);
      if (cap) {
        const token = {
          type: "html",
          block: true,
          raw: cap[0],
          pre: cap[1] === "pre" || cap[1] === "script" || cap[1] === "style",
          text: cap[0]
        };
        return token;
      }
    }
    def(src) {
      const cap = this.rules.block.def.exec(src);
      if (cap) {
        const tag2 = cap[1].toLowerCase().replace(/\s+/g, " ");
        const href = cap[2] ? cap[2].replace(/^<(.*)>$/, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "";
        const title = cap[3] ? cap[3].substring(1, cap[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : cap[3];
        return {
          type: "def",
          tag: tag2,
          raw: cap[0],
          href,
          title
        };
      }
    }
    table(src) {
      const cap = this.rules.block.table.exec(src);
      if (!cap) {
        return;
      }
      if (!/[:|]/.test(cap[2])) {
        return;
      }
      const headers = splitCells(cap[1]);
      const aligns = cap[2].replace(/^\||\| *$/g, "").split("|");
      const rows = cap[3] && cap[3].trim() ? cap[3].replace(/\n[ \t]*$/, "").split("\n") : [];
      const item = {
        type: "table",
        raw: cap[0],
        header: [],
        align: [],
        rows: []
      };
      if (headers.length !== aligns.length) {
        return;
      }
      for (const align of aligns) {
        if (/^ *-+: *$/.test(align)) {
          item.align.push("right");
        } else if (/^ *:-+: *$/.test(align)) {
          item.align.push("center");
        } else if (/^ *:-+ *$/.test(align)) {
          item.align.push("left");
        } else {
          item.align.push(null);
        }
      }
      for (const header of headers) {
        item.header.push({
          text: header,
          tokens: this.lexer.inline(header)
        });
      }
      for (const row of rows) {
        item.rows.push(splitCells(row, item.header.length).map((cell) => {
          return {
            text: cell,
            tokens: this.lexer.inline(cell)
          };
        }));
      }
      return item;
    }
    lheading(src) {
      const cap = this.rules.block.lheading.exec(src);
      if (cap) {
        return {
          type: "heading",
          raw: cap[0],
          depth: cap[2].charAt(0) === "=" ? 1 : 2,
          text: cap[1],
          tokens: this.lexer.inline(cap[1])
        };
      }
    }
    paragraph(src) {
      const cap = this.rules.block.paragraph.exec(src);
      if (cap) {
        const text = cap[1].charAt(cap[1].length - 1) === "\n" ? cap[1].slice(0, -1) : cap[1];
        return {
          type: "paragraph",
          raw: cap[0],
          text,
          tokens: this.lexer.inline(text)
        };
      }
    }
    text(src) {
      const cap = this.rules.block.text.exec(src);
      if (cap) {
        return {
          type: "text",
          raw: cap[0],
          text: cap[0],
          tokens: this.lexer.inline(cap[0])
        };
      }
    }
    escape(src) {
      const cap = this.rules.inline.escape.exec(src);
      if (cap) {
        return {
          type: "escape",
          raw: cap[0],
          text: escape$1(cap[1])
        };
      }
    }
    tag(src) {
      const cap = this.rules.inline.tag.exec(src);
      if (cap) {
        if (!this.lexer.state.inLink && /^<a /i.test(cap[0])) {
          this.lexer.state.inLink = true;
        } else if (this.lexer.state.inLink && /^<\/a>/i.test(cap[0])) {
          this.lexer.state.inLink = false;
        }
        if (!this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
          this.lexer.state.inRawBlock = true;
        } else if (this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
          this.lexer.state.inRawBlock = false;
        }
        return {
          type: "html",
          raw: cap[0],
          inLink: this.lexer.state.inLink,
          inRawBlock: this.lexer.state.inRawBlock,
          block: false,
          text: cap[0]
        };
      }
    }
    link(src) {
      const cap = this.rules.inline.link.exec(src);
      if (cap) {
        const trimmedUrl = cap[2].trim();
        if (!this.options.pedantic && /^</.test(trimmedUrl)) {
          if (!/>$/.test(trimmedUrl)) {
            return;
          }
          const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), "\\");
          if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
            return;
          }
        } else {
          const lastParenIndex = findClosingBracket(cap[2], "()");
          if (lastParenIndex > -1) {
            const start = cap[0].indexOf("!") === 0 ? 5 : 4;
            const linkLen = start + cap[1].length + lastParenIndex;
            cap[2] = cap[2].substring(0, lastParenIndex);
            cap[0] = cap[0].substring(0, linkLen).trim();
            cap[3] = "";
          }
        }
        let href = cap[2];
        let title = "";
        if (this.options.pedantic) {
          const link2 = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);
          if (link2) {
            href = link2[1];
            title = link2[3];
          }
        } else {
          title = cap[3] ? cap[3].slice(1, -1) : "";
        }
        href = href.trim();
        if (/^</.test(href)) {
          if (this.options.pedantic && !/>$/.test(trimmedUrl)) {
            href = href.slice(1);
          } else {
            href = href.slice(1, -1);
          }
        }
        return outputLink(cap, {
          href: href ? href.replace(this.rules.inline.anyPunctuation, "$1") : href,
          title: title ? title.replace(this.rules.inline.anyPunctuation, "$1") : title
        }, cap[0], this.lexer);
      }
    }
    reflink(src, links) {
      let cap;
      if ((cap = this.rules.inline.reflink.exec(src)) || (cap = this.rules.inline.nolink.exec(src))) {
        const linkString = (cap[2] || cap[1]).replace(/\s+/g, " ");
        const link2 = links[linkString.toLowerCase()];
        if (!link2) {
          const text = cap[0].charAt(0);
          return {
            type: "text",
            raw: text,
            text
          };
        }
        return outputLink(cap, link2, cap[0], this.lexer);
      }
    }
    emStrong(src, maskedSrc, prevChar = "") {
      let match = this.rules.inline.emStrongLDelim.exec(src);
      if (!match)
        return;
      if (match[3] && prevChar.match(/[\p{L}\p{N}]/u))
        return;
      const nextChar = match[1] || match[2] || "";
      if (!nextChar || !prevChar || this.rules.inline.punctuation.exec(prevChar)) {
        const lLength = [...match[0]].length - 1;
        let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;
        const endReg = match[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
        endReg.lastIndex = 0;
        maskedSrc = maskedSrc.slice(-1 * src.length + lLength);
        while ((match = endReg.exec(maskedSrc)) != null) {
          rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];
          if (!rDelim)
            continue;
          rLength = [...rDelim].length;
          if (match[3] || match[4]) {
            delimTotal += rLength;
            continue;
          } else if (match[5] || match[6]) {
            if (lLength % 3 && !((lLength + rLength) % 3)) {
              midDelimTotal += rLength;
              continue;
            }
          }
          delimTotal -= rLength;
          if (delimTotal > 0)
            continue;
          rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);
          const lastCharLength = [...match[0]][0].length;
          const raw = src.slice(0, lLength + match.index + lastCharLength + rLength);
          if (Math.min(lLength, rLength) % 2) {
            const text2 = raw.slice(1, -1);
            return {
              type: "em",
              raw,
              text: text2,
              tokens: this.lexer.inlineTokens(text2)
            };
          }
          const text = raw.slice(2, -2);
          return {
            type: "strong",
            raw,
            text,
            tokens: this.lexer.inlineTokens(text)
          };
        }
      }
    }
    codespan(src) {
      const cap = this.rules.inline.code.exec(src);
      if (cap) {
        let text = cap[2].replace(/\n/g, " ");
        const hasNonSpaceChars = /[^ ]/.test(text);
        const hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);
        if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
          text = text.substring(1, text.length - 1);
        }
        text = escape$1(text, true);
        return {
          type: "codespan",
          raw: cap[0],
          text
        };
      }
    }
    br(src) {
      const cap = this.rules.inline.br.exec(src);
      if (cap) {
        return {
          type: "br",
          raw: cap[0]
        };
      }
    }
    del(src) {
      const cap = this.rules.inline.del.exec(src);
      if (cap) {
        return {
          type: "del",
          raw: cap[0],
          text: cap[2],
          tokens: this.lexer.inlineTokens(cap[2])
        };
      }
    }
    autolink(src) {
      const cap = this.rules.inline.autolink.exec(src);
      if (cap) {
        let text, href;
        if (cap[2] === "@") {
          text = escape$1(cap[1]);
          href = "mailto:" + text;
        } else {
          text = escape$1(cap[1]);
          href = text;
        }
        return {
          type: "link",
          raw: cap[0],
          text,
          href,
          tokens: [
            {
              type: "text",
              raw: text,
              text
            }
          ]
        };
      }
    }
    url(src) {
      let cap;
      if (cap = this.rules.inline.url.exec(src)) {
        let text, href;
        if (cap[2] === "@") {
          text = escape$1(cap[0]);
          href = "mailto:" + text;
        } else {
          let prevCapZero;
          do {
            prevCapZero = cap[0];
            cap[0] = this.rules.inline._backpedal.exec(cap[0])?.[0] ?? "";
          } while (prevCapZero !== cap[0]);
          text = escape$1(cap[0]);
          if (cap[1] === "www.") {
            href = "http://" + cap[0];
          } else {
            href = cap[0];
          }
        }
        return {
          type: "link",
          raw: cap[0],
          text,
          href,
          tokens: [
            {
              type: "text",
              raw: text,
              text
            }
          ]
        };
      }
    }
    inlineText(src) {
      const cap = this.rules.inline.text.exec(src);
      if (cap) {
        let text;
        if (this.lexer.state.inRawBlock) {
          text = cap[0];
        } else {
          text = escape$1(cap[0]);
        }
        return {
          type: "text",
          raw: cap[0],
          text
        };
      }
    }
  };
  var newline = /^(?: *(?:\n|$))+/;
  var blockCode = /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/;
  var fences = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
  var hr = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
  var heading = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
  var bullet = /(?:[*+-]|\d{1,9}[.)])/;
  var lheading = edit(/^(?!bull )((?:.|\n(?!\s*?\n|bull ))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g, bullet).getRegex();
  var _paragraph = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/;
  var blockText = /^[^\n]+/;
  var _blockLabel = /(?!\s*\])(?:\\.|[^\[\]\\])+/;
  var def = edit(/^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/).replace("label", _blockLabel).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
  var list = edit(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, bullet).getRegex();
  var _tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
  var _comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/;
  var html = edit("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))", "i").replace("comment", _comment).replace("tag", _tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
  var paragraph = edit(_paragraph).replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex();
  var blockquote = edit(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", paragraph).getRegex();
  var blockNormal = {
    blockquote,
    code: blockCode,
    def,
    fences,
    heading,
    hr,
    html,
    lheading,
    list,
    newline,
    paragraph,
    table: noopTest,
    text: blockText
  };
  var gfmTable = edit("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex();
  var blockGfm = {
    ...blockNormal,
    table: gfmTable,
    paragraph: edit(_paragraph).replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", gfmTable).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex()
  };
  var blockPedantic = {
    ...blockNormal,
    html: edit(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", _comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
    heading: /^(#{1,6})(.*)(?:\n+|$)/,
    fences: noopTest,
    // fences not supported
    lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
    paragraph: edit(_paragraph).replace("hr", hr).replace("heading", " *#{1,6} *[^\n]").replace("lheading", lheading).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
  };
  var escape = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
  var inlineCode = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
  var br = /^( {2,}|\\)\n(?!\s*$)/;
  var inlineText = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
  var _punctuation = "\\p{P}$+<=>`^|~";
  var punctuation = edit(/^((?![*_])[\spunctuation])/, "u").replace(/punctuation/g, _punctuation).getRegex();
  var blockSkip = /\[[^[\]]*?\]\([^\(\)]*?\)|`[^`]*?`|<[^<>]*?>/g;
  var emStrongLDelim = edit(/^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/, "u").replace(/punct/g, _punctuation).getRegex();
  var emStrongRDelimAst = edit("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)[punct](\\*+)(?=[\\s]|$)|[^punct\\s](\\*+)(?!\\*)(?=[punct\\s]|$)|(?!\\*)[punct\\s](\\*+)(?=[^punct\\s])|[\\s](\\*+)(?!\\*)(?=[punct])|(?!\\*)[punct](\\*+)(?!\\*)(?=[punct])|[^punct\\s](\\*+)(?=[^punct\\s])", "gu").replace(/punct/g, _punctuation).getRegex();
  var emStrongRDelimUnd = edit("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\\s]|$)|[^punct\\s](_+)(?!_)(?=[punct\\s]|$)|(?!_)[punct\\s](_+)(?=[^punct\\s])|[\\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])", "gu").replace(/punct/g, _punctuation).getRegex();
  var anyPunctuation = edit(/\\([punct])/, "gu").replace(/punct/g, _punctuation).getRegex();
  var autolink = edit(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
  var _inlineComment = edit(_comment).replace("(?:-->|$)", "-->").getRegex();
  var tag = edit("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", _inlineComment).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
  var _inlineLabel = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
  var link = edit(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label", _inlineLabel).replace("href", /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
  var reflink = edit(/^!?\[(label)\]\[(ref)\]/).replace("label", _inlineLabel).replace("ref", _blockLabel).getRegex();
  var nolink = edit(/^!?\[(ref)\](?:\[\])?/).replace("ref", _blockLabel).getRegex();
  var reflinkSearch = edit("reflink|nolink(?!\\()", "g").replace("reflink", reflink).replace("nolink", nolink).getRegex();
  var inlineNormal = {
    _backpedal: noopTest,
    // only used for GFM url
    anyPunctuation,
    autolink,
    blockSkip,
    br,
    code: inlineCode,
    del: noopTest,
    emStrongLDelim,
    emStrongRDelimAst,
    emStrongRDelimUnd,
    escape,
    link,
    nolink,
    punctuation,
    reflink,
    reflinkSearch,
    tag,
    text: inlineText,
    url: noopTest
  };
  var inlinePedantic = {
    ...inlineNormal,
    link: edit(/^!?\[(label)\]\((.*?)\)/).replace("label", _inlineLabel).getRegex(),
    reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", _inlineLabel).getRegex()
  };
  var inlineGfm = {
    ...inlineNormal,
    escape: edit(escape).replace("])", "~|])").getRegex(),
    url: edit(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
    _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
    del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
    text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
  };
  var inlineBreaks = {
    ...inlineGfm,
    br: edit(br).replace("{2,}", "*").getRegex(),
    text: edit(inlineGfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
  };
  var block = {
    normal: blockNormal,
    gfm: blockGfm,
    pedantic: blockPedantic
  };
  var inline = {
    normal: inlineNormal,
    gfm: inlineGfm,
    breaks: inlineBreaks,
    pedantic: inlinePedantic
  };
  var _Lexer = class __Lexer {
    constructor(options2) {
      __publicField(this, "tokens");
      __publicField(this, "options");
      __publicField(this, "state");
      __publicField(this, "tokenizer");
      __publicField(this, "inlineQueue");
      this.tokens = [];
      this.tokens.links = /* @__PURE__ */ Object.create(null);
      this.options = options2 || _defaults;
      this.options.tokenizer = this.options.tokenizer || new _Tokenizer();
      this.tokenizer = this.options.tokenizer;
      this.tokenizer.options = this.options;
      this.tokenizer.lexer = this;
      this.inlineQueue = [];
      this.state = {
        inLink: false,
        inRawBlock: false,
        top: true
      };
      const rules = {
        block: block.normal,
        inline: inline.normal
      };
      if (this.options.pedantic) {
        rules.block = block.pedantic;
        rules.inline = inline.pedantic;
      } else if (this.options.gfm) {
        rules.block = block.gfm;
        if (this.options.breaks) {
          rules.inline = inline.breaks;
        } else {
          rules.inline = inline.gfm;
        }
      }
      this.tokenizer.rules = rules;
    }
    /**
     * Expose Rules
     */
    static get rules() {
      return {
        block,
        inline
      };
    }
    /**
     * Static Lex Method
     */
    static lex(src, options2) {
      const lexer2 = new __Lexer(options2);
      return lexer2.lex(src);
    }
    /**
     * Static Lex Inline Method
     */
    static lexInline(src, options2) {
      const lexer2 = new __Lexer(options2);
      return lexer2.inlineTokens(src);
    }
    /**
     * Preprocessing
     */
    lex(src) {
      src = src.replace(/\r\n|\r/g, "\n");
      this.blockTokens(src, this.tokens);
      for (let i4 = 0; i4 < this.inlineQueue.length; i4++) {
        const next = this.inlineQueue[i4];
        this.inlineTokens(next.src, next.tokens);
      }
      this.inlineQueue = [];
      return this.tokens;
    }
    blockTokens(src, tokens = []) {
      if (this.options.pedantic) {
        src = src.replace(/\t/g, "    ").replace(/^ +$/gm, "");
      } else {
        src = src.replace(/^( *)(\t+)/gm, (_3, leading, tabs) => {
          return leading + "    ".repeat(tabs.length);
        });
      }
      let token;
      let lastToken;
      let cutSrc;
      let lastParagraphClipped;
      while (src) {
        if (this.options.extensions && this.options.extensions.block && this.options.extensions.block.some((extTokenizer) => {
          if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            return true;
          }
          return false;
        })) {
          continue;
        }
        if (token = this.tokenizer.space(src)) {
          src = src.substring(token.raw.length);
          if (token.raw.length === 1 && tokens.length > 0) {
            tokens[tokens.length - 1].raw += "\n";
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (token = this.tokenizer.code(src)) {
          src = src.substring(token.raw.length);
          lastToken = tokens[tokens.length - 1];
          if (lastToken && (lastToken.type === "paragraph" || lastToken.type === "text")) {
            lastToken.raw += "\n" + token.raw;
            lastToken.text += "\n" + token.text;
            this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (token = this.tokenizer.fences(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.heading(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.hr(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.blockquote(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.list(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.html(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.def(src)) {
          src = src.substring(token.raw.length);
          lastToken = tokens[tokens.length - 1];
          if (lastToken && (lastToken.type === "paragraph" || lastToken.type === "text")) {
            lastToken.raw += "\n" + token.raw;
            lastToken.text += "\n" + token.raw;
            this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
          } else if (!this.tokens.links[token.tag]) {
            this.tokens.links[token.tag] = {
              href: token.href,
              title: token.title
            };
          }
          continue;
        }
        if (token = this.tokenizer.table(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.lheading(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        cutSrc = src;
        if (this.options.extensions && this.options.extensions.startBlock) {
          let startIndex = Infinity;
          const tempSrc = src.slice(1);
          let tempStart;
          this.options.extensions.startBlock.forEach((getStartIndex) => {
            tempStart = getStartIndex.call({ lexer: this }, tempSrc);
            if (typeof tempStart === "number" && tempStart >= 0) {
              startIndex = Math.min(startIndex, tempStart);
            }
          });
          if (startIndex < Infinity && startIndex >= 0) {
            cutSrc = src.substring(0, startIndex + 1);
          }
        }
        if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
          lastToken = tokens[tokens.length - 1];
          if (lastParagraphClipped && lastToken.type === "paragraph") {
            lastToken.raw += "\n" + token.raw;
            lastToken.text += "\n" + token.text;
            this.inlineQueue.pop();
            this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
          } else {
            tokens.push(token);
          }
          lastParagraphClipped = cutSrc.length !== src.length;
          src = src.substring(token.raw.length);
          continue;
        }
        if (token = this.tokenizer.text(src)) {
          src = src.substring(token.raw.length);
          lastToken = tokens[tokens.length - 1];
          if (lastToken && lastToken.type === "text") {
            lastToken.raw += "\n" + token.raw;
            lastToken.text += "\n" + token.text;
            this.inlineQueue.pop();
            this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (src) {
          const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
          if (this.options.silent) {
            console.error(errMsg);
            break;
          } else {
            throw new Error(errMsg);
          }
        }
      }
      this.state.top = true;
      return tokens;
    }
    inline(src, tokens = []) {
      this.inlineQueue.push({ src, tokens });
      return tokens;
    }
    /**
     * Lexing/Compiling
     */
    inlineTokens(src, tokens = []) {
      let token, lastToken, cutSrc;
      let maskedSrc = src;
      let match;
      let keepPrevChar, prevChar;
      if (this.tokens.links) {
        const links = Object.keys(this.tokens.links);
        if (links.length > 0) {
          while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
            if (links.includes(match[0].slice(match[0].lastIndexOf("[") + 1, -1))) {
              maskedSrc = maskedSrc.slice(0, match.index) + "[" + "a".repeat(match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
            }
          }
        }
      }
      while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
        maskedSrc = maskedSrc.slice(0, match.index) + "[" + "a".repeat(match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
      }
      while ((match = this.tokenizer.rules.inline.anyPunctuation.exec(maskedSrc)) != null) {
        maskedSrc = maskedSrc.slice(0, match.index) + "++" + maskedSrc.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
      }
      while (src) {
        if (!keepPrevChar) {
          prevChar = "";
        }
        keepPrevChar = false;
        if (this.options.extensions && this.options.extensions.inline && this.options.extensions.inline.some((extTokenizer) => {
          if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            return true;
          }
          return false;
        })) {
          continue;
        }
        if (token = this.tokenizer.escape(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.tag(src)) {
          src = src.substring(token.raw.length);
          lastToken = tokens[tokens.length - 1];
          if (lastToken && token.type === "text" && lastToken.type === "text") {
            lastToken.raw += token.raw;
            lastToken.text += token.text;
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (token = this.tokenizer.link(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.reflink(src, this.tokens.links)) {
          src = src.substring(token.raw.length);
          lastToken = tokens[tokens.length - 1];
          if (lastToken && token.type === "text" && lastToken.type === "text") {
            lastToken.raw += token.raw;
            lastToken.text += token.text;
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.codespan(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.br(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.del(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.autolink(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (!this.state.inLink && (token = this.tokenizer.url(src))) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        cutSrc = src;
        if (this.options.extensions && this.options.extensions.startInline) {
          let startIndex = Infinity;
          const tempSrc = src.slice(1);
          let tempStart;
          this.options.extensions.startInline.forEach((getStartIndex) => {
            tempStart = getStartIndex.call({ lexer: this }, tempSrc);
            if (typeof tempStart === "number" && tempStart >= 0) {
              startIndex = Math.min(startIndex, tempStart);
            }
          });
          if (startIndex < Infinity && startIndex >= 0) {
            cutSrc = src.substring(0, startIndex + 1);
          }
        }
        if (token = this.tokenizer.inlineText(cutSrc)) {
          src = src.substring(token.raw.length);
          if (token.raw.slice(-1) !== "_") {
            prevChar = token.raw.slice(-1);
          }
          keepPrevChar = true;
          lastToken = tokens[tokens.length - 1];
          if (lastToken && lastToken.type === "text") {
            lastToken.raw += token.raw;
            lastToken.text += token.text;
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (src) {
          const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
          if (this.options.silent) {
            console.error(errMsg);
            break;
          } else {
            throw new Error(errMsg);
          }
        }
      }
      return tokens;
    }
  };
  var _Renderer = class {
    constructor(options2) {
      __publicField(this, "options");
      this.options = options2 || _defaults;
    }
    code(code, infostring, escaped) {
      const lang = (infostring || "").match(/^\S*/)?.[0];
      code = code.replace(/\n$/, "") + "\n";
      if (!lang) {
        return "<pre><code>" + (escaped ? code : escape$1(code, true)) + "</code></pre>\n";
      }
      return '<pre><code class="language-' + escape$1(lang) + '">' + (escaped ? code : escape$1(code, true)) + "</code></pre>\n";
    }
    blockquote(quote) {
      return `<blockquote>
${quote}</blockquote>
`;
    }
    html(html2, block2) {
      return html2;
    }
    heading(text, level, raw) {
      return `<h${level}>${text}</h${level}>
`;
    }
    hr() {
      return "<hr>\n";
    }
    list(body, ordered, start) {
      const type = ordered ? "ol" : "ul";
      const startatt = ordered && start !== 1 ? ' start="' + start + '"' : "";
      return "<" + type + startatt + ">\n" + body + "</" + type + ">\n";
    }
    listitem(text, task, checked) {
      return `<li>${text}</li>
`;
    }
    checkbox(checked) {
      return "<input " + (checked ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
    }
    paragraph(text) {
      return `<p>${text}</p>
`;
    }
    table(header, body) {
      if (body)
        body = `<tbody>${body}</tbody>`;
      return "<table>\n<thead>\n" + header + "</thead>\n" + body + "</table>\n";
    }
    tablerow(content) {
      return `<tr>
${content}</tr>
`;
    }
    tablecell(content, flags) {
      const type = flags.header ? "th" : "td";
      const tag2 = flags.align ? `<${type} align="${flags.align}">` : `<${type}>`;
      return tag2 + content + `</${type}>
`;
    }
    /**
     * span level renderer
     */
    strong(text) {
      return `<strong>${text}</strong>`;
    }
    em(text) {
      return `<em>${text}</em>`;
    }
    codespan(text) {
      return `<code>${text}</code>`;
    }
    br() {
      return "<br>";
    }
    del(text) {
      return `<del>${text}</del>`;
    }
    link(href, title, text) {
      const cleanHref = cleanUrl(href);
      if (cleanHref === null) {
        return text;
      }
      href = cleanHref;
      let out = '<a href="' + href + '"';
      if (title) {
        out += ' title="' + title + '"';
      }
      out += ">" + text + "</a>";
      return out;
    }
    image(href, title, text) {
      const cleanHref = cleanUrl(href);
      if (cleanHref === null) {
        return text;
      }
      href = cleanHref;
      let out = `<img src="${href}" alt="${text}"`;
      if (title) {
        out += ` title="${title}"`;
      }
      out += ">";
      return out;
    }
    text(text) {
      return text;
    }
  };
  var _TextRenderer = class {
    // no need for block level renderers
    strong(text) {
      return text;
    }
    em(text) {
      return text;
    }
    codespan(text) {
      return text;
    }
    del(text) {
      return text;
    }
    html(text) {
      return text;
    }
    text(text) {
      return text;
    }
    link(href, title, text) {
      return "" + text;
    }
    image(href, title, text) {
      return "" + text;
    }
    br() {
      return "";
    }
  };
  var _Parser = class __Parser {
    constructor(options2) {
      __publicField(this, "options");
      __publicField(this, "renderer");
      __publicField(this, "textRenderer");
      this.options = options2 || _defaults;
      this.options.renderer = this.options.renderer || new _Renderer();
      this.renderer = this.options.renderer;
      this.renderer.options = this.options;
      this.textRenderer = new _TextRenderer();
    }
    /**
     * Static Parse Method
     */
    static parse(tokens, options2) {
      const parser2 = new __Parser(options2);
      return parser2.parse(tokens);
    }
    /**
     * Static Parse Inline Method
     */
    static parseInline(tokens, options2) {
      const parser2 = new __Parser(options2);
      return parser2.parseInline(tokens);
    }
    /**
     * Parse Loop
     */
    parse(tokens, top = true) {
      let out = "";
      for (let i4 = 0; i4 < tokens.length; i4++) {
        const token = tokens[i4];
        if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
          const genericToken = token;
          const ret = this.options.extensions.renderers[genericToken.type].call({ parser: this }, genericToken);
          if (ret !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(genericToken.type)) {
            out += ret || "";
            continue;
          }
        }
        switch (token.type) {
          case "space": {
            continue;
          }
          case "hr": {
            out += this.renderer.hr();
            continue;
          }
          case "heading": {
            const headingToken = token;
            out += this.renderer.heading(this.parseInline(headingToken.tokens), headingToken.depth, unescape(this.parseInline(headingToken.tokens, this.textRenderer)));
            continue;
          }
          case "code": {
            const codeToken = token;
            out += this.renderer.code(codeToken.text, codeToken.lang, !!codeToken.escaped);
            continue;
          }
          case "table": {
            const tableToken = token;
            let header = "";
            let cell = "";
            for (let j3 = 0; j3 < tableToken.header.length; j3++) {
              cell += this.renderer.tablecell(this.parseInline(tableToken.header[j3].tokens), { header: true, align: tableToken.align[j3] });
            }
            header += this.renderer.tablerow(cell);
            let body = "";
            for (let j3 = 0; j3 < tableToken.rows.length; j3++) {
              const row = tableToken.rows[j3];
              cell = "";
              for (let k3 = 0; k3 < row.length; k3++) {
                cell += this.renderer.tablecell(this.parseInline(row[k3].tokens), { header: false, align: tableToken.align[k3] });
              }
              body += this.renderer.tablerow(cell);
            }
            out += this.renderer.table(header, body);
            continue;
          }
          case "blockquote": {
            const blockquoteToken = token;
            const body = this.parse(blockquoteToken.tokens);
            out += this.renderer.blockquote(body);
            continue;
          }
          case "list": {
            const listToken = token;
            const ordered = listToken.ordered;
            const start = listToken.start;
            const loose = listToken.loose;
            let body = "";
            for (let j3 = 0; j3 < listToken.items.length; j3++) {
              const item = listToken.items[j3];
              const checked = item.checked;
              const task = item.task;
              let itemBody = "";
              if (item.task) {
                const checkbox = this.renderer.checkbox(!!checked);
                if (loose) {
                  if (item.tokens.length > 0 && item.tokens[0].type === "paragraph") {
                    item.tokens[0].text = checkbox + " " + item.tokens[0].text;
                    if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === "text") {
                      item.tokens[0].tokens[0].text = checkbox + " " + item.tokens[0].tokens[0].text;
                    }
                  } else {
                    item.tokens.unshift({
                      type: "text",
                      text: checkbox + " "
                    });
                  }
                } else {
                  itemBody += checkbox + " ";
                }
              }
              itemBody += this.parse(item.tokens, loose);
              body += this.renderer.listitem(itemBody, task, !!checked);
            }
            out += this.renderer.list(body, ordered, start);
            continue;
          }
          case "html": {
            const htmlToken = token;
            out += this.renderer.html(htmlToken.text, htmlToken.block);
            continue;
          }
          case "paragraph": {
            const paragraphToken = token;
            out += this.renderer.paragraph(this.parseInline(paragraphToken.tokens));
            continue;
          }
          case "text": {
            let textToken = token;
            let body = textToken.tokens ? this.parseInline(textToken.tokens) : textToken.text;
            while (i4 + 1 < tokens.length && tokens[i4 + 1].type === "text") {
              textToken = tokens[++i4];
              body += "\n" + (textToken.tokens ? this.parseInline(textToken.tokens) : textToken.text);
            }
            out += top ? this.renderer.paragraph(body) : body;
            continue;
          }
          default: {
            const errMsg = 'Token with "' + token.type + '" type was not found.';
            if (this.options.silent) {
              console.error(errMsg);
              return "";
            } else {
              throw new Error(errMsg);
            }
          }
        }
      }
      return out;
    }
    /**
     * Parse Inline Tokens
     */
    parseInline(tokens, renderer) {
      renderer = renderer || this.renderer;
      let out = "";
      for (let i4 = 0; i4 < tokens.length; i4++) {
        const token = tokens[i4];
        if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
          const ret = this.options.extensions.renderers[token.type].call({ parser: this }, token);
          if (ret !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(token.type)) {
            out += ret || "";
            continue;
          }
        }
        switch (token.type) {
          case "escape": {
            const escapeToken = token;
            out += renderer.text(escapeToken.text);
            break;
          }
          case "html": {
            const tagToken = token;
            out += renderer.html(tagToken.text);
            break;
          }
          case "link": {
            const linkToken = token;
            out += renderer.link(linkToken.href, linkToken.title, this.parseInline(linkToken.tokens, renderer));
            break;
          }
          case "image": {
            const imageToken = token;
            out += renderer.image(imageToken.href, imageToken.title, imageToken.text);
            break;
          }
          case "strong": {
            const strongToken = token;
            out += renderer.strong(this.parseInline(strongToken.tokens, renderer));
            break;
          }
          case "em": {
            const emToken = token;
            out += renderer.em(this.parseInline(emToken.tokens, renderer));
            break;
          }
          case "codespan": {
            const codespanToken = token;
            out += renderer.codespan(codespanToken.text);
            break;
          }
          case "br": {
            out += renderer.br();
            break;
          }
          case "del": {
            const delToken = token;
            out += renderer.del(this.parseInline(delToken.tokens, renderer));
            break;
          }
          case "text": {
            const textToken = token;
            out += renderer.text(textToken.text);
            break;
          }
          default: {
            const errMsg = 'Token with "' + token.type + '" type was not found.';
            if (this.options.silent) {
              console.error(errMsg);
              return "";
            } else {
              throw new Error(errMsg);
            }
          }
        }
      }
      return out;
    }
  };
  var _Hooks = class {
    constructor(options2) {
      __publicField(this, "options");
      this.options = options2 || _defaults;
    }
    /**
     * Process markdown before marked
     */
    preprocess(markdown) {
      return markdown;
    }
    /**
     * Process HTML after marked is finished
     */
    postprocess(html2) {
      return html2;
    }
    /**
     * Process all tokens before walk tokens
     */
    processAllTokens(tokens) {
      return tokens;
    }
  };
  __publicField(_Hooks, "passThroughHooks", /* @__PURE__ */ new Set([
    "preprocess",
    "postprocess",
    "processAllTokens"
  ]));
  var _Marked_instances, parseMarkdown_fn, onError_fn;
  var Marked = class {
    constructor(...args) {
      __privateAdd(this, _Marked_instances);
      __publicField(this, "defaults", _getDefaults());
      __publicField(this, "options", this.setOptions);
      __publicField(this, "parse", __privateMethod(this, _Marked_instances, parseMarkdown_fn).call(this, _Lexer.lex, _Parser.parse));
      __publicField(this, "parseInline", __privateMethod(this, _Marked_instances, parseMarkdown_fn).call(this, _Lexer.lexInline, _Parser.parseInline));
      __publicField(this, "Parser", _Parser);
      __publicField(this, "Renderer", _Renderer);
      __publicField(this, "TextRenderer", _TextRenderer);
      __publicField(this, "Lexer", _Lexer);
      __publicField(this, "Tokenizer", _Tokenizer);
      __publicField(this, "Hooks", _Hooks);
      this.use(...args);
    }
    /**
     * Run callback for every token
     */
    walkTokens(tokens, callback) {
      let values = [];
      for (const token of tokens) {
        values = values.concat(callback.call(this, token));
        switch (token.type) {
          case "table": {
            const tableToken = token;
            for (const cell of tableToken.header) {
              values = values.concat(this.walkTokens(cell.tokens, callback));
            }
            for (const row of tableToken.rows) {
              for (const cell of row) {
                values = values.concat(this.walkTokens(cell.tokens, callback));
              }
            }
            break;
          }
          case "list": {
            const listToken = token;
            values = values.concat(this.walkTokens(listToken.items, callback));
            break;
          }
          default: {
            const genericToken = token;
            if (this.defaults.extensions?.childTokens?.[genericToken.type]) {
              this.defaults.extensions.childTokens[genericToken.type].forEach((childTokens) => {
                const tokens2 = genericToken[childTokens].flat(Infinity);
                values = values.concat(this.walkTokens(tokens2, callback));
              });
            } else if (genericToken.tokens) {
              values = values.concat(this.walkTokens(genericToken.tokens, callback));
            }
          }
        }
      }
      return values;
    }
    use(...args) {
      const extensions = this.defaults.extensions || { renderers: {}, childTokens: {} };
      args.forEach((pack) => {
        const opts = { ...pack };
        opts.async = this.defaults.async || opts.async || false;
        if (pack.extensions) {
          pack.extensions.forEach((ext) => {
            if (!ext.name) {
              throw new Error("extension name required");
            }
            if ("renderer" in ext) {
              const prevRenderer = extensions.renderers[ext.name];
              if (prevRenderer) {
                extensions.renderers[ext.name] = function(...args2) {
                  let ret = ext.renderer.apply(this, args2);
                  if (ret === false) {
                    ret = prevRenderer.apply(this, args2);
                  }
                  return ret;
                };
              } else {
                extensions.renderers[ext.name] = ext.renderer;
              }
            }
            if ("tokenizer" in ext) {
              if (!ext.level || ext.level !== "block" && ext.level !== "inline") {
                throw new Error("extension level must be 'block' or 'inline'");
              }
              const extLevel = extensions[ext.level];
              if (extLevel) {
                extLevel.unshift(ext.tokenizer);
              } else {
                extensions[ext.level] = [ext.tokenizer];
              }
              if (ext.start) {
                if (ext.level === "block") {
                  if (extensions.startBlock) {
                    extensions.startBlock.push(ext.start);
                  } else {
                    extensions.startBlock = [ext.start];
                  }
                } else if (ext.level === "inline") {
                  if (extensions.startInline) {
                    extensions.startInline.push(ext.start);
                  } else {
                    extensions.startInline = [ext.start];
                  }
                }
              }
            }
            if ("childTokens" in ext && ext.childTokens) {
              extensions.childTokens[ext.name] = ext.childTokens;
            }
          });
          opts.extensions = extensions;
        }
        if (pack.renderer) {
          const renderer = this.defaults.renderer || new _Renderer(this.defaults);
          for (const prop in pack.renderer) {
            if (!(prop in renderer)) {
              throw new Error(`renderer '${prop}' does not exist`);
            }
            if (prop === "options") {
              continue;
            }
            const rendererProp = prop;
            const rendererFunc = pack.renderer[rendererProp];
            const prevRenderer = renderer[rendererProp];
            renderer[rendererProp] = (...args2) => {
              let ret = rendererFunc.apply(renderer, args2);
              if (ret === false) {
                ret = prevRenderer.apply(renderer, args2);
              }
              return ret || "";
            };
          }
          opts.renderer = renderer;
        }
        if (pack.tokenizer) {
          const tokenizer = this.defaults.tokenizer || new _Tokenizer(this.defaults);
          for (const prop in pack.tokenizer) {
            if (!(prop in tokenizer)) {
              throw new Error(`tokenizer '${prop}' does not exist`);
            }
            if (["options", "rules", "lexer"].includes(prop)) {
              continue;
            }
            const tokenizerProp = prop;
            const tokenizerFunc = pack.tokenizer[tokenizerProp];
            const prevTokenizer = tokenizer[tokenizerProp];
            tokenizer[tokenizerProp] = (...args2) => {
              let ret = tokenizerFunc.apply(tokenizer, args2);
              if (ret === false) {
                ret = prevTokenizer.apply(tokenizer, args2);
              }
              return ret;
            };
          }
          opts.tokenizer = tokenizer;
        }
        if (pack.hooks) {
          const hooks = this.defaults.hooks || new _Hooks();
          for (const prop in pack.hooks) {
            if (!(prop in hooks)) {
              throw new Error(`hook '${prop}' does not exist`);
            }
            if (prop === "options") {
              continue;
            }
            const hooksProp = prop;
            const hooksFunc = pack.hooks[hooksProp];
            const prevHook = hooks[hooksProp];
            if (_Hooks.passThroughHooks.has(prop)) {
              hooks[hooksProp] = (arg) => {
                if (this.defaults.async) {
                  return Promise.resolve(hooksFunc.call(hooks, arg)).then((ret2) => {
                    return prevHook.call(hooks, ret2);
                  });
                }
                const ret = hooksFunc.call(hooks, arg);
                return prevHook.call(hooks, ret);
              };
            } else {
              hooks[hooksProp] = (...args2) => {
                let ret = hooksFunc.apply(hooks, args2);
                if (ret === false) {
                  ret = prevHook.apply(hooks, args2);
                }
                return ret;
              };
            }
          }
          opts.hooks = hooks;
        }
        if (pack.walkTokens) {
          const walkTokens2 = this.defaults.walkTokens;
          const packWalktokens = pack.walkTokens;
          opts.walkTokens = function(token) {
            let values = [];
            values.push(packWalktokens.call(this, token));
            if (walkTokens2) {
              values = values.concat(walkTokens2.call(this, token));
            }
            return values;
          };
        }
        this.defaults = { ...this.defaults, ...opts };
      });
      return this;
    }
    setOptions(opt) {
      this.defaults = { ...this.defaults, ...opt };
      return this;
    }
    lexer(src, options2) {
      return _Lexer.lex(src, options2 ?? this.defaults);
    }
    parser(tokens, options2) {
      return _Parser.parse(tokens, options2 ?? this.defaults);
    }
  };
  _Marked_instances = new WeakSet();
  parseMarkdown_fn = function(lexer2, parser2) {
    return (src, options2) => {
      const origOpt = { ...options2 };
      const opt = { ...this.defaults, ...origOpt };
      if (this.defaults.async === true && origOpt.async === false) {
        if (!opt.silent) {
          console.warn("marked(): The async option was set to true by an extension. The async: false option sent to parse will be ignored.");
        }
        opt.async = true;
      }
      const throwError = __privateMethod(this, _Marked_instances, onError_fn).call(this, !!opt.silent, !!opt.async);
      if (typeof src === "undefined" || src === null) {
        return throwError(new Error("marked(): input parameter is undefined or null"));
      }
      if (typeof src !== "string") {
        return throwError(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected"));
      }
      if (opt.hooks) {
        opt.hooks.options = opt;
      }
      if (opt.async) {
        return Promise.resolve(opt.hooks ? opt.hooks.preprocess(src) : src).then((src2) => lexer2(src2, opt)).then((tokens) => opt.hooks ? opt.hooks.processAllTokens(tokens) : tokens).then((tokens) => opt.walkTokens ? Promise.all(this.walkTokens(tokens, opt.walkTokens)).then(() => tokens) : tokens).then((tokens) => parser2(tokens, opt)).then((html2) => opt.hooks ? opt.hooks.postprocess(html2) : html2).catch(throwError);
      }
      try {
        if (opt.hooks) {
          src = opt.hooks.preprocess(src);
        }
        let tokens = lexer2(src, opt);
        if (opt.hooks) {
          tokens = opt.hooks.processAllTokens(tokens);
        }
        if (opt.walkTokens) {
          this.walkTokens(tokens, opt.walkTokens);
        }
        let html2 = parser2(tokens, opt);
        if (opt.hooks) {
          html2 = opt.hooks.postprocess(html2);
        }
        return html2;
      } catch (e4) {
        return throwError(e4);
      }
    };
  };
  onError_fn = function(silent, async) {
    return (e4) => {
      e4.message += "\nPlease report this to https://github.com/markedjs/marked.";
      if (silent) {
        const msg = "<p>An error occurred:</p><pre>" + escape$1(e4.message + "", true) + "</pre>";
        if (async) {
          return Promise.resolve(msg);
        }
        return msg;
      }
      if (async) {
        return Promise.reject(e4);
      }
      throw e4;
    };
  };
  var markedInstance = new Marked();
  function marked(src, opt) {
    return markedInstance.parse(src, opt);
  }
  marked.options = marked.setOptions = function(options2) {
    markedInstance.setOptions(options2);
    marked.defaults = markedInstance.defaults;
    changeDefaults(marked.defaults);
    return marked;
  };
  marked.getDefaults = _getDefaults;
  marked.defaults = _defaults;
  marked.use = function(...args) {
    markedInstance.use(...args);
    marked.defaults = markedInstance.defaults;
    changeDefaults(marked.defaults);
    return marked;
  };
  marked.walkTokens = function(tokens, callback) {
    return markedInstance.walkTokens(tokens, callback);
  };
  marked.parseInline = markedInstance.parseInline;
  marked.Parser = _Parser;
  marked.parser = _Parser.parse;
  marked.Renderer = _Renderer;
  marked.TextRenderer = _TextRenderer;
  marked.Lexer = _Lexer;
  marked.lexer = _Lexer.lex;
  marked.Tokenizer = _Tokenizer;
  marked.Hooks = _Hooks;
  marked.parse = marked;
  var options = marked.options;
  var setOptions = marked.setOptions;
  var use = marked.use;
  var walkTokens = marked.walkTokens;
  var parseInline = marked.parseInline;
  var parser = _Parser.parse;
  var lexer = _Lexer.lex;

  // src/db/simple-storage.ts
  var storage = {
    sessions: /* @__PURE__ */ new Map(),
    messages: /* @__PURE__ */ new Map()
  };
  async function initDB() {
    console.log("[ReactLLM] Using in-memory storage");
    return true;
  }
  async function createChatSession(id, title, projectInfo) {
    const session = {
      id,
      title,
      createdAt: Date.now(),
      projectName: projectInfo?.name,
      projectType: projectInfo?.type,
      projectDescription: projectInfo?.description,
      isActive: true,
      technologies: projectInfo?.mainTechnologies || []
    };
    storage.sessions.set(id, session);
    storage.messages.set(id, []);
  }
  async function createMessage(id, chatSessionId, role, content, structuredResponse) {
    const message = {
      id,
      chatSessionId,
      role,
      content,
      timestamp: Date.now(),
      structuredResponse,
      relevantFiles: [],
      documentationLinks: [],
      suggestedQueries: []
    };
    const messages = storage.messages.get(chatSessionId) || [];
    messages.push(message);
    storage.messages.set(chatSessionId, messages);
    if (structuredResponse && role === "assistant") {
      try {
        const parsed = JSON.parse(structuredResponse);
        message.relevantFiles = parsed.relevantFiles || [];
        message.documentationLinks = parsed.documentationLinks || [];
        message.suggestedQueries = (parsed.suggestedQueries || []).map((q2) => ({ query: q2 }));
      } catch (e4) {
        console.error("Failed to parse structured response:", e4);
      }
    }
  }
  async function getChatSessions() {
    return Array.from(storage.sessions.values()).filter((s5) => s5.isActive).sort((a4, b2) => b2.createdAt - a4.createdAt);
  }
  async function getMessagesForChatSession(chatSessionId) {
    return storage.messages.get(chatSessionId) || [];
  }
  async function deleteChatSession(id) {
    const session = storage.sessions.get(id);
    if (session) {
      session.isActive = false;
    }
  }

  // src/components/Toolbar.styles.ts
  var styles = `
@font-face {
  font-family: 'IosevkaTerm';
  src: url('https://intdev-global.s3.us-west-2.amazonaws.com/public/internet-dev/6397be61-3ea4-459d-8a3e-fd95168cb214.woff2') format('woff2');
  font-display: swap;
}

* {
  font-family: 'IosevkaTerm', monospace;
}

.toolbar {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 400px;
  height: 500px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 12px;
  font-family: 'IosevkaTerm', monospace;
  color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: 0;
  transition: opacity 0.3s ease-in-out;
}

.toolbar.minimized {
  height: 60px;
  overflow: hidden;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
  text-transform: lowercase;
  height: 44px;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.chat-title {
  opacity: 0.8;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: background 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  flex: 1;
}

.model-display {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  margin-left: 8px;
}

.model-display:hover {
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.8);
}

.controls {
  display: flex;
  gap: 8px;
  width: 100%;
  justify-content: flex-start;
}

.control-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  padding: 8px;
  font-size: 14px;
  border-radius: 8px;
  min-width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.control-button:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.control-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.control-button.active {
  background: rgba(100, 200, 255, 0.2);
  border-color: rgba(100, 200, 255, 0.3);
  color: rgba(100, 200, 255, 0.9);
}

.control-button svg {
  width: 16px;
  height: 16px;
  display: block;
}

.model-button svg {
  opacity: 0.9;
}

.component-selector-button.active {
  background: rgba(100, 200, 255, 0.2);
  border-color: rgba(100, 200, 255, 0.3);
}

.component-selector-button.active svg {
  color: rgba(100, 200, 255, 0.9);
}

.chats-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 8px;
  margin: 4px;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.chat-item {
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.2s ease;
}

.chat-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.chat-item-title {
  flex: 1;
  margin-right: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-item-actions {
  opacity: 0;
  transition: opacity 0.2s ease;
  display: flex;
  gap: 8px;
}

.chat-item:hover .chat-item-actions {
  opacity: 1;
}

.chat-item-button {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 2px 6px;
  font-size: 12px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.chat-item-button:hover {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.1);
}

.docs-section {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.docs-link {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
  text-decoration: none;
  color: inherit;
}

.docs-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.docs-link-title {
  font-weight: bold;
  color: rgba(255, 255, 255, 0.9);
}

.docs-link-description {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.suggested-queries {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.suggested-queries-title {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 8px;
}

.suggested-queries-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggested-query {
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.suggested-query:hover {
  background: rgba(255, 255, 255, 0.1);
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
  padding: 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  line-height: 1.5;
}

.user-message {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(100, 100, 255, 0.1);
  align-self: flex-end;
  max-width: 85%;
}

.assistant-message {
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.05);
  align-self: flex-start;
  max-width: 100%;
}

.assistant-message pre {
  background: rgba(255, 255, 255, 0.1);
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
}

.assistant-message code {
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 4px;
  border-radius: 3px;
}

.assistant-message ul, .assistant-message ol {
  margin: 8px 0;
  padding-left: 20px;
}

.assistant-message p {
  margin: 8px 0;
}

.relevant-files {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.relevant-file {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s ease;
  max-width: 100%;
  overflow: hidden;
}

.relevant-file:hover {
  background: rgba(255, 255, 255, 0.1);
}

.file-path {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-sessions {
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  overflow-x: auto;
}

.chat-tab {
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
  transition: background 0.2s ease;
}

.chat-tab:hover {
  background: rgba(255, 255, 255, 0.15);
}

.chat-tab.active {
  background: rgba(255, 255, 255, 0.2);
}

.new-chat-button {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.new-chat-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

/* Legacy input area styles - kept for compatibility */
.input-area {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px;
  display: flex;
  gap: 12px;
  backdrop-filter: blur(10px);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 32px;
  color: rgba(255, 255, 255, 0.8);
}

.empty-state-title {
  font-size: 20px;
  margin-bottom: 12px;
  font-weight: 500;
}

.empty-state-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 24px;
  max-width: 280px;
  line-height: 1.5;
}

.content-tabs {
  display: flex;
  gap: 2px;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  height: 44px;
  flex-shrink: 0;
}

.content-tab {
  padding: 4px 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.content-tab:hover {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.1);
}

.content-tab.active {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.1);
}

.content-section {
  position: absolute;
  inset: 88px 0 60px 0;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
  overflow-y: auto;
  padding: 12px;
}

.content-section.active {
  opacity: 1;
  pointer-events: all;
}

.files-grid, .docs-grid {
  display: grid;
  gap: 8px;
  padding: 12px;
}

.file-card, .doc-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 8px;
  border-radius: 4px;
  transition: background 0.2s ease;
  cursor: pointer;
}

.file-card:hover, .doc-card:hover {
  background: rgba(255, 255, 255, 0.1);
}

.file-card-path {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 4px;
}

.file-card-reason {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.doc-card-title {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 4px;
}

.doc-card-description {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.loading-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.loading-dots {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: 4px;
}

.loading-dot {
  width: 3px;
  height: 3px;
  background: currentColor;
  border-radius: 50%;
  animation: loadingDot 1.4s infinite;
  opacity: 0.6;
}

.loading-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes loadingDot {
  0%, 100% { opacity: 0.2; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Messages Container */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scroll-behavior: smooth;
}

.message-wrapper {
  animation: fadeIn 0.3s ease;
}

/* Input area - modern LLM chat style */
.input-area {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  flex-shrink: 0;
}

.input-form {
  padding: 12px 16px 0;
}

.input-area .input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-family: inherit;
  min-height: 48px;
  max-height: 120px;
  resize: vertical;
  transition: all 0.2s ease;
}

.input-area .input:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
}

.input-area .input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.input-area .input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-area .input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.input-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px 12px;
  gap: 8px;
}

.control-icon-button {
  background: transparent;
  border: none;
  padding: 6px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

.control-icon-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.control-icon-button.active {
  background: rgba(100, 200, 255, 0.2);
  color: rgba(100, 200, 255, 0.9);
}

.control-icon-button svg {
  width: 18px;
  height: 18px;
}

.input-controls .send-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 6px 16px;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
}

.input-controls .send-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.input-controls .send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.minimized .messages,
.minimized .input-area {
  display: none;
}

.minimized .latest-message {
  display: block;
  padding: 0 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 40px;
  color: rgba(255, 255, 255, 0.7);
}

/* Model Selector Styles */
.model-selector {
  position: relative;
  z-index: 1000;
}

.model-selector-header {
  position: relative;
}

.model-selector-toggle {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: opacity 0.2s ease;
}

.model-selector-toggle:hover {
  opacity: 0.8;
}

.selected-model-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.model-name {
  font-size: 12px;
  font-weight: 500;
}

.model-provider {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
}

.no-model {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.expand-icon {
  font-size: 10px;
  transition: transform 0.2s ease;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.model-selector-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 380px;
  max-height: 500px;
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.search-section {
  padding: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.model-search-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  padding: 8px 12px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  transition: all 0.2s ease;
}

.model-search-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.15);
}

.filter-options {
  margin-top: 8px;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
}

.filter-checkbox input[type="checkbox"] {
  width: 14px;
  height: 14px;
  cursor: pointer;
}

.loading-models {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.model-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.model-group {
  margin-bottom: 16px;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  font-size: 11px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
  letter-spacing: 0.05em;
}

.model-count {
  font-weight: normal;
  opacity: 0.6;
}

.model-items {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.model-option {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  text-align: left;
}

.model-option:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.1);
}

.model-option.selected {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.model-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.model-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.model-option .model-name {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.model-badge {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(255, 200, 0, 0.2);
  color: rgba(255, 200, 0, 0.9);
}

.model-details {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.model-context {
  display: flex;
  align-items: center;
  gap: 4px;
}

.model-price {
  color: rgba(100, 255, 100, 0.8);
}

.no-models {
  padding: 32px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
}

.model-selector-footer {
  padding: 8px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.5);
}

.model-info-text {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
}

/* Full Page Views */
.view-container {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 100;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.view-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.view-title {
  font-size: 18px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.view-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: 20px;
  line-height: 1;
}

.view-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.view-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

/* Settings View */
.settings-section {
  margin-bottom: 32px;
}

.settings-label {
  display: block;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
  font-weight: 500;
}

.settings-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  transition: all 0.2s ease;
  font-family: 'IosevkaTerm', monospace;
}

.settings-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.15);
}

.settings-hint {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 4px;
}

.settings-button {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px 20px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 16px;
}

.settings-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.settings-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Models View */
.models-grid {
  display: grid;
  gap: 16px;
}

.model-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.model-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.model-card.selected {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.model-card-header {
  display: flex;
  align-items: start;
  justify-content: space-between;
  margin-bottom: 12px;
}

.model-card-name {
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.model-card-provider {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 4px;
}

.model-card-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.model-card-badge.recommended {
  background: rgba(255, 200, 0, 0.2);
  color: rgba(255, 200, 0, 0.9);
}

.model-card-specs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 12px;
}

.model-spec {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.model-spec-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.model-spec-value {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.model-card-description {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
}

.api-key-prompt {
  background: rgba(255, 200, 0, 0.1);
  border: 1px solid rgba(255, 200, 0, 0.2);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  text-align: center;
}

.api-key-prompt-text {
  color: rgba(255, 200, 0, 0.9);
  font-size: 14px;
  margin-bottom: 12px;
}

.api-key-prompt-button {
  background: rgba(255, 200, 0, 0.2);
  border: 1px solid rgba(255, 200, 0, 0.3);
  color: rgba(255, 200, 0, 0.9);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
}

.api-key-prompt-button:hover {
  background: rgba(255, 200, 0, 0.3);
  border-color: rgba(255, 200, 0, 0.4);
}

/* Components View */
.empty-components {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  text-align: center;
}

.empty-components p {
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 16px;
}

.select-component-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(100, 200, 255, 0.2);
  border: 1px solid rgba(100, 200, 255, 0.3);
  border-radius: 8px;
  color: rgba(100, 200, 255, 0.9);
  cursor: pointer;
  transition: all 0.2s ease;
}

.select-component-button:hover {
  background: rgba(100, 200, 255, 0.3);
  border-color: rgba(100, 200, 255, 0.4);
}

.components-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.component-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
}

.component-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.component-name {
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.remove-button {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  font-size: 20px;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.remove-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.component-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  font-family: 'IosevkaTerm', monospace;
}

.props-value {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 8px;
  overflow-x: auto;
  font-size: 12px;
}

.component-actions {
  margin-top: 8px;
}

.action-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  padding: 6px 12px;
  font-size: 13px;
  transition: all 0.2s ease;
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
}

.hook-item {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4px;
  font-family: 'IosevkaTerm', monospace;
}
`;

  // ../../node_modules/.pnpm/bippy@0.3.17_@types+react@18.3.23_react@19.1.0/node_modules/bippy/dist/rdt-hook-D8LwQB-4.js
  var version = "0.3.17";
  var BIPPY_INSTRUMENTATION_STRING = `bippy-${version}`;
  var objectDefineProperty = Object.defineProperty;
  var objectHasOwnProperty = Object.prototype.hasOwnProperty;
  var NO_OP = () => {
  };
  var checkDCE = (fn) => {
    try {
      const code = Function.prototype.toString.call(fn);
      if (code.indexOf("^_^") > -1) setTimeout(() => {
        throw new Error("React is running in production mode, but dead code elimination has not been applied. Read how to correctly configure React for production: https://reactjs.org/link/perf-use-production-build");
      });
    } catch {
    }
  };
  var isRealReactDevtools = (rdtHook = getRDTHook()) => {
    return "getFiberRoots" in rdtHook;
  };
  var isReactRefreshOverride = false;
  var injectFnStr = void 0;
  var isReactRefresh = (rdtHook = getRDTHook()) => {
    if (isReactRefreshOverride) return true;
    if (typeof rdtHook.inject === "function") injectFnStr = rdtHook.inject.toString();
    return Boolean(injectFnStr?.includes("(injected)"));
  };
  var onActiveListeners = /* @__PURE__ */ new Set();
  var _renderers = /* @__PURE__ */ new Set();
  var installRDTHook = (onActive) => {
    const renderers = /* @__PURE__ */ new Map();
    let i4 = 0;
    let rdtHook = {
      checkDCE,
      supportsFiber: true,
      supportsFlight: true,
      hasUnsupportedRendererAttached: false,
      renderers,
      onCommitFiberRoot: NO_OP,
      onCommitFiberUnmount: NO_OP,
      onPostCommitFiberRoot: NO_OP,
      inject(renderer) {
        const nextID = ++i4;
        renderers.set(nextID, renderer);
        _renderers.add(renderer);
        if (!rdtHook._instrumentationIsActive) {
          rdtHook._instrumentationIsActive = true;
          onActiveListeners.forEach((listener) => listener());
        }
        return nextID;
      },
      _instrumentationSource: BIPPY_INSTRUMENTATION_STRING,
      _instrumentationIsActive: false
    };
    try {
      objectDefineProperty(globalThis, "__REACT_DEVTOOLS_GLOBAL_HOOK__", {
        get() {
          return rdtHook;
        },
        set(newHook) {
          if (newHook && typeof newHook === "object") {
            const ourRenderers = rdtHook.renderers;
            rdtHook = newHook;
            if (ourRenderers.size > 0) {
              ourRenderers.forEach((renderer, id) => {
                _renderers.add(renderer);
                newHook.renderers.set(id, renderer);
              });
              patchRDTHook(onActive);
            }
          }
        },
        configurable: true,
        enumerable: true
      });
      const originalWindowHasOwnProperty = window.hasOwnProperty;
      let hasRanHack = false;
      objectDefineProperty(window, "hasOwnProperty", {
        value: function() {
          try {
            if (!hasRanHack && arguments[0] === "__REACT_DEVTOOLS_GLOBAL_HOOK__") {
              globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__ = void 0;
              hasRanHack = true;
              return -0;
            }
          } catch {
          }
          return originalWindowHasOwnProperty.apply(this, arguments);
        },
        configurable: true,
        writable: true
      });
    } catch {
      patchRDTHook(onActive);
    }
    return rdtHook;
  };
  var patchRDTHook = (onActive) => {
    if (onActive) onActiveListeners.add(onActive);
    try {
      const rdtHook = globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (!rdtHook) return;
      if (!rdtHook._instrumentationSource) {
        rdtHook.checkDCE = checkDCE;
        rdtHook.supportsFiber = true;
        rdtHook.supportsFlight = true;
        rdtHook.hasUnsupportedRendererAttached = false;
        rdtHook._instrumentationSource = BIPPY_INSTRUMENTATION_STRING;
        rdtHook._instrumentationIsActive = false;
        if (rdtHook.renderers.size) {
          rdtHook._instrumentationIsActive = true;
          onActiveListeners.forEach((listener) => listener());
          return;
        }
        const prevInject = rdtHook.inject;
        if (isReactRefresh(rdtHook) && !isRealReactDevtools()) {
          isReactRefreshOverride = true;
          const nextID = rdtHook.inject({ scheduleRefresh() {
          } });
          if (nextID) rdtHook._instrumentationIsActive = true;
        }
        rdtHook.inject = (renderer) => {
          const id = prevInject(renderer);
          _renderers.add(renderer);
          rdtHook._instrumentationIsActive = true;
          onActiveListeners.forEach((listener) => listener());
          return id;
        };
      }
      if (rdtHook.renderers.size || rdtHook._instrumentationIsActive || isReactRefresh()) onActive?.();
    } catch {
    }
  };
  var hasRDTHook = () => {
    return objectHasOwnProperty.call(globalThis, "__REACT_DEVTOOLS_GLOBAL_HOOK__");
  };
  var getRDTHook = (onActive) => {
    if (!hasRDTHook()) return installRDTHook(onActive);
    patchRDTHook(onActive);
    return globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  };
  var isClientEnvironment = () => {
    return Boolean(typeof window !== "undefined" && (window.document?.createElement || window.navigator?.product === "ReactNative"));
  };
  var safelyInstallRDTHook = () => {
    try {
      if (isClientEnvironment()) getRDTHook();
    } catch {
    }
  };

  // ../../node_modules/.pnpm/bippy@0.3.17_@types+react@18.3.23_react@19.1.0/node_modules/bippy/dist/core-wkpXT9Yv.js
  var FunctionComponentTag = 0;
  var ClassComponentTag = 1;
  var HostRootTag = 3;
  var HostComponentTag = 5;
  var HostTextTag = 6;
  var FragmentTag = 7;
  var ContextConsumerTag = 9;
  var ForwardRefTag = 11;
  var SuspenseComponentTag = 13;
  var MemoComponentTag = 14;
  var SimpleMemoComponentTag = 15;
  var DehydratedSuspenseComponentTag = 18;
  var OffscreenComponentTag = 22;
  var LegacyHiddenComponentTag = 23;
  var HostHoistableTag = 26;
  var HostSingletonTag = 27;
  var CONCURRENT_MODE_NUMBER = 60111;
  var CONCURRENT_MODE_SYMBOL_STRING = "Symbol(react.concurrent_mode)";
  var DEPRECATED_ASYNC_MODE_SYMBOL_STRING = "Symbol(react.async_mode)";
  var PerformedWork = 1;
  var Placement = 2;
  var Hydrating = 4096;
  var Update = 4;
  var ChildDeletion = 16;
  var ContentReset = 32;
  var Snapshot = 1024;
  var Visibility = 8192;
  var MutationMask = Placement | Update | ChildDeletion | ContentReset | Hydrating | Visibility | Snapshot;
  var isHostFiber = (fiber) => {
    switch (fiber.tag) {
      case HostComponentTag:
      case HostHoistableTag:
      case HostSingletonTag:
        return true;
      default:
        return typeof fiber.type === "string";
    }
  };
  var didFiberRender = (fiber) => {
    const nextProps = fiber.memoizedProps;
    const prevProps = fiber.alternate?.memoizedProps || {};
    const flags = fiber.flags ?? fiber.effectTag ?? 0;
    switch (fiber.tag) {
      case ClassComponentTag:
      case FunctionComponentTag:
      case ContextConsumerTag:
      case ForwardRefTag:
      case MemoComponentTag:
      case SimpleMemoComponentTag:
        return (flags & PerformedWork) === PerformedWork;
      default:
        if (!fiber.alternate) return true;
        return prevProps !== nextProps || fiber.alternate.memoizedState !== fiber.memoizedState || fiber.alternate.ref !== fiber.ref;
    }
  };
  var shouldFilterFiber = (fiber) => {
    switch (fiber.tag) {
      case DehydratedSuspenseComponentTag:
        return true;
      case HostTextTag:
      case FragmentTag:
      case LegacyHiddenComponentTag:
      case OffscreenComponentTag:
        return true;
      case HostRootTag:
        return false;
      default: {
        const symbolOrNumber = typeof fiber.type === "object" && fiber.type !== null ? fiber.type.$$typeof : fiber.type;
        const typeSymbol = typeof symbolOrNumber === "symbol" ? symbolOrNumber.toString() : symbolOrNumber;
        switch (typeSymbol) {
          case CONCURRENT_MODE_NUMBER:
          case CONCURRENT_MODE_SYMBOL_STRING:
          case DEPRECATED_ASYNC_MODE_SYMBOL_STRING:
            return true;
          default:
            return false;
        }
      }
    }
  };
  var getNearestHostFiber = (fiber, ascending = false) => {
    let hostFiber = traverseFiber(fiber, isHostFiber, ascending);
    if (!hostFiber) hostFiber = traverseFiber(fiber, isHostFiber, !ascending);
    return hostFiber;
  };
  var traverseFiber = (fiber, selector, ascending = false) => {
    if (!fiber) return null;
    if (selector(fiber) === true) return fiber;
    let child = ascending ? fiber.return : fiber.child;
    while (child) {
      const match = traverseFiber(child, selector, ascending);
      if (match) return match;
      child = ascending ? null : child.sibling;
    }
    return null;
  };
  var detectReactBuildType = (renderer) => {
    try {
      if (typeof renderer.version === "string" && renderer.bundleType > 0) return "development";
    } catch {
    }
    return "production";
  };
  var fiberId = 0;
  var fiberIdMap = /* @__PURE__ */ new WeakMap();
  var setFiberId = (fiber, id = fiberId++) => {
    fiberIdMap.set(fiber, id);
  };
  var getFiberId = (fiber) => {
    let id = fiberIdMap.get(fiber);
    if (!id && fiber.alternate) id = fiberIdMap.get(fiber.alternate);
    if (!id) {
      id = fiberId++;
      setFiberId(fiber, id);
    }
    return id;
  };
  var mountFiberRecursively = (onRender, firstChild, traverseSiblings) => {
    let fiber = firstChild;
    while (fiber != null) {
      if (!fiberIdMap.has(fiber)) getFiberId(fiber);
      const shouldIncludeInTree = !shouldFilterFiber(fiber);
      if (shouldIncludeInTree && didFiberRender(fiber)) onRender(fiber, "mount");
      if (fiber.tag === SuspenseComponentTag) {
        const isTimedOut = fiber.memoizedState !== null;
        if (isTimedOut) {
          const primaryChildFragment = fiber.child;
          const fallbackChildFragment = primaryChildFragment ? primaryChildFragment.sibling : null;
          if (fallbackChildFragment) {
            const fallbackChild = fallbackChildFragment.child;
            if (fallbackChild !== null) mountFiberRecursively(onRender, fallbackChild, false);
          }
        } else {
          let primaryChild = null;
          const areSuspenseChildrenConditionallyWrapped = OffscreenComponentTag === -1;
          if (areSuspenseChildrenConditionallyWrapped) primaryChild = fiber.child;
          else if (fiber.child !== null) primaryChild = fiber.child.child;
          if (primaryChild !== null) mountFiberRecursively(onRender, primaryChild, false);
        }
      } else if (fiber.child != null) mountFiberRecursively(onRender, fiber.child, true);
      fiber = traverseSiblings ? fiber.sibling : null;
    }
  };
  var updateFiberRecursively = (onRender, nextFiber, prevFiber, parentFiber) => {
    if (!fiberIdMap.has(nextFiber)) getFiberId(nextFiber);
    if (!prevFiber) return;
    if (!fiberIdMap.has(prevFiber)) getFiberId(prevFiber);
    const isSuspense = nextFiber.tag === SuspenseComponentTag;
    const shouldIncludeInTree = !shouldFilterFiber(nextFiber);
    if (shouldIncludeInTree && didFiberRender(nextFiber)) onRender(nextFiber, "update");
    const prevDidTimeout = isSuspense && prevFiber.memoizedState !== null;
    const nextDidTimeOut = isSuspense && nextFiber.memoizedState !== null;
    if (prevDidTimeout && nextDidTimeOut) {
      const nextFallbackChildSet = nextFiber.child?.sibling ?? null;
      const prevFallbackChildSet = prevFiber.child?.sibling ?? null;
      if (nextFallbackChildSet !== null && prevFallbackChildSet !== null) updateFiberRecursively(onRender, nextFallbackChildSet, prevFallbackChildSet, nextFiber);
    } else if (prevDidTimeout && !nextDidTimeOut) {
      const nextPrimaryChildSet = nextFiber.child;
      if (nextPrimaryChildSet !== null) mountFiberRecursively(onRender, nextPrimaryChildSet, true);
    } else if (!prevDidTimeout && nextDidTimeOut) {
      unmountFiberChildrenRecursively(onRender, prevFiber);
      const nextFallbackChildSet = nextFiber.child?.sibling ?? null;
      if (nextFallbackChildSet !== null) mountFiberRecursively(onRender, nextFallbackChildSet, true);
    } else if (nextFiber.child !== prevFiber.child) {
      let nextChild = nextFiber.child;
      while (nextChild) {
        if (nextChild.alternate) {
          const prevChild = nextChild.alternate;
          updateFiberRecursively(onRender, nextChild, prevChild, shouldIncludeInTree ? nextFiber : parentFiber);
        } else mountFiberRecursively(onRender, nextChild, false);
        nextChild = nextChild.sibling;
      }
    }
  };
  var unmountFiber = (onRender, fiber) => {
    const isRoot = fiber.tag === HostRootTag;
    if (isRoot || !shouldFilterFiber(fiber)) onRender(fiber, "unmount");
  };
  var unmountFiberChildrenRecursively = (onRender, fiber) => {
    const isTimedOutSuspense = fiber.tag === SuspenseComponentTag && fiber.memoizedState !== null;
    let child = fiber.child;
    if (isTimedOutSuspense) {
      const primaryChildFragment = fiber.child;
      const fallbackChildFragment = primaryChildFragment?.sibling ?? null;
      child = fallbackChildFragment?.child ?? null;
    }
    while (child !== null) {
      if (child.return !== null) {
        unmountFiber(onRender, child);
        unmountFiberChildrenRecursively(onRender, child);
      }
      child = child.sibling;
    }
  };
  var commitId = 0;
  var rootInstanceMap = /* @__PURE__ */ new WeakMap();
  var traverseRenderedFibers = (root, onRender) => {
    const fiber = "current" in root ? root.current : root;
    let rootInstance = rootInstanceMap.get(root);
    if (!rootInstance) {
      rootInstance = {
        prevFiber: null,
        id: commitId++
      };
      rootInstanceMap.set(root, rootInstance);
    }
    const { prevFiber } = rootInstance;
    if (!fiber) unmountFiber(onRender, fiber);
    else if (prevFiber !== null) {
      const wasMounted = prevFiber && prevFiber.memoizedState != null && prevFiber.memoizedState.element != null && prevFiber.memoizedState.isDehydrated !== true;
      const isMounted = fiber.memoizedState != null && fiber.memoizedState.element != null && fiber.memoizedState.isDehydrated !== true;
      if (!wasMounted && isMounted) mountFiberRecursively(onRender, fiber, false);
      else if (wasMounted && isMounted) updateFiberRecursively(onRender, fiber, fiber.alternate, null);
      else if (wasMounted && !isMounted) unmountFiber(onRender, fiber);
    } else mountFiberRecursively(onRender, fiber, true);
    rootInstance.prevFiber = fiber;
  };
  var instrument = (options2) => {
    return getRDTHook(() => {
      const rdtHook = getRDTHook();
      options2.onActive?.();
      rdtHook._instrumentationSource = options2.name ?? BIPPY_INSTRUMENTATION_STRING;
      const prevOnCommitFiberRoot = rdtHook.onCommitFiberRoot;
      if (options2.onCommitFiberRoot) rdtHook.onCommitFiberRoot = (rendererID, root, priority) => {
        if (prevOnCommitFiberRoot) prevOnCommitFiberRoot(rendererID, root, priority);
        options2.onCommitFiberRoot?.(rendererID, root, priority);
      };
      const prevOnCommitFiberUnmount = rdtHook.onCommitFiberUnmount;
      if (options2.onCommitFiberUnmount) rdtHook.onCommitFiberUnmount = (rendererID, root) => {
        if (prevOnCommitFiberUnmount) prevOnCommitFiberUnmount(rendererID, root);
        options2.onCommitFiberUnmount?.(rendererID, root);
      };
      const prevOnPostCommitFiberRoot = rdtHook.onPostCommitFiberRoot;
      if (options2.onPostCommitFiberRoot) rdtHook.onPostCommitFiberRoot = (rendererID, root) => {
        if (prevOnPostCommitFiberRoot) prevOnPostCommitFiberRoot(rendererID, root);
        options2.onPostCommitFiberRoot?.(rendererID, root);
      };
    });
  };
  var INSTALL_ERROR = new Error();
  var _fiberRoots = /* @__PURE__ */ new Set();
  var secure = (options2, secureOptions = {}) => {
    const onActive = options2.onActive;
    const isRDTHookInstalled = hasRDTHook();
    const isUsingRealReactDevtools = isRealReactDevtools();
    const isUsingReactRefresh = isReactRefresh();
    let timeout;
    let isProduction = secureOptions.isProduction ?? false;
    options2.onActive = () => {
      clearTimeout(timeout);
      let isSecure = true;
      try {
        const rdtHook = getRDTHook();
        for (const renderer of rdtHook.renderers.values()) {
          const [majorVersion] = renderer.version.split(".");
          if (Number(majorVersion) < (secureOptions.minReactMajorVersion ?? 17)) isSecure = false;
          const buildType = detectReactBuildType(renderer);
          if (buildType !== "development") {
            isProduction = true;
            if (!secureOptions.dangerouslyRunInProduction) isSecure = false;
          }
        }
      } catch (err) {
        secureOptions.onError?.(err);
      }
      if (!isSecure) {
        options2.onCommitFiberRoot = void 0;
        options2.onCommitFiberUnmount = void 0;
        options2.onPostCommitFiberRoot = void 0;
        options2.onActive = void 0;
        return;
      }
      onActive?.();
      try {
        const onCommitFiberRoot$1 = options2.onCommitFiberRoot;
        if (onCommitFiberRoot$1) options2.onCommitFiberRoot = (rendererID, root, priority) => {
          if (!_fiberRoots.has(root)) _fiberRoots.add(root);
          try {
            onCommitFiberRoot$1(rendererID, root, priority);
          } catch (err) {
            secureOptions.onError?.(err);
          }
        };
        const onCommitFiberUnmount = options2.onCommitFiberUnmount;
        if (onCommitFiberUnmount) options2.onCommitFiberUnmount = (rendererID, root) => {
          try {
            onCommitFiberUnmount(rendererID, root);
          } catch (err) {
            secureOptions.onError?.(err);
          }
        };
        const onPostCommitFiberRoot = options2.onPostCommitFiberRoot;
        if (onPostCommitFiberRoot) options2.onPostCommitFiberRoot = (rendererID, root) => {
          try {
            onPostCommitFiberRoot(rendererID, root);
          } catch (err) {
            secureOptions.onError?.(err);
          }
        };
      } catch (err) {
        secureOptions.onError?.(err);
      }
    };
    if (!isRDTHookInstalled && !isUsingRealReactDevtools && !isUsingReactRefresh) timeout = setTimeout(() => {
      if (!isProduction) secureOptions.onError?.(INSTALL_ERROR);
      stop();
    }, secureOptions.installCheckTimeout ?? 100);
    return options2;
  };

  // ../../node_modules/.pnpm/bippy@0.3.17_@types+react@18.3.23_react@19.1.0/node_modules/bippy/dist/src-C5k3J1-J.js
  safelyInstallRDTHook();

  // src/instrumentation/bippy-adapter.ts
  var ComponentInspector = class {
    constructor() {
      this.fiberMap = /* @__PURE__ */ new WeakMap();
      this.componentMap = /* @__PURE__ */ new Map();
      this.isInstrumented = false;
      this.componentCounter = 0;
      this.setupInstrumentation();
    }
    setupInstrumentation() {
      if (this.isInstrumented) return;
      try {
        const handlers = secure({
          onCommitFiberRoot: (rendererID, root) => {
            this.processFiberRoot(root);
          }
        });
        instrument(handlers);
        this.isInstrumented = true;
        console.log("[ReactLLM] Component instrumentation initialized with bippy");
      } catch (error) {
        console.error("[ReactLLM] Failed to setup instrumentation:", error);
      }
    }
    processFiberRoot(root) {
      try {
        traverseRenderedFibers(root, (fiber) => {
          this.processFiber(fiber);
        });
      } catch (error) {
        console.error("[ReactLLM] Error processing fiber root:", error);
      }
    }
    processFiber(fiber) {
      try {
        if (!this.isRelevantFiber(fiber)) return;
        const info = this.extractComponentInfo(fiber);
        if (info.domElement) {
          this.fiberMap.set(info.domElement, fiber);
          info.domElement.dataset.reactLlmId = info.id;
        }
        this.componentMap.set(info.id, info);
      } catch (error) {
        console.error("[ReactLLM] Error processing fiber:", error);
      }
    }
    isRelevantFiber(fiber) {
      return fiber.type !== null || fiber.elementType !== null || typeof fiber.type === "string" || // Host components (div, span, etc.)
      typeof fiber.type === "function";
    }
    extractComponentInfo(fiber) {
      const id = this.getFiberId(fiber);
      const name = this.getDisplayName(fiber);
      const isComponent = this.isComponentFiber(fiber);
      return {
        id,
        name,
        props: fiber.memoizedProps || {},
        state: fiber.memoizedState || null,
        hooks: this.extractHooks(fiber),
        parent: this.getParentComponent(fiber),
        children: this.getChildComponents(fiber),
        domElement: this.getDOMElement(fiber),
        sourceLocation: this.getSourceLocation(fiber),
        fiberType: this.getFiberType(fiber),
        isComponent,
        depth: this.getFiberDepth(fiber)
      };
    }
    getFiberId(fiber) {
      const key = fiber.key || "";
      const index = fiber.index || 0;
      const type = this.getDisplayName(fiber);
      return `${type}-${key}-${index}-${++this.componentCounter}`;
    }
    getDisplayName(fiber) {
      if (typeof fiber.type === "string") {
        return fiber.type;
      }
      if (typeof fiber.type === "function") {
        return fiber.type.displayName || fiber.type.name || "Anonymous";
      }
      if (fiber.elementType && typeof fiber.elementType === "function") {
        return fiber.elementType.displayName || fiber.elementType.name || "Anonymous";
      }
      switch (fiber.tag) {
        case 0:
          return "FunctionComponent";
        case 1:
          return "ClassComponent";
        case 3:
          return "HostRoot";
        case 5:
          return "HostComponent";
        case 6:
          return "HostText";
        case 7:
          return "Fragment";
        case 8:
          return "Mode";
        case 9:
          return "ContextConsumer";
        case 10:
          return "ContextProvider";
        case 11:
          return "ForwardRef";
        case 12:
          return "Profiler";
        case 13:
          return "SuspenseComponent";
        case 14:
          return "MemoComponent";
        case 15:
          return "SimpleMemoComponent";
        case 16:
          return "LazyComponent";
        default:
          return `Unknown(${fiber.tag})`;
      }
    }
    isComponentFiber(fiber) {
      return fiber.tag === 0 || fiber.tag === 1 || fiber.tag === 14 || fiber.tag === 15;
    }
    getFiberType(fiber) {
      const tagMap = {
        0: "FunctionComponent",
        1: "ClassComponent",
        3: "HostRoot",
        5: "HostComponent",
        6: "HostText",
        7: "Fragment",
        8: "Mode",
        9: "ContextConsumer",
        10: "ContextProvider",
        11: "ForwardRef",
        12: "Profiler",
        13: "SuspenseComponent",
        14: "MemoComponent",
        15: "SimpleMemoComponent",
        16: "LazyComponent"
      };
      return tagMap[fiber.tag] || `Unknown(${fiber.tag})`;
    }
    extractHooks(fiber) {
      const hooks = [];
      try {
        let hook = fiber.memoizedState;
        while (hook) {
          hooks.push({
            memoizedState: hook.memoizedState,
            baseState: hook.baseState,
            next: !!hook.next
          });
          hook = hook.next;
        }
      } catch (error) {
      }
      return hooks;
    }
    getParentComponent(fiber) {
      let parent = fiber.return;
      while (parent) {
        if (this.isComponentFiber(parent)) {
          const parentId = this.getFiberId(parent);
          return this.componentMap.get(parentId);
        }
        parent = parent.return;
      }
      return void 0;
    }
    getChildComponents(fiber) {
      const children = [];
      let child = fiber.child;
      while (child) {
        if (this.isComponentFiber(child)) {
          const childId = this.getFiberId(child);
          const childInfo = this.componentMap.get(childId);
          if (childInfo) {
            children.push(childInfo);
          }
        }
        child = child.sibling;
      }
      return children;
    }
    getDOMElement(fiber) {
      if (fiber.tag === 5 && fiber.stateNode instanceof HTMLElement) {
        return fiber.stateNode;
      }
      try {
        const hostFiber = getNearestHostFiber(fiber);
        if (hostFiber && hostFiber.stateNode instanceof HTMLElement) {
          return hostFiber.stateNode;
        }
      } catch (error) {
        let current = fiber.child;
        while (current) {
          if (current.tag === 5 && current.stateNode instanceof HTMLElement) {
            return current.stateNode;
          }
          current = current.child;
        }
      }
      return void 0;
    }
    getSourceLocation(fiber) {
      if (fiber._debugSource) {
        return {
          fileName: fiber._debugSource.fileName,
          lineNumber: fiber._debugSource.lineNumber,
          columnNumber: fiber._debugSource.columnNumber
        };
      }
      return void 0;
    }
    getFiberDepth(fiber) {
      let depth = 0;
      let parent = fiber.return;
      while (parent) {
        depth++;
        parent = parent.return;
      }
      return depth;
    }
    getComponentAtPoint(x2, y4) {
      const element = document.elementFromPoint(x2, y4);
      if (!element) return null;
      let current = element;
      while (current) {
        const fiber = this.fiberMap.get(current);
        if (fiber) {
          const id = this.getFiberId(fiber);
          const component = this.componentMap.get(id);
          if (component && component.isComponent) {
            return component;
          }
        }
        current = current.parentElement;
      }
      return null;
    }
    getComponentById(id) {
      return this.componentMap.get(id) || null;
    }
    getAllComponents() {
      return Array.from(this.componentMap.values()).filter((comp) => comp.isComponent).sort((a4, b2) => a4.depth - b2.depth);
    }
    getComponentTree() {
      const components = this.getAllComponents();
      return components.filter((comp) => !comp.parent);
    }
    selectComponent(component) {
      if (this.selectionCallback) {
        this.selectionCallback(component);
      }
    }
    onSelection(callback) {
      this.selectionCallback = callback;
    }
    highlightComponent(component) {
      if (component.domElement) {
        component.domElement.style.outline = "2px solid #007acc";
        component.domElement.style.outlineOffset = "2px";
      }
    }
    unhighlightComponent(component) {
      if (component.domElement) {
        component.domElement.style.outline = "";
        component.domElement.style.outlineOffset = "";
      }
    }
    isInstrumentationReady() {
      return this.isInstrumented;
    }
  };

  // src/components/ComponentInspector.tsx
  function ComponentInspector2({ isActive, onSelect }) {
    const canvas = useSignal(null);
    const hoveredComponent = useSignal(null);
    const animationFrame = useSignal(null);
    const inspector = useSignal(null);
    E2(() => {
      if (!inspector.value) {
        inspector.value = new ComponentInspector();
        inspector.value.onSelection(onSelect);
      }
      if (!isActive) {
        if (canvas.value) {
          canvas.value.style.display = "none";
        }
        if (animationFrame.value) {
          cancelAnimationFrame(animationFrame.value);
        }
        return;
      }
      if (!canvas.value) {
        const canvasEl = document.createElement("canvas");
        canvasEl.style.cssText = `
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 2147483647;
        display: none;
      `;
        document.body.appendChild(canvasEl);
        canvas.value = canvasEl;
        const updateCanvasSize = () => {
          canvasEl.width = window.innerWidth;
          canvasEl.height = window.innerHeight;
        };
        updateCanvasSize();
        window.addEventListener("resize", updateCanvasSize);
      }
      const ctx = canvas.value.getContext("2d");
      const drawOutline = (component) => {
        if (!component.domElement) return;
        const rect = component.domElement.getBoundingClientRect();
        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
        ctx.strokeStyle = "rgba(100, 200, 255, 0.8)";
        ctx.lineWidth = 2;
        ctx.fillStyle = "rgba(100, 200, 255, 0.1)";
        ctx.beginPath();
        ctx.rect(rect.left, rect.top, rect.width, rect.height);
        ctx.fill();
        ctx.stroke();
        if (component.name && component.name !== "Unknown") {
          const labelHeight = 20;
          const labelPadding = 8;
          const labelWidth = component.name.length * 7 + labelPadding * 2;
          const labelY = rect.top > labelHeight ? rect.top - labelHeight : rect.bottom;
          ctx.fillStyle = "rgba(100, 200, 255, 0.9)";
          ctx.fillRect(rect.left, labelY, labelWidth, labelHeight);
          ctx.font = "12px IosevkaTerm, monospace";
          ctx.fillStyle = "white";
          ctx.fillText(component.name, rect.left + labelPadding, labelY + 14);
          if (!component.isComponent && component.fiberType) {
            ctx.font = "10px IosevkaTerm, monospace";
            ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
            ctx.fillText(`(${component.fiberType})`, rect.left + labelWidth + 4, labelY + 14);
          }
        }
      };
      const handleMouseMove = (e4) => {
        const target = e4.target;
        if (target.closest(".toolbar")) {
          ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
          canvas.value.style.display = "none";
          hoveredComponent.value = null;
          return;
        }
        const component = inspector.value.getComponentAtPoint(e4.clientX, e4.clientY);
        if (component) {
          hoveredComponent.value = component;
          canvas.value.style.display = "block";
          if (animationFrame.value) {
            cancelAnimationFrame(animationFrame.value);
          }
          animationFrame.value = requestAnimationFrame(() => {
            drawOutline(component);
          });
        } else {
          ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
          canvas.value.style.display = "none";
          hoveredComponent.value = null;
        }
      };
      const handleClick = (e4) => {
        e4.preventDefault();
        e4.stopPropagation();
        const target = e4.target;
        if (target.closest(".toolbar")) return;
        const component = inspector.value.getComponentAtPoint(e4.clientX, e4.clientY);
        if (component) {
          onSelect(component);
          canvas.value.style.display = "none";
        }
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("click", handleClick, true);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("click", handleClick, true);
        if (canvas.value) {
          canvas.value.style.display = "none";
        }
        if (animationFrame.value) {
          cancelAnimationFrame(animationFrame.value);
        }
      };
    });
    return null;
  }

  // src/components/Toolbar.tsx
  function getInitialResponse() {
    return {
      projectInfo: {
        name: "Example Project",
        type: "Library",
        mainTechnologies: ["React", "TypeScript", "SQLite"],
        description: "A floating chat interface powered by Gemini"
      },
      markdown: "Welcome to the example project!",
      chatTitle: "New Chat",
      relevantFiles: [],
      documentationLinks: [],
      suggestedQueries: []
    };
  }
  function Toolbar({ hub }) {
    console.log("[Toolbar] Initializing with hub:", hub, "isInitialized:", hub?.isInitialized());
    const isInitializing = useSignal(true);
    const isVisible = useSignal(false);
    const isMinimized = useSignal(false);
    const chatSessions = useSignal([]);
    const activeChatId = useSignal(null);
    const inputValue = useSignal("");
    const editingTitle = useSignal("");
    const activeTab = useSignal("chat");
    const projectInfo = useSignal(null);
    const hasInitialChat = useSignal(false);
    const isLoadingMessages = useSignal(false);
    const isStreamingResponse = useSignal(false);
    const streamingContent = useSignal("");
    const showModelSelector = useSignal(false);
    const currentView = useSignal("chat");
    const apiKey = useSignal("");
    const selectionMode = useSignal("none");
    const selectedComponent = useSignal(null);
    E2(() => {
      const isDev = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      if (isDev) {
        const storedKey = localStorage.getItem("react-llm-openrouter-key");
        const envKey = window.__REACT_LLM_CONFIG__?.openrouterKey;
        if (storedKey || envKey) {
          apiKey.value = storedKey || envKey;
          hub.initializeProvider("openrouter", apiKey.value).then(() => {
            console.log("[ReactLLM] OpenRouter initialized with", hub.getAvailableModels().length, "models");
          });
        }
      }
    });
    E2(() => {
      if (hasInitialChat.value) return;
      const initialize = async () => {
        try {
          await initDB();
          const sessions = await getChatSessions();
          if (sessions.length > 0) {
            const messages = await getMessagesForChatSession(sessions[0].id);
            const firstSession = {
              id: sessions[0].id,
              title: sessions[0].title,
              messages: messages.map((m3) => ({
                role: m3.role === "user" || m3.role === "assistant" ? m3.role : "assistant",
                content: m3.content,
                structuredResponse: m3.structuredResponse ? JSON.parse(m3.structuredResponse) : void 0
              }))
            };
            chatSessions.value = [firstSession];
            activeChatId.value = firstSession.id;
            hasInitialChat.value = true;
            const firstMessage = messages.find((m3) => m3.role === "assistant" && m3.structuredResponse);
            if (firstMessage?.structuredResponse) {
              try {
                const structuredResponse = JSON.parse(firstMessage.structuredResponse);
                if (structuredResponse.projectInfo) {
                  projectInfo.value = structuredResponse.projectInfo;
                }
              } catch (e4) {
                console.warn("Failed to parse structured response:", e4);
              }
            }
          } else if (hub.isInitialized()) {
            const initialResponse = getInitialResponse();
            if (initialResponse.projectInfo) {
              projectInfo.value = initialResponse.projectInfo;
            }
            const newId = String(Date.now());
            await createChatSession(newId, "Welcome");
            const welcomeMessage = `Welcome to React LLM! I'm ready to help you with your React codebase.

I'm currently using **${hub.getActiveModel()}** - you can change models anytime using the \u{1F916} button.

What would you like to explore?`;
            await createMessage(
              String(Date.now()),
              newId,
              "assistant",
              welcomeMessage,
              JSON.stringify({
                ...initialResponse,
                markdown: welcomeMessage
              })
            );
            const chat = {
              id: newId,
              title: "Welcome",
              messages: [{
                role: "assistant",
                content: welcomeMessage,
                structuredResponse: {
                  ...initialResponse,
                  markdown: welcomeMessage
                }
              }],
              projectInfo: initialResponse.projectInfo
            };
            chatSessions.value = [chat];
            activeChatId.value = chat.id;
            hasInitialChat.value = true;
          }
        } finally {
          isInitializing.value = false;
          setTimeout(() => isVisible.value = true, 50);
        }
      };
      initialize();
    });
    E2(() => {
      if (!activeChatId.value || isLoadingMessages.value) return;
      const currentChat = chatSessions.value.find((c4) => c4.id === activeChatId.value);
      if (currentChat?.messages && currentChat.messages.length > 0) return;
      const loadMessages = async () => {
        isLoadingMessages.value = true;
        try {
          const messages = await getMessagesForChatSession(activeChatId.value);
          chatSessions.value = chatSessions.value.map(
            (session) => session.id === activeChatId.value ? {
              ...session,
              messages: messages.map((m3) => ({
                role: m3.role,
                content: m3.content,
                structuredResponse: m3.structuredResponse ? JSON.parse(m3.structuredResponse) : void 0,
                relevantFiles: m3.relevantFiles || [],
                documentationLinks: m3.documentationLinks || [],
                suggestedQueries: m3.suggestedQueries || []
              }))
            } : session
          );
        } catch (error) {
          console.error("Failed to load messages:", error);
        } finally {
          isLoadingMessages.value = false;
        }
      };
      loadMessages();
    });
    const createNewChat = async () => {
      console.log("[createNewChat] Starting...", {
        isInitializing: isInitializing.value,
        hubInitialized: hub?.isInitialized(),
        activeModel: hub?.getActiveModel()
      });
      if (isInitializing.value) return;
      const newId = String(Date.now());
      try {
        await createChatSession(newId, "New Chat");
        let response;
        try {
          const llmContent = await hub.completeChat([
            { role: "user", content: "Please provide a helpful introduction and overview of how I can assist with this React codebase." }
          ]);
          response = {
            markdown: llmContent,
            chatTitle: extractTitleFromResponse(llmContent),
            relevantFiles: [],
            documentationLinks: [],
            suggestedQueries: extractSuggestionsFromResponse(llmContent)
          };
        } catch (error) {
          console.error("Failed to get LLM response:", error);
          response = {
            markdown: "Hello! I'm ready to help you with your React codebase.",
            chatTitle: "New Chat",
            relevantFiles: [],
            documentationLinks: [],
            suggestedQueries: ["How does this work?", "Can you explain this pattern?"]
          };
        }
        await createMessage(
          String(Date.now()),
          newId,
          "assistant",
          response.markdown,
          JSON.stringify(response)
        );
        const newChat = {
          id: newId,
          title: response.chatTitle || "New Chat",
          messages: [{
            role: "assistant",
            content: response.markdown,
            structuredResponse: response
          }],
          projectInfo: response.projectInfo
        };
        chatSessions.value = [...chatSessions.value, newChat];
        activeChatId.value = newId;
      } catch (error) {
        console.error("Failed to create new chat:", error);
      }
    };
    const formatChatTitle = (title) => {
      if (!title) return projectInfo.value?.name || "untitled project";
      if (!projectInfo.value?.name || !projectInfo.value?.description) return title;
      const cleanTitle = title.toLowerCase().startsWith(projectInfo.value.name.toLowerCase()) ? title.slice(projectInfo.value.name.length).replace(/^[-:\s]+/, "") : title;
      return `${projectInfo.value.name} - ${projectInfo.value.description}`.toLowerCase();
    };
    const activeChat = () => activeChatId.value ? chatSessions.value.find((c4) => c4.id === activeChatId.value) : null;
    const deleteChat = async (chatId) => {
      try {
        await deleteChatSession(chatId);
        chatSessions.value = chatSessions.value.filter((c4) => c4.id !== chatId);
        if (activeChatId.value === chatId) {
          activeChatId.value = chatSessions.value[0]?.id || null;
        }
      } catch (error) {
        console.error("Failed to delete chat:", error);
      }
    };
    const startEditingTitle = (chatId) => {
      const chat = chatSessions.value.find((c4) => c4.id === chatId);
      if (chat) {
        editingTitle.value = chat.title;
      }
    };
    const saveEditingTitle = () => {
      if (editingTitle.value.trim()) {
        chatSessions.value = chatSessions.value.map(
          (chat) => chat.id === activeChatId.value ? { ...chat, title: editingTitle.value.trim() } : chat
        );
      }
      editingTitle.value = "";
    };
    const handleSubmit = async (e4) => {
      e4.preventDefault();
      if (!inputValue.value.trim() || isInitializing.value) return;
      const userMessage = inputValue.value;
      inputValue.value = "";
      if (!activeChatId.value) {
        await createNewChat();
        return;
      }
      const chat = activeChat();
      const isNewChat = chat.messages.length === 0;
      const userMessageId = String(Date.now());
      try {
        await createMessage(
          userMessageId,
          chat.id,
          "user",
          userMessage
        );
        const updatedMessages = [...chat.messages, { role: "user", content: userMessage }];
        chatSessions.value = chatSessions.value.map(
          (c4) => c4.id === activeChatId.value ? { ...c4, messages: updatedMessages } : c4
        );
        isInitializing.value = true;
        isStreamingResponse.value = true;
        streamingContent.value = "";
        const llmMessages = [
          ...chat.messages.map((m3) => ({ role: m3.role, content: m3.content })),
          { role: "user", content: userMessage }
        ];
        let fullResponse = "";
        try {
          for await (const chunk of hub.chat(llmMessages)) {
            fullResponse += chunk;
            streamingContent.value = fullResponse;
          }
          const response = {
            markdown: fullResponse,
            chatTitle: isNewChat ? extractTitleFromResponse(fullResponse) : void 0,
            relevantFiles: [],
            documentationLinks: [],
            suggestedQueries: extractSuggestionsFromResponse(fullResponse)
          };
          const assistantMessageId = String(Date.now() + 1);
          await createMessage(
            assistantMessageId,
            chat.id,
            "assistant",
            fullResponse,
            JSON.stringify(response)
          );
          const newMessages = [...updatedMessages, {
            role: "assistant",
            content: fullResponse,
            structuredResponse: response
          }];
          chatSessions.value = chatSessions.value.map(
            (c4) => c4.id === activeChatId.value ? {
              ...c4,
              title: isNewChat && response.chatTitle ? response.chatTitle : c4.title,
              messages: newMessages,
              projectInfo: isNewChat ? response.projectInfo : c4.projectInfo
            } : c4
          );
        } catch (streamError) {
          console.error("Streaming error:", streamError);
          const errorResponse = "I apologize, but I encountered an issue processing your request. Please try again.";
          const assistantMessageId = String(Date.now() + 1);
          await createMessage(
            assistantMessageId,
            chat.id,
            "assistant",
            errorResponse
          );
          chatSessions.value = chatSessions.value.map(
            (c4) => c4.id === activeChatId.value ? {
              ...c4,
              messages: [...updatedMessages, {
                role: "assistant",
                content: errorResponse
              }]
            } : c4
          );
        }
      } catch (error) {
        console.error("Failed to get response:", error);
        const errorMessageId = String(Date.now() + 1);
        await createMessage(
          errorMessageId,
          chat.id,
          "assistant",
          "Sorry, I encountered an error. Please try again."
        );
        chatSessions.value = chatSessions.value.map(
          (c4) => c4.id === activeChatId.value ? {
            ...c4,
            messages: [...chat.messages, {
              role: "assistant",
              content: "Sorry, I encountered an error. Please try again."
            }]
          } : c4
        );
      } finally {
        isInitializing.value = false;
        isStreamingResponse.value = false;
        streamingContent.value = "";
      }
    };
    const extractTitleFromResponse = (response) => {
      if (!response) return "New Chat";
      const lines = response.split("\n");
      const firstLine = lines[0]?.replace(/^#+\s*/, "").trim();
      return firstLine && firstLine.length < 100 ? firstLine : "New Chat";
    };
    const extractSuggestionsFromResponse = (response) => {
      if (!response) return [];
      const suggestions = [];
      const lines = response.split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("- ") && trimmed.endsWith("?")) {
          suggestions.push(trimmed.slice(2));
        } else if (trimmed.match(/^\d+\./)) {
          const question = trimmed.replace(/^\d+\.\s*/, "");
          if (question.endsWith("?")) {
            suggestions.push(question);
          }
        }
      }
      return suggestions.slice(0, 3);
    };
    const handleModelChange = (provider, model) => {
      hub.setActiveModel(provider, model);
      showModelSelector.value = false;
    };
    const selectedComponents = useSignal([]);
    const handleComponentSelect = (componentInfo) => {
      selectedComponent.value = componentInfo;
      selectionMode.value = "selected";
      if (componentInfo) {
        const existingIndex = selectedComponents.value.findIndex(
          (c4) => c4.id === componentInfo.id
        );
        if (existingIndex === -1) {
          selectedComponents.value = [...selectedComponents.value, {
            ...componentInfo,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }];
        }
        currentView.value = "components";
      }
    };
    const renderComponentsView = () => /* @__PURE__ */ _("div", { className: "view-container" }, /* @__PURE__ */ _("div", { className: "view-header" }, /* @__PURE__ */ _("h2", { className: "view-title" }, "Selected Components"), /* @__PURE__ */ _("button", { className: "view-close", onClick: () => currentView.value = "chat" }, "\xD7")), /* @__PURE__ */ _("div", { className: "view-content" }, selectedComponents.value.length === 0 ? /* @__PURE__ */ _("div", { className: "empty-components" }, /* @__PURE__ */ _("p", null, "No components selected yet"), /* @__PURE__ */ _(
      "button",
      {
        className: "select-component-button",
        onClick: () => {
          currentView.value = "chat";
          selectionMode.value = "selecting";
        }
      },
      /* @__PURE__ */ _("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ _("path", { d: "M2 2h4v2H4v2H2V2zm10 0h4v4h-2V4h-2V2zM2 10h2v2h2v2H2v-4zm12 2h2v-2h-2v2zm0 0v2h-2v2h4v-4h-2z" }), /* @__PURE__ */ _("circle", { cx: "8", cy: "8", r: "2", opacity: "0.5" })),
      "Select a Component"
    )) : /* @__PURE__ */ _("div", { className: "components-list" }, selectedComponents.value.map((comp) => /* @__PURE__ */ _("div", { key: comp.id, className: "component-item" }, /* @__PURE__ */ _("div", { className: "component-header" }, /* @__PURE__ */ _("h3", { className: "component-name" }, comp.name), /* @__PURE__ */ _(
      "button",
      {
        className: "remove-button",
        onClick: () => {
          selectedComponents.value = selectedComponents.value.filter((c4) => c4.id !== comp.id);
        }
      },
      "\xD7"
    )), /* @__PURE__ */ _("div", { className: "component-details" }, comp.domElement && /* @__PURE__ */ _("div", { className: "detail-row" }, /* @__PURE__ */ _("span", { className: "detail-label" }, "Element:"), /* @__PURE__ */ _("code", { className: "detail-value" }, "<", comp.domElement.tagName.toLowerCase(), comp.domElement.id ? ` id="${comp.domElement.id}"` : "", comp.domElement.className ? ` class="${comp.domElement.className}"` : "", ">")), Object.keys(comp.props || {}).length > 0 && /* @__PURE__ */ _("div", { className: "detail-row" }, /* @__PURE__ */ _("span", { className: "detail-label" }, "Props:"), /* @__PURE__ */ _("pre", { className: "detail-value props-value" }, JSON.stringify(comp.props, null, 2))), comp.state && /* @__PURE__ */ _("div", { className: "detail-row" }, /* @__PURE__ */ _("span", { className: "detail-label" }, "State:"), /* @__PURE__ */ _("pre", { className: "detail-value props-value" }, JSON.stringify(comp.state, null, 2))), comp.hooks && comp.hooks.length > 0 && /* @__PURE__ */ _("div", { className: "detail-row" }, /* @__PURE__ */ _("span", { className: "detail-label" }, "Hooks:"), /* @__PURE__ */ _("div", { className: "detail-value" }, comp.hooks.map((hook, i4) => /* @__PURE__ */ _("div", { key: i4, className: "hook-item" }, "Hook ", i4, ": ", JSON.stringify(hook.memoizedState))))), /* @__PURE__ */ _("div", { className: "component-actions" }, /* @__PURE__ */ _(
      "button",
      {
        className: "action-button",
        onClick: () => {
          currentView.value = "chat";
          inputValue.value = `Tell me about the ${comp.name} component`;
        }
      },
      "Ask about this component"
    ))))))));
    const renderSettingsView = () => /* @__PURE__ */ _("div", { className: "view-container" }, /* @__PURE__ */ _("div", { className: "view-header" }, /* @__PURE__ */ _("h2", { className: "view-title" }, "Settings"), /* @__PURE__ */ _("button", { className: "view-close", onClick: () => currentView.value = "chat" }, "\xD7")), /* @__PURE__ */ _("div", { className: "view-content" }, /* @__PURE__ */ _("div", { className: "settings-section" }, /* @__PURE__ */ _("label", { className: "settings-label" }, "OpenRouter API Key"), /* @__PURE__ */ _(
      "input",
      {
        type: "password",
        className: "settings-input",
        value: apiKey.value,
        onInput: (e4) => apiKey.value = e4.target.value,
        placeholder: "sk-or-..."
      }
    ), /* @__PURE__ */ _("div", { className: "settings-hint" }, "Get your API key from", " ", /* @__PURE__ */ _("a", { href: "https://openrouter.ai/keys", target: "_blank", rel: "noopener noreferrer", style: { color: "rgba(100, 200, 255, 0.9)" } }, "openrouter.ai/keys")), /* @__PURE__ */ _(
      "button",
      {
        className: "settings-button",
        onClick: async () => {
          if (apiKey.value) {
            localStorage.setItem("react-llm-openrouter-key", apiKey.value);
            await hub.initializeProvider("openrouter", apiKey.value);
            currentView.value = "models";
          }
        },
        disabled: !apiKey.value
      },
      "Save and Connect"
    ))));
    const renderModelsView = () => {
      const models = hub.getAvailableModels();
      const hasApiKey = hub.isInitialized() && hub.getActiveProvider() !== "demo";
      return /* @__PURE__ */ _("div", { className: "view-container" }, /* @__PURE__ */ _("div", { className: "view-header" }, /* @__PURE__ */ _("h2", { className: "view-title" }, "Select Model"), /* @__PURE__ */ _("button", { className: "view-close", onClick: () => currentView.value = "chat" }, "\xD7")), /* @__PURE__ */ _("div", { className: "view-content" }, !hasApiKey && /* @__PURE__ */ _("div", { className: "api-key-prompt" }, /* @__PURE__ */ _("div", { className: "api-key-prompt-text" }, "Add your OpenRouter API key to access all models"), /* @__PURE__ */ _(
        "button",
        {
          className: "api-key-prompt-button",
          onClick: () => currentView.value = "settings"
        },
        "Add API Key"
      )), /* @__PURE__ */ _("div", { className: "models-grid" }, models.map((model) => /* @__PURE__ */ _(
        "div",
        {
          key: model.id,
          className: `model-card ${hub.getActiveModel() === model.id ? "selected" : ""}`,
          onClick: () => {
            hub.setActiveModel("openrouter", model.id);
            handleModelChange("openrouter", model.id);
            currentView.value = "chat";
          }
        },
        /* @__PURE__ */ _("div", { className: "model-card-header" }, /* @__PURE__ */ _("div", null, /* @__PURE__ */ _("div", { className: "model-card-name" }, model.name), /* @__PURE__ */ _("div", { className: "model-card-provider" }, model.provider)), model.id.includes("claude-3-5-sonnet") || model.id.includes("gpt-4o") ? /* @__PURE__ */ _("span", { className: "model-card-badge recommended" }, "Recommended") : null),
        /* @__PURE__ */ _("div", { className: "model-card-specs" }, /* @__PURE__ */ _("div", { className: "model-spec" }, /* @__PURE__ */ _("div", { className: "model-spec-label" }, "Context"), /* @__PURE__ */ _("div", { className: "model-spec-value" }, model.contextLength >= 1e6 ? `${(model.contextLength / 1e6).toFixed(1)}M` : model.contextLength >= 1e3 ? `${(model.contextLength / 1e3).toFixed(0)}K` : model.contextLength)), /* @__PURE__ */ _("div", { className: "model-spec" }, /* @__PURE__ */ _("div", { className: "model-spec-label" }, "Input"), /* @__PURE__ */ _("div", { className: "model-spec-value" }, "$", (model.pricing.prompt * 1e3).toFixed(3), "/1K")), /* @__PURE__ */ _("div", { className: "model-spec" }, /* @__PURE__ */ _("div", { className: "model-spec-label" }, "Output"), /* @__PURE__ */ _("div", { className: "model-spec-value" }, "$", (model.pricing.completion * 1e3).toFixed(3), "/1K"))),
        model.description && /* @__PURE__ */ _("div", { className: "model-card-description" }, model.description)
      )))));
    };
    const renderMessage = (msg) => {
      if (msg.role === "user") {
        return /* @__PURE__ */ _("div", { className: "message user-message" }, msg.content);
      }
      const html2 = marked(msg.content);
      if (typeof html2 !== "string") return null;
      return /* @__PURE__ */ _("div", { className: "message assistant-message" }, /* @__PURE__ */ _("div", { dangerouslySetInnerHTML: { __html: html2 } }), msg.structuredResponse?.relevantFiles && msg.structuredResponse.relevantFiles.length > 0 && /* @__PURE__ */ _("div", { className: "relevant-files" }, msg.structuredResponse.relevantFiles.map((file, i4) => /* @__PURE__ */ _("div", { key: i4, className: "relevant-file", title: file.reason }, /* @__PURE__ */ _("span", { className: "file-path" }, file.path)))), msg.structuredResponse?.documentationLinks && msg.structuredResponse.documentationLinks.length > 0 && /* @__PURE__ */ _("div", { className: "docs-section" }, msg.structuredResponse.documentationLinks.map((link2, i4) => /* @__PURE__ */ _(
        "a",
        {
          key: i4,
          href: link2.url,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "docs-link"
        },
        /* @__PURE__ */ _("div", { className: "docs-link-title" }, link2.title),
        /* @__PURE__ */ _("div", { className: "docs-link-description" }, link2.description)
      ))), msg.structuredResponse?.suggestedQueries && msg.structuredResponse.suggestedQueries.length > 0 && /* @__PURE__ */ _("div", { className: "suggested-queries" }, /* @__PURE__ */ _("div", { className: "suggested-queries-title" }, "suggested questions"), /* @__PURE__ */ _("div", { className: "suggested-queries-list" }, msg.structuredResponse.suggestedQueries.map((query, i4) => /* @__PURE__ */ _(
        "div",
        {
          key: i4,
          className: "suggested-query",
          onClick: () => {
            inputValue.value = query;
            const input = document.querySelector(".input");
            if (input) {
              input.focus();
            }
          }
        },
        query.toLowerCase()
      )))));
    };
    return /* @__PURE__ */ _(k, null, /* @__PURE__ */ _("style", null, styles), selectionMode.value === "selecting" && /* @__PURE__ */ _(
      ComponentInspector2,
      {
        isActive: true,
        onSelect: handleComponentSelect
      }
    ), /* @__PURE__ */ _(
      "div",
      {
        className: `toolbar ${isMinimized.value ? "minimized" : ""} ${isVisible.value ? "" : "opacity-0"}`
      },
      /* @__PURE__ */ _("div", { className: "header" }, /* @__PURE__ */ _("div", { className: "controls" }, /* @__PURE__ */ _(
        "button",
        {
          className: `control-button ${currentView.value === "components" ? "active" : ""}`,
          onClick: () => currentView.value = currentView.value === "components" ? "chat" : "components",
          title: "Selected Components"
        },
        /* @__PURE__ */ _("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ _("rect", { x: "2", y: "2", width: "5", height: "5", rx: "1", stroke: "currentColor", strokeWidth: "1.5", fill: "none" }), /* @__PURE__ */ _("rect", { x: "9", y: "2", width: "5", height: "5", rx: "1", stroke: "currentColor", strokeWidth: "1.5", fill: "none" }), /* @__PURE__ */ _("rect", { x: "2", y: "9", width: "5", height: "5", rx: "1", stroke: "currentColor", strokeWidth: "1.5", fill: "none" }), /* @__PURE__ */ _("rect", { x: "9", y: "9", width: "5", height: "5", rx: "1", stroke: "currentColor", strokeWidth: "1.5", fill: "none" }))
      ), /* @__PURE__ */ _(
        "button",
        {
          className: `control-button model-button ${currentView.value === "models" ? "active" : ""}`,
          onClick: () => currentView.value = currentView.value === "models" ? "chat" : "models",
          title: "Select Model"
        },
        /* @__PURE__ */ _("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ _("rect", { x: "2", y: "2", width: "12", height: "12", rx: "2", stroke: "currentColor", strokeWidth: "1.5", fill: "none" }), /* @__PURE__ */ _("rect", { x: "5", y: "5", width: "6", height: "1.5", rx: "0.75", fill: "currentColor" }), /* @__PURE__ */ _("rect", { x: "5", y: "8", width: "6", height: "1.5", rx: "0.75", fill: "currentColor" }), /* @__PURE__ */ _("rect", { x: "5", y: "11", width: "4", height: "1.5", rx: "0.75", fill: "currentColor" }))
      ), /* @__PURE__ */ _(
        "button",
        {
          className: `control-button ${currentView.value === "settings" ? "active" : ""}`,
          onClick: () => currentView.value = currentView.value === "settings" ? "chat" : "settings",
          title: "Settings"
        },
        /* @__PURE__ */ _("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ _("path", { d: "M8 10a2 2 0 100-4 2 2 0 000 4z" }), /* @__PURE__ */ _("path", { d: "M13.3 9.2a1.2 1.2 0 010-2.4l.7-.1a6 6 0 00-.4-1.6l-.6.4a1.2 1.2 0 01-1.7-.4 1.2 1.2 0 01.4-1.7l.6-.3A6 6 0 0011 2l-.1.7a1.2 1.2 0 01-2.4 0L8.4 2a6 6 0 00-1.6.4l.4.6a1.2 1.2 0 01-.4 1.7 1.2 1.2 0 01-1.7-.4l-.3-.6A6 6 0 002 5l.7.1a1.2 1.2 0 010 2.4L2 7.6a6 6 0 00.4 1.6l.6-.4a1.2 1.2 0 011.7.4 1.2 1.2 0 01-.4 1.7l-.6.3A6 6 0 005 14l.1-.7a1.2 1.2 0 012.4 0l.1.7a6 6 0 001.6-.4l-.4-.6a1.2 1.2 0 01.4-1.7 1.2 1.2 0 011.7.4l.3.6A6 6 0 0014 11l-.7-.1zM8 11a3 3 0 110-6 3 3 0 010 6z" }))
      ), /* @__PURE__ */ _(
        "button",
        {
          className: "control-button",
          onClick: createNewChat,
          disabled: isInitializing.value
        },
        "+"
      ), /* @__PURE__ */ _(
        "button",
        {
          className: "control-button",
          onClick: () => isMinimized.value = !isMinimized.value
        },
        isMinimized.value ? "+" : "-"
      ))),
      !isMinimized.value && currentView.value === "models" && renderModelsView(),
      !isMinimized.value && currentView.value === "settings" && renderSettingsView(),
      !isMinimized.value && currentView.value === "components" && renderComponentsView(),
      !isMinimized.value && currentView.value === "chat" && (activeChat() ? /* @__PURE__ */ _(k, null, /* @__PURE__ */ _("div", { className: "messages-container" }, activeChat().messages.map((msg, i4) => /* @__PURE__ */ _("div", { key: i4, className: "message-wrapper" }, renderMessage(msg))), isStreamingResponse.value && streamingContent.value && /* @__PURE__ */ _("div", { className: "message-wrapper" }, /* @__PURE__ */ _("div", { className: "message assistant-message" }, /* @__PURE__ */ _("div", { dangerouslySetInnerHTML: { __html: marked(streamingContent.value) } })))), /* @__PURE__ */ _("div", { className: "input-area" }, /* @__PURE__ */ _("form", { onSubmit: handleSubmit, className: "input-form" }, /* @__PURE__ */ _(
        "input",
        {
          type: "text",
          className: "input",
          value: inputValue.value,
          onInput: (e4) => inputValue.value = e4.target.value,
          placeholder: "ask about your react codebase...",
          disabled: isInitializing.value || isStreamingResponse.value
        }
      )), /* @__PURE__ */ _("div", { className: "input-controls" }, /* @__PURE__ */ _(
        "button",
        {
          type: "button",
          className: `control-icon-button ${selectionMode.value === "selecting" ? "active" : ""}`,
          onClick: () => selectionMode.value = selectionMode.value === "selecting" ? "none" : "selecting",
          title: "Select Component"
        },
        /* @__PURE__ */ _("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ _("path", { d: "M2 2h4v2H4v2H2V2zm10 0h4v4h-2V4h-2V2zM2 10h2v2h2v2H2v-4zm12 2h2v-2h-2v2zm0 0v2h-2v2h4v-4h-2z" }), /* @__PURE__ */ _("circle", { cx: "8", cy: "8", r: "2", opacity: "0.5" }))
      ), /* @__PURE__ */ _(
        "button",
        {
          type: "button",
          className: "send-button",
          onClick: (e4) => {
            e4.preventDefault();
            handleSubmit(e4);
          },
          disabled: isInitializing.value || isStreamingResponse.value || !inputValue.value.trim()
        },
        isStreamingResponse.value ? "..." : "\u2192"
      )))) : /* @__PURE__ */ _("div", { className: "empty-state" }, /* @__PURE__ */ _("div", { className: "empty-state-title" }, "welcome to react llm"), /* @__PURE__ */ _("div", { className: "empty-state-description" }, "start a new chat to get ai-powered help with your react codebase", isInitializing.value && /* @__PURE__ */ _("div", { className: "loading-dots" }, /* @__PURE__ */ _("div", { className: "loading-dot" }), /* @__PURE__ */ _("div", { className: "loading-dot" }), /* @__PURE__ */ _("div", { className: "loading-dot" }))), /* @__PURE__ */ _(
        "button",
        {
          className: "new-chat-button",
          onClick: createNewChat,
          disabled: isInitializing.value
        },
        /* @__PURE__ */ _("span", null, "+"),
        " new chat"
      )))
    ));
  }

  // src/utils/event-emitter.ts
  var EventEmitter = class {
    constructor() {
      this.events = /* @__PURE__ */ new Map();
    }
    on(event, listener) {
      if (!this.events.has(event)) {
        this.events.set(event, []);
      }
      this.events.get(event).push(listener);
      return this;
    }
    emit(event, ...args) {
      const listeners = this.events.get(event);
      if (!listeners || listeners.length === 0) {
        return false;
      }
      listeners.forEach((listener) => listener(...args));
      return true;
    }
    removeListener(event, listener) {
      const listeners = this.events.get(event);
      if (!listeners) return this;
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
      return this;
    }
    removeAllListeners(event) {
      if (event) {
        this.events.delete(event);
      } else {
        this.events.clear();
      }
      return this;
    }
  };

  // src/llm/openrouter-client.ts
  var OpenRouterClient = class extends EventEmitter {
    constructor(config) {
      super();
      this.baseUrl = "https://openrouter.ai/api/v1";
      this.models = [];
      this.isInitialized = false;
      this.apiKey = config.apiKey;
      this.siteUrl = config.siteUrl;
      this.siteName = config.siteName;
      this.initialize();
    }
    async initialize() {
      try {
        await this.fetchModels();
        this.isInitialized = true;
        this.emit("ready");
      } catch (error) {
        console.error("Failed to initialize OpenRouter client:", error);
        const cached = localStorage.getItem("openrouter_models");
        if (cached) {
          try {
            const { models } = JSON.parse(cached);
            this.models = models;
            this.isInitialized = true;
            this.emit("ready");
          } catch (parseError) {
            console.error("Failed to load cached models:", parseError);
            this.emit("error", error);
          }
        } else {
          this.emit("error", error);
        }
      }
    }
    async fetchModels() {
      try {
        const response = await fetch(`${this.baseUrl}/models`, {
          headers: {
            "Authorization": `Bearer ${this.apiKey}`,
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        this.models = data.data?.map(this.parseModel) || [];
        localStorage.setItem("openrouter_models", JSON.stringify({
          models: this.models,
          timestamp: Date.now()
        }));
        this.emit("modelsUpdated", this.models);
        return this.models;
      } catch (error) {
        console.error("Failed to fetch models from OpenRouter:", error);
        throw error;
      }
    }
    parseModel(model) {
      return {
        id: model.id,
        name: model.name || model.id,
        provider: model.id.split("/")[0] || "unknown",
        contextLength: model.context_length || 4096,
        pricing: {
          prompt: parseFloat(model.pricing?.prompt || "0"),
          completion: parseFloat(model.pricing?.completion || "0")
        },
        architectures: model.architecture,
        top_provider: model.top_provider
      };
    }
    async getLatestModels() {
      const cached = localStorage.getItem("openrouter_models");
      if (cached) {
        try {
          const { models, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 36e5) {
            this.models = models;
            return models;
          }
        } catch (e4) {
          console.warn("Invalid cached models data:", e4);
        }
      }
      return this.fetchModels();
    }
    async *chat(messages, options2 = {}) {
      if (!this.isInitialized) {
        throw new Error("OpenRouter client not initialized. Please wait for initialization.");
      }
      if (!options2.model) {
        throw new Error("Model must be specified");
      }
      const headers = {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      };
      if (options2.siteUrl || this.siteUrl) {
        headers["HTTP-Referer"] = options2.siteUrl || this.siteUrl;
      }
      if (options2.siteName || this.siteName) {
        headers["X-Title"] = options2.siteName || this.siteName;
      }
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: options2.model,
          messages,
          stream: true,
          temperature: options2.temperature || 0.7,
          max_tokens: options2.maxTokens || 4096,
          stream_options: {
            include_usage: true
          }
        })
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
      }
      if (!response.body) {
        throw new Error("No response body received");
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let usage;
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((line) => line.trim());
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.usage) {
                  usage = parsed.usage;
                }
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  yield content;
                }
              } catch (e4) {
                console.warn("Failed to parse streaming chunk:", e4, "Data:", data);
              }
            }
          }
        }
        return usage;
      } finally {
        reader.releaseLock();
      }
    }
    async completeChat(messages, options2 = {}) {
      if (!this.isInitialized) {
        throw new Error("OpenRouter client not initialized. Please wait for initialization.");
      }
      if (!options2.model) {
        throw new Error("Model must be specified");
      }
      const headers = {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      };
      if (options2.siteUrl || this.siteUrl) {
        headers["HTTP-Referer"] = options2.siteUrl || this.siteUrl;
      }
      if (options2.siteName || this.siteName) {
        headers["X-Title"] = options2.siteName || this.siteName;
      }
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: options2.model,
          messages,
          stream: false,
          temperature: options2.temperature || 0.7,
          max_tokens: options2.maxTokens || 4096
        })
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
      }
      const data = await response.json();
      return {
        content: data.choices[0].message.content,
        usage: data.usage
      };
    }
    estimateCost(messages, model) {
      const modelInfo = this.models.find((m3) => m3.id === model);
      if (!modelInfo) {
        throw new Error(`Model ${model} not found`);
      }
      const tokens = this.countTokens(messages);
      return {
        promptTokens: tokens.prompt,
        completionTokens: tokens.completion,
        totalCost: (tokens.prompt * modelInfo.pricing.prompt + tokens.completion * modelInfo.pricing.completion) / 1e6
        // Convert to dollars
      };
    }
    /**
     * Enhanced token counting with more accurate estimation
     */
    countTokens(messages) {
      const text = messages.map((m3) => m3.content).join(" ");
      const baseTokens = Math.ceil(text.length / 3.5);
      const structureOverhead = messages.length * 4;
      const promptTokens = baseTokens + structureOverhead;
      const completionTokens = Math.ceil(promptTokens * 0.3);
      return {
        prompt: promptTokens,
        completion: completionTokens
      };
    }
    getModels() {
      return this.models;
    }
    getModel(id) {
      return this.models.find((m3) => m3.id === id);
    }
    /**
     * Get models filtered by provider
     */
    getModelsByProvider(provider) {
      return this.models.filter((m3) => m3.provider === provider);
    }
    /**
     * Get recommended models based on performance and cost
     */
    getRecommendedModels() {
      return this.models.filter((m3) => m3.contextLength >= 8e3).sort((a4, b2) => {
        const scoreA = this.calculateModelScore(a4);
        const scoreB = this.calculateModelScore(b2);
        return scoreB - scoreA;
      }).slice(0, 8);
    }
    calculateModelScore(model) {
      let score = model.contextLength / 1e3;
      if (model.id.includes("claude-3-5-sonnet")) score += 100;
      else if (model.id.includes("gpt-4o")) score += 90;
      else if (model.id.includes("gemini-2.0-flash")) score += 85;
      else if (model.id.includes("claude-3-opus")) score += 80;
      else if (model.id.includes("gpt-4-turbo")) score += 75;
      else if (model.id.includes("llama-3")) score += 70;
      if (model.pricing.prompt > 5e-5 && !model.id.includes("opus")) {
        score -= 20;
      }
      return score;
    }
    /**
     * Check if the client is ready to make requests
     */
    isReady() {
      return this.isInitialized;
    }
    /**
     * Get available providers from current models
     */
    getAvailableProviders() {
      const providers = new Set(this.models.map((m3) => m3.provider));
      return Array.from(providers).sort();
    }
  };

  // src/llm/providers.ts
  var LLMHub = class {
    constructor() {
      this.providers = /* @__PURE__ */ new Map();
      this.clients = /* @__PURE__ */ new Map();
      this.activeProvider = "openrouter";
      this.activeModel = null;
      this.modelsByProvider = {};
      this.isApiMode = false;
      this.registerProviders();
    }
    async registerProviders() {
      this.providers.set("openrouter", {
        id: "openrouter",
        name: "OpenRouter (All Providers)",
        models: [],
        supportsStreaming: true,
        requiresApiKey: true
      });
    }
    async initializeProvider(providerId, apiKey, options2) {
      if (providerId === "openrouter") {
        const client = new OpenRouterClient({
          apiKey,
          siteUrl: options2?.siteUrl || window.location.href,
          siteName: options2?.siteName || document.title
        });
        this.clients.set(providerId, client);
        if (!client.isReady()) {
          await new Promise((resolve, reject) => {
            client.once("ready", resolve);
            client.once("error", reject);
            setTimeout(() => {
              reject(new Error("OpenRouter client initialization timeout"));
            }, 1e4);
          });
        }
        try {
          const models = await client.getLatestModels();
          const provider = this.providers.get("openrouter");
          provider.models = models.map((m3) => m3.id);
          this.modelsByProvider = models.reduce((acc, model) => {
            const provider2 = model.id.split("/")[0];
            if (!acc[provider2]) acc[provider2] = [];
            acc[provider2].push(model);
            return acc;
          }, {});
          if (!this.activeModel && models.length > 0) {
            const preferredModel = models.find(
              (m3) => m3.id.includes("claude-3-5-sonnet") || m3.id.includes("gpt-4o") || m3.id.includes("gemini-2.0-flash")
            ) || models[0];
            this.activeModel = preferredModel.id;
          }
          return true;
        } catch (error) {
          console.error("Failed to initialize OpenRouter provider:", error);
          throw error;
        }
      }
      throw new Error(`Unknown provider: ${providerId}`);
    }
    /**
     * Initialize in demo mode - works without any API keys!
     */
    async initializeDemoMode() {
      this.isApiMode = false;
      this.activeProvider = "demo";
      this.activeModel = "demo/gemini-2.0-flash";
      this.modelsByProvider = {
        demo: [
          {
            id: "demo/gemini-2.0-flash",
            name: "Gemini 2.0 Flash (Demo)",
            provider: "demo",
            contextLength: 32768,
            pricing: { prompt: 0, completion: 0 }
          }
        ]
      };
      console.log("[LLMHub] Initialized in demo mode - no API keys required!");
      return true;
    }
    /**
     * Initialize in API mode - uses server endpoints instead of direct API keys
     */
    async initializeApiMode(apiEndpoint, modelsEndpoint) {
      this.isApiMode = true;
      this.apiEndpoint = apiEndpoint;
      this.modelsEndpoint = modelsEndpoint || "/api/models";
      this.activeProvider = "api";
      if (modelsEndpoint) {
        try {
          const response = await fetch(modelsEndpoint);
          if (response.ok) {
            const data = await response.json();
            const models = data.data || [];
            this.modelsByProvider = models.reduce((acc, model) => {
              const provider = model.id.split("/")[0];
              if (!acc[provider]) acc[provider] = [];
              acc[provider].push(model);
              return acc;
            }, {});
            if (!this.activeModel && models.length > 0) {
              const preferredModel = models.find(
                (m3) => m3.id.includes("gemini-2.0-flash") || m3.id.includes("gemini-2-flash")
              ) || models.find(
                (m3) => m3.id.includes("claude-3-5-sonnet") || m3.id.includes("gpt-4o")
              ) || models[0];
              this.activeModel = preferredModel.id;
            }
          }
        } catch (error) {
          console.error("Failed to fetch models:", error);
        }
      }
      return true;
    }
    getProviders() {
      return Array.from(this.providers.values());
    }
    getActiveProvider() {
      return this.activeProvider;
    }
    getModelsByProvider(provider) {
      return this.modelsByProvider[provider] || [];
    }
    getAvailableModels() {
      if (this.activeProvider === "demo") {
        return [{
          id: "demo/gemini-2.0-flash",
          name: "Gemini 2.0 Flash (Demo)",
          provider: "demo",
          contextLength: 32768,
          pricing: { prompt: 0, completion: 0 },
          description: "Demo mode - no API key required"
        }];
      }
      const allModels = [];
      Object.values(this.modelsByProvider).forEach((models) => {
        allModels.push(...models);
      });
      return allModels;
    }
    getAllModels() {
      const client = this.clients.get("openrouter");
      return client ? client.getModels() : [];
    }
    getRecommendedModels() {
      const allModels = this.getAllModels();
      const recommendations = [];
      const providers = ["anthropic", "openai", "google", "meta-llama", "mistralai"];
      providers.forEach((provider) => {
        const providerModels = this.modelsByProvider[provider] || [];
        if (providerModels.length > 0) {
          const sorted = providerModels.filter((m3) => m3.contextLength >= 8e3).sort((a4, b2) => {
            const aScore = this.getModelScore(a4);
            const bScore = this.getModelScore(b2);
            return bScore - aScore;
          });
          if (sorted[0]) {
            recommendations.push(sorted[0]);
          }
        }
      });
      return recommendations;
    }
    getModelScore(model) {
      let score = model.contextLength / 1e3;
      if (model.id.includes("claude-3-5-sonnet")) score += 100;
      else if (model.id.includes("gpt-4o")) score += 90;
      else if (model.id.includes("gemini-2.0-flash")) score += 85;
      else if (model.id.includes("claude-3-opus")) score += 80;
      else if (model.id.includes("gpt-4-turbo")) score += 75;
      if (model.pricing.prompt > 5e-5 && !model.id.includes("opus")) {
        score -= 20;
      }
      return score;
    }
    setApiKey(provider, apiKey, options2) {
      return this.initializeProvider(provider, apiKey, options2);
    }
    getActiveModel() {
      return this.activeModel;
    }
    setActiveModel(provider, model) {
      this.activeProvider = provider;
      this.activeModel = model;
    }
    getClient(provider) {
      return this.clients.get(provider);
    }
    async *chat(messages, context) {
      if (this.activeProvider === "demo") {
        const demoResponses = [
          "\u{1F44B} Welcome to React LLM! I'm running in demo mode.\n\nTo enable full AI capabilities:\n\n1. **Option A**: Use your own API key\n   ```javascript\n   ReactLLM.init({\n     providers: {\n       openrouter: 'your-api-key'\n     }\n   });\n   ```\n\n2. **Option B**: Use a server-side proxy\n   ```javascript\n   ReactLLM.init({\n     apiEndpoint: '/api/chat'\n   });\n   ```\n\nI can see your React components and would love to help once configured!",
          "I notice you have some React components on this page. Once you configure an API key, I can help you:\n\n- \u{1F50D} Analyze component structure\n- \u270F\uFE0F Suggest improvements\n- \u{1F41B} Debug issues\n- \u{1F4DD} Generate documentation\n- \u{1F3A8} Refactor code\n\nReact LLM works on any website - just add the script tag!",
          "Demo mode is limited, but here's what React LLM can do:\n\n- **Component Selection**: Click any component to select it\n- **Context Aware**: I understand your component tree\n- **Multi-Model**: Supports GPT-4, Claude, Gemini, and more\n- **Browser Native**: No server required (with API keys)\n\nConfigure me to unlock these features!"
        ];
        const response = demoResponses[Math.floor(Math.random() * demoResponses.length)];
        for (const char of response) {
          yield char;
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
        return;
      }
      if (this.isApiMode && this.apiEndpoint) {
        const enhancedMessages2 = this.enhanceWithContext(messages, context);
        const response = await fetch(this.apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messages: enhancedMessages2,
            model: this.activeModel,
            stream: true
          })
        });
        if (!response.ok) {
          throw new Error(`API request failed: ${response.statusText}`);
        }
        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");
        const decoder = new TextDecoder();
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) yield content;
              } catch (e4) {
              }
            }
          }
        }
        return;
      }
      const client = this.clients.get(this.activeProvider);
      if (!client) {
        throw new Error("No API key set for provider");
      }
      const enhancedMessages = this.enhanceWithContext(messages, context);
      if (!this.activeModel) {
        throw new Error("No model selected. Please choose a model first.");
      }
      yield* client.chat(enhancedMessages, {
        model: this.activeModel,
        siteUrl: window.location.href,
        siteName: document.title
      });
    }
    async completeChat(messages, context) {
      if (this.activeProvider === "demo") {
        return "Welcome to React LLM! I'm running in demo mode. Configure an API key to unlock full AI capabilities.";
      }
      if (this.isApiMode && this.apiEndpoint) {
        const enhancedMessages2 = this.enhanceWithContext(messages, context);
        const response = await fetch(this.apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messages: enhancedMessages2,
            model: this.activeModel,
            stream: false
          })
        });
        if (!response.ok) {
          throw new Error(`API request failed: ${response.statusText}`);
        }
        const data = await response.json();
        return data.choices?.[0]?.message?.content || "";
      }
      const client = this.clients.get(this.activeProvider);
      if (!client) {
        throw new Error("No API key set for provider");
      }
      const enhancedMessages = this.enhanceWithContext(messages, context);
      if (!this.activeModel) {
        throw new Error("No model selected. Please choose a model first.");
      }
      return client.completeChat(enhancedMessages, {
        model: this.activeModel,
        siteUrl: window.location.href,
        siteName: document.title
      });
    }
    /**
     * Enhanced context building with more sophisticated component analysis
     */
    enhanceWithContext(messages, context) {
      if (!context) return messages;
      const contextParts = [
        `You are helping with a React component. Here's the context:`,
        ``,
        `Component: ${context.name}`,
        `Type: ${this.getComponentType(context)}`,
        `Props: ${this.formatProps(context.props)}`,
        context.state ? `State: ${JSON.stringify(context.state, null, 2)}` : null,
        context.hooks.length > 0 ? `Hooks: ${context.hooks.length} detected` : null,
        context.parent ? `Parent: ${context.parent.name}` : null,
        context.children.length > 0 ? `Children: ${context.children.map((c4) => c4.name).join(", ")}` : null,
        ``,
        context.sourceCode ? `Source code:
\`\`\`${context.language || "jsx"}
${context.sourceCode}
\`\`\`` : null,
        ``,
        `Please provide helpful guidance for working with this component. Consider its props, state, and relationships when providing suggestions.`
      ].filter(Boolean).join("\n");
      const systemMessage = {
        role: "system",
        content: contextParts
      };
      return [systemMessage, ...messages];
    }
    getComponentType(context) {
      if (context.hooks.length > 0) return "Function Component (with hooks)";
      if (context.state) return "Class Component";
      if (context.props && Object.keys(context.props).length > 0) return "Function Component";
      return "Component";
    }
    formatProps(props) {
      if (!props || Object.keys(props).length === 0) {
        return "No props";
      }
      const filteredProps = Object.entries(props).filter(([key]) => !key.startsWith("__") && key !== "children").reduce((acc, [key, value]) => {
        acc[key] = typeof value === "function" ? "[Function]" : typeof value === "object" && value !== null ? "[Object]" : value;
        return acc;
      }, {});
      return Object.keys(filteredProps).length > 0 ? JSON.stringify(filteredProps, null, 2) : "No relevant props";
    }
    isInitialized() {
      return this.activeProvider === "demo" || this.isApiMode || this.clients.size > 0;
    }
    getAvailableProviders() {
      return Array.from(this.clients.keys());
    }
    /**
     * Get cost estimate for a conversation
     */
    estimateCost(messages, context) {
      const client = this.clients.get(this.activeProvider);
      if (!client || !this.activeModel) {
        return null;
      }
      const enhancedMessages = this.enhanceWithContext(messages, context);
      return client.estimateCost(enhancedMessages, this.activeModel);
    }
  };

  // src/index.ts
  var init = async (config) => {
    try {
      const normalizedConfig = typeof config === "string" ? { providers: { openrouter: config } } : config;
      const container = document.createElement("div");
      container.id = "react-llm-root";
      document.body.appendChild(container);
      const shadow = container.attachShadow({ mode: "open" });
      const root = document.createElement("div");
      shadow.appendChild(root);
      const hub = new LLMHub();
      if (normalizedConfig.mode === "demo") {
        await hub.initializeDemoMode();
      } else if (normalizedConfig.apiEndpoint) {
        await hub.initializeApiMode(normalizedConfig.apiEndpoint, normalizedConfig.modelsEndpoint);
      } else if (normalizedConfig.providers?.openrouter || normalizedConfig.apiKey) {
        await hub.initializeProvider(
          "openrouter",
          normalizedConfig.providers?.openrouter || normalizedConfig.apiKey,
          {
            siteUrl: normalizedConfig.siteUrl,
            siteName: normalizedConfig.siteName
          }
        );
      } else {
        await hub.initializeDemoMode();
      }
      window.ReactLLM.hub = hub;
      E(_(Toolbar, {
        hub,
        config: normalizedConfig
      }), root);
      console.log("React-LLM initialized successfully in", normalizedConfig.apiEndpoint ? "API mode" : "direct mode");
    } catch (error) {
      console.error("Failed to initialize React-LLM:", error);
      throw error;
    }
  };
  window.ReactLLM = {
    init
  };
  return __toCommonJS(src_exports);
})();
/*! Bundled license information:

bippy/dist/rdt-hook-D8LwQB-4.js:
bippy/dist/core-wkpXT9Yv.js:
bippy/dist/src-C5k3J1-J.js:
bippy/dist/index.js:
  (**
   * @license bippy
   *
   * Copyright (c) Aiden Bai
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/

      (function() {
        console.log('[ReactLLM] Bundle loaded');
        
        // Set up public path for assets
        var scripts = document.getElementsByTagName('script');
        var currentScript = Array.from(scripts).find(script => script.src.includes('react-llm.js'));
        
        if (currentScript) {
          var scriptUrl = currentScript.src;
          window.__PUBLIC_PATH__ = scriptUrl.substring(0, scriptUrl.lastIndexOf('/') + 1);
          console.log('[ReactLLM] Public path set to:', window.__PUBLIC_PATH__);
        }
        
        console.log('[ReactLLM] Ready for initialization. Call ReactLLM.init() with config.');
      })();
//# sourceMappingURL=react-llm.global.js.map