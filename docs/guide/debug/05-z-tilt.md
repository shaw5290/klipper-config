# 5. 三点调平

## 1. 丝杆坐标

量出三根 Z 的实际中心坐标，填到 `modules/leveling/z_tilt.cfg` 的 `z_positions`。本机：

```
z_positions:
  -6.5, -2        # 左前 (stepper_z)
  150, 350        # 后中 (stepper_z1)
  335, -2         # 右前 (stepper_z2)
```

## 2. ⚠️ 测点不能靠近热床边缘

这是之前热床倾斜问题的根本原因，见 [热床倾斜调试与修复记录](/热床倾斜调试与修复记录)。

- `points` 填的是喷嘴坐标，探针实际位置要再加上 `y_offset`（20mm）。
- 探针实际位置离热床边缘、螺丝、孔位至少 30mm。
- 验证：在每个测点执行 `PROBE`，前后几个点的读数应连续变化，不能突然跳变。

本机测点：`40,40`、`150,200`、`260,40`。

## 3. 执行调平

```
G28
Z_TILT_ADJUST
```

`Z_TILT_ADJUST` 宏会先粗调一轮，再用涡流快速扫描精调。正常几轮之内三点高差就小于 0.0075mm，控制台类似：

```
Retries: 0/20 Probed points range: 0.002094 tolerance: 0.007500
```

出现 `Retries aborting: Probed points range is increasing`，检查 Z 电机方向和 `z_positions`。

::: tip
Z 电机断电后热床会移位，每次重启后第一次调平高差很大是正常的。打印开始宏会自动先调平再扫床。
:::
