# 3. PID 与风扇

不校准 PID，温度会过冲、上下摆动。本机多头热端用占位值时，目标 150°C 在 155～157°C 来回跳，`M109` 和对刀一直卡在"等温中"。

多头机型的接线核对、功率统一、预热时间测量见 [多热端温度调试](./hotend-temperature)。

## 校准

```
M106 S0                                          ; 关模型风扇；喉管风扇会自动转，保持和使用时一致
PID_CALIBRATE HEATER=heater_bed TARGET=80
PID_CALIBRATE HEATER=extruder TARGET=220         ; 单头按常用打印温度
PID_CALIBRATE HEATER=extruder TARGET=150         ; 多头：对刀 tap 用 150°C
PID_CALIBRATE HEATER=extruder1 TARGET=150        ; 多头：每个热端都要做
```

## 填写结果

::: warning 不能用 SAVE_CONFIG 保存
PID 写在被引用的模块文件里，`SAVE_CONFIG` 会报 `... conflicts with included value`。把控制台输出的 `pid_Kp`、`pid_Ki`、`pid_Kd` 手动填进对应文件，然后 `FIRMWARE_RESTART`。
:::

| 加热器 | 文件 |
|---|---|
| 热床 `heater_bed` | `modules/core/heater_bed.cfg` |
| 单头 `extruder` | `modules/extruder/tgl36v3_single.cfg` |
| 多头 `extruder`、`extruder1`… | `modules/multitool/multihotend.cfg`（改带 `heater_pin: multihotend:T0H` 的那个 `[extruder]`） |

在数值后面注明校准条件和日期，例如：

```
pid_Kp:26.374 # 实测：PID_CALIBRATE HEATER=extruder TARGET=220（2026-10-20）
```

## 验证

```
M109 S220
M190 S80
```

温度应稳定在目标 ±1°C 以内。

## 风扇检查

- **喉管风扇** `hotend_fan`：热端超过 50°C 时自动转。多头时要监听所有热端：`heater: extruder, extruder1`，否则 T1 加热时不转。
- **模型风扇**：`M106 S255` 必须转，不转见 [第 1 步](./01-first-boot#模型风扇)。模型风扇不转时打印件侧壁会又亮又糊、转角翘起。
- **停靠坞风扇**（多头）：对应热端超过 50°C 时启动；检查风会不会吹到工具头上的热端，吹到会让温度波动。
