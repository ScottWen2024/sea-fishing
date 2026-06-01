Page({
  data: {
    subMode: 'boat',
    showChainForm: false,
    chains: [
      { id:'1', creatorName:'深圳老张', port:'南澳岛', date:'5月31日', slot:'全日 06-17', targetFish:'真鲷、石斑', maxPeople:6, joined:3, status:'open',
        participants:[{name:'深圳老张',count:2},{name:'广州小李',count:1}] },
      { id:'2', creatorName:'汕头阿明', port:'澄海莱芜', date:'5月30日', slot:'早班 05-12', targetFish:'黄鳍鲷', maxPeople:4, joined:4, status:'full',
        participants:[{name:'汕头阿明',count:1},{name:'潮州小王',count:1},{name:'揭阳老刘',count:2}] }
    ],
    newChain: { port:'南澳岛', date:'', slot:'全日', fish:'', maxPeople:'4', name:'', contact:'' },
    captains: [
      { id:'c1', name:'阿强船长', avatar:'👨‍✈️', boatName:'南澳号', boatType:'12米艇 6人', port:'南澳岛', fishTarget:'真鲷、石斑、黑鲷', cert:'持证15年', guideEnabled:true, rating:'4.7', completedOrders:86 },
      { id:'c2', name:'老陈船长', avatar:'🧔', boatName:'莱芜之星', boatType:'10米艇 4人', port:'澄海莱芜', fishTarget:'黄鳍鲷、沙钻', cert:'持证8年', guideEnabled:true, rating:'4.5', completedOrders:52 },
      { id:'c3', name:'海哥', avatar:'🧑‍🔧', boatName:'海门猎手', boatType:'14米船 8人', port:'潮阳海门', fishTarget:'带鱼、马鲛', cert:'持证20年', guideEnabled:true, rating:'4.3', completedOrders:120 },
      { id:'c4', name:'阿明船长', avatar:'👲', boatName:'南澳快鱼', boatType:'9米艇 3人', port:'南澳岛', fishTarget:'石斑、真鲷', cert:'持证6年', guideEnabled:false, rating:'5.0', completedOrders:35 },
      { id:'c5', name:'肥仔船长', avatar:'🧔‍♂️', boatName:'海岛风情', boatType:'11米艇 5人', port:'南澳岛', fishTarget:'黑鲷、黄鳍鲷', cert:'持证12年', guideEnabled:true, rating:'4.5', completedOrders:68 }
    ],
    bookings: [
      { id:'b1', captainName:'阿强船长', date:'5月20日', slot:'早班', people:2, price:300, userContact:'138****8888', status:'completed' },
      { id:'b2', captainName:'老陈船长', date:'5月22日', slot:'全日', people:3, price:400, userContact:'139****9999', status:'confirmed' }
    ]
  },
  onLoad() { this.filterCaptains(); },
  switchSubMode(e) { this.setData({ subMode: e.currentTarget.dataset.mode }); this.filterCaptains(); },
  filterCaptains() { const cs = this.data.subMode === 'guide' ? this.data.captains.filter(c => c.guideEnabled) : this.data.captains; this.setData({ filteredCaptains: cs }); },
  showCreateChain() { this.setData({ showChainForm: true }); },
  hideCreateChain() { this.setData({ showChainForm: false }); },
  onChainInput(e) { const f = e.currentTarget.dataset.field; this.setData({ ['newChain.'+f]: e.detail.value }); },
  createChain() {
    const nc = this.data.newChain;
    if (!nc.date || !nc.name || !nc.contact) { wx.showToast({ title:'请填写日期/称呼/联系方式', icon:'none' }); return; }
    const chains = this.data.chains;
    chains.unshift({ id:'c'+Date.now(), creatorName:nc.name, port:nc.port, date:nc.date, slot:nc.slot, targetFish:nc.fish||'未指定', maxPeople:parseInt(nc.maxPeople)||4, joined:1, status:'open', participants:[{name:nc.name,count:1}] });
    this.setData({ chains, showChainForm: false, newChain: { port:'南澳岛', date:'', slot:'全日', fish:'', maxPeople:'4', name:'', contact:'' } });
    wx.showToast({ title:'拼船已发起', icon:'success' });
  },
  joinChain(e) {
    const id = e.currentTarget.dataset.id;
    const chains = this.data.chains.map(c => { if (c.id===id) { c.joined++; if (c.joined >= c.maxPeople) c.status='full'; c.participants.push({name:'测试用户',count:1}); } return c; });
    this.setData({ chains }); wx.showToast({ title:'加入成功', icon:'success' });
  },
  viewCaptain() { wx.showToast({ title:'船长详情（待开发）', icon:'none' }); }
});
