// 基准路径
const API_Url = "http://zs-beta.cntracechain.com";

//声明存储请求的次数
// let requestCount = 0;


export default class Utils {
	// 请求方法
	static request(params) {
		//调用一次方法让数量自增
		// requestCount++;
		//显示 加载
		console.log(params)
		if (params.load) {
			Utils.showLoad()
		}

		return new Promise((resolve, reject) => {
			uni.request({
				...params,
				// #ifdef MP-WEIXIN
				url: API_Url + params.url,
				// #endif
				// #ifdef H5
				url: params.url,
				// #endif
				success: (res) => {
					resolve(res.data)
				},
				fail: (err) => {
					reject(err)
					// 设置网络超时提醒
					Utils.showToast({title : '网络超时,请重试',icon : 'none'})
				},
				complete: () => {
					// 当请求完成时 隐藏 加载
					Utils.hideLoad();
				}
			})
		})
	}

	//显示 加载
	static showLoad() {
		uni.showLoading({
			title: '加载中',
			mask: true
		})
	}

	//隐藏 加载
	static hideLoad() {
		uni.hideLoading()
	}

	//消息 提示框
	static showToast(params) {
		uni.showToast({
			...params,
			mask: true
		})
	}

	// 跳转页面
	static navigateTo(toUrl) {
		uni.navigateTo({
			url: toUrl
		})
	}
	
	// 重定向页面
	static redirectTo(toUrl) {
		uni.redirectTo({
			url : toUrl
		})
	}

	// 格式化时间 (xxxx/xx/xx)
	static formatDate1(time) {
		let date = new Date(time);
		let year = date.getFullYear();
		let mouth = date.getMonth() + 1;
		let day = date.getDate();
		
		mouth = mouth < 10 ? '0' + mouth : mouth;
		day = day < 10 ? '0' + day : day;
		
		return year + '/' + mouth + '/' + day;
	}

	// 默认图片显示
	static defaultImg() {
		return "https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2019/12/4/3790b6f8-5cd1-45da-8d4d-b068127d356b.webp";
	}
	
	// 默认内容显示
	static defaultDesc() {
		return '暂无提供';
	}
	
	// 图片预览
	static preViewImg(index,Urls) {
		uni.previewImage({
			current : Urls[index],
			urls : Urls,
			indicator : 'default'
		})
	}
}
