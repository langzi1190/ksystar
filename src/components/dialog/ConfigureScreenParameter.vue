<template>
  <div>
    <div class="set-screen">
      <div>
        <span>屏幕分辨率:</span>
        <el-select
                v-model="resolutionValue"
                placeholder="请选择分辨率"
                size="mini"
                style="width:115px">
          <el-option
            v-for="item in resolution"
            v-show="item.videoId>-1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <div class="hideShow" v-show="resolutionValue=='' || resolutionValue=='-1'">{{rv}}</div>
      </div>
      <div>
        <span>屏幕刷新HZ:</span>
        <el-select v-model="hertzValue" placeholder="请选择HZ" size="mini" style="width: 85px;">
          <el-option
            v-for="item in hertz"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div style="padding-top: 4px;">
        <el-checkbox v-model="TimingMode" :true-label=1 :false-label=0>
          <i style="font-size: 12px;">LCD模式</i>
        </el-checkbox>
      </div>
    </div>
    <div class="set-screen">
      <div>
        <span>行数:</span>
        <el-input-number
          v-model="rowNum"
          :min="1"
          size="mini"
          style="width: 100px;"
        ></el-input-number>
      </div>
      <div>
        <span>列数:</span>
        <el-input-number
          v-model="columnNum"
          :min="1"
          size="mini"
          style="width: 100px;"
        ></el-input-number>
      </div>
      <div>
        <el-button type="danger" size="mini" @click="opScreen('del')">删除屏幕墙</el-button>
      </div>
      <div>
        <el-button type="primary" size="mini" @click="opScreen('add')">添加屏幕墙</el-button>
      </div>
    </div>
    <div style="margin-top:5px;margin-bottom:10px;font-size:12px;color:#409EFF;">提示：单击深灰色背景表格可以更改屏幕参数</div>
      <Rs @sub_event="subEvent" v-if="showSetting" :showSetting="showSetting"></Rs>
      <Ts @sub_event="subEvent" v-if="showTimeSeq" :showSetting="showTimeSeq"></Ts>
  </div>
</template>

<script>
// 分辨率选项
const resolution = [
      {
          videoId:107,
          value: "1024*768",
          label: "1024*768"
      },
      {
          videoId:4,
          value: "1280*720",
          label: "1280*720"
      },
      {
          videoId:108,
          value: "1280*768",
          label: "1280*768"
      },
      {
          videoId:109,
          value: "1280*800",
          label: "1280*800"
      },
      {
          videoId:110,
          value: "1280*960",
          label: "1280*960"
      },
      {
          videoId:100,
          value: "1280*1024",
          label: "1280*1024"
      },
    {
        videoId:111,
        value: "1360*768",
        label: "1360*768"
    },
    {
        videoId:112,
        value: "1366*768",
        label: "1366*768"
    },
    {
        videoId:116,
        value: "1400*1050",
        label: "1400*1050"
    },
    {
        videoId:113,
        value: "1440*900",
        label: "1440*900"
    },
    {
        videoId:101,
        value: "1600*900",
        label: "1600*900"
    },
    {
        videoId:104,
        value: "1600*1200",
        label: "1600*1200"
    },
    {
        videoId:114,
        value: "1680*1050",
        label: "1680*1050"
    },
    {
        videoId:16,
        value: "1920*1080",
        label: "1920*1080"
    },
    {
        videoId:102,
        value: "1920*1200",
        label: "1920*1200"
    },
    {
        videoId:103,
        value: "2048*1152",
        label: "2048*1152"
    },
    {
        videoId:105,
        value: "1536*1536",
        label: "1536*1536"
    },
    {
        videoId:117,
        value: "1920*2160",
        label: "1920*2160"
    },
    {
        videoId:106,
        value: "2560*960",
        label: "2560*960"
    },
    {
        videoId:0,
        value:'',
        label:'自定义'
    },
    {
        videoId:-1,
        value:'-1',
        label:'自定义'
    }
];

// 赫兹选项
const hertz = [
  {
    value: "60HZ",
    label: "60HZ"
  },
  {
    value: "50HZ",
    label: "50HZ"
  }
];
import Rs from '@/components/dialog/ResolutionSet';
import Ts from '@/components/dialog/TimeSeq';
export default {
  props:['item','seq'],
  data() {

      let rv=this.item.FormatW+'*'+this.item.FormatH;
      let videoId=this.item.VideoId;
      // console.log('fbl');
      // console.log(this.item);
      // let frameRate=this.item.FrameRate==0?60:50;
      return {
          resolution,
          hertz,
          rv,
          w:0,h:0,
          resolutionValue:videoId==0?'-1':rv,
          videoId:-1,
          beforeRv:'',//自定义 前分辨率
          hertzValue:this.item.FrameRate+'HZ',
          rowNum: this.item.Row,
          columnNum: this.item.Col,
          TimingMode: this.item.TimingMode,
          showSetting:false,
          showTimeSeq:false
      };
  },
    methods:{

        setParentData(k,v){
            this.item[k]=v;
            //k:Row,Col,hertzValue,lcdMode,resolutionValue
            this.$emit('sub_event',{act:k,seq:this.seq,v:v});
        },
        opScreen(act){
            if(act=='del' && !confirm("确定删除？")){
                return ;
            }
            this.$emit('sub_event',{act,seq:this.seq});
        },
        subEvent(param){
            if(param.act=='closeSetDialog'){
                this.resolutionValue=this.beforeRv;//恢复分辨率
                this.showSetting=false;
            }
            else if(param.act=='closeTimeSeqDialog'){
                this.showTimeSeq=false;
            }
            else if(param.act=='setResolution'){

                this.$emit('sub_event',{act:'resolutionValue',seq:this.seq,v:param.x+'*'+param.y,videoId:0});
                this.rv=param.x+'*'+param.y;
                // this.videoId=-1;

                this.showSetting=false;
                setTimeout(()=>{
                    //不加延迟 会被 v-model 覆盖
                    this.resolutionValue='-1';//显示自定义
                },600);

            }
            else if(param.act=='showTimeSeq'){
                console.log(param);
                this.resolutionValue=this.beforeRv;//恢复分辨率
                this.w=param.x;//给时序设置用
                this.h=param.y;
                // this.showSetting=false;
                this.showTimeSeq=true;
            }
        }
    },
    watch:{
        resolutionValue(v,ov){

            console.log(v,this.videoId);


            if(v=='-1'){
                return ;
            }
            if(v==''){
                this.beforeRv=ov;
                //自定义
                this.showSetting=true;
                return ;
            }

            if(this.videoId==-1){
                resolution.forEach((ele,k)=>{
                    if(v==ele.value) {
                        this.videoId=ele.videoId;
                    }
                });

            }
            this.$emit('sub_event',{act:'resolutionValue',seq:this.seq,v:v,videoId:this.videoId});
            this.videoId=-1;

        },
        hertzValue(v,ov){
            v=v.replace('HZ','');
            // let s=v==30?2:(v==60?0:1);
            this.setParentData('FrameRate',parseInt(v));
        },

        rowNum(v,ov){
            if(v*this.item.Col>this.globalEvent.validOutCardCount){
                // alert("超出可用输出卡数量");
                this.$nextTick(()=>{
                    this.rowNum=ov;
                })
                return ;
            }
            this.setParentData('Row',v);
        },
        columnNum(v,ov){
            if(this.item.Row*v>this.globalEvent.validOutCardCount){
                // alert("超出可用输出卡数量");
                this.$nextTick(()=>{
                    this.columnNum=ov;
                })
                return ;
            }
            this.setParentData('Col',v);
        },
        TimingMode(v,ov){
            this.setParentData('TimingMode',v);
        }

    },
    components:{
        Rs,Ts
    }

};
</script>

<style lang="scss">
.set-screen {
  font-size: 12px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin-bottom: 8px;
  span {
    padding-right: 6px;
  }
  .hideShow{display:inline-block;}
}
</style>