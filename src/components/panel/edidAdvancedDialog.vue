<template>
    <div >
        <el-dialog
                :title="LANG.EDID_ADVANCE_TITLE"
                :visible="showDialog=='edidAdvanced'"
                width="700px"
                @close="cancelSubmit"
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
                        <div class="item_title">
                            {{LANG.EDID_HFROMPORCH}}
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
                        <div class="item_title">
                            {{LANG.EDID_HSYNCTIME}}
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
                        <div class="item_title">
                            {{LANG.EDID_HBACKPORCH}}
                        </div>
                        <div class="item_input">
                            <el-input
                                    @change="changeFrame"
                                    size="mini"
                                    v-model="curScreen.HBackPorch">
                            </el-input>
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
                        <div class="item_title">
                            {{LANG.EDID_VFROMPORCH}}
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
                        <div class="item_title">
                            {{LANG.EDID_VSYNCTIME}}
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
                        <div class="item_title">
                            {{LANG.EDID_VBACKPORCH}}
                        </div>
                        <div class="item_input">
                            <el-input
                                    @change="changeFrame"
                                    size="mini"
                                    v-model="curScreen.VBackPorch">
                            </el-input>
                        </div>
                    </div>
                </div>
            </div>
            <div style="text-align:center;">
                <el-button size="mini" @click="submit">{{LANG.BTN_SURE}}</el-button>
                <el-button size="mini" @click="cancelSubmit">{{LANG.BTN_CANCEL}}</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    const EDID_DETAILED_TIMING_OFFSET_8K = 128;
    const EDID_DT_CFGBYTE_SYNC_WIDTH_L_8K = 12;// 7680
    const EDID_DT_CFGBYTE_SYNC_WIDTH_H_8K= 13;
    const EDID_DT_CFGBYTE_SYNC_HIGH_L_8K = 14;// 1080
    const EDID_DT_CFGBYTE_SYNC_HIGH_H_8K=15
    const EDID_DT_CFGBYTE_PIXELCLOCK_L_8K=41// 52250 - 1 = pixel clock freq - 1
    const EDID_DT_CFGBYTE_PIXELCLOCK_H_8K=42
    const EDID_DT_CFGBYTE_ACTIVE_PIXEL_L_8K=45// 7680 - 1 = active pixel - 1
    const EDID_DT_CFGBYTE_ACTIVE_PIXEL_H_8K=46
    const EDID_DT_CFGBYTE_H_BLANKING_L_8K = 47// 160 - 1 = h blank - 1
    const EDID_DT_CFGBYTE_H_BLANKING_H_8K =48
    const EDID_DT_CFGBYTE_H_SYNC_OFFSET_L_8K=49// 48 - 1 = h frontporch and + hsync - 1
    const EDID_DT_CFGBYTE_H_SYNC_OFFSET_H_8K=50
    const EDID_DT_CFGBYTE_H_SYNC_WIDTH_L_8K=51// 32 - 1 = h synctime - 1
    const EDID_DT_CFGBYTE_H_SYNC_WIDTH_H_8K=52
    const EDID_DT_CFGBYTE_ACTIVE_LINE_L_8K =53// 1080 - 1 = active line - 1
    const EDID_DT_CFGBYTE_ACTIVE_LINE_H_8K =54
    const EDID_DT_CFGBYTE_V_BLANKING_L_8K =55// 31 - 1 = v blank - 1
    const EDID_DT_CFGBYTE_V_BLANKING_H_8K =56
    const EDID_DT_CFGBYTE_V_SYNC_OFFSET_L_8K =57// 3 - 1 = v frontporch and -vsync - 1
    const EDID_DT_CFGBYTE_V_SYNC_OFFSET_H_8K =58
    const EDID_DT_CFGBYTE_V_SYNC_WIDTH_L_8K =59// 10 - 1 = v synctime - 1
    const EDID_DT_CFGBYTE_V_SYNC_WIDTH_H_8K =60

    const EDID_DETAILED_TIMING_OFFSET  =0x36
    // const EDID_PER_DETAILED_TIMING_LEN =18

    const EDID_DT_CFGBYTE_PIXELCLOCK_L =0x00
    const EDID_DT_CFGBYTE_PIXELCLOCK_H =0x01
    const EDID_DT_CFGBYTE_H_ACTIVE_L  =0x02
    const EDID_DT_CFGBYTE_H_BLANKING_L = 0x03
    const EDID_DT_CFGBYTE_H_ACTIVE_H = 0x04  // valid bit: (bit7~bit4)
    const EDID_DT_CFGBYTE_H_BLANKING_H = 0x04  // valid bit: (bit3~bit0)
    const EDID_DT_CFGBYTE_V_ACTIVE_L = 0x05
    const EDID_DT_CFGBYTE_V_BLANKING_L = 0x06
    const EDID_DT_CFGBYTE_V_ACTIVE_H =0x07  // valid bit: (bit7~bit4)
    const EDID_DT_CFGBYTE_V_BLANKING_H = 0x07  // valid bit: (bit3~bit0)
    const EDID_DT_CFGBYTE_H_SYNC_OFFSET_L =0x08
    const EDID_DT_CFGBYTE_H_SYNC_WIDTH_L =0x09
    const EDID_DT_CFGBYTE_V_SYNC_OFFSET_L =0x0A  // valid bit: (bit7~bit4)
    const EDID_DT_CFGBYTE_V_SYNC_WIDTH_L  =0x0A  // valid bit: (bit3~bit0)
    const EDID_DT_CFGBYTE_H_SYNC_OFFSET_H = 0x0B  // valid bit: (bit7~bit6)
    const EDID_DT_CFGBYTE_H_SYNC_WIDTH_H = 0x0B  // valid bit: (bit5~bit4)
    const EDID_DT_CFGBYTE_V_SYNC_OFFSET_H =0x0B  // valid bit: (bit3~bit2)
    const EDID_DT_CFGBYTE_V_SYNC_WIDTH_H = 0x0B  // valid bit: (bit1~bit0)
    // const EDID_DT_CFGBYTE_H_IMAGE_SIZE_L =0x0C
    // const EDID_DT_CFGBYTE_V_IMAGE_SIZE_L = 0x0D
    // const EDID_DT_CFGBYTE_H_IMAGE_SIZE_H = 0x0E  // valid bit: (bit7~bit4)
    // const EDID_DT_CFGBYTE_V_IMAGE_SIZE_H =0x0E  // valid bit: (bit3~bit0)
    // const EDID_DT_CFGBTYE_H_BORDER = 0x0F
    // const EDID_DT_CFGBYTE_V_BORDER  = 0x10
    // const EDID_DT_CFGBYTE_CTRLFLAG  = 0x11

    export default {
        props:['showDialog'],
        data(){
            return {
                EDID:[],
                devId:0,
                curScreen:{
                    ClkFreq:526080,
                    FormatW:3840,
                    FormatH:2160,
                    FrameRate:60,
                    HFrontPorch:48,
                    HSyncTime:32,
                    HBackPorch:80,
                    VFrontPorch:12,
                    VSyncTime:8,
                    VBackPorch:12
                },
                LANG:this.LANGUAGE[this.globalEvent.language]
            };
        },
        mounted(){
            this.devId=this.$parent.edidParam.devId;
            this.curScreen.FormatW=this.$parent.edidParam.w;
            this.curScreen.FormatH=this.$parent.edidParam.h;
            this.curScreen.FrameRate=this.$parent.edidParam.f;
            this.calClock();//第一次进入都需要反算时钟
            // if(this.$parent.showDialog=='edidSingle'){
            //     //反算时钟
            //
            // }
            // else{
            //     this.calFrameRate();
            // }

        },
        methods:{
            changeFrame(){
                this.calFrameRate();
            },
            calClock(){
                for(let k in this.curScreen){
                    this.curScreen[k]=parseInt(this.curScreen[k]);
                }
                let hTotal=this.curScreen.FormatW+this.curScreen.HFrontPorch+this.curScreen.HSyncTime+this.curScreen.HBackPorch;
                let vTotal=this.curScreen.FormatH+this.curScreen.VFrontPorch+this.curScreen.VSyncTime+this.curScreen.VBackPorch;
                // this.curScreen.FrameRate=this.curScreen.ClkFreq*1000/hTotal/vTotal
                this.curScreen.ClkFreq=this.curScreen.FrameRate*hTotal*vTotal/1000;
            },
            calFrameRate(){
                for(let k in this.curScreen){
                    this.curScreen[k]=parseInt(this.curScreen[k]);
                }
                let hTotal=this.curScreen.FormatW+this.curScreen.HFrontPorch+this.curScreen.HSyncTime+this.curScreen.HBackPorch;
                let vTotal=this.curScreen.FormatH+this.curScreen.VFrontPorch+this.curScreen.VSyncTime+this.curScreen.VBackPorch;
                this.curScreen.FrameRate=Number(this.curScreen.ClkFreq*1000/hTotal/vTotal).toFixed(2);

            },
            calEdid(){

                let EDID=[];
                if(this.curScreen.FormatW>4096){
                    let offset = EDID_DETAILED_TIMING_OFFSET_8K;
                    EDID=[
                        0x00,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0x00,0x2F,0x33,0x05,0x68,0x78,0x56,0x34,0x12,
                        0x2E,0x19,0x01,0x03,0x80,0x3E,0x22,0x78,0xEA,0x08,0xA5,0xA2,0x57,0x4F,0xA2,0x28,
                        0x0F,0x50,0x54,0xA5,0x4B,0x00,0xD1,0xC0,0xA9,0x40,0x81,0x80,0x81,0x00,0x71,0x4F,
                        0xE1,0x00,0x01,0x01,0x01,0x01,0x4D,0xD0,0x00,0xA0,0xF0,0x70,0x3E,0x80,0x30,0x20,
                        0x35,0x00,0x5F,0x59,0x21,0x00,0x00,0x1A,0xA3,0x66,0x00,0xA0,0xF0,0x70,0x1F,0x80,
                        0x30,0x20,0x35,0x00,0x55,0x50,0x21,0x00,0x00,0x1A,0x00,0x00,0x00,0xFF,0x00,0x49,
                        0x54,0x36,0x38,0x30,0x35,0x45,0x56,0x42,0x33,0x38,0x34,0x30,0x00,0x00,0x00,0xFC,
                        0x00,0x4B,0x59,0x53,0x2D,0x39,0x30,0x30,0x30,0x50,0x30,0x5F,0x30,0x30,0x01,0xEF,

                        0x70,0x12,0x38,0x03,0x00,0x01,0x00,0x0C,0x00,0x00,0x00,0x00,0x00,0x1E,0x38,0x04,
                        0x08,0x78,0x4E,0x77,0x09,0x00,0x0F,0x00,0x00,0x00,0x9F,0xF0,0x00,0x01,0xFF,0x01,
                        0x00,0x01,0xFF,0x01,0x00,0x60,0x03,0x00,0x14,0x07,0xE8,0x00,0x88,0xFF,0x1D,0x5F,
                        0x04,0x5F,0x81,0xAF,0x00,0x37,0x04,0x2C,0x00,0x03,0x00,0x04,0x00,0xF4,0x00,0x00,
                        0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
                        0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
                        0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
                        0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x90,
                    ];
                    EDID[offset + EDID_DT_CFGBYTE_PIXELCLOCK_L_8K] = ((this.curScreen.ClkFreq / 10) - 1)&0xff;//时钟要先除以10，否则会超出两个字节
                    EDID[offset + EDID_DT_CFGBYTE_PIXELCLOCK_H_8K] = (((this.curScreen.ClkFreq / 10) - 1)>>8)&0xff;
                    EDID[offset + EDID_DT_CFGBYTE_SYNC_WIDTH_L_8K] = this.curScreen.FormatW&0xff;
                    EDID[offset + EDID_DT_CFGBYTE_SYNC_WIDTH_H_8K] = (this.curScreen.FormatW>>8)&0xff;
                    EDID[offset + EDID_DT_CFGBYTE_SYNC_HIGH_L_8K] = this.curScreen.FormatH&0xff;
                    EDID[offset + EDID_DT_CFGBYTE_SYNC_HIGH_H_8K] = (this.curScreen.FormatH>>8)&0xff;
                    EDID[offset + EDID_DT_CFGBYTE_ACTIVE_PIXEL_L_8K] = (this.curScreen.FormatW-1)&0xff;
                    EDID[offset + EDID_DT_CFGBYTE_ACTIVE_PIXEL_H_8K] = ((this.curScreen.FormatW-1)>>8)&0xff;
                    EDID[offset + EDID_DT_CFGBYTE_ACTIVE_LINE_L_8K] = (this.curScreen.FormatH-1)&0xff;
                    EDID[offset + EDID_DT_CFGBYTE_ACTIVE_LINE_H_8K] = ((this.curScreen.FormatH-1)>>8)&0xff;

                    EDID[offset + EDID_DT_CFGBYTE_H_BLANKING_L_8K] = (this.curScreen.HFrontPorch + this.curScreen.HSyncTime + this.curScreen.HBackPorch - 1)&0xff;
                    EDID[offset + EDID_DT_CFGBYTE_H_BLANKING_H_8K] = ((this.curScreen.HFrontPorch + this.curScreen.HSyncTime + this.curScreen.HBackPorch - 1)>>8)&0xff;
                    EDID[offset + EDID_DT_CFGBYTE_H_SYNC_OFFSET_L_8K] = (this.curScreen.HFrontPorch + this.curScreen.HSyncTime - 1)&0xff;
                    EDID[offset + EDID_DT_CFGBYTE_H_SYNC_OFFSET_H_8K] = ((this.curScreen.HFrontPorch + this.curScreen.HSyncTime - 1)>>8)&0xff + 0x80;
                    EDID[offset + EDID_DT_CFGBYTE_H_SYNC_WIDTH_L_8K] = (this.curScreen.HSyncTime - 1)&0xff;
                    EDID[offset + EDID_DT_CFGBYTE_H_SYNC_WIDTH_H_8K] = ((this.curScreen.HSyncTime - 1)>>8)&0xff;
                    EDID[offset + EDID_DT_CFGBYTE_V_BLANKING_L_8K] = (this.curScreen.VFrontPorch + this.curScreen.VSyncTime + this.curScreen.HBackPorch - 1)&0xff;
                    EDID[offset + EDID_DT_CFGBYTE_V_BLANKING_H_8K] = ((this.curScreen.VFrontPorch + this.curScreen.VSyncTime + this.curScreen.HBackPorch - 1)>>8)&0xff;
                    EDID[offset + EDID_DT_CFGBYTE_V_SYNC_OFFSET_L_8K] = (this.curScreen.VFrontPorch - this.curScreen.VSyncTime - 1)&0xff;
                    EDID[offset + EDID_DT_CFGBYTE_V_SYNC_OFFSET_H_8K] = ((this.curScreen.VFrontPorch - this.curScreen.VSyncTime - 1)>>8)&0xff;
                    EDID[offset + EDID_DT_CFGBYTE_V_SYNC_WIDTH_L_8K] = (this.curScreen.VSyncTime - 1)&0xff;
                    EDID[offset + EDID_DT_CFGBYTE_V_SYNC_WIDTH_H_8K] = ((this.curScreen.VSyncTime - 1)>>8)&0xff;

                    let sum = 0;
                    for(let i = 129; i < 60; i++)
                    {
                        sum += EDID[i];
                    }
                    EDID[127 + 2 + 60] = (0x100 - (sum&0xff))&0xff;//checksum

                }
                else{
                    {
                        let offset = EDID_DETAILED_TIMING_OFFSET;
                        EDID=[
                            0x00,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0x00,0x2F,0x33,0x05,0x68,0x78,0x56,0x34,0x12,
                            0x2E,0x19,0x01,0x03,0x80,0x3E,0x22,0x78,0xEA,0x08,0xA5,0xA2,0x57,0x4F,0xA2,0x28,
                            0x0F,0x50,0x54,0xA5,0x4B,0x00,0xD1,0xC0,0xA9,0x40,0x81,0x80,0x81,0x00,0x71,0x4F,
                            0xE1,0x00,0x01,0x01,0x01,0x01,0x4D,0xD0,0x00,0xA0,0xF0,0x70,0x3E,0x80,0x30,0x20,
                            0x35,0x00,0x5F,0x59,0x21,0x00,0x00,0x1A,0xA3,0x66,0x00,0xA0,0xF0,0x70,0x1F,0x80,
                            0x30,0x20,0x35,0x00,0x55,0x50,0x21,0x00,0x00,0x1A,0x00,0x00,0x00,0xFF,0x00,0x49,
                            0x54,0x36,0x38,0x30,0x35,0x45,0x56,0x42,0x33,0x38,0x34,0x30,0x00,0x00,0x00,0xFC,
                            0x00,0x4B,0x59,0x53,0x2D,0x39,0x30,0x30,0x30,0x50,0x30,0x5F,0x30,0x30,0x01,0xEF,

                            0x02,0x03,0x37,0xF1,0x51,0x61,0x00,0x5F,0x5E,0x5D,0x10,0x1F,0x20,0x05,0x14,0x04,
                            0x13,0x12,0x11,0x03,0x02,0x01,0x23,0x09,0x07,0x07,0x83,0x01,0x00,0x00,0x6D,0x03,
                            0x0C,0x00,0x10,0x00,0x00,0x3C,0x20,0x00,0x60,0x01,0x02,0x03,0x67,0xD8,0x5D,0xC4,
                            0x01,0x78,0x80,0x03,0x02,0x0F,0x03,0x56,0x5E,0x00,0xA0,0xA0,0xA0,0x29,0x50,0x30,
                            0x20,0x35,0x00,0x55,0x50,0x21,0x00,0x00,0x1E,0x02,0x3A,0x80,0x18,0x71,0x38,0x2D,
                            0x40,0x58,0x2C,0x45,0x00,0xE0,0x0E,0x11,0x00,0x00,0x1E,0x01,0x1D,0x00,0x72,0x51,
                            0xD0,0x1E,0x20,0x6E,0x28,0x55,0x00,0x40,0xB4,0x10,0x00,0x00,0x1E,0x00,0x00,0x00,
                            0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xA1,
                        ];
                        EDID[offset + EDID_DT_CFGBYTE_PIXELCLOCK_L] = (this.curScreen.ClkFreq / 10)&0xff;//时钟要先除以10，否则会超出两个字节
                        EDID[offset + EDID_DT_CFGBYTE_PIXELCLOCK_H] = ((this.curScreen.ClkFreq / 10)>>8)&0xff;
                        EDID[offset + EDID_DT_CFGBYTE_H_ACTIVE_L] = this.curScreen.FormatW&0xff;
                        EDID[offset + EDID_DT_CFGBYTE_H_BLANKING_L] = (this.curScreen.HFrontPorch + this.curScreen.HSyncTime + this.curScreen.HBackPorch)&0xff;
                        EDID[offset + EDID_DT_CFGBYTE_H_ACTIVE_H] = ((this.curScreen.FormatW>>8)&0x0f)<<4;
                        EDID[offset + EDID_DT_CFGBYTE_H_BLANKING_H] |= ((this.curScreen.HFrontPorch + this.curScreen.HSyncTime + this.curScreen.HBackPorch)>>8)&0x0f;

                        EDID[offset + EDID_DT_CFGBYTE_V_ACTIVE_L] = this.curScreen.FormatH&0xff;
                        EDID[offset + EDID_DT_CFGBYTE_V_BLANKING_L] = (this.curScreen.VFrontPorch + this.curScreen.VSyncTime + this.curScreen.VBackPorch)&0xff;
                        EDID[offset + EDID_DT_CFGBYTE_V_ACTIVE_H] = ((this.curScreen.FormatH>>8)&0x0f)<<4;
                        EDID[offset + EDID_DT_CFGBYTE_V_BLANKING_H] |= ((this.curScreen.VFrontPorch + this.curScreen.VSyncTime + this.curScreen.VBackPorch)>>8)&0x0f;
                        EDID[offset + EDID_DT_CFGBYTE_H_SYNC_OFFSET_L] = (this.curScreen.HFrontPorch)&0xff;
                        EDID[offset + EDID_DT_CFGBYTE_H_SYNC_WIDTH_L] = this.curScreen.HSyncTime&0xff;
                        EDID[offset + EDID_DT_CFGBYTE_V_SYNC_OFFSET_L] = ((this.curScreen.VFrontPorch)&0x0f)<<4;
                        EDID[offset + EDID_DT_CFGBYTE_V_SYNC_WIDTH_L] |= this.curScreen.VSyncTime&0x0f;
                        EDID[offset + EDID_DT_CFGBYTE_H_SYNC_OFFSET_H] = (((this.curScreen.HFrontPorch)>>8)&0x3)<<6;
                        EDID[offset + EDID_DT_CFGBYTE_H_SYNC_WIDTH_H] |= ((this.curScreen.HSyncTime>>8)&0x3)<<4;
                        EDID[offset + EDID_DT_CFGBYTE_V_SYNC_OFFSET_H] |= (((this.curScreen.VFrontPorch)>>4)&0x3)<<2;
                        EDID[offset + EDID_DT_CFGBYTE_V_SYNC_WIDTH_H] |= ((this.curScreen.VSyncTime>>4)&0x3)<<0;

                        let sum = 0;
                        for(let i = 0; i < 127; i++)
                        {
                            sum += EDID[i];
                        }
                        EDID[127] = (0x100 - (sum&0xff))&0xff;//checksum
                    }
                }

                this.EDID=EDID;

            },

            cancelSubmit(){
                this.$emit('sub_event',{act:'close_edid_advanced',info:{},advanceScreen:{}});
            },
            submit(){
                //提交
                // this.calEdid();
                // let num=this.globalEvent.sourceCardNumber();
                // let param={
                //     devId:parseInt(this.devId),
                //     srcCardId:num[0],
                //     srcId:num[1],
                //     EdidDataArr:this.EDID
                // };
                // if(this.$parent.showDialog=='edid'){
                //     param.srcCardId=0xff;
                // }
                this.$emit('sub_event',{act:'sure_edid_advanced',info:{},advanceScreen:this.curScreen});
                // this.$http.post("srcEdidWr.cgi",param,()=>{
                //     this.$emit('sub_event',{act:'close_edid_advanced'});
                // });
            }
        }
    }
</script>

<style scoped>
    .time_seq{width: 540px;margin: 0 auto;}
    .time_seq > div{width:50%;padding:0;height:auto;}
    .time_seq .left_body{border:none;}
    .row_item{display:flex;margin-bottom:20px;height:30px;line-height:30px;width:80%;}
    .item_title{width:45%;text-align:left;}
    .item_input{width:55%}
</style>