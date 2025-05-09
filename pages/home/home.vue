<template>
	<view>
		<view v-if="!flag" class="content">
			<!-- 自定义的导航栏样式 -->
			<NavigationSelf title="个人中心" boxBg="transparent" :showBack="false"></NavigationSelf>
			<!-- 主体 -->
			<view class="animated-background">
				<view class="gradient-circle circle-1"></view>
				<view class="gradient-circle circle-2"></view>
				<view class="gradient-circle circle-3"></view>
				<view class="overlay"></view>
			</view>
			<view class="body">
				<view class="welcome-text">南泰微校园</view>
				<view class="login-desc">让校园生活更精彩</view>
				<button class="login-btn" @click="login()">
					<text>微信一键登录</text>
				</button>
			</view>
			<!-- 功能选择模块 -->
			<view class="fun-box">
				<view class="fun-item-title">
					<p class="welcome">欢迎新同学</p>
				</view>
				
				<view class="fun-item">
					<button open-type="contact"></button>
					<view class="fun-icon contact"></view>
					<view class="fun-name">联系客服</view>
					<view class="fun-icon-arrow"></view>
				</view>
				<view class="fun-item">
					<button @click="gotoProticalPage()"></button>
					<view class="fun-icon instruction"></view>
					<view class="fun-name">使用协议<text class="required">(必读)</text></view>
					<view class="fun-icon-arrow"></view>
				</view>
			</view>
		</view>
		<!-- 个人中心页面 -->
		<view v-else>
			<HomeSuccessPage 
				:userInfo="userInfo" 
				:avatarUrl="avatarUrl" 
				:postedDataList="postedDataList" 
				:showWeatherFlagList="showWeatherFlagList"
				:showWeatherBackground="showWeatherBackground"
				:showWeatherIndex="showWeatherIndex"
				:staticData="staticData"
			></HomeSuccessPage>
		</view>
	</view>
</template>

<script>
	import HomeSuccessPage from '../home-success/home-success.vue'
	import NavigationSelf from "../common-components/head/head.vue"
	import {loginAPI,getCurrentUserInfoAPI,getUserStaticAPI} from "../../api/HomeApi.js"
	import {showErr,removeAllStorage} from "../../common/common-js.js"
	import {getPostByOpenidAPI} from "../../api/PostApi.js"
	export default {
		components:{
			HomeSuccessPage,
			NavigationSelf,
		},
		data() {
			return {
				flag: false, // 标记当前展示页面 false 表示是登录页面 true表示是登录成功页面
				userInfo:"",
				avatarUrl:"",
				staticData:null,
				postedDataList:[],
				showWeatherFlagList:[false,false,false,false,false], // 展示天气背景状态标记数组 0 表示晴天 1 表示多云 2 表示小雨 3表示大雨
				showWeatherBackground:["#fbac13 ;","skyblue ;","#595c5f ;"] ,// 0表示晴天背景颜色 2表示雨天背景颜色 1表示多云背景颜色
				showWeatherIndex:0 //当前天气的下标
				
			}
		},
		onLoad() {
			this.flag = uni.getStorageSync("flag")
			this.userInfo = uni.getStorageSync("userInfo")
			this.avatarUrl =  this.$baseImageUrl + this.userInfo.avatar +"?"+ new Date().getTime()
			// 通过获取当前天气描述，动态显示主页页面天气背景
			// 展示天气背景状态标记数组 0 表示晴天 1 表示多云 2 表示小雨 3表示大雨
			let weatherDesTest = uni.getStorageSync("weatherText")
			if(weatherDesTest == "多云" || weatherDesTest.indexOf("云")!==-1){
				this.$set(this.showWeatherFlagList,1,true)
				this.showWeatherIndex = 1
			}
			else if(weatherDesTest == "小雨"){
				this.$set(this.showWeatherFlagList,2,true)
				this.showWeatherIndex = 2
			}
			else if(weatherDesTest == "大雨" || weatherDesTest.indexOf("雨")!==-1){
				this.$set(this.showWeatherFlagList,3,true)
				this.showWeatherIndex = 2
			}
			else{
				// 其他情况一律设置为晴天
				this.$set(this.showWeatherFlagList,0,true)
				this.showWeatherIndex = 0
			}
		},
		onShow() {
			let isConfirmProtocal = uni.getStorageSync("isConfirmProtocal");
			this.flag = uni.getStorageSync("flag");
			if(isConfirmProtocal && !this.flag){
				this.login()
			}
			this.avatarUrl =  this.$baseImageUrl + this.userInfo.avatar +"?time="+ new Date().getTime()
			if(this.flag) {
				// 获取用户统计数据
				this.getUserStaticData();
				uni.setStorageSync("isNeedInit",true)
				// 获取用户信息,当用户处于登陆状态
				this.getCurrentUserInfo();
			}
		},
		methods: {
			gotoProticalPage(){
				uni.navigateTo({
					url:"/pages/funpage/protocol-page/protocol-page"
				})
			},
			getUserStaticData() {
				getUserStaticAPI().then((res)=>{
					if(res.code === 200) {
						this.staticData = {
							collectionSize: res.data.collectionSize || 0,
							browsingSize: res.data.browsingSize || 0,
							subscributeSize: res.data.subscributeSize || 0,
							signSize: res.data.signSize || 0,
							myPostSize: res.data.myPostSize || 0
						};
					}
				}).catch(err => {
					console.error('获取统计数据失败:', err);
				});
			},
			getCurrentUserInfo() {
				getCurrentUserInfoAPI("user/getUserInfo?openid="+this.userInfo.openid)
				.then((res)=>{
					if(res.code == 200){
						this.flag = uni.getStorageSync("flag")
						this.userInfo = res.data
						if(!res.cache){
							this.avatarUrl = this.$baseImageUrl + this.userInfo.avatar +"?time="+ new Date().getTime()
						}
						uni.setStorageSync("userInfo",res.data)
						// 从服务器获取到用户已发帖子数据
						this.getPostedData();
					}else if(res.code == -99){
						uni.showToast({
							title: 'token失效，请重新登陆!',
							icon: 'none'
						});
						removeAllStorage()
						this.flag = false
					}
					else{
						uni.showToast({
							title: '服务端错误:'+res.code,
							icon: 'none'
						});
					}
				})
				.catch((err)=>{
					uni.showToast({
						title: err,
						icon: 'none'
					});
				})
			},
			getPostedData() {
				getPostByOpenidAPI(this.userInfo.openid)
				.then((res)=>{
					if(res.code == 200){
						if(!res.cache){
							uni.setStorageSync("postedCache",res.data)
							this.postedDataList = res.data
						}else{
							this.postedDataList = uni.getStorageSync("postedCache")
						}
					}else{
						uni.showToast({
							title: '服务器错误:' + res.errMsg,
							icon: 'none'
						});
					}
				})
			},
			login(){
				let that = this
				if(uni.getStorageSync("isConfirmProtocal")==true){
					uni.showLoading({
						title:"登录中...",
						mask: true
					})
					
					uni.login({
						success(res){
							loginAPI("user/login?code=" + res.code).then((res)=>{
								if(res.code == 200){
									let token = res.data.token
									uni.setStorageSync("token",token)
									uni.setStorageSync("flag",true)
									uni.setStorageSync("userInfo",res.data)
									that.userInfo = res.data
									that.avatarUrl = that.$baseImageUrl + res.data.avatar +"?"+ new Date().getTime()
									that.flag = true;
									// 登录成功后立即获取统计数据
									that.getUserStaticData();
									// 标记登录成功到首页刷新页面
									uni.setStorageSync("login_success_init_index",true)
								}else{
									uni.showModal({
										content:"登陆失败" + res.code,
										showCancel:false
									})
								}
								uni.hideLoading()
							}).catch(err => {
								uni.hideLoading();
								uni.showToast({
									title: '登录失败，请重试',
									icon: 'none'
								});
							});
						},
						fail(err) {
							uni.hideLoading();
							uni.showToast({
								title: '微信登录失败，请重试',
								icon: 'none'
							});
						}
					})
				}else{
					uni.showModal({
						title:"请先阅读使用协议!!!",
						showCancel:false,
						success(e){
							uni.navigateTo({
								url:"/pages/funpage/protocol-page/protocol-page"
							})
						}
					})
				}
			}
		}
	}
</script>

<style scoped>
.content {
	min-height: 100vh;
	background-color: #f8f9fa;
	position: relative;
	overflow: hidden;
}

.animated-background {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 560rpx;
	overflow: hidden;
}

.gradient-circle {
	position: absolute;
	border-radius: 50%;
	filter: blur(40px);
	opacity: 0.8;
	animation: float 8s infinite ease-in-out;
}

.circle-1 {
	width: 400rpx;
	height: 400rpx;
	background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
	top: -100rpx;
	left: -100rpx;
	animation-delay: 0s;
}

.circle-2 {
	width: 500rpx;
	height: 500rpx;
	background: linear-gradient(45deg, #0ba360 0%, #3cba92 100%);
	top: -150rpx;
	right: -150rpx;
	animation-delay: -2s;
}

.circle-3 {
	width: 300rpx;
	height: 300rpx;
	background: linear-gradient(45deg, #13547a 0%, #80d0c7 100%);
	top: 100rpx;
	left: 50%;
	transform: translateX(-50%);
	animation-delay: -4s;
}

.overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(5px);
}

@keyframes float {
	0%, 100% {
		transform: translateY(0) scale(1);
	}
	50% {
		transform: translateY(-20px) scale(1.05);
	}
}

.body {
	width: 100%;
	height: 460rpx;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	position: relative;
	z-index: 1;
}

.welcome-text {
	font-size: 56rpx;
	color: #ffffff;
	font-weight: bold;
	margin-bottom: 20rpx;
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
	letter-spacing: 4rpx;
}

.login-desc {
	font-size: 32rpx;
	color: rgba(255, 255, 255, 0.9);
	margin-bottom: 80rpx;
	letter-spacing: 2rpx;
}

.login-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 600rpx;
	height: 88rpx;
	background: rgba(255, 255, 255, 0.95);
	border-radius: 44rpx;
	border: none;
	backdrop-filter: blur(5px);
	box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.1);
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	animation: pulse 2s infinite;
}

@keyframes pulse {
	0% {
		transform: scale(1);
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.1);
	}
	50% {
		transform: scale(1.02);
		box-shadow: 0 12rpx 24rpx rgba(0, 0, 0, 0.15);
	}
	100% {
		transform: scale(1);
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.1);
	}
}

.login-btn:active {
	transform: scale(0.96);
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.login-btn text {
	color: #333;
	font-size: 32rpx;
	font-weight: 500;
	letter-spacing: 2rpx;
}

.fun-box {
	width: 100%;
	background: white;
	margin-top: -60rpx;
	border-radius: 40rpx 40rpx 0 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);
	position: relative;
	z-index: 2;
	padding-bottom: 40rpx;
}

.fun-box .fun-item-title {
	width: 80%;
	text-align: center;
	margin: 40rpx 0;
}

.welcome {
	font-size: 42rpx;
	font-weight: bold;
	color: #333;
	letter-spacing: 2rpx;
}

.fun-box .fun-item {
	width: 80%;
	margin: 20rpx 0;
	padding: 24rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;
	border-bottom: 1px solid #f0f0f0;
	transition: all 0.3s ease;
}

.fun-box .fun-item:active {
	background: #f8f9fa;
}

.fun-box .fun-item button {
	width: 100%;
	height: 100%;
	position: absolute;
	opacity: 0;
	left: 0;
	top: 0;
}

.fun-icon {
	width: 48rpx;
	height: 48rpx;
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
}

.fun-icon.contact {
	background-image: url("../../static/客服 (1).png");
}

.fun-icon.instruction {
	background-image: url("../../static/感叹号.png");
}

.fun-name {
	flex: 1;
	margin: 0 30rpx;
	font-size: 28rpx;
	color: #333;
	display: flex;
	align-items: center;
}

.required {
	color: #ff4d4f;
	margin-left: 8rpx;
	font-size: 24rpx;
}

.fun-icon-arrow {
	width: 36rpx;
	height: 36rpx;
	opacity: 0.3;
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
}
</style>
