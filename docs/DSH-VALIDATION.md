# DSH Validation Runbook — Fixture v1

本文用于在真实 DeepSeek Harness 环境中，用 `dsh-demo` 验证当前 `dsh-project-control` Plugin。

## 1. 前置条件

- 使用安装了 `dsh-project-control` 的专用 DSH Profile；
- 该 Profile 的 Project Control Canonical Store 中尚未 enroll 其他 Project；
- `dsh-demo` 使用干净 Git clone；
- 工作树 clean；
- Node.js >= 20；
- 当前代码来自 `fixture/baseline-v1` 对应 commit。

当前 Host 实现对每个 DSH Profile 只允许 1 个 controlled project。重复测试优先使用新的测试 Profile / 独立 `DSH_PROJECT_CONTROL_HOME`，不要复用已有 Canonical DB 猜测状态。

## 2. Baseline preflight

在 demo clone 中执行：

```bash
npm test
npm run acceptance
```

预期：

- `npm test` = PASS；
- `npm run acceptance` = FAIL；
- `git status --porcelain` 为空。

这证明项目本身可运行，但 M1 尚未实现。

## 3. 建议给 DSH Operator Agent 的自然语言指令

```text
Read AGENTS.md, docs/PROJECT.md, docs/MILESTONE.md and docs/DSH-VALIDATION.md in the current dsh-demo repository.
Use the Project Control tools to enroll this clean repository as the dsh-demo FINITE project, activate M1, run the next task, and then report canonical status plus the candidate/evidence identifiers returned by Project Control.
Do not implement the feature directly in the source working tree. Let Project Control own execution, verification and promotion.
```

## 4. 当前 enrollment contract 的期望映射

Operator Agent 调用 `project_control_enroll` 时应从仓库合同编译出等价参数：

- `project_name`: `dsh-demo`
- `repository_root`: demo clone 的绝对路径
- `lifecycle`: `FINITE`
- `milestone_title`: `M1 Service Health Evaluator`
- `milestone_goal`: 实现 `docs/MILESTONE.md` 定义的本地 service-health evaluator + CLI
- `milestone_kind`: `DELIVERY`
- `contract_version`: `dsh-demo-m1-v1`
- `task_title`: `Implement M1 service health evaluator`
- `task_execution_prompt`: 读取并遵守 `AGENTS.md`、`docs/PROJECT.md`、`docs/MILESTONE.md`；只实现 M1；不得修改 frozen acceptance；完成 health evaluator、fleet summary、CLI 和 README；最终必须让 `npm run verify` PASS
- `acceptance_requirement`: candidate 在独立 verification workspace 中执行 `npm run verify` 必须 exit 0
- `validator_executable`: `npm`
- `validator_args`: `["run", "verify"]`
- `expected_exit_code`: `0`
- `requires_human_acceptance`: `false`
- `environment`: `local`
- `risk`: `LOW`

`execution_profile` 可使用当前环境中允许的普通 Executor preset；不要使用 Project Control 保留的 operator preset。

## 5. Tool sequence

当前 v1 期望顺序：

```text
project_control_enroll
  -> project_control_status
  -> project_control_activate
  -> project_control_run_next
  -> project_control_status
```

`project_control_run_next` 不应接收实现 prompt、validator 或 Git 参数；这些必须已经在 enrollment 时持久化。

## 6. PASS 条件

一次可信的 E2E 验证至少应证明：

- enrollment 成功并返回 canonical `project_id / milestone_id / task_id`；
- activate 后 Task 进入 READY；
- run_next 使用隔离执行 workspace；
- Executor 没有直接修改 source working tree/default branch；
- Candidate SHA 被创建；
- `npm run verify` 在独立 verification workspace 对精确 Candidate SHA exit 0；
- Evidence 被登记并绑定 verification run / candidate；
- verified candidate 被受控 promotion 到 managed milestone ref；
- 最终 Task 状态达到当前策略允许的完成状态；
- final `project_control_status` 与实际 Git / verification 事实一致。

## 7. 失败也有价值

若验证失败，不要手工接管代码后把测试“做绿”。保留：

- Project Control canonical status；
- task/run/dispatch id；
- candidate SHA（如已生成）；
- verification run id；
- validator stderr/stdout；
- plugin/DSH 版本；
- managed ref 与 worktree 状态。

这些信息才是定位 `dsh-project-control` 缺口的有效 Evidence。
