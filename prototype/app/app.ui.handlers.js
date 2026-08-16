// MiAppClean 交互处理函数（纯行为，无事件绑定）
// 路径: prototype/app/app.ui.handlers.js  v1.13.2
// 职责：将 app.ui.js 中的交互处理函数抽离为纯模块，便于复用与测试。
// 依赖：window.MiState / MiRender / MiGen / MiSettings / MiI18n / MiShare。
// app.ui.js 仅负责 init 编排与 DOM 事件绑定，调用本模块的 exported handlers。
(function () {
  "use strict";

  var I = function (k, l) { return window.MiI18n ? window.MiI18n.I(k, l) : k; };

  // 轻量 toast（受 settings.toast 开关控制）
  function toast(msg) {
    if (!window.MiSettings || !window.MiSettings.get().toast) return;
    var el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () {
      el.classList.remove("show");
    }, 1800);
  }

  // 风险筛选切换（灯具段控）
  function setRiskFilter(filter) {
    var state = window.MiState;
    state.setRiskFilter(filter);
    document.querySelectorAll(".risk-legend [data-filter]").forEach(function (b) {
      b.classList.toggle("active", b.dataset.filter === filter);
    });
    var list = document.getElementById("catList");
    if (list && window.MiRender) window.MiRender.render(list, state.getDevice(), state.getRiskFilter());
    syncStat();
  }

  // 刷新统计
  function syncStat() {
    var state = window.MiState;
    var stat = document.getElementById("stat");
    if (stat) stat.textContent = I("stat.selected", null) + "：" + state.getChecked().size;
  }

  // 生成命令：合并内置勾选 + 自定义包名，按模式生成
  function generate() {
    var state = window.MiState;
    var gen = window.MiGen;
    if (!gen) return "";
    var selected = Array.from(state.getChecked());
    var customRaw = document.getElementById("customPkgs");
    var customLines = customRaw ? customRaw.value.split("\n") : [];
    var custom = [];
    customLines.forEach(function (line) {
      var pkg = line.trim();
      if (!pkg || pkg.startsWith("#")) return;
      custom.push(pkg);
    });
    var mode = state.getModeSafe();
    var out = gen.generate(selected, custom, mode);
    var box = document.getElementById("output");
    if (box) box.value = out;
    return out;
  }

  // 复制全部：降级方案 clipboard → textarea 选区
  function copyAll() {
    var state = window.MiState;
    var box = document.getElementById("output");
    if (!box) return Promise.resolve();
    var text = box.value;
    if (!text.trim()) {
      toast(I("toast.nothing", null));
      return Promise.resolve();
    }
    // 高危拦截：包含 uninstall 危险包时二次确认
    if (text.indexOf("uninstall") !== -1 && state.hasDangerSelected()) {
      if (!window.confirm(I("confirm.uninstallCopy", null))) {
        toast(I("toast.cancelDanger", null));
        return Promise.resolve();
      }
    }
    var share = window.MiShare ? window.MiShare.buildShareText(text) : "";
    var payload = share ? text + "\n\n" + share : text;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(payload).then(function () {
        toast(share ? I("toast.copiedShare", null) : I("toast.copied", null));
      }).catch(function () {
        fallbackCopy(box, payload);
      });
    }
    fallbackCopy(box, payload);
    return Promise.resolve();
  }

  function fallbackCopy(box, payload) {
    box.removeAttribute("readonly");
    box.value = payload;
    box.focus();
    box.select();
    try { document.execCommand("copy"); } catch (e) {}
    box.setAttribute("readonly", "");
    toast(I("toast.copyFallback", null));
  }

  // 全选推荐（排除 danger）
  function selectAll() {
    var state = window.MiState;
    state.selectAllRecommended();
    var list = document.getElementById("catList");
    if (list && window.MiRender) window.MiRender.render(list, state.getDevice(), state.getRiskFilter());
    syncStat();
    toast(I("toast.selectAll", null));
  }

  // 清空勾选
  function clearAll() {
    var state = window.MiState;
    state.clearChecked();
    var list = document.getElementById("catList");
    if (list && window.MiRender) window.MiRender.render(list, state.getDevice(), state.getRiskFilter());
    syncStat();
    toast(I("toast.deselect", null));
  }

  // 取消全选（兼容别名）
  function deselectAll() {
    clearAll();
  }

  // 卸载警告条切换（mode=uninstall 时显示）
  function toggleUninstallWarn() {
    var state = window.MiState;
    var warn = document.getElementById("uninstallWarn");
    if (warn) warn.style.display = state.getModeSafe() === "uninstall" ? "block" : "none";
  }

  window.MiUiHandlers = {
    toast: toast,
    setRiskFilter: setRiskFilter,
    syncStat: syncStat,
    generate: generate,
    copyAll: copyAll,
    selectAll: selectAll,
    clearAll: clearAll,
    deselectAll: deselectAll,
    toggleUninstallWarn: toggleUninstallWarn
  };
})();
