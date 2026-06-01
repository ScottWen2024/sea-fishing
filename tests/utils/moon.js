function getMoonPhase(dateStr) {
  const knownNewMoon = new Date('2026-05-08');
  const target = new Date(dateStr);
  const daysSince = Math.round((target - knownNewMoon) / 86400000);
  const age = ((daysSince % 29.53) + 29.53) % 29.53;
  const icons = ['🌑', '🌒', '🌒', '🌓', '🌓', '🌔', '🌔', '🌕', '🌖', '🌖', '🌗', '🌗', '🌘', '🌘', '🌑'];
  const names = ['新月', '蛾眉月', '蛾眉月', '上弦月', '上弦月', '盈凸月', '盈凸月', '满月', '亏凸月', '亏凸月', '下弦月', '下弦月', '残月', '残月', '新月'];
  const idx = Math.floor(age / 29.53 * icons.length) % icons.length;
  return { icon: icons[idx], name: names[idx], isSpring: idx === 0 || idx === 7 };
}

module.exports = { getMoonPhase };
