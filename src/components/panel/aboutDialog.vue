<template>
    <div class="about_dialog">
        <el-dialog
                width="300px"
                :title="LANG.ABOUT_TITLE" :visible="showDialog=='about'" @close="op(false)"
        >
            {{LANG.ABOUT_TITLE}} : {{globalEvent.version}}
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

<style scoped>

</style>