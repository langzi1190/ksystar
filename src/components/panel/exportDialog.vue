<template>
    <div class="export_dialog">
        <el-dialog
                :title="LANG.EXPORT_TITLE"
                :visible="showDialog=='export'"
                width="400px"
                @close="op(false)"
                center>
            <div style="height:50px;text-align:center;">
                <el-button @click="op(true)">{{LANG.BTN_SURE}}</el-button>
                <el-button @click="op(false)">{{LANG.BTN_CANCEL}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props:['showDialog'],
        data(){
            return {
                fileSize:0,
                LANG:this.LANGUAGE[this.globalEvent.language]
            };
        },
        methods:{
            op(b){
                if(b){

                    this.loading=this.$loading({
                        lock: true,
                        text: this.LANG.EXPORT_IN_PROGRESS,
                        spinner: 'el-icon-loading',
                        background: 'rgba(255, 255, 255, 0.5)'
                    });

                    this.fileSize=0;
                    let packetNum=0;
                    let packetId=0;
                    let fileData=[];
                    let that=this;
                    let readFile=function () {
                        if(packetId>=packetNum){

                            let len = fileData.length;
                            let buffer = new ArrayBuffer(len);
                            let arr = new Uint8Array(buffer);

                            for (let i = 0;i<len;i++){
                                arr[i] = fileData[i];
                            }
                            //组装
                            let b=new Blob([arr]);
                            let aEle = document.createElement("a");
                            aEle.download="配置文件.bin";
                            aEle.href=window.URL.createObjectURL(b);
                            aEle.click();

                            that.loading.close();
                            window.URL.revokeObjectURL(b);
                            return ;
                        }

                        that.loading.setText(that.LANG.EXPORT_IN_PROGRESS+" ..."+ Math.floor(packetId/packetNum*100)+'%');

                        let d={
                            opr:0xff,
                            packetId
                        };
                        that.$http.post("cfgExport.cgi",d,(ret)=>{
                            let data=ret.data.dataArr;
                            // fileData.push(data.flat());
                            data.forEach((v,i,arr)=>{
                                fileData.push(v);
                            })
                            packetId++;
                            readFile();
                        });
                    }

                    this.$http.post("cfgExport.cgi",{opr:0},(ret)=>{
                        packetNum=ret.data.packetNum;
                        this.fileSize=ret.data.fileSize;
                        readFile();
                    });
                }

                this.$emit('sub_event',{act:'close_kfs'});
            }
        }
    }
</script>