function calcFishingIndex(dayData, tideData) {
  // Wind (20pts)
  const windScale = parseInt(dayData.windScaleDay) || 3;
  let wWind;
  if (windScale <= 2) wWind = 20; else if (windScale === 3) wWind = 16; else if (windScale === 4) wWind = 12;
  else if (windScale === 5) wWind = 7; else if (windScale === 6) wWind = 3; else wWind = 0;

  // Pressure (20pts)
  const press = parseInt(dayData.pressure) || 1013;
  let wPress;
  if (press >= 1010 && press <= 1020) wPress = 20;
  else if (press >= 1005 && press < 1010) wPress = 16;
  else if (press >= 1020 && press <= 1025) wPress = 15;
  else if (press >= 1000 && press < 1005) wPress = 10;
  else if (press > 1025) wPress = 8;
  else wPress = 5;

  // Tide (20pts)
  let wTide = 10;
  if (tideData && tideData.tideTable && tideData.tideTable.length >= 2) {
    const heights = tideData.tideTable.map(t => parseFloat(t.height) || 0);
    const diff = Math.max(...heights) - Math.min(...heights);
    if (diff > 3.0) wTide = 20; else if (diff > 2.5) wTide = 18; else if (diff > 2.0) wTide = 16;
    else if (diff > 1.5) wTide = 14; else if (diff > 1.0) wTide = 11; else if (diff > 0.5) wTide = 8; else wTide = 5;
  }

  // Temp (15pts)
  const temp = parseInt(dayData.tempMax) || 25;
  let wTemp;
  if (temp >= 20 && temp <= 28) wTemp = 15;
  else if ((temp >= 16 && temp < 20) || (temp > 28 && temp <= 32)) wTemp = 12;
  else if ((temp >= 12 && temp < 16) || (temp > 32 && temp <= 35)) wTemp = 8;
  else wTemp = 5;

  // Moon (10pts)
  const moonIcon = dayData.moonPhaseIcon || '800';
  let wMoon;
  if (moonIcon === '800' || moonIcon === '801') wMoon = 10;
  else if (moonIcon === '802' || moonIcon === '806') wMoon = 8;
  else if (moonIcon === '803' || moonIcon === '805') wMoon = 6;
  else if (moonIcon === '804') wMoon = 4;
  else wMoon = 6;

  // Weather (15pts)
  const text = (dayData.textDay || '').toLowerCase();
  let wWeather;
  if (text.includes('多云')) wWeather = 15;
  else if (text.includes('阴')) wWeather = 13;
  else if (text.includes('晴')) wWeather = 10;
  else if (text.includes('小雨') || text.includes('阵雨')) wWeather = 8;
  else if (text.includes('中雨')) wWeather = 5;
  else if (text.includes('大雨') || text.includes('暴雨')) wWeather = 2;
  else if (text.includes('雷')) wWeather = 0;
  else wWeather = 10;

  return wWind + wPress + wTide + wTemp + wMoon + wWeather;
}

function getRecIndex(captain) {
  let score = 0;
  const rating = parseFloat(captain.rating) || 0;
  score += Math.min(rating, 5) / 5 * 40;
  if (captain.hasSchedule) score += 25;
  if (captain.guideEnabled) score += 20;
  const orderBonus = Math.min((captain.completedOrders || 0) / 100, 1) * 10;
  const reviewBonus = Math.min((captain.reviewCount || 0) / 20, 1) * 5;
  score += orderBonus + reviewBonus;
  return Math.round(Math.min(score, 100));
}

module.exports = { calcFishingIndex, getRecIndex };
