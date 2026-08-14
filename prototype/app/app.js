// MiAppClean 应用原型交互逻辑
// 复用根目录 apk-data.js 的 APP_DATA 作为单一数据源（真实数据）
// 路径: prototype/app/app.js  v1.6.2

(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const catList = $("#catList");
  const output = $("#output");
  const custom = $("#custom");
  const stat = $("#stat");

  // 预扫描所有设备清单，建立 包名 -> risk 映射，供生成命令时判定风险
  const RISK_MAP = {};
  Object.values(APP_DATA).forEach((groups) =>
    groups.forEach((g) =>
      g.items.forEach((it) => { RISK_MAP[it.pkg] = it.risk || "safe"; })
    )
  );
  const RISK_LABEL = { safe: "安全", caution: "谨慎", danger: "危险" };

  function getDevice() {
    return document.querySelector('input[name="device"]:checked').value;
  }
  function getMode() {
    return document.querySelector('input[name="mode"]:checked').value;
  }

  function renderCategories() {
    const device = getDevice();
    const list = device === "pad" ? APP_DATA.phone : APP_DATA[device];
    catList.innerHTML = "";
    list.forEach((group) => {
      const details = document.createElement("details");
      details.className = "cat";
      details.open = true;
      const summary = document.createElement("summary");
      summary.innerHTML = `${group.cat}<span class="count">${group.items.length}</span>`;
      details.appendChild(summary);

      group.items.forEach((it) => {
        const risk = it.risk || "safe";
        const row = document.createElement("label");
        row.className = `pkg risk-${risk}`;
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.className = "pkg-check";
        cb.value = it.pkg;
        cb.disabled = risk === "danger"; // 危险组件禁止勾选
        const name = document.createElement("span");
        name.className = "name";
        name.textContent = it.pkg;
        const tag = document.createElement("span");
        tag.className = `badge badge-${risk === "danger" ? "danger" : risk === "caution" ? "caution" : "safe"}`;
        tag.textContent = RISK_LABEL[risk];
        const desc = document.createElement("span");
        desc.className = "desc";
        desc.textContent = it.desc;
        row.append(cb, name, tag, desc);
        details.appendChild(row);
      });
      catList.appendChild(details);
    });
  }

  function parseCustom() {
    return custom.value
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter((s) => s && !s.startsWith("#"));
  }

  function generate() {
    const mode = getMode();
    const cmd = mode === "uninstall"
      ? "adb shell pm uninstall --user 0"
      : "adb shell pm disable-user --user 0";
    const checks = [...document.querySelectorAll(".pkg-check:checked")].map((c) => c.value);
    const customPkgs = parseCustom();
    const pkgs = [...new Set([...checks, ...customPkgs])];

    if (pkgs.length === 0) {
      output.innerHTML = "// 勾选应用或粘贴自定义包名后将在此生成 adb 命令";
      stat.textContent = "已选 0";
      return;
    }

    const lines = [];
    const skipped = [];
    pkgs.forEach((p) => {
      const risk = RISK_MAP[p] || "safe";
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
      html += `\n\n// 已跳过危险组件（严禁精简，可能变砖）：\n// ${skipped.map(escapeHtml).join(", ")}`;
    }
    output.innerHTML = html;
    stat.textContent = `已选 ${pkgs.length}`;
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
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
      if (!c.disabled) c.checked = true;
    });
    generate();
    toast("已全选推荐项（危险组件已排除）");
  }

  function clearAll() {
    document.querySelectorAll(".pkg-check").forEach((c) => (c.checked = false));
    generate();
  }

  function toast(msg) {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2000);
  }

  // 事件绑定
  document.querySelectorAll('input[name="device"]').forEach((r) =>
    r.addEventListener("change", () => { renderCategories(); generate(); })
  );
  document.querySelectorAll('input[name="mode"]').forEach((r) =>
    r.addEventListener("change", generate)
  );
  catList.addEventListener("change", generate);
  custom.addEventListener("input", generate);
  $("#copyBtn").addEventListener("click", copyAll);
  $("#selectAllBtn").addEventListener("click", selectAll);
  $("#clearBtn").addEventListener("click", clearAll);

  // 初始化
  renderCategories();
  generate();
})();
