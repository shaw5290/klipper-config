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

调好后：

```
Z_OFFSET_APPLY_PROBE
SAVE_CONFIG              ; 打印结束后再执行
```

::: tip 用 tap 定 Z
打印开始宏 `PRINT_START_TAP` 在调试阶段默认跳过 tap（`TAP=0`）。tap 调通后，在切片开始 G-code 里传 `TAP=1`，每次打印前用喷嘴真实接触热床的位置作为 Z=0，第一层更稳定。
:::

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
