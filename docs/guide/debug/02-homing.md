# 2. XY 归零与行程

1. 把喷嘴手动推到打印区中间，手放在急停上，执行：

   ```
   G28 X
   G28 Y
   ```

   X、Y 限位都在最大端（`homing_positive_dir: true`），归零时应分别往右、往后走。

   往反方向跑：CoreXY 的方向要同时考虑两个电机，按 Klipper 文档调整 `stepper_x` / `stepper_y` 的 `dir_pin`。

2. 归零后用控制面板小步移动，确认 X 能走到 0～290、Y 能走到 0～300，不撞机械限位。行程不对时，同时修改 `modules/core/mainboard.cfg` 里的 `position_max` 和 `position_endstop`。

3. 执行完整归零 `G28`。Z 用涡流虚拟限位，在热床中心（`safe_z_home`）归零。涡流还没校准时 Z 归零会失败，先做到第 4 步。

::: tip 新机器先确认 KINEMATIC_POSITION 已注释
`[delayed_gcode KINEMATIC_POSITION]` 没注释时，开机不归零也能移动，但坐标是错的，见 [首次上电前的设置](../install/before-power-on#开机自动标记已归零)。
:::
