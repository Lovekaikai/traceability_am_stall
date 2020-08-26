<template>
	<view class="merchantIncomeStatistics">
		<!-- 头部 start -->
		<navbar>
			<view class="title">收入统计</view>
		</navbar>
		<!-- 头部 end -->
		
		<!-- 主体 start -->
		<view class="main">
			<view class="empty" v-if="incomeList.length === 0 || !Boolean(incomeList[0])">暂无列表数据</view>
			<view v-else class="statement_item" v-for="item in incomeList" :key="item.tradeInfoId">
				<view class="left_wrap">
					<view class="date">日期：<text>{{item.createTime}}</text></view>
					<view class="amount">总金额：<text>{{item.money}}</text>元</view>
				</view>
				<!-- 页面传参 -->
				<navigator 
				:url="`/pages/merchantIncomeTicket/merchantIncomeTicket?stallHolderId=${stallHolderId}&createTime=${item.createTime}`" 
				class="right_wrap">
					<text >查看明细</text>
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
				incomeList : [],  // 收入统计
				stallHolderId : '',  // 摊主id			
				pageNum: 1,  // 当前页
				totalPage: 0  // 总页数
			}
		},
		onLoad(e) {
			this.stallHolderId = e.stallHolderId;  // 获取页面参数
			this.getIncomeList();  // 调用方法
		},
		methods: {
			// 获取收入统计逻辑
			async getIncomeList() {
				try{
					const res = await this.$api.request({url : `/traceability_am/at-info/incomeByDateGroup${this.stallHolderId}?pageNum=${this.pageNum}`,load:true});
					if(Number(res.code) === 200) {
						// 旧数据
						const oldGoodList = this.incomeList;
						// 新数据
						const newGoodList = res.data.list;
						// 把新旧数据合并
						this.incomeList = [...oldGoodList,...newGoodList];
						// 总页数
						this.totalPage = res.data.totalPage;
						
					}else {
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
				this.getIncomeList();
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "./merchantIncomeStatistics.less";
</style>
