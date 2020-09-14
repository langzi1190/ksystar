<template>
  <div class="vdr-child">
    <div class="title">
      <div class="title-win">
        <span>Win-1:S1_1</span>
      </div>
      <div class="title-control">
        <span @click="windowEdit('0')">
          <i class="el-icon-minus" style="color: #91dd9d"></i>
        </span>
        <span @click="windowEdit('1')">
          <i class="el-icon-plus" style="color: #ffcd8a"></i>
        </span>
        <span @click="windowEdit('2')">
          <i class="el-icon-ride" style="color: #ff8739"></i>
        </span>
      </div>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    windowEdit(val) {
      if (val === "0") {
        console.log("窗口最小化");
      }
      if (val === "1") {
        console.log("窗口最大化");
      }
      if (val === "2") {
        console.log("窗口关闭");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.vdr-child {
  width: calc(100% - 0px);
  height: calc(100% - 0px);
  display: flex;
  flex-direction: column;
  // padding-right: 0px;
  // padding-left: 0px;
  .title {
    flex: 0 0 28px;
    // border-radius: 8px 8px 0 0;
    display: flex;
    display: flex;
    justify-content: space-between;
    background: #409eff;
    .title-win {
      padding: 0px 6px;
      overflow: hidden;
      span {
        font-size: 12px;
        line-height: 28px;
        white-space: nowrap;
      }
    }
    .title-control {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-right: 6px;
      overflow: hidden;
      span {
        padding: 2px;
      }
      span:hover {
        border-radius: 50%;
        background: #fff;
      }
    }
  }
  .content {
    flex: 1;
    // border-radius: 0 0 8px 8px;
    background: #e4e7ed;
    overflow: hidden;
    padding: 6px;
    p {
      font-size: 14px;
      color: #909399;
      padding: 2px;
      text-align: left;
    }
  }
}
</style>