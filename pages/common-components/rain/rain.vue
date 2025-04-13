<template>
	<view>
		<!-- 下雨动画组件 -->
		<view class="rain-box">
			<view class="cloud-container wind-effect">
				<ClouldCompont bg="lightgray" :animated="false"></ClouldCompont>
			</view>
			<view class="rain">
				<span v-for="(item, index) in raindrops" :key="index" :style="item.style"></span>
			</view>
		</view>
	</view>
</template>

<script>
	import ClouldCompont from "../cloud/cloud.vue" 
	export default {
		components:{
			ClouldCompont
		},
		name:"RainCompont",
		data(){
			return {
				raindrops: []
			}
		},
		created() {
			// 创建12个雨滴，每个雨滴有随机的动画时长和延迟
			for (let i = 0; i < 12; i++) {
				const duration = (Math.random() * 0.5 + 1).toFixed(2);
				const delay = (Math.random() * 0.5).toFixed(2);
				const leftPos = (Math.random() * 120).toFixed(0);
				this.raindrops.push({
					style: `animation-duration: ${duration}s; animation-delay: ${delay}s; left: ${leftPos}rpx;`
				});
			}
		}
	}
</script>

<style scoped>
	*{margin: 0rpx; padding: 0rpx; box-sizing: border-box;}
	.rain-box{
		display: flex;
		flex-direction: column;
		position: relative;
	}
	.cloud-container {
		position: relative;
		z-index: 10;
		animation: cloud-wind-move 8s ease-in-out infinite;
		transform-origin: center;
	}
	.wind-effect {
		animation: cloud-wind-move 8s ease-in-out infinite, 
				   cloud-wind-tilt 6s ease-in-out infinite;
	}
	.rain{
		width: 140rpx;
		position: relative;
		top: -30rpx;
		height: 320rpx;
		overflow: hidden;
	}
	.rain span{
		position: absolute;
		width: 2rpx;
		height: 20rpx;
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 0;
		animation: rain-down 2s linear infinite;
		transform-origin: top;
	}
	
	@keyframes cloud-wind-move {
		0% {
			transform: translate(0, 0);
		}
		25% {
			transform: translate(20rpx, -15rpx);
		}
		50% {
			transform: translate(-15rpx, 10rpx);
		}
		75% {
			transform: translate(10rpx, -5rpx);
		}
		100% {
			transform: translate(0, 0);
		}
	}
	
	@keyframes cloud-wind-tilt {
		0% {
			transform: rotate(0deg) scale(1);
		}
		25% {
			transform: rotate(2deg) scale(1.05);
		}
		50% {
			transform: rotate(-1deg) scale(0.98);
		}
		75% {
			transform: rotate(1deg) scale(1.02);
		}
		100% {
			transform: rotate(0deg) scale(1);
		}
	}
	 
	@keyframes rain-down{
		0%{
			transform: translateY(0) scale(1) rotate(0deg);
			opacity: 0;
		}
		10% {
			opacity: 1;
			transform: translateY(30rpx) scale(1) rotate(0deg);
		}
		50%{
			transform: translateY(180rpx) scale(1) rotate(5deg);
			opacity: 1;
		}
		75%{
			transform: translateY(280rpx) scale(1) rotate(8deg);
			opacity: 0.8;
		}
		100%{
			transform: translateY(320rpx) scale(0.5) rotate(10deg);
			opacity: 0;
		}
	}
</style>
