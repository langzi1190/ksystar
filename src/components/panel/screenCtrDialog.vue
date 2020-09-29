<template>
    <div class="screen_ctr_dialog">
        <el-dialog title="大屏幕控制" :visible="showDialog=='screenCtr'" @close="op(false)">
            <div class="dialog_body">
                <div class="left_body">
                    <div class="item">
                        <span>屏幕类型:</span>
                        <el-select disabled v-model="screenType" size="mini" placeholder="无">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </div>

                    <fieldset>
                        <legend>屏幕序号</legend>
                        <label><input type="radio"/>先行后列顺序</label>
                        <label><input type="radio"/>先列后行顺序</label>
                        <label><input type="radio"/>先行后列矩阵</label>
                        <label><input type="radio"/>先列后行矩阵</label>
                    </fieldset>
                </div>
                <div class="right_body">
                    <div class="item">
                        <span>COM 波特率:</span>
                        <el-select disabled v-model="screenType" size="mini" placeholder="无">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>

                        <fieldset>
                            <legend>大屏幕功能设置</legend>
                            <div class="tip">通讯延迟（毫秒）</div>
                            <el-input-number  size="mini"></el-input-number>
                            <label><input v-model="shutAble" :false-value=0 :true-value=1 type="checkbox"/>允许开关屏{{shutAble}}</label>
                        </fieldset>
                    </div>
                </div>
            </div>

            <fieldset>
                <legend>自定义命令</legend>
                <div class="dialog_body">
                    <div class="left_body">
                        <div class="b_tip">开机命令：</div>
                        <el-input
                                :disabled="shutAble==0"
                                type="textarea"
                                :rows="4"
                                v-model="startCode">
                        </el-input>
                    </div>
                    <div class="right_body">
                        <div class="b_tip">关机命令：</div>
                        <el-input
                                :disabled="shutAble==0"
                                type="textarea"
                                :rows="4"
                                v-model="shutCode">
                        </el-input>
                    </div>
                </div>
            </fieldset>

            <div class="b_tip" style="line-height:25px;">每一行对应一条命令<br/>十六禁止格式：A1 B2 33 55</div>
            <div class="b_tip" style="text-align:center;">
                <el-button size="mini">确定</el-button> <el-button size="mini">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props:['showDialog'],
        data(){
            return {
                userModel:1,
                options:[{
                    'value':12,
                    'label':'无'
                    }
                ],
                screenType:'',
                screenSeq:0,
                shutAble:0,
                shutCode:'',
                startCode:'',
            };
        },
        methods:{
            op(act){
                if(!act){
                    this.$emit('sub_event',{act:'close_kfs'});
                }
                else{
                    console.log('sure')
                    this.$emit('sub_event',{act:'close_kfs'});
                }
            }
        }
    }
</script>

<style>
    .screen_ctr_dialog .el-dialog{width:700px;}
    .screen_ctr_dialog .dialog_body{width:650px;display:flex;justify-content: space-between;margin-top:0;}
    .screen_ctr_dialog .dialog_body > div{width:310px;border:none;padding:0;height:220px;background-color:transparent;}
    .screen_ctr_dialog .dialog_body .el-select--mini{margin:0 0 0 10px;width:130px;}
    .screen_ctr_dialog fieldset{border:1px solid #dcdcdc;margin-top:15px;position:relative;height:170px;}
    .screen_ctr_dialog legend{padding: 0 5px;margin-left: 10px;}
    fieldset label{display:block;margin:15px 10px;}
    .screen_ctr_dialog .tip{margin:15px 0 15px 15px;}
    .screen_ctr_dialog .el-input-number{margin-left:15px;}
    .screen_ctr_dialog .b_tip{margin-top:10px;}
    fieldset .dialog_body > div{max-height:150px;}
    fieldset .dialog_body > div .b_tip{margin-left:15px;}
    .dialog_body .el-textarea{margin:10px;width:280px;}

</style>