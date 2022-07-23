import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入vant所有组件
import Vant from 'vant'
import 'vant/lib/index.css'

// 引入字体图标的样式
import '@/assets/fonts/iconfont.css'

// 引入flexble
import 'amfe-flexible/index.min.js'

// 代码高光
import hljs from 'highlight.js'
import '../node_modules/highlight.js/styles/default.css'

Vue.config.productionTip = false

// 使用vant
Vue.use(Vant)

// 代码高亮
Vue.directive('highlight', function (el) {
  const blocks = el.querySelectorAll('pre code')
  blocks.forEach((block) => {
    hljs.highlightBlock(block)
  })
})

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
