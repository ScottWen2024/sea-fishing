const Sentry = require('sentry-miniapp');

Sentry.init({
  dsn: 'https://0f3f6a619fb7e43c1fc9217493af37a6@o4509009920589824.ingest.de.sentry.io/4511518562058320',
  tracesSampleRate: 1.0,
  environment: 'uat'
});
App({
  onLaunch() {
    wx.cloud.init({ env: 'cloud1' });
  },
  globalData: {
    currentPort: '鍗楁境宀?,
    currentCity: '姹曞ご',
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
