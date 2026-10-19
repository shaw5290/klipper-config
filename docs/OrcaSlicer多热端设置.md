# OrcaSlicer 多热端设置

本文对应 `config/modules/macros/print.cfg` 中的 `PRINT_START` 宏，以 2 个热端（T0、T1）为例。热端数量不同时，按同样的规律增减。

> 前提：多头配置已调通（换头、PID、一键对刀），见 `docs/多头配置指南.md`。

---

## 一、打印机设置

### 1. 基本设置

| 项目 | 设置 |
|---|---|
| G-code 风格 | Klipper |
| 挤出机数量 | **2**（按实际热端数量填写，和 `[multitool] tool_count` 一致） |
| 标记对象（Label objects） | 开启（配合 `[exclude_object]`，可在打印中取消单个模型） |

### 2. 起始 G-code

打印机设置 → 机器 G-code → **起始 G-code**，**整段替换**为（2 个热端）：

```
PRINT_START BED=[first_layer_bed_temperature] INITIAL_TOOL=[initial_tool] T0_TEMP={nozzle_temperature_initial_layer[0]} T0_USED={is_extruder_used[0]} T1_TEMP={nozzle_temperature_initial_layer[1]} T1_USED={is_extruder_used[1]}
```

热端更多时，按顺序在后面追加 `T2_TEMP=… T2_USED=…`、`T3_TEMP=… T3_USED=…`，例如 5 个热端：

```
PRINT_START BED=[first_layer_bed_temperature] INITIAL_TOOL=[initial_tool] T0_TEMP={nozzle_temperature_initial_layer[0]} T0_USED={is_extruder_used[0]} T1_TEMP={nozzle_temperature_initial_layer[1]} T1_USED={is_extruder_used[1]} T2_TEMP={nozzle_temperature_initial_layer[2]} T2_USED={is_extruder_used[2]} T3_TEMP={nozzle_temperature_initial_layer[3]} T3_USED={is_extruder_used[3]} T4_TEMP={nozzle_temperature_initial_layer[4]} T4_USED={is_extruder_used[4]}
```

⚠️ **写几个就要有几个挤出机**：Orca 里只设了 2 个挤出机，起始 G-code 里却写了 `[2]`、`[3]`……，切片时会报下标越界。

### 3. 结束 G-code

打印机设置 → 机器 G-code → **结束 G-code**，整段替换为：

```
PRINT_END
```

`PRINT_END` 会回抽、抬升 Z、关闭所有加热器（热床和所有热端）。模型风扇**不会马上关**：先全速吹，后台每 10 秒检查一次，所有热端都降到 50°C 以下后再自动关闭（不阻塞，打印机可以立即接受其它命令）；下一次 `PRINT_START` 开始时会停止这个检查。喉管风扇和停靠坞风扇同样在热端低于 50°C 后自动停。

网页上点"取消打印"时执行的是 `CANCEL_PRINT`。Klipper 内置的 `CANCEL_PRINT`（`[pause_resume]` 提供）只停止打印、**不关加热**；本配置已在 `print.cfg` 中覆盖它，取消时同样会关闭所有加热，模型风扇等热端降温后再关。

### 4. 耗材更换 G-code

打印机设置 → 机器 G-code → **耗材更换 G-code**：

```
M104 S{nozzle_temperature[next_extruder]} T{next_extruder}
T{next_extruder}
```

- 第一行：把下一个热端设到打印温度（不等待）。
- 第二行：换头。多热端插件换头后会等热端到温（日志中的"等温"），并自动加载该热端的对刀偏移。

### 5. 各挤出机的换料回抽

打印机设置 → 挤出机 1、挤出机 2 → 回抽 → **切换耗材时的回抽长度：2mm**（每个挤出机都要设）。

---

## 二、工艺设置

### 1. 擦拭塔

工艺 → 多材料 → **开启擦拭塔**。

如果耗材和参数调得好，且模型不涉及快速、微小的挤出，可以把模型摆到靠近停靠坞的位置，关掉擦拭塔试打（无擦拭塔打印）。

### 2. Ooze 防渗漏 / 自动预热

工艺 → 多材料 → **开启 Ooze（防渗漏）自动预热**：

| 项目 | 设置 | 说明 |
|---|---|---|
| 温度变化（软化温度） | **-180** | 闲置热端的待机温度 = 打印温度 - 180，基本等于关闭加热，不会在坞里渗料 |
| 预热时间 | **35s** | 换头前提前多少秒开始加热下一个热端；按自己热端的加热速度调整 |

预热时间设得合适时，换头时下一个热端已接近打印温度，等温时间很短；设短了换头时会停下来等温，设长了热端在坞里会渗料。

---

## 三、PRINT_START 做了什么

起始 G-code 调用 `PRINT_START` 后，打印机依次执行：

1. 显示本次打印的首个工具和用到的工具（来自 `Tn_USED`）
2. 热床开始升温，同时 `G28` 归零
3. 等热床到温（`M190`）
4. 三点调平 `Z_TILT_ADJUST` → `G28 Z`（未引用调平模块时自动跳过）
5. **打印前自动对刀**：对本次用到的工具依次执行 `CALIBRATE_TOOL`（换头 → 加热 150°C → tap 测 Z → 线圈测 XY → 保存偏移）。T0 是基准，即使本次没用到也会校准；对刀后关闭非首个工具的加热
6. 扫网床 `BED_MESH_CALIBRATE`（放在对刀之后，避免网床补偿影响 tap 测 Z）
7. 换上首个工具 `T{INITIAL_TOOL}`（插件自动加载刚校准的偏移）
8. 等首个工具到温（`M109 T{INITIAL_TOOL} S{温度}`）
9. 重置挤出、抬高 Z，开始打印

对刀每个工具约 1 分多钟（换头 + 加热 + 扫描）。不想每次都对刀时，在起始 G-code 末尾加 `CALIBRATE=0`，直接使用上次保存的偏移：

```
PRINT_START BED=[first_layer_bed_temperature] INITIAL_TOOL=[initial_tool] T0_TEMP={nozzle_temperature_initial_layer[0]} T0_USED={is_extruder_used[0]} T1_TEMP={nozzle_temperature_initial_layer[1]} T1_USED={is_extruder_used[1]} CALIBRATE=0
```

其它热端不在这里加热，由 Orca 的 Ooze 自动预热在换头前加热。

单头机型的写法不变：`PRINT_START BED=[first_layer_bed_temperature] EXTRUDER=[nozzle_temperature_initial_layer]`。

---

## 四、首次打印检查

1. 切片后打开 G-code，确认开头是 `PRINT_START BED=… INITIAL_TOOL=… T0_TEMP=… T0_USED=…`，换色处是 `M104 S… T1` + `T1`。
2. 开始打印时，控制台应显示 `PRINT_START: 首个工具 T0（…°C），用到的工具: T0, T1`，随后显示 `PRINT_START: 打印前对刀 T0, T1（T0 为基准）`。
3. 打一个两色叠层方块，检查：
   - 两色在 XY 方向是否对齐（不对齐：重新对刀，见 `docs/多头配置指南.md` 第五节 4）
   - 两色层高是否一致（不一致：检查 T1 的 Z 偏移）
   - 换头时是否停下来等温（等温久：加长 Ooze 预热时间）
   - 停靠坞里是否渗料（渗料多：减小预热时间，或加大温度变化）
