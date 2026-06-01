# 海钓通 维护指南

---

## 一、日常开发流程

```
需求/想法 → H5 快速验证 → 通过后 → 小程序同步迁移
                ↓ 不通过
              放弃或调整
```

| 场景 | 做法 |
|------|------|
| 新功能 | 先在 H5 写，1-2 小时出原型 → 效果满意 → 小程序迁移 |
| Bug 修复 | 哪个端发现的就在哪个端修，然后同步到另一端 |
| 文案/数据修改 | 两端同时改 |
| 样式调整 | 小程序为主，H5 跟上 |

## 二、Git 操作

### 每次改代码后

```bash
cd D:\Fishing project
git status                    # 查看改动
git diff                      # 查看具体改了什么
git add -A                    # 暂存所有改动
git commit -m "修了xxx"        # 提交
```

### 推送 GitHub 备份

```bash
git push origin main
```

### 改坏了回退

```bash
git log --oneline             # 找到想回退的版本号
git checkout .                # 回到上次提交的状态
git reset --hard 版本号       # 回到指定的历史版本
```

### 建议提交频率

每次完成一个小功能就提交，不要攒多了。提交信息用中文：

```
git commit -m "首页：9宫格改成3大按钮"
git commit -m "配色：换成Deep Waters海事调色板"
git commit -m "修复：天气API超时导致页面卡死"
```

## 三、回归测试

每次提交前，打开 `checklist.md`，对照过一遍核心流程：

| 优先级 | 检查项 |
|:---:|------|
| ⭐⭐⭐ | 首页天气、3 大按钮、约钓创建 |
| ⭐⭐ | 渔获记录、大鱼排行、我的页数据 |
| ⭐ | 知识入口、地图、港口切换 |

如果没时间全测，至少测一下⭐项。

## 四、API 管理

### 和风天气

| 场景 | 怎么做 |
|------|------|
| 首页加载失败 | 检查 key 是否过期 → 登录 and 风天气控制台充值 |
| 加新港口 | 在 PORT_DATA 里加条目，配好 lat/lng/cityId/tideStation |
| 潮汐没有数据 | 检查潮汐站点 ID 是否正确（当前只用 P2970/P2971） |

### 高德地图

| 场景 | 怎么做 |
|------|------|
| 地图不显示 | 检查 key 是否用了 `Web端(JS API)` 类型 |
| 要加坐标 | 打开 lbs.amap.com 控制台确认配额 |

## 五、文件结构

```
D:\Fishing project\
├── index.html              ← H5 原型（单文件，170KB）
├── checklist.md            ← 回归清单
├── MAINTENANCE.md          ← 这份维护指南
│
├── fishingMNew/            ← 小程序主力项目 ⭐
│   ├── app.js/json/wxss    ← 全局配置
│   ├── pages/              ← 11 个页面
│   │   ├── home/           ← 首页（天气+3按钮+知识）
│   │   ├── trip/           ← 约钓（发起约钓+找船）
│   │   ├── record/         ← 渔获（识鱼+时间线+排行）
│   │   ├── mine/           ← 我的（统计+预约+市场）
│   │   ├── captain/        ← 船长端
│   │   ├── equip/          ← 装备清单
│   │   ├── wiki/           ← 鱼种百科
│   │   ├── market/         ← 渔获市场
│   │   ├── guide/          ← 晕船+保鲜指南
│   │   ├── gear/           ← 装备推荐
│   │   └── moon/           ← 月相日历
│   └── cloudfunctions/     ← 云函数
│       ├── getUserSig/      ← IM 签名
│       └── initChains/      ← 种子数据
│
├── miniprogram/            ← 小程序旧版（存档）
└── .claude/                ← Claude 配置
```

## 六、两端同步清单

H5 和 小程序 哪些东西要同步：

| 模块 | H5 文件 | 小程序文件 |
|------|------|------|
| 配色 | `index.html` CSS 变量 | `fishingMNew/app.wxss` |
| 首页布局 | `index.html` fisherman-home 区域 | `pages/home/home.wxml` |
| 约钓页 | `index.html` fisherman-trip 区域 | `pages/trip/trip.wxml` |
| 渔获页 | `index.html` fisherman-record 区域 | `pages/record/record.wxml` |
| 我的页 | `index.html` fisherman-mine 区域 | `pages/mine/mine.wxml` |
| 鱼种数据 | FISH_WIKI 对象 | `pages/wiki/wiki.js` |
| 装备数据 | EQUIP_DATA 对象 | `pages/equip/equip.js` |
| 港口数据 | PORT_DATA 数组 | 暂未迁移到小程序 |

## 七、常见问题速查

| 问题 | 解决 |
|------|------|
| H5 页面卡死 | 检查控制台有没有报错，大概率是多了一个 `}` |
| 小程序编译报错 | 检查 WXML 里 `{{}}` 内是不是有 `;` |
| 小程序 DevTools 卡住 | 关掉重开 |
| 天气显示"模拟数据" | 和风 API key 需要续费 |
| 数据库加记录报错 | 用云函数写入，不用控制台手动加 |
| Git 忘记提交了 | `git stash` 暂存，然后再 `git stash pop` 提交 |
