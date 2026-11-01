# 常见问题

## 启动与配置

| 现象 | 先检查 |
|---|---|
| `Include file '.../modules/...' does not exist` | `modules/` 没上传（网页上传不传文件夹）；多套了一层 `config/config/`；文件属主是 root。见 [部署配置](./install/deploy) |
| `Option 'xxx' is not valid` | 拔掉模块后残留了只属于它的设置，例如涡流的 SAVE_CONFIG 数据 |
| `SAVE_CONFIG ... conflicts with included value` | 要保存的参数（PID、`reg_drive_current` 等）写在被引用的模块文件里。PID 手动填写；`reg_drive_current` 在模块里注释掉 |
| 改了 `ldc1612.py` 不生效 | 要 `sudo systemctl restart klipper`，`FIRMWARE_RESTART` 不会重新加载 Python 文件 |
| `DigitalFilter require the SciPy module` | `ldc1612.py` 的 `data_rate` 改了，需要安装 SciPy |
| `SHAPER_CALIBRATE` 报缺少 numpy | `~/klippy-env/bin/pip install numpy` |
| `Must home axis first` | 先 `G28`；振动补偿用 `SHAPER_TEST` 宏会自动归零 |
| 打印中途 Klipper Shutdown | 在 `klippy.log` 中搜索 `Shutdown`，常见原因是 CAN 通讯超时或加热保护 |
| 每次打印完都提示 SAVE_CONFIG | 正常，打印前扫网床导致的，可以忽略。见 [网床](./debug/06-bed-mesh#为什么每次打印完都提示-save-config) |

## 探针与调平

| 现象 | 先检查 |
|---|---|
| 网床呈单方向倾斜 | 是否先执行了 `Z_TILT_ADJUST`；调平测点是否靠近热床边缘 |
| 每次重启后第一次调平高差很大 | 正常，Z 电机断电后热床会移位 |
| `Move out of range` | 坐标超出行程；校准时探针偏移会让喷嘴移到更靠前的位置 |
| tap 报 `insufficient lift` 或 `insufficient slope delta` | `max_z_accel` 太小（要 200）；`ldc1612.py` 三处修改是否都做了 |
| tap 结果分散（极差 > 0.05mm） | `data_rate` 要 250；热机、清洁喷嘴后重新校准涡流 |
| `Tap not configured` | 还没有 `tap_threshold`，先做 tap 阈值校准 |
| `M109` / 对刀卡在"等温中" | 热端 PID 未校准，温度在目标附近摆动 |

## 打印质量

| 现象 | 原因 | 处理 |
|---|---|---|
| 首层线条之间有缝，线是圆的 | Z 偏高 | babystep 往下调，`Z_OFFSET_APPLY_PROBE` 后保存。见 [第一层](./debug/08-extrusion#_2-第一层) |
| 首层一部分好、一部分有缝 | 床面各处高度不一致 | 确认调平、网床生效；热床热透后重新扫床 |
| 侧壁又亮又糊、像融化流挂，转角翘起 | 模型风扇不转或风量不够 | `M106 S255` 检查风扇；查插反、正负极、电压。见 [基础检查](./debug/01-first-boot#模型风扇) |
| 小件侧壁糊，大件正常 | 每层时间太短，热量积累 | 最小层时间 8～10 秒；一次多放几个件；喷嘴温度降到 205°C |
| 只有一面好，其它面差 | 风只吹到一侧 | 检查风道方向，考虑双侧风扇 |
| 侧壁波纹、转角后有振纹 | 没做振动补偿或加速度过高 | [振动补偿](./debug/07-input-shaper)，`max_accel` 不超过建议值 |
| 侧壁规律横纹（Z banding） | Z 机械问题 | Z 皮带松紧、皮带轮顶丝、Z 电机电流 |
| 每层外圈比里面高、顶面外圈有台阶 | 填充 / 顶面出料不足，或压力提前太小 | 最大体积速度 12～15 mm³/s、顶面速度 80～120mm/s、校准压力提前和流量比 |
| 底部边角离开热床（翘边） | 首层没压实、首层吹风、热床脏 | 压低首层；首层风扇 0%；酒精擦热床；加 brim |
| 转角堆料、鼓起 | 压力提前太小 | 校准压力提前 |
| 整体挤出不足（各处都稀） | `rotation_distance` 不准、流量比低、温度低 | 先测 100mm 挤出，再校准流量比 |

## Git

| 现象 | 处理 |
|---|---|
| 变更列表里出现一大堆文件 | 检查是否有未忽略的目录（例如 `.claude/`、`node_modules/`），加到 `.gitignore` |
| 文件只有换行符不同也显示修改 | 仓库已用 `.gitattributes` 约束 LF；Windows 上 `git config --global core.autocrlf false` |
