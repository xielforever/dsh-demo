# AGENTS.md

## 项目定位

本仓库是 `dsh-project-control` 的端到端验证目标仓库（fixture / target project）。它不是控制平面或 DSH Plugin 本体。

目标是在真实 DSH 环境中验证：Project Intake、Milestone Planning、隔离执行、Candidate、独立验证、Evidence、受控 Promotion、Reconciliation 与停止条件。

## Source of Truth

优先级：

1. 本 `AGENTS.md`；
2. `docs/PROJECT.md`（Stable Contract）；
3. `docs/MILESTONE.md`（当前 Delivery Contract / Acceptance）；
4. `test/acceptance.test.js` 与 `fixtures/services.json`（机器可验证验收夹具）；
5. `README.md`；
6. 代码实现。

发生冲突时，不允许通过修改验收标准来迁就实现。

## Fixture 强制规则

1. 当前 Fixture Version 为 `v1`。
2. `fixture/baseline-v1` 是干净初始基线。
3. Baseline 上 `npm test` 必须 PASS；`npm run acceptance` 预期 FAIL。
4. 当前 Milestone 完成后，两条命令都必须 PASS。
5. Executor 不得为了通过验收而修改或弱化以下文件：
   - `test/acceptance.test.js`
   - `fixtures/services.json`
   - `docs/MILESTONE.md`
   - `demo-fixture.json`
6. 如确实发现验收文件错误或互相矛盾，必须停止并进入 Human Gate，而不是自行改写。
7. 不得把 test skip、删除 assertion、修改 npm script 绕过测试视为完成。
8. 不新增网络依赖、数据库、容器或外部服务；本 Fixture 必须保持本地、快速、确定性。
9. 不读取或写入 Repository 外的用户文件；CLI 只读取用户显式提供的输入路径。
10. 不执行 destructive / production 操作。

## Git / 执行规则

- Autonomous Executor 不应直接修改用户 Source Working Tree 或 default branch。
- 每个 Run 应由 Control Plane 提供隔离 workspace/worktree。
- Executor 不自行 `commit/reset/rebase/merge/push`；由 Workspace Manager 管理 Candidate 与 Promotion。
- Verifier 必须验证 Control Plane 指定的精确 Candidate SHA，并使用独立 verification workspace。
- Failed Candidate 不得污染后续任务基线。

## 技术边界

- Node.js >= 20；
- ESM；
- 只使用 Node.js built-in modules；
- 测试使用 `node:test` 与 `node:assert`；
- 不添加第三方依赖，除非 Human Gate 明确批准。

## 当前 Milestone 可修改范围

通常允许：

- `src/**`
- `test/smoke.test.js`（仅增加真实 regression coverage，不得弱化现有断言）
- `README.md`（补充最终行为与使用说明）

默认冻结：

- `test/acceptance.test.js`
- `fixtures/**`
- `docs/MILESTONE.md`
- `demo-fixture.json`

## 验证要求

Verifier 至少执行：

```bash
npm test
npm run acceptance
```

并确认：

- 命令退出码；
- Candidate SHA；
- 验证 workspace 是精确 Candidate；
- Acceptance test 没有被跳过或删除；
- README 最终说明与实际行为一致。

“实现看起来正确”或 Executor 自报完成不能作为 Evidence。
