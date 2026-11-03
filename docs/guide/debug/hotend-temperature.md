# 多热端温度调试

仅多头机型。T0～T7 的加热棒和热敏都接在多热端扩展板上（`multihotend:T{n}H` / `multihotend:T{n}S`），配置在 `modules/multitool/multihotend.cfg`。

按顺序做：先确认读数和接线，再统一功率、做 PID，最后测预热时间。每个热端都要做一遍。

::: tip 第一次调试
先看 [新手必读：调试的基本操作](/guide/basics)：命令在哪里输入、怎么改配置和重启、急停在哪、移动命令怎么看。
:::

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
| 读数在 -30～-45°C 左右 | 这一路没接热敏（本机 T2～T7）。只有 `min_temp: -210` 时才不报错；装了热端的必须改成 0 |
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
| 报 `Heater extruder1 not heating at expected rate` | 见下面[加热异常停机排查](#heater-fault) |

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

## 加热异常停机排查 {#heater-fault}

报错 `Heater extruderN not heating at expected rate ... Printer is shutdown`：Klipper 每隔一段时间检查温度涨了多少，涨得太慢就停机。这是安全保护，**不要为了不报错去放宽或关闭 `verify_heater`**。

### 1. 看停机前的温度和功率

下面的命令要在打印机的 **SSH 终端**执行（`ssh klipper@<打印机IP>`）。在 Mainsail / Fluidd 控制台里输入会报 `Unknown command:"GREP -"`。不方便 SSH 时，从网页下载 `klippy.log`（Mainsail：机器页 → 日志；Fluidd：配置页 → logs）。

```
grep -B 120 "not heating at expected rate" ~/printer_data/logs/klippy.log | grep -oE "extruder[0-9]*: target=[^ ]* temp=[^ ]* pwm=[^ ]*" | tail -60
```

没有输出时，日志可能已轮换，把 `klippy.log` 换成 `klippy.log.1`。只用 `grep ... | tail -30` 看到的是重启后的记录（`target=0`），看不出问题，要用上面带 `-B 120` 的写法。

| 日志里看到的 | 说明 |
|---|---|
| `pwm` 顶在 `max_power`，温度基本不动 | 加热棒没在加热：线断了、插头松了、插错口，或扩展板该口没输出 |
| `pwm` 顶在 `max_power`，温度慢慢涨 | 功率不够（`max_power` 太低），或风扇吹走了热量 |
| 温度在往下掉 | 坞风扇或模型风扇对着加热块吹 |
| 温度忽高忽低跳变 | 热敏接触不良 |
| 加热这一路时，另一路 `target=0` 的温度却在涨 | 加热棒插错口，热量加到了那个热端上 |

### 2. 断电量加热棒电阻

关电源，拔下扩展板上对应 `TnH` 口的插头，量两根线之间的电阻：

| 读数 | 说明 |
|---|---|
| 约 11～15 Ω（24V 40～50W） | 加热棒和线是好的，问题在插头或扩展板。把两个热端的加热插头对调，看问题跟着加热棒走还是跟着口走 |
| 无穷大（OL） | 断路。弯一弯靠近热端和拖链的那段线，看读数会不会时有时无；找不到断点就换加热棒 |
| 接近 0 | 短路，换加热棒 |

### 3. 晃线测试（时好时坏时）

```
SET_HEATER_TEMPERATURE HEATER=extruder1 TARGET=60
```

到温后用手轻轻晃靠近热端和拖链那段线，看温度曲线。一晃温度就掉，就是这段线或插头接触不良。测完 `SET_HEATER_TEMPERATURE HEATER=extruder1 TARGET=0`。

### 本机记录（2026-11-04，T1）

执行 `CALIBRATE_ALL_TOOLS` 时停机。这个宏一开始会把所有工具预热到 150°C，日志里 `extruder`（T0）和 `extruder1`（T1）同时 `target=150`、`pwm=0.500`：

| 热端 | 温度变化 | 结论 |
|---|---|---|
| `extruder`（T0） | 104 → 128°C，约 4°C/s | 正常 |
| `extruder1`（T1） | 20 多秒一直 23°C | 加热棒没有出热 |
| `extruder2`～`7` | -30～-45°C，`target=0` | 没接热敏，没有异常升温，排除插错口 |

T1 以前做过 PID，判断是反复进出坞时线或插头接触不良。之后重新运行 `CALIBRATE_ALL_TOOLS`，T1 正常加热到 150°C 并完成对刀，属于**时好时坏**，长时间打印前要做第 3 步晃线测试。

这次停机靠的是加热速率检查。如果断的是**热敏**，读数会变成 -35°C 左右，`min_temp: -210` 时 Klipper 不报错，加热棒却一直全功率加热，所以装好的热端必须用 `min_temp: 0`（见第 0 步）。

## 常见问题

| 现象 | 原因与处理 |
|---|---|
| `Heater extruderN not heating at expected rate` | 加热棒断线或接触不良、接错口、`max_power` 太低，或者风扇吹得太猛。见[加热异常停机排查](#heater-fault) |
| `ADC out of range` | 热敏断线或接触不良，检查插头和换头时会弯折的那段线 |
| 温度在目标上下 3～5°C 摆动 | PID 还是占位值，或者改过 `max_power` 后没重做 PID |
| 换头时停下来等温很久 | 预热时间不够（第 6 步），或者 Orca 没开 Ooze 自动预热 |
| 加热某一个，另一个也在升温 | 加热棒和热敏交叉接线（第 2 步） |
