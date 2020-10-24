<template>
    <div class="eq_dialog">
        <el-dialog
                title="EQ设置"
                :visible="showDialog=='eq'"
                width="200px"
                @close="submit(false)"
                center
        >

            <div class="item">
                <span>EQ值：</span>
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
            return {
                eqList:['0x9f','0x7f','0x7e','0x3f','0x3e','0x1f','0x1e','0x0f','0x0e','0x07','0x06','0x03','0x02','0x01','0x00'],
                eq:0
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
                console.log("读取 eq");
                console.log(ret);
                for(let i in this.eqList){
                    if(Number(this.eqList[i])==ret.eqVal){
                        console.log(ret.eqVal)
                        this.eq=i;
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

                   this.$http.post("srcEqWr.cgi",param,()=>{});
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