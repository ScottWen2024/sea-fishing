# 海钓通 测试部署计划

## 测试框架

| 端 | 框架 | 原因 |
|------|------|------|
| H5 核心函数 | **Jest** | 纯 JS 函数，不依赖 DOM，最轻量 |
| 小程序组件 | **Jest + miniprogram-simulate** | 微信官方推荐，能模拟小程序环境 |

## 分阶段执行

### Phase 1：单元测试（现在 —— 1 小时）
- 对象：7 个纯函数（无 UI、无网络依赖）
- 用例：每个 2-3 条，共 ~20 条
- 工具：Jest（npm install jest）

### Phase 2：集成测试（UAT 前 —— 1 小时）
- 对象：核心页面逻辑 + API 调用
- 工具：Jest + Mock

### Phase 3：组件测试（小程序有组件后 —— 后续）
- 对象：自定义组件（天气卡片、船长卡片）
- 工具：miniprogram-simulate

## Phase 1 测试覆盖（7 函数 × 20 用例）

| # | 函数 | 用例数 | 测什么 |
|:---:|------|:---:|------|
| 1 | `estimateWave(windSpeed)` | 4 | 静风/微风/中风/大风 → 浪高范围 |
| 2 | `getWeatherAdvice(windScale)` | 3 | 好/谨慎/不建议三种等级 |
| 3 | `haversine(lat1,lng1,lat2,lng2)` | 3 | 同点/同城/跨城距离计算 |
| 4 | `getMoonPhase(dateStr)` | 3 | 新月/满月/随机日 → 月相 |
| 5 | `calcFishingIndex(dayData,tideData)` | 3 | 满分/中等/差 → 分数区间 |
| 6 | `getRecIndex(captain)` | 2 | 有导钓/无导钓 → 推荐分 |
| 7 | `formatDate(dateStr)` | 2 | 今天格式/普通格式 |

## 文件结构

```
D:\Fishing project\tests\
├── README.md           ← 这份文件
├── package.json        ← Jest 依赖
├── jest.config.js      ← Jest 配置
├── utils/
│   ├── weather.js      ← weatherUtils（从 H5 抽出）
│   ├── fishing.js      ← fishingIndex（从 H5 抽出）
│   ├── geo.js          ← haversine（从 H5 抽出）
│   └── moon.js         ← moonPhase（从 H5 抽出）
├── utils.test.js       ← 所有单元测试
└── fixtures/
    ├── weather.json    ← 天气测试数据
    └── tide.json       ← 潮汐测试数据
```

## 运行方式

```bash
cd D:\Fishing project\tests
npm install
npm test
```

## 预期输出

```
PASS  utils.test.js
  ✓ estimateWave 微风 → 0.1-0.3m
  ✓ estimateWave 中风 → 0.6-1.2m
  ✓ getWeatherAdvice 3级 → 推荐出海
  ✓ getWeatherAdvice 6级 → 不建议出海
  ✓ haversine 汕头到深圳 ≈ 数字
  ✓ getMoonPhase 满月日 → 满月
  ✓ calcFishingIndex 满分条件 → ≥80分
  ... (20 tests total)

Tests: 20 passed, 0 failed
```
