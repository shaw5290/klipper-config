# 2. 部署配置

## 复制 config/ 到打印机

::: danger modules/ 必须和 printer.cfg 在同一层
机型清单里的 `modules/...` 是相对路径。放错位置会报 `Include file '.../modules/core/mainboard.cfg' does not exist`。
:::

部署后的目录：

```
~/printer_data/config/
├── printer.cfg
├── profile_singletool.cfg
├── profile_multitool.cfg
├── moonraker.conf
├── myvariables.cfg
└── modules/
    ├── core/mainboard.cfg ...
    └── ...
```

**方式一：在打印机上用 git（推荐）**

```bash
cd ~
git clone <本仓库地址> printer-config          # 已经 clone 过就 cd ~/printer-config && git pull
cp -r ~/printer_data/config ~/printer_data/config.bak.$(date +%Y%m%d%H%M)   # 备份原有配置
cp -r ~/printer-config/config/. ~/printer_data/config/
ls ~/printer_data/config/modules/core/        # 应该看到 mainboard.cfg 等文件
```

源路径是 `config/.`，末尾的点不能少，否则会多套一层 `config/config/`。

**方式二：从 Windows 用 scp 上传**（PowerShell）

```powershell
scp -r D:\路径\到\仓库\config\* klipper@<打印机IP>:/home/klipper/printer_data/config/
```

::: warning 不要用 Mainsail / Fluidd 网页上传
网页只能上传文件，不会上传 `modules/` 文件夹。只改了单个模块文件时，可以用网页把它上传到对应的 `modules/...` 子目录。
:::

不要用 `sudo` 复制。如果已经用了，执行 `sudo chown -R klipper:klipper ~/printer_data/config`。

## 选择机型

打开 `printer.cfg`，二选一：

```
[include profile_singletool.cfg]      # 单头
# [include profile_multitool.cfg]     # 多头
```

再打开对应的机型清单，按实际硬件增减模块：

- 没有涡流探针：注释掉 `probe/eddy_tgl36v3.cfg`，启用 `probe/z_endstop_switch.cfg`
- 单头热端接在多热端扩展板 T0 口：把 `extruder/tgl36v3_single.cfg` 换成 `extruder/multihotend_t0_single.cfg`
- 暂时不用调平或网床：注释掉 `leveling/` 下对应的行，打印开始宏会自动跳过这些步骤

## SAVE_CONFIG 数据

`printer.cfg` 最底部 `#*# <---- SAVE_CONFIG ---->` 之后是校准数据（涡流曲线、tap 阈值、网床、振动补偿）。

- **老机器重新部署**：把备份里旧 `printer.cfg` 末尾的这块数据粘到新 `printer.cfg` 的最底部。
- **新机器**：这是别的机器的数据，不能用。保留 `# 小螃蟹Z涡流调平...` 那行注释，把它下面从 `#*# <---- SAVE_CONFIG ---->` 开始到文件末尾全部删掉。校准后 `SAVE_CONFIG` 会自动重新生成。

## 填写各块板子的 ID

```bash
~/klippy-env/bin/python ~/klipper/scripts/canbus_query.py can0   # 查 CAN 设备的 UUID
ls /dev/serial/by-id/                                            # 查 USB 设备的串口
```

| 板子 | 文件 | 要改的项 |
|---|---|---|
| 主板 | `modules/core/mainboard.cfg` | `[mcu]` 的 `canbus_uuid` |
| 工具头 | `modules/toolhead/tgl36v3.cfg` | `[mcu toolhead]` 的 `canbus_uuid` |
| 多热端扩展板 | `modules/multitool/multihotend.cfg` | `[mcu multihotend]` 的 `serial` |
