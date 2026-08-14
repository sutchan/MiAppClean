#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 小米安卓设备内置 APK 精简统一脚本（跨平台版）
# 路径: xiaomi-apk-cleanup.py  v1.6.10
# 作用：交互选择设备类型与操作模式，复用 apk-data.js 数据源逐条执行 adb 命令。
# 适用：小米手机 / 平板 / 电视盒（含乐视 X600 等搭载 MIUI TV 的盒子）
# 依赖：Python 3.8+；已安装 ADB 并加入 PATH；设备开启 USB 调试且已连接。
# 用法：
#   python3 xiaomi-apk-cleanup.py            # 交互式精简
#   python3 xiaomi-apk-cleanup.py check      # 预检：仅输出设备上真实存在的推荐包
#   python3 xiaomi-apk-cleanup.py backup     # 备份：导出当前已安装包快照用于恢复
# 安全：默认「禁用」模式（可 pm enable 恢复）；danger 级核心组件自动跳过。
import os
import re
import shutil
import subprocess
import sys
from datetime import datetime

HERE = os.path.dirname(os.path.abspath(__file__))
DATA_JS = os.path.join(HERE, "apk-data.js")

DEVICE_LABELS = {"phone": "手机", "pad": "平板（复用手机）", "tv": "电视盒"}
MODE_LABELS = {"disable": "禁用（推荐·可恢复）", "uninstall": "卸载（移除·谨慎）"}


def load_data():
    """从 apk-data.js 提取 APP_DATA，作为单一数据源。"""
    with open(DATA_JS, "r", encoding="utf-8") as f:
        src = f.read()
    m = re.search(r"const APP_DATA\s*=\s*(\{.*?\n\});", src, re.S)
    if not m:
        sys.exit("无法解析 apk-data.js 中的 APP_DATA")
    js = m.group(1).replace("true", "True").replace("false", "False").replace("null", "None")
    return eval(js, {"__builtins__": {}}, {})


def adb(args):
    """执行 adb 命令，返回 stdout 文本。"""
    try:
        out = subprocess.run(f"adb {args}", shell=True, capture_output=True, text=True, check=False)
        return out.stdout
    except Exception as e:
        return f"[执行失败] {e}"


def pick(options, labels):
    print()
    for i, (key, lab) in enumerate(labels.items(), 1):
        print(f"  {i}) {lab}")
    while True:
        try:
            choice = int(input("请选择数字：").strip())
        except ValueError:
            choice = 0
        if 1 <= choice <= len(options):
            return options[choice - 1]
        print("输入无效，请重新选择。")


def collect_pkgs(data, device):
    groups = data["phone"] if device == "pad" else data[device]
    return [(it["pkg"], it.get("risk", "safe"), it.get("desc", "")) for g in groups for it in g["items"]]


def cmd_clean():
    if shutil.which("adb") is None:
        sys.exit("[错误] 未检测到 adb，请先安装 Android Platform-Tools 并加入 PATH。")
    print("=" * 40)
    print("小米 APK 精简工具 v1.6.10")
    print("=" * 40)
    os.system("adb devices")

    data = load_data()
    device = pick(list(DEVICE_LABELS), DEVICE_LABELS)
    mode = pick(list(MODE_LABELS), MODE_LABELS)
    cmd = "adb shell pm uninstall --user 0" if mode == "uninstall" else "adb shell pm disable-user --user 0"

    pkgs = collect_pkgs(data, device)
    print(f"\n即将对「{DEVICE_LABELS[device]}」执行「{MODE_LABELS[mode]}」")
    print(f"共 {len(pkgs)} 个包（danger 级将自动跳过）。确认执行？[y/N]：", end="")
    if input().strip().lower() != "y":
        print("已取消。")
        return

    skipped = []
    for pkg, risk, desc in pkgs:
        if risk == "danger":
            skipped.append(pkg)
            continue
        note = " # 谨慎" if risk == "caution" else ""
        print(f"{cmd} {pkg}{note}")
        adb(f"{cmd} {pkg}")
    if skipped:
        print(f"\n已跳过危险组件（严禁精简）：{', '.join(skipped)}")
    if mode == "disable":
        print("\n恢复启用：adb shell pm enable <包名>")
    print("执行完毕。")


def cmd_check():
    """预检：输出设备上真实存在的推荐包，便于确认后再精简。"""
    if shutil.which("adb") is None:
        sys.exit("[错误] 未检测到 adb。")
    data = load_data()
    device = pick(list(DEVICE_LABELS), DEVICE_LABELS)
    pkgs = collect_pkgs(data, device)
    print(f"\n预检设备「{DEVICE_LABELS[device]}」的推荐包是否存在...")
    found, missing = [], []
    for pkg, risk, desc in pkgs:
        if risk == "danger":
            continue
        # 精确匹配包名：pm list packages 为前缀匹配，需用 grep -x 锁定整行
        exists = pkg in adb(f"shell pm list packages {pkg} | grep -x {pkg}")
        (found if exists else missing).append((pkg, risk))
    print(f"\n✅ 存在（{len(found)}）：")
    for p, r in found:
        print(f"  [{r}] {p}")
    print(f"\n⚪ 不存在（{len(missing)}，机型差异可忽略）：")
    for p, r in missing:
        print(f"  [{r}] {p}")


def cmd_backup():
    """备份：导出当前已安装包快照，供误删后定位恢复。"""
    if shutil.which("adb") is None:
        sys.exit("[错误] 未检测到 adb。")
    ts = datetime.now().strftime("%Y%m%d-%H%M%S")
    out_file = os.path.join(HERE, f"backup-{ts}.txt")
    print(f"导出当前已安装包列表到 {out_file} ...")
    text = adb("shell pm list packages")
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"完成，共 {len([l for l in text.splitlines() if l.strip()])} 行。恢复时可对照此文件定位包名。")


def main():
    sub = sys.argv[1] if len(sys.argv) > 1 else "clean"
    if sub == "check":
        cmd_check()
    elif sub == "backup":
        cmd_backup()
    elif sub in ("clean", "run"):
        cmd_clean()
    else:
        print("未知子命令。用法：")
        print("  python3 xiaomi-apk-cleanup.py            # 交互精简")
        print("  python3 xiaomi-apk-cleanup.py check      # 预检存在性")
        print("  python3 xiaomi-apk-cleanup.py backup     # 导出快照")
        sys.exit(1)


if __name__ == "__main__":
    main()
