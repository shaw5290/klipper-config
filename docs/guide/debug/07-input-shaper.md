# 7. 振动补偿

振动补偿（input shaper，也叫共振补偿）用来减轻高速运动、急加减速时机架抖动在侧壁上留下的波纹。工具头板上的 LIS2DW 加速度计已经在 `modules/toolhead/tgl36v3.cfg` 里配好。

::: tip 只有 X、Y 两个轴
Klipper 的振动补偿只做 X、Y。Z 轴打印时只在换层时慢速抬升，不会激起这种振动。侧壁出现规律横纹（Z banding）要从机械上找：Z 皮带松紧、皮带轮顶丝、Z 电机电流。
:::

## 1. 安装 numpy（只需一次）

```bash
~/klippy-env/bin/pip install numpy
```

不装的话 `SHAPER_CALIBRATE` 会报缺少 numpy。

## 2. 检查加速度计

```
G28
ACCELEROMETER_QUERY
```

返回 `accelerometer values (x, y, z): ...` 且不全是 0 就正常。

建议再确认一次轴向：

```
AXES_MAP_CALIBRATION
```

给出的 `axes_map` 和配置里的 `x,z,y` 不一样时，改 `modules/toolhead/tgl36v3.cfg` 的 `[lis2dw] axes_map`。轴向错了，X、Y 的测量结果会混在一起。

## 3. 测试

先清空热床，然后：

```
SHAPER_TEST              ; X、Y 都测
SHAPER_TEST AXIS=X       ; 只测 X（AXIS=Y 只测 Y）
```

`SHAPER_TEST` 宏（`modules/macros/maintenance.cfg`）会：没归零先 `G28`，在热床中心、离床 20mm 处执行 `SHAPER_CALIBRATE`。

::: details 不用宏、直接执行
```
G28
SHAPER_CALIBRATE POINT=145,150,20
```
没归零会报 `Must home axis first`。
:::

机器会在 X、Y 两个方向从 5Hz 振到 134Hz，声音比较大，整个过程约 5 分钟。结束时输出推荐值：

```
Recommended shaper_type_x = mzv, shaper_freq_x = 67.2 Hz
To avoid too much smoothing with 'mzv', suggested max_accel <= 13300 mm/sec^2
Recommended shaper_type_y = mzv, shaper_freq_y = 42.0 Hz
To avoid too much smoothing with 'mzv', suggested max_accel <= 5200 mm/sec^2
```

## 4. 保存

打印结束后执行：

```
SAVE_CONFIG
```

`printer.cfg` 底部会多出 `[input_shaper]`。确认这一段存在，补偿才算生效。

## 5. 调整最大加速度

取 X、Y 两轴推荐的 `max_accel` 中**较小**的那个，改 `modules/core/mainboard.cfg` 里 `[printer]` 的 `max_accel`（不能用 SAVE_CONFIG），然后 `FIRMWARE_RESTART`。

本机结果（2026-11-02）：

| 轴 | 整形器 | 频率 | 建议 max_accel |
|---|---|---|---|
| X | mzv | 67.2 Hz | ≤ 13300 |
| Y | mzv | 42.0 Hz | ≤ 5200 |

Y 是瓶颈，`max_accel` 从 10000 改成了 **5000**。切片里外墙加速度建议 2000～3000，其它加速度不超过 5000。

想提高 Y 的频率：检查 Y 方向两根皮带张紧是否一致，龙门和工具头的螺丝有没有松。

## 6. 对比验证

用同一个文件、同样的切片设置，开补偿前后各打一次，对比侧壁波纹和转角后面的振纹。
