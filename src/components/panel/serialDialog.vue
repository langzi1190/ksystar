<template>
    <div class="serial_dialog">
        <el-dialog title="串口设置" :visible="showDialog=='serial'" @close="op(false)">
            <div class="item">
                <span>串口1波特率：</span>
                <el-select v-model="com1" placeholder="" size="mini">
                    <el-option
                            v-for="(item,index) in baudList"
                            :key="item"
                            :label="item"
                            :value="index"
                    ></el-option>
                </el-select>
            </div>
            <div class="item">
                <span>串口2波特率：</span>
                <el-select v-model="com2" placeholder="" size="mini">
                    <el-option
                            v-for="(item,index) in baudList"
                            :key="item"
                            :label="item"
                            :value="index"
                    ></el-option>
                </el-select>
            </div>
            <div class="item">
                <span>串口2控制模式:</span>
                <div class="label_group">
                    <label><input v-model="control_mode" value=0 type="radio"/>控制模式</label>
                    <label><input v-model="control_mode" value=1 type="radio"/>环出模式</label>
                </div>
            </div>
            <div class="item" style="color:#f44f44;width: 200px;margin: 0 auto 20px;line-height: 20px;">
                注意：更改串口信息后，软件串口连接将断开，请重新连接
            </div>
            <div class="item">
                <el-button size="mini" @click="op(true)">确定</el-button>
                <el-button size="mini" @click="op(false)">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props:['showDialog'],
        data(){
            return {
                com1:this.globalEvent.commonInfo.COM1BaudId,
                com2:this.globalEvent.commonInfo.COM2BaudId,
                control_mode:this.globalEvent.commonInfo.COM2CtrlModeId,
                baudList:[1200,2400,4800,9600,19200,38400,57600,115200]
            };
        },
        methods:{
            op(act){
                if(act){
                    let param={
                        com2CtrlMode:parseInt(this.control_mode),
                        com1BaudId:this.com1,
                        com2BaudId:this.com2,
                    };

                    this.$http.post("comCfg.cgi",param,(ret)=>{
                        this.$parent.$refs.signal.getCommonInfo();
                        this.$emit('sub_event',{act:'close_kfs'});
                    });

                }
                else{
                    this.$emit('sub_event',{act:'close_kfs'});
                }

            }
        }
    }
</script>

<style>
    .serial_dialog .el-dialog{width:400px;}
    .serial_dialog .item{text-align:center;margin-bottom:20px;}
    .serial_dialog .label_group{display:inline-block;}
</style>