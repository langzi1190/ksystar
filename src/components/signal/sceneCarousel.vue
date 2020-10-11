<template>
    <div class="scene_carousel">
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
            <div class="op_select">
                <select v-model="mode">
                    <option value=0>单个轮巡循环</option>
                    <option value=1>全部轮巡循环</option>
                </select>
            </div>

            <div class="op_list">
                <el-tree
                        :data="sceneList"
                        :props="paramMap"
                        :default-expand-all='true'
                        v-if="updateFlip"
                        :render-content="renderContent"
                        @node-click="handleNodeClick"></el-tree>
            </div>
        </div>

        <sceneCarouselDialog @sub_event="subEvent" v-if="showSceneDialog!=''" :showSceneDialog="showSceneDialog"></sceneCarouselDialog>
    </div>
</template>

<script>
    import sceneCarouselDialog from "@/components/panel/sceneCarouseDialog";
    export default {
        created(){
            //用户模式 和 场景模式怎么关联起来的
            this.$http.get("scenePollingRd.cgi",{},(ret)=>{
                let sceneInfo=ret.data;
                for(let i in sceneInfo.sceneArr){
                    sceneInfo.sceneArr[i].label=this.globalEvent.carouseName(sceneInfo.sceneArr[i]);
                    let preset=sceneInfo.sceneArr[i].presetArr;
                    for(let k in preset){
                        preset[k].label=this.userSceneName(preset[k].dataArr)+this.userSceneTime(preset[k].dataArr);
                    }
                }
                this.globalEvent.sceneCarousel=sceneInfo;
                this.sceneList=this.globalEvent.sceneCarousel.sceneArr;
                this.mode=sceneInfo.mode;


                this.syncLocalName();
            });
        },
        data(){
            return {
                sceneList:[],
                updateFlip:true,//强制更新结构体
                paramMap:{
                    children:'presetArr'
                },
                mode:0,
                showSceneDialog:'',
                selectedScene:{},//当前选择的场景
                selectedUserMode:{},//选择的用户模式 排序用
                selectedLevel:0,//1场景排序，2用户模式排序
                isPlay:0,
            };
        },
        methods:{
            syncLocalName(){
                this.globalEvent.syncLocalName('sceneCarouse',this.sceneList)
            },
            renderContent(h,{node,data,store}){
                if(node.level==1){
                    return h('span',{
                        class:{
                            'selected_scene':data.label==this.selectedScene.label
                        }
                    },data.label)
                }
                else{
                    return h('span',data.label)
                }

            },
            handleNodeClick(data,node,tree){

                if(node.level==1){
                    this.selectedScene=data;
                    this.selectedUserMode={};
                }
                else{
                    this.selectedScene=node.parent.data;
                    this.selectedUserMode=data;
                }
                this.selectedLevel=node.level;
                // console.log(this.selectedScene.presetArr.includes(data));
            },
            userSceneTime(arr){
                return "    "+arr[1]+','+this.doubleNum(arr[2])+':'+this.doubleNum(arr[3])+':'+this.doubleNum(arr[4]);
            },
            userSceneName(arr){
                return this.globalEvent.userSceneName(arr[0]);
            },
            doubleNum(v){
                return v<10?'0'+v:v;
            },
            updateTree(){
                if(this.selectedLevel==1){
                    for(let i in this.sceneList){
                        this.sceneList[i].sceneId=i;//更改 id
                    }
                }
                this.syncLocalName();
                this.updateFlip=false;
                this.$nextTick(()=>{
                    this.updateFlip=true;
                })
            },
            op(act){
                if('add'==act && 0==this.isPlay){
                    this.showSceneDialog='new';
                }
                else if('edit'==act && Object.keys(this.selectedScene).length>0 && 0==this.isPlay){
                    this.showSceneDialog='edit';
                }
                else if('del'==act && 0==this.isPlay){
                    if(this.selectedLevel==1){
                        this.sceneList.splice(this.selectedScene.sceneId,1);
                        for(let i in this.sceneList){
                            this.sceneList[i].sceneId=i;
                        }
                        this.syncLocalName();
                    }
                    else{
                        let index=this.selectedScene.presetArr.findIndex((item)=>{return item==this.selectedUserMode;});
                        this.selectedScene.presetArr.splice(index,1);
                    }


                }
                else if('play'==act && 0==this.isPlay){
                    this.isPlay=1;
                }
                else if('stop'==act  && 1==this.isPlay){
                    this.isPlay=0;
                }
                else if('up'==act && 0==this.isPlay && Object.keys(this.selectedScene).length>0){
                    //上移动  sceneId 需要与数组顺序相同

                    if(this.selectedLevel==1){
                        let index=this.selectedScene.sceneId;
                        if(index>0){
                            let scene=this.sceneList.splice(index,1);
                            this.sceneList.splice(index-1,0,scene[0]);
                            this.updateTree();
                        }
                    }
                    else{
                        let presetArr=this.selectedScene.presetArr;
                        let index=presetArr.findIndex((item)=>{return item==this.selectedUserMode;});
                        if(index>0){
                            let scene=presetArr.splice(index,1);
                            presetArr.splice(index-1,0,scene[0]);
                            this.updateTree();
                        }
                    }

                }
                else if('down'==act && 0==this.isPlay&& Object.keys(this.selectedScene).length>0){
                    //下移动
                    if(this.selectedLevel==1){
                        let index=this.selectedScene.sceneId;
                        if(index<this.sceneList.length-1){
                            let scene=this.sceneList.splice(index,1);
                            this.sceneList.splice(index+1,0,scene[0]);
                            this.updateTree();
                        }
                    }
                    else{
                        let presetArr=this.selectedScene.presetArr;
                        let index=presetArr.findIndex((item)=>{return item==this.selectedUserMode;});
                        if(index<this.sceneList.length-1){
                            let scene=presetArr.splice(index,1);
                            presetArr.splice(index+1,0,scene[0]);
                            this.updateTree();
                        }
                    }


                }
            },
            subEvent(param){
                if('closeDialog'==param.act){
                    this.showSceneDialog='';
                }
                else if('updateScene'==param.act){
                    //更新
                    if(this.showSceneDialog=='edit'){
                        this.selectedScene.label=param.label;
                        this.selectedScene.presetArr=param.list;
                    }
                    else{
                        //新增
                        let scene={
                            sceneId:this.sceneList.length,
                            presetNum:param.list.length,
                            presetArr:param.list
                        };
                        scene.label=param.label==''?this.globalEvent.carouseName(scene):param.label;
                        this.sceneList.push(scene)
                    }

                    console.log(this.sceneList);

                    this.syncLocalName();
                    this.showSceneDialog='';
                }
            }
        },
        components:{
            sceneCarouselDialog
        }
    }
</script>

<style>
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

    .op_area select{
        width: 195px;
        margin-right: 5px;
        height: 30px;
        margin-top: 5px;
    }
    .op_bt i.el-icon-caret-right{color:#76fb4c;}
    .op_bt i.disabled{color:gray;}
    .op_list{
        margin-right: 5px;
        border: 1px solid #dcdcdc;
        margin-top: 5px;
        min-height:300px;
        max-height: 450px;
        overflow: scroll;
    }
    .selected_scene{color:#409eff;}

</style>