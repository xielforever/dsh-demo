# AGENTS.md

## 项目定位

本仓库是 `dsh-project-control` 的端到端验证目标仓库（fixture / target project），不是控制平面或 DSH Plugin 本体。

当前 `v1` 专门验证现阶段已经实现的 **single-task trusted closed loop**：Enroll -> Activate -> Isolated Execute -> Candidate -> Deterministic Verify -> Evidence -> Promotion -> Reconcile。

## Source of Truth

优先级：

1. 本 `AGENTS.md`；
2. `docs/PROJECT.md`（Stable Contract）；
3. `docs/MILESTONE.md`（当前 Delivery Contract / Acceptance）；
4. `test/acceptance.test.js` 与 `fixtures/services.json`（机器验收夹具）；
5. `README.md`；
6. 代码实现。

发生冲突时，不允许通过修改验收标准来迁就实现。

## Fixture 强制规则

1. 当前 Fixture Version 为 `v1`。
2. `fixture/baseline-v1` 是干净初始基线。
3. Baseline 上 `npm test` 必须 PASS；`npm run acceptance` / `npm run verify` 预期 FAIL。
4. 当前 Milestone 完成后 `npm run verify` 必须 PASS。
5. Executor 不得为了通过验收而修改或弱化：`test/acceptance.test.js`、`fixtures/services.json`、`docs/MILESTONE.md`、`demo-fixture.json`。
6. 如发现验收契约错误或互相矛盾，必须停止并进入 Human Gate。
7. 不得通过 skip test、删除 assertion、改变 npm validator script 等方式绕过验收。
8. 不新增网络依赖、数据库、容器或外部服务。
9. 不读取或写入 Repository 外的用户文件；CLI 只读取用户显式提供的输入路径。
10. 不执行 destructive / production 操作。

## 当前实现范围

当前插件的 enrollment API 持久化一个 Task，因此本 Fixture v1 只定义一个可执行 Task。不要自行在仓库内制造第二套 Task Graph。

允许修改：

- `src/**`
- `test/smoke.test.js`（只能增加真实 regression coverage，不能弱化现有断言）
- `README.md`（补充完成后的行为和用法）

默认冻结：

- `test/acceptance.test.js`
- `fixtures/**`
- `docs/MILESTONE.md`
- `demo-fixture.json`

## Git / 执行规则

- Autonomous Executor 不直接修改 default branch。
- Run 使用 Control Plane 提供的隔离 workspace/worktree。
- Executor 不自行 `commit/reset/rebase/merge/push`。
- Verifier 验证 Control Plane 指定的精确 Candidate SHA。
- Failed Candidate 不得污染 managed milestone head。

## 技术边界

- Node.js >= 20；
- ESM；
- 只使用 Node.js built-in modules；
- 测试使用 `node:test` 与 `node:assert`；
- 不添加第三方依赖，除非 Human Gate 明确批准。

## 验证要求

当前 deterministic validator：

```bash
npm run verify
```

其中会同时执行 baseline regression 与 milestone acceptance。

Verifier Evidence 至少应能关联：validator command、exit code、Candidate SHA、verification run。Executor 自报完成不是 Evidence。
