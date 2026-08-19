# Changelog

本项目所有重要变更均记录于此文件。版本号遵循 [SemVer](https://semver.org/lang/zh-CN/)。

## [1.15.2] - 2026-08-19

### fix
- 修复轻提示（toast）常驻空框：v1.15.1 移除 `#toast` 初始 `hidden` 后，
  因 `app.components.css` 的 `.toast` 既无默认隐藏态、也无 `.toast.show`
  揭示规则，导致 toast 由「永不显示」变为「常驻显示空灰框」。已补
  `opacity:0`（默认隐藏）+ `.toast.show{opacity:1}`，与 `toast()` 的
  `.show` 类控制对齐（根 `index.html` 与 `app/index.html` 共用该样式，均受益）。
- 修复卸载模式常驻警告条永不显示：`app/ui.html` 与根 `index.html` 的
  `#uninstallBanner` 初始用 class `.hidden`（CSS `.warn-banner.hidden{display:none}`），
  而 `toggleUninstallWarn()` 此前操作 `hidden` 属性、未移除 class，切到卸载时
  警告条不显示。现统一走 `classList.toggle("hidden", !show)`，与 CSS 契约一致。
- 修复根 `index.html` JSON-LD `softwareVersion` 版本遗漏（仍为 1.15.0），
  已同步至 1.15.2，满足 `openspec/specs/site` 版本同步要求。

### docs
- 统一全部源文件头注与全局展示位版本至 `v1.15.2`（`app/app.components.css`
  头注由 v1.9.0 一次性校正，其余 app/*.js 自 v1.15.1 升级）。

## [1.15.1] - 2026-08-19

### fix
- 修复应用原型 `app/index.html` 轻提示永久不可见：此前 `#toast` 初始带
  `hidden` 属性，而 `toast()` 仅用 `.show` 类控制显隐、未移除 `hidden`，
  导致复制成功等提示在 `app/index.html` 中无法显示。与根 `index.html`
  行为对齐，移除初始 `hidden`。
- 修复应用原型 `app/index.html` 卸载模式常驻警告条缺失：步骤 2 内缺少
  `#uninstallBanner`，导致 `toggleUninstallWarn()` 在 `app/index.html` 中
  静默 `return`、卸载模式无常驻风险提示。已补齐常驻红色警告条（与根站点
  及规格「卸载模式常驻红色警告」要求对齐）。

### docs
- 修正 `README.md` 目录结构中对 `theme.js` 的过时描述：根 `theme.js` 已在
  v1.15.0 移除（改内联防闪烁脚本，主题单一数据源统一为 `app/settings.js`），
  README 不再将其列为站点主题切换文件。
- 补齐语义化 id：`app/index.html` 新增 `mainWrap` / `resultToolbar` /
  `riskNotice` / `searchRow`，便于调试定位与无障碍锚点。
- 统一所有源文件头注与全局展示位版本至 `v1.15.1`（对齐用户编码规范与
  `CONTRIBUTING` 版本管理要求）。

## [1.15.0] - 2026-08-19

### feat
- 设置面板新增「恢复默认设置」选项（清除已保存的主题 / 语言 / 勾选记忆，
  恢复出厂默认），并补 `settings.reset` / `btn.reset` / `confirm.reset` 文案。
- 顶栏设置按钮（#settingsBtn）原有抽屉交互保留，右上角设置入口可用。

### fix
- 修复顶栏「语言切换」「主题切换」按钮失效：此前 `app.ui.js` 的 `init()`
  从未为 `#langBtn` / `#themeBtn` 绑定点击事件，按钮沦为死按钮。
  新增 `bindTopbar()`：语言按钮调用 `MiI18n.toggleLang()`；主题按钮三态
  循环（浅色→深色→跟随系统）调用 `MiSettings.setTheme()`。
  语言/主题广播监听现同步顶栏按钮文字与状态。
- 补全根 `index.html` 缺失的关键 DOM：此前线上站点仅有 `#settingsBtn` /
  `#langBtn`，但缺少设置抽屉（`#settingsOverlay` / `#settingsDrawer` /
  `#settingsPanel` / `#settingsClose`）、卸载确认弹层 `#uninstallWarn` 与
  轻提示 `#toast`，导致 `MiSettings.bindDrawer()` 与
  `confirmUninstallWarn()` 静默失效。现已对齐 `app/index.html` 结构补齐。
- 消除主题系统双实现冲突：移除根 `index.html` `<head>` 中外链的
  `/prototype/theme.js`（独立橙色主题逻辑，与 `app/settings.js` 共用
  `miac-theme` 键相互覆盖），改为内联防闪烁脚本，主题单一数据源统一为
  `app/settings.js`；并为根站补 `#themeBtn` 以接管主题切换。
- 修复卸载警告 ID 冲突：步骤 2 内联常驻警告条由 `#uninstallWarn` 更名为
  `#uninstallBanner`，独立确认弹层保留 `#uninstallWarn`（带 `#uninstallWarnOk`
  / `#uninstallWarnCancel`），二者不再互相干扰。
- 修复设置抽屉显隐逻辑错位：`settings.js` 的 `bindDrawer` 原本给 `#settingsOverlay`
  加 `.show` 而 CSS 由 `.settings-overlay.open` 控制显隐，导致抽屉无法打开。
  现统一为对 `#settingsOverlay` 切换 `.open` 类并兼容 `hidden` 属性。
- 删除 `app/app.state.js` 中 `setRiskFilter` 的 `_search = _search` 死代码 no-op。

## [1.14.2] - 2026-08-19

### fix
- 修复包名列表不显示：
  - `app/render.js` 旧签名未识别第一个参数为 `#catList` DOM 元素，
    导致 `device` 取值为 undefined、`appData[undefined]` 为空，列表渲染为空。
    现识别 `arg0.nodeType === 1` 的 DOM 元素形态，数据改从 `MiState.APP_DATA` 取。
  - `app/i18n.js` 缺失 `riskLabel()` 方法，而 `app.state.RISK_LABEL` 依赖
    `MiI18n.riskLabel` 取风险标签，渲染时抛错中断。新增 `riskLabel` 委托 `I("risk.*")`。

## [1.14.1] - 2026-08-17

### 文档
- 同步 prototype 与项目代码版本标注：将 `prototype/theme.js`、
  `prototype/components/components.css`、`prototype/index.html`、
  `prototype/interaction/index.html`、`prototype/README.md`、
  `CONTRIBUTING.md`、根 `index.html` 滞后的 `v1.13.3` 头注与页脚统一修正为 `v1.14.1`。
- 更新 `prototype/README.md` 的 `app/` 目录结构描述，反映实际拆分的
  14 个 JS 模块（render/generate/settings/app.state/app.share/app.ui.* 等），
  并修正打开方式说明：主应用原型 `app/index.html` 使用绝对路径，
  需经 HTTP 服务托管，而非直接双击打开。
- 调整根 `index.html` 脚本加载顺序为 `generate → render`，对齐
  `app/app.ui.js` 文件头声明的依赖顺序契约。

## [1.14.0] - 2026-08-16

### 新增
- 全站接入 Google Analytics 4（衡量 ID `G-H2TWCM7S6K`）：
  在 15 个 HTML 页面（根 `index.html`、`app/index.html`、`prototype/` 门户与各
  设计规范/组件/交互页、archive 页）的 `<head>` 统一注入 GA4 gtag 跟踪片段，
  用于衡量站点流量与页面访问。

## [1.13.5] - 2026-08-16

### 修复
- 修复原型核心交互全面失效：补齐 `app.state.js` 缺失的状态层方法
  （`check/uncheck/setDevice/setMode/setSearch/setRiskFilter/getRiskFilter/
  getChecked/getModeSafe/hasDangerSelected/selectAllRecommended/clearChecked`），
  使勾选/设备切换/搜索/风险筛选/全选清空/高危拦截恢复可用。
- 修复 `render.js`/`generate.js` 签名契约：兼容旧三参调用，并自动从 DOM
  选取 `#output`/`#stat`/`#custom` 元素，消除渲染与命令生成崩溃。
- 修复 i18n 失效：`app.ui.labels.js` 改为 `data-i18n` 属性驱动刷新，
  移除对不存在 id 的依赖，多语言真正生效。
- 修正自定义包名 textarea 引用 `customPkgs`→`custom`（与 index.html 一致）。
- 修复分享文案重复拼接：移除 `copyAll` 中 `buildShareText` 结果的二次拼接。
- 修复 `settings.js`：读取上次勾选返回数组（原为 `{}`，会导致
  `new Set({})` 抛 `TypeError`）。
- 补充 index.html 缺失的已接线 DOM 骨架：设置抽屉、卸载高危提示、
  轻提示 toast，使对应功能可用。
- 同步概览步骤文案与步骤标题一致（step-4/step-5）。

## [1.13.4] - 2026-08-16

### 杂项
- 清理根目录与 scripts/ 下的临时/调试文件（共 16 个）：
  - 删除抓取线上对比用的临时脚本与快照（`_cmp.js`、`_diff_online.js`、
    `_fetch_online.ps1`、`_o_*.js`、`_online_*.js`、`_online_*.html`）。
  - 删除一次性调试脚本 `scripts/_check_bat.mjs` 及其输出 `scripts/_check_out.txt`。
- 统一版本号至 v1.13.4（VERSION + CI 8 个扫描点）。
- 目录重构：应用代码 `prototype/app/` 整体迁移至仓库根 `/app`，
  `prototype/` 仅保留项目原型与设计原型文档；`/app` 内对
  `/prototype/design-system/`、`/prototype/theme.js`、`/apk-data.js` 的
  引用统一改为绝对路径，CI 版本校验脚本同步指向 `app/index.html`。

## [1.13.3] - 2026-08-16

### 文档
- 更正 `openspec/specs/data-source/spec.md`：包名条目字段由 `name` 改为 `desc`，
  设备分组示例由机型名（xiaomi13/pad5/hyperos/mibox）改为设备类型（phone/pad/tv），
  与 `apk-data.js` 实际结构一致。
- 更正 `openspec/specs/scripts/spec.md`：Python 脚本默认子命令由 `interactive` 改为
  `clean`，并补充 `clean` 到子命令列表，与 `xiaomi-apk-cleanup.py` 实现一致。
- 修正 `scripts/xiaomi-apk-cleanup.py` 用法注释（默认进入 `clean` 子命令）。

### 修复
- 对齐全局版本至 v1.13.4：修复 prototype 各页（门户/交互/app 子模块/components/
  base.css 等）头注与 footer 版本漂移（此前滞后至 v1.10.0~v1.13.2），满足 design-system
  规范中「prototype/\*\* 含 v<VERSION>」的一致性约束。

## [1.13.2] - 2026-08-16

### 重构
- 拆分超 200 行源代码文件，落实 openspec/project.md「按职责拆分」规则：
  - `i18n.js`（264→约 60 行）：词典数据抽离至 `i18n.dict.js`。
  - `settings.js`（201→约 150 行）：面板 DOM 构建抽离至 `settings.panel.js`。
  - `app.ui.js`（239→约 120 行）：交互处理抽离至 `app.ui.handlers.js`，
    文案刷新抽离至 `app.ui.labels.js`。
- 两个 `index.html`（根 / prototype/app）同步补充新增模块的脚本引用与依赖顺序。
- 规范硬契约文件（`apk-data.js` / `index.html` / `tokens.css`）按 openspec
  project.md「特定契约优先」条款保留不拆分。

### 修复
- 校正头注释版本漂移（`theme.js` / `render.js` / `generate.js` / `app.css` 等
  v1.10.x / v1.9.0 → v1.13.2），与 `VERSION` 单一来源保持一致。
- 为 `prototype/app/index.html` 五个步骤 section 补充语义化 `id="step-1..5"`，
  与步骤概览锚点跳转匹配。

## [1.13.1] - 2026-08-16

### 文档
- 补全仓库社区健康文件（Community Health Files）：
  - 根目录新增 `LICENSE`（MIT，供 GitHub 识别 License 徽章）。
  - `.github/` 新增 `CODE_OF_CONDUCT.md`、`SECURITY.md`、`SUPPORT.md`、
    `FUNDING.yml`、`PULL_REQUEST_TEMPLATE.md` 与
    `ISSUE_TEMPLATE/`（bug_report.yml、feature_request.yml）。
  - `SECURITY.md` 支持版本表更新为 `v1.13.x`（最新）/ `< v1.13.0`（停止支持）。
- 修复文档版本号漂移：`CONTRIBUTING.md` 与 `docs/governance/` 四份治理文件
  由 `v1.9.0` 回填至实际版本 `v1.13.1`，与 `VERSION` 单一来源保持一致。

## [1.13.0] - 2026-08-15

### 新增
- 分享复制增强：点击「复制全部命令」时，剪贴板内容由原本仅 adb 命令，
  扩展为「命令 + 分析分享链接（当前页面地址）+ 随机项目宣传文案」，
  提升项目传播力；每次复制随机选取一条文案，不重复。
- 新增独立分享模块 `prototype/app/app.share.js`（纯函数，暴露 `window.MiShare`）：
  `pickPromo()` 按当前语言从文案池随机抽取一条；`buildShareText()` 组装完整剪贴板文本。
- 宣传文案池接入 i18n（`share.promo.1`~`share.promo.5`），支持中/英双语；新增
  `share.linkLabel` 链接前缀与 `toast.copiedShare` 复制成功提示。
- 分享模块与 i18n 同样采用顶层降级 stub：i18n 未加载或本模块初始化失败时，
  退化为仅复制命令，应用不崩。

### 规范
- 新增 OpenSpec 变更提案 `changes/enhance-share-copy/`（proposal.md + tasks.md）。
- `openspec/specs/site/spec.md` 新增「分享复制增强」Requirement 与对应 Scenario。
- `openspec/project.md` 架构原则与目录职责补充分享增强说明。

## [1.12.0] - 2026-08-15

### 新增
- 页面顶部新增简易使用步骤概览条：横向列出 1-5 步（选择设备 / 操作模式 / 勾选应用 /
  生成命令 / 连接执行），点击平滑跳转至对应步骤；窄屏可横向滚动。
- 概览条标题复用 `step.N.title` 字典，随界面语言自动切换。

## [1.11.0] - 2026-08-15

### 新增
- 国际化模块加固：i18n.js 顶层注册降级 stub（window.MiI18n），并将真实初始化逻辑
  整体包入 try/catch；即使国际化文件语法错误或字典数据损坏，也保留安全实现，
  宿主应用不再因 i18n 异常而崩溃（文案降级为 key）。
- `t()` 与 `apply()` 增加内部异常捕获与数据格式校验；单个元素翻译失败不影响其余。
- 补全设置面板（settings.js）国际化：外观主题、默认操作模式、记忆勾选、复制提示、
  语言选项的硬编码中文全部改为 `data-i18n`，并新增对应字典条目；面板动态构建后
  补调用 `MiI18n.apply()`，确保打开设置时语言与全局一致。

### 修复
- 修复切换语言后设置面板仍为中文的覆盖缺口（界面语言选项、主题/模式选项未翻译）。

## [1.10.1] - 2026-08-15

### 优化
- 图标统一为单色描边 SVG，替换原型与应用代码中全部彩色 emoji（📱📺📟⚠️⛔🌓⚙📋），
  遵循 `prototype/design-system/icon.html` 规范，支持 `currentColor` 随主题/语义着色。
- 新增内联 SVG sprite（`icon-phone/tablet/tv/warning/ban/copy/theme/settings`）与各页
  `.icon` 基础类，设备选择、主题切换、设置、注意事项、危险警告、复制反馈等改用单色图标。
- `theme.js` 浮动按钮 `🌓` 改为内联单色主题图标；`i18n.js` 设备文案与确认弹窗去除 emoji 前缀。

### 文档
- `design-system/icon.html` 补充「禁止彩色 emoji 充当图标」「纯文本对勾字符可保留」规范。

## [1.10.0] - 2026-08-15

### 新增
- 中英文界面切换（feat，向后兼容，minor 升级）：
  - 新增 `prototype/app/i18n.js` 国际化模块：内置 zh-CN / en-US 双语字典，
    提供 `window.MiI18n`（`get` / `setLang` / `apply` / `t` / `riskLabel`），
    语言偏好持久化于 `localStorage` 键 `miac-lang`。
  - 顶栏新增语言切换按钮 `#langBtn`：循环切换「简体中文 / English」，
    文案同步显示「EN」「中」；根页与原型页入口均已接入。
  - 静态文案通过 `data-i18n` / `data-i18n-placeholder` / `data-i18n-html` 属性
    驱动，切换语言时实时刷新页面文本、占位符与 `<html lang>`。
  - 设置面板新增「界面语言」下拉（简体中文 / English），与顶栏按钮双向同步。
  - 风险等级标签（安全 / 谨慎 / 危险）改为运行时从 i18n 模块实时取值，
    确保语言切换后标签正确刷新。
  - 语言切换事件 `langchange` 触发分类列表与命令输出重渲染，保持视图一致。

### 其他
- 全仓库版本展示（README、各 index.html、脚本、prototype 页面、apk-data.js、
  JSON-LD softwareVersion）统一刷新至 `v1.10.0`。

## [1.9.1] - 2026-08-15

### 新增
- 勾选区新增「取消全选」按钮：位于「勾选要清理的应用」搜索框右侧，一键取消当前
  已勾选的全部应用，不影响自定义包名文本框内容（与步骤 5 的「清空勾选」区分，
  后者同时清空自定义文本）。
- `app.base.css`：搜索行改为 flex 布局，输入框与按钮同行排列；新增 `.search-action`
  按钮样式，窄屏不换行。

### 修复
- `prototype/app/index.html`：移除对已删除 `app.js` 的脚本引用，改为拆分后的
  `app.state.js` + `app.ui.js`，并补挂 `i18n.js`，修复原型入口不可用问题。
- 校正 `app.state.js` / `app.ui.js` / `i18n.js` / `settings.js` 头注释版本漂移
  （此前误标为 v1.10.0），回落至 v1.9.1，与 VERSION 单一来源保持一致。

## [1.9.0] - 2026-08-15

### 功能
- 危险操作强化警示（feat，向后兼容，minor 升级）：
  - **卸载模式切换弹窗**：用户选择「卸载（uninstall）」时强制 `confirm()` 危险确认，
    取消则自动回退到「禁用」模式并提示。
  - **复制命令弹窗**：点击「复制全部命令」且输出含 `pm uninstall` 时，复制前二次
    `confirm()` 确认，拒绝则不复制（高危操作防护）。
  - **常驻红色警告条**：卸载模式选择区下方新增 `.warn-banner` 红色显眼提示
    （默认隐藏，切换卸载模式时显示），明确卸载不可恢复风险。
  - **底部风险提示加粗**：`notice` 中「备份数据」「核心组件严禁精简/变砖」「核对包名」
    等关键句以 `<strong>` 加粗并着危险色。
  - **危险跳过行红色加粗**：`generate.js` 自动跳过的危险组件说明改用 `.c-skip`
    红色样式，输出区更直观。

### 其他
- 新增 `.warn-banner` 与 `.notice strong` 样式（`prototype/app/app.components.css`）。
- 全仓库版本展示（README、各 index.html、脚本、prototype 页面、governance 文档、
  JSON-LD softwareVersion）统一刷新至 `v1.9.0`。

## [1.8.4] - 2026-08-15

### 修复
- 修复 `prototype/app/app.css` 头注释版本漂移（v1.8.1 → v1.8.4），消除 CI 版本校验风险。
- 修复根 `index.html` 的 `<meta name="theme-color">` 硬编码蓝色（`#2a6df4`）与品牌橙
  （`#ff6900`）脱节：默认值改为品牌橙，并新增 `theme.js` 在主题切换时同步该 meta，
  使移动端状态栏/地址栏随浅色（橙）或深色（深背景）变化。

### 文档
- 新增 `openspec/specs/design-system/spec.md`：覆盖设计令牌单一来源、主题三态、组件库
  可复用、风险语义统一、交互反馈规范、原型数据同源与版本标注，填补 prototype 无架构级
  契约的缺口。
- 更正 `openspec/specs/site/spec.md` 与 `openspec/project.md`：prototype 实为高保真核心
  交付物（非「历史/参考原型」），并修正 theme.js 描述（持久化于 localStorage，非 URL 参数）。

### 其他
- 交互标准 `prototype/interaction/index.html` 补充「命令复制反馈」与「危险包名拦截」规范卡，
  与 design-system 契约对齐。
- 同步 VERSION 与各 CI 版本一致性覆盖文件至 v1.8.4。

### 重构
- 拆分 `prototype/app/app.css`（236 行）为基础布局层 `app.base.css` 与组件层 `app.components.css`，
  主文件改为纯 `@import` 编排入口（设计令牌单一来源仍由 `app.base.css` 引入 `tokens.css`）。
- 拆分 `prototype/app/app.js`（212 行）为状态数据层 `app.state.js` 与交互 UI 层 `app.ui.js`
  （通过 `window.MiState` 暴露状态，复刻 render/generate/settings 的全局契约模式）。
- 根 `index.html` 的步骤区、hero、风险说明与 SEO 语义块补充语义化 `id`，便于锚点与自动化测试。
- `apk-data.js` / `tokens.css` / 根 `index.html` / 两个 `.bat` 因 openspec 硬契约
  （Python 正则解析、设计令牌单一来源、站点根入口与 SEO 内联、单文件交互分发）按
  `project.md`「具体能力约定优先于通用规则」原则作为拆分例外，bat 采用 `:label` 子例程分段。

## [1.8.3] - 2026-08-15

### 文档
- 新增 `openspec/` 项目规范目录（OpenSpec 轻量级规范工作流）：
  - `openspec/AGENTS.md`：AI agent 工作流说明（何时提 change、目录约定、快速命令）。
  - `openspec/project.md`：项目级规范与上下文（单一事实来源，不持版本号）。
  - `openspec/specs/data-source/spec.md`：单一数据源（`apk-data.js`）契约——结构化导出、
    `risk` 字段强制、设备分组、禁止重复维护。
  - `openspec/specs/scripts/spec.md`：离线脚本契约——复用数据源、子命令（interactive/check/backup）、
    仅依赖标准库、版本标注。
  - `openspec/specs/site/spec.md`：静态站点契约——零依赖、复用数据源、危险包名拦截、
    SEO/GEO 基础设施、EdgeOne 部署、版本标注。

### 修复
- 修复全仓库版本漂移（主版本已至 `v1.8.2`，但多处文件仍停留在 `v1.8.1`）：
  统一 `apk-data.js`、根 `index.html`（头注释+页面显示）、`scripts/*.bat`（标题+头注释）、
  `scripts/*.py`（头注释+运行打印）、`docs/commands.md`、`prototype/README.md`、
  `prototype/app/*`（index.html + app.js/generate.js/render.js/settings.js）、
  `prototype/interaction/index.html`、`prototype/index.html` footer、`prototype/theme.js`、
  `docs/governance/{SUPPORT,SECURITY,CODE_OF_CONDUCT}.md`、`CONTRIBUTING.md` 至 `v1.8.3`。
- 上述均为 CI 版本一致性校验覆盖文件与一致性补充文件，消除再次触发校验失败的风险。

## [1.8.2] - 2026-08-14

### 修复
- 组件库子页 `components/base.html` / `composite.html` / `business.html` 原为孤立页面
  （无侧栏导航，从门户进入后无法返回）：统一接入 `.doc` 双栏 + 跨页导航组；并修正其
  `doc.css` 引用路径（原误写为同目录 `doc.css`，改为 `../design-system/doc.css`）。
- `theme.js` 自动注入浮动主题切换按钮（🌓），填补「设计系统文档声明三态控件」与
  「除 app 外各原型页实际无入口」的不一致；应用原型顶栏已自带 `#themeBtn` 时自动跳过。
- 应用原型 `settings.js` 未监听 `themechange` 事件：顶栏主题按钮（`cycleTheme`）切换后，
  设置面板的「外观主题」下拉不同步；已增加监听回填，并修正过时注释。

### 其他
- 版本单一来源同步至 v1.8.2。

## [1.8.1] - 2026-08-14

### 改善
- 组件库 `prototype/components/business.html` 增补 app 真实业务组件：RiskFilter（风险筛选）、
  SearchBar（搜索栏）、SettingsPanel（设置面板）、Toast（轻提示）、EmptyState（空状态），
  使组件库成为应用原型 UI 的镜像；`components.css` 同步补充对应样式。
- 设计系统 `color.html` 新增「无障碍对比度」小节：基于真实 token 色值核算关键组合的
  WCAG 2.1 AA 对比度（Text 16:1 / Text-2 7.4:1 / Text-3 2.6:1 / Primary 2.9:1 / Primary-text 5:1），
  并标注 Text-3 与橙底白字的使用约束。
- 交互标准页 `interaction/index.html` 反馈区新增「加载态 Loading」规范卡片，明确即时操作
  用按钮禁用态 + Toast、长任务须显示持续态或进度。
- 版本单一来源同步至 v1.8.1。

### 修复
- 统一全仓库版本展示至 v1.8.1，修复 README 与 apk-data.js 版本滞后导致 CI 版本校验失败的问题。
- 修复 `scripts/xiaomi-apk-cleanup.py` 的 `check` 命令依赖 shell `grep` 的跨平台缺陷，
  改为纯 Python 解析 `pm list packages` 输出并整行精确匹配，避免 Windows 下失败与子串误判。
- 修复应用原型顶栏主题按钮（🌓）无响应问题：在 `prototype/theme.js` 暴露全局 `cycleTheme`，
  三态循环 浅色/深色/跟随系统。
- 原型渲染为分类与包名行生成语义化 id（`cat-<i>`、`pkg-<pkg>`）便于锚点与自动化测试；
  搜索框增加轻量防抖、按钮绑定增加防御性空检查以提升鲁棒性。
- 同步治理文档（SECURITY/SUPPORT/CODE_OF_CONDUCT）版本至 v1.8.1，并更新 SECURITY 支持版本表为 v1.8.x。

## [1.8.0] - 2026-08-14

### 新增
- SEO 基础设施：新增 `robots.txt`、`sitemap.xml`（`robots.txt` 排除原型归档目录，
  `sitemap.xml` 提交首页与各机型包名清单文档）。
- GEO 基础设施：新增 `llms.txt`（遵循 llmstxt.org 规范），提供机器友好的项目概览、
  风险分级、命令模板与文档索引，便于生成式引擎（ChatGPT / Claude / 豆包等）引用。
- 首页 `index.html` 增强 SEO meta：补充 keywords、author、canonical、Open Graph、
  Twitter Card、theme-color；新增 JSON-LD 结构化数据（`WebApplication` + `FAQPage`）。
- 首页注入 `.seo-content` 语义化内容块（含 `<noscript>` 回退），使无 JS 环境与爬虫
  可读到设备分类、风险分级与文档链接，提升可索引性与 GEO 命中。
- CI 新增「SEO / GEO 基础设施」校验步骤：确保 `robots.txt`/`sitemap.xml`/`llms.txt`
  存在且关键字段（canonical、OG、sitemap 首页 loc、llms.txt H1）有效。

### 样式
- `prototype/app/app.css`：新增 `.seo-content` 视觉弱化处理样式（非 display:none，
  保留爬虫与屏幕阅读器可读），版本单一来源同步至 v1.8.0。

### 修复
- 统一原型全站版本号：修正此前 app 系列（v1.8.0）与门户/设计系统/组件库/交互页
  （v1.7.1）及 `VERSION`（v1.7.0）之间的版本漂移，全部对齐至 v1.8.0
  （设计系统/组件库规范文档自身的 v1.0.0 文档版本语义保留不动）。

### 改善
- 应用原型 `prototype/app/index.html` 顶栏新增主题切换按钮（🌓），调用 `theme.js`
  的 `cycleTheme()` 三态循环（浅色/深色/跟随系统），与门户、设计系统页主题体验一致；
  此前 app 仅能跟随系统、无手动切换入口。

## [1.7.1] - 2026-08-14

### 新增
- 风险等级筛选：步骤③清单顶部的「安全 · 谨慎 · 危险 · 全部」图例改为可点击筛选
  控件（`data-filter` 委托事件），点击按风险等级过滤列表项；选中态高亮（`.active`），
  与搜索框、设备切换、勾选记忆叠加生效。`render.js` 新增 `riskFilter` 参数，
  `app.js` 增加 `setRiskFilter()` 驱动重渲染。

### 样式
- 站点首页 `index.html` 版本号由顶栏移至页脚免责声明区，布局更紧凑。
- `prototype/app/app.css`：`.pkg` 列表项包名与描述增加 `white-space: nowrap` +
  省略号截断，避免双列网格下长文本溢出；`.wrap` 容器最大宽度收紧为 1080px。
- 版本单一来源同步至 v1.7.1。

## [1.7.0] - 2026-08-14

### 新增
- 线上工具 `index.html` 步骤③应用清单新增搜索框：支持按包名或描述实时过滤，
  与原型 `prototype/app/index.html` 的搜索交互完全对齐（依赖 `app.js` 既有
  `#search` 监听逻辑，无需改动原型代码）。

### 修复
- 完成 `scripts/xiaomi-apk-cleanup.bat` 离线精简清单与 `apk-data.js` 单一数据源的
  对齐：补全 1.6.14 单向扩充时遗漏的手机端约 68 个、电视盒端 15 个包名，使 bat 内置
  `PKG_PHONE`/`PKG_TV` 离线镜像与数据源安全子集（risk≠danger）完全一致。
- 跨平台脚本 `xiaomi-apk-cleanup.py` 本就以 `apk-data.js` 为单一数据源，无需改动。

### 其他
- 版本单一来源同步至 v1.7.0。

## [1.6.13] - 2026-08-14

### 文档
- 优化 `README.md`：
  - 新增目录锚点（TOC），提升长文档导航体验。
  - 移除头部本地绝对路径（`e:/Github/MiAppClean`），改为仓库链接。
  - 目录结构图去重 `CONTRIBUTING.md`，补充 `theme.js`，理顺分组。
  - 在线使用章节开头澄清根 `index.html`（线上工具）与 `prototype/`（本地原型）的区别。
  - 删除命令说明表中冗余的 `com.miui....` 重复行。
  - 精简「本地忽略建议」段落，说明仓库已有 `.gitignore` 并改为补充建议。
- 全仓库展示版本（README、bat 标题/头注释、py 头注释/打印、apk-data.js、
  index.html、prototype 各页面）统一刷新至 `v1.6.13`。

### 样式
- 精简清单列表由单列改为双列网格（`render.js` 列表项包入 `.pkg-grid`，
  `app.css` 用 `grid-template-columns: 1fr 1fr` + 1px 间隙分隔线），
  窄屏（≤640px）自动回退单列，提升信息密度与可读性。

### 结构
- 收纳根目录散落文件，减少根目录条目：
  - 新增 `scripts/`：`xiaomi-apk-cleanup.bat` / `xiaomi-apk-cleanup.py` /
    `MIUI-lite-for-Letv-X600.bat` 统一入口（`.py` 数据源路径改为 `../apk-data.js`）。
  - 新增 `docs/`：`commands.md`（命令模板）、`lists/`（5 个机型包名清单，
    改为英文 kebab-case 命名）、`governance/`（CODE_OF_CONDUCT / LICENSE /
    SECURITY / SUPPORT 治理文件）。
  - `index.html`、`apk-data.js`、`prototype/`、`README.md`、`CHANGELOG.md`、
    `CONTRIBUTING.md`、`VERSION` 等站点根与契约文件保持原位（部署绝对路径依赖）。
- 同步更新 `ci.yml` 版本校验路径、`README.md` 与 `CONTRIBUTING.md` 全部引用链接。

## [1.6.12] - 2026-08-14

### 新增
- 深色 / 浅色 / 跟随系统 三态外观主题切换，复用 `prototype/theme.js` 与
  `prototype/design-system/tokens.css` 深色令牌，首屏同步执行避免闪烁，
  选择持久化于 `localStorage`。
- 设置面板（齿轮按钮唤起），包含合理设置项：
  - 外观主题：浅色 / 深色 / 跟随系统
  - 默认操作模式：禁用（推荐）/ 卸载
  - 记忆上次勾选：跨筛选与设备切换保留勾选（可关闭清空）
  - 复制成功后提示：复制 adb 命令后的轻提示开关
- 应用逻辑按职责拆分，新增 `render.js`（分类渲染）、`generate.js`（命令生成）、
  `settings.js`（设置管理），单一数据源 `apk-data.js` 不变。

### 文档
- 新增社区健康文件，完善 GitHub 仓库 About 导航与协作规范：
  - `CODE_OF_CONDUCT.md`：基于 Contributor Covenant v2.1 的行为准则。
  - `LICENSE`：采用 MIT 许可证（Copyright © 2026 MiAppClean）。
  - `SECURITY.md`：漏洞私密举报流程、支持版本与免责提示。
  - `SUPPORT.md`：支持渠道（Issues/Discussions）与自助排查指引。
- 同步 `CONTRIBUTING.md` 结构图与版本号至 `v1.6.12`。
- 全仓库展示版本（README、bat 标题、py 头注释/打印、apk-data.js、各 index.html
  与 prototype 页面）统一刷新至 `v1.6.12`。

## [1.6.11] - 2026-08-14

### 新增
- 数据涵盖最新 HyperOS（澎湃）系统内置应用：
  - `phone` 新增「HyperOS 系统应用」「HyperOS 小米服务」「HyperOS 广告与分析」
    「HyperOS Google 服务（国行可精简）」四个分类，补全安全中心、小爱、
    云服务、推送框架、WebView 等典型可精简/谨慎组件。
  - `tv` 新增「HyperOS 电视盒应用（澎湃 TV）」分类，补充电视账号、视频播放器、
    系统升级、PatchWall、画质引擎等 TV 端内置应用。
  - 沿用 safe / caution / danger 三级风险，未搬运含系统核心的候选全集，避免误精简。
- 版本单一来源同步至 v1.6.11：VERSION、README、bat、`apk-data.js`、
  `index.html`、`prototype/app/index.html`、`prototype/index.html`、
  `prototype/README.md`、精简命令文档。
- `README.md` 新增「推荐 ADB 工具」章节：列举 ADB AppControl、甲虫 ADB 助手、
  Shizuku+冰箱、scrcpy、无线 ADB、官方 Platform-Tools、Swift Backup/oandbackupx
  等图形与命令行工具，并给出与本项目脚本的配合使用建议。

### 完善
- 原型与设计规范收口：
  - 设计系统总览（`design-system/index.html`）新增「无障碍基线 Accessibility」章节，
    明确键盘可达、可见焦点、对比度、语义标签、触控目标、动效偏好六项 WCAG 2.1 AA 基线。
  - 应用原型（`app/`）新增包名搜索框，支持按包名/描述实时过滤，并持久保留勾选状态
    （跨搜索与设备切换不丢失）；无匹配结果时展示空状态提示。
  - 交互标准页（`interaction/index.html`）版本标识对齐至真实版本，与门户导航同源。
  - 修复 `doc.css` 头注释版本滞后（v1.6.10 → v1.6.11）；清理 CHANGELOG 重复的 1.6.11 小节。

## [1.6.10] - 2026-08-14

### 文档
- 统一全仓库版本展示至 `v1.6.10`：同步 `prototype/README.md`、清单模板
  `精简小米手机MIUI及电视盒app命令.md`、`xiaomi-apk-cleanup.py` 头注释与运行
  打印版本（此前滞后为 `v1.6.8`）。
- 更新 `CONTRIBUTING.md` 项目结构图：反映实际布局（`.md` 清单、`index.html`
  静态站点、`theme.js`、`.github/workflows/` 部署流程），移除已归档的旧版
  `.html/.css/.js` 前端引用。
- 完善 `CONTRIBUTING.md` CI 校验说明：列出版本一致性覆盖的全部文件。
- `README.md` 本地忽略建议已含 `.code-workspace` 等条目（确认同步）。

### 变更
- 增强 `.github/workflows/ci.yml` 版本校验断言：新增对 `index.html`、`xiaomi-apk-cleanup.py`、
  `精简小米手机MIUI及电视盒app命令.md`、`prototype/README.md` 的版本覆盖，
  防止头注释/展示版本再次遗漏。

## [1.6.10] - 2026-08-14

### 文档
- 完善 `CONTRIBUTING.md` 贡献指南：
  - 目录结构图补充各 `*.md` 包名清单、`index.html` 站点首页、`theme.js` 主题逻辑，
    并将 `.github/workflows/` 单独列出（CI 校验 + 部署）。
  - 明确 CI 版本一致性校验的扫描范围：CHANGELOG / README / index.html /
    `xiaomi-apk-cleanup.bat` / `apk-data.js` / `xiaomi-apk-cleanup.py` /
    `精简小米手机MIUI及电视盒app命令.md` / `prototype/app/index.html` /
    `prototype/README.md`，并补充 `python3 -m py_compile` 语法检查项。
- 版本单一来源同步至 v1.6.10：VERSION、README、`index.html`、
  `prototype/app/index.html`、`xiaomi-apk-cleanup.bat`（头注释 + TITLE）、
  `apk-data.js`、`xiaomi-apk-cleanup.py`（头注释 + 打印）、
  `精简小米手机MIUI及电视盒app命令.md`、`prototype/README.md`、
  `prototype/index.html` footer 与 prototype 各组件头注释。

## [1.6.9] - 2026-08-14

### 新增
- 支持部署到腾讯云 EdgeOne Pages 在线使用：
  - 新增站点入口 `index.html`：直接承载精简工具（选择设备/模式/勾选/生成命令），
    首页即工具、无需跳转，复用 `prototype/app` 的样式与交互逻辑。
  - 新增 `.github/workflows/deploy.yml`，推送 `master`/`main` 时自动部署至 EdgeOne。
  - 将 `prototype/app/index.html` 对数据源的引用改为绝对路径 `/apk-data.js`，
    以仓库根为托管根，保持「apk-data.js 单一数据源」不被复制。
  - 补充 `README.md` 在线使用与自行部署说明，以及本地预览命令。
- 版本单一来源同步至 v1.6.9：VERSION、README、`index.html`、
  `prototype/app/index.html`、`apk-data.js` 头注释。
- 原型新增深浅色主题切换功能：
  - `tokens.css` 将深色变量从 `@media (prefers-color-scheme)` 扩展为同时支持
    `[data-theme="dark"]` 手动深色与 `:root:not([data-theme])` 跟随系统，
    `[data-theme="light"]` 显式强制浅色。
  - 新增 `prototype/theme.js`：三态切换控件（浅色/深色/跟随），`localStorage` 持久化，
    首屏同步应用避免闪烁，监听系统偏好（仅跟随模式）。
  - 全部 13 个真实原型页面在 `<head>` 引入 `theme.js`；设计系统总览页补充主题切换说明。
  - prototype 各文件头注释与门户 footer 统一至 v1.6.9。

## [1.6.8] - 2026-08-14

### 修复
- 消除数据源歧义与重复隐患：
  - 修正 `xiaomi-apk-cleanup.bat` 误导性注释「内置清单与 apk-data.js 一致」，改为明确
    其为 `apk-data.js` 的安全包子集**离线镜像**，并标注「更新 apk-data.js 后需手动同步
    内置清单」，避免维护者误以为二者自动一致导致数据漂移。
  - 在 bat 内嵌清单区补充指向权威源 `apk-data.js` 的说明，保留无 Python/Node 环境的
    纯 Windows 离线可用性。
- 扩展 `README.md` 数据源关系说明：明确 `apk-data.js` 为唯一权威来源；界定三个可执行
  入口定位（原型 html / py 数据源驱动 / bat 离线镜像）；说明各 `*.md` 清单为衍生展示
  而非独立数据源。
- 版本单一来源同步至 v1.6.8：VERSION、README、prototype/README.md、
  `prototype/app/index.html`、`prototype/index.html` footer、`apk-data.js`、
  `xiaomi-apk-cleanup.bat`（头注释 + TITLE）、`xiaomi-apk-cleanup.py`（头注释 + 打印）、
  `精简小米手机MIUI及电视盒app命令.md` 头版本。

## [1.6.7] - 2026-08-14

### 变更
- 将全部 6 个 `.txt` 清单/命令模板转换为 Markdown 格式，提升可读性与渲染效果：
  - 5 个 App 包名清单：`小米MIUI应用列表` / `MIUI14-App清单` / `小米13内置App清单` /
    `小米平板5内置App清单` / `HyperOS-App清单` 转为 `.md`，注释行转为引用块、
    分隔线与 H1 标题，包名列表转为无序代码列表。
  - 命令模板 `精简小米手机MIUI及电视盒app命令.md` 由 `.txt` 转换而来，按分类组织代码块
    （命令示例、目录位置、风险与恢复说明），统一头版本为 v1.6.7。
  - 原 `.txt` 文件全部删除，项目根目录不再保留纯文本清单。
- 同步更新所有引用上述文件名的文档与代码：README（目录结构、文件说明表、正文引用）、
  CONTRIBUTING（结构图）、`prototype/archive/xiaomi-apk-cleanup.html`（粘贴提示）、
  以及各清单 `.md` 内的关联脚本引用。
- 版本单一来源同步至 v1.6.7：VERSION、README、prototype/README.md、
  `prototype/app/index.html` 展示版本。
- 原型设计令牌单一来源与可访问性清理（审查后续修复）：
  - 消除组件库/应用中的硬编码色值：`.btn-danger` 的 `#fff` 改为 `--color-text-invert`，
    `.notice code` 的 `rgba(0,0,0,.06)` 改为 `--color-surface-3` + `--radius-sm`。
  - 抽取重复内联布局为令牌类：组件演示页新增 `.doc-page`/`.doc-h1`/`.doc-lead`/`.showcase-grid`/
    `.card-link`，设计系统页新增 `.token-code`，替换各 `index.html`/`base.html`/`business.html`/
    `composite.html` 的内联 `style`。
  - 增强可访问性（WCAG AA）：分段控件加 `role="radiogroup"` 与 `aria-label`，按钮/复选/
    包名行补 `aria-label`，输入绑定 `label for` 与 `aria-invalid`，抽屉补 `aria-modal`。

## [1.6.6] - 2026-08-14

### 修复
- 修复应用原型 `prototype/app/index.html` 在 `file://` 下数据无法读取导致白屏的问题：
  在 `apk-data.js` 末尾显式暴露 `window.APP_DATA`，并在 `app.js` 中对数据源做空值守卫，
  缺失时显示友好提示而非崩溃。
- 统一原型各文件头注释与展示版本号至 v1.6.6：根 `index.html` footer 由 v1.0.0 更正为
  当前版本，修正 `app.js` / `app.css` / `tokens.css` / `components.css` / `doc.css` 残留的
  v1.6.2 头注释。
- 为 `prototype/archive/xiaomi-apk-cleanup.html` 增加「已废弃」标注并指向现行原型
  `prototype/app/index.html`，避免误用历史版本。

## [1.6.4] - 2026-08-14

### 修复
- 修正 `xiaomi-apk-cleanup.bat` 窗口标题版本号（`TITLE 小米 APK 精简工具 v1.4.0`
  → `v1.6.4`），此前长期未随版本升级更新，与实际版本脱节。
- 同步 `apk-data.js` 头注释版本号 `v1.6.2` → `v1.6.4`，消除头注释与实际版本不一致。

### 变更
- 删除空的 `tsconfig.json`（项目无 TypeScript 源码，属遗留冗余文件）。
- 完善 `README.md` 目录结构图：补充 `.github/workflows/ci.yml` 与
  `CONTRIBUTING.md`，反映实际文件布局。
- 增强 CI 版本校验：新增对 `xiaomi-apk-cleanup.bat` 标题版本与 `apk-data.js`
  头注释版本的断言，防止版本号再次遗漏。

### 说明
- 版本升级至 v1.6.4（版本号修正与文档完善，patch 级）。

## [1.6.3] - 2026-08-14

### 修复
- 真正完成旧版网页原型归档：将根目录 `xiaomi-apk-cleanup.html/.css/.js` 与
  `xiaomi-apk-cleanup.extra.js` 移入 `prototype/archive/`，根目录仅保留脚本、
  清单数据与 `apk-data.js` 单一数据源（此前 v1.6.2 仅文档声明未实际移动）。
- 修正 `精简小米手机MIUI及电视盒app命令.txt` 第 16 行 `pm list package` 拼写错误为
  `pm list packages`，与文件其余处命令保持一致。
- 修复 `xiaomi-apk-cleanup.py` 的 `check` 子命令误判：原 `pm list packages <pkg>` 为
  前缀匹配，改用 `grep -x` 精确匹配，避免前缀命中导致的存在性误判。

### 变更
- 同步各文件头注释与展示版本号至 v1.6.3：
  `xiaomi-apk-cleanup.py`、`xiaomi-apk-cleanup.bat`、`prototype/app/index.html`、
  `prototype/README.md`；README 页脚与仓库路径引用也已更新。
- 将 CI 版本校验目标由已归档的根目录 `xiaomi-apk-cleanup.html` 改为
  `prototype/app/index.html`，避免归档后 CI 失败。
- 更新 README 与 CONTRIBUTING 的目录结构图，反映 `prototype/` 目录与归档状态，
  并修正 README 中过时的仓库路径 `MIUI-and-MiBox-Lite` → `MiAppClean`。

## [1.6.2] - 2026-08-14

### 新增
- 建立 `prototype/` 高保真原型与规范体系（纯 HTML，零运行时依赖）：
  - 设计系统 `design-system/`：设计令牌 `tokens.css` 单一来源（色彩/字体/间距/圆角/动效/阴影）+ 色彩/字体/间距/图标/动效规范页。
  - 组件库 `components/`：基础/复合/业务三层组件可视化示例与 `components.css` 实现样式。
  - 交互标准 `interaction/`：模式/反馈/错误/空状态统一规范。
  - 高保真可交互应用原型 `app/`：5 步流程，复用根目录 `apk-data.js` 真实数据。
  - 原型门户 `prototype/index.html` 与各规范 README。

### 变更
- 精简项目结构：旧版网页原型（`xiaomi-apk-cleanup.html/.css/.js` 与增强模块 `.extra.js`）
  移入 `prototype/archive/`，根目录仅保留脚本、清单数据与 `apk-data.js` 单一数据源。
- 明确 `apk-data.js` 为前端原型与 bat/py 脚本共用的唯一数据源，消除重复维护。

### 说明
- 版本对齐 README 显示版本，由 v1.6.1 升级至 v1.6.2（结构/文档变更，patch 级）。

## [1.6.1] - 2026-08-14

### 文档
- 完善 `CONTRIBUTING.md`：统一项目名为 MiAppClean，补充目录结构图与 `cat` 字段约定、
  编码规范（单文件 ≤200 行拆分、文件头版本注释）、分支与 PR 流程、修正校验章节
  （移除不存在的 `check_data.py` 引用，改为 `node --check` 与 CI 工作流说明）。
- `README.md` 新增「贡献指南」章节并链接 `CONTRIBUTING.md`。
- 版本升级至 v1.6.1（文档完善，patch 级）。

## [1.6.0] - 2026-08-14

### 新增
- 前端新增 `xiaomi-apk-cleanup.extra.js`：搜索/筛选、自定义清单风险预览、配置导入导出。
- 网页支持 **搜索框**（按包名/描述过滤）与 **风险筛选**（全部/安全/谨慎/危险）。
- 自定义包名文本框实时渲染 **风险预览**，逐行标注 safe/caution/danger/未知并统计。
- 支持 **导出/导入配置（JSON）**，保存或分享精简方案（设备/模式/勾选/自定义）。

### 变更
- `README.md` 补充网页搜索/预览/导入导出用法与 extra.js 文件说明。
- 因 `.gitignore` 在本环境受保护无法写入，改为在 README「本地忽略建议」小节说明
  `backup-*.txt` / `*.cleanup.json` 等忽略规则。

### 说明
- 版本升级至 v1.6.0（纯前端增强，向后兼容）。

## [1.5.0] - 2026-08-14

### 新增
- `xiaomi-apk-cleanup.py` 增加 `check` 子命令：预检设备上真实存在的推荐包，便于精简前确认。
- `xiaomi-apk-cleanup.py` 增加 `backup` 子命令：导出当前已安装包快照（backup-时间戳.txt），便于误操作后定位恢复。
- 5 份机型包名清单（HyperOS / MIUI14 / 小米13 / 小米MIUI通用 / 平板5）新增风险分级警示头，
  标注 danger 核心组件（settings/systemui/telephony/launcher 等）严禁精简。

### 变更
- `CONTRIBUTING.md` 修正失效的校验脚本引用，改为内联预检命令。
- `README.md` 补充 Python 脚本 `check` / `backup` 子命令用法。

### 说明
- 版本升级至 v1.5.0（新增预检与备份能力，向后兼容）。

## [1.4.1] - 2026-08-14

### 文档
- 完善 `CONTRIBUTING.md`：统一项目名为 MiAppClean，补充目录结构图、`cat` 字段约定、
  编码规范（单文件 ≤200 行拆分、文件头版本注释）、分支与 PR 流程、修正校验章节
  （移除不存在的 `check_data.py` 引用，改为 `node --check` 与 CI 工作流说明）。
- `README.md` 新增「贡献指南」章节并链接 `CONTRIBUTING.md`。
- 版本升级至 v1.4.1（文档完善，patch 级）。

## [1.4.0] - 2026-08-14

### 新增
- 新增 `xiaomi-apk-cleanup.py`：跨平台精简脚本（Python），解析 `apk-data.js` 单一数据源，
  macOS / Linux / Windows 通用，自动校验 adb 可用性并跳过 danger 级核心组件。
- 新增 `.github/workflows/ci.yml`：提交/PR 时自动校验版本一致性与数据完整性。
- 新增 `CONTRIBUTING.md`：贡献指南，约定数据格式与版本提交规范。

### 变更
- `apk-data.js` 各包名条目新增 `risk` 字段（safe / caution / danger），作为风险分级单一数据源。
- 前端 `xiaomi-apk-cleanup.*` 联动 risk：渲染风险标签与配色，danger 级组件自动跳过并在输出中提示。
- `xiaomi-apk-cleanup.bat` 更新风险分级说明，标注内置清单不含 danger 级核心组件。
- `README.md` 补充 Python 脚本与风险分级说明。

### 说明
- 版本升级至 v1.4.0（在命名变更 v1.3.0 之上新增跨平台脚本与校验，向后兼容）。

## [1.3.0] - 2026-08-14

### 变更
- 项目正式命名为 **MiAppClean**（原 `MIUI & MiBox Lite`），更新 `README.md` 标题、
  仓库路径注释与目录树根名。
- 保留原仓库目录名（`MIUI-and-MiBox-Lite`）不变，仅更新对外展示的项目名。
- 版本升级至 v1.3.0（项目命名变更，minor 级）。

## [1.2.1] - 2026-08-14

### 修复
- 清理 `README.md`「使用清理命令网页」小节末尾遗留的孤立文字（误置于网页说明后的脚本描述句）。
- 版本升级至 v1.2.1（文档修正，patch 级）。

### 待补充（环境限制）
- 计划新增 `.gitignore` 忽略 IDE 工作区文件（`*.code-workspace`）与临时文件（`*.bak` 等），
  但因当前工作目录写入权限受限（EPERM）暂未创建，需在有写入权限的环境中补充。

## [1.2.0] - 2026-08-14

### 新增
- 新增 `xiaomi-apk-cleanup.bat`：统一精简脚本，合并原 `精简小米手机MIUI及电视盒app命令.txt`
  与 `MIUI-lite-for-Letv-X600.bat` 的精简命令，交互选择设备类型（手机/平板/电视盒）与
  操作模式（禁用/卸载），连接设备后逐条执行 `adb` 命令。
- 脚本内置与 `apk-data.js` 一致的推荐精简包名，无需手动复制粘贴。

### 修复
- 修正 `MIUI-lite-for-Letv-X600.bat` 误导性注释（实为 ROM 目录删除脚本，非 `pm enable` 恢复），
  并说明其需配合 ROM 解包目录使用。
- 修正 `README.md` 遗留版本号 `v1.0.0` → `v1.2.0`。
- 前端 `xiaomi-apk-cleanup.js` 包名渲染改用 `textContent`，消除潜在 XSS 注入风险。
- 清理 `apk-data.js` 中冗余的 `pad: []` 数据（平板复用手机清单）。

### 说明
- 版本升级至 v1.2.0（新增统一脚本，向后兼容）。

## [1.1.0] - 2026-08-14

### 新增
- 新增 `xiaomi-apk-cleanup.html`：小米安卓设备内置 APK 清理命令交互页面。
  - 支持按设备类型（手机/平板/电视盒）分类展示推荐精简清单。
  - 支持「禁用（可恢复）」与「卸载（移除）」两种模式。
  - 勾选应用后实时生成 adb 命令，支持一键复制。
  - 支持粘贴自定义包名清单（自动按行解析）。
  - 内置风险提示与免责声明区块。
- 拆分页面为 `xiaomi-apk-cleanup.html` / `.css` / `.js` / `apk-data.js`（数据逻辑分离，符合单文件 ≤200 行规范）。
- `README.md`：目录结构与文件说明表补充网页文件，使用方法新增「清理命令网页」章节。
- 版本升级至 v1.1.0（新增功能，向后兼容）。

## [1.0.0] - 2026-08-13

### 新增
- 初始化项目文档体系，统一版本为 v1.0.0。
- `README.md`：补全项目简介、目录结构、文件说明、使用方法、命令说明、风险提示与免责声明。
- 为 5 个 App 清单文件（`小米MIUI应用列表.txt`、`MIUI14-App清单.txt`、`小米13内置App清单.txt`、`小米平板5内置App清单.txt`、`HyperOS-App清单.txt`）补充适用机型与用途说明头。
- `精简小米手机MIUI及电视盒app命令.txt`：补充文件头说明、执行前核对命令、禁用/卸载恢复命令与风险警示区块。
- `MIUI-lite-for-Letv-X600.bat`：补充脚本注释头（适用机型、作用、用法与风险）。
- 新增 `VERSION` 与 `CHANGELOG.md` 作为版本单一来源。

### 说明
- 本次为文档完善，未改动任何精简命令的实际逻辑与包名清单内容。
