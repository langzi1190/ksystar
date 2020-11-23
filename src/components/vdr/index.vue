<template>
    <div class="draw-vdr">
        <!-- 网格 -->
        <div class="grids" :style="{height:ratioHeight+'px',width:ratioWidth+'px'}">
            <div class="line_h"
                 v-for="(item,index) in lineH"
                 :style="{
                 borderStyle:index%2==0?'dashed':'solid',
                 top:item*ratio+'px',
                 width:totalWidth*ratio+'px',
             }"
            ></div>
            <div class="line_v"
                 v-for="(item,index) in lineV"
                 :style="{
                 borderStyle:index%2==0?'dashed':'solid',
                 left:item*ratio+'px',
                 height:totalHeight*ratio+'px',
             }"
            ></div>

            <template v-for="(val,index) in totalCard">
                <div :style="cardNumberStyle(index)">{{val}}</div>
            </template>
        </div>
        <div
                id="grids"
                @wheel="mouseWheel"
                :style="`height: ${ratioHeight}px; width: ${ratioWidth}px; position: relative;`"
        >
            <div class="dragRect"
                 v-show="dragRect.w>0"
                 :style="{
                    left:dragRect.x+'px',
                    top:dragRect.y+'px',
                    width:dragRect.w+'px',
                    height:dragRect.h+'px'
                }"></div>
            <windowItem
                    v-for="(item,index) in windowItems"
                    :item="item"
                    :key="item.k"
                    :seq="index"
                    ref="windowObj"
                    :ratio="ratio"
            ></windowItem>
        </div>
    </div>
</template>

<script>
    // let originW=document.body.clientWidth;
    let originW=window.innerWidth;
    import windowItem from "@/components/vdr/windowItem";
    export default {
        data() {
            return {
                // windowList:[],//视频窗口
                activeWindow:-1,
                totalWidth:0,
                totalHeight:0,
                ratio:1,
                scale:1,
                normalWidth:1000,//归一化
                totalLine:0,
                totalCard:0,
                col:0,
                row:0,

                lineH:[],
                lineV:[],
                curScreen:{},//当前屏幕墙
                windowItems:[],//当前屏幕墙所有窗口
                dragRect:{
                    x:0,
                    y:0,
                    w:0,
                    h:0
                },
                refreshWindowItemsEvent:0,
            };
        },
        created() {

            this.globalEvent.$on("add_window_item",(param)=>{
                //添加窗口事件,添加完，可以直接 loadScreenWindowItems，
                this.addWindowItem(param);
            });
            this.globalEvent.$on('load_screen',(param)=>{
                this.loadScreen(param.seq);
            });
            this.globalEvent.$on("close_window_item",(param)=>{
                //关闭窗口
                let data={
                    groupId:this.globalEvent.curScreenIndex
                };
                if(param.act=='all'){
                    this.windowItems=[];
                    this.$http.post("closeAllWin.cgi",data,(ret)=>{

                    });
                }
                else{
                    this.windowItems.splice(this.globalEvent.selectedWindowIndex,1);
                    data.winId=this.globalEvent.selectedWindowIndex;
                    this.$http.post("closeWin.cgi",data,(ret)=>{
                        //重新载入
                        this.loadScreenWindowItems();
                    });
                }



                if(this.windowItems.length==0){
                    this.globalEvent.selectedWindowIndex=-1;
                }
                else{
                    this.globalEvent.selectedWindowIndex=0;
                }

                this.syncLocalName();
            });
            this.globalEvent.$on('update_window',(param)=>{
                //修改窗口属性
                let k =this.globalEvent.selectedWindowIndex;
                if(param.act=='top' || param.act=='bottom'){
                    //置顶,置底,设置为当前最大值，
                    console.log(JSON.parse(JSON.stringify(this.windowItems)));
                    let maxIndexPos=param.act=='top'?this.getMaxIndexPos():this.getMinIndexPos();

                    this.windowItems[maxIndexPos[0]].layerId=this.windowItems[k].layerId;
                    this.windowItems[k].layerId=maxIndexPos[1];
                    //子组件更新参数
                    this.$refs.windowObj[maxIndexPos[0]].setProp(param);
                    this.$refs.windowObj[k].setProp(param);
                    console.log(JSON.parse(JSON.stringify(this.windowItems)));
                    this.$http.post("winLayerWr.cgi",{
                        type:param.act=='top'?1:0,
                        groupId:this.globalEvent.curScreenIndex,
                        winId:k
                    },(ret)=>{
                        console.log("vdr/index.vue 置顶，置底。。。。");
                    });
                }
                else if(param.act=='window_size'){
                    //全屏,扩张，还原
                    this.$refs.windowObj[k].windowEdit(param.v);
                }
                else if(param.act=='lock'){
                    this.windowItems[k].lock=1-this.windowItems[k].lock;
                }
                else if(param.act=='partOrAll'){
                    this.windowItems[k].partOrAll=1-this.windowItems[k].partOrAll;
                    // if(this.windowItems[k].partOrAll==0){
                    //     this.windowItems[k].cropSizeArr=[0,0,0,0];
                    //
                    // }
                    this.windowItems[k].cropSizeArr=param.v;
                    this.syncWindowSize();
                }

            });
            this.globalEvent.$on("update_window_pos_by_side",(param)=>{
                //来自侧边栏的 属性更改通知
                let w=this.globalEvent.selectedWindowIndex;
                let posMap={'cleft':0,'ctop':1,'cwidth':2,'cheight':3};
                //更新窗口属性
                if(['cleft','ctop','cwidth','cheight'].includes(param.act)){
                    this.globalEvent.windowItemsInfo.winArr[w].cropSizeArr[posMap[param.act]]=param.v;

                    if(this.globalEvent.windowItemsInfo.winArr[w].partOrAll==0){
                        //全局 不下发参数
                        return ;
                    }
                    this.$refs.windowObj[w].setWindowSize(param);
                }
                else if(param.act=='label'){
                    // this.$refs.windowObj[w].label=param.v;
                    this.globalEvent.windowItemsInfo.winArr[w].label=param.v;
                    this.syncLocalName();
                }
                else{
                    this.$refs.windowObj[w].setWindowSize(param);
                }
                this.syncWindowSize();
            });

            this.globalEvent.$on("reload_data",()=>{
                //configurescrren.vue 设置完毕 重新载入数据
                this.loadData();
            })

            this.globalEvent.$on("source_card_name_change",()=>{
                //信号源改名，attr/index.uve
                for(let i in this.windowItems){
                    let win=this.windowItems[i];
                    win.inputCardLabel=this.globalEvent.signalCardName(win.srcCardId,win.srcId);
                }
            });


            this.globalEvent.$on("change_src_card",(param)=>{
                let w=this.globalEvent.selectedWindowIndex;
                if(w>-1){
                    this.$refs.windowObj[w].setSrcCard(param.v);
                }

            });

            this.globalEvent.$on("change_src_group",(param)=>{
                let w=this.globalEvent.selectedWindowIndex;
                if(w>-1){
                    this.$refs.windowObj[w].setSrcGroup(param.group);
                }
            });

            this.globalEvent.$on("change_src_group_name",()=>{
                for(let i in this.windowItems){
                    let win=this.windowItems[i];
                    if(win.srcGroupId>0){
                        win.groupLabel=this.globalEvent.srcGroupName({srcGroupId:win.srcGroupId-1});
                    }

                }
            });

            this.loadData();

            window.addEventListener('resize',(e)=>{
                // let curW=document.body.clientWidth;
                let curW=window.innerWidth;
                let z=curW/originW;//缩小的尺寸
                originW=curW;

                this.scale=z*this.scale;

                this.initScreenPanel();
            })
        },
        computed:{
            ratioWidth(){
                return this.totalWidth*this.ratio;
            },
            ratioHeight(){
                return this.totalHeight*this.ratio;
            }
        },
        methods: {
            loadData(){
                //screen_info.json
                if(this.globalEvent.gMode==0){
                    this.$http.get("syncScrInfoRd.cgi",{},(ret)=>{
                        for(let i in ret.data.scrGroupArr){
                            ret.data.scrGroupArr[i].tabName='name'+parseInt(Math.random()*10000);
                        }

                        this.globalEvent.screenInfo=ret.data;

                        this.loadScreen(0)
                    })
                }
                else{
                    this.loadScreen(0)
                }

            },
            loadScreen(seq){

                let curScreen=this.globalEvent.screenInfo.scrGroupArr[seq];
                let portArr=curScreen.portArr;
                this.curScreen=curScreen;
                this.globalEvent.curScreenIndex=seq;

                this.globalEvent.loadWindowLocalName();

                this.row=curScreen.Row;
                this.col=curScreen.Col;
                this.ratio=1;
                this.globalEvent.selectedWindowIndex=-1;

                this.totalCard=this.col*this.row;
                this.totalLine=this.totalCard*4;//虚线
                this.totalWidth=0;
                this.totalHeight=0;
                this.lineH=[];
                this.lineV=[];

                let v=0;
                let h=0;
                for(let i in portArr){
                    if(i<curScreen.Col){
                        this.totalWidth+=parseInt(portArr[i].sizeArr[0]);
                    }
                    if(i%curScreen.Col==0){
                        this.totalHeight+=parseInt(portArr[i].sizeArr[1]);
                    }

                    if(i<curScreen.Col-1){
                        h+=portArr[i].sizeArr[0]/2;
                        this.lineV.push(h);
                        h+=portArr[i].sizeArr[0]/2;
                        this.lineV.push(h);
                    }
                    if(i==curScreen.Col-1){
                        h+=portArr[i].sizeArr[0]/2;
                        this.lineV.push(h);
                    }


                    if(i<curScreen.Row-1){
                        v+=portArr[i].sizeArr[1]/2
                        this.lineH.push(v);
                        v+=portArr[i].sizeArr[1]/2
                        this.lineH.push(v);
                    }
                    if(i==curScreen.Row){
                        v+=portArr[i].sizeArr[1]/2
                        this.lineH.push(v)
                    }
                }


                this.globalEvent.totalWidth=this.totalWidth;
                this.globalEvent.totalHeight=this.totalHeight;
                this.initScreenPanel();
                this.loadScreenWindowItems();
            },
            initScreenPanel(){
                //初始化 屏幕控制区域
                if(this.totalWidth>this.normalWidth*this.scale){
                    this.ratio=this.normalWidth*this.scale/this.totalWidth;
                }
                else{
                    this.ratio=1;
                }
            },
            loadScreenWindowItems(){
                this.windowItems=[];
                if(this.globalEvent.gMode==0){
                    setTimeout(()=>{
                        this.$http.post("syncWinInfoRd.cgi",{scrGroupId:this.globalEvent.curScreenIndex},(ret)=>{
                            // console.log(ret.data);
                            //
                            for(let i in ret.data.winArr){
                                let win=ret.data.winArr[i];
                                win.lock=0;//锁定
                                win.zoom=0;//扩张，还原
                                win.inputCardLabel=this.globalEvent.signalCardName(win.srcCardId,win.srcId);
                                win.resolution=this.globalEvent.inputCardList[win.srcCardId].srcArr[win.srcId].resolArr;
                                // win.portTypeInfo=this.globalEvent.inputCardList[win.srcCardId].srcArr[win.srcId].label;
                                if(!this.globalEvent.isValidResolution(win.resolution)){
                                    win.resolution=['信号丢失']
                                }
                                if(win.srcGroupId>0){
                                    win.groupLabel=this.globalEvent.srcGroupName({srcGroupId:win.srcGroupId-1});
                                }
                                else{
                                    win.groupLabel='';
                                }

                                win.label=this.globalEvent.windowItemName(this.globalEvent.curScreenIndex,i);
                                win.k='k'+parseInt(Math.random()*1000);
                            }
                            this.globalEvent.windowItemsInfo=ret.data;
                            this.windowItems=this.globalEvent.windowItemsInfo.winArr;
                            this.syncLocalName();
                        });
                    },500);
                }

                // this.$http.post("syncWinInfoRd.cgi",{scrGroupId:this.globalEvent.curScreenIndex},(ret)=>{
                //     // console.log(ret.data);
                //     //
                //     for(let i in ret.data.winArr){
                //         let win=ret.data.winArr[i];
                //         win.lock=0;//锁定
                //         win.zoom=0;//扩张，还原
                //         win.inputCardLabel=this.globalEvent.signalCardName(win.srcCardId,win.srcId);
                //         win.resolution=this.globalEvent.inputCardList[win.srcCardId].srcArr[win.srcId].resolArr;
                //         // win.portTypeInfo=this.globalEvent.inputCardList[win.srcCardId].srcArr[win.srcId].label;
                //         if(!this.globalEvent.isValidResolution(win.resolution)){
                //             win.resolution=['信号丢失']
                //         }
                //         win.label=this.globalEvent.windowItemName(this.globalEvent.curScreenIndex,i);
                //         win.k='k'+parseInt(Math.random()*1000);
                //     }
                //     this.globalEvent.windowItemsInfo=ret.data;
                //     this.windowItems=this.globalEvent.windowItemsInfo.winArr;
                //     this.syncLocalName();
                // });

            },

            addWindowItem(param){

                let cardNumber=this.globalEvent.sourceCardNumber();
                let len=this.windowItems.length;
                let left=100*len;
                let top=100*len;
                let w=1920;
                let h=1080;
                if(param.act=='drag'){
                    left=parseInt(this.dragRect.x/this.ratio);
                    top=parseInt(this.dragRect.y/this.ratio);
                    w=parseInt(this.dragRect.w/this.ratio);
                    h=parseInt(this.dragRect.h/this.ratio);
                    this.dragRect={x:0,y:0,h:0,w:0};
                }
                let data={
                    type:1,//新开
                    scrGroupId: this.globalEvent.curScreenIndex,
                    winId: len,
                    srcGroupId:0,
                    srcCardId:cardNumber[0],
                    srcId:cardNumber[1],
                    layerId:len,
                    cropLeft:0,
                    cropTop:0,
                    cropW:0,
                    cropH:0,
                    winLeft:left,
                    winTop:top,
                    winW:w,
                    winH:h,
                };



                if(this.isOutResource(data)){
                    alert(this.globalEvent.alert.outResource);
                    this.loadScreenWindowItems();
                    return ;
                }



                this.$http.post("winOpr.cgi",data,(ret)=>{

                    this.loadScreenWindowItems();
                });
            },
            isOutResource(newWin={}){
                //已有窗口 + 新窗口
                let totalWins=JSON.parse(JSON.stringify(this.windowItems));
                for(let i in totalWins){
                    totalWins[i].winLeft=totalWins[i].winSizeArr[0];
                    totalWins[i].winTop=totalWins[i].winSizeArr[1];
                    totalWins[i].winW=totalWins[i].winSizeArr[2];
                    totalWins[i].winH=totalWins[i].winSizeArr[3];
                }

                if(Object.keys(newWin).length>0){
                    totalWins.push(JSON.parse(JSON.stringify(newWin)));
                }

                let outCardPort={};//不同板卡的 端口分组
                let outCardUsedRes={};//板卡已用资源
                for(let i in this.curScreen.portArr){

                    let port=this.curScreen.portArr[i].mapArr[0];
                    let cardSeq=parseInt(port/6);//板卡号
                    let cardKey='card'+cardSeq;
                    if(typeof outCardPort[cardKey] == 'undefined'){
                        outCardPort[cardKey]=[];
                        outCardUsedRes[cardKey]=0;
                    }
                    outCardPort[cardKey].push(port);//属于同一板卡的端口
                }
                //计算每个窗口跨过的端口
                // let trueFlag=true;
                this.portStat={};
                let cardStat={};
                for(let i in totalWins){

                    let crossCards=this.getWindowCrossCard(totalWins[i],outCardPort);

                    //输出板卡资源 统计
                    for(let inner_i in crossCards){
                        let key=crossCards[inner_i];
                        if(typeof cardStat[key] == 'undefined'){
                            cardStat[key]=0;
                        }
                        cardStat[key]++;
                    }

                    let port=this.globalEvent.inputCardList[totalWins[i].srcCardId].srcArr[totalWins[i].srcId];


                    let resourceType=1;//默认资源数为1
                    if((port.portType==16 && port.ITESrcType==18) || (port.portType==16 && port.ITESrcType==17)){
                        resourceType=4;
                    }
                    else if((port.portType==18 && port.ITESrcType==18) || (port.ITESrcType==18 && port.ITESrcType==17)){
                        resourceType=2;
                    }


                    for(let k in crossCards){
                        outCardUsedRes[crossCards[k]]+=resourceType;
                    }
                }


                let outResource=false;
                //输出端口 资源统计
                if(this.globalEvent.maxWinNumPerPort>0){
                    for(let i in this.portStat){
                        if(this.portStat[i]>this.globalEvent.maxWinNumPerPort){
                            console.log("超过输出端口最大窗口");
                            outResource=true;
                            break;
                        }
                    }
                }
                console.log(cardStat);
                //输出板卡 资源统计
                for(let i in this.globalEvent.outPutInfo.maxWinNumArr){
                    let num=this.globalEvent.outPutInfo.maxWinNumArr[i];
                    let key='card'+i;
                    if( num>0 && typeof cardStat[key]!='undefined' && cardStat[key]>num){
                        outResource=true;
                        console.log("超过输出板卡最大窗口数");
                        break ;
                    }
                }


                for(let k in outCardUsedRes){
                    if(outCardUsedRes[k]>8){
                        outResource=true;
                        break;
                    }
                }

                return outResource;
            },
            getWindowCrossCard(win,outCardPort){
                //获取 窗口跨越的板卡
                //左上角
                let w=0;
                let h=0;
                let startCol=-1,endCol=0;
                let startRow=-1,endRow=0;
                let winRight=win.winLeft+win.winW;//右坐标
                let winBottom=win.winTop+win.winH;//底部坐标
                let cards=[];
                for(let i=0 ;i< this.curScreen.Col;i++){
                    w+=this.curScreen.portArr[i].sizeArr[0];
                    if(win.winLeft<=w-1 && startCol==-1){
                        startCol=i;
                    }
                    if(winRight>w){
                        endCol=Math.min(i+1,this.curScreen.Col-1);
                    }
                }
                for(let i=0 ;i<this.curScreen.Row;i++){
                    let l=this.curScreen.Col*i;
                    h+=this.curScreen.portArr[l].sizeArr[1];
                    if(win.winTop<=h-1 && startRow==-1){
                        startRow=i;
                    }
                    if(winBottom>h){
                        endRow=Math.min(i+1,this.curScreen.Row-1);
                    }
                }

                // console.log(startCol,endCol,startRow,endRow);


                for(let i=startCol;i<=endCol;i++){
                    for(let j=startRow;j<=endRow;j++){
                        let k=this.curScreen.Col*j+parseInt(i);

                        for(let cardKey in outCardPort){
                            let portNo=this.curScreen.portArr[k].mapArr[0];

                            // 输出端口统计
                            let portKey="port"+portNo;
                            if(typeof this.portStat[portKey]=='undefined'){
                                this.portStat[portKey]=0;
                            }
                            this.portStat[portKey]++;
                            // 输出端口统计 end
                            if(outCardPort[cardKey].includes(portNo)){
                                cards.push(cardKey);//记录 端口占用的板卡号
                            }
                        }

                    }
                }

                return [...new Set(cards)];
            },
            syncLocalName(){
                this.globalEvent.syncLocalName("windowItem",this.windowItems)
            },
            getMaxIndexPos(){
                //交换最大值
                let maxIndex=0;
                let index=-1;
                for(let i in this.windowItems){
                    if(maxIndex<this.windowItems[i].layerId){
                        maxIndex=this.windowItems[i].layerId;
                        index=i;
                    }
                }
                return [index,maxIndex];
            },
            getMinIndexPos(){
                //交换最大值
                let minIndex=100;
                let index=-1;
                for(let i in this.windowItems){
                    if(minIndex>this.windowItems[i].layerId){
                        minIndex=this.windowItems[i].layerId;
                        index=i;
                    }
                }
                return [index,minIndex];
            },
            cardNumberStyle(index){
                let style={
                    position:'absolute',
                    color:"#bdc6cd",
                    fontSize:"50px",
                };

                let row=parseInt(index/this.col);//位于第几行
                style.top=row==0?'30px':(this.lineH[2*row-1])*this.ratio+30+'px';

                let col=index%this.col;//位于第几列
                style.left=col==0?'30px':(this.lineV[2*col-1])*this.ratio+30+'px';

                let r1=1,r2=1;
                if(this.ratioWidth<400){
                    r1=this.ratioWidth/400;
                    // style.fontSize=50*r+'px';
                    // style.top=row==0?30*r+'px':(this.lineH[2*row-1])*this.ratio+30*r+'px';
                    // style.left=col==0?30*r + 'px':(this.lineV[2*col-1])*this.ratio+30*r+'px';
                }
                if(this.ratioHeight<200){
                    r2=this.ratioHeight/200;
                    // console.log(this.ratioHeight,r);
                    // style.fontSize=50*r+'px';
                    // style.top=row==0?30*r+'px':(this.lineH[2*row-1])*this.ratio+30*r+'px';
                    // style.left=col==0?30*r + 'px':(this.lineV[2*col-1])*this.ratio+30*r+'px';
                }

                let r=Math.min(r1,r2);
                style.fontSize=50*r+'px';
                style.top=row==0?30*r+'px':(this.lineH[2*row-1])*this.ratio+30*r+'px';
                style.left=col==0?30*r + 'px':(this.lineV[2*col-1])*this.ratio+30*r+'px';

                // if(this.ratio<0.25){
                //     let scale=this.ratio/0.25;
                //     // style.top=style.top.replace('px','')*scale+'px';
                //     // style.left=style.left.replace('px','')*scale+'px';
                //     style.top=style.top.replace('px','')/this.ratioHeight();
                //     style.transform='scale('+scale+')';
                //     console.log(style);
                // }
                return style;
            },

            mouseWheel(e) {
                if(e.wheelDelta>0){
                    //变大
                    this.scale=this.scale+0.03;

                    if(this.scale>4){
                        this.scale=4;
                    }
                }
                else{
                    //变小
                    this.scale=this.scale-0.03;
                    if(this.scale<0.05){
                        this.scale=0.05;
                    }
                }
                this.initScreenPanel();

                // clearTimeout(this.refreshWindowItemsEvent)
                // this.refreshWindowItemsEvent=setTimeout(()=>{
                //     this.loadScreenWindowItems();
                // },500);

            },
            getWindowSize(wSize){
                //获取窗口 边界
                let [t,l,w,h]=wSize;//实际尺寸
                let nt,nl,nw,nh;


                let zLineH=[0,...this.lineH];//补上零线
                let zLineV=[0,...this.lineV];
                let hLen=zLineH.length-1;
                let vLen=zLineV.length-1;
                zLineH.forEach((v,k)=>{
                    let bottom=t+h;
                    if(k==hLen){
                        if(t>=v){
                            nt=v;
                        }
                        if(bottom>v){
                            nh=this.totalHeight-nt;
                        }
                    }
                    else{

                        if(t>=v && t<zLineH[k+1]){
                            nt=v;
                        }

                        if(bottom>v && bottom<=zLineH[k+1]){
                            nh=zLineH[k+1]-nt;
                        }
                    }
                })

                zLineV.forEach((v,k)=>{
                    let right=l+w;
                    if(k==vLen){
                        if(l>=v){
                            nl=v;
                        }

                        if(right>v){
                            nw=this.totalWidth-nl
                        }
                    }
                    else{
                        if(l>=v && l<zLineV[k+1]){
                            nl=v;
                        }
                        if(right>v && right<zLineV[k+1]){
                            nw=zLineV[k+1]-nl;
                        }
                    }
                })

                nt=nt===undefined?t:nt;
                nl=nt===undefined?l:nl;
                nw=nw===undefined?w:nw;
                nh=nh===undefined?h:nh;

                return [nt,nl,nw,nh];
            },
            syncWindowSize(){
                let w=this.globalEvent.selectedWindowIndex;
                let curWindow=this.globalEvent.windowItemsInfo.winArr[w];
                // console.log(curWindow);
                let data={
                    type:2,//移动
                    scrGroupId:this.globalEvent.curScreenIndex-0,
                    winId:curWindow.winId-0,
                    srcCardId:curWindow.srcCardId-0,
                    srcGroupId:curWindow.srcGroupId-0,
                    srcId:curWindow.srcId-0,
                    layerId:curWindow.layerId-0,
                    cropLeft:curWindow.cropSizeArr[0]-0,
                    cropTop:curWindow.cropSizeArr[1]-0,
                    cropW:curWindow.cropSizeArr[2]-0,
                    cropH:curWindow.cropSizeArr[3]-0,
                    winLeft:curWindow.winSizeArr[0]-0,
                    winTop:curWindow.winSizeArr[1]-0,
                    winW:curWindow.winSizeArr[2]-0,
                    winH:curWindow.winSizeArr[3]-0,
                };

                if(this.isOutResource({})){
                    alert(this.globalEvent.alert.outResource);
                    this.loadScreenWindowItems();
                    return ;
                }

                this.$http.post("winOpr.cgi",data,()=>{
                    console.log("vdr/index.vue .保存窗口 尺寸 位置....");
                    //如果都统一保存 然后再读取（ loadScreenWindowItems），就没必要修改属性（减少复杂度 代码量）。。。 调用
                });
            },
            // subEvent(param){
            //     if('delete_window_item'==param.act){
            //         this.windowItems.splice(param.seq,1);
            //         if(this.globalEvent.selectedWindowIndex==param.seq){
            //             this.globalEvent.selectedWindowIndex=-1;
            //             this.$http.post("closeWin.cgi",{groupId:this.curScreenIndex,winId:param.seq},(ret)=>{
            //                 console.log("vdr/index.vue 关闭窗口。。。");
            //             });
            //         }
            //     }
            //     else if('update_window_pos'==param.act){
            //
            //         this.windowItems[param.seq].winSizeArr[param.pos]=param.v;
            //         //通知侧边修改 窗口参数
            //         this.globalEvent.$emit("update_side_attr");
            //     }
            // }
            initDragOpenWin(){
                let panel=document.getElementById("grids");
                let that=this;
                let originPos={};
                let pos=this.getLocation(panel);

                panel.addEventListener("mousedown",function (e) {
                    if(that.globalEvent.panelLock){
                        //位置锁定
                        return ;
                    }
                    originPos.x=e.pageX;
                    originPos.y=e.pageY;
                    that.dragRect.x=originPos.x-pos.left;
                    that.dragRect.y=originPos.y-pos.top;

                    let mm=function(e){
                        let deltax=e.pageX-originPos.x;
                        let deltay=e.pageY-originPos.y;
                        if(deltax<0 || deltax<0){
                            return ;
                        }

                        if(e.pageX-pos.left<=that.ratioWidth){
                            that.dragRect.w=deltax;
                        }
                        if(e.pageY-pos.top<=that.ratioHeight)
                        {
                            that.dragRect.h=deltay;
                        }


                    };
                    let mu=function(){
                        document.removeEventListener("mousemove",mm);
                        document.removeEventListener("mouseup",mu);

                        if(that.dragRect.w>30 && that.dragRect.h>30){
                            //拖动特定 长宽 才生成窗口
                            that.addWindowItem({act:'drag'});
                        }

                    };
                    document.addEventListener("mousemove",mm);
                    document.addEventListener("mouseup",mu);
                });
            },
            getLocation(element) {
                if(element == null)
                    return null;
                let offsetTop = element.offsetTop;
                let offsetLeft = element.offsetLeft;
                while(element = element.offsetParent) {
                    offsetTop += element.offsetTop;
                    offsetLeft += element.offsetLeft;
                }
                let o = {};
                o.left = offsetLeft;
                o.top = offsetTop;
                return o;
            }
        },
        mounted(){
            setTimeout(()=>{
                this.initDragOpenWin();
            },300);
        },
        components: {
            windowItem
        }
    };
</script>

<style>
    .draw-vdr{
        position: relative;
    }
    .grids{
        position: absolute;
        top: 0;
        left: 0;
    }
    .line_h{position:absolute;height:0;border-top:1px solid #dcdcdc;left:0;}
    .line_v{position:absolute;width:0;border-left:1px solid #dcdcdc;top:0;}

    .grid{border:2px solid #dcdcdc;border-top:none;border-right:none;position:absolute;}
    .dragRect{position:absolute;background-color:rgba(214,214,214,0.6);border:1px dashed #dcdcdc;z-index:100;}
</style>