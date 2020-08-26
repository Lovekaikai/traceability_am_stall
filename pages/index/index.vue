<template>
	<view class="index">
		<!-- 头部轮播图 start -->
		<view class="head">
			<swiper indicator-dots autoplay circular class="swiper">
				<swiper-item v-for="(item,index) in swiperList" :key="index" @tap="handlePreview(index)">
					<image :src="item || $api.defaultImg()" mode="widthFix"></image>
				</swiper-item>
			</swiper>
		</view>
		<!-- 头部轮播图 end -->

		<!-- 主体 start -->
		<view class="main"> 
			<view class="stall_num">摊位号：<text>{{stallNo}}</text></view>
			<view class="stall_nav">
				<navigator class="nav_item" url="/pages/merchantStallInfo/merchantStallInfo">
					<view class="nav_icon"><image src="../../static/images/stall01.png"></image></view>
					<view class="nav_desc">摊主资料</view>
				</navigator>
				<navigator class="nav_item" :url="`/pages/merchantIncomeStatistics/merchantIncomeStatistics?stallHolderId=${stallHolderId}`">
					<view class="nav_icon"><image src="../../static/images/stall02.png"></image></view>
					<view class="nav_desc">收入统计</view>
				</navigator>
				<navigator class="nav_item" url="/pages/merchantProductRun/merchantProductRun">
					<view class="nav_icon"><image src="../../static/images/stall03.png"></image></view>
					<view class="nav_desc">商品管理</view>
				</navigator>
			</view>
			<!-- 主体 end -->
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			stallNo : '',  // 摊位编号
			stallHolderId : '', // 摊主id
			swiperList : []  // 轮播图
		};
	},

	onLoad() {
		//获取轮播图
		this.getSwiperList();
				
		const { stallInfo } = uni.getStorageSync('holderInfo');
		this.stallNo = stallInfo.stallNo;
		this.stallHolderId = stallInfo.stallHolderId;		
	},
	
	methods: {
		// 获取轮播图逻辑
		async getSwiperList() {
			try{
				const res = await this.$api.request({url : '/traceability_am/banner/getByType?type=1'});
				if(Number(res.code) === 200) {
					this.swiperList = res.data;
				}
			}catch(err){
				console.log(err);
			}
		},
		
		// 图片预览
		handlePreview(index) {
			const urls = this.swiperList;
			urls.forEach((item,i) => {
				if(!item) {
					url[i] = this.$api.defaultImg();
				}
			})
			
			this.$api.preViewImg(index,urls);
		}
	}
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
