<template>
  <el-dialog
    title="屏幕参数设置"
    :visible.sync="isVisible"
    v-if="isVisible"
    width="900px"
    top="8vh"
    @close="isSubmit(false)"
    center
  >
    <div class="setting">
      <div class="setting-port">
        <div style="margin-bottom:10px;margin-top:5px;">设备输出布局：</div>
        <ul>
          <li v-for="(val,index) in portList" :class="{port_on:portList[totalPort-index-1]==1}" :key="index" @click="portPut(index)">
            Port {{totalPort-index}}
          </li>
        </ul>

      </div>
      <div class="setting-parameter">
        <el-tabs type="border-card" v-model="curTabName">
          <!-- 屏幕墙 -->
          <el-tab-pane v-for="(item,index) in displayList" :key="item.tabName" :name="item.tabName" :label="'屏幕墙-'+(index+1)">
            <!-- 屏幕墙编辑面板 -->
            <cs-parameter @sub_event="subEvent" :item="item" :seq="index"></cs-parameter>
            <!-- 屏幕列表辑面板 -->
            <cs-array :item="item" :seq="index" ref="cs_array"></cs-array>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>


    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="autoMap" size="mini">自动映射</el-button>
       <el-button @click="isSubmit(true)" size="mini">确 定</el-button>
      <el-button @click="isSubmit(false)" size="mini">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import csParameter from "@/components/dialog/ConfigureScreenParameter";
import csArray from "@/components/dialog/ConfigureScreenArray";

export default {
  props: ['dialogVisible'],
  data() {
    return {
        isVisible: this.dialogVisible, // 窗口是否显示
        portList: [], // 端口port列表
        totalPort:0,
        selectedPort:-1,

        curTabName:'',
        displayList:[], // 屏幕墙列表

        screenInfo:{},
    };
  },
    provide() {
        return {
            comScreen: this
        }
    },
  created() {

      this.$http.get("syncOutputInfoRd.cgi",{},(ret)=>{
          console.log(this.globalEvent.screenInfo);
          this.screenInfo=this.globalEvent.screenInfo;//vdr index 里初始化数据
          this.syncOutputInfoRd(ret.data);
          this.syncScrInfoRd();
      });

  },
  methods: {
      syncOutputInfoRd(outPortListInfo){
          //输出端口列表
          this.portList=outPortListInfo.outCardArr.flat();
          this.totalPort=this.portList.length;
          this.globalEvent.validOutCardCount=this.portList.reduce((k,v)=>k+v);
      },
      syncScrInfoRd(){
          //屏幕墙
          this.displayList=JSON.parse(JSON.stringify(this.screenInfo.scrGroupArr));
          this.curTabName=this.displayList[0].tabName;
          console.log("configureScreen",this.curTabName);
      },
      newTabname(){
          return 'name'+parseInt(Math.random()*10000);
      },
      showTab(index){
          this.curTabName=this.displayList[index].tabName;
      },
      autoMap(){
          //映射当前 屏幕??
          if(!this.isValidCardCount()){
              return ;
          }
          let validPos=[];//可用位置
          this.portList.forEach((v,k)=>{
              if(v==1){
                  validPos.push(k);
              }
          });
          for(let i in this.displayList){
              for(let k in this.displayList[i].portArr){
                  this.$set(this.displayList[i].portArr[k],'mapArr',[validPos.shift()]);
              }
          }
      },
      isValidCardCount(){
          //计算数量
          let c=0;
          for(let i in this.displayList){
              c+=this.displayList[i].Row*this.displayList[i].Col;
          }
          if(c>this.globalEvent.validOutCardCount){
              alert("超出可用输出卡数量");
              return false;
          }
          return true;
      },
      isRepeatUsed(){
          let flag=true;//被占用
          let port=[];
          for(let i in this.displayList){
              for(let k in this.displayList[i].portArr){
                  port.push(this.displayList[i].portArr[k].mapArr[0]);
              }
          }

          console.log(port);
          if(port.length==[...new Set(port)].length){
              flag=false;//未占用
          }
          return flag;
      },
      subEvent(param){

          if(param.act=='Col' || param.act=='Row'){
              // if(!this.isValidCardCount()){
              //     return ;
              // }
              this.$refs.cs_array[param.seq].setArraySize(param.act,param.v)
          }
          else if(param.act=='resolutionValue'){

              if(param.videoId==-1){
                  console.log('videoId:',param.videoId);
                  return ;
              }

              console.log(param);

              let m=param.v.split('*');
              this.displayList[param.seq].FormatW=m[0];
              this.displayList[param.seq].FormatH=m[1];
              this.displayList[param.seq].VideoId=param.videoId;
              if(param.videoId==117){
                  this.displayList[param.seq].FrameRate=30;//30;//0:60,1:50, 2:30;
              }
              let portArr=this.displayList[param.seq].portArr;
              for(let i in portArr){
                  this.$set(portArr[i],'sizeArr',m);
              }

              this.$refs.cs_array[param.seq].calRowColumnRank();

          }
          else if(param.act=='del'){
              if(this.displayList.length==1){
                  alert("至少一个屏幕墙");
                  return ;
              }
              this.displayList.splice(param.seq,1);
              this.showTab(0);
          }
          else if(param.act=='add'){
              let emptyScreen=JSON.parse(JSON.stringify(this.displayList[param.seq]));//相当于复制当前的屏幕
              emptyScreen.tabName=this.newTabname();
              this.displayList.push(emptyScreen);
              this.showTab(this.displayList.length-1);
          }

      },
      isSubmit(bool) {
        if (bool) {
            if(!this.isValidCardCount()){
                //检查端口使用数量，
                return ;
            }
           this.syncScreen();
        } else {
            //重新加载
            this.$emit("isDialogVisible", false); // 退出关闭弹窗
        }

      },
      syncScreen(){
          if(this.isRepeatUsed()){
              alert("存在重复使用端口");
              return ;
          }

          let copyDisplayList=JSON.parse(JSON.stringify(this.displayList));
          for(let i in copyDisplayList){
              delete copyDisplayList[i].tabName;
              for(let k in copyDisplayList[i].portArr){
                  // copyDisplayList[i].FrameRate=copyDisplayList[i].FrameRate==30?2:(copyDisplayList[i].FrameRate==60?0:1);
                  copyDisplayList[i].FormatH=parseInt(copyDisplayList[i].FormatH);
                  copyDisplayList[i].FormatW=parseInt(copyDisplayList[i].FormatW);
                  let size=copyDisplayList[i].portArr[k].sizeArr;
                  copyDisplayList[i].portArr[k].sizeArr=size.map((v,k)=>{return parseInt(v);});
                  delete copyDisplayList[i].portArr[k].briArr;
                  delete copyDisplayList[i].portArr[k].conArr;
              }
          }
          let screenInfo={
              ScrGroupNum:copyDisplayList.length,
              scrGroupArr:copyDisplayList
          };


          this.$http.post("scrParamWr.cgi",screenInfo,(ret)=>{
              console.log(screenInfo);
              // this.globalEvent.screenInfo=screenInfo;
              this.globalEvent.$emit("reload_data");
              this.$emit("isDialogVisible", false); // 退出关闭弹窗
          });
      },
      portPut(io) {
        // 当前点击的port端口
        this.selectedPort=this.totalPort-io-1;
        if(this.portList[this.selectedPort]==0){
            alert("当前端口不可用");
            return ;
        }

        this.globalEvent.selectedPort=this.selectedPort;
      },
      curScreenIndex(){
          //当前选中的屏幕
          let seq=-1;
          for(let i in this.displayList){
              if(this.curTabName==this.displayList[i].tabName){
                  seq=i;
                  break;
              }
          }
          return seq;
      }

  },
  components: {
    csParameter,
    csArray,
  }
};
</script>

<style lang="scss">
.setting {
  display: flex;
  .setting-port {
    background: #fff;
    border: 1px solid #dcdfe6;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
    padding: 6px;
    ul {
      width: 300px;
      display: flex;
      flex-wrap: wrap;
      flex-direction: row-reverse;
      border-left: 1px solid #dcdfe6;
      border-top: 1px solid #dcdfe6;
      li {
        width: 50px;
        height: 28px;
        box-sizing: border-box;
        border-right: 1px solid #dcdfe6;
        border-bottom: 1px solid #dcdfe6;
        text-align: center;
        line-height: 28px;
        font-size: 12px;
      }
      li:hover {
        background-color: #f5f7fa;
        color: #409eff;
        cursor: pointer;
      }
    }
    /*.mapping {*/
      /*display: flex;*/
      /*justify-content: center;*/
      /*padding-top: 6px;*/
    /*}*/
  }
  .setting-parameter {
    width: 556px;
    margin-left: 4px;
    position: relative;
    // 屏幕列表辑面板
    .drawing {
      border: 1px solid #dcdfe6;
      width: 482px;
      height: 328px;
      padding-top: 20px;
      padding-left: 40px;
      position: relative;
      font-size: 12px;
      color: #909399;
      .resolution-x {
        display: flex;
        position: absolute;
        height: 20px;
        top: 0px;
        background: #e4e7ed;
        div {
          box-sizing: border-box;
          width: 192px;
          height: 20px;
          /deep/ .el-input--mini .el-input__inner {
            height: 100%;
            line-height: 20px;
            border-radius: 0px;
            text-align: center;
            background: #e4e7ed;
          }
        }
      }
      .resolution-y {
        display: flex;
        flex-direction: column;
        position: absolute;
        width: 40px;
        left: 0px;
        background: #e4e7ed;
        div {
          box-sizing: border-box;
          width: 40px;
          height: 108px;
          /deep/ .el-input--mini .el-input__inner {
            height: 100%;
            line-height: 20px;
            border-radius: 0px;
            text-align: center;
            padding: 0px;
            background: #e4e7ed;
          }
        }
      }
      overflow: scroll;
      .drawing-list {
        background: #f5f7fa;
        display: flex;
        flex-wrap: wrap;
        .drawing-item {
          box-sizing: border-box;
          border: 1px solid #dcdfe6;
          width: 192px;
          height: 108px;
          p {
            font-size: 12px;
            color: #909399;
            padding: 2px;
            text-align: left;
          }
          /deep/ .el-input--mini .el-input__inner {
            height: 20px;
            line-height: 20px;
          }
          text-align: center;
        }
        .display-select {
          background: #e4e7ed;
        }
      }
    }
    .add-tab-pane {
      position: absolute;
      z-index: 100;
      top: 1px;
      right: 0px;
    }
    /deep/ .el-tabs__content {
      height: 450px;
      padding: 8px;
    }
    /deep/ .el-tabs__item {
      height: 30px;
      line-height: 30px;
      padding: 0px 6px !important;
      font-size: 12px;
    }
    /deep/ .el-tabs__nav-prev {
      line-height: 30px;
    }
  }
  .port_on{
    background-color:#f44f44;
  }
}
#popup .dialog-footer{    display: flex;
  justify-content: space-around;}
</style>