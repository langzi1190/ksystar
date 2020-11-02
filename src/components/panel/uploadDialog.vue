<template>
    <div class="upload_dialog">
        <el-dialog :title="titleList[showDialog]"
                   width="750px"
                   :visible="showDialog!=''"
                   @close="op(false)">
            <div class="s_body">
                <div class="item">
                    <div class="item_tip">
                        <label><input v-model="cardTypeArr" value=0 type="checkbox"/>输入板卡FPGA升级</label>
                        <input type="file" ref="file0" :disabled="cardType!=0"/>
                    </div>
                    <div class="item_body">

                        <label
                                v-for="n in inCardCount"
                        ><input :value="n" :disabled="cardType!=0" v-model="port0" type="checkbox"/>卡{{n}}
                        </label>
                        <!--<label><input type="checkbox"/>卡2</label>-->
                        <!--<label><input type="checkbox"/>卡3</label>-->
                        <!--<label><input type="checkbox"/>卡4</label>-->
                        <!--<label><input type="checkbox"/>卡1</label>-->
                        <!--<label><input type="checkbox"/>卡2</label>-->
                        <!--<label><input type="checkbox"/>卡3</label>-->
                        <!--<label><input type="checkbox"/>卡4</label>-->

                    </div>
                </div>
                <div class="item">
                    <div class="item_tip">
                        <label><input v-model="cardTypeArr" value=1 type="checkbox"/>输出板卡FPGA升级</label>
                        <input type="file" ref="file1" :disabled="cardType!=1"/>
                    </div>
                    <div class="item_body">
                        <label
                                v-for="n in outCardCount"
                        ><input :value="n" :disabled="cardType!=1" v-model="port1" type="checkbox"/>卡{{n}}
                        </label>
                        <!--<label><input type="checkbox"/>卡1</label>-->
                        <!--<label><input type="checkbox"/>卡2</label>-->
                        <!--<label><input type="checkbox"/>卡3</label>-->
                        <!--<label><input type="checkbox"/>卡4</label>-->
                    </div>
                </div>
                <div class="item">
                    <div class="item_tip">
                        <label><input v-model="cardTypeArr" value=2 type="checkbox"/>监视板卡FPGA升级</label>
                        <input type="file" ref="file2" :disabled="cardType!=2"/>
                    </div>
                </div>
                <div class="item">
                    <div class="item_tip">
                        <label><input v-model="cardTypeArr" value=3 type="checkbox"/>同步板卡FPGA升级</label>
                        <input type="file" ref="file3" :disabled="cardType!=3"/>
                    </div>
                </div>

                <div style="text-align:center;">
                    <el-button size="mini" @click="op(true)">确定</el-button>
                    <el-button size="mini" @click="op(false)">取消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props:['showDialog'],
        data(){
            return {
                titleList:{
                    '':'',
                    'fpga':'FPGA升级',
                    'arm':'ARM升级'
                },
                inCardCount:this.globalEvent.inputCardList.length,
                outCardCount:0,
                cardType:-1,//0输入，1输出，2监视，3同步
                cardTypeArr:[],
                port0:[],
                port1:[],

            };
        },
        mounted(){

            // setTimeout(()=>{this.initEvent()},300);

            this.$http.get("syncOutputInfoRd.cgi",{},(ret)=>{
                // this.syncOutputInfoRd(ret.data);
                this.outCardCount=ret.data.outCardNum;
            });
        },
        watch:{
            cardTypeArr(v,ov){
                if(v.length>1){
                    this.cardType=v[v.length-1];
                    this.$nextTick(()=>{
                        this.cardTypeArr=[this.cardType];
                    });
                }
                else if(v.length==1){
                    this.cardType=v[0];
                }
                else{
                    this.cardType=-1;
                }
            },
            cardType(v,ov){
                if(v==-1){
                    this.port0=[];
                    this.port1=[];
                }
                else if(v==0){
                    this.port1=[];
                    this.port0=Array.from({length:this.inCardCount},v=>1).map((v,k)=>v+k);
                }
                else if(v==1){
                    this.port0=[];
                    this.port1=Array.from({length:this.outCardCount},v=>1).map((v,k)=>v+k);
                }
            }
        },
        methods:{
            initEvent(){
                let that=this;
                let input=document.getElementById('file');
                let uploadBtn=document.getElementById('upload_btn')
                input.addEventListener('change',(e)=>{
                    this.tip=input.files[0].name;
                })
                uploadBtn.addEventListener("click",()=>{
                    let file=input.files[0];
                    let totalSize=file.size;
                    let fragment=1024*1024;
                    let fragmentCount= Math.ceil(totalSize / fragment);

                    let upload=function(i){
                        console.log(i,fragmentCount);
                        if(i>=fragmentCount-1){
                            alert("已更新");
                            that.op(false)
                            return ;
                        }
                        let start = i * fragment,
                            end = Math.min(totalSize, start + fragment);
                        let form = new FormData();
                        form.append("data", file.slice(start,end));  //slice方法用于切出文件的一部分

                        upload(i+1)
                        // this.$http.post("",form,()=>{
                        //     upload(i+1);
                        // });
                    };

                    upload(0);

                })
            },
            op(act){
                if(act){
                    if(this.cardType==-1){
                        alert("未选中任何板卡");
                    }else if(this.cardType==0 && this.port0.length==0){
                        alert("未选中输入卡");
                    }
                    else if(this.cardType==1 && this.port1.length==0){
                        alert("未选中输出卡");
                    }
                    else{
                        console.log(this.cardType);
                        console.log(this.port0);
                    }
                }
                else{
                    this.$emit('sub_event',{act:'close_upload'});
                }

            }
        }
    }
</script>

<style>
    .upload_dialog{text-align: center;}
    .upload_dialog .item{text-align:left;margin-bottom:20px;}
    .upload_dialog .item_tip{color:#333;font-size:16px;position:relative;}
    .upload_dialog .item_body{margin-top:20px;}
    .upload_dialog .item_body label{margin-left:25px;}
    .upload_dialog label input{margin-right:10px;}
    .upload_dialog input[type='file']{position:absolute;right:0;top:0;}
    /*.upload_area{width:100px;height:100px;padding:10px;text-align:center;cursor:pointer;margin:10px auto;position:relative;border:1px solid #dcdcdc;}*/
    /*.upload_area input{opacity: 0;z-index:1;position:absolute;top:0;left:0;width:100%;height:100%;cursor:pointer;}*/
    /*.upload_dialog button{margin:10px auto;}*/
</style>