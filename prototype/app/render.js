// MiAppClean 分类渲染模块（按设备/搜索过滤渲染可勾选应用列表）
// 路径: prototype/app/render.js  v1.7.1
// 单一数据源：APP_DATA 由调用方传入，勾选状态由 checkedPkgs 集合维护。
// 用法：先于 app.js 引入；对外暴露 window.MiRender。
(function () {
  "use strict";

  // 渲染分类列表
  // opts: { device, term, checkedPkgs:Set, catListEl, appData, riskLabel }
  function render(opts) {
    const { device, term, checkedPkgs, catListEl, appData, riskLabel } = opts;
    const list = device === "pad" ? appData.phone : appData[device];
    const q = (term || "").trim().toLowerCase();
    catListEl.innerHTML = "";
    let totalShown = 0;

    list.forEach((group) => {
      // 按包名或描述过滤（大小写不敏感）
      const items = q
        ? group.items.filter(
            (it) =>
              it.pkg.toLowerCase().includes(q) ||
              (it.desc || "").toLowerCase().includes(q)
          )
        : group.items;
      if (items.length === 0) return; // 无匹配项则隐藏整个分类

      const details = document.createElement("details");
      details.className = "cat";
      details.open = true;
      const summary = document.createElement("summary");
      summary.innerHTML = `${group.cat}<span class="count">${items.length}</span>`;
      details.appendChild(summary);

      // 列表项容器：CSS Grid 两列布局（窄屏回退单列）
      const grid = document.createElement("div");
      grid.className = "pkg-grid";

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
        tag.textContent = riskLabel[risk] || "安全";
        const desc = document.createElement("span");
        desc.className = "desc";
        desc.textContent = it.desc;
        row.append(cb, name, tag, desc);
        grid.appendChild(row);
        totalShown++;
      });
      details.appendChild(grid);
      catListEl.appendChild(details);
    });

    if (totalShown === 0) {
      catListEl.innerHTML = '<p class="empty">未找到匹配的包名，请调整关键词或清空筛选。</p>';
    }
  }

  window.MiRender = { render: render };
})();
