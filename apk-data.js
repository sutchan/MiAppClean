// 小米设备内置 APK 推荐精简清单数据
// 数据来源于仓库精简命令文件中的推荐精简项（已验证可精简）
// 路径: apk-data.js  v1.6.4
// 结构：APP_DATA[设备类型] = [{ cat: 类别, items: [{ pkg, desc, risk }] }]
// risk 取值：safe(可安全精简) / caution(精简后可能影响功能,谨慎) / danger(核心组件,严禁精简)
// 设备类型：phone(手机) / pad(平板,复用手机) / tv(电视盒)

const APP_DATA = {
  phone: [
    { cat: "系统核心（严禁精简）", items: [
      { pkg: "com.android.settings", desc: "系统设置", risk: "danger" },
      { pkg: "com.miui.home", desc: "系统桌面 Launcher", risk: "danger" },
      { pkg: "com.android.systemui", desc: "系统界面", risk: "danger" },
      { pkg: "android", desc: "Android 框架核心", risk: "danger" },
    ]},
    { cat: "广告模块", items: [
      { pkg: "com.android.adservices.api", desc: "广告服务", risk: "safe" },
      { pkg: "com.miui.analytics", desc: "小米统计", risk: "safe" },
      { pkg: "com.miui.systemAdSolution", desc: "系统广告", risk: "safe" },
      { pkg: "com.xiaomi.ab", desc: "AB 实验", risk: "safe" },
      { pkg: "com.miui.daemon", desc: "后台守护", risk: "safe" },
    ]},
    { cat: "输入法", items: [
      { pkg: "com.baidu.duersdk.opensdk", desc: "百度语音 SDK", risk: "caution" },
      { pkg: "com.baidu.input_mi", desc: "百度输入法", risk: "caution" },
      { pkg: "com.iflytek.inputmethod.miui", desc: "讯飞输入法", risk: "caution" },
      { pkg: "com.sohu.inputmethod.sogou.xiaomi", desc: "搜狗输入法", risk: "caution" },
    ]},
    { cat: "安卓系统自带", items: [
      { pkg: "com.android.dreams.basic", desc: "屏保基础", risk: "safe" },
      { pkg: "com.android.dreams.phototable", desc: "相册屏保", risk: "safe" },
      { pkg: "com.android.htmlviewer", desc: "HTML 查看器", risk: "safe" },
      { pkg: "com.android.location.fused", desc: "融合定位", risk: "caution" },
      { pkg: "com.android.musicfx", desc: "音效增强", risk: "safe" },
      { pkg: "com.android.wallpaper.livepicker", desc: "动态壁纸选择器", risk: "safe" },
      { pkg: "com.android.wallpaperbackup", desc: "壁纸备份", risk: "safe" },
      { pkg: "com.bsp.catchlog", desc: "日志捕获", risk: "safe" },
    ]},
    { cat: "音效", items: [
      { pkg: "com.atmos", desc: "杜比全景声", risk: "caution" },
      { pkg: "com.miui.audioeffect", desc: "小米音效", risk: "caution" },
      { pkg: "com.atmos.daxappUI", desc: "杜比界面", risk: "caution" },
    ]},
    { cat: "系统配色主题", items: [
      { pkg: "com.android.theme.color.cinnamon", desc: "主题色-肉桂", risk: "safe" },
      { pkg: "com.android.theme.color.green", desc: "主题色-绿", risk: "safe" },
      { pkg: "com.android.theme.color.ocean", desc: "主题色-海洋", risk: "safe" },
      { pkg: "com.android.theme.color.orchid", desc: "主题色-兰", risk: "safe" },
      { pkg: "com.android.theme.color.purple", desc: "主题色-紫", risk: "safe" },
    ]},
    { cat: "超级壁纸", items: [
      { pkg: "com.miui.miwallpaper.earth", desc: "超级壁纸-地球", risk: "safe" },
      { pkg: "com.miui.miwallpaper.geometry", desc: "超级壁纸-几何", risk: "safe" },
      { pkg: "com.miui.miwallpaper.mars", desc: "超级壁纸-火星", risk: "safe" },
      { pkg: "com.miui.miwallpaper.saturn", desc: "超级壁纸-土星", risk: "safe" },
      { pkg: "com.miui.miwallpaper.snowmountain", desc: "超级壁纸-雪山", risk: "safe" },
    ]},
    { cat: "小米自带应用", items: [
      { pkg: "com.duokan.reader", desc: "多看阅读", risk: "safe" },
      { pkg: "com.duokan.videodaily", desc: "多看视频", risk: "safe" },
      { pkg: "com.mfashiongallery.emag", desc: "时尚画报", risk: "safe" },
      { pkg: "com.mi.dlabs.vr", desc: "小米 VR", risk: "safe" },
      { pkg: "com.miui.aod", desc: "息屏显示", risk: "caution" },
      { pkg: "com.miui.audiomonitor", desc: "音频监控", risk: "safe" },
      { pkg: "com.miui.bugreport", desc: "错误报告", risk: "safe" },
      { pkg: "com.miui.hybrid.accessory", desc: "混合应用组件", risk: "safe" },
      { pkg: "com.xiaomi.mtb", desc: "小米测试工具", risk: "safe" },
      { pkg: "com.miui.newhome", desc: "新版桌面", risk: "caution" },
      { pkg: "com.miui.sysopt", desc: "系统优化", risk: "safe" },
      { pkg: "com.miui.thirdappassistant", desc: "第三方助手", risk: "safe" },
      { pkg: "com.miui.touchassistant", desc: "触摸助手", risk: "safe" },
      { pkg: "com.miui.translation.kingsoft", desc: "金山翻译", risk: "safe" },
      { pkg: "com.miui.translation.youdao", desc: "有道翻译", risk: "safe" },
      { pkg: "com.miui.userguide", desc: "用户指南", risk: "safe" },
      { pkg: "com.miui.whetstone", desc: "进程管理", risk: "safe" },
      { pkg: "com.miui.wmsvc", desc: "窗口管理服务", risk: "caution" },
      { pkg: "com.xiaomi.gamecenter", desc: "小米游戏中心", risk: "safe" },
      { pkg: "com.xiaomi.gamecenter.sdk.service", desc: "游戏 SDK 服务", risk: "safe" },
      { pkg: "com.xiaomi.joyose", desc: "Joyose 调度", risk: "caution" },
      { pkg: "com.xiaomi.mi_connect_service", desc: "妙享连接", risk: "caution" },
      { pkg: "com.xiaomi.migameservice", desc: "小米游戏服务", risk: "safe" },
      { pkg: "com.xiaomi.macro", desc: "自动连招", risk: "safe" },
      { pkg: "com.xiaomi.payment", desc: "小米支付", risk: "caution" },
    ]},
    { cat: "手机测试", items: [
      { pkg: "com.huaqin.factory", desc: "华勤工厂测试", risk: "safe" },
      { pkg: "com.longcheertel.AutoTest", desc: "龙旗自动测试", risk: "safe" },
      { pkg: "com.longcheertel.cit", desc: "龙旗 CIT", risk: "safe" },
      { pkg: "com.longcheertel.midtest", desc: "龙旗中间测试", risk: "safe" },
      { pkg: "com.longcheertel.modemlog", desc: "龙旗基带日志", risk: "safe" },
      { pkg: "com.longcheertel.smsregister", desc: "龙旗短信注册", risk: "safe" },
      { pkg: "com.mi.AutoTest", desc: "小米自动测试", risk: "safe" },
      { pkg: "com.modemdebug", desc: "基带调试", risk: "safe" },
    ]},
    { cat: "MTK 平台", items: [
      { pkg: "com.mediatek.floatmenu", desc: "MTK 悬浮菜单", risk: "safe" },
      { pkg: "com.mediatek.mdmlsample", desc: "MTK MDML 示例", risk: "safe" },
      { pkg: "com.mediatek.mtklogger", desc: "MTK 日志", risk: "safe" },
      { pkg: "com.mediatek.providers.drm", desc: "MTK DRM", risk: "safe" },
    ]},
  ],
  tv: [
    { cat: "系统核心（严禁精简）", items: [
      { pkg: "com.android.settings", desc: "系统设置", risk: "danger" },
      { pkg: "com.mitv.tvhome", desc: "电视桌面", risk: "danger" },
      { pkg: "com.android.systemui", desc: "系统界面", risk: "danger" },
      { pkg: "android", desc: "Android 框架核心", risk: "danger" },
    ]},
    { cat: "电视盒应用", items: [
      { pkg: "com.mipay.wallet.tv", desc: "小米支付(电视)", risk: "caution" },
      { pkg: "com.xiaomi.mibox.gamecenter", desc: "盒子游戏中心", risk: "safe" },
      { pkg: "com.xiaomi.mitv.handbook", desc: "电视使用手册", risk: "safe" },
      { pkg: "com.xiaomi.mitv.pay", desc: "电视支付", risk: "caution" },
      { pkg: "com.xiaomi.mitv.payment", desc: "电视支付服务", risk: "caution" },
      { pkg: "com.xiaomi.mitv.tvpush.tvpushservice", desc: "电视推送服务", risk: "safe" },
    ]},
  ],
};
