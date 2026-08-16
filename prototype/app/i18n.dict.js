// MiAppClean 国际化词典（中 / 英）
// 路径: prototype/app/i18n.dict.js  v1.13.3
// 纯数据模块：仅导出 window.MiI18nDict，供 i18n.js 读取，无任何逻辑依赖。
// 拆分自 i18n.js，使词典与运行逻辑各自独立、便于维护。

window.MiI18nDict = {
  // —— 顶栏与门户 ——
  "nav.portal": { "zh-CN": "门户", "en-US": "Portal" },

  // —— Hero ——
  "hero.title": { "zh-CN": "小米设备内置 APK 精简", "en-US": "Xiaomi Built-in APK Cleaner" },
  "hero.desc": {
    "zh-CN": "按机型分类 · 推荐精简清单 · 一键生成 adb 命令。安全优先，危险组件自动拦截。",
    "en-US": "By device · Curated list · One-click adb commands. Safety first, risky packages auto-blocked."
  },
  "badge.safe": { "zh-CN": "安全 可恢复", "en-US": "Safe · Reversible" },
  "badge.caution": { "zh-CN": "谨慎 影响功能", "en-US": "Caution · May affect features" },
  "badge.danger": { "zh-CN": "危险 严禁", "en-US": "Danger · Never remove" },

  // —— 步骤标题 ——
  "step.1.title": { "zh-CN": "选择设备类型", "en-US": "Choose device type" },
  "step.2.title": { "zh-CN": "选择操作模式", "en-US": "Choose operation mode" },
  "step.3.title": { "zh-CN": "勾选要清理的应用", "en-US": "Select apps to clean" },
  "step.4.title": { "zh-CN": "自定义包名（可选）", "en-US": "Custom package names (optional)" },
  "step.5.title": { "zh-CN": "生成的命令", "en-US": "Generated commands" },

  // —— 设备类型 ——
  "device.phone": { "zh-CN": "手机", "en-US": "Phone" },
  "device.pad": { "zh-CN": "平板", "en-US": "Tablet" },
  "device.tv": { "zh-CN": "电视盒", "en-US": "TV Box" },
  "device.note": {
    "zh-CN": "平板复用手机清单；电视盒使用独立精简集合。",
    "en-US": "Tablet reuses the phone list; TV Box uses a dedicated set."
  },

  // —— 操作模式 ——
  "mode.disable": { "zh-CN": "禁用（推荐·可恢复）", "en-US": "Disable (recommended · reversible)" },
  "mode.uninstall": { "zh-CN": "卸载（移除·谨慎）", "en-US": "Uninstall (removed · caution)" },

  // —— 风险图例筛选 ——
  "filter.safe": { "zh-CN": "安全 · 可放心精简", "en-US": "Safe · safe to remove" },
  "filter.caution": { "zh-CN": "谨慎 · 可能影响功能", "en-US": "Caution · may affect features" },
  "filter.danger": { "zh-CN": "危险 · 严禁精简", "en-US": "Danger · never remove" },
  "filter.all": { "zh-CN": "全部", "en-US": "All" },

  // —— 搜索与按钮 ——
  "search.placeholder": { "zh-CN": "搜索包名或描述…", "en-US": "Search package or description…" },
  "btn.deselect": { "zh-CN": "取消全选", "en-US": "Deselect all" },
  "btn.copy": { "zh-CN": "复制全部命令", "en-US": "Copy all commands" },
  "btn.selectAll": { "zh-CN": "全选推荐项", "en-US": "Select all recommended" },
  "btn.clear": { "zh-CN": "清空勾选", "en-US": "Clear selection" },
  "stat.selected": { "zh-CN": "已选", "en-US": "Selected" },
  "output.empty": {
    "zh-CN": "// 勾选应用或粘贴自定义包名后将在此生成 adb 命令",
    "en-US": "// adb commands will be generated here after selecting apps or pasting packages"
  },

  // —— 自定义包名 ——
  "custom.label": { "zh-CN": "粘贴任一清单文件内容，每行一个包名", "en-US": "Paste any list file content, one package per line" },
  "custom.placeholder": { "zh-CN": "com.miui.analytics\ncom.xiaomi.gamecenter\n# 以 # 开头的行为注释", "en-US": "com.miui.analytics\ncom.xiaomi.gamecenter\n# lines starting with # are comments" },

  // —— 卸载警告条 ——
  "warn.uninstall.title": {
    "zh-CN": "危险操作：卸载（uninstall）会真正移除系统应用，不可恢复！",
    "en-US": "Dangerous: Uninstall truly removes system apps and is irreversible!"
  },
  "warn.uninstall.desc": {
    "zh-CN": "可能导致无法开机、失去 OTA 更新能力或系统功能异常。强烈建议优先使用「禁用」模式（可随时 pm enable 恢复）。",
    "en-US": "May cause boot failure, loss of OTA updates, or system malfunction. Prefer the Disable mode (recoverable anytime via pm enable)."
  },

  // —— 风险提示 ——
  "notice.title": { "zh-CN": "", "en-US": "" },
  "notice.1": {
    "zh-CN": "操作前请务必备份设备数据！优先使用「禁用」模式（可 pm enable 恢复）。",
    "en-US": "Back up your device data before any operation! Prefer Disable mode (recoverable via pm enable)."
  },
  "notice.2": {
    "zh-CN": "包名含 system / framework / settings 的核心组件严禁精简，可能直接导致设备变砖。",
    "en-US": "Core packages containing system / framework / settings must never be removed and may brick the device."
  },
  "notice.3": {
    "zh-CN": "执行前先用 adb shell pm list packages <包名> 核对包名是否真实存在，避免误删。",
    "en-US": "Before executing, verify the package exists with adb shell pm list packages <pkg> to avoid mis-deletion."
  },

  // —— 免责声明 ——
  "legal.disclaimer": {
    "zh-CN": "免责声明：本页面仅供学习与技术研究使用。因使用其中命令导致的设备损坏、数据丢失等后果，作者与贡献者不承担任何责任。",
    "en-US": "Disclaimer: This page is for learning and technical research only. The authors and contributors are not liable for any device damage or data loss caused by using these commands."
  },

  // —— 设置面板 ——
  "settings.title": { "zh-CN": "设置", "en-US": "Settings" },
  "settings.theme": { "zh-CN": "外观主题", "en-US": "Appearance" },
  "settings.mode": { "zh-CN": "默认操作模式", "en-US": "Default mode" },
  "settings.remember": { "zh-CN": "记忆上次勾选", "en-US": "Remember selection" },
  "settings.toast": { "zh-CN": "复制成功后提示", "en-US": "Toast on copy" },
  "settings.lang": { "zh-CN": "界面语言", "en-US": "Language" },
  "opt.theme.light": { "zh-CN": "浅色", "en-US": "Light" },
  "opt.theme.dark": { "zh-CN": "深色", "en-US": "Dark" },
  "opt.theme.auto": { "zh-CN": "跟随系统", "en-US": "Follow system" },
  "opt.lang.zh": { "zh-CN": "简体中文", "en-US": "简体中文" },
  "opt.lang.en": { "zh-CN": "English", "en-US": "English" },

  // —— 风险等级标签（供 app.state.js 使用）——
  "risk.safe": { "zh-CN": "安全", "en-US": "Safe" },
  "risk.caution": { "zh-CN": "谨慎", "en-US": "Caution" },
  "risk.danger": { "zh-CN": "危险", "en-US": "Danger" },

  // —— 分享增强：宣传文案池（随机选取，多条）——
  "share.linkLabel": { "zh-CN": "🔗 我的小米精简方案：", "en-US": "🔗 My Xiaomi debloat plan:" },
  "share.promo.1": {
    "zh-CN": "MiAppClean · 按机型分类、风险分级，一键生成 adb 精简命令，危险组件自动拦截。安全去冗余，开源免费！",
    "en-US": "MiAppClean · Curated by device, risk-graded, one-click adb debloat commands with auto-blocked risky packages. Safe & open-source!"
  },
  "share.promo.2": {
    "zh-CN": "还在手动 adb 删系统应用？试试 MiAppClean，勾选即生成可恢复的禁用命令，小白也能安全精简小米手机。",
    "en-US": "Tired of manual adb uninstall? MiAppClean generates reversible disable commands by ticking boxes — safe debloating for everyone."
  },
  "share.promo.3": {
    "zh-CN": "预装应用太多太卡？MiAppClean 帮你按风险等级精简小米/红米设备，禁用优先、随时 pm enable 恢复。",
    "en-US": "Too many bloat apps? MiAppClean helps you debloat Xiaomi/Redmi by risk level — disable-first, recoverable anytime via pm enable."
  },
  "share.promo.4": {
    "zh-CN": "开源小米精简工具 MiAppClean：平板/电视盒通用，危险核心组件自动拦截，拒绝变砖。",
    "en-US": "Open-source Xiaomi debloater MiAppClean: works on tablets & TV boxes, auto-blocks core packages to avoid bricking."
  },
  "share.promo.5": {
    "zh-CN": "把小米设备交还给用户。MiAppClean 让预装应用精简变得可控、可恢复、可分享。",
    "en-US": "Give your Xiaomi device back to you. MiAppClean makes bloatware removal controllable, reversible and shareable."
  },

  // —— Toast 提示 ——
  "toast.nothing": { "zh-CN": "暂无可复制的命令", "en-US": "Nothing to copy yet" },
  "toast.copied": { "zh-CN": "已复制全部命令 ✓", "en-US": "All commands copied ✓" },
  "toast.copiedShare": { "zh-CN": "已复制命令 + 分享文案 ✓", "en-US": "Commands + share text copied ✓" },
  "toast.copyFallback": { "zh-CN": "已选中命令，请按 Ctrl/Cmd+C 复制", "en-US": "Commands selected, press Ctrl/Cmd+C to copy" },
  "toast.cancelDanger": { "zh-CN": "已取消复制（高危操作）", "en-US": "Copy cancelled (high-risk)" },
  "toast.selectAll": { "zh-CN": "已全选推荐项（危险组件已排除）", "en-US": "All recommended selected (danger excluded)" },
  "toast.deselect": { "zh-CN": "已取消全部已选项", "en-US": "All selections cleared" },
  "toast.keepDisable": { "zh-CN": "已取消卸载模式，保持「禁用」", "en-US": "Uninstall cancelled, kept Disable mode" },

  // —— 弹窗 ——
  "confirm.uninstallCopy": {
    "zh-CN": "警告：当前命令包含「卸载（uninstall）」，会真正移除系统应用且不可恢复，\n可能导致无法开机、失去 OTA 能力或功能异常。\n\n是否仍要复制这些命令？\n（建议优先使用「禁用」模式，可随时 pm enable 恢复）",
    "en-US": "Warning: commands include Uninstall, which truly removes system apps and is irreversible,\nand may cause boot failure, loss of OTA, or malfunction.\n\nStill copy these commands?\n(Prefer Disable mode, recoverable anytime via pm enable)"
  },
  "confirm.switchUninstall": {
    "zh-CN": "危险操作确认：卸载（uninstall）会真正移除系统应用，不可恢复！\n可能导致设备无法开机、失去 OTA 更新能力或系统功能异常。\n\n确定要切换到卸载模式吗？\n（建议优先使用「禁用」模式，可随时 pm enable 恢复）",
    "en-US": "Dangerous operation: Uninstall truly removes system apps and is irreversible!\nMay cause boot failure, loss of OTA updates, or malfunction.\n\nSwitch to Uninstall mode?\n(Prefer Disable mode, recoverable anytime via pm enable)"
  }
};
