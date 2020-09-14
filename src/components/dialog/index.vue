<template>
  <div id="popup">
    <!-- 屏幕配置 -->
    <configure-screen
      v-if="(title === 'ConfigureScreen')&&(dialogVisible)"
      :dialogVisible="dialogVisible"
      :data="data"
      @isDialogVisible="isDialogVisible"
    ></configure-screen>
  </div>
</template>

<script>
import ConfigureScreen from "@/components/dialog/ConfigureScreen";
export default {
  name: "popup",
  props: {
    title: {
      type: String,
      default: ""
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    isDialogVisible() {
      this.$emit("isDialogVisible", false);
    }
  },
  components: {
    ConfigureScreen
  }
};
</script>

<style lang="scss">
#popup {
  .el-dialog__header {
    font-size: 14px;
    padding: 14px;
    .el-dialog__title {
      font-size: 14px;
    }
    .el-dialog__headerbtn {
      font-size: 14px;
      top: 18px;
      right: 20px;
    }
  }
  .el-dialog__body{
    padding: 10px 20px;
  }
  .el-dialog__footer{
    padding: 14px;
  }
}
</style>