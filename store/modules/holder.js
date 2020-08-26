

const state = {
	holder : {}
};

const getters = {
	getStallNo(state) {
		return state.holder.stallNo;
	}
}

const mutations = {
	login(state,data) {
		state.holder = data;
		uni.setStorageSync('holder', data );
	}
};


export default {
	state,
	getters,
	mutations
}
