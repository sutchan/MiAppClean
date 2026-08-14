// MiAppClean 应用原型 · 交互与 UI 层
// 依赖：app.state.js（window.MiState）、render.js（window.MiRender）、
//       generate.js（window.MiGen）、settings.js（window.MiSettings）
// 路径: prototype/app/app.ui.js  v1.8.4

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

  async function copyAll() {
    if (!output.textContent.startsWith("adb")) {
      toast("暂无可复制的命令");
      return;
    }
    try {
      await navigator.clipboard.writeText(output.textContent);
      toast("已复制全部命令 ✓");
    } catch (e) {
      // 降级方案：选中文本
      const range = document.createRange();
      range.selectNodeContents(output);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      toast("已选中命令，请按 Ctrl/Cmd+C 复制");
    }
  }

  function selectAll() {
    document.querySelectorAll(".pkg-check").forEach((c) => {
      if (!c.disabled) { c.checked = true; checkedPkgs.add(c.value); }
    });
    generate();
    toast("已全选推荐项（危险组件已排除）");
  }

  function clearAll() {
    document.querySelectorAll(".pkg-check").forEach((c) => { c.checked = false; checkedPkgs.delete(c.value); });
    if (window.MiSettings) window.MiSettings.saveChecked([]);
    generate();
  }

  // 事件绑定
  document.querySelectorAll('input[name="device"]').forEach((r) =>
    r.addEventListener("change", () => { renderCategories(); generate(); })
  );
  document.querySelectorAll('input[name="mode"]').forEach((r) =>
    r.addEventListener("change", () => { generate(); syncRemember(); })
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

  // 风险图例筛选：事件委托，点击切换 safe / caution / danger / all
  const riskLegend = document.querySelector(".risk-legend");
  if (riskLegend) {
    riskLegend.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-filter]");
      if (!btn) return;
      setRiskFilter(btn.getAttribute("data-filter"));
    });
  }

  // 响应设置面板变更：默认模式 / 记忆开关
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

  // 初始化
  if (window.MiSettings) {
    const mode = window.MiSettings.get("mode");
    const radio = document.querySelector(`input[name="mode"][value="${mode}"]`);
    if (radio) radio.checked = true;
  }
  setRiskFilter("all"); // 默认全部，并标记 active 态
  renderCategories();
  generate();

  // 主题切换：复用 theme.js 的三态循环（浅色/深色/跟随系统）
  const themeBtn = $("#themeBtn");
  if (themeBtn && typeof cycleTheme === "function") {
    themeBtn.addEventListener("click", () => cycleTheme());
  }
})();
