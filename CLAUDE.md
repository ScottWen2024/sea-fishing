# 海钓通 — Claude 项目指令

每次打开此项目，自动执行：

1. 读取 `C:\Users\wengh\.claude\projects\D--Fishing-project\memory\next_session.md`
2. 读取 `C:\Users\wengh\.claude\projects\D--Fishing-project\memory\project_status.md`
3. 读取 `D:\Fishing project\.sync-rules`

如果这些文件不存在，提示用户。

改代码时遵守：
- H5 和小程序两端同步（规则见 .sync-rules）
- WXML 中 {{}} 内不能有 ;
- 配色使用 Deep Waters 海事调色板（主色 #0F4F67）
- 改完后更新 checklist.md 并 git commit
