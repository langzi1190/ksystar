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
                @wheel="mouseWheel"
                :style="`height: ${ratioHeight}px; width: ${ratioWidth}px; position: relative;`"
        >
            <windowItem
                    v-for="(item,index) in windowItems"
                    :item="item"
                    :key="item.winSizeArr[0]"
                    :seq="index"
                    ref="windowObj"
                    :ratio="ratio"
            ></windowItem>
        </div>
    </div>
</template>

<script>


    import windowItem from "@/components/vdr/windowItem";
    export default {
        data: function() {
            return {
                windowList:[],//视频窗口
                activeWindow:-1,
                totalWidth:0,
                totalHeight:0,
                ratio:1,
                normalWidth:1000,//归一化
                totalLine:0,
                totalCard:0,
                col:0,
                row:0,

                lineH:[],
                lineV:[],
                curScreen:{},//当前屏幕墙
                windowItems:[],//当前屏幕墙所有窗口
            };
        },
        created() {

            this.globalEvent.$on("add_window_item",(param)=>{
                //添加窗口事件,添加完，可以直接 loadScreenWindowItems，
                // console.log(this.globalEvent.selectedCard);
                let cardNumber=this.globalEvent.sourceCardNumber();
                console.log(cardNumber);
                let len=this.windowItems.length;
                let left=100*len;
                let top=100*len;
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
                    winW:1920,
                    winH:1080,
                };

                this.$http.post("winOpr.cgi",data,(ret)=>{
                    console.log(ret.data);
                    this.loadScreenWindowItems();
                    // this.windowItems.push(data);
                });
                // this.addWindowItem();
            });
            this.globalEvent.$on('load_screen',(param)=>{
                this.loadScreen(param.seq);
            });
            this.globalEvent.$on("close_window_item",(param)=>{
                //关闭窗口
                let data={
                    groupId:this.curScreenIndex
                };
                if(param.act=='all'){
                    this.windowItems=[];
                }
                else{
                    this.windowItems.splice(this.globalEvent.selectedWindowIndex,1);
                    data.winId=this.globalEvent.selectedWindowIndex;
                }

                this.$http.post("closeWin.cgi",data,(ret)=>{
                    console.log("vdr/index.vue 关闭窗口。。。");
                });


                if(this.windowItems.length==0){
                    this.globalEvent.selectedWindowIndex=-1;
                }
                else{
                    this.globalEvent.selectedWindowIndex=0;
                }
            });
            this.globalEvent.$on('update_window',(param)=>{
                //修改窗口属性
                if(param.act=='top' || param.act=='bottom'){
                    //置顶,置底,设置为当前最大值，
                    let maxIndexPos=param.act=='top'?this.getMaxIndexPos():this.getMinIndexPos();

                    this.windowItems[maxIndexPos[0]].layerId=this.windowItems[this.globalEvent.selectedWindowIndex].layerId;
                    this.windowItems[this.globalEvent.selectedWindowIndex].layerId=maxIndexPos[1];
                    //子组件更新参数
                    this.$refs.windowObj[maxIndexPos[0]].setProp(param);
                    this.$refs.windowObj[this.globalEvent.selectedWindowIndex].setProp(param);

                    this.$http.post("winLayerWr.cgi",{
                        type:param.act=='top'?1:0,
                        groupId:this.globalEvent.curScreenIndex,
                        windId:this.globalEvent.selectedWindowIndex
                    },(ret)=>{
                        console.log("vdr/index.vue 置顶，置底。。。。");
                    });
                }
                else if(param.act=='window_size'){
                    //全屏,扩张，还原
                    this.$refs.windowObj[this.globalEvent.selectedWindowIndex].windowEdit(param.v);
                }

            });
            this.globalEvent.$on("update_window_pos_by_side",(param)=>{
                //来自侧边栏的 属性更改通知
                let w=this.globalEvent.selectedWindowIndex;
                let posMap={'cleft':0,'ctop':1,'cwidth':2,'cheight':3};
                //更新窗口属性
                if(['cleft','ctop','cwidth','cheight'].includes(param.act)){
                    this.globalEvent.windowItemsInfo.winArr[w].cropSizeArr[posMap[param.act]]=param.v;
                }
                else{
                    this.$refs.windowObj[w].setWindowSize(param);
                }
                this.syncWindowSize();
            });
            this.loadData();
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
                this.$http.get("syncScrInfoRd.cgi",{},(ret)=>{
                    this.globalEvent.screenInfo=ret.data;
                    this.loadScreen(0)
                })
                //获取顶部工具区域通用参数
                this.$http.get("syncCommonInfoRd.cgi",{},(ret)=>{
                    this.globalEvent.commonInfo=ret.data;
                });
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
                    color:"#505050",
                    fontSize:"50px",
                };
                let row=parseInt(index/this.col);//位于第几行
                style.top=row==0?'30px':(this.lineH[2*row-1])*this.ratio+30+'px';

                let col=index%this.col;//位于第几列
                style.left=col==0?'30px':(this.lineV[2*col-1])*this.ratio+30+'px';
                return style;
            },
            loadScreen(seq){

                let curScreen=this.globalEvent.screenInfo.scrGroupArr[seq];
                let portArr=curScreen.portArr;
                this.curScreen=curScreen;
                this.globalEvent.curScreenIndex=seq;

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
                    if(i%(curScreen.Col+1)==0){
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



                if(this.totalWidth>1000){
                    this.ratio=1000/this.totalWidth;
                }
                else{
                    this.ratio=1;
                }

                this.globalEvent.totalWidth=this.totalWidth;
                this.globalEvent.totalHeight=this.totalHeight;

                this.loadScreenWindowItems();
            },
            loadScreenWindowItems(){
                //获取当前屏幕墙的输出窗口
                // this.globalEvent.windowItemsInfo={
                //     "scrGroupId":	0,//屏幕墙编号
                //     "winNum":	2,
                //     "winArr":[{
                //         "winId":	0,//自己
                //         "srcGroupId":	0,//信号源分组
                //         "srcCardId":	0,
                //         "srcId":	0,
                //         "layerId":	0,
                //         "partOrAll":	0,
                //         "cropSizeArr":	[0, 0, 0, 0],
                //         "winSizeArr":	[0, 0, 1920, 1080]
                //     }, {
                //         "winId":	1,
                //         "srcGroupId":	0,
                //         "srcCardId":	1,
                //         "srcId":	0,
                //         "layerId":	1,
                //         "partOrAll":	0,
                //         "cropSizeArr":	[0, 0, 0, 0],
                //         "winSizeArr":	[1920, 1080, 1920, 1080]
                //     }]
                // };
                this.$http.post("syncWinInfoRd.cgi",{scrGroupId:this.globalEvent.curScreenIndex},(ret)=>{
                    this.globalEvent.windowItemsInfo=ret.data;
                    this.windowItems=this.globalEvent.windowItemsInfo.winArr;
                });
            },
            // addWindowItem(){
            //     console.log(this.globalEvent.selectedCard);
            //     let len=this.windowItems.length;
            //     let left=100*len;
            //     let top=100*len;
            //     let emptyItem={
            //         "winId":len,
            //         "srcGroupId":	0,
            //         "srcCardId":	1,
            //         "srcId":	0,
            //         "layerId":	len,
            //         "partOrAll":	0,
            //         "cropSizeArr":	[0, 0, 0, 0],
            //         "winSizeArr":	[left, top, 1920, 1080]
            //     };
            //     console.log(emptyItem);
            //     this.windowItems.push(emptyItem);
            // },
            mouseWheel(e) {
                // let wh_ratio=this.totalWidth/this.totalHeight;
                if(e.wheelDelta>0){
                    //变大
                    this.ratio=this.ratio+0.001;

                    if(this.ratio>4){
                        this.ratio=4;
                    }
                }
                else{
                    //变小
                    this.ratio=this.ratio-0.001;
                    if(this.ratio<0.05){
                        this.ratio=0.05;
                    }
                }
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
                let data={
                    type:2,//移动
                    scrGroupId:curWindow.scrGroupId,
                    winId:curWindow.winId,
                    srcGroupId:curWindow.srcGroupId,
                    srcId:curWindow.srcId,
                    layerId:curWindow.layerId,
                    cropLeft:curWindow.cropSizeArr[0],
                    cropTop:curWindow.cropSizeArr[1],
                    cropW:curWindow.cropSizeArr[2],
                    cropH:curWindow.cropSizeArr[3],
                    winLeft:curWindow.winSizeArr[0],
                    winTop:curWindow.winSizeArr[1],
                    winW:curWindow.winSizeArr[2],
                    winH:curWindow.winSizeArr[3],
                };
                this.$http.post("winOpr.cgi",data,(ret)=>{
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
</style>