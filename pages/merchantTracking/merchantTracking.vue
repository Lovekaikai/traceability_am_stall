
<template>
	<view class="merchantTracing">
		<!-- 头部 statt -->
		<navbar>
			<view class="content">
				<view class="stall_num">摊位编号：<text>{{ stallNo }}</text></view>
				<view class="stall_owner">摊主姓名：<text>{{ stallHolderName }}</text></view>
			</view>

			<!-- 商品图片 -->
			<scroll-view scroll-x="true" class="good_pics_wrap">
				<view class="pic_item" v-for="(item , index) in goodInfo.productImg" :key="item.imageId">
					<image :src="item.url || $api.defaultImg()" @tap="handlePreview(index)"></image>
					</view>
			</scroll-view>
		</navbar>
		<!-- 头部 end -->

		<!-- 主体  start -->
		<view class="main">
			<!-- 商品信息 -->
			<view class="good_info_wrap">
				<view class="info_item">
					<view class="item_title">商品分类：</view>
					<view class="item_desc">{{ classificationName }}</view>
				</view>
				<view class="info_item">
					<view class="item_title">商品重量：</view>
					<view class="item_desc">{{productReady}} kg</view>
				</view>
				<view class="info_item">
					<view class="item_title">商品来源地：</view>
					<view class="item_desc">{{ productOrigin }}</view>
				</view>
				<view class="info_item">
					<view class="item_title">批次号：</view>
					<view class="item_desc">{{ traceabilityBatchNo }}</view>
				</view>
				<view class="info_item">
					<view class="item_title">日期：</view>
					<view class="item_desc">{{ createTime | formatDate2}}</view>
				</view>
			</view>

			<!-- 追溯内容 -->
			<trackTab :trackTabList="trackTabList" :currentIndex="currentIndex" @getIndex="handleGetIndex">
				<view class="show_content">
					<!-- 流涌追溯 -->
					<view v-if="currentIndex === 0" class="flow_track">
						<view v-if="tracebilityNodes.length === 0" class="isEmpty">该列表暂无数据</view>
						<uni-steps :options="tracebilityNodes" direction="column" :active="tracebilityNodes.length" :currentIndex="currentIndex"></uni-steps>
					</view>

					<!-- 生产追溯 -->
					<view v-else-if="currentIndex === 1" class="flow_track">
						<view v-if="produceNodes.length === 0" class="isEmpty">该列表暂无数据</view>
						<uni-steps :options="produceNodes" direction="column" :active="produceNodes.length" :currentIndex="currentIndex"></uni-steps>
					</view>

					<!-- 检疫记录 -->
					<view v-else-if="currentIndex === 2" class="flow_track">
						<view v-if="!checkLog" class="isEmpty">该列表暂无数据</view>
						<view v-else class="inspect_record">
							<view class="info_item">
								<view class="item_title">检疫项目：</view>
								<view class="item_desc">{{checkLog.checkName || $api.defaultDesc()}}</view>
							</view>
							<view class="info_item">
								<view class="item_title">检查员：</view>
								<view class="item_desc">{{checkLog.checkPerson || $api.defaultDesc()}}</view>
							</view>
							<view class="info_item">
								<view class="item_title">检验结果：</view>
								<view class="item_desc">{{checkLog.checkResult || $api.defaultDesc()}}</view>
							</view>
							<view class="info_item">
								<view class="item_title">检查时间：</view>
								<view class="item_desc">{{checkLog.checkDate || $api.defaultDesc()}}</view>
							</view>
						</view>
					</view>
				</view>
			</trackTab>
		</view>
		<!-- 主体  end -->
	</view>
</template>

<script>
import navbar from '../../components/navbar/navbar.vue';
import trackTab from '../../components/trackTab/trackTab.vue';
import uniSteps from '../../components/uni-steps/uni-steps.vue';
import { formatDate2 } from '@/common/formatDate/formatDate.js';
export default {
	components: {
		navbar,
		trackTab,
		uniSteps
	},
	filters: {
		formatDate2	
	},
	data() {
		return {
			//tab 栏数据
			trackTabList: [{ id: 0, text: '流通追溯' }, { id: 1, text: '生产追溯' }, { id: 3, text: '检疫记录' }],
			currentIndex: 0,  // 当前索引
			// 商品信息
			goodInfo: {
				productImg: [], // 商品图片
				amClassification: {}, //商品分类
				merchantStall: {}, // 摊位信息
				merchantStallHolder: {} //摊主信息
			},			
			tracebilityNodes: [],  // 流通追溯信息			
			produceNodes: [],  // 生产追溯信息
			checkLog : {}  // 检疫记录信息
		};
	},

	onLoad() {
		// 页面一加载就获取商品详情
		const {goodsInfo , tracebilityNodes,produceNodes,checkLog} = uni.getStorageSync('goodList');
		this.goodInfo = goodsInfo;
		this.tracebilityNodes = tracebilityNodes;
		this.produceNodes = produceNodes;
		this.checkLog = checkLog;
	},

	computed: {
		// 摊位编号
		stallNo() {
			return this.goodInfo.merchantStall.stallNo;
		},
		//摊主姓名
		stallHolderName() {
			return this.goodInfo.merchantStallHolder.stallHolderName;
		},
		//商品分类
		classificationName() {
			return this.goodInfo.amClassification.classificationName;
		},
		//商品重量
		productReady() {
			return this.goodInfo.productReady;
		},
		//商品来源地
		productOrigin() {
			return this.goodInfo.productOrigin;
		},
		//批次号
		traceabilityBatchNo() {
			return this.goodInfo.traceabilityBatchNo;
		},
		//日期
		createTime() {
			return this.goodInfo.createTime;
		}
	},
	methods: {
		handleGetIndex(index) {
			this.currentIndex = index;
		},

		// 点击图片预览
		handlePreview(index) {
			const {productImg} = this.goodInfo;
			let urls = productImg.map(v => v.url);
			urls.forEach((item,i) => {
				if(!item) {
					urls[i] = this.$api.defaultImg();
				}
			})
			this.$api.preViewImg(index,urls)			
		}
	}
};
</script>

<style lang="less" scoped>
@import './merchantTracking.less';
</style>
