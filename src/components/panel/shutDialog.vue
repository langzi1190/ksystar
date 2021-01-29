<template>
    <div class="reset_dialog">
        <el-dialog
                v-dialogDrag
                :title="LANG.CLOSE_TITLE"
                :visible="showDialog=='shut'"
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
                    // this.loading=this.$loading({
                    //     lock: true,
                    //     text: this.LANG.EXPORT_IN_PROGRESS,
                    //     spinner: 'el-icon-loading',
                    //     background: 'rgba(255, 255, 255, 0.5)'
                    // });
                    // this.$http.get("factory.cgi",{},()=>{
                    //     window.location.reload(true);
                    // });
                    this.$http.post("outStaWr.cgi",{outSta:0},(ret)=>{

                    });
                }
                this.$emit('sub_event',{act:'close_kfs'});
            }
        }
    }
</script>