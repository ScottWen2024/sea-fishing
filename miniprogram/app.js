App({
  onLaunch() {
    // 初始化云开发（需要先在 DevTools 开通）
    // 云开发暂未开通，本地测试
    // 读取本地缓存
    const appData = wx.getStorageSync('haiyutong_data') || {};
    this.globalData = appData;
  },
  globalData: {
    currentPort: '南澳岛',
    currentCity: '汕头',
    currentMode: 'fisherman',
    selectedDate: null,
    weatherCache: {},
    catches: [],
    bookings: [],
    captains: [],
    chains: [],
    safetyAccepted: false
  }
});
