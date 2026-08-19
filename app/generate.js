// MiAppClean 命令生成模块（adb 命令拼装 / 自定义包名解析 / HTML 转义）
// 路径: app/generate.js  v1.15.1
// 单一数据源：风险映射 RISK_MAP 由调用方（app.js）传入，保证单一事实来源。
// 用法：先于 app.js 引入；对外暴露 window.MiGen。
(function () {
  "use strict";

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  // 解析自定义文本域：按行拆分、去空、去注释（# 开头）
  function parseCustom(customEl) {
    return (customEl.value || "")
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter((s) => s && !s.startsWith("#"));
  }

  // 生成 adb 命令：根据模式、勾选项、自定义包名与风险映射拼装
  // 支持两种签名：
  //   新：generate({ mode, checkedPkgs, customEl, outputEl, statEl, riskMap })
  //   旧：generate(selected, custom, mode)
  // DOM 元素（customEl/outputEl/statEl）缺失时自动从页面选取，保证健壮性。
  function generate(arg0, arg1, arg2) {
    let opts;
    if (Array.isArray(arg0) || typeof arg0 === "string") {
      // 旧签名兼容：generate(selected, custom, mode)
      opts = { selected: arg0, custom: arg1, mode: arg2 };
    } else {
      opts = arg0 || {};
    }
    const outputEl = opts.outputEl || document.querySelector("#output");
    const statEl = opts.statEl || document.querySelector("#stat");
    const customEl = opts.customEl || document.querySelector("#custom");
    const riskMap = opts.riskMap || (window.MiState ? window.MiState.RISK_MAP : {});
    const mode = opts.mode || (window.MiState ? window.MiState.getModeSafe() : "disable");
    const selected = Array.isArray(opts.selected)
      ? opts.selected
      : (opts.checkedPkgs ? [...opts.checkedPkgs] : []);

    const cmd = mode === "uninstall"
      ? "adb shell pm uninstall --user 0"
      : "adb shell pm disable-user --user 0";
    const checks = [...document.querySelectorAll(".pkg-check:checked")].map((c) => c.value);
    const customPkgs = parseCustom(customEl);
    const pkgs = [...new Set([...selected, ...checks, ...customPkgs])];

    if (pkgs.length === 0) {
      if (outputEl) outputEl.innerHTML = "// 勾选应用或粘贴自定义包名后将在此生成 adb 命令";
      if (statEl) statEl.textContent = "已选 0";
      return;
    }

    const lines = [];
    const skipped = [];
    pkgs.forEach((p) => {
      const risk = riskMap[p] || "safe";
      if (risk === "danger") {
        skipped.push(p); // 危险组件严禁精简，不生成命令
        return;
      }
      const comment = risk === "caution" ? "  # 谨慎：可能影响相关功能" : "";
      lines.push(`${cmd} ${p}${comment}`);
    });

    let html = lines.map((l) => {
      if (l.includes("# 谨慎")) return `<span class="c-caution">${escapeHtml(l)}</span>`;
      return escapeHtml(l);
    }).join("\n");

    if (skipped.length) {
      html += `\n\n<span class="c-skip">// 已自动跳过危险组件（严禁精简，可能变砖）：\n// ${skipped.map(escapeHtml).join(", ")}</span>`;
    }
    if (outputEl) outputEl.innerHTML = html;
    if (statEl) statEl.textContent = `已选 ${pkgs.length}`;
  }

  window.MiGen = { generate: generate, parseCustom: parseCustom, escapeHtml: escapeHtml };
})();
