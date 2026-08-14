// MiAppClean 应用原型交互逻辑
// 复用根目录 apk-data.js 的 APP_DATA 作为单一数据源（真实数据）
// 路径: prototype/app/app.js  v1.6.11

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
  const checkedPkgs = new Set();

  function getDevice() {
    return document.querySelector('input[name="device"]:checked').value;
  }
  function getMode() {
    return document.querySelector('input[name="mode"]:checked').value;
  }

  function renderCategories() {
    const device = getDevice();
    const list = device === "pad" ? APP_DATA.phone : APP_DATA[device];
    const term = (search.value || "").trim().toLowerCase();
    catList.innerHTML = "";
    let totalShown = 0;

    list.forEach((group) => {
      // 按包名或描述过滤（大小写不敏感）
      const items = term
        ? group.items.filter(
            (it) =>
              it.pkg.toLowerCase().includes(term) ||
              (it.desc || "").toLowerCase().includes(term)
          )
        : group.items;
      if (items.length === 0) return; // 无匹配项则隐藏整个分类

      const details = document.createElement("details");
      details.className = "cat";
      details.open = true;
      const summary = document.createElement("summary");
      summary.innerHTML = `${group.cat}<span class="count">${items.length}</span>`;
      details.appendChild(summary);

      items.forEach((it) => {
        const risk = it.risk || "safe";
        const row = document.createElement("label");
        row.className = `pkg risk-${risk}`;
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.className = "pkg-check";
        cb.value = it.pkg;
        cb.disabled = risk === "danger"; // 危险组件禁止勾选
        cb.checked = checkedPkgs.has(it.pkg); // 恢复勾选状态
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
        totalShown++;
      });
      catList.appendChild(details);
    });

    if (totalShown === 0) {
      catList.innerHTML = '<p class="empty">未找到匹配的包名，请调整关键词或清空筛选。</p>';
    }
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
      if (!c.disabled) { c.checked = true; checkedPkgs.add(c.value); }
    });
    generate();
    toast("已全选推荐项（危险组件已排除）");
  }

  function clearAll() {
    document.querySelectorAll(".pkg-check").forEach((c) => { c.checked = false; checkedPkgs.delete(c.value); });
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
  // 勾选变化：同步已选集合并重新生成命令
  catList.addEventListener("change", (e) => {
    const cb = e.target.closest(".pkg-check");
    if (cb) {
      if (cb.checked) checkedPkgs.add(cb.value);
      else checkedPkgs.delete(cb.value);
    }
    generate();
  });
  custom.addEventListener("input", generate);
  if (search) search.addEventListener("input", renderCategories);
  $("#copyBtn").addEventListener("click", copyAll);
  $("#selectAllBtn").addEventListener("click", selectAll);
  $("#clearBtn").addEventListener("click", clearAll);

  // 初始化
  renderCategories();
  generate();
})();
