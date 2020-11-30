<template>
    <div>
        <el-dialog
                :title="LANG.TS_TITLE"
                :visible.sync="isVisible"
                width="700px"
                @close="isSubmit(false)"
                :append-to-body="true"
                center
        >
            <div class="dialog_body time_seq">
                <div class="left_body">

                    <div class="row_item">
                        <div class="item_title" v-html="LANG.EDID_CLOCK">
                        </div>
                        <div class="item_input">
                            <el-input
                                    @change="changeFrame"
                                    size="mini"
                                    v-model="curScreen.ClkFreq">
                            </el-input>
                        </div>
                    </div>
                    <div class="row_item">
                        <div class="item_title" v-html="LANG.EDID_WIDTH">
                        </div>
                        <div class="item_input">
                            <el-input
                                    @change="changeFrame"
                                    size="mini"
                                    v-model="curScreen.FormatW"
                                    :disabled="true">
                            </el-input>
                        </div>
                    </div>
                    <div class="row_item">
                        <div class="item_title" v-html="LANG.EDID_HFROMPORCH">
                        </div>
                        <div class="item_input">
                            <el-input
                                    @change="changeFrame"
                                    size="mini"
                                    v-model="curScreen.HFrontPorch">
                            </el-input>
                        </div>
                    </div>
                    <div class="row_item">
                        <div class="item_title" v-html="LANG.EDID_HSYNCTIME">
                        </div>
                        <div class="item_input">
                            <el-input
                                    @change="changeFrame"
                                    size="mini"
                                    v-model="curScreen.HSyncTime">
                            </el-input>
                        </div>
                    </div>
                    <div class="row_item">
                        <div class="item_title" v-html="LANG.EDID_HBACKPORCH">
                        </div>
                        <div class="item_input">
                            <el-input
                                    @change="changeFrame"
                                    size="mini"
                                    v-model="curScreen.HBackPorch">
                            </el-input>
                        </div>
                    </div>
                    <div class="row_item">
                        <div class="item_title" v-html="LANG.TS_H_POLAR">
                        </div>
                        <div class="item_input">
                            <!--<el-input-->
                                    <!--size="mini"-->
                                    <!--v-model="curScreen.HPolar">-->
                            <!--</el-input>-->
                            <el-select v-model="curScreen.HPolar" size="mini">
                                <el-option
                                        v-for="(item,index) in polarList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                ></el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
                <div class="right_body">

                    <div class="row_item">
                        <div class="item_title" v-html="LANG.EDID_FRAME">
                        </div>
                        <div class="item_input">
                            <el-input
                                    @change="changeFrame"
                                    size="mini"
                                    v-model="curScreen.FrameRate"
                                    :disabled="true">
                            </el-input>
                        </div>
                    </div>
                    <div class="row_item">
                        <div class="item_title" v-html="LANG.EDID_HEIGHT">
                        </div>
                        <div class="item_input">
                            <el-input
                                    @change="changeFrame"
                                    size="mini"
                                    v-model="curScreen.FormatH"
                                    :disabled="true">
                            </el-input>
                        </div>
                    </div>
                    <div class="row_item">
                        <div class="item_title" v-html="LANG.EDID_VFROMPORCH">
                        </div>
                        <div class="item_input">
                            <el-input
                                    @change="changeFrame"
                                    size="mini"
                                    v-model="curScreen.VFrontPorch">
                            </el-input>
                        </div>
                    </div>
                    <div class="row_item">
                        <div class="item_title" v-html="LANG.EDID_VSYNCTIME">
                        </div>
                        <div class="item_input">
                            <el-input
                                    @change="changeFrame"
                                    size="mini"
                                    v-model="curScreen.VSyncTime">
                            </el-input>
                        </div>
                    </div>
                    <div class="row_item">
                        <div class="item_title" v-html="LANG.EDID_VBACKPORCH">
                        </div>
                        <div class="item_input">
                            <el-input
                                    @change="changeFrame"
                                    size="mini"
                                    v-model="curScreen.VBackPorch">
                            </el-input>
                        </div>
                    </div>
                    <div class="row_item">
                        <div class="item_title" v-html="LANG.TS_V_POLAR">
                        </div>
                        <div class="item_input">
                            <!--<el-input-->
                                    <!--size="mini"-->
                                    <!--v-model="curScreen.VPolar">-->
                            <!--</el-input>-->
                            <el-select v-model="curScreen.VPolar" size="mini">
                                <el-option
                                        v-for="(item,index) in polarList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                ></el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
            </div>
            <div style="text-align:center;">
                <el-button @click="isSubmit(true)" size="mini">{{LANG.BTN_SURE}}</el-button>
                <el-button @click="isSubmit(false)" size="mini">{{LANG.BTN_CANCEL}}</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>

    export default {
        props:['showSetting'],
        data(){
            let curScreenIndex=this.comScreen.curScreenIndex();//当前操作的屏幕
            let defaultParam={
                ClkFreq:526080,
                FormatW:3840,
                FormatH:2160,
                FrameRate:60,
                HFrontPorch:48,
                HSyncTime:32,
                HBackPorch:80,
                VFrontPorch:12,
                VSyncTime:8,
                VBackPorch:12,
                VPolar:1,
                HPolar:1,
            };

            if(typeof this.$parent.w!='undefined'){
                if(this.$parent.w==960 && this.$parent.h==2160){
                    defaultParam={
                        ClkFreq:148500,
                        FormatW:960,
                        FormatH:2160,
                        FrameRate:60,
                        HFrontPorch:44,
                        HSyncTime:22,
                        HBackPorch:74,
                        VFrontPorch:8,
                        VSyncTime:10,
                        VBackPorch:72,
                        VPolar:0,
                        HPolar:1
                    };
                }
            }
            return {
                curScreenIndex,
                LANG:this.LANGUAGE[this.globalEvent.language],
                isVisible: this.showSetting,
                curScreen:defaultParam,//this.copyObject(this.comScreen.displayList[curScreenIndex]),
                // FrameRateInfo:0,
                polarList:[{label:'POSITIVE',value:1},{label:'NEGTIVE',value:0}],
                defaultParam:JSON.parse(JSON.stringify(defaultParam))
            };
        },
        inject: ["comScreen"],
        watch:{
            showSetting(v,ov){
                this.isVisible=v;
            },
            // "globalEvent.curScreenIndex":function(v,ov){
            //     this.curScreen=this.copyObject(this.globalEvent.screenInfo.scrGroupArr[this.globalEvent.curScreenIndex]);
            // }
        },
        mounted(){
            if(typeof this.$parent.w!='undefined' && this.$parent.w==960 && this.$parent.h==2160){
                this.curScreen=JSON.parse(JSON.stringify(this.defaultParam));
            }
            else{
                this.curScreen=JSON.parse(JSON.stringify(this.curScreen,this.globalEvent.screenInfo.scrGroupArr[this.globalEvent.curScreenIndex]));
                let defaultParam=this.GetDefineOutputTimingInfo(this.$parent.w,this.$parent.h);
                Object.assign(this.curScreen,defaultParam);
            }

            // console.log(this.curScreen);
            // if(this.curScreen.FrameRate==0){
            //     this.FrameRateInfo = 60;
            // }
            // else if(this.curScreen.FrameRate==1){
            //     this.FrameRateInfo = 50;
            // }
            // else if(this.curScreen.FrameRate==2){
            //     this.FrameRateInfo = 30;
            // }
        },
        methods:{
            // copyObject(o){
            //     return JSON.parse(JSON.stringify(o));
            // },
            changeFrame(){
                this.calFrameRate();
            },
            calFrameRate(){

                for(let k in this.curScreen){
                    if(k!='tabName' && typeof this.curScreen[k] =='string'){

                    }this.curScreen[k]=parseInt(this.curScreen[k]);

                }
                let hTotal=this.curScreen.FormatW+this.curScreen.HFrontPorch+this.curScreen.HSyncTime+this.curScreen.HBackPorch;
                let vTotal=this.curScreen.FormatH+this.curScreen.VFrontPorch+this.curScreen.VSyncTime+this.curScreen.VBackPorch;
                this.curScreen.FrameRate=Number(this.curScreen.ClkFreq*1000/hTotal/vTotal).toFixed(2);

            },
            isSubmit(on){
                if(!on){

                    this.$emit('sub_event',{act:'closeTimeSeqDialog'});
                }
                else{
                    //提交
                    for(let  i in this.curScreen){
                        if(i!='tabName' && typeof this.curScreen[i] == 'string'){
                            this.curScreen[i]=parseInt(this.curScreen[i]);
                        }
                    }
                    Object.assign(this.comScreen.displayList[this.curScreenIndex],this.curScreen);
                    this.$emit('sub_event',{act:'closeTimeSeqDialog'});
                }
            },
            GetDefineOutputTimingInfo(nDefinedWidth,nDefinedHeight)
            {
                // let timing={
                //     ClkFreq:526080,
                //     FormatW:3840,
                //     FormatH:2160,
                //     FrameRate:60,
                //     HFrontPorch:48,
                //     HSyncTime:32,
                //     HBackPorch:80,
                //     VFrontPorch:12,
                //     VSyncTime:8,
                //     VBackPorch:12,
                // };
                let timing=JSON.parse(JSON.stringify(this.defaultParam));
                let h_blank;                                                                                             // h_blank = 行显示前沿+行同步脉冲+行显示后沿
                if((nDefinedWidth==800) && (nDefinedHeight==1600)){                    //（自定义分辨率宽=800） 且 （自定义分辨率高 =1600）
                    timing.FormatW      = nDefinedWidth;                                    // 宽度
                    timing.FormatH   = nDefinedHeight;                                    // 高度
                    timing.ClkFreq = 108000;//148500;//162000;//           // 时钟
                    timing.VFrontPorch = 10;                                                    // 列显示前沿
                    timing.VSyncTime   = 5;                                                       // 列同步脉冲
                    timing.VBackPorch  = 15;                                                   // 列同步后沿

                    h_blank = parseInt(1800000 / (nDefinedHeight + 30)) - nDefinedWidth;        // h_blank = 时钟*10/(高度+v_blank) - 宽度
                    if(h_blank % 4 > 0)                                                                            // 是否是4的倍数
                    {
                        h_blank = parseInt(h_blank / 4) * 4 + 4;                                        // 向上取4的整数倍
                    }
                    timing.HFrontPorch =parseInt( h_blank / 3 );                                                  // 行显示前沿 = h_blank/3
                    if(timing.HFrontPorch % 4 > 0)                                                       // 是否是4的倍数
                    {
                        timing.HFrontPorch = parseInt(timing.HFrontPorch / 4) * 4 + 4; // 向上取4的整数倍
                    }
                    timing.HSyncTime = timing.HFrontPorch;                                       // 行同步脉冲 = 行显示前沿
                    timing.HBackPorch = h_blank - timing.HFrontPorch * 2;               // 行显示后沿 = h_blank - 行显示前沿*2
                }else if((nDefinedWidth==800) && (nDefinedHeight==1920)){
                    timing.FormatW      = nDefinedWidth;
                    timing.FormatH   = nDefinedHeight;
                    timing.ClkFreq = 121750;//108000;//148500;//162000;//
                    timing.VFrontPorch = 10;
                    timing.VSyncTime   = 10;
                    timing.VBackPorch  = 10;

                    h_blank = parseInt(2029200 / (nDefinedHeight + 30)) - nDefinedWidth;
                    if(h_blank % 4 > 0)
                    {
                        h_blank = parseInt(h_blank / 4) * 4 + 4;
                    }
                    timing.HFrontPorch = parseInt(h_blank / 3);
                    if(timing.HFrontPorch % 4 > 0)
                    {
                        timing.HFrontPorch = parseInt(timing.HFrontPorch / 4) * 4 + 4;
                    }
                    timing.HSyncTime = timing.HFrontPorch;
                    timing.HBackPorch = h_blank - timing.HFrontPorch * 2;
                }else if(nDefinedWidth * nDefinedHeight <= 1024 * 768){
                    timing.FormatW      = nDefinedWidth;
                    timing.FormatH   = nDefinedHeight;
                    timing.ClkFreq = 65000;//121750;//108000;//162000;//
                    timing.VFrontPorch = 10;
                    timing.VSyncTime   =  6;
                    timing.VBackPorch  = 14;

                    h_blank = parseInt(1080000 / (nDefinedHeight + 30)) - nDefinedWidth;
                    if(h_blank % 4 > 0)
                    {
                        h_blank = parseInt(h_blank / 4) * 4 + 4;
                    }
                    timing.HFrontPorch = parseInt(h_blank / 3);
                    if(timing.HFrontPorch % 4 > 0)
                    {
                        timing.HFrontPorch = parseInt(timing.HFrontPorch / 4) * 4 + 4;
                    }
                    timing.HSyncTime   = timing.HFrontPorch;
                    timing.HBackPorch  = h_blank - timing.HFrontPorch * 2;
                }else if(nDefinedWidth * nDefinedHeight <= 1920 * 1080){
                    timing.FormatW      = nDefinedWidth;
                    timing.FormatH   = nDefinedHeight;
                    timing.ClkFreq = 148500;//121750;//108000;//162000;//
                    timing.VFrontPorch = 10;//10
                    timing.VSyncTime   =  6;//6
                    timing.VBackPorch  = 14;//14

                    h_blank = parseInt(2475000 / (nDefinedHeight + 30)) - nDefinedWidth;

                    if(h_blank % 4 > 0)
                    {
                        h_blank = parseInt(h_blank / 4) * 4 + 4;
                    }
                    timing.HFrontPorch = parseInt(h_blank / 3);
                    if(timing.HFrontPorch % 4 > 0)
                    {
                        timing.HFrontPorch = parseInt(timing.HFrontPorch / 4) * 4 + 4;
                    }
                    timing.HSyncTime   = timing.HFrontPorch;
                    timing.HBackPorch  = h_blank - timing.HFrontPorch * 2;
                    // timing.h_polarity = POSITIVE;
                    // timing.v_polarity = POSITIVE;
                }else{
                    timing.FormatW      = nDefinedWidth;
                    timing.FormatH   = nDefinedHeight;
                    timing.ClkFreq = 158000;//121750;//108000;//162000;//
                    timing.VFrontPorch = 3;
                    timing.VSyncTime   =  5;
                    timing.VBackPorch  = 8;
                    h_blank = parseInt(2250 * 1200 / (nDefinedHeight + 30)) - nDefinedWidth;

                    if(h_blank % 4 > 0)
                    {
                        h_blank = parseInt(h_blank / 4) * 4 + 4;
                    }
                    timing.HFrontPorch =parseInt( h_blank / 3 );

                    if(timing.HFrontPorch % 4 > 0)
                    {
                        timing.HFrontPorch = parseInt(timing.HFrontPorch / 4) * 4 + 4;
                    }
                    timing.HSyncTime   = timing.HFrontPorch;
                    timing.HBackPorch  = h_blank - timing.HFrontPorch * 2;

                }

                let m_nWidth = 0;
                m_nWidth = timing.FormatW + timing.HFrontPorch + timing.HSyncTime + timing.HBackPorch;                  //行 总像素
                let m_nHeight = 0;
                m_nHeight = timing.FormatH + timing.VFrontPorch + timing.VSyncTime + timing.VBackPorch;                 //列 总像素

                let nFrame = (timing.ClkFreq * 1000)/(m_nWidth * m_nHeight);                                                 //计算帧率
                let nOffset = 0;
                if(nFrame < 59.98)
                {
                    while(nFrame < 59.98)
                    {
                        nOffset--;
                        nFrame = (timing.ClkFreq * 1000)/(m_nWidth * (m_nHeight + nOffset));
                    }
                }
                while(nFrame > 60)
                {
                    nOffset++;
                    nFrame = (timing.ClkFreq * 1000)/(m_nWidth * (m_nHeight + nOffset));
                }
                if(nOffset < 0)
                {
                    let nValue = 0 - nOffset;
                    timing.VBackPorch = timing.VBackPorch - (nValue % 4);
                    timing.HBackPorch = timing.HBackPorch - parseInt(nValue / 4) * 4;

                }
                else
                {
                    timing.VBackPorch = timing.VBackPorch + nOffset;
                }

                timing.FrameRate=nFrame.toFixed(2);
                return timing;
            }
        }
    }
</script>

<style scoped>
    .time_seq{width: 540px;margin: 0 auto;}
    .time_seq > div{width:50%;padding:0;height:auto;}
    .time_seq .left_body{border:none;}
    .time_seq .right_body .el-select--mini{margin-top:0;}
    .row_item{display:flex;margin-bottom:20px;height:30px;line-height:30px;width:80%;}
    .item_title{width:47%;text-align:left;}
    .item_input{width:55%}
</style>