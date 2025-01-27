<template>
	<!-- 数据加载完全显示 -->
	<view class="box">
		<image src="../../../static/没有数据.png" style="width: 64rpx; height: 64rpx;"></image>
		<view v-if="text">{{text}}</view>
		<view v-if="isLoadAll">已经到底了哦!</view>
		<view v-if="!isLoadAll">数据丢失了!</view>
	</view>
</template>

<script>
import { computed } from "vue";
	export default {
		name:"stateComponent",
		props:{
			// isLoadAll 标识是否为显示为空状态，默认为fasle 表示展示的是数据加载完成(也就是展示列表下面展示的状态) 
			// 如果 isLoadAll是为false 没有数据的时候展示(也就是空状态)
			isLoadAll:{
				type:Boolean,
				default:true
			},
			// 展示的描述
			text:{
				type:String,
				require:false,
			}
		}
	}
</script>

<style scoped>
	.box{
		display: flex;
		flex-direction: column; 
		width: 100vw; 
		margin: 15rpx;
		justify-content: center;
		align-items: center;
		color: lightgray;
		font-size: small;
	}
</style>