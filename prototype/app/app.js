// MiAppClean 应用原型交互逻辑
// 复用根目录 apk-data.js 的 APP_DATA 作为单一数据源（真实数据）
// 路径: prototype/app/app.js  v1.6.12

(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const catList = $("#catList");
  const output = $("#output");
  const custom = $("#custom");
  const stat = $("#stat");
  const search = $("#search");

  // 数据由 apk-data.js 以 window.APP_DATA 暴露；缺失时给出友好提示而非白屏
  const APP_DATA = window.APP_DATA;
  if (!APP_DATA || typeof APP_DATA !== "object") {
    const tip = "数据源 apk-data.js 未加载，请通过本地 HTTP 服务打开本原型。";
    if (catList) catList.innerHTML = '<p class="empty">' + tip + "</p>";
    if (stat) stat.textContent = "数据加载失败";
    return;
  }

  // 预扫描所有设备清单，建立 包名 -> risk 映射，供生成命令时判定风险
  const RISK_MAP = {};
  Object.values(APP_DATA).forEach((groups) =>
    groups.forEach((g) =>
      g.items.forEach((it) => { RISK_MAP[it.pkg] = it.risk || "safe"; })
    )
  );
  const RISK_LABEL = { safe: "安全", caution: "谨慎", danger: "危险" };

  // 已勾选包名集合：跨搜索过滤 / 设备切换持久保留勾选状态
  // 若开启「记忆上次勾选」，则从本地存储恢复勾选集合
  const checkedPkgs = new Set(
    window.MiSettings ? window.MiSettings.loadChecked() : []
  );

  // 应用默认操作模式（设置项：默认操作模式）
  function applyDefaultMode() {
    if (!window.MiSettings) return;
    const mode = window.MiSettings.get("mode");
    const radio = document.querySelector(`input[name="mode"][value="${mode}"]`);
    if (radio) radio.checked = true;
  }

  function getDevice() {
    return document.querySelector('input[name="device"]:checked').value;
  }
  function getMode() {
    return document.querySelector('input[name="mode"]:checked').value;
  }

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

  // 包装 MiRender.render：注入当前设备、搜索词与勾选集合
  function renderCategories() {
    window.MiRender.render({
      device: getDevice(),
      term: search ? search.value : "",
      checkedPkgs: checkedPkgs,
      catListEl: catList,
      appData: APP_DATA,
      riskLabel: RISK_LABEL
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
      riskMap: RISK_MAP
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
  if (search) search.addEventListener("input", renderCategories);
  $("#copyBtn").addEventListener("click", copyAll);
  $("#selectAllBtn").addEventListener("click", selectAll);
  $("#clearBtn").addEventListener("click", clearAll);

  // 勾选集合变更后持久化（受「记忆上次勾选」开关控制）
  function syncRemember() {
    if (window.MiSettings) window.MiSettings.saveChecked([...checkedPkgs]);
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
  applyDefaultMode();
  renderCategories();
  generate();
})();
