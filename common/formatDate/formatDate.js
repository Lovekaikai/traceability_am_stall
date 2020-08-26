//  封装 时间格式化

// 格式 2019/11/11
export const formatDate1 = (time) => {
	var date = new Date(time);
	var year = date.getFullYear();
	var mouth = date.getMonth() + 1;
	var day = date.getDate();
	
	mouth = mouth < 10 ? '0' + mouth : mouth;
	day = day < 10 ? '0' + day : day;
	
	return year + '/' + mouth + '/' + day;
}

//格式 2019年11月11日
export const formatDate2 = (time) => {
	var date = new Date(time);
	var year = date.getFullYear();
	var mouth = date.getMonth() + 1;
	var day = date.getDate();
	
	mouth = mouth < 10 ? '0' + mouth : mouth;
	day = day < 10 ? '0' + day : day;
	
	return year + '年' + mouth + '月' + day + '日';
}

