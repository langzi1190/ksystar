<template>
    <div style="height:100%;width:100%;">
        <div class="home" v-if="isLogin==1">
            <!-- 头部菜单显示 -->
            <header>
                <el-tabs type="border-card" value="1">
                    <el-tab-pane :label="LANG.HOME_DEV">
                        <div class="card-s">
                            <card :title="LANG.HOME_DEV">
                                <card-item :title="LANG.HOME_DEV_SELECT"></card-item>
                                <card-item :title="LANG.HOME_CONNECT_DEVICE"></card-item>
                                <card-item :title="LANG.HOME_DISCONNECT_DEVICE"></card-item>
                                <card-item :title="LANG.HOME_SYNC"></card-item>
                                <card-item :title="LANG.HOME_EXIT" @click.native="isLogin=0"></card-item>
                            </card>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane :label="LANG.HOME_MAIN_FUNC">
                        <div class="card-s">
                            <card :title="LANG.SETTING">
                                <card-item :title="LANG.HOME_OPEN_WINDOW" @click.native="addScreen" iconName="plus"></card-item>
                                <card-item :title="LANG.HOME_SCREEN_SETTING" iconName="display" @click.native="setting('2')"  :class="{'card-item-disabled':allowScreen==0}"></card-item>
                            </card>
                            <card :title="LANG.HOME_PRESET">
                                <card-item :title="LANG.HOME_USER_MODE" @click.native="showDialog='userModel'"></card-item>
                                <card-item :title="LANG.HOME_SAVE_USER_MODE" :class="{'card-item-disabled':allowSaveMode==0}" @click.native="showDialog='saveUserModel'"></card-item>
                                <card-item :title="LANG.HOME_DEFAULT_FACTORY" @click.native="preinstall('3')"  :class="{'card-item-disabled':allowFactory==0}"></card-item>
                                <card-item :title="LANG.HOME_SYNC" @click.native="preinstall('sync')"></card-item>
                                <card-item :title="LANG.HOME_ECHO_ON" :isChecked="isEcho===true" @click.native="preinstall('5')"></card-item>
                                <card-item :title="LANG.HOME_ECHO_OFF" :isChecked="isEcho===false" @click.native="preinstall('6')"></card-item>
                                <card-item :title="LANG.HOME_ECHO_CONFIG" @click.native="showDialog='monIp'"></card-item>
                            </card>
                            <card :title="LANG.HOME_SWITCH_WALL">
                                <card-item :title="LANG.HOME_WALL_1" seq='0' @click.native="loadScreen(0)"  iconName="display"></card-item>
                                <card-item :title="LANG.HOME_WALL_2" seq='1' @click.native="loadScreen(1)" iconName="display"></card-item>
                                <div class="card-item">
                                    <card-child :title="LANG.HOME_WALL_3" seq='2' @click.native="loadScreen(2)"  iconName="display"></card-child>
                                    <card-child :title="LANG.HOME_WALL_4" seq='3' @click.native="loadScreen(3)"  iconName="display"></card-child>
                                    <card-child :title="LANG.HOME_WALL_5" seq='4' @click.native="loadScreen(4)"  iconName="display"></card-child>
                                </div>
                                <div class="card-item">
                                    <card-child :title="LANG.HOME_WALL_6" seq='5' @click.native="loadScreen(5)"  iconName="display"></card-child>
                                    <card-child :title="LANG.HOME_WALL_7" seq='6' @click.native="loadScreen(6)"  iconName="display"></card-child>
                                    <card-child :title="LANG.HOME_WALL_8" seq='7' @click.native="loadScreen(7)"  iconName="display"></card-child>
                                </div>
                            </card>
                            <card :title="LANG.HOME_EXTENAL_CONTROL">
                                <div class="card-item card-external">
                                    <card-child :title="LANG.HOME_OPEN_SCREEN"  @click.native="preinstall('10')" iconName="display"></card-child>
                                    <card-child :title="LANG.HOME_CLOSE_SCREEN"  @click.native="preinstall('11')" iconName="display"></card-child>
                                    <card-child :title="LANG.HOME_CHANNEL_CONFIG" iconName="display" @click.native="showDialog='screenCtr'"></card-child>
                                </div>
                            </card>
                            <card :title="LANG.HOME_LOCK">
                                <card-item
                                        :title="LANG.HOME_POSITION_LOCK"
                                        :isChecked="globalEvent.panelLock"
                                        @click.native="globalEvent.panelLock=!globalEvent.panelLock"
                                ></card-item>
                            </card>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane :label="LANG.HOME_TOOLS">
                        <div class="card-s">
                            <card :title="LANG.HOME_ADVANCE_MENU">
                                <card-item :title="LANG.HOME_USER"  :class="{'card-item-disabled':allowUser==0}" @click.native="showDialog='user'"></card-item>
                                <card-item @click.native="showDialog='screenBright'" :title="LANG.HOME_BRIGHT"></card-item>
                                <card-item @click.native="showDialog='kfs'" title="KFS"></card-item>
                                <card-item @click.native="showDialog='multi'" :title="LANG.HOME_MULTI_SYNC"></card-item>
                                <card-item :title="LANG.HOME_OUTPUT_SHUT"  @click.native="preinstall('8')"></card-item>
                                <card-item :title="LANG.HOME_OUTPUT_ON"  @click.native="preinstall('9')"></card-item>
                                <card-item :title="LANG.HOME_CONFIG_IMPORT" @click.native="opConfig('import')"></card-item>
                                <card-item :title="LANG.HOME_CONFIG_EXPORT" @click.native="opConfig('export')"></card-item>
                                <!--<card-item  style="width:80px;" title="设置所有DPHDMI4K卡" @click.native="showDialog='edid'"></card-item>-->
                                <card-item title="EDID" @click.native="showDialog='edid'"></card-item>
                            </card>
                            <card :title="LANG.HOME_LANGUAGE">
                                <!--<card-item title="语言设置"></card-item>-->
                                <el-select v-model="curLang" size="mini" style="width:90px;">
                                    <el-option
                                            v-for="(item,index) in langList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                    ></el-option>
                                </el-select>
                            </card>
                            <card :title="LANG.HOME_EXPERT">
                                <card-item @click.native="showDialog='serial'" :title="LANG.HOME_COM_CONFIG"></card-item>
                                <card-item :title="LANG.HOME_NET_CONFIG" @click.native="showDialog='ipConfig'"></card-item>
                                <card-item :title="LANG.HOME_COMPUTER"></card-item>
                                <card-item :title="LANG.HOME_DEMO_MODE" @click.native="showDialog='simulate'"></card-item>
                                <card-item @click.native="showDialog='deviceStatus'" :title="LANG.HOME_TEST"></card-item>
                                <card-item @click.native="showDialog='version'" :title="LANG.HOME_VERSION"></card-item>
                                <card-item @click.native="showDialog='temp'" :title="LANG.HOME_TEMPERATURE"></card-item>
                                <card-item :title="LANG.HOME_ARM_UPGRADE" @click.native="upgrade('arm')"></card-item>
                                <card-item style="width: 56px;" :title="LANG.HOME_FPGA_UPGRADE" @click.native="upgrade('fpga')"></card-item>
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
                    <div class="content-title">{{LANG.HOME_SIMULATION}}</div>
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
                    <div class="content-title">{{LANG.HOME_WINDOW_EDIT}}</div>
                    <div class="content-attr" :style="{minHeight:'200px',maxHeight:maxHeight+'px','overflow-y':'auto'}">
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
            <monIpDialog @sub_event="subEvent" :showDialog="showDialog" v-if="showDialog=='monIp'"></monIpDialog>
            <ipConfigDialog @sub_event="subEvent" :showDialog="showDialog" v-if="showDialog=='ipConfig'"></ipConfigDialog>
            <serialDialog @sub_event="subEvent" :showDialog="showDialog" v-if="showDialog=='serial'"></serialDialog>
            <userModelDialog @sub_event="subEvent" v-if="showDialog=='userModel'" :showDialog="showDialog"></userModelDialog>
            <saveUserModelDialog @sub_event="subEvent" v-if="showDialog=='saveUserModel'" :showDialog="showDialog"></saveUserModelDialog>
            <multiSyncDialog @sub_event="subEvent" :showDialog="showDialog" v-if="showDialog=='multi'"></multiSyncDialog>
            <edidDialog @sub_event="subEvent" ref="edid" :showDialog="showDialog" v-if="showDialog=='edid' || showDialog=='edidSingle'"></edidDialog>
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
            <simulateDialog @sub_event="subEvent" v-if="showDialog=='simulate'" :showDialog="showDialog"></simulateDialog>
            <importDialog @sub_event="subEvent" v-if="showDialog=='import'" :showDialog="showDialog"></importDialog>
        </div>
        <div v-else>
            <loginDialog @sub_event="subEvent"></loginDialog>
        </div>
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
import simulateDialog from "@/components/panel/simulateDialog";
import loginDialog from "@/components/panel/loginDialog";
import importDialog from "@/components/panel/importDialog";

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
      });
      this.globalEvent.$on('language',()=>{
          this.LANG=this.LANGUAGE[this.globalEvent.language];
          console.log(this.LANG);
      });

      let user=sessionStorage.getItem('login_user');
      if(user!==null){
          user=JSON.parse(user);
          this.globalEvent.userInfo=user;
          console.log(user);
          this.isLogin=1;
      }
      // setTimeout(()=>{this.isLogin=1;},5000);
    },
  watch:{
      isLogin(v,ov){
          if(v==1){
              this.userType=this.globalEvent.userInfo.type;
              if(this.userType==2){
                  this.allowUser=0;
                  this.allowScreen=0;
                  this.allowSaveMode=0;
                  this.allowFactory=0;
              }
              else if(this.userType==1){
                  this.allowUser=0;
                  this.allowFactory=0;
                  this.allowSaveMode=0;
              }
              else if(this.userType==0){
                  this.allowUser=1;
                  this.allowScreen=1;
                  this.allowSaveMode=1;
                  this.allowFactory=1;
              }
          }
          else{
              sessionStorage.removeItem('login_user');
              window.location.reload(true);
          }
      },
      curLang(v,ov){
          this.globalEvent.language=v;
          this.globalEvent.$emit("language");
          this.$http.post("languageWr.cgi",{lang:v=='zh'?0:1},()=>{

          });
      }
  },
  data() {
    return {
        isLogin:0,
        curLang:this.globalEvent.language,
        langList:[{value:'en',label:'English'},{value:'zh',label:'中文'}],
        // activeName: "0", // 侧边栏选项
        // activeList: ["信号管理", "用户模式", "场景轮巡", "信号源分组"], // 侧边栏选项列表
        isEcho: false, // 是否回传
        dialogVisible: false, // 弹出对话框
        dialogTitle: "",
        drawCenter: true,
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
        curScreen:{},
        advanceScreen:{},
        LANG:this.LANGUAGE[this.globalEvent.language],

        userType: 0,
        allowUser:1,
        allowScreen:1,
        allowSaveMode:1,
        allowFactory:1,
        // scale:1,
    };
  },
  methods: {
    // 预设:1-用户模式、2-保存模式、3-出厂设置、4-同步、5-打开回显、6-关闭回显、7-回显设置 8 输出开,9输出关
      preinstall(setFn) {

          // this.globalEvent.language='zh';
          // this.globalEvent.$emit('language');

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

          this.globalEvent.gMode=0;
          loading=this.$loading({
              lock: true,
              text: this.LANG.HOME_SYNC,
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
      opConfig(act){
          if(act=='export'){
              // let aEle = document.createElement("a");// 创建a标签
              // let blob = new Blob(['hhhhhhhh']);
              // aEle.download = "配置文件.bin";// 设置下载文件的文件名
              // aEle.href = window.URL.createObjectURL(blob);
              // aEle.click();// 设置点击事件 aEle.remove()

              // let that=this;
              // let fileSize=0;
              let packetNum=0;
              let packetId=0;
              let fileData=[];
              let that=this;
              let readFile=function () {
                  if(packetId>=packetNum){
                      //组装
                      let b=new Blob(fileData);
                      let aEle = document.createElement("a");
                      aEle.download="配置文件.bin";
                      aEle.href=window.URL.createObjectURL(b);
                      aEle.click();
                      return ;
                  }
                  let d={
                      opr:0xff,
                      packetId
                  };
                  that.$http.post("cfgExport.cgi",d,(ret)=>{
                      let data=ret.data.dataArr;
                      // fileData.push(data.flat());
                      data.forEach((v,i,arr)=>{
                          fileData.push(v);
                      })
                      packetId++;
                      readFile();
                  });
              }
              this.$http.post("cfgExport.cgi",{opr:0},(ret)=>{
                  fileSize=ret.data.fileSize;
                  packetNum=ret.data.packetNum;
                  readFile();
              });

          }
          else{
              this.showDialog='import';
          }
      },
      upgrade(act){
          let pass=prompt(this.LANG.TIP_INPUT_PASSWD,"");
          if(pass===null || pass==''){
              return ;
          }
          if(pass!='666888' &&  pass!=this.globalEvent.userInfo.password){
              alert(this.LANG.TIP_WRONG_PASSWD);
              return ;
          }

          if('arm'==act){
              let param={
                  chip:0,
                  board:0,
                  opr:1
              }
              this.$http.post("firmwareUpdate.cgi",param,(ret)=>{
                  alert(this.LANG.TIP_UPGRADE_SUCCESS)
              });
          }
          else if('fpga'==act){
              this.showUploadDialog='fpga'
          }
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
          if('login'==param.act){
              this.isLogin=1;
          }
          else if('close_kfs'==param.act){
              this.showDialog='';
          }
          else if("sure_kfs"==param.act){
              this.showDialog='';
              if(this.globalEvent.gMode==0){
                  this.$refs.signal.syscInputInfo({inCardArr:this.globalEvent.inputCardList});
              }
              else{
                  this.$refs.signal.syscInputInfoSm();
              }

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
              // let info=this.info===undefined?{}:this.info;

              if(Object.keys(this.advanceScreen).length>0){
                  this.curScreen=this.advanceScreen;
              }
              else{
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
              }

              this.calEdid();
              let num=this.globalEvent.sourceCardNumber();
              let info={
                  devId:parseInt(param.devId),
                  srcCardId:num[0],
                  srcId:num[1],
                  EdidDataArr:this.EDID
              };
              if(this.showDialog=='edid'){
                  info.srcCardId=0xff;
              }

              console.log(info);
              this.$http.post("srcEdidWr.cgi",info,()=>{
                  // this.info={};
                  this.advanceScreen={};
                  this.showDialog='';
              });
          }
          else if('sure_edid_advanced'==param.act){

              this.advanceScreen=param.advanceScreen;
              this.$refs.edid.setFrameRate(this.advanceScreen.FrameRate);
              this.showEdidAdvancedDialog='';
          }
          else if('close_edid_advanced'==param.act){
              this.showEdidAdvancedDialog='';
              this.advanceScreen={};
              this.$refs.edid.setFrameRate(60);
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
                  this.showDialog='';


                  let a=this.edidData;
                  let arr=[];
                  a.forEach((v,k)=>{
                      arr.push('0x'+Number(v).toString(16).padStart(2,0).toUpperCase());
                  })
                  let s=arr.join(',');
                  let aEle = document.createElement("a");// 创建a标签
                  let blob = new Blob([s]);
                  aEle.download = "EDID";// 设置下载文件的文件名
                  aEle.href = window.URL.createObjectURL(blob);
                  aEle.click();// 设置点击事件 aEle.remove()
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
      simulateDialog,
      loginDialog,
      importDialog
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
        .card-item-disabled{
            opacity:0.6;
            cursor:not-allowed;
        }
    }
  }
    .card-external{
        .card-child{
            width:70px;
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
