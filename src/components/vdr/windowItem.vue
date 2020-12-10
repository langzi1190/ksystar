<template>
    <div class="windowItem"
         :style="{
        top:ptop+'%',
        left:pleft+'%',
        width:pwidth+'%',
        height:pheight+'%',
        zIndex:zIndex,
        overflow:(width<=minWidth || height<42)?'hidden':'visible'
    }">
        <div class="draw-area__dots vdr-child" :class="{show_dot:seq==globalEvent.selectedWindowIndex}">
            <div class="draw-area__dot draw-area__dot--t" data-type="top" @mousedown.stop="handleMouseDown"></div>
            <div class="draw-area__dot draw-area__dot--tr" data-type="top_right" @mousedown.stop="handleMouseDown"></div>
            <div class="draw-area__dot draw-area__dot--r" data-type="right" @mousedown.stop="handleMouseDown"></div>
            <div class="draw-area__dot draw-area__dot--br" data-type="bottom_right" @mousedown.stop="handleMouseDown"></div>
            <div class="draw-area__dot draw-area__dot--b" data-type="bottom" @mousedown.stop="handleMouseDown"></div>
            <div class="draw-area__dot draw-area__dot--bl" data-type="bottom_left" @mousedown.stop="handleMouseDown"></div>
            <div class="draw-area__dot draw-area__dot--l" data-type="left" @mousedown.stop="handleMouseDown"></div>
            <div class="draw-area__dot draw-area__dot--tl" data-type="top_left" @mousedown.stop="handleMouseDown"></div>

            <div class="title"   data-type="move" @mousedown.stop="handleMouseDown">
                <div class="title-win"  data-type="move" @mousedown.stop="handleMouseDown">
                    <span>Win-{{seq+1}}:{{this.item.srcGroupId==0?item.inputCardLabel:item.groupLabel}} {{item.lock==1?'['+LANG.ATTR_LOCKED+']':''}}</span>
                </div>
                <div class="title-control">
                    <span @click.stop="windowEdit('0')">
                        <i class="el-icon-minus"></i>
                    </span>
                    <span @click.stop="windowEdit('3')">
                        <i class="el-icon-bottom-left" style="font-weight:bold;font-size:18px;"></i>
                    </span>
                    <span @click.stop="windowEdit('1')">
                        <i class="el-icon-plus"></i>
                    </span>
                    <span @click.stop="windowEdit('2')">
                        <i class="el-icon-ride"></i>
                    </span>
                </div>
            </div>
            <div class="content">
                <p>{{LANG.ATTR_WINDOW_NAME}}:{{this.item.label}}</p>
                <p>{{LANG.ATTR_WINDOW_POS}}: [{{ o_left }},{{ o_top }}]</p>
                <p>{{LANG.ATTR_WINDOW_SIZE}}: [{{ o_width }},{{ o_height }}]</p>
                <p>{{LANG.ATTR_SIGNAL_TYPE}}:[{{globalEvent.inputCardList[item.srcCardId].srcArr[item.srcId].label}}]</p>
                <p :class="{alertColor:this.item.resolution.length==1}">{{LANG.SCREEN_RESOLUTION}}：[{{this.item.resolution.join(',')}}]</p>
                <p>{{item.partOrAll==0?LANG.ATTR_WINDOW_FULL:LANG.ATTR_WINDOW_PART}} <span v-show="item.partOrAll==1">[{{cropSizeArr.join(',')}}]</span></p>
                <div  data-type="move" @mousedown.stop="handleMouseDown" style="position:absolute;top:0;left:0;width:100%;height:100%;"></div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        props:['ratio','item','seq'],
        data(){


            let pleft=this.item.winSizeArr[0]*100/this.$parent.totalWidth;
            let ptop=this.item.winSizeArr[1]*100/this.$parent.totalHeight;
            let pwidth=this.item.winSizeArr[2]*100/this.$parent.totalWidth;
            let pheight=this.item.winSizeArr[3]*100/this.$parent.totalHeight;

            if(this.item.zoom==1){
                ptop=pleft=0;
                pwidth=pheight=100;

            }

            return {
                ptop:ptop,//比例位置
                pleft:pleft,
                pwidth:pwidth,
                pheight:pheight,

                zoom:this.item.zoom,//最大化

                top:parseInt(ptop*this.$parent.ratioHeight/100),//相对当前面板的坐标,目标拖拽使用
                left:parseInt(pleft*this.$parent.ratioWidth/100),
                width:parseInt(pwidth*this.$parent.ratioWidth/100),
                height:parseInt(pheight*this.$parent.ratioHeight/100),

                minWidth:parseInt(50/this.$parent.totalWidth*this.$parent.ratioWidth),
                minHeight:parseInt(50/this.$parent.totalHeight*this.$parent.ratioHeight),

                zIndex:this.item.layerId,
                o_left:this.item.winSizeArr[0],
                o_top:this.item.winSizeArr[1],//物理坐标
                o_width:this.item.winSizeArr[2],
                o_height:this.item.winSizeArr[3],


                cropSizeArr:[this.item.cropSizeArr[0],this.item.cropSizeArr[1],this.item.cropSizeArr[0]+this.item.cropSizeArr[2],this.item.cropSizeArr[1]+this.item.cropSizeArr[3]],
                stickSize:[],//保存吸附辅助线前数据
                LANG:this.LANGUAGE[this.globalEvent.language]
            };
        },
        watch:{
            ptop(v,ov){
                this.o_top=Math.ceil(v*this.$parent.totalHeight/100);
            },
            pleft(v,ov){
                this.o_left=Math.ceil(v*this.$parent.totalWidth/100);
            },
            pwidth(v,ov){
                this.o_width=Math.ceil(v*this.$parent.totalWidth/100);
            },
            pheight(v,ov){
                this.o_height=Math.ceil(v*this.$parent.totalHeight/100);
            },
            ratio(v,ov){
                this.percent2Ratio();
            },
        },
        methods:{
            sendEvent(param){
                // param.act='update_window_pos';
                // this.$emit('sub_event',param);

                this.$parent.windowItems[param.seq].winSizeArr[param.pos]=param.v;
                //通知侧边修改 窗口参数
                this.globalEvent.$emit("update_side_attr");
                clearTimeout(this.time_event);
                this.time_event=setTimeout(()=>{
                    this.$parent.syncWindowSize();
                },400);

            },
            sendSizeEvent(){
                // console.log("init_size",this.o_width);
                if(this.$parent.isOutResource({})){
                    alert(this.globalEvent.alert.outResource);
                    return;
                }

                if(this.o_width<55){
                    this.o_width=50;
                }
                if(this.o_height<55){
                    this.o_height=50;
                }
                this.sendEvent({pos:0,v:this.o_left,seq:this.seq});
                this.sendEvent({pos:1,v:this.o_top,seq:this.seq});
                this.sendEvent({pos:2,v:this.o_width,seq:this.seq});
                this.sendEvent({pos:3,v:this.o_height,seq:this.seq});
            },
            setProp(param){
                //vdr/index.vue 调用
                if(param.act=='top' || param.act=='bottom'){
                    //置顶
                    this.zIndex=this.$parent.windowItems[this.seq].layerId;
                }
            },
            setSrcGroup(group){
                this.item.groupLabel=group.label;
                this.item.srcGroupId=parseInt(group.srcGroupId)+1;
                let data={
                    scrGroupId:this.globalEvent.curScreenIndex,
                    srcGroupId:this.item.srcGroupId,
                    winId:parseInt(this.item.winId),
                    srcCardId:parseInt(this.item.srcCardId),
                    srcId:parseInt(this.item.srcId)
                };
                this.$http.post("switchWinSrc.cgi",data,(ret)=>{
                    console.log("signal/index.vue 切换窗口 信号源组");
                });
            },
            setWindowSize(param){
                //根据侧边栏的参数调整 窗口参数,/vdr/index.vue 调用
                if(param.act=='top'){
                    this.item.winSizeArr[1]=param.v;
                    this.ptop=param.v*100/this.$parent.totalHeight;
                    this.percent2Ratio();//如果 不调用，在arr/side 设置后 拖动会还原设置前数据
                }
                else if(param.act=='left'){
                    this.item.winSizeArr[0]=param.v;
                    this.pleft=param.v*100/this.$parent.totalWidth;
                    this.percent2Ratio();
                }
                else if(param.act=='width'){
                    this.item.winSizeArr[2]=param.v;
                    this.pwidth=param.v*100/this.$parent.totalWidth;
                    this.percent2Ratio();
                }
                else if(param.act=='height'){
                    this.item.winSizeArr[3]=param.v;
                    this.pheight=param.v*100/this.$parent.totalHeight;
                    this.percent2Ratio();
                }
                else if(param.act=='ctop'){
                    this.item.cropSizeArr[1]=param.v;
                    this.cropSizeArr=[this.item.cropSizeArr[0],this.item.cropSizeArr[1],this.item.cropSizeArr[0]+this.item.cropSizeArr[2],this.item.cropSizeArr[1]+this.item.cropSizeArr[3]];
                }
                else if(param.act=='cleft'){
                    this.item.cropSizeArr[0]=param.v;
                    this.cropSizeArr=[this.item.cropSizeArr[0],this.item.cropSizeArr[1],this.item.cropSizeArr[0]+this.item.cropSizeArr[2],this.item.cropSizeArr[1]+this.item.cropSizeArr[3]];
                }
                else if(param.act=='cwidth'){
                    this.item.cropSizeArr[2]=param.v;
                    this.cropSizeArr=[this.item.cropSizeArr[0],this.item.cropSizeArr[1],this.item.cropSizeArr[0]+this.item.cropSizeArr[2],this.item.cropSizeArr[1]+this.item.cropSizeArr[3]];
                }
                else if(param.act=='cheight'){
                    this.item.cropSizeArr[3]=param.v;
                    this.cropSizeArr=[this.item.cropSizeArr[0],this.item.cropSizeArr[1],this.item.cropSizeArr[0]+this.item.cropSizeArr[2],this.item.cropSizeArr[1]+this.item.cropSizeArr[3]];
                }

                // setTimeout(()=>{
                //     //this.ptop 会 重新计算 this.o_top
                //     [this.o_top,this.o_left,this.o_width,this.o_height]=this.item.winSizeArr;
                //
                // },300);
            },
            percent2Ratio(){
                //比例数据 转化 为相对数据
                this.top=Math.ceil(this.ptop*this.$parent.ratioHeight/100);
                this.height=Math.min(Math.ceil(this.pheight*this.$parent.ratioHeight/100),this.$parent.ratioHeight);
                this.left=Math.ceil(this.pleft*this.$parent.ratioWidth/100);
                this.width=Math.min(Math.ceil(this.pwidth*this.$parent.ratioWidth/100),this.$parent.ratioWidth);


                this.minWidth=parseInt(50/this.$parent.totalWidth*this.$parent.ratioWidth);
                this.minHeight=parseInt(50/this.$parent.totalHeight*this.$parent.ratioHeight);
            },
            windowEdit(val) {
                if(this.globalEvent.panelLock){
                    //位置锁定
                    return ;
                }
                if (val === "0") {
                    this.zoom=0;
                    if(this.stickSize.length>0){
                        //还原拖拽前的位置 大小、原始数据变换 会在 watch中执行
                        [this.ptop,this.pleft,this.pwidth,this.pheight]=this.stickSize;

                        this.percent2Ratio();
                        this.stickSize=[];

                        setTimeout(()=>{
                            // 如果是恢复 需要等待 o_top的计算
                            this.sendSizeEvent();
                        },400);
                    }
                    else{
                        this.o_top=Math.ceil(this.ptop*this.$parent.totalHeight/100);
                        this.o_height=Math.ceil(this.pheight*this.$parent.totalHeight/100);
                        this.o_left=Math.ceil(this.pleft*this.$parent.totalWidth/100);
                        this.o_width=Math.ceil(this.pwidth*this.$parent.totalWidth/100);

                        this.sendSizeEvent();
                    }



                }
                else if (val === "1") {
                    //全屏
                    this.zoom=1;

                    this.o_top=this.o_left=0;
                    this.o_width=this.$parent.totalWidth;
                    this.o_height=this.$parent.totalHeight;

                    if(this.stickSize.length==0)
                        this.stickSize=[this.ptop,this.pleft,this.pwidth,this.pheight];//如果拖动距离超过10像素则清空
                    [this.ptop,this.pleft,this.pwidth,this.pheight]=[this.o_top,this.o_left,this.o_width,this.o_height]
                        .map((v,k)=>{
                            if(k==0 || k==3){
                                return Math.min(100,Math.ceil(v/this.$parent.totalHeight*100));
                            }
                            else{
                                return Math.min(100,Math.ceil(v/this.$parent.totalWidth*100));
                            }
                        });
                    this.percent2Ratio();


                    this.sendSizeEvent();
                }
                else if (val === "2") {
                    //关闭
                    // this.$emit('sub_event',{act:'delete_window_item',seq:this.seq})
                    this.globalEvent.$emit("close_window_item",{act:'cur'});
                }
                else if(val==='3'){
                    //扩张
                    //检测辅助线
                    [this.o_top,this.o_left,this.o_width,this.o_height]=this.$parent.getWindowSize([this.o_top,this.o_left,this.o_width,this.o_height]);
                    //保存 数据
                    if(this.stickSize.length==0)
                        this.stickSize=[this.ptop,this.pleft,this.pwidth,this.pheight];//如果拖动距离超过10像素则清空

                    [this.ptop,this.pleft,this.pwidth,this.pheight]=[this.o_top,this.o_left,this.o_width,this.o_height]
                                                                    .map((v,k)=>{
                                                                        if(k==0 || k==3){
                                                                            return Math.ceil(v/this.$parent.totalHeight*100);
                                                                        }
                                                                        else{
                                                                            return Math.ceil(v/this.$parent.totalWidth*100);
                                                                        }
                                                                    });
                    //修改 拖拽坐标 可以在窗口放大后 拖拽
                    this.percent2Ratio();
                    this.sendSizeEvent();
                }

            },
            setSrcCard(v){
                //切换 信号源
                let w=this.globalEvent.selectedWindowIndex;
                let num=this.globalEvent.sourceCardNumber();
                if(v!==undefined){
                    num=v.split('_');
                }
                if(w>-1){
                    this.$set(this.globalEvent.windowItemsInfo.winArr[w],'srcCardId',num[0]);
                    this.$set(this.globalEvent.windowItemsInfo.winArr[w],'srcId',num[1]);
                    this.$set(this.globalEvent.windowItemsInfo.winArr[w],'srcGroupId',0);

                    //保存信号源信息
                    let data={
                        scrGroupId:this.globalEvent.curScreenIndex,
                        winId:w,
                        srcCardId:num[0]-0,
                        srcId:num[1]-0
                    };

                    if(this.$parent.isOutResource({})){
                        //检测是否超资源
                        this.loadScreenWindowItems();
                        console.log('set_src_card');
                        alert(this.globalEvent.alert.outResource);
                        return ;
                    }
                    this.$http.post("switchWinSrc.cgi",data,(ret)=>{
                        let win=this.globalEvent.windowItemsInfo.winArr[w];
                        win.inputCardLabel=this.globalEvent.signalCardName(win.srcCardId,win.srcId);
                        win.resolution=this.globalEvent.inputCardList[win.srcCardId].srcArr[win.srcId].resolArr;
                        if(!this.globalEvent.isValidResolution(win.resolution)){
                            win.resolution=[this.LANG.ATTR_SIGNAL_LOST]
                        }

                        console.log("signal/index.vue 切换窗口源信号");
                    });
                }
            },
            handleMouseDown(ev){
                // if(this.zoom==1){
                //     return ;
                // }
                ev.stopPropagation();
                ev.preventDefault();
                var that=this;

                if(this.globalEvent.selectedWindowIndex!=this.seq){
                    //选则当前窗体
                    this.globalEvent.selectedWindowIndex=this.seq;
                }

                if(this.item.lock==1 || this.globalEvent.panelLock){
                    //窗体锁定,位置锁定
                    return ;
                }

                let old_x=ev.pageX;
                let old_y=ev.pageY;

                let init_x=old_x;//用来判断是否发生移动
                let init_y=old_y;

                let type=ev.target.dataset.type;

                let mv=function(e) {
                    var new_x=e.pageX;
                    var new_y=e.pageY;
                    var delta_x=new_x-old_x;
                    var delta_y=new_y-old_y;
                    let r,r1,r2,r3;//存储中间结果
                    old_x=new_x;
                    old_y=new_y;


                    if(Math.abs(new_x-init_x)<5 && Math.abs(new_y-init_y)<5){
                        //忽略鼠标 5像素以内的位移
                        return ;
                    }


                    switch(type){
                        case "top":
                            r = parseInt(that.top)+delta_y;
                            let h=that.height-delta_y;

                            if(Math.max(r,0)>0 && h>=that.minHeight){
                                that.top=r;
                                that.height=h;

                                // if(that.height<that.minHeight){
                                //     that.top==that.top-(that.minHeight-that.height);
                                //     that.height=that.minHeight;
                                // }
                            }
                            break;
                        case "bottom":
                            r=parseInt(that.height)+delta_y;
                            if(r+that.top<=that.$parent.ratioHeight){
                                //检测超出范围
                                that.height=r;
                            }
                            break;
                        case "left":
                            r=parseInt(that.left)+delta_x;
                            let w=that.width-delta_x
                            if(Math.min(r,0)>=0 && w>=that.minWidth){
                                that.left=r;
                                that.width=w;
                            }

                            break;
                        case "right":
                            r=parseInt(that.width)+delta_x;
                            if(r+that.left<=that.$parent.ratioWidth){
                                that.width=r;
                            }
                            break;
                        case "top_left":
                            // that.top=parseInt(that.top)+delta_y;
                            // that.height=that.height-delta_y;
                            // that.left=parseInt(that.left)+delta_x;
                            // that.width=that.width-delta_x;
                            r=parseInt(that.top+delta_y);

                            r1=Math.floor(that.height-delta_y);
                            r2=parseInt(that.left)+delta_x;
                            r3=Math.floor(that.width-delta_x);


                            if(
                                Math.min(r,0)>=0
                                && (r1+r)<=that.$parent.ratioHeight
                                && r1>=that.minHeight
                                && r3>=that.minWidth
                                && Math.min(r2,0)>=0
                                && (r2+r3)<=that.$parent.ratioWidth
                            ){
                                that.top=r;
                                that.height=r1;
                                that.left=r2;
                                that.width=r3;
                            }

                            break;
                        case "move":
                            r=parseInt(that.top)+delta_y;
                            r1=parseInt(that.left)+delta_x;
                            if(Math.min(r,0)>=0 && (r+that.height)<=that.$parent.ratioHeight){
                                if(Math.min(r1,0)>=0 && (r1+that.width)<=that.$parent.ratioWidth){

                                    that.top=r;
                                    that.left=r1
                                }
                            }

                            break;
                        case "top_right":
                            // that.top=parseInt(that.top)+delta_y;
                            // that.height=that.height-delta_y;
                            // that.width=that.width+delta_x;
                            r=parseInt(that.top)+delta_y;
                            r1=that.height-delta_y;
                            r2=that.width+delta_x;
                            if(
                                Math.min(r,0)>=0
                                && r1>=that.minHeight
                                && r2>=that.minWidth
                                && (r2+that.left)<=that.$parent.ratioWidth
                                && (r+r1)<=that.$parent.ratioHeight
                            ){
                                that.top=r;
                                that.height=r1;
                                that.width=r2;
                            }
                            break;
                        case "bottom_left":
                            // that.height=parseInt(that.height)+delta_y;
                            // that.left=that.left=parseInt(that.left)+delta_x;
                            // that.width=that.width-delta_x;
                            r=parseInt(that.height)+delta_y;
                            r1=parseInt(that.left)+delta_x;
                            r2=that.width-delta_x;
                            if(
                                Math.min(r1,0)>=0
                                && r>=that.minHeight
                                && r2>=that.minWidth
                                && (r+that.top)<=that.$parent.ratioHeight
                                && (r2+r1)<=that.$parent.ratioWidth
                            ){
                                that.height=r;
                                that.left=r1;
                                that.width=r2;
                            }
                            break;
                        case "bottom_right":
                            // that.width=parseInt(that.width)+delta_x;
                            // that.height=parseInt(that.height)+delta_y;
                            r=parseInt(that.width)+delta_x;
                            r1=parseInt(that.height)+delta_y;

                            if(
                                (r+that.left)<=that.$parent.ratioWidth
                                && (r1+that.top)<=that.$parent.ratioHeight
                            ){
                                that.width=r;
                                that.height=r1;
                            }

                            break;
                    }

                    that.height=Math.max(that.height,that.minHeight);
                    that.width=Math.max(that.width,that.minWidth);

                    // console.log(that.left,that.top,that.width,that.height);

                    that.ptop=Math.min(100,that.top/that.$parent.ratioHeight*100);
                    that.pleft=Math.min(100,that.left/that.$parent.ratioWidth*100);
                    that.pheight=Math.min(100,that.height/that.$parent.ratioHeight*100);
                    that.pwidth=Math.min(100,that.width/that.$parent.ratioWidth*100);

                    that.pwidth=that.pwidth>99?100:that.pwidth;
                    that.pheight=that.pheight>99?100:that.pheight;


                }
                let mu=function (e) {
                    let deltax=Math.abs(init_x-e.pageX);
                    let deltay=Math.abs(init_y-e.pageY);
                    if(deltax>5 || deltay>5){
                        that.stickSize=[];//窗口发生位移 则取消保存的位置,
                        // that.setSrcCard();//切换信号源
                        that.sendSizeEvent();
                    }

                    document.removeEventListener("mousemove",mv);
                    document.removeEventListener("mouseup",mu);
                }
                document.addEventListener("mousemove",mv);
                document.addEventListener("mouseup",mu);
            },
        },
        mounted(){
            this.globalEvent.$on('language',()=>{
                this.LANG=this.LANGUAGE[this.globalEvent.language];
                if(this.item.resolution.length==1){
                    this.item.resolution=[this.LANG.ATTR_SIGNAL_LOST];
                }
            })
        }
    }
</script>

<style lang="scss">
    .windowItem{
        position:absolute;box-sizing: border-box;
    }
    .vdr-child .content .alertColor{color:#f44f44;}
    .draw-area__dots{
        position: absolute;
        top: 0;
        left: 0;
        cursor:move;
        width: 100%;
        height: 100%
    }
    .draw-area__dot {
        position: absolute;
        width: 8px;
        height: 8px;
        border: 1px solid #1f2e54;
        background-color: #d4e1ff;
        display:none;
        z-index:1;
    }

    .show_dot .draw-area__dot{
        display:block;
    }
    .draw-area__dot--tl {
        top: 0;
        left: 0;
        transform: translate(-50%, -50%);
        cursor: nw-resize;
    }

    .draw-area__dot--t {
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%);
        cursor: n-resize;
    }

    .draw-area__dot--tr {
        top: 0;
        right: 0;
        transform: translate(50%, -50%);
        cursor: ne-resize;
    }

    .draw-area__dot--r {
        top: 50%;
        right: 0;
        transform: translate(50%, -50%);
        cursor: e-resize;
    }

    .draw-area__dot--br {
        bottom: 0;
        right: 0;
        transform: translate(50%, 50%);
        cursor: se-resize;
    }

    .draw-area__dot--b {
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 50%);
        cursor: s-resize;
    }

    .draw-area__dot--bl {
        bottom: 0;
        left: 0;
        transform: translate(-50%, 50%);
        cursor: sw-resize;
    }

    .draw-area__dot--l {
        top: 50%;
        left: 0;
        transform: translate(-50%, -50%);
        cursor: w-resize;
    }

    .vdr-child {
        width: calc(100% - 0);
        height: calc(100% - 0);
        display: flex;
        flex-direction: column;
            .title {
                flex: 0 0 28px;
                display: flex;
                justify-content: space-between;
                color:#fff;
                background: #3078ff;
            .title-win {
                cursor:default;
                padding: 0 6px;
                overflow: hidden;
                span {
                    font-size: 12px;
                    line-height: 28px;
                    white-space: nowrap;
                }
            }
            .title-control {
                display: flex;
                cursor:default;
                justify-content: flex-end;
                align-items: center;
                padding-right: 6px;
                overflow: hidden;
            span {
                padding: 2px;
                cursor:pointer;
            }
            /*span:hover {*/
                /*border-radius: 50%;*/
                /*background: #fff;*/
                /*}*/
            }
        }
        .content {
            flex: 1;
            background: #e6f1fa;
            position:relative;
            overflow: hidden;
            padding: 6px;
            border:1px solid #dcdcdc;
            p{
                font-size: 14px;
                color: #909399;
                padding: 2px;
                text-align: left;
            }
        }
    }
</style>