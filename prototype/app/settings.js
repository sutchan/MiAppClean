// MiAppClean 设置模块（主题 / 默认模式 / 勾选记忆 / 提示开关）
// 路径: prototype/app/settings.js  v1.10.0
// 单一数据源：视觉令牌见 ../design-system/tokens.css；主题持久化复用 theme.js 的 STORE_KEY。
// 用法：先于 app.js 引入；对外暴露 window.MiSettings。
(function () {
  "use strict";

  var THEME_KEY = "miac-theme";      // 与 theme.js 保持一致的键，复用其切换逻辑
  var MODE_KEY = "miac-default-mode";
  var MEM_KEY = "miac-remember-checks";
  var TOAST_KEY = "miac-copy-toast";
  var CHECKED_KEY = "miac-checked-pkgs";
  var LANG_KEY = "miac-lang";        // 界面语言：zh-CN | en-US（与 i18n.js 共享）

  function read(key, fallback) {
    try {
      var v = localStorage.getItem(key);
      return v === null ? fallback : v;
    } catch (e) { return fallback; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, val); } catch (e) {}
  }

  var DEFAULTS = {
    mode: "disable",     // 默认操作模式：disable | uninstall
    remember: "on",      // 记忆上次勾选：on | off
    toast: "on",         // 复制成功后提示：on | off
    lang: "zh-CN"        // 界面语言：zh-CN | en-US
  };

  function get(key) {
    if (key === "theme") return read(THEME_KEY, "auto");
    if (key === "mode") return read(MODE_KEY, DEFAULTS.mode);
    if (key === "remember") return read(MEM_KEY, DEFAULTS.remember);
    if (key === "toast") return read(TOAST_KEY, DEFAULTS.toast);
    if (key === "lang") return read(LANG_KEY, "zh-CN");
    return undefined;
  }
  function set(key, val) {
    if (key === "theme") write(THEME_KEY, val);
    else if (key === "mode") write(MODE_KEY, val);
    else if (key === "remember") write(MEM_KEY, val);
    else if (key === "toast") write(TOAST_KEY, val);
    else if (key === "lang") write(LANG_KEY, val);
  }

  // 记忆勾选集合（仅在 remember=on 时生效）
  function loadChecked() {
    if (get("remember") !== "on") return [];
    try {
      var raw = localStorage.getItem(CHECKED_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }
  function saveChecked(arr) {
    if (get("remember") !== "on") return;
    try { localStorage.setItem(CHECKED_KEY, JSON.stringify(arr)); } catch (e) {}
  }

  var panelEl = null;

  function buildPanel() {
    var overlay = document.createElement("div");
    overlay.className = "settings-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "设置");

    var panel = document.createElement("div");
    panel.className = "settings-panel";

    panel.innerHTML =
      '<div class="settings-head">' +
        '<h3>设置</h3>' +
        '<button type="button" class="icon-btn settings-close" aria-label="关闭设置">✕</button>' +
      '</div>' +
      '<div class="settings-body">' +
        '<label class="settings-row">' +
          '<span class="settings-label">外观主题</span>' +
          '<select id="setTheme" class="select">' +
            '<option value="light">浅色</option>' +
            '<option value="dark">深色</option>' +
            '<option value="auto">跟随系统</option>' +
          '</select>' +
        '</label>' +
        '<label class="settings-row">' +
          '<span class="settings-label">默认操作模式</span>' +
          '<select id="setMode" class="select">' +
            '<option value="disable">禁用（推荐·可恢复）</option>' +
            '<option value="uninstall">卸载（移除·谨慎）</option>' +
          '</select>' +
        '</label>' +
        '<label class="settings-row settings-switch">' +
          '<span class="settings-label">记忆上次勾选</span>' +
          '<input id="setRemember" type="checkbox" />' +
        '</label>' +
        '<label class="settings-row settings-switch">' +
          '<span class="settings-label">复制成功后提示</span>' +
          '<input id="setToast" type="checkbox" />' +
        '</label>' +
        '<label class="settings-row">' +
          '<span class="settings-label" data-i18n="settings.lang">界面语言</span>' +
          '<select id="setLang" class="select">' +
            '<option value="zh-CN">简体中文</option>' +
            '<option value="en-US">English</option>' +
          '</select>' +
        '</label>' +
      '</div>';

    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    panelEl = overlay;

    // 初始值回填
    panel.querySelector("#setTheme").value = get("theme");
    panel.querySelector("#setMode").value = get("mode");
    panel.querySelector("#setRemember").checked = get("remember") === "on";
    panel.querySelector("#setToast").checked = get("toast") === "on";

    // 事件：主题切换（双入口——设置面板下拉 + 顶栏主题按钮共享 miac-theme 持久化键）
    panel.querySelector("#setTheme").addEventListener("change", function (e) {
      set("theme", e.target.value);
      // 写入持久化键（与 theme.js 共享），并直接施加到 <html> 立即生效
      var root = document.documentElement;
      if (e.target.value === "auto") root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", e.target.value);
      window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: e.target.value } }));
    });
    // 顶栏主题按钮（cycleTheme）或系统偏好变化后，同步回填下拉，避免两处状态不一致
    window.addEventListener("themechange", function (e) {
      var next = (e && e.detail && e.detail.theme) || read(THEME_KEY, "auto");
      var sel = panel.querySelector("#setTheme");
      if (sel) sel.value = next;
    });
    panel.querySelector("#setMode").addEventListener("change", function (e) {
      set("mode", e.target.value);
      window.dispatchEvent(new CustomEvent("settingchange", { detail: { mode: e.target.value } }));
    });
    panel.querySelector("#setRemember").addEventListener("change", function (e) {
      set("remember", e.target.checked ? "on" : "off");
      if (!e.target.checked) { try { localStorage.removeItem(CHECKED_KEY); } catch (err) {} }
      window.dispatchEvent(new CustomEvent("settingchange", { detail: { remember: get("remember") } }));
    });
    panel.querySelector("#setToast").addEventListener("change", function (e) {
      set("toast", e.target.checked ? "on" : "off");
    });

    function close() { closePanel(); }
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    panel.querySelector(".settings-close").addEventListener("click", close);
    document.addEventListener("keydown", function onEsc(e) {
      if (e.key === "Escape" && panelEl) { close(); document.removeEventListener("keydown", onEsc); }
    });
  }

  function openPanel() {
    if (!panelEl) buildPanel();
    panelEl.classList.add("open");
    var btn = document.getElementById("settingsBtn");
    if (btn) btn.setAttribute("aria-expanded", "true");
  }
  function closePanel() {
    if (panelEl) panelEl.classList.remove("open");
    var btn = document.getElementById("settingsBtn");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  // 绑定设置按钮（根页或原型页均可能存在 #settingsBtn）
  function bindBtn() {
    var btn = document.getElementById("settingsBtn");
    if (btn) btn.addEventListener("click", openPanel);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindBtn);
  } else {
    bindBtn();
  }

  window.MiSettings = {
    get: get,
    set: set,
    loadChecked: loadChecked,
    saveChecked: saveChecked,
    openPanel: openPanel,
    closePanel: closePanel
  };
})();
