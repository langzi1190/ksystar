<template>
    <div class="temp_dialog">
        <el-dialog title="板卡FPGA温度监控" :visible="showDialog=='temp'" @close="op(false)">
            <div class="top_part">
                <div>
                    <label>
                        <input type="checkbox"/>1_输出卡
                    </label>
                    <div class="temp">87 ℃</div>
                </div>
                <div>
                    <label>
                        <input type="checkbox"/>2_输出卡
                    </label>
                    <div class="temp">87 ℃</div>
                </div>
                <div>
                    <label>
                        <input type="checkbox"/>3_输出卡
                    </label>
                    <div class="temp">87 ℃</div>
                </div>

            </div>
            <div class="canvas_wrapper">
                <canvas width="700" height="450"></canvas>
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
            op(act){
                this.$emit('sub_event',{act:'close_kfs'});
            }
        }
    }
</script>

<style>
    .temp_dialog .el-dialog{width:800px;}
    .top_part > div{display:inline-block;}
    .top_part .temp{display:inline-block;color:#fff;background-color:black;    height: 25px;line-height: 25px;margin: 0 10px;padding: 0 10px;}
    .top_part label input{vertical-align: middle;margin-right:5px;}
    .canvas_wrapper{margin-top:15px;}
    .canvas_wrapper canvas{margin:0 auto;}
</style>