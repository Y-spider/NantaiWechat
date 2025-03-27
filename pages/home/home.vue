<template>
	<view>
		<view v-if="!flag" class="content">
			<!-- 自定义的导航栏样式 -->
			<NavigationSelf title="个人中心" boxBg="#595c5f;" :showBack="false"></NavigationSelf>
			<!-- 主体 -->
			<view class="weather-box,weather-heavy-rain" style="position: absolute;  height: 360rpx; width: 100%; display: flex; background-color: #595c5f;">
				<RainCompont style="margin-top: 15rpx;"></RainCompont>
				<RainCompont style="margin-top: 40rpx;"></RainCompont>
				<RainCompont style="margin-top: -50rpx;"></RainCompont>
				<RainCompont style="margin-top: -13rpx;margin-left: -15rpx;"></RainCompont>
				<RainCompont style="margin-top: 27rpx;"></RainCompont>
			</view>
			<view class="body">
				<button @click="login()">微信一键登陆</button>
			</view>
			<!-- 功能选择模块 -->
			<view class="fun-box">
				<view class="fun-item-title">
					<p class="welcome">欢迎新同学</p>
				</view>
				
				<view class="fun-item">
					<button open-type="contact">1</button>
					<view class="fun-icon contact"><text>1</text></view>
					<view class="fun-name">联系客服</view>
					<view class="fun-icon-arrow"><text>1</text></view>
				</view>
				<!-- <view class="fun-item">
					<button @click="about()">1</button>
					<view class="fun-icon about"><text>1</text></view>
					<view class="fun-name">关于微校园</view>
					<view class="fun-icon-arrow"><text>1</text></view>
				</view> -->
				<view class="fun-item">
					<button @click="gotoProticalPage()">1</button>
					<view class="fun-icon instruction" ><text>1</text></view>
					<view class="fun-name">使用协议<text style="color: #e70000;">(必读)</text></view>
					<view class="fun-icon-arrow"><text>1</text></view>
				</view>
			</view>
		</view>
		<!-- 个人中心页面 -->
		<veiw v-else>
			<HomeSuccessPage 
			:userInfo="userInfo" 
			:avatarUrl="avatarUrl" 
			:postedDataList="postedDataList" 
			:showWeatherFlagList="showWeatherFlagList"
			:showWeatherBackground="showWeatherBackground"
			:showWeatherIndex="showWeatherIndex"
			:staticData="staticData"
			></HomeSuccessPage>
		</veiw>
	</view>
</template>

<script>
	import HomeSuccessPage from '../home-success/home-success.vue'
	import NavigationSelf from "../common-components/head/head.vue"
	import {loginAPI,getCurrentUserInfoAPI,getUserStaticAPI} from "../../api/HomeApi.js"
	import  RainCompont from "../common-components/rain/rain.vue"
	import {showErr,removeAllStorage} from "../../common/common-js.js"
	import {getPostByOpenidAPI} from "../../api/PostApi.js"
	export default {
		components:{
			HomeSuccessPage,
			NavigationSelf,
			RainCompont
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
			getUserStaticAPI().then((res)=>{
				this.staticData = res.data
			})
			uni.setStorageSync("isNeedInit",true)
			this.flag = uni.getStorageSync("flag")
			// 获取用户信息,当用户处于登陆状态
			if(this.flag){
				getCurrentUserInfoAPI("user/getUserInfo?openid="+this.userInfo.openid)
				.then((res)=>{
					if(res.code == 200){
						this.flag = uni.getStorageSync("flag")
						this.userInfo = res.data
						if(!res.cache){
							// 如果用户信息不是来自缓存时再进行头像请求，不然会一直出现闪烁状况
							this.avatarUrl = this.$baseImageUrl + this.userInfo.avatar +"?"+ new Date().getTime()
						}
						uni.setStorageSync("userInfo",res.data)
						// 从服务器获取到用户已发帖子数据，再根据是否为缓存，如若不是则将数据存入本地缓存
						getPostByOpenidAPI(this.userInfo.openid)
						.then((res)=>{
							if(res.code == 200){
								if(!res.cache){
									// 表示数据来不是来自缓存(则需进行处理保存在本地缓存中)
									uni.setStorageSync("postedCache",res.data)
									this.postedDataList = res.data
								}else{
									this.postedDataList = uni.getStorageSync("postedCache")
								}
							}else{
								showErr("服务器错误",res.errMsg)
							}
						})
					}else if(res.code == -99){
						showErr("token失效，请重新登陆!")
						removeAllStorage()
						this.flag = false
					}
					else{
						showErr("服务端错误:"+res.code)
					}
				})
				.catch((err)=>{
					showErr(err)
				})
			}
		},
		methods: {
			gotoProticalPage(){
				uni.navigateTo({
					url:"/pages/funpage/protocol-page/protocol-page"
				})
			},
			login(){
				let that = this
				if(uni.getStorageSync("isConfirmProtocal")==true){
					uni.showLoading({
						title:"登录中"
					})
					
					uni.login({
						success(res){
							loginAPI("user/login?code=" + res.code).then((res)=>{
								// 判断返回结果，将openid和token存储在本地
								if(res.code == 200){
									let token = res.data.token
									uni.setStorageSync("token",token)
									uni.setStorageSync("flag",true)
									uni.setStorageSync("userInfo",res.data)
									that.userInfo = res.data
									console.log("res.data.avatar",res.data.avatar)
									that.avatarUrl = that.$baseImageUrl + res.data.avatar +"?"+ new Date().getTime()
									that.flag = true;
								}else{
									uni.showModal({
										content:"登陆失败" + res.code,
										showCancel:false
									})
								}
								uni.hideLoading()
							});
						}
					})
				}else{
					// 表示还未同意协议
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
	.body{
		width: 100%;
		height: 460rpx;	
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		background-color:  #595c5f;;
	}
	.body button{
		color:#93D2F3 ;
		border-radius: 44rpx;
		/* background-color:#93D2F3 ; */
		margin: 15rpx;
	}
	.fun-box{
		width: 100%;
		background: white;
		margin-top: -60rpx;
		border-radius: 70rpx 70rpx 0rpx 0rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-shadow: 2px 2px 5px 0px white;
	}
	.fun-box .fun-item-title,.fun-item{
		width: 80%;
		text-align: center;
		margin: 30rpx 0;
		padding: 6rpx 0;
		
	}
	.fun-box .fun-item{
		margin: 32rpx;
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
	
</style>
