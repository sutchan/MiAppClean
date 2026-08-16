import fs from "fs";
const src = fs.readFileSync("apk-data.js", "utf-8");
const m = src.match(/const APP_DATA\s*=\s*(\{[\s\S]*?\n\});/);
const data = eval("(" + m[1] + ")");
const safe = (dev) => {
  const s = new Set();
  for (const g of data[dev]) for (const it of g.items) if (it.risk !== "danger") s.add(it.pkg);
  return s;
};
const phoneSafe = safe("phone");
const tvSafe = safe("tv");
const bat = fs.readFileSync("scripts/xiaomi-apk-cleanup.bat", "utf-8");
const grab = (name) => {
  const mm = bat.match(new RegExp('SET "' + name + '=([\\s\\S]*?)"'));
  return new Set(mm[1].split("\n").map((x) => x.replace(/;\^?$/,"").trim()).filter((x) => x && x !== "^"));
};
const bp = grab("PKG_PHONE");
const bt = grab("PKG_TV");
const a = [...phoneSafe.difference(bp)].sort();
const b = [...bp.difference(phoneSafe)].sort();
const c = [...tvSafe.difference(bt)].sort();
const d = [...bt.difference(tvSafe)].sort();
const lines = [
  "phoneSafe=" + phoneSafe.size + " batPhone=" + bp.size,
  "tvSafe=" + tvSafe.size + " batTV=" + bt.size,
  "ONLY_IN_SRC_PHONE(" + a.length + "): " + a.join(" "),
  "ONLY_IN_BAT_PHONE(" + b.length + "): " + b.join(" "),
  "ONLY_IN_SRC_TV(" + c.length + "): " + c.join(" "),
  "ONLY_IN_BAT_TV(" + d.length + "): " + d.join(" "),
];
fs.writeFileSync("scripts/_check_out.txt", lines.join("\n"));
