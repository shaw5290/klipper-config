# 模块化 Klipper 配置（单热端 / 多热端）

把单头、多头配置拆成可拔插的模块：
- 两种机型共用同一批基础模块，各自用一个"机型清单"文件列出要引用的模块。
- 更换某个部件：只替换对应模块的 include。
- 不需要某个功能：注释掉对应的 include。依赖它的宏会自动跳过该步骤，不会报错。

内容来源（旧文件已从仓库删除，可在提交 `d345fa9` 中找回）：单头以最新的 `printer_merged.cfg` 为准（包含热床倾斜调试的全部修复，也就是 `config_merged.md` 的内容加上后续修改）；多头部分来自 `config-global/multitool`。

## 目录结构

```
config/
├── printer.cfg                  # 根文件：选择机型 + 最底部的小螃蟹 SAVE_CONFIG 数据
├── profile_singletool.cfg       # 机型清单：单热端
├── profile_multitool.cfg        # 机型清单：多热端
├── moonraker.conf
├── myvariables.cfg              # 多热端插件的持久化变量文件
└── modules/
    ├── core/                    # 基础（必需）
    │   ├── mainboard.cfg        # 主板 MCU、运动学、X/Y 步进与驱动、safe_z_home
    │   ├── z_trident.cfg        # 三 Z 丝杆与驱动（不含 Z 限位）
    │   ├── heater_bed.cfg       # 热床
    │   └── common.cfg           # SD 卡、对象排除、暂停恢复、RESPOND、强制移动
    ├── toolhead/
    │   └── tgl36v3.cfg          # TGL36V3 工具头：MCU、X 限位、挤出机驱动、风扇、RGB、加速度计
    ├── extruder/
    │   └── tgl36v3_single.cfg   # 单头挤出机与热端
    ├── probe/                   # 探针 / Z 限位（二选一）
    │   ├── eddy_tgl36v3.cfg     # 涡流探针 + Z 虚拟限位 + 涡流校准宏
    │   └── z_endstop_switch.cfg # Z 物理限位开关（PA0）
    ├── leveling/
    │   ├── z_tilt.cfg           # 三点调平 + Z_TILT_ADJUST 宏
    │   └── bed_mesh.cfg         # 网床 + BED_MESH_CALIBRATE 宏
    ├── macros/
    │   ├── print.cfg            # PRINT_START
    │   └── maintenance.cfg      # 塞尺测试 PAPER_TEST_PREP / PAPER_TEST
    └── multitool/               # 多热端专用
        ├── multihotend.cfg      # 扩展板 MCU、引脚别名、停靠坞风扇、T0 挤出机、T1..T7 热端
        ├── multitool_plugin.cfg # 切换插件主配置、M104/M109 覆写、偏移与统计
        ├── changer_cxchanger.cfg# 换头方案 CxChanger（停靠坞参数、动作、插件钩子）
        └── tool_calibrate_eddy.cfg # 多热端偏移校准（涡流对刀）
```

## 部署

把本目录的**全部内容**复制到打印机的 `~/printer_data/config/`。`modules/` 必须和 `printer.cfg`、`profile_*.cfg` 在同一层，否则启动会报 `Include file '.../modules/core/mainboard.cfg' does not exist`。

```bash
cp -r ~/printer-config/config/. ~/printer_data/config/
ls ~/printer_data/config/modules/core/    # 应看到 mainboard.cfg 等文件
```

- 不要用 Mainsail / Fluidd 网页上传，网页不会上传 `modules/` 文件夹
- 源路径末尾的 `/.` 不能少，否则会多套一层 `config/config/`
- 不要用 `sudo` 复制；如果已经用了，执行 `sudo chown -R klipper:klipper ~/printer_data/config`

## 切换机型

在根目录 `printer.cfg` 里二选一：

```
#单热端
[include profile_singletool.cfg]

#多热端
# [include profile_multitool.cfg]
```

## 模块依赖与拔插规则

| 模块 | 依赖 | 拔掉后的影响 |
|---|---|---|
| core/* | — | 基础模块，必须引用 |
| core/z_trident.cfg | 一个 Z 限位模块 | 本模块不含 `endstop_pin`，必须在 probe/ 里二选一 |
| toolhead/tgl36v3.cfg | 一个提供 `[extruder]` 的模块 | X 限位自动回到主板 `^!PC3`；所有 `toolhead:` 引脚不再被引用 |
| extruder/tgl36v3_single.cfg | toolhead | 仅单头使用；多头的 `[extruder]` 由 multihotend.cfg 提供 |
| probe/eddy_tgl36v3.cfg | toolhead | 必须换成 `z_endstop_switch.cfg`，**并删除根目录 printer.cfg 底部 SAVE_CONFIG 里的 `[probe_eddy_current eddy_probe]` 数据块**，否则启动报错 |
| probe/z_endstop_switch.cfg | — | 和涡流探针二选一 |
| leveling/z_tilt.cfg | 一个探针 | PRINT_START、PAPER_TEST_PREP 自动跳过调平 |
| leveling/bed_mesh.cfg | 一个探针 | PRINT_START 自动跳过扫床；Z_TILT_ADJUST 等宏自动跳过 BED_MESH_CLEAR |
| macros/* | — | 对应命令不可用 |
| multitool/multihotend.cfg | toolhead | 多头必需 |
| multitool/multitool_plugin.cfg | multihotend、一个换头方案模块 | 多头必需 |
| multitool/changer_cxchanger.cfg | multitool_plugin | 更换换头方案时，只换这一个文件（新方案需要提供 `multitool_release_tool` / `multitool_pickup_tool` 两个钩子宏） |
| multitool/tool_calibrate_eddy.cfg | multitool_plugin、eddy 探针 | 校准命令不可用，其它功能不受影响 |

宏的自动判断方式：
- 调平、网床宏用 `printer.configfile.settings` 判断有没有涡流探针：有就用快速扫描，没有就用标准方式。
- PRINT_START 等宏用 `'z_tilt' in printer`、`'bed_mesh' in printer` 判断对应模块是否已引用。

## 小螃蟹 SAVE_CONFIG 数据

`# 小螃蟹Z涡流调平...` 和下面的 SAVE_CONFIG 数据块必须放在**根目录 printer.cfg 的最底部**，下面不能再加任何内容。Klipper 只会读写根目录 printer.cfg 末尾的这块数据。

## 与原配置相比的改动

经过脚本校验：按 Klipper 规则展开 include、合并同名段后，两种机型的硬件配置（引脚、电机、加热、风扇、探针）与原配置完全一致。差异只有下面这些有意的改动。

**单头（对比 `printer_merged.cfg`）**
- 去掉了多头专用的对刀校准宏（`CALIBRATE_TOOL`、`DO_CALIBRATE_TOOL`、`_DO_SAVE_CALIB_RESULT`、`CALIBRATE_ALL_TOOLS`）。这些宏需要多热端插件，在单头上本来就无法运行；现在放在 `multitool/tool_calibrate_eddy.cfg` 里。
- `Z_TILT_ADJUST`、`BED_MESH_CALIBRATE`、`PRINT_START`、`PAPER_TEST_PREP`、`PROBE_EDDY_CURRENT_CALIBRATE_AUTO` 加了模块判断，引用了全部模块时行为和原来一致。

**多头（对比 `config-global/multitool`），以最新的修复为准**
- `[z_tilt] points` 后测点：`150, 260` → `150, 200`（避开热床后边缘涡流干扰）
- `[z_tilt] z_positions`：改用单头已验证的值 `-6.5,-2 / 150,350 / 335,-2`（原多头为 `-50,18 / 150,345 / 350,18`）
- `[bed_mesh] mesh_max`：`275, 275` → `275, 260`
- `[bed_mesh] probe_count`：`9, 9` → `7, 7`（与单头一致）
- 调平粗调高度 `horizontal_move_z` 8 → 4
- `PROBE_EDDY_CURRENT_CALIBRATE_AUTO`：`G1 X20 Y20` → `G1 X20 Y40`（修复 ACCEPT 时超行程）
- `PRINT_START` 加入调平和扫床；新增塞尺测试宏

**整理与去重**
- 多头 printer.cfg 里重复的整段 TMC 驱动配置只保留一份
- `[virtual_sdcard]` 重复的 `path` 只保留实际生效的 `~/printer_data/gcodes`
- `[display_status]`、`[force_move]`、`[respond]` 重复定义只保留一份
- 两个 `CALIBRATE_ALL_TOOLS` 只保留实际生效的后一个
- `[heater_fan hotend_fan]` 只在工具头模块定义（多头扩展板模块里原来的重复定义已去掉，合并后的生效值不变）
- 多热端的换头钩子宏从插件配置移到换头方案模块
- Z 限位 `endstop_pin` 从 `stepper_z` 移到探针模块；X 限位默认改为主板 `^!PC3`，由工具头模块覆盖为 `^toolhead:PA3`（生效值不变）

## 使用前请确认

1. **SAVE_CONFIG 数据要用打印机上最新的。** 根目录 printer.cfg 底部的数据是从 `printer_merged.cfg` 复制的。打印机上后来又重新校准过涡流并 `SAVE_CONFIG`（23:22），部署前请把打印机当前 printer.cfg 末尾的 SAVE_CONFIG 块整段替换过来。
2. **多头的 `z_positions`**：已改用单头的值。如果多头机器的丝杆位置确实不同，请在 `modules/leveling/z_tilt.cfg` 中改回。
3. **多头的工具数量不一致**（保留原值，未修改）：`[multitool] tool_count: 2`，热端定义了 T0..T7 共 8 个，`_TOOL_CALIB_VARS tool_count: 8`，停靠坞坐标有 t0..t8 共 9 组。请按实际热端数量统一。
4. **多热端插件的安装脚本**（install.sh）默认把文件放在 `~/printer_data/config/multitool/`。以后更新插件时，注意不要让它覆盖或重新引用旧路径。
5. **未迁移的内容**：`temp-test` 测试配置、未被引用的旧文件（`singletool/toolhead.cfg`、`eddy_probe_z.cfg`、`xy对刀.cfg`）没有迁移，已从仓库删除，需要时可从提交 `d345fa9` 的 `config-global/` 中找回。
6. **调试状态**：`PRINT_START` 里的热床和喷头升温仍是注释状态（调试阶段），正式打印前请取消注释。
