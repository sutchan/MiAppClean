// 小米安卓设备内置 APK 清理命令页面逻辑
// 依赖 apk-data.js 中的 APP_DATA
// 路径: xiaomi-apk-cleanup.js  v1.4.0

const $ = (sel) => document.querySelector(sel);
const categoryList = $("#categoryList");
const output = $("#output");
const customPkgs = $("#customPkgs");

// 预扫描所有设备清单，建立 包名 -> risk 映射，供生成命令时判定风险
const RISK_MAP = {};
Object.values(APP_DATA).forEach((groups) =>
  groups.forEach((g) => g.items.forEach((it) => { RISK_MAP[it.pkg] = it.risk || "safe"; }))
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
  categoryList.innerHTML = "";
  list.forEach((group) => {
    const details = document.createElement("details");
    details.className = "category";
    details.open = true;
    const summary = document.createElement("summary");
    summary.textContent = `${group.cat}（${group.items.length}）`;
    details.appendChild(summary);
    group.items.forEach((it) => {
      const risk = it.risk || "safe";
      const label = document.createElement("label");
      label.className = `pkg-item risk-${risk}`;
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.className = "pkg-check";
      cb.value = it.pkg;
      const name = document.createElement("span");
      name.className = "pkg-name";
      name.textContent = it.pkg;
      const tag = document.createElement("span");
      tag.className = `risk-tag risk-tag-${risk}`;
      tag.textContent = RISK_LABEL[risk];
      const desc = document.createElement("span");
      desc.className = "pkg-desc";
      desc.textContent = it.desc;
      label.append(cb, name, tag, desc);
      details.appendChild(label);
    });
    categoryList.appendChild(details);
  });
}

function parseCustom() {
  return customPkgs.value
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
  const custom = parseCustom();
  const pkgs = [...new Set([...checks, ...custom])];
  if (pkgs.length === 0) {
    output.textContent = "// 勾选应用或粘贴自定义包名后将在此生成 adb 命令";
    return;
  }
  const lines = [];
  const blocked = [];
  pkgs.forEach((p) => {
    const risk = RISK_MAP[p] || "safe";
    if (risk === "danger") {
      blocked.push(p); // 危险组件严禁精简，不生成命令
      return;
    }
    const comment = risk === "caution" ? "  # 谨慎：可能影响相关功能" : "";
    lines.push(`${cmd} ${p}${comment}`);
  });
  if (blocked.length) {
    lines.push("");
    lines.push(`// 已跳过危险组件（严禁精简，可能变砖）：${blocked.join(", ")}`);
  }
  output.textContent = lines.join("\n");
}

async function copyAll() {
  if (!output.textContent.startsWith("adb")) return;
  try {
    await navigator.clipboard.writeText(output.textContent);
    const btn = $("#copyBtn");
    const old = btn.textContent;
    btn.textContent = "已复制 ✓";
    setTimeout(() => (btn.textContent = old), 1500);
  } catch (e) {
    alert("复制失败，请手动选择文本复制。");
  }
}

function selectAll() {
  document.querySelectorAll(".pkg-check").forEach((c) => (c.checked = true));
  generate();
}
function clearAll() {
  document.querySelectorAll(".pkg-check").forEach((c) => (c.checked = false));
  generate();
}

document.querySelectorAll('input[name="device"]').forEach((r) =>
  r.addEventListener("change", () => { renderCategories(); generate(); })
);
document.querySelectorAll('input[name="mode"]').forEach((r) =>
  r.addEventListener("change", generate)
);
categoryList.addEventListener("change", generate);
customPkgs.addEventListener("input", generate);
$("#copyBtn").addEventListener("click", copyAll);
$("#selectAllBtn").addEventListener("click", selectAll);
$("#clearBtn").addEventListener("click", clearAll);

renderCategories();
generate();
