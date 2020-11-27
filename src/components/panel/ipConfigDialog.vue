<template>
    <div class="user_model_dialog">
        <el-dialog :title="LANG.IP_TITLE" :visible="showDialog=='ipConfig'" @close="op(false)">
            <div class="item">
                <span>{{LANG.MONIP_ADDRESS}}</span>
                <div class="input_group">
                    <input v-model="ipArr[0]" />.<input  v-model="ipArr[1]"/>.<input  v-model="ipArr[2]"/>.<input  v-model="ipArr[3]"/>
                </div>
            </div>
            <div class="item">
                <span>{{LANG.IP_GATEWAY}}</span>
                <div class="input_group">
                    <input v-model="gateArr[0]" />.<input  v-model="gateArr[1]"/>.<input  v-model="gateArr[2]"/>.<input  v-model="gateArr[3]"/>
                </div>
            </div>
            <div class="item">
                <span>{{LANG.IP_MASK}}</span>
                <div class="input_group">
                    <input v-model="maskArr[0]" />.<input  v-model="maskArr[1]"/>.<input  v-model="maskArr[2]"/>.<input  v-model="maskArr[3]"/>
                </div>
            </div>
            <div class="item" style="color:#f44f44;word-break:break-word;">
                {{LANG.IP_TIP}}
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
            return {
                ipArr:[0,0,0,0],
                gateArr:[0,0,0,0],
                maskArr:[255,255,255,0],
                LANG:this.LANGUAGE[this.globalEvent.language]
            };
        },
        created(){
            this.$http.get("ipCfgRd.cgi",{},(ret)=>{
                this.ipArr=ret.data.ipArr;
                this.maskArr=ret.data.maskArr;
                this.gateArr=ret.data.gateArr;
            });
        },
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
                        ipArr:this.ipArr.map((v,k)=>parseInt(v)),
                        gateArr:this.gateArr.map((v,k)=>parseInt(v)),
                        maskArr:this.maskArr.map((v,k)=>parseInt(v))
                    };

                    console.log(param);
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