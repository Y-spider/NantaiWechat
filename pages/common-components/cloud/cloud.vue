<template>
	<!-- 云多组件 -->
	<view>
		<view class="cloud-box" :style="{'background-color': bg}">
			<view class="cloud" :style="{'background-color': bg}">
				<view class="cloud-item-1" :style="{'background-color': bg}"></view>
				<view class="cloud-item-2" :style="{'background-color': bg}"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		name:"CloudCompont",
		props:["bg"]  //接收云朵的背景颜色，默认为白色
	}
</script>

<style scoped>
	*{margin: 0rpx; padding: 0rpx; box-sizing: border-box;}
	 .cloud-box{
		 display: flex;
		 justify-content: center;
		 align-items: center;
		 background-color: white;
		 border-radius: 60rpx;
		 margin-top: 30rpx;
		 width:140rpx;
	 }
	 .cloud{
		 border-radius: 120rpx;
		 display: flex;
		 align-items: center;
	 }
	 .cloud-item-1{
		 position: relative;
		 background-color: white;
		 width: 60rpx;
		 height: 60rpx;
		 border-radius: 50%;
		 margin-left: 5rpx;
		 margin-top: -35rpx;
	 }
	 .cloud-item-2{
		 position: relative;
		 background-color: white;
		 width: 80rpx;
		 height:80rpx;
		 border-radius: 50%;
		 margin-left: -30rpx;
		 margin-top: -40rpx;
	 }
</style>