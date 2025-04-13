<template>
	<!-- 多云天 -->
	<view class="cloud-sky-container">
		<view class="cloud-container cloud-1">
			<CloudCompont bg="white"></CloudCompont>
		</view>
		<view class="cloud-container cloud-2">
			<CloudCompont bg="white"></CloudCompont>
		</view>
		<view class="cloud-container cloud-3">
			<CloudCompont bg="white"></CloudCompont>
		</view>
	</view>
</template>

<script>
	import CloudCompont from "../cloud/cloud.vue"
	export default {
		name:"CloudSky",
		components:{
			CloudCompont
		},
		data(){
			return {
				
			}
		}
	}
</script>

<style scoped>
	.cloud-sky-container {
		position: relative;
		width: 100%;
		height: 300rpx;
		overflow: hidden;
	}
	
	.cloud-container {
		position: absolute;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
	}
	
	.cloud-1 {
		top: 30rpx;
		animation: cloud-move-1 30s linear infinite;
	}
	
	.cloud-2 {
		top: 100rpx;
		animation: cloud-move-2 45s linear infinite;
	}
	
	.cloud-3 {
		top: 180rpx;
		animation: cloud-move-3 60s linear infinite;
	}
	
	@keyframes cloud-move-1 {
		0% { left: -140rpx; }
		100% { left: 100%; }
	}
	
	@keyframes cloud-move-2 {
		0% { left: 100%; }
		100% { left: -140rpx; }
	}
	
	@keyframes cloud-move-3 {
		0% { left: -200rpx; }
		100% { left: 100%; }
	}
</style>