# 4. 涡流探针校准

按小螃蟹涡流扫床教程（https://demo.chengxg.top/pangxie/articles/eddy-coil/ 第三节）。

**前提**：`ldc1612.py` 三处修改和 SciPy（[安装第 1 步](../install/software#修改-ldc1612-驱动-必做)）、`max_z_accel: 200`、PID 都已完成。

## 1. 加热并清洁喷嘴

涡流做 Z 限位时，校准要在热机条件下做：

```
M140 S80
M109 S150
M190 S80
```

到温后擦干净喷嘴尖。

## 2. 驱动电流

在喷嘴靠近热床约 2mm 处校准。配置里的 `reg_drive_current` 要保持注释，否则 SAVE_CONFIG 冲突。

```
G28
LDC_CALIBRATE_DRIVE_CURRENT CHIP=eddy_probe
SAVE_CONFIG
```

## 3. 高度曲线

重启后重新加热到温：

```
PROBE_EDDY_CURRENT_CALIBRATE_AUTO
```

垫 A4 纸，用 `TESTZ` 调到纸张抽动时有轻微阻力，执行 `ACCEPT`。等控制台打印出噪声数据后，**一定执行 `SAVE_CONFIG`**。

本机参考（热机、250 次/秒）：驱动电流 24，噪声 0.001mm，MAD_Hz≈163。MAD 到几百说明 Z 轴有问题。

## 4. tap 阈值

`tap_threshold` 在配置里保持注释。喷嘴在热床中间、离床 3～10mm：

```
G1 X150 Y150 Z5 F6000
PROBE_EDDY_CURRENT_TAP_CALIBRATE TAP=guess
PROBE_EDDY_CURRENT_TAP_CALIBRATE TAP=refine
PROBE_EDDY_CURRENT_TAP_CALIBRATE TAP=verify
SAVE_CONFIG
```

本机结果：`tap_threshold: 64820.919`，verify 5 次极差 0.008mm。自动校准报阈值不对时，用 `PROBE_ACCURACY METHOD=tap tap_threshold=40000` 手动找。

## 5. 验证

```
G28
PROBE_ACCURACY                       ; 非接触测量，标准差应在 0.005mm 以内
G1 X150 Y150 Z5 F6000
SET_Z_FROM_PROBE METHOD=tap          ; 连续执行 2～3 次，set_Z 应基本一致
```

::: warning
重新校准高度曲线后 Z 基准会变，之后要重新调平、扫网床、调第一层。
:::

tap 调试的完整排查过程见 [多头配置指南](/多头配置指南) 第五节 4.1。
