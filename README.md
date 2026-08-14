# MiAppClean

小米设备内置应用精简工具集（原名 MIUI & MiBox Lite）。收集了多款小米手机、平板、电视盒子的内置 App 包名清单，
并提供基于 `adb shell pm` 的精简命令模板，帮助用户移除/禁用预装应用，释放存储空间。

> 仓库路径：`e:/Github/MiAppClean`
> 版本：`v1.6.4`

## 目录结构

```
MiAppClean/
├── README.md                       # 本文件（项目说明）
├── VERSION                         # 项目版本号（单一来源）
├── CHANGELOG.md                    # 版本变更记录
├── CONTRIBUTING.md                 # 贡献指南（数据格式/编码/版本/CI 规范）
├── .github/workflows/ci.yml        # CI：提交/PR 时校验版本一致性与数据完整性
│
├── xiaomi-apk-cleanup.bat             # 统一精简脚本（合并手机/平板/电视盒命令，交互菜单）
├── xiaomi-apk-cleanup.py              # 跨平台精简脚本（Python，复用 apk-data.js 数据源）
├── 精简小米手机MIUI及电视盒app命令.md   # 通用精简命令模板（手机 + 盒子）
├── MIUI-lite-for-Letv-X600.bat         # 乐视 X600 盒子 ROM 精简脚本（历史/参考）
│
├── 小米MIUI应用列表.md             # 通用 MIUI 内置 App 包名清单
├── MIUI14-App清单.md             # MIUI 14 内置 App 包名清单
├── 小米13内置App清单.md           # 小米 13 内置 App 包名清单
├── 小米平板5内置App清单.md         # 小米平板 5 内置 App 包名清单
├── HyperOS-App清单.md            # HyperOS 内置 App 包名清单
│
├── apk-data.js                    # ★ 各机型推荐精简包名数据（单一数据源，原型与脚本共用）
│
└── prototype/                     # 高保真原型 + 设计规范（纯 HTML，零依赖）
    ├── index.html                 #   原型门户（入口）
    ├── design-system/             #   设计系统（tokens.css 设计令牌单一来源）
    ├── components/                #   组件库（基础/复合/业务组件）
    ├── interaction/               #   交互标准（模式/反馈/错误/空状态）
    ├── app/                       #   高保真可交互应用原型（真实数据）
    ├── archive/                   #   历史归档（v1.3.0 旧版网页原型）
    └── README.md                  #   原型说明
```

## 文件说明

| 文件 | 用途 |
| --- | --- |
| `xiaomi-apk-cleanup.bat` | 统一精简批处理脚本（合并多设备命令，交互选择设备/模式，连接设备后执行） |
| `xiaomi-apk-cleanup.py` | 跨平台精简脚本（Python，解析 apk-data.js 单一数据源，macOS/Linux/Windows 通用） |
| `精简小米手机MIUI及电视盒app命令.md` | 通用精简命令模板，含手机与电视盒两类设备命令示例 |
| `MIUI-lite-for-Letv-X600.bat` | 乐视 X600 盒子 ROM 精简脚本（历史参考，删除 ROM 目录） |
| `小米MIUI应用列表.md` | 通用 MIUI 系统内置 App 包名清单（待精简候选） |
| `MIUI14-App清单.md` | MIUI 14 系统内置 App 包名清单 |
| `小米13内置App清单.md` | 小米 13 出厂内置 App 包名清单 |
| `小米平板5内置App清单.md` | 小米平板 5 出厂内置 App 包名清单 |
| `HyperOS-App清单.md` | HyperOS（澎湃 OS）内置 App 包名清单 |
| `apk-data.js` | ★ 各机型推荐精简包名数据与风险等级（safe/caution/danger），前端与脚本共用**单一数据源** |
| `prototype/` | 高保真原型 + 设计规范（纯 HTML，零依赖）：`index.html` 门户、`design-system/` 设计系统、`components/` 组件库、`interaction/` 交互标准、`app/` 可交互应用原型、`README.md` 原型说明 |
| `prototype/archive/` | 历史归档：v1.3.0 旧版网页原型（`xiaomi-apk-cleanup.html/.css/.js` 与增强模块 `xiaomi-apk-cleanup.extra.js`），仅供回溯，不再维护 |

各清单文件以 Markdown 列表逐行存储 Android 应用包名（`packageName`），
可直接复制包名填入精简命令或脚本中执行。

## 使用方法

### 前置条件

1. 电脑已安装 [ADB](https://developer.android.com/tools/adb) 并加入系统 `PATH`。
2. 设备开启 **开发者选项** 与 **USB 调试**。
3. 通过 USB 或网络（TCP/IP）连接设备，确认 `adb devices` 能识别到设备。

### 手机 / 平板精简

参考 `精简小米手机MIUI及电视盒app命令.md` 中的「手机」部分，
将清单中的包名逐个填入卸载/禁用命令执行。

### 电视盒精简

参考 `精简小米手机MIUI及电视盒app命令.md` 中的「电视盒」部分，
或使用 `MIUI-lite-for-Letv-X600.bat`（仅适用于乐视 X600 盒子）。

### 运行统一精简脚本（推荐）

`xiaomi-apk-cleanup.bat` 合并了手机 / 平板 / 电视盒的精简命令，
连接设备后双击运行，按菜单选择设备类型与操作模式即可：

```bat
xiaomi-apk-cleanup.bat
```

脚本内置与 `apk-data.js` 一致的推荐精简包名，逐条执行 `adb` 命令；
默认「禁用」模式（可 `pm enable` 恢复），亦可选择「卸载」。

### 运行跨平台脚本（macOS / Linux / Windows）

`xiaomi-apk-cleanup.py` 复用 `apk-data.js` 作为唯一数据源，无需手工同步包名：

```bash
python3 xiaomi-apk-cleanup.py        # 交互式精简
python3 xiaomi-apk-cleanup.py check  # 预检：仅输出设备上真实存在的推荐包
python3 xiaomi-apk-cleanup.py backup # 备份：导出当前已安装包快照用于恢复
```

脚本自动校验 `adb` 可用性、`danger` 级核心组件自动跳过；
`check` 可先确认包是否存在再精简，`backup` 在误操作后便于对照定位恢复。

### 直接运行脚本（仅 X600）

```bat
MIUI-lite-for-Letv-X600.bat
```

> 注意：该脚本为历史 ROM 精简脚本，直接删除 ROM 目录文件，
> 与上方"命令式禁用/卸载"思路不同，仅建议有 ROM 打包经验的用户使用。

### 使用高保真原型（推荐）

打开 `prototype/index.html` 进入原型门户，点击**应用原型**（`prototype/app/index.html`）：

1. 选择设备类型：**手机 / 平板 / 电视盒**（平板复用手机清单）。
2. 选择操作模式：**禁用（推荐·可恢复）** 或 **卸载（移除·谨慎）**。
3. 展开类别，勾选要清理的应用（含中文用途说明与风险标签）。
4. 粘贴任一清单（`.md`）内容到「自定义包名」文本框（自动按行解析）。
5. 点击 **复制全部命令**，粘贴到已连接设备的终端执行；或用 **全选推荐项** 快速选取。
6. `danger` 级核心组件自动禁用勾选并在命令生成时跳过，规避变砖风险。

> 原型为纯静态前端，所有数据来自根目录 `apk-data.js`（单一数据源），不会上传任何信息。
> 设计规范与组件库见 `prototype/` 下的 `design-system/`、`components/`、`interaction/`。
> 旧版网页原型（`xiaomi-apk-cleanup.*`）已归档至 `prototype/archive/`，仅供回溯，不再维护。

## 命令说明

| 命令 | 作用 | 可逆性 |
| --- | --- | --- |
| `pm uninstall --user 0 <包名>` | 为当前用户卸载（移除）预装应用 | 需恢复出厂或重刷 |
| `pm disable-user --user 0 <包名>` | 禁用应用（仍在系统中） | 可 `enable` 恢复 |
| `pm disable-user --user 0 com.miui....` | 同上，针对 MIUI 系统应用 | 可恢复 |

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

仓库根目录的 `.gitignore` 若未能生效（部分环境文件受保护），建议手动加入以下规则，
避免将设备隐私快照与本地配置纳入版本库：

```gitignore
*.code-workspace
backup-*.txt        # xiaomi-apk-cleanup.py backup 生成的设备包名快照
*.cleanup.json      # 前端导出的本地精简方案
*.bak
```

## 免责声明

本仓库仅供学习与技术研究使用。因使用其中命令导致的设备损坏、数据丢失等后果，
作者与贡献者不承担任何责任。请在充分理解命令含义后再操作。
