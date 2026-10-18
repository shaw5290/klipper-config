# Klipper 打印机配置

CoreXY 三 Z（Trident 式）打印机的 Klipper 配置，支持单热端和多热端两种机型，按模块拆分、可拔插。

## ⚠️ 适用硬件

**本配置是按下面这台机器的硬件写的，不是通用配置。** 引脚、方向、电流、行程、坐标、校准数据都对应这套硬件；换成其它主板、工具头、探针或机械结构时，不能直接使用，需要按实物逐项修改（见下方「其它硬件怎么用」）。

### 整机

| 项目 | 规格 | 说明 |
|---|---|---|
| 结构 | CoreXY，三 Z 丝杆升降热床（Trident 式） | `kinematics: corexy`，三点调平 `[z_tilt]` |
| 行程 | X 0～290，Y 0～300，Z -3～250 | X、Y 限位在最大端（`homing_positive_dir: true`）；多头时 Y 允许负值（停靠坞在热床前方） |
| 热床 | 约 300×300，加热 PA10，热敏 Generic 3950（PC2），最高 120°C | |
| 上位机 | Klipper + Moonraker + Fluidd / Mainsail，CAN 网络 | |

### 电子部分

| 部件 | 型号 / 规格 | 连接 | 用途 |
|---|---|---|---|
| 主板 | TGL 主板，STM32F446（配置注释中为 TGL-Can6） | CAN（也可 USB） | X/Y/Z/Z1/Z2 五路 TMC2209（UART），热床 |
| 工具头板 | TGL36V3.0 CAN 板，STM32F072 | CAN | 挤出机 TMC2209、模型风扇、喉管风扇、RGB、X 限位（PA3）、仓温 NTC 10K（PB0）、LIS2DW 加速度计（SPI2） |
| 涡流探针 | 小螃蟹扫床线圈，LDC1612，40MHz 晶振，线圈频率约 5.6～6.3MHz | 工具头板软件 I2C（PB6/PB7） | Z 虚拟限位、三点调平、网床；探针在喷嘴后方 20mm（`y_offset: 20`） |
| 多热端扩展板（仅多头） | 通用多热端板，STM32F072，8 路热端（T0～T7）+ 8 路停靠坞风扇 | USB | 各热端加热与热敏、停靠坞风扇 |
| 对刀线圈（仅多头） | 小螃蟹涡流对刀模块，LDC1612，线圈频率约 2.29MHz | 主板软件 I2C（PA8/PC9） | 测各热端 XY 偏移 |

### 机械与打印头

| 部件 | 规格 |
|---|---|
| XY 传动 | 2GT 20 齿同步轮（`rotation_distance: 40`），32 细分 |
| Z 传动 | 64:16 减速（`gear_ratio: 64:16`，`rotation_distance: 32`），32 细分 |
| 挤出机（单头） | BMG 式 50:10 减速，`rotation_distance: 22.23`，16 细分 |
| 热端（单头） | 加热与热敏（Generic 3950）接工具头板 |
| 换头机构（仅多头） | CxChanger 磁吸停靠坞，当前 2 个热端（T0、T1），共用工具头上的挤出机电机 |

### 需要的软件修改与插件

| 项目 | 用于 |
|---|---|
| 修改 `klippy/extras/ldc1612.py`：`REG_ERROR_CONFIG` 的 `0x1f` 改为 `0x1c`，`SETTLETIME` 由 0.005 改为 0.0002 | 涡流探针（见 `modules/probe/eddy_tgl36v3.cfg` 开头注释） |
| klipper-multitool-stats 插件 | 多头：`[multitool]`、换头命令、M104/M109 覆写 |
| tool_eddy_calibration 插件（https://github.com/chengxg/tool_eddy_calibration） | 多头：涡流对刀 |

### 验证状态

| 部分 | 状态 |
|---|---|
| 单头：XYZ 运动、涡流探针、三点调平、网床 | ✅ 已在本机验证（网床差值 0.07mm，见 `docs/热床倾斜调试与修复记录.md`） |
| 多头：对刀线圈 XY 扫描 | ✅ 已验证（重复精度约 0.004mm） |
| 多头：tap 测 Z、`CALIBRATE_TOOL` 一键对刀 | ⏳ 调试中（tap 阈值待确定） |
| 多头：停靠坞坐标、Y 负值行程（`position_min: -30`） | ⏳ 待实测 |
| 无限位开关归零、其它主板 / 工具头 | ❌ 未提供、未验证 |

### 其它硬件怎么用

- **板子不同**：重写对应模块里的所有引脚（step/dir/enable、UART、加热、热敏、风扇、限位、I2C/SPI），并填写自己的 `canbus_uuid` / `serial`。
- **机械不同**：修改 `rotation_distance`、`gear_ratio`、细分、行程（`position_min/max/endstop`）、电机方向和电流。
- **探针不同**：替换 `modules/probe/` 模块，同时修改调平测点、网床范围，并删除 SAVE_CONFIG 里的涡流数据块。
- **校准数据**：PID、涡流高度曲线、tap 阈值、网床、对刀偏移、`z_positions`、停靠坞坐标都是本机实测值，换机器必须重新校准。
- 新机器建议先用 `debug/printer.cfg` 改好引脚，把运动和调平调通，再迁移到模块化配置。

## 目录

| 路径 | 说明 |
|---|---|
| `config/` | 打印机配置，整个目录部署到 `~/printer_data/config/` |
| `config/README.md` | 模块结构、拔插规则、依赖关系、部署前注意事项 |
| `debug/printer.cfg` | 单文件调试配置：XYZ 运动、调平、简单打印头，新机器先调通运动用 |
| `docs/新机器配置指南.md` | 新机器从零开始的配置与校准步骤 |
| `docs/多头配置指南.md` | 从单头切换为多头（2 个打印头为例）：要改的配置、实测项、调试步骤 |
| `docs/热床倾斜调试与修复记录.md` | 热床网床前后倾斜问题的排查与修复记录 |

## 快速开始

0. 把 `config/` 目录里的**全部内容**（包括 `modules/` 文件夹）复制到打印机的 `~/printer_data/config/`，`modules/` 要和 `printer.cfg` 在同一层：
   ```bash
   cp -r ~/printer-config/config/. ~/printer_data/config/
   ```
   不要用 Mainsail/Fluidd 网页上传（不会上传文件夹）。详见 `docs/新机器配置指南.md` 第 1 步。
1. 在 `config/printer.cfg` 中选择机型：`profile_singletool.cfg`（单热端）或 `profile_multitool.cfg`（多热端）。
2. 在对应的机型清单文件里，按实际硬件增减模块。
3. 部署前，把打印机当前 `printer.cfg` 末尾的 SAVE_CONFIG 数据块替换到 `config/printer.cfg` 最底部。

## 历史

旧的未拆分配置（`config-global/`、旧 `config/`、`printer_merged.cfg`、`config_merged.md`、配置备份 zip）已从仓库删除，可在提交 `d345fa9` 中找回：

```
git show d345fa9:printer_merged.cfg
git checkout d345fa9 -- config-global/
```
