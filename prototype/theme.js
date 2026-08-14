// MiAppClean 原型主题切换（深浅色 + 跟随系统）
// 路径: prototype/theme.js  v1.6.13
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

  // 注入三态切换控件（浅色 / 深色 / 跟随系统）
  function injectToggle() {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";
    btn.setAttribute("aria-label", "切换深浅色主题");
    btn.setAttribute("aria-haspopup", "true");

    var labels = { light: "☀ 浅色", dark: "🌙 深色", auto: "🖥 跟随" };
    function current() {
      try { return localStorage.getItem(STORE_KEY) || "auto"; } catch (e) { return "auto"; }
    }
    function render() {
      var c = current();
      btn.textContent = labels[c];
      btn.setAttribute("aria-pressed", c === "dark" ? "true" : "false");
      btn.title = "当前：" + labels[c] + "（点击循环切换）";
    }

    var order = ["light", "dark", "auto"];
    btn.addEventListener("click", function () {
      var c = current();
      var next = order[(order.indexOf(c) + 1) % order.length];
      try { localStorage.setItem(STORE_KEY, next); } catch (e) {}
      apply(next);
      render();
      // 通知同页其它模块（如已渲染的图表）主题已变
      window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: next } }));
    });

    render();

    // 挂载：优先挂在 .topbar 右侧，否则挂到 body 右上角固定
    var bar = document.querySelector(".topbar");
    if (bar) {
      bar.appendChild(btn);
    } else {
      btn.style.position = "fixed";
      btn.style.top = "var(--sp-4)";
      btn.style.right = "var(--sp-4)";
      btn.style.zIndex = "var(--z-toast)";
      document.body.appendChild(btn);
    }

    // 切换控件样式（引用设计令牌，零外部依赖）
    var style = document.createElement("style");
    style.textContent =
      ".theme-toggle{" +
      "display:inline-flex;align-items:center;gap:6px;" +
      "font:500 var(--fs-sm)/1 var(--font-sans);color:var(--color-text);" +
      "background:var(--color-surface);border:1px solid var(--color-border);" +
      "border-radius:var(--radius-full);padding:6px 12px;cursor:pointer;" +
      "transition:border-color var(--dur-base) var(--ease-standard),background var(--dur-base) var(--ease-standard);" +
      "white-space:nowrap}" +
      ".theme-toggle:hover{border-color:var(--color-primary-border);background:var(--color-surface-2)}" +
      ".theme-toggle:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}";
    document.head.appendChild(style);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectToggle);
  } else {
    injectToggle();
  }
})();
