<template>
    <div class="drawing">
        <div class="resolution-x" :style="`width: ${column*192}px;`">
            <div v-for="(i,index) in column" :key="index">
                <el-input
                        v-model="ranksRow[index]"
                        size="mini"
                        @input="ranks('column',index,ranksRow[index])"
                ></el-input>
            </div>
        </div>
        <div class="resolution-y" :style="`height: ${row*108}px;`">
            <div v-for="(i,index) in row" :key="index">
                <el-input
                        v-model="ranksColumn[index]"
                        size="mini"
                        @input="ranks('row',index,ranksColumn[index])"
                ></el-input>
            </div>
        </div>
        <div class="drawing-list" :style="`width: ${column*192}px; height: ${row*108}px;`">
            <div
                    v-for="(item,index) in portList"
                    :key="index"
                    class="drawing-item"
                    @click="displaySelect(index)"
                    :class="{'display-select':displayIndex === index}"
            >
                <div v-show="displayIndex !== index">
                    <p>{{LANG.SCREEN_NO}}:{{index+1}}</p>
                    <p>{{LANG.ATTR_WIDTH}}:{{item.sizeArr[0]}}</p>
                    <p>{{LANG.ATTR_HEIGHT}}:{{item.sizeArr[1]}}</p>
                    <p>{{LANG.SCREEN_PORT_MAP}}:{{item.mapArr[0]+1}}</p>
                </div>
                <div div v-show="displayIndex === index">
                    <p>{{LANG.SCREEN_NO}}:{{index+1}}</p>
                    <p>{{LANG.ATTR_WIDTH}}:{{item.sizeArr[0]}}</p>
                    <p>{{LANG.ATTR_HEIGHT}}:{{item.sizeArr[1]}}</p>
                    <p>{{LANG.SCREEN_PORT_MAP}}:Port{{item.mapArr[0]+1}}({{LANG.SCREEN_CLICK_PORT}})</p>
                </div>

                <div class="right_arrow" @click="autoSelect"><i class="el-icon-arrow-right"></i></div>
            </div>
        </div>

    </div>
</template>

<script>


    export default {
        props:['item','seq'],
        data(){
            return {
                column:this.item.Col,
                row:this.item.Row,
                displayIndex:-1,//选中的子窗口
                ranksRow:[],
                ranksColumn:[],
                portList:this.item.portArr,
                LANG:this.LANGUAGE[this.globalEvent.language]
            };
        },
        inject: ["comScreen"],
        watch:{
            "globalEvent.selectedPort":function (v,ov) {

                if(this.displayIndex>-1 && this.comScreen.curTabName == this.comScreen.displayList[this.seq].tabName){
                    // console.log(this.displayIndex,this.seq);

                    this.$set(this.portList[this.displayIndex].mapArr,0,v);

                    if(this.comScreen.isRepeatUsed()){
                        alert("该端口已被使用");
                    }

                    this.comScreen.updateUsedPort();

                }

            },
        },
        mounted(){
            this.initScreenPlace()
        },
        methods:{
            setArraySize(k,v){

                if(k=='Col')
                    this.column=v;
                else if(k=='Row'){
                    this.row=v;
                }
                this.initScreenPlace();
            },
            autoSelect(){
                let curPort=this.portList[this.displayIndex].mapArr[0];
                let startPort=curPort+1;
                let startIndex=this.displayIndex+1;
                while(startIndex % this.column >0){

                    this.$set(this.portList[startIndex].mapArr,0,startPort);
                    startPort++;
                    startIndex++;
                }

                this.comScreen.updateUsedPort();
            },
            initScreenPlace(){
                //重排列

                let deltaCount=this.column*this.row-this.portList.length;

                if(deltaCount>0){
                    //增加
                    let emptyPort=JSON.parse(JSON.stringify(this.portList[0]));
                    for(let i =0 ;i<deltaCount;i++){
                        this.portList.push(JSON.parse(JSON.stringify(emptyPort)));
                    }
                }
                else{

                    this.portList.splice(this.portList.length+deltaCount,-deltaCount);
                }


                for(let i in this.portList){
                    this.portList[i].mapArr=[-1];
                }
                this.calRowColumnRank();
            },
            calRowColumnRank(){
                //父组件调用，更新侧边分辨率，
                this.ranksRow=[];
                this.ranksColumn=[];
                for(let i =0;i<this.column;i++){
                    this.ranksRow.push(this.portList[i].sizeArr[0]);
                }
                for(let i=0;i<this.portList.length;i=i+this.column){

                    this.ranksColumn.push(this.portList[i].sizeArr[1]);
                }
            },
            displaySelect(index) {
                // 当前选中的屏幕
                this.displayIndex = index;
            },
            ranks(rc, count, val) {
                //修改行与列的分辨率
                if (rc === "column") {
                    // 列分辨率设置
                    this.portList.forEach((ele, index) => {
                        // console.log(index,ele);
                        if (index % this.column === 0) {
                            this.portList[index + count].sizeArr[0] = val;
                            // console.log(index, ele);
                        }
                    });
                }
                if (rc === "row") {
                    // 行分辨率设置
                    let start = count * this.column;
                    for (let i = start; i < start + this.column; i++) {
                        this.portList[i].sizeArr[1] = val;
                    }
                }
            }
        }
    }
</script>

<style>

</style>