<template>
  <div class="card-child"
       :style="{opacity:(globalEvent.screenInfo.scrGroupArr!==undefined && seq>=globalEvent.screenInfo.scrGroupArr.length)?0.6:1}"
       :class="{'card-item-bg':seq==globalEvent.curScreenIndex}"
  >
    <img :src="iconImg" class="header-icon" />
    <span>{{title}}</span>
  </div>
</template>

<script>
export default {
  props: ['title','iconName','seq'],
  data() {
    return {
      iconImg: "",
    };
  },
  created() {
    this.iconImg = require(`@/assets/images/${this.iconName}.png`);
  }
};
</script>

<style lang="scss">
.card-child {
  width: 60px;
  font-size: 12px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  .header-icon{
    width: 12px;
    height: 12px;
  }
  span {
    color: #909399;
  }
  span:hover {
    color: #409eff;
  }
}
.card-child:hover {
  cursor: pointer;
  background-color: #f5f7fa;
}
.card-item-bg {
  background-color: #f5f7fa;
  span,
  i {
    color: #409eff;
  }
}
</style>