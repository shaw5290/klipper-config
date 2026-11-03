# 10. 多头专项

仅多头机型。详细步骤和实测记录见 [多头配置指南](/多头配置指南)，这里是顺序。

1. **配置修改**：`printer.cfg` 切换到 `profile_multitool.cfg`，注释没装的热端，统一 `tool_count`，喉管风扇监听所有热端，Y 允许负值（停靠坞在热床前方）。
2. **停靠坞坐标与换头动作**：按 [停靠坞与换头动作调试](./dock) 逐步实测 `tN_dock_x/y`、`dock_shift_x`、`dock_dodge_y`，先手动逐行测进坞、横移、放回、抓取。
3. **低速试换头**：`changer_cxchanger.cfg` 默认启用调试速度，用 `UNTOOL` / `T0` 连续换头无撞击后，再切换到正常速度。本机单次换头约 14.5 秒。
4. **每个热端做温度调试**（[多热端温度调试](./hotend-temperature)）：接线核对、PID、预热时间，否则对刀会卡在"等温中"。
5. **对刀线圈**：`TEST_LDC1612`（约 2.2MHz），量出 `coil_x/y/z`，`scan_height` 让喷嘴在线圈上方约 0.5mm。本机 `coil_x: 168.08`、`coil_y: 283.75`、`coil_z: 0.85`、`scan_height: 0.5`。
6. **一键对刀**（tap 已在 [第 4 步](./04-eddy) 调通）：

   ```
   G28
   CALIBRATE_TOOL TOOL=0          ; 基准，必须先做
   CALIBRATE_TOOL TOOL=1          ; 两次之间不要 G28
   T1                             ; 输出"T1 加载校准值"即为偏移，换头时自动加载
   ```

   单个工具都没问题后，可以用 `CALIBRATE_ALL_TOOLS` 批量校准，结果保存在 `myvariables.cfg`。本机 T1 偏移 X=-0.3835 Y=-0.2946 Z=0.2440。

7. **切片设置**：见 [OrcaSlicer 多热端设置](/OrcaSlicer多热端设置)。
