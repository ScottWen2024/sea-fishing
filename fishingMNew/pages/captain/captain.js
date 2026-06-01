Page({
  data: {
    ctab: '👤 资料',
    tabs: ['👤 资料', '📅 排期', '📨 预约', '📊 统计'],
    profile: { name:'阿强船长', phone:'138****6789', boatName:'南澳号', boatType:'12米艇 6人', port:'南澳岛', cert:'持证15年' },
    sched: { date:'', capacity:'4', price:'300' },
    schedules: [{ date:'2026-06-01', slot:'全日', capacity:4, price:300, remaining:2 }],
    cBookings: [{ id:'b1', userName:'深圳老张', date:'2026-06-01', slot:'全日', people:2, price:300, userContact:'138****8888', status:'pending' }],
    stats: { orders: 8, revenue: 2400, rating: '4.7' }
  },
  switchCTab(e) { this.setData({ ctab: e.currentTarget.dataset.tab }); },
  onProfileInput(e) { const f = e.currentTarget.dataset.field; this.setData({ ['profile.'+f]: e.detail.value }); },
  saveProfile() { wx.showToast({ title:'资料已保存', icon:'success' }); },
  publishSchedule() { wx.showToast({ title:'排期已发布', icon:'success' }); },
  confirmBooking(e) { const id = e.currentTarget.dataset.id; const bks = this.data.cBookings.map(b => b.id===id ? {...b, status:'confirmed'} : b); this.setData({ cBookings: bks }); wx.showToast({ title:'已确认', icon:'success' }); },
  completeBooking(e) { const id = e.currentTarget.dataset.id; const bks = this.data.cBookings.map(b => b.id===id ? {...b, status:'completed'} : b); this.setData({ cBookings: bks }); wx.showToast({ title:'已完成', icon:'success' }); }
});
