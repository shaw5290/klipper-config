# Klipper 配置合并文档

## 目录
- 模块 1：入口配置（printer.cfg、myvariables.cfg）
- 模块 2：主配置（单工具）（singletool/printer.cfg）
- 模块 3：工具头（singletool/toolhead-tgl36v3.cfg、singletool/toolhead.cfg）
- 模块 4：通用配置（singletool/common.cfg）
- 模块 5：宏（singletool/macros.cfg）
- 模块 6：1. 全局变量（singletool/macros_vars.cfg）
- 模块 7：2. 打印启停流程（singletool/macros_print.cfg）
- 模块 8：3. 工具与偏移校准（singletool/tool_calibrate.cfg、singletool/xy对刀.cfg）
- 模块 9：4. Eddy 探针与网床（singletool/eddy_and_mesh.cfg、singletool/eddy_probe_z.cfg）
- 模块 10：5. 日常维护与调试（singletool/macros_maintenance.cfg）

---

## 模块 1：入口配置

### `printer.cfg`

```ini
#单热端
[include singletool/printer.cfg]

#多热端
# [include multitool/printer.cfg]

#临时测试
# [include temp-test/printer.cfg]



# 小螃蟹Z涡流调平(配置要添加到根目录的printer.cfg,否则不生效)

#*# <---------------------- SAVE_CONFIG ---------------------->
#*# DO NOT EDIT THIS BLOCK OR BELOW. The contents are auto-generated.
#*#
#*# [probe_eddy_current eddy_probe]
#*# reg_drive_current = 24
#*# calibrate =
#*# 	0.050000:6327929.149,0.090000:6313325.079,0.130000:6297200.024,
#*# 	0.170000:6283199.909,0.210000:6268026.813,0.250000:6254806.385,
#*# 	0.290000:6240317.302,0.330000:6227780.710,0.370000:6214267.336,
#*# 	0.410000:6202409.267,0.450000:6189359.935,0.490000:6178031.266,
#*# 	0.530000:6165856.929,0.570000:6155205.342,0.610000:6143464.003,
#*# 	0.650000:6133301.701,0.690000:6122321.024,0.730000:6112712.259,
#*# 	0.770000:6102182.353,0.810000:6093043.559,0.850000:6083143.755,
#*# 	0.890000:6074427.576,0.930000:6064836.157,0.970000:6056589.152,
#*# 	1.010000:6047553.615,1.050000:6039643.784,1.090000:6030919.575,
#*# 	1.130000:6023418.628,1.170000:6015212.368,1.210000:6008057.296,
#*# 	1.250000:6000053.875,1.290000:5993145.070,1.330000:5985605.938,
#*# 	1.370000:5978961.426,1.410000:5971553.910,1.450000:5965086.795,
#*# 	1.490000:5958038.805,1.530000:5951823.397,1.570000:5944850.467,
#*# 	1.610000:5938775.329,1.650000:5932033.562,1.690000:5926117.584,
#*# 	1.730000:5919471.234,1.770000:5913648.701,1.810000:5907255.342,
#*# 	1.850000:5901540.713,1.890000:5895205.545,1.930000:5889668.583,
#*# 	1.970000:5883604.005,2.010000:5878191.766,2.050000:5872166.134,
#*# 	2.090000:5866907.919,2.130000:5861155.838,2.170000:5856030.969,
#*# 	2.210000:5850344.327,2.250000:5845413.017,2.290000:5839967.686,
#*# 	2.330000:5835188.409,2.370000:5829847.673,2.410000:5825238.847,
#*# 	2.450000:5820139.566,2.490000:5815667.682,2.530000:5810690.969,
#*# 	2.570000:5806363.512,2.610000:5801584.174,2.650000:5797414.100,
#*# 	2.690000:5792771.108,2.730000:5788699.793,2.770000:5784234.340,
#*# 	2.810000:5780363.331,2.850000:5776036.141,2.890000:5772271.760,
#*# 	2.930000:5768125.577,2.970000:5764495.241,3.010000:5760464.221,
#*# 	3.050000:5756937.078,3.090000:5753054.852,3.130000:5749701.563,
#*# 	3.170000:5745919.355,3.210000:5742657.716,3.250000:5739075.159,
#*# 	3.290000:5735950.730,3.330000:5732438.438,3.370000:5729392.786,
#*# 	3.410000:5726032.127,3.450000:5723107.801,3.490000:5719837.745,
#*# 	3.530000:5716987.176,3.570000:5713873.238,3.610000:5711132.812,
#*# 	3.650000:5708104.598,3.690000:5705431.153,3.730000:5702530.944,
#*# 	3.770000:5699970.034,3.810000:5697118.113,3.850000:5694638.827,
#*# 	3.890000:5691930.216,3.930000:5689541.751,3.970000:5686900.933,
#*# 	4.010000:5684591.734,4.050000:5682070.164
```

### `myvariables.cfg`

```ini
[Variables]
current_tool = 0
tc_total_count = 57
tc_total_daily = [{'date': '2026-09-12', 'count': 0}, {'date': '2026-09-13', 'count': 0}, {'date': '2026-09-14', 'count': 8}, {'date': '2026-09-15', 'count': 0}, {'date': '2026-09-16', 'count': 0}, {'date': '2026-09-17', 'count': 0}, {'date': '2026-09-18', 'count': 8}]
tc_total_elapsed = 646.372927
tc_total_heat_wait = 0.003992
tc_total_pickup = 321.965624
tc_total_release = 318.568779

```

---

## 模块 2：主配置（单工具）

### `singletool/printer.cfg`

```ini
#单热端
# [include toolhead.cfg]
[include toolhead-tgl36v3.cfg]
[include common.cfg]
[include macros.cfg]
[include macros_vars.cfg]        # 1. 全局变量
[include macros_print.cfg]       # 2. 打印启停流程
[include tool_calibrate.cfg]     # 3. 工具与偏移校准
[include eddy_and_mesh.cfg]      # 4. Eddy 探针与网床
[include macros_maintenance.cfg] # 5. 日常维护与调试

[mcu]
# serial: /dev/serial/by-id/usb-Klipper_stm32f446xx_0C001F001850344D30353320-if00       # usb固件连接时开启这一行
canbus_uuid: 63e174b3ddf4      # can固件连接时开启这一行，并填写uuid


# [include CrabZ.cfg]
#####################################################################
#           机器结构、最大加速度、速度等等配置  根据自己需要来配置
#####################################################################

[printer]
# kinematics: none
# max_velocity: 1000
# max_accel: 1000
kinematics: corexy     # corexy结构，普通结构（笛卡尔坐标系）填cartesian
max_z_velocity: 10      # z轴限制最大速度
max_z_accel: 50       # z轴限制最大加速度
max_velocity: 500       # xy最大速度
max_accel: 10000        # xy最大加速度



[stepper_x]
step_pin: PC8                    # step端口
dir_pin: !PC7                   # 电机运动方向定义，如果发现方向相反在前加！，例如本来是PA1发现反向那就改成!PA1
enable_pin: !PC13                 # 不要动！！！
microsteps: 32                    # 细分
rotation_distance: 40             # 主动轮周长mm（2GT-20齿同步轮=40，2GT-16齿同步轮=32）
full_steps_per_rotation: 200      # 步进电机转一圈需要的步数（1.8度电机:360/1.8=200，0.9度电机:360/0.9=400）
position_min: 0                   # 行程最小位置的坐标
position_max: 290                 # 行程最大位置的坐标
position_endstop: 290               # 限位开关触发位置的坐标
homing_speed: 100                  # 归零速度
homing_retract_dist: 5            # 第一次回原点后，后退的距离 
second_homing_speed: 5            # 第二次回原点的速度
homing_positive_dir: true        # 复位方向（一般不需要改动）
# endstop_pin: ^!PC3               # 限位开关PIN
endstop_pin: ^toolhead:PA3               # 限位开关PIN


[stepper_y]
step_pin: PD2                   # step端口 
dir_pin: PC12                   # 电机运动方向定义，如果发现方向相反在前加！，例如本来是PA1发现反向那就改成！PA1
enable_pin: !PC13                 # en端口# 不要动！！！
microsteps: 32                    # 细分
rotation_distance: 40             # 主动轮周长mm（2GT-20齿同步轮=40，2GT-16齿同步轮=32）
full_steps_per_rotation: 200      # 步进电机转一圈需要的步数（1.8度电机:360/1.8=200，0.9度电机:360/0.9=400）
position_min: 0                 # 行程最小位置的坐标
position_max: 300                # 行程最大位置的坐标
position_endstop: 300          # 限位开关触发位置的坐标
homing_speed: 100                 # 复位速度
homing_retract_dist: 5          # 第一次回原点后，后退的距离 
second_homing_speed: 5           # 第二次回原点的速度
homing_positive_dir: true        # 复位方向（一般不需要改动）
endstop_pin: ^PC1                # 限位PIN

[safe_z_home]
home_xy_position: 125, 125   # 热床中心坐标
speed: 100                   # 移动到中心的速度（mm/s）
z_hop: 0                    # 归位前Z轴抬升高度（mm）
z_hop_speed: 5               # Z轴抬升速度（mm/s）

[stepper_z]
step_pin: PA15                            #step端口
dir_pin: PB5                        #电机运动方向定义，如果发现方向相反在前加！，例如本来是PA1发现反向那就改成！PA1
enable_pin: !PC13                    # 不要动！！！
rotation_distance: 32                   #电机旋转一圈Z轴移动的距离，例如T8丝杆的导程是8mm，即丝杆转一圈螺母移动8mm
microsteps: 32                         #步进电机使用的细分数
full_steps_per_rotation: 200            #电机旋转一圈需要的步数，例如1.8度电机为360/1.8=200
gear_ratio: 64:16                     #传动比
endstop_pin: probe:z_virtual_endstop                   #引脚触发限位
# endstop_pin:^PA0                     #设置Z轴为虚拟限位，使用接近开关需要开启此项
position_min: -3                        #Z轴可移动的最小值
# position_endstop: 0                 #限位的位置，使用接近开关无需开启此项
position_max: 250                       #Z轴可移动的最大值
homing_speed: 30                          #Z轴回零速度
homing_retract_dist: 2                #第一次碰到限位回缩距离
homing_retract_speed: 10                  #第一次碰到限位回缩时候的速度
second_homing_speed: 2                  #第二次去触发限位时候的速度
#homing_positive_dir: true


[stepper_z1]
step_pin: PA4                 #驱动步进脚
dir_pin: PA3                  #驱动方向引脚，如果发现方向相反在前加！，例如本来是PA1发现反向那就改成！PA1
enable_pin:!PC13               # 不要动！！！
#endstop_pin: ^!PE6           #引脚触发限位，多个Z轴多个限位才需开启此项
gear_ratio: 64:16                     #传动比
rotation_distance: 32           #电机旋转一圈Z轴移动的距离，例如T8丝杆的导程是8mm，即丝杆转一圈螺母移动8mm
microsteps: 32                  #步进电机使用的细分数
full_steps_per_rotation: 200    #电机旋转一圈需要的步数，例如1.8度电机为360/1.8=200
#gear_ratio: 1:1                #传动比

[stepper_z2]
step_pin:PB0                     #驱动步进脚
dir_pin: PC5                    #驱动方向引脚，如果发现方向相反在前加！，例如本来是PA1发现反向那就改成！PA1
enable_pin: !PC13              # 不要动！！！
gear_ratio: 64:16                     #传动比
rotation_distance: 32            #电机旋转一圈Z轴移动的距离，例如T8丝杆的导程是8mm，即丝杆转一圈螺母移动8mm
microsteps: 32                   #步进电机使用的细分数
full_steps_per_rotation: 200     #电机旋转一圈需要的步数，例如1.8度电机为360/1.8=200
#gear_ratio: 1:1                 #传动比


#####################################################################
#   TMC2209 驱动配置   没有静音驱动 要全部注释掉
#####################################################################
[tmc2209 stepper_x]
uart_pin: PC6               #RX
run_current: 0.800          #电机电流
hold_current: 0.600         #电机静态力矩保持电流值
sense_resistor: 0.110       #驱动采样电阻值（不要修改）
stealthchop_threshold: 0     #改成0可跑高速，但电机会有电流声，改成99999可静音但不能跑高速，否则会丢步或者嘎嘎响

[tmc2209 stepper_y]
uart_pin: PB3               #RX
run_current: 0.800          #电机电流
hold_current: 0.600         #电机静态力矩保持电流值
sense_resistor: 0.110       #驱动采样电阻值（不要修改）
stealthchop_threshold: 0    #改成0可跑高速，但电机会有电流声，改成99999可静音但不能跑高速，否则会丢步或者嘎嘎响

[tmc2209 stepper_z]
uart_pin: PB6               #RX
interpolate: True           #开启插值=256细分
run_current: 0.400          #电机电流
hold_current: 0.200         #电机静态力矩保持电流值
sense_resistor: 0.110       #驱动采样电阻值（不要修改）
stealthchop_threshold: 99999   #改成0可跑高速，但电机会有电流声，改成99999可静音但不能跑高速，否则会丢步或者嘎嘎响

# [tmc2209 extruder]
# uart_pin: PC15               #RX
# interpolate: True
# run_current: 0.500
# hold_current: 0.200
# sense_resistor: 0.110
# stealthchop_threshold: 99999  #改成0可跑高速，但电机会有电流声，改成99999可静音但不能跑高速，否则会丢步或者嘎嘎响

[tmc2209 stepper_z1]
uart_pin: PB1               #RX
interpolate: True           #开启插值=256细分
run_current: 0.400          #电机电流
hold_current: 0.200         #电机静态力矩保持电流值
sense_resistor: 0.110       #驱动采样电阻值（不要修改）
stealthchop_threshold: 99999   #改成0可跑高速，但电机会有电流声，改成99999可静音但不能跑高速，否则会丢步或者嘎嘎响

[tmc2209 stepper_z2]
uart_pin: PC4               #RX
interpolate: True           #开启插值=256细分
run_current: 0.400          #电机电流
hold_current: 0.200         #电机静态力矩保持电流值
sense_resistor: 0.110       #驱动采样电阻值（不要修改）
stealthchop_threshold: 99999   #改成0可跑高速，但电机会有电流声，改成99999可静音但不能跑高速，否则会丢步或者嘎嘎响



#####################################################################
#           挤出机配置  根据自己需要来配置
#####################################################################

# [extruder]
# step_pin: PB7                      
# dir_pin:   PB10                    # 电机运动方向定义，如果发现方向相反在前加！，例如本来是PA1发现反向那就改成！PA1
# enable_pin: !PC13                  # 不要动！！！
# microsteps: 32                       #驱动 细分数
# rotation_distance: 22.987            #挤出机旋转一圈挤出的长度
# gear_ratio: 50:10                    #挤出机齿轮减速比
# nozzle_diameter: 0.400               #喷嘴直径
# filament_diameter: 1.750             #耗材直径
# heater_pin: PA9                      #加热引脚
# max_power: 0.5                       #加热头的最大功率，如果你的电源额定功率非常低，那可以用0.3或0.5，但是会加热的慢
# sensor_type: Generic 3950            #温度传感器的类型
# sensor_pin: PA3                      #ADC引脚
# pullup_resistor: 4700                #与热敏接入电路中的上拉电阻
# #smooth_time: 1                      #使用多久时间内测得多组数据的平均温度当温度值
# control: pid                         #温控算法pid 或者 watermark
# pid_kp = 33.423
# pid_ki = 2.476
# pid_kd = 112.803                     #pid结束
# # min_extrude_temp: 170                #挤出机能挤出的最小温度
# min_extrude_temp: -110                #挤出机能挤出的最小温度
# min_temp: -273                       #打印机能运作的最低温度，调试时候可以给-273，正常使用不建议低于-10度
# max_temp: 300                        #挤出加热棒的最大温度，超过此温度将紧急停机
# max_extrude_cross_section:30          # 最大挤出截面积（mm²）



[pause_resume]
[display_status]


# #允许未回零操作电机(支持手动移动步进电机进行诊断。)
[force_move]
enable_force_move: true

# #开机后设定当前位置（解锁保护）
[delayed_gcode KINEMATIC_POSITION]
initial_duration:0.2
gcode:
  SET_KINEMATIC_POSITION



#####################################################################
#   热敏配置  根据自己需要来配置 
#####################################################################

# [temperature_sensor 热敏3]
# sensor_type: Generic 3950
# sensor_pin: PA2

# [temperature_sensor 热敏4]
# sensor_type: Generic 3950
# sensor_pin: PA1

# [temperature_sensor TGL-Can6主板核心温度]
# sensor_type: temperature_mcu
# sensor_mcu: mcu
# min_temp: 10                 #最小温度
# max_temp: 100                #最大温度

# [temperature_sensor 上位机]          #pi的温度显示
# sensor_type: temperature_host
# min_temp: 10                        #温度小
# max_temp: 100                       #温度大


#####################################################################
#           热床配置
#####################################################################

[heater_bed]
heater_pin: PA10                #加热引脚
max_power: 1                  #加热头的最大功率，如果你的电源额定功率非常低，那可以用0.3或0.5，但是会加热的慢
sensor_type: Generic 3950     #温度传感器的类型
sensor_pin: PC2             #ADC引脚
pullup_resistor: 4700         #与热敏接入电路中的上拉电阻
# min_temp: -273                  #打印机能运作的最低温度，调试时候可以给-273，正常使用不建议低于-10度
min_temp: -10                  #打印机能运作的最低温度，调试时候可以给-273，正常使用不建议低于-10度
max_temp: 120                 #最大温度，超过此温度将紧急停机
control: pid
pid_kp = 62.922
pid_ki = 0.539
pid_kd = 1835.747  


#####################################################################
#   探头配置选项
#####################################################################

# [probe]
# pin: ^!PA13
# x_offset: 20.7
# y_offset: 6.5
# # z_offset: 0.00
# speed: 5.0
# samples: 4
# #   Number of times to probe a point
# sample_retract_dist: 6.0
#   #How far to retract (in mm) from the probe point for multi-probe samples

# 三点调平
[z_tilt]
# 1. 300x300 Trident 3根丝杆物理中心坐标
z_positions:
  -6.5, -2        # 左前丝杆 (stepper_z)
  150, 350       # 后中丝杆 (stepper_z1)
  335, -2        # 右前丝杆 (stepper_z2)

# 2. 采样点坐标（已避让 Eddy y_offset: 20 偏移，防止越界）
points:
  40, 40         # 左前采样点 (喷嘴在 X:40, Y:20)
  150, 260       # 后中采样点 (喷嘴在 X:150, Y:240)
  260, 40        # 右前采样点 (喷嘴在 X:260, Y:20)

speed: 150       # 建议改为 150，400 太快容易导致 Z 轴电机丢步
horizontal_move_z: 10
retry_tolerance: 0.0075
retries: 20      # 关键修正：不能设为 0，设为 0 会直接跳过重试修正

# 网床补偿
[bed_mesh]
speed: 150
horizontal_move_z: 2          # 小螃蟹涡流扫床抬升高度 2mm 即可
mesh_min: 25, 25              # 核心修改：Y轴坐标必须 ≥ 25 (留出 20mm 偏移量)
mesh_max: 275, 275            # 右上角安全边界
probe_count: 7, 7             # 涡流支持高密度网床，建议 7x7 或 9x9
algorithm: bicubic
scan_overshoot: 8             # 涡流极速扫床的端点缓冲距离



```

---

## 模块 3：工具头

### `singletool/toolhead-tgl36v3.cfg`

```ini
### ------------------- 配置文件基本信息 -------------------
# 本配置文件为TGL36V3.0 CAN板配置
# 根据设备实际情况修改参数v3
# 强烈建议基于此原始文件修改（避免格式错误）
# 技术交流QQ群：1135321960（配置文件更新/问题答疑）
# 重要提示：需注释printer.cfg中以下配置防止冲突
#   1. 挤出机（[extruder]）
#   2. 喉管风扇（[heater_fan hotend_fan]）
#   3. 模型冷却风扇（[fan_generic model_fan]）

### ------------------- CAN桥接配置（可选）-------------------
# 若使用U2C桥接CAN板，取消注释并填写U2C的CAN_UUID
# [mcu UTC]
# canbus_uuid:5ab4ce4459a8  # 填写U2C的CAN UUID
#########################can板的id############################
[mcu toolhead]
# canbus_uuid: 8e56b85dad38 # 请填写CAN板的唯一标识符（通过`~/klippy-env/bin/python ~/klipper/scripts/canbus_query.py can0`查询）
# serial:  /dev/serial/by-id/usb-Klipper_stm32f072xb_1D003E000751534B38323120-if00
canbus_uuid: 02ae2f8018ca      # can固件连接时开启这一行，并填写uuid
 
 

### ------------------- 限位开关扩展配置 -------------------
# 若需将X限位接到CAN板，取消注释并修改：
[stepper_x]
endstop_pin:^toolhead:PA3  # X限位信号引脚（^表示上拉，!表示反向电平）

### ------------------- 探头配置 -------------------
# 若需将接触式探头接到CAN板，取消注释并修改：
# [probe]
# pin:^!toolhead:PA7  # 探头触发信号引脚

### ------------------- 挤出机核心配置 -------------------
[extruder]
step_pin:toolhead:PB3  # 步进脉冲信号引脚（高电平触发运动）
dir_pin:!toolhead:PA15   # 方向控制引脚（!表示方向逻辑反转）
enable_pin:!toolhead:PB5 # 电机使能引脚（低电平有效） 
microsteps:16  # 细分设置（精度调整，常见值16/32/64）
rotation_distance:22.23 # 挤出机每转挤料距离（mm/rev）
#full_steps_per_rotation:200  # 电机固有参数（42步进电机一般为200）

# 系统传动比例（输入齿轮齿数:输出齿轮齿数）
gear_ratio:50:10 # BMG减速比配置（输入轴50齿，输出轴10齿）
filament_diameter:1.75 # 线材直径（影响流量计算，务必准确）
heater_pin:toolhead:PA6 # 加热棒控制引脚（MOSFET驱动）
sensor_type:Generic 3950 # 热敏传感器型号（常见型号：EPCOS 100K B=3950）
sensor_pin:toolhead:PA4  # 热敏传感器信号引脚（需接上拉电阻）

# 喷嘴参数
nozzle_diameter:0.400 # 喷嘴直径（影响挤出量计算）
max_power:1 # 加热棒最大功率比例（0~1范围）

# 温度控制安全限制
min_extrude_temp:-119 # 允许挤出的最低温度（-120表示禁用保护）
min_temp:-120 # 最低温度告警阈值
max_temp:300  # 最高温度保护阈值

# PID自动调谐参数（需通过`PID_CALIBRATE`命令校准）
control:pid 
pid_Kp:32.031 # 比例系数（响应速度）
pid_Ki:13.347 # 积分系数（消除稳态误差）
pid_Kd:19.218 # 微分系数（抑制超调）

# 流量控制参数
pullup_resistor:4700  # 热敏上拉电阻阻值（单位：Ω）
max_extrude_cross_section:30 # 最大挤出截面积（mm²）
max_extrude_only_distance:1000 # 单次挤出最大长度（毫米）
pressure_advance:0.03 # 压力提前补偿系数（需通过测试调整）
pressure_advance_smooth_time:0.040 # 压力补偿平滑时间（秒）

### ------------------- TMC2209步进驱动配置 -------------------
[tmc2209 extruder]
uart_pin:toolhead:PB4  # 驱动芯片UART通信引脚
run_current:0.4 # 运行电流（单位：A，需小于电机额定值）
hold_current:0.200  # 保持电流（通常设为运行电流的50%）
sense_resistor:0.110  # 驱动采样电阻阻值（单位：Ω，需与实际硬件匹配）
stealthchop_threshold:999999 # 静音模式速度阈值（设为极大值表示始终启用静音模式）

### ------------------- 仓温度监测 -------------------
[thermistor ntc]  
temperature1:25 # 参考温度点1（单位：℃）
resistance1:10000 # 温度1对应的阻值（单位：Ω）
beta:3435 # B值（热敏灵敏度参数）

[temperature_sensor 仓温]
sensor_type:ntc # 传感器类型（与上方thermistor配置对应）
sensor_pin:toolhead:PB0 # 温度传感器信号引脚

### ------------------- 冷却系统配置 -------------------
[fan] # 模型冷却风扇（风扇1）
pin:toolhead:PA1 # 控制引脚（PWM驱动）

[heater_fan hotend_fan] # 喉管冷却风扇（风扇2）
pin:toolhead:PA0 # 控制引脚
max_power:1 # 最大功率（0~1）
kick_start_time:0.5 # 启动加速时间（秒，防堵转）
heater:extruder # 关联的加热器（温度≥50℃自动启动）
heater_temp:50.0  # 风扇启动温度阈值
fan_speed:1 # 全速运行时的速度比例
shutdown_speed:1  # 紧急停止时保持全速冷却（防止热端积料）

### ------------------- RGB状态灯配置 -------------------
[neopixel RGB] 
pin:toolhead:PA14  # WS2812信号引脚
chain_count:1 # LED灯珠数量
color_order:GRB # 灯珠色序（GRB为常见型号排序）
initial_RED:0.05  # 开机默认红色亮度（0~1范围）
initial_GREEN:0 # 绿色初始亮度
initial_BLUE:0.00 # 蓝色初始亮度

### ------------------- 振动补偿配置 -------------------
[lis2dw]  # LIS2DW12三轴加速度计
cs_pin:toolhead:PB12 # 片选信号引脚
spi_bus:spi2   # 使用的SPI总线
axes_map:x,z,y   # 加速度计轴向映射（根据安装方向调整）

[resonance_tester] # 共振测试器
accel_chip:lis2dw  # 指定使用的加速度计
probe_points:
 75,75,20 # 测试点位坐标（X,Y,Z，需在打印平台中心区域）

### ------------------- CAN板温度监控 -------------------
[temperature_sensor toolhead温度]
sensor_type:temperature_mcu # 直接读取MCU温度
sensor_mcu:toolhead  # 关联的MCU名称
min_temp:0 # 最低报警温度（避免冷凝误报）
max_temp:100 # 最高报警温度（防止过热损坏）





# 先改klippy/extras/ldc1612.py 代码, 把 self.set_reg(REG_ERROR_CONFIG, (0x1f << 11) | 1) 把0x1f改成0x1c, 把SETTLETIME=0.005改为 0.0002
# 校准驱动电流: LDC_CALIBRATE_DRIVE_CURRENT CHIP=eddy_probe
# 校准频率高度对应关系: PROBE_EDDY_CURRENT_CALIBRATE CHIP=eddy_probe
# tap模式设置自动Z偏移: SET_Z_FROM_PROBE METHOD=tap
# tap模式下probe单点精度测试: PROBE_ACCURACY METHOD=tap
# 无接触模式下probe单点精度测试: PROBE_ACCURACY
# 2025-05-02更新 tap阈值自动寻找: 
# 1.tap阈值粗略校准 PROBE_EDDY_CURRENT_TAP_CALIBRATE TAP=guess
# 2.tap阈值精确校准 PROBE_EDDY_CURRENT_TAP_CALIBRATE TAP=refine
# 3.tap阈值验证,最后保存就可以了 PROBE_EDDY_CURRENT_TAP_CALIBRATE TAP=verify
# 4.tap阈值手动寻找: PROBE_ACCURACY METHOD=tap tap_threshold=40000

# 启用 M118 echo 命令, RESPOND命令支持
[respond]

# 启用强制移动命令, SET_KINEMATIC_POSITION支持
[force_move]
enable_force_move: true

[probe_eddy_current eddy_probe]
sensor_type: ldc1612
i2c_address: 42
i2c_mcu: toolhead
frequency: 40000000
i2c_speed: 400000
# i2c_bus: i2c1
i2c_software_scl_pin: toolhead:PB6
i2c_software_sda_pin: toolhead:PB7
# reg_drive_current: 25      #驱动电流, 直接写死不用校准, 改klippy/extras/ldc1612.py代码, 1: SETTLETIME = 0.0002 2: self.set_reg(REG_ERROR_CONFIG, (0x1c << 11) | 1)
x_offset: 0                  #记得设置x偏移
y_offset: 20                 #记得设置y偏移
descend_z: 2                 #原来是z_offset 无接触探测时停止的高度
max_sensor_hz: 7000000       #2026-05-12新增参数, 指定线圈最大频率
speed: 5                     #探测速度
samples: 3                   #采样次数
sample_retract_dist: 5.0     #采样时喷嘴抬升距离
samples_tolerance: 0.05
samples_tolerance_retries: 3
# tap_threshold: 45598.639   #tap模式阈值参数,单位为Hz/mm, 默认是0, 表示禁用tap功能, 至少大于测量噪声的两倍, 阈值低了会在半空停止, 2026=05-02更新自动tap阈值测量, 这个注释掉
tap_z_offset: 0              #间隙调整, klipper最新更新的参数, 咱们还是用 position_endstop 来调整间隙方便点

#集成线圈的加速度计配置
# [lis2dw]
# i2c_address: 25
# i2c_mcu: toolhead
# # i2c_bus: i2c1
# i2c_speed: 400000   # 如果mcu占用率太高,可以调大I2C速度
# i2c_software_scl_pin: toolhead:PA6
# i2c_software_sda_pin: toolhead:PA7
# [resonance_tester]
# accel_chip: lis2dw
# accel_per_hz: 50
# probe_points: 100, 100, 20

# 板载AHT20温度传感器配置, 需要升级到最新版的klipper版本才能用
# 低主频mcu就不要用了, 会增加打印过程中的不稳定因素
# [temperature_probe eddy_probe]
# horizontal_move_z: 2
# sensor_type: AHT2X
# i2c_mcu: toolhead
# i2c_speed: 400000
# i2c_address: 56
# i2c_software_scl_pin: toolhead:PA6
# i2c_software_sda_pin: toolhead:PA7
# aht10_report_time: 5 # 温度报告时间间隔, 最低为5秒
```

### `singletool/toolhead.cfg`

```ini
[mcu toolhead]
# canbus_uuid: 618a11e32f2d # 367d30bc91fc##5ca7331b5052 # 在此处填写主板的CAN ID
canbus_uuid: b6ac56b6e0c4      # can固件连接时开启这一行，并填写uuid
[extruder]
step_pin: toolhead:PB3 
dir_pin: !toolhead:PA15 
enable_pin: !toolhead:PB5 
microsteps: 16
rotation_distance: 22.23
#full_steps_per_rotation: 200
#减速比（BMG 齿轮比为 50：17，输出轴在前，输入轴在后）
gear_ratio: 50:10
filament_diameter: 1.75 
heater_pin: toolhead:PB11 
sensor_type: Generic 3950 
sensor_pin: toolhead:PA3
# 喷嘴直径
nozzle_diameter: 0.400 
# PWM 最大输出功率 
max_power: 1
# 最小挤出温度 
min_extrude_temp: -110 
control: pid
pid_Kp: 32.031
pid_Ki: 13.347
pid_Kd: 19.218
pullup_resistor: 4700
min_temp: -210
max_temp: 9999 
max_extrude_cross_section:30 
max_extrude_only_distance: 1000
pressure_advance: 0.03
pressure_advance_smooth_time: 0.040
[tmc2209 extruder] 
uart_pin: toolhead:PB7
run_current: 0.2 # 电机运行电流值
hold_current: 0.200 #电机静态力矩保持电流值
sense_resistor: 0.110
stealthchop_threshold: 999999
[thermistor ntc47k] 
temperature1:25 
resistance1:47000 
beta:4050
[temperature_sensor 仓温] 
sensor_type: ntc47k 
sensor_pin: toolhead:PB0
[fan] #风扇 1吹料风扇
pin: toolhead:PA1
# max_power: 0.25   # 限制80%功率
# kick_start_time: 1
[heater_fan hotend_fan] #风扇 2 ####喉管风扇
pin: toolhead:PA0
max_power: 1
kick_start_time: 0.5 
heater: extruder 
heater_temp: 50.0
## If you are experiencing back flow, you can reduce fan_speed
fan_speed: 1
shutdown_speed: 1
[neopixel RGB] #RGB
pin:toolhead:PB6 #这个表示主板引脚定义
chain_count:1 #这个表示灯珠数量量
color_order: GRB #这个表示 灯的通道 排列列⽅方式 不不⽅用管 
initial_RED: 0 #这个表示。红⼤色 灯开机默认值 最⼤大是 1 也就是最亮 
initial_GREEN: 0.1 #这个表示。绿⼤色 灯开机默认值 最⼤大是 1 也就是最亮 
initial_BLUE: 0 #这个表示。蓝⼤色 灯开机默认值 最⼤大是 1 也就是最亮

# [gcode_button 上按键]
# pin: ^!toolhead:PA15
# press_gcode:
# M109 S200
# G92 E0
# G1 E-10 F300 
# G92 E0
# #当按钮被按下时要执行的 G-Code 命令序列，支持G-Code 模板。
# #必须提供此参数。
# #release_gcode:
# #当按钮被释放时要执行的G-Code 命令序列，支持G-Code 模板。
# #默认在按钮释放时不运行任何命令。
# [gcode_button 下按键] 
# pin: ^!toolhead:PA16
# press_gcode:
# M109 S200
# G92 E0
# G1 E10 F300 
# G92 E0
# #当按钮被按下时要执行的 G-Code 命令序列，支持G-Code 模板。
# #必须提供此参数。
# #release_gcode:
# #当按钮被释放时要执行的G-Code 命令序列，支持G-Code 模板。
# #默认在按钮释放时不运行任何命令。
[lis2dw]
cs_pin: toolhead:PB12 
spi_bus: spi2 
axes_map: x,z,y
[resonance_tester] 
accel_chip: lis2dw 
probe_points:
# Somewhere slightly above the middle of your print bed
    75,75, 20 #做共振补偿的位置xyz
[temperature_sensor can 板温度] 
sensor_type: temperature_mcu 
sensor_mcu: toolhead
min_temp: -210 #最小温度
max_temp: 1000 #最大温度




# 先改klippy/extras/ldc1612.py 代码, 把 self.set_reg(REG_ERROR_CONFIG, (0x1f << 11) | 1) 把0x1f改成0x1c, 把SETTLETIME=0.005改为 0.0002
# 校准驱动电流: LDC_CALIBRATE_DRIVE_CURRENT CHIP=eddy_probe
# 校准频率高度对应关系: PROBE_EDDY_CURRENT_CALIBRATE CHIP=eddy_probe
# tap模式设置自动Z偏移: SET_Z_FROM_PROBE METHOD=tap
# tap模式下probe单点精度测试: PROBE_ACCURACY METHOD=tap
# 无接触模式下probe单点精度测试: PROBE_ACCURACY
# 2025-05-02更新 tap阈值自动寻找: 
# 1.tap阈值粗略校准 PROBE_EDDY_CURRENT_TAP_CALIBRATE TAP=guess
# 2.tap阈值精确校准 PROBE_EDDY_CURRENT_TAP_CALIBRATE TAP=refine
# 3.tap阈值验证,最后保存就可以了 PROBE_EDDY_CURRENT_TAP_CALIBRATE TAP=verify
# 4.tap阈值手动寻找: PROBE_ACCURACY METHOD=tap tap_threshold=40000

# 启用 M118 echo 命令, RESPOND命令支持
[respond]

# 启用强制移动命令, SET_KINEMATIC_POSITION支持
[force_move]
enable_force_move: true

[probe_eddy_current eddy_probe]
sensor_type: ldc1612
i2c_address: 42
i2c_mcu: toolhead
frequency: 40000000
i2c_speed: 400000
# i2c_bus: i2c1
i2c_software_scl_pin: toolhead:PB6
i2c_software_sda_pin: toolhead:PB7
# reg_drive_current: 25      #驱动电流, 直接写死不用校准, 改klippy/extras/ldc1612.py代码, 1: SETTLETIME = 0.0002 2: self.set_reg(REG_ERROR_CONFIG, (0x1c << 11) | 1)
x_offset: 0                  #记得设置x偏移
y_offset: 20                 #记得设置y偏移
descend_z: 2                 #原来是z_offset 无接触探测时停止的高度
max_sensor_hz: 7000000       #2026-05-12新增参数, 指定线圈最大频率
speed: 5                     #探测速度
samples: 3                   #采样次数
sample_retract_dist: 5.0     #采样时喷嘴抬升距离
samples_tolerance: 0.05
samples_tolerance_retries: 3
# tap_threshold: 45598.639   #tap模式阈值参数,单位为Hz/mm, 默认是0, 表示禁用tap功能, 至少大于测量噪声的两倍, 阈值低了会在半空停止, 2026=05-02更新自动tap阈值测量, 这个注释掉
tap_z_offset: 0              #间隙调整, klipper最新更新的参数, 咱们还是用 position_endstop 来调整间隙方便点

#集成线圈的加速度计配置
# [lis2dw]
# i2c_address: 25
# i2c_mcu: toolhead
# # i2c_bus: i2c1
# i2c_speed: 400000   # 如果mcu占用率太高,可以调大I2C速度
# i2c_software_scl_pin: toolhead:PA6
# i2c_software_sda_pin: toolhead:PA7
# [resonance_tester]
# accel_chip: lis2dw
# accel_per_hz: 50
# probe_points: 100, 100, 20

# 板载AHT20温度传感器配置, 需要升级到最新版的klipper版本才能用
# 低主频mcu就不要用了, 会增加打印过程中的不稳定因素
# [temperature_probe eddy_probe]
# horizontal_move_z: 2
# sensor_type: AHT2X
# i2c_mcu: toolhead
# i2c_speed: 400000
# i2c_address: 56
# i2c_software_scl_pin: toolhead:PA6
# i2c_software_sda_pin: toolhead:PA7
# aht10_report_time: 5 # 温度报告时间间隔, 最低为5秒
```

---

## 模块 4：通用配置

### `singletool/common.cfg`

```ini
[virtual_sdcard]
path: ~/printer_data/comms  # (根据您的系统路径调整，通常 Mainsail 默认是 ~/printer_data/gcodes)
path: ~/printer_data/gcodes

[exclude_object]

[display_status]


[gcode_macro PRINT_START]
gcode:
    # 获取切片软件传过来的参数
    {% set EXTRUDER_TEMP = params.EXTRUDER|default(200)|float %}
    {% set BED_TEMP = params.BED|default(0)|float %}
    
    # 打印前基础动作
    G28                    ; 归零
    G90                    ; 绝对坐标
    
    # 升温设定（由于您无热床，BED设为了0，这里只升喷头）
    M104 S{EXTRUDER_TEMP}  ; 设置喷头温度并继续
    M109 S{EXTRUDER_TEMP}  ; 等待喷头达到目标温度
    
    # 打印准备
    G92 E0                 ; 重置挤出机
    G1 Z5 F3000            ; 抬高 Z 轴
    G1 X10 Y10 F3000       ; 移到起始位
    ; 可以加一小段抽丝或擦拭动作（可选）
```

---

## 模块 5：宏

### `singletool/macros.cfg`

```ini
# 校准单个工具
# 调用示例: CALIBRATE_TOOL TOOL=1
# ---------------------------------------------------------
[gcode_macro CALIBRATE_TOOL]
description: 校准指定编号的单个工具（加热、探测Z、测XY偏移并保存）
gcode:
    {% set tool = params.TOOL|default(0)|int %}
    {% set vars = printer["gcode_macro _TOOL_CALIB_VARS"] %}

    G1 X{vars.safe_x} Y{vars.safe_y} Z{vars.safe_z} F9000
    T{tool}
    SET_GCODE_OFFSET X=0 Y=0 Z=0 MOVE=0
    G1 X{vars.safe_x} Y{vars.safe_y} Z{vars.safe_z} F9000
    M109 S150 T{tool}     # 加热到150度
    # CLEAN_NOZZLE # 看情况自己设置磨嘴, 要不然不准
    # 使用能够喷嘴限位的probe得到Z偏移
    PROBE METHOD=tap SAMPLES=3
    G1 X{vars.safe_x} Y{vars.safe_y} Z{vars.safe_z} F9000
    DO_CALIBRATE_TOOL TOOL={tool}
    _DO_SAVE_CALIB_RESULT TOOL={tool}
    M400   # 【关键】等待动作走完
    G90

[gcode_macro DO_CALIBRATE_TOOL]
description: 执行单个工具的涡流/XY偏移核心校准动作
gcode:
    {% set tool = params.TOOL|default(0)|int %}
    {% set probeZ = printer.probe.last_probe_position.z %}
    # 清除上次的中心点位置
    CLEAR_TOOL_CENTER TOOL={tool}
    # 设置 使用喷嘴限位的probe探测到的Z位置
    SET_TOOL_Z TOOL={tool} Z={probeZ}
    {% set tool0ProbeZ = 0.0 %}
    {% if '0' in printer["tool_eddy_calibration calibrator_xy"] %}
      {% set tool0ProbeZ = printer["tool_eddy_calibration calibrator_xy"]["0"].z %}
    {% endif %}
    # 进行XY偏移校准, 设置一个相对于tool0的z偏移, 避免喷嘴碰到线圈
    TOOL_EDDY_CALIBRATE TOOL={tool} DIR=0,90 PAIR_CANCEL=0 SCAN_HEIGHT_OFFSET={probeZ-tool0ProbeZ}

[gcode_macro _DO_SAVE_CALIB_RESULT]
description: 保存当前工具的校准偏移结果到变量中（内部宏）
gcode:
    {% set tool = params.TOOL|int %}
    {% set res0 = printer["tool_eddy_calibration calibrator_xy"]["0"] %}
    {% set res = printer["tool_eddy_calibration calibrator_xy"][tool|string] %}
   
    {% if tool == 0 %}
        # T0 永远存 0
        SAVE_VARIABLE VARIABLE=t0_offset_x VALUE=0.0
        SAVE_VARIABLE VARIABLE=t0_offset_y VALUE=0.0
        SAVE_VARIABLE VARIABLE=t0_offset_z VALUE=0.0
        {action_respond_info("✅ T0 基准点坐标已锁定")}
    {% else %}
        # 其他工具存探测结果
        SAVE_VARIABLE VARIABLE=t{tool}_offset_x VALUE={(res.x-res0.x)|round(4)}
        SAVE_VARIABLE VARIABLE=t{tool}_offset_y VALUE={(res.y-res0.y)|round(4)}
        SAVE_VARIABLE VARIABLE=t{tool}_offset_z VALUE={(res.z-res0.z)|round(4)}
        {action_respond_info("✅ T" ~ tool ~ " 偏移量已自动保存")}
    {% endif %}

# ---------------------------------------------------------
# 批量校准所有工具
# ---------------------------------------------------------
[gcode_macro CALIBRATE_ALL_TOOLS]
description: 一键全自动批量校准所有配置的工具
gcode:
    {% set vars = printer["gcode_macro _TOOL_CALIB_VARS"] %}
    {action_respond_info("开始全自动工具校准流程...")}
    # 全部预加热到150度, 注意电源功率
    {% for t in range(0, vars.tool_count) %}
        M104 S150 T{t}
    {% endfor %}
    # 遍历所有工具 (range(0, N) 生成 0 到 N-1)
    {% for t in range(0, vars.tool_count) %}
        CALIBRATE_TOOL TOOL={t}
    {% endfor %}
    # 关闭加热
    {% for t in range(0, vars.tool_count) %}
        M104 S0 T{t}
    {% endfor %}
    untool
    {action_respond_info("所有工具校准完毕")}

# ---------------------------------------------------------
# 批量校准所有工具
# ---------------------------------------------------------
[gcode_macro CALIBRATE_ALL_TOOLS]
gcode:
    # 悬浮弹窗提示当前执行的方法名
    {action_respond_info("▶ [运行宏] 批量校准所有工具 (开始流程)")}
    
    {% set vars = printer["gcode_macro _TOOL_CALIB_VARS"] %}
    {action_respond_info("开始全自动工具校准流程...")}
    # 全部预加热到150度, 注意电源功率
    {% for t in range(0, vars.tool_count) %}
        M104 S150 T{t}
    {% endfor %}
    # 遍历所有工具 (range(0, N) 生成 0 到 N-1)
    {% for t in range(0, vars.tool_count) %}
        CALIBRATE_TOOL TOOL={t}
    {% endfor %}
    # 关闭加热
    {% for t in range(0, vars.tool_count) %}
        M104 S0 T{t}
    {% endfor %}
    untool
    {action_respond_info("所有工具校准完毕")}

#——---------------------------------------------

[gcode_macro Z_TILT_ADJUST]
description: eddy 快速Z调平, 三点调平
rename_existing: _Z_TILT_ADJUST
gcode:
  {% set PROBE_Z_OFFSET = printer.configfile.settings['probe_eddy_current eddy_probe'].descend_z|float %}
  # ========== 状态保存 ==========
  SAVE_GCODE_STATE NAME=STATE_Z_TILT
  # ========== 环境准备 ==========
  BED_MESH_CLEAR # 清除存在的网床数据
  # ========== 主调平过程 ==========
  # 第一次调平前先慢慢调平, 三点之差在很小范围内再扫床, 避免撞床
  {% if not printer.z_tilt.applied %}
    # 初始粗调
    _Z_TILT_ADJUST horizontal_move_z=8 retry_tolerance=1 SAMPLES=1
  {% endif %}
  # 精细调平
  _Z_TILT_ADJUST horizontal_move_z={PROBE_Z_OFFSET} retry_tolerance=0.0075 retries=20 METHOD=rapid_scan ADAPTIVE=1  
  # ========== 后处理 ==========
  G90                               # 绝对坐标
  G0 Z5 F300                        # 抬升Z轴
  M117 Z_tilt Completed             # 显示完成状态  
  # ========== 状态恢复 ==========
  RESTORE_GCODE_STATE NAME=STATE_Z_TILT
  M400

# Z_TILT_ADJUST跟QUAD_GANTRY_LEVEL 二选一
#[gcode_macro QUAD_GANTRY_LEVEL]
#rename_existing: _QUAD_GANTRY_LEVEL
#description: eddy 快速Z调平, 四点龙门调平 
#gcode:
#    {% set PROBE_Z_OFFSET = printer.configfile.settings['probe_eddy_current eddy_probe'].descend_z|float %}
#    # ========== 状态保存 ==========
#    SAVE_GCODE_STATE NAME=STATE_QGL
#    # ========== 环境准备 ==========
#    BED_MESH_CLEAR # 清除存在的网床数据
#    # ========== 主调平过程 ==========
#    # 第一次调平前先慢慢调平, 四点之差在很小范围内再扫床, 避免撞床
#    {% if not printer.quad_gantry_level.applied %}
#      # 初始粗调
#      _QUAD_GANTRY_LEVEL horizontal_move_z=10 retry_tolerance=1 SAMPLES=1
#    {% endif %}
#    # 精细调平
#    _QUAD_GANTRY_LEVEL horizontal_move_z={PROBE_Z_OFFSET} retry_tolerance=0.0075 retries=20 METHOD=rapid_scan ADAPTIVE=1
#    # ========== 后处理 ==========
#    G90                      # 绝对坐标
#    G0 Z5 F300               # 抬升Z轴
#    M117 QGL Completed       # 显示完成状态
#    # ========== 状态恢复 ==========
#    RESTORE_GCODE_STATE NAME=STATE_QGL
#    M400

# eddy 快速网床
[gcode_macro BED_MESH_CALIBRATE]
description: Eddy 涡流快速网床扫描（启用 rapid_scan 快速模式）
rename_existing: _BED_MESH_CALIBRATE
gcode:
    # 获取 Eddy 探针配置中的下降高度 (descend_z) 作为水平移动安全高度
    {% set PROBE_Z_OFFSET = printer.configfile.settings['probe_eddy_current eddy_probe'].descend_z|float %}
    
    # 执行底层的网床扫描，应用安全高度、快速扫描模式以及用户传入的其它参数
    _BED_MESH_CALIBRATE horizontal_move_z={PROBE_Z_OFFSET} METHOD=rapid_scan {rawparams}

[gcode_macro PROBE_EDDY_CURRENT_CALIBRATE_AUTO]
description: 第一次使用涡流时, 校准使用
gcode:
  BED_MESH_CLEAR
  G28 X Y
  G90 # Abs positioning
  G1 X20 Y20 F6000
  {% if 'z' not in printer.toolhead.homed_axes %}
    SET_KINEMATIC_POSITION Z={ printer.toolhead.axis_maximum.z-1 } # Allows the user to work it down until it touches.
  {% endif %}
  PROBE_EDDY_CURRENT_CALIBRATE CHIP=eddy_probe

[gcode_macro _RELOAD_Z_OFFSET_FROM_PROBE]
description: tap模式设置Z偏移, 这个命令多次运行, 打印出来的probe_Z是负的, set_Z是3-4mm左右, 看set_Z的一致性来判断稳定性, 第一次调试执行这个命令后, 要垫A4纸, 设置Z=0, 试试纸张的摩擦力再实际打印
gcode:
  {% set Z = printer.toolhead.position.z %}
  {% set position_endstop = 0 %}
  {% set raw_config = printer.configfile.config %}
  {% if 'stepper_z' in raw_config %}
      # 从position_endstop里获取校准的偏移
      {% set position_endstop = raw_config.stepper_z.position_endstop|trim|float %}
  {% endif %}
  {% set setZ = Z - printer.probe.last_probe_position.z + position_endstop %}
  SET_KINEMATIC_POSITION Z={setZ}
  # 这个命令多次运行, 打印出来的probe_Z是负的, set_Z是3-4mm左右, 看set_Z的一致性
  RESPOND MSG="position_Z={'%0.3f' | format(Z)} probe_Z={'%0.3f' | format(printer.probe.last_probe_position.z)} position_endstop={'%0.3f' | format(position_endstop)} set_Z={'%0.3f' | format(setZ)}"

[gcode_macro SET_Z_FROM_PROBE]
description: Z归零使用tap模式命令: SET_Z_FROM_PROBE METHOD=tap
gcode:
  {% set METHOD = params.METHOD | default("automatic") %}
  G0 Z5 F300
  PROBE METHOD={METHOD} SAMPLES=3 # probe速度默认为5mm/s
  _RELOAD_Z_OFFSET_FROM_PROBE
  G0 Z5 F300
```

---

## 模块 6：1. 全局变量

### `singletool/macros_vars.cfg`

```ini
#界面与宏变量全局配置类
```

---

## 模块 7：2. 打印启停流程

### `singletool/macros_print.cfg`

```ini
#打印流程控制类
```

---

## 模块 8：3. 工具与偏移校准

### `singletool/tool_calibrate.cfg`

```ini
#打印流程控制类
```

### `singletool/xy对刀.cfg`

```ini

#换热端项目涡流对刀配置 https://github.com/cx330-TXY/Simple-Multi-Hotend
# 寻找中心点: TOOL_EDDY_CALIBRATE TOOL=0 DIR=45,135 REPEATS=1
# 查询校准结果: GET_TOOL_CENTER TOOL=0
# 设置工具Z坐标: SET_TOOL_Z TOOL=0 Z=-0.1
# 清除扫描中心点位置:  CLEAR_TOOL_CENTER TOOL=0
# 线圈驱动电流校准命令: LDC_CALIBRATE_DRIVE_CURRENT CHIP=calibrator_xy
[tool_eddy_calibration calibrator_xy]
sensor_type: ldc1612
frequency: 40000000
reg_drive_current: 22     # 如果使用校准驱动电流命令这个注释
max_sensor_hz: 3000000    # 线圈最大频率
# LDC1612 I2C 配置
i2c_speed: 400000
i2c_address: 42           # 地址跳线连接
i2c_mcu: mcu              # 改成自己的
i2c_software_scl_pin: PA8 # 改成自己的
i2c_software_sda_pin: PC9 # 改成自己的
# PCB线圈位置 大概位置
coil_x: 167.3547  # 改成自己的
coil_y: 284.7062  # 改成自己的
coil_z: -0.6   # 改成自己的 线圈平面的Z坐标位置
coil_inner_diameter: 2.0    #线圈内径
# 扫描参数
scan_height: -0.15            # 扫描高度, 距离pcb线圈中心点的高度, 以coil_z为基准再次提高的高度, 喷嘴扫描高度距离线圈高度为0.5mm左右
scan_speed: 4.0             # 扫描速度, 速度低了效果不一定好
scan_length: 4.0            # 扫描长度, 至少要覆盖线圈内径
scan_safe_z: 3.0            # 安全Z高度, 比scan_height高就行
travel_speed_xy: 100.0      # XY旅行速度
travel_speed_z: 10.0        # Z旅行速度
save_data: True             # 是否保存探测数据到csv文件

[gcode_macro _TOOL_CALIB_VARS]
variable_safe_x: 20.0        # 改成自己的 换刀/待机的安全区域X 喷嘴戳热床位置
variable_safe_y: 35.0        # 改成自己的 换刀/待机的安全区域Y 喷嘴戳热床位置
variable_safe_z: 5.0         # 改成自己的 换刀/待机的安全区域Z高度
variable_tool_count: 2       # 改成自己的 工具总数 (例如0, 1，共2个)
gcode:
    # 此处无需指令，仅用于存储变量
# ---------------------------------------------------------
```

---

## 模块 9：4. Eddy 探针与网床

### `singletool/eddy_and_mesh.cfg`

```ini
#探针、调平与网床类
```

### `singletool/eddy_probe_z.cfg`

```ini

# 小螃蟹Z涡流调平(配置要添加到根目录的printer.cfg,否则不生效)

#*# <---------------------- SAVE_CONFIG ---------------------->
#*# DO NOT EDIT THIS BLOCK OR BELOW. The contents are auto-generated.
#*#
#*# [probe_eddy_current eddy_probe]
#*# reg_drive_current = 24
#*# calibrate =
#*# 	0.050000:6284648.608,0.090000:6271298.807,0.130000:6256383.859,
#*# 	0.170000:6243525.576,0.210000:6229640.738,0.250000:6217547.251,
#*# 	0.290000:6204179.486,0.330000:6192641.294,0.370000:6180034.661,
#*# 	0.410000:6169085.358,0.450000:6156939.272,0.490000:6146478.665,
#*# 	0.530000:6135057.257,0.570000:6125173.897,0.610000:6114085.235,
#*# 	0.650000:6104719.736,0.690000:6094561.126,0.730000:6085712.008,
#*# 	0.770000:6075772.241,0.810000:6067300.989,0.850000:6058007.907,
#*# 	0.890000:6049959.472,0.930000:6040911.116,0.970000:6033160.035,
#*# 	1.010000:6024665.322,1.050000:6017265.331,1.090000:6009061.050,
#*# 	1.130000:6001980.838,1.170000:5994233.666,1.210000:5987498.164,
#*# 	1.250000:5979959.937,1.290000:5973421.625,1.330000:5966251.108,
#*# 	1.370000:5959968.135,1.410000:5952984.847,1.450000:5946890.544,
#*# 	1.490000:5940259.844,1.530000:5934382.379,1.570000:5927818.473,
#*# 	1.610000:5922022.596,1.650000:5915680.371,1.690000:5910056.446,
#*# 	1.730000:5903766.986,1.770000:5898242.191,1.810000:5892242.610,
#*# 	1.850000:5886891.279,1.890000:5880863.158,1.930000:5875573.196,
#*# 	1.970000:5869808.209,2.010000:5864736.365,2.050000:5859026.450,
#*# 	2.090000:5854004.698,2.130000:5848551.550,2.170000:5843724.906,
#*# 	2.210000:5838302.951,2.250000:5833555.888,2.290000:5828395.207,
#*# 	2.330000:5823874.760,2.370000:5818772.457,2.410000:5814331.866,
#*# 	2.450000:5809491.521,2.490000:5805215.240,2.530000:5800416.540,
#*# 	2.570000:5796263.500,2.610000:5791730.132,2.650000:5787757.505,
#*# 	2.690000:5783296.145,2.730000:5779429.347,2.770000:5775173.429,
#*# 	2.810000:5771459.066,2.850000:5767298.921,2.890000:5763686.537,
#*# 	2.930000:5759744.950,2.970000:5756289.085,3.010000:5752398.166,
#*# 	3.050000:5749009.374,3.090000:5745298.935,3.130000:5742066.607,
#*# 	3.170000:5738437.061,3.210000:5735309.366,3.250000:5731855.448,
#*# 	3.290000:5728907.023,3.330000:5725499.403,3.370000:5722594.693,
#*# 	3.410000:5719367.903,3.450000:5716576.215,3.490000:5713432.699,
#*# 	3.530000:5710702.270,3.570000:5707717.322,3.610000:5705143.440,
#*# 	3.650000:5702202.614,3.690000:5699679.205,3.730000:5696896.052,
#*# 	3.770000:5694498.372,3.810000:5691762.901,3.850000:5689386.311,
#*# 	3.890000:5686769.022,3.930000:5684532.500,3.970000:5681985.862,
#*# 	4.010000:5679748.535,4.050000:5677341.104
#*#
#*# [bed_mesh default]
#*# version = 1
#*# points =
#*# 	-0.069179, -0.103414, -0.098788, -0.096428, -0.115087, -0.106570, -0.105169, -0.098836, -0.020501
#*# 	-0.055266, -0.083531, -0.081158, -0.063637, -0.073162, -0.088826, -0.098979, -0.101168, -0.063697
#*# 	-0.039240, -0.054845, -0.041129, -0.003718, -0.003067, -0.045584, -0.071566, -0.081060, -0.050947
#*# 	-0.051143, -0.046717, -0.019922, 0.020957, 0.015268, -0.036695, -0.077571, -0.085470, -0.043732
#*# 	-0.061299, -0.057890, -0.038631, -0.016118, -0.010832, -0.042237, -0.079589, -0.089575, -0.061669
#*# 	-0.073512, -0.062292, -0.056552, -0.049688, -0.051539, -0.068138, -0.085859, -0.090701, -0.067207
#*# 	-0.083010, -0.070837, -0.047372, -0.050717, -0.055548, -0.069410, -0.082560, -0.087297, -0.069925
#*# 	-0.085800, -0.086454, -0.047325, -0.035600, -0.031896, -0.041035, -0.060157, -0.073358, -0.053238
#*# 	-0.043703, -0.015162, 0.017591, 0.031727, 0.038567, 0.027019, 0.002340, -0.003718, 0.017418
#*# x_count = 9
#*# y_count = 9
#*# mesh_x_pps = 2
#*# mesh_y_pps = 2
#*# algo = bicubic
#*# tension = 0.2
#*# min_x = 25.0
#*# max_x = 275.0
#*# min_y = 25.0
#*# max_y = 275.0
```

---

## 模块 10：5. 日常维护与调试

### `singletool/macros_maintenance.cfg`

```ini
#日常维护与调试类
```
