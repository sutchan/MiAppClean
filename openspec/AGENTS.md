# OpenSpec 工作流（供 AI Agent 与贡献者）

本目录使用 [OpenSpec](https://github.com/Fission-AI/OpenSpec) 轻量级规范工作流：
将项目规范（specs）与变更提案（changes）以 Markdown 形式纳入代码库版本管理。

## 目录约定

```
openspec/
├── AGENTS.md          # 本文件：工作流说明
├── project.md         # 项目级规范与上下文（单一事实来源）
├── specs/             # 能力规范（capabilities）
│   └── <capability>/
│       └── spec.md    # 当前能力契约：Requirements / Scenario / 实现细节
└── changes/           # 变更提案（变更中或待评审）
    └── <change-name>/
        ├── proposal.md   # 为什么 / 做什么 / 影响范围
        └── tasks.md      # 分步实施清单
```

## 何时创建 change 提案

满足任一条件时，在 `changes/` 下新建提案（而非直接改 `specs/`）：

- 新增一项用户可见的能力（如新增设备类型、新增导出格式）。
- 修改既有能力的公开契约（`spec.md` 中的 Requirement 或 Scenario）。
- 重构影响外部行为的逻辑（数据源结构、脚本参数、命令模板）。

纯文档拼写、样式微调、版本号同步等**不改变契约**的改动，直接提交即可，
无需提案。

## 提案命名

- 使用 kebab-case，动词开头、语义清晰，如 `add-adb-wireless-mode`、`fix-version-drift`。
- 例：`changes/add-pad6-list/proposal.md`。

## 工作流程

1. **起草提案**：`changes/<name>/proposal.md` 写明动机、方案、影响；`tasks.md` 拆步骤。
2. **评审/对齐**：提案进入 review 前，相关能力 `specs/<capability>/spec.md` 暂不改动。
3. **实施**：按 `tasks.md` 落地代码/文档。
4. **归档**：完成后将变更合并进对应 `specs/<capability>/spec.md`，并把 `changes/<name>/`
   中的状态标注为 `done`，或移入 `openspec/changes/archive/`。

## 与既有规范的关系

- 本目录是**架构/能力级**规范，不对齐于 `docs/governance/`（社区治理文件）。
- 版本号以仓库根 `VERSION` 为唯一来源；本目录文件**不**写入版本号，
  避免与 CI 版本一致性校验冲突。
- 数据源契约详见 `specs/data-source/spec.md`，脚本与站点均须遵守。

## 快速命令（参考）

```bash
# 新建能力规范骨架
mkdir -p openspec/specs/<capability>
echo "# <Capability> 规范" > openspec/specs/<capability>/spec.md

# 新建变更提案骨架
mkdir -p openspec/changes/<change-name>
printf '# 提案：<change-name>\n\n## 动机\n\n## 方案\n\n## 影响范围\n' > openspec/changes/<change-name>/proposal.md
printf '# 任务清单\n\n- [ ] \n' > openspec/changes/<change-name>/tasks.md
```
