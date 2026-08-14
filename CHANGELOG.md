# Changelog

本项目所有重要变更均记录于此文件。版本号遵循 [SemVer](https://semver.org/lang/zh-CN/)。

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
