# MiAppClean

小米设备内置应用精简工具集（原名 MIUI & MiBox Lite）。收集了多款小米手机、平板、电视盒子的内置 App 包名清单，
并提供基于 `adb shell pm` 的精简命令模板，帮助用户移除/禁用预装应用，释放存储空间。

> 仓库地址：[github.com/sutchan/MiAppClean](https://github.com/sutchan/MiAppClean)
> 版本：`v1.15.4`

## 目录

- [目录结构](#目录结构)
- [文件说明](#文件说明)
- [在线使用（腾讯云 EdgeOne）](#在线使用腾讯云-edgeone)
- [SEO 与 GEO 优化](#seo-与-geo-优化)
- [使用方法](#使用方法)
- [推荐 ADB 工具](#推荐-adb-工具)
- [命令说明](#命令说明)
- [风险提示](#风险提示)
- [版本记录](#版本记录)
- [贡献指南](#贡献指南)
- [本地忽略建议](#本地忽略建议)
- [免责声明](#免责声明)

## 目录结构

```
MiAppClean/
├── README.md                       # 本文件（项目说明）
├── VERSION                         # 项目版本号（单一来源）
├── CHANGELOG.md                    # 版本变更记录
├── LICENSE                         # MIT 许可证（根目录，供 GitHub 识别 License 徽章）
├── index.html                      # ★ 站点首页（EO 托管根，直接承载精简工具）
├── apk-data.js                     # ★ 各机型推荐精简包名数据（单一数据源，原型与脚本共用）
├── .github/
│   ├── workflows/ci.yml            #   CI：提交/PR 时校验版本一致性与数据完整性
│   ├── workflows/deploy.yml        #   CD：推送 master/main 时自动部署到腾讯云 EdgeOne
│   ├── CODE_OF_CONDUCT.md          #   行为准则（Contributor Covenant v2.1）
│   ├── SECURITY.md                 #   安全政策（漏洞私密举报流程）
│   ├── SUPPORT.md                  #   支持渠道与自助排查指引
│   ├── FUNDING.yml                 #   赞助配置
│   ├── PULL_REQUEST_TEMPLATE.md    #   PR 模板
│   └── ISSUE_TEMPLATE/             #   Issue 模板（bug_report / feature_request）
│
├── CONTRIBUTING.md                # 贡献指南（数据/编码/版本/CI 规范）
│
├── scripts/                       # 精简脚本（统一入口）
│   ├── xiaomi-apk-cleanup.bat         #   统一精简脚本（合并手机/平板/电视盒命令，交互菜单）
│   ├── xiaomi-apk-cleanup.py          #   跨平台精简脚本（Python，复用 ../apk-data.js 数据源）
│   └── MIUI-lite-for-Letv-X600.bat    #   乐视 X600 盒子 ROM 精简脚本（历史/参考）
│
├── docs/                          # 文档与清单（被脚本/README 引用）
│   ├── commands.md                    #   通用精简命令模板（手机 + 盒子）
│   ├── lists/                         #   各机型内置 App 包名清单（apk-data.js 衍生展示）
│   │   ├── xiaomi-miui-app-list.md        #   通用 MIUI 内置 App 包名清单
│   │   ├── miui14-app-list.md             #   MIUI 14 内置 App 包名清单
│   │   ├── xiaomi-13-app-list.md          #   小米 13 内置 App 包名清单
│   │   ├── xiaomi-pad5-app-list.md        #   小米平板 5 内置 App 包名清单
│   │   └── hyperos-app-list.md            #   HyperOS 内置 App 包名清单
│   └── governance/                     #   开源治理文件
│       ├── CODE_OF_CONDUCT.md              #   行为准则（Contributor Covenant v2.1）
│       ├── LICENSE                        #   MIT 许可证
│       ├── SECURITY.md                    #   安全政策（漏洞私密举报流程）
│       └── SUPPORT.md                     #   支持渠道与自助排查指引
│
└── prototype/                     # 原型门户 + 设计规范（纯 HTML，仅供本地查阅）
    ├── index.html                 #   原型门户（入口）
    ├── design-system/             #   设计系统（tokens.css 设计令牌单一来源）
    ├── components/                #   组件库（基础/复合/业务组件）
    ├── interaction/               #   交互标准（模式/反馈/错误/空状态）
    ├── archive/                   #   历史归档（v1.3.0 旧版网页原型）
    └── README.md                  #   原型说明
    # 注：可交互应用原型已迁移至仓库根 /app（见 CONTRIBUTING 项目结构）
```

## 文件说明

| 文件 | 用途 |
| --- | --- |
| `scripts/xiaomi-apk-cleanup.bat` | 统一精简批处理脚本（合并多设备命令，交互选择设备/模式，连接设备后执行） |
| `scripts/xiaomi-apk-cleanup.py` | 跨平台精简脚本（Python，解析 `apk-data.js` 单一数据源，macOS/Linux/Windows 通用） |
| `docs/commands.md` | 通用精简命令模板，含手机与电视盒两类设备命令示例 |
| `scripts/MIUI-lite-for-Letv-X600.bat` | 乐视 X600 盒子 ROM 精简脚本（历史参考，删除 ROM 目录） |
| `docs/lists/xiaomi-miui-app-list.md` | 通用 MIUI 系统内置 App 包名清单（待精简候选） |
| `docs/lists/miui14-app-list.md` | MIUI 14 系统内置 App 包名清单 |
| `docs/lists/xiaomi-13-app-list.md` | 小米 13 出厂内置 App 包名清单 |
| `docs/lists/xiaomi-pad5-app-list.md` | 小米平板 5 出厂内置 App 包名清单 |
| `docs/lists/hyperos-app-list.md` | HyperOS（澎湃 OS）内置 App 包名清单 |
| `apk-data.js` | ★ **权威单一数据源**：各机型推荐精简包名与风险等级（safe/caution/danger）。前端应用（`app/`）、`scripts/xiaomi-apk-cleanup.py` 均直接消费它；请勿在多处维护包名副本 |
| `docs/governance/` | 开源治理文件：`CODE_OF_CONDUCT.md`（行为准则）、`LICENSE`（MIT）、`SECURITY.md`（安全政策）、`SUPPORT.md`（支持渠道） |
| `prototype/` | 高保真原型 + 设计规范（纯 HTML，零依赖）：`index.html` 门户、`design-system/` 设计系统、`components/` 组件库、`interaction/` 交互标准、`archive/` 历史归档、`README.md` 原型说明（应用原型已迁移至仓库根 `/app/`） |
| `prototype/archive/` | 历史归档：v1.3.0 旧版网页原型（`xiaomi-apk-cleanup.html/.css/.js` 与增强模块 `xiaomi-apk-cleanup.extra.js`），仅供回溯，不再维护 |
| `CONTRIBUTING.md` | 贡献指南：项目结构、数据规范、编码与版本管理要求 |

> **数据源关系**：`apk-data.js` 为唯一权威来源。三个可执行入口定位如下——
> - `app/index.html`：浏览器应用，直接读取 `apk-data.js`（适合查看/生成命令）。
> - `scripts/xiaomi-apk-cleanup.py`：跨平台脚本，直接读取 `apk-data.js`（数据源驱动，推荐）。
> - `scripts/xiaomi-apk-cleanup.bat`：Windows 便捷入口，**内嵌 apk-data.js 的安全包子集离线镜像**，适用于无 Python/Node 环境；更新 `apk-data.js` 后需手动同步其内置清单。
> 各 `*.md` 清单为 `apk-data.js` 的**衍生展示**（人工可读 + 粘贴源），非独立数据源。

各清单文件以 Markdown 列表逐行存储 Android 应用包名（`packageName`），
可直接复制包名填入精简命令或脚本中执行。

## 在线使用（腾讯云 EdgeOne）

> 区分两个入口：
> - **线上工具**：仓库根 `index.html`（部署后即为站点），是可直接使用的精简工具。
> - **本地原型**：`prototype/index.html` 为仓库内独立静态原型，仅供本地查阅与开发参考，不作为线上入口。

本项目为纯静态前端，已配置 GitHub Actions 自动部署到腾讯云 EdgeOne Pages，
推送 `master`/`main` 即上线，访问站点首页 `index.html` 即可**直接在线使用精简工具**
（首页本身即为工具，无需跳转）。

- **站点首页**：`index.html` —— 直接承载精简工具（选择设备 / 模式 / 勾选 / 生成命令）。
- **数据源**：根目录 `apk-data.js`，以 `/apk-data.js` 绝对路径被前端加载，
  部署时以**仓库根作为托管根**，保持「单一数据源」不被复制。
- **原型目录 `prototype/`**：为仓库内独立的静态 HTML（含设计系统 / 组件库 / 交互标准 /
  应用原型），仅供本地查阅与开发参考，**不作为线上站点入口展示**。

### 自行部署

1. 在腾讯云 EdgeOne 控制台「个人中心 → API 密钥」创建 API Token。
2. 在仓库 `Settings → Secrets → Actions` 新增密钥 `EDGEONE_API_TOKEN`，值为上一步 Token。
3. 推送代码到 `master`（或手动在 Actions 运行 `Deploy to EdgeOne`）。
4. 部署完成后在 EdgeOne 控制台获得预览/生产域名；如需自定义域名，在控制台绑定并开启加速。

> 部署工作流见 `.github/workflows/deploy.yml`，托管目录为仓库根 `.`，
> 零构建、零运行时依赖。首页 `index.html` 复用 `app/app.css` 与
> `app/` 下的应用脚本实现工具交互。

### 本地预览

```bash
# 以仓库根为站点根启动本地静态服务（保证 /apk-data.js 可访问）
python3 -m http.server 8080
# 浏览器打开 http://localhost:8080/        # 在线工具首页
```

## SEO 与 GEO 优化

本项目为纯静态站点，已内置搜索引擎优化（SEO）与生成式引擎优化（GEO）基础设施，
帮助百度 / 谷歌 / 必应等搜索引擎以及 ChatGPT、Claude、豆包等生成式引擎更好地
索引与引用本工具。

| 文件 | 作用 |
| --- | --- |
| `robots.txt` | 爬虫协议：允许抓取全站，排除原型归档目录，声明 sitemap 与 `llms.txt` |
| `sitemap.xml` | 站点地图：提交首页与各机型包名清单文档，标注更新频率与优先级 |
| `llms.txt` | GEO 机器可读索引（遵循 [llmstxt.org](https://llmstxt.org) 规范）：机器友好的项目概览、风险分级、命令模板与文档链接 |
| `index.html` 内 JSON-LD | 结构化数据：`WebApplication` + `FAQPage`，提升富媒体摘要与问答命中 |
| `index.html` 内 meta | Open Graph / Twitter Card / canonical / keywords，优化社媒分享与去重 |

> 部署说明：`robots.txt` 与 `sitemap.xml` 中的站点域名当前为占位
> `https://mi-app-clean.pages.dev/`，绑定自定义域名后请替换为实际地址。
> `.seo-content` 语义块在页面中视觉弱化呈现，既丰富内容又保证爬虫与屏幕阅读器可读。

## 使用方法

### 前置条件

1. 电脑已安装 [ADB](https://developer.android.com/tools/adb) 并加入系统 `PATH`。
2. 设备开启 **开发者选项** 与 **USB 调试**。
3. 通过 USB 或网络（TCP/IP）连接设备，确认 `adb devices` 能识别到设备。

### 手机 / 平板精简

参考 `docs/commands.md` 中的「手机」部分，
将清单中的包名逐个填入卸载/禁用命令执行。

### 电视盒精简

参考 `docs/commands.md` 中的「电视盒」部分，
或使用 `scripts/MIUI-lite-for-Letv-X600.bat`（仅适用于乐视 X600 盒子）。

### 运行统一精简脚本（推荐）

`scripts/xiaomi-apk-cleanup.bat` 合并了手机 / 平板 / 电视盒的精简命令，
连接设备后双击运行，按菜单选择设备类型与操作模式即可：

```bat
scripts\xiaomi-apk-cleanup.bat
```

脚本内置与 `apk-data.js` 一致的推荐精简包名，逐条执行 `adb` 命令；
默认「禁用」模式（可 `pm enable` 恢复），亦可选择「卸载」。

### 运行跨平台脚本（macOS / Linux / Windows）

`scripts/xiaomi-apk-cleanup.py` 复用 `apk-data.js` 作为唯一数据源，无需手工同步包名：

```bash
python3 scripts/xiaomi-apk-cleanup.py        # 交互式精简
python3 scripts/xiaomi-apk-cleanup.py check  # 预检：仅输出设备上真实存在的推荐包
python3 scripts/xiaomi-apk-cleanup.py backup # 备份：导出当前已安装包快照用于恢复
```

脚本自动校验 `adb` 可用性、`danger` 级核心组件自动跳过；
`check` 可先确认包是否存在再精简，`backup` 在误操作后便于对照定位恢复。

### 直接运行脚本（仅 X600）

```bat
scripts\MIUI-lite-for-Letv-X600.bat
```

> 注意：该脚本为历史 ROM 精简脚本，直接删除 ROM 目录文件，
> 与上方"命令式禁用/卸载"思路不同，仅建议有 ROM 打包经验的用户使用。

### 使用应用工具（推荐）

应用工具即站点首页 `index.html`（线上）或可交互原型 `/app/index.html`（本地预览），
二者代码同源、数据均来自根目录 `apk-data.js`：

1. 选择设备类型：**手机 / 平板 / 电视盒**（平板复用手机清单）。
2. 选择操作模式：**禁用（推荐·可恢复）** 或 **卸载（移除·谨慎）**。
3. 展开类别，勾选要清理的应用（含中文用途说明与风险标签）。
4. 粘贴任一清单（`.md`）内容到「自定义包名」文本框（自动按行解析）。
5. 点击 **复制全部命令**，粘贴到已连接设备的终端执行；或用 **全选推荐项** 快速选取。
6. `danger` 级核心组件自动禁用勾选并在命令生成时跳过，规避变砖风险。

> 应用为纯静态前端，所有数据来自根目录 `apk-data.js`（单一数据源），不会上传任何信息。
> 设计规范与组件库见 `prototype/` 下的 `design-system/`、`components/`、`interaction/`（仅供设计参考）。
> 旧版网页原型（`xiaomi-apk-cleanup.*`）已归档至 `prototype/archive/`，仅供回溯，不再维护。

## 推荐 ADB 工具

除了官方命令行 `adb`，以下工具能显著降低精简门槛、提升操作安全性，
按需选用（本项目脚本均为纯 `adb` 命令，与上述工具可配合使用）。

### 桌面端图形工具

- **[ADB AppControl](https://adbappcontrol.com/)**（Windows）
  图形化禁用/卸载/冻结应用，内置厂商应用识别与备份恢复，适合不熟悉命令行的用户。
- **[Linkji 甲虫 ADB 助手](https://github.com/modnars1/linkji-adb)**（全平台）
  开源可视化工具，支持禁用/卸载、批量操作与一键备份，对小米/红米设备适配良好。
- **[AADebug / Shizuku + 冰箱 IceBox](https://github.com/RikkaApps/Shizuku)**
  Shizuku 以 ADB 权限代理运行，`冰箱` 可冻结应用且无需 root，适合日常留白管理。

### 命令行 / 脚本增强

- **[scrcpy](https://github.com/Genymobile/scrcpy)**（全平台）
  无线投屏与键鼠控制，配合精简流程可实时观察设备状态、验证操作结果。
- **[ADB Wireless / WiFi ADB](https://developer.android.com/tools/adb#wireless)**
  通过 `adb tcpip 5555` + `adb connect <ip>:5555` 摆脱数据线，适合反复调试。
- **[Android Platform-Tools](https://developer.android.com/tools/releases/platform-tools)**（官方）
  官方 `adb` / `fastboot` 唯一可信来源，建议定期更新以获取最新设备兼容。

### 备份与恢复

- **[Swift Backup](https://swiftapps.org/)** / **[oandbackupx](https://github.com/jensstein/oandbackupx)**
  在精简前对应用与数据做完整备份，误操作后可一键还原，降低变砖风险。

> 提示：图形工具与本项目脚本并不冲突——可先用本项目 `prototype` 原型或脚本
> 生成命令、确认包名，再在图形工具中执行或批量管理；精简前务必用
> `scripts/xiaomi-apk-cleanup.py backup` 或上述备份工具留存快照。

## 命令说明

| 命令 | 作用 | 可逆性 |
| --- | --- | --- |
| `pm uninstall --user 0 <包名>` | 为当前用户卸载（移除）预装应用 | 需恢复出厂或重刷 |
| `pm disable-user --user 0 <包名>` | 禁用应用（仍在系统中） | 可 `enable` 恢复 |

> 更安全的做法是优先使用 `disable-user` 而非 `uninstall`：
> 禁用后应用不再运行、不占后台，但保留在系统分区，出问题可一键恢复。

## 风险提示

- **备份优先**：精简前请务必备份重要数据，并对设备执行一次完整备份。
- **禁用 vs 卸载**：`uninstall` 会真正移除应用，部分系统核心应用被卸载后可能导致
  系统不稳定、无法开机或失去 OTA 能力；不确定时请只用 `disable-user`。
- **核心组件勿动**：包名含 `system`、`framework`、`telephony`、`settings` 等组件
  切勿精简，否则可能导致设备变砖。
- **设备差异**：不同机型、系统版本内置包名不同，清单仅作参考，执行前请先
  `adb shell pm list packages` 核对包名是否真实存在。
- **盒子风险**：电视盒精简后若丢失桌面（Launcher），需通过 adb 重新启用对应包名。

## 版本记录

详见 [CHANGELOG.md](./CHANGELOG.md)。

## 贡献指南

欢迎参与完善包名清单与脚本。包名数据格式、风险分级、版本与提交规范请阅读
[CONTRIBUTING.md](./CONTRIBUTING.md)。核心原则：**`apk-data.js` 为唯一数据源**，
前端与脚本均从中读取，请勿在多处硬编码清单。

## 本地忽略建议

仓库已提供 `.gitignore`。以下为补充建议，避免将设备隐私快照与本地配置纳入版本库：

```gitignore
*.code-workspace
backup-*.txt        # xiaomi-apk-cleanup.py backup 生成的设备包名快照
*.cleanup.json      # 前端导出的本地精简方案
*.bak
```

## 免责声明

本仓库仅供学习与技术研究使用。因使用其中命令导致的设备损坏、数据丢失等后果，
作者与贡献者不承担任何责任。请在充分理解命令含义后再操作。
