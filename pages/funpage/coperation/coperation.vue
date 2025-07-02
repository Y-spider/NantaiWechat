<template>
	<view class="container">
		<NavigationSelf title="合作联系" :showBack="true"></NavigationSelf>
		
		<view class="content">
			<!-- 微信二维码区域 -->
			<view class="qr-section">
				<text class="section-title">微信二维码</text>
				<view class="qr-wrapper">
					<image 
						:show-menu-by-longpress="true"
						class="qr-code" 
						:src="QRCodeUrl" 
						mode="aspectFit"
						@click="previewQRCode"
					></image>
					<text class="qr-tip">长按二维码可扫码添加</text>
				</view>
			</view>
			
			<!-- 邮箱区域 -->
			<view class="email-section">
				<text class="section-title">联系邮箱</text>
				<view class="email-wrapper" @click="copyEmail">
					<text class="email-text">3267585160@qq.com</text>
					<text class="email-tip">点击复制邮箱地址</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import NavigationSelf from "../../common-components/head/head.vue"
	export default {
		components:{
			NavigationSelf
		},
		data() {
			return {
				email: 'contact@nantai.com',
				QRCodeUrl:this.$baseImageUrl + "icon/QRCode.png?time="+new Date().getTime()
			}
		},
		methods: {
			// 预览二维码
			previewQRCode() {
				uni.previewImage({
					urls: [this.QRCodeUrl],
					current: 0
				})
			},
			// 复制邮箱
			copyEmail() {
				uni.setClipboardData({
					data: this.email,
					success: () => {
						uni.showToast({
							title: '邮箱已复制',
							icon: 'success',
							duration: 2000
						})
					}
				})
			}
		}
	}
</script>

<style>
.container {
	min-height: 100vh;
	background-color: #f7f7f7;
}

.content {
	padding: 30rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
}

.qr-section, .email-section {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.qr-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.qr-code {
	width: 400rpx;
	height: 400rpx;
	margin-bottom: 20rpx;
}

.qr-tip, .email-tip {
	font-size: 24rpx;
	color: #999;
	margin-top: 10rpx;
}

.email-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20rpx 0;
}

.email-text {
	font-size: 32rpx;
	color: #2b85e4;
	margin-bottom: 10rpx;
}
</style>
