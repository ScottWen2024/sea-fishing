App({
  onLaunch() {
    wx.cloud.init({ env: 'cloud1' });
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
