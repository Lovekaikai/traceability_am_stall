<template>
	<view class="merchantIncomeTicket ">
		<!-- 头部 start -->
		<navbar>
			<view class="title">收入统计</view>
		</navbar>
		<!-- 头部 end -->
		
		<!-- 主体 start -->
		<view class="main">
			<view class="ticket_item" v-for="item in ticketList" :key="item.tradeInfoId">
				<view class="left_wrap">
					<view class="amount">小票金额：{{item.money}}元</view>
					<view class="date">交易日期：{{item.createTime}}</view>
				</view>
				<navigator
				:url="`/pages/merchantIncomeDetail/merchantIncomeDetail?tradeInfoId=${item.tradeInfoId}&tradeInfoTime=${paramsObj.tradeInfoTime}&money=${item.money}`"
				 class="right_wrap">
					<text>查看明细</text>
					<view class="arrow"></view>
				</navigator>
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
				stallHolderId : '',  //摊主id
				// 构建参数
				paramsObj : {
					tradeInfoTime : '', // 交易创建时间
					pageNum : 1
				},
				ticketList : [],  // 小票列表
				totalPage : 0  // 总页数
			}
		},
		onLoad(e) {
			this.stallHolderId = e.stallHolderId;
			this.paramsObj.tradeInfoTime = e.createTime;
			this.getTicketList();
		},
		methods: {
			// 获取列表
			async getTicketList() {
				try{
					const res = await this.$api.request({url : `/traceability_am/at-info/tradeInfoByTime${this.stallHolderId}`,data : this.paramsObj,load:true});
					if(Number(res.code) === 200) {
						// 旧数据
						const oldGoodList = this.ticketList;
						// 新数据
						const newGoodList = res.data.list;
						// 把新旧数据合并
						this.ticketList = [...oldGoodList,...newGoodList];
						// 总页数
						this.totalPage = res.data.totalPage;
					}else {
						this.$api.showToast({title: res.message, icon: 'none'});
					}
				}catch(err){
					console.log(err);
				}
			}
		},
		
		//上拉刷新
		onReachBottom() {
			// 检测是否还有下一页
			const { pageNum } = this.paramsObj;
			if (pageNum >= this.totalPage) {
				this.$api.showToast({ title: '没有下一页了', icon: 'none' });
			} else {
				pageNum++;
				this.getTicketList();
			}
		}
	}
</script>

<style lang="less" scoped>
	@import './merchantIncomeTicket.less';
</style>
