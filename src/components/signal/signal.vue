<template>
  <div class="content-nav">
    <!--<div class="content-title">{{activeList[parseInt(activeName)]}}</div>-->
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item name="0">
        <template slot="title">
          <img class="header-icon" src="@/assets/images/hdmi.png" />
          <span class="content-list-title">{{LANG.SIGNAL_SOURCE}}</span>
        </template>

        <div class="content-list" :style="{maxHeight:contestListHeight}">
          <el-tree :data="inputCardList" :props="paramMap" :render-content="renderContent" @node-click="handleNodeClick"></el-tree>
        </div>

      </el-collapse-item>
      <el-collapse-item name="1">
        <template slot="title">
          <img class="header-icon" src="@/assets/images/l_user_mode.png" />
          <span class="content-list-title">{{LANG.SIGNAL_USER_MODE}}</span>
        </template>
        <div class="content-list"  :style="{maxHeight:contestListHeight}">
          <template v-for="(item,index) in userSceneList">
            <div class="list_item" :class="{list_item_cur:item.value==1,list_item_selected:selectedSceneIndex==index}" @click="showUserModel(index)">
              {{item.label}}
            </div>
            <!--<div class="list_item" v-show="selectedSceneIndex==index">-->
              <!--<el-button size="mini" @click="editScene">{{LANG.SIGNAL_CHANGE_NAME}}</el-button>-->
              <!--<el-button size="mini" :disabled="item.value==0" @click="loadScene">{{LANG.SIGNAL_LOAD}}</el-button>-->
            <!--</div>-->
          </template>

        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <img class="header-icon" src="@/assets/images/l_loop.png" />
          <span class="content-list-title">{{LANG.SIGNAL_LAYOUT_LOOP}}</span>
        </template>
        <div class="content-list">
          <sceneCarousel v-if="activeName==2"></sceneCarousel>
        </div>
      </el-collapse-item>
      <el-collapse-item name="3" v-if="this.$parent.devType!='KS6800' && this.$parent.devType!='KS8800'">
        <template slot="title">
          <img class="header-icon" src="@/assets/images/source_group.png" />
          <span class="content-list-title">{{LANG.SIGNAL_SOURCEGROUP}}</span>
        </template>
        <div class="content-list">
            <sourceGroup v-if="activeName==3"></sourceGroup>
        </div>
      </el-collapse-item>
    </el-collapse>

    <div style="position: absolute;
    bottom: 0;
    width: 100%;
    height: 25px;
    line-height: 24px;
    color: #fff;
    font-size: 14px;
    border-top: 1px solid #dcdcdc;
    left: 0;">{{LANG.HOME_DEV_TYPE}}{{this.$parent.devType}}</div>

    <userModel @sub_event="subEvent" :showDialog="showUserModelDialog" v-if="showUserModelDialog"></userModel>
  </div>
</template>

<script>
  import sceneCarousel from "@/components/signal/sceneCarousel";
  import sourceGroup from "@/components/signal/sourceGroup";
  import userModel from "@/components/panel/userModel";
export default {
    created(){
        this.globalEvent.$on("simulate",()=>{
            this.syscInputInfoSm();
        })
    },
    data() {
        let LANG=this.LANGUAGE[this.globalEvent.language];
        return {
            showUserModelDialog:false,
            inputCardList:[],
            userSceneList:[],//用户模式 列表
            selectedSceneIndex:-1,//选中的用户模式

            presetList:[],
            scenePollingList:[],
            // srcGroupList:[],

            activeName: "0", // 侧边栏选项
            activeList: [LANG.SIGNAL_SOURCE,LANG.SIGNAL_USER_MODE,LANG.SIGNAL_LAYOUT_LOOP,LANG.SIGNAL_SOURCEGROUP], // 侧边栏选项列表

            paramMap:{
                children: 'srcArr',
            },
            contestListHeight:'auto',
            LANG:LANG
        };
    },
    mounted(){
        this.calContentListHeight();
        window.addEventListener("resize",(e)=>{
            this.calContentListHeight();
        });

        this.globalEvent.$on('language',()=>{
            this.LANG=this.LANGUAGE[this.globalEvent.language];
            this.activeList=[this.LANG.SIGNAL_SOURCE,this.LANG.SIGNAL_USER_MODE,this.LANG.SIGNALLAYOUT_LOOP,this.LANG.SIGNAL_SOURCEGROUP];

            for(let i in this.globalEvent.commonInfo.presetStaArr){
                this.userSceneList[i].label=this.globalEvent.userSceneName(i);
            }

        });
        this.globalEvent.$on("getSysInputInfo",()=>{
            this.getSysInputInfo();
        });

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
        // this.globalEvent.$on("load_name_complete",()=>{
        //     this.getCommonInfo();
        // })

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

            //该接口连续调用 返回数据会出错 --- vdr index loadScreenWindowItems
            setTimeout(()=>{
                this.$http.get("syncInputInfoRd.cgi",{},(ret)=>{

                    for(let i in ret.data.inCardArr){
                        for(let k in ret.data.inCardArr[i].srcArr){
                            let srcArr=ret.data.inCardArr[i].srcArr[k];
                            srcArr.portType=srcArr.type;
                            srcArr.ITESrcType=srcArr.ITE;
                            srcArr.bakFuncSta=srcArr.bakArr[0];
                            srcArr.bakSrcCardId=srcArr.bakArr[1];
                            srcArr.bakSrcId=srcArr.bakArr[2];
                        }
                    }
                    this.syscInputInfo(ret.data);
                });
            },200)

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

                //加载用户模式窗口名
                let nameInfo=this.globalEvent.nameInfo;
                if(ret.data.curPreset==0){

                    let userModelKey='userModel'+this.globalEvent.commonInfo.curPreset;
                    if(typeof nameInfo[userModelKey] !='undefined'){

                        for(let i in nameInfo[userModelKey]){
                            nameInfo[userModelKey][i]={};
                            localStorage.removeItem(i);
                        }

                    }

                    this.globalEvent.windowItemLocalName={};

                }


                if(this.globalEvent.isSync==1){
                    this.globalEvent.isSync=0;
                    ret.data.curPreset=this.globalEvent.commonInfo.curPreset;
                }

                //加载用户模式窗口名
                let userModelWindowNameKey='userModel'+ret.data.curPreset;

                for(let key in nameInfo[userModelWindowNameKey]){
                    localStorage.setItem(key,JSON.stringify(nameInfo[userModelWindowNameKey][key]));
                }
                this.syncLocalName();

                this.$http.get("KfsRd.cgi",{},(kfs)=>{
                    let data=kfs.data;
                    ret.data.fSyncInfo={
                        inCardNum:data.inCardNum,
                        fSyncFuncSta:data.funcSta,
                        fSyncArr:[]
                    };
                    for(let i in data.inCardArr){
                        let srcPropArr=[];
                        for(let k in data.inCardArr[i].chnArr){
                            let chn=data.inCardArr[i].chnArr[k];
                            srcPropArr.push({
                                syncSta:chn[0],
                                syncCardId:chn[1],
                                syncSrcId:chn[2]
                            });
                        }
                        ret.data.fSyncInfo.fSyncArr.push({
                            srcPropArr:srcPropArr
                        });
                    }
                    this.globalEvent.commonInfo=ret.data;
                    this.globalEvent.$emit('getSysInputInfo');
                });
            });
        },
        syncLocalName(){
            this.globalEvent.syncLocalName('sceneUserName',this.userSceneList);
        },
        renderContent(h,{node,data,store}){
            if(node.level==1){

                let hasValidSignal=false;
                for(let i in data.srcArr){
                    if(this.globalEvent.isValidResolution(data.srcArr[i].resolArr)){
                        hasValidSignal=true;
                        break;
                    }
                }
               return h('span',{
                   class:{
                       'super_card':true,
                       'card_label_valid':hasValidSignal
                   }
               },data.label)
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
                            'card_back_up':data.bakFuncSta==1,
                            'card_kfs':data.kfsAble==1
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
            let inCardArr=typeof signal_list.inCardArr == "undefined" ?[]:signal_list.inCardArr;
            let id=1;
            let kfsFunc=this.globalEvent.commonInfo.fSyncInfo.fSyncFuncSta;
            let fSyncArr=this.globalEvent.commonInfo.fSyncInfo.fSyncArr;

            for(let i in inCardArr){
                inCardArr[i].id=id++;//tree id
                inCardArr[i].label="C"+(parseInt(i)+1);
                for(let k in inCardArr[i].srcArr){
                    let syncSta=0;
                    if(kfsFunc>0 && fSyncArr[i].srcPropArr.length>0){
                        syncSta=kfsFunc==0?0:fSyncArr[i].srcPropArr[k].syncSta;
                    }
                    inCardArr[i].srcArr[k].kfsAble=syncSta;
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

        },
        syscInputInfoSm(){
            //演示模式
            let inCardArr=this.globalEvent.modeInfo.inCardInfo.inCardArr;
            let id=1;
            // let kfsFunc=this.globalEvent.commonInfo.fSyncInfo.fSyncFuncSta;
            // let fSyncArr=this.globalEvent.commonInfo.fSyncInfo.fSyncArr;

            for(let i in inCardArr){
                inCardArr[i].id=id++;//tree id
                inCardArr[i].label="C"+(parseInt(i)+1);
                for(let k in inCardArr[i].srcArr){
                    inCardArr[i].srcArr[k].kfsAble=0;//kfsFunc==0?0:fSyncArr[i].scrPropArr[k].syncEn;
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
            // this.inputCardList=inCardArr;
            // console.log(this.inputCardList);
            this.globalEvent.inputCardList=this.inputCardList=inCardArr;
            this.globalEvent.$emit('reload_data');//通知窗口信号源加载完成
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
            this.globalEvent.editName(s,this.globalEvent.keys['sceneUserName']);
            this.syncLocalName();

        },
        loadScene(){
            if(this.userSceneList[this.selectedSceneIndex].value==0){
                // alert("该模式没有内容");
                console.log("该模式没有内容");
            }
            else{
                //载入用户模式

               this.loadUserModel(this.selectedSceneIndex);
            }
        },
        loadUserModel(v){
            this.$http.post("loadPreset.cgi",{presetId:parseInt(v)+1},(ret)=>{

                this.globalEvent.$emit('sync');
                console.log("signal/index.vue 载入用户模式，重载接口");
                // console.log(ret.data);

            });
        },
        showUserModel(index){
            this.selectedSceneIndex=index;
            this.showUserModelDialog=true;
        },
        subEvent(param){
            this.showUserModelDialog=false;
            if(param.act=='edit_model'){
                this.editScene();
            }
            else if(param.act=='load_model'){
                this.loadScene();
            }
            // else if(param.act=='close'){
            //
            // }
        }
    },
    components:{
        sceneCarousel,
        sourceGroup,
        userModel
    },

};
</script>

<style lang="scss">
.content-nav {
    /*border-right: 1px solid #dcdfe6;*/
  position:relative;
  background-color:#1f2e54;
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
  .is-active .el-collapse-item__header{
    background-image: linear-gradient(270deg, #00ebfd 0%, #2545ff 100%);
    margin-left: -10px;
    padding-left: 10px;
  }
  .content-list .current-choose{color:#409eff;}
    .el-tree-node__content{user-select:none;}
    .el-tree-node>.el-tree-node__children{overflow:unset;}
    .card_label{margin-right:10px;color:#f44f44;    width: 65px;text-align: left;display: inline-block;position:relative;}
    .card_label::after,.super_card::after{content:' ';width:10px;height:10px;background:url("../../assets/images/red_spot.png") no-repeat center center / 100% auto;position:absolute;top: 7px;left: -13px;}
    .card_label_valid{position:relative;display:inline-block;}
    .card_label_valid::after{content:' ';width:10px;height:10px;border-radius:10px;position:absolute;background:url("../../assets/images/blue_spot.png") no-repeat center center / 100% auto;top: 7px;left: -13px;}

    .super_card{position:relative;}
    .super_card::after{top:6px;left:20px;}
    .el-tree-node__content .is-current{background-color:#f3f2f0;}
    .list_item{cursor:pointer;border: 1px solid #dcdcdc;border-radius: 5px;margin-top: 5px;width: 150px;height:30px;line-height:30px;color:#fff;}
    /*.list_item:nth-child(even){border:none;}*/
    /*.el-collapse-item__content{max-height:500px;overflow:auto;}*/
  .selected_card .card_label{color:#00cc99;}
  .card_kfs{border:1px solid #dcdcdc;}
  .card_back_up::before{content:' ';width:10px;height:10px;border-radius:10px;position:absolute;top:6px;right:-10px;background-color:#f3f2f0;}
  .list_item_cur{background-color:#00cc99;color:#fff;}
  .list_item_selected{color:#00cc99;background-color:#f3f2f0;}
}
</style>