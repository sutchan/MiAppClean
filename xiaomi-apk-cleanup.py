#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 小米安卓设备内置 APK 精简统一脚本（跨平台版）
# 路径: xiaomi-apk-cleanup.py  v1.4.0
# 作用：交互选择设备类型与操作模式，复用 apk-data.js 数据源逐条执行 adb 命令。
# 适用：小米手机 / 平板 / 电视盒（含乐视 X600 等搭载 MIUI TV 的盒子）
# 依赖：Python 3.8+；已安装 ADB 并加入 PATH；设备开启 USB 调试且已连接。
# 用法：python3 xiaomi-apk-cleanup.py
# 安全：默认「禁用」模式（可 pm enable 恢复）；danger 级核心组件自动跳过。
import json
import os
import re
import shutil
import subprocess
import sys

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
    # 将 JS 字面量转为可 eval 的 Python 结构：替换 true/false/null
    js = m.group(1).replace("true", "True").replace("false", "False").replace("null", "None")
    return eval(js, {"__builtins__": {}}, {})


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
    pkgs = []
    for g in groups:
        for it in g["items"]:
            pkgs.append((it["pkg"], it.get("risk", "safe"), it.get("desc", "")))
    return pkgs


def main():
    if shutil.which("adb") is None:
        sys.exit("[错误] 未检测到 adb，请先安装 Android Platform-Tools 并加入 PATH。")

    print("=" * 40)
    print("小米 APK 精简工具 v1.4.0")
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
        try:
            subprocess.run(f"{cmd} {pkg}", shell=True, check=False)
        except Exception as e:
            print(f"  [执行失败] {e}")

    if skipped:
        print(f"\n已跳过危险组件（严禁精简）：{', '.join(skipped)}")
    if mode == "disable":
        print("\n恢复启用：adb shell pm enable <包名>")
    print("执行完毕。")


if __name__ == "__main__":
    main()
