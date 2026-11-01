import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Voron R2 打印机',
  description: 'Voron R2 300×300 单头 / 多头 Klipper 配置：安装与逐步调试',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: '安装', link: '/guide/install/software' },
      { text: '调试', link: '/guide/debug/' },
      { text: '常见问题', link: '/guide/troubleshooting' },
      { text: '参考资料', link: '/多头配置指南' },
    ],
    sidebar: [
      {
        text: '开始',
        items: [
          { text: '硬件清单', link: '/guide/hardware' },
        ],
      },
      {
        text: '安装',
        items: [
          { text: '1. 上位机软件与固件', link: '/guide/install/software' },
          { text: '2. 部署配置', link: '/guide/install/deploy' },
          { text: '3. 首次上电前的设置', link: '/guide/install/before-power-on' },
        ],
      },
      {
        text: '调试（按顺序做）',
        items: [
          { text: '总览', link: '/guide/debug/' },
          { text: '1. 首次启动与基础检查', link: '/guide/debug/01-first-boot' },
          { text: '2. XY 归零与行程', link: '/guide/debug/02-homing' },
          { text: '3. PID 与风扇', link: '/guide/debug/03-pid-fan' },
          { text: '4. 涡流探针校准', link: '/guide/debug/04-eddy' },
          { text: '5. 三点调平', link: '/guide/debug/05-z-tilt' },
          { text: '6. 网床', link: '/guide/debug/06-bed-mesh' },
          { text: '7. 振动补偿', link: '/guide/debug/07-input-shaper' },
          { text: '8. 挤出与第一层', link: '/guide/debug/08-extrusion' },
          { text: '9. 切片设置与试打', link: '/guide/debug/09-slicer' },
          { text: '10. 多头专项', link: '/guide/debug/10-multitool' },
          { text: '11. 收尾', link: '/guide/debug/11-finish' },
        ],
      },
      {
        text: '问题排查',
        items: [
          { text: '常见问题', link: '/guide/troubleshooting' },
        ],
      },
      {
        text: '参考资料',
        items: [
          { text: '多头配置指南', link: '/多头配置指南' },
          { text: 'OrcaSlicer 多热端设置', link: '/OrcaSlicer多热端设置' },
          { text: 'klipper-toolchanger 安装与迁移', link: '/klipper-toolchanger安装与迁移' },
          { text: '热床倾斜调试与修复记录', link: '/热床倾斜调试与修复记录' },
        ],
      },
    ],
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一步', next: '下一步' },
    lastUpdated: { text: '最后更新' },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '深色模式',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
          modal: { noResultsText: '没有找到', resetButtonTitle: '清除', footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' } },
        },
      },
    },
  },
})
