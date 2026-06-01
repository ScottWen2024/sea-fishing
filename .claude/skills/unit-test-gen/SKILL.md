# 单元测试自动生成

扫描代码中的纯函数，自动补全测试用例。

## 适用场景
- 新增了工具函数，还没写测试
- 现有测试缺少边界值/异常值覆盖
- 改完函数逻辑，需要更新测试

## 用法

```
说："检查哪些函数还没测试"
说："给 estimateWave 补边界值测试"
说："扫描 tests/utils/ 下所有函数，补全缺失的测试用例"
```

## 测试模板

```javascript
// 正常值
test('风速 15km/h → 0.3-0.6m', () => {
  expect(estimateWave(15)).toBe('0.3-0.6');
});

// 边界值 — 恰好踩在阈值上
test('风速恰好 10km/h → 0.1-0.3m', () => {
  expect(estimateWave(10)).toBe('0.1-0.3');
});

// 极端值
test('风速 0 → 0.1-0.3m', () => {
  expect(estimateWave(0)).toBe('0.1-0.3');
});

// 异常输入
test('风速 undefined → 默认 0.1-0.3m', () => {
  expect(estimateWave(undefined)).toBe('0.1-0.3');
});

// 非数字输入
test('风速 "1-3" → 安全降级', () => {
  expect(estimateWave("1-3")).toBe('0.1-0.3');
});
```

## 当前测试覆盖状态

| 模块 | 函数 | 已有 | 缺什么 |
|------|------|:---:|------|
| weather.js | estimateWave | 5 | 缺少："1-3"级字符串、undefined、null |
| weather.js | getWeatherAdvice | 3 | 缺少：字符串"4-5"级、刚好3级边界 |
| weather.js | formatDate | 2 | 缺少：空字符串、不合法日期 |
| geo.js | haversine | 3 | 缺少：赤道坐标、跨赤道距离 |
| moon.js | getMoonPhase | 3 | 缺少：年初/年末跨年边界 |
| fishing.js | calcFishingIndex | 3 | 缺少：缺tideData、缺pressure字段 |
| fishing.js | getRecIndex | 2 | 缺少：空数组reviews、rating为0 |

## 何时自动触发

- 新建 `tests/utils/xxx.js` → 自动建议补测试
- npm test 有失败 → 自动分析失败原因
- Git diff 显示改了什么函数 → 建议检查对应测试用例
- 说"补测试"或"跑测试"

## 输出

生成的测试用例直接写入 `tests/utils.test.js`，然后自动跑 `npm test` 验证。
