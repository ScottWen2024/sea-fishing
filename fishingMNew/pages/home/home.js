const TIPS = ['涨潮前2小时鱼口最猛','潮差越大鱼越活跃','阴天比晴天好钓','满月前后三天大潮','清晨黄昏是黄金时段','气压稳定1010-1020hPa最适合出海','北风天鱼口好','新手别买贵装备','出海前30分钟吃晕船药','活虾比死虾效果好3倍'];
const db = wx.cloud.database();

Page({
  data: { weather: null, chains: [], fishTip: '' },
  onLoad() { this.setData({ weather: { wind:'东南风 2级',wave:'0.1-0.3m',temp:'28',advice:'✅ 推荐出海',hint:'天气条件良好',level:'good' }, fishTip: TIPS[new Date().getDate() % TIPS.length] }); },
  onShow() { db.collection('chains').where({ status:'open' }).orderBy('createdAt','desc').limit(5).get().then(res=>{this.setData({chains:res.data})}).catch(()=>{}); },
  goRecord(){ wx.switchTab({url:'/pages/record/record'}); },
  goFindCaptain(){ wx.switchTab({url:'/pages/trip/trip'}); },
  goChainCreate(){ wx.switchTab({url:'/pages/trip/trip'}); },
  showEquip(){ wx.navigateTo({url:'/pages/equip/equip'}); },
  showWiki(){ wx.navigateTo({url:'/pages/wiki/wiki'}); },
  showSeasick(){ wx.navigateTo({url:'/pages/guide/guide'}); },
  showPreserve(){ wx.navigateTo({url:'/pages/guide/guide'}); },
  goTrip(){ wx.switchTab({url:'/pages/trip/trip'}); }
});
