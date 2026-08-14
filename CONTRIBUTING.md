# 贡献指南（Contributing）

感谢你关注 **MiAppClean**！本仓库收集小米设备内置应用精简方案，
欢迎补充机型清单、修正包名、优化脚本或完善文档。

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

## 数据规范

- **唯一数据源**：所有机型的推荐精简包名集中维护在 `apk-data.js`，
  `bat`/`py` 脚本与原型前端均从该文件读取，**请勿在多处硬编码包名**。
- 每条记录字段：
  - `type`：`recommended`（推荐卸载）/ `safe`（可禁用）/ `caution`（谨慎操作）
  - `packages`：包名数组
  - 新增包名请附 `note`（作用说明）与 `risk`（`low`/`medium`/`high`）。
- 提交前请用 `node -e "require('./apk-data.js')"` 或 CI 校验确认 JSON 合法、全条目含 `risk`。

## 编码规范

- 脚本（`bat`/`py`）保持零额外依赖，仅使用系统自带 `adb` 与标准库。
- 关键逻辑添加中文注释；函数超过 20 行考虑拆分。
- 源代码文件超过 200 行请拆分为更小的模块（按职责/关注点）。
- 文件头部标注「路径 + 版本号」注释，如 `// 路径: apk-data.js v1.6.12`。

## 版本管理

- 版本号遵循 SemVer（`VERSION` 文件，当前 `v1.6.12`）。
- 任意文件修改均需 bump **patch** 版本；新增功能 bump minor；破坏性变更 bump major。
- 提交前同步：
  1. `VERSION` 文件；
  2. `CHANGELOG.md`（新增对应版本小节）；
  3. 被改动文件的头注释版本号（未改动文件**不**批量刷写）；
  4. `README.md` 顶部展示版本；
  5. `index.html` / `prototype/app/index.html` / `prototype/index.html` 展示版本；
  6. `xiaomi-apk-cleanup.bat` 标题、`.py` 头注释与运行打印、`.md` 清单版本。

## 提交规范

提交信息格式：`<type>: <description>`，如 `feat: 新增小米14清单`。
类型：`feat` / `fix` / `docs` / `refactor` / `style` / `test` / `chore` / `perf`。
描述简短、以动词开头、无句号结尾；正文每行 ≤72 字符。

## 本地验证

```bash
# 校验 apk-data.js 结构
node -e "const d=require('./apk-data.js'); console.log('OK', Object.keys(d).length)"

# 校验 Python 脚本语法
python3 -m py_compile xiaomi-apk-cleanup.py
```

## CI

推送后 GitHub Actions（`.github/workflows/ci.yml`）会自动校验：
- 版本一致性：扫描 `VERSION`，并断言以下文件均含 `v<VERSION>`：
  - `CHANGELOG.md`、`README.md`、`index.html`（站点首页）
  - `xiaomi-apk-cleanup.bat`（窗口标题 `TITLE`）、`apk-data.js`（头注释）
  - `xiaomi-apk-cleanup.py`（头注释与运行打印）、`精简小米手机MIUI及电视盒app命令.md`
  - `prototype/app/index.html`、`prototype/README.md`
- `apk-data.js` 数据结构与 `risk` 取值合法性（Python 解析 + 全条目含 `risk`）
- 源文件是否超出 200 行阈值（超出则提示拆分）
- `xiaomi-apk-cleanup.py` 语法检查（`python3 -m py_compile`）

## 流程

1. Fork 并创建分支（`feature/*` 或 `fix/*`）。
2. 修改后本地自测，更新 `CHANGELOG` 与版本号。
3. 提 PR 到 `main`，等待 CI 通过与 review。

---

> 版本：`v1.6.12`
