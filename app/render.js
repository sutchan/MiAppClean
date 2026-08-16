// MiAppClean 分类渲染模块（按设备/搜索过滤渲染可勾选应用列表）
// 路径: app/render.js  v1.13.4
// 单一数据源：APP_DATA 由调用方传入，勾选状态由 checkedPkgs 集合维护。
// 用法：先于 app.js 引入；对外暴露 window.MiRender。
(function () {
  "use strict";

  // 渲染分类列表
  // opts: { device, term, checkedPkgs:Set, catListEl, appData, riskLabel, riskFilter }
  // riskFilter: "all" | "safe" | "caution" | "danger"
  function render(opts) {
    const { device, term, checkedPkgs, catListEl, appData, riskLabel, riskFilter } = opts;
    // riskLabel 兼容两种形态：函数 (risk)=>text，或含 .of 的取值器，或 {risk:"text"} 静态表
    const labelOf = (risk) => {
      if (typeof riskLabel === "function") return riskLabel(risk);
      if (riskLabel && typeof riskLabel.of === "function") return riskLabel.of(risk);
      return (riskLabel && riskLabel[risk]) || "安全";
    };
    const list = device === "pad" ? appData.phone : appData[device];
    const q = (term || "").trim().toLowerCase();
    const rf = riskFilter || "all";
    catListEl.innerHTML = "";
    let totalShown = 0;

    list.forEach((group, gi) => {
      // 按包名或描述过滤（大小写不敏感）
      let items = q
        ? group.items.filter(
            (it) =>
              it.pkg.toLowerCase().includes(q) ||
              (it.desc || "").toLowerCase().includes(q)
          )
        : group.items;
      // 按风险等级筛选（点击图例触发）
      if (rf !== "all") {
        items = items.filter((it) => (it.risk || "safe") === rf);
      }
      if (items.length === 0) return; // 无匹配项则隐藏整个分类

      const details = document.createElement("details");
      details.className = "cat";
      details.id = `cat-${gi}`; // 语义化锚点：按分类索引稳定定位
      details.setAttribute("data-cat", group.cat);
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
        row.id = `pkg-${it.pkg}`; // 语义化 id：以包名定位行，便于测试与锚点
        row.setAttribute("data-pkg", it.pkg);
        row.setAttribute("data-risk", risk);
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
        tag.textContent = labelOf(risk);
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
