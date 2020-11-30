<template>
    <div class="import_dialog">
        <el-dialog :title="LANG.IMPORT_TITLE"
                   width="350px"
                   :visible="showDialog=='import'"
                   @close="op(false)">
            <div class="s_body" style="text-align:center;">
                <div class="upload_area">
                    {{tip}}
                    <input type="file" ref="file"/>
                </div>
                <el-button size="mini" @click="op(true)">{{LANG.IMPORT}}</el-button>
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
                tip:LANG.IMPORT_UPLOAD,
                fileSize:0,
                LANG:LANG
            };
        },
        mounted(){
            setTimeout(()=>{
                let input=this.$refs.file;
                input.addEventListener("change",(e)=>{
                    this.tip=input.files[0].name;
                    this.fileSize=input.files[0].size;
                })
            },1000);

        },
        methods:{
            upload(){
                let that=this;
                let input=this.$refs.file;
                if(input.files.length==0){
                    alert("尚未选择文件");
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
                        opr:1,
                        packetNum:fragmentCount,
                        packetId:i,
                        dataArr:hexBuffer.slice(start,end).map((v,k)=>Number('0x'+v))
                    };


                    that.loading.setText(that.LANG.TIP_UPGRADE_NOW+" ..."+ Math.floor(i/fragmentCount*100)+'%');

                    that.$http.post("cfgImport.cgi",d,(ret)=>{

                        if(ret.data.result==0){
                            //未正确接收
                            alert(this.LANG.ALERT_API_ERROR);
                            console.log("下发数据未正确接收:",d.packetId,d.packetNum);
                        }
                        else{
                            curPacketId++;
                            uploadFile();
                        }
                    });
                };
            },
            op(act){
                if(act){
                    this.$http.post("cfgImport.cgi",{opr:0,fileSize:this.fileSize},(ret)=>{
                        if(ret.data.result==1){
                            this.loading=this.$loading({
                                lock: true,
                                text: this.LANG.TIP_UPGRADE_NOW,
                                spinner: 'el-icon-loading',
                                background: 'rgba(255, 255, 255, 0.5)'
                            });
                            this.upload();
                        }
                        else{
                            alert("数据擦除失败");
                        }
                    });
                }
                else{
                    this.$emit('sub_event',{act:'close_kfs'});
                }
            }
        }
    }
</script>

<style>
    .upload_area{width:100px;height:100px;padding:10px;text-align:center;cursor:pointer;margin:10px auto;position:relative;border:1px solid #dcdcdc;}
    .upload_area input{opacity: 0;z-index:1;position:absolute;top:0;left:0;width:100%;height:100%;cursor:pointer;}
    .import_dialog .s_body button{margin:10px auto;}
</style>