<template>
    <div >
        <el-dialog
                title="EDID详细参数设置"
                :visible="showDialog=='edidAdvanced'"
                width="700px"
                @close="cancelSubmit"
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
                </div>
                <div class="right_body">

                    <div class="row_item">
                        <div class="item_title">
                            帧率：
                        </div>
                        <div class="item_input">
                            <el-input
                                    size="mini"
                                    v-model="curScreen.FrameRate"
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
                </div>
            </div>
            <div style="text-align:center;">
                <el-button @click="submit">确定</el-button>
                <el-button @click="cancelSubmit">取消</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>

    export default {
        props:['showDialog'],
        data(){
            return {
                curScreen:{
                    ClkFreq:526080,
                    FormatW:3840,
                    FormatH:2160,
                    FrameRate:60,
                    HFrontPorch:48,
                    HSyncTime:32,
                    HBackPorch:80,
                    VFrontPorch:12,
                    VSyncTime:8,
                    VBackPorch:12
                }//this.copyObject(this.globalEvent.screenInfo.scrGroupArr[this.globalEvent.curScreenIndex]),
            };
        },
        // watch:{
        //     "globalEvent.curScreenIndex":function(v,ov){
        //         this.curScreen=this.copyObject(this.globalEvent.screenInfo.scrGroupArr[this.globalEvent.curScreenIndex]);
        //     }
        // },
        methods:{
            getEdid(){
                let num=this.globalEvent.selectedCard.label_info.split('_');
                let param={
                    srcCardId:num[0]-0,
                    srcId:num[1]-0
                };
                this.$http.get("srcEdidRd.cgi",param,(ret)=>{

                });
            },
            // copyObject(o){
            //     return JSON.parse(JSON.stringify(o));
            // },
            cancelSubmit(){
                this.$emit('sub_event',{act:'close_kfs'});
            },
            submit(){
                //提交
                console.log("xx");
                // Object.assign(this.globalEvent.screenInfo.scrGroupArr[this.globalEvent.curScreenIndex],this.curScreen);
                // console.log(this.globalEvent.screenInfo.scrGroupArr[this.globalEvent.curScreenIndex]);
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