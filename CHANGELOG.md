# Changelog

本项目所有重要变更均记录于此文件。版本号遵循 [SemVer](https://semver.org/lang/zh-CN/)。

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
