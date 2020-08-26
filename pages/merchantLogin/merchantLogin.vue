<template>
	<view class="merchantLogin">
		<!-- 头部 start -->
		<navbar>
			<view class="wel_desc">
				<view class="say_hi">您好！</view>
				<view class="say_wel">欢迎使用商户农贸市场小程序</view>
			</view>
		</navbar>
		<!-- 头部 end -->

		<!-- 主体 start -->
		<view class="main">
			<view class="form">
				<view class="form_item">
					<view class="item_title">手机号</view>
					<view class="write_wrap">
						<input type="tel" placeholder="请填写手机号码" v-model="loginForm.mobile" />
						<view class="captcha" v-show="isCaptcha" @tap="getcCode">获取验证码</view>
						<view class="again" v-show="!isCaptcha">
							(<text>{{ second }}</text>)秒后重新获取
						</view>
					</view>
				</view>
				<view class="form_item">
					<view class="item_title">验证码</view>
					<input type="text" v-model="loginForm.code" placeholder="请输入验证码" />
				</view>
			</view>

			<!-- 登录按钮 start -->
			<view class="login_btn" @click="login">登录</view>
			<!-- 登录按钮 end -->
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
			isCaptcha: true, //控制验证码倒计时
			second: 60, // 倒计时间
			// 表单数据
			loginForm: {
				mobile: '',
				code: ''
			}
		};
	},
	methods: {
		//点击获取验证码
		async getcCode() {
			const { mobile } = this.loginForm;
			// 手机号码非空判断
			if (!mobile.trim()) {
				this.$api.showToast({ title: '请输入手机号码', icon: 'none' });
				return;
			}
			
			//获取手机验证码逻辑
			try {
				const res = await this.$api.request({ url: `/baseService/sms/smsCaptcha/${mobile}/trace`, load: false });
				this.$api.showToast({ title: res.statusMsg, icon: 'none' });

				if (res.statusCode === 200) {
					this.isCaptcha = false;
					// 设计倒计时
					let timerId = setInterval(() => {
						--this.second;
					}, 1000);

					//清除倒计时
					setTimeout(() => {
						clearInterval(timerId);
						this.isCaptcha = true;
						this.second = 60; // 重新变成60s
					}, 60000);
				} else {
					this.$api.showToast({title : res.message,icon : 'none'});
				}
			} catch (err) {
				console.log(err);
			}
		},

		//点击登录
		async login() {
			const { mobile, code } = this.loginForm;
			// 自定义验证规则
			const rules = {
				mobile: {
					value: mobile,
					message: '手机号码不能为空'
				},
				code: {
					value: code,
					message: '验证码不能为空'
				}
			};

			let valid = true;
			
			for (let key of Object.keys(rules)) {
				let item = rules[key];
				if (!item.value.trim()) {
					valid = false;
					this.$api.showToast({ title: item.message, icon: 'none' });
				}
			};

			if (!valid) return;

			try {
				const { statusCode, statusMsg } = await this.$api.request({ url: `/baseService/sms/smsCaptcha/${mobile}/${code}/trace` });
				// 验证码匹配执行以下逻辑
				if (statusCode === 200 && statusMsg === 'success') {
					try {
						const res = await this.$api.request({ url: '/traceability_am/login/holder', data: { mobile }, load: true });
						if (res.code === 200 && res.message === '登录成功') {
							// 把大数据存储到 本地
							uni.setStorageSync('holderInfo', res.data);

							// 跳转到首页
							this.$api.redirectTo('../index/index');
						}
						this.$api.showToast({ title: res.message, icon: 'none' });
					} catch (err) {
						console.log(err);
					}
				} else {
					// 验证码不匹配,弹窗提示
					this.$api.showToast({ title: statusMsg, icon: 'none' });
				}
			} catch (err) {
				console.log(err);
			}
		}
	},

	mounted() {
		//  解决
		// #ifdef H5
		var u = navigator.userAgent;
		var flag;
		var myFunction;
		var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		if (isIOS) {
			document.body.addEventListener('focusin', () => {
				//软键盘弹起事件
				flag = true;
				clearTimeout(myFunction);
			});
			document.body.addEventListener('focusout', () => {
				//软键盘关闭事件
				flag = false;
				if (!flag) {
					myFunction = setTimeout(function() {
						window.scrollTo({ top: window.scrollY, left: 0, behavior: 'smooth' }); //重点  =======当键盘收起的时候让页面回到原始位置(这里的top可以根据你们个人的需求改变，并不一定要回到页面顶部)
					}, 200);
				} else {
					return;
				}
			});
		} else {
			return;
		}
		// #endif
	}
};
</script>

<style lang="less" scoped>
@import './merchantLogin.less';
</style>
