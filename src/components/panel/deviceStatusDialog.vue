<template>
    <div class="status_dialog">
        <el-dialog  v-dialogDrag :title="LANG.DEV_STATUS_TITLE" :visible="showDialog=='deviceStatus'" @close="op(false)">
            <table style="width:100%">
                <tr>
                    <th colspan="5">{{LANG.VERSION_TYPE}}</th>
                    <th width="120">{{LANG.DEV_STATUS_MEM}}</th>
                    <th width="120">{{LANG.DEV_STATUS_VIDEO}}</th>
                    <th width="120">{{LANG.DEV_STATUS_CONTROL}}</th>
                    <th width="120">{{LANG.DEV_STATUS_FLASH}}</th>
                </tr>
                <tbody>
                    <template  v-for="(item,index) in cardArrReverse">
                        <tr v-if="item.cardType==3">
                            <td>{{cardArrReverse.length-index}}</td>
                            <td>{{LANG.TEMP_NONE}}</td>
                            <td></td>
                            <td></td>
                            <td></td>

                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr v-else>
                            <td>{{cardArrReverse.length-index}}</td>
                            <td>{{item.cardName}}</td>
                            <td>{{item.portName.length>0?item.portName[0]:''}}</td>
                            <td>{{item.portName.length>1?item.portName[1]:''}}</td>
                            <td>{{item.portName.length>2?item.portName[2]:''}}</td>

                            <td :class="{fail:item.memory==0}"><i :class="[item.memory==1?'el-icon-success':'el-icon-error']"></i></td>
                            <td :class="{fail:item.vedio==0}"><i :class="[item.vedio==1?'el-icon-success':'el-icon-error']"></i></td>
                            <td :class="{fail:item.ctrl!=0}"><i :class="[item.ctrl==0?'el-icon-success':'el-icon-error']"></i></td>
                            <td :class="{fail:item.flash_ok==0}"><i :class="[item.flash_ok==1?'el-icon-success':'el-icon-error']"></i></td>
                        </tr>
                    </template>

                </tbody>

                <tr style="background-color:lightblue">
                    <td colspan="5">{{LANG.TEMP_CONTROL}}</td>
                    <td :class="{fail:cardStatus.ctrlCard_M==0}"><i :class="[cardStatus.ctrlCard_M==1?'el-icon-success':'el-icon-error']"></i></td>
                    <td :class="{fail:cardStatus.ctrlCard_V==0}"><i :class="[cardStatus.ctrlCard_V==1?'el-icon-success':'el-icon-error']"></i></td>
                    <td></td>
                    <td></td>
                </tr>
            </table>
        </el-dialog>
    </div>
</template>

<script>

    let cardType={
        'type0':"输入卡",
        'type1':"输出卡",
        'type2':"监视卡",
        'type3':"空",
        'type4':'输入增强卡',
        'type5':'输出增强卡',
        'type6':"控制卡",
        'type7':"同步卡",
    };

    // const flashType={
    //     'type0':'NONE',
    //     'type1':'ALL_UNLOCK',
    //     'type2':'128_BOOT_LOCK',
    //     'type3':'256_BOOT_LOCK',
    //     'type4':'ALL_LOCK',
    //     'type5':'KEEP',
    // };
    export default {
        props:['showDialog'],
        data(){
            let LANG=this.LANGUAGE[this.globalEvent.language];
            cardType={
                'type0':LANG.TEMP_INPUT,
                'type1':LANG.TEMP_OUTPUT,
                'type2':LANG.TEMP_MONITOR,
                'type3':LANG.TEMP_NONE,
                'type4':LANG.TEMP_ENHANCE_INPUT,
                'type5':LANG.TEMP_ENHANCE_OUTPUT,
                'type6':LANG.TEMP_CONTROL,
                'type7':LANG.TEMP_SYNC,
            };
            return {
                color_list:['pink','gray','orange','#00cc99'],
                cardStatus:{},
                cardArrReverse:[],
                LANG:LANG
            };
        },
        mounted(){
            this.$http.get("devCfgStaRd.cgi",{},(ret)=>{
                // this.validCardCount=0;
                let cardArrReverse=[];
                let portType=this.globalEvent.pType;
                for(let i in ret.data.cardArr){
                    ret.data.cardArr[i].cardName=cardType['type'+ret.data.cardArr[i].cardType];//cardType?读取的是 16进制？


                    ret.data.cardArr[i].portName=[];
                    let portTypeArr=ret.data.cardArr[i].portTypeArr;
                    for(let k in portTypeArr){

                        ret.data.cardArr[i].portName.push(portType['p'+portTypeArr[k]]);

                    }

                    // ret.data.cardArr[i].flashInfo=flashType['type'+ret.data.cardArr[i].flashPrt]
                    ret.data.cardArr[i].flash_ok=(ret.data.cardArr[i].flashPrt==2 ||ret.data.cardArr[i].flashPrt==3)?1:0;

                    if(ret.data.cardArr[i].cardType!=3){
                        cardArrReverse.push(JSON.parse(JSON.stringify(ret.data.cardArr[i])));
                    }
                    else{
                        cardArrReverse.push(JSON.parse(JSON.stringify(ret.data.cardArr[i])));
                    }
                }
                this.cardStatus=ret.data;

                // this.validCardCount=cardArrReverse.length;
                this.cardArrReverse=cardArrReverse.reverse();

            });
        },
        methods:{
            op(act){
                this.$emit('sub_event',{act:'close_kfs'});
            },
        }
    }
</script>

<style>
    .status_dialog .el-dialog{width:900px;}
    .status_dialog i{font-size:25px;vertical-align: middle;color:#00cc99;}
    .status_dialog table tr:hover td{background-color:#f3f2f0;}
    .status_dialog .fail i{color:#f44f44;}
    .status_dialog td,.status_dialog th{height:30px;text-align:center;line-height:30px;border: 1px solid #505050;}
</style>