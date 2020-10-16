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
            "windowItem":'window_item_name',
            "sourceCardName":'source_card_name',  //信号源
        },
        srcGroupLocalName:[],//信号源分组名称
        carouseLocalName:[],//信号源分组名称
        userSceneLocalName:[],//用户模式名称
        sourceCardLocalName:{},//输入卡 名称
        windowItemLocalName:{},//窗口名
    },
    created(){
        // this.opSrcGroupName('load');
        // this.opCarouseName('load');
        this.loadLocalName();
    },
    methods:{
        sourceCardNumber(){
            let label_info=this.selectedCard.label_info;
            let num=[0,0];
            if(label_info!==undefined){
                num=label_info.split("_");
                num=num.map((v)=>{return parseInt(v);});
            }
            return num;
        },
        signalCardInfo(i,k){
            //用来表明 信号卡 的位置
            return i+'_'+k;
        },
        signalCardName(i,k){
            let name='S'+(parseInt(i)+1)+'_'+(parseInt(k)+1);
            let key='source_name_'+i+'_'+k;
            if(this.sourceCardLocalName[key]!==undefined){
                name=this.sourceCardLocalName[key];
            }
            return name;
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

            key=this.keys.sourceCardName;
            name=localStorage.getItem(key);
            if(name!==null){
                this.sourceCardLocalName=JSON.parse(name);
            }
        },
        loadWindowLocalName(){
            let key=this.keys.windowItem+'_'+this.curScreenIndex;
            let name=localStorage.getItem(key);
            if(name!==null){
                this.windowItemLocalName=JSON.parse(name);
            }
        },
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
            else if(type=='sourceCardName'){
                this.sourceCardLocalName={};
                for(let i in dataList){
                    for(let k in dataList[i].srcArr){
                        let ke='source_name_'+i+'_'+k;
                        this.sourceCardLocalName[ke]=dataList[i].srcArr[k].label_extra;
                    }
                }

                localStorage.setItem(key,JSON.stringify(this.sourceCardLocalName));
            }
        },
        uploadFile(con={}){
            let param=Object.assign({input:'',uploadBtn:''},con);
            if(param.input==''){
                return ;
            }
            if(param.uploadBtn==''){
                return ;
            }

            param.uploadBtn.addEventListener("click",()=>{
                let file=param.input.files[0];
                let totalSize=file.size;
                let fragment=1024*1024;
                let fragmentCount= Math.ceil(totalSize / fragment);

                let upload=function(i){
                    if(i>=fragmentCount-1){
                        return ;
                    }
                    let start = i * fragment,
                        end = Math.min(totalSize, start + fragment);
                    let form = new FormData();
                    form.append("data", file.slice(start,end));  //slice方法用于切出文件的一部分

                    this.$http.post("",form,()=>{
                        upload(i+1);
                    });
                };

                upload(0);

            })
        }
    }
});

export default gobalEvent