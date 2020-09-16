<template>
    <div class="kfs_dialog">
        <el-dialog title="KFS设置" :visible="showDialog=='kfs'" @close="op(false)">
            <div class="top_part">
                <div>信号源帧同步使能 : </div>
                <div class="label_group">
                    <label><input v-model="syncEnable" value=1 type="radio"/>开启</label>
                    <label><input v-model="syncEnable" value=0 type="radio"/>关闭</label>
                </div>
            </div>
            <div class="dialog_body">
                <div class="left_body">
                    <el-tree :data="signalList" show-checkbox :props="paramMap" :render-content="renderContent" @check-change="handleCheckClick"></el-tree>
                </div>
                <div class="right_body">
                    <div>同步基准源：</div>
                    <el-select v-model="syncSignal" placeholder="同步基准源" size="mini">
                        <el-option
                                v-for="item in signalListFlat"
                                :key="item"
                                :label="item"
                                :value="item"
                        ></el-option>
                    </el-select>

                    <div class="button_group_bottom">
                        <el-button size="mini" @click="op(true)">确定</el-button>
                        <el-button size="mini" @click="op(false)">取消</el-button>
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
                syncEnable:0,
                signalList:[],
                signalListFlat:[],
                paramMap:{
                    children: 'srcArr',
                },
                // selectedSignal:{},
                syncSignal:'',//被选中的信号 label_extra
            }
        },
        methods:{
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
                console.log(data, checked, indeterminate);
            },
            op(act){
                if(act){
                    console.log(this.syncSignal);
                    //修改 globalEvent
                }
                else{
                    this.$emit('sub_event',{act:'close_kfs'})
                }

            }
        },
        watch:{
            showDialog(v,ov){
                if(v=='kfs' && this.signalList.length==0){
                    this.signalList=this.globalEvent.inputCardList;
                    for(let i in this.signalList){
                        for(let k in this.signalList[i].srcArr)
                            this.signalListFlat.push(this.signalList[i].srcArr[k].label_extra);
                    }
                }
            }
        }
    }
</script>

<style>
    .kfs_dialog .el-dialog{width:400px;}
    .kfs_dialog .el-dialog__body{background-color:#f3f2f0;}
    .label_group label{width:100px;display:inline-block;text-align:center;cursor:pointer;}
    .label_group input{margin-top:0;vertical-align: middle;}
    .top_part{display:flex;}
    .dialog_body{display:flex;margin-top:20px;}
    .right_body{    padding-top: 10px;padding-left: 20px;position:relative;}
    .left_body{width:180px;background-color:#fff;border:1px solid #dcdcdc;height:400px;max-height:400px;overflow:auto;}
    .button_group_bottom{position:absolute;bottom:0;left:100px;text-align:right;}
    .button_group_bottom button{margin-top:10px;}
    .right_body .el-select--mini{width:120px;margin-top:15px;}
</style>