# 项目规范：MiAppClean

> 本文件为 MiAppClean 的**项目级规范与上下文**，是 `openspec/specs/` 各能力规范的上位依据。
> 版本号以仓库根 `VERSION` 为唯一来源，本文件不持有版本号。

## 1. 项目定位

MiAppClean 是一个开源的小米设备内置应用（预装 App）精简工具集。
支持小米手机（MIUI / HyperOS）、平板、电视盒（MiBox / 乐视 X600 等），
按机型分类、按风险等级（safe / caution / danger）标注内置应用包名，
并生成 `adb` 禁用（`disable-user`）或卸载（`uninstall --user 0`）命令。
危险核心组件自动拦截，避免设备变砖。

项目为**纯静态前端**，零运行时依赖；同时提供 Python / Batch 脚本作为离线入口。

## 2. 架构原则

- **单一数据源**：所有机型的推荐精简包名集中维护在根目录 `apk-data.js`，
  前端（`index.html`、prototype）与脚本（`scripts/*.py`、`scripts/*.bat`）
  均从该文件读取，**禁止在多处硬编码包名**。
- **零运行时依赖**：线上站点仅用浏览器原生 API + 同一 `apk-data.js`；
  脚本仅依赖系统自带 `adb` 与 Python 标准库。
- **风险分级强制**：每条包名记录必须标注 `risk`（safe/caution/danger）；
  danger 级在命令生成时自动排除。
- **设计系统单一来源**：视觉令牌集中于 `prototype/design-system/tokens.css`，
  组件库与交互标准见 `openspec/specs/design-system/spec.md`。
- **可恢复优先**：默认推荐 `disable-user`（可 `pm enable` 恢复），
  `uninstall` 仅作谨慎选项。

## 3. 目录与职责

| 路径 | 职责 |
|------|------|
| `apk-data.js` | 唯一数据源：各设备推荐精简包名与风险等级 |
| `index.html` + `theme.js` | 线上工具站点（EdgeOne Pages 托管根） |
| `scripts/xiaomi-apk-cleanup.py` | 跨平台脚本，解析数据源，支持交互/check/backup |
| `scripts/xiaomi-apk-cleanup.bat` | Windows 统一脚本，交互菜单 |
| `docs/lists/*.md` | 各机型内置 App 包名清单（人类可读来源） |
| `docs/commands.md` | 通用 adb 命令模板 |
| `docs/governance/` | 社区治理（CODE_OF_CONDUCT / CONTRIBUTING / LICENSE / SECURITY / SUPPORT） |
| `prototype/` | 高保真设计原型与设计系统（`app/` 应用原型、`design-system/` 令牌与规范、`components/` 组件库、`interaction/` 交互标准、`index.html` 门户），复用同一数据源，为核心交付物 |
| `openspec/` | 本规范目录（能力 specs + 变更 changes） |

## 4. 版本与发布

- 版本号遵循 SemVer，唯一来源为根 `VERSION`。
- 任意文件修改均需 bump **patch** 版本；新增功能 bump minor；破坏性变更 bump major。
- 提交前须同步：`VERSION`、`CHANGELOG.md`、各文件头注释/展示版本、
  `README.md` 顶部展示版本、线上/原型页面 footer 版本。
- CI（`.github/workflows/ci.yml`）校验版本一致性、数据源可解析性、
  `apk-data.js` 条目含 `risk`、SEO/GEO 基础设施完整性。

## 5. 贡献约束

- 数据格式、编码规范、CI 要求详见 `docs/governance/CONTRIBUTING.md`。
- 源代码文件超过 200 行须拆分（按职责/关注点）。
- 关键逻辑加中文注释；函数超过 20 行考虑拆分。
- 提交信息格式：`<type>: <description>`（feat/fix/docs/refactor/...）。

## 6. 安全与免责

- 通过 `adb shell pm` 操作设备，存在误删导致异常的风险；精简前须备份。
- 安全漏洞须私密举报（见 `docs/governance/SECURITY.md`），不在公开 Issue 披露。
- 项目仅供学习研究，因使用导致的设备损坏/数据丢失作者与贡献者不承担责任。

## 7. 规范演进

能力级契约见 `openspec/specs/`；跨能力的变更提案见 `openspec/changes/`。
本文件与 specs 冲突时，以 specs 中具体能力约定为准，并回头修订本文件。
