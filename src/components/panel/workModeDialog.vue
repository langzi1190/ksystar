<template>
    <div class="work_mode_dialog">
        <el-dialog
                v-dialogDrag
                :title="LANG.WORKMODE_TITLE"
                :visible="showDialog=='workMode'"
                width="270px"
                @close="submit(false)"
                center
        >

            <div class="item">
                <label>
                    <input type="radio" value=17 v-model="workMode" />{{LANG.WORKMODE_DP}}
                </label>
                <label>
                    <input type="radio" value=18 v-model="workMode" />{{LANG.WORKMODE_HDMI}}
                </label>
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
                workMode:this.globalEvent.selectedCard.ITESrcType-0,
                LANG:this.LANGUAGE[this.globalEvent.language]
            }
        },
        methods:{
            submit(act){
                if(act){
                    let num=this.globalEvent.sourceCardNumber();
                    let param={
                        srcCardId:num[0],
                        srcId:num[1],
                        mode:this.workMode-0
                    };
                    this.globalEvent.selectedCard.ITESrcType=param.mode;
                    console.log(param);
                    this.$http.post('switchDpHd.cgi',param,()=>{
                        this.$emit('sub_event',{act:'close_kfs'});
                        this.globalEvent.$emit('work_mode_change');//发送给signal
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