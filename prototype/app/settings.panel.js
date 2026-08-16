// MiAppClean 设置面板 UI 构建
// 路径: prototype/app/settings.panel.js  v1.13.2
// 职责：纯 DOM 构建与事件绑定（构建设置抽屉内的主题/模式/记忆/提示/语言控件）。
// 数据读写委托给 settings.js（window.MiSettings），文案取用 MiI18n.I。
// 拆分自 settings.js，使「存储逻辑」与「面板 UI」各自独立，主文件 <200 行。
(function () {
  "use strict";

  var I = function (k, l) { return window.MiI18n ? window.MiI18n.I(k, l) : k; };
  var S = function () { return window.MiSettings; };

  // 构建设置面板内部控件（每次打开时调用，保证状态最新）
  function buildPanel(panel) {
    if (!panel) return;
    var s = S();
    var lang = window.MiI18n ? window.MiI18n.getLang() : "zh-CN";
    var cur = s.get();

    panel.innerHTML = "";

    // 外观主题
    var themeRow = document.createElement("div");
    themeRow.className = "settings-row";
    themeRow.innerHTML =
      '<label>' + I("settings.theme", lang) + "</label>" +
      '<div class="seg" role="group" aria-label="theme">' +
      '<button data-theme="light" type="button">' + I("opt.theme.light", lang) + "</button>" +
      '<button data-theme="dark" type="button">' + I("opt.theme.dark", lang) + "</button>" +
      '<button data-theme="auto" type="button">' + I("opt.theme.auto", lang) + "</button>" +
      "</div>";
    panel.appendChild(themeRow);

    // 默认操作模式
    var modeRow = document.createElement("div");
    modeRow.className = "settings-row";
    modeRow.innerHTML =
      '<label>' + I("settings.mode", lang) + "</label>" +
      '<div class="seg" role="group" aria-label="mode">' +
      '<button data-mode="disable" type="button">' + I("mode.disable", lang) + "</button>" +
      '<button data-mode="uninstall" type="button">' + I("mode.uninstall", lang) + "</button>" +
      "</div>";
    panel.appendChild(modeRow);

    // 记忆上次勾选
    var rememberRow = document.createElement("div");
    rememberRow.className = "settings-row";
    rememberRow.innerHTML =
      '<label>' + I("settings.remember", lang) + "</label>" +
      '<input type="checkbox" data-key="remember" ' + (cur.remember ? "checked" : "") + " />";
    panel.appendChild(rememberRow);

    // 复制提示
    var toastRow = document.createElement("div");
    toastRow.className = "settings-row";
    toastRow.innerHTML =
      '<label>' + I("settings.toast", lang) + "</label>" +
      '<input type="checkbox" data-key="toast" ' + (cur.toast ? "checked" : "") + " />";
    panel.appendChild(toastRow);

    // 界面语言
    var langRow = document.createElement("div");
    langRow.className = "settings-row";
    langRow.innerHTML =
      '<label>' + I("settings.lang", lang) + "</label>" +
      '<div class="seg" role="group" aria-label="lang">' +
      '<button data-lang="zh-CN" type="button">' + I("opt.lang.zh", lang) + "</button>" +
      '<button data-lang="en-US" type="button">' + I("opt.lang.en", lang) + "</button>" +
      "</div>";
    panel.appendChild(langRow);

    // 主题切换
    themeRow.querySelectorAll("button[data-theme]").forEach(function (b) {
      b.classList.toggle("active", b.dataset.theme === cur.theme);
      b.addEventListener("click", function () {
        s.setTheme(b.dataset.theme);
        themeRow.querySelectorAll("button").forEach(function (x) {
          x.classList.toggle("active", x === b);
        });
      });
    });

    // 模式切换
    modeRow.querySelectorAll("button[data-mode]").forEach(function (b) {
      b.classList.toggle("active", b.dataset.mode === cur.mode);
      b.addEventListener("click", function () {
        s.setMode(b.dataset.mode);
        modeRow.querySelectorAll("button").forEach(function (x) {
          x.classList.toggle("active", x === b);
        });
      });
    });

    // 记忆勾选
    rememberRow.querySelector('input[data-key="remember"]').addEventListener("change", function (e) {
      s.setRemember(e.target.checked);
    });

    // 复制提示
    toastRow.querySelector('input[data-key="toast"]').addEventListener("change", function (e) {
      s.setToast(e.target.checked);
    });

    // 语言切换
    langRow.querySelectorAll("button[data-lang]").forEach(function (b) {
      b.classList.toggle("active", b.dataset.lang === lang);
      b.addEventListener("click", function () {
        if (window.MiI18n) window.MiI18n.setLang(b.dataset.lang);
      });
    });
  }

  window.MiSettingsPanel = { buildPanel: buildPanel };
})();
