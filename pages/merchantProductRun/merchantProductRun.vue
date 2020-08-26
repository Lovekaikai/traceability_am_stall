<template>
	<view class="merchantProductRun">
		<!-- 头部 start -->
		<navbar>
			<view class="content">
				<view class="title">商品管理</view>
				<view class="pickDate_wrap">
					<div class="pickDate">
						<image src="../../static/images/calendar.png"></image>
						<view class="date">{{ pickDate }}</view>
						<view>
							<uni-calendar ref="calendar" :insert="false" @confirm="confirm" />
							<view class="btn" @tap="open">选择日期</view>
						</view> 
					</div>
				</view>
			</view>
		</navbar>
		<!-- 头部 end -->

		<!-- 主体 start -->
		<view class="main">

			<view class="empty" v-if="goodList.length === 0">暂时没有任何数据</view>
			
			<navigator v-else 
			url='/pages/merchantTracking/merchantTracking' 
			@tap="handleTap(index)"
			class="good_item" 
			v-for="(item,index) in goodList" 
			:key="item.goodsInfo.stallProductId">
				<view class="good_batch">
					商品批次号：{{ item.goodsInfo.traceabilityBatchNo }}
				</view>
				<view class="good_info_wrap">
					<image :src="item.goodsInfo.productImg[0].url || $api.defaultImg()"></image>
					<view class="good_desc">
						<view class="good_name">
							商品名称：{{ item.goodsInfo.productName }}
						</view>
						<view class="good_num">
							商品数量：{{ item.goodsInfo.productReady }}  kg
						</view>
					</view>
				</view>
			</navigator>
		</view>
		<!-- 主体 end -->
	</view>
</template>

<script>
import navbar from '@/components/navbar/navbar.vue';
import uniCalendar from '@/components/uni-calendar/uni-calendar';

export default {
	components: {
		navbar,
		uniCalendar
	},
	data() {
		return {
			pickDate: '请选择日期', // 时间
			goodList: [], //商品列表
			pageNum: 1, //当前页
			totalPage: 0, //总页数
			stallHolderId : ''  // 摊主id
		};
	},

	onLoad() {
		const {holderInfo} = uni.getStorageSync('holderInfo');
		this.stallHolderId = holderInfo.stallHolderId;
		this.getGoodList();  // 调用方法	
	},

	methods: {
		// 弹出日历
		open() {
			this.$refs.calendar.open();
		},
		
		// 点击确认时间
		confirm(e) {
			this.pickDate = e.fulldate;
			// 页数需返回第一页
			this.pageNum = 1;
			//需清空
			this.goodList = [];
			this.getGoodList();
		},

		// 获取商品列表
		async getGoodList() {
			let time;
			// 把时间转成秒
			if(this.pickDate === '请选择日期') {
				time = '';
			}else {
				time = new Date(this.pickDate).getTime() / 1000;
			}
			
			try {
				const res = await this.$api.request({ url: `/traceability_am/goods/list?merchantStallHolderId=${this.stallHolderId}&createTime=${time}&pageNum=${this.pageNum}`, load: true });
				if (Number(res.code) === 200) {
					// 旧数据
					const oldGoodList = this.goodList;
					// 新数据
					const newGoodList = res.data.list;
					// 把新旧数据合并
					this.goodList = [...oldGoodList, ...newGoodList];
					// 总页数
					this.totalPage = res.data.totalPage;
				} else {
					this.$api.showToast({title : res.message,icon : 'none'});
				}
			} catch (err) {
				console.log(err);
			}
		},
		
		handleTap(index) {
			// 本地存储对应的信息
			uni.setStorageSync('goodList',this.goodList[index]);
		}
	},

	//上拉刷新
	onReachBottom() {
		// 检测是否还有下一页
		if (this.pageNum >= this.totalPage) {
			this.$api.showToast({ title: '没有下一页了', icon: 'none' });
		} else {
			this.pageNum++;
			this.getGoodList();
		}
	}
};
</script>

<style lang="less" scoped>
@import './merchantProductRun.less';
</style>
