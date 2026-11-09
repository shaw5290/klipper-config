# OrcaSlicer 多热端设置

本文对应 `config/modules/macros/print.cfg` 中的 `PRINT_START` 宏，以 2 个热端（T0、T1）为例。热端数量不同时，按同样的规律增减。

> 前提：多头配置已调通（换头、PID、一键对刀），见 `docs/多头配置指南.md`。
>
> 第一次用 OrcaSlicer：下面的"打印机设置""工艺设置"是 Orca 左上角的三个下拉框（打印机 / 耗材 / 工艺）旁边的编辑按钮打开的设置页。改完记得点保存，存成自己的预设。

---

## 一、打印机设置

### 1. 基本设置

| 项目 | 设置 |
|---|---|
| G-code 风格 | Klipper |
| 挤出机数量 | **2**（按实际热端数量填写，和 `[multitool] tool_count` 一致） |
| 标记对象（Label objects） | 开启（配合 `[exclude_object]`，可在打印中取消单个模型） |
| 单挤出机多材料（Single Extruder Multi Material） | **关闭**。CxChanger 每个热端有自己的喷嘴，不是一个喷嘴换料 |
| 挤出机 2 的喷嘴偏移（Extruder offset） | **X 0、Y 0**。偏移由 Klipper 换头时自动加载（来自一键对刀），Orca 里再填一次会偏两倍 |
| 每个挤出机的喷嘴直径 | 按实际喷嘴填，一般都是 0.4 |

### 2. 起始 G-code

打印机设置 → 机器 G-code → **起始 G-code**，**整段替换**。推荐用**分行写法**（2 个热端）：

```
PRINT_START_HOME BED=[first_layer_bed_temperature]
PRINT_START_LEVEL
PRINT_START_TAP
PRINT_START_CALIBRATE INITIAL_TOOL=[initial_tool] T0_USED={is_extruder_used[0]} T1_USED={is_extruder_used[1]}
PRINT_START_MESH
PRINT_START_TOOL INITIAL_TOOL=[initial_tool] T0_TEMP={nozzle_temperature_initial_layer[0]} T0_USED={is_extruder_used[0]} T1_TEMP={nozzle_temperature_initial_layer[1]} T1_USED={is_extruder_used[1]}
```

**为什么要分行**：Klipper 里一个宏从开始到结束是一条命令，执行期间不会插入其它命令。如果只写一行 `PRINT_START`，等热床、调平、扫网床、换头全在这一条命令里，网页上点"取消打印"要等它全部做完才生效（看起来像取消了但调平还在继续）。分成多行后，取消会在**当前这一步**结束后立即生效。

| 行 | 作用 | 参数 |
|---|---|---|
| `PRINT_START_HOME` | 热床升温、归零、等热床 | `BED` |
| `PRINT_START_LEVEL` | 三点调平、重新 Z 归零 | — |
| `PRINT_START_TAP` | 喷嘴加热到 150°C 后用 tap 定 Z（多头用 T0）。必须放在 `PRINT_START_LEVEL` 之后：之后不能再有 `G28`，否则 tap 的修正会被覆盖 | — |
| `PRINT_START_CALIBRATE` | 打印前对刀（加 `CALIBRATE=0` 跳过） | `INITIAL_TOOL`、`Tn_USED`、`CALIBRATE` |
| `PRINT_START_MESH` | 加载保存的网床（不重新扫描，`MESH=1` 才扫床） | `MESH` |
| `PRINT_START_TOOL` | 换上首个工具、等到温 | `INITIAL_TOOL`、`Tn_TEMP`、`Tn_USED` |

**单行写法**（效果相同，但取消要等整个开始流程做完）：

```
PRINT_START BED=[first_layer_bed_temperature] INITIAL_TOOL=[initial_tool] T0_TEMP={nozzle_temperature_initial_layer[0]} T0_USED={is_extruder_used[0]} T1_TEMP={nozzle_temperature_initial_layer[1]} T1_USED={is_extruder_used[1]}
```

热端更多时，在 `PRINT_START_CALIBRATE`、`PRINT_START_TOOL`（或单行 `PRINT_START`）后面按顺序追加 `T2_USED=…`、`T2_TEMP=…` 等。

⚠️ **写几个就要有几个挤出机**：Orca 里只设了 2 个挤出机，起始 G-code 里却写了 `[2]`、`[3]`……，切片时会报下标越界。

需要立刻停止时用网页上的**紧急停止**（M112），它不排队，会马上停机（之后要 `FIRMWARE_RESTART`）。

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

工艺 → 多材料 → **开启擦拭塔**。擦拭塔放在热床上靠后的位置，不要放在热床最前面（停靠坞在热床前方）。

如果耗材和参数调得好，且模型不涉及快速、微小的挤出，可以把模型摆到靠近停靠坞的位置，关掉擦拭塔试打（无擦拭塔打印）。

### 2. Ooze 防渗漏 / 自动预热

工艺 → 多材料 → **开启 Ooze（防渗漏）自动预热**：

| 项目 | 设置 | 说明 |
|---|---|---|
| 温度变化（软化温度） | **-180** | 闲置热端的待机温度 = 打印温度 - 180，基本等于关闭加热，不会在坞里渗料 |
| 预热时间 | **35s**（先用这个值，再按实测改） | 换头前提前多少秒开始加热下一个热端。按 [多热端温度调试第 6 步](/guide/debug/hotend-temperature) 实测：从冷态加热到打印温度要几秒，取最慢的热端再加 5 秒。本机 T0、T1 的 `max_power` 是 0.5，升温较慢，35 秒可能不够 |

预热时间设得合适时，换头时下一个热端已接近打印温度，等温时间很短；设短了换头时会停下来等温，设长了热端在坞里会渗料。

---

## 三、PRINT_START 做了什么

起始 G-code 调用 `PRINT_START` 后，打印机依次执行：

1. 显示本次打印的首个工具和用到的工具（来自 `Tn_USED`）
2. 热床开始升温，同时 `G28` 归零
3. 等热床到温（`M190`）
4. 三点调平 `Z_TILT_ADJUST` → `G28 Z`（未引用调平模块时自动跳过）
5. **打印前对刀**（默认关闭，每次打印不修改校准值；`CALIBRATE=1` 才执行）：对本次用到的工具依次执行 `CALIBRATE_TOOL`（换头 → 加热 150°C → tap 测 Z → 线圈测 XY → 保存偏移）。T0 是基准，即使本次没用到也会校准；对刀后关闭非首个工具的加热
6. 加载保存的网床 `BED_MESH_PROFILE LOAD=default`（每次打印不修改；网床要先手动 `BED_MESH_CALIBRATE` + `SAVE_CONFIG` 保存一次。某次要重新扫床，在 `PRINT_START_MESH` 后面加 `MESH=1`）
7. 换上首个工具 `T{INITIAL_TOOL}`（插件自动加载刚校准的偏移）
8. 等首个工具到温（`M109 T{INITIAL_TOOL} S{温度}`）
9. **画预挤出线**（像 A1 / P1）：在热床前边缘 Y=3 处先挤一小坨，再画一条来回的粗线（约 180 mm），回抽、擦嘴后开始打印。只给首个工具画，其它工具由擦拭塔预挤出；不想画时在 `PRINT_START_TOOL` 行末尾加 `PURGE=0`

打印结束（`PRINT_END`）和取消打印（`CANCEL_PRINT`）时会先回抽 2 mm（热端低于 170°C 时跳过，冷挤出保护），再抬升 Z、关闭加热。

::: tip 当前默认值（2026-11-07）
- `CALIBRATE` 默认 **0**：**每次打印不修改校准值**（偏移、网床都不改，只做三点调平），直接用手动校准保存的偏移（X、Y 用 `CALIBRATE_TOOL`，Z 用 `TOOL_Z_CALIBRATE` / `TOOL_OFFSET_SET`，热端拆装或换喷嘴后手动做）。确实要某次打印前对刀，在 `PRINT_START_CALIBRATE` 行末尾加 `CALIBRATE=1`。
- `TAP` 默认 **1**：打印前用 tap 定 T0 的 Z（喷嘴接触床面，消除温漂），第一层间隙由 `printer.cfg` 底部的 `[stepper_z] position_endstop` 决定，见 [挤出与第一层](/guide/debug/08-extrusion)。不想 tap 时加 `TAP=0`。
:::

对刀每个工具约 1 分多钟（换头 + 加热 + 扫描）。默认不对刀，直接使用保存的偏移；起始 G-code 末尾写不写 `CALIBRATE=0` 效果一样：

```
PRINT_START BED=[first_layer_bed_temperature] INITIAL_TOOL=[initial_tool] T0_TEMP={nozzle_temperature_initial_layer[0]} T0_USED={is_extruder_used[0]} T1_TEMP={nozzle_temperature_initial_layer[1]} T1_USED={is_extruder_used[1]} CALIBRATE=0
```

其它热端不在这里加热，由 Orca 的 Ooze 自动预热在换头前加热。

单头机型的写法不变：`PRINT_START BED=[first_layer_bed_temperature] EXTRUDER=[nozzle_temperature_initial_layer]`。

---

## 四、给模型分配颜色

在 Orca 左侧的耗材列表里设好耗材 1、耗材 2（耗材 1 对应 T0，耗材 2 对应 T1）。然后在模型上右键，或者用"涂色"工具，把不同部分分配给耗材 1 / 耗材 2。切片后预览里能看到两种颜色和擦拭塔。

## 五、首次打印检查

打印前先确认换头本身没问题（带着耗材）：

```
T0
T1
T0
T1
```

T0、T1 来回切换几次，没有撞击、热端都能正确放回和带出，再开始打印。见 [停靠坞与换头动作调试](/guide/debug/dock#tune)。


1. 切片后打开 G-code，确认开头是 `PRINT_START BED=… INITIAL_TOOL=… T0_TEMP=… T0_USED=…`，换色处是 `M104 S… T1` + `T1`。
2. 开始打印时，控制台应显示 `PRINT_START: 首个工具 T0（…°C），用到的工具: T0, T1`，随后显示 `PRINT_START: 打印前对刀 T0, T1（T0 为基准）`。
3. 打一个两色叠层方块，检查：
   - 两色在 XY 方向是否对齐（不对齐：重新对刀，见 `docs/多头配置指南.md` 第五节 4）
   - 两色层高是否一致（不一致：检查 T1 的 Z 偏移）
   - 换头时是否停下来等温（等温久：加长 Ooze 预热时间）
   - 停靠坞里是否渗料（渗料多：减小预热时间，或加大温度变化）
