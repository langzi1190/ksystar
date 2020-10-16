<template>
    <div class="vga_dialog">
        <el-dialog title="VGA校正"
                   :visible="showDialog=='vga'"
                   @close="op('cancel')"
                   width="600px"
        >
            <div class="vga_setting">
                <div class="op_left">
                    <el-input-number v-model="l" size="mini"></el-input-number>
                </div>
                <div class="op_middle">
                    <el-input-number v-model="t" size="mini"></el-input-number>
                    <div class="vga_screen">
                        <div class="vga_inner"
                        :style="{
                            top:top+'px',
                            left:left+'px',
                            width:width+'px',
                            height:height+'px',

                        }">
                            VGA
                        </div>

                    </div>
                    <el-input-number  v-model="b" size="mini"></el-input-number>
                </div>
                <div class="op_right">
                    <el-input-number v-model="r" size="mini"></el-input-number>
                </div>
            </div>
            <div style="display:flex;justify-content: space-around;margin-top:20px;">
                <el-button size="mini" @click="op('reset')">重置</el-button>
                <el-button size="mini" @click="op('apply')">应用</el-button>
                <el-button size="mini" @click="op('sure')">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props:['showDialog'],
        data(){

            return {
                w:155,
                h:155,
                ox:30,
                ot:30,

                l:0,
                r:0,
                t:0,
                b:0,
                ratio:10,
            };
        },
        computed:{
            width(){
                return this.w+this.l/this.ratio+this.r/this.ratio;
            },
            height(){
                return this.h+this.t/this.ratio+this.b/this.ratio;
            },
            top(){
                return this.ot-this.t/this.ratio;
            },
            left(){
                return this.ox-this.l/this.ratio;
            }
        },
        methods:{
            op(act){
                let num=this.globalEvent.selectedCard.label_info.split('_');
                if(act=='cancel'){
                    this.$emit('sub_event',{act:'close_kfs'});
                }
                else if(act=='reset'){
                    this.l=this.t=this.r=this.b=0;
                }
                else if(act=='apply'){
                    let param={
                        srcCardId:num[0]-0,
                        srcId:num[1]-0,
                        leftSignFlag:0,//?
                        leftOffset:this.l,
                        rightSignFlag:0,
                        rightOffset:this.r,
                        upSignFlag:0,
                        upOffset:this.t,
                        downSignFlag:0,
                        downOffset:this.b
                    };
                    this.$http.post("VGAParamWr.cgi",param,()=>{});
                }
                else if(act=='sure'){
                    let param={
                        srcCardId:num[0]-0,
                        srcId:num[1]-0,
                    };
                    this.$http.post("saveVGAParam.cgi",param,()=>{});
                    this.$emit('sub_event',{act:'close_kfs'});
                }
            }
        }
    }
</script>

<style>
    .vga_setting{display:flex;}
    .op_left,.op_right{flex-grow:1;align-items: center;text-align:center;display:flex;}
    .op_left{text-align:left;}
    .op_middle{flex-grow:2;text-align: center;}
    .vga_dialog .el-dialog__body{background-color:#f3f2f0;}
    .vga_screen{width: 215px;position:relative;height: 215px;background-color: #fff;margin: 10px auto;}
    .vga_dialog .el-input{width:130px;}
    .vga_dialog .el-button--mini{width:130px;}
    .vga_inner{display:flex;align-items: center;text-align: center;position:absolute;border:10px solid #000;    box-sizing: border-box;
        justify-content: center;
        background: blue;
        color: green;
        font-size: 30px;
        font-weight: bold;}
</style>