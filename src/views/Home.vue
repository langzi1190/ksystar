<template>
  <div class="home">
    <!-- 头部菜单显示 -->
    <header>
      <el-tabs type="border-card" value="1">
        <el-tab-pane label="设备">
          <div class="card-s">
            <card title="设备">
              <card-item title="设备选择"></card-item>
              <card-item title="连接设备"></card-item>
              <card-item title="断开设备"></card-item>
              <card-item title="同步"></card-item>
              <card-item title="退出"></card-item>
            </card>
          </div>
        </el-tab-pane>
        <el-tab-pane label="主功能区">
          <div class="card-s">
            <card title="设置">
              <card-item title="创建画面" @click.native="addScreen" iconName="plus"></card-item>
              <card-item title="屏幕配置" iconName="display" @click.native="setting('2')"></card-item>
            </card>
            <card title="预设">
              <card-item title="用户模式" @click.native="showDialog='userModel'"></card-item>
              <card-item title="保存模式" @click.native="showDialog='saveUserModel'"></card-item>
              <card-item title="出厂设置" @click.native="preinstall('3')"></card-item>
              <card-item title="同步" @click.native="preinstall('sync')"></card-item>
              <card-item title="打开回显" :isChecked="isEcho===true" @click.native="preinstall('5')"></card-item>
              <card-item title="关闭回显" :isChecked="isEcho===false" @click.native="preinstall('6')"></card-item>
              <card-item title="回显配置" @click.native="showDialog='monIp'"></card-item>
            </card>
            <card title="屏幕切换">
              <card-item title="屏幕墙 1" seq='0' @click.native="loadScreen(0)"  iconName="display"></card-item>
              <card-item title="屏幕墙 2" seq='1' @click.native="loadScreen(1)" iconName="display"></card-item>
              <div class="card-item">
                <card-child title="屏幕墙3" seq='2' @click.native="loadScreen(2)"  iconName="display"></card-child>
                <card-child title="屏幕墙4" seq='3' @click.native="loadScreen(3)"  iconName="display"></card-child>
                <card-child title="屏幕墙5" seq='4' @click.native="loadScreen(4)"  iconName="display"></card-child>
              </div>
              <div class="card-item">
                <card-child title="屏幕墙6" seq='5' @click.native="loadScreen(5)"  iconName="display"></card-child>
                <card-child title="屏幕墙7" seq='6' @click.native="loadScreen(6)"  iconName="display"></card-child>
                <card-child title="屏幕墙8" seq='7' @click.native="loadScreen(7)"  iconName="display"></card-child>
              </div>
            </card>
            <card title="对外控制">
              <div class="card-item">
                <card-child title="开屏"  @click.native="preinstall('10')" iconName="display"></card-child>
                <card-child title="关屏"  @click.native="preinstall('11')" iconName="display"></card-child>
                <card-child title="通道设置" iconName="display" @click.native="showDialog='screenCtr'"></card-child>
              </div>
            </card>
            <card title="锁定">
              <card-item
                title="位置锁定"
                :isChecked="globalEvent.panelLock"
                @click.native="globalEvent.panelLock=!globalEvent.panelLock"
              ></card-item>
            </card>
          </div>
        </el-tab-pane>
        <el-tab-pane label="工具">
          <div class="card-s">
            <card title="高级菜单">
              <card-item title="用户" @click.native="showDialog='user'"></card-item>
              <card-item @click.native="showDialog='screenBright'" title="亮度"></card-item>
              <card-item @click.native="showDialog='kfs'" title="KFS"></card-item>
              <card-item @click.native="showDialog='multi'" title="多机同步"></card-item>
              <card-item title="输出关闭"  @click.native="preinstall('8')"></card-item>
              <card-item title="输出开启"  @click.native="preinstall('9')"></card-item>
              <card-item title="导入配置"></card-item>
              <card-item title="导出配置"></card-item>
              <card-item  style="width:80px;" title="设置所有DPHDMI4K卡" @click.native="showDialog='edid'"></card-item>
            </card>
            <card title="语言选择">
              <card-item title="语言设置"></card-item>
            </card>
            <card title="专家系统">
              <card-item @click.native="showDialog='serial'" title="串口设置"></card-item>
              <card-item title="网络设置" @click.native="showDialog='ipConfig'"></card-item>
              <card-item title="计算器"></card-item>
              <card-item title="演示模式"></card-item>
              <card-item @click.native="showDialog='deviceStatus'" title="测试"></card-item>
              <card-item @click.native="showDialog='version'" title="版本信息"></card-item>
              <card-item @click.native="showDialog='temp'" title="温度信息"></card-item>
              <card-item title="ARM升级" @click="showUploadDialog='arm'"></card-item>
              <card-item style="width: 56px;" title="FPGA升级" @click.native="showUploadDialog='fpga'"></card-item>
            </card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </header>
    <center>
      <!-- 侧边栏选项 -->
      <signal ref="signal"></signal>
      <!-- 屏幕编辑与显示 -->
      <div class="content">
        <div class="content-title">模拟操作</div>
        <div class="content-draw">
          <!-- 窗口编辑面板 -->
          <div class="draw-panel">
            <div class="draw-content" :class="{'draw-center':(drawCenter&&!isEcho)}">
              <vdr ref="vdr"  v-if="updateFlip"  @alignCenter="alignCenter"></vdr>
            </div>
          </div>
          <!-- 回显 -->
          <!--<div class="display-list" v-show="isEcho"></div>-->
        </div>
      </div>
      <div class="content-compile" v-show="true">
        <div class="content-title">画面编辑</div>
        <div class="content-attr" :style="{maxHeight:maxHeight+'px','overflow-y':'auto'}">
          <attr @sub_event="subEvent"></attr>
        </div>
      </div>
    </center>
    <!-- 底部设备信息 -->
    <footer>
      <div class="status-bar">
        <!--<div>通讯状态:</div>-->
        <!--<div>-->
          <!--<img v-show="false" class="header-icon" src="@/assets/images/succeed.png" />-->
          <!--<img v-show="true" class="header-icon" src="@/assets/images/failed.png" />-->
        <!--</div>-->
        <div>设备型号:</div>
        <div>{{devType}}</div>
      </div>
    </footer>
    <!-- 弹窗集合组件 -->
      <udialog :title="dialogTitle" :dialogVisible="dialogVisible" @isDialogVisible="isDialogVisible"></udialog>
      <kfsDialog @sub_event="subEvent" :showDialog="showDialog" v-if="showDialog=='kfs'"></kfsDialog>
      <monIpDialog @sub_event="subEvent" :showDialog="showDialog"></monIpDialog>
      <ipConfigDialog @sub_event="subEvent" :showDialog="showDialog"></ipConfigDialog>
      <serialDialog @sub_event="subEvent" :showDialog="showDialog" v-if="showDialog=='serial'"></serialDialog>
      <userModelDialog @sub_event="subEvent" v-if="showDialog=='userModel'" :showDialog="showDialog"></userModelDialog>
      <saveUserModelDialog @sub_event="subEvent" v-if="showDialog=='saveUserModel'" :showDialog="showDialog"></saveUserModelDialog>
      <multiSyncDialog @sub_event="subEvent" :showDialog="showDialog" v-if="showDialog=='multi'"></multiSyncDialog>
      <edidDialog @sub_event="subEvent" :showDialog="showDialog" v-if="showDialog=='edid' || showDialog=='edidSingle'"></edidDialog>
      <edidAdvancedDialog @sub_event="subEvent" :showDialog="showEdidAdvancedDialog" v-if="showEdidAdvancedDialog=='edidAdvanced'"></edidAdvancedDialog>
      <screenCtrDialog @sub_event="subEvent" :showDialog="showDialog" v-if="showDialog=='screenCtr'"></screenCtrDialog>
      <screenBrightDialog @sub_event="subEvent" v-if="showDialog=='screenBright'" :showDialog="showDialog"></screenBrightDialog>
      <tempDialog @sub_event="subEvent" v-if="showDialog=='temp'" :showDialog="showDialog"></tempDialog>
      <versionDialog @sub_event="subEvent" v-if="showDialog=='version'" :showDialog="showDialog"></versionDialog>
      <deviceStatusDialog @sub_event="subEvent" v-if="showDialog=='deviceStatus'" :showDialog="showDialog"></deviceStatusDialog>
      <hotBackupDialog @sub_event="subEvent" v-if="showDialog=='hotBackup'" :showDialog="showDialog"></hotBackupDialog>
      <workModeDialog @sub_event="subEvent" v-if="showDialog=='workMode'" :showDialog="showDialog"></workModeDialog>
      <eqDialog @sub_event="subEvent" v-if="showDialog=='eq'" :showDialog="showDialog"></eqDialog>
      <vgaDialog @sub_event="subEvent" v-if="showDialog=='vga'" :showDialog="showDialog"></vgaDialog>
      <resetDialog @sub_event="subEvent" v-if="showDialog=='reset'" :showDialog="showDialog"></resetDialog>
      <userDialog @sub_event="subEvent" v-if="showDialog=='user'" :showDialog="showDialog"></userDialog>
      <showEdidDialog @sub_event="subEvent" v-if="showDialog=='showEdid'" :showDialog="showDialog"></showEdidDialog>
      <uploadDialog @sub_event="subEvent" v-if="showUploadDialog!=''" :showDialog="showUploadDialog"></uploadDialog>
  </div>
</template>

<script>
// @ is an alias to /src
import card from "@/components/operation/Card";
import cardItem from "@/components/operation/CardItem";
import cardChild from "@/components/operation/CardChild";

// const udialog = ()=>import("@/components/dialog");
// const signal = ()=>import("@/components/signal");
// const vdr = ()=>import("@/components/vdr");
// const attr = ()=>import("@/components/attr");
// const kfsDialog = ()=>import("@/components/panel/kfsDialog");
// const serialDialog = ()=>import("@/components/panel/serialDialog");
// const multiSyncDialog = ()=>import("@/components/panel/multiSyncDialog");
// const userModelDialog = ()=>import("@/components/panel/userModelDialog");
// const saveUserModelDialog = ()=>import("@/components/panel/saveUserModelDialog");
// const monIpDialog = ()=>import("@/components/panel/monIpDialog");
// const ipConfigDialog = ()=>import("@/components/panel/ipConfigDialog");
// const edidDialog = ()=>import("@/components/panel/edidDialog");
// const screenCtrDialog = ()=>import("@/components/panel/screenCtrDialog");
// const screenBrightDialog = ()=>import("@/components/panel/screenBrightDialog");
// const tempDialog = ()=>import("@/components/panel/tempDialog");
// const versionDialog = ()=>import("@/components/panel/versionDialog");
// const deviceStatusDialog = ()=>import("@/components/panel/deviceStatusDialog");
// const edidAdvancedDialog = ()=>import("@/components/panel/edidAdvancedDialog");
// const hotBackupDialog = ()=>import("@/components/panel/hotBackupDialog");
// const workModeDialog = ()=>import("@/components/panel/workModeDialog");
// const eqDialog = ()=>import("@/components/panel/eqDialog");
// const vgaDialog = ()=>import("@/components/panel/vgaDialog");


import udialog from "@/components/dialog";

import signal from "@/components/signal";

import vdr from "@/components/vdr";

import attr from "@/components/attr";

import kfsDialog from "@/components/panel/kfsDialog";

import serialDialog from "@/components/panel/serialDialog";

import multiSyncDialog from "@/components/panel/multiSyncDialog";

import userModelDialog from "@/components/panel/userModelDialog";

import saveUserModelDialog from "@/components/panel/saveUserModelDialog";

import monIpDialog from "@/components/panel/monIpDialog";

import ipConfigDialog from "@/components/panel/ipConfigDialog";

import edidDialog from "@/components/panel/edidDialog";

import screenCtrDialog from "@/components/panel/screenCtrDialog";

import screenBrightDialog from "@/components/panel/screenBrightDialog";

import tempDialog from "@/components/panel/tempDialog";

import versionDialog from "@/components/panel/versionDialog";

import deviceStatusDialog from "@/components/panel/deviceStatusDialog";
import edidAdvancedDialog from "@/components/panel/edidAdvancedDialog";
import hotBackupDialog from "@/components/panel/hotBackupDialog";
import workModeDialog from "@/components/panel/workModeDialog";
import eqDialog from "@/components/panel/eqDialog";
import vgaDialog from "@/components/panel/vgaDialog";
import resetDialog from "@/components/panel/resetDialog";
import userDialog from "@/components/panel/userDialog";
import showEdidDialog from "@/components/panel/showEdidDialog";
import uploadDialog from "@/components/panel/uploadDialog";

let loading ;
// let loading_count=0;
const EDID_DETAILED_TIMING_OFFSET_8K = 128;
const EDID_DT_CFGBYTE_SYNC_WIDTH_L_8K = 12;// 7680
const EDID_DT_CFGBYTE_SYNC_WIDTH_H_8K= 13;
const EDID_DT_CFGBYTE_SYNC_HIGH_L_8K = 14;// 1080
const EDID_DT_CFGBYTE_SYNC_HIGH_H_8K=15
const EDID_DT_CFGBYTE_PIXELCLOCK_L_8K=41// 52250 - 1 = pixel clock freq - 1
const EDID_DT_CFGBYTE_PIXELCLOCK_H_8K=42
const EDID_DT_CFGBYTE_ACTIVE_PIXEL_L_8K=45// 7680 - 1 = active pixel - 1
const EDID_DT_CFGBYTE_ACTIVE_PIXEL_H_8K=46
const EDID_DT_CFGBYTE_H_BLANKING_L_8K = 47// 160 - 1 = h blank - 1
const EDID_DT_CFGBYTE_H_BLANKING_H_8K =48
const EDID_DT_CFGBYTE_H_SYNC_OFFSET_L_8K=49// 48 - 1 = h frontporch and + hsync - 1
const EDID_DT_CFGBYTE_H_SYNC_OFFSET_H_8K=50
const EDID_DT_CFGBYTE_H_SYNC_WIDTH_L_8K=51// 32 - 1 = h synctime - 1
const EDID_DT_CFGBYTE_H_SYNC_WIDTH_H_8K=52
const EDID_DT_CFGBYTE_ACTIVE_LINE_L_8K =53// 1080 - 1 = active line - 1
const EDID_DT_CFGBYTE_ACTIVE_LINE_H_8K =54
const EDID_DT_CFGBYTE_V_BLANKING_L_8K =55// 31 - 1 = v blank - 1
const EDID_DT_CFGBYTE_V_BLANKING_H_8K =56
const EDID_DT_CFGBYTE_V_SYNC_OFFSET_L_8K =57// 3 - 1 = v frontporch and -vsync - 1
const EDID_DT_CFGBYTE_V_SYNC_OFFSET_H_8K =58
const EDID_DT_CFGBYTE_V_SYNC_WIDTH_L_8K =59// 10 - 1 = v synctime - 1
const EDID_DT_CFGBYTE_V_SYNC_WIDTH_H_8K =60

const EDID_DETAILED_TIMING_OFFSET  =0x36
// const EDID_PER_DETAILED_TIMING_LEN =18

const EDID_DT_CFGBYTE_PIXELCLOCK_L =0x00
const EDID_DT_CFGBYTE_PIXELCLOCK_H =0x01
const EDID_DT_CFGBYTE_H_ACTIVE_L  =0x02
const EDID_DT_CFGBYTE_H_BLANKING_L = 0x03
const EDID_DT_CFGBYTE_H_ACTIVE_H = 0x04  // valid bit: (bit7~bit4)
const EDID_DT_CFGBYTE_H_BLANKING_H = 0x04  // valid bit: (bit3~bit0)
const EDID_DT_CFGBYTE_V_ACTIVE_L = 0x05
const EDID_DT_CFGBYTE_V_BLANKING_L = 0x06
const EDID_DT_CFGBYTE_V_ACTIVE_H =0x07  // valid bit: (bit7~bit4)
const EDID_DT_CFGBYTE_V_BLANKING_H = 0x07  // valid bit: (bit3~bit0)
const EDID_DT_CFGBYTE_H_SYNC_OFFSET_L =0x08
const EDID_DT_CFGBYTE_H_SYNC_WIDTH_L =0x09
const EDID_DT_CFGBYTE_V_SYNC_OFFSET_L =0x0A  // valid bit: (bit7~bit4)
const EDID_DT_CFGBYTE_V_SYNC_WIDTH_L  =0x0A  // valid bit: (bit3~bit0)
const EDID_DT_CFGBYTE_H_SYNC_OFFSET_H = 0x0B  // valid bit: (bit7~bit6)
const EDID_DT_CFGBYTE_H_SYNC_WIDTH_H = 0x0B  // valid bit: (bit5~bit4)
const EDID_DT_CFGBYTE_V_SYNC_OFFSET_H =0x0B  // valid bit: (bit3~bit2)
const EDID_DT_CFGBYTE_V_SYNC_WIDTH_H = 0x0B  // valid bit: (bit1~bit0)


export default {
  name: "Home",
    created(){
      this.loadVersion();
      this.globalEvent.$on('sync',()=>{
          this.preinstall('sync');
      });
      this.maxHeight=window.innerHeight-200;
      window.addEventListener("resize",()=>{
          this.maxHeight=window.innerHeight-200;
      })
    },
  data() {
    return {
        activeName: "0", // 侧边栏选项
        activeList: ["信号管理", "用户模式", "场景轮巡", "信号源分组"], // 侧边栏选项列表
        isEcho: false, // 是否回传
        dialogVisible: false, // 弹出对话框
        dialogTitle: "",
        drawCenter: true,
        // positionLock: false, //位置锁定
        showDialog:'',
        showUploadDialog:'',
        showEdidAdvancedDialog:'',
        showEdidDialog:false,
        devType:'',
        updateFlip:true,
        edidData:[],
        edidParam:{},//高级edid设置使用
        maxHeight:500,
        EDID:[],
        curScreen:{}
        // scale:1,
    };
  },
    // watch:{
    //   "globalEvent.selectedWindowIndex":function (v) {
    //       if(v>-1){
    //           this.positionLock=this.globalEvent.windowItemsInfo.winArr[v].lock==1;
    //       }
    //   }
    // },
  methods: {
    // 预设:1-用户模式、2-保存模式、3-出厂设置、4-同步、5-打开回显、6-关闭回显、7-回显设置 8 输出开,9输出关
      preinstall(setFn) {

      console.log(setFn);
      if (setFn === "5") {
        this.isEcho = true;
      }
      if (setFn === "6") {
        this.isEcho = false;
      }
      if( setFn==='3'){
           this.showDialog='reset';
      }
      else if(setFn=='8'){
          this.$http.post("outStaWr.cgi",{outSta:0},(ret)=>{

          });
      }
      else if(setFn=='9'){
          this.$http.post("outStaWr.cgi",{outSta:1},(ret)=>{

          });
      } else if(setFn=='10'){
          //开屏
          this.$http.post("extCtrlOprWr.cgi",{funcOpr:1},(ret)=>{
              alert("已发送开屏命令");
          });
      }
      else if(setFn=='11'){
          //关屏
          this.$http.post("extCtrlOprWr.cgi",{funcOpr:0},(ret)=>{
              alert("已发送关屏命令")
          });
      }
      else if(setFn=='sync'){

          loading=this.$loading({
              lock: true,
              text: '同步中',
              spinner: 'el-icon-loading',
              background: 'rgba(255, 255, 255, 0.5)'
          });
          setTimeout(()=>{loading.close();},2000);
          this.$refs.signal.getCommonInfo();
          this.$refs.signal.getSysInputInfo();
          this.$refs.vdr.loadData();
      }
    },
    // 设置:2-屏幕配置
      setting(setFn) {

        if (setFn === "2") {
          this.dialogTitle = "ConfigureScreen";
          this.dialogVisible = true;
        }
      }, // 屏幕配置回调函数
      isDialogVisible(bool) {
        this.dialogVisible = bool;
      }, // 屏幕编辑面板超出范围取消居中回调函数
      alignCenter(bool) {
        this.drawCenter = bool;
      },
      addScreen(){
          this.globalEvent.$emit("add_window_item",{act:'btn'});//vdr/index.vue
      },
      loadScreen(seq){
          console.log(seq,this.globalEvent.screenInfo.scrGroupArr.length);
          if(seq>=this.globalEvent.screenInfo.scrGroupArr.length){
              alert("屏幕墙不存在");
              return ;
          }
          this.globalEvent.$emit('load_screen',{seq});
      },
      loadVersion(){
          this.$http.get("verInfoRd.cgi",{},(ret)=>{
              this.devType=ret.data.devType;
              this.globalEvent.versionInfo=ret.data;
          });
      },
      reloadMainPane(){
          //刷新界面
          this.updateFlip=false;
          this.$nextTick(()=>{
              setTimeout(()=>{
                  this.updateFlip=true;
              },300);
          })
      },
      // winLock(){
      //     //位置锁定
      //     this.positionLock=!this.positionLock;
      //     let w=this.globalEvent.selectedWindowIndex;
      //     if(w>-1){
      //         this.globalEvent.windowItemsInfo.winArr[w].lock=this.positionLock?1:0;
      //     }
      // },
      calClock(){
          // for(let k in curScreen){
          //     curScreen[k]=parseInt(curScreen[k]);
          // }
          // let hTotal=curScreen.FormatW+curScreen.HFrontPorch+curScreen.HSyncTime+curScreen.HBackPorch;
          // let vTotal=curScreen.FormatH+curScreen.VFrontPorch+curScreen.VSyncTime+curScreen.VBackPorch;
          // // curScreen.FrameRate=Number(curScreen.ClkFreq*1000/hTotal/vTotal).toFixed(2);
          // curScreen.ClkFreq=curScreen.FrameRate*hTotal*vTotal/1000;
          // return curScreen;
          for(let k in this.curScreen){
              this.curScreen[k]=parseInt(this.curScreen[k]);
          }
          let hTotal=this.curScreen.FormatW+this.curScreen.HFrontPorch+this.curScreen.HSyncTime+this.curScreen.HBackPorch;
          let vTotal=this.curScreen.FormatH+this.curScreen.VFrontPorch+this.curScreen.VSyncTime+this.curScreen.VBackPorch;
          // this.curScreen.FrameRate=this.curScreen.ClkFreq*1000/hTotal/vTotal
          this.curScreen.ClkFreq=this.curScreen.FrameRate*hTotal*vTotal/1000;

      },
      subEvent(param){
          console.log(param);
          if('close_kfs'==param.act){
              this.showDialog='';
          }
          else if('select_user_model'==param.act){
              this.showDialog='';
              this.$refs.signal.loadUserModel(param.v);
          }
          else if("update_user_model"==param.act){
              this.$refs.signal.userSceneList[param.seq].label=param.name;
              this.$refs.signal.userSceneList[param.seq].value=1;
              this.globalEvent.commonInfo.presetStaArr[param.seq]=1;
              // this.$set(this.globalEvent.commonInfo.presetStaArr,param.seq,1);
              this.$refs.signal.syncLocalName();
              this.showDialog='';
          }
          else if('show_edid_advanced'==param.act){
              this.showEdidAdvancedDialog='edidAdvanced';
              this.edidParam=param.info;
          }
          else if('sure_edid'==param.act){
              let info=this.info===undefined?{}:this.info;

              this.curScreen={
                      ClkFreq:0,
                      FormatW:param.w,
                      FormatH:param.h,
                      FrameRate:param.f,
                      HFrontPorch:48,
                      HSyncTime:32,
                      HBackPorch:80,
                      VFrontPorch:12,
                      VSyncTime:8,
                      VBackPorch:12
              };
              this.calClock();

              if(Object.keys(info).length==0){
                    //非高级设置
                  let num=this.globalEvent.sourceCardNumber();
                  this.calEdid();
                  info={
                      srcCardId:num[0],
                      srcId:num[1],
                      EdidDataArr:this.EDID
                  }

                  console.log('simple edid');
                  if(this.showDialog=='edid'){
                      info.srcCardId=0xff;
                  }
              }

              info.devId=param.devId;
              console.log(info);
              this.$http.post("srcEdidWr.cgi",info,()=>{
                  this.info=undefined;
                  this.showDialog='';
              });
          }
          else if('sure_edid_advanced'==param.act){
              this.info=param.info;
              this.showEdidAdvancedDialog='';
          }
          else if('close_edid_advanced'==param.act){
              this.showEdidAdvancedDialog='';
          }
          else if('hot_backup'==param.act){
              this.showDialog='hotBackup'
          }
          else if('work_mode'==param.act){
              this.showDialog='workMode';
          }
          else if('eq'==param.act){
              console.log("eq");
              this.showDialog='eq';
          }
          else if('vga'==param.act){
              this.showDialog='vga';
          }
          else if('show_edid_single'==param.act){
              this.showDialog='edidSingle';
          }
          else if('rdEdid'==param.act){
              let num=this.globalEvent.sourceCardNumber();
              this.$http.post("srcEdidRd.cgi",{srcCardId:num[0],srcId:num[1]},(ret)=>{
                  this.edidData=ret.data.EdidDataArr;
                  this.showDialog='showEdid';
              });
          }
          else if('close_upload'==param.act){
              this.showUploadDialog='';
          }
      },
      calEdid(){

          let EDID=[];
          if(this.curScreen.FormatW>4096){
              let offset = EDID_DETAILED_TIMING_OFFSET_8K;
              EDID=[
                  0x00,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0x00,0x2F,0x33,0x05,0x68,0x78,0x56,0x34,0x12,
                  0x2E,0x19,0x01,0x03,0x80,0x3E,0x22,0x78,0xEA,0x08,0xA5,0xA2,0x57,0x4F,0xA2,0x28,
                  0x0F,0x50,0x54,0xA5,0x4B,0x00,0xD1,0xC0,0xA9,0x40,0x81,0x80,0x81,0x00,0x71,0x4F,
                  0xE1,0x00,0x01,0x01,0x01,0x01,0x4D,0xD0,0x00,0xA0,0xF0,0x70,0x3E,0x80,0x30,0x20,
                  0x35,0x00,0x5F,0x59,0x21,0x00,0x00,0x1A,0xA3,0x66,0x00,0xA0,0xF0,0x70,0x1F,0x80,
                  0x30,0x20,0x35,0x00,0x55,0x50,0x21,0x00,0x00,0x1A,0x00,0x00,0x00,0xFF,0x00,0x49,
                  0x54,0x36,0x38,0x30,0x35,0x45,0x56,0x42,0x33,0x38,0x34,0x30,0x00,0x00,0x00,0xFC,
                  0x00,0x4B,0x59,0x53,0x2D,0x39,0x30,0x30,0x30,0x50,0x30,0x5F,0x30,0x30,0x01,0xEF,

                  0x70,0x12,0x38,0x03,0x00,0x01,0x00,0x0C,0x00,0x00,0x00,0x00,0x00,0x1E,0x38,0x04,
                  0x08,0x78,0x4E,0x77,0x09,0x00,0x0F,0x00,0x00,0x00,0x9F,0xF0,0x00,0x01,0xFF,0x01,
                  0x00,0x01,0xFF,0x01,0x00,0x60,0x03,0x00,0x14,0x07,0xE8,0x00,0x88,0xFF,0x1D,0x5F,
                  0x04,0x5F,0x81,0xAF,0x00,0x37,0x04,0x2C,0x00,0x03,0x00,0x04,0x00,0xF4,0x00,0x00,
                  0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
                  0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
                  0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
                  0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x90,
              ];
              EDID[offset + EDID_DT_CFGBYTE_PIXELCLOCK_L_8K] = ((this.curScreen.ClkFreq / 10) - 1)&0xff;//时钟要先除以10，否则会超出两个字节
              EDID[offset + EDID_DT_CFGBYTE_PIXELCLOCK_H_8K] = (((this.curScreen.ClkFreq / 10) - 1)>>8)&0xff;
              EDID[offset + EDID_DT_CFGBYTE_SYNC_WIDTH_L_8K] = this.curScreen.FormatW&0xff;
              EDID[offset + EDID_DT_CFGBYTE_SYNC_WIDTH_H_8K] = (this.curScreen.FormatW>>8)&0xff;
              EDID[offset + EDID_DT_CFGBYTE_SYNC_HIGH_L_8K] = this.curScreen.FormatH&0xff;
              EDID[offset + EDID_DT_CFGBYTE_SYNC_HIGH_H_8K] = (this.curScreen.FormatH>>8)&0xff;
              EDID[offset + EDID_DT_CFGBYTE_ACTIVE_PIXEL_L_8K] = (this.curScreen.FormatW-1)&0xff;
              EDID[offset + EDID_DT_CFGBYTE_ACTIVE_PIXEL_H_8K] = ((this.curScreen.FormatW-1)>>8)&0xff;
              EDID[offset + EDID_DT_CFGBYTE_ACTIVE_LINE_L_8K] = (this.curScreen.FormatH-1)&0xff;
              EDID[offset + EDID_DT_CFGBYTE_ACTIVE_LINE_H_8K] = ((this.curScreen.FormatH-1)>>8)&0xff;

              EDID[offset + EDID_DT_CFGBYTE_H_BLANKING_L_8K] = (this.curScreen.HFrontPorch + this.curScreen.HSyncTime + this.curScreen.HBackPorch - 1)&0xff;
              EDID[offset + EDID_DT_CFGBYTE_H_BLANKING_H_8K] = ((this.curScreen.HFrontPorch + this.curScreen.HSyncTime + this.curScreen.HBackPorch - 1)>>8)&0xff;
              EDID[offset + EDID_DT_CFGBYTE_H_SYNC_OFFSET_L_8K] = (this.curScreen.HFrontPorch + this.curScreen.HSyncTime - 1)&0xff;
              EDID[offset + EDID_DT_CFGBYTE_H_SYNC_OFFSET_H_8K] = ((this.curScreen.HFrontPorch + this.curScreen.HSyncTime - 1)>>8)&0xff + 0x80;
              EDID[offset + EDID_DT_CFGBYTE_H_SYNC_WIDTH_L_8K] = (this.curScreen.HSyncTime - 1)&0xff;
              EDID[offset + EDID_DT_CFGBYTE_H_SYNC_WIDTH_H_8K] = ((this.curScreen.HSyncTime - 1)>>8)&0xff;
              EDID[offset + EDID_DT_CFGBYTE_V_BLANKING_L_8K] = (this.curScreen.VFrontPorch + this.curScreen.VSyncTime + this.curScreen.HBackPorch - 1)&0xff;
              EDID[offset + EDID_DT_CFGBYTE_V_BLANKING_H_8K] = ((this.curScreen.VFrontPorch + this.curScreen.VSyncTime + this.curScreen.HBackPorch - 1)>>8)&0xff;
              EDID[offset + EDID_DT_CFGBYTE_V_SYNC_OFFSET_L_8K] = (this.curScreen.VFrontPorch - this.curScreen.VSyncTime - 1)&0xff;
              EDID[offset + EDID_DT_CFGBYTE_V_SYNC_OFFSET_H_8K] = ((this.curScreen.VFrontPorch - this.curScreen.VSyncTime - 1)>>8)&0xff;
              EDID[offset + EDID_DT_CFGBYTE_V_SYNC_WIDTH_L_8K] = (this.curScreen.VSyncTime - 1)&0xff;
              EDID[offset + EDID_DT_CFGBYTE_V_SYNC_WIDTH_H_8K] = ((this.curScreen.VSyncTime - 1)>>8)&0xff;

              let sum = 0;
              for(let i = 129; i < 60; i++)
              {
                  sum += EDID[i];
              }
              EDID[127 + 2 + 60] = (0x100 - (sum&0xff))&0xff;//checksum

          }
          else{
              {
                  let offset = EDID_DETAILED_TIMING_OFFSET;
                  EDID=[
                      0x00,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0x00,0x2F,0x33,0x05,0x68,0x78,0x56,0x34,0x12,
                      0x2E,0x19,0x01,0x03,0x80,0x3E,0x22,0x78,0xEA,0x08,0xA5,0xA2,0x57,0x4F,0xA2,0x28,
                      0x0F,0x50,0x54,0xA5,0x4B,0x00,0xD1,0xC0,0xA9,0x40,0x81,0x80,0x81,0x00,0x71,0x4F,
                      0xE1,0x00,0x01,0x01,0x01,0x01,0x4D,0xD0,0x00,0xA0,0xF0,0x70,0x3E,0x80,0x30,0x20,
                      0x35,0x00,0x5F,0x59,0x21,0x00,0x00,0x1A,0xA3,0x66,0x00,0xA0,0xF0,0x70,0x1F,0x80,
                      0x30,0x20,0x35,0x00,0x55,0x50,0x21,0x00,0x00,0x1A,0x00,0x00,0x00,0xFF,0x00,0x49,
                      0x54,0x36,0x38,0x30,0x35,0x45,0x56,0x42,0x33,0x38,0x34,0x30,0x00,0x00,0x00,0xFC,
                      0x00,0x4B,0x59,0x53,0x2D,0x39,0x30,0x30,0x30,0x50,0x30,0x5F,0x30,0x30,0x01,0xEF,

                      0x02,0x03,0x37,0xF1,0x51,0x61,0x00,0x5F,0x5E,0x5D,0x10,0x1F,0x20,0x05,0x14,0x04,
                      0x13,0x12,0x11,0x03,0x02,0x01,0x23,0x09,0x07,0x07,0x83,0x01,0x00,0x00,0x6D,0x03,
                      0x0C,0x00,0x10,0x00,0x00,0x3C,0x20,0x00,0x60,0x01,0x02,0x03,0x67,0xD8,0x5D,0xC4,
                      0x01,0x78,0x80,0x03,0x02,0x0F,0x03,0x56,0x5E,0x00,0xA0,0xA0,0xA0,0x29,0x50,0x30,
                      0x20,0x35,0x00,0x55,0x50,0x21,0x00,0x00,0x1E,0x02,0x3A,0x80,0x18,0x71,0x38,0x2D,
                      0x40,0x58,0x2C,0x45,0x00,0xE0,0x0E,0x11,0x00,0x00,0x1E,0x01,0x1D,0x00,0x72,0x51,
                      0xD0,0x1E,0x20,0x6E,0x28,0x55,0x00,0x40,0xB4,0x10,0x00,0x00,0x1E,0x00,0x00,0x00,
                      0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xA1,
                  ];
                  EDID[offset + EDID_DT_CFGBYTE_PIXELCLOCK_L] = (this.curScreen.ClkFreq / 10)&0xff;//时钟要先除以10，否则会超出两个字节
                  EDID[offset + EDID_DT_CFGBYTE_PIXELCLOCK_H] = ((this.curScreen.ClkFreq / 10)>>8)&0xff;
                  EDID[offset + EDID_DT_CFGBYTE_H_ACTIVE_L] = this.curScreen.FormatW&0xff;
                  EDID[offset + EDID_DT_CFGBYTE_H_BLANKING_L] = (this.curScreen.HFrontPorch + this.curScreen.HSyncTime + this.curScreen.HBackPorch)&0xff;
                  EDID[offset + EDID_DT_CFGBYTE_H_ACTIVE_H] = ((this.curScreen.FormatW>>8)&0x0f)<<4;
                  EDID[offset + EDID_DT_CFGBYTE_H_BLANKING_H] |= ((this.curScreen.HFrontPorch + this.curScreen.HSyncTime + this.curScreen.HBackPorch)>>8)&0x0f;

                  EDID[offset + EDID_DT_CFGBYTE_V_ACTIVE_L] = this.curScreen.FormatH&0xff;
                  EDID[offset + EDID_DT_CFGBYTE_V_BLANKING_L] = (this.curScreen.VFrontPorch + this.curScreen.VSyncTime + this.curScreen.VBackPorch)&0xff;
                  EDID[offset + EDID_DT_CFGBYTE_V_ACTIVE_H] = ((this.curScreen.FormatH>>8)&0x0f)<<4;
                  EDID[offset + EDID_DT_CFGBYTE_V_BLANKING_H] |= ((this.curScreen.VFrontPorch + this.curScreen.VSyncTime + this.curScreen.VBackPorch)>>8)&0x0f;
                  EDID[offset + EDID_DT_CFGBYTE_H_SYNC_OFFSET_L] = (this.curScreen.HFrontPorch)&0xff;
                  EDID[offset + EDID_DT_CFGBYTE_H_SYNC_WIDTH_L] = this.curScreen.HSyncTime&0xff;
                  EDID[offset + EDID_DT_CFGBYTE_V_SYNC_OFFSET_L] = ((this.curScreen.VFrontPorch)&0x0f)<<4;
                  EDID[offset + EDID_DT_CFGBYTE_V_SYNC_WIDTH_L] |= this.curScreen.VSyncTime&0x0f;
                  EDID[offset + EDID_DT_CFGBYTE_H_SYNC_OFFSET_H] = (((this.curScreen.HFrontPorch)>>8)&0x3)<<6;
                  EDID[offset + EDID_DT_CFGBYTE_H_SYNC_WIDTH_H] |= ((this.curScreen.HSyncTime>>8)&0x3)<<4;
                  EDID[offset + EDID_DT_CFGBYTE_V_SYNC_OFFSET_H] |= (((this.curScreen.VFrontPorch)>>4)&0x3)<<2;
                  EDID[offset + EDID_DT_CFGBYTE_V_SYNC_WIDTH_H] |= ((this.curScreen.VSyncTime>>4)&0x3)<<0;

                  let sum = 0;
                  for(let i = 0; i < 127; i++)
                  {
                      sum += EDID[i];
                  }
                  EDID[127] = (0x100 - (sum&0xff))&0xff;//checksum
              }
          }

          this.EDID=EDID;

      },
  },
  components: {
      card,
      cardItem,
      cardChild,
      udialog,
      vdr,
      attr,
      signal,
      kfsDialog,
      serialDialog,
      multiSyncDialog,
      userModelDialog,
      saveUserModelDialog,
      monIpDialog,
      ipConfigDialog,
      edidDialog,
      edidAdvancedDialog,
      screenCtrDialog,
      screenBrightDialog,
      tempDialog,
      versionDialog,
      deviceStatusDialog,
      hotBackupDialog,
      workModeDialog,
      eqDialog,
      vgaDialog,
      resetDialog,
      userDialog,
      showEdidDialog,
      uploadDialog,
  },
};
</script>

<style lang="scss">
.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  header {
    flex: 0 0 100px;
    /deep/ .el-tabs__content {
      padding: 6px;
    }
    /deep/ .el-tabs__item {
      height: 30px;
      line-height: 30px;
    }
    /deep/ .el-tabs--border-card {
      box-shadow: none;
    }
    .card-s {
      display: flex;
      .card-item {
        height: 52px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }
  }
  center {
    flex: 1;
    display: flex;
    .content-title {
      height: 30px;
      line-height: 30px;
      border-bottom: 1px solid #dcdfe6;
      color: #909399;
      font-size: 14px;
    }
    .content {
      flex: 1;
      .content-draw {
        height: calc(100% - 30px);
        display: flex;
        flex-direction: column;
        .draw-panel {
          flex: 1;
          min-height: 418px;
          position: relative;
          overflow: scroll;
        /*  .draw-center {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }*/
          .draw-content {
            background-color: #f5f7fa;
            border: 1px solid #dcdfe6;
            position: absolute;
          }
        }
        /*.display-list {*/
          /*flex: 0 0 140px;*/
          /*border-top: 1px solid #dcdfe6;*/
        /*}*/
      }
    }
    .el-collapse-item__header {
      height: 35px;
      line-height: 35px;
    }
    .content-compile {
      flex: 0 0 210px;
      border-left: 1px solid #dcdfe6;
    }
  }
  footer {
    flex: 0 0 30px;
    border-top: 1px solid #dcdfe6;
    padding-left: 6px;
    background-color: #f5f7fa;
    .status-bar {
      width: 204px;
      height: 100%;
      border-right: 1px solid #dcdfe6;
      color: #909399;
      font-size: 14px;
      display: flex;
      justify-content: left;
      // align-items: center;
      div {
        line-height: 28px;
      }
      div:nth-child(2) {
        width: 20px;
        line-height: 30px;
        padding: 0px 2px;
        display: flex;
        align-items: center;
        .header-icon {
          width: 18px;
          height: 18px;
        }
      }
      div:nth-child(4) {
        width: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

}
</style>
