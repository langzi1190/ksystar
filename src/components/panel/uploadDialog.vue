<template>
    <div class="upload_dialog">
        <el-dialog :title="title"
                   v-dialogDrag
                   width="750px"
                   :visible="showDialog!=''"
                   @close="op(false)">
            <div class="s_body">
                <div class="item">
                    <div class="item_tip">
                        <label><input v-model="cardTypeArr" value=1 type="checkbox"/>{{LANG.FPGA_INPUT}}</label>
                        <input type="file" ref="file1" :disabled="cardType!=1"/>
                    </div>
                    <div class="item_body">
                        <div class="btn-group">
                            <el-button @click="selectOp('all',1)" :disabled="cardType!=1"  size="mini">{{LANG.BTN_ALL}}</el-button>
                            <el-button @click="selectOp('invert',1)" :disabled="cardType!=1"  size="mini">{{LANG.BTN_INVERSE}}</el-button>
                        </div>

                        <label
                                v-for="n in inCardCount"
                        ><input :value="n" :disabled="cardType!=1" v-model="port0" type="checkbox"/>{{LANG.FPGA_CARD}}{{n}}
                        </label>

                    </div>
                </div>
                <div class="item">
                    <div class="item_tip">
                        <label><input v-model="cardTypeArr" value=2 type="checkbox"/>{{LANG.FPGA_OUTPUT}}</label>
                        <input type="file" ref="file2" :disabled="cardType!=2"/>
                    </div>
                    <div class="item_body">

                        <div class="btn-group" style="margin-bottom:5px;">
                            <el-button @click="selectOp('all',2)" :disabled="cardType!=2" size="mini">{{LANG.BTN_ALL}}</el-button>
                            <el-button @click="selectOp('invert',2)" :disabled="cardType!=2" size="mini">{{LANG.BTN_INVERSE}}</el-button>
                        </div>

                        <label
                                v-for="n in outCardCount"
                        ><input :value="n" :disabled="cardType!=2" v-model="port1" type="checkbox"/>{{LANG.FPGA_CARD}}{{n}}
                        </label>
                    </div>
                </div>
                <div class="item">
                    <div class="item_tip">
                        <label><input v-model="cardTypeArr" value=3 type="checkbox"/>{{LANG.FPGA_MONITOR}}</label>
                        <input type="file" ref="file3" :disabled="cardType!=3"/>
                    </div>
                </div>
                <div class="item">
                    <div class="item_tip">
                        <label><input v-model="cardTypeArr" value=4 type="checkbox"/>{{LANG.FPGA_SYNC}}</label>
                        <input type="file" ref="file4" :disabled="cardType!=4"/>
                    </div>
                </div>

                <div style="text-align:center;">
                    <el-button size="mini" @click="op(true)">{{LANG.BTN_SURE}}</el-button>
                    <el-button size="mini" @click="op(false)">{{LANG.BTN_CANCEL}}</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props:['showDialog'],
        data(){
            let LANG=this.LANGUAGE[this.globalEvent.language];
            return {
                title:LANG.FPGA_TITLE,
                inCardCount:this.globalEvent.inputCardList.length,
                outCardCount:0,
                cardType:-1,//0 控制版，1输入，2输出，3监视，4同步
                cardTypeArr:[],
                port0:[],
                port1:[],
                cardTip:LANG.FPGA_CARD,
                LANG:LANG
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
                    this.port0=[];//Array.from({length:this.inCardCount},v=>1).map((v,k)=>v+k);
                }
                else if(v==2){
                    this.port0=[];
                    this.port1=[];//Array.from({length:this.outCardCount},v=>1).map((v,k)=>v+k);
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
            selectOp(act,cardType){
                if(act=='all'){
                    if(cardType==1){
                        //全选
                        this.port0=Array.from({length:this.inCardCount},v=>1).map((v,k)=>v+k);
                    }
                    else if(cardType==2){
                        this.port1=Array.from({length:this.outCardCount},v=>1).map((v,k)=>v+k);
                    }
                }
                else if(act=='invert'){
                    let arr=[];
                    if(cardType==1){
                        for(let k=1 ;k<=this.inCardCount;k++){
                            if(!this.port0.includes(k)){
                                arr.push(k);
                            }
                        }
                        this.port0=arr;
                    }
                    else if(cardType==2){
                        for(let k=1 ;k<=this.outCardCount;k++){
                            if(!this.port1.includes(k)){
                                arr.push(k);
                            }
                        }
                        this.port1=arr;
                    }
                }
            },
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
            CRC8(pBuffer){
                let crc = 0;
                let start=0;
                let total=pBuffer.length;

                if (total <= 0)
                {
                    return crc;
                }

                while(start < total)
                {
                    crc ^= pBuffer[start];
                    for (let i=0; i<8; i++)
                    {
                        if (crc & 0x80)
                        {
                            crc = (crc<<1)^0x07;
                        }
                        else
                        {
                            crc <<= 1;
                        }
                    }
                    crc &=0xff;
                    start++;
                }
                return crc;
            },
            upload(){
                let that=this;
                let input=this.$refs['file'+this.cardType];
                if(input.files.length==0){
                    this.$message.error(this.LANG.ALERT_NO_FILE_CHOOSE);
                    return ;
                }

                let file=input.files[0];
                let totalSize=0;
                let fragment=1024;
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
                        dataCRC:0,
                        dataArr:hexBuffer.slice(start,end).map((v,k)=>Number('0x'+v))
                    };


                    d.dataCRC=that.CRC8(d.dataArr);

                    that.loading.setText(that.LANG.TIP_UPGRADE_NOW+" ..."+ Math.floor(i/fragmentCount*100)+'%');


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
                            // alert(this.LANG.ALERT_API_ERROR);
                            console.log("校验错误,重传:",d.packetId,d.packetNum);

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
                        this.$message.error("擦除数据失败");
                    }
                    else{
                        this.upload();
                    }
                });
            },
            op(act){
                if(act){
                    if(this.cardType==-1){
                        this.$message.error(this.LANG.ALERT_NO_CARD_CHOOSE);
                    }else if(this.cardType==1 && this.port0.length==0){
                        this.$message.error(this.LANG.ALERT_NO_INPUT_CHOOSE);
                    }
                    else if(this.cardType==2 && this.port1.length==0){
                        this.$message.error(this.LANG.ALERT_NO_OUTPUT_CHOOSE);
                    }
                    else{

                        let input=this.$refs['file'+this.cardType];
                        if(input.files.length==0){
                            this.$message.error(this.LANG.ALERT_NO_FILE_CHOOSE);
                            return ;
                        }

                        this.loading=this.$loading({
                            lock: true,
                            text: this.LANG.TIP_UPGRADE_NOW,
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
    .upload_dialog .item_body label{margin-left:25px;width:80px;display:inline-block;}
    .upload_dialog label input{margin-right:10px;}
    .upload_dialog input[type='file']{position:absolute;right:0;top:0;}
    .upload_dialog .btn-group{margin-bottom:5px;margin-left:5px;}
</style>