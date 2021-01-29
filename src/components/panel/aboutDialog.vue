<template>
    <div class="about_dialog">
        <el-dialog
                v-dialogDrag
                width="280px"
                :title="LANG.ABOUT_TITLE" :visible="showDialog=='about'" @close="op(false)"
        >
            {{LANG.ABOUT_TITLE}} : {{globalEvent.version}}<br/>
            {{globalEvent.versionDate}}
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props:['showDialog'],
        data(){
            return {
                LANG:this.LANGUAGE[this.globalEvent.language]
            };
        },
        methods:{
            op(act){
                this.$emit('sub_event',{act:'close_kfs'});
            }
        }
    }
</script>

<style>
    .about_dialog .el-dialog__body{line-height:25px;padding:20px;}
</style>