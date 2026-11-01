# 1. 首次启动与基础检查

## 首次启动

在网页控制台执行 `FIRMWARE_RESTART`，确认没有报错、所有 MCU 都已连接。有报错先按提示修好配置，常见报错见 [常见问题](../troubleshooting#启动与配置)。

## 基础检查（不要归零，不要加热）

### 温度读数

所有热端、热床、板载温度都应显示室温附近（约 15～35°C）。显示 -200 多度或几百度，说明热敏没接好、插错了口或 `sensor_type` 不对。

### 限位

执行 `QUERY_ENDSTOPS`，手动按下 X、Y 限位，状态应从 `open` 变成 `TRIGGERED`。

### 电机方向

逐个执行，观察电机是否先正转再反转：

```
STEPPER_BUZZ STEPPER=stepper_x
STEPPER_BUZZ STEPPER=stepper_y
STEPPER_BUZZ STEPPER=stepper_z
STEPPER_BUZZ STEPPER=stepper_z1
STEPPER_BUZZ STEPPER=stepper_z2
```

::: danger 三个 Z 电机必须同向
都先上升或都先下降。方向不对，在该电机的 `dir_pin` 前加上或去掉 `!`。
:::

### 驱动通讯

执行 `DUMP_TMC STEPPER=stepper_z`（其它电机同理）。能读出寄存器说明 UART 正常；报错说明 `uart_pin` 不对或驱动没装好。

### 模型风扇

```
M106 S255     ; 全速
M107          ; 关闭
```

风扇必须转。不转按这个顺序查：

1. **两个风扇是否插反**：冷机（喷嘴低于 50°C）发 `M106 S255`，如果转的是喉管风扇，就是模型风扇和喉管风扇插反了，在工具头板上对调插头。
2. **正负极**：红线插 `+`，黑线插 `−`。插头是第三方压接的，线序可能反了。
3. **电压**：风扇电压要和板子风扇输出的电压一致。
4. **风扇本身**：把它插到确认是好的喉管风扇接口上试。

喉管风扇在热端超过 50°C 时自动转，第 3 步加热时再检查。

## 电机参数（本机）

| 电机 | 运行电流 | 驱动模式 | 文件 |
|---|---|---|---|
| X / Y | 0.8A（保持 0.6A） | spreadCycle（`stealthchop_threshold: 0`） | `modules/core/mainboard.cfg` |
| Z / Z1 / Z2 | 0.6A（保持 0.2A） | 静音（`stealthchop_threshold: 99999`） | `modules/core/z_trident.cfg` |
| 挤出机 | 0.4A | 静音 | `modules/toolhead/tgl36v3.cfg` |

- 电流不要超过电机额定电流（看电机标签上的 Rated Current）。打印半小时后摸电机，温热正常，烫手就降电流。
- `max_z_accel` 必须是 **200**：涡流 tap 碰床后 0.15 秒内要抬起 ≥0.35mm，50 时会报 `insufficient lift`。
- 调试时可以临时改电流，`FIRMWARE_RESTART` 后恢复：

  ```
  SET_TMC_CURRENT STEPPER=stepper_z CURRENT=0.6 HOLDCURRENT=0.4
  ```
