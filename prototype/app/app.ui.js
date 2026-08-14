// MiAppClean 应用原型 · 交互与 UI 层
// 依赖：app.state.js（window.MiState）、render.js（window.MiRender）、
//       generate.js（window.MiGen）、settings.js（window.MiSettings）
// 路径: prototype/app/app.ui.js  v1.9.1

(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const state = window.MiState;
  // 数据源未就绪时（app.state.js 已给出提示）直接退出，避免二次报错
  if (!state) return;

  const { APP_DATA, RISK_MAP, RISK_LABEL, checkedPkgs, getDevice, getMode, syncRemember } = state;

  const output = $("#output");
  const custom = $("#custom");
  const stat = $("#stat");
  const search = $("#search");
  const catList = $("#catList");

  // 当前风险筛选：all | safe | caution | danger（点击风险图例切换）
  let riskFilter = "all";

  // 复制提示是否开启（设置项：复制成功后提示）
  function toastEnabled() {
    return !window.MiSettings || window.MiSettings.get("toast") === "on";
  }
  function toast(msg) {
    if (!toastEnabled()) return;
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2000);
  }

  // 设置风险筛选：切换 active 样式并重新渲染列表
  function setRiskFilter(value) {
    riskFilter = value;
    document.querySelectorAll(".risk-legend [data-filter]").forEach((el) => {
      const on = el.getAttribute("data-filter") === value;
      el.classList.toggle("active", on);
      el.setAttribute("aria-pressed", on ? "true" : "false");
    });
    renderCategories();
  }

  // 包装 MiRender.render：注入当前设备、搜索词、勾选集合与风险筛选
  function renderCategories() {
    window.MiRender.render({
      device: getDevice(),
      term: search ? search.value : "",
      checkedPkgs: checkedPkgs,
      catListEl: catList,
      appData: APP_DATA,
      riskLabel: RISK_LABEL,
      riskFilter: riskFilter,
    });
  }

  // 包装 MiGen.generate：注入当前模式、勾选集合与风险映射
  function generate() {
    window.MiGen.generate({
      mode: getMode(),
      checkedPkgs: checkedPkgs,
      customEl: custom,
      outputEl: output,
      statEl: stat,
      riskMap: RISK_MAP,
    });
  }

  // 卸载模式高风险警告条显隐控制
  function toggleUninstallWarn() {
    const banner = document.getElementById("uninstallWarn");
    if (banner) banner.classList.toggle("hidden", getMode() !== "uninstall");
  }

  // 国际化文案取用：优先 MiI18n，未加载时回退原文
  const I = (key) => (window.MiI18n ? window.MiI18n.t(key) : key);

  async function copyAll() {
    if (!output.textContent.startsWith("adb")) {
      toast(I("toast.nothing"));
      return;
    }
    // 含卸载命令时，复制前强制弹窗二次确认（最危险操作）
    if (output.textContent.includes("pm uninstall")) {
      const ok = window.confirm(I("confirm.uninstallCopy"));
      if (!ok) {
        toast(I("toast.cancelDanger"));
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(output.textContent);
      toast(I("toast.copied"));
    } catch (e) {
      // 降级方案：选中文本
      const range = document.createRange();
      range.selectNodeContents(output);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      toast(I("toast.copyFallback"));
    }
  }

  function selectAll() {
    document.querySelectorAll(".pkg-check").forEach((c) => {
      if (!c.disabled) { c.checked = true; checkedPkgs.add(c.value); }
    });
    generate();
    toast(I("toast.selectAll"));
  }

  function clearAll() {
    document.querySelectorAll(".pkg-check").forEach((c) => { c.checked = false; checkedPkgs.delete(c.value); });
    if (window.MiSettings) window.MiSettings.saveChecked([]);
    generate();
  }

  // 取消全选：仅取消当前已勾选项，不清空自定义文本框
  function deselectAll() {
    if (checkedPkgs.size === 0) return;
    document.querySelectorAll(".pkg-check").forEach((c) => { c.checked = false; checkedPkgs.delete(c.value); });
    if (window.MiSettings) window.MiSettings.saveChecked([]);
    generate();
    toast(I("toast.deselect"));
  }

  // 事件绑定
  document.querySelectorAll('input[name="device"]').forEach((r) =>
    r.addEventListener("change", () => { renderCategories(); generate(); })
  );
  document.querySelectorAll('input[name="mode"]').forEach((r) =>
    r.addEventListener("change", () => {
      // 切换到「卸载」模式时强制弹窗警告，取消则回退到「禁用」
      if (getMode() === "uninstall" && !window.confirm(I("confirm.switchUninstall"))) {
        const disable = document.querySelector('input[name="mode"][value="disable"]');
        if (disable) disable.checked = true;
        toast(I("toast.keepDisable"));
      }
      toggleUninstallWarn();
      generate();
      syncRemember();
    })
  );
  // 勾选变化：同步已选集合并重新生成命令
  catList.addEventListener("change", (e) => {
    const cb = e.target.closest(".pkg-check");
    if (cb) {
      if (cb.checked) checkedPkgs.add(cb.value);
      else checkedPkgs.delete(cb.value);
      syncRemember();
    }
    generate();
  });
  custom.addEventListener("input", generate);
  if (search) {
    // 轻量防抖：避免快速输入时高频重渲染
    let t;
    search.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(renderCategories, 120);
    });
  }
  const bind = (id, fn) => { const el = $(id); if (el) el.addEventListener("click", fn); };
  bind("#copyBtn", copyAll);
  bind("#selectAllBtn", selectAll);
  bind("#clearBtn", clearAll);
  bind("#deselectBtn", deselectAll);

  // 风险图例筛选：事件委托，点击切换 safe / caution / danger / all
  const riskLegend = document.querySelector(".risk-legend");
  if (riskLegend) {
    riskLegend.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-filter]");
      if (!btn) return;
      setRiskFilter(btn.getAttribute("data-filter"));
    });
  }

  // 响应设置面板变更：默认模式 / 记忆开关 / 语言
  window.addEventListener("settingchange", (e) => {
    const d = e.detail || {};
    if (d.mode) {
      const radio = document.querySelector(`input[name="mode"][value="${d.mode}"]`);
      if (radio) radio.checked = true;
      generate();
    }
    if (d.remember === "off") {
      checkedPkgs.clear();
      renderCategories();
      generate();
    }
  });

  // 语言切换后：刷新已渲染列表（含风险标签）与命令输出，保持语言一致
  window.addEventListener("langchange", () => {
    renderCategories();
    generate();
  });

  // 初始化
  if (window.MiSettings) {
    const mode = window.MiSettings.get("mode");
    const radio = document.querySelector(`input[name="mode"][value="${mode}"]`);
    if (radio) radio.checked = true;
  }
  if (window.MiI18n) window.MiI18n.apply(); // 应用界面文案（中英）
  setRiskFilter("all"); // 默认全部，并标记 active 态
  renderCategories();
  generate();
  toggleUninstallWarn(); // 依据初始模式（含设置默认模式）同步警告条显隐

  // 主题切换：复用 theme.js 的三态循环（浅色/深色/跟随系统）
  const themeBtn = $("#themeBtn");
  if (themeBtn && typeof cycleTheme === "function") {
    themeBtn.addEventListener("click", () => cycleTheme());
  }

  // 语言切换按钮：在 supports 语言间循环切换
  const langBtn = $("#langBtn");
  if (langBtn && window.MiI18n) {
    const next = () => (window.MiI18n.getLang() === "zh-CN" ? "en-US" : "zh-CN");
    langBtn.addEventListener("click", () => {
      window.MiI18n.setLang(next());
      langBtn.textContent = window.MiI18n.getLang() === "zh-CN" ? "EN" : "中";
    });
    langBtn.textContent = window.MiI18n.getLang() === "zh-CN" ? "EN" : "中";
  }
})();
