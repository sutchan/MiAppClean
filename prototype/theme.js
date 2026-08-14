// MiAppClean 原型主题切换（深浅色 + 跟随系统）
// 路径: prototype/theme.js  v1.7.1
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

  // 主题切换入口统一收归「设置 → 外观主题」（见 settings.js），
  // 不再在顶栏注入独立切换按钮，避免与设置项重复。
})();
