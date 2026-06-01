Page({ data: { stats: '3条渔获 · 3次出海' },
  goRecord() { wx.switchTab({ url: '/pages/record/record' }); },
  goMarket() { wx.navigateTo({ url: '/pages/market/market' }); },
  goWiki() { wx.navigateTo({ url: '/pages/wiki/wiki' }); },
  goGear() { wx.navigateTo({ url: '/pages/gear/gear' }); },
  goSeasick() { wx.navigateTo({ url: '/pages/guide/guide' }); },
  goEquip() { wx.navigateTo({ url: '/pages/equip/equip' }); },
  goMoon() { wx.navigateTo({ url: '/pages/moon/moon' }); },
  goPreserve() { wx.navigateTo({ url: '/pages/guide/guide' }); },
  goRank() { wx.switchTab({ url: '/pages/record/record' }); }
});
