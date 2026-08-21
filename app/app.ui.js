// MiAppClean 应用原型 · 交互与 UI 层（编排 + 事件绑定）
// 路径: app/app.ui.js  v1.15.4
// 职责：初始化装配、DOM 事件绑定、语言/主题刷新编排。
// 文案刷新委托 MiUiLabels，交互处理委托 MiUiHandlers，二者均独立成模块。
// 依赖顺序：apk-data → generate → render → settings → i18n → app.state → app.share → app.ui
(function () {
  "use strict";

  var H = function () { return window.MiUiHandlers; };
  var L = function () { return window.MiUiLabels; };

  // 渲染分类列表并绑定复选框
  function renderAndBind() {
    var state = window.MiState;
    var list = document.getElementById("catList");
    if (list && window.MiRender) {
      window.MiRender.render(list, state.getDevice(), state.getRiskFilter());
    }
    bindCheckboxChanges();
    H().syncStat();
  }

  // 复选框变更 → 同步状态 + 重新生成命令（事件委托）
  function bindCheckboxChanges() {
    var list = document.getElementById("catList");
    if (!list) return;
    list.addEventListener("change", function (e) {
      var cb = e.target;
      if (!cb.classList || !cb.classList.contains("pkg-check")) return;
      var state = window.MiState;
      if (cb.checked) state.check(cb.value); else state.uncheck(cb.value);
      H().generate();
      H().syncStat();
    });
  }

  // 自定义包名变化时重新生成
  function bindCustom() {
    var custom = document.getElementById("custom");
    if (custom) custom.addEventListener("input", function () { H().generate(); });
  }

  // 设备/模式切换
  function bindSegment() {
    document.querySelectorAll('input[name="device"]').forEach(function (r) {
      r.addEventListener("change", function () {
        if (!r.checked) return;
        window.MiState.setDevice(r.value);
        renderAndBind();
        H().generate();
      });
    });
    document.querySelectorAll('input[name="mode"]').forEach(function (r) {
      r.addEventListener("change", function () {
        if (!r.checked) return;
        if (r.value === "uninstall") {
          // 切换到卸载模式：弹窗二次确认。确认后保持卸载模式并刷新；
          // 取消则回退到「禁用」模式，避免未经确认就停留在高危模式。
          var prevValue = window.MiState.getModeSafe();
          H().confirmUninstallWarn(function () {
            window.MiState.setMode("uninstall");
            H().toggleUninstallWarn();
            H().generate();
          }, function () {
            // 取消：回退到之前的模式（通常为禁用）
            window.MiState.setMode(prevValue === "uninstall" ? "disable" : prevValue);
            var prevRadio = document.querySelector('input[name="mode"][value="' +
              (prevValue === "uninstall" ? "disable" : prevValue) + '"]');
            if (prevRadio) prevRadio.checked = true;
            H().toggleUninstallWarn();
          });
        } else {
          window.MiState.setMode(r.value);
          H().toggleUninstallWarn();
          H().generate();
          document.dispatchEvent(new CustomEvent("miac:mode-change", { detail: {} }));
        }
      });
    });
  }

  // 风险筛选灯具
  function bindRiskLegend() {
    document.querySelectorAll(".risk-legend [data-filter]").forEach(function (b) {
      b.addEventListener("click", function () { H().setRiskFilter(b.dataset.filter); });
    });
  }

  // 搜索
  function bindSearch() {
    var search = document.getElementById("search");
    if (search) search.addEventListener("input", function () {
      window.MiState.setSearch(search.value);
      renderAndBind();
    });
  }

  // 工具栏按钮
  function bindToolbar() {
    var copy = document.getElementById("copyBtn");
    if (copy) copy.addEventListener("click", function () { H().copyAll(); });
    var selectAll = document.getElementById("selectAllBtn");
    if (selectAll) selectAll.addEventListener("click", function () { H().selectAll(); });
    var clear = document.getElementById("clearBtn");
    if (clear) clear.addEventListener("click", function () { H().clearAll(); });
    var deselect = document.getElementById("deselectBtn");
    if (deselect) deselect.addEventListener("click", function () { H().clearAll(); });
  }

  // 顶栏语言 / 主题快捷按钮（修复此前未绑定导致失效）
  function bindTopbar() {
    var langBtn = document.getElementById("langBtn");
    var themeBtn = document.getElementById("themeBtn");

    function syncLangBtn() {
      if (!langBtn) return;
      var lang = window.MiI18n ? window.MiI18n.getLang() : "zh-CN";
      langBtn.textContent = lang === "zh-CN" ? "EN" : "中";
      langBtn.setAttribute("aria-label", lang === "zh-CN" ? "切换到英文界面" : "切换到中文界面");
    }
    function syncThemeBtn() {
      if (!themeBtn) return;
      var theme = window.MiSettings ? window.MiSettings.get().theme : "light";
      var label = theme === "dark" ? "深色" : theme === "auto" ? "跟随系统" : "浅色";
      themeBtn.setAttribute("aria-label", "当前主题：" + label + "（点击切换）");
      themeBtn.setAttribute("title", "主题：" + label);
      themeBtn.dataset.theme = theme;
    }

    if (langBtn) langBtn.addEventListener("click", function () {
      if (window.MiI18n) window.MiI18n.toggleLang();
    });
    if (themeBtn) themeBtn.addEventListener("click", function () {
      var cur = window.MiSettings ? window.MiSettings.get().theme : "light";
      var next = cur === "light" ? "dark" : cur === "dark" ? "auto" : "light";
      if (window.MiSettings) window.MiSettings.setTheme(next);
    });

    syncLangBtn();
    syncThemeBtn();
    window.__miacSyncTopbar = function () { syncLangBtn(); syncThemeBtn(); };
  }

  // 监听语言/主题变更广播
  function bindBroadcast() {
    window.addEventListener("miac:lang", function () {
      L().refreshLabels();
      renderAndBind();
      if (window.__miacSyncTopbar) window.__miacSyncTopbar();
    });
    window.addEventListener("miac:theme", function (e) {
      var theme = e.detail && e.detail.theme;
      if (theme) window.MiSettings.applyTheme(theme);
      if (window.__miacSyncTopbar) window.__miacSyncTopbar();
    });
    window.addEventListener("miac:reset", function () {
      renderAndBind();
      if (H()) H().generate();
    });
  }

  function init() {
    if (window.MiSettings) window.MiSettings.bindDrawer();
    if (L()) L().refreshLabels();
    renderAndBind();
    bindSegment();
    bindRiskLegend();
    bindSearch();
    bindCustom();
    bindToolbar();
    bindTopbar();
    bindBroadcast();
    H().toggleUninstallWarn();
    H().generate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
