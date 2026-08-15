// MiAppClean 国际化模块（中 / 英）
// 依赖：无；对外暴露 window.MiI18n。
// 路径: prototype/app/i18n.js  v1.11.0

(function () {
  "use strict";

  // —— 降级 stub：先于真实逻辑注册，确保即使本模块后续任意环节抛错，
  //    window.MiI18n 始终存在且提供安全实现，绝不导致宿主应用崩溃。——
  window.MiI18n = {
    t: function (k) { return k; },
    riskLabel: function (r) { return r || "safe"; },
    apply: function () {},
    setLang: function () {},
    getLang: function () { return "zh-CN"; },
    SUPPORTED: ["zh-CN", "en-US"]
  };

  try {
  var LANG_KEY = "miac-lang";          // 持久化键：zh-CN | en-US
  var SUPPORTED = ["zh-CN", "en-US"];  // 支持的语言

  // 文案字典：key -> { "zh-CN": ..., "en-US": ... }
  // data-i18n 元素取值此表；其余（弹窗/埋点）通过 MiI18n.t(key) 取当前语言文本。
  var DICT = {
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

    // —— Toast 提示 ——
    "toast.nothing": { "zh-CN": "暂无可复制的命令", "en-US": "Nothing to copy yet" },
    "toast.copied": { "zh-CN": "已复制全部命令 ✓", "en-US": "All commands copied ✓" },
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

  function detectLang() {
    try {
      var saved = localStorage.getItem(LANG_KEY);
      if (saved && SUPPORTED.indexOf(saved) >= 0) return saved;
    } catch (e) {}
    // 依据浏览器语言兜底（仅支持中/英）
    var nav = (navigator.language || "zh-CN").toLowerCase();
    return nav.indexOf("zh") >= 0 ? "zh-CN" : "en-US";
  }

  var current = detectLang();

  // 安全取文案：即使 DICT 缺失 / 数据格式异常也不抛错，回退到 key 或中文兜底
  function t(key) {
    try {
      var entry = DICT[key];
      if (!entry || typeof entry !== "object") return key;
      if (entry[current] != null) return entry[current];
      if (entry["zh-CN"] != null) return entry["zh-CN"];
      return key;
    } catch (e) {
      return key;
    }
  }

  function riskLabel(risk) {
    return t("risk." + (risk || "safe"));
  }

  // 单个元素的安全翻译：某元素异常不影响其余
  function translateEl(el) {
    try {
      var key = el.getAttribute("data-i18n");
      if (key) el.textContent = t(key);
    } catch (e) {}
  }
  function translatePlaceholder(el) {
    try {
      var key = el.getAttribute("data-i18n-placeholder");
      if (key) el.setAttribute("placeholder", t(key));
    } catch (e) {}
  }
  function translateHtml(el) {
    try {
      var key = el.getAttribute("data-i18n-html");
      if (key) el.innerHTML = t(key);
    } catch (e) {}
  }

  // 将字典应用到所有 [data-i18n] 元素（含 data-i18n-placeholder / data-i18n-html）
  // 整体包 try/catch：即使国际化子系统异常，也绝不让页面崩溃。
  function apply() {
    try {
      document.documentElement.setAttribute("lang", current);

      document.querySelectorAll("[data-i18n]").forEach(translateEl);
      document.querySelectorAll("[data-i18n-placeholder]").forEach(translatePlaceholder);
      document.querySelectorAll("[data-i18n-html]").forEach(translateHtml);

      // 触发语言变更事件，供其它模块（如已渲染列表）刷新
      window.dispatchEvent(new CustomEvent("langchange", { detail: { lang: current } }));
    } catch (e) {
      // 国际化应用失败不应阻断应用其余功能
      if (window.console) console.warn("[MiI18n] apply 失败，已降级：", e);
    }
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) < 0) return;
    current = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    apply();
  }

  function getLang() { return current; }

  // 真实实现覆盖降级 stub（若上方 try 内任意步骤抛错，则保留 stub，应用不崩）
  window.MiI18n = {
    t: t,
    riskLabel: riskLabel,
    apply: apply,
    setLang: setLang,
    getLang: getLang,
    SUPPORTED: SUPPORTED
  };
  } catch (e) {
    // 国际化模块初始化失败：已保留降级 stub，宿主应用可继续运行（仅文案降级为 key）。
    if (window.console) console.warn("[MiI18n] 初始化失败，已降级运行：", e);
  }
})();
