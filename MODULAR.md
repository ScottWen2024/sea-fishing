# 海钓通 模块化重构方案

## 当前问题

| 问题 | 影响 |
|------|------|
| H5 单文件 170KB | 改首页可能搞坏约钓页 |
| 小程序公共代码未抽取 | 鱼种数据写了 3 份，改一个要改三个 |
| H5 和 小程序数据不同步 | PORT_DATA、FISH_WIKI 两端各写了一遍 |
| 无组件化 | 船长卡片、天气卡片重复代码 |

## 目标结构

### H5（拆分 index.html）

```
D:\Fishing project\
├── index.html             ← 主入口（只加载脚本）
├── css/
│   ├── variables.css      ← CSS 变量
│   ├── layout.css         ← 布局
│   └── components.css     ← 组件样式
├── js/
│   ├── app.js             ← APP 全局状态
│   ├── nav.js             ← 导航逻辑
│   ├── data/
│   │   ├── ports.js       ← PORT_DATA
│   │   ├── fish.js        ← FISH_WIKI
│   │   ├── equip.js       ← EQUIP_DATA
│   │   ├── captains.js    ← 船长数据
│   │   └── tips.js        ← DAILY_TIPS
│   ├── pages/
│   │   ├── home.js        ← 首页渲染
│   │   ├── trip.js        ← 约钓页
│   │   ├── record.js      ← 渔获页
│   │   └── mine.js        ← 我的页
│   └── services/
│       ├── weather.js     ← 天气 API
│       ├── tide.js        ← 潮汐
│       └── map.js         ← 地图
└── components/
    ├── weather-card.html  ← 天气卡片模板
    └── captain-card.html  ← 船长卡片模板
```

### 小程序（重构 fishingMNew）

```
fishingMNew/
├── app.js / app.json / app.wxss
├── utils/                 ← 公共工具（新增）
│   ├── weather.js         ← 天气计算（和H5共享逻辑）
│   ├── fishData.js        ← 鱼种数据（和H5共享数据）
│   ├── portData.js        ← 港口数据
│   ├── constants.js       ← 配置
│   └── format.js          ← 日期格式化等
├── components/            ← 可复用组件（新增）
│   ├── weather-card/      ← 天气卡片
│   │   ├── weather-card.wxml
│   │   ├── weather-card.wxss
│   │   └── weather-card.js
│   ├── captain-card/      ← 船长卡片
│   ├── chain-card/        ← 拼船卡片
│   └── fish-card/         ← 渔获卡片
├── cloudfunctions/        ← 云函数
└── pages/                 ← 页面（精简后）
    ├── home/              ← 引用组件，只写本页逻辑
    ├── trip/
    ├── record/
    └── mine/
```

## 分步实施（不崩现有的前提下）

### 第 1 步：抽数据层（1小时，零风险）

小程序 `utils/` 新建文件，把散落在各页面的数据搬过去：

- `utils/fishData.js` ← 从 `pages/wiki/wiki.js` 搬 FISH_WIKI
- `utils/portData.js` ← 从各页面搬港口数据
- `utils/equipData.js` ← 从 `pages/equip/equip.js` 搬 EQUIP_DATA

各页面改为 `const fishData = require('../../utils/fishData')` 引用。

### 第 2 步：小程序组件化（2小时，中等风险）

把重复的卡片抽成组件：

- 船长卡片：home.js / trip.js / captain.js 三处都用到
- 拼船卡片：home.js / trip.js 两处用到
- 天气卡片：只 home.js 用到，但后续可能复用

### 第 3 步：H5 拆分（3小时，高风险）

把 170KB 的 index.html 按上述结构拆成多个文件。**这一步风险最大，因为 H5 里各种函数调用互相依赖。**

建议：H5 暂时不拆分，只在功能稳定后做。小程序先模块化起来。

## 改完后效果

```
改一种鱼的数据 → 只改 utils/fishData.js → 所有页面自动生效
改船长卡片样式 → 只改 components/captain-card/ → 所有页面自动生效
改天气计算逻辑 → 只改 utils/weather.js → H5和小程序同步修改
```

## 实施建议

先做小程序（低风险），H5 等到功能稳定再拆分。

优先级：
1. ⭐ `utils/` 数据文件（1h，立刻见效）
2. ⭐⭐ `components/` 组件（2h，减少重复）
3. ⭐⭐⭐ H5 拆分（3h，等稳定后再做）
