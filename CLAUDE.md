# 海钓通 — Claude 项目指令

每次打开此项目，自动执行：

1. 读取 next_session.md（最新状态）
2. 读取 project_status.md（完整清单）
3. 读取 .sync-rules（同步规则）
4. 告诉用户当前进度和下一步做什么

改代码时遵守：
- H5 和小程序两端同步（规则见 .sync-rules）
- WXML 中 {{}} 内不能有 ;
- 配色使用 Deep Waters 海事调色板（主色 #0F4F67）
- 改完后更新 checklist.md 并 git commit

## 可用 Skill

| 触发词 | Skill | 说明 |
|------|------|------|
| "跑 E2E 测试" "跑回归测试" | `e2e-test` | 打开浏览器跑全流程 |
| "补单元测试" "检查测试覆盖" | `unit-test-gen` | 自动生成边界值用例 |
| 改完核心函数 | `unit-test-gen` | 自动建议补对应测试 |
| Git commit 前 | `e2e-test` | 自动提示跑回归 |
