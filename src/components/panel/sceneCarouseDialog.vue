<template>
    <div class="scene_carousel_dialog">
        <el-dialog :title="LANG.CAROUSE_TITLE" :visible="true" @close="op(false)">
            <div class="top_part">
                <div v-html="LANG.CAROUSE_NAME"></div>
                <div class="label_group">
                    <el-input v-model="sceneName" size="mini"/>
                </div>
            </div>
            <div class="dialog_body">
                <div class="left_body">
                    <div class="scene_item"
                         :class="{selected_secene_item:selectedUserScene==index}"
                         @click="selectUserScene(index,'')"
                         v-for="(item,index) in userSceneList">{{item.label}}</div>
                </div>
                <div class="middle_body">
                    <el-button size="mini" @click="addUserScene">{{LANG.CAROUSE_ADD_LAYOUT}}  >> </el-button>
                </div>
                <div class="right_body">
                    <div class="scene_item"
                         :class="{selected_secene_item:selectedOpUserScene==index}"
                         @click="selectUserScene(index,'op')"
                         v-for="(item,index) in selectedUserSceneList">{{item.label}}</div>

                </div>
            </div>
            <div class="bottom_op">
                <div class="modifyBox" :class="{edit_right_scene:timeEditMode>-1}">
                    <div class="modifyAdd" @click.stop="modifyTime('add')">+</div>
                    <div @click.stop="setModifyLabel('d')" class="d">
                        <i v-show="modifyLabel!='d'">{{d}}</i>
                        <input v-model="d" type="number" min="0"  v-show="modifyLabel=='d'"/>
                    </div> Day(s) &nbsp;
                    <div @click.stop="setModifyLabel('h')">
                        <i v-show="modifyLabel!='h'">{{hs}}</i>
                        <input v-model="h" type="number" min="0" max="23" v-show="modifyLabel=='h'"/>
                    </div>:
                    <div @click.stop="setModifyLabel('m')">
                        <i v-show="modifyLabel!='m'">{{ms}}</i>
                        <input v-model="m" type="number" min="0" max="59" v-show="modifyLabel=='m'"/>
                    </div>:
                    <div @click.stop="setModifyLabel('s')">
                        <i v-show="modifyLabel!='s'">{{ss}}</i>
                        <input v-model="s" type="number" min="0" max="59" v-show="modifyLabel=='s'"/>
                    </div>
                    <div class="modifySub" @click.stop="modifyTime('sub')">-</div>
                </div>

                <el-button size="mini" @click="opRightScene('del')">{{LANG.CAROUSE_DEL_LAYOUT}}</el-button>
                <el-button size="mini" @click="opRightScene('edit')">{{LANG.CAROUSE_EDIT_LAYOUT}}</el-button>
            </div>
            <div class="button_group_bottom">
                <el-button size="mini" @click="op(true)">{{LANG.BTN_SURE}}</el-button>
                <el-button size="mini" @click="op(false)">{{LANG.BTN_CANCEL}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props:['showSceneDialog'],
        data(){
            return {
                sceneName:'',
                timeEditMode:-1,//-1 左边，>-1右边
                d:0,
                h:0,
                m:5,
                s:0,
                modifyLabel:'',//正在修改的
                userSceneList:[],

                selectedUserScene:-1,
                selectedUserSceneList:[],

                selectedOpUserScene:-1,//待删除/编辑的用户模式
                LANG:this.LANGUAGE[this.globalEvent.language]
            };
        },
        mounted(){
            document.addEventListener("click",this.clearModifyLabel)

            let presetStaArr=this.globalEvent.commonInfo.presetStaArr;
            this.userSceneList=[];
            for(let i in presetStaArr){
                if(presetStaArr[i]>0){
                    // this.userSceneList.push(parseInt(i)+1);
                    this.userSceneList.push({
                        label:this.globalEvent.userSceneName(i),//'用户模式 '+(parseInt(i)+1),
                        value:presetStaArr[i],
                        id:i
                    });
                }
            }

            if(this.showSceneDialog=='edit'){
                this.sceneName=this.$parent.selectedScene.label;
                this.selectedUserSceneList=JSON.parse(JSON.stringify(this.$parent.selectedScene.presetArr));
            }
        },
        destroyed(){
            document.removeEventListener("click",this.clearModifyLabel)
        },
        computed:{
            hs(){
                return this.doubleNum(this.h);
            },
            ms(){
                return this.doubleNum(this.m);
            },
            ss(){
                return this.doubleNum(this.s);
            }
        },
        methods:{
            op(act){
                if(act){
                    this.$emit("sub_event",{act:'updateScene',label:this.sceneName,list:this.selectedUserSceneList});
                }else{
                    this.$emit("sub_event",{act:'closeDialog'});
                }
            },
            clearModifyLabel(){
                this.modifyLabel='';
            },
            doubleNum(v){
                return v<10?'0'+v:v;
            },
            selectUserScene(index,act){
                if(act=='op'){
                    //待操作 用户模式
                    this.selectedOpUserScene=index;
                    if(this.timeEditMode!=index){
                        this.timeEditMode=-1;//恢复左侧编辑模式
                    }
                }
                else{
                    this.selectedUserScene=index;
                    this.timeEditMode=-1;//恢复左侧编辑模式
                }

            },
            setModifyLabel(label){
                this.modifyLabel=label;
                this.syncRightScene();
            },
            syncRightScene(){

                if(this.timeEditMode>-1){
                    //右侧编辑 选中的用户模式，实时改变时间,modifyTime,setModifyLabel
                    let dataArr=this.selectedUserSceneList[this.selectedOpUserScene];
                    dataArr.dataArr=[dataArr.dataArr[0],this.d,this.h,this.m,this.s];
                    dataArr.label=this.$parent.userSceneName(dataArr.dataArr)+this.$parent.userSceneTime(dataArr.dataArr);
                }
            },
            modifyTime(act){
                if(this.modifyLabel=='' || this.modifyLabel=='s'){
                    this.calTime('s',act,59);
                }
                else if(this.modifyLabel=='m'){
                    this.calTime('m',act,59)
                }
                else if(this.modifyLabel=='h'){
                    this.calTime('h',act,23)
                }
                else if(this.modifyLabel=='d'){
                    this.calTime('d',act,1000)
                }

                this.syncRightScene();
            },
            calTime(label,act,limit){
                if(act=='add'){
                    this[label]++;
                }
                else{
                    this[label]--;
                }
                if(this[label]>limit){
                    this[label]=limit;
                }
                else if(this[label]<0){
                    this[label]=0;
                }
            },
            addUserScene(){
                //添加布局，right scene Id 保存的时候需要减 1
                if(this.selectedUserScene==-1){
                    return ;
                }
                let arr=[this.userSceneList[this.selectedUserScene].id,this.d,this.h,this.m,this.s];

                this.selectedUserSceneList.push({
                    label:this.globalEvent.userSceneName(arr[0])+this.$parent.userSceneTime(arr),//"用户模式 "+(arr[0]+1)+this.$parent.userSceneTime(arr),
                    dataArr:arr
                });
            },
            opRightScene(act){
                if(act=='del' && this.selectedOpUserScene>-1){
                    this.selectedUserSceneList.splice(this.selectedOpUserScene,1);
                    this.selectedOpUserScene=-1;
                }
                else if(act=='edit' && this.selectedOpUserScene>-1){
                    let rightScene=this.selectedUserSceneList[this.selectedOpUserScene];
                    this.d=rightScene.dataArr[1];
                    this.h=rightScene.dataArr[2];
                    this.m=rightScene.dataArr[3];
                    this.s=rightScene.dataArr[4];
                    this.timeEditMode=this.selectedOpUserScene;
                }
            }
        }
    }
</script>

<style>
    .scene_carousel_dialog .top_part{padding-left:45px;}
    .scene_carousel_dialog .dialog_body{justify-content: center;padding-bottom:20px;}
    .scene_carousel_dialog .label_group{margin-left:10px;}
    .scene_carousel_dialog .right_body{width:210px;border:1px solid #dcdcdc;}
    .scene_carousel_dialog .middle_body{padding:0 20px;}
    .scene_carousel_dialog .middle_body button{margin-top:140px;}
    .scene_carousel_dialog .left_body,
    .scene_carousel_dialog .right_body{
        max-height:300px;
        padding:0;
        overflow:auto;
    }
    .scene_carousel_dialog .button_group_bottom{position:static;text-align:center;}
    .modifyBox{
        display:flex;
        position:relative;
        width: 205px;
        float: left;
        margin-left: 45px;
        border:1px solid #dcdcdc;
        justify-content: center;
    }
    .modifyBox > div{display:inline-block;cursor:pointer;margin:0 3px;}
    .modifyBox input{width:30px;}
    .modifyBox .modifyAdd,.modifyBox .modifySub{
        position: absolute;
        left: 0;
        width: 25px;
        background-color: #dcdcdc;
        user-select: none;
        margin: 0;}
    .modifyBox .modifySub{right:0;left:unset;}

    .bottom_op{height:45px;width:100%;}
    .bottom_op button{float:right;margin-right:45px;}
    .scene_item{text-align:left;margin:0 15px;padding-left:5px;height:30px;line-height:30px;cursor:pointer}
    .selected_secene_item{color:#409eff;cursor:pointer;}
    .edit_right_scene{border-color:#409eff;color:#409eff;}
    .scene_carousel_dialog .scene_item{width: auto;margin: 0;padding-left: 20px;display:flex;word-break: keep-all; }

</style>