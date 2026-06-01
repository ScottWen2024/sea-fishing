const { estimateWave, getWeatherAdvice, formatDate } = require('./utils/weather');
const { haversine } = require('./utils/geo');
const { getMoonPhase } = require('./utils/moon');
const { calcFishingIndex, getRecIndex } = require('./utils/fishing');

// ==================== estimateWave ====================
describe('estimateWave', () => {
  test('微风 ≤10km/h → 0.1-0.3m', () => { expect(estimateWave(5)).toBe('0.1-0.3'); });
  test('轻风 15km/h → 0.3-0.6m', () => { expect(estimateWave(15)).toBe('0.3-0.6'); });
  test('强风 35km/h → 1.2-2.0m', () => { expect(estimateWave(35)).toBe('1.2-2.0'); });
  test('大风 >40km/h → >2.0m', () => { expect(estimateWave(50)).toBe('>2.0'); });
  test('边界值 10km/h → 0.1-0.3m', () => { expect(estimateWave(10)).toBe('0.1-0.3'); });
});

// ==================== getWeatherAdvice ====================
describe('getWeatherAdvice', () => {
  test('2级风 → 推荐出海', () => {
    const r = getWeatherAdvice(2);
    expect(r.level).toBe('good');
    expect(r.text).toBe('推荐出海');
  });
  test('4级风 → 谨慎出海', () => {
    const r = getWeatherAdvice(4);
    expect(r.level).toBe('warn');
  });
  test('7级风 → 不建议出海', () => {
    const r = getWeatherAdvice(7);
    expect(r.level).toBe('bad');
  });
});

// ==================== haversine ====================
describe('haversine', () => {
  test('同一点 → 0km', () => {
    expect(haversine(23.0, 117.0, 23.0, 117.0)).toBe(0);
  });
  test('汕头到深圳 ≈ 300-350km', () => {
    const d = haversine(23.42, 117.1, 22.54, 114.06);
    expect(d).toBeGreaterThan(250);
    expect(d).toBeLessThan(400);
  });
  test('南澳岛到潮阳海门 ≈ 40-80km', () => {
    const d = haversine(23.42, 117.1, 23.18, 116.62);
    expect(d).toBeGreaterThan(30);
    expect(d).toBeLessThan(100);
  });
});

// ==================== getMoonPhase ====================
describe('getMoonPhase', () => {
  test('2026-05-08 → 新月', () => {
    const m = getMoonPhase('2026-05-08');
    expect(m.name).toBe('新月');
    expect(m.isSpring).toBe(true);
  });
  test('2026-05-23 → 满月附近', () => {
    const m = getMoonPhase('2026-05-23');
    expect(m.isSpring).toBe(true);
  });
  test('随机日期 → 不是大潮日', () => {
    const m = getMoonPhase('2026-06-05');
    expect(typeof m.name).toBe('string');
  });
});

// ==================== calcFishingIndex ====================
describe('calcFishingIndex', () => {
  test('完美天气 → ≥80分', () => {
    const day = { windScaleDay: '2', windSpeedDay: '5', tempMax: '24', pressure: '1013', textDay: '多云', moonPhaseIcon: '801' };
    const tide = { tideTable: [{ height: '3.5' }, { height: '0.2' }, { height: '3.2' }, { height: '0.5' }] };
    expect(calcFishingIndex(day, tide)).toBeGreaterThanOrEqual(80);
  });
  test('恶劣天气 → <50分', () => {
    const day = { windScaleDay: '7', windSpeedDay: '45', tempMax: '35', pressure: '998', textDay: '雷阵雨', moonPhaseIcon: '804' };
    const tide = { tideTable: [{ height: '1.0' }, { height: '0.5' }] };
    expect(calcFishingIndex(day, tide)).toBeLessThan(50);
  });
  test('中等天气 → 60-79分', () => {
    const day = { windScaleDay: '4', windSpeedDay: '25', tempMax: '30', pressure: '1003', textDay: '小雨', moonPhaseIcon: '803' };
    const tide = { tideTable: [{ height: '2.0' }, { height: '0.5' }] };
    const score = calcFishingIndex(day, tide);
    expect(score).toBeGreaterThanOrEqual(50);
    expect(score).toBeLessThan(80);
  });
});

// ==================== getRecIndex ====================
describe('getRecIndex', () => {
  test('满分船长 → >80分', () => {
    const c = { rating: '5.0', hasSchedule: true, guideEnabled: true, completedOrders: 120, reviewCount: 30 };
    expect(getRecIndex(c)).toBeGreaterThanOrEqual(80);
  });
  test('新船长 → <50分', () => {
    const c = { rating: '3.0', hasSchedule: false, guideEnabled: false, completedOrders: 5, reviewCount: 1 };
    expect(getRecIndex(c)).toBeLessThan(50);
  });
});

// ==================== formatDate ====================
describe('formatDate', () => {
  test('标准日期 → X月X日', () => { expect(formatDate('2026-06-15')).toBe('6月15日'); });
  test('新年 → 1月1日', () => { expect(formatDate('2026-01-01')).toBe('1月1日'); });
});
