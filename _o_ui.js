// MiAppClean 应用原型 · 交互与 UI 层（编排 + 事件绑定）
// 路径: prototype/app/app.ui.js  v1.13.2
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
    var custom = document.getElementById("customPkgs");
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
        window.MiState.setMode(r.value);
        H().toggleUninstallWarn();
        H().generate();
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
    if (deselect) deselect.addEventListener("click", function () { H().deselectAll(); });
  }

  // 监听语言/主题变更广播
  function bindBroadcast() {
    window.addEventListener("miac:lang", function () { L().refreshLabels(); renderAndBind(); });
    window.addEventListener("miac:theme", function (e) {
      var theme = e.detail && e.detail.theme;
      if (theme) window.MiSettings.applyTheme(theme);
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
