<template>
    <div class="version_dialog">
        <el-dialog title="版本信息" :visible="showDialog=='version'" @close="op(false)">
            <table style="width:100%">
                <tr>
                    <th colspan="2">类型</th>
                    <th>ARM 版本</th>
                    <th>FPGA 版本</th>
                </tr>
                <tr v-for="(item,index) in inputCard" style="background-color:pink">
                    <td>{{inputCard.length-index}}</td>
                    <td>输入卡</td>
                    <td>{{item.ARM}}</td>
                    <td>{{item.FPGA}}</td>
                </tr>
                <tr v-for="(item,index) in outCard" style="background-color:#ff9900;">
                    <td>{{outCard.length-index}}</td>
                    <td>输出卡</td>
                    <td>{{item.ARM}}</td>
                    <td>{{item.FPGA}}</td>
                </tr>
                <tr style="background-color:lightblue" v-if="syncCard.length>0">
                    <td colspan="2">同步卡</td>
                    <td>{{syncCard[0].ARM}}</td>
                    <td>{{syncCard[0].FPGA}}</td>
                </tr>
                <tr style="background-color:yellow" v-if="monitorCard.length>0">
                    <td colspan="2">监控卡</td>
                    <td>{{monitorCard[0].ARM}}</td>
                    <td>{{monitorCard[0].FPGA}}</td>
                </tr>
                <tr style="background-color:#00cc99" v-if="ctrlCard.length>0">
                    <td colspan="2">控制卡</td>
                    <td>{{ctrlCard[0].ARM}}</td>
                    <td>{{ctrlCard[0].FPGA}}</td>
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
                ctrlCard:this.globalEvent.versionInfo.ctrlCardArr,
                syncCard:this.globalEvent.versionInfo.syncCardArr,
                monitorCard:this.globalEvent.versionInfo.monitorCardArr,
                inputCard:this.globalEvent.versionInfo.inCardArr.reverse(),
                outCard:this.globalEvent.versionInfo.outCardArr.reverse(),

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