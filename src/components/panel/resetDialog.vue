<template>
    <div class="reset_dialog">
        <el-dialog
                :title="LANG.RESTOR_TITLE"
                :visible="showDialog=='reset' && globalEvent.userInfo.type==0"
                width="400px"
                @close="op(false)"
                center>
            <div style="height:50px;text-align:center;">
                <el-button @click="op(true)">{{LANG.BTN_SURE}}</el-button>
                <el-button @click="op(false)">{{LANG.BTN_CANCEL}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props:['showDialog'],
        data(){
            return {
                LANG:this.LANGUAGE[this.globalEvent.language]
            };
        },
        methods:{
            op(b){
                if(b){
                    this.$http.get("factory.cgi",{},()=>{
                        window.location.reload(true);
                    });
                }

                this.$emit('sub_event',{act:'close_kfs'});
            }
        }
    }
</script>