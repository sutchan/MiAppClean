# MiAppClean 原型（Prototype）

小米设备内置 APK 精简工具的高保真原型与设计规范。采用**纯 HTML 方案**，零运行时依赖，所有页面可直接用浏览器打开。

> 版本：v1.15.3
> 入口：`prototype/index.html`（原型门户）

## 目录结构

```
prototype/
├── index.html                 # 原型门户（导航入口）
│
├── design-system/             # 设计系统（Design Tokens + 规范）
│   ├── tokens.css             # ★ 设计令牌单一来源（色彩/字体/间距/圆角/动效/阴影）
│   ├── doc.css                # 规范展示页共享样式
│   ├── index.html             # 设计系统总览（设计原则/令牌层级）
│   ├── color.html             # 色彩规范
│   ├── typography.html        # 字体规范
│   ├── spacing.html           # 间距与圆角规范
│   ├── icon.html              # 图标规范（线性描边图标库）
│   └── motion.html            # 动效规范（缓动/时长/无障碍）
│
├── components/                # 组件库
│   ├── components.css         # 组件实现样式（可在最终界面复用）
│   ├── index.html             # 组件库总览
│   ├── base.html              # 基础组件（按钮/输入/徽章/复选/分段/卡片）
│   ├── composite.html         # 复合组件（折叠/对话框/抽屉/Toast/命令输出）
│   └── business.html          # 业务组件（设备选择/模式切换/风险标签/包名行/类别分组）
│
├── interaction/               # 交互标准
│   └── index.html             # 模式/反馈/错误/空状态
│
└── archive/                   # 历史归档（v1.3.0 旧版网页原型，深色风）
    ├── xiaomi-apk-cleanup.html
    ├── xiaomi-apk-cleanup.css
    ├── xiaomi-apk-cleanup.js
    └── xiaomi-apk-cleanup.extra.js
```

> **注：可交互应用原型已迁移至仓库根 `/app/`**（见仓库根 `README.md` 与 `CONTRIBUTING.md`）。
> 本 `prototype/` 目录仅保留设计系统、组件库、交互标准与原型门户，供本地查阅与设计参考，
> 仍为「纯 HTML 方案、零运行时依赖」。

## 设计原则

极简（minimal）· 高对比可读 · 移动优先 · 一致反馈。所有视觉与组件统一引用
`design-system/tokens.css` 中的语义令牌，修改品牌色只需变更令牌映射。

## 数据来源

可交互应用原型已迁移至仓库根 `/app/`，其数据与脚本共用仓库根目录的 `apk-data.js`
（`APP_DATA`）作为**唯一权威来源**；本 `prototype/` 目录下的设计系统、组件库、交互标准
网页由相对路径引用资源，可直接双击打开，无需服务器、无需构建。

## 如何查看

原型门户（`index.html`、`design-system/`、`components/`、`interaction/` 等）由相对路径
引用资源，可直接双击打开，无需服务器、无需构建。

- 设计规范：从门户进入「设计规范」三张卡片
- 可交互应用（已上线为主站工具）：访问仓库根 `index.html`（线上工具）或本地 `/app/index.html`
  （需以仓库根为站点根经 HTTP 托管，例如 `python3 -m http.server 8000` 后访问
  `http://localhost:8000/app/`）
