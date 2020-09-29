<template>
    <div class="edid_dialog">
        <el-dialog title="自定义EDID设置" :visible="showDialog=='edid'" @close="op(false)">
            <div class="item">
                <span>设备号：</span>
                <el-input-number :min="1" :max="200" v-model="userModel" size="mini"></el-input-number>
            </div>
            <div class="item">
                <span>宽度：</span>
                <el-input-number  v-model="userModel" size="mini"></el-input-number>
            </div>
            <div class="item">
                <span>高度：</span>
                <el-input-number  v-model="userModel" size="mini"></el-input-number>
            </div>
            <div class="item">
                <span>帧率：</span>
                <el-input size="mini"></el-input>
            </div>
            <div class="item">
                <span></span>
                <el-button  size="mini">高级</el-button>
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
                userModel:1,
            };
        },
        methods:{
            op(act){
                if(!act){
                    this.$emit('sub_event',{act:'close_kfs'});
                }
                else{
                    console.log('sure')
                    this.$emit('sub_event',{act:'close_kfs'});
                }
            }
        }
    }
</script>

<style>
    .edid_dialog .el-dialog{width:400px;}
    .edid_dialog .item{text-align:center;margin-bottom:20px;}
    .edid_dialog .item > span{display:inline-block;width:70px;text-align:right;}
    .edid_dialog .el-input{width:130px;}
    .edid_dialog .el-button--mini{width:130px;}
</style>