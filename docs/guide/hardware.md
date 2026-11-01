# 硬件清单

::: warning 不是通用配置
本仓库的配置按下面这台机器的硬件编写。引脚、方向、电流、行程、坐标、校准数据都对应这套硬件。换了主板、工具头、探针或机械结构，要按实物逐项修改。
:::

## 整机

| 项目 | 规格 | 说明 |
|---|---|---|
| 机型 | Voron R2，打印尺寸 300×300 | 单头、多头共用一套配置 |
| 结构 | CoreXY，三 Z 升降热床（Trident 式） | `kinematics: corexy`，三点调平 `[z_tilt]` |
| 行程 | X 0～290，Y 0～300，Z -3～250 | X、Y 限位在最大端；多头时 Y 允许负值（停靠坞在热床前方） |
| 热床 | 约 300×300，加热 PA10，热敏 Generic 3950（PC2），最高 120°C | |
| 上位机 | Klipper + Moonraker + Mainsail / Fluidd，CAN 网络 | |

## 电子部分

| 部件 | 型号 / 规格 | 连接 | 用途 |
|---|---|---|---|
| 主板 | TGL 主板，STM32F446 | CAN（也可 USB） | X/Y/Z/Z1/Z2 五路 TMC2209（UART）、热床 |
| 工具头板 | TGL36V3.0 CAN 板，STM32F072 | CAN | 挤出机 TMC2209、模型风扇（PA1）、喉管风扇（PA0）、RGB、X 限位（PA3）、LIS2DW 加速度计（SPI2） |
| 涡流探针 | 小螃蟹扫床线圈，LDC1612 | 工具头板软件 I2C（PB6/PB7） | Z 虚拟限位、三点调平、网床；探针在喷嘴后方 20mm（`y_offset: 20`） |
| 多热端扩展板（仅多头） | STM32F072，8 路热端（T0～T7）+ 8 路停靠坞风扇 | USB | 各热端加热与热敏、停靠坞风扇 |
| 对刀线圈（仅多头） | 小螃蟹涡流对刀模块，LDC1612 | 主板软件 I2C（PA8/PC9） | 测各热端 XY 偏移 |

## 机械与打印头

| 部件 | 规格 |
|---|---|
| XY 传动 | 2GT 20 齿同步轮（`rotation_distance: 40`），32 细分 |
| Z 传动 | 64:16 减速（`gear_ratio: 64:16`，`rotation_distance: 32`），32 细分 |
| 挤出机（单头） | 50:10 减速，`rotation_distance: 22.23`，16 细分 |
| 换头机构（仅多头） | CxChanger 磁吸停靠坞，当前 2 个热端（T0、T1） |

## 配置目录

```
config/                         # 整个目录部署到 ~/printer_data/config/
├── printer.cfg                 # 根文件：选择机型 + 最底部的 SAVE_CONFIG 数据
├── profile_singletool.cfg      # 机型清单：单头
├── profile_multitool.cfg       # 机型清单：多头
└── modules/
    ├── core/                   # 主板、三 Z、热床、通用功能
    ├── toolhead/               # TGL36V3 工具头
    ├── extruder/               # 单头挤出机与热端
    ├── probe/                  # 涡流探针 / Z 限位开关（二选一）
    ├── leveling/               # 三点调平、网床
    ├── macros/                 # 打印启停、日常维护（塞尺测试、振动补偿测试）
    └── multitool/              # 多头专用
```

模块的依赖和拔插规则见仓库里的 `config/README.md`。
