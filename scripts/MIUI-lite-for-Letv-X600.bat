@ECHO OFF
REM ============================================================
REM 乐视 X600 盒子 MIUI ROM 精简脚本（历史参考）
REM 版本：v1.2.0
REM 适用：乐视电视盒 X600（搭载 MIUI TV 系统），需配合 ROM 解包目录使用
REM 作用：在 ROM 解包后的目录中，循环删除内置 App 目录/文件以精简系统镜像。
REM       注意：本脚本直接删除 ROM 内 system/app 等目录文件（用于重新打包 ROM），
REM       与"adb pm disable/uninstall"命令式精简不同，不做实时设备操作。
REM 用法：将本脚本置于 ROM 解包根目录（含 system/、data/ 子目录）后运行。
REM       原脚本含 `cd LETV_X600_AND_X608_MIUI7_6.4.22\` 步骤，请按实际解包目录调整。
REM 风险：请勿删除系统桌面（Launcher）相关目录，否则盒子将无界面；
REM       仅建议有 ROM 打包/解包经验的用户使用。
REM ============================================================
ECHO MIUI V7 Lite for Letv X600 (ROM 精简脚本)
ECHO Building in 2016.4.30
ECHO by Sut
COLOR CF
PAUSE 

ECHO 跳转到ROM目录
cd LETV_X600_AND_X608_MIUI7_6.4.22\



ECHO Android 系统预装
RD system\app\BasicDreams /q /s
REM RD system\app\cit /q /s
RD system\app\DrmProvider /q /s
RD system\app\FM /q /s
RD system\app\FWUpgrade /q /s
RD system\app\FWUpgradeProvider /q /s
RD system\app\Galaxy4 /q /s
RD system\app\HoloSpiralWallpaper /q /s
RD system\app\HTMLViewer /q /s
RD system\app\jjcontainer /q /s
RD system\app\jjhome /q /s
RD system\app\jjknowledge /q /s
RD system\app\jjstore /q /s
RD system\app\LiveWallpapers /q /s
RD system\app\LiveWallpapersPicker /q /s
RD system\app\MtkFloatMenu /q /s
RD system\app\MtkFloatMenus /q /s
RD system\app\MTKLogger /q /s
RD system\app\MusicFX /q /s
RD system\app\NewsArticle /q /s
RD system\app\NlpService /q /s
RD system\app\NoiseField /q /s
RD system\app\PaymentService /q /s
RD system\app\PhaseBeam /q /s
RD system\app\PhotoTable /q /s
RD system\app\PPAssistant /q /s
REM RD system\app\QuickSearchBox /q /s
RD system\app\SMReader /q /s
RD system\app\UserDictionaryProvider /q /s
RD system\app\VisualizationWallpapers /q /s
RD system\app\VoiceUnlock /q /s
RD system\app\Whetstones /q /s

REM RD system\app\MiuiCompass /q /s
RD system\app\PrintSpooler /q /s
RD system\app\VirtualSim /q /s

ECHO MIUI预装
RD data\miui\app\noncustomized\GameCenter /q /s
RD data\miui\app\noncustomized\MiFinance /q /s
RD data\miui\app\noncustomized\Mipay /q /s
RD data\miui\app\noncustomized\MiuiBBS /q /s
RD system\app\BugReport /q /s
RD system\app\CleanMaster /q /s
RD system\app\Miassist /q /s
RD system\app\MiAssistant /q /s
RD system\app\MiGalleryLockscreen /q /s
RD system\app\MiLinkService /q /s
RD system\app\Mipay /q /s
RD system\app\Mipop /q /s
RD system\app\MiraVision /q /s
RD system\app\MiTel /q /s
RD system\app\Miuihm /q /s
RD system\app\Miuipop /q /s
RD system\app\Miuiyuns /q /s
RD system\app\MiWallpaper /q /s
RD system\priv-app\Browser /q /s
RD system\priv-app\CDS_INQFO /q /s
RD system\priv-app\MiDrop /q /s
RD system\priv-app\MiGameCenterSDKService /q /s
RD system\priv-app\MiuiRadio /q /s
RD system\priv-app\MiuiVoip /q /s
REM RD system\app\BaiduNetworkLocation /q /s
REM RD system\app\XiaomiVip /q /s
REM RD system\priv-app\Mipub /q /s

ECHO ROM制作者预装
RD system\app\SogouMall /q /s
RD system\app\Dinghaiy /q /s
RD system\priv-app\movie /q /s
RD data\miui\app\noncustomized\2345tianqi /q /s
RD data\miui\app\noncustomized\BaiduAppSearch /q /s
RD data\miui\app\noncustomized\BaiduBrowser /q /s
RD data\miui\app\noncustomized\klobugreport /q /s
RD data\miui\app\noncustomized\O2O /q /s
RD data\miui\app\noncustomized\tadu /q /s
RD data\miui\app\noncustomized\zmappstore /q /s
RD system\app\360MobileSafe /q /s
RD system\app\Androidmarket /q /s
RD system\app\Anzhishichang /q /s
RD system\app\Appsearch /q /s
RD system\app\Articlenews /q /s
RD system\app\Baiduappsearch /q /s
RD system\app\Baidubrowser /q /s
RD system\app\Baiduinput /q /s
RD system\app\Baiduopda /q /s
RD system\app\Baidusearchbox /q /s
RD system\app\Dinghai /q /s
RD system\app\Dinghaillq /q /s
RD system\app\DurianBrowser /q /s
RD system\app\iFlyIME /q /s
RD system\app\IME /q /s
RD system\app\itools /q /s
RD system\app\JokeEssay /q /s
RD system\app\Ju /q /s
RD system\app\Kuaibao /q /s
RD system\app\LBrowserj /q /s
RD system\app\MaxxAudio /q /s
RD system\app\MaxxService /q /s
RD system\app\Miyunzhushou /q /s
RD system\app\MobileSafe /q /s
RD system\app\news /q /s
RD system\app\oupeng /q /s
RD system\app\RamdroidApp /q /s
RD system\app\GameCenter /q /s
RD system\app\RE /q /s
RD system\app\Reader /q /s
RD system\app\Shsp /q /s
RD system\app\Sogouinput /q /s
RD system\app\Sogouinputmethod /q /s
RD system\app\Sohuvideo /q /s
RD system\app\sougouhaoma /q /s
RD system\app\Sougouser /q /s
RD system\app\Stat /q /s
RD system\app\StepsProvider /q /s
RD system\app\SystemAdSolution /q /s
RD system\app\systemSta /q /s
RD system\app\TeleyServices /q /s
RD system\app\tencen /q /s
RD system\app\Tianqij /q /s
RD system\app\VFX /q /s
RD system\app\ViPER4Android /q /s
RD system\app\Wandou /q /s
RD system\app\wandouji /q /s
RD system\app\Wandoujia /q /s
RD system\app\Wnl /q /s
RD system\app\yimarket /q /s
RD system\app\Zmarket /q /s
RD system\app\Zymarket /q /s
RD system\app\Wzdq /q /s
RD system\app\Qtsta /q /s
RD system\app\Qqlive /q /s
RD system\app\Qihoobrowser /q /s
RD system\app\Qihooappstore /q /s
RD system\app\Tqw /q /s
RD system\app\Appcenter /q /s
RD system\app\Kuaibaorol /q /s
RD system\app\Movierol /q /s

RD data\miui\cust\ /Q /S

ECHO 清理其它无用文件
RD data\miui\precust_theme /q /s
RD system\etc\jeejen /q /s

REM RD system\vendor\operator\app\Baidu_Location /q /s
RD system\vendor\operator\app\Luckymoney /q /s

ECHO 第三方高级设置
REM RD system\app\Miuistock /q /s

REM Whetstone 测试程序
RD system\app\Whetstone /q /s
RD system\etc\WhetstonePermission /q /s

REM romcn 升级
RD system\app\Miuista /q /s
RD system\app\Miuisystemsta /q /s
RD system\app\systemstaqt /q /s
RD system\priv-app\Miuistas /q /s

REM 双击亮屏
RD system\app\shuangjiTap /q /s

REM 虚拟按钮
RD system\app\MiuiMI-Pop /q /s

REM RD system\priv-app\GooglePinyinIME /q /s

DEL data\miui\app\vanward_applist /q
DEL system\media\bootanimation.zip /q
DEL system\media\lockscreen\lockscreen_000.jpg /q
DEL system\media\lockscreen\lockscreen_002.jpg /q
DEL system\media\lockscreen\lockscreen_004.jpg /q
DEL system\media\lockscreen\lockscreen_005.jpg /q
DEL system\media\lockscreen\lockscreen_008.jpg /q
DEL system\media\lockscreen\lockscreen_100.jpg /q
DEL system\media\lockscreen\lockscreen_101.jpg /q
DEL system\media\lockscreen\lockscreen_102.jpg /q
DEL system\media\lockscreen\lockscreen_103.jpg /q
DEL system\media\lockscreen\lockscreen_104.jpg /q
DEL system\media\lockscreen\lockscreen_105.jpg /q
DEL system\media\lockscreen\lockscreen_106.jpg /q
DEL system\media\lockscreen\lockscreen_107.jpg /q
DEL system\media\lockscreen\lockscreen_108.jpg /q
DEL system\media\lockscreen\lockscreen_109.jpg /q
DEL system\media\theme\default_lockscreen_music.zip /q
DEL system\media\wallpaper\wallpaper_006.jpg /q
DEL system\res\sound\ringtone.wav /q
DEL system\res\sound\testpattern1.wav /q
RD system\media\theme\elder-default /q /s

ECHO 删除多余图标
DEL system\media\theme\miui_mod_icons\air.com.nitrome.Gunbrick.png /q
DEL system\media\theme\miui_mod_icons\air.com.unitnine.frisbeegame.png /q
DEL system\media\theme\miui_mod_icons\com.acceleroto.unpossible.png /q
DEL system\media\theme\miui_mod_icons\com.gameloft.android.ANMP.GloftA8HM.png /q
DEL system\media\theme\miui_mod_icons\com.gameloft.android.ANMP.GloftAEHM.png /q
DEL system\media\theme\miui_mod_icons\com.ImaginationUnlimited.instaframe.png /q
DEL system\media\theme\miui_mod_icons\com.kabam.marvelbattle.png /q
DEL system\media\theme\miui_mod_icons\com.leosfortune.png /q
DEL system\media\theme\miui_mod_icons\com.lucidgames.jacobjones1.png /q
DEL system\media\theme\miui_mod_icons\com.miniclip.bikerivals.png /q
DEL system\media\theme\miui_mod_icons\com.miniclip.istunt2.png /q
DEL system\media\theme\miui_mod_icons\com.my.irondesert.png /q
DEL system\media\theme\miui_mod_icons\com.nevosoft.mylittleplanet.png /q
DEL system\media\theme\miui_mod_icons\com.pastagames.ro1mobile.png /q
DEL system\media\theme\miui_mod_icons\com.pixelbite.rr3.png /q
DEL system\media\theme\miui_mod_icons\com.playmous.godoflight.png /q
DEL system\media\theme\miui_mod_icons\com.ratrodstudio.snowparty.png /q
DEL system\media\theme\miui_mod_icons\com.secretexit.turbodismount.png /q
DEL system\media\theme\miui_mod_icons\com.SemirSaleh.DodoMaster.png /q
DEL system\media\theme\miui_mod_icons\com.SemirSaleh.DodoMasterFree.png /q
DEL system\media\theme\miui_mod_icons\com.vectorunit.purple.googleplay.png /q
DEL system\media\theme\miui_mod_icons\com.vividgames.godfire.png /q
DEL system\media\theme\miui_mod_icons\ru.mail.games.android.JungleHeat.png /q
DEL system\media\theme\miui_mod_icons\com.infinit.wostore.ui.png /q
DEL system\media\theme\miui_mod_icons\preset_shortcut_10086.png /q
DEL system\media\theme\miui_mod_icons\com.neusoft.td.android.wo116114.png /q
DEL system\media\theme\miui_mod_icons\com.sinovatech.unicom.ui.png /q

DEL system\etc\iAmCdRom.iso /q

ECHO 安装 App
XCOPY "..\..\..\App\com.google.android.inputmethod.pinyin.apk" data\app\ /y
XCOPY "..\..\..\App\com.oupeng.mini.android.apk" data\app\ /y
PAUSE 

