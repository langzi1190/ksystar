<template>
    <div class="eq_dialog">
        <el-dialog
                :title="LANG.EQ_TITLE"
                :visible="showDialog=='eq'"
                width="200px"
                @close="submit(false)"
                center
        >

            <div class="item">
                <span v-html="LANG.EQ_VALUE"></span>
                <el-select v-model="eq" size="mini" style="width:90px;">
                    <el-option
                            v-for="(item,index) in eqList"
                            :key="item"
                            :label="item"
                            :value="index"
                    ></el-option>
                </el-select>
            </div>
            <div class="item" style="margin-top:20px;">
                <el-button size="mini" @click="submit(true)">{{LANG.BTN_SURE}}</el-button>
                <el-button size="mini" @click="submit(false)">{{LANG.BTN_CANCEL}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props:['showDialog'],
        data(){
            return {
                eqList:['0x9f','0x7f','0x7e','0x3f','0x3e','0x1f','0x1e','0x0f','0x0e','0x07','0x06','0x03','0x02','0x01','0x00'],
                eq:0,
                LANG:this.LANGUAGE[this.globalEvent.language]
            }
        },
        created(){
            // console.log(this.showDialog);
            //读取 eq值
            let num=this.globalEvent.selectedCard.label_info.split("_");
            let param={
                srcCardId:num[0]-0,
                srcId:num[1]-0,
            };
            this.$http.post("srcEqRd.cgi",param,(ret)=>{
                for(let i in this.eqList){
                    if(Number(this.eqList[i])==ret.data.eqVal){
                        console.log(ret.eqVal)
                        this.eq=parseInt(i);
                        break;
                    }
                }
            });
        },
        methods:{
            submit(act){
                if(act){
                    let num=this.globalEvent.selectedCard.label_info.split('_');
                    let param={
                        srcCardId:num[0]-0,
                        srcId:num[1]-0,
                        eqVal:Number(this.eqList[this.eq])
                    };

                   this.$http.post("srcEqWr.cgi",param,()=>{
                       this.$emit('sub_event',{act:'close_kfs'});
                   });
                }else{
                    this.$emit('sub_event',{act:'close_kfs'});
                }
            }
        }
    }
</script>

<style>
    .work_mode_dialog .item{text-align:center;}
    .work_mode_dialog .item label{cursor:pointer;}
</style>