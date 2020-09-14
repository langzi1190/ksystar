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
                :style="`height: ${ratioHeight}px; width: ${ratioWidth}px; border: 1px solid #dcdfe6; position: relative;box-sizing:border-box;`"
        >
            <windowItem
                    v-for="(item,index) in windowItems"
                    :item="item"
                    :key="item.winSizeArr[0]"
                    :seq="index"
                    ref="windowObj"
                    :ratio="ratio"
                    @sub_event="subEvent"
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
                //添加窗口事件
                this.addWindowItem();
            });
            this.globalEvent.$on("close_window_item",(param)=>{
                //关闭窗口
                if(param.act=='all'){
                    this.windowItems=[];
                }
                else{
                    this.windowItems.splice(this.globalEvent.selectedWindowIndex,1);

                }
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
                }
                else if(param.act=='window_size'){
                    //全屏,扩张，还原
                    this.$refs.windowObj[this.globalEvent.selectedWindowIndex].windowEdit(param.v);
                }

            });
            this.globalEvent.$on("update_window_pos_by_side",(param)=>{
                //来自侧边栏的 属性更改通知
                this.$refs.windowObj[this.globalEvent.selectedWindowIndex].setWindowSize(param);

            });
            this.globalEvent.screenInfo={
                "ScrGroupNum":	2,
                "scrGroupArr":	[{
                    "Row":	2,
                    "Col":	2,
                    "VideoId":	16,
                    "TimingMode":	1,
                    "FrameRate":	60,//格式是 0 1 2？？
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
                    "portArr":	[{
                        "sizeArr":	[1920, 1080],
                        "mapArr":	[12],
                        "briArr":	[0, 0, 0],
                        "conArr":	[100, 100, 100]
                    }, {
                        "sizeArr":	[1920, 1080],
                        "mapArr":	[13],
                        "briArr":	[0, 1, 201],
                        "conArr":	[100, 100, 100]
                    }, {
                        "sizeArr":	[1920, 1080],
                        "mapArr":	[14],
                        "briArr":	[0, 209, 4],
                        "conArr":	[100, 100, 100]
                    }, {
                        "sizeArr":	[1920, 1080],
                        "mapArr":	[15],
                        "briArr":	[32, 2, 95],
                        "conArr":	[100, 100, 100]
                    }]
                }, {
                    "Row":	2,
                    "Col":	3,
                    "VideoId":	16,
                    "TimingMode":	0,
                    "FrameRate":	60,
                    "FormatW":	1920,
                    "HFrontPorch":	88,
                    "HSyncTime":	44,
                    "HBackPorch":	148,
                    "FormatH":	1080,
                    "VFrontPorch":	4,
                    "VSyncTime":	5,
                    "VBackPorch":	36,
                    "ClkFreq":	148500,
                    "HPolar":	0,
                    "VPolar":	0,
                    "portArr":	[{
                        "sizeArr":	[1920, 1080],
                        "mapArr":	[18],
                        "briArr":	[0, 0, 0],
                        "conArr":	[100, 100, 100]
                    }, {
                        "sizeArr":	[1920, 1080],
                        "mapArr":	[19],
                        "briArr":	[0, 0, 0],
                        "conArr":	[100, 100, 100]
                    }, {
                        "sizeArr":	[1920, 1080],
                        "mapArr":	[20],
                        "briArr":	[0, 1, 0],
                        "conArr":	[100, 100, 100]
                    }, {
                        "sizeArr":	[1920, 1080],
                        "mapArr":	[21],
                        "briArr":	[1, 0, 0],
                        "conArr":	[100, 100, 100]
                    }, {
                        "sizeArr":	[1920, 1080],
                        "mapArr":	[22],
                        "briArr":	[0, 0, 0],
                        "conArr":	[100, 100, 100]
                    }, {
                        "sizeArr":	[1920, 1080],
                        "mapArr":	[23],
                        "briArr":	[0, 0, 0],
                        "conArr":	[100, 100, 100]
                    }]
                }]
            };
            this.loadScreen(0)
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
                    if(i%(curScreen.Row+1)==0){
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
                this.globalEvent.windowItemsInfo={
                    "scrGroupId":	0,//屏幕墙编号
                    "winNum":	2,
                    "winArr":[{
                        "winId":	0,//自己
                        "srcGroupId":	0,//信号源分组
                        "srcCardId":	0,
                        "srcId":	0,
                        "layerId":	0,
                        "partOrAll":	0,
                        "cropSizeArr":	[0, 0, 0, 0],
                        "winSizeArr":	[0, 0, 1920, 1080]
                    }, {
                        "winId":	1,
                        "srcGroupId":	0,
                        "srcCardId":	1,
                        "srcId":	0,
                        "layerId":	1,
                        "partOrAll":	0,
                        "cropSizeArr":	[0, 0, 0, 0],
                        "winSizeArr":	[1920, 1080, 1920, 1080]
                    }]
                };
                this.windowItems=this.globalEvent.windowItemsInfo.winArr;

            },
            addWindowItem(){
                console.log(this.globalEvent.selectedCard);
                let len=this.windowItems.length;
                let left=100*len;
                let top=100*len;
                let emptyItem={
                    "winId":len,
                    "srcGroupId":	0,
                    "srcCardId":	1,
                    "srcId":	0,
                    "layerId":	1,
                    "partOrAll":	0,
                    "cropSizeArr":	[0, 0, 0, 0],
                    "winSizeArr":	[left, top, 1920, 1080]
                };
                console.log(emptyItem);
                this.windowItems.push(emptyItem);
            },
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
            subEvent(param){
                if('delete_window_item'==param.act){
                    this.windowItems.splice(param.seq,1);
                }
                else if('update_window_pos'==param.act){

                    this.windowItems[param.seq].winSizeArr[param.pos]=param.v;
                    //通知侧边修改 窗口参数
                    this.globalEvent.$emit("update_side_attr");
                }
            }
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
    .line_h{position:absolute;height:0;border-top:2px solid #dcdcdc;left:0;}
    .line_v{position:absolute;width:0;border-left:2px solid #dcdcdc;top:0;}

    .grid{border:2px solid #dcdcdc;border-top:none;border-right:none;position:absolute;}
</style>