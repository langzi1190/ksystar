<template>
    <div class="user_model_dialog">
        <el-dialog title="回显IP设置" :visible="showDialog=='monIp'" @close="op(false)">
            <div class="item">
                <span>IP地址：</span>
                <div class="input_group">
                    <input v-model="ipArr[0]" min="0" max="255" />.<input  v-model="ipArr[1]"  min="0" max="255"/>.<input  v-model="ipArr[2]"  min="0" max="255"/>.<input  v-model="ipArr[3]"  min="0" max="255"/>
                </div>
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
                ipArr:[0,0,0,0]
            };
        },
        // created(){
        //     this.$http.get("monitorIpWr.cgi",{},(ret)=>{
        //         this.ipArr=ret.data.ipArr;
        //     });
        // },
        // mounted(){
        //     this.$http.get("ipCfgRd.cgi",{},(ret)=>{
        //         console.log(ret.data);
        //         this.ipArr=ret.data.ipArr;
        //     });
        // },
        watch:{
            ipArr:{
                deep:true,
                handler(v,ov){
                    for(let i in v){
                        let num=v[i];
                        if(isNaN(num) || num<0){
                            this.delayDet(i,0);
                        }
                        else if(num>255){
                            this.delayDet(i,255);
                        }
                    }
                }
            },
            showDialog(v,ov){
                if(v=='monIp'){
                    this.$http.post("monitorIpWr.cgi",{ipArr:[0,0,0,0]},(ret)=>{
                        this.ipArr=ret.data.ipArr;
                    });
                }
            }
        },
        methods:{
            delayDet(i,num){
                this.$nextTick(()=>{
                    this.$set(this.ipArr,i,num);
                });
            },
            op(act){
                if(act){

                    this.$http.post("monitorIpWr.cgi",{ipArr:this.ipArr.map((s)=>{return parseInt(s)})},(ret)=>{
                    });
                }

                this.$emit('sub_event',{act:'close_kfs'});

            }
        }
    }
</script>

<style>
    .user_model_dialog .el-dialog{width:400px;}
    .user_model_dialog .item{text-align:center;margin-bottom:20px;}
    .user_model_dialog .item > span{display:inline-block;width:70px;text-align:right;}
    .user_model_dialog .input_group{display:inline-flex;}
    .input_group input{width: 30px;text-align:center;
        border: 1px solid #dcdcdc;
        margin: 0 5px;}
</style>