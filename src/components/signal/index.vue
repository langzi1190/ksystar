<template>
  <div class="content-nav">
    <div class="content-title">{{activeList[parseInt(activeName)]}}</div>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item name="0">
        <template slot="title">
          <img class="header-icon" src="@/assets/images/SignalManagement.png" />
          <span class="content-list-title">信号管理</span>
        </template>

        <div class="content-list" :style="{maxHeight:contestListHeight}">
          <el-tree :data="inputCardList" :props="paramMap" :render-content="renderContent" @node-click="handleNodeClick"></el-tree>
        </div>

      </el-collapse-item>
      <el-collapse-item name="1">
        <template slot="title">
          <img class="header-icon" src="@/assets/images/UserMode.png" />
          <span class="content-list-title">用户模式</span>
        </template>
        <div class="content-list" :style="{maxHeight:contestListHeight}">
          <template v-for="(item,index) in userSceneList">
            <div class="list_item" :class="{list_item_cur:item.value==1}" @click="selectedSceneIndex=index">
              {{item.label}}
            </div>
            <div class="list_item" v-show="selectedSceneIndex==index">
              <el-button size="mini" @click="editScene">改名</el-button>
              <el-button size="mini" :disabled="item.value==0" @click="loadScene">载入</el-button>
            </div>
          </template>

        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <img class="header-icon" src="@/assets/images/Round.png" />
          <span class="content-list-title">场景轮巡</span>
        </template>
        <div class="content-list"  :style="{maxHeight:contestListHeight}">
          <sceneCarousel v-if="activeName==2"></sceneCarousel>
        </div>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template slot="title">
          <img class="header-icon" src="@/assets/images/signal.png" />
          <span class="content-list-title">信号源分组</span>
        </template>
        <div class="content-list"  :style="{maxHeight:contestListHeight}">
            <sourceGroup v-if="activeName==3"></sourceGroup>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  import sceneCarousel from "@/components/signal/sceneCarousel";
  import sourceGroup from "@/components/signal/sourceGroup";
export default {
    created(){
        this.getCommonInfo();
    },
    data() {
        return {
            inputCardList:[],
            userSceneList:[],//用户模式 列表
            selectedSceneIndex:-1,//选中的用户模式

            presetList:[],
            scenePollingList:[],
            // srcGroupList:[],

            activeName: "0", // 侧边栏选项
            activeList: ["信号管理", "用户模式", "场景轮巡", "信号源分组"], // 侧边栏选项列表

            paramMap:{
                children: 'srcArr',
            },
            contestListHeight:'auto'

        };
    },
    mounted(){
        this.calContentListHeight();
        window.addEventListener("resize",(e)=>{
            this.calContentListHeight();
        })
       this.getSysInputInfo();
        this.globalEvent.$on("work_mode_change",()=>{
            //信号源工作模式发生改变 修改前端名称 workModeDialog
            let inCardArr=this.inputCardList;
            for(let i in inCardArr){
                for(let k in inCardArr[i].srcArr){

                    if(inCardArr[i].srcArr[k].portType!=16 && inCardArr[i].srcArr[k].portType!=18){
                        inCardArr[i].srcArr[k].label=this.globalEvent.pType['p'+inCardArr[i].srcArr[k].portType];
                    }
                    else if(inCardArr[i].srcArr[k].ITESrcType==17 || inCardArr[i].srcArr[k].ITESrcType==18){
                        inCardArr[i].srcArr[k].label=this.globalEvent.pType['p'+inCardArr[i].srcArr[k].portType+''+inCardArr[i].srcArr[k].ITESrcType];
                    }
                    else{
                        inCardArr[i].srcArr[k].label=this.globalEvent.pType['p'+inCardArr[i].srcArr[k].portType];
                    }
                }
            }
        });

        // this.$http.get("scenePollingRd.cgi",{},(ret)=>{
        //     this.scenePollingList=ret.data;
        // });
        // this.$http.get("srcGroupRd.cgi",{},(ret)=>{
        //     this.srcGroupList=ret.data;
        // });
    },
    methods:{
        // int(i){
        //     return parseInt(i);
        // },
        calContentListHeight(){
            let curH=document.body.clientHeight;

            this.contestListHeight=(curH-366)+'px';
        },
        getSysInputInfo(){
            this.$http.get("syncInputInfoRd.cgi",{},(ret)=>{
                this.syscInputInfo(ret.data);
            });
        },
        getCommonInfo(){
            //获取顶部工具区域通用参数
            this.userSceneList=[];

            this.$http.get("syncCommonInfoRd.cgi",{},(ret)=>{

                for(let i in ret.data.presetStaArr){
                    this.userSceneList.push({
                        label:this.globalEvent.userSceneName(i),//'用户模式 '+(parseInt(i)+1),
                        value:ret.data.presetStaArr[i]
                    });
                }
                this.syncLocalName();
                this.globalEvent.commonInfo=ret.data;
            });
        },
        syncLocalName(){
            this.globalEvent.syncLocalName('sceneUserName',this.userSceneList);
        },
        renderContent(h,{node,data,store}){
            if(node.level==1){

               return h('span',data.label)
            }
            else if(node.level==2){
                return h('span',{
                    class:{
                        'selected_card':this.globalEvent.selectedCard.label_extra && data.label_extra==this.globalEvent.selectedCard.label_extra
                    },
                    attrs:{
                        'data-info':data.label_info
                    },
                    on: {
                        dblclick: this.dbSelectSrcCard
                    },
                },[
                    h('span',{
                        // attrs:{
                        //     class:'card_label card_label_valid'
                        // },
                        class:{
                            'card_label':true,
                            'card_label_valid':this.globalEvent.isValidResolution(data.resolArr),
                            'card_back_up':data.bakFuncSta==1
                        }
                    },data.label),
                    data.label_extra
                ])
                // if(this.globalEvent.isValidResolution(data.resolArr)){
                //     return h('span',{
                //         class:{
                //             'selected_card':this.globalEvent.selectedCard.label_extra && data.label_extra==this.globalEvent.selectedCard.label_extra
                //         },
                //         attrs:{
                //             'data-info':data.label_info
                //         },
                //         on: {
                //             dblclick: this.dbSelectSrcCard
                //         },
                //     },[
                //         h('span',{
                //             attrs:{
                //                 class:'card_label card_label_valid'
                //             }
                //         },data.label),
                //         data.label_extra
                //     ])
                // }
                // else{
                //     return h('span',{
                //           class:{
                //               'selected_card':this.globalEvent.selectedCard.label_extra && data.label_extra==this.globalEvent.selectedCard.label_extra
                //           },
                //           on: {
                //               dblclick: this.dbSelectSrcCard
                //           },
                //           attrs:{
                //               'data-info':data.label_info
                //           }
                //         },[
                //         h('span',{
                //             attrs:{
                //                 class:'card_label'
                //             }
                //         },data.label),
                //         data.label_extra
                //     ])
                // }


            }
        },
        dbSelectSrcCard(e,v2){
            // console.log(e.target.parentElement.dataset.info);
            this.globalEvent.$emit("change_src_card",{v:e.target.parentElement.dataset.info});
        },
        syscInputInfo(signal_list){
            let inCardArr=signal_list.inCardArr;
            let id=1;
            for(let i in inCardArr){
                inCardArr[i].id=id++;//tree id
                inCardArr[i].label="C"+(parseInt(i)+1);
                for(let k in inCardArr[i].srcArr){
                    inCardArr[i].srcArr[k].id=id++;
                    if(inCardArr[i].srcArr[k].portType!=16 && inCardArr[i].srcArr[k].portType!=18){
                        inCardArr[i].srcArr[k].label=this.globalEvent.pType['p'+inCardArr[i].srcArr[k].portType];
                    }
                    else if(inCardArr[i].srcArr[k].ITESrcType==17 || inCardArr[i].srcArr[k].ITESrcType==18){
                        inCardArr[i].srcArr[k].label=this.globalEvent.pType['p'+inCardArr[i].srcArr[k].portType+''+inCardArr[i].srcArr[k].ITESrcType];
                    }
                    else{
                        inCardArr[i].srcArr[k].label=this.globalEvent.pType['p'+inCardArr[i].srcArr[k].portType];
                    }

                    inCardArr[i].srcArr[k].label_extra=this.globalEvent.signalCardName(i,k);
                    inCardArr[i].srcArr[k].label_info=this.globalEvent.signalCardInfo(i,k);
                }
            }
            this.globalEvent.inputCardList=this.inputCardList=inCardArr;
            // this.globalEvent.$emit('load_input_card');//通知窗口信号源加载完成

        },
        handleNodeClick(data,node,tree){
            if(node.level==2){
                this.globalEvent.selectedCard=data;
                // let w=this.globalEvent.selectedWindowIndex;
                // let num=this.globalEvent.sourceCardNumber();
                // if(w>-1){
                //     this.$set(this.globalEvent.windowItemsInfo.winArr[w],'srcCardId',num[0]);
                //     this.$set(this.globalEvent.windowItemsInfo.winArr[w],'srcId',num[1]);
                //
                //     //保存信号源信息
                //     let data={
                //         scrGroupId:this.globalEvent.curScreenIndex,
                //         winId:w,
                //         srcCardId:num[0],
                //         srcId:num[1]
                //     };
                //     this.$http.post("switchWinSrc.cgi",data,(ret)=>{
                //         console.log("signal/index.vue 切换窗口源信号");
                //     });
                // }
            }
        },
        editScene(){
            let s=prompt("输入新名称");
            if(s===null){
                return ;
            }
            else if(s==''){
                alert("不能为空");
                return ;
            }
            this.userSceneList[this.selectedSceneIndex].label=s;
            this.syncLocalName();

        },
        loadScene(){
            if(this.userSceneList[this.selectedSceneIndex].value==0){
                alert("该模式没有内容");
            }
            else{
                //载入用户模式

               this.loadUserModel(this.selectedSceneIndex);
            }
        },
        loadUserModel(v){
            this.$http.post("loadPreset.cgi",{presetId:parseInt(v)+1},(ret)=>{
                // syncScrInfoRd.cgi

                // this.getCommonInfo();
                // this.getSysInputInfo();
                // this.$nextTick(()=>{
                //     this.$parent.$refs.vdr.loadData();
                // })

                this.$emit('sub_event',{act:'sync'});//--home.vue
                console.log("signal/index.vue 载入用户模式，重载接口");
                // console.log(ret.data);

            });
        }
    },
    components:{
        sceneCarousel,
        sourceGroup
    },

};
</script>

<style lang="scss">
.content-nav {
    border-right: 1px solid #dcdfe6;
    padding-left: 10px;
    flex: 0 0 200px;
    .content-title {
      height: 30px;
      line-height: 30px;
      border-bottom: 1px solid #dcdfe6;
      color: #909399;
      font-size: 14px;
    }
    .header-icon {
      padding-right: 6px;
      width: 16px;
      height: 16px;
    }
    .el-collapse {
      border-top: none;
    }
    .content-list {
      border-top: 1px solid #ebeef5;
      max-width:200px;
      overflow:auto;
    }
    .content-list-title:hover {
      color: #409eff;
    }
    /deep/ .el-collapse-item__header {
      height: 40px;
      line-height: 40px;
    }
    .el-tree-node__content{user-select:none;}
    .el-tree-node>.el-tree-node__children{overflow:unset;}
    .card_label{margin-right:3px;color:#f44f44;    width: 65px;text-align: left;display: inline-block;position:relative;}
    .card_label::after{content:' ';width:10px;height:10px;border-radius:10px;position:absolute;background-color:#f44f44;top: 7px;left: -13px;}
    .card_label_valid{position:relative;display:inline-block;}
    .card_label_valid::after{content:' ';width:10px;height:10px;border-radius:10px;position:absolute;background-color:#00cc99;top: 7px;left: -13px;}

    .el-tree-node__content .is-current{background-color:#f3f2f0;}
    .list_item{cursor:pointer;border: 1px solid #dcdcdc;border-radius: 5px;margin-top: 5px;width: 150px;height:30px;line-height:30px;}
    .list_item:nth-child(even){border:none;}
    .el-collapse-item__content{max-height:500px;overflow:auto;}
  .selected_card .card_label{color:#00cc99;}
  .card_back_up::before{content:' ';width:10px;height:10px;border-radius:10px;position:absolute;top:6px;right:0;background-color:#505050;}
  .list_item_cur{background-color:#00cc99;color:#fff;}
}
</style>