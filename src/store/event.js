import Vue from 'vue'
import Axios from '../axios';
Vue.prototype.$http = Axios;
Vue.prototype.LANGUAGE={
    zh:require("./zh.json"),
    en:require("./en.json"),
};

let gobalEvent =new Vue({
    data:{
        gMode:0,//0正常，1演示
        version:'1.0',
        versionDate:'Dec 17 2020 15:09:30',
        modeInfo:{
            inCardInfo:{},
            outCardInfo:{}
        },
        userModel:1,//用户模式id
        userInfo:{
            username:'',
            password:'',
            type:0
        },
        nameInfo:{},
        outPutInfo:{},//输出端口
        language:'zh',
        pType:{
            'p0':'DEFAULT',
            'p1':'CVBS',
            'p2':'DVI',
            'p3':'VGA',
            'p4':'HDMI',
            'p5':'SDI',
            'p6':'YPBPR',
            'p7':'SVIDEO',
            'p8':'D_DVI',
            'p9':'HDMI4K',
            'p10':'DP',
            'p11':'NET',
            'p12':'FIBER',
            'p13':'BaseT',
            'p14':'CVBS',
            'p15':'USB',
            'p16':'HDDP4K',
            'p17':'HS',
            'p18':'HDDP4K30',
            'p1617':'DP4K60',
            'p1618':'HD4K60',
            'p1817':'DP4K30',
            'p1818':'HD4K30',
            'p255':'NONE'},
        panelLock:false,//模拟区域不允许操作
        validOutCardCount:0,//有效输出屏总数
        totalWidth:0,//屏幕墙尺寸
        totalHeight:0,
        windowItemsInfo:{},
        selectedWindowIndex:-1,

        selectedCard:{

        },
        screenInfo:{},//所有屏幕墙
        curScreenIndex:-1,//当前操作的屏幕序号，/vdr index.vue
        selectedPort:-1,//屏幕参数设置，选择端口
        inputCardList:[],//signal index.vue 初始化
        commonInfo:{},
        sceneCarousel:{},//用户场景轮巡
        versionInfo:{},
        alert:{
            outResource:"没有足够的板卡资源，操作失败",
        },
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
    // created(){
    //     this.loadName();
    //
    // },
    methods:{
        sourceCardNumber(){
            let label_info=this.selectedCard.label_info;
            let num=[0,0];
            if(label_info!==undefined){
                num=label_info.split("_");
                num=num.map((v,k)=>parseInt(v));
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
            if(this.language=='en'){
                s="User mode "+(parseInt(seq)+1);
            }
            if(this.userSceneLocalName[k]!==undefined){
                s=this.userSceneLocalName[k];

                let mid=s.split(" ");
                if(this.language=='en' && mid[0]=='用户模式'){
                    mid[0]="User mode";
                    s=mid.join(" ");
                }
                else if(this.language=='zh' && mid[0]=='User' && mid[1]=='mode'){
                    mid[0]="用户模式";
                    mid[1]='';
                    s=mid.join(" ");
                }
            }
            return s;
        },
        carouseName(scene){
            let s="场景轮巡 "+scene.sceneId;
            if(this.language=='en'){
                s="Layout loop "+scene.sceneId;
            }
            if(this.carouseLocalName[scene.sceneId]!==undefined){
                s=this.carouseLocalName[scene.sceneId];

                let mid=s.split(" ");
                if(this.language=='en' && mid[0]=='场景轮巡'){
                    mid[0]="Layout loop";
                    s=mid.join(" ");
                }
                else if(this.language=='zh' && mid[0]=='Layout' && mid[1]=='loop'){
                    mid[0]="场景轮巡";
                    mid[1]='';
                    s=mid.join(" ");
                }
            }

            return s;
        },
        windowItemName(screenId,i){
            let k="window_item_"+i;
            let s='';
            if(this.windowItemLocalName[k]!==undefined){
                s=this.windowItemLocalName[k];
            }
            return s;
        },

        srcGroupName(group){
            //信号源分组名称
            let s="信号源分组 "+(parseInt(group.srcGroupId)+1)
            if(this.language=='en'){
                s="Source group "+(parseInt(group.srcGroupId)+1);
            }
            if(this.srcGroupLocalName[group.srcGroupId]!==undefined){
                s=this.srcGroupLocalName[group.srcGroupId];

                let mid=s.split(" ");
                if(this.language=='en' && mid[0]=='信号源分组'){
                    mid[0]="Source group";
                    s=mid.join(" ");
                }
                else if(this.language=='zh' && mid[0]=='Source' && mid[1]=='group'){
                    mid[0]="信号源分组";
                    mid[1]='';
                    s=mid.join(" ");
                }
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
                    let k="window_item_"+i;
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
        isValidResolution(resolArr){
            //从分辨率判断，输入信号是否存在
            return resolArr[1]>200 && resolArr[0]>300
        },
        loadPacket(totalNum){
            let packetId=0;
            let buffer=[];
            let that=this;
            let loadFile=function () {
                if(packetId>=totalNum){
                    let unitBuffer=new Uint8Array(buffer);
                    let blob = new Blob([unitBuffer]);
                    let reader = new FileReader();
                        reader.readAsText(blob, 'utf-8');
                        reader.onload = function (e) {
                            let nameInfo={};
                            try{
                                nameInfo=that.transFormatStr(JSON.parse(reader.result),'web');
                            }
                            catch(err){
                                return ;
                            }
                            that.globalEvent.nameInfo=nameInfo;
                            for(let key in nameInfo){
                                if(typeof nameInfo[key] =='string')
                                    localStorage.setItem(key,nameInfo[key]);
                                else
                                    localStorage.setItem(key,JSON.stringify(nameInfo[key]))

                                if(key==that.keys['sceneUserName']){
                                    //记录文件 已命名文件
                                    for(let existKey in nameInfo[key]){
                                        that.editName(nameInfo[key][existKey],that.keys['sceneUserName'])
                                    }
                                }
                                else if(key==that.keys['sceneUserName']){
                                    for(let existKey in nameInfo[key]){
                                        that.editName(nameInfo[key][existKey],that.keys['sourceCardName'])
                                    }
                                }
                                else if(key==that.keys['sceneCarouse']){
                                    for(let existKey in nameInfo[key]){
                                        that.editName(nameInfo[key][existKey],that.keys['sceneCarouse'])
                                    }
                                }
                                else if(key==that.keys['srcGroup']){
                                    for(let existKey in nameInfo[key]){
                                        that.editName(nameInfo[key][existKey],that.keys['srcGroup'])
                                    }
                                }
                            }
                            that.loadLocalName();
                            that.$emit('load_name_complete');
                        }
                    return ;
                }
                that.$http.post("renameCfgRd.cgi",{opr:0xff,packetId},(ret)=>{
                    packetId++;
                    let data=ret.data.dataArr;
                    data.forEach((v,i,arr)=>{
                        buffer.push(v);
                    })

                    loadFile();
                });
            }

            loadFile();
        },
        // testLoadName(){
        //     let that=this;
        //     this.$http.post("renameRd.cgi",{},(ret)=>{
        //         localStorage.clear();
        //         sessionStorage.clear();
        //         sessionStorage.setItem("login_user",JSON.stringify(this.globalEvent.userInfo));//恢复当前用户信息
        //         let nameInfo={};
        //         try{
        //             nameInfo=that.transFormatStr(ret.data,'web');
        //             console.log(nameInfo);
        //         }
        //         catch(err){
        //             return ;
        //         }
        //         that.globalEvent.nameInfo=nameInfo;
        //         for(let key in nameInfo){
        //             if(typeof nameInfo[key] =='string')
        //                 localStorage.setItem(key,nameInfo[key]);
        //             else
        //                 localStorage.setItem(key,JSON.stringify(nameInfo[key]))
        //
        //             if(key==that.keys['sceneUserName']){
        //                 //记录文件 已命名文件
        //                 for(let existKey in nameInfo[key]){
        //                     that.editName(nameInfo[key][existKey],that.keys['sceneUserName'])
        //                 }
        //             }
        //             else if(key==that.keys['sceneUserName']){
        //                 for(let existKey in nameInfo[key]){
        //                     that.editName(nameInfo[key][existKey],that.keys['sourceCardName'])
        //                 }
        //             }
        //             else if(key==that.keys['sceneCarouse']){
        //                 for(let existKey in nameInfo[key]){
        //                     that.editName(nameInfo[key][existKey],that.keys['sceneCarouse'])
        //                 }
        //             }
        //             else if(key==that.keys['srcGroup']){
        //                 for(let existKey in nameInfo[key]){
        //                     that.editName(nameInfo[key][existKey],that.keys['srcGroup'])
        //                 }
        //             }
        //         }
        //         this.loadLocalName();
        //         this.$emit('load_name_complete');
        //     });
        // },
        loadName(){
            // this.testLoadName();//todo delete
            // return ;
            let totalNum=0;
            this.$http.post("renameCfgRd.cgi",{opr:0},(ret)=>{
                this.globalEvent.userInfo=JSON.parse(sessionStorage.getItem("login_user"));
                localStorage.clear();
                sessionStorage.clear();
                sessionStorage.setItem("login_user",JSON.stringify(this.globalEvent.userInfo));//恢复当前用户信息
                let data=ret.data;
                totalNum=data.packetNum;
                if(totalNum>0){
                    this.loadPacket(totalNum);
                }
                else{
                    this.$emit('load_name_complete');
                }
            });
        },
        isSavedName(name,pkey=''){
            let key=pkey+"_saved_name_"+name;
            return sessionStorage.getItem(key,name)!==null;
        },
        editName(name,pkey){
            let key=pkey+"_saved_name_"+name;
            sessionStorage.setItem(key,name);
        },
        saveName(){
            let nameInfo=this.globalEvent.nameInfo;
            let that=this;
            for(let k in this.keys){

                let info=localStorage.getItem(this.keys[k]);
                if(info!==null){
                    info=JSON.parse(info);
                    if(k=='sceneUserName'){
                        for(let existKey in info){
                            if(!that.isSavedName(info[existKey],this.keys[k])){
                                delete info[existKey];
                            }
                        }
                    }
                    else if(k=='sourceCardName'){
                        for(let existKey in info){
                            if(!that.isSavedName(info[existKey],this.keys[k])){
                                delete info[existKey];
                            }
                        }
                    }
                    else if(k=='sceneCarouse'){
                        let newInfo={};
                        for(let i in info){
                            if(that.isSavedName(info[i],this.keys[k])){
                                newInfo[i]=info[i];
                            }
                        }
                        info=newInfo;
                    }
                    else if(k=='srcGroup'){
                        let newInfo={};
                        for(let i in info){
                            if(that.isSavedName(info[i],this.keys[k])){
                                newInfo[i]=info[i];
                            }
                        }
                        info=newInfo;
                    }
                    nameInfo[that.keys[k]]=info;
                }
            }

            let windowNameInfo={};

            for(let k in this.screenInfo.scrGroupArr){
                let key=this.keys.windowItem+'_'+k;
                let info=localStorage.getItem(key);
                if(info!=null){
                    info=JSON.parse(info);
                    for(let infoKey in info){
                        if(info[infoKey]==''){
                            delete info[infoKey];
                        }
                    }
                    if(Object.keys(info).length>0){
                        windowNameInfo[key]=info;
                    }

                }
            }

            if(Object.keys(windowNameInfo).length>0){
                nameInfo['userModel'+this.globalEvent.userModel]=windowNameInfo;
            }
            else{
                delete nameInfo['userModel'+this.globalEvent.userModel];
            }



            let nameInfoStr=this.transFormatStr(nameInfo,'pc');//JSON.stringify(nameInfo);

            let blob = new Blob([nameInfoStr]);
            let reader=new FileReader(blob);
                reader.readAsArrayBuffer(blob);
                reader.onload=function () {
                    let buffer=reader.result;
                    let hexBuffer=Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2));
                    // let hexBufferNumberArr=hexBuffer.map((v,k)=>Number('0x'+v))
                    that.$http.post("renameCfgWr.cgi",{opr:0,fileSize:hexBuffer.length},(ret)=>{
                        if(ret.data.result==1){
                            that.uploadName(hexBuffer);
                        }
                        else{
                            console.log("擦除数据失败");
                        }
                    });
                }
        },
        uploadName(hexBuffer){
            this.LANG=this.LANGUAGE[this.language];
            let curPacketId=0;
            let fragment=1024;
            let totalSize=hexBuffer.length;
            let fragmentCount=Math.ceil(totalSize/fragment);
            let that=this;
            let uploadFile=function(){
                let i = curPacketId;
                if(i>=fragmentCount){

                    window.loading.close();
                    that.$emit("upload_name_complete");
                    return ;
                }
                let start = i * fragment,
                    end = Math.min(totalSize, start + fragment);


                let d={
                    opr:1,
                    packetNum:fragmentCount,
                    packetId:i,
                    dataArr:hexBuffer.slice(start,end).map((v,k)=>Number('0x'+v))
                };


                window.loading.setText(that.LANG.EXPORT_IN_PROGRESS+" ..."+ Math.floor(i/fragmentCount*100)+'%');

                that.$http.post("renameCfgWr.cgi",d,(ret)=>{

                    if(ret.data.result==0){
                        //未正确接收
                        alert(that.LANG.ALERT_API_ERROR);
                        console.log("下发数据未正确接收:",d.packetId,d.packetNum);
                    }
                    else{
                        curPacketId++;
                        uploadFile();
                    }
                });
            };

            uploadFile();

        },
        transFormatStr(nameInfo,act='pc'){
            if(act=='pc'){
                let newNameInfo={
                    'srcGroupInfo':[],
                    'sceneLoopInfo':[],
                    'userModeInfo':[],
                    'sourceInfo':[],
                    'winInfo':[]
                };
                for(let k in nameInfo[this.keys['srcGroup']]){
                    let item={};
                    item['id']=parseInt(k);
                    item['name']=nameInfo[this.keys['srcGroup']][k];
                    newNameInfo.srcGroupInfo.push(item);
                }
                for(let k in nameInfo[this.keys['sceneCarouse']]){
                    let item={};
                    item['id']=parseInt(k);
                    item['name']=nameInfo[this.keys['sceneCarouse']][k];
                    newNameInfo.sceneLoopInfo.push(item);
                }
                for(let k in nameInfo[this.keys['sceneUserName']]){
                    let item={};
                    item['id']=parseInt(k.replace('user_scene_',''))+1;
                    item['name']=nameInfo[this.keys['sceneUserName']][k];
                    newNameInfo.userModeInfo.push(item);
                }

                let tempCard={};
                for(let k in nameInfo[this.keys['sourceCardName']]){
                    let mid=k.split("_");
                    if(typeof tempCard[mid[2]] == 'undefined'){
                        tempCard[mid[2]]=[]
                    }

                    let item={};
                    item['id']=parseInt(mid[3]);
                    item['name']=nameInfo[this.keys['sourceCardName']][k];
                    tempCard[mid[2]].push(item);
                }
                for(let k in tempCard){
                    newNameInfo.sourceInfo.push(
                        {
                            cardId:parseInt(k),
                            chnArr:tempCard[k]
                        }
                    );

                }

                for(let k in nameInfo){
                    if(k.indexOf('userModel')>-1){
                        // let mode=parseInt(k.replace('userModel',''));
                        let modeInfo={
                            usermode:parseInt(k.replace('userModel','')),
                            scrGroupArr:[]
                        };

                        for(let j in nameInfo[k]){
                            let srcGroup={
                                scrGroup:parseInt(j.replace('window_item_name_','')),
                                winArr:[]
                            };

                            for(let i in nameInfo[k][j]){
                                srcGroup.winArr.push(
                                    {
                                        id:parseInt(i.replace('window_item_','')),
                                        name:nameInfo[k][j][i]
                                    }
                                );
                            }

                            modeInfo.scrGroupArr.push(srcGroup);
                        }

                        newNameInfo.winInfo.push(modeInfo);
                    }
                }

                return JSON.stringify(newNameInfo)
            }
            else{
                let newNameInfo={};
                for(let key in nameInfo){
                    if(key=='srcGroupInfo'){
                        // newNameInfo[this.keys['srcGroup']]={};
                        let srcGroup={};
                        for(let i in nameInfo['srcGroupInfo']){
                            let info=nameInfo['srcGroupInfo'][i];
                            srcGroup[info.id]=info.name;
                        }
                        if(Object.keys(srcGroup).length>0){
                            newNameInfo[this.keys['srcGroup']]=srcGroup;
                        }
                    }
                    else if(key=='sceneLoopInfo'){
                        let srcGroup={};
                        for(let i in nameInfo['sceneLoopInfo']){
                            let info=nameInfo['sceneLoopInfo'][i];
                            srcGroup[info.id]=info.name;
                        }
                        if(Object.keys(srcGroup).length>0){
                            newNameInfo[this.keys['sceneCarouse']]=srcGroup;
                        }
                    }
                    else if(key=='userModeInfo'){
                        let srcGroup={};
                        for(let i in nameInfo['userModeInfo']){
                            let info=nameInfo['userModeInfo'][i];
                            srcGroup['user_scene_'+(info.id-1)]=info.name;
                        }
                        if(Object.keys(srcGroup).length>0){
                            newNameInfo[this.keys['sceneUserName']]=srcGroup;
                        }
                    }
                    else if(key=='sourceInfo'){
                        let card={};
                        for(let i in nameInfo['sourceInfo']){
                            let cardId=nameInfo['sourceInfo'][i].cardId;

                            for(let j in nameInfo['sourceInfo'][i].chnArr){
                                let chn=nameInfo['sourceInfo'][i].chnArr[j];
                                card['source_name_'+cardId+'_'+chn.id]=chn.name;
                            }
                        }
                        if(Object.keys(card).length>0){
                            newNameInfo[this.keys['sourceCardName']]=card;
                        }
                    }
                    else if(key=='winInfo'){
                        //model
                        for(let i in nameInfo['winInfo']){
                            let mode=nameInfo['winInfo'][i];
                            let newScrGroup={};
                            for(let j in mode.scrGroupArr){
                                let scrGroup=mode.scrGroupArr[j];
                                let scr='window_item_name_'+scrGroup.scrGroup;

                                newScrGroup[scr]={};
                                for(let k in scrGroup.winArr){
                                    let win='window_item_'+scrGroup.winArr[k].id;
                                    newScrGroup[scr][win]=scrGroup.winArr[k].name;
                                }

                            }
                            newNameInfo['userModel'+mode.usermode]=newScrGroup;

                        }
                    }
                }
                return newNameInfo;
            }
        }
    }
});

export default gobalEvent