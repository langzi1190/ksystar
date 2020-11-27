<template>
    <div class="screen_ctr_dialog">
        <el-dialog :title="LANG.TUNNEL_TITLE" :visible="showDialog=='screenCtr'" @close="op('cancel')">
            <div class="dialog_body">
                <div class="left_body">
                    <div class="item">
                        <span v-html="LANG.TUNNEL_SCREEN_TYPE"></span>
                        <el-select v-model="screenType" size="mini">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </div>

                    <fieldset>
                        <legend>{{LANG.TUNNEL_SCREEN_SEQ}}</legend>
                        <label><input value=0 v-model="scrMode" type="radio"/>{{LANG.TUNNEL_SEQ_1}}</label>
                        <label><input value=1 v-model="scrMode"  type="radio"/>{{LANG.TUNNEL_SEQ_2}}</label>
                        <label><input value=2 v-model="scrMode"  type="radio"/>{{LANG.TUNNEL_SEQ_3}}</label>
                        <label><input value=3 v-model="scrMode"  type="radio"/>{{LANG.TUNNEL_SEQ_4}}</label>

                        <div class="screen_arrange" v-show="scrMode==0">
                            <div class="flex_div"><div>1</div><div>2</div><div>3</div></div>
                            <div class="flex_div"><div>4</div><div>5</div><div>6</div></div>
                        </div>
                        <div class="screen_arrange" v-show="scrMode==1">
                            <div class="flex_div"><div>1</div><div>3</div><div>5</div></div>
                            <div class="flex_div"><div>2</div><div>4</div><div>6</div></div>
                        </div>
                        <div class="screen_arrange" v-show="scrMode==2">
                            <div class="flex_div"><div>11</div><div>12</div><div>13</div></div>
                            <div class="flex_div"><div>21</div><div>22</div><div>23</div></div>
                        </div>

                        <div class="screen_arrange" v-show="scrMode==3">
                            <div class="flex_div"><div>11</div><div>21</div><div>31</div></div>
                            <div class="flex_div"><div>12</div><div>22</div><div>32</div></div>
                        </div>
                    </fieldset>
                </div>
                <div class="right_body">
                    <div class="item">
                        <span v-html="LANG.TUNNEL_BAUD"></span>
                        <el-select v-model="baud" size="mini" placeholder="无">
                            <el-option
                                    v-for="(item,index) in baudList"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>

                        <fieldset>
                            <legend>{{LANG.TUNNEL_SCREEN_SETTNG}}</legend>
                            <div class="tip">{{LANG.TUNNEL_DELAY}}</div>
                            <el-input-number v-model="commuDly"  size="mini"></el-input-number>
                            <label><input v-model="shutAble" :false-value=0 :true-value=1 type="checkbox"/>{{LANG.TUNNEL_ALLOW}}</label>
                        </fieldset>
                    </div>
                </div>
            </div>

            <fieldset>
                <legend>{{LANG.TUNNEL_DEFINE}}</legend>
                <div class="dialog_body">
                    <div class="left_body">
                        <div class="b_tip" v-html="LANG.TUNNEL_OPEN"></div>
                        <!--<el-input-->
                                <!--:disabled="shutAble==0"-->
                                <!--type="textarea"-->
                                <!--:rows="4"-->
                                <!--v-model="startCode">-->
                        <!--</el-input>-->
                        <div class="textarea_wrapper">
                            <textarea @click.stop="" v-model="startCode" :style="{width:startAreaW+'px'}"></textarea>
                        </div>

                    </div>
                    <div class="right_body">
                        <div class="b_tip" v-html="LANG.TUNNEL_SHUT"></div>
                        <!--<el-input-->
                                <!--:disabled="shutAble==0"-->
                                <!--type="textarea"-->
                                <!--:rows="4"-->
                                <!--v-model="shutCode">-->
                        <!--</el-input>-->
                        <div class="textarea_wrapper">
                            <textarea @click.stop="" v-model="shutCode" :style="{width:shutAreaW+'px'}"></textarea>
                        </div>
                    </div>
                </div>
            </fieldset>

            <div class="b_tip" style="line-height:25px;">{{LANG.TUNNEL_TIP}}<br/>{{LANG.TUNNEL_FORMAT}}</div>
            <div class="b_tip" style="text-align:center;">
                <el-button size="mini" @click="op('sure')">{{LANG.BTN_SURE}}</el-button> <el-button size="mini" @click="op('cancel')">{{LANG.BTN_CANCEL}}</el-button>
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
                baudList:[1200,2400,4800,9600,19200,38400,57600,115200],
                baud:7,
                options:[{
                    'value':0,
                    'label':LANG.TUNNEL_NONE
                    },
                    {
                        'value':1,
                        'label':LANG.TUNNEL_CUSTOM
                    }
                ],
                screenType:0,
                // screenSeq:0,
                scrMode:0,
                commuDly:0,
                shutAble:0,
                shutCode:'',
                startCode:'',
                startAreaW:10,
                shutAreaW:10,
                LANG:LANG
            };
        },
        watch:{
            startCode(v,ov){

                let lArr=v.split("\n");
                let maxLen=0;
                for(let i in lArr){
                    maxLen=Math.max(lArr[i].split(' ').length,maxLen);
                }

                this.startAreaW=maxLen*40;
            },
            shutCode(v,ov){

                let lArr=v.split("\n");
                let maxLen=0;
                for(let i in lArr){
                    maxLen=Math.max(lArr[i].split(' ').length,maxLen);
                }

                this.shutAreaW=maxLen*40;
            }
        },
        created(){
            this.$http.get("extCtrlRd.cgi",{},(ret)=>{
                let info=ret.data;
                let stopCmdArr=info.stopCmdArr.map((v,k)=>{
                    return v.map((a,b)=>this.toHex(a)).join(' ');
                });
                let startCmdArr=info.startCmdArr.map((v,k)=>{
                    return v.map((a,b)=>this.toHex(a)).join(' ');
                });

                this.baud=info.comBaud;
                this.commuDly=info.commuDly;
                this.shutAble=info.funcSta;
                this.scrMode=info.scrMode;
                this.screenType=info.scrType;
                this.shutCode=stopCmdArr.join('\n');
                this.startCode=startCmdArr.join('\n');
            });
        },
        methods:{
            toHex(v){
                return '0x'+Number(v).toString(16).toUpperCase().padStart(2,'0');
            },
            op(act){
                if('cancel'==act){
                    this.$emit('sub_event',{act:'close_kfs'});
                }
                else if('sure'==act){
                    let startCmdArr=[];
                    let stopCmdArr=[];
                    this.startCode.split('\n').forEach((value,key,ouArr)=>{
                        if(value!=''){
                            let mid=value.split(" ");
                            let midArr=[];
                            mid.forEach((v,k,arr)=>{
                                if(v!=''){
                                    if(v.substr(0,2)=='0x'){
                                        midArr.push(Number(v));
                                    }
                                    else{
                                        midArr.push(Number('0x'+v));
                                    }
                                }


                            })
                            if(midArr.length>0)
                                startCmdArr.push(midArr);
                        }

                    });
                    this.shutCode.split('\n').forEach((value,key,outArr)=>{
                        if(value!=''){
                            let mid=value.split(" ");
                            let midArr=[];
                            mid.forEach((v,k,arr)=>{
                                if(v!=''){
                                    if(v.substr(0,2)=='0x'){
                                        midArr.push(Number(v));
                                    }
                                    else{
                                        midArr.push(Number('0x'+v));
                                    }
                                }

                            })
                            if(midArr.length>0)
                                stopCmdArr.push(midArr);
                        }

                    });



                    let param={
                        funcSta:this.shutAble,
                        scrType:this.screenType,//this.screenType=='无'?0:1,
                        scrMode:parseInt(this.scrMode),
                        comBaud:this.baud,
                        commuDly:this.commuDly,
                        startCmdNum:startCmdArr.length,
                        startCmdArr:startCmdArr,
                        stopCmdNum:stopCmdArr.length,
                        stopCmdArr:stopCmdArr,
                    };
                    console.log(param);
                    this.$http.post("extCtrlWr.cgi",param,(r)=>{
                        this.$emit('sub_event',{act:'close_kfs'});
                    });

                }
            }
        }
    }
</script>

<style>
    .screen_ctr_dialog .el-dialog{width:700px;}
    .screen_ctr_dialog .dialog_body{width:650px;display:flex;justify-content: space-between;margin-top:0;}
    .screen_ctr_dialog .dialog_body > div{width:310px;border:none;padding:0;height:220px;background-color:transparent;}
    .screen_ctr_dialog .dialog_body .el-select--mini{margin:0 0 0 10px;width:130px;}
    .screen_ctr_dialog fieldset{border:1px solid #dcdcdc;margin-top:15px;position:relative;height:170px;}
    .screen_ctr_dialog legend{padding: 0 5px;margin-left: 10px;}
    fieldset label{display:block;margin:15px 10px;}
    .screen_ctr_dialog .tip{margin:15px 0 15px 15px;}
    .screen_ctr_dialog .el-input-number{margin-left:15px;}
    .screen_ctr_dialog .b_tip{margin-top:10px;}
    fieldset .dialog_body > div{max-height:150px;}
    fieldset .dialog_body > div .b_tip{margin-left:15px;}
    .dialog_body .el-textarea{margin:10px;width:280px;}

    .textarea_wrapper{    width: 280px;
        height: 100px;
        border: 1px solid #dcdcdc;
        margin: 5px auto;
        border-radius: 5px;
        overflow: auto;
        padding: 5px;}
    .textarea_wrapper textarea{border:none;outline:none;min-width:270px;min-height:90px;}
    .screen_arrange{position:absolute;    top: 30px; right: 30px;}
    .screen_arrange .flex_div:last-child{margin-top:15px;}
    .screen_arrange span{display:inline-block;}
    .screen_arrange .flex_div{display:flex;justify-content: center;}
    .screen_arrange .flex_div div{width: 30px;text-align:center;}
</style>