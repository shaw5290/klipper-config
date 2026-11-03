# 多热端温度调试

仅多头机型。T0～T7 的加热棒和热敏都接在多热端扩展板上（`multihotend:T{n}H` / `multihotend:T{n}S`），配置在 `modules/multitool/multihotend.cfg`。

按顺序做：先确认读数和接线，再统一功率、做 PID，最后测预热时间。每个热端都要做一遍。

## 0. 先把温度保护打开

::: danger 没有温度保护的热端
`min_temp: -210`、`max_temp: 9999` 等于关掉温度保护：热敏断线时读数在 -35°C 左右，Klipper 不报错，加热棒却可能一直全功率加热，有烧毁热端甚至起火的风险。

当前状态（2026-11-04）：`[extruder]`（T0）、`[extruder1]`（T1）已改成 0 / 300；`[extruder2]`～`[extruder7]` 没接热敏，读数在 -30～-45°C，暂时保持 -210 / 9999，否则启动就会报错。
:::

每装好一个热端，就把它对应的 `[extruderN]` 改成：

```
min_temp: 0        # 热敏断线时读数会远低于 0，立即报错停机
max_temp: 300      # 按热端和喷嘴的安全上限填写
```

`[verify_heater extruderN]` 在文件末尾是注释状态，这是对的：Klipper 默认就会对每个加热器做加热速率检查，不需要也不要取消注释（里面的 `heating_gain: 0.001` 等测试值等于关掉检查）。

改完 `FIRMWARE_RESTART`。

## 1. 室温读数

冷机放置 30 分钟以上，在 Mainsail / Fluidd 温度面板看所有热端：

| 现象 | 原因 |
|---|---|
| 都在室温 ±2°C | 正常 |
| 某一路报 `ADC out of range` | 热敏断线、插头没插紧、`sensor_pin` 填错 |
| 读数远高于室温（几百度） | 热敏短路 |
| 读数稳定但和室温差 10°C 以上 | `sensor_type` 填错（不是 Generic 3950，比如是 PT1000 或 NTC 100K） |
| 读数跳变 | 插头或线材接触不良。换头时线会弯折，用手晃一下线看读数是否跟着跳 |

## 2. 加热棒和热敏的对应关系

加热棒插到 T1 口、热敏插到 T2 口这类交叉，在室温读数上看不出来，必须逐个加热确认。本机单头就出过加热棒和热敏插反的问题。

**一次只加热一个**，用原生命令，不经过换头宏：

```
SET_HEATER_TEMPERATURE HEATER=extruder1 TARGET=60
```

观察 30 秒：

| 现象 | 说明 |
|---|---|
| 只有 `extruder1` 读数上升，且摸得到是 T1 热端在变热 | 正确 |
| 上升的是别的热端（比如 `extruder2`） | 加热棒或热敏插错了口，对照扩展板丝印重插 |
| 读数不升，热端也不热 | 加热棒没接好或 MOSFET 损坏；`heater_pin` 填错 |
| 热端在变热，但读数不升 | 这一路热敏插到了别的口，或者 `sensor_pin` 填错 |
| 报 `Heater extruder1 not heating at expected rate` | 同上两种情况之一；也可能是 `max_power` 太低 |

测完关掉，换下一个：

```
SET_HEATER_TEMPERATURE HEATER=extruder1 TARGET=0
```

同时检查停靠坞风扇：`extruder1` 超过 50°C 时，应该是 T1 坞的风扇（`dock_fan_t1`）在转，不是别的坞。

## 3. 统一 max_power

当前 `extruder`、`extruder1` 是 `max_power: 0.5`，`extruder2`～`extruder7` 是 `0.9`。同型号的热端应该用同一个值：

- `max_power` 越低，加热越慢，第 6 步测出的预热时间越长。
- PID 是在某个 `max_power` 下测出来的，**改了 `max_power` 就要重新做 PID**。

确定一个值后，所有热端都改成它，再做下一步。

## 4. PID 校准

PID 要在和实际使用相同的条件下做：热端**挂在打印头上**，喉管风扇在转，模型风扇关闭。所以先换上要校准的热端：

```
G28
T1
M106 S0
PID_CALIBRATE HEATER=extruder1 TARGET=220
```

- `TARGET` 用常用打印温度。对刀用的 150°C 也要稳，如果 220°C 的 PID 在 150°C 摆动明显，再单独做一次 150°C 的。
- `extruder2`～`extruder7` 现在是安装脚本给的占位值（`pid_kp: 26.213`、`pid_ki: 1.304`、`pid_kd: 131.721`），必须校准。

::: warning 不能用 SAVE_CONFIG 保存
PID 写在被引用的模块文件里，`SAVE_CONFIG` 会报 `conflicts with included value`。把控制台输出的 `pid_Kp`、`pid_Ki`、`pid_Kd` 手动填进 `multihotend.cfg` 对应的段，注明条件和日期，然后 `FIRMWARE_RESTART`：
:::

```
pid_kp: 22.048   # T1 实测：PID_CALIBRATE HEATER=extruder1 TARGET=220（2026-11-04，max_power 0.9）
```

## 5. 稳定性验证

```
T1
M109 T1 S220
```

在温度曲线上观察 2 分钟：

- 挂在打印头上时，应稳定在目标 ±1°C 以内。
- `UNTOOL` 放回坞里后，坞风扇会吹热端，温度会掉一下再拉回来，最终也应在 ±1°C 以内。如果持续偏低或来回摆，检查坞风扇是不是正对着加热块吹。

`M109` 要等到目标 ±1.5°C 以内才会继续。PID 不准、温度一直在范围外摆动时，换头和对刀会卡在"等温中"。

## 6. 测预热时间（给 OrcaSlicer 用）

OrcaSlicer 的 Ooze 自动预热会在换头前提前加热下一个热端，提前多久由"预热时间"决定（见 [OrcaSlicer 多热端设置](/OrcaSlicer多热端设置)）。这个时间要按实测的加热速度填。

模拟待机状态（打印温度 220，软化温度 -180，待机就是 40°C，基本等于冷机）：

```
SET_HEATER_TEMPERATURE HEATER=extruder1 TARGET=0
```

等热端降到 40°C 左右，开始计时：

```
M109 T1 S220
```

记下从发出命令到 `M109` 返回的秒数，每个热端都测一次。预热时间取所有热端里最慢的那个，再加 5 秒左右的余量。上游 CxChanger 用的是 35 秒，`max_power` 低的话会更长。

打印后可以查 `myvariables.cfg` 里的 `tc_total_heat_wait`（换头时等温的累计秒数）：

- 一直在涨：预热时间不够，加长。
- 基本为 0，但坞里渗料多：预热时间太长，缩短。

## 常见问题

| 现象 | 原因与处理 |
|---|---|
| `Heater extruderN not heating at expected rate` | 接线错误（第 2 步）、`max_power` 太低，或者坞风扇吹得太猛 |
| `ADC out of range` | 热敏断线或接触不良，检查插头和换头时会弯折的那段线 |
| 温度在目标上下 3～5°C 摆动 | PID 还是占位值，或者改过 `max_power` 后没重做 PID |
| 换头时停下来等温很久 | 预热时间不够（第 6 步），或者 Orca 没开 Ooze 自动预热 |
| 加热某一个，另一个也在升温 | 加热棒和热敏交叉接线（第 2 步） |
