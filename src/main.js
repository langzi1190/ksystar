import Vue from 'vue'
import App from './App.vue'
import globalEvent from './store/event.js';

import Axios from './axios';

import { Select, Tabs, Dialog, Collapse, Button, Icon, Checkbox, Input, InputNumber, TabPane, CollapseItem, Option ,Tree,Loading} from 'element-ui';
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/style/reset.css'
import '@/assets/style/iconfont.css'
Vue.prototype.globalEvent=globalEvent;
Vue.config.productionTip = false;
Vue.prototype.$http = Axios;
// Vue.use(ElementUI);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Button);
Vue.use(Icon);
Vue.use(Checkbox);
Vue.use(Input);
Vue.use(Tree);
Vue.use(InputNumber);
Vue.use(Select);
Vue.use(Dialog);
Vue.use(Option);

Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;

Vue.prototype.LANGUAGE={
    zh:require("./store/zh.json"),
    en:require("./store/en.json"),
};

new Vue({
  // router,
  // store,
  //   data:{
  //     LANG:LANGUAGE[Vue.prototype.globalEvent.language],
  //   },
    // provide(){
    //   return {
    //     LANG:this.LANG
    //   };
    // },
  render: h => h(App)
}).$mount('#app')
