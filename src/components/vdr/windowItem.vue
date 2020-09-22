<template>
    <div class="windowItem" :style="{
        top:(partOrAll==0?ptop:0)+'%',
        left:(partOrAll==0?pleft:0)+'%',
        width:(partOrAll==0?pwidth:100)+'%',
        height:(partOrAll==0?pheight:100)+'%',
        zIndex:zIndex
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

            <div class="title"  data-type="move" @mousedown.stop="handleMouseDown">
                <div class="title-win"  data-type="move" @mousedown.stop="handleMouseDown">
                    <span>Win-{{seq+1}}:{{globalEvent.cardLabelExtra(item.srcCardId,item.srcId)}}</span>
                </div>
                <div class="title-control">
                    <span @click.stop="windowEdit('0')">
                        <i class="el-icon-minus" style="color: #91dd9d"></i>
                    </span>
                    <span @click.stop="windowEdit('3')">
                        <i class="el-icon-bottom-left" style="font-weight:bold;font-size:18px;"></i>
                    </span>
                    <span @click.stop="windowEdit('1')">
                        <i class="el-icon-plus" style="color: #ffcd8a"></i>
                    </span>
                    <span @click.stop="windowEdit('2')">
                        <i class="el-icon-ride" style="color: #ff8739"></i>
                    </span>
                </div>
            </div>
            <div class="content">
                <p>Title:Hello</p>
                <p>X: {{ o_left }}</p>
                <p>Y: {{ o_top }}</p>
                <p>Width: {{ o_width }}</p>
                <p>Height: {{ o_height }}</p>
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

            if(this.item.partOrAll==1){
                ptop=pleft=0;
                pwidth=pheight=100;

            }

            return {
                ptop:ptop,//比例位置
                pleft:pleft,
                pwidth:pwidth,
                pheight:pheight,

                partOrAll:this.item.partOrAll,

                top:parseInt(ptop*this.$parent.ratioHeight/100),//相对当前面板的坐标,目标拖拽使用
                left:parseInt(pleft*this.$parent.ratioWidth/100),
                width:parseInt(pwidth*this.$parent.ratioWidth/100),
                height:parseInt(pheight*this.$parent.ratioHeight/100),

                zIndex:this.item.layerId,
                o_left:this.item.winSizeArr[0],
                o_top:this.item.winSizeArr[1],//物理坐标
                o_width:this.item.winSizeArr[2],
                o_height:this.item.winSizeArr[3],


                stickSize:[],//保存吸附辅助线前数据
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
            setWindowSize(param){
                //根据侧边栏的参数调整 窗口参数,/vdr/index.vue 调用
                if(param.act=='top'){
                    this.item.winSizeArr[1]=param.v;
                    this.ptop=param.v*100/this.$parent.totalHeight;
                }
                else if(param.act=='left'){
                    this.item.winSizeArr[0]=param.v;
                    this.pleft=param.v*100/this.$parent.totalWidth;
                }
                else if(param.act=='width'){
                    this.item.winSizeArr[2]=param.v;
                    this.pwidth=param.v*100/this.$parent.totalWidth;
                }
                else if(param.act=='height'){
                    this.item.winSizeArr[3]=param.v;
                    this.pheight=param.v*100/this.$parent.totalHeight;
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
                this.height=Math.ceil(this.pheight*this.$parent.ratioHeight/100);
                this.left=Math.ceil(this.pleft*this.$parent.ratioWidth/100);
                this.width=Math.ceil(this.pwidth*this.$parent.ratioWidth/100);
            },
            windowEdit(val) {
                if (val === "0") {
                    this.partOrAll=0;
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
                    }



                }
                else if (val === "1") {

                    this.partOrAll=1;

                    this.o_top=this.o_left=0;
                    this.o_width=this.$parent.totalWidth;
                    this.o_height=this.$parent.totalHeight;

                    this.sendSizeEvent();
                }
                else if (val === "2") {
                    // this.$emit('sub_event',{act:'delete_window_item',seq:this.seq})
                    this.globalEvent.$emit("close_window_item",{act:'cur'});
                }
                else if(val==='3'){
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
                    // this.top=Math.ceil(this.ptop*this.$parent.ratioHeight/100);
                    // this.height=Math.ceil(this.pheight*this.$parent.ratioHeight/100);
                    // this.left=Math.ceil(this.pleft*this.$parent.ratioWidth/100);
                    // this.width=Math.ceil(this.pwidth*this.$parent.ratioWidth/100);
                }

            },
            handleMouseDown(ev){
                if(this.partOrAll==1){
                    return ;
                }
                ev.stopPropagation();
                ev.preventDefault();
                var that=this;

                if(this.globalEvent.selectedWindowIndex!=this.seq){
                    //选则当前窗体
                    this.globalEvent.selectedWindowIndex=this.seq;
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
                    switch(type){
                        case "top":
                            r = parseInt(that.top)+delta_y;
                            if(Math.max(r,0)>0){
                                that.top=r;
                                that.height=that.height-delta_y;
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
                            if(Math.min(r,0)>=0){
                                that.left=r;
                                that.width=that.width-delta_x;
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
                            r=parseInt(that.top)+delta_y;
                            r1=that.height-delta_y;
                            r2=parseInt(that.left)+delta_x;
                            r3=that.width-delta_x;

                            if(
                                Math.min(r,0)>=0
                                && (r1+r)<=that.$parent.ratioHeight
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

                    that.height=Math.max(that.height,35);
                    that.width=Math.max(that.width,35);

                    console.log(that.left,that.top,that.width,that.height);

                    that.ptop=that.top/that.$parent.ratioHeight*100;
                    that.pleft=that.left/that.$parent.ratioWidth*100;
                    that.pheight=that.height/that.$parent.ratioHeight*100;
                    that.pwidth=that.width/that.$parent.ratioWidth*100;

                }
                let mu=function (e) {
                    if(Math.abs(init_x-e.pageX)>5 || Math.abs(init_y-e.pageY)>5){
                        that.stickSize=[];//窗口发生位移 则取消保存的位置
                    }

                    that.sendSizeEvent();

                    document.removeEventListener("mousemove",mv);
                    document.removeEventListener("mouseup",mu);
                }
                document.addEventListener("mousemove",mv);
                document.addEventListener("mouseup",mu);
            },
        }
    }
</script>

<style lang="scss">
    .windowItem{
        position:absolute;box-sizing: border-box;
    }

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
        background: #FFF;
        border: 1px solid #333;
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
                background: #409eff;
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
            }
            span:hover {
                border-radius: 50%;
                background: #fff;
                }
            }
        }
        .content {
            flex: 1;
            background: #e4e7ed;
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