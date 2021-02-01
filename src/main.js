import Vue from 'vue'
import App from './App.vue'
import globalEvent from './store/event.js';

import Axios from './axios';

import { Select, Tabs, Dialog, Collapse, Button, Icon, Checkbox, Input, InputNumber, TabPane, CollapseItem, Option ,Tree,Loading,Message} from 'element-ui';
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
Vue.prototype.$message = Message;
Vue.prototype.LANGUAGE={
    zh:require("./store/zh.json"),
    en:require("./store/en.json"),
};

// Vue.directive('drag', {
//     //1.指令绑定到元素上回立刻执行bind函数，只执行一次
//     //2.每个函数中第一个参数永远是el，表示绑定指令的元素，el参数是原生js对象
//     //3.通过el.focus()是无法获取焦点的，因为只有插入DOM后才生效
//     bind: function (el) { },
//     //inserted表示一个元素，插入到DOM中会执行inserted函数，只触发一次
//     inserted: function (el) {
//         el.onmousedown = function (e) {
//             var disx = e.pageX - el.offsetLeft;
//             var disy = e.pageY - el.offsetTop;
//             document.onmousemove = function (e) {
//                 el.style.left = e.pageX - disx + 'px';
//                 el.style.top = e.pageY - disy + 'px';
//             }
//             document.onmouseup = function () {
//                 document.onmousemove = document.onmouseup = null;
//             }
//         }
//     },
//     //当VNode更新的时候会执行updated，可以触发多次
//     updated: function (el) { }
// });
Vue.directive('dialogDrag',{
    bind(el,binding,vnode,oldVnode) {
        const dialogHeaderEl = el.querySelector('.el-dialog__header');

        const dragDom = el.querySelector('.el-dialog');

//dialogHeaderEl.style.cursor = 'move';

        dialogHeaderEl.style.cssText += ';cursor:move;'

        dragDom.style.cssText += ';top:0px;'

// 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素,null);

        const sty = (function() {
            if (window.document.currentStyle) {
                return (dom,attr) => dom.currentStyle[attr];

            } else{
                return (dom,attr) => getComputedStyle(dom,false)[attr];

            }

        })()

        dialogHeaderEl.onmousedown = (e) => {
// 鼠标按下，计算当前元素距离可视区的距离

            const disX = e.clientX - dialogHeaderEl.offsetLeft;

            const disY = e.clientY - dialogHeaderEl.offsetTop;

            const screenWidth = document.body.clientWidth; // body当前宽度

            const screenHeight = document.documentElement.clientHeight; // 可见区域高度(应为body高度，可某些环境下无法获取)

            const dragDomWidth = dragDom.offsetWidth; // 对话框宽度

            const dragDomheight = dragDom.offsetHeight; // 对话框高度

            const minDragDomLeft = dragDom.offsetLeft;

            const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;

            const minDragDomTop = dragDom.offsetTop;

            const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight;

// 获取到的值带px 正则匹配替换

            let styL = sty(dragDom,'left');

            let styT = sty(dragDom,'top');

// 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px

            if(styL.includes('%')) {
                styL = +document.body.clientWidth * (+styL.replace(/\%/g,'') / 100);

                styT = +document.body.clientHeight * (+styT.replace(/\%/g,'') / 100);

            }else {
                styL = +styL.replace(/\px/g,'');

                styT = +styT.replace(/\px/g,'');

            };

            document.onmousemove = function (e) {
// 通过事件委托，计算移动的距离

                let left = e.clientX - disX;

                let top = e.clientY - disY;

// 边界处理

                if (-(left) > minDragDomLeft) {
                    left = -(minDragDomLeft);

                } else if (left > maxDragDomLeft) {
                    left = maxDragDomLeft;

                }

                if (-(top) > minDragDomTop) {
                    top = -(minDragDomTop);

                } else if (top > maxDragDomTop) {
                    top = maxDragDomTop;

                }

// 移动当前元素

                dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;

            };

            document.onmouseup = function (e) {
                document.onmousemove = null;

                document.onmouseup = null;

            };

        }

    }

})
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
    meta: {
        // 页面标题title
        title: '标题'
    },
  render: h => h(App)
}).$mount('#app')
