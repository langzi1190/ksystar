<template>
  <div class="card">
    <div class="card-content">
      <slot></slot>
    </div>
    <div class="card-title">{{title}}</div>
  </div>
</template>

<script>
export default {
  props: ['title']
};
</script>

<style lang="scss" scoped>
.card {
  height: 88px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  margin-right: 6px;
  min-width: 60px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .card-content {
    flex: 1;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 4px 6px;
  }
  .card-title {
    flex: 0 0 20px;
    border-top: 1px solid #ebeef5;
    background-color: #f5f7fa;
    color: #909399;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
  }
}
.card:hover {
  .card-title {
    color: #409eff;
  }
}
</style>
