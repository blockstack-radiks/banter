(function (root, factory) { if (typeof define === 'function' && define.amd) { define(factory); } else if (typeof exports === 'object') { module.exports = factory(); } else { root.NProgress = factory(); } }(this, () => {
  const NProgress = {}; NProgress.version = '0.2.0'; const Settings = NProgress.settings = {
    minimum: 0.08, easing: 'ease', positionUsing: '', speed: 200, trickle: true, trickleRate: 0.02, trickleSpeed: 800, showSpinner: true, barSelector: '[role="bar"]', spinnerSelector: '[role="spinner"]', parent: 'body', template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>',
  }; NProgress.configure = function (options) {
    let key; let
      value; for (key in options) { value = options[key]; if (value !== undefined && options.hasOwnProperty(key)) Settings[key] = value; }
    return this;
  }; NProgress.status = null; NProgress.set = function (n) {
    const started = NProgress.isStarted(); n = clamp(n, Settings.minimum, 1); NProgress.status = (n === 1 ? null : n); const progress = NProgress.render(!started); const bar = progress.querySelector(Settings.barSelector); const speed = Settings.speed; const
      ease = Settings.easing; progress.offsetWidth; queue((next) => { if (Settings.positionUsing === '') Settings.positionUsing = NProgress.getPositioningCSS(); css(bar, barPositionCSS(n, speed, ease)); if (n === 1) { css(progress, { transition: 'none', opacity: 1 }); progress.offsetWidth; setTimeout(() => { css(progress, { transition: `all ${speed}ms linear`, opacity: 0 }); setTimeout(() => { NProgress.remove(); next(); }, speed); }, speed); } else { setTimeout(next, speed); } }); return this;
  }; NProgress.isStarted = function () { return typeof NProgress.status === 'number'; }; NProgress.start = function () { if (!NProgress.status) NProgress.set(0); var work = function () { setTimeout(() => { if (!NProgress.status) return; NProgress.trickle(); work(); }, Settings.trickleSpeed); }; if (Settings.trickle) work(); return this; }; NProgress.done = function (force) { if (!force && !NProgress.status) return this; return NProgress.inc(0.3 + 0.5 * Math.random()).set(1); }; NProgress.inc = function (amount) {
    let n = NProgress.status; if (!n) { return NProgress.start(); } if (typeof amount !== 'number') { amount = (1 - n) * clamp(Math.random() * n, 0.1, 0.95); }
    n = clamp(n + amount, 0, 0.994); return NProgress.set(n);
  }; NProgress.trickle = function () { return NProgress.inc(Math.random() * Settings.trickleRate); }; (function () {
    let initial = 0; let
      current = 0; NProgress.promise = function ($promise) {
      if (!$promise || $promise.state() === 'resolved') { return this; }
      if (current === 0) { NProgress.start(); }
      initial++; current++; $promise.always(() => { current--; if (current === 0) { initial = 0; NProgress.done(); } else { NProgress.set((initial - current) / initial); } }); return this;
    };
  }()); NProgress.render = function (fromStart) {
    if (NProgress.isRendered()) return document.getElementById('nprogress'); addClass(document.documentElement, 'nprogress-busy'); const progress = document.createElement('div'); progress.id = 'nprogress'; progress.innerHTML = Settings.template; const bar = progress.querySelector(Settings.barSelector); const perc = fromStart ? '-100' : toBarPerc(NProgress.status || 0); const parent = document.querySelector(Settings.parent); let
      spinner; css(bar, { transition: 'all 0 linear', transform: `translate3d(${perc}%,0,0)` }); if (!Settings.showSpinner) { spinner = progress.querySelector(Settings.spinnerSelector); spinner && removeElement(spinner); }
    if (parent != document.body) { addClass(parent, 'nprogress-custom-parent'); }
    parent.appendChild(progress); return progress;
  }; NProgress.remove = function () { removeClass(document.documentElement, 'nprogress-busy'); removeClass(document.querySelector(Settings.parent), 'nprogress-custom-parent'); const progress = document.getElementById('nprogress'); progress && removeElement(progress); }; NProgress.isRendered = function () { return !!document.getElementById('nprogress'); }; NProgress.getPositioningCSS = function () { const bodyStyle = document.body.style; const vendorPrefix = ('WebkitTransform' in bodyStyle) ? 'Webkit' : ('MozTransform' in bodyStyle) ? 'Moz' : ('msTransform' in bodyStyle) ? 'ms' : ('OTransform' in bodyStyle) ? 'O' : ''; if (`${vendorPrefix}Perspective` in bodyStyle) { return 'translate3d'; } if (`${vendorPrefix}Transform` in bodyStyle) { return 'translate'; } return 'margin'; }; function clamp(n, min, max) { if (n < min) return min; if (n > max) return max; return n; }
  function toBarPerc(n) { return (-1 + n) * 100; }
  function barPositionCSS(n, speed, ease) {
    let barCSS; if (Settings.positionUsing === 'translate3d') { barCSS = { transform: `translate3d(${toBarPerc(n)}%,0,0)` }; } else if (Settings.positionUsing === 'translate') { barCSS = { transform: `translate(${toBarPerc(n)}%,0)` }; } else { barCSS = { 'margin-left': `${toBarPerc(n)}%` }; }
    barCSS.transition = `all ${speed}ms ${ease}`; return barCSS;
  }
  var queue = (function () {
    const pending = []; function next() { const fn = pending.shift(); if (fn) { fn(next); } }
    return function (fn) { pending.push(fn); if (pending.length == 1) next(); };
  }()); var css = (function () {
    const cssPrefixes = ['Webkit', 'O', 'Moz', 'ms']; const
      cssProps = {}; function camelCase(string) { return string.replace(/^-ms-/, 'ms-').replace(/-([\da-z])/gi, (match, letter) => letter.toUpperCase()); }
    function getVendorProp(name) {
      const style = document.body.style; if (name in style) return name; let i = cssPrefixes.length; const capName = name.charAt(0).toUpperCase() + name.slice(1); let
        vendorName; while (i--) { vendorName = cssPrefixes[i] + capName; if (vendorName in style) return vendorName; }
      return name;
    }
    function getStyleProp(name) { name = camelCase(name); return cssProps[name] || (cssProps[name] = getVendorProp(name)); }
    function applyCss(element, prop, value) { prop = getStyleProp(prop); element.style[prop] = value; }
    return function (element, properties) {
      const args = arguments; let prop; let
        value; if (args.length == 2) { for (prop in properties) { value = properties[prop]; if (value !== undefined && properties.hasOwnProperty(prop)) applyCss(element, prop, value); } } else { applyCss(element, args[1], args[2]); }
    };
  }()); function hasClass(element, name) { const list = typeof element === 'string' ? element : classList(element); return list.indexOf(` ${name} `) >= 0; }
  function addClass(element, name) {
    const oldList = classList(element); const
      newList = oldList + name; if (hasClass(oldList, name)) return; element.className = newList.substring(1);
  }
  function removeClass(element, name) {
    const oldList = classList(element); let
      newList; if (!hasClass(element, name)) return; newList = oldList.replace(` ${name} `, ' '); element.className = newList.substring(1, newList.length - 1);
  }
  function classList(element) { return (` ${element.className || ''} `).replace(/\s+/gi, ' '); }
  function removeElement(element) { element && element.parentNode && element.parentNode.removeChild(element); }
  return NProgress;
}));
