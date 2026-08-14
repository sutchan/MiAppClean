// MiAppClean 原型主题切换（深浅色 + 跟随系统）
// 路径: prototype/theme.js  v1.8.1
// 单一数据源：视觉令牌见 prototype/design-system/tokens.css
// 用法：在 <head> 末尾引入 <script src="theme.js"></script>（根页）或 "../theme.js"（子页）。
// 为避免首屏闪烁，脚本同步执行，优先读取 localStorage 持久化的主题。
(function () {
  "use strict";

  var STORE_KEY = "miac-theme"; // 取值：light | dark | auto
  var root = document.documentElement;

  function systemPrefersDark() {
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  // 根据存储值解析应施加到 <html> 的 data-theme
  function resolve(theme) {
    if (theme === "light") return "light";
    if (theme === "dark") return "dark";
    // auto：不写死 data-theme，交由 CSS 媒体查询跟随系统
    return null;
  }

  function apply(theme) {
    var resolved = resolve(theme);
    if (resolved === null) {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", resolved);
    }
  }

  // 首屏立即应用，避免闪烁
  var stored = (function () {
    try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; }
  })();
  apply(stored || "auto");

  // 仅 auto 模式下监听系统偏好变化
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var onChange = function () {
      var t = (function () {
        try { return localStorage.getItem(STORE_KEY); } catch (e) { return "auto"; }
      })();
      if (t === "auto" || !t) apply("auto");
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange); // 旧浏览器回退
  }

  // 顶栏「主题」按钮：三态循环 浅色 → 深色 → 跟随系统 → …
  function cycleTheme() {
    var cur = (function () {
      try { return localStorage.getItem(STORE_KEY); } catch (e) { return "auto"; }
    })();
    var order = ["light", "dark", "auto"];
    var next = order[(order.indexOf(cur) + 1) % order.length] || "auto";
    try { localStorage.setItem(STORE_KEY, next); } catch (e) {}
    apply(next);
    // 通知设置面板同步下拉（若存在）
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: next } }));
  }

  // 对外暴露：供应用原型顶栏按钮调用，并供设置面板同步
  window.cycleTheme = cycleTheme;
  window.applyTheme = apply;
})();
