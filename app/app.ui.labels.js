// MiAppClean 文案刷新模块（i18n 切换 / 初始渲染时调用）
// 路径: app/app.ui.labels.js  v1.15.1
// 职责：纯 DOM 静态文案刷新，按当前语言重写所有 data-i18n 元素的文本。
// 拆分自 app.ui.js（refreshLabels 占比较高），使编排层保持精简（<200 行）。
// 依赖：window.MiI18n（I 取用）、window.MiState（风险筛选状态）、window.MiSettingsPanel（面板重建）。
(function () {
  "use strict";

  var I = function (k, l) { return window.MiI18n ? window.MiI18n.I(k, l) : k; };

  // 刷新所有静态文案
  function refreshLabels() {
    var lang = window.MiI18n ? window.MiI18n.getLang() : "zh-CN";

    // 通用 data-i18n / data-i18n-placeholder 属性驱动刷新
    // 顶栏、Hero、步骤标题、设备/模式、须知、免责声明等均由 HTML 标注驱动，
    // 避免与不存在的 id 强耦合，保证 i18n 真正生效。
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      el.textContent = I(key, lang);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      el.setAttribute("placeholder", I(key, lang) || el.getAttribute("placeholder") || "");
    });

    // 设备类型（分段控件标签）
    document.querySelectorAll('input[name="device"]').forEach(function (r) {
      var lbl = r.parentElement;
      if (lbl && lbl.querySelector(".seg-label")) {
        lbl.querySelector(".seg-label").textContent = I("device." + r.value, lang);
      }
    });

    // 操作模式（分段控件标签）
    document.querySelectorAll('input[name="mode"]').forEach(function (r) {
      var lbl = r.parentElement;
      if (lbl && lbl.querySelector(".seg-label")) {
        lbl.querySelector(".seg-label").textContent = I("mode." + r.value, lang);
      }
    });

    // 风险图例筛选（同步文本 + 高亮态）
    var activeFilter = window.MiState ? window.MiState.getRiskFilter() : "all";
    document.querySelectorAll(".risk-legend [data-filter]").forEach(function (b) {
      var key = b.dataset.filter === "all" ? "filter.all"
        : b.dataset.filter === "safe" ? "filter.safe"
        : b.dataset.filter === "caution" ? "filter.caution" : "filter.danger";
      b.textContent = I(key, lang);
      b.classList.toggle("active", b.dataset.filter === activeFilter);
      if (b.hasAttribute("aria-pressed")) b.setAttribute("aria-pressed", String(b.dataset.filter === activeFilter));
    });

    // 自定义包名占位（textarea id 为 "custom"）
    var custom = document.getElementById("custom");
    if (custom) custom.setAttribute("placeholder", I("custom.placeholder", lang) || custom.getAttribute("placeholder") || "");

    // 设置面板重建（同步语言）
    var panel = document.getElementById("settingsPanel");
    if (panel && panel.children.length && window.MiSettingsPanel) {
      window.MiSettingsPanel.buildPanel(panel);
    }
  }

  window.MiUiLabels = { refreshLabels: refreshLabels };
})();
