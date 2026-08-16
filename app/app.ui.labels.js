// MiAppClean 文案刷新模块（i18n 切换 / 初始渲染时调用）
// 路径: app/app.ui.labels.js  v1.13.4
// 职责：纯 DOM 静态文案刷新，按当前语言重写所有 data-i18n 元素的文本。
// 拆分自 app.ui.js（refreshLabels 占比较高），使编排层保持精简（<200 行）。
// 依赖：window.MiI18n（I 取用）、window.MiState（风险筛选状态）、window.MiSettingsPanel（面板重建）。
(function () {
  "use strict";

  var I = function (k, l) { return window.MiI18n ? window.MiI18n.I(k, l) : k; };

  function setText(id, txt) {
    var el = document.getElementById(id);
    if (el) el.textContent = txt;
  }

  // 刷新所有静态文案
  function refreshLabels() {
    var lang = window.MiI18n ? window.MiI18n.getLang() : "zh-CN";

    // 顶栏
    setText("navPortal", I("nav.portal", lang));

    // Hero
    setText("heroTitle", I("hero.title", lang));
    setText("heroDesc", I("hero.desc", lang));

    // 步骤标题
    [1, 2, 3, 4, 5].forEach(function (n) {
      setText("stepTitle" + n, I("step." + n + ".title", lang));
    });

    // 设备类型
    document.querySelectorAll('input[name="device"]').forEach(function (r) {
      var lbl = r.parentElement;
      if (lbl && lbl.querySelector(".seg-label")) {
        lbl.querySelector(".seg-label").textContent = I("device." + r.value, lang);
      }
    });
    setText("deviceNote", I("device.note", lang));

    // 操作模式
    document.querySelectorAll('input[name="mode"]').forEach(function (r) {
      var lbl = r.parentElement;
      if (lbl && lbl.querySelector(".seg-label")) {
        lbl.querySelector(".seg-label").textContent = I("mode." + r.value, lang);
      }
    });

    // 风险图例筛选
    document.querySelectorAll(".risk-legend [data-filter]").forEach(function (b) {
      var key = b.dataset.filter === "all" ? "filter.all"
        : b.dataset.filter === "safe" ? "filter.safe"
        : b.dataset.filter === "caution" ? "filter.caution" : "filter.danger";
      b.textContent = I(key, lang);
      b.classList.toggle("active", b.dataset.filter === window.MiState.getRiskFilter());
    });

    // 搜索框占位
    var search = document.getElementById("search");
    if (search) search.placeholder = I("search.placeholder", lang);

    // 按钮
    setText("copyBtn", I("btn.copy", lang));
    setText("selectAllBtn", I("btn.selectAll", lang));
    setText("clearBtn", I("btn.clear", lang));
    setText("deselectBtn", I("btn.deselect", lang));

    // 自定义包名
    setText("customLabel", I("custom.label", lang));
    var custom = document.getElementById("customPkgs");
    if (custom) custom.placeholder = I("custom.placeholder", lang);

    // 卸载警告
    setText("uninstallWarnTitle", I("warn.uninstall.title", lang));
    setText("uninstallWarnDesc", I("warn.uninstall.desc", lang));

    // 风险须知
    setText("notice1", I("notice.1", lang));
    setText("notice2", I("notice.2", lang));
    setText("notice3", I("notice.3", lang));

    // 免责声明
    setText("legal", I("legal.disclaimer", lang));

    // 设置面板重建（同步语言）
    var panel = document.getElementById("settingsPanel");
    if (panel && panel.children.length && window.MiSettingsPanel) {
      window.MiSettingsPanel.buildPanel(panel);
    }
  }

  window.MiUiLabels = { refreshLabels: refreshLabels };
})();
