#!/bin/bash
# OpenProject 快速恢复脚本
# 用法: sudo bash recover-openproject.sh

set -e

BACKUP_BASE=/mnt/nas/Projects/openproject/backups
PGDATA_VOL=/var/lib/docker/volumes/5f61ba1582d7f50b87d14dd28b7376e5c1e23404315aae90d05e40133da03cf9/_data
ASSETS_VOL=/var/lib/docker/volumes/openproject_data/_data
CONTAINER_NAME=openproject
IMAGE=openproject/openproject:14

echo "[1/5] Checking NAS..."
if ! mountpoint -q /mnt/nas/Projects; then
    echo "NAS not mounted, attempting..."
    mount -a || { echo "NAS mount failed"; exit 1; }
fi

echo "[2/5] Finding latest backup..."
LATEST=$(ls -1d $BACKUP_BASE/*/ 2>/dev/null | sort | tail -1)
if [ -z "$LATEST" ]; then
    echo "No backup found!"
    exit 1
fi
echo "  Using: $LATEST"

echo "[3/5] Stopping container..."
docker stop $CONTAINER_NAME 2>/dev/null || true

echo "[4/5] Restoring data..."
rm -rf $PGDATA_VOL/* $ASSETS_VOL/*
cp -a $LATEST/pgdata/. $PGDATA_VOL/
cp -a $LATEST/assets/. $ASSETS_VOL/
echo "  Restored pgdata + assets"

echo "[5/5] Starting container..."
docker start $CONTAINER_NAME 2>/dev/null || \
    docker run -d --name $CONTAINER_NAME -p 8080:80 \
        -v 5f61ba1582d7f50b87d14dd28b7376e5c1e23404315aae90d05e40133da03cf9:/var/openproject/pgdata \
        -v openproject_data:/var/openproject/assets \
        $IMAGE

sleep 5
echo "Health check: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:8080)"
echo "Recovery complete: $(date)"
