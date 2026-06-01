const db = wx.cloud.database();
Page({
  data: { subMode:'boat', showChainForm:false, showCaptains:false, chains:[], captains:[
    { id:'c1',name:'阿强船长',avatar:'👨‍✈️',boatName:'南澳号',boatType:'12米艇 6人',port:'南澳岛',fishTarget:'真鲷、石斑',cert:'持证15年',guideEnabled:true,rating:'4.7',completedOrders:86 },
    { id:'c2',name:'老陈船长',avatar:'🧔',boatName:'莱芜之星',boatType:'10米艇 4人',port:'澄海莱芜',fishTarget:'黄鳍鲷',cert:'持证8年',guideEnabled:true,rating:'4.5',completedOrders:52 },
    { id:'c3',name:'海哥',avatar:'🧑‍🔧',boatName:'海门猎手',boatType:'14米船 8人',port:'潮阳海门',fishTarget:'带鱼、马鲛',cert:'持证20年',guideEnabled:true,rating:'4.3',completedOrders:120 }
  ], newChain:{ port:'南澳岛',date:'',slot:'全日',fish:'',maxPeople:'4',name:'',contact:'' }, bookings:[] },
  onShow(){ this.loadChains(); this.filterCaptains(); },
  loadChains(){ db.collection('chains').orderBy('createdAt','desc').get().then(res=>{this.setData({chains:res.data})}).catch(()=>{}); },
  toggleCaptains(){ this.setData({showCaptains:!this.data.showCaptains}); if(this.data.showCaptains)this.filterCaptains(); },
  switchSubMode(e){ this.setData({subMode:e.currentTarget.dataset.mode});this.filterCaptains(); },
  filterCaptains(){ const cs=this.data.subMode==='guide'?this.data.captains.filter(c=>c.guideEnabled):this.data.captains;this.setData({filteredCaptains:cs}); },
  showCreateChain(){ this.setData({showChainForm:true}); },
  hideCreateChain(){ this.setData({showChainForm:false}); },
  onChainInput(e){ const f=e.currentTarget.dataset.field;this.setData({['newChain.'+f]:e.detail.value}); },
  createChain(){ const nc=this.data.newChain; if(!nc.date||!nc.name||!nc.contact){wx.showToast({title:'请填写日期/称呼/联系方式',icon:'none'});return;} const chain={creatorName:nc.name,port:nc.port,date:nc.date,slot:nc.slot,targetFish:nc.fish||'未指定',maxPeople:parseInt(nc.maxPeople)||4,participants:[{name:nc.name,count:1,contact:nc.contact}],status:'open',createdAt:new Date()}; db.collection('chains').add({data:chain}).then(()=>{wx.showToast({title:'约钓已发起',icon:'success'});this.setData({showChainForm:false,newChain:{port:'南澳岛',date:'',slot:'全日',fish:'',maxPeople:'4',name:'',contact:''}});this.loadChains();}).catch(()=>{wx.showToast({title:'发起失败',icon:'none'});}); },
  joinChain(e){ wx.showToast({title:'加入成功',icon:'success'});this.loadChains(); }
});
