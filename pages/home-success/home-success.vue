<template>
	<!-- 登录成功显示页面 -->
	<view>
		<!-- 自定义的导航栏样式 -->
		<NavigationSelf title="个人中心" :boxBg="showWeatherBackground[showWeatherIndex]" :showBack="false"></NavigationSelf>
		<!-- 天气动画区域 -->
		<!-- 太阳图像 -->
		<view v-if="showWeatherFlagList[0]==true" class="sun-box" style="position: absolute;">
			<view style="width: 80rpx; height: 80rpx; border-radius: 50%;background-color: red;">
				<text style="">1</text>
			</view>
		</view>
		<!-- 大雨展示背景 -->
		<view v-if="showWeatherFlagList[3]==true" class="weather-box,weather-heavy-rain" style="position: absolute;  height: 360rpx; width: 100%; display: flex; background-color: #595c5f;">
			<RainCompont style="margin-top: 15rpx;"></RainCompont>
			<RainCompont style="margin-top: 40rpx;"></RainCompont>
			<RainCompont style="margin-top: -50rpx;"></RainCompont>
			<RainCompont style="margin-top: -13rpx;margin-left: -15rpx;"></RainCompont>
			<RainCompont style="margin-top: 27rpx;"></RainCompont>
		</view>
		<!-- 小雨展示背景 ，展示三朵云-->
		<view v-if="showWeatherFlagList[2]==true" class="weather-box,weather-rain" style="position: absolute;  height: 360rpx; width: 100%; display: flex; justify-content: space-around; background-color: #595c5f;">
			<RainCompont style="margin-top: 15rpx;"></RainCompont>
			<!-- <RainCompont style="margin-top: 40rpx;"></RainCompont> -->
			<RainCompont style="margin-top: -50rpx;"></RainCompont>
			<!-- <RainCompont style="margin-top: -13rpx;margin-left: -15rpx;"></RainCompont> -->
			<RainCompont style="margin-top: 27rpx;"></RainCompont>
		</view>
		<!-- 多云天气背景，背景才开skybule -->
		<view v-if="showWeatherFlagList[1]==true" class="weather-box,weather-heavy-rain" style="position: absolute;  height: 360rpx; width: 100%; display: flex; justify-content: space-around;flex-direction: column; background-color: skyblue;">
			<view class="cloud-box-1" style="display: flex;justify-content: space-around;">
				<CloudCompont  class="cloud" style="margin-top: 12rpx;margin-left: -120rpx;"></CloudCompont>
				<CloudCompont class="cloud" style="margin-top: -30rpx;margin-left: 22rpx;"></CloudCompont>
				<CloudCompont  class="cloud" style="margin-top: 25rpx;margin-left: 35rpx;"></CloudCompont>
				<CloudCompont  class="cloud" style="margin-top: 12rpx;margin-left: 45rpx;"></CloudCompont>
			</view>
			<view class="cloud-box-2" style="display: flex;justify-content: space-around;">
				<CloudCompont  class="cloud" style="margin-top: -35rpx; margin-left: -120rpx;"></CloudCompont>
				<CloudCompont  class="cloud" style="margin-top: -65rpx; margin-left: -90rpx;"></CloudCompont>
				<CloudCompont  class="cloud" dstyle="visibility: 0;"></CloudCompont>
				<CloudCompont  class="cloud" style="margin-top: -65rpx; margin-left: -88rpx;"></CloudCompont>
			</view>
		</view>
		<!-- 晴天天气，背景设置为太阳的颜色哦 -->
		<view v-if="showWeatherFlagList[0]==true" class="weather-box,weather-heavy-rain" style="position: absolute;  height: 360rpx; width: 100%; display: flex; justify-content: space-around;flex-direction: column; background-color: #fbac13;">
			<view class="sun-box" style="margin-left: 80%; position: absolute; margin-top: -300rpx;margin-right: 600rpx;">
				<view style="width: 80rpx; height: 80rpx; border-radius: 50%;background-color: darkred;top: -300rpx;">
					<text style="opacity: 0;">1</text>
				</view>
			</view>
			<view class="cloud-box-1" style="display: flex;justify-content: space-around;">
				<CloudCompont  class="cloud" style="margin-top: 12rpx;margin-left: -120rpx;"></CloudCompont>
				<CloudCompont class="cloud" style="margin-top: -30rpx;margin-left: 22rpx;"></CloudCompont>
				<CloudCompont  class="cloud" style="margin-top: 25rpx;margin-left: 35rpx;"></CloudCompont>
				<CloudCompont  class="cloud" style="margin-top: 12rpx;margin-left: 45rpx;"></CloudCompont>
			</view>
			<view class="cloud-box-2" style="display: flex;justify-content: space-around;">
				<CloudCompont  class="cloud" style="margin-top: -35rpx; margin-left: -120rpx;"></CloudCompont>
				<CloudCompont  class="cloud" style="margin-top: -65rpx; margin-left: -90rpx;"></CloudCompont>
				<CloudCompont  class="cloud" dstyle="visibility: 0;"></CloudCompont>
				<CloudCompont  class="cloud" style="margin-top: -65rpx; margin-left: -88rpx;"></CloudCompont>
			</view>
		</view>
		<!-- 头像区域 -->
		<view class="body" :style="{ backgroundColor: showWeatherBackground[showWeatherIndex] }">
			<view class="body-box"  @click="toModifyPage()">
				<view class="user-name">{{userInfo.name}}</view>
				<view class="base-info-box">
					<view class="base-info">{{userInfo.point}} <text>积分</text> </view>
					<view class="base-info">{{userInfo.todayPost}} <text>今日剩余</text> </view>
					<view class="base-info">{{userInfo.totalPost-postedDataList.length}}<text>总剩余</text></view>
				</view>
			</view>
			<view class="avatar" @click="toModifyPage()">
				<image :src="avatarUrl"/>
			</view>
		</view>
		<!-- 功能选择模块 -->
		<view class="fun-box">
			<view class="fun-item-title">
				<p class="welcome">欢迎使用南泰微校园</p>
			</view>
			
			
			<view class="fun-item" @click="toMyPostPage()">
				<view class="fun-icon mypost"><text>1</text></view>
				<view class="fun-name">我的发布</view>
				<view class="fun-icon-arrow"><text>1</text></view>
			</view>
			<view class="fun-item" @click="toMyCollectionPage()">
				<view class="fun-icon about"><text>1</text></view>
				<view class="fun-name">我的收藏</view>
				<view class="fun-icon-arrow"><text>1</text></view>
			</view>
			<view class="fun-item" @click="toSigninPage()">
				<view class="fun-icon sign-in"><text>1</text></view>
				<view class="fun-name">签到</view>
				<view class="fun-icon-arrow"><text>1</text></view>
			</view>
			<view class="fun-item" @click="toUseGuidePage()">
				<view class="fun-icon use-instruction"><text>1</text></view>
				<view class="fun-name">使用指南</view>
				<view class="fun-icon-arrow"><text>1</text></view>
			</view>
			<view class="fun-item" @click="toModelPage()">
				<view class="fun-icon template-manage"><text>1</text></view>
				<view class="fun-name">模版管理</view>
				<view class="fun-icon-arrow"><text>1</text></view>
			</view>
			<view class="fun-item">
				<button open-type="contact">1</button>
				<view class="fun-icon contact"><text>1</text></view>
				<view class="fun-name">联系客服</view>
				<view class="fun-icon-arrow"><text>1</text></view>
			</view>
			<view class="fun-item">
				<button @click="feedbackToMe()">1</button>
				<view class="fun-icon feedback"><text>1</text></view>
				<view class="fun-name">意见反馈</view>
				<view class="fun-icon-arrow"><text>1</text></view>
			</view>
			<view class="fun-item" @click="logout()">
				<view class="fun-icon logout" ><text>1</text></view>
				<view class="fun-name">退出登陆</view>
				<view class="fun-icon-arrow"><text>1</text></view>
			</view>
		</view>
	</view>
</template>

<script>
	import {navigateToPage,showErr} from "../../common/common-js.js"
	import {logoutAPI} from "../../api/HomeApi.js"
	import  RainCompont from "../common-components/rain/rain.vue"
	import CloudCompont from "../common-components/cloud/cloud.vue"
	import NavigationSelf from "../common-components/head/head.vue"
	export default {
		name: "HomeSuccessPage",
		components:{
			RainCompont,
			CloudCompont,
			NavigationSelf
		},
		props:["userInfo","avatarUrl","postedDataList","showWeatherFlagList","showWeatherBackground","showWeatherIndex"],
		created(){
			
		},
		methods: {
			logout(){
				logoutAPI("user/logout")
				.then((res)=>{
					if(res.code == 200){
						let keys = uni.getStorageInfoSync().keys
						for(let key of keys) {
						    if(key == "todayAdditionalCount" || key=="modelData") {
						        continue
						    }
						    uni.removeStorageSync(key)
						}
						uni.setStorageSync("flag",false)
						uni.switchTab({
							url:"/pages/index/index"
						})
					}else if(res.code == -1){
						uni.setStorageSync("flag",false)
						console.error(res.errMsg)
						showErr(res.errMsg)
					}
					else if(res.code == -99){
						// token失效，需要重新登陆
						uni.setStorageSync("flag",false)
						showErr("token失效，请重新登陆!")
					}
				})
			},
			toUseGuidePage(){
				uni.navigateTo({
					url:"/pages/funpage/use-guide-page/use-guide-page"
				})
			},
			toModifyPage(){
				uni.navigateTo({
					url:"/pages/modify-info/modify-info"
				})
			},
			toSigninPage(){
				// uni.navigateTo({
				// 	url:"/pages/funpage/signin-page/signin-page"
				// })
				navigateToPage("/pages/funpage/signin-page/signin-page")
			},
			toModelPage(){
				uni.navigateTo({
					url:"/pages/funpage/model-page/model-page"
				})
			},
			toMyPostPage(){
				uni.navigateTo({
					url:"/pages/funpage/my-post-page/my-post-page"
				})
			},
			toMyCollectionPage(){
				uni.navigateTo({
					url:"/pages/funpage/my-collection-page/my-collection-page"
				})
			}
		}
	}
</script>

<style scoped>
	*{
		margin: 0rpx;
		height: 0rpx;
		box-sizing: border-box;
	}
	.icon-self{
		background-color: lightcoral;
		opacity: 0.8;
	}
	.avatar,image{
		width: 150rpx;
		height: 150rpx;
		/* background-color: white; */
		border-radius: 50%;
		
	}
	.base-info{
		width: 100%;
		height: 150rpx;
		/* background-color: red; */
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
	.base-info .info-name, .info-point {
	    width: 40%;
	    height: 40%;
	    background-color: white;
		display: flex;
		align-items: center;
	    text-align: left;
	    padding: 10rpx; /* 增加内边距 */
	    font-size: 28rpx; /* 调整字体大小 */
	    color: #333; /* 调整字体颜色 */
	}
	.body{
		width: 100%;
		height: 400rpx;	
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: skyblue;
	}
	.body-box{
		width: 80%;
		height: 200rpx;
		opacity: 0.7;
		margin-top: 90rpx;
		background: white;
		position: absolute;
		border-radius: 30rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.avatar{
		width: 130rpx;
		height: 130rpx;
		border-radius: 50%;
		background: #333;
		z-index: 11;
		margin-top: -100rpx;
		margin-left: 300rpx;
		background-color: white;
	}
	.user-name{
		width: 80%;
		text-indent: 1rem;
		font-size: 32rpx;
		margin-top: 12rpx;
		color: #333;
	}
	.base-info-box{
		width: 85%;
		height: 120rpx;
		/* background-color: #333; */
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin-top: 30rpx;
	}
	.base-info{
		height: 80%;
		display: flex;
		flex-direction: column;
		z-index: 999;
		/* background-color: red; */
		font-size: 30rpx;
		margin-top: 10rpx;
		margin: 0 15rpx;
		border-bottom: 1px solid lightgray;
	}
	.base-info text{
		font-size: 18rpx;
		margin-top: -15rpx;
	}
	.fun-box{
		width: 100%;
		background: white;
		margin-top: -60rpx;
		border-radius: 70rpx 70rpx 0rpx 0rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		/* box-shadow: 2px 2px 5px 0px white; */
	}
	.fun-box .fun-item-title,.fun-item{
		width: 80%;
		text-align: center;
		margin: 30rpx 0;
		padding: 6rpx 0;
		
	}
	.fun-box .fun-item{
		margin: 15rpx;
		display: flex;
		justify-content: space-around;
		align-items: baseline;
		position: relative;
		border-bottom: 1px solid lightgray;
		position: relative;
	}
	.fun-box .fun-item button{
		width: 100%;
		position: absolute;
		height: 100%;
		opacity: 0;
		
		
	}
	
	.welcome{
		font-size: 42rpx;
		font-weight:bold;
	}
	.fun-icon{
		width: 64rpx;
		height: 60rpx;
		background-image: url("../../static/客服 (1).png");
		background-repeat: no-repeat;
		
	}
	.fun-icon text{
		visibility: hidden;
	}
	.fun-icon-arrow text{
		visibility: hidden;
	}
	.fun-icon-arrow{
		width: 50rpx;
		height: 50rpx;
		background-image: url("../../static/向右箭头 (1).png");
		background-repeat: no-repeat;
	}
	.fun-name{
		width: 80%;
		margin: 0 30rpx;
		text-align: left;
		font-family: 宋体;
		/* border: 1px solid red; */
		display: flex;
		align-items: center;
	}
	/* 设置不同的背景图片 */
	.about{
		background-image: url("../../static/爱心.png");
	}
	.instruction{
		background-image: url("../../static/感叹号.png");
	}
	.feedback{
		background-image: url("../../static/反馈.png");
	}
	.sign-in{
		background-image: url("../../static/签到.png");
	}
	.use-instruction{
		background-image: url("../../static/使用指南.png");
	}
	.template-manage{
		background-image: url("../../static/模版管理.png");
	}
	.logout{
		background-image: url("../../static/退出.png");
	}
	.mypost{
		background-image: url("../../static/我的发布.png");
	}
	
	
	image{
		width: 130rpx;
		height: 130rpx;
		border-radius: 50%;
	}
	
	/* 给云添加运动动作 */
	.cloud{
		animation:cloud-move linear infinite;
		animation-duration: 30s;
		transform-origin: left;
	}
	
	/* 定义关键帧 */
	@keyframes cloud-move{
		0%{
			transform: translateX(0rpx);
		}
		75%{
			transform: translateX(160rpx);
		}
		100%{
			transform: translateX(0rpx);
		}
	}
</style>
