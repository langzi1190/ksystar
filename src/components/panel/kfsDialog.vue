<template>
    <div class="kfs_dialog">
        <el-dialog  v-dialogDrag  :title="LANG.KFS_TITLE" :visible="showDialog=='kfs'" @close="op(false)">
            <div class="top_part">
                <div v-html="LANG.KFS_SOURCE_SYNC"></div>
                <div class="label_group">
                    <label><input v-model="syncEnable" value=1 type="radio"/>{{LANG.KFS_ON}}</label>
                    <label><input v-model="syncEnable" value=0 type="radio"/>{{LANG.KFS_OFF}}</label>
                </div>
            </div>
            <div class="dialog_body">
                <div class="left_body">
                    <el-tree :data="signalList"
                             v-if="showTree"
                             :default-checked-keys="selectedKey"
                             show-checkbox
                             node-key="id"
                             :props="paramMap"
                             :render-content="renderContent"
                             :default-expand-all="true"
                             @check-change="handleCheckClick">

                    </el-tree>
                </div>
                <div class="right_body">
                    <div v-html="LANG.KFS_SYNC"></div>
                    <el-select v-model="syncSignal" size="mini">
                        <el-option
                                v-for="(item,index) in signalListFlat"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>

                    <div class="button_group_bottom">
                        <el-button size="mini" @click="op(true)">{{LANG.BTN_SURE}}</el-button>
                        <el-button size="mini" @click="op(false)">{{LANG.BTN_CANCEL}}</el-button>
                    </div>

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
                syncEnable:this.globalEvent.commonInfo.fSyncInfo.fSyncFuncSta,
                signalList:[],
                signalListFlat:[],
                selectedSignal:[],//选中的信号
                selectedKey:[],
                paramMap:{
                    children: 'srcArr',
                },
                showTree:false,
                syncSignal:'',//被选中的信号 label_extra
                LANG:this.LANGUAGE[this.globalEvent.language]
            }
        },
        mounted(){

            this.signalList=this.globalEvent.inputCardList;

            for(let i in this.signalList){
                for(let k in this.signalList[i].srcArr){
                    this.signalListFlat.push({
                        label:this.globalEvent.signalCardName(i,k),
                        value:this.globalEvent.signalCardInfo(i,k)
                    });
                }
            }

            let cardArr=this.globalEvent.commonInfo.fSyncInfo.fSyncArr;

            for(let i in cardArr){
                for(let k in cardArr[i].srcPropArr){
                    let src=cardArr[i].srcPropArr[k];

                    this.syncSignal=this.globalEvent.signalCardInfo(src.syncCardId,src.syncSrcId);//'S'+(src.syncCardId+1)+"_"+(src.syncSrcId+1);
                    if(src.syncSta==1){
                        this.selectedKey.push(this.signalList[i].srcArr[k].id);

                        this.selectedSignal.push({
                            label:this.globalEvent.signalCardName(i,k),
                            value:this.globalEvent.signalCardInfo(i,k),
                        });
                    }
                }
            }


            this.showTree=true;
        },
        methods:{
            reloadTree(){
                //读入 kfs
                this.showTree=false;
                let cardArr=this.globalEvent.commonInfo.fSyncInfo.fSyncArr;
                for(let i in cardArr){
                    for(let k in cardArr[i].srcPropArr){
                        let src=cardArr[i].srcPropArr[k];

                        this.syncSignal=this.globalEvent.signalCardInfo(src.syncCardId,src.syncSrcId);//'S'+(src.syncCardId+1)+"_"+(src.syncSrcId+1);
                        if(src.syncEn==1){
                            // this.signalListFlat.push({
                            //     label:this.globalEvent.signalCardName(i,k),
                            //     value:this.globalEvent.signalCardInfo(i,k)
                            // });
                            this.selectedKey.push(this.signalList[i].srcArr[k].id);
                        }

                        this.signalListFlat.push({
                            label:this.globalEvent.signalCardName(i,k),
                            value:this.globalEvent.signalCardInfo(i,k)
                        });
                    }
                }

                this.showTree=true;
            },
            renderContent(h,{node,data,store}){
                if(node.level==1){

                    return h('span',data.label)
                }
                else if(node.level==2){
                    return  h('span',{
                        attrs:{
                            class:'card_label'
                        }
                    },data.label_extra)
                }
            },
            handleCheckClick(data, checked, indeterminate){
                // console.log(data, checked, indeterminate);

                if(data.label_extra===undefined){

                }
                else{
                    //信号源
                    if(checked){
                        this.selectedSignal.push({
                            label:data.label_extra,
                            value:data.label_info
                        });
                    }
                    else{
                        this.delSourceId([data])
                    }
                }

            },
            delSourceId(srcArr){

                let sk=[];

                for(let k in this.selectedSignal){
                    for(let i in srcArr){
                        if(this.selectedSignal[k].label==srcArr[i].label_extra){
                            sk.push(k);
                            break;
                        }
                    }
                }

                for(let i in sk){
                    this.selectedSignal.splice(sk[i]-i,1);
                }
            },
            op(act){
                if(act){
                    if(this.syncSignal==''){
                        // alert("未选择同步基准源");
                        // return ;
                        this.syncSignal='1_1';
                    }

                    let param={
                        inCardNum:this.signalList.length,
                        funcSta:parseInt(this.syncEnable),//同步到 commonInfo
                        inCardArr:[]
                    };


                    let s=this.syncSignal.split("_");
                    let syncCardId=s[0]-0;
                    let syncSrcId=s[1]-0;


                    for(let i in this.signalList){
                        let inCard={
                            chnArr:[]
                        };
                        for(let k in this.signalList[i].srcArr){
                            let src=this.signalList[i].srcArr[k].label_info;
                            // let inCardChn={
                            //     syncEn:0,
                            //     syncCardId:syncCardId,
                            //     syncSrcId:syncSrcId
                            // };
                            let inCardChn=[0,syncCardId,syncSrcId];
                            for(let t in this.selectedSignal){
                                if(this.selectedSignal[t].value==src){
                                    // inCardChn.syncEn=1;
                                    inCardChn[0]=1;
                                    break;
                                }
                            }

                            inCard.chnArr.push(inCardChn);
                        }
                        inCard.srcNum=inCard.chnArr.length;
                        param.inCardArr.push(inCard);
                    }


                    this.$http.post("KfsWr.cgi",param,(ret)=>{
                        let fSyncInfo=this.globalEvent.commonInfo.fSyncInfo;
                        fSyncInfo.fSyncFuncSta=param.funcSta;
                        fSyncInfo.fSyncArr=[];
                        for(let i in param.inCardArr){
                            let fSync={
                                srcPropArr:[]
                            };
                            for(let k in param.inCardArr[i].chnArr){
                                // fSyncInfo.fSyncArr[i].scrPropArr[k].syncEn=param.inCardArr[i].chnArr[k].syncEn;
                                // fSyncInfo.fSyncArr[i].scrPropArr[k].syncCardId=param.inCardArr[i].chnArr[k].syncCardId;
                                // fSyncInfo.fSyncArr[i].scrPropArr[k].syncSrcId=param.inCardArr[i].chnArr[k].syncSrcId;
                                fSync.srcPropArr.push({
                                    syncSta:param.inCardArr[i].chnArr[k][0],//param.inCardArr[i].chnArr[k].syncEn,
                                    syncCardId:param.inCardArr[i].chnArr[k][1],//param.inCardArr[i].chnArr[k].syncCardId,
                                    syncSrcId:param.inCardArr[i].chnArr[k][2]//param.inCardArr[i].chnArr[k].syncSrcId
                                });
                            }

                            fSyncInfo.fSyncArr.push(fSync);
                        }

                        this.$emit('sub_event',{act:'sure_kfs'})
                    });


                }
                else{
                    this.$emit('sub_event',{act:'close_kfs'})
                }


            }
        },
        // watch:{
        //     showDialog(v,ov){
        //         if(v=='kfs' && this.signalList.length==0){
        //             this.signalList=this.globalEvent.inputCardList;
        //             for(let i in this.signalList){
        //                 for(let k in this.signalList[i].srcArr)
        //                     this.signalListFlat.push(this.signalList[i].srcArr[k].label_extra);
        //             }
        //         }
        //     }
        // }
    }
</script>

<style>
    .kfs_dialog .el-dialog{width:400px;}
    .kfs_dialog .el-dialog__body{background-color:#f3f2f0;}
    .label_group label{width:100px;display:inline-block;text-align:center;cursor:pointer;}
    .label_group input{margin-top:0;vertical-align: middle;}
    .top_part{display:flex;}
    .dialog_body{display:flex;margin-top:20px;}
    .right_body{padding-top: 10px;padding-left: 20px;position:relative;}
    .left_body{width:180px;background-color:#fff;border:1px solid #dcdcdc;height:400px;max-height:400px;overflow:auto;}
    .button_group_bottom{position:absolute;bottom:0;left:100px;text-align:right;}
    .button_group_bottom button{margin-top:10px;}
    .right_body .el-select--mini{width:120px;margin-top:15px;}
    .kfs_dialog .el-checkbox{display:none;}
    .kfs_dialog .is-leaf + .el-checkbox{display:inline-block;}
</style>