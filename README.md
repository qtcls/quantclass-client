# License Summary / 许可证摘要

**EN**
This repository is released under **Business Source License 1.1 (BUSL-1.1)** with parameters:

- **Licensor:** 量化小讲堂
- **Licensed Work:** quantclass-client
- **Additional Use Grant:** None (no production use granted)
- **Change Date:** 2028-08-22
- **Change License:** GPL-3.0-or-later

You may **read, review, and test locally in non‑production** for audit and evaluation. **Production use, SaaS/hosting, redistribution, or releasing derivatives** is **not permitted** before the Change Date unless you obtain a **commercial license** from the Licensor. On the Change Date, this work automatically re-licenses under GPL-3.0-or-later.

**中文**
本仓库依 **BUSL-1.1** 授权，参数如下：

- **权利人：** 量化小讲堂
- **作品：** quantclass-client
- **附加使用授权：** 无（不授予任何生产用途）
- **转换日期：** 2028-08-22
- **转换许可证：** GPL-3.0-or-later

你可以**阅读代码、进行代码审计与本地非生产测试**；在转换日期前，**生产用途/托管服务/再分发/发布派生作品**均需另行获得**商业授权**。转换日期后将自动转为 GPL-3.0-or-later。

See the full license text at: https://mariadb.com/bsl11/

# Quantclass Client Use Brief

- Using pnpm instead of npm
- `pnpm install` to add all the dependencies and pay attention to the network. Downloading electron consumes a lot and sometimes blocked under some networks.
- `pnpm dev:win` to start
- `pnpm build:win` to build. Please notice the windows policy over the program, security will block the build process. Use Power shell cmd `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` to bypass.

## 🛟 VERY USEFUL TIP

**IF YOU FAILED ON BUILD, **

1. LIKELY THE NETWORK PROBLEM. USE MAGIC AND YOU WILL BE FINE
2. SHUTDOWN ANI-VIRUS SOFTWARES INCLUDING THE "Windows Defender"
3. CLEAN NSIS CACHE
4. OR CONSIDER RESTART YOUR COMPUTER, MAGIC HAPPENS SOMETIMES

IF STILL FAILED ON WINDOWS, AND SEE ERR WITH `!include` TRY FOLLOWING:

- WIN+R -> gpedit.msc
- Navigate to `Computer Configuration > Administrative Templates > System > Filesystem`
- Double-click on "Enable Win32 long paths" and set it to Enabled.
- **DELETE `node_modules`**
- THEN REBOOT YOUR WIN
