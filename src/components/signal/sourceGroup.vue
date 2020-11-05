<template>
    <div class="source_group">
        <div class="op_area">
            <div class="op_bt">
                <i @click="op('add')" :class="{disabled:isPlay==1}">+</i>
                <i class="minus" @click="op('del')" :class="{disabled:isPlay==1}">-</i>
                <i class="split_line"></i>
                <i class="el-icon-edit" @click="op('edit')" :class="{disabled:isPlay==1}"></i>
                <i class="el-icon-top" @click="op('up')" :class="{disabled:isPlay==1}"></i>
                <i class="el-icon-bottom" @click="op('down')" :class="{disabled:isPlay==1}"></i>
                <i class="split_line"></i>
                <i class="el-icon-caret-right" @click="op('play')" :class="{disabled:isPlay==1}"></i>
                <i class="caret" @click="op('stop')" :class="{disabled:isPlay==0}">▉</i>
            </div>

            <div class="op_list" :style="{maxHeight:contestListHeight}">
                <el-tree
                        :data="sourceList"
                        :props="paramMap"
                        :default-expand-all='true'
                        v-if="updateFlip"
                        :render-content="renderContent"
                        @node-click="handleNodeClick">
                </el-tree>
            </div>
        </div>

        <sourceGroupDialog @sub_event="subEvent" v-if="showSceneDialog!=''" :showSceneDialog="showSceneDialog"></sourceGroupDialog>
    </div>
</template>

<script>
    import sourceGroupDialog from "@/components/panel/sourceGroupDialog";
    export default {
        created(){
            this.$http.get("srcGroupRd.cgi",{},(ret)=>{
                let srcGroupArr=ret.data.srcGroupArr;
                for(let i in srcGroupArr){
                    srcGroupArr[i].label=this.globalEvent.srcGroupName(srcGroupArr[i]);
                    let preset=srcGroupArr[i].srcArr;
                    for(let k in preset){
                        preset[k].label=this.globalEvent.signalCardName(preset[k].dataArr[0],preset[k].dataArr[1]);
                        preset[k].tLabel=this.userSceneTime(preset[k].dataArr);
                    }
                }
                this.sourceList=srcGroupArr;
                this.isPlay=ret.data.funcSta;
                //初始载入 同步一次本地名称
                this.syncLocalName();
            })

            this.calContentListHeight();
            window.addEventListener("resize",(e)=>{
                this.calContentListHeight();
            })
        },
        data(){
            return {
                contestListHeight:'',
                sourceList:[],
                updateFlip:true,//强制更新结构体
                paramMap:{
                    children:'srcArr'
                },
                showSceneDialog:'',
                selectedSource:{},//当前选择源组
                selectedCard:{},
                selectedLevel:0,
                isPlay:0,
            };
        },
        methods:{
            calContentListHeight(){
                let curH=document.body.clientHeight;

                this.contestListHeight=(curH-366)+'px';

            },
            renderContent(h,{node,data,store}){
                if(node.level==1){
                    return h('span',{
                        class:{
                            'selected_scene':data.label==this.selectedSource.label
                        }
                    },data.label);
                }
                else{
                    // return h("span",data.label + data.tLabel);
                    return h('span',{
                        class:{
                            'current-choose':data.$treeNodeId==this.selectedCard.$treeNodeId
                        }
                    },data.label + data.tLabel)
                }
            },
            handleNodeClick(data,node,tree){
                console.log(data);
                if(node.level==1){
                    this.selectedSource=data;
                    this.selectedCard={};
                }
                else{
                    this.selectedSource=node.parent.data;
                    this.selectedCard=data;
                }
                this.selectedLevel=node.level;
            },
            userSceneTime(arr){
                return "    "+arr[2]+','+this.doubleNum(arr[3])+':'+this.doubleNum(arr[4])+':'+this.doubleNum(arr[5]);
            },
            doubleNum(v){
                return v<10?'0'+v:v;
            },
            updateTree(){
                for(let i in this.sourceList){
                    this.sourceList[i].srcGroupId=i;//更改 id
                }

                this.syncLocalName();

                this.updateFlip=false;
                this.$nextTick(()=>{
                    this.updateFlip=true;
                })
            },
            syncLocalName(){
                this.globalEvent.syncLocalName('srcGroup',this.sourceList);
            },
            op(act){
                if('add'==act && 0==this.isPlay){
                    this.showSceneDialog='new';
                }
                else if('edit'==act && Object.keys(this.selectedSource).length>0 && 0==this.isPlay){
                    this.showSceneDialog='edit';
                }
                else if('del'==act && 0==this.isPlay){
                    if(this.selectedLevel==1){
                        this.sourceList.splice(this.sourceList.srcGroupId,1);
                        for(let i in this.sourceList){
                            this.sourceList[i].srcGroupId=i;
                        }
                        this.syncLocalName();
                    }
                    else{
                        let index=this.selectedSource.srcArr.findIndex((item)=>{return item==this.selectedCard});
                        this.selectedSource.srcArr.splice(index,1);
                    }
                    this.syncSourceList();
                }
                else if('play'==act && 0==this.isPlay){
                    this.isPlay=1;
                    this.syncSourceList();
                }
                else if('stop'==act  && 1==this.isPlay){
                    this.isPlay=0;
                    this.syncSourceList();
                }
                else if('up'==act && 0==this.isPlay && Object.keys(this.selectedSource).length>0){
                    //上移动  sceneId 需要与数组顺序相同
                    if(this.selectedLevel==1){
                        let index=this.selectedSource.srcGroupId;
                        if(index>0){
                            let scene=this.sourceList.splice(index,1);
                            this.sourceList.splice(index-1,0,scene[0]);
                            // this.updateTree();
                            this.syncSourceList();
                        }
                    }
                    else{
                        let srcArr=this.selectedSource.srcArr;
                        let index=srcArr.findIndex((item)=>{return item==this.selectedCard;});
                        if(index>0){
                            let scene=srcArr.splice(index,1);
                            srcArr.splice(index-1,0,scene[0]);
                            // this.updateTree();
                            this.syncSourceList();
                        }
                    }

                }
                else if('down'==act && 0==this.isPlay&& Object.keys(this.selectedSource).length>0){
                    //下移动
                    if(this.selectedLevel==1){
                        let index=this.selectedSource.srcGroupId;
                        if(index<this.sourceList.length-1){
                            let scene=this.sourceList.splice(index,1);
                            this.sourceList.splice(index+1,0,scene[0]);
                            // this.updateTree();
                            this.syncSourceList();
                        }
                    }
                    else{
                        let srcArr=this.selectedSource.srcArr;
                        let index=srcArr.findIndex((item)=>{return item==this.selectedCard;});
                        if(index>0){
                            let scene=srcArr.splice(index,1);
                            srcArr.splice(index+1,0,scene[0]);
                            // this.updateTree();
                            this.syncSourceList();
                        }
                    }
                }

            },
            syncSourceList(){
                let param={
                    funcSta:parseInt(this.isPlay),
                    srcGroupNum:this.sourceList.length,
                    srcGroupArr:[]
                    // srcGroupArr:[
                    //     {
                    //         srcGroupId:0,
                    //         srcNum:0,
                    //         srcArr:[
                    //             {
                    //                 dataArr:[
                    //                     {
                    //                         srcCardId:0,
                    //                         srcId:0,
                    //                     }
                    //                 ]
                    //             }
                    //         ]
                    //     }
                    // ]
                };

                // console.log(this.sourceList);
                for(let i in this.sourceList){
                    let srcGroup={
                        srcGroupId:parseInt(i),//todo 保存的时候 id 也重排么？
                        srcNum:this.sourceList[i].srcArr.length,
                        srcArr:[]
                    };
                    for(let k in this.sourceList[i].srcArr){
                        let src={
                            dataArr:this.sourceList[i].srcArr[k].dataArr.map((v,k)=>parseInt(v))
                        };
                        srcGroup.srcArr.push(src);
                    }
                    param.srcGroupArr.push(srcGroup);
                }

                console.log(param);
                this.$http.post("srcGroupWr.cgi",param,(ret)=>{
                    this.updateTree();
                });
            },
            subEvent(param){
                if('closeDialog'==param.act){
                    this.showSceneDialog='';
                }
                else if('updateSrcGroup'==param.act){
                    //更新
                    if(this.showSceneDialog=='edit'){
                        this.selectedSource.label=param.label;
                        this.selectedSource.srcArr=param.list;
                    }
                    else{
                        let newSource={
                            srcGroupId:this.sourceList.length,
                            srcNum:param.list.length,
                            srcArr:param.list
                        };
                        newSource.label=param.label==''?this.globalEvent.srcGroupName(newSource):param.label;
                        this.sourceList.push(newSource)

                    }
                    this.syncSourceList();
                    this.syncLocalName();
                    this.showSceneDialog='';
                }
            }
        },
        components:{
            sourceGroupDialog
        }
    }
</script>

<style scoped>
    .op_bt{display:flex;    border: 1px solid #dcdcdc;
        margin-right: 5px;
        background-color: #dcdcdcdc;
        margin-top: 5px;}
    .op_bt i{
        cursor:pointer;
        width: 20%;
        height: 25px;
        line-height: 25px;
        font-size: 18px;
    }
    .op_bt i:hover{color:#409eff;}
    .op_bt i.caret{font-size:12px;}
    .op_bt i.minus{width:23px;}
    .op_bt i.split_line{
        width: 0;
        cursor:default;
        border-right: 1px solid #505050;
        height: 15px;
        margin: 5px;}

    .op_bt i.el-icon-caret-right{color:#76fb4c;}
    .op_bt i.disabled{color:gray;}
    .op_list{
        margin-right: 5px;
        border: 1px solid #dcdcdc;
        margin-top: 5px;
        /*min-height:300px;*/
    }
    .selected_scene{color:#409eff;}

</style>