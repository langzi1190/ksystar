<template>
    <div class="screen_bright_dialog">
        <el-dialog  v-dialogDrag :title="LANG.BRIGHT_TITLE" :visible="showDialog=='screenBright'" @close="op(false)">
            <div class="screenWrapper">
                <el-tabs type="border-card"
                         v-model="curTabName"
                         @tab-click="tabChange"
                >
                    <!-- 屏幕墙 -->
                    <el-tab-pane v-for="(item,index) in displayList"
                                 :key="item.tabName"
                                 :name="item.tabName"
                                 :label="LANG.SCREEN_WALL+'-'+(index+1)"
                    >
                        <div class="winItemWrapper" :style="{
                        width:item.Col*144+'px',
                        height:item.Row*165+'px',
                        }">
                            <div class="winItem"
                                 :class="{
                                    winItemCur:selectedWinIndex==wIndex && curTabName==item.tabName,
                                    cl_left: wIndex%item.Col==0
                                 }"
                                 @click="selectWin(wIndex)"
                                 v-for="(w,wIndex) in item.portArr">
                                <div><span v-html="LANG.BRIGHT_SCREEN_NO"></span><span>{{wIndex+1}}</span></div>
                                <div><span v-html="LANG.BRIGHT_R"></span><span>{{w.briArr[0]}}</span></div>
                                <div><span v-html="LANG.BRIGHT_G"></span><span>{{w.briArr[1]}}</span></div>
                                <div><span v-html="LANG.BRIGHT_B"></span><span>{{w.briArr[2]}}</span></div>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>

            <div class="b_op">
                <el-select v-model="syncType"  size="mini" style="width: 150px;">
                    <el-option
                            v-for="item in syncTypeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                    ></el-option>
                </el-select>

                <label class="choose_rgb">
                    <input v-model="syncRgb" :false-value=0 :true-value=1 type="checkbox"/>{{LANG.BRIGHT_RGB}}
                </label>
                <div style="float:right;">
                    <div class="inputNumber">
                        <span>R:</span>
                        <el-input-number size="mini"  v-model="r"  @change="changeRgb('r')" :min="0" :max="128"></el-input-number>
                    </div>

                    <div class="inputNumber">
                        <span>G:</span>
                        <el-input-number size="mini" :disabled="syncRgb==1" v-model="g"  @change="changeRgb('g')" :min="0" :max="128"></el-input-number>
                    </div>

                    <div class="inputNumber">
                        <span>B:</span>
                        <el-input-number size="mini" :disabled="syncRgb==1" v-model="b"  @change="changeRgb('b')" :min="0" :max="128"></el-input-number>
                    </div>
                </div>
            </div>
            <div style="text-align:center;margin-top:15px;">
                <el-button size="mini" @click="op(true)">{{LANG.BTN_SURE}}</el-button>
                <el-button size="mini" @click="op(false)">{{LANG.BTN_CANCEL}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props:['showDialog'],
        data(){
            let LANG=this.LANGUAGE[this.globalEvent.language];
            return {
                curTabName:'',
                displayList:[],
                selectedWinIndex:-1,
                selectedTabIndex:0,
                syncType:1,
                syncTypeList:[
                    {
                        value:1,
                        label:LANG.BRIGHT_ALL
                    },
                    {
                        value:2,
                        label:LANG.BRIGHT_CUR
                    },
                    {
                        value:3,
                        label:LANG.BRIGHT_CUR_GROUP
                    }
                ],
                syncRgb:1,
                r:125,
                g:125,
                b:125,
                colorType:1,
                colorVal:125,
                LANG:LANG
            };
        },
        created(){
            this.displayList=this.globalEvent.screenInfo.scrGroupArr;
            this.curTabName=this.displayList[0].tabName;
            this.selectWin(0);
        },
        methods:{
            changeRgb(act){
                // console.log(act);
                if(this.syncRgb==1){
                    this.b=this.g=this.r;
                }
                this.colorType=act=='r'?1:(act=='g'?2:3);
                if(act=='r'){
                    this.colorVal=this.r;
                }else if(act=='g'){
                    this.colorVal=this.g;
                }else if(act=='b'){
                    this.colorVal=this.b;
                }
                this.syncWinRgb();
            },
            selectWin(index){
                this.selectedWinIndex=index;
                [this.r,this.g,this.b]=this.displayList[this.selectedTabIndex].portArr[index].briArr;
            },
            tabChange(curTab,e){

                if(this.selectedTabIndex!=curTab.index){
                    this.selectedWinIndex=-1;
                    this.selectedTabIndex=curTab.index;
                }
                this.selectWin(0);
            },
            syncWinRgb(){
                let cfgObj=0;
                if(this.syncType==1){
                    //同步所有
                    for(let i in this.displayList){
                        for(let k in this.displayList[i].portArr){
                            let portArr=this.displayList[i].portArr[k];
                            portArr.briArr=[this.r,this.g,this.b];
                        }
                    }
                }
                else if(this.syncType==3){
                    //同步一组
                    let portArr=this.displayList[this.selectedTabIndex].portArr;
                    for(let i in portArr){
                        portArr[i].briArr=[this.r,this.g,this.b];
                    }
                    cfgObj=this.selectedTabIndex;
                }
                else if(this.syncType==2){
                    if(this.selectedWinIndex==-1){
                        this.$message.error("未选中屏幕");
                        return;
                    }
                    //同步自己
                    this.displayList[this.selectedTabIndex].portArr[this.selectedWinIndex].briArr=[this.r,this.g,this.b];
                    cfgObj=this.displayList[this.selectedTabIndex].portArr[this.selectedWinIndex].mapArr[0];
                }

                // console.log(cfgObj);
                if(this.syncType==2){
                    cfgObj=0;
                    for(let i=0;i<this.selectedTabIndex;i++){
                        cfgObj+=this.displayList[i].portArr.length;
                    }
                    cfgObj+=this.selectedWinIndex;
                }
                let param={
                    cfgType:this.syncType,
                    colorType:this.syncRgb==1?7:this.colorType,
                    cfgObj:cfgObj-0,
                    colorVal:this.colorVal,
                };

                console.log(param);
                this.$http.post("scrColorWr.cgi",param,()=>{});
            },
            op(act){
                if(act)
                    this.syncWinRgb();
                this.$emit('sub_event',{act:'close_kfs'});
            }
        }
    }
</script>

<style>
    .screen_bright_dialog .el-dialog{width:800px;}
    .winItemWrapper{clear:both;
        background-color:#fff;
        align-content: baseline;min-height:400px; min-width:722px; border: 1px solid #dcdcdc;box-sizing: content-box;overflow:auto;}
    .winItem{text-align:center;float:left;
        background-color:#e6f1fa;
        border-right:1px solid #dcdcdc;
        border-bottom:1px solid #dcdcdc;
        box-sizing: border-box;
        padding-top: 20px;
        line-height: 20px;
        cursor:pointer;
        width:144px;
        height:144px;}
    .cl_left{clear:left;}
    .winItemCur{background-color:#a0daff;}
    .winItem span{display:inline-block;width:70px;text-align:left;}
    .winItem span:nth-child(odd){text-align:right;}
    .inputNumber{display:inline-block;margin-left:10px;}
    .inputNumber .el-input-number--mini{width:100px;margin-left:10px;}
    .b_op{margin-top:15px;}
    .choose_rgb{line-height:30px;margin-left:15px;cursor:pointer;}
    .choose_rgb input{vertical-align: middle;}
    .screen_bright_dialog .el-tab-pane{overflow:auto;max-height:500px;}

</style>