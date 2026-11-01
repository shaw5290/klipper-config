# 1. 上位机软件与固件

## 安装 Klipper 全家桶

1. 上位机（树莓派等）装好 Klipper、Moonraker、Mainsail 或 Fluidd，推荐用 KIAUH 一键安装。
2. 配置 CAN 网络 `can0`，波特率与固件一致（常用 1000000）。
3. 给主板、工具头板刷 Klipper 固件：
   - 主板、工具头板：CAN 或 CAN 桥接固件
   - 多热端扩展板（仅多头）：USB 固件

## 安装 Python 依赖

```bash
# 振动补偿（SHAPER_CALIBRATE）需要 numpy
~/klippy-env/bin/pip install numpy -i https://pypi.tuna.tsinghua.edu.cn/simple
# 涡流 tap 在 data_rate=250 时需要 SciPy
~/klippy-env/bin/pip install scipy -i https://pypi.tuna.tsinghua.edu.cn/simple
```

## 修改 ldc1612 驱动（必做）

涡流探针要改 Klipper 源码 `~/klipper/klippy/extras/ldc1612.py`。本机实测三处都要改，tap 才能稳定：

| 位置 | 原值 | 改为 |
|---|---|---|
| `SETTLETIME` | `0.005` | `0.0002` |
| `self.set_reg(REG_ERROR_CONFIG, ...)` | `(0x1f << 11) \| 1` | `(0x1c << 11) \| 1` |
| `self.data_rate` | `400` | `250`（工具头板 STM32F072 负担不了 400） |

```bash
sudo systemctl restart klipper        # 改 .py 后必须重启服务，FIRMWARE_RESTART 不会重新加载
grep -n "SETTLETIME\|REG_ERROR_CONFIG\|data_rate" ~/klipper/klippy/extras/ldc1612.py
```

::: tip
更新 Klipper 后这些修改可能被覆盖，每次更新完用上面的 `grep` 检查一遍。
:::

## 多头插件（仅多头）

- **klipper-multitool-stats**：提供 `[multitool]`、换头命令、M104/M109 覆写。
- **tool_eddy_calibration**：涡流对刀。把 `tool_eddy_calibration.py` 放到 `~/klipper/klippy/extras/` 后重启 Klipper。
  - 源码：https://github.com/chengxg/tool_eddy_calibration
  - 教程：https://demo.chengxg.top/pangxie/articles/eddy-calibration/
- 打印机不能上网时的离线安装见 [klipper-toolchanger 安装与迁移](/klipper-toolchanger安装与迁移)。
