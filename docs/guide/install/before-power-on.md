# 3. 首次上电前的设置

配置里有几处调试时放宽的设置，新机器首次上电前要改回来。

## 热端温度保护

- **单头** `modules/extruder/tgl36v3_single.cfg`：`min_extrude_temp:-119` 允许冷挤出，改为 `170`；`min_temp:-120` 改为 `0`。
- **多头** `modules/multitool/multihotend.cfg`：T0..T7 是 `max_temp: 9999`、`min_temp: -210`，等于关闭了过热和热敏断线保护。改为 `max_temp: 300`（按热端实际上限）、`min_temp: 0`。没装的热端把对应的 `[extruderN]` 和停靠坞风扇段注释掉，不要靠放宽温度范围绕过报错。

## 开机自动标记已归零

`modules/core/common.cfg` 里的 `[delayed_gcode KINEMATIC_POSITION]` 开机后会执行 `SET_KINEMATIC_POSITION`，不归零也能移动，但坐标是错的，新机器上容易撞机。调试期间把这一段整段注释掉。

## 多头热端数量（仅多头）

把下面三处统一成实际热端数量，多余的 `[extruderN]` 段和对应风扇段注释掉：

- `[multitool] tool_count`
- 热端定义的个数（`[extruder]`..`[extruderN]` 及停靠坞风扇）
- 对刀校准里的 `_TOOL_CALIB_VARS variable_tool_count`

## 检查接线

上电前对照板子丝印检查一遍，下面这些本机调试时都出过问题：

| 项目 | 检查什么 | 插错的表现 |
|---|---|---|
| 加热棒 / 热敏 | 插座不要互换 | 温度读数异常、加热失控 |
| 风扇 | 红线插 `+`，黑线插 `−`；模型风扇和喉管风扇不要互换 | `M106 S255` 风扇不转，打印件侧壁发糊 |
| 风扇电压 | 风扇电压和板子输出电压（5V / 12V / 24V 跳线）一致 | 不转或烧风扇 |

插拔任何插头前先断电，带电插拔可能打坏板子上的 MOS 管。
