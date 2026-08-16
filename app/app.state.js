// MiAppClean 应用原型 · 状态与数据层
// 复用根目录 apk-data.js 的 APP_DATA 作为单一数据源（真实数据）
// 路径: prototype/app/app.state.js  v1.13.3

(function () {
  "use strict";

  const catList = document.querySelector("#catList");
  const stat = document.querySelector("#stat");

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
  // 风险等级标签：实时从 i18n 模块取（支持中/英动态切换），未加载时回退中文。
  // 使用函数形式，避免语言切换后标签残留旧语言的静态快照。
  const RISK_LABEL = {
    safe: () => (window.MiI18n ? window.MiI18n.riskLabel("safe") : "安全"),
    caution: () => (window.MiI18n ? window.MiI18n.riskLabel("caution") : "谨慎"),
    danger: () => (window.MiI18n ? window.MiI18n.riskLabel("danger") : "危险"),
  };
  // 兼容调用：render 层既可传函数式 RISK_LABEL，也可直接传常量；此处统一通过取值器返回文本
  function riskLabelOf(risk) {
    const fn = RISK_LABEL[risk] || RISK_LABEL.safe;
    return typeof fn === "function" ? fn() : fn;
  }
  RISK_LABEL.of = riskLabelOf;

  // 已勾选包名集合：跨搜索过滤 / 设备切换持久保留勾选状态
  // 若开启「记忆上次勾选」，则从本地存储恢复勾选集合
  const checkedPkgs = new Set(
    window.MiSettings ? window.MiSettings.loadChecked() : []
  );

  // 当前选中设备 / 操作模式（读取分段控件）
  function getDevice() {
    return document.querySelector('input[name="device"]:checked').value;
  }
  function getMode() {
    return document.querySelector('input[name="mode"]:checked').value;
  }

  // 勾选集合变更后持久化（受「记忆上次勾选」开关控制）
  function syncRemember() {
    if (window.MiSettings) window.MiSettings.saveChecked([...checkedPkgs]);
  }

  // 对外暴露状态层，供 UI 层（app.ui.js）与渲染/生成模块消费
  window.MiState = {
    APP_DATA,
    RISK_MAP,
    RISK_LABEL,
    checkedPkgs,
    getDevice,
    getMode,
    syncRemember,
  };
})();
