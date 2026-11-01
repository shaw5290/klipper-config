# 6. 网床

## 扫床

热床加热到打印温度，等 5～10 分钟热透：

```
M190 S60
G28
Z_TILT_ADJUST
G28 Z
BED_MESH_CALIBRATE
```

在 Mainsail / Fluidd 的 Heightmap 页面看结果：

- 极差在 0.1～0.15mm 以内为正常。本机：最高 +0.040mm，最低 -0.025mm，极差 0.065mm。
- 最后一排突然下降，是热床边缘干扰，减小 `modules/leveling/bed_mesh.cfg` 里的 `mesh_max`（本机 `275, 260`）。

## 塞尺测试

```
PAPER_TEST_PREP              ; 归零 → 调平 → 重新 Z 归零 → 关闭网床补偿
PAPER_TEST POINT=1           ; 1 左前、2 右前、3 左后、4 右后，喷嘴降到 Z=0.2
```

4 个角的手感应该一致。

## 保存

满意后执行 `SAVE_CONFIG`，网床保存为 `default`。

## 为什么每次打印完都提示 SAVE_CONFIG

打印开始宏每次都会执行 `BED_MESH_CALIBRATE`。Klipper 扫完会自动把结果存成 `default` 档案，同时把配置标记为"有未保存的改动"，所以每次打印后都会提示 `SAVE_CONFIG`。

这是 Klipper 的设计，不是配置错误：

- 这次打印用的就是刚扫的网床，存不存档对打印没有影响，**提示可以直接忽略**。
- 点保存会重启 Klipper，并改写 `printer.cfg`。
- 涡流扫一次床只要十几秒，每次打印前重新扫，热床的热变形也能补偿到。
