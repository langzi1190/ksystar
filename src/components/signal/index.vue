<template>
  <div class="content-nav">
    <div class="content-title">{{activeList[parseInt(activeName)]}}</div>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item name="0">
        <template slot="title">
          <img class="header-icon" src="@/assets/images/SignalManagement.png" />
          <span class="content-list-title">信号管理</span>
        </template>

        <div class="content-list">
          <el-tree :data="inputCardList" :props="paramMap" :render-content="renderContent" @node-click="handleNodeClick"></el-tree>
        </div>

      </el-collapse-item>
      <el-collapse-item name="1">
        <template slot="title">
          <img class="header-icon" src="@/assets/images/UserMode.png" />
          <span class="content-list-title">用户模式</span>
        </template>
        <div class="content-list">用户模式</div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <img class="header-icon" src="@/assets/images/Round.png" />
          <span class="content-list-title">场景轮巡</span>
        </template>
        <div class="content-list">场景轮巡</div>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template slot="title">
          <img class="header-icon" src="@/assets/images/signal.png" />
          <span class="content-list-title">信号源分组</span>
        </template>
        <div class="content-list">信号源分组</div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
    data() {
        return {
            inputCardList:[],

            activeName: "0", // 侧边栏选项
            activeList: ["信号管理", "用户模式", "场景轮巡", "信号源分组"], // 侧边栏选项列表

            paramMap:{
                children: 'srcArr',
            },

        };
    },
    mounted(){
        let signal_list={
            "inCardNum":	3,
            "inCardArr":	[{
                "srcNum":	2,
                "srcArr":	[{
                    "portType":	16,
                    "ITESrcType":	17,
                    "resolArr":	[300, 200],//区分是否可用
                    "bakFuncSta":	0,
                    "bakSrcCardId":	0,
                    "bakSrcId":	0
                }, {
                    "portType":	16,
                    "ITESrcType":	17,
                    "resolArr":	[800, 600],
                    "bakFuncSta":	0,
                    "bakSrcCardId":	0,
                    "bakSrcId":	0
                }]
            }, {
                "srcNum":	3,
                "srcArr":	[{
                    "portType":	16,
                    "ITESrcType":	1,
                    "resolArr":	[300, 200],
                    "bakFuncSta":	0,
                    "bakSrcCardId":	0,
                    "bakSrcId":	0
                }, {
                    "portType":	16,
                    "ITESrcType":	1,
                    "resolArr":	[300, 200],
                    "bakFuncSta":	0,
                    "bakSrcCardId":	0,
                    "bakSrcId":	0
                }, {
                    "portType":	16,
                    "ITESrcType":	1,
                    "resolArr":	[300, 200],
                    "bakFuncSta":	0,
                    "bakSrcCardId":	0,
                    "bakSrcId":	0
                }]
            }, {
                "srcNum":	5,
                "srcArr":	[{
                    "portType":	4,
                    "ITESrcType":	17,
                    "resolArr":	[300, 200],
                    "bakFuncSta":	0,
                    "bakSrcCardId":	0,
                    "bakSrcId":	0
                }, {
                    "portType":	5,
                    "ITESrcType":	17,
                    "resolArr":	[300, 200],
                    "bakFuncSta":	0,
                    "bakSrcCardId":	0,
                    "bakSrcId":	0
                }, {
                    "portType":	9,
                    "ITESrcType":	17,
                    "resolArr":	[800, 600],
                    "bakFuncSta":	0,
                    "bakSrcCardId":	0,
                    "bakSrcId":	0
                }, {
                    "portType":	4,
                    "ITESrcType":	18,
                    "resolArr":	[300, 200],
                    "bakFuncSta":	0,
                    "bakSrcCardId":	0,
                    "bakSrcId":	0
                }, {
                    "portType":	5,
                    "ITESrcType":	18,
                    "resolArr":	[300, 200],
                    "bakFuncSta":	0,
                    "bakSrcCardId":	0,
                    "bakSrcId":	0
                }]
            }]
        };

        this.syscInputInfo(signal_list);
    },
    methods:{
        int(i){
            return parseInt(i);
        },
        renderContent(h,{node,data,store}){
            if(node.level==1){

               return h('span',data.label)
            }
            else if(node.level==2){
                if(data.resolArr[1]>200 && data.resolArr[0]>300){
                    return h('span',[
                        h('span',{
                            attrs:{
                                class:'card_label card_label_valid'
                            }
                        },data.label),
                        data.label_extra
                    ])
                }
                else{
                    return h('span',[
                        h('span',{
                            attrs:{
                                class:'card_label'
                            }
                        },data.label),
                        data.label_extra
                    ])
                }


            }
        },
        syscInputInfo(signal_list){
            let inCardArr=signal_list.inCardArr;
            for(let i in inCardArr){
                inCardArr[i].label="C"+(parseInt(i)+1);
                for(let k in inCardArr[i].srcArr){
                    inCardArr[i].srcArr[k].label=this.globalEvent.pType['p'+inCardArr[i].srcArr[k].portType];
                    inCardArr[i].srcArr[k].label_extra='S'+(this.int(i)+1)+'_'+(this.int(k)+1);
                }
            }
            this.inputCardList=inCardArr;
        },
        handleNodeClick(data,node,tree){
            if(node.level==2){
                this.globalEvent.selectedCard=data;
            }
        }
    }

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
    }
    .content-list-title:hover {
      color: #409eff;
    }
    /deep/ .el-collapse-item__header {
      height: 40px;
      line-height: 40px;
    }
    .card_label{margin-right:3px;color:#f44f44;}
    .card_label_valid{position:relative;display:inline-block;}
    .card_label_valid::after{content:' ';width:10px;height:10px;border-radius:10px;position:absolute;background-color:#00cc99;top: 7px;left: -13px;}
    .el-tree-node__content .is-current{background-color:#f3f2f0;}
}
</style>