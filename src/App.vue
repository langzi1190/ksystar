<template>
  <div id="app" @contextmenu.prevent.stop="">
    <!-- <div id="nav"  @contextmenu.prevent.stop="">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>-->
    <home></home>
  </div>
</template>

<script>
import home from "@/views/Home";
export default {
  name: "app",
  components: {
    home,
  },
};
</script>

<style lang="scss">
html,
body,
#app {
  min-width: 1280px;
  height: 100%;
  margin: 0px;
}
</style>
