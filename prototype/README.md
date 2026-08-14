# MiAppClean 原型（Prototype）

小米设备内置 APK 精简工具的高保真原型与设计规范。采用**纯 HTML 方案**，零运行时依赖，所有页面可直接用浏览器打开。

> 版本：v1.6.12
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
├── app/                       # 高保真可交互应用原型（真实数据）
│   ├── index.html             # 主界面（5 步流程）
│   ├── app.css                # 应用样式（基于 tokens.css）
│   └── app.js                 # 交互逻辑（复用根目录 apk-data.js 真实数据）
│
└── archive/                   # 历史归档（v1.3.0 旧版网页原型，深色风）
    ├── xiaomi-apk-cleanup.html
    ├── xiaomi-apk-cleanup.css
    └── xiaomi-apk-cleanup.js
```

## 设计原则

极简（minimal）· 高对比可读 · 移动优先 · 一致反馈。所有视觉与组件统一引用
`design-system/tokens.css` 中的语义令牌，修改品牌色只需变更令牌映射。

## 数据来源

应用原型 `app/` 与历史归档网页均复用仓库根目录的 `apk-data.js`（`APP_DATA`），
确保原型与脚本（bat/py）使用**同一份真实包名数据**，单一来源、无重复维护。

## 如何查看

直接双击打开 `prototype/index.html` 即可。无需服务器、无需构建。

- 主应用原型：`prototype/app/index.html`
- 设计规范：从门户进入「设计规范」三张卡片
