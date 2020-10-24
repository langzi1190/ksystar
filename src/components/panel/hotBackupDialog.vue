<template>
    <div class="hot_backup_dialog">
        <el-dialog
                title="输入源热备份设置"
                :visible="showDialog=='hotBackup'"
                width="350px"
                @close="submit(false)"
                center
        >
            <div class="item">
                <el-checkbox v-model="enable">热备份使能</el-checkbox>
            </div>
            <div class="item">
                <span>信号源卡ID：</span>
                <el-select :disabled="disabled" v-model="cardNumber" placeholder="" size="mini">
                    <el-option
                            v-for="(item,index) in cardNumberList"
                            :key="item"
                            :label="item"
                            :value="index"
                    ></el-option>
                </el-select>
            </div>
            <div class="item">
                <span>信号源ID：</span>
                <el-select :disabled="disabled" v-model="sourceCard" placeholder="" size="mini">
                    <el-option
                            v-for="(item,index) in sourceCardList"
                            :key="item"
                            :label="item"
                            :value="index"
                    ></el-option>
                </el-select>
            </div>
            <div class="item">
                <el-button size="mini" @click="submit(true)">确定</el-button>
                <el-button size="mini" @click="submit(false)">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props:['showDialog'],
        data(){
            let cardNumberList=[];
            for(let i in this.globalEvent.inputCardList){
                cardNumberList.push(parseInt(i)+1);
            }
            let sourceCardList=[];
            for(let i in this.globalEvent.inputCardList[0].srcArr){
                if(this.globalEvent.inputCardList[0].srcArr[i].id!=this.globalEvent.selectedCard.id){
                    sourceCardList.push(parseInt(i)+1);
                }

            }
            return {
                enable:this.globalEvent.selectedCard.bakFuncSta==1,
                cardNumber:0,
                cardNumberList,
                sourceCard:0,
                sourceCardList
            };
        },
        computed:{
            disabled(){
                return !this.enable;
            }
        },
        mounted(){
            this.cardNumber=this.globalEvent.selectedCard.bakSrcCardId;
        },
        watch:{
            cardNumber(v,ov){
                this.changeSourceList(v);
            }
        },
        methods:{
            changeSourceList(seq){
                this.sourceCardList=[];
                this.sourceCard=0;
                for(let i in this.globalEvent.inputCardList[seq].srcArr){
                    if(this.globalEvent.inputCardList[seq].srcArr[i].id!=this.globalEvent.selectedCard.id){
                        this.sourceCardList.push(parseInt(i)+1);
                        if(this.globalEvent.selectedCard.bakSrcId==i){
                            this.sourceCard=this.sourceCardList.length-1;
                        }
                    }

                }
            },
            submit(act){
                if(act){
                    let num=this.globalEvent.selectedCard.label_info.split('_');
                    let param={
                        funcSta:this.enable?1:0,
                        srcCardId:num[0]-0,
                        srcId:num[1]-0,
                        bakSrcCardId:this.cardNumber,
                        bakSrcId:this.sourceCardList[this.sourceCard]-1

                    };
                    this.globalEvent.selectedCard.bakFuncSta=param.funcSta;
                    this.globalEvent.selectedCard.bakSrcCardId=param.bakSrcCardId;
                    this.globalEvent.selectedCard.bakSrcId=param.bakSrcId;

                    this.$http.post("srcBakWr.cgi",param,()=>{
                        this.$emit('sub_event',{act:'close_kfs'});
                    });
                }
                else{
                    this.$emit('sub_event',{act:'close_kfs'});
                }
            }
        }
    }
</script>

<style>
    .hot_backup_dialog .item{text-align:center;margin-bottom:20px;}
    .hot_backup_dialog .item > span{display:inline-block;width:100px;text-align:right;}
    .hot_backup_dialog .el-checkbox{margin-left:-100px;}
    .hot_backup_dialog .el-input{width:130px;}
    .hot_backup_dialog .el-button--mini{width:130px;}
</style>