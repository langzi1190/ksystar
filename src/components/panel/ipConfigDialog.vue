<template>
    <div class="user_model_dialog">
        <el-dialog title="回显IP设置" :visible="showDialog=='ipConfig'" @close="op(false)">
            <div class="item">
                <span>IP地址：</span>
                <div class="input_group">
                    <input v-model="ipArr[0]" />.<input  v-model="ipArr[1]"/>.<input  v-model="ipArr[2]"/>.<input  v-model="ipArr[3]"/>
                </div>
            </div>
            <div class="item">
                <span>网关Ip：</span>
                <div class="input_group">
                    <input v-model="gateArr[0]" />.<input  v-model="gateArr[1]"/>.<input  v-model="gateArr[2]"/>.<input  v-model="gateArr[3]"/>
                </div>
            </div>
            <div class="item">
                <span>子网掩码：</span>
                <div class="input_group">
                    <input v-model="maskArr[0]" />.<input  v-model="maskArr[1]"/>.<input  v-model="maskArr[2]"/>.<input  v-model="maskArr[3]"/>
                </div>
            </div>
            <div class="item" style="color:#f44f44;">
                注意：更改IP后，需重启设备才能生效
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
                ipArr:[0,0,0,0],
                gateArr:[0,0,0,0],
                maskArr:[255,255,255,0],
            };
        },
        // created(){
        //     this.$http.get("ipCfgRd.cgi",{},(ret)=>{
        //         this.ipArr=ret.data.ipArr;
        //         this.maskArr=ret.data.maskArr;
        //         this.gateArr=ret.data.gateArr;
        //     });
        // },
        watch:{
            showDialog(v,ov){
                if(v=='ipConfig'){
                    this.$http.get("ipCfgRd.cgi",{},(ret)=>{
                        this.ipArr=ret.data.ipArr;
                        this.maskArr=ret.data.maskArr;
                        this.gateArr=ret.data.gateArr;
                    });
                }
            },
            ipArr:{
                deep:true,
                handler(v,ov){
                    for(let i in v){
                        let num=v[i];
                        if(isNaN(num) || num<0){
                            this.delayDet(i,0,'ip');
                        }
                        else if(num>255){
                            this.delayDet(i,255,'ip');
                        }
                    }
                }
            },
            maskArr:{
                deep:true,
                handler(v,ov){
                    for(let i in v){
                        let num=v[i];
                        if(isNaN(num) || num<0){
                            this.delayDet(i,0,'mask');
                        }
                        else if(num>255){
                            this.delayDet(i,255,'mask');
                        }
                    }
                }
            },
            gateArr:{
                deep:true,
                handler(v,ov){
                    for(let i in v){
                        let num=v[i];
                        if(isNaN(num) || num<0){
                            this.delayDet(i,0,'gate');
                        }
                        else if(num>255){
                            this.delayDet(i,255,'gate');
                        }
                    }
                }
            }
        },
        methods:{
            delayDet(i,num,act){
                this.$nextTick(()=>{
                    if('ip'==act)
                        this.$set(this.ipArr,i,num);
                    else if('gate'==act){
                        this.$set(this.gateArr,i,num);
                    }
                    else
                        this.$set(this.maskArr,i,num);
                });
            },
            op(act){
                if(act){
                    let param={
                        ipArr:this.ipArr,
                        getArr:this.getArr,
                        maskArr:this.maskArr
                    };

                    this.$http.post("ipCfgWr.cgi",param,(r)=>{

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