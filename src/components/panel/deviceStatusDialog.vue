<template>
    <div class="status_dialog">
        <el-dialog title="设备配置状态" :visible="showDialog=='deviceStatus'" @close="op(false)">
            <table style="width:100%">
                <tr>
                    <th colspan="5">类型</th>
                    <th width="120">内存 OK</th>
                    <th width="120">视频传输 OK</th>
                    <th width="120">控制 OK</th>
                    <th width="120">FLASH保护 OK</th>
                </tr>
                <tr>
                    <td>1</td>
                    <td>输入卡</td>
                    <td>div</td>
                    <td>sdr</td>
                    <td>hdmi</td>

                    <td><i class="el-icon-success"></i></td>
                    <td><i class="el-icon-success"></i></td>
                    <td><i class="el-icon-success"></i></td>
                    <td><i class="el-icon-success"></i></td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>输入卡</td>
                    <td>div</td>
                    <td>sdr</td>
                    <td>hdmi</td>

                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr style="background-color:#00cc99">
                    <td colspan="2">控制卡</td>
                    <td colspan="3">控制卡</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
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
    .status_dialog .el-dialog{width:800px;}
    .status_dialog i{font-size:25px;vertical-align: middle;color:#00cc99;}
    .status_dialog td,.status_dialog th{height:30px;text-align:center;line-height:30px;border: 1px solid #505050;}
</style>