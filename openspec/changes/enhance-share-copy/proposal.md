# 提案：enhance-share-copy（分享复制增强）

## 动机

当前「复制全部命令」（`copyAll`）仅把生成的 adb 命令写入剪贴板，用户在社媒 / 群聊转发时缺少项目标识，传播效果弱。

为提升项目传播力，复制操作应在命令之外**同时附带**：
1. 当前分析结果的分享链接（指向 MiAppClean 站点，便于他人复现同款精简方案）；
2. 一条随机选取的**项目宣传文案**（多语言），使每次分享的文案不重复、更具传播性。

## 方案

- 新增纯函数模块 `prototype/app/app.share.js`（暴露 `window.MiShare`），职责单一：
  - `buildShareText(commands, opts)`：组合 `命令 + 分享链接 + 随机宣传文案`，返回完整剪贴板文本；
  - `pickPromo(lang)`：从宣传文案池（`promos`）按当前语言随机选取一条；
  - 文案池数据内聚于本模块，避免污染 UI 模块。
- 宣传文案池接入 `window.MiI18n` 字典（`share.promo.*`），按语言随机；i18n 缺失时回退到中文池，绝不抛错。
- 分享链接取当前页面 `location.href`（或站点根），由 `window.MiShare` 组装，不硬编码域名。
- `app.ui.js` 的 `copyAll()` 改为调用 `window.MiShare.buildShareText(...)` 一次性写入剪贴板；降级逻辑（选中文本）保持不变。
- 新增 i18n 键：`share.linkLabel`（链接前缀说明）、`toast.copiedShare`（复制成功文案含「命令+分享文案」）。

## 影响范围

- 改动文件（均在 `prototype/app/`，被根 `index.html` 复用，故线上站点同步受益）：
  - `app.share.js`（新增，纯函数 ≤200 行）
  - `app.ui.js`（编排 `copyAll`）
  - `i18n.js`（新增 `share.promo.*` / `share.linkLabel` / `toast.copiedShare`）
- 不改变既有命令生成、风险拦截、数据源契约；属用户可见的能力增强（minor）。
- 版本号 bump 至 v1.13.0。
