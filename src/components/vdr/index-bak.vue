<template>
  <div class="draw-vdr">
    <!-- 网格 -->
    <div class="grids" :style="{height:totalHeight*ratio+'px',width:totalWidth*ratio+'px'}">
        <div class="line_h"
             v-for="item in lineH"
             :style="{
                top:item*ratio+'px',
                width:totalWidth*ratio+'px',
             }"
        ></div>
        <div class="line_v"
             v-for="item in lineV"
             :style="{
                left:item*ratio+'px',
                height:totalHeight*ratio+'px',
             }"
        ></div>
    </div>
    <div
      @wheel="mouseWheel"
      :style="`height: ${totalHeight*ratio}px; width: ${totalWidth*ratio}px; border: 1px solid #dcdfe6; position: relative;box-sizing:border-box;`"
    >
      <vdr
        :min-width="40"
        :min-height="40"
        v-on:dragging="onDrag"
        v-on:resizing="onResize"
        :draggable="true"
        :parent="true"
        :z-index="1"
        :w="100"
        :h="100"
        :x="100"
        :y="100"
      >
        <vdr-window>

            <p>Title:Hello</p>
            <p>X: {{ x }}</p>
            <p>Y: {{ y }}</p>
            <p>Width: {{ width }}</p>
            <p>Height: {{ height }}</p>


        </vdr-window>
      </vdr>
      <!-- :snap="true" 开启吸附功能
      :snapTolerance="10" 距离小于10px开始吸附
      :draggable="true" 控制组件是否可以拖动-->
      <vdr
        :parent="true"
        :debug="false"
        :min-width="40"
        :min-height="40"
        :isConflictCheck="true"
        :draggable="true"
        :z-index="2"
        :w="200"
        :h="200"
        :x="100"
        :y="100"
      >
        <vdr-window>
          <p>Title:Hello</p>
          <p>X: {{ x }}</p>
          <p>Y: {{ y }}</p>
          <p>Width: {{ width }}</p>
          <p>Height: {{ height }}</p>
        </vdr-window>
      </vdr>
    </div>
  </div>
</template>

<script>
import vdr from "vue-draggable-resizable-gorkys";
import "vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css";
import vdrWindow from "@/components/vdr/VdrWindow/";

export default {
    data: function() {
      return {
          vdrHeigth: 432, // 编辑幕布宽度
          vdrWidth: 768, // 编辑幕布高度
          windowList:[],
          activeWindow:-1,
          totalWidth:0,
          totalHeight:0,
          ratio:1,
          normalWidth:1000,//归一化
          col:0,
          row:0,

          grids:[],
          lineH:[],
          lineV:[],

          width: 0,
          height: 0,
          x: 0,
          y: 0
      };
    },
    mounted() {
      // this.globalEvent.$on("update_window_param",(param)=>{
      //     this.x=param.x;
      // });
        this.globalEvent.screenInfo={
            "ScrGroupNum":	2,
            "scrGroupArr":	[{
                "Row":	2,
                "Col":	2,
                "VideoId":	16,
                "TimingMode":	1,
                "FrameRate":	60,//格式是 0 1 2？？
                "FormatW":	1920,
                "HFrontPorch": 88,
                "HSyncTime":	44,
                "HBackPorch":	148,
                "FormatH":	1080,
                "VFrontPorch":	4,
                "VSyncTime":	5,
                "VBackPorch":	36,
                "ClkFreq":	148500,
                "HPolar":	0,
                "VPolar":	0,
                "portArr":	[{
                    "sizeArr":	[1920, 1080],
                    "mapArr":	[12],
                    "briArr":	[0, 0, 0],
                    "conArr":	[100, 100, 100]
                }, {
                    "sizeArr":	[1920, 1080],
                    "mapArr":	[13],
                    "briArr":	[0, 1, 201],
                    "conArr":	[100, 100, 100]
                }, {
                    "sizeArr":	[1920, 1080],
                    "mapArr":	[14],
                    "briArr":	[0, 209, 4],
                    "conArr":	[100, 100, 100]
                }, {
                    "sizeArr":	[1920, 1080],
                    "mapArr":	[15],
                    "briArr":	[32, 2, 95],
                    "conArr":	[100, 100, 100]
                }]
            }, {
                "Row":	2,
                "Col":	3,
                "VideoId":	16,
                "TimingMode":	0,
                "FrameRate":	60,
                "FormatW":	1920,
                "HFrontPorch":	88,
                "HSyncTime":	44,
                "HBackPorch":	148,
                "FormatH":	1080,
                "VFrontPorch":	4,
                "VSyncTime":	5,
                "VBackPorch":	36,
                "ClkFreq":	148500,
                "HPolar":	0,
                "VPolar":	0,
                "portArr":	[{
                    "sizeArr":	[1920, 1080],
                    "mapArr":	[18],
                    "briArr":	[0, 0, 0],
                    "conArr":	[100, 100, 100]
                }, {
                    "sizeArr":	[1920, 1080],
                    "mapArr":	[19],
                    "briArr":	[0, 0, 0],
                    "conArr":	[100, 100, 100]
                }, {
                    "sizeArr":	[1920, 1080],
                    "mapArr":	[20],
                    "briArr":	[0, 1, 0],
                    "conArr":	[100, 100, 100]
                }, {
                    "sizeArr":	[1920, 1080],
                    "mapArr":	[21],
                    "briArr":	[1, 0, 0],
                    "conArr":	[100, 100, 100]
                }, {
                    "sizeArr":	[1920, 1080],
                    "mapArr":	[22],
                    "briArr":	[0, 0, 0],
                    "conArr":	[100, 100, 100]
                }, {
                    "sizeArr":	[1920, 1080],
                    "mapArr":	[23],
                    "briArr":	[0, 0, 0],
                    "conArr":	[100, 100, 100]
                }]
            }]
        };
        this.loadScreen(0)
    },
    methods: {
        loadScreen(seq){

            let curScreen=this.globalEvent.screenInfo.scrGroupArr[seq];
            let portArr=curScreen.portArr;
            this.row=curScreen.Row;
            this.col=curScreen.Col;

            this.totalWidth=0;
            this.totalHeight=0;
            this.lineH=[];
            this.lineV=[];

            let v=0;
            let h=0;
            for(let i in portArr){
                if(i<curScreen.Col){
                    this.totalWidth+=parseInt(portArr[i].sizeArr[0]);
                }
                if(i%curScreen.Row==0){
                    this.totalHeight+=parseInt(portArr[i].sizeArr[1]);
                }
                if(i<curScreen.Col-1){
                    h+=portArr[i].sizeArr[0];
                    this.lineV.push(h);
                }
                if(i%curScreen.Row==0 && i!=curScreen.Row){
                    v+=portArr[i].sizeArr[1];
                    this.lineH.push(v);
                }
            }

            if(this.totalWidth>1000){
                this.ratio=1000/this.totalWidth;
            }
            else{
                this.ratio=1;
            }

            // this.$emit('sub_event',{act:'scale',scale:this.scale});
        },
        onResize: function(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        },

        onDrag: function(x, y) {
            this.x = x;
            this.y = y;
        },
      mouseWheel(e) {

        // let ratio = 1080 / 1920;
        // if (e.wheelDelta > 0) {
        //   this.vdrHeigth = Math.floor(this.vdrHeigth + this.vdrHeigth * 0.01);
        //   this.vdrWidth = Math.floor(this.vdrHeigth / ratio);
        //   // 将画布最大限制成最大物理分辨率;
        //   if (this.vdrWidth > 1920) {
        //     this.vdrHeigth = 1080;
        //     this.vdrWidth = 1920;
        //   }
        // } else {
        //   this.vdrHeigth = Math.floor(this.vdrHeigth - this.vdrHeigth * 0.01);
        //   this.vdrWidth = Math.floor(this.vdrHeigth / ratio);
        //   if (this.vdrWidth < 702) {
        //     this.vdrHeigth = 396;
        //     this.vdrWidth = 702;
        //   }
        // }
        //
        // if (this.vdrWidth > 960) {
        //   this.$emit("alignCenter", false);
        // } else {
        //   this.$emit("alignCenter", true);
        // }
        // this.$nextTick(() => {
        //   // 当父窗口大小发生变化时子窗口必须重载不然无法确定拖动范围
        //   window.dispatchEvent(new Event("resize"));
        // });
      }
    },
    components: {
      vdr,
      vdrWindow
    }
};
</script>

<style>
.vdr {
  border: 1px solid #000000;
  background: #409eff;
}
.draw-vdr{
  position: relative;
}
.grids{
    position: absolute;
    display:flex;
    flex-wrap:wrap;
    top: 0;
    left: 0;
    box-sizing:border-box;
}
    .line_h{position:absolute;height:0;border-top:2px solid #dcdcdc;left:0;}
    .line_v{position:absolute;width:0;border-left:2px solid #dcdcdc;top:0;}

    .grid{border:2px solid #dcdcdc;border-top:none;border-right:none;position:absolute;}
</style>