# 贡献指南

感谢参与小米设备内置应用精简工具的建设！请遵循以下约定。

## 项目结构

- `apk-data.js`：**唯一数据源**，存放各设备推荐精简包名与风险等级。新增/调整包名请改这里。
- `xiaomi-apk-cleanup.html / .css / .js`：静态前端，从 `apk-data.js` 读取数据渲染。
- `xiaomi-apk-cleanup.bat` / `xiaomi-apk-cleanup.py`：命令行精简脚本，复用同一数据源。
- `精简小米手机MIUI及电视盒app命令.txt`：通用命令模板参考。
- `MIUI-lite-for-Letv-X600.bat`：乐视 X600 盒子 ROM 精简历史脚本。

## 数据格式约定

`apk-data.js` 中每个包名条目形如：

```js
{ pkg: "com.miui.analytics", desc: "小米统计", risk: "safe" }
```

`risk` 取值：

| 值 | 含义 | 处理 |
|----|------|------|
| `safe` | 可安全精简 | 默认勾选 |
| `caution` | 精简后可能影响某项功能 | 标注「谨慎」，建议按需取舍 |
| `danger` | 系统核心组件 | 严禁精简，前端/脚本自动跳过 |

新增包名时请：
1. 明确填写 `risk`，切勿将核心组件（settings / systemui / telephony / framework 等）标为 `safe`。
2. `desc` 用简体中文简短说明用途。
3. 按类别归入对应 `cat`，无合适类别时新建。

## 版本与提交

- 版本号遵循 [SemVer](https://semver.org/lang/zh-CN/)，每次修改至少 bump 一次 patch。
- 同步更新 `VERSION`、`CHANGELOG.md`、改动文件的头注释版本、前端 `html` 展示版本。
- 提交信息遵循仓库根目录规则的 `type: description` 格式（见 README）。

## 校验

提交前请本地运行：

```bash
python3 -m py_compile xiaomi-apk-cleanup.py   # 语法检查
```

数据完整性（包名 risk 字段、apk-data.js 可解析）也可本地用以下内联命令预检：

```bash
python3 - <<'PY'
import re
src = open("apk-data.js", encoding="utf-8").read()
m = re.search(r"const APP_DATA\s*=\s*(\{.*?\n\});", src, re.S)
js = m.group(1).replace("true","True").replace("false","False").replace("null","None")
data = eval(js, {"__builtins__":{}}, {})
for dev, groups in data.items():
    for g in groups:
        for it in g["items"]:
            assert "risk" in it, it
print("apk-data.js 校验通过")
PY
```

推送后 GitHub Actions 会自动校验版本一致性与数据完整性。
