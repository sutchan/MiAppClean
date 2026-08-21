// MiAppClean 设置面板 UI 构建
// 路径: app/settings.panel.js  v1.15.4
// 职责：纯 DOM 构建与事件绑定（构建设置抽屉内的主题/模式/记忆/提示/语言控件）。
// 数据读写委托给 settings.js（window.MiSettings），文案取用 MiI18n.I。
// 拆分自 settings.js，使「存储逻辑」与「面板 UI」各自独立，主文件 <200 行。
(function () {
  "use strict";

  var I = function (k, l) { return window.MiI18n ? window.MiI18n.I(k, l) : k; };
  var S = function () { return window.MiSettings; };

  // 模式变更后刷新设置面板高亮（如从主界面或确认弹窗改变模式）。
  // 用模块级引用保存 handler，便于在每次 buildPanel 前注销旧监听，避免重复绑定。
  var onModeChange = null;

  // 构建设置面板内部控件（每次打开时调用，保证状态最新）
  function buildPanel(panel) {
    if (!panel) return;
    var s = S();
    var lang = window.MiI18n ? window.MiI18n.getLang() : "zh-CN";
    // cur.mode 以主界面实际选中态为准（MiState.getModeSafe 读 DOM 分段控件）
    var cur = s.get();
    cur.mode = window.MiState ? window.MiState.getModeSafe() : cur.mode;

    panel.innerHTML = "";
    // 重建前注销旧模式监听，避免每次打开叠加重复绑定
    if (onModeChange) document.removeEventListener("miac:mode-change", onModeChange);

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

    // 模式切换：复用主界面 mode 分段控件的 change 逻辑（含卸载二次确认），
    // 而非仅更新内存态。直接触发对应 radio 的 click，确保确认弹窗与主界面
    // 选中态一致，避免从设置面板绕过确认进入高危卸载模式。
    var mainRadios = document.querySelectorAll('input[name="mode"]');
    modeRow.querySelectorAll("button[data-mode]").forEach(function (b) {
      b.classList.toggle("active", b.dataset.mode === cur.mode);
      b.addEventListener("click", function () {
        var radio = document.querySelector('input[name="mode"][value="' + b.dataset.mode + '"]');
        if (radio && !radio.checked) {
          radio.click(); // 触发 bindSegment 的 change/确认逻辑
        } else {
          modeRow.querySelectorAll("button").forEach(function (x) {
            x.classList.toggle("active", x === b);
          });
        }
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

    // 恢复默认设置
    var resetRow = document.createElement("div");
    resetRow.className = "settings-row settings-row-actions";
    resetRow.innerHTML =
      '<label>' + I("settings.reset", lang) + "</label>" +
      '<button type="button" class="btn btn-ghost" data-action="reset">' + I("btn.reset", lang) + "</button>";
    panel.appendChild(resetRow);
    resetRow.querySelector('button[data-action="reset"]').addEventListener("click", function () {
      if (window.confirm && !window.confirm(I("confirm.reset", lang))) return;
      s.resetAll();
      buildPanel(panel);
      if (window.__miacSyncTopbar) window.__miacSyncTopbar();
      if (window.MiUiLabels) window.MiUiLabels.refreshLabels();
    });
  }

  // 模式变更后同步设置面板高亮（如主界面切换或卸载确认取消回退）
  onModeChange = function () {
    if (!panel) return;
    var curMode = window.MiState ? window.MiState.getModeSafe() : "disable";
    panel.querySelectorAll("button[data-mode]").forEach(function (b) {
      b.classList.toggle("active", b.dataset.mode === curMode);
    });
  };
  document.addEventListener("miac:mode-change", onModeChange);

  window.MiSettingsPanel = { buildPanel: buildPanel };
})();
