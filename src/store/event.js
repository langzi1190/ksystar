import Vue from 'vue'

let gobalEvent =new Vue({
    data:{
        pType:{
            'p0':'DEFAULLT',
            'p1':'CV',
            'p2':'DVI',
            'p3':'VGA',
            'p4':'HDMI',
            'p5':'SDI',
            'p6':'YPBPR',
            'p7':'SVIDEO',
            'p8':'DUAL_DVI',
            'p9':'HDMI_4K30',
            'p10':'DP',
            'p11':'NET',
            'p12':'FIBER',
            'p13':'HDBASET',
            'p14':'CV2',
            'p15':'USB',
            'p16':'HDMI4K_DP4K',
            'p17':'HDMISDI',
            'p18':'HDMIDP4K30',
            'p255':'NONE'},
        validOutCardCount:0,//有效输出屏总数
        totalWidth:0,//屏幕墙尺寸
        totalHeight:0,
        windowItemsInfo:{},
        selectedWindowIndex:-1,

        selectedCard:{

        },
        screenInfo:{},//所有屏幕墙
        curScreenIndex:-1,//当前操作的屏幕序号，/vdr index.vue
        selectedPort:0,//屏幕参数设置，选择端口
    },
    methods:{

    }
});

export default gobalEvent