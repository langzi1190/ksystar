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
              <card-item title="出厂设置"></card-item>
              <card-item title="同步"></card-item>
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
                <card-child title="开屏" iconName="display"></card-child>
                <card-child title="关屏" iconName="display"></card-child>
                <card-child title="通道设置" iconName="display" @click.native="showDialog='screenCtr'"></card-child>
              </div>
            </card>
            <card title="锁定">
              <card-item
                title="位置锁定"
                :isChecked="positionLock===true"
                @click.native="positionLock=!positionLock"
              ></card-item>
            </card>
          </div>
        </el-tab-pane>
        <el-tab-pane label="工具">
          <div class="card-s">
            <card title="高级菜单">
              <card-item title="用户"></card-item>
              <card-item @click.native="showDialog='screenBright'" title="亮度"></card-item>
              <card-item @click.native="showDialog='kfs'" title="KFS"></card-item>
              <card-item @click.native="showDialog='multi'" title="多机同步"></card-item>
              <card-item title="输出关闭"></card-item>
              <card-item title="输出开启"></card-item>
              <card-item title="导入配置"></card-item>
              <card-item title="导出配置"></card-item>
              <card-item title="EDID" @click.native="showDialog='edid'"></card-item>
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
              <card-item title="ARM升级"></card-item>
              <card-item style="width: 56px;" title="FPGA升级"></card-item>
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
              <vdr ref="vdr" @alignCenter="alignCenter"></vdr>
            </div>
          </div>
          <!-- 回显 -->
          <!--<div class="display-list" v-show="isEcho"></div>-->
        </div>
      </div>
      <div class="content-compile" v-show="true">
        <div class="content-title">画面编辑</div>
        <div class="content-attr">
          <attr></attr>
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
      <serialDialog @sub_event="subEvent" :showDialog="showDialog"></serialDialog>
      <userModelDialog @sub_event="subEvent" v-if="showDialog=='userModel'" :showDialog="showDialog"></userModelDialog>
      <saveUserModelDialog @sub_event="subEvent" v-if="showDialog=='saveUserModel'" :showDialog="showDialog"></saveUserModelDialog>
      <multiSyncDialog @sub_event="subEvent" :showDialog="showDialog" v-if="showDialog=='multi'"></multiSyncDialog>
      <edidDialog @sub_event="subEvent" :showDialog="showDialog"></edidDialog>
      <screenCtrDialog @sub_event="subEvent" :showDialog="showDialog"></screenCtrDialog>
      <screenBrightDialog @sub_event="subEvent" v-if="showDialog=='screenBright'" :showDialog="showDialog"></screenBrightDialog>
      <tempDialog @sub_event="subEvent" v-if="showDialog=='temp'" :showDialog="showDialog"></tempDialog>
      <versionDialog @sub_event="subEvent" v-if="showDialog=='version'" :showDialog="showDialog"></versionDialog>
      <deviceStatusDialog @sub_event="subEvent" v-if="showDialog=='deviceStatus'" :showDialog="showDialog"></deviceStatusDialog>
  </div>
</template>

<script>
// @ is an alias to /src
import card from "@/components/operation/Card";
import cardItem from "@/components/operation/CardItem";
import cardChild from "@/components/operation/CardChild";

const udialog = ()=>import("@/components/dialog");
const signal = ()=>import("@/components/signal");
const vdr = ()=>import("@/components/vdr");
const attr = ()=>import("@/components/attr");
const kfsDialog = ()=>import("@/components/panel/kfsDialog");
const serialDialog = ()=>import("@/components/panel/serialDialog");
const multiSyncDialog = ()=>import("@/components/panel/multiSyncDialog");
const userModelDialog = ()=>import("@/components/panel/userModelDialog");
const saveUserModelDialog = ()=>import("@/components/panel/saveUserModelDialog");
const monIpDialog = ()=>import("@/components/panel/monIpDialog");
const ipConfigDialog = ()=>import("@/components/panel/ipConfigDialog");
const edidDialog = ()=>import("@/components/panel/edidDialog");
const screenCtrDialog = ()=>import("@/components/panel/screenCtrDialog");
const screenBrightDialog = ()=>import("@/components/panel/screenBrightDialog");
const tempDialog = ()=>import("@/components/panel/tempDialog");
const versionDialog = ()=>import("@/components/panel/versionDialog");
const deviceStatusDialog = ()=>import("@/components/panel/deviceStatusDialog");


// import udialog from "@/components/dialog";

// import signal from "@/components/signal";

// import vdr from "@/components/vdr";

// import attr from "@/components/attr";

// import kfsDialog from "@/components/panel/kfsDialog";

// import serialDialog from "@/components/panel/serialDialog";

// import multiSyncDialog from "@/components/panel/multiSyncDialog";

// import userModelDialog from "@/components/panel/userModelDialog";

// import saveUserModelDialog from "@/components/panel/saveUserModelDialog";

// import monIpDialog from "@/components/panel/monIpDialog";

// import ipConfigDialog from "@/components/panel/ipConfigDialog";

// import edidDialog from "@/components/panel/edidDialog";

// import screenCtrDialog from "@/components/panel/screenCtrDialog";

// import screenBrightDialog from "@/components/panel/screenBrightDialog";

// import tempDialog from "@/components/panel/tempDialog";

// import versionDialog from "@/components/panel/versionDialog";

// import deviceStatusDialog from "@/components/panel/deviceStatusDialog";


export default {
  name: "Home",
    created(){
      this.loadVersion();
    },
  data() {
    return {
        activeName: "0", // 侧边栏选项
        activeList: ["信号管理", "用户模式", "场景轮巡", "信号源分组"], // 侧边栏选项列表
        isEcho: false, // 是否回传
        dialogVisible: false, // 弹出对话框
        dialogTitle: "",
        drawCenter: true,
        positionLock: false, //位置锁定
        showDialog:'',
        devType:''
        // scale:1,
    };
  },
  methods: {
    // 预设:1-用户模式、2-保存模式、3-出厂设置、4-同步、5-打开回显、6-关闭回显、7-回显设置
      preinstall(setFn) {

      console.log(setFn);
      if (setFn === "5") {
        this.isEcho = true;
      }
      if (setFn === "6") {
        this.isEcho = false;
      }
    },
    // 设置:1-创建画面、2-屏幕配置
      setting(setFn) {

        if (setFn === "1") {
          console.log("创建画面");
        }
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
          this.globalEvent.$emit("add_window_item");//vdr/index.vue
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
      subEvent(param){
          if('close_kfs'==param.act){
              this.showDialog='';
          }
          else if('select_user_model'==param.act){
              this.showDialog='';
              this.$refs.signal.loadUserModel(param.v);
          }
          else if("update_user_model"==param.act){
              this.$refs.signal.userSceneList[param.seq].label=param.name;
              this.globalEvent.commonInfo.presetStaArr[param.seq]=1;
              this.$refs.signal.syncLocalName();
              this.showDialog='';
          }
      }
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
      screenCtrDialog,
      screenBrightDialog,
      tempDialog,
      versionDialog,
      deviceStatusDialog,
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
