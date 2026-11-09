# 8. 挤出与第一层

按顺序做：挤出距离 → 第一层 → 压力提前 → 流量比。后面的校准都依赖挤出距离准确。

## 1. 挤出距离（rotation_distance）

1. 加热喷嘴到打印温度，在挤出机入料口上方 120mm 处的料上做记号。
2. 挤出 100mm：

   ```
   M83
   G1 E100 F100
   ```

3. 量记号到入料口的距离，算出实际挤出长度 = 120 − 剩余距离。
4. 新值 = 旧值 × 实际长度 / 100，改 `modules/extruder/tgl36v3_single.cfg` 的 `rotation_distance`（本机 22.23），`FIRMWARE_RESTART` 后再测一次，误差 < 1mm 即可。

## 2. 第一层

在切片里打一个单层大方块，打印时用 babystep 微调 Z：

- **线条之间有缝、线是圆的**：Z 太高，往下调，每次 -0.02mm。
- **表面发亮、出现波纹或刮痕**：Z 太低，往上调。
- **一部分好一部分有缝**：床面各处高度不一样，检查网床是否生效（控制台有 `Mesh Bed Leveling Complete`）、调平是否做了。

调好后保存，方法取决于打印前有没有用 tap 定 Z。现在打印开始宏 `PRINT_START_TAP` **默认用 tap 定 Z**（按小螃蟹教程：喷嘴接触床面定 Z=0，消除非接触测距最多 0.2mm 的温漂），所以按下面"tap 模式"保存。

### tap 模式（默认）：间隙存在 `[stepper_z] position_endstop`

`SET_Z_FROM_PROBE METHOD=tap` 会把"喷嘴接触床面的位置"设成 Z = `position_endstop`。`position_endstop` 越大，Z=0 越往下，喷嘴越贴近床面。

**第一次用时**，在打印机上的 `printer.cfg` 最底部 SAVE_CONFIG 区块里加上（教程要求，加在 `#*#` 区块里）：

```
#*#
#*# [stepper_z]
#*# position_endstop = 0
```

`RESTART` 后，打印时用 babystep 调第一层。调好后**看 babystep 一共调了多少**（Mainsail Z 偏移面板上显示的数，或 `GET_POSITION` 里 `gcode homing` 的 Z），手动改 `position_endstop`：

```
新 position_endstop = 原 position_endstop - babystep 总量
```

例：原来 0，babystep 往下调了 -0.04 才合适 → `position_endstop = 0.04`；往上调了 +0.02 → `position_endstop = -0.02`。打印结束后改 `printer.cfg` 底部那一行，`RESTART`。Mainsail 里可能没有"保存到限位"的按钮，按教程手动改即可。

::: warning 喷嘴要干净
tap 靠喷嘴碰床面，喷嘴尖有残料就会测高。打印前喷嘴 150°C 时擦一下；有擦嘴刷可以加教程的 `CLEAN_NOZZLE`（会在热床前边缘 Z=-0.1 来回蹭，没有刷子不要用）。
:::

### 非接触模式（`TAP=0`）

```
Z_OFFSET_APPLY_PROBE
SAVE_CONFIG              ; 打印结束后再执行
```

## 3. 压力提前（Pressure Advance）

压力提前太小，转角和外墙边缘会堆料、鼓起来；太大，转角会缺料。

1. OrcaSlicer：校准 → 压力提前，打测试件。
2. 选线条最均匀的那一档数值，填到 `modules/extruder/tgl36v3_single.cfg` 的 `pressure_advance`（当前 0.03，未校准）。
3. `FIRMWARE_RESTART`。

不同耗材的 PA 不一样，也可以在 OrcaSlicer 耗材设置里单独设置。

## 4. 流量比

PA 校准完以后做：OrcaSlicer → 校准 → 流量比，按测试件结果填到耗材设置的"流量比"。

## 5. 最大体积速度

热端每秒能熔化的料有上限。填充、顶面打得太快超过上限，出料就会不足，表现是每层**外圈比里面高**、顶面发麻。

- OrcaSlicer 耗材设置 → 最大体积速度：普通热端 12～15 mm³/s，高流量热端 20 左右。
- 想准确测量，用 OrcaSlicer → 校准 → 最大体积速度。

## 多头机型的挤出量（2026-11-07）

多头 CxChanger 打印头上的挤出机和单头不完全一样，**不能照搬单头的 `rotation_distance`**，要在多头配置下实测（`modules/multitool/multihotend.cfg` 的 `[extruder]`）：

| 次序 | 设置 | 100mm（或 50mm）挤出实测 |
|---|---|---|
| 原多头值 | `rotation_distance: 22.987`，没写减速比，`microsteps: 32` | 只有正常量的约 38%，第一层线细、有缝 |
| 照搬单头 | `22.23`，`gear_ratio: 50:10`，`microsteps: 16` | 50mm 挤出约 65mm（多 30%） |
| 第一次修正 | `28.90`（22.23 × 65 ÷ 50） | 100mm 挤出 96mm |
| **第二次修正** | **`27.74`**（28.90 × 96 ÷ 100） | **100mm 挤出 100mm** |

测法：耗材上离挤出机入口 120mm 做记号，`M109 T0 S220` → `M83` → `G1 E100 F100`，实际挤出 = 120 - 剩下的长度；新值 = 旧值 × 实际 ÷ 100。T0、T1 共用这一个挤出电机，测一次就行。

