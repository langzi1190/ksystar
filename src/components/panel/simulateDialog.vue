<template>
    <div class="simulate_dialog">
        <el-dialog title="FPGA硬件升级"
                   width="700px"
                   :visible="showDialog=='test'"
                   @close="op(false)">
            <div class="s_body">
                <div class="item">
                    <div class="item_tip">
                        <label><input type="checkbox"/>输入板卡FPGA升级</label>
                    </div>
                    <div class="item_body">
                        <label><input type="checkbox"/>卡1</label>
                        <label><input type="checkbox"/>卡2</label>
                        <label><input type="checkbox"/>卡3</label>
                        <label><input type="checkbox"/>卡4</label>
                    </div>
                </div>
                <div class="item">
                    <div class="item_tip">
                        <label><input type="checkbox"/>输出板卡FPGA升级</label>
                    </div>
                    <div class="item_body">
                        <label><input type="checkbox"/>卡1</label>
                        <label><input type="checkbox"/>卡2</label>
                        <label><input type="checkbox"/>卡3</label>
                        <label><input type="checkbox"/>卡4</label>
                    </div>
                </div>
                <div class="item">
                    <div class="item_tip">
                        <label><input type="checkbox"/>输入板卡FPGA升级</label>
                    </div>
                    <div class="item_body">
                        <label><input type="checkbox"/>卡1</label>
                        <label><input type="checkbox"/>卡2</label>
                        <label><input type="checkbox"/>卡3</label>
                        <label><input type="checkbox"/>卡4</label>
                    </div>
                </div>
                <div class="item">
                    <div class="item_tip">
                        <label><input type="checkbox"/>监视板卡FPGA升级</label>
                    </div>
                </div>
                <div class="item">
                    <div class="item_tip">
                        <label><input type="checkbox"/>同步板卡FPGA升级</label>
                    </div>
                </div>
            </div>

        </el-dialog>
    </div>
</template>

<script>
    export default {
        props:['showDialog'],
        data(){
            return {
                cardType:0
            };
        },
        methods:{
            op(act){
                this.$emit("sub_event",{act:'close_kfs'});
            }
        }
    }
</script>

<style scoped>

</style>