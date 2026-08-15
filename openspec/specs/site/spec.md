# 能力规范：site（静态站点工具）

本能力规定根 `index.html`（含 `theme.js`）作为线上精简工具站点，部署到 EdgeOne Pages。

## Requirements

### Requirement: 纯静态零依赖
站点仅用浏览器原生 API 与同一 `apk-data.js`，不得引入框架或构建步骤。

#### Scenario: 直接打开即用
- **Given** 部署后的 `index.html`
- **When** 用户选择设备 → 模式 → 勾选应用
- **Then** 实时生成 adb 命令，无需后端

### Requirement: 复用数据源
站点读取的包名须来自 `apk-data.js`，与脚本同源。

#### Scenario: 设备列表一致
- **Given** `apk-data.js` 新增设备分组
- **When** 站点加载
- **Then** 设备选择列表包含该设备，无需改两处

### Requirement: 风险分级拦截
`danger` 级包名在 UI 中默认禁用勾选或标注警告，不进入生成命令。

#### Scenario: 危险包名保护
- **Given** 某包名 `risk: "danger"`
- **When** 用户尝试勾选
- **Then** 被拦截并提示风险，生成命令不含该包名

### Requirement: SEO / GEO 基础设施
站点须含 JSON-LD 结构化数据、`canonical`、Open Graph meta；
根目录须有 `robots.txt`、`sitemap.xml`、`llms.txt`（CI 校验）。

#### Scenario: SEO 校验通过
- **Given** CI 校验 SEO/GEO
- **When** 检查 `index.html` 含 `application/ld+json` / `rel="canonical"` / `og:title`
- **Then** 全部命中，且 `sitemap.xml` 含首页 loc、`llms.txt` 首行为 H1 并引用数据源

### Requirement: 部署
推送 `master`/`main` 触发 `.github/workflows/deploy.yml`，自动发布到 EdgeOne Pages，
仓库根即站点根。

#### Scenario: 自动上线
- **Given** 推送至受保护分支
- **When** deploy workflow 成功
- **Then** 线上站点更新至最新 `index.html`

### Requirement: 版本标注
`index.html` 头注释与页面 footer 须含 `v<VERSION>`，随 `VERSION` 同步。

#### Scenario: 版本一致性
- **Given** `VERSION` = `vX.Y.Z`
- **When** CI 校验
- **Then** `index.html` 含 `vX.Y.Z`

### Requirement: 分享复制增强
「复制全部命令」须将生成的 adb 命令、**分析分享链接**与一条**随机选取的项目宣传文案**一并写入剪贴板，提升项目传播力。

#### Scenario: 复制附带分享文案
- **Given** 已生成命令且用户点击「复制全部命令」
- **When** 复制成功
- **Then** 剪贴板内容 = 命令 + 分享链接 + 随机宣传文案；每次复制文案随机抽取，不重复

#### Scenario: 多语言宣传文案
- **Given** 当前界面语言为 `en-US`
- **When** 复制
- **Then** 宣传文案取自英文池，缺失时回退中文池，绝不抛错

#### Scenario: i18n 失效降级
- **Given** `window.MiI18n` 未加载（初始化失败）
- **When** 复制
- **Then** 分享文案回退中文默认池，复制功能正常，应用不崩

## 实现细节（参考）
- `prototype/` 是高保真、可交互的设计原型与设计系统（含 `app/`、`design-system/`、
  `components/`、`interaction/`、`index.html` 门户），复用同一份 `apk-data.js`，
  是核心交付物而非历史归档；其版本须与主线 `VERSION` 保持一致（CI 版本校验覆盖）。
- `theme.js` 提供浅色/深色/跟随系统三态循环，主题持久化于 `localStorage`（键
  `miac-theme`），并在 `data-theme` 变化时同步 `<meta name="theme-color">`；
  视觉令牌单一来源为 `prototype/design-system/tokens.css`。详见
  `specs/design-system/spec.md`。
