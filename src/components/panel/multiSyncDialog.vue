<template>
    <div class="mutli_sync_dialog">
        <el-dialog :title="LANG.MULTI_TITLE" :visible="showDialog=='multi'" @close="op(false)">
            <div class="item sp">
                <span v-html="LANG.MULTI_SYNC_CARD"></span>
                <el-select v-model="controlSync" size="mini">
                    <el-option
                            v-for="(item,index) in syncList"
                            :key="item"
                            :label="item"
                            :value="index"
                    ></el-option>
                </el-select>
            </div>
            <div class="item sp">
                <span v-html="LANG.MULTI_CARD_ID"></span>
                <el-select v-model="cardId"  size="mini">
                    <el-option
                            v-for="(item,index) in cardIdList"
                            :key="item"
                            :label="item"
                            :value="index"
                    ></el-option>
                </el-select>
            </div>

            <div class="item sp">
                <span v-html="LANG.MULTI_SOURCE_ID"></span>
                <el-select v-model="sourceId" placeholder="" size="mini">
                    <el-option
                            v-for="(item,index) in sourceIdList"
                            :key="item"
                            :label="item"
                            :value="index"
                    ></el-option>
                </el-select>
            </div>

            <div class="item">
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
                syncList:[LANG.MULTI_OFF,LANG.MULTI_ON],
                controlSync:this.globalEvent.commonInfo.mSyncFuncSta,

                cardIdList:['None'],
                sourceIdList:[],
                cardId:this.globalEvent.commonInfo.mSyncSrcCardId,
                sourceId:this.globalEvent.commonInfo.mSyncSrcId-1,
                LANG:LANG
            };
        },
        mounted(){

            for(let i in this.globalEvent.inputCardList){
                this.cardIdList.push(++i);
            }
            if(this.cardIdList.length>0){
                let inputCard=this.globalEvent.inputCardList;
                this.sourceIdList=[];
                for(let i in inputCard[this.cardId-1].srcArr){
                    this.sourceIdList.push(++i);
                }
            }

        },
        watch:{
            cardId(v,ov){
                console.log("cardid ...");
                this.selectCard(v);
            }
        },
        methods:{
            selectCard(index){
                index--;
                if(index==-1){
                    this.sourceIdList=['None'];
                    this.sourceId=0;
                    return ;
                }
                let inputCard=this.globalEvent.inputCardList;
                this.sourceIdList=[];
                this.sourceId=0;
                for(let i in inputCard[index].srcArr){
                    this.sourceIdList.push(++i);
                }

            },

            op(act){
                if(!act){
                    this.$emit('sub_event',{act:'close_kfs'});
                }
                else{
                    if(this.cardIdList.length==0 && this.sourceIdList.length==0){
                        alert("无数据");
                        return ;
                    }
                    let param={
                        funcSta:this.controlSync,
                        srcCardId:this.cardId,
                        srcId:this.sourceId
                    };
                    if(param.srcCardId>0){
                        param.srcId=parseInt(param.srcId)+1;
                    }
                    console.log(param);
                    this.$http.post("multiSyncWr.cgi",param,(ret)=>{
                        this.globalEvent.commonInfo.mSyncFuncSta=this.controlSync;
                        this.globalEvent.commonInfo.mSyncSrcCardId=param.cardId;
                        this.globalEvent.commonInfo.mSyncSrcId=param.srcId;
                        this.$emit('sub_event',{act:'close_kfs'});
                    });
                }
            }
        }
    }
</script>

<style>
    .mutli_sync_dialog .el-dialog{width:400px;}
    .mutli_sync_dialog .item{text-align:center;margin-bottom:20px;}
    .mutli_sync_dialog .label_group{display:inline-block;}
    .mutli_sync_dialog .sp span{display:inline-block;width:95px;text-align:right;margin-right:5px;}
</style>