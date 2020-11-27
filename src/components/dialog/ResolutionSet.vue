<template>
    <div>
        <el-dialog
                :title="LANG.RS_TITLE"
                :visible="isVisible"
                width="400px"
                @close="cancelSubmit"
                :append-to-body="true"
                center
        >
            <div class="inline_input">
                <div class="input_tip">
                    {{LANG.RS_WIDTH}}
                </div>
                <div>
                    <el-input-number @change="change('x')" v-model="x" :min="400" size="mini"></el-input-number>
                </div>
            </div>
            <div class="inline_input">
                <div class="input_tip">
                    {{LANG.RS_HEIGHT}}
                </div>
                <div>
                    <el-input-number @change="change('y')" v-model="y" :min="300" size="mini"></el-input-number>
                </div>
            </div>
            <div class="inline_input">
                <div class="input_tip"></div>
                <div>
                    <el-button @click="showTimeSeq" size="mini">{{LANG.RS_TS}}</el-button>
                </div>
            </div>
            <div style="text-align:center">
                 <span slot="footer" class="dialog-footer">
                       <el-button type="primary" @click="isSubmit" size="mini">{{LANG.BTN_SURE}}</el-button>
                     <el-button @click="cancelSubmit" size="mini">{{LANG.BTN_CANCEL}}</el-button>
                </span>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    export default {
        props:['showSetting'],
        data(){
            let [x,y]=[this.$parent.item.FormatW,this.$parent.item.FormatH,];
            if(this.$parent.item.videoId==106 || this.$parent.resolutionValue=='960*2160'){
                x=960;
                y=2160;
            }
            return {
                x:x,
                y:y,
                isVisible: this.showSetting,
                LANG:this.LANGUAGE[this.globalEvent.language]
            };
        },
        inject: ["comScreen"],
        watch:{
            showSetting(v,ov){
                this.isVisible=v;
            }
        },
        methods:{
            change(act){
                if(this.x*this.y>2600000){
                    alert("垂直分辨率*水平分辨率不能大于2600000");
                    if(act=='x'){
                        this.$nextTick(()=>{
                            this.x=parseInt(2600000/this.y);
                        })
                    }
                    else{
                        this.$nextTick(()=>{
                            this.y=parseInt(2600000/this.x);
                        })
                    }
                }
            },
            showTimeSeq(){
                this.$emit('sub_event',{act:'showTimeSeq',x:this.x,y:this.y});
            },
            cancelSubmit(){
                this.$emit('sub_event',{act:'closeSetDialog'});
            },
            isSubmit(){
                this.$emit("sub_event",{act:"setResolution",x:this.x,y:this.y});
            }
        }
    }
</script>

<style>
    .inline_input{display:flex;line-height:40px;width:250px;margin:0 auto 20px;}
    .input_tip{width:110px;}
</style>