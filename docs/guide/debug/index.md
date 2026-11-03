# 调试总览

::: tip 第一次调试
先看 [新手必读：调试的基本操作](/guide/basics)：命令在哪里输入、怎么改配置和重启、急停在哪、移动命令怎么看。
:::

按顺序做，每一步通过了再做下一步。后面的步骤依赖前面的结果，例如涡流校准要先做 PID，网床要先调平。

| 步骤 | 内容 | 通过标准 |
|---|---|---|
| [1. 首次启动与基础检查](./01-first-boot) | MCU 连接、温度、限位、电机方向、驱动、风扇 | 无报错；三个 Z 电机同向；`M106 S255` 风扇转 |
| [2. XY 归零与行程](./02-homing) | `G28 X`、`G28 Y`，行程 | 归零方向对，能走满 X 0～290、Y 0～300 |
| [3. PID 与风扇](./03-pid-fan) | 热床、热端 PID | 温度稳定在目标 ±1°C |
| [4. 涡流探针校准](./04-eddy) | 驱动电流、高度曲线、tap 阈值 | `PROBE_ACCURACY` 标准差 ≤ 0.005mm，tap 极差 ≤ 0.01mm |
| [5. 三点调平](./05-z-tilt) | `Z_TILT_ADJUST` | 三点高差 < 0.0075mm |
| [6. 网床](./06-bed-mesh) | `BED_MESH_CALIBRATE`、塞尺测试 | 网床极差 ≤ 0.1～0.15mm，4 角手感一致 |
| [7. 振动补偿](./07-input-shaper) | `SHAPER_TEST` | 得到 X/Y 推荐整形器，`max_accel` 不超过建议值 |
| [8. 挤出与第一层](./08-extrusion) | rotation_distance、Z 偏移、压力提前、流量 | 挤 100mm 误差 < 1mm；首层线条之间无缝、不过压 |
| [9. 切片设置与试打](./09-slicer) | OrcaSlicer 打印机 / 耗材 / 工艺设置 | 方块侧壁平整，顶面无外圈台阶 |
| [10. 多头专项](./10-multitool) | 换头、对刀 | 仅多头 |
| [11. 收尾](./11-finish) | 恢复安全设置、同步配置回仓库 | |

## 两条规则

::: warning 写在模块文件里的参数不能用 SAVE_CONFIG 保存
PID、`max_accel`、电机电流等写在 `modules/` 下的文件里。Klipper 不允许 `SAVE_CONFIG` 覆盖被引用文件里的设置（会报 `... conflicts with included value`），这类参数要手动改文件，再 `FIRMWARE_RESTART`。

涡流曲线、tap 阈值、网床、振动补偿、Z 偏移这些由 Klipper 写在 `printer.cfg` 底部，用 `SAVE_CONFIG` 保存。
:::

::: warning 打印中不要执行 SAVE_CONFIG
`SAVE_CONFIG` 会重启 Klipper，正在打印的件会直接中断。等打印结束再保存。
:::
