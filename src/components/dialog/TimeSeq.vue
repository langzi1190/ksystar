<template>
    <div >
        <el-dialog
                title="输出时序设置"
                :visible.sync="isVisible"
                width="700px"
                @close="isSubmit(false)"
                :append-to-body="true"
                center
        >
            <div class="dialog_body time_seq">
                <div class="left_body">

                    <div class="row_item">
                        <div class="item_title">
                            时钟：
                        </div>
                        <div class="item_input">
                            <el-input
                                    size="mini"
                                    v-model="curScreen.ClkFreq">
                            </el-input>
                        </div>
                    </div>
                    <div class="row_item">
                        <div class="item_title">
                            宽度：
                        </div>
                        <div class="item_input">
                            <el-input
                                    size="mini"
                                    v-model="curScreen.FormatW"
                                    :disabled="true">
                            </el-input>
                        </div>
                    </div>
                    <div class="row_item">
                        <div class="item_title">
                            行显示前沿：
                        </div>
                        <div class="item_input">
                            <el-input
                                    size="mini"
                                    v-model="curScreen.HFrontPorch">
                            </el-input>
                        </div>
                    </div>
                    <div class="row_item">
                        <div class="item_title">
                            行同步脉冲：
                        </div>
                        <div class="item_input">
                            <el-input
                                    size="mini"
                                    v-model="curScreen.HSyncTime">
                            </el-input>
                        </div>
                    </div>
                    <div class="row_item">
                        <div class="item_title">
                            行显示后沿：
                        </div>
                        <div class="item_input">
                            <el-input
                                    size="mini"
                                    v-model="curScreen.HBackPorch">
                            </el-input>
                        </div>
                    </div>
                    <div class="row_item">
                        <div class="item_title">
                            行极性：
                        </div>
                        <div class="item_input">
                            <el-input
                                    size="mini"
                                    v-model="curScreen.HPolar">
                            </el-input>
                        </div>
                    </div>
                </div>
                <div class="right_body">

                    <div class="row_item">
                        <div class="item_title">
                            帧率：
                        </div>
                        <div class="item_input">
                            <el-input
                                    size="mini"
                                    v-model="FrameRateInfo"
                                    :disabled="true">
                            </el-input>
                        </div>
                    </div>
                    <div class="row_item">
                        <div class="item_title">
                            高度：
                        </div>
                        <div class="item_input">
                            <el-input
                                    size="mini"
                                    v-model="curScreen.FormatH"
                                    :disabled="true">
                            </el-input>
                        </div>
                    </div>
                    <div class="row_item">
                        <div class="item_title">
                            列显示前沿：
                        </div>
                        <div class="item_input">
                            <el-input
                                    size="mini"
                                    v-model="curScreen.VFrontPorch">
                            </el-input>
                        </div>
                    </div>
                    <div class="row_item">
                        <div class="item_title">
                            列同步脉冲：
                        </div>
                        <div class="item_input">
                            <el-input
                                    size="mini"
                                    v-model="curScreen.VSyncTime">
                            </el-input>
                        </div>
                    </div>
                    <div class="row_item">
                        <div class="item_title">
                            列显示后沿：
                        </div>
                        <div class="item_input">
                            <el-input
                                    size="mini"
                                    v-model="curScreen.VBackPorch">
                            </el-input>
                        </div>
                    </div>
                    <div class="row_item">
                        <div class="item_title">
                            列极性：
                        </div>
                        <div class="item_input">
                            <el-input
                                    size="mini"
                                    v-model="curScreen.VPolar">
                            </el-input>
                        </div>
                    </div>
                </div>
            </div>
            <div style="text-align:center;">
                <el-button @click="isSubmit(true)">确定</el-button>
                <el-button @click="isSubmit(false)">取消</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>

    export default {
        props:['showSetting'],
        data(){
            let curScreenIndex=this.comScreen.curScreenIndex();//当前操作的屏幕
            return {
                curScreenIndex,
                isVisible: this.showSetting,
                curScreen:this.copyObject(this.comScreen.displayList[curScreenIndex]),
                FrameRateInfo:0
            };
        },
        inject: ["comScreen"],
        watch:{
            showSetting(v,ov){
                this.isVisible=v;
            },
            // "globalEvent.curScreenIndex":function(v,ov){
            //     this.curScreen=this.copyObject(this.globalEvent.screenInfo.scrGroupArr[this.globalEvent.curScreenIndex]);
            // }
        },
        mounted(){
            if(this.curScreen.FrameRate==0){
                this.FrameRateInfo = 60;
            }
            else if(this.curScreen.FrameRate==1){
                this.FrameRateInfo = 50;
            }
            else if(this.curScreen.FrameRate==2){
                this.FrameRateInfo = 30;
            }
        },
        methods:{
            copyObject(o){
                return JSON.parse(JSON.stringify(o));
            },
            isSubmit(on){
                if(!on){

                    this.$emit('sub_event',{act:'closeTimeSeqDialog'});
                }
                else{
                    //提交
                    // console.log("xx");
                    // Object.assign(this.globalEvent.screenInfo.scrGroupArr[this.globalEvent.curScreenIndex],this.curScreen);
                    // console.log(this.globalEvent.screenInfo.scrGroupArr[this.globalEvent.curScreenIndex]);

                    Object.assign(this.comScreen.displayList[this.curScreenIndex],this.curScreen);
                    this.$emit('sub_event',{act:'closeTimeSeqDialog'});
                }
            }
        }
    }
</script>

<style scoped>
    .time_seq{width: 540px;margin: 0 auto;}
    .time_seq > div{width:50%;padding:0;height:auto;}
    .time_seq .left_body{border:none;}
    .row_item{display:flex;margin-bottom:20px;height:30px;line-height:30px;width:80%;}
    .item_title{width:45%;text-align:left;}
    .item_input{width:55%}
</style>