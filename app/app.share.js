// MiAppClean 分享增强模块（纯函数）
// 依赖：i18n.js（window.MiI18n，可选；缺失时安全降级）
// 对外暴露：window.MiShare
// 路径: app/app.share.js  v1.13.4

(function () {
  "use strict";

  // —— 降级 stub：先于真实逻辑注册，确保即使本模块后续抛错，window.MiShare 仍可用 ——
  window.MiShare = {
    pickPromo: function () { return ""; },
    buildShareText: function (cmds) { return cmds || ""; }
  };

  try {
  // 宣传文案池前缀：share.promo.1 ... share.promo.N（i18n 字典中的 key）
  var PROMO_PREFIX = "share.promo.";

  // 安全取 i18n：缺失时回退到 fallback，绝不抛错
  function i18n(key, fallback) {
    try {
      if (window.MiI18n && typeof window.MiI18n.t === "function") {
        var v = window.MiI18n.t(key);
        if (v && v !== key) return v;
      }
    } catch (e) {}
    return fallback != null ? fallback : key;
  }

  // 从 i18n 文案池随机选取一条宣传文案（按当前语言）。
  // 探测方式：依次尝试 share.promo.N，借 MiI18n.t() 判断 key 是否有效
  // （有效则 t 返回非 key 文案，缺失则原样返回 key）；池穷尽即停止。
  // 双重兜底：某语言缺失则 t() 返回中文；整池缺失则返回空串，绝不抛错。
  function pickPromo() {
    var pool = [];
    for (var i = 1; ; i++) {
      var key = PROMO_PREFIX + i;
      var probe = i18n(key, key);
      if (probe === key) break; // 该 key 不存在，池已穷尽
      var text = i18n(key, "");
      if (text && text !== key) pool.push(text);
    }
    if (pool.length === 0) return "";
    var idx = Math.floor(Math.random() * pool.length);
    return pool[idx];
  }

  // 组装完整剪贴板文本：命令 + 分享链接 + 随机宣传文案
  // opts.shareUrl 可选；缺省取当前页面地址
  function buildShareText(commands, opts) {
    opts = opts || {};
    var url = opts.shareUrl || (location && location.href) || "";
    var linkLabel = i18n("share.linkLabel", "🔗 我的小米精简方案：");
    var promo = pickPromo();

    var parts = [];
    if (commands) parts.push(commands.trim());
    if (url) parts.push(linkLabel + "\n" + url);
    if (promo) parts.push(promo);
    return parts.join("\n\n");
  }

  // 真实实现覆盖降级 stub
  window.MiShare = {
    pickPromo: pickPromo,
    buildShareText: buildShareText
  };
  } catch (e) {
    // 模块初始化失败：已保留降级 stub，复制功能退化为仅复制命令，应用不崩。
    if (window.console) console.warn("[MiShare] 初始化失败，已降级运行：", e);
  }
})();
