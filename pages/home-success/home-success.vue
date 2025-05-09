<template>
	<!-- 登录成功显示页面 -->
	<view class="container">
		<!-- 顶部背景区域 -->
		<view class="header-bg">
			<!-- 装饰云朵 -->
			<view class="decoration-clouds">
				<CloudCompont v-for="(item,index) in 5" :key="index" class="cloud-item"></CloudCompont>
			</view>
			<!-- 个人信息卡片 -->
			<view class="user-card" style="position: relative; margin-top: 120rpx;z-index: 9999;">
				<view class="avatar-wrapper" style="">
					<image class="avatar" :src="avatarUrl" mode="aspectFill" @click="toModifyPage"></image>
				</view>
				<view class="user-name" style="z-index: 99999;">{{userInfo.name}}</view>
				<!-- 数据统计 -->
				<view class="decoration-clouds">
					<CloudCompont v-for="(item,index) in 3" :key="index" class="cloud-item"></CloudCompont>
				</view>
				<view class="stats-box">
					<view class="stat-item">
						<text class="num">{{userInfo.point}}</text>
						<text class="label">积分</text>
					</view>
					<view class="stat-item">
						<text class="num">{{userInfo.todayPost}}</text>
						<text class="label">今日剩余</text>
					</view>
					<view class="stat-item">
						<text class="num">{{userInfo.totalPost-postedDataList.length}}</text>
						<text class="label">总剩余</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 快捷功能区 -->
		<view class="quick-functions">
			<view class="quick-item" @click="toMyCollectionPage()">
				<text class="quick-num">{{staticData.collectionSize}}</text>
				<text class="quick-label">我的收藏</text>
			</view>
			<view class="quick-item" @click="gotoTheTypePage('历史浏览')">
				<text class="quick-num">{{staticData.browsingSize}}</text>
				<text class="quick-label">历史浏览</text>
			</view>
			<view class="quick-item" @click="toMySubscribePage()">
				<text class="quick-num">{{staticData.subscributeSize}}</text>
				<text class="quick-label">我的关注</text>
			</view>
			<view class="quick-item" @click="toSigninPage()">
				<text class="quick-num">{{staticData.signSize}}</text>
				<text class="quick-label">本周签到</text>
			</view>
		</view>

		<!-- 功能列表 -->
		<view class="function-list">
			<view class="function-item" @click="toMyPostPage()">
				<view class="item-left">
					<image :src="funItemList[0].iconPath" class="icon"></image>
					<text>{{funItemList[0].funName}} {{staticData.myPostSize || 0}}</text>
				</view>
				<image src="../../static/向右箭头 (1).png" class="arrow"></image>
			</view>
			<!-- <view class="function-item" @click="gotoTheTypePage('优惠劵')">
				<view class="item-left">
					<image src="../../static/优惠劵.png" class="icon"></image>
					<text>优惠劵</text>
				</view>
				<image src="../../static/向右箭头 (1).png" class="arrow"></image>
			</view> -->
			<view class="function-item" @click="toUseGuidePage()">
				<view class="item-left">
					<image :src="funItemList[1].iconPath" class="icon"></image>
					<text>{{funItemList[1].funName}}</text>
				</view>
				<image src="../../static/向右箭头 (1).png" class="arrow"></image>
			</view>
			<view class="function-item">
				<view class="item-left">
					<image :src="funItemList[2].iconPath" class="icon"></image>
					<text>{{funItemList[2].funName}}</text>
				</view>
				<button class="transparent-btn" open-type="share">分享</button>
				<image src="../../static/向右箭头 (1).png" class="arrow"></image>
			</view>
			<view class="function-item" @click="toModelPage()">
				<view class="item-left">
					<image :src="funItemList[3].iconPath" class="icon"></image>
					<text>{{funItemList[3].funName}}</text>
				</view>
				<image src="../../static/向右箭头 (1).png" class="arrow"></image>
			</view>
			<!-- 合作联系 -->
			<view class="function-item" @click="gotoCoperation">
				<view class="item-left">
					<image :src="funItemList[7].iconPath" class="icon"></image>
					<text>{{funItemList[7].funName}}</text>
				</view>
				<image src="../../static/向右箭头 (1).png" class="arrow"></image>
			</view>
			<view class="function-item">
				<view class="item-left">
					<image :src="funItemList[4].iconPath" class="icon"></image>
					<text>{{funItemList[4].funName}}</text>
				</view>
				<button class="transparent-btn" open-type="contact">联系客服</button>
				<image src="../../static/向右箭头 (1).png" class="arrow"></image>
			</view>
			<!-- 意见反馈 -->
			<!-- <view class="function-item">
				<view class="item-left">
					<image :src="funItemList[5].iconPath" class="icon"></image>
					<text>{{funItemList[5].funName}}</text>
				</view>
				<button class="transparent-btn" open-type="feedback">反馈</button>
				<image src="../../static/向右箭头 (1).png" class="arrow"></image>
			</view> -->
			<view class="function-item" @click="logout">
				<view class="item-left">
					<image :src="funItemList[6].iconPath" class="icon"></image>
					<text>{{funItemList[6].funName}}</text>
				</view>
				<image src="../../static/向右箭头 (1).png" class="arrow"></image>
			</view>
			
		</view>
		
		<!-- 底部声明 -->
		<view class="disclaimer">
			<text>- 本程序由个人开发，与其他组织无关 -</text>
		</view>
	</view>
</template>

<script>
	import {navigateToPage,showErr, showSuccess} from "../../common/common-js.js"
	import {logoutAPI} from "../../api/HomeApi.js"
	import CloudCompont from "../common-components/cloud/cloud.vue"
	import NavigationSelf from "../common-components/head/head.vue"
	
	export default {
		name: "HomeSuccessPage",
		components:{
			CloudCompont,
			NavigationSelf,
		},
		data() {
			return{
				funItemList:[
					{"funName":"我的发布","iconPath":this.$baseImageUrl+"icon/我的发布.png"},
					{"funName":"使用指南","iconPath":this.$baseImageUrl+"icon/使用指南.png"},
					{"funName":"邀请校友","iconPath":this.$baseImageUrl+"icon/分享.png"},
					{"funName":"模版管理","iconPath":this.$baseImageUrl+"icon/模版管理.png"},
					{"funName":"联系客服","iconPath":this.$baseImageUrl+"icon/联系客服.png"},
					{"funName":"意见反馈","iconPath":this.$baseImageUrl+"icon/意见反馈.png"},
					{"funName":"退出登录","iconPath":this.$baseImageUrl+"icon/退出登录(1).png"},
					{"funName":"合作联系","iconPath":this.$baseImageUrl+"icon/商务合作.png"}
				]
			}
			
		},
		props:["userInfo","avatarUrl","postedDataList","showWeatherFlagList","showWeatherBackground","showWeatherIndex","staticData"],
		onShow(){
			// 获取本地存储的天气状态
			const weatherText = uni.getStorageSync('weatherText')
			if (weatherText) {
				this.weatherType = weatherText
			}
		},
		methods: {
			gotoCoperation(){
				// 前往合作联系页面
				uni.navigateTo({
					url:"/pages/funpage/coperation/coperation"
				})
			},
			gotoTheTypePage(typeDes){
				if(typeDes == "优惠劵"){
					uni.showModal({
						content:"暂未开放",
						showCancel:false,
					})
					return
				}
				uni.navigateTo({
					url:"/pages/funpage/post-page-of-type/post-page-of-type?type=" + typeDes
				})
			},
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
						// 标记退出成功到首页刷新页面
						uni.setStorageSync("login_success_init_index",true)
						showSuccess("退出成功!")
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
					else if(res.code == 401){
						uni.setStorageSync("flag",false)
						showErr(res.errMsg)
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
			toMySubscribePage(){
				uni.navigateTo({
					url:"/pages/funpage/my-subscribe/my-subscribe"
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
		background-color: white;
	}
	.user-name{
		display: flex;
		justify-content: center;
		align-items: center;
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
/* 	.about{
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
	.subscribe{
		background-image: url("../../static/关注.png");
	} */
	
	
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

	.container {
		min-height: 100vh;
		background-color: #f7f7f7;
	}

	.header-bg {
		position: relative;
		height: 400rpx;
		background: linear-gradient(180deg, #a8d8ff 0%, #f7f7f7 100%);
		padding-top: 80rpx; /* 减小顶部内边距 */
		overflow: hidden;
	}

	/* 波浪动画 */
	.wave-box {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 120rpx;
		overflow: hidden;
	}

	.wave {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 200%;
		height: 100%;
		background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="white" fill-opacity="0.2" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') repeat-x;
		animation: wave-animation 12s linear infinite;
	}

	.wave1 {
		opacity: 0.3;
		animation-duration: 12s;
		bottom: -5rpx;
	}

	.wave2 {
		opacity: 0.2;
		animation-duration: 8s;
		bottom: -10rpx;
	}

	.wave3 {
		opacity: 0.1;
		animation-duration: 5s;
		bottom: -15rpx;
	}

	@keyframes wave-animation {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}

	.decoration-clouds {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		overflow: hidden;
	}

	.cloud-item {
		position: absolute;
	}

	.cloud-item:nth-child(1) {
		top: 10%;
		left: 10%;
		animation: float 8s ease-in-out infinite;
	}

	.cloud-item:nth-child(2) {
		top: 30%;
		left: 50%;
		animation: float 6s ease-in-out infinite;
	}

	.cloud-item:nth-child(3) {
		top: 20%;
		left: 80%;
		animation: float 7s ease-in-out infinite;
	}

	.user-card {
		position: relative;
		z-index: 1;
		margin: 0 30rpx;
		margin-top: 80rpx;  /* 为头像留出空间 */
		padding: 70rpx 30rpx 30rpx;
		background: rgba(255, 255, 255, 0.95);
		border-radius: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.avatar-wrapper {
		position: absolute;
		left: 53%;
		top: -60rpx;  /* 调整头像位置，使其在卡片顶部居中 */
		transform: translateX(-50%);
		width: 120rpx;
		height: 120rpx;
		background: #fff;
		border-radius: 50%;
		padding: 4rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
		z-index: 2;  /* 确保头像在最上层 */
	}

	.avatar {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		border: 3rpx solid rgba(255, 255, 255, 0.9);
	}

	.user-name {
		font-size: 32rpx;
		font-weight: bold;
		margin: 10rpx 0 25rpx;
		text-align: center;
		width: 100%;
		color: #333;
	}

	.stats-box {
		display: flex;
		justify-content: space-around;
		width: 100%;
		padding: 0 20rpx;
		border-top: 1rpx solid rgba(0, 0, 0, 0.05);
		padding-top: 20rpx;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.stat-item:nth-child(1) .num {
		color: #2b85e4;  /* 积分数字颜色 - 蓝色 */
	}

	.stat-item:nth-child(2) .num {
		color: #19be6b;  /* 今日剩余数字颜色 - 绿色 */
	}

	.stat-item:nth-child(3) .num {
		color: #ff9900;  /* 总剩余数字颜色 - 橙色 */
	}

	.num {
		font-size: 36rpx;
		font-weight: bold;
		margin-bottom: 4rpx;
	}

	.label {
		font-size: 24rpx;
		color: #666;
	}

	/* 快捷功能区 */
	.quick-functions {
		margin: 20rpx 30rpx;
		padding: 20rpx;
		background: #fff;
		border-radius: 20rpx;
		display: flex;
		justify-content: space-around;
	}

	.quick-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.quick-item:nth-child(1) .quick-num {
		color: #ff6b81; /* 我的收藏 - 粉红色 */
	}

	.quick-item:nth-child(2) .quick-num {
		color: #5352ed; /* 历史浏览 - 靛蓝色 */
	}

	.quick-item:nth-child(3) .quick-num {
		color: #2ed573; /* 我的关注 - 绿色 */
	}

	.quick-item:nth-child(4) .quick-num {
		color: #ffa502; /* 本周签到 - 橙色 */
	}

	.quick-num {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 4rpx;
	}

	.quick-label {
		font-size: 24rpx;
		color: #666;
	}

	.function-list {
		margin: 20rpx 30rpx;
		background: #fff;
		border-radius: 20rpx;
		padding: 0 20rpx;
	}

	.function-item {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 0;
		border-bottom: 3rpx solid #eee;
	}

	.function-item:last-child {
		border-bottom: none;
	}

	.item-left {
		display: flex;
		align-items: center;
	}

	.icon {
		width: 50rpx;
		height: 50rpx;
		margin-right: 20rpx;
	}

	.arrow {
		width: 32rpx;
		height: 32rpx;
	}

	.transparent-btn {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}

	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-20rpx); }
	}

	/* 功能列表中的数字样式 */
	.function-item .number {
		color: #2b85e4;
		font-weight: bold;
		margin-left: 4rpx;
	}

	/* 底部声明样式 */
	.disclaimer {
		width: 100%;
		padding: 30rpx 0;
		text-align: center;
		color: #999;
		font-size: 24rpx;
		background: transparent;
		letter-spacing: 2rpx;
	}
</style>
