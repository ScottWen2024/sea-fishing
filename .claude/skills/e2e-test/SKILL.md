# E2E 端到端测试

用自然语言写测试，在浏览器里自动跑。

## 适用场景
- 用户改完代码，想确认核心流程没断
- 发版前做全链路回归
- 复现 Bug 时保存复现步骤

## 测试文件格式

在 `D:\Fishing project\tests\e2e\` 下创建 `.md` 文件：

```markdown
# 测试：首页 → 约钓 → 记录 全链路
# 日期：2026-06-01

## 步骤 1：首页加载
- 打开 http://localhost:3000
- 等待 3 秒
- 截图保存为 screenshots/home.png
- 验证：能看到"钓鱼指数"
- 验证：3 个大按钮（约钓、识鱼、找船）都可见

## 步骤 2：发起约钓
- 点击「📢 约钓」按钮
- 等待 URL 包含 trip
- 点击「发起约钓」
- 填写表单：港口=南澳岛，日期=2026-06-05，称呼=测试
- 点击提交
- 验证：Toast 显示"拼船已发起"
- 截图保存为 screenshots/chain.png

## 步骤 3：查看渔获
- 点击底部「📸 渔获」Tab
- 验证：能看到"拍照识鱼"按钮
- 截图保存为 screenshots/record.png
```

## 怎么跑

```
说："跑 P0 E2E 测试"
说："只跑首页加载的 E2E 测试"
说："跑 e2e/home-flow.md"
```

## 测试文件目录

```
tests/e2e/
├── home-flow.md      ← 首页→约钓全链路
├── record-flow.md    ← 识鱼→记录链路
├── captain-flow.md   ← 找船→预约链路
├── api-health.md     ← API 健康检查
└── screenshots/      ← 截图存档
```

## 何时自动触发

- 改完 `index.html` 的 `fisherman-home` 区域 → 自动建议跑 `home-flow.md`
- 改完 `fisherman-trip` 区域 → 自动建议跑 `captain-flow.md`
- Git commit 前 → 自动提示"要不要跑一遍 E2E"
- 发版前 → 强制跑全部

## 输出

跑完后生成 `tests/e2e/reports/YYYY-MM-DD.md`，包含每一步的通过/失败状态和截图路径。
