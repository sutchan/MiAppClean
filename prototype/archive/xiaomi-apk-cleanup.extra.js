// 小米 APK 清理页面增强模块：搜索筛选 / 自定义清单风险预览 / 配置导入导出
// 依赖 xiaomi-apk-cleanup.js 暴露的全局 RISK_MAP / RISK_LABEL 与 generate()
// 路径: xiaomi-apk-cleanup.extra.js  v1.6.0

const $ = (sel) => document.querySelector(sel);
const searchInput = $("#searchInput");
const riskFilter = $("#riskFilter");
const customPreview = $("#customPreview");
const customPkgs = $("#customPkgs");

// 风险未知时的展示
const UNKNOWN_LABEL = "未知";

// 自定义清单风险预览：实时解析文本框并按行标注风险
function renderCustomPreview() {
  const lines = (customPkgs.value || "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith("#"));
  if (lines.length === 0) {
    customPreview.innerHTML = "";
    return;
  }
  customPreview.innerHTML = "";
  const counts = { safe: 0, caution: 0, danger: 0, unknown: 0 };
  lines.forEach((pkg) => {
    const risk = RISK_MAP[pkg] || "unknown";
    counts[risk]++;
    const row = document.createElement("div");
    row.className = `preview-row risk-${risk}`;
    const tag = document.createElement("span");
    tag.className = `risk-tag risk-tag-${risk}`;
    tag.textContent = RISK_LABEL[risk] || UNKNOWN_LABEL;
    const name = document.createElement("span");
    name.className = "preview-name";
    name.textContent = pkg;
    row.append(tag, name);
    customPreview.appendChild(row);
  });
  const sum = document.createElement("div");
  sum.className = "preview-sum";
  sum.textContent = `共 ${lines.length} 个：安全 ${counts.safe} · 谨慎 ${counts.caution} · 危险 ${counts.danger} · 未知 ${counts.unknown}`;
  customPreview.appendChild(sum);
}

// 搜索 + 风险筛选：在已渲染列表上隐藏不匹配项
function applyFilter() {
  const q = (searchInput.value || "").trim().toLowerCase();
  const rf = riskFilter.value; // all / safe / caution / danger
  document.querySelectorAll("#categoryList .pkg-item").forEach((item) => {
    const name = item.querySelector(".pkg-name").textContent.toLowerCase();
    const risk = item.className.match(/risk-(\w+)/)?.[1] || "safe";
    const matchQ = !q || name.includes(q);
    const matchR = rf === "all" || risk === rf;
    item.style.display = matchQ && matchR ? "" : "none";
  });
  // 隐藏空分类
  document.querySelectorAll("#categoryList .category").forEach((cat) => {
    const visible = cat.querySelectorAll('.pkg-item:not([style*="display: none"])').length;
    cat.style.display = visible ? "" : "none";
  });
}

// 导出当前配置（设备/模式/勾选包名/自定义）为 JSON 字符串
function exportConfig() {
  const data = {
    device: document.querySelector('input[name="device"]:checked').value,
    mode: document.querySelector('input[name="mode"]:checked').value,
    checked: [...document.querySelectorAll(".pkg-check:checked")].map((c) => c.value),
    custom: customPkgs.value,
  };
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `miui-cleanup-${data.device}.cleanup.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// 导入配置 JSON 并恢复勾选
function importConfig() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json,.json";
  input.onchange = () => {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.device) {
          const dev = document.querySelector(`input[name="device"][value="${data.device}"]`);
          if (dev) { dev.checked = true; renderCategories(); }
        }
        if (data.mode) {
          const md = document.querySelector(`input[name="mode"][value="${data.mode}"]`);
          if (md) md.checked = true;
        }
        if (Array.isArray(data.checked)) {
          const set = new Set(data.checked);
          document.querySelectorAll(".pkg-check").forEach((c) => {
            c.checked = set.has(c.value);
          });
        }
        if (typeof data.custom === "string") {
          customPkgs.value = data.custom;
          renderCustomPreview();
        }
        generate();
        alert("配置已导入。");
      } catch (e) {
        alert("导入失败：JSON 解析错误。");
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

// 事件绑定
if (searchInput) searchInput.addEventListener("input", applyFilter);
if (riskFilter) riskFilter.addEventListener("change", applyFilter);
if (customPkgs) customPkgs.addEventListener("input", () => { renderCustomPreview(); generate(); });
$("#exportBtn").addEventListener("click", exportConfig);
$("#importBtn").addEventListener("click", importConfig);

// 设备/模式切换后列表重渲染，需重新应用筛选
document.querySelectorAll('input[name="device"]').forEach((r) =>
  r.addEventListener("change", () => setTimeout(applyFilter, 0))
);
document.querySelectorAll('input[name="mode"]').forEach((r) =>
  r.addEventListener("change", () => setTimeout(applyFilter, 0))
);

renderCustomPreview();
applyFilter();
