<template>
    <div class="version_dialog">
        <el-dialog title="版本信息" :visible="showDialog=='version'" @close="op(false)">
            <table style="width:100%">
                <tr>
                    <th colspan="2">类型</th>
                    <th>ARM 版本</th>
                    <th>FPGA 版本</th>
                </tr>
                <tr>
                    <td>1</td>
                    <td>输入卡</td>
                    <td>2018-09-09 09:09</td>
                    <td>2018-09-09 09:09</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>输入卡</td>
                    <td>2018-09-09 09:09</td>
                    <td>2018-09-09 09:09</td>
                </tr>
                <tr style="background-color:#00cc99">
                    <td colspan="2">控制卡</td>
                    <td>2018-09-09 09:09</td>
                    <td>2018-09-09 09:09</td>
                </tr>
            </table>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        props:['showDialog'],
        data(){
            return {
                color_list:['pink','gray','orange','#00cc99']
            };
        },
        methods:{
            op(act){
                this.$emit('sub_event',{act:'close_kfs'});
            },
        }
    }
</script>

<style>
    .version_dialog .el-dialog{width:600px;}
    .version_dialog td,.version_dialog th{height:30px;text-align:center;line-height:30px;border: 1px solid #505050;}
</style>