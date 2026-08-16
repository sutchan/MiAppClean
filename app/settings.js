// MiAppClean 设置与持久化模块
// 路径: prototype/app/settings.js  v1.13.3
// 职责：localStorage 持久化（主题 miac-theme / 默认模式 / 记忆勾选 / 复制提示），
// 提供 get/set* API 与外部抽屉开关绑定；面板 DOM 构建委托给 settings.panel.js。
// 与 design-system/spec.md「外观」要求对齐：三态主题 + miac-theme 键 + theme-color 同步。
(function () {
  "use strict";

  var THEME_KEY = "miac-theme";
  var DANGER_PATTERNS = ["system", "framework", "settings"];

  function isDanger(pkg) {
    var p = (pkg || "").toLowerCase();
    return DANGER_PATTERNS.some(function (kw) { return p.indexOf(kw) !== -1; });
  }

  // 读取已保存勾选（基于 package 全名映射）
  function loadChecked() {
    try {
      var raw = localStorage.getItem("miac-checked");
      if (!raw) return {};
      var obj = JSON.parse(raw);
      return obj && typeof obj === "object" ? obj : {};
    } catch (e) {
      return {};
    }
  }

  function saveChecked(map) {
    try {
      localStorage.setItem("miac-checked", JSON.stringify(map || {}));
    } catch (e) {}
  }

  // 默认设置
  var state = {
    theme: "light",
    mode: "disable",
    remember: false,
    toast: true
  };

  // 启动时从 localStorage 恢复（仅 theme 持久化，其余为会话默认但允许记忆）
  try {
    var t = localStorage.getItem(THEME_KEY);
    if (t === "light" || t === "dark" || t === "auto") state.theme = t;
  } catch (e) {}

  function get() {
    return {
      theme: state.theme,
      mode: state.mode,
      remember: state.remember,
      toast: state.toast
    };
  }

  function setTheme(theme) {
    state.theme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    applyTheme(theme);
    document.dispatchEvent(new CustomEvent("miac:theme", { detail: { theme: theme } }));
  }

  function setMode(mode) {
    state.mode = mode;
  }

  function setRemember(v) {
    state.remember = !!v;
    if (!state.remember) {
      try { localStorage.removeItem("miac-checked"); } catch (e) {}
    }
  }

  function setToast(v) {
    state.toast = !!v;
  }

  // 主题应用：三态 + 跟随系统 + 动态 theme-color（design-system/spec.md 要求）
  function applyTheme(theme) {
    var resolved = theme;
    if (theme === "auto") {
      resolved = window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.setAttribute("data-theme", resolved);
    document.documentElement.setAttribute("data-theme-choice", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", resolved === "dark" ? "#0d0d0d" : "#ffffff");
  }

  // 跟随系统变化时重应用 auto 主题
  if (window.matchMedia) {
    try {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
        if (state.theme === "auto") applyTheme("auto");
      });
    } catch (e) {}
  }

  // 抽屉开关绑定（点击 #settingsBtn 打开，#settingsClose / 遮罩关闭）
  function bindDrawer() {
    var btn = document.getElementById("settingsBtn");
    var drawer = document.getElementById("settingsDrawer");
    var close = document.getElementById("settingsClose");
    var overlay = document.getElementById("settingsOverlay");

    function openPanel() {
      if (!drawer) return;
      if (window.MiSettingsPanel) window.MiSettingsPanel.buildPanel(document.getElementById("settingsPanel"));
      drawer.classList.add("open");
      if (overlay) overlay.classList.add("show");
    }
    function closePanel() {
      if (drawer) drawer.classList.remove("open");
      if (overlay) overlay.classList.remove("show");
    }

    if (btn) btn.addEventListener("click", openPanel);
    if (close) close.addEventListener("click", closePanel);
    if (overlay) overlay.addEventListener("click", closePanel);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closePanel();
    });
  }

  window.MiSettings = {
    isDanger: isDanger,
    loadChecked: loadChecked,
    saveChecked: saveChecked,
    get: get,
    setTheme: setTheme,
    setMode: setMode,
    setRemember: setRemember,
    setToast: setToast,
    applyTheme: applyTheme,
    bindDrawer: bindDrawer
  };

  // 初始应用主题（不改变已存值，仅同步 DOM）
  applyTheme(state.theme);
})();
