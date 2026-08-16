# 小米手机 / 小米盒子 内置 App 可精简清单工具

Xiaomi Phone and AndroidBox MIUI App Liter

> 版本：v1.13.2
> 作用：提供手机与电视盒两类设备的预装应用精简命令示例模板。
> 用法：将下方 `<包名>` 替换为对应清单（如 [lists/xiaomi-miui-app-list.md](lists/xiaomi-miui-app-list.md)）中的包名后逐条执行。
> 建议：优先使用 `disable-user`（可一键恢复），慎用 `uninstall --user 0`（真正移除难恢复）。
> 风险提示：包名含 system / framework / telephony / settings 等核心组件切勿精简，否则可能变砖。

用 CMD 连接上手机，无线连接用 IP 形式连接，数据线连接可跳过此步。

```bat
adb connect 192.168.10.250:5555    # 连接手机
adb devices                        # 查看可连接设备
adb shell pm list packages         # 查看已安装app
```

更多命令查看页面尾部。

---

## 可精简 App 清单

### 停用广告模块

```bat
adb shell pm uninstall --user 0 com.android.adservices.api
adb shell pm uninstall --user 0 com.miui.analytics
adb shell pm uninstall --user 0 com.miui.systemAdSolution    # 智能服务
adb shell pm uninstall --user 0 com.xiaomi.ab                # 小米商城系统组件
adb shell pm uninstall --user 0 com.miui.daemon              # 质量服务
```

如果重启后自动装上，则可用禁用模式。

```bat
adb shell pm disable-user --user 0  com.miui.analytics
adb shell pm disable-user --user 0  com.miui.systemAdSolution
```

### 输入法

```bat
adb shell pm uninstall --user 0 com.baidu.duersdk.opensdk
adb shell pm uninstall --user 0 com.baidu.input_mi
adb shell pm uninstall --user 0 com.iflytek.inputmethod.miui
adb shell pm uninstall --user 0 com.sohu.inputmethod.sogou.xiaomi
```

### 安卓系统自带 App

```bat
adb shell pm uninstall --user 0 com.android.dreams.basic        # 基本互动屏保
adb shell pm uninstall --user 0 com.android.dreams.phototable
adb shell pm uninstall --user 0 com.android.htmlviewer
adb shell pm uninstall --user 0 com.android.location.fused
adb shell pm uninstall --user 0 com.android.musicfx
adb shell pm uninstall --user 0 com.android.wallpaper.livepicker
adb shell pm uninstall --user 0 com.android.wallpaperbackup
adb shell pm uninstall --user 0 com.bsp.catchlog                # 抓取日志
```

### 音效

```bat
adb shell pm uninstall --user 0 com.atmos
adb shell pm uninstall --user 0 com.miui.audioeffect
adb shell pm uninstall --user 0 com.atmos.daxappUI
```

### 系统自带配色主题

```bat
adb shell pm uninstall --user 0 com.android.theme.color.cinnamon
adb shell pm uninstall --user 0 com.android.theme.color.green
adb shell pm uninstall --user 0 com.android.theme.color.ocean
adb shell pm uninstall --user 0 com.android.theme.color.orchid
adb shell pm uninstall --user 0 com.android.theme.color.purple
```

### 系统自带超级壁纸

```bat
adb shell pm uninstall --user 0 com.miui.miwallpaper.earth        # 地球超级壁纸
adb shell pm uninstall --user 0 com.miui.miwallpaper.geometry     # 几何超级壁纸
adb shell pm uninstall --user 0 com.miui.miwallpaper.mars         # 火星超级壁纸
adb shell pm uninstall --user 0 com.miui.miwallpaper.saturn       # 土星超级壁纸
adb shell pm uninstall --user 0 com.miui.miwallpaper.snowmountain # 雪山超级壁纸
```

### 小米自带 App

```bat
# adb shell pm uninstall --user 0 com.miui.freeform        # 自由窗口
# adb shell pm uninstall --user 0 com.miui.smarttravel     # 智慧出行
# adb shell pm uninstall --user 0 com.miui.smsextra        # 短信额外应用
# adb shell pm uninstall --user 0 com.xiaomi.drivemode     # 驾驶模式
# adb shell pm uninstall --user 0 com.xiaomi.mircs         # 网络短信
# adb shell pm uninstall --user 0 com.miui.securityadd     # 系统服务组件
# adb shell pm uninstall --user 0 com.miui.miservice       # 服务与反馈

adb shell pm uninstall --user 0 com.duokan.reader              # 多看阅读
adb shell pm uninstall --user 0 com.duokan.videodaily
adb shell pm uninstall --user 0 com.mfashiongallery.emag       # 时尚画报
adb shell pm uninstall --user 0 com.mi.dlabs.vr
adb shell pm uninstall --user 0 com.miui.aod                   # 万象息屏
adb shell pm uninstall --user 0 com.miui.audiomonitor
adb shell pm uninstall --user 0 com.miui.bugreport             # 用户反馈
adb shell pm uninstall --user 0 com.miui.hybrid.accessory      # 负一屏小米智慧生活
adb shell pm uninstall --user 0 com.xiaomi.mtb                  # 鲁班
adb shell pm uninstall --user 0 com.miui.newhome               # 内容中心
adb shell pm uninstall --user 0 com.miui.sysopt                 # 未用用途
adb shell pm uninstall --user 0 com.miui.thirdappassistant     # 三方应用异常分析
adb shell pm uninstall --user 0 com.miui.touchassistant         # 点击助手
adb shell pm uninstall --user 0 com.miui.translation.kingsoft
adb shell pm uninstall --user 0 com.miui.translation.youdao
adb shell pm uninstall --user 0 com.miui.userguide             # 用户手册
adb shell pm uninstall --user 0 com.miui.whetstone
adb shell pm uninstall --user 0 com.miui.wmsvc
adb shell pm uninstall --user 0 com.xiaomi.ab                  # 电商助手
adb shell pm uninstall --user 0 com.xiaomi.gamecenter          # 游戏中心
adb shell pm uninstall --user 0 com.xiaomi.gamecenter.sdk.service   # 游戏中心服务
adb shell pm uninstall --user 0 com.xiaomi.joyose              # 游戏加速
adb shell pm uninstall --user 0 com.xiaomi.mi_connect_service  # 小米互联通信服务
adb shell pm uninstall --user 0 com.xiaomi.migameservice       # 游戏高能时刻
adb shell pm uninstall --user 0 com.xiaomi.macro               # 自动连招
adb shell pm uninstall --user 0 com.xiaomi.payment             # 米币支付
```

### 小米电视及小米盒子

```bat
adb shell pm uninstall --user 0 com.mipay.wallet.tv
adb shell pm uninstall --user 0 com.xiaomi.mibox.gamecenter
adb shell pm uninstall --user 0 com.xiaomi.mitv.handbook
adb shell pm uninstall --user 0 com.xiaomi.mitv.pay
adb shell pm uninstall --user 0 com.xiaomi.mitv.payment
adb shell pm uninstall --user 0 com.xiaomi.mitv.tvpush.tvpushservice
```

### 手机测试

```bat
adb shell pm uninstall --user 0 com.huaqin.factory
adb shell pm uninstall --user 0 com.longcheertel.AutoTest
adb shell pm uninstall --user 0 com.longcheertel.cit
adb shell pm uninstall --user 0 com.longcheertel.midtest
adb shell pm uninstall --user 0 com.longcheertel.modemlog
adb shell pm uninstall --user 0 com.longcheertel.smsregister
adb shell pm uninstall --user 0 com.mi.AutoTest
adb shell pm uninstall --user 0 com.modemdebug
```

### MTK 自带 App

```bat
adb shell pm uninstall --user 0 com.mediatek.floatmenu
adb shell pm uninstall --user 0 com.mediatek.mdmlsample
adb shell pm uninstall --user 0 com.mediatek.mtklogger
adb shell pm uninstall --user 0 com.mediatek.providers.drm
```

---

以下为 adb 常用命令，仅供备用，不用执行。

```bat
adb shell pm list packages -[option]   # 命令查看已经安装的应用，列出包名，后面加不同的后缀输出不同信息。
adb shell pm list packages             # 查看当前连接设备或者虚拟机的所有包
adb shell pm list packages -d          # 只输出禁用的包。
adb shell pm list packages -e          # 只输出启用的包。
adb shell pm list packages -s          # 只输出系统的包。
adb shell pm list packages -i          # 只输出包和安装信息（安装来源）。
adb shell pm list packages -u          # 只输出包和未安装包信息（安装来源）。
adb shell pm list packages -f          # 输出包和包相关联的文件
adb shell pm list packages -3          # 输出所有第三方包。
adb shell pm list packages -[option] "sina"   # 按照要求搜索包。
```

---

## App 所在文件夹位置（旧版系统清理用）

```text
/system/app/AnalyticsCore
/system/app/BookmarkProvider
/system/app/BuiltInPrintService
/system/app/CatchLog
/system/app/CloudPrint2
/system/app/com.google.ar.core
/system/app/FrequentPhrase
/system/app/GooglePrintRecommendationService
/system/app/HTMLViewer
/system/app/HybridAccessory
/system/app/HybridPlatform
/system/app/KSICibaEngine
/system/app/mab
/system/app/MiuiBugReport
/system/app/MiuiContentCatcher
/system/app/MiuiDaemon
/system/app/MSA
/system/app/PrintSpooler
/system/app/SecurityInputMethod
/system/app/talkback
/system/app/TouchAssistant
/system/app/VoiceTrigger
/system/app/YouDaoEngine
/system/priv-app/Browser
/system/priv-app/CloudBackup
/system/priv-app/MiGameCenterSDKService
/system/priv-app/MiMoverGlobal
/system/priv-app/MiService
/system/priv-app/NewHome
```

---

## 风险与恢复说明

> **【执行前核对】** 先确认包名是否存在，避免误删系统不存在的包报错：
> `adb shell pm list packages <包名>`

> **【推荐：禁用（可恢复）】** 不确定是否安全时使用 disable，应用停止运行但保留在系统：
> `adb shell pm disable-user --user 0 <包名>`
> 恢复启用：
> `adb shell pm enable <包名>`

> **【卸载（移除，谨慎）】** `uninstall --user 0` 仅为当前用户卸载，恢复需重置或重刷：
> `adb shell pm uninstall --user 0 <包名>`

> **【风险提示】**
> 1. 包名含 system / framework / telephony / settings 的核心组件切勿精简，可能变砖。
> 2. 操作前备份数据，并对设备做一次完整备份。
> 3. 不同机型/系统版本包名不同，清单仅作参考，执行前务必核对。
> 4. 电视盒精简后若丢失桌面（Launcher），用 `pm enable <包名>` 重新启用。
