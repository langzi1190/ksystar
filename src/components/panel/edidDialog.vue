<template>
    <div class="edid_dialog">
        <el-dialog title="自定义EDID设置" :visible="showDialog=='edid' || showDialog=='edidSingle'" @close="op('cancel')">
            <div>
                <div class="item">
                    <span>设备号：</span>
                    <el-input v-model="devNo" size="mini"></el-input>
                </div>
                <div class="item">
                    <span>宽度：</span>
                    <el-input-number  v-model="width" size="mini"></el-input-number>
                </div>
                <div class="item">
                    <span>高度：</span>
                    <el-input-number  v-model="height" size="mini"></el-input-number>
                </div>
                <div class="item">
                    <span>帧率：</span>
                    <el-input size="mini" v-model="frame"></el-input>
                </div>
                <div class="item">
                    <span></span>
                    <el-button @click="op('showAdvanced')" size="mini">高级</el-button>
                </div>
                <div class="item">
                    <el-button size="mini" @click="op('sure')">确定</el-button>
                    <el-button size="mini" @click="op('cancel')">取消</el-button>
                </div>
            </div>


            <!--<div style="background-color: #dcdcdc;border-radius: 5px;padding: 10px;" v-show="isChoose>0">-->
                <!--<div class="item" style="display:flex;justify-content: space-around">-->
                    <!--<el-button @click="op('rename')" size="mini">更改名称</el-button>-->
                    <!--<el-button @click="op('hotBackup')" size="mini">热备份</el-button>-->
                    <!--<el-button @click="op('vga')" v-if="globalEvent.selectedCard.portType==3" size="mini">VGA校正</el-button>-->
                <!--</div>-->
                <!--<div class="item" style="display: flex" v-show="advanceType.includes(curPortType)">-->
                    <!--<el-button @click="op('workMode')" size="mini">工作模式</el-button>-->
                    <!--<el-button @click="op('showAdvanced')" size="mini">设置EDID</el-button>-->
                    <!--<el-button @click="op('setEq')" size="mini">EQ值设置</el-button>-->
                    <!--<el-button @click="op('rdEdid')" size="mini">回读EDID</el-button>-->

                <!--</div>-->
            <!--</div>-->

        </el-dialog>
    </div>
</template>

<script>
    export default {
        props:['showDialog'],
        data(){

            let isChoose=Object.keys(this.globalEvent.selectedCard).length;
            return {
                devNo:0,
                width:3840,
                height:2160,
                frame:60,
                isChoose:isChoose,
                curPortType:isChoose==0?-1:this.globalEvent.selectedCard.portType,
                advanceType:[16,18]
            };
        },
        methods:{
            op(act){
                if(act=='cancel'){
                    this.$emit('sub_event',{act:'close_kfs'});
                }
                else if(act=='sure'){
                    this.$emit('sub_event',{act:'sure_edid',devId:this.devNo,w:this.width,h:this.height,f:this.frame});
                }
                else if(act=='showAdvanced'){
                    this.$emit('sub_event',{act:'show_edid_advanced',info:{devId:this.devNo,w:this.width,h:this.height,f:this.frame}})
                }
                // else if(act=='rename'){
                //     let s=prompt("新输入新名称",this.globalEvent.selectedCard.label_extra);
                //     if(s!==null && s!==undefined){
                //         this.globalEvent.selectedCard.label_extra=s;
                //         this.globalEvent.syncLocalName('sourceCardName',this.globalEvent.inputCardList);
                //     }
                // }
                // else if(act=='hotBackup'){
                //     this.$emit('sub_event',{act:"hot_backup"});
                // }
                // else if(act=='workMode'){
                //     this.$emit('sub_event',{act:'work_mode'});
                // }
                // else if(act=='setEq'){
                //     this.$emit('sub_event',{act:'eq'});
                // }
                // else if(act=='vga'){
                //     this.$emit('sub_event',{act:'vga'});
                // }
            }
        }
    }
</script>

<style>
    .edid_dialog .el-dialog{width:450px;}
    .edid_dialog .item{text-align:center;margin-bottom:20px;}
    .edid_dialog .item > span{display:inline-block;width:70px;text-align:right;}
    .edid_dialog .el-input{width:130px;}
    .edid_dialog .el-button--mini{width:130px;}
</style>