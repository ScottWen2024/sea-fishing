# OpenProject 虚拟机环境配置备忘录

## 虚拟机连接
- SSH: `ssh -p 4444 scottwen@127.0.0.1`
- 用户: `scottwen`
- sudo 密码: `1`
- 系统: Ubuntu 24.04 (Linux Fishing)
- 内网 IP: 10.0.2.15 (NAT)

## NAS 挂载
- NAS IP: `192.168.1.14`
- 共享路径: `\\ScottNas\Notes\Projects`
- 挂载点: `/mnt/nas/Projects`
- SMB 版本: `vers=2.0`
- 凭据文件: `/root/.nas_credentials` (权限 600)
- 开机自动挂载: 已写入 `/etc/fstab`

## NAS 凭据
- 用户名: `scottwen`
- 密码: 存于 `/root/.nas_credentials`

## OpenProject 容器
- 容器名: `openproject`
- 镜像: `openproject/openproject:14`
- 端口: `8080 → 80`
- 数据卷:
  - pgdata: `5f61ba1582d7f50b87d14dd28b7376e5c1e23404315aae90d05e40133da03cf9` → `/var/openproject/pgdata`
  - assets: `openproject_data` → `/var/openproject/assets`
- PostgreSQL 不能直接存在 CIFS/NAS 上（权限问题），数据保留在本地 Docker Volume

## 备份
- 脚本: `/usr/local/bin/backup-openproject.sh`
- 方式: rsync 增量快照 + `--link-dest` 硬链接去重
- NAS 路径: `/mnt/nas/Projects/openproject/backups/`
- 频率: 每 6 小时（cron: `/etc/cron.d/openproject-backup`）
- 保留: 最近 7 份
- 日志: `/var/log/openproject-backup.log`

## 恢复步骤
### 容器崩了
```bash
docker start openproject
```

### 虚拟机崩了/迁移
```bash
# 1. 挂载 NAS
sudo mount -a
# 2. 从最新备份恢复
LATEST=$(ls -1d /mnt/nas/Projects/openproject/backups/*/ | sort | tail -1)
sudo cp -a $LATEST/pgdata /var/lib/docker/volumes/xxx/_data/
# 3. 启动容器
docker run -d --name openproject -p 8080:80 \
  -v <pgdata_vol>:/var/openproject/pgdata \
  -v openproject_data:/var/openproject/assets \
  openproject/openproject:14
```

## 常用命令
```bash
# 查看容器状态
docker ps --filter name=openproject

# 查看备份日志
tail -50 /var/log/openproject-backup.log

# 手动执行备份
sudo /usr/local/bin/backup-openproject.sh

# 查看 NAS 备份
ls -la /mnt/nas/Projects/openproject/backups/

# 查看 NAS 挂载状态
df -h /mnt/nas/Projects
```
