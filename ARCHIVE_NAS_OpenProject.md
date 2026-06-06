# 归档：海钓通 & OpenProject + NAS 部署会话

> 归档时间：2026-06-06

## 一、海钓通项目概况

| 项目 | 详情 |
|:---|------|
| 名称 | 海钓通（Fishing） |
| 位置 | D:\Codex\Fishing\Fishing project |
| 目标用户 | 中国 1.4 亿钓鱼爱好者，海钓群体 500 万+ |
| 核心功能 | 出海决策 + 组队拼船 + 渔获档案 + 海钓知识 |
| 产品形态 | H5 原型 (index.html 170KB) + 微信小程序 (fishingMNew 11页) |
| 后端 | 微信云开发 (cloud1/UAT, cloud-prod/待建) |
| 开发周期 | 2026-05-29 ~ 06-02，25 次提交 |
| 测试 | Jest 22 用例，E2E 首个用例通过率 50%（1个Bug已修复） |
| 文档体系 | PRD → ARCHITECTURE → DEV_GUIDE → TESTING → DEPLOY → MAINTENANCE |

## 二、OpenProject + NAS 部署需求

| 项目 | 详情 |
|:---|------|
| 需求 | 将 OpenProject 的 PostgreSQL 数据库持久化到外部 NAS |
| NAS 地址 | \\ScottNas\Notes\Projects |
| NAS 凭据 | 用户 scottwen，密码 u{zCg0} |
| NAS 协议 | SMB（局域网） |
| 关键问题 | 需要在 OpenProject 所在的 **Docker 虚拟机内部** 挂载 NAS |
| 待确认 | OpenProject 具体跑在哪台虚机/环境中（当前未明确）|
| 技术建议 | PostgreSQL 不建议直接放 NFS/SMB，推荐本地存储 + NAS 定时备份 |

## 三、NAS 挂载命令（待执行）

### 虚拟机上执行：
`ash
sudo apt update && sudo apt install -y cifs-utils
sudo mkdir -p /mnt/nas/projects
sudo mount -t cifs //ScottNas/Notes/Projects /mnt/nas/projects -o username=scottwen,password='u{zCg0}',vers=3.0
`

### Docker 数据卷指向：
`ash
docker run -d --name openproject -p 8080:80 \
  -v /mnt/nas/projects/openproject-db:/var/lib/postgresql/data \
  -v /mnt/nas/projects/openproject-assets:/var/openproject/assets \
  openproject/community:latest
`

## 四、已知风险
- 🚫 沙箱限制：无法直接执行 
et use、UNC 路径访问、wsl 命令
- 🚫 Docker CLI 在当前会话不可用
- ⚠️ PostgreSQL 数据放 SMB NAS 存在数据损坏风险（建议 iSCSI 或本地+备份）
- ❓ OpenProject 所在虚拟机环境尚未确认

## 五、下一步（新会话）
1. 确认 OpenProject 部署环境（虚机系统、IP、SSH 方式）
2. 在虚机内挂载 NAS SMB 共享
3. 配置 Docker 数据卷指向 NAS
4. 考虑定时备份策略降低数据风险
