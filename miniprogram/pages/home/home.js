// 测试数据（云开发开通前使用）
const TEST_WEATHER = {
  wind: '东南风 2级', wave: '0.1-0.3m', temp: '28',
  advice: '✅ 推荐出海', hint: '天气条件良好 · 能见度20km', level: 'good'
};
const TEST_CHAINS = [
  { id: '1', creatorName: '深圳老张', port: '南澳岛', date: '5月31日', joined: 3, maxPeople: 6 },
  { id: '2', creatorName: '汕头阿明', port: '澄海莱芜', date: '5月30日', joined: 4, maxPeople: 4 },
];

Page({
  data: { weather: null, chains: [] },
  onLoad() { this.setData({ weather: TEST_WEATHER, chains: TEST_CHAINS }); },
  // 导航
  goRecord()       { wx.switchTab({ url: '/pages/record/record' }); },
  goFindCaptain()  { wx.switchTab({ url: '/pages/trip/trip' }); },
  goGuide()        { wx.switchTab({ url: '/pages/trip/trip' }); },
  goChainCreate()  { wx.switchTab({ url: '/pages/trip/trip' }); },
  goRecordCatches(){ wx.switchTab({ url: '/pages/record/record' }); },
  showTide()       { wx.showToast({ title: '潮汐曲线', icon: 'none' }); },
  showEquip()      { wx.navigateTo({ url: '/pages/equip/equip' }); },
  showWiki()       { wx.navigateTo({ url: '/pages/wiki/wiki' }); },
  showMarket()     { wx.navigateTo({ url: '/pages/market/market' }); },
  goTrip()         { wx.switchTab({ url: '/pages/trip/trip' }); }
});
