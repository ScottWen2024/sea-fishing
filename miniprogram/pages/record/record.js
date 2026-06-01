Page({
  data: { tab:'my', displayList:[], stats:{}, showFishResult:false, fishResult:{} },
  catches: [
    { id:'ct1',fishName:'黑鲷',weight:'2.3斤',length:'35cm',port:'南澳岛',bait:'活虾',date:'2026-05-20' },
    { id:'ct2',fishName:'真鲷',weight:'1.8斤',length:'30cm',port:'南澳岛',bait:'沙蚕',date:'2026-05-15' },
    { id:'ct3',fishName:'石斑',weight:'4.5斤',length:'52cm',port:'潮阳海门',bait:'活虾',date:'2026-05-10' }
  ],
  onLoad() { this.switchTab({ currentTarget: { dataset: { tab: 'my' } } }); },
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab === 'my') {
      this.setData({ tab:'my', displayList: this.catches });
      const species = new Set(this.catches.map(c=>c.fishName)).size;
      const maxW = Math.max(...this.catches.map(c=>parseFloat(c.weight)||0));
      this.setData({ stats: { total: this.catches.length, species, maxWeight: maxW+'斤' } });
    } else {
      const ranked = {};
      this.catches.forEach(c => { const w = parseFloat(c.weight)||0; if (!ranked[c.fishName] || w>(parseFloat(ranked[c.fishName].weight)||0)) ranked[c.fishName]=c; });
      this.setData({ tab:'rank', displayList: Object.values(ranked).sort((a,b)=>(parseFloat(b.weight)||0)-(parseFloat(a.weight)||0)) });
    }
  },
  simFishID() {
    this.setData({ showFishResult: true, fishResult: { name:'黑鲷（真鲷）', alias:'海鲋、青鳞', temp:'18-25°C', depth:'3-50米', time:'涨潮前后', season:'春、秋', methods:'底钓、矶钓', taste:'⭐⭐⭐⭐', tasteNote:'肉质细嫩，清蒸红烧俱佳' } });
  },
  saveFromID() {
    this.catches.unshift({ id:'ct'+Date.now(), fishName:this.data.fishResult.name, weight:'', length:'', port:'南澳岛', bait:'', date:new Date().toISOString().split('T')[0] });
    this.setData({ showFishResult: false });
    this.switchTab({ currentTarget: { dataset: { tab: 'my' } } });
    wx.showToast({ title:'渔获已记录', icon:'success' });
  },
  addCatch() { wx.showToast({ title:'手动添加（待开发）', icon:'none' }); }
});
