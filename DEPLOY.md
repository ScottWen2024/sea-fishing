# 海钓通 部署指南

---

## 部署概览

```
   H5 原型              小程序 UAT           小程序 生产
 ┌─────────┐         ┌───────────┐        ┌───────────┐
 │本地启动  │   →    │ DevTools  │   →   │ 微信审核   │
 │即可访问  │        │ 上传代码   │       │ 发布上线   │
 └─────────┘         └───────────┘        └───────────┘
  0 步骤              cloud1 数据库       cloud-prod 数据库
```

---

## 一、H5 部署

### 本地开发

```bash
cd D:\Fishing project
python -m http.server 3000
```

### 部署到服务器（未来）

```bash
# 静态文件部署，无需后端
scp index.html user@server:/var/www/haiyutong/
```

---

## 二、小程序 UAT 部署

### 前置条件
- [ ] DevTools 打开 `D:\Fishing project\fishingMNew`
- [ ] AppID 正确：`wx830d50bbce223a51`
- [ ] 云环境 `cloud1` 已初始化

### 步骤

1. **更新云函数**
   - 右键 `cloudfunctions/getUserSig` → 上传并部署
   - 右键 `cloudfunctions/initChains` → 上传并部署

2. **更新数据库种子数据**（首次或重置后）
   - 云端测试 `initChains` → 调用

3. **上传代码**
   - DevTools 右上角 → 上传
   - 版本号格式：`v3.1.0-日期`

4. **设置体验版**
   - mp.weixin.qq.com → 管理 → 版本管理
   - 选刚上传的版本 → 设为体验版
   - 生成体验二维码 → 扫码测试

5. **UAT 测试**
   - 对照 checklist.md 全部走一遍
   - 重点：约钓创建、船长搜索、渔获记录

---

## 三、小程序生产部署

### 前置检查 ⚠️

- [ ] UAT checklist.md 全部通过
- [ ] `cloud1` 数据库数据已清理（删除测试数据）
- [ ] 云环境 `cloud-prod` 已创建
- [ ] `cloud-prod` 数据库集合结构与 `cloud1` 一致
- [ ] 云函数已在 `cloud-prod` 部署
- [ ] 隐私合规（用户协议、隐私政策已配置）

### 步骤

1. **切换环境**
   ```javascript
   // app.js — 改这一行
   wx.cloud.init({ env: 'cloud-prod' });  // 从 cloud1 改为 cloud-prod
   ```

2. **上传代码**
   - DevTools → 上传
   - 版本号：`v3.x.x-正式版`

3. **提交审核**
   - mp.weixin.qq.com → 版本管理
   - 选刚上传的版本 → 提交审核
   - 类目：体育 → 钓鱼

4. **审核通过后**
   - 发布
   - 验证生产环境（下一条约钓、查看天气）
   - **将 app.js 的 env 改回 `cloud1`** 继续开发

### 回滚方案

```
生产出问题 → mp.weixin.qq.com → 版本管理
→ 选上一个稳定版本 → 设为线上版本（即时生效）
```

---

## 四、环境对照表

| 配置项 | H5 | UAT | 生产 |
|------|:---:|:---:|:---:|
| 访问方式 | localhost:3000 | DevTools 扫码 | 微信搜索 |
| 数据库 | localStorage | cloud1 | cloud-prod |
| 用户 | 只有你 | 你 + 测试用户 | 所有用户 |
| API Key | 直接调用 | 云函数代理 | 云函数代理 |
| 更新方式 | 改文件刷新 | 上传代码 | 审核后发布 |
| 回滚 | git checkout | 回退版本 | 选旧版本 |
