# 11. 收尾

## 恢复调试阶段的设置

| 项目 | 位置 | 调试值 | 正式值 |
|---|---|---|---|
| 开机自动标记已归零 | `modules/core/common.cfg` 的 `[delayed_gcode KINEMATIC_POSITION]` | 注释 | 建议保持注释 |
| 打印前 tap 定 Z | `modules/macros/print.cfg` 的 `PRINT_START_TAP` | `default(0)` 跳过 | tap 稳定后改为 `default(1)`，或切片里传 `TAP=1` |
| 多头打印前对刀 | `modules/macros/print.cfg` 的 `PRINT_START_CALIBRATE` | `default(0)` 不对刀 | 改为 `default(1)`，或切片里传 `CALIBRATE=1` |
| 冷挤出保护 | `modules/extruder/tgl36v3_single.cfg` 的 `min_extrude_temp` | `-119` | `170` |

## 同步配置回仓库

`SAVE_CONFIG` 只改打印机上的 `printer.cfg`。把打印机上调好的配置同步回仓库并提交，下次部署才不会丢：

```bash
cp -r ~/printer_data/config/. ~/printer-config/config/
cd ~/printer-config && git add -A && git commit -m "校准完成"
```

在 Windows 上维护仓库时，从 Mainsail 下载 `printer.cfg` 覆盖本地的 `config/printer.cfg`。

::: tip 换行符
仓库的 `.gitattributes` 已约束所有文本文件使用 LF。Windows 上建议 `git config --global core.autocrlf false`，避免出现只有换行符不同的修改。
:::
