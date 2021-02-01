<template>
    <div class="simulate_dialog">
        <el-dialog :title="LANG.SIMULATE_TITLE"
                   width="700px"
                   :visible="showDialog=='simulate'"
                   @close="op(false)">
            <div class="si_body">
                <div class="item">
                    <span>{{LANG.SIMULATE_DEV_TYPE}} </span>
                    <div class="item_input">
                        <el-select v-model="dev" size="mini" disabled style="width:120px;">
                            <el-option
                                    v-for="(item,index) in devList"
                                    :key="item"
                                    :label="item"
                                    :value="index"
                            ></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item">
                    <span>{{LANG.SIMULATE_OUT_NUM}} </span>
                    <div class="item_input">
                        <el-input size="mini" v-model.lazy="outCount" min=1 max=15 style="width:120px;"></el-input>
                    </div>
                </div>
                <div class="item">
                    <span>{{LANG.SIMULATE_IN_NUM}} </span>
                    <div class="item_input">
                        <el-input size="mini" v-model.lazy="inCount" min=1 max=60 style="width:120px;"></el-input>
                    </div>
                </div>

                <div class="item body_item">
                    <div class="l_body">
                        <div class="l_body_inner">
                            <div class="card_item" v-for="(item,index) in inCardList">
                                <div class="card_tip">
                                    IN  &nbsp;&nbsp;&nbsp; {{index+1}}
                                </div>
                                <div class="card_select">
                                    <el-select v-model="item.port1Index" size="mini" style="width:110px;">
                                        <el-option
                                                v-for="(in_item,in_index) in inputTypeList"
                                                :key="in_index + in_item.portLabel"
                                                :label="in_item.portLabel"
                                                :value="in_index"
                                        >
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="card_select">
                                    <el-select v-model="item.port2Index" size="mini" style="width:110px;">
                                        <el-option
                                                v-for="(in_item,in_index) in inputTypeList"
                                                :key="in_index + in_item.portLabel"
                                                :label="in_item.portLabel"
                                                :value="in_index"
                                        >
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="card_select">
                                    <el-select v-model="item.port3Index" size="mini" style="width:110px;">
                                        <el-option
                                                v-for="(in_item,in_index) in inputTypeList"
                                                :key="in_index + in_item.portLabel"
                                                :label="in_item.portLabel"
                                                :value="in_index"
                                        >
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="r_body">
                        <div class="el_button_wrapper">
                            <el-button size="mini">
                                {{LANG.SIMULATE_IMPORT}}
                                <input type="file" ref="config"/>
                            </el-button>
                        </div>
                        <div class="el_button_wrapper">
                            <el-button size="mini" @click="exportConfig">{{LANG.SIMULATE_EXPORT}}</el-button>
                        </div>

                    </div>
                </div>

                <div class="item" style="text-align:center;">
                    <el-button size="mini" @click="op(true)">{{LANG.BTN_SURE}}</el-button>
                    <el-button size="mini" @click="op(false)">{{LANG.BTN_CANCEL}}</el-button>
                </div>
            </div>


        </el-dialog>
    </div>
</template>

<script>
    const simulateKey="simulate_param";
    export default {
        props:['showDialog'],
        data(){
            let inputTypeList=[];
            for(let key in this.globalEvent.pType){
                if(key=='p0'){
                    continue;
                }
                if(key.length<4){
                    // inputTypeList.push({key:this.globalEvent.pType[key]});
                    inputTypeList.push({
                        port:key.replace('p',''),
                        portLabel:this.globalEvent.pType[key]
                    });
                }
            }

            let simulateInfo=localStorage.getItem(simulateKey);
            if(simulateInfo===null || simulateInfo===undefined){
                simulateInfo={
                    inCount:1,
                    outCount:1,
                    inCardList:[
                        {
                            port1:0,
                            port1Index:0,
                            port2:0,
                            port2Index:0,
                            port3:0,
                            port3Index:0,
                        }],//输入卡
                };
            }
            else{
                simulateInfo=JSON.parse(simulateInfo)
            }

            return {
                devList:['KS9800A'],
                LANG:this.LANGUAGE[this.globalEvent.language],
                dev:0,
                inputTypeList:inputTypeList,
                inCount:simulateInfo.inCount,
                inCardList:simulateInfo.inCardList,//输入卡
                outCount:simulateInfo.outCount,

            };
        },
        watch:{
            inCount(v,ov){
                if(v==''){
                    return;
                }
                if(v<1){
                    this.$nextTick(()=>{
                        setTimeout(()=>{
                            this.inCount=1;
                        },500);
                    });
                    return ;
                }else if(v>60){
                    this.$nextTick(()=>{
                        setTimeout(()=>{
                            this.inCount=60;
                        },500);
                    });
                    return ;
                }
                let curInCount=this.inCardList.length;
                // let curInCount=this.inCardList.length;
                if(curInCount>this.inCount){
                    this.inCardList.splice(this.inCount,curInCount-this.inCount);
                }
                else if(curInCount<this.inCount){
                    let delta=this.inCount-curInCount;
                    for(let i=0;i<delta;i++){
                        this.inCardList.push({
                            // port1:0,
                            port1Index:0,
                            // port2:0,
                            port2Index:0,
                            // port3:0,
                            port3Index:0,
                        });
                    }
                }
            },
            outCount(v,ov){
                if(v==''){
                    return;
                }
                if(v<1){
                    this.$nextTick(()=>{
                        setTimeout(()=>{
                            this.inCount=1;
                        },500);
                    });
                    return ;
                }else if(v>15){
                    this.$nextTick(()=>{
                        setTimeout(()=>{
                            this.inCount=15;
                        },500);
                    });
                    return ;
                }
            }
        },
        mounted(){
            setTimeout(()=>{
                this.uploadEvent()
            },600);
        },
        methods:{
            op(act){
                if(act){
                    if(this.inCount=='' || this.outCount==''){
                        this.$message.error("输入卡或输出卡数量不能为空");
                        return ;
                    }
                    //生成输入卡，输出卡
                    this.globalEvent.gMode=1;
                    let inCardInfo={
                        inCardNum:this.inCardList.length,
                        inCardArr:[]
                    };
                    for(let i in this.inCardList){
                        let oCard=this.inCardList[i];
                        let inCard={
                            srcNum:3,
                            srcArr:[{
                                "portType":parseInt(this.inputTypeList[oCard.port1Index].port),
                                "ITESrcType":	1,
                                "resolArr":	[300, 200],
                                "bakFuncSta":	0,
                                "bakSrcCardId":	0,
                                "bakSrcId":	0
                                },
                                {
                                    "portType":	parseInt(this.inputTypeList[oCard.port2Index].port),
                                    "ITESrcType":	1,
                                    "resolArr":	[300, 200],
                                    "bakFuncSta":	0,
                                    "bakSrcCardId":	0,
                                    "bakSrcId":	0
                                },
                                {
                                    "portType":	parseInt(this.inputTypeList[oCard.port3Index].port),
                                    "ITESrcType":	1,
                                    "resolArr":	[300, 200],
                                    "bakFuncSta":	0,
                                    "bakSrcCardId":	0,
                                    "bakSrcId":	0
                                }
                            ]
                        };

                        inCardInfo.inCardArr.push(inCard);
                    }
                    this.globalEvent.modeInfo.inCardInfo=inCardInfo;

                    let outCardInfo={
                        "outCardNum":	this.outCount-0,
                        "outPortNum":	this.outCount*6,
                        "maxOutCardNum":	15,
                        "portNumPerCard":	6,
                        outCardArr:[]
                    };

                    for(let i=0;i<this.outCount;i++){
                        outCardInfo.outCardArr.push([1,1,1,1,1,1]);
                    }

                    this.globalEvent.modeInfo.outCardInfo=outCardInfo;

                    //屏幕墙设置
                    this.globalEvent.screenInfo={
                        "ScrGroupNum":	1,
                        scrGroupArr:[{
                            "Row":	1,
                            "Col":	1,
                            tabName:'name_abc',
                            "VideoId":	16,
                            "TimingMode":	1,
                            "FrameRate":	60,
                            "FormatW":	1920,
                            "HFrontPorch": 88,
                            "HSyncTime":	44,
                            "HBackPorch":	148,
                            "FormatH":	1080,
                            "VFrontPorch":	4,
                            "VSyncTime":	5,
                            "VBackPorch":	36,
                            "ClkFreq":	148500,
                            "HPolar":	0,
                            "VPolar":	0,
                            "portArr":[{
                                "sizeArr":	[1920, 1080],
                                "mapArr":	[0],
                                "briArr":	[0, 0, 0],
                                "conArr":	[100, 100, 100]
                            }]
                        }]
                    };


                    //保存
                    localStorage.setItem(simulateKey,JSON.stringify({
                        inCount:this.inCount,
                        outCount:this.outCount,
                        inCardList:this.inCardList
                    }))




                    this.globalEvent.$emit("simulate");//signal/index
                    this.$emit('sub_event',{act:'close_kfs'});
                }
                else{
                    this.$emit("sub_event",{act:'close_kfs'});
                }
            },
            uploadEvent(){
                let input=this.$refs.config;
                let that=this;
                input.addEventListener("change",(e)=>{
                    let file=input.files[0];
                    if(!!file){
                        let reader=new FileReader();
                        reader.readAsText(file);
                        reader.onload=function () {
                            let obj=JSON.parse(reader.result);
                            that.dev=obj.dev;
                            that.inputTypeList=obj.inputTypeList;
                            that.inCount=obj.inCount;
                            that.inCardList=obj.inCardList;
                            that.outCount=obj.outCount;
                        }
                    }
                })
            },
            exportConfig(){
                let param={
                    dev:this.dev,
                    inputTypeList:this.inputTypeList,
                    inCount:this.inCount,
                    inCardList:this.inCardList,
                    outCount:this.outCount
                };
                let b=new Blob([JSON.stringify(param)]);
                let aEle = document.createElement("a");
                aEle.download="demo.bin";
                aEle.href=window.URL.createObjectURL(b);
                aEle.click();

                window.URL.revokeObjectURL(b);
            }
        }
    }
</script>

<style>
    .si_body .item{margin-top:10px;}
    .si_body .l_body{width:420px;border:1px solid #dcdcdc;}
    .si_body .l_body_inner{min-height: 300px;background-color: #d3d2d0;max-height: 400px;overflow: auto;margin:2px;}
    .si_body .item_input{display:inline-block;}
    .si_body .card_tip{width:60px;text-align:center;}
    .si_body .card_select{margin-right:10px;}
    .si_body .card_item{display: flex;height: 30px; line-height: 30px;padding-bottom:10px;background-color:#ff99;}
    .si_body .body_item{display:flex;}
    .r_body{text-align:center;}
    .r_body button{margin-left:0 !important;width:120px;}
    .r_body .el_button_wrapper{display:inline-block;position:relative;margin-top:60px;}
    .r_body button input{    position: absolute;
        left: 0;
        width: 100%;
        height: 100%;
        cursor: pointer!important;
        top: 0;
        opacity: 0;}
</style>