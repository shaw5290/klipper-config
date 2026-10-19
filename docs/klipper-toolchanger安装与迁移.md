# klipper-toolchanger 离线安装与迁移说明

插件地址：https://github.com/viesturz/klipper-toolchanger

> 当前状态：**只做了离线安装的准备，配置仍使用 klipper-multitool-stats**。toolchanger 插件文件装进 Klipper 后，只要配置里没有 `[toolchanger]` / `[tool …]`，就不会生效，现有多头配置照常工作。

---

## 一、它和现在的多热端插件是什么关系

klipper-toolchanger 和现在用的 klipper-multitool-stats 都是换头插件，功能重叠，**只能二选一**：

- 两者都会注册 `T0`、`T1`… 命令；
- 两者都会覆盖 `M104` / `M109`。

所以"切换到 toolchanger"就是把 multitool 那一套整体替换掉（见第四节）。安装插件文件本身不影响现有配置。

## 二、安装脚本做了什么

官方 `install.sh` 只做三件事：

1. 把仓库下载到 `~/klipper-toolchanger`（**目录已存在就跳过下载**）
2. 把 `~/klipper-toolchanger/klipper/extras/*.py` 逐个软链接到 `~/klipper/klippy/extras/`
3. 重启 Klipper 服务

所以离线安装只要提前把仓库放到 `~/klipper-toolchanger`，再运行脚本即可。

插件文件（9 个）：`toolchanger.py`、`tool.py`、`tools_calibrate.py`、`tool_probe.py`、`tool_probe_endstop.py`、`rounded_path.py`、`manual_rail.py`、`multi_fan.py`、`bed_thermal_adjust.py`。

## 三、离线安装步骤

### 1. 准备离线包（能上网的电脑）

在 https://github.com/viesturz/klipper-toolchanger 点 **Code → Download ZIP**，或用 git 克隆。

本机已准备好的离线包：`D:\Users\shaw\Downloads\klipper-toolchanger.tar.gz`

- 由 `klipper-toolchanger-main.zip` 重新打包，共 67 个文件
- 顶层目录已经是 `klipper-toolchanger`，解压后不用改名
- `install.sh` 带执行权限（755）

> 用 Windows 直接打包时容易出错：本机最初的 `klipper-toolchanger.tar` 里只有一个空目录，插件文件一个都没有。打好包后先检查内容（见下面第 4 步）。

### 2. 上传到打印机

Windows PowerShell（`<打印机IP>` 换成实际地址）：

```powershell
scp D:\Users\shaw\Downloads\klipper-toolchanger.tar.gz klipper@<打印机IP>:/home/klipper/
```

### 3. 解压并安装（SSH）

```bash
cd ~
tar -tzf klipper-toolchanger.tar.gz | head       # 先看一眼：第一行应是 klipper-toolchanger/
tar -xzf klipper-toolchanger.tar.gz
cd klipper-toolchanger
./install.sh
```

- 脚本会提示 `repository already found locally`，跳过下载，然后链接文件、重启 Klipper。
- **不要用 `sudo` 运行**，脚本会拒绝以 root 执行，需要时它自己会调用 sudo。
- 如果是传的解压后文件夹（不是压缩包），先执行 `chmod +x install.sh`。

### 4. 确认安装成功

```bash
ls -l ~/klipper/klippy/extras/ | grep klipper-toolchanger
```

应看到 9 个 `.py` 文件，都链接到 `~/klipper-toolchanger/klipper/extras/`。

### 5. 安装后注意

| 事项 | 说明 |
|---|---|
| 不会马上生效 | 配置里写了 `[toolchanger]`、`[tool T0]` 等才会启用 |
| 先不要引用插件的 `macros.cfg` | 它覆盖 `M104` / `M109`，会和 `multitool_plugin.cfg` 里的覆盖冲突；正式切换时再一起替换 |
| 自动更新 | 只有 git 克隆的目录（带 `.git`）才能在 `moonraker.conf` 加 `[update_manager klipper-toolchanger]`；ZIP/压缩包安装没有 `.git`，加了会报错。离线环境更新时重复第 1～3 步 |
| 插件更新增加了新 `.py` 文件 | 需要重新运行一次 `./install.sh` 才会链接上 |
| 不要把插件源码放进本配置仓库 | 仓库根目录下的 `klipper-toolchanger/` 文件夹应移出或加入 `.gitignore` |

## 四、迁移计划（尚未执行）

切换到 toolchanger 时，要移除或替换的内容：

| 现在的内容 | 位置 | 换成 toolchanger 后 |
|---|---|---|
| `[multitool]`、`[multitool_offsets]`、`[multitool_stats]` | `multitool_plugin.cfg` | 删除，改为 `[toolchanger]` + 每个工具一个 `[tool T0]`、`[tool T1]` |
| `M104` / `M109` 覆写（`MULTITOOL_SET_TEMPERATURE`） | `multitool_plugin.cfg` | 删除，改用插件 `macros.cfg`（`SET_TOOL_TEMPERATURE`） |
| 钩子 `multitool_release_tool` / `multitool_pickup_tool` | `changer_cxchanger.cfg` | 删除，动作写进 `[toolchanger]` 的 `dropoff_gcode` / `pickup_gcode` |
| 停靠坞参数 `_multitool_cfg`（`tN_dock_x` 等） | `changer_cxchanger.cfg` | 改为每个工具的 `params_dock_x` / `params_dock_y`，公共参数用 `[toolchanger]` 的 `params_*` |
| 对刀结果 `SAVE_VARIABLE t1_offset_x` 等 | `tool_calibrate_eddy.cfg` | 改为工具的 `gcode_x/y/z_offset`，用 `SET_TOOL_PARAMETER` / `SAVE_TOOL_PARAMETER` 保存 |
| 对刀宏里的 `untool`、`SET_GCODE_OFFSET X=0 Y=0 Z=0` | `tool_calibrate_eddy.cfg` | 改为 `UNSELECT_TOOL`；插件 2025.12.26 起不再用 G-code 偏移实现工具偏移，清零要改用插件的方式（如 `ENTER_DOCKING_MODE`） |
| `[multitool_lane_data]` | `moonraker.conf` | 删除 |
| `tc_total_*`、`current_tool` | `myvariables.cfg` | 不再使用；插件有自己的 `save_current_tool` 选项 |
| 宏里判断 `'multitool' in printer` | `macros/print.cfg` | 改为 `'toolchanger' in printer` |

**共用挤出机电机**：插件源码中，工具的 `extruder_stepper` 只用于执行 `SYNC_EXTRUDER_MOTION EXTRUDER=<名称> MOTION_QUEUE=<热端>`，和现在 multitool 同步共用电机的方式相同。因此每个工具可以写 `extruder: extruderN` + `extruder_stepper: extruder`，不必把电机拆成独立的 `[extruder_stepper]`（待上机验证）。

**保持不变**：tool_eddy_calibration 对刀插件和线圈配置、涡流探针与 tap、调平、网床、热端 PID、风扇、CxChanger 的机械动作路径、`PRINT_START` 各步骤 / `PRINT_END` / `CANCEL_PRINT`（只改多头判断条件）。

**切换后可用的功能**：工具在位检测（`detection_pin`）、停靠坞对准模式（`ENTER_DOCKING_MODE` / `TEST_TOOL_DOCKING`）、不换头直接指定当前工具（`INITIALIZE_TOOLCHANGER TOOL_NAME=`）。

建议切换时把新配置写在单独的模块目录（如 `modules/toolchanger/`），在机型清单里切换，原 multitool 模块保留以便退回。
