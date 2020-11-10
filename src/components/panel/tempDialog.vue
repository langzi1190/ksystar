<template>
    <div class="temp_dialog">
        <el-dialog :title="LANG.TEMP_TITLE" :visible="showDialog=='temp'" @close="op(false)">
            <div class="top_part">
                <template  v-for="(item,index) in tempInfo.ctrlCard">
                    <div>
                        <label>
                            <input type="checkbox" :false-value=0 :true-vallue=1 v-model="item.show"/>{{LANG.TEMP_CONTROL}}_{{index+1}}
                        </label>
                        <div class="temp" :style="{backgroundColor:item.color}">{{item.temp}} ℃</div>
                    </div>
                </template>

                <template  v-for="(item,index) in tempInfo.syncCard">
                    <div>
                        <label>
                            <input type="checkbox" :false-value=0 :true-vallue=1 v-model="item.show"/>{{LANG.TEMP_SYNC}}_{{index+1}}
                        </label>
                        <div class="temp" :style="{backgroundColor:item.color}">{{item.temp}} ℃</div>
                    </div>
                </template>
                <template  v-for="(item,index) in tempInfo.monitorCard">
                    <div>
                        <label>
                            <input type="checkbox" :false-value=0 :true-vallue=1 v-model="item.show"/>{{LANG.TEMP_MONITOR}}_{{index+1}}
                        </label>
                        <div class="temp" :style="{backgroundColor:item.color}">{{item.temp}} ℃</div>
                    </div>
                </template>
                <template  v-for="(item,index) in tempInfo.outCard">
                    <div>
                        <label>
                            <input type="checkbox" :false-value=0 :true-vallue=1 v-model="item.show"/>{{LANG.TEMP_OUTPUT}}_{{index+1}}
                        </label>
                        <div class="temp" :style="{backgroundColor:item.color}">{{item.temp}} ℃</div>
                    </div>
                </template>
                <template  v-for="(item,index) in tempInfo.inCard">
                    <div>
                        <label>
                            <input type="checkbox" :false-value=0 :true-vallue=1 v-model="item.show"/>{{LANG.TEMP_INPUT}}_{{index+1}}
                        </label>
                        <div class="temp" :style="{backgroundColor:item.color}">{{item.temp}} ℃</div>
                    </div>
                </template>

            </div>
            <div class="canvas_wrapper">
                <canvas ref="canvas" width="700" height="450"></canvas>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import drawTemp from "@/store/drawTemp.js";
    let tempArr=[];
    let timeout_event=0;
    let temp_index=0,lastx=0,lasty=0;
    let color_arr=['black','red','orange','gray','blue','chocolate','brown'];
    let color_index=0;
    let readCountPerSec=2;//每秒读取次数
    let maxArrLen=60*readCountPerSec;//存储最长数据
    export default {
        props:['showDialog'],
        data(){
            return {
                tempInfo:{

                },
                LANG:this.LANGUAGE[this.globalEvent.language]
            };
        },
        destroyed(){
            color_index=0;
            tempArr=[];
            clearTimeout(timeout_event);
        },
        mounted(){
            setTimeout(()=>{
                drawTemp.initDraw({
                    el:this.$refs.canvas,
                    totalWidth:700,
                    totalHeight:400,
                });
                this.getData();
            },300)
        },
        methods:{
            op(act){
                this.$emit('sub_event',{act:'close_kfs'});
            },
            getData(){
                this.$http.post("fpgaTempRd.cgi",{},(ret)=>{

                    let data=ret.data;

                    if(data.ctrlCardArr.length>0){
                        this.addTempInfo('ctrlCard',data.ctrlCardArr);
                    }
                    if(data.syncCardArr.length>0){
                        this.addTempInfo('syncCard',data.syncCardArr);
                    }
                    if(data.monitorCardArr.length>0){
                        this.addTempInfo('monitorCard',data.monitorCardArr);
                    }
                    if(data.outCardArr.length>0){
                        this.addTempInfo('outCard',data.outCardArr);
                    }
                    if(data.inCardArr.length>0){
                        this.addTempInfo('inCard',data.inCardArr);
                    }

                    this.drawTemp();

                    timeout_event=setTimeout(()=>{
                        this.getData();
                    },500);
                });
            },
            addTempInfo(key,param){
                if(this.tempInfo[key]===undefined){
                    this.$set(this.tempInfo,key,[]);
                    for(let i in param){
                        let card={
                            color:color_arr[color_index++],
                            show:1,
                            temp:param[i]/10,
                            tempData:[param[i]/10]
                        };
                        this.tempInfo[key].push(card);
                    }
                }
                else{
                    for(let i in param){
                        this.tempInfo[key][i].tempData.push(param[i]/10);
                        this.tempInfo[key][i].temp=param[i]/10;
                        let len=this.tempInfo[key][i].tempData.length;
                        if(len>maxArrLen){

                            this.tempInfo[key][i].tempData.splice(0,len-maxArrLen);

                        }
                    }
                }

            },
            drawTemp(){
                drawTemp.clearCanvas();
                for(let key in this.tempInfo){
                    for(let i in this.tempInfo[key]){
                        let card=this.tempInfo[key][i];
                        if(card.show==1){
                            tempArr=card.tempData;
                            this.drawPoint(card.color);
                        }

                    }
                }
            },
            drawPoint: function (color) {
                let x, y;
                if (temp_index < tempArr.length) {
                    [x, y] = drawTemp.temp2Cood(tempArr[temp_index], temp_index + 1, readCountPerSec);//
                }
                else {
                    temp_index = 0;
                    return;
                }
                temp_index++;

                if (temp_index == 1) {
                    [lastx, lasty] = [x, y];
                }
                else {
                    drawTemp.drawPoint(lastx, lasty, x, y, color);
                    [lastx, lasty] = [x, y];
                }

                this.drawPoint(color);
            }
        }
    }
</script>

<style>
    .temp_dialog .el-dialog{width:800px;}
    .top_part > div{display:inline-block;}
    .top_part .temp{display:inline-block;color:#fff;height: 25px;line-height: 25px;margin: 0 10px;padding: 0 5px;width:30px;vertical-align: middle;}
    .top_part label input{vertical-align: middle;margin-right:5px;}
    .canvas_wrapper{margin-top:15px;}
    .canvas_wrapper canvas{margin:0 auto;}
</style>