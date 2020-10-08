let drawTemp={
    context:'',
    temp_height:0,//60-100度 高度
    temp_width:0,
    temp_start_height:70,//60度的起始高度
    param:{
        el:'',
        totalWidth:700,
        totalHeight:400,
        width:700,
        height:400,
        origin_x:100,
        origin_y:350
    },
    initDraw(param){
        Object.assign(this.param,param);
        this.param.width=this.param.totalWidth-200;
        this.param.height=this.param.totalHeight-100;

        this.context=this.param.el.getContext('2d');
        this.drawAxis();
    },
    drawAxis(){
        this.drawLine(this.param.origin_x,50,0,this.param.height+25);
        this.drawLine(this.param.origin_x-25,this.param.origin_y,this.param.width+25,0);
        this.temp_height=this.param.height-this.temp_start_height-30;//上留50 下 留 temp_start_height 像素间距[60-100度距离]
        this.temp_width=this.param.width-50;//60秒的长度

        this.context.font="bold 20px 黑体";
        this.context.fillStyle="#505050";
        this.context.fillText("60℃",this.param.origin_x-55,this.param.origin_y-this.temp_start_height);
        this.drawLine(this.param.origin_x,this.param.origin_y-this.temp_start_height,-5,0);
        this.context.fillText("80℃",this.param.origin_x-55,this.param.origin_y-this.temp_start_height-this.temp_height/2);
        this.drawLine(this.param.origin_x,this.param.origin_y-this.temp_start_height-this.temp_height/2,-5,0);
        this.context.fillText("100℃",this.param.origin_x-55,this.param.origin_y-this.temp_start_height-this.temp_height);
        this.drawLine(this.param.origin_x,this.param.origin_y-this.temp_start_height-this.temp_height,-5,0);

        this.context.fillText("60(s)",this.param.origin_x+this.param.width-50,this.param.origin_y+20);
        this.drawLine(this.param.origin_x+this.temp_width,this.param.origin_y,0,5);
    },
    drawLine(x,y,w,h){
        //画直线，
        this.context.beginPath();
        this.context.lineWidth=2;
        this.context.strokeStyle="#505050";
        this.context.moveTo(x,y);
        this.context.lineTo(x+w,y+h);
        this.context.stroke();
        this.context.closePath();
    },
    clearCanvas(){
        this.context.clearRect(this.param.origin_x+1,this.param.totalHeight-this.param.origin_y,this.param.width,this.param.height-1);
    },
    temp2Cood(temp,sec,c=2){
        //温度转坐标,c:一秒钟读多少次
        let x=sec/60/c*this.temp_width+this.param.origin_x;
        let y=0;
        if(temp>60){
            y=this.param.origin_y-this.temp_start_height-(temp-60)/40*this.temp_height;
        }
        else{
            y=this.param.origin_y-this.temp_start_height*temp/60;
        }

        return [x,y]
    },
    drawPoint(lastx,lasty,x,y,color){
        //描点
        this.context.beginPath();
        this.context.strokeStyle=color;
        this.context.moveTo(lastx,lasty);
        this.context.lineTo(x,y);
        this.context.stroke();
        this.context.closePath();
    }
};
export default drawTemp;