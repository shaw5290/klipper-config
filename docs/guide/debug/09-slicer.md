# 9. 切片设置与试打

以 OrcaSlicer 为例。多头的设置见 [OrcaSlicer 多热端设置](/OrcaSlicer多热端设置)。

## 打印机设置

| 项目 | 设置 |
|---|---|
| G-code 风格 | Klipper |
| 打印区域 | 0～290 × 0～300 |
| 标记对象（Label objects） | 开启（配合 `[exclude_object]`，打印中可取消单个模型） |

**起始 G-code（单头）**，推荐分行写，取消打印能在当前步骤结束后立即生效：

```
PRINT_START_HOME BED=[bed_temperature_initial_layer_single]
PRINT_START_LEVEL
PRINT_START_TAP
PRINT_START_MESH
PRINT_START_TOOL EXTRUDER=[nozzle_temperature_initial_layer]
```

也可以只写一行：

```
PRINT_START BED=[bed_temperature_initial_layer_single] EXTRUDER=[nozzle_temperature_initial_layer]
```

打印开始宏的步骤：热床升温 → 归零 → 三点调平 → 重新 Z 归零 →（tap 定 Z）→ 扫网床 → 喷嘴升温。

**结束 G-code**：

```
PRINT_END
```

## PLA 参考设置

| 项目 | 建议值 | 说明 |
|---|---|---|
| 喷嘴温度 | 200～210°C | 220°C 偏高，侧壁容易软塌、外圈堆高 |
| 热床温度 | 55～60°C | |
| 模型风扇 | 第 1 层 0%，第 3 层起 100% | 首层吹风容易翘边 |
| 最小层时间 | 8～10 秒 | 小件每层太快打完，热量积在模型上 |
| 最大体积速度 | 12～15 mm³/s | 防止填充、顶面出料不足 |
| 外墙加速度 | 2000～3000 | 不超过振动补偿建议的 `max_accel` |
| 顶面速度 | 80～120 mm/s | 顶面更平 |
| 熨烫 | 可选，只熨顶面 | 顶面外圈台阶明显变小 |

## 试打

1. 打一个 20mm 校准方块。
2. 看侧壁：平整、层纹均匀。发糊、发亮 → 冷却问题；波纹 → 振动补偿 / 加速度；规律横纹 → Z 机械。
3. 看顶面：平整、外圈不高出来。外圈高 → 最大体积速度、顶面速度、压力提前。
4. 有问题对照 [常见问题](../troubleshooting#打印质量)。
