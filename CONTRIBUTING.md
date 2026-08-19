# 贡献指南（Contributing）

感谢你关注 **MiAppClean**！本仓库收集小米设备内置应用精简方案，
欢迎补充机型清单、修正包名、优化脚本或完善文档。

## 项目结构

```
MiAppClean/
├── apk-data.js                    # ★ 唯一数据源：各设备推荐精简包名与风险等级
├── index.html                     # 静态站点首页（零依赖，GitHub Pages 部署）
├── app/                           # 高保真可交互应用原型（已从 prototype/app 迁移，真实数据）
├── theme.js                       # 站点主题切换逻辑（读取 URL 主题参数）
├── LICENSE                        # MIT 许可证（根目录，供 GitHub 识别 License 徽章）
├── README.md / VERSION / CHANGELOG.md  # 项目说明与版本单一来源
├── CONTRIBUTING.md                # 本文件
├── scripts/                       # 精简脚本（统一入口）
│   ├── xiaomi-apk-cleanup.bat         #   Windows 统一精简脚本，复用同一数据源
│   ├── xiaomi-apk-cleanup.py          #   跨平台精简脚本（Python），复用 ../apk-data.js
│   └── MIUI-lite-for-Letv-X600.bat    #   乐视 X600 盒子 ROM 精简历史脚本
├── docs/                          # 文档与清单（被脚本/README 引用）
│   ├── commands.md                    #   通用命令模板参考
│   ├── lists/                         #   各机型内置 App 包名清单
│   │   ├── xiaomi-miui-app-list.md        #   通用 MIUI 内置 App 包名清单
│   │   ├── miui14-app-list.md             #   MIUI 14 内置 App 包名清单
│   │   ├── xiaomi-13-app-list.md          #   小米 13 内置 App 包名清单
│   │   ├── xiaomi-pad5-app-list.md        #   小米平板 5 内置 App 包名清单
│   │   └── hyperos-app-list.md            #   HyperOS 内置 App 包名清单
│   └── governance/                     #   开源治理文件（归档副本，权威版见 .github/）
│       ├── CODE_OF_CONDUCT.md              #   行为准则
│       ├── LICENSE                        #   MIT 许可证
│       ├── SECURITY.md                    #   安全政策
│       └── SUPPORT.md                     #   支持渠道
├── prototype/                     # 原型门户与设计规范（纯 HTML，仅供本地查阅）
└── .github/                       # 社区健康文件 + CI/CD
    ├── workflows/                     #   CI（ci.yml 校验）/ 部署（deploy.yml 发布站点）
    ├── CODE_OF_CONDUCT.md             #   行为准则（权威版）
    ├── SECURITY.md                    #   安全政策（权威版）
    ├── SUPPORT.md                     #   支持渠道（权威版）
    ├── FUNDING.yml                    #   赞助配置
    ├── PULL_REQUEST_TEMPLATE.md       #   PR 模板
    └── ISSUE_TEMPLATE/                #   Issue 模板（bug_report / feature_request）
```

## 数据规范

- **唯一数据源**：所有机型的推荐精简包名集中维护在 `apk-data.js`，
  `bat`/`py` 脚本与原型前端均从该文件读取，**请勿在多处硬编码包名**。
- 每条记录字段：
  - `type`：`recommended`（推荐卸载）/ `safe`（可禁用）/ `caution`（谨慎操作）
  - `packages`：包名数组
  - 新增包名请附 `note`（作用说明）与 `risk`（`low`/`medium`/`high`）。
- 提交前请用 `node -e "require('./apk-data.js')"` 或 CI 校验确认 JSON 合法、全条目含 `risk`。
- 清单与命令模板现位于 `docs/`（见上），脚本位于 `scripts/`，均保持单一数据源引用。

## 编码规范

- 脚本（`bat`/`py`）保持零额外依赖，仅使用系统自带 `adb` 与标准库。
- 关键逻辑添加中文注释；函数超过 20 行考虑拆分。
- 源代码文件超过 200 行请拆分为更小的模块（按职责/关注点）。
- 文件头部标注「路径 + 版本号」注释，如 `// 路径: <相对路径> vX.Y.Z`。

## 版本管理

- 版本号遵循 SemVer（`VERSION` 文件，当前 `v1.15.2`）。
- 任意文件修改均需 bump **patch** 版本；新增功能 bump minor；破坏性变更 bump major。
- 提交前同步：
  1. `VERSION` 文件；
  2. `CHANGELOG.md`（新增对应版本小节）；
  3. 被改动文件的头注释版本号（未改动文件**不**批量刷写）；
  4. `README.md` 顶部展示版本；
  5. `index.html` / `app/index.html` / `prototype/index.html` 展示版本；
  6. `scripts/xiaomi-apk-cleanup.bat` 标题、`.py` 头注释与运行打印、`docs/commands.md` 与 `docs/lists/*.md` 版本。

## 提交规范

提交信息格式：`<type>: <description>`，如 `feat: 新增小米14清单`。
类型：`feat` / `fix` / `docs` / `refactor` / `style` / `test` / `chore` / `perf`。
描述简短、以动词开头、无句号结尾；正文每行 ≤72 字符。

## 本地验证

```bash
# 校验 apk-data.js 结构
node -e "const d=require('./apk-data.js'); console.log('OK', Object.keys(d).length)"

# 校验 Python 脚本语法
python3 -m py_compile scripts/xiaomi-apk-cleanup.py
```

## CI

推送后 GitHub Actions（`.github/workflows/ci.yml`）会自动校验：
- 版本一致性：扫描 `VERSION`，并断言以下文件均含 `v<VERSION>`：
  - `CHANGELOG.md`、`README.md`、`index.html`（站点首页）
  - `scripts/xiaomi-apk-cleanup.bat`（窗口标题 `TITLE`）、`apk-data.js`（头注释）
  - `scripts/xiaomi-apk-cleanup.py`（头注释与运行打印）、`docs/commands.md`
  - `app/index.html`、`prototype/README.md`
- `apk-data.js` 数据结构与 `risk` 取值合法性（Python 解析 + 全条目含 `risk`）
- 源文件是否超出 200 行阈值（超出则提示拆分）
- `scripts/xiaomi-apk-cleanup.py` 语法检查（`python3 -m py_compile`）

## 流程

1. Fork 并创建分支（`feature/*` 或 `fix/*`）。
2. 修改后本地自测，更新 `CHANGELOG` 与版本号。
3. 提 PR 到 `main`，等待 CI 通过与 review。

---

> 版本：`v1.15.2`
