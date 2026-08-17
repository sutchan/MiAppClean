// MiAppClean 原型主题切换（深浅色 + 跟随系统）
// 路径: prototype/theme.js  v1.14.1
// 单一数据源：视觉令牌见 prototype/design-system/tokens.css
// 用法：在 <head> 末尾引入 <script src="theme.js"></script>（根页）或 "../theme.js"（子页）。
// 为避免首屏闪烁，脚本同步执行，优先读取 localStorage 持久化的主题。
(function () {
  "use strict";

  var STORE_KEY = "miac-theme"; // 取值：light | dark | auto
  var root = document.documentElement;

  // 各主题下的浏览器 UI 主题色（与 design-system/tokens.css 品牌色/背景对齐）：
  // 浅色用品牌橙，深色用深背景，保证地址栏/状态栏与页面视觉一致。
  var THEME_COLOR = { light: "#ff6900", dark: "#15171a" };

  // 同步 <meta name="theme-color">，使移动端状态栏/地址栏随主题变化
  function syncMetaTheme(resolved) {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    var isDark = resolved === "dark" ||
      (resolved === null && window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    meta.setAttribute("content", isDark ? THEME_COLOR.dark : THEME_COLOR.light);
  }

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
    syncMetaTheme(resolved);
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

  // 自动注入浮动主题按钮：所有引入本脚本的页面（门户 / 设计系统 / 组件库 / 交互）
  // 均获得主题切换入口，避免「文档声明三态控件」与「实际无入口」的不一致。
  // 应用原型 app 已在顶栏自带 #themeBtn，此处检测到则不重复注入。
  function injectThemeFab() {
    if (document.getElementById("themeBtn")) return; // 顶栏已提供入口
    var fab = document.createElement("button");
    fab.type = "button";
    fab.className = "theme-fab";
    fab.id = "themeBtn";
    fab.setAttribute("aria-label", "切换主题（浅色/深色/跟随系统）");
    fab.title = "切换主题";
    fab.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 13.5A8 8 0 0 1 10.5 4 8 8 0 1 0 20 13.5Z"/></svg>';
    fab.addEventListener("click", cycleTheme);
    document.body.appendChild(fab);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectThemeFab);
  } else {
    injectThemeFab();
  }
})();
