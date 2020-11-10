<template>
    <div class="reset_dialog">
        <el-dialog
                title="恢复出厂设置"
                :visible="showDialog=='reset' && globalEvent.userInfo.type!=2"
                width="400px"
                @close="op(false)"
                center>
            <div style="height:50px;text-align:center;">
                <el-button @click="op(true)">确定</el-button>
                <el-button @click="op(false)">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props:['showDialog'],
        data(){
            return {};
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