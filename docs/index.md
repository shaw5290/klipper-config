---
layout: home

hero:
  name: Voron R2 300×300
  text: Klipper 安装与调试
  tagline: 单头 / 多头共用一套模块化配置，从装软件到打出第一个合格的件，一步一步来
  actions:
    - theme: brand
      text: 开始安装
      link: /guide/install/software
    - theme: alt
      text: 调试步骤
      link: /guide/debug/
    - theme: alt
      text: 常见问题
      link: /guide/troubleshooting

features:
  - title: 安装
    details: 上位机软件、固件、ldc1612 驱动修改、部署 config/ 目录、填写板子 ID、首次上电前的安全设置。
    link: /guide/install/software
  - title: 逐步调试
    details: 首次启动 → 归零 → PID 与风扇 → 涡流探针 → 三点调平 → 网床 → 振动补偿 → 挤出与第一层 → 切片试打。
    link: /guide/debug/
  - title: 多头
    details: 切换多头机型、换头动作、涡流对刀、OrcaSlicer 多热端设置。
    link: /guide/debug/10-multitool
  - title: 问题排查
    details: 启动报错、tap 不稳定、首层有缝、侧壁发糊、外圈高出来、每次打印完都提示 SAVE_CONFIG……
    link: /guide/troubleshooting
---
