<template>
    <div class="mutli_sync_dialog">
        <el-dialog title="多机设置" :visible="showDialog=='multi'" @close="op(false)">
            <div class="item">
                <span>控制卡同步：</span>
                <el-select v-model="controlSync" placeholder="同步基准源" size="mini">
                    <el-option
                            v-for="(item,index) in syncList"
                            :key="item"
                            :label="item"
                            :value="index"
                    ></el-option>
                </el-select>
            </div>
            <div class="item">
                <span>信号源卡ID：</span>
                <el-select v-model="controlSync" placeholder="" size="mini">
                    <el-option
                            v-for="(item,index) in syncList"
                            :key="item"
                            :label="item"
                            :value="index"
                    ></el-option>
                </el-select>
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
                syncList:['关','开'],
                controlSync:0,

                cardIdList:[],
                sourceCardIdList:[],
                sourceId:[],
            };
        },
        methods:{
            op(act){

            }
        }
    }
</script>

<style>
    .mutli_sync_dialog .el-dialog{width:400px;}
    .mutli_sync_dialog .item{text-align:center;margin-bottom:20px;}
    .mutli_sync_dialog .label_group{display:inline-block;}
</style>