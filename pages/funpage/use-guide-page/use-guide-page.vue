<template>
	<view class="container">
		<NavigationSelf title="使用指南"></NavigationSelf>
		
		<!-- 内容区域 -->
		<scroll-view scroll-y class="content">
			<!-- 欢迎语 -->
			<view class="welcome-section">
				<text class="welcome-title">欢迎使用南泰生活助手</text>
				<text class="welcome-subtitle">让南泰生活更加便捷</text>
			</view>
			<!-- 功能指南列表 -->
			<view class="guide-list">
				<!-- 首页功能指南 -->
				<view class="guide-item" v-for="guide,index in guideData" :key="index">
					<view class="guide-header">
						<text class="guide-title">{{guide.guideTitle}}</text>
						<text class="guide-desc">{{guide.guideDes}}</text>
					</view>
					<image v-for="imageUrl in guide.guideImage" :key="imageUrl" class="guide-image" :src="baseImageUrl+imageUrl" mode="aspectFit" @click="previewImage(imageUrl)"></image>
					<view class="guide-steps">
						<view class="step-item" :key="step" v-for="step in guide.stepItem">
							<text class="step-num">{{step.stepNum}}</text>
							<text class="step-text">{{step.stepText}}</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import NavigationSelf from "../../common-components/head/head.vue"
	import {getUseGuideWithPageAPI} from "@/api/useGuideApi.js"
	import { showErr,showSuccess} from "../../../common/common-js"
	export default {
		components:{
			NavigationSelf
		},
		data() {
			return {
				baseImageUrl:this.$baseImageUrl,
				isReachBottom:false,
				pageIndex:1,
				pageSize:10,
				guideData:[]
			}
		},
		onReachBottom(){
			if(!this.isReachBottom){
				this.pageIndex++
				this.init()
			}
		},
		created(){
			this.init()
		},
		methods: {
			init(){
				if(this.isReachBottom) return
				getUseGuideWithPageAPI(this.pageIndex,this.pageSize).then((res)=>{
					if(res.code == 200){
						this.guideData = res.data.pageDataList
						if(res.data.pageDataList.length < this.pageSize){
							this.isReachBottom = true
						}
						for(let i = 0;i < this.guideData.length;i++){
							this.guideData[i].stepItem = JSON.parse(this.guideData[i].stepItem)
							this.guideData[i].guideImage = this.guideData[i].guideImage.split(",")
						}
					}else{
						showErr("错误代码",res.code)
					}
				})
			},
			previewImage(url){
				let baseUrl = this.baseImageUrl
				uni.previewImage({
					urls:[baseUrl+url]
				})
			}
		}
	}
</script>

<style scoped>
.container {
	min-height: 100vh;
	background-color: #f8f8f8;
}

.content {
	flex: 1;
	padding: 30rpx;
}

.welcome-section {
	text-align: center;
	margin-bottom: 40rpx;
}

.welcome-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 12rpx;
}

.welcome-subtitle {
	font-size: 28rpx;
	color: #666;
}

.guide-list {
	width: 92vw;
	display: flex;
	flex-direction: column;
	gap: 30rpx;
}

.guide-item {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 24rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.guide-header {
	margin-bottom: 20rpx;
}

.guide-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 8rpx;
}

.guide-desc {
	font-size: 26rpx;
	color: #666;
}

.guide-image {
	width: 100%;
	height: 300rpx;
	border-radius: 12rpx;
	margin-bottom: 20rpx;
}

.guide-steps {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.step-item {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.step-num {
	width: 40rpx;
	height: 40rpx;
	background-color: #3582E9;
	color: white;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
}

.step-text {
	font-size: 28rpx;
	color: #333;
	flex: 1;
}
</style>
