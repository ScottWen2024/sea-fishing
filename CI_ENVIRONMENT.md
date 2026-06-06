# 海钓通 CI/CD 环境全貌

> 最后更新: 2026-06-06 | 项目: sea-fishing | 负责人: ScottWen | 开发方式: AI Coding (Codex)

---

## 一、环境拓扑总览

```
┌──────────────────────────────────────────────���───────┐
│              开发机 (Windows, wengh)                    │
│  D:\Codex\Fishing\Fishing project\                   │
│  ├── fishingMNew\        ← 微信小程序代码 (11页面)       │
│  ├── tests\              ← Jest单元测试 + E2E测试      │
│  ├── .github\workflows\  ← GitHub Actions CI      │
│  ├── .husky\             ← Git pre-commit钩子        │
│  └── 文档体系 (PRD/DEV/CI/ARCH...)                     │
└───────┬──────────────┬────────────────────┘
        │              │ SSH:4444
        ▼              ▼
┌──────────────┐  ┌──────────────────────────┐
│  GitHub.com  │  │  Ubuntu 24.04 VM (本地)    │
│  ScottWen2024│  │  127.0.0.1:4444           │
│  /sea-fishing│  │  ┌─────────────────────┐ │
│  ├── master  │  │  │ OpenProject Docker  │ │
│  └── dev     │  │  │ 127.0.0.1:8080      │ │
│  CI Actions   │  │  │ pgdata → Docker Vol │ │
└──────────────┘  │  │ assets → Docker Vol │ │
                  │  └─────────┬───────────┘ │
                  │            │ cron backup  │
                  │            ▼              │
                  │  ┌─────────────────────┐ │
                  │  │ NAS (192.168.1.14)  │ │
                  │  │ /mnt/nas/Projects/  │ │
                  │  │ openproject/backups/ │ │
                  │  └─────────────────────┘ │
                  └──────────────────────────┘
```

---

## 二、各系统详情

### 2.1 代码仓库 (GitHub)

| 项 | 值 |
|---|-----|
| 仓库 | `ScottWen2024/sea-fishing` |
| 远程 | `https://github.com/ScottWen2024/sea-fishing.git` |
| 分支策略 | `master` (发布) + `dev` (开发) |
| 当前分支 | `dev` |
| 最新提交 | `631e72a fix: CI ESLint v10→v8 兼容` |
| 分支保护 | ❌ 未配置 |
| Release/Tag | ❌ 未配置 |

### 2.2 CI Pipeline (GitHub Actions)

| 项 | 值 |
|---|-----|
| 配置文件 | `.github/workflows/ci.yml` |
| 触发条件 | push dev/master/main, PR master/main, manual |
| Job 1: lint-and-test | ESLint + Jest 测试 + 覆盖率上传 |
| Job 2: security-check | npm audit (high及以上) |
| Job 3: ci-summary | 汇总结果到 GitHub Step Summary |
| Node 版本 | 20 |
| npm 源 | `https://registry.npmmirror.com` (官方源不可达) |
| ESLint | v8.57.1, flat config已禁用 |
| 状态 | 🔴 前2次 runs 失败，本地修复已 commit，待 push 验证 |

**特殊约束**:
- `npm install --legacy-peer-deps` (eslint v8 与较新npm的peer dep冲突)
- `ESLINT_USE_FLAT_CONFIG=false` (使用 `.eslintrc.js` 格式)
- `--max-warnings 20` (暂宽限，逐步收紧)

### 2.3 本地 Git Hooks (Husky)

| 项 | 值 |
|---|-----|
| 配置 | `.husky/pre-commit` → `cd fishingMNew && npx lint-staged` |
| 工具 | Husky + lint-staged |
| 状态 | ⚠️ PATH问题：git-bash找不到npx |
| commitlint | ❌ 未配置 |

### 2.4 代码质量工具

| 工具 | 版本 | 配置 | 状态 |
|------|------|------|------|
| Prettier | 3.8.3 | `.prettierrc` (单引号,无分号,100宽) | ✅ |
| ESLint | 8.57.1 | `.eslintrc.js` (小程序全局变量已声明) | ✅ |
| Jest | 29.x | `tests/jest.config.js` | ✅ 21/21 pass, 81.3%覆盖 |
| npm audit | - | CI中 `--audit-level=high` | ✅ |

### 2.5 需求管理 (OpenProject)

| 项 | 值 |
|---|-----|
| 地址 | `http://127.0.0.1:8080` |
| 部署方式 | Docker 容器，镜像 `openproject/openproject:14` |
| 数据存储 | Docker Volume (pgdata + assets)，NAS定时备份 |
| API | 支持 REST API v3 |
| API Key | `f8918a130f0eefa0ece3c0f3013328ed117ee2a35d3c3ca6b8fd066ab67c1ec5` |
| 快速查询 | SSH执行 `/usr/local/bin/op-query.sh` |
| 登录 | `http://127.0.0.1:8080`，用户名 scottwen，密码 marval@123 |
| Tickets | 当前 ~38 个 |

### 2.6 备份系统 (OpenProject)

| 项 | 值 |
|---|-----|
| 脚本 | `/usr/local/bin/backup-openproject.sh` |
| 方式 | rsync增量 + `--link-dest`硬链接去重 |
| 频率 | 每6小时 (cron: `/etc/cron.d/openproject-backup`) |
| 保留份数 | 最近7份 |
| 备份目标 | NAS `/mnt/nas/Projects/openproject/backups/` |
| NAS挂载 | `/etc/fstab` 自动挂载 (vers=2.0, nofail) |
| 凭据 | `/root/.nas_credentials` (600权限) |
| 日志 | `/var/log/openproject-backup.log` |
| 恢复方式 | 见 [灾难恢复](#灾难恢复) |

### 2.7 微信小程序 CI

| 项 | 值 |
|---|-----|
| AppID | `wx2c553cb44c3b5a4f` |
| 云环境 (UAT) | `cloud1` |
| 云环境 (生产) | `cloud-prod` (待建) |
| CI 私钥 | `fishingMNew/ci-key/private.wx2c553cb44c3b5a4f.key` |
| 微信开发者工具 | `D:\Program Files (x86)\Tencent\微信web开发者工具` |
| 自动化上传 | 需 `miniprogram-ci` npm包，待配置 |
| 预览二维码 | 需 CI 工具生成，待配置 |

### 2.8 第三方 API Keys

| 服务 | Key | 用途 |
|------|-----|------|
| 和风天气 | `c3cb514f98e5491d81cbd4a685298151` | 天气/潮汐 |
| 高德地图 | `bb088961ee21fabcfd1fce9a3258fb27` | 地图/定位 |

---

## 三、CI 工作流详解

```
git push dev ──→ GitHub Actions 触发
                    │
                    ├── lint-and-test (ubuntu-latest, Node 20)
                    │   ├── npm install --legacy-peer-deps (fishingMNew)
                    │   ├── npx eslint pages/ --ext .js --max-warnings 20
                    │   ├── npm install (tests)
                    │   ├── npx jest --verbose --coverage
                    │   └── upload coverage artifact (保留14天)
                    │
                    ├── security-check (并行)
                    │   ├── npm audit --audit-level=high (fishingMNew)
                    │   └── npm audit --audit-level=high (tests)
                    │
                    └── ci-summary (汇总)
                        ├── Lint+Test 结果
                        └── Security Audit 结果
```

### 本地 pre-commit 流程 (待修复)

```
git commit ──→ Husky pre-commit hook
                  └── cd fishingMNew && npx lint-staged
                        └── Prettier + ESLint 自动修复暂存文件
```

### OpenProject ↔ GitHub 桥接 (手动)

```
需求录入 OpenProject ──→ AI 分析 → 创建Git分支
                              ↓
                        代码实现+提交
                              ↓
                        Git commit 消息关联 ticket
                              ↓
                        PR / Code Review → 合并 dev
                              ↓
                        OpenProject ticket 手动更新状态
```

> ⚠️ 当前桥接是单向手动：需人工在OpenProject更新ticket状态  
> 🔮 计划：通过Codex自动化或Webhook实现双向同步

---

## 四、产物与存档位置

| 产物 | 位置 | 保留策略 |
|------|------|----------|
| npm 依赖 | `fishingMNew/node_modules/`, `tests/node_modules/` | `.gitignore` (不提交) |
| 覆盖率报告 | `tests/reports/coverage/` | CI artifact 14天, 本地不提交 |
| E2E 报告 | `tests/e2e/reports/` | 本地保留 |
| 微信上传产物 | 微信云开发 (cloud1) | 云环境管理 |
| OpenProject 数据 | Docker Volume (本地) + NAS备份 | NAS保留最近7份 |
| CI 运行日志 | GitHub Actions | 90天 |

---

## 五、灾难恢复

### 场景1: OpenProject 容器挂了

```bash
docker start openproject   # 数据在 Docker Volume，不会丢
```

### 场景2: 虚拟机崩溃/重建

```bash
# 1. 挂载NAS
sudo mount -a

# 2. 从最新备份恢复 pgdata
LATEST=$(ls -1d /mnt/nas/Projects/openproject/backups/*/ | sort | tail -1)
# pgdata volume: 5f61ba1582d7f50b87d14dd28b7376e5c1e23404315aae90d05e40133da03cf9
sudo cp -a $LATEST/pgdata /var/lib/docker/volumes/5f61ba1582d7f50b87d14dd28b7376e5c1e23404315aae90d05e40133da03cf9/_data/

# 3. 重新创建容器
docker run -d --name openproject -p 8080:80 \
  -v 5f61ba1582d7f50b87d14dd28b7376e5c1e23404315aae90d05e40133da03cf9:/var/openproject/pgdata \
  -v openproject_data:/var/openproject/assets \
  openproject/openproject:14
```

### 场景3: 换新电脑

```bash
# 1. 安装必要软件 (见下方软件清单)
# 2. clone 代码
git clone https://github.com/ScottWen2024/sea-fishing.git
cd sea-fishing && git checkout dev
# 3. 恢复 npm 依赖
cd fishingMNew && npm install --legacy-peer-deps
cd ../tests && npm install
# 4. 配置 API Keys (从本文档获取)
# 5. 恢复 OpenProject 虚拟机 (见场景2)
```

---

## 六、软件清单

### 开发机 (Windows) 必备

| 软件 | 用途 | 必装 |
|------|------|------|
| Git for Windows | 版本控制 | ✅ |
| GitHub Desktop | Git GUI | 可选 |
| Node.js (v20+) | 构建/测试 | ✅ |
| 微信开发者工具 | 小程序编译预览 | ✅ |
| Codex Desktop | AI 编程助手 | ✅ |
| PowerShell 7 | 命令行 | ✅ (系统自带) |

### Ubuntu VM 必备

| 软件 | 用途 | 必装 |
|------|------|------|
| Docker | OpenProject 容器运行时 | ✅ |
| cifs-utils | NAS SMB 挂载 | ✅ |
| rsync | 备份 | ✅ |
| cron | 定时备份 | ✅ |

---

## 七、密钥与凭证清单

| # | 名称 | 值 | 存储位置 | 风险 |
|---|------|-----|----------|------|
| 1 | GitHub Token | `****已撤销****` | ⚠️ 聊天记录 | 🔴 需撤销重生成 |
| 2 | OpenProject API Key | `f8918a130f0eefa0ece3c0f3013328ed117ee2a35d3c3ca6b8fd066ab67c1ec5` | OpenProject | 🟡 |
| 3 | 微信CI私钥 | `fishingMNew/ci-key/private.wx2c553cb44c3b5a4f.key` | `.gitignore` | 🟢 |
| 4 | 和风天气 Key | `c3cb514f98e5491d81cbd4a685298151` | 小程序代码内 | 🟡 |
| 5 | 高德地图 Key | `bb088961ee21fabcfd1fce9a3258fb27` | 小程序代码内 | 🟡 |
| 6 | VM SSH | scottwen/1, sudo=1 | 本地VM | 🟢 |
| 7 | NAS 凭据 | scottwen/u{zCg0} | `/root/.nas_credentials` | 🟢 |
| 8 | OpenProject 登录 | scottwen/marval@123 | Web | 🟢 |

> 🔴 GitHub Token 已在聊天中泄露，须尽快到 GitHub Settings → Developer settings → Tokens 撤销并生成新的。

---

## 八、项目文档索引

| 文档 | 内容 |
|------|------|
| `PRD.md` | 产品需求文档 |
| `ARCHITECTURE.md` | 系统架构 |
| `DEV_GUIDE.md` | 开发指南 |
| `ENVIRONMENTS.md` | 多环境管理 (H5/UAT/生产) |
| `DEPLOY.md` | 部署指南 |
| `TESTING.md` | 测试说明 |
| `TEST_PLAN.md` | 测试计划 |
| `MAINTENANCE.md` | 维护手册 |
| `ARCHIVE_NAS_OpenProject.md` | NAS+OpenProject部署记录 |
| `SETUP_MEMORY.md` | VM/OpenProject配置记忆 |
| `AUTO_SETUP.md` | 自动化基础设施配置 |
| `NEXT_SESSION.md` | 下次会话上下文 |
| `CI_ENVIRONMENT.md` | 📍本文档 |

---

## 九、与行业标准CI的差距

| # | 差距 | 严重度 | 状态 |
|---|------|--------|------|
| 1 | GitHub Actions CI 跑通 | 🔴 | 本地已修复，待push |
| 2 | Husky PATH问题 | 🟡 | 待修复 |
| 3 | 无 commitlint | 🟡 | 待配置 |
| 4 | E2E 自动化 (仅手动50%) | 🟡 | 待实现 |
| 5 | 无分支保护规则 | 🟢 | 待配置 |
| 6 | 无 Release tag/changelog | 🟢 | 待配置 |
| 7 | 微信小程序 CI 自动化 | 🟡 | 待配置 (miniprogram-ci) |
| 8 | OpenProject ↔ GitHub 双向同步 | 🟡 | 待实现 |
| 9 | 无 staging 环境 | 🟢 | 待设计 |
| 10 | 无性能测试 | 🟢 | 待规划 |

---

## 十、快速参考命令

```bash
# === 本地开发 ===
cd "D:\Codex\Fishing\Fishing project"
git status
git push origin dev

# === 代码检查 ===
cd fishingMNew && npx eslint pages/ --ext .js
cd fishingMNew && npx prettier --check pages/

# === 测试 ===
cd tests && npx jest --verbose --coverage

# === VM 操作 ===
ssh -p 4444 scottwen@127.0.0.1
# 查看 OpenProject 容器
docker ps --filter name=openproject
# 手动备份
sudo /usr/local/bin/backup-openproject.sh
# 查看备份
ls -la /mnt/nas/Projects/openproject/backups/

# === OpenProject 快速查询 ===
ssh -p 4444 scottwen@127.0.0.1 "/usr/local/bin/op-query.sh full 20"
```

---

## 附录：CI 搭建 Skill

本项目的 CI 环境可通过 `ci-setup` Skill 自动搭建和恢复。

**Skill 位置**: `~/.codex/skills/ci-setup/`

**使用方法**：对 Codex 说以下任一关键词即可触发：
- "搭建CI" / "恢复CI" / "重建环境" / "CI标准" / "补齐CI"

**Skill 内容**：
| 文件 | 内容 |
|------|------|
| `SKILL.md` | 主入口，12 阶段概览，触发规则 |
| `references/checklist.md` | 12 阶段执行清单（核心） |
| `references/project-template.md` | 项目变量表 |
| `references/templates-ci.yml.md` | GitHub Actions workflow 模板 |
| `references/tool-catalog.md` | 行业标准工具选型 |
| `references/disaster-recovery.md` | 灾难恢复流程 |
| `scripts/collect-ci-info.py` | CI 环境信息自动采集脚本 |
