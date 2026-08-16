# 能力规范：design-system（设计系统与原型）

本能力规定 `prototype/` 下的设计令牌、组件库、交互标准与高保真应用原型，
确保视觉与行为在整个原型体系中一致、可复用、零运行时依赖。

## Requirements

### Requirement: 设计令牌单一来源
所有色彩、字体、间距、圆角、动效、阴影须定义为 `prototype/design-system/tokens.css`
中的 CSS 自定义属性；页面与组件仅引用语义令牌（如 `--color-primary`），
不得硬编码具体色值。

#### Scenario: 品牌色变更只改令牌
- **Given** 品牌主色需调整
- **When** 仅修改 `tokens.css` 中 `--color-primary` 映射
- **Then** 所有引用该令牌的页面与组件自动更新，无需逐一替换

### Requirement: 主题三态一致
浅色 / 深色 / 跟随系统三态由 `theme.js` 通过 `data-theme` 与 `prefers-color-scheme`
实现；`tokens.css` 须提供浅色默认（`:root`）与深色覆盖（`[data-theme="dark"]` 及
`@media (prefers-color-scheme: dark)`），且深色模式正文对比度满足 WCAG 2.1 AA
（≥4.5:1）。

#### Scenario: 主题切换生效
- **Given** 用户点击主题按钮循环 浅色 → 深色 → 跟随系统
- **When** `theme.js` 写入 `data-theme` 或移除属性
- **Then** 页面配色随 `tokens.css` 对应作用域切换，且不出现未定义令牌导致的错色

#### Scenario: 浏览器 UI 主题色同步
- **Given** 主题应用后
- **When** `theme.js` 同步 `<meta name="theme-color">`
- **Then** 移动端地址栏/状态栏颜色随浅色（品牌橙）或深色（深背景）变化

### Requirement: 组件库可复用
`prototype/components/` 的基础与复合组件样式（`components.css`）须可直接在最终界面复用；
业务组件（设备选择、模式切换、风险标签、包名行、类别分组）须基于基础/复合组件组合，
不得重复造轮子或脱离令牌。

#### Scenario: 组件跨页一致
- **Given** `base.html` / `composite.html` / `business.html` 引用同一 `components.css`
- **When** 某组件样式调整
- **Then** 所有原型页呈现一致，无需分别维护

### Requirement: 风险语义统一
风险分级（`safe` / `caution` / `danger`）的视觉表达（色彩、徽章、拦截行为）须在
设计系统、组件库、应用原型与线上 `index.html` 间保持一致约定。

#### Scenario: 危险拦截一致
- **Given** `risk: "danger"` 的包名
- **When** 在应用原型或线上站点展示
- **Then** 均使用危险色徽章、默认禁用勾选，且生成命令排除该包名

### Requirement: 交互反馈规范
`prototype/interaction/` 须规范模式（加载/处理中）、反馈（成功 Toast / 复制成功）、
错误（阻断性对话框 / 命令注释）、空状态四类交互；应用原型实际交互须符合该规范。

#### Scenario: 复制命令反馈
- **Given** 用户点击「复制」生成 adb 命令
- **When** 剪贴板写入成功
- **Then** 出现短暂 Toast「已复制」反馈，不阻塞后续操作

### Requirement: 原型数据同源
`app/` 应用原型读取的包名须来自仓库根 `apk-data.js`，与线上站点、脚本同源。

#### Scenario: 数据源新增即同步
- **Given** `apk-data.js` 新增某设备分组
- **When** 应用原型加载
- **Then** 设备与包名列表自动包含，无需改原型两处

### Requirement: 版本标注一致
`prototype/` 各页面 footer、头注释及 `prototype/README.md` 须含 `v<VERSION>`，
随仓库根 `VERSION` 同步（CI 版本一致性校验覆盖全部 prototype 页面）。

#### Scenario: 版本一致性
- **Given** `VERSION` = `vX.Y.Z`
- **When** CI 校验
- **Then** 所有 `prototype/**` 含 `vX.Y.Z`，无 v1.8.x 旧版本残留

## 实现细节（参考）
- 入口门户：`prototype/index.html`（`.doc` 双栏布局，导航组覆盖应用/设计系统/组件库/交互）。
- 主题入口：各原型页由 `theme.js` 自动注入浮动按钮（🌓）；应用原型 `app/` 顶栏自带
  `#themeBtn`，`theme.js` 检测到则不重复注入。
- 设计系统文档版本（如 `design-system/index.html` 内标注的 `v1.0.0`）为文档自身语义版本，
  独立于仓库主线版本，不纳入 CI 版本校验。
