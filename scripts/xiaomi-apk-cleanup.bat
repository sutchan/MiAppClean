@ECHO OFF
CHCP 65001 >NUL
REM ============================================================
REM 小米安卓设备内置 APK 精简统一脚本（合并版）
REM 版本：v1.13.3
REM 作用：交互选择设备类型与操作模式，对精简清单逐个执行 adb 命令。
REM 适用：小米手机 / 平板 / 电视盒（含乐视 X600 等搭载 MIUI TV 的盒子）
REM 依赖：已安装 ADB 并加入 PATH；设备开启 USB 调试且已连接（adb devices 可见）
REM 用法：双击运行，按菜单选择；脚本仅生成并执行 adb 命令，不修改本地 ROM 文件。
REM 安全：默认「禁用」模式（可 pm enable 恢复）；选择「卸载」请谨慎。
REM 风险：包名含 system / framework / telephony / settings 的核心组件切勿精简，可能变砖。
REM       电视盒精简后若丢失桌面（Launcher），用 `adb shell pm enable <包名>` 重新启用。
REM 数据：内置清单为 apk-data.js 的「安全包子集」离线镜像，已按风险分级（safe/caution），
REM       不含 danger 级核心组件（如 android / com.miui.home / com.android.settings 等保留项）。
REM       ⚠️ 此为离线副本：更新 apk-data.js 后请同步下方 PKG_PHONE / PKG_TV，保持单一数据源一致。
REM       权威数据源见仓库根目录 apk-data.js（前端与 xiaomi-apk-cleanup.py 均直接消费它）。
REM 模块化：本脚本按职责以 :label 子例程分段（设备选择 / 模式选择 / 执行确认 / 运行），
REM       包名清单为 apk-data.js 的离线镜像内联于此。因需作为「单文件交互工具」分发，
REM       不跨文件拆分（保持双击即用的单文件交付契约，见 openspec/specs/scripts）。
REM ============================================================

SETLOCAL ENABLEDELAYEDEXPANSION
TITLE 小米 APK 精简工具 v1.13.3

:CHECK_ADB
WHERE adb >NUL 2>NUL
IF %ERRORLEVEL% NEQ 0 (
  ECHO [错误] 未检测到 adb，请先安装 Android Platform-Tools 并加入 PATH。
  GOTO END
)

ECHO.
ECHO ========== 小米 APK 精简工具 ==========
ECHO 正在检测已连接设备...
adb devices
ECHO.

:CHOOSE_DEVICE
ECHO 请选择设备类型：
ECHO   1) 手机
ECHO   2) 平板（复用手机清单）
ECHO   3) 电视盒
SET /P DEV=输入数字 [1/2/3]：
IF "%DEV%"=="1" (SET DEVICE=phone& GOTO CHOOSE_MODE)
IF "%DEV%"=="2" (SET DEVICE=pad& GOTO CHOOSE_MODE)
IF "%DEV%"=="3" (SET DEVICE=tv& GOTO CHOOSE_MODE)
ECHO 输入无效，请重新选择。
GOTO CHOOSE_DEVICE

:CHOOSE_MODE
ECHO.
ECHO 请选择操作模式：
ECHO   1) 禁用（推荐·可恢复，pm disable-user）
ECHO   2) 卸载（移除·谨慎，pm uninstall --user 0）
SET /P MD=输入数字 [1/2]：
IF "%MD%"=="1" (SET MODE=disable& GOTO CHOOSE_EXEC)
IF "%MD%"=="2" (SET MODE=uninstall& GOTO CHOOSE_EXEC)
ECHO 输入无效，请重新选择。
GOTO CHOOSE_MODE

:CHOOSE_EXEC
ECHO.
ECHO 即将对「%DEVICE%」执行「%MODE%」操作。
SET /P GO=确认执行？[Y/N]：
IF /I "%GO%"=="Y" GOTO RUN
IF /I "%GO%"=="N" GOTO CHOOSE_DEVICE
ECHO 输入无效。
GOTO CHOOSE_EXEC

:RUN
REM ---- 手机 / 平板精简清单（phone 与 pad 共用）----
SET "PKG_PHONE=^
com.android.adservices.api;^
com.miui.analytics;^
com.miui.systemAdSolution;^
com.xiaomi.ab;^
com.miui.daemon;^
com.baidu.duersdk.opensdk;^
com.baidu.input_mi;^
com.iflytek.inputmethod.miui;^
com.sohu.inputmethod.sogou.xiaomi;^
com.android.dreams.basic;^
com.android.dreams.phototable;^
com.android.htmlviewer;^
com.android.location.fused;^
com.android.musicfx;^
com.android.wallpaper.livepicker;^
com.android.wallpaperbackup;^
com.bsp.catchlog;^
com.atmos;^
com.miui.audioeffect;^
com.atmos.daxappUI;^
com.android.theme.color.cinnamon;^
com.android.theme.color.green;^
com.android.theme.color.ocean;^
com.android.theme.color.orchid;^
com.android.theme.color.purple;^
com.miui.miwallpaper.earth;^
com.miui.miwallpaper.geometry;^
com.miui.miwallpaper.mars;^
com.miui.miwallpaper.saturn;^
com.miui.miwallpaper.snowmountain;^
com.duokan.reader;^
com.duokan.videodaily;^
com.mfashiongallery.emag;^
com.mi.dlabs.vr;^
com.miui.aod;^
com.miui.audiomonitor;^
com.miui.bugreport;^
com.miui.hybrid.accessory;^
com.xiaomi.mtb;^
com.miui.newhome;^
com.miui.sysopt;^
com.miui.thirdappassistant;^
com.miui.touchassistant;^
com.miui.translation.kingsoft;^
com.miui.translation.youdao;^
com.miui.userguide;^
com.miui.whetstone;^
com.miui.wmsvc;^
com.xiaomi.gamecenter;^
com.xiaomi.gamecenter.sdk.service;^
com.xiaomi.joyose;^
com.xiaomi.mi_connect_service;^
com.xiaomi.migameservice;^
com.xiaomi.macro;^
com.xiaomi.payment;^
com.huaqin.factory;^
com.longcheertel.AutoTest;^
com.longcheertel.cit;^
com.longcheertel.midtest;^
com.longcheertel.modemlog;^
com.longcheertel.smsregister;^
com.mi.AutoTest;^
com.modemdebug;^
com.mediatek.floatmenu;^
com.mediatek.mdmlsample;^
com.mediatek.mtklogger;^
com.mediatek.providers.drm;^
com.miui.cleanmaster;^
com.miui.securitycenter;^
com.miui.securitycore;^
com.miui.securityadd;^
com.miui.personalassistant;^
com.miui.mediaeditor;^
com.miui.notes;^
com.miui.screenrecorder;^
com.miui.screenshot;^
com.miui.weather2;^
com.miui.calculator;^
com.miui.compass;^
com.miui.gallery;^
com.miui.player;^
com.miui.hybrid;^
com.miui.contentextension;^
com.miui.contentcatcher;^
com.miui.notification;^
com.miui.phrase;^
com.miui.voiceassist;^
com.miui.carlink;^
com.miui.mishare.connectivity;^
com.miui.findmy;^
com.miui.greenguard;^
com.miui.guardprovider;^
com.miui.backup;^
com.miui.cloudbackup;^
com.miui.cloudservice;^
com.miui.micloudsync;^
com.miui.newmidrive;^
com.miui.rom;^
com.miui.tsmclient;^
com.miui.virtualsim;^
com.xiaomi.account;^
com.xiaomi.market;^
com.xiaomi.shop;^
com.xiaomi.mirror;^
com.xiaomi.scanner;^
com.xiaomi.misettings;^
com.xiaomi.simactivate.service;^
com.xiaomi.otrpbroker;^
com.xiaomi.security.onetrack;^
com.xiaomi.finddevice;^
com.xiaomi.trustservice;^
com.xiaomi.hypercomm;^
com.xiaomi.metoknlp;^
com.xiaomi.gnss.polaris;^
com.xiaomi.continuity.sdkapp;^
com.xiaomi.cameratools;^
com.xiaomi.cameramind;^
com.xiaomi.barrage;^
com.xiaomi.aon;^
com.xiaomi.aiasst.service;^
com.xiaomi.aicr;^
com.xiaomi.digitalkey;^
com.xiaomi.xmsf;^
com.xiaomi.xmsfkeeper;^
com.miui.core;^
com.miui.core.internal.services;^
com.miui.uireporter;^
com.xiaomi.ugd;^
com.xiaomi.xaee;^
com.google.android.gms;^
com.google.android.gsf;^
com.android.vending;^
com.google.android.youtube;^
com.google.android.webview"

REM ---- 电视盒精简清单 ----
SET "PKG_TV=^
com.mipay.wallet.tv;^
com.xiaomi.mibox.gamecenter;^
com.xiaomi.mitv.handbook;^
com.xiaomi.mitv.pay;^
com.xiaomi.mitv.payment;^
com.mitv.account;^
com.mitv.videoplayer;^
com.xiaomi.mitv.gallery;^
com.xiaomi.mitv.hotspot;^
com.mitv.hotspot;^
com.xiaomi.mitv.globalsetting;^
com.mitv.globalSetting;^
com.xiaomi.mitv.sysservice;^
com.xiaomi.mitv.upgrade;^
com.xiaomi.mitv.ovp;^
com.xiaomi.mitv.mivision;^
com.miui.tv.analytics;^
com.xiaomi.mitv.abtest;^
com.xiaomi.mitv.mitvsettings;^
com.xiaomi.mitv.patchwall;^
com.xiaomi.mitv.tvpush.tvpushservice"

IF "%DEVICE%"=="tv" (SET LIST=%PKG_TV%) ELSE (SET LIST=%PKG_PHONE%)

IF "%MODE%"=="uninstall" (SET CMD=adb shell pm uninstall --user 0) ELSE (SET CMD=adb shell pm disable-user --user 0)

ECHO.
ECHO ========== 开始执行（%DEVICE% / %MODE%）==========
FOR %%P IN (%LIST%) DO (
  ECHO %%P
  %CMD% %%P
)
ECHO ========== 执行完毕 ==========
ECHO 若部分包名提示不存在属正常（机型差异），可用 `adb shell pm list packages ^<包名^>` 核对。
IF "%MODE%"=="disable" ECHO 恢复启用命令：adb shell pm enable ^<包名^>
GOTO END

:END
ECHO.
PAUSE
ENDLOCAL
