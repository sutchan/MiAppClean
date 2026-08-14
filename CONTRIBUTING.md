# MiAppClean 贡献指南

感谢参与 **MiAppClean**（小米设备内置应用精简工具）的建设！请遵循以下约定。

## 项目结构

```
MiAppClean/
├── apk-data.js                    # ★ 唯一数据源：各设备推荐精简包名与风险等级
├── xiaomi-apk-cleanup.bat         # Windows 统一精简脚本，复用同一数据源
├── xiaomi-apk-cleanup.py          # 跨平台精简脚本（Python），复用同一数据源
├── 精简小米手机MIUI及电视盒app命令.md  # 通用命令模板参考
├── MIUI-lite-for-Letv-X600.bat    # 乐视 X600 盒子 ROM 精简历史脚本
├── 小米MIUI应用列表.md             # 通用 MIUI 内置 App 包名清单
├── MIUI14-App清单.md             # MIUI 14 内置 App 包名清单
├── 小米13内置App清单.md           # 小米 13 内置 App 包名清单
├── 小米平板5内置App清单.md         # 小米平板 5 内置 App 包名清单
├── HyperOS-App清单.md            # HyperOS 内置 App 包名清单
├── index.html                     # 静态站点首页（零依赖，GitHub Pages 部署）
├── theme.js                       # 站点主题切换逻辑（读取 URL 主题参数）
├── README.md / VERSION / CHANGELOG.md  # 项目说明与版本单一来源
├── CONTRIBUTING.md                # 本文件
└── .github/workflows/             # CI（ci.yml 校验）/ 部署（deploy.yml 发布站点）
```

> 核心原则：**单一数据源**。`apk-data.js` 是唯一包名来源，前端与脚本均从中读取，
> 严禁在脚本/前端内硬编码包名清单，避免多处同步出错。

## 数据格式约定

`apk-data.js` 整体结构：`APP_DATA[设备类型] = [{ cat, items: [{ pkg, desc, risk }] }]`，
设备类型取值 `phone`（手机）/ `pad`（平板，复用手机）/ `tv`（电视盒）。

每个包名条目形如：

```js
{ pkg: "com.miui.analytics", desc: "小米统计", risk: "safe" }
```

字段含义：

| 字段 | 说明 |
|------|------|
| `pkg` | Android 应用包名（`packageName`），全小写，点号分隔 |
| `desc` | 简体中文简短用途说明，用于前端展示与脚本日志 |
| `risk` | 风险等级，见下表 |
| `cat` | 所属类别（中文），用于前端分组与脚本按类执行 |

`risk` 取值：

| 值 | 含义 | 处理 |
|----|------|------|
| `safe` | 可安全精简 | 默认勾选 |
| `caution` | 精简后可能影响某项功能 | 标注「谨慎」，建议按需取舍 |
| `danger` | 系统核心组件 | 严禁精简，前端/脚本自动跳过 |

新增包名时请：
1. 明确填写 `risk`，切勿将核心组件（settings / systemui / telephony / framework 等）标为 `safe`。
2. `desc` 用简体中文简短说明用途。
3. 按类别归入对应 `cat`，无合适类别时新建（同类目请勿重复拆分）。
4. 包名需真实存在，提交前建议 `adb shell pm list packages | findstr <pkg>` 核对。

## 编码规范

- **单文件行数**：源代码文件（`.js` / `.py` / `.html` / `.css` 等）单行超过 **200 行** 时，
  须按职责拆分为更小模块（如数据 `apk-data.js`、UI 与逻辑分离），保持单一职责与可读性。
- **文件头注释**：每个源文件顶部标注路径与版本号，格式 `// path vX.Y.Z`，
  修改该文件时同步更新其头注释版本（未改动文件不刷写）。
- **注释语言**：关键逻辑添加中文注释；对外展示文本统一简体中文。
- **脚本健壮性**：`.py` / `.bat` 须先校验 `adb` 可用性再执行；`danger` 级组件无条件跳过。

## 版本与提交

- 版本号遵循 [SemVer](https://semver.org/lang/zh-CN/)，每次修改至少 bump 一次 patch。
- 升级后同步更新以下**单一来源**位置（改动文件头注释版本仅更新被改文件）：
  - `VERSION` 的版本字段
  - `CHANGELOG.md` 新增对应版本小节
  - `README.md` 版本徽章与页脚版本号
  - 改动文件的头注释 `// path vX.Y.Z`
- 提交信息遵循 `type: description` 格式：
  - `type` ∈ `feat` / `fix` / `docs` / `style` / `refactor` / `test` / `chore` / `perf` / `ci` / `revert`
  - 描述 ≤50 字符、首字母小写、动词开头、无句号；正文每行 ≤72 字符。

## 分支与流程

- 主分支 `master`；功能开发用 `feature/*`，修复用 `fix/*` 或 `hotfix/*`。
- 开发完成后 `git add` → `commit` → `push` → 向 `master` 创建 PR。
- PR 描述包含：变更总结 + 动机 + 测试说明；PR 标题格式同提交规范。

## 校验

提交前请本地运行：

```bash
python3 -m py_compile xiaomi-apk-cleanup.py   # Python 语法检查
node --check apk-data.js                       # JS 数据源语法检查
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

推送后 GitHub Actions（`.github/workflows/ci.yml`）会自动校验：
- 版本一致性：扫描 `VERSION`，并断言以下文件均含 `v<VERSION>`：
  - `CHANGELOG.md`、`README.md`、`index.html`（站点首页）
  - `xiaomi-apk-cleanup.bat`（窗口标题 `TITLE`）、`apk-data.js`（头注释）
  - `xiaomi-apk-cleanup.py`（头注释与运行打印）、`精简小米手机MIUI及电视盒app命令.md`
  - `prototype/app/index.html`、`prototype/README.md`
- `apk-data.js` 数据结构与 `risk` 取值合法性（Python 解析 + 全条目含 `risk`）
- 源文件是否超出 200 行阈值（超出则提示拆分）
- `xiaomi-apk-cleanup.py` 语法检查（`python3 -m py_compile`）
