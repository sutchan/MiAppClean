# 能力规范：scripts（离线精简脚本）

本能力规定 `scripts/` 下脚本作为离线入口，必须复用 `apk-data.js` 单一数据源。

## Requirements

### Requirement: 复用数据源
`scripts/xiaomi-apk-cleanup.py` 与 `scripts/xiaomi-apk-cleanup.bat` 生成命令时，
包名来源须为 `apk-data.js`，不得内置独立包名列表。

#### Scenario: Python 脚本读取数据源
- **Given** 运行 `python scripts/xiaomi-apk-cleanup.py`
- **When** 选择设备与模式
- **Then** 输出的包名与 `apk-data.js` 中该设备分组一致

### Requirement: 子命令
Python 脚本至少支持以下子命令（以 `argparse` 暴露）：
- `interactive`（默认）：交互式精简
- `check`：预检设备连接与包名存在性
- `backup`：备份当前设备已安装包名快照（写入 `backup-*.txt`）

#### Scenario: backup 生成快照
- **Given** 设备已连接
- **When** 运行 `python scripts/xiaomi-apk-cleanup.py backup`
- **Then** 生成 `backup-<时间戳>.txt` 记录设备包名，便于回滚

#### Scenario: check 预检
- **Given** 设备未连接
- **When** 运行 `... check`
- **Then** 明确报错并退出，不执行任何 `pm` 命令

### Requirement: 仅依赖标准库
脚本不得引入第三方依赖；仅使用系统 `adb` 与 Python 标准库。

#### Scenario: 语法可编译
- **Given** CI 运行 `python3 -m py_compile scripts/xiaomi-apk-cleanup.py`
- **When** 脚本无语法错误
- **Then** 编译通过

### Requirement: 版本标注
脚本头部与运行打印须含版本号，并随 `VERSION` 同步（CI 断言 `v<VERSION>`）。

#### Scenario: 版本一致性
- **Given** `VERSION` = `vX.Y.Z`
- **When** CI 校验
- **Then** `scripts/*.bat` 标题与 `scripts/*.py` 头注释/打印均含 `vX.Y.Z`

## 实现细节（参考）
- 危险核心组件（risk=danger）在生成阶段自动跳过，与站点行为一致。
- Windows `.bat` 以交互菜单呈现，逻辑与 Python 脚本对齐。
