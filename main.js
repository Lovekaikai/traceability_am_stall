import Vue from 'vue'
import App from './App'

import Api from './common/api/utils.js'
//引入vuex
import store from './store/index.js'

//把vuex定义成全局组件
Vue.prototype.$store = store

Vue.config.productionTip = false

Vue.prototype.$api = Api

App.mpType = 'app'

const app = new Vue({
    ...App,
	store  //挂载
})
app.$mount()
