# 🔄 下一个会话：请先做这两件事

## 1. 了解上下文
读取 D:\Codex\Fishing\Fishing project\ARCHIVE_NAS_OpenProject.md

## 2. 你的任务
帮助用户在 OpenProject 所在的 Docker 虚拟机内挂载 NAS（\\ScottNas\Notes\Projects），
将 PostgreSQL 数据持久化到 NAS 上，然后重启 OpenProject 容器指向 NAS 存储。

## 3. 你需要先问用户
当前 OpenProject 部署在哪台虚拟机？（IP、系统、SSH 登录方式）

---

## 2026-06-06 最新状态

### CI环境: 100%完成 (12阶段全部OK)
- 代码已push到GitHub dev分支
- GitHub Actions CI: lint+test+security+summary 4 job
- Sentry: 已集成DSN
- 微信小程序部署: miniprogram-ci + deploy.yml
- OpenProject: Docker运行中, NAS每6h增量备份
- version: v0.1.0 tag已push
- ci-setup Skill: ~/.codex/skills/ci-setup/

### 密钥速查
- GitHub Token: ****见GitHub Settings****
- OpenProject API: f8918a130f0eefa0ece3c0f3013328ed117ee2a35d3c3ca6b8fd066ab67c1ec5
- 微信AppID: wx2c553cb44c3b5a4f, 私钥: fishingMNew/ci-key/
- Sentry DSN: 已写入app.js
- 代理端口: 7897

### 下一步
- 分支保护: https://github.com/ScottWen2024/sea-fishing/settings/branches
- 上线前: Sentry environment 改为 production
- 旧Token撤销: GitHub Settings > Tokens