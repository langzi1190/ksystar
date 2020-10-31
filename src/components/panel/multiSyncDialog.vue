<template>
    <div class="mutli_sync_dialog">
        <el-dialog title="多机设置" :visible="showDialog=='multi'" @close="op(false)">
            <div class="item">
                <span>控制卡同步：</span>
                <el-select v-model="controlSync" size="mini">
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
                <el-select v-model="cardId"  size="mini">
                    <el-option
                            v-for="(item,index) in cardIdList"
                            :key="item"
                            :label="item"
                            :value="index"
                    ></el-option>
                </el-select>
            </div>

            <div class="item">
                <span>信 号 源 ID：</span>
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

                cardIdList:['None'],
                sourceIdList:[],
                cardId:0,
                sourceId:0,
            };
        },
        mounted(){

            this.controlSync=this.globalEvent.commonInfo.fSyncInfo.fSyncFuncSta;
            for(let i in this.globalEvent.inputCardList){
                this.cardIdList.push(++i);
            }
            if(this.cardIdList.length>0)
                    this.selectCard(0);
        },
        watch:{
            cardId(v,ov){
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
                    this.$http.post("multiSyncWr.cgi",param,(ret)=>{
                        this.globalEvent.commonInfo.fSyncInfo.fSyncFuncSta=this.controlSync;
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
</style>