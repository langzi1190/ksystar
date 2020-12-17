<template>
    <div class="reset_dialog">
        <el-dialog
                :title="LANG.HOME_USER_MODE"
                :visible="showDialog"
                width="400px"
                @close="op(false)"
                center>
            <div style="height:50px;text-align:center;">
                <el-button size="mini" @click="action('edit_model')">{{LANG.SIGNAL_CHANGE_NAME}}</el-button>
                <el-button size="mini" :disabled="able==0" @click="action('load_model')">{{LANG.SIGNAL_LOAD}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props:['showDialog'],
        data(){
            return {
                able:this.$parent.userSceneList[this.$parent.selectedSceneIndex].value,
                LANG:this.LANGUAGE[this.globalEvent.language]
            };
        },
        methods:{
            op(b){

                this.$emit('sub_event',{act:'close'});
            },
            action(act){
                this.$emit('sub_event',{act});
            }
        }
    }
</script>