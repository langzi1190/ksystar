<template>
    <div class="status_dialog">
        <el-dialog title="设备配置状态" :visible="showDialog=='deviceStatus'" @close="op(false)">
            <table style="width:100%">
                <tr>
                    <th colspan="5">类型</th>
                    <th width="120">内存 OK</th>
                    <th width="120">视频传输 OK</th>
                    <th width="120">控制 OK</th>
                    <th width="120">FLASH保护 OK</th>
                </tr>
                <tbody>
                    <tr v-for="(item,index) in cardArrReverse">
                        <td>{{cardArrReverse.length-index}}</td>
                        <td>{{item.cardName}}</td>
                        <td>{{item.portName.length>0?item.portName[0]:''}}</td>
                        <td>{{item.portName.length>1?item.portName[1]:''}}</td>
                        <td>{{item.portName.length>2?item.portName[2]:''}}</td>

                        <td :class="{fail:item.memory==0}"><i :class="[item.memory==1?'el-icon-success':'el-icon-error']"></i></td>
                        <td :class="{fail:item.vedio==0}"><i :class="[item.vedio==1?'el-icon-success':'el-icon-error']"></i></td>
                        <td :class="{fail:item.ctrl!=0}"><i :class="[item.ctrl==0?'el-icon-success':'el-icon-error']"></i></td>
                        <td>{{item.flashInfo}}</td>
                    </tr>
                </tbody>

                <tr style="background-color:lightblue">
                    <td colspan="5">控制卡</td>
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

    const cardType={
        'type0':'输入卡',
        'type1':'输出卡',
        'type2':'监视卡',
        'type3':'空',
        'type4':'输入增强卡',
        'type5':'输出增强卡',
        'type6':'控制卡',
        'type7':'同步卡',
    };
    const portType={
        "type0":"DEFAULT",
        "type1":"CV",
        "type2":"DVI",
        "type3":"VGA",
        "type4":"HDMI",
        "type5":"SDI",
        "type6":"YPBPR",
        "type7":"SVIDEO",
        "type8":"DUAL_DVI",
        "type9":"HDMI_4K30",
        "type10":"DP",
        "type11":"NET",
        "type12":"FIBER",
        "type13":"HDBASET",
        "type14":"CV2",
        "type15":"USB",
        "type16":"HDMI4K_DP4K",
        "type17":"HDMISDI",
        "type18":"HDMIDP4K30",
        "type255":"NONE",
    };
    const flashType={
        'type0':'NONE',
        'type1':'ALL_UNLOCK',
        'type2':'128_BOOT_LOCK',
        'type3':'256_BOOT_LOCK',
        'type4':'ALL_LOCK',
        'type5':'KEEP',
    };
    export default {
        props:['showDialog'],
        data(){
            return {
                color_list:['pink','gray','orange','#00cc99'],
                cardStatus:{},
                cardArrReverse:[],
                // validCardCount:0,
            };
        },
        mounted(){
            this.$http.get("devCfgStaRd.cgi",{},(ret)=>{
                // this.validCardCount=0;
                let cardArrReverse=[];

                for(let i in ret.data.cardArr){
                    ret.data.cardArr[i].cardName=cardType['type'+ret.data.cardArr[i].cardType];//cardType?读取的是 16进制？


                    ret.data.cardArr[i].portName=[];
                    let portTypeArr=ret.data.cardArr[i].portTypeArr;
                    for(let k in portTypeArr){
                        ret.data.cardArr[i].portName.push(portType['type'+portTypeArr[k]]);
                    }

                    ret.data.cardArr[i].flashInfo=flashType['type'+ret.data.cardArr[i].flashPrt]

                    if(ret.data.cardArr[i].cardType!=3){
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