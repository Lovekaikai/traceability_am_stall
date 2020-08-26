<template>
	<view class="merchantStallInfo">
		<!-- 头部 start -->
		<navbar class="navbar">
			<view class="content">
				<view class="title">摊主资料</view>
				<view class="license_wrap" @tap="handlePreview(businessLicense)">
					<image src="../../static/images/pic.png"></image>
					<view class="text">查看营业执照</view>
				</view>
			</view>
		</navbar>
		<!-- 头部 end -->

		<!-- 主体 start -->
		<view class="main">
			<!-- 摊主图片 -->
			<view class="owner_img">
				<image :src="stallHolderPortrait || $api.defaultImg()" @tap="handlePreview(stallHolderPortrait)"></image>
			</view>

			<!-- 摊主信息 -->
			<view class="owner_info_wrap">
				<view class="form_item">
					<view class="item_name">商户名称：</view>
					<view class="item_desc">{{ merchantName || $api.defaultDesc()}}</view>
				</view>
				<view class="form_item">
					<view class="item_name">摊位编号：</view>
					<view class="item_desc">{{ stallNo || $api.defaultDesc()}}</view>
				</view>
				<view class="form_item">
					<view class="item_name">经营品类：</view>
					<view class="item_desc">{{ categoryName || $api.defaultDesc()}}</view>
				</view>
				<view class="form_item">
					<view class="item_name">设备编号：</view>
					<view class="item_desc">{{ assertNo || $api.defaultDesc()}}</view>
				</view>
				<view class="form_item">
					<view class="item_name">负责人：</view>
					<view class="item_desc">{{ stallHolderName || $api.defaultDesc()}}</view>
				</view>
				<view class="form_item">
					<view class="item_name">手机号码：</view>
					<view class="item_desc">{{ stallHolderNo || $api.defaultDesc()}}</view>
				</view>
			</view>
		</view>
		<!-- 主体 end -->
	</view>
</template>

<script>
import navbar from '../../components/navbar/navbar.vue';
export default {
	components: {
		navbar
	},
	data() {
		return {
			merchantName: '', //商户名称
			stallNo: '', // 摊位编号
			categoryName: '', //经营品类
			assertNo: '', // 设备编号
			stallHolderName: '', // 负责人
			stallHolderNo: '',  // 手机号码
			stallHolderPortrait:'',// 摊主肖像
			businessLicense : ''  // 营业执照
		};
	},
	onLoad() {
		// 取出本地的数据
		const { CategoryInfo, eleScaleInfo, holderInfo, stallInfo, merchantName } = uni.getStorageSync('holderInfo');
		
		this.merchantName = merchantName;
		this.stallNo = stallInfo.stallNo;
		this.categoryName = CategoryInfo.categoryName;
		this.assertNo = eleScaleInfo.assertNo;
		this.stallHolderName = holderInfo.stallHolderName;
		this.stallHolderNo = holderInfo.stallHolderNo;
		this.stallHolderPortrait = holderInfo.stallHolderPortrait;
		this.businessLicense = holderInfo.businessLicense;
	},
	methods: {
		// 预览头像/营业执照
		handlePreview(imgUrl) {
			let urls = [];
			if(!imgUrl) {
				urls.push(this.$api.defaultImg());
			}else {
				urls.push(imgUrl);
			}
			this.$api.preViewImg(0,urls)
		}
	}
};
</script>

<style lang="less" scoped>
@import './merchantStallInfo.less';
</style>
