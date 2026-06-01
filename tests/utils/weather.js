function estimateWave(windSpeed) {
  const s = parseFloat(windSpeed) || 0;
  if (s <= 10) return '0.1-0.3';
  if (s <= 20) return '0.3-0.6';
  if (s <= 30) return '0.6-1.2';
  if (s <= 40) return '1.2-2.0';
  return '>2.0';
}

function getWeatherAdvice(windScale) {
  const s = parseInt(windScale) || 0;
  if (s >= 6) return { level: 'bad', icon: '❌', text: '不建议出海', hint: '风力过大，浪高危险' };
  if (s >= 4) return { level: 'warn', icon: '⚠️', text: '谨慎出海', hint: '条件一般，注意安全' };
  return { level: 'good', icon: '✅', text: '推荐出海', hint: '天气条件良好，适合出海' };
}

function formatDate(d) {
  const date = new Date(d);
  return (date.getMonth() + 1) + '月' + date.getDate() + '日';
}

module.exports = { estimateWave, getWeatherAdvice, formatDate };
