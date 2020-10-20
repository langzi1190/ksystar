<template>
  <div class="attr">
    <div class="close-all">
      <el-button type="primary"  @click="closeWindowItem('all')" size="mini" style="width:100%">关闭所有画面</el-button>
    </div>
    <div v-show="globalEvent.selectedWindowIndex>-1">
      <div class="control-btn">
        <el-button size="mini" @click="sendEvent('update_window','top','')">置顶</el-button>
        <el-button size="mini" @click="sendEvent('update_window','bottom','')">置底</el-button>
        <el-button size="mini" @click="sendEvent('update_window','lock','')">锁定</el-button>
        <el-button size="mini" @click="isPanorama=!isPanorama">
          <span v-show="isPanorama">全景</span>
          <span v-show="!isPanorama">局部</span>
        </el-button>
        <el-button size="mini" @click="sendEvent('update_window','window_size','1')">全屏</el-button>
        <el-button size="mini" @click="sendEvent('update_window','window_size','3')">扩张</el-button>
        <el-button size="mini" @click="sendEvent('update_window','window_size','0')">还原</el-button>
        <el-button size="mini" @click="closeWindowItem('cur')">关闭</el-button>
      </div>
      <div class="title">
        <el-input placeholder="请输入画面名称" @change="change('label')" v-model="label" size="mini">
          <template slot="prepend">画面名称:</template>
        </el-input>
      </div>
      <div>
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="画面参数" name="1">
            <div class="position-size">
              <span>水平位置:</span>
              <el-input-number @change="change('left')" v-model="left" :min="0" size="mini"></el-input-number>
            </div>
            <div class="position-size">
              <span>垂直位置:</span>
              <el-input-number @change="change('top')" v-model="top" :min="0" size="mini"></el-input-number>
            </div>
            <div class="position-size">
              <span>水平大小:</span>
              <el-input-number @change="change('width')" v-model="width" :min="400" size="mini"></el-input-number>
            </div>
            <div class="position-size">
              <span>垂直大小:</span>
              <el-input-number @change="change('height')" v-model="height" :min="300" size="mini"></el-input-number>
            </div>
          </el-collapse-item>
          <el-collapse-item title="局部显示" name="2">
            <div class="position-size">
              <span>水平位置:</span>
              <el-input-number v-model="cleft"  @change="change('cleft')" :min="0" size="mini"></el-input-number>
            </div>
            <div class="position-size">
              <span>垂直位置:</span>
              <el-input-number v-model="ctop" @change="change('ctop')" :min="0" size="mini"></el-input-number>
            </div>
            <div class="position-size">
              <span>水平大小:</span>
              <el-input-number v-model="cwidth" @change="change('cwidth')" :min="0" size="mini"></el-input-number>
            </div>
            <div class="position-size">
              <span>垂直大小:</span>
              <el-input-number v-model="cheight" @change="change('cheight')" :min="0" size="mini"></el-input-number>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <div class="collapse_inner">
      <div class="content-title">信号设置</div>
      <div v-show="Object.keys(this.globalEvent.selectedCard).length>0">
        <el-button @click="op('rename')" size="mini">更改名称</el-button>
        <el-button @click="op('hotBackup')" size="mini">热备份</el-button>
        <el-button @click="op('vga')" v-if="globalEvent.selectedCard.portType==3" size="mini">VGA校正</el-button>
        <el-button @click="op('workMode')" size="mini">工作模式</el-button>
        <!--<el-button @click="op('showAdvanced')" size="mini">设置EDID</el-button>-->
        <el-button @click="op('setEq')" size="mini">EQ值设置</el-button>
        <el-button @click="op('rdEdid')" size="mini">回读EDID</el-button>
      </div>
      <div style="text-align:center;color:#d0d0d0;" v-show="Object.keys(this.globalEvent.selectedCard).length==0">
          未选中信号
      </div>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            activeName: "0",
            isPanorama: true,
            label: "",
            num: 0,

            totalWidth:0,
            totalHeight:0,//屏幕墙尺寸
            top:1,
            left:1,
            width:1,
            height:1,

            ctop:0,//局部显示
            cleft:0,
            cwidth:0,
            cheight:0
        };
    },
    created(){
        this.globalEvent.$on('update_side_attr',()=>{
            //接受 来自主操作面板的参数改动 windowItem.vue
            this.setCurWindow(this.globalEvent.selectedWindowIndex);
        });
    },
    methods:{
        change(act){
            if(act=='top' && this.top+this.height>this.totalHeight){
                this.resetValue('top',this.totalHeight-this.height);
                return ;
            }

            if(act=='left' && this.left+this.width>this.totalWidth){

                this.resetValue('left',this.totalWidth-this.width);
                return ;
            }
            if(act=='width' && this.width+this.left>this.totalWidth){
                this.resetValue('width',this.totalWidth-this.left);
                return ;
            }
            if(act=='height' && this.height+this.top>this.totalHeight){
                this.resetValue('height',this.totalHeight-this.top);
                return ;
            }
            this.sendEvent('update_window_pos_by_side',act,this[act])
        },
        resetValue(prop,v){
            this.$nextTick(()=>{
                this[prop]=v;
            })
        },
        closeWindowItem(act){
            this.globalEvent.$emit('close_window_item',{act});
        },
        sendEvent(eventName,act,v=0){
            //发送 窗体参数更新事件 update_window 接受组件 vdr/index.vue
            this.globalEvent.$emit(eventName,{act,v});
        },
        setCurWindow(seq){
            //初始化当前参数
            let curWindow=this.globalEvent.windowItemsInfo.winArr[seq];

            this.label=curWindow.label;
            this.left=curWindow.winSizeArr[0];
            this.top=curWindow.winSizeArr[1];
            this.width=curWindow.winSizeArr[2];
            this.height=curWindow.winSizeArr[3];

            this.cleft=curWindow.cropSizeArr[0];
            this.ctop=curWindow.cropSizeArr[1];
            this.cwidth=curWindow.cropSizeArr[2];
            this.cheight=curWindow.cropSizeArr[3];

        },
        op(act){
            if(act=='cancel'){
                this.$emit('sub_event',{act:'close_kfs'});
            }
            else if(act=='sure'){
                this.$emit('sub_event',{act:'close_kfs'});
            }
            else if(act=='showAdvanced'){
                this.$emit('sub_event',{act:'show_edid_advanced'})
            }
            else if(act=='rename'){
                let s=prompt("新输入新名称",this.globalEvent.selectedCard.label_extra);
                if(s!==null && s!==undefined){
                    this.globalEvent.selectedCard.label_extra=s;
                    this.globalEvent.syncLocalName('sourceCardName',this.globalEvent.inputCardList);
                }
            }
            else if(act=='hotBackup'){
                this.$emit('sub_event',{act:"hot_backup"});
            }
            else if(act=='workMode'){
                this.$emit('sub_event',{act:'work_mode'});
            }
            else if(act=='setEq'){
                this.$emit('sub_event',{act:'eq'});
            }
            else if(act=='vga'){
                this.$emit('sub_event',{act:'vga'});
            }
        }
    },
    watch:{
        'globalEvent.selectedWindowIndex':function (v,ov) {
            if(v>-1){
                //，载入被选择窗体 的参数
                this.totalWidth=this.globalEvent.totalWidth;
                this.totalHeight=this.globalEvent.totalHeight;
                this.setCurWindow(v);
            }
        },
        // top(v,ov){
        //     this.sendEvent('update_window_pos_by_side','top',v);
        // },
        // left(v,ov){
        //     this.sendEvent('update_window_pos_by_side','left',v);
        // },
        // width(v,ov){
        //     this.sendEvent('update_window_pos_by_side','width',v);
        // },
        // height(v,ov){
        //     this.sendEvent('update_window_pos_by_side','height',v);
        // }
    }
};
</script>

<style lang="scss" scoped>
.attr {
  padding: 0 10px;
  .close-all {
    padding-top: 6px;
  }
  .control-btn {
    padding: 6px 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-button {
      margin-top: 6px;
    }
  }
  .title {
    padding-top: 6px;
    padding-bottom: 6px;
    /deep/ .el-input-group__prepend {
      padding: 0 6px;
    }
  }
  .position-size {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 6px;
    color: #909399;
    .el-input-number {
      width: 120px;
    }
  }
}
.el-button--mini {
  padding: 6px 8px;
}
.el-button + .el-button {
  margin: 0;
}
.collapse_inner{text-align:left;}
.collapse_inner .content-title{margin-bottom:15px;text-align:center;margin-top:30px;}
.collapse_inner .el-button--mini{width:80px;    margin-left: 15px;margin-bottom: 10px;}
/deep/ .el-collapse-item__header {
  height: 40px;
  line-height: 40px;
}
/deep/ .el-collapse-item__content {
  padding-bottom: 6px;
}

</style>