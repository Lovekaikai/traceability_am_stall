<template>
	<view class="merchantIncomeDetail">
		<!-- 头部 start -->
		<navbar>
			<view class="content">
				<view class="title">收入统计</view>
				<view class="down_wrap">
					<view class="content">
						<view class="date">{{ tradeInfoTime | formatDate1 }}</view>
						<view class="date">总计：{{ totalPrice }}元</view>
					</view>
				</view>
			</view>
		</navbar>
		<!-- 头部 end -->

		<!-- 主体 start -->
		<view class="main">
			<view class="detial_item" v-for="(item,index) in incomeDetail" :key="index">
				<view class="left_wrap">
					<view class="good_name">商品名称：{{item.productName}}</view>
					<view class="good_num">数量：{{item.weight}}公斤</view>
				</view>
				<view class="price">{{item.money}}元</view>
			</view>
		</view>
		<!-- 主体 end -->
	</view>
</template>

<script>
import navbar from '../../components/navbar/navbar.vue';
import { formatDate1 } from '../../common/formatDate/formatDate.js';
export default {
	components: {
		navbar
	},
	filters: {
		formatDate1
	},
	data() {
		return {
			incomeDetail : [],  //收入明细
			tradeInfoId :'',  //  交易id
			tradeInfoTime : ''  ,// 交易时间,
			totalPrice : 0, //总计
			pageNum : 1,  // 当前页
			totalPage : 0  // 总页数
		};
	},
	onLoad(e) {
		this.tradeInfoId = e.tradeInfoId;
		this.tradeInfoTime = e.tradeInfoTime;
		this.totalPrice = e.money;
		this.getIncomeDetail();
	},
	methods: {
		// 获取收入明细逻辑
		async getIncomeDetail() {
			try{
				const res = await this.$api.request({url : `/traceability_am/at-detail/incomeDetail${this.tradeInfoId}?pageNum=${this.pageNum}`,load : true});
				if(Number(res.code) === 200) {
					// 旧数据
					const oldGoodList = this.incomeDetail;
					// 新数据
					const newGoodList = res.data.list;
					// 把新旧数据合并
					this.incomeDetail = [...oldGoodList,...newGoodList];
					// 总页数
					this.totalPage = res.data.totalPage;
				} else {
					this.$api.showToast({title : res.message,icon : 'none'});
				}
			}catch(err){
				console.log(err);
			}
		}
	},
	
	//上拉刷新
	onReachBottom() {
		// 检测是否还有下一页
		if (this.pageNum >= this.totalPage) {
			this.$api.showToast({ title: '没有下一页了', icon: 'none' });
		} else {
			this.pageNum++;
			this.getIncomeDetail();
		}
	}
};
</script>

<style lang="less" scoped>
@import './merchantIncomeDetail.less';
</style>
