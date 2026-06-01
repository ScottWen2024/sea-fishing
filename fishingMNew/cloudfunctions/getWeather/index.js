// 云函数：getWeather — 代理和风天气API + 内存缓存
const cloud = require('wx-server-sdk');
cloud.init();
const cache = {}; // 内存缓存，云函数实例存活期间有效

exports.main = async (event) => {
  const { cityId, date } = event;
  const cacheKey = cityId + '_' + date;

  // 30分钟缓存
  if (cache[cacheKey] && Date.now() - cache[cacheKey].time < 30 * 60 * 1000) {
    return { code: 200, weather: cache[cacheKey].data, cached: true };
  }

  try {
    const res = await cloud.callFunction({
      name: 'httpRequest',
      data: {
        url: `https://pa5egmtvfn.re.qweatherapi.com/v7/weather/7d?location=${cityId}&key=c3cb514f98e5491d81cbd4a685298151`
      }
    });
    const json = res.result;
    if (json.code === '200') {
      const target = json.daily.find(d => d.fxDate === date);
      if (target) {
        cache[cacheKey] = { data: target, time: Date.now() };
        return { code: 200, weather: target };
      }
    }
    return { code: 404, msg: '未找到该日天气' };
  } catch(e) {
    return { code: 500, msg: e.message };
  }
};
