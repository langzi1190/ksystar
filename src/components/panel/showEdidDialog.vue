<template>
    <div class="show_edid_dialog">
        <el-dialog
                title="EDID数据"
                :visible="showDialog=='showEdid'"
                width="500px"
                @close="op"
                center
        >
            <div class="data_body">
                <textarea readonly v-model="s">

                </textarea>
            </div>
            <div style="text-align:center;margin-top:15px;">
                <el-button size="mini" @click="op">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props:['showDialog'],
        data(){
            return {
                s:""
            };
        },
        mounted(){
            let a=this.$parent.edidData;
            let arr=[];
            a.forEach((v,k)=>{
                arr.push('0x'+Number(v).toString(16).toUpperCase());
            })
            this.s=arr.join(',');
        },
        methods:{
            op(){
                this.$emit("sub_event",{act:'close_kfs'});
            }
        }
    }
</script>

<style>
    .show_edid_dialog textarea{
            width:450px;height:180px;padding:5px;outline:none;
    }
</style>