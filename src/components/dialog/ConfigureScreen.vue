<template>
  <el-dialog
    title="屏幕参数设置"
    :visible.sync="isVisible"
    width="900px"
    top="8vh"
    @close="isSubmit(false)"
    center
  >
    <div class="setting">
      <div class="setting-port">
        <ul>
          <li v-for="(val,index) in portList" :class="{port_on:portList[totalPort-index-1]==1}" :key="index" @click="portPut(index)">
            Port {{totalPort-index}}
          </li>
        </ul>
        <div class="mapping">
          <el-button type="primary" @click="autoMap" size="mini">自动映射</el-button>
        </div>
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="isSubmit(false)" size="mini">取 消</el-button>
      <el-button type="primary" @click="isSubmit(true)" size="mini">确 定</el-button>
    </span>
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
  created() {

      this.$http.get("syncOutputInfoRd.cgi",{},(ret)=>{
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
          this.displayList=this.screenInfo.scrGroupArr;
          for(let i in this.displayList){
              this.$set(this.displayList[i],'tabName',this.newTabname());
          }
          this.curTabName=this.displayList[0].tabName;
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
                  // this.displayList[i].portArr[k]=[validPos.shift()+1];
                  this.$set(this.displayList[i].portArr[k],'mapArr',[validPos.shift()+1]);
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
      subEvent(param){
          if(param.act=='Col' || param.act=='Row'){
              // if(!this.isValidCardCount()){
              //     return ;
              // }
              this.$refs.cs_array[param.seq].setArraySize(param.act,param.v)
          }
          else if(param.act=='resolutionValue'){
              let m=param.v.split('*');
              this.displayList[param.seq].FormatW=m[0];
              this.displayList[param.seq].FormatH=m[1];
              this.displayList[param.seq].VideoId=param.videoId;
              if(param.videoId==117){
                  this.displayList[param.seq].FrameRate=30;
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
              // emptyScreen.portArr.splice(1,emptyScreen.Col*emptyScreen.Row-1);//只保留一个
              // emptyScreen.Col=1;
              // emptyScreen.Row=1;
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
            //todo 检车端口 是否被重用

            for(let i in this.displayList){
                delete this.displayList[i].tabName;
            }
            this.screenInfo.ScrGroupNum=this.displayList.length;
           console.log(this.screenInfo);
        } else {
          console.log("取消");
        }
        this.$emit("isDialogVisible", false); // 退出关闭弹窗
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
    .mapping {
      display: flex;
      justify-content: center;
      padding-top: 6px;
    }
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
      height: 422px;
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
</style>