<template>
	<view>
		<!-- 下雨动画组件 -->
		<view class="rain-box">
			<ClouldCompont bg="lightgray"></ClouldCompont>
			<view class="rain">
				<span :style="calcDuration_1"></span>
				<span :style="calcDuration_2"></span>
				<span :style="calcDuration_3"></span>
				<span :style="calcDuration_4"></span>
				<span :style="calcDuration_5"></span>
				<span :style="calcDuration_6"></span>
				<span :style="calcDuration_7"></span>
				<span :style="calcDuration_8"></span>
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
				calcDuration_1:"animation-duration:"+(Math.random()+1)/1.5+"s;",
				calcDuration_2:"animation-duration:"+(Math.random()+1)/1.5+"s;",
				calcDuration_3:"animation-duration:"+(Math.random()+1)/1.5+"s;",
				calcDuration_4:"animation-duration:"+(Math.random()+1)/1.5+"s;",
				calcDuration_5:"animation-duration:"+(Math.random()+1)/1.5+"s;",
				calcDuration_6:"animation-duration:"+(Math.random()+1)/1.5+"s;",
				calcDuration_7:"animation-duration:"+(Math.random()+1)/1.5+"s;",
				calcDuration_8:"animation-duration:"+(Math.random()+1)/1.5+"s;",
			}
		}
	}
</script>

<style scoped>
	*{margin: 0rpx; padding: 0rpx; box-sizing: border-box;}
	 .rain-box{
		 display: flex;
		 flex-direction: column;
	 }
	 .rain{
		 width: 140rpx;
		 margin-left: 5rpx;
		 position: relative;
		 top: -30rpx;
		 display: flex;
		 justify-content: space-around;
		 align-items: center;
	 }
	 .rain span{
		 width: 8rpx;
		 height: 8rpx;
		 border-radius: 50%;
		 background-color: red;
		 margin: 0rpx 2rpx;
		 background-color: white;
		 visibility: 0;
		 animation:rain-down 2s linear infinite;
		 transform-origin: bottom;
	 }
	 
	 @keyframes rain-down{
		 /* 雨滴落下关键帧 */
		 0%{
			 transform: translateY(0) scale(1);
		 }
		 70%{
			 transform: translateY(320rpx) scale(1);
		 }
		 100%{
			 transform: translateY(300rpx) scale(0);
		 }
	 }
	 
	 
	 
</style>
