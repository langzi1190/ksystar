<template>
    <div class="user_model_dialog">
        <el-dialog :title="LANG.MODE_TITLE" :visible="showDialog=='userModel'" @close="op(false)">
            <div class="item">
                <span v-html="LANG.MODE_ID"></span>
                <el-input-number :min="1" :max="200" v-model="userModel" size="mini"></el-input-number>
            </div>
            <div class="item">
                <span v-html="LANG.MODE_NAME"></span>
                <el-input v-model="userModelName" disabled="" size="mini"></el-input>
            </div>

            <div class="item">
                <el-button size="mini" @click="op(true)">{{LANG.BTN_SURE}}</el-button>
                <el-button size="mini" @click="op(false)">{{LANG.BTN_CANCEL}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props:['showDialog'],
        data(){
            return {
                userModel:1,
                userModelName:this.globalEvent.userSceneName(0)
            };
        },
        watch:{
            userModel(v,ov){
                this.userModelName=this.globalEvent.userSceneName(v-1);
            }
        },
        methods:{
            op(act){
                if(!act){
                    this.$emit('sub_event',{act:'close_kfs'});
                }
                else{
                    if(this.globalEvent.commonInfo.presetStaArr[this.userModel-1]==0){
                        alert("该模式没有数据");
                        return ;
                    }
                    // this.$http.post("loadPreset.cgi",{presetId:this.userModel-1},(ret)=>{
                    //     this.$emit('sub_event',{act:'select_user_model',v:this.userModel-1})
                    // });

                    this.$emit('sub_event',{act:'select_user_model',v:this.userModel-1})

                }
            }
        }
    }
</script>

<style>
    .user_model_dialog .el-dialog{width:400px;}
    .user_model_dialog .item{text-align:center;margin-bottom:20px;}
    .user_model_dialog .item > span{display:inline-block;width:70px;text-align:right;}
    .user_model_dialog .el-input{width:130px;}
</style>