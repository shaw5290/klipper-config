# Klipper 打印机配置

CoreXY 三 Z（Trident 式）打印机的 Klipper 配置，支持单热端和多热端两种机型，按模块拆分、可拔插。

## 目录

| 路径 | 说明 |
|---|---|
| `config/` | 打印机配置，整个目录部署到 `~/printer_data/config/` |
| `config/README.md` | 模块结构、拔插规则、依赖关系、部署前注意事项 |
| `debug/printer.cfg` | 单文件调试配置：XYZ 运动、调平、简单打印头，新机器先调通运动用 |
| `docs/新机器配置指南.md` | 新机器从零开始的配置与校准步骤 |
| `docs/多头配置指南.md` | 从单头切换为多头（2 个打印头为例）：要改的配置、实测项、调试步骤 |
| `docs/热床倾斜调试与修复记录.md` | 热床网床前后倾斜问题的排查与修复记录 |

## 快速开始

0. 把 `config/` 目录里的**全部内容**（包括 `modules/` 文件夹）复制到打印机的 `~/printer_data/config/`，`modules/` 要和 `printer.cfg` 在同一层：
   ```bash
   cp -r ~/printer-config/config/. ~/printer_data/config/
   ```
   不要用 Mainsail/Fluidd 网页上传（不会上传文件夹）。详见 `docs/新机器配置指南.md` 第 1 步。
1. 在 `config/printer.cfg` 中选择机型：`profile_singletool.cfg`（单热端）或 `profile_multitool.cfg`（多热端）。
2. 在对应的机型清单文件里，按实际硬件增减模块。
3. 部署前，把打印机当前 `printer.cfg` 末尾的 SAVE_CONFIG 数据块替换到 `config/printer.cfg` 最底部。

## 历史

旧的未拆分配置（`config-global/`、旧 `config/`、`printer_merged.cfg`、`config_merged.md`、配置备份 zip）已从仓库删除，可在提交 `d345fa9` 中找回：

```
git show d345fa9:printer_merged.cfg
git checkout d345fa9 -- config-global/
```
