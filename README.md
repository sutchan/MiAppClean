# MiAppClean

小米设备内置应用精简工具集（原名 MIUI & MiBox Lite）。收集了多款小米手机、平板、电视盒子的内置 App 包名清单，
并提供基于 `adb shell pm` 的精简命令模板，帮助用户移除/禁用预装应用，释放存储空间。

> 仓库路径：`e:/Github/MIUI-and-MiBox-Lite`
> 版本：`v1.4.0`

## 目录结构

```
MiAppClean/
├── README.md                       # 本文件（项目说明）
├── VERSION                         # 项目版本号
├── CHANGELOG.md                    # 版本变更记录
│
├── xiaomi-apk-cleanup.bat             # 统一精简脚本（合并手机/平板/电视盒命令，交互菜单）
├── xiaomi-apk-cleanup.py              # 跨平台精简脚本（Python，复用 apk-data.js 数据源）
├── 精简小米手机MIUI及电视盒app命令.txt   # 通用精简命令模板（手机 + 盒子）
├── MIUI-lite-for-Letv-X600.bat         # 乐视 X600 盒子 ROM 精简脚本（历史/参考）
│
├── 小米MIUI应用列表.txt             # 通用 MIUI 内置 App 包名清单
├── MIUI14-App清单.txt             # MIUI 14 内置 App 包名清单
├── 小米13内置App清单.txt           # 小米 13 内置 App 包名清单
├── 小米平板5内置App清单.txt         # 小米平板 5 内置 App 包名清单
├── HyperOS-App清单.txt            # HyperOS 内置 App 包名清单
│
├── xiaomi-apk-cleanup.html        # 内置 APK 清理命令网页（交互式）
├── xiaomi-apk-cleanup.css         # 页面样式
├── xiaomi-apk-cleanup.js          # 页面交互逻辑
└── apk-data.js                    # 各机型推荐精简包名数据
```

## 文件说明

| 文件 | 用途 |
| --- | --- |
| `xiaomi-apk-cleanup.bat` | 统一精简批处理脚本（合并多设备命令，交互选择设备/模式，连接设备后执行） |
| `xiaomi-apk-cleanup.py` | 跨平台精简脚本（Python，解析 apk-data.js 单一数据源，macOS/Linux/Windows 通用） |
| `精简小米手机MIUI及电视盒app命令.txt` | 通用精简命令模板，含手机与电视盒两类设备命令示例 |
| `MIUI-lite-for-Letv-X600.bat` | 乐视 X600 盒子 ROM 精简脚本（历史参考，删除 ROM 目录） |
| `小米MIUI应用列表.txt` | 通用 MIUI 系统内置 App 包名清单（待精简候选） |
| `MIUI14-App清单.txt` | MIUI 14 系统内置 App 包名清单 |
| `小米13内置App清单.txt` | 小米 13 出厂内置 App 包名清单 |
| `小米平板5内置App清单.txt` | 小米平板 5 出厂内置 App 包名清单 |
| `HyperOS-App清单.txt` | HyperOS（澎湃 OS）内置 App 包名清单 |
| `xiaomi-apk-cleanup.html` | 内置 APK 清理命令交互页面（含设备分类、命令生成、一键复制） |
| `xiaomi-apk-cleanup.css` | 页面样式 |
| `xiaomi-apk-cleanup.js` | 页面交互逻辑（渲染清单、生成 adb 命令） |
| `apk-data.js` | 各机型推荐精简包名数据与风险等级（safe/caution/danger），前端与脚本共用数据源 |

各 `*.txt` 清单文件以纯文本逐行存储 Android 应用包名（`packageName`），
可直接复制包名填入精简命令或脚本中执行。

## 使用方法

### 前置条件

1. 电脑已安装 [ADB](https://developer.android.com/tools/adb) 并加入系统 `PATH`。
2. 设备开启 **开发者选项** 与 **USB 调试**。
3. 通过 USB 或网络（TCP/IP）连接设备，确认 `adb devices` 能识别到设备。

### 手机 / 平板精简

参考 `精简小米手机MIUI及电视盒app命令.txt` 中的「手机」部分，
将清单中的包名逐个填入卸载/禁用命令执行。

### 电视盒精简

参考 `精简小米手机MIUI及电视盒app命令.txt` 中的「电视盒」部分，
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
python3 xiaomi-apk-cleanup.py
```

脚本自动校验 `adb` 可用性、`danger` 级核心组件自动跳过。

### 直接运行脚本（仅 X600）

```bat
MIUI-lite-for-Letv-X600.bat
```

> 注意：该脚本为历史 ROM 精简脚本，直接删除 ROM 目录文件，
> 与上方"命令式禁用/卸载"思路不同，仅建议有 ROM 打包经验的用户使用。

### 使用清理命令网页（推荐）

直接用浏览器打开 `xiaomi-apk-cleanup.html`（无需服务器）：

1. 选择设备类型：**手机 / 平板 / 电视盒**。
2. 选择操作模式：**禁用（推荐·可恢复）** 或 **卸载（移除·谨慎）**。
3. 展开类别，勾选要清理的应用（含中文用途说明）。
4. 可粘贴任一 `*.txt` 清单内容到「自定义包名」文本框（自动按行解析）。
5. 点击 **复制全部命令**，粘贴到已连接设备的终端执行。

> 页面为纯静态前端，所有数据来自 `apk-data.js`，不会上传任何信息。

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

## 免责声明

本仓库仅供学习与技术研究使用。因使用其中命令导致的设备损坏、数据丢失等后果，
作者与贡献者不承担任何责任。请在充分理解命令含义后再操作。
