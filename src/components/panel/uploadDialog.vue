<template>
    <div class="upload_dialog">
        <el-dialog :title="titleList[showDialog]"
                   width="750px"
                   :visible="showDialog!=''"
                   @close="op(false)">
            <div class="s_body">
                <div class="item">
                    <div class="item_tip">
                        <label><input v-model="cardTypeArr" value=1 type="checkbox"/>输入板卡FPGA升级</label>
                        <input type="file" ref="file1" :disabled="cardType!=1"/>
                    </div>
                    <div class="item_body">

                        <label
                                v-for="n in inCardCount"
                        ><input :value="n" :disabled="cardType!=1" v-model="port0" type="checkbox"/>卡{{n}}
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
                        <label><input v-model="cardTypeArr" value=2 type="checkbox"/>输出板卡FPGA升级</label>
                        <input type="file" ref="file2" :disabled="cardType!=2"/>
                    </div>
                    <div class="item_body">
                        <label
                                v-for="n in outCardCount"
                        ><input :value="n" :disabled="cardType!=2" v-model="port1" type="checkbox"/>卡{{n}}
                        </label>
                        <!--<label><input type="checkbox"/>卡1</label>-->
                        <!--<label><input type="checkbox"/>卡2</label>-->
                        <!--<label><input type="checkbox"/>卡3</label>-->
                        <!--<label><input type="checkbox"/>卡4</label>-->
                    </div>
                </div>
                <div class="item">
                    <div class="item_tip">
                        <label><input v-model="cardTypeArr" value=3 type="checkbox"/>监视板卡FPGA升级</label>
                        <input type="file" ref="file3" :disabled="cardType!=3"/>
                    </div>
                </div>
                <div class="item">
                    <div class="item_tip">
                        <label><input v-model="cardTypeArr" value=4 type="checkbox"/>同步板卡FPGA升级</label>
                        <input type="file" ref="file4" :disabled="cardType!=4"/>
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
                cardType:-1,//0 控制版，1输入，2输出，3监视，4同步
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
                else if(v==1){
                    this.port1=[];
                    this.port0=Array.from({length:this.inCardCount},v=>1).map((v,k)=>v+k);
                }
                else if(v==2){
                    this.port0=[];
                    this.port1=Array.from({length:this.outCardCount},v=>1).map((v,k)=>v+k);
                }
            }
        },
        methods:{
            // upload(){
            //     let that=this;
            //     let input=this.$refs['file'+this.cardType];
            //     if(input.files.length==0){
            //         alert("尚未选择文件");
            //         return ;
            //     }
            //
            //     let file=input.files[0];
            //     let totalSize=file.size;
            //     let fragment=1024*1024;
            //     let fragmentCount= Math.ceil(totalSize / fragment);
            //
            //     let reader=new FileReader();
            //     reader.readAsArrayBuffer(file);
            //     reader.onload=function(){
            //         console.log(reader.result);
            //         let buffer=reader.result;
            //         let hexBuffer=Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
            //         console.log(hexBuffer);
            //     };
            //
            //     let uploadFile=function(i){
            //         if(i>=fragmentCount){
            //             alert("已更新");
            //             that.op(false)
            //             return ;
            //         }
            //         let start = i * fragment,
            //             end = Math.min(totalSize, start + fragment);
            //         let boardStaArr=[];
            //         console.log(that.port0);
            //         if(that.cardType==1 ){
            //             boardStaArr=Array.from({length:that.inCardCount},v=>1).map((v,k)=>{
            //                 console.log('k'+k);
            //                 if(that.port0.includes(k+1))
            //                     return 1;
            //                 else
            //                     return 0;
            //             });
            //         }
            //         else if(that.cardType==2){
            //             boardStaArr=Array.from({length:that.outCardCount},v=>1).map((v,k)=>{
            //                 if(that.port1.includes(k+1))
            //                     return 1;
            //                 else
            //                     return 0;
            //             });
            //         }
            //
            //         console.log(boardStaArr);
            //         //写入
            //         let form = new FormData();
            //         form.append("data", file.slice(start,end));  //slice方法用于切出文件的一部分
            //         form.append("chip",1);
            //         form.append("opr",3);
            //         form.append("board",that.cardType)
            //         form.append('fileSize',totalSize);
            //         form.append("boardStaArr",boardStaArr);
            //         console.log(form.get("data"));
            //         that.$http.post("",form,()=>{
            //             uploadFile(i+1);
            //         });
            //     };
            //
            //     uploadFile(0);
            // },
            getBoardArr(){
                let that=this;
                let boardStaArr=[];
                if(that.cardType==1 ){
                    boardStaArr=Array.from({length:that.inCardCount},v=>1).map((v,k)=>{
                        if(that.port0.includes(k+1))
                            return 1;
                        else
                            return 0;
                    });
                }
                else if(that.cardType==2){
                    boardStaArr=Array.from({length:that.outCardCount},v=>1).map((v,k)=>{
                        if(that.port1.includes(k+1))
                            return 1;
                        else
                            return 0;
                    });
                }

                return boardStaArr;
            },
            upload(){
                let that=this;
                let input=this.$refs['file'+this.cardType];
                if(input.files.length==0){
                    alert("尚未选择文件");
                    return ;
                }

                let file=input.files[0];
                let totalSize=0;
                let fragment=512;
                let fragmentCount=0;

                let curPacketId=0;
                let reader=new FileReader();
                let hexBuffer=[];
                reader.readAsArrayBuffer(file);
                reader.onload=function(){

                    let buffer=reader.result;
                    hexBuffer=Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2));
                    // console.log(hexBuffer);
                    totalSize=hexBuffer.length;
                    // console.log(totalSize,file.size);
                    fragmentCount=Math.ceil(totalSize/fragment);
                    uploadFile(curPacketId);

                };

                // let t_Count=1;

                let uploadFile=function(){
                    let i = curPacketId;
                    if(i>=fragmentCount){
                        // alert("已更新");
                        that.loading.close();
                        that.op(false)
                        return ;
                    }
                    let start = i * fragment,
                        end = Math.min(totalSize, start + fragment);


                    let d={
                        chip:1,
                        opr:3,
                        board:that.cardType-0,
                        packetNum:fragmentCount,
                        packetId:i,
                        dataArr:hexBuffer.slice(start,end).map((v,k)=>Number('0x'+v))
                    };


                    that.loading.setText("升级中 ..."+ Math.floor(i/fragmentCount)*100+'%');


                    // let t_String=[];
                    // let t_len=d.dataArr.length;
                    //
                    // for(let t=0 ;t < t_len; t=t+2){
                    //     if(t>0 && t%16==0){
                    //         console.log({
                    //             [t_Count]:t_String.join(" ")
                    //         });
                    //         t_Count++;
                    //         t_String=[];
                    //     }
                    //
                    //     t_String.push(('00'+(d.dataArr[t]).toString(16)).slice(-2)+''+('00'+(d.dataArr[t+1]).toString(16)).slice(-2));
                    //
                    // }

                    that.$http.post("firmwareUpdate.cgi",d,(ret)=>{
                        if(ret.data.result==0){
                            //未正确接收
                            alert("下发数据未正确接收");
                            console.log("下发数据未正确接收:",d.packetId,d.packetNum);
                        }
                        else{
                            curPacketId++;
                        }
                        uploadFile();
                    });
                };

            },
            erase(){
                //先擦除
                let input=this.$refs['file'+this.cardType];
                let file=input.files[0];
                let totalSize=file.size;
                let param={
                    chip:1,
                    board:this.cardType-0,
                    opr:2,
                    fileSize:totalSize,
                    boardStaArr:this.getBoardArr()
                };
                this.$http.post("firmwareUpdate.cgi",param,(ret)=>{
                    if(ret.data.result==0){
                        this.loading.close();
                        alert("擦除数据失败");
                    }
                    else{
                        this.upload();
                    }
                });
            },
            op(act){
                if(act){
                    if(this.cardType==-1){
                        alert("未选中任何板卡");
                    }else if(this.cardType==1 && this.port0.length==0){
                        alert("未选中输入卡");
                    }
                    else if(this.cardType==2 && this.port1.length==0){
                        alert("未选中输出卡");
                    }
                    else{

                        this.loading=this.$loading({
                            lock: true,
                            text: '升级中',
                            spinner: 'el-icon-loading',
                            background: 'rgba(255, 255, 255, 0.5)'
                        });
                        this.erase();

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