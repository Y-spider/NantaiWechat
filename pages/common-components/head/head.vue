<template>
	<!-- 自定义导航栏 -->
	<view>
		<view class="navigation-self" :style="{'background-color':boxBg }">
			<view v-if="showBack" class="bcke-self" @click="goBack">
				<uni-icons class="left-icon" color="#fff" type="left" size="30"></uni-icons>
				返回
			</view>
		   <view v-if="showBack" class="title-self" style="margin-left: -62px;">{{title}}</view>
			<view v-else class="title-self">{{title}}</view>
		</view>
		<!-- 占位 -->
		<view class="temp"></view>
	</view>
</template>

<script>
	export default {
		name:"NavigationSelf",
		props:{
			title:{
				type:String
			},
			boxBg:{
				type:String
			},
			showBack:{
				type:Boolean,
				default:true
			},
			backUrl:{
				type:String,
			}
		},
		methods:{
			// 返回上一级
			goBack(){
				if(this.backUrl){
					uni.switchTab({
						url:"/pages/index/index"
					})
				}
				else{
					uni.navigateBack()
				}
				
			},
		}
	}
</script>

<style scoped>
	.navigation-self{
		width: 100%;
		height: 160rpx;
		background-color: #2f4052;
		font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
		border: none;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		position: fixed;
		z-index:9999;
	}
	.temp{
		width: 100%;
		height: 160rpx;
	}
	.title-self{
		font-size: large;
		padding: 50rpx;
		padding-left: 18rpx;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-grow: 1;
		margin-top: 60rpx;
		position: relative;
		z-index: 9999;
	}
	.bcke-self{
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-left: 5rpx;
		margin-top: 60rpx;
		z-index: 99999;
		position: relative;
	}
</style>

