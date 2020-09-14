let displayData = {
  portOutList: [], // 端口port列表
  display: [
    // 用户模式
    {
      // 屏幕墙1
      resolution: "1920*1080",
      row: 2, // 屏幕列表行
      column: 4,
      displayList: [
        {
          title: "display1",
          resolutionX: 1920,
          resolutionY: 1080,
          settingPort: 1
        },
        {
          title: "display2",
          resolutionX: 1920,
          resolutionY: 1080,
          settingPort: 1
        }
      ],
      wicket: [
        {
          // 子窗口
          field: 0,
          field_cn: "窗口1",
          x: 0,
          y: 0,
          w: 200,
          h: 150,
          field_item_id: "0",
          field_item_val: "", // 存储标题文本
          ext_val_z_index: "", // 窗口层级
          style: {
            fs: "0", // 1 全屏铺满 2 水平铺满 3 垂直铺满
            ha: "0", // 1 水平居左 2 水平居中 3 水平居右
            va: "0" // 1 垂直靠底 2 垂直居中 3 垂直靠顶
          }
        },
        {
          // 子窗口
          field: 0,
          field_cn: "窗口1",
          x: 0,
          y: 0,
          w: 200,
          h: 150,
          field_item_id: "0",
          field_item_val: "", // 存储标题文本
          ext_val_z_index: "", // 窗口层级
          style: {
            fs: "0", // 1 全屏铺满 2 水平铺满 3 垂直铺满
            ha: "0", // 1 水平居左 2 水平居中 3 水平居右
            va: "0" // 1 垂直靠底 2 垂直居中 3 垂直靠顶
          }
        }
      ]
    },
    {
      // 屏幕墙2
    }
  ]
};

export default displayData