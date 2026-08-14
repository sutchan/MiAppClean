# 能力规范：data-source（单一数据源）

本能力规定 `apk-data.js` 作为全项目包名数据的唯一来源，前端与脚本共用的契约。

## Requirements

### Requirement: 结构化导出 APP_DATA
`apk-data.js` 必须以 `const APP_DATA = {...};` 形式在文件顶层导出数据结构，
且可被 Python 通过正则 `const APP_DATA\s*=\s*(\{.*?\n\});` 解析（CI 依赖此解析）。

#### Scenario: CI 解析数据源
- **Given** 仓库根存在 `apk-data.js`
- **When** CI 运行 `python3` 解析 `APP_DATA`
- **Then** 解析成功并输出包名总数，且每个条目均含 `risk` 字段

### Requirement: 风险分级字段
每个包名条目必须包含 `risk` 字段，取值为 `safe` / `caution` / `danger`。

#### Scenario: danger 级自动拦截
- **Given** 某包名 `risk: "danger"`
- **When** 前端/脚本生成命令
- **Then** 该包名默认被排除，不进入生成的 adb 命令

#### Scenario: 缺少 risk 字段视为非法
- **Given** 某条目未含 `risk`
- **When** CI 校验
- **Then** 校验失败并退出（防止契约破坏）

### Requirement: 设备与分组结构
`APP_DATA` 按设备（如 `xiaomi13`、`pad5`、`hyperos`、`mibox`）分组，
每组含 `items` 数组；`items` 每项至少含 `name`/`pkg`/`risk`，可选 `note`。

#### Scenario: 新增机型
- **Given** 需支持新机型 `deviceX`
- **When** 在 `APP_DATA` 新增对应分组
- **Then** 前端设备选择列表与脚本均自动识别，无需改动两处

### Requirement: 单一来源约束
包名数据不得在其他文件硬编码复制；前端与脚本均 `import`/`读取` 本文件。

#### Scenario: 禁止重复维护
- **Given** 某包名需修正
- **When** 仅修改 `apk-data.js`
- **Then** 前端与脚本读取到更新后的值，无需同步两处

## 实现细节（非契约，参考）
- 文件头部含路径与版本注释：`// 路径: apk-data.js  vX.Y.Z`，版本随 `VERSION` 同步。
- `docs/lists/*.md` 为人类可读来源，其包名应与 `apk-data.js` 保持一致（由贡献者维护）。
