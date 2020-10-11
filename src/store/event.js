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
        inputCardList:[],//signal index.vue 初始化
        commonInfo:{},
        sceneCarousel:{},//用户场景轮巡
        versionInfo:{},

        keys:{
            'srcGroup':'src_group_name',//源组
            'sceneCarouse':'scene_carouse_name',//轮巡
            'sceneUserName':'scene_user_name',//用户模式
            "windowItem":'window_item_name'
        },
        srcGroupLocalName:[],//信号源分组名称
        carouseLocalName:[],//信号源分组名称
        userSceneLocalName:[],//用户模式名称
        windowItemLocalName:{},//窗口名
    },
    created(){
        // this.opSrcGroupName('load');
        // this.opCarouseName('load');
        this.loadLocalName();
    },
    methods:{
        sourceCardNumber(){
            let label_extra=this.selectedCard.label_extra;
            let num=[0,0];
            if(label_extra!==undefined){
                label_extra=label_extra.replace('S','');
                num=label_extra.split("_");
                num=num.map((v)=>{return parseInt(v)-1;});
            }
            return num;
        },
        // cardLabelExtra(cardId,srcId){
        //     return 'S'+(cardId+1)+'_'+(srcId+1);
        // },

        signalCardName(i,k){
            return 'S'+(parseInt(i)+1)+'_'+(parseInt(k)+1);
        },
        userSceneName(seq){
            let k='user_scene_'+seq;
            let s="用户模式 "+(parseInt(seq)+1);
            if(this.userSceneLocalName[k]!==undefined){
                s=this.userSceneLocalName[k];
            }
            return s;
        },
        carouseName(scene){
            let s="场景轮巡 "+scene.sceneId;
            if(this.carouseLocalName[scene.sceneId]!==undefined){
                s=this.carouseLocalName[scene.sceneId];
            }

            return s;
        },
        windowItemName(screenId,cardId,srcId){
            let k="window_item_"+cardId+"_"+srcId;
            let s=this.signalCardName(cardId,srcId);
            if(this.windowItemLocalName[k]!==undefined){
                s=this.windowItemLocalName[k];
            }
            return s;
        },

        srcGroupName(group){
            //信号源分组名称
            let s="信号源分组 "+(parseInt(group.srcGroupId)+1)
            if(this.srcGroupLocalName[group.srcGroupId]!==undefined){
                s=this.srcGroupLocalName[group.srcGroupId];
            }
            return s;
        },
        loadLocalName(){
            let key=this.keys.sceneCarouse;
            let name=localStorage.getItem(key);
            if(name!=null){
                this.carouseLocalName=JSON.parse(name);
            }

            key=this.keys.srcGroup;
            name=localStorage.getItem(key);
            if(name!==null){
                this.srcGroupLocalName=JSON.parse(name);
            }

            key=this.keys.sceneUserName;
            name=localStorage.getItem(key);
            if(name!==null){
                this.userSceneLocalName=JSON.parse(name);
            }
        },
        loadWindowLocalName(){
            let key=this.keys.windowItem+'_'+this.curScreenIndex;
            let name=localStorage.getItem(key);
            if(name!==null){
                this.windowItemLocalName=JSON.parse(name);
            }
        },
        // opCarouseName(act){
        //     //load
        //     let key=this.keys.sceneCarouse;
        //     let name=localStorage.getItem(key);
        //     if(name!=null){
        //         this.carouseLocalName=JSON.parse(name);
        //     }
        // },
        // opSrcGroupName(act){
        //     let key=this.keys.srcGroup;
        //
        //     if(act=='load'){
        //         let name=localStorage.getItem(key);
        //         if(name!==null){
        //             this.srcGroupLocalName=JSON.parse(name);
        //         }
        //     }
        // },
        syncLocalName(type,dataList){
            let key=this.keys[type];
            if(type=='srcGroup'){
                this.srcGroupLocalName=[];
                for(let i in dataList){
                    this.srcGroupLocalName.push(dataList[i].label);
                }

                localStorage.setItem(key,JSON.stringify(this.srcGroupLocalName))
            }
            else if(type=='sceneCarouse'){
                this.carouseLocalName=[];
                for(let i in dataList){
                    this.carouseLocalName.push(dataList[i].label);
                }
                localStorage.setItem(key,JSON.stringify(this.carouseLocalName))
            }
            else if(type=='sceneUserName'){
                this.userSceneLocalName={};
                for(let i in dataList){
                    let k='user_scene_'+i;
                    this.userSceneLocalName[k]=dataList[i].label;
                }
                localStorage.setItem(key,JSON.stringify(this.userSceneLocalName));
            }
            else if(type=='windowItem' && this.curScreenIndex>-1){

                key=key+"_"+this.curScreenIndex;
                this.windowItemLocalName={};
                for(let i in dataList){
                    let k="window_item_"+dataList[i].srcCardId+"_"+dataList[i].srcId;
                    this.windowItemLocalName[k]=dataList[i].label;
                }

                // this.windowItemLocalName={'window_item_0_1':'xxx','window_item_0_0':'yyy'};
                localStorage.setItem(key,JSON.stringify(this.windowItemLocalName));
            }
        }
    }
});

export default gobalEvent