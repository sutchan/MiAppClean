// MiAppClean 交互处理函数（纯行为，无事件绑定）
// 路径: app/app.ui.handlers.js  v1.15.0
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
    if (stat) stat.textContent = I("stat.selected", null) + "：" + state.getChecked().length;
  }

  // 生成命令：合并内置勾选 + 自定义包名，按模式生成
  function generate() {
    var state = window.MiState;
    var gen = window.MiGen;
    if (!gen) return "";
    var selected = Array.from(state.getChecked());
    // 注意：自定义包名 textarea 的 DOM id 为 "custom"（见 index.html），
    // generate() 内部会自动解析它，此处仅传入勾选项与模式。
    var mode = state.getModeSafe();
    // generate 内部直接写入 #output / #stat，返回生成的命令文本
    var out = gen.generate(selected, null, mode);
    return out;
  }

  // 复制全部：降级方案 clipboard → textarea 选区
  function copyAll() {
    var state = window.MiState;
    var box = document.getElementById("output");
    if (!box) return Promise.resolve();
    // #output 为 <pre> 元素，命令文本存于 textContent
    var text = box.textContent || "";
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
    // buildShareText 在命令后附加分享文案，返回完整可复制内容
    var payload = window.MiShare ? window.MiShare.buildShareText(text) : text;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(payload).then(function () {
        toast(window.MiShare ? I("toast.copiedShare", null) : I("toast.copied", null));
      }).catch(function () {
        fallbackCopy(box, payload);
      });
    }
    fallbackCopy(box, payload);
    return Promise.resolve();
  }

  function fallbackCopy(box, payload) {
    // #output 为只读 <pre>，降级复制通过临时读写 textContent + 选区实现
    var prev = box.textContent;
    box.textContent = payload;
    var range = document.createRange();
    range.selectNodeContents(box);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    try { document.execCommand("copy"); } catch (e) {}
    box.textContent = prev;
    sel.removeAllRanges();
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

  // 卸载模式常驻警告条切换（mode=uninstall 时显示 #uninstallBanner 内联条）
  function toggleUninstallWarn() {
    var state = window.MiState;
    var banner = document.getElementById("uninstallBanner");
    if (!banner) return;
    var show = state.getModeSafe() === "uninstall";
    if (show) banner.removeAttribute("hidden");
    else banner.setAttribute("hidden", "");
  }

  // 关闭卸载确认弹层 #uninstallWarn（独立 alertdialog）
  function closeUninstallWarn() {
    var warn = document.getElementById("uninstallWarn");
    if (!warn) return;
    warn.classList.remove("open");
    warn.setAttribute("hidden", "");
  }

  // 卸载模式确认：弹窗「继续」后执行业务回调
  // 操作独立确认弹层 #uninstallWarn（含 #uninstallWarnOk / #uninstallWarnCancel），
  // 与步骤 2 内联的常驻警告条 #uninstallBanner 互不干扰。
  function confirmUninstallWarn(onConfirm) {
    var warn = document.getElementById("uninstallWarn");
    if (!warn) { if (onConfirm) onConfirm(); return; }
    warn.removeAttribute("hidden");
    warn.classList.add("open");
    var ok = document.getElementById("uninstallWarnOk");
    var cancel = document.getElementById("uninstallWarnCancel");
    function cleanup() {
      if (ok) ok.removeEventListener("click", onOk);
      if (cancel) cancel.removeEventListener("click", onCancel);
    }
    function onOk() { cleanup(); closeUninstallWarn(); if (onConfirm) onConfirm(); }
    function onCancel() { cleanup(); closeUninstallWarn(); }
    if (ok) ok.addEventListener("click", onOk);
    if (cancel) cancel.addEventListener("click", onCancel);
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
    toggleUninstallWarn: toggleUninstallWarn,
    closeUninstallWarn: closeUninstallWarn,
    confirmUninstallWarn: confirmUninstallWarn
  };
})();
