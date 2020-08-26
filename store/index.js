import Vue from 'vue';
import Vuex from 'vuex';
import holder from './modules/holder.js';

Vue.use(Vuex);
const store = new Vuex.Store({
	modules: {
		holder
	}
});

export default store;