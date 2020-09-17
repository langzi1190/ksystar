<template>
    <div>
        <el-dialog
                title="自定义输出分辨率"
                :visible.sync="isVisible"
                width="400px"
                @close="isSubmit(false)"
                :append-to-body="true"
                center
        >
            <div class="inline_input">
                <div class="input_tip">
                    水平分辨率
                </div>
                <div>
                    <el-input-number v-model="x" :min="400" size="mini"></el-input-number>
                </div>
            </div>
            <div class="inline_input">
                <div class="input_tip">
                    垂直分辨率
                </div>
                <div>
                    <el-input-number v-model="y" :min="300" size="mini"></el-input-number>
                </div>
            </div>
            <div class="inline_input">
                <div class="input_tip"></div>
                <div>
                    <el-button @click="showTimeSeq" size="mini">输出时序</el-button>
                </div>
            </div>
            <div style="text-align:center">
                 <span slot="footer" class="dialog-footer">
                     <el-button @click="isSubmit(false)" size="mini">取 消</el-button>
                     <el-button type="primary" @click="isSubmit(true)" size="mini">确 定</el-button>
                </span>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    export default {
        props:['showSetting'],
        data(){
            return {
                x:1920,
                y:1080,
                isVisible: this.showSetting
            };
        },
        watch:{
            showSetting(v,ov){
                this.isVisible=v;
            }
        },
        methods:{
            showTimeSeq(){
                this.$emit('sub_event',{act:'showTimeSeq'});
            },
            isSubmit(on){
                if(!on){
                    this.$emit('sub_event',{act:'closeSetDialog'});
                }
                else{
                    //提交
                }
            }
        }
    }
</script>

<style>
    .inline_input{display:flex;line-height:40px;width:250px;margin:0 auto 20px;}
    .input_tip{width:100px;}
</style>