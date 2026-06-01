// 云函数初始化种子数据 — 拥有管理员权限，不受前端权限限制
const cloud = require('wx-server-sdk');
cloud.init({ env: 'cloud1' });
const db = cloud.database();

exports.main = async () => {
  const chains = [
    { creatorName:'深圳老张',port:'南澳岛',date:'6月5日',slot:'全日',targetFish:'真鲷、石斑',maxPeople:6,participants:[{name:'深圳老张',count:2}],status:'open',createdAt:new Date() },
    { creatorName:'汕头阿明',port:'澄海莱芜',date:'6月3日',slot:'早班',targetFish:'黄鳍鲷',maxPeople:4,participants:[{name:'汕头阿明',count:1},{name:'潮州小王',count:1},{name:'揭阳老刘',count:2}],status:'full',createdAt:new Date() },
    { creatorName:'广州小李',port:'南澳岛',date:'6月8日',slot:'全日',targetFish:'石斑',maxPeople:5,participants:[{name:'广州小李',count:1}],status:'open',createdAt:new Date() }
  ];
  for (const c of chains) {
    await db.collection('chains').add({ data: c });
  }
  return { ok: true, added: chains.length };
};
