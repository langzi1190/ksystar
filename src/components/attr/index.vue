<template>
  <div class="attr">
    <div class="close-all">
      <el-button type="primary" :disabled="globalEvent.panelLock"  @click="closeWindowItem('all')" size="mini" style="width:100%">{{LANG.ATTR_CLOSEALL}}</el-button>
    </div>
    <div v-show="globalEvent.selectedWindowIndex>-1">
      <div class="control-btn">
        <el-button size="mini" :disabled="globalEvent.panelLock" @click="sendEvent('update_window','top','')">{{LANG.ATTR_TOP}}</el-button>
        <el-button size="mini" :disabled="globalEvent.panelLock" @click="sendEvent('update_window','bottom','')">{{LANG.ATTR_BOTTOM}}</el-button>
        <el-button size="mini" :disabled="globalEvent.panelLock" :type="lockStr" @click="sendEvent('update_window','lock','')">{{LANG.HOME_LOCK}}</el-button>
        <el-button size="mini" :disabled="globalEvent.panelLock" @click="sendEvent('update_window','partOrAll')">
          <span v-show="isPanorama">{{LANG.ATTR_WINDOW_FULL}}</span>
          <span v-show="!isPanorama">{{LANG.ATTR_WINDOW_PART}}</span>
        </el-button>
        <el-button size="mini" :disabled="globalEvent.panelLock" @click="sendEvent('update_window','window_size','1')">{{LANG.ATTR_FULLSCREEN}}</el-button>
        <el-button size="mini" :disabled="globalEvent.panelLock" @click="sendEvent('update_window','window_size','3')">{{LANG.ATTR_EXTEND}}</el-button>
        <el-button size="mini" :disabled="globalEvent.panelLock" @click="sendEvent('update_window','window_size','0')">{{LANG.ATTR_RESTORE}}</el-button>
        <el-button size="mini" :disabled="globalEvent.panelLock" @click="closeWindowItem('cur')">{{LANG.ATTR_CLOSE}}</el-button>

      </div>
      <div class="title">
        <el-input placeholder="请输入画面名称" @change="change('label')" v-model="label" size="mini">
          <template slot="prepend">{{LANG.ATTR_WINDOW_NAME}}:</template>
        </el-input>
      </div>
      <div>
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item :title="LANG.ATTR_WINDOW_ATTR" name="1">
            <div class="position-size">
              <span>{{LANG.ATTR_H_POS}}:</span>
              <el-input-number :disabled="globalEvent.panelLock" @change="change('left')" v-model="left" :min="0" size="mini"></el-input-number>
            </div>
            <div class="position-size">
              <span>{{LANG.ATTR_V_POS}}:</span>
              <el-input-number :disabled="globalEvent.panelLock" @change="change('top')" v-model="top" :min="0" size="mini"></el-input-number>
            </div>
            <div class="position-size">
              <span>{{LANG.ATTR_WIDTH}}:</span>
              <el-input-number :disabled="globalEvent.panelLock" @change="change('width')" v-model="width" :min="50" size="mini"></el-input-number>
            </div>
            <div class="position-size">
              <span>{{LANG.ATTR_HEIGHT}}:</span>
              <el-input-number :disabled="globalEvent.panelLock" @change="change('height')" v-model="height" :min="50" size="mini"></el-input-number>
            </div>
          </el-collapse-item>
          <el-collapse-item :title="LANG.ATTR_PART_VIEW" name="2">
            <div style="margin-bottom:10px;">{{LANG.ATTR_SINGAL_RESOLUTION}}：{{srcWidth}}*{{srcHeight}}</div>
            <div class="position-size">
              <span>{{LANG.ATTR_H_POS}}:</span>
              <el-input-number :disabled="globalEvent.panelLock" v-model="cleft"  @change="change('cleft')" :min="0" size="mini"></el-input-number>
            </div>
            <div class="position-size">
              <span>{{LANG.ATTR_V_POS}}:</span>
              <el-input-number :disabled="globalEvent.panelLock" v-model="ctop" @change="change('ctop')" :min="0" size="mini"></el-input-number>
            </div>
            <div class="position-size">
              <span>{{LANG.ATTR_WIDTH}}:</span>
              <el-input-number :disabled="globalEvent.panelLock" v-model="cwidth" @change="change('cwidth')" :min="0" size="mini"></el-input-number>
            </div>
            <div class="position-size">
              <span>{{LANG.ATTR_HEIGHT}}:</span>
              <el-input-number :disabled="globalEvent.panelLock" v-model="cheight" @change="change('cheight')" :min="0" size="mini"></el-input-number>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <div class="collapse_inner">
      <div class="content-title">{{LANG.ATTR_SIGNAL_SETTING}}</div>
      <div class="src_card_name">{{this.globalEvent.selectedCard.label_extra}}</div>
      <div v-show="Object.keys(this.globalEvent.selectedCard).length>0">
        <el-button @click="op('rename')" size="mini">{{LANG.SIGNAL_CHANGE_NAME}}</el-button>
        <el-button @click="op('hotBackup')" size="mini">{{LANG.ATTR_HOTBACKUP}}</el-button>
        <el-button @click="op('vga')" v-if="globalEvent.selectedCard.portType==3" size="mini">{{LANG.ATTR_VGA_CORRECTION}}</el-button>
        <el-button @click="op('workMode')" size="mini"  v-show="advanceType.includes(this.globalEvent.selectedCard.portType)">{{LANG.ATTR_WORK_MODE}}</el-button>
        <el-button @click="op('edidSingle')"  v-show="advanceType.includes(this.globalEvent.selectedCard.portType)" size="mini">{{LANG.ATTR_EDID_SETTING}}</el-button>
        <el-button @click="op('setEq')" size="mini" v-show="advanceType.includes(this.globalEvent.selectedCard.portType)">{{LANG.ATTR_EQ_SETTING}}</el-button>
        <el-button @click="op('rdEdid')" size="mini" v-show="advanceType.includes(this.globalEvent.selectedCard.portType)">{{LANG.ATTR_EDID_READ}}</el-button>
      </div>
      <div style="text-align:center;color:#d0d0d0;" v-show="Object.keys(this.globalEvent.selectedCard).length==0">
          {{LANG.ATTR_SIGNAL_UNSELECT}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            advanceType:[16,18],
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

            lockStr:'',
            isLock:0,

            ctop:0,//局部显示
            cleft:0,
            cwidth:0,
            cheight:0,

            srcWidth:0,//信号源分辨率
            srcHeight:0,
            LANG:this.LANGUAGE[this.globalEvent.language]
        };
    },
    created(){
        this.globalEvent.$on('update_side_attr',()=>{
            //接受 来自主操作面板的参数改动 windowItem.vue
            // console.log("update_side_attr",this.globalEvent.selectedWindowIndex);
            if(this.globalEvent.selectedWindowIndex>-1){
                this.setCurWindow(this.globalEvent.selectedWindowIndex);
            }

        });

        this.globalEvent.$on('language',()=>{
            this.LANG=this.LANGUAGE[this.globalEvent.language];
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

            if(act=='ctop' && this.cropOutBound()){
                alert(this.LANG.ALERT_MAX_WINDS);
                this.resetValue('ctop',this.srcHeight-this.ctop);
                return ;
            }
            if(act=='cheight' && this.cropOutBound()){
                alert(this.LANG.ALERT_MAX_WINDS);
                this.resetValue('cheight',this.srcHeight-this.ctop);
                return ;
            }
            if(act=='cleft' && this.cropOutBound()){
                alert(this.LANG.ALERT_MAX_WINDS);
                this.resetValue('cleft',this.srcWidth-this.width);
                return ;
            }
            if(act=='cwidth' && this.cropOutBound()){
                // alert("窗口超限");
                alert(this.LANG.ALERT_MAX_WINDS);
                this.resetValue('cwidth',this.srcWidth-this.cleft);
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
            if(act=='partOrAll'){
                this.isPanorama=!this.isPanorama;
                if(this.isPanorama){
                    this.ctop=0;
                    this.cleft=0;
                    this.cwidth=0;
                    this.ctop=0;
                    v=[0,0,0,0];
                }
                else{
                    v=[this.cleft-0,this.ctop-0,this.cwidth-0,this.cheight-0];
                }
            }
            else if(act=='lock'){
                this.isLock=1-this.isLock;
            }
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

            this.isPanorama=curWindow.partOrAll==0;
            this.isLock=curWindow.lock;

            if(curWindow.resolution.length==1){
                this.srcWidth=300;
                this.srcHeight=200;
            }else{
                this.srcWidth=curWindow.resolution[0];
                this.srcHeight=curWindow.resolution[1];
            }

        },
        cropOutBound(){
            if(parseInt(this.ctop)+parseInt(this.cheight)>this.srcHeight){
                return true;
            }
            if(parseInt(this.cleft)+parseInt(this.cwidth)>this.srcWidth){
                return true;
            }
        },
        op(act){
            if(act=='cancel'){
                this.$emit('sub_event',{act:'close_kfs'});
            }
            else if(act=='sure'){
                this.$emit('sub_event',{act:'close_kfs'});
            }
            else if(act=='edidSingle'){
                this.$emit('sub_event',{act:'show_edid_single'})
            }
            else if(act=='rename'){
                let s=prompt(this.LANG.TIP_INPUT_NEW_NAME,this.globalEvent.selectedCard.label_extra);
                if(s!==null && s!==undefined){
                    this.globalEvent.selectedCard.label_extra=s;
                    this.globalEvent.syncLocalName('sourceCardName',this.globalEvent.inputCardList);
                    this.globalEvent.$emit("source_card_name_change");
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
            else if(act=='rdEdid'){
                this.$emit('sub_event',{act:'rdEdid'});
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
        isLock(v,o){
            if(v==1){
                this.lockStr='primary';
            }
            else{
                this.lockStr='';
            }
        }
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

    .el-collapse-item__header {
      height: 35px;
      line-height: 35px;
    }
  }
  .el-button--mini {
    padding: 6px 8px;
  }
  .el-button + .el-button {
    margin: 0;
  }
  .src_card_name{    background-color: #f3f2f0;
    text-align: center;
    padding: 5px;
    border-radius: 5px;
    color: #505050;
    margin: 10px 0;}
  .collapse_inner{text-align:left;}
  .collapse_inner .content-title{margin-bottom:15px;text-align:center;margin-top:30px;}
  .collapse_inner .el-button--mini{width:80px;margin-left: 15px;margin-bottom: 10px;}
  .el-collapse-item__content {
    padding-bottom: 6px;
  }
</style>