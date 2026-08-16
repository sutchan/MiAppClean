// MiAppClean 国际化运行模块
// 路径: prototype/app/i18n.js  v1.13.3
// 职责：语言持久化（localStorage 'miac-lang'）+ 文本取用 I(key)。
// 与 i18n.dict.js（纯词典数据）分离：本文件仅含「读取/选择/取用」逻辑，
// 词典内容集中在 i18n.dict.js，二者通过 window.MiI18nDict 解耦。
(function () {
  "use strict";

  var STORAGE_KEY = "miac-lang";

  // 词典由 i18n.dict.js 注入（先于本文件加载）
  var DICT = window.MiI18nDict || {};

  function normalize(code) {
    return code === "en-US" ? "en-US" : "zh-CN";
  }

  // 取当前语言（localStorage → 浏览器偏好 → 默认 zh-CN）
  function getLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en-US" || saved === "zh-CN") return saved;
    } catch (e) {}
    var nav = (navigator.language || "zh-CN").toLowerCase();
    return nav.indexOf("zh") === 0 ? "zh-CN" : "en-US";
  }

  function setLang(code) {
    code = normalize(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch (e) {}
    applyLang(code);
    return code;
  }

  // 切换语言并触发回调广播
  function toggleLang() {
    var next = getLang() === "zh-CN" ? "en-US" : "zh-CN";
    return setLang(next);
  }

  function applyLang(code) {
    code = normalize(code);
    document.documentElement.lang = code;
    // 广播语言变更，交由绑定层刷新文案
    window.dispatchEvent(new CustomEvent("miac:lang", { detail: { lang: code } }));
  }

  // 取文案：优先当前语言，缺失则回退到 zh-CN，再缺失返回 key 本身
  function I(key, lang) {
    var entry = DICT[key];
    if (!entry) return key;
    var code = normalize(lang || getLang());
    return entry[code] != null ? entry[code] : (entry["zh-CN"] != null ? entry["zh-CN"] : key);
  }

  window.MiI18n = {
    DICT: DICT,
    getLang: getLang,
    setLang: setLang,
    toggleLang: toggleLang,
    applyLang: applyLang,
    I: I
  };

  // 首次加载时应用语言（不改变已存值，仅同步 DOM 与广播）
  applyLang(getLang());
})();
