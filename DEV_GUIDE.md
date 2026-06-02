# 海钓通 开发规范

---

## 一、Git 工作流

```
每次改代码的标准流程：

1. 改代码
2. git status     → 确认改了什么
3. git diff       → 看具体改动
4. git add -A     → 暂存
5. git commit -m "xx：做了什么"   → 提交
   （提交前自动检查 JS 语法和 WXML 花括号）
6. npm test       → 跑单元测试（如有）
```

### 提交信息格式

```
"首页：9宫格改成3大按钮"
"修复：天气API超时导致页面卡死"
"配色：换成Deep Waters海事调色板"
"测试：新增estimateWave边界值用例"
"文档：更新PRD用户画像"
```

## 二、代码风格

### H5

- JS 变量用 `let`/`const`，不用 `var`
- 函数名用驼峰 `renderCaptainList`
- 页面 ID 用 `fisherman-{name}` 格式
- 避免超过 100 行的函数
- 注释用中文

### 小程序

- WXML 中 `{{}}` 内**不能有 `;`**
- 复杂样式用 class 切换，不用 inline ternary
- 每个页面必须有对应同名 `.wxss`（即使空文件）
- `app.json` 的 pages 数组第一个是首页

### 通用

- API Key 不写在前端代码里（小程序用云函数代理）
- 配色变量统一用 CSS 变量，不硬编码色值
- 端口 3000 运行 H5 预览

## 三、两端同步规则

改一端必须检查另一端。详见 `.sync-rules`。

| 改什么 | H5 在哪 | 小程序在哪 |
|------|------|------|
| 配色 | `:root` CSS | `app.wxss` page |
| 首页布局 | `#fisherman-home` | `pages/home/` |
| 约钓页 | `#fisherman-trip` | `pages/trip/` |
| 渔获页 | `#fisherman-record` | `pages/record/` |
| 我的页 | `#fisherman-mine` | `pages/mine/` |
| 鱼种数据 | `FISH_WIKI` 变量 | `pages/wiki/wiki.js` |
| 装备数据 | `EQUIP_DATA` 变量 | `pages/equip/equip.js` |

## 四、H5 预览

```bash
cd D:\Fishing project
python -m http.server 3000
# 打开 http://localhost:3000
```

## 五、小程序调试

1. 微信开发者工具 打开 `D:\Fishing project\fishingMNew`
2. AppID: `wx830d50bbce223a51`
3. 编译 → 模拟器预览
4. 真机：点「预览」→ 扫码

## 六、测试

| 什么时候 | 做什么 |
|------|------|
| 每次 git commit 前 | 自动跑 JS 语法检查 / WXML 花括号 |
| 改了核心函数 | 跑 `npm test`（单元测试） |
| 发版前 | 说 "跑 E2E 测试" |
| 不确定 | 说 "检查测试覆盖" |

## 七、常见错误速查

| 错误 | 原因 | 解决 |
|------|------|------|
| 页面白屏/卡死 | 多了一个 `}` | git commit 会自动拦截 |
| 小程序编译报 `unexpected character ;` | WXML 的 `{{}}` 里有 `;` | 改用 class 切换 |
| `searchPort.value` is null | 元素未渲染 | 加 `?.` 可选链 |
| 天气显示"模拟数据" | API key 过期/403 | 续费或等待恢复 |
