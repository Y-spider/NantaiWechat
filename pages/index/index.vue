<template>
	<view>
		<z-paging ref="paging" v-model="postDataList" @query="init">
		<NavigationSelf slot="top" boxBg="#2f4052" :showBack="false" title="首页"></NavigationSelf>
		<view @click="showNotice" slot="top" class="head-box-item,notice-box" style="background-color: #2f4052;height: 36rpx;">
			<image src="../../static/公告.png"></image>
			<view class="swiper-box" style="background-color: #2f4052;">
				<swiper autoplay :interval="swiperConfig.interval" :disable-touch="true" :duration="swiperConfig.duration" circular style="height: 40rpx;">
					<swiper-item v-for="(notice,index) in noticeList" :key="notice">{{index+1}}.{{notice.content}}</swiper-item>
				</swiper>
			</view>
		</view>
		<uni-search-bar cancelButton="none" slot="top" @confirm="search" placeholder="请输入帖子标题" v-model="searchTitle"
						@clear="clear">
		</uni-search-bar>
		<x-skeleton type="banner" :loading="loading" >
		   <view class="head-box" style="background-color: #2f4052;">
		   	<view class="head-box-item circle-image-box" style="background-color: #2f4052;">
		   		<swiper class="circle-imgae-swiper" autoplay :duration="swiperConfig.duration" circular :interval="swiperConfig.interval" indicator-dots="true">
		   			<swiper-item>
		   				<view class="weather-box">
		   					<view class="weather-card" :class="changebackground">
		   						<view class="weather-card-date-info">
		   							<view style="font-size: large;">{{dateOfWeek}}</view>
		   							<view style="font-size: 24rpx; margin-top: 5rpx;">{{todayWeather.time}}</view>
		   							<view style="font-size: 28rpx; margin-top: 10rpx;">海陵区</view>
		   						</view>
		   						<view class="weather-card-weather-info">
		   							<view class="weather-icon">
		   								<image :src="weatherSvgUrl[0]"></image>
		   							</view>
		   							<view class="weather-tem" style="font-size: larger;">{{todayWeather.now.temp!=undefined?todayWeather.now.temp:"xx"}}&#8451;</view>
		   							<view class="weather-text">{{todayWeather.now.text!=undefined?todayWeather.now.text:"晴天"}}</view>
		   						</view>
		   					</view>
		   					<view class="futher-weather-card">
		   						<view class="today-other-weather-info">
		   							<view class="today-other-weather-info-item,precip">
		   								<text>降水量</text>
		   								<text>{{handledPrecip}}%</text>
		   							</view>
		   							<view class="today-other-weather-info-item,humidity">
		   								<text>相对湿度</text>
		   								<text>{{todayWeather.now.humidity!=undefined?todayWeather.now.humidity:0}}%</text>
		   							</view>
		   							<view class="today-other-weather-info-item,windSpeed">
		   								<text>风速</text>
		   								<text>{{(todayWeather.now.windSpeed!=undefined?todayWeather.now.windSpeed:0)}}km/h</text>
		   							</view>
		   						</view>
		   						<view class="further-weather-box">
		   							<view class="further-weather-item">
		   								<view  class="icon-day">
		   									<image :src="weatherSvgUrl[1]"></image>
		   								</view>
		   								<view>今天</view>
		   								<view style="font-size: 20rpx;">
		   							{{futherThreeDayWeather.daily[0].tempMax !== undefined ? futherThreeDayWeather.daily[0].tempMax : 'xx'}}&#8451;/{{futherThreeDayWeather.daily[0].tempMin !== undefined ? futherThreeDayWeather.daily[0].tempMin : 'xx'}}&#8451;
		   								</view>
		   							</view>
		   							<view class="further-weather-item">
		   								<view class="icon-day">
		   									<image :src="weatherSvgUrl[2]"></image>
		   								</view>
		   								<view>明天</view>
		   								<view style="font-size: 20rpx;">
		   								{{futherThreeDayWeather.daily[1].tempMax !== undefined ? futherThreeDayWeather.daily[1].tempMax : 'xx'}}&#8451;/{{futherThreeDayWeather.daily[1].tempMin !== undefined ? futherThreeDayWeather.daily[1].tempMin : 'xx'}}&#8451;
		   								</view>
		   							</view>
		   							<view class="further-weather-item">
		   								<view class="icon-day">
		   									<image :src="weatherSvgUrl[3]"></image>
		   								</view>
		   								<view style="font-size: 20rpx;">后天</view>
		   								<view style="font-size: 20rpx;">
		   								{{futherThreeDayWeather.daily[2].tempMax !== undefined ? futherThreeDayWeather.daily[2].tempMax : 'xx'}}&#8451;/{{futherThreeDayWeather.daily[2].tempMin !== undefined ? futherThreeDayWeather.daily[2].tempMin : 'xx'}}&#8451;
		   								</view>
		   							</view>
		   						</view>
		   					</view>
		   				</view>
		   			</swiper-item>
		   			<swiper-item v-for="(swiper,index) in swiperList" :key="index">
		   				<image :src="baseSwiperImageUrl + swiper.url + '?tiem='+new Date().getTime()" @click="showImage(index)"></image>
		   			</swiper-item>
		   		</swiper>
		   	</view>
		   </view>	
		</x-skeleton>
		<x-skeleton type="list" :loading="loading" :configs="{gridRows:5}">
		<view class="body-box">
			<swiper class="body-box-swiper">
				<swiper-item>
					<view class="fun-box">
						<view  class="fun-item" v-for="(item,index) in funList" :key="index">
							<view class="fun-item-icon" @click="gotoTheTypePage(item.des)">
								<image :src="item.icon"></image>
							</view>
							<view class="fun-item-des" style="font-size: small;">{{item.des}}</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="all-text">
			<view class="line-box"></view>
			<view class="title-text">全部</view>
		</view>
		<view class="post-item-box">
			<view class="post-item" v-for="(post,index) in postDataList" :key="index">
				<view class="post-item-base-info" @click="gotoDetailPage(index)">
					<view class="post-item-name" style="width: 40%;"><text style="text-align: left; width: 100%;">{{post.name}}</text></view>
					<view class="post-item-type">{{post.type}}</view>
					<view class="post-item-type" style="color: #ff0000; background-color: #ffffff;" v-if="post.type==='二手闲置'">{{post.price}} 元</view>
					<view v-if="post.isTop" class="post-item-top" :class="state">已置顶</view>
					<view class="pots-item-avatar">
						<image :src="baseAvatarUrl + post.avatar +'?time='+ new Date().getTime()"></image>
					</view>
				</view>
				<view class="post-item-title-box" @click="gotoDetailPage(index)">
					<view class="post-item-title">
						<text class="post-title-text">{{post.title}}</text>
						<view v-if="post.imageCount != 0" class="post-item-iamge-info-box">
							<image src="../../static/图片.png"></image>
							<view class="image-number" style="color: #1296db;">{{post.imageCount}}张图片</view>
						</view>
					</view>
					
				</view>
				<view class="post-item-other-info-box" style="justify-content: space-between;">
					<view class="other-info-time" style="width: 30%; margin-left: 30rpx;">{{post.createTime}}</view>
					<view style="width: 28%; display: flex;justify-content: space-around;">
						<view class="other-info-look">
							<image src="../../static/浏览.png"></image>
							<text>{{post.lookCount}}</text>
						</view>
						<view class="other-info-comment">
							<image src="../../static/评论.png"></image>
							<text>{{post.commentCount}}</text>
						</view>
						<view class="other-info-like" @click="clickLike(index)">
							<image v-if="currentUserLikePostFlag[index]==false" src="../../static/赞.png"></image>
							<image v-else src="../../static/赞 (1).png"></image>
							<text>{{post.likeCount}}</text>
						</view>
					</view>
				</view>
			</view>
		<view v-if="!isLogin" style="display: flex; justify-content: center; align-items: center; margin-top: 30rpx;">
			<text style="color: lightgray; font-size: small;">请先登录!!!</text>
		</view>	
		</view>
		</x-skeleton>
		</z-paging>
	</view>
</template>

<script>
	import NavigationSelf from "../common-components/head/head.vue"
	import {getWeatherAPI,getFutherWeatherAPI,getPageListAPI,getUserLikeOrCollectionAPI,getNoticeAPI} from "../../api/IndexApi.js"
	import {postBatchUpdateAPI,getPostStateByPostIdAPI,addPostLookHotAPI,addBroswingHistoryAPI} from "../../api/PostApi.js"
	import {handleTime, showErr, showSuccess} from "../../common/common-js.js"
	import StateComponent from "../common-components/stateComponent/stateComponent.vue"
	import {getSystemConfigAPI} from "../../api/systemConfigApi.js"
	import {listSwiperImageWithPageAPI} from "../../api/swiperImageApi.js"
	export default {
		components:{
			NavigationSelf,
			StateComponent	
		},
		data() {
			return {
				title: 'Hello',
				state:"isShow",
				noticeList:[],
				swiperList:[],
				swiperConfig:{
					interval:4500,
					duration:2500,
					showSwiperCount:5 // 默认值
				},
				funList:[
					{"icon":"../../static/二手闲置.png","des":"二手闲置"},
					{"icon":"../../static/求问求帮.png","des":"求问求帮"},
					{"icon":"../../static/兼职.png","des":"兼职招聘"},
					{"icon":"../../static/寻人寻物.png","des":"寻人寻物"},
					{"icon":"../../static/校园交友.png","des":"校园交友"},
					{"icon":"../../static/学习交流.png","des":"学习交流"},
					{"icon":"../../static/共享资源.png","des":"共享资源"},
					{"icon":"../../static/热门帖子.png","des":"热门帖子"},
					],
					futherThreeDayWeather:{}, // 未来三天天气预测信息
					todayWeather:{},  // 当前天气，服务器端为10分钟更新一次
					changebackground:"isNight", // 根据当前时间来更换背景颜色 18.00之前为白天，之后为晚上
					weatherSvgUrl:["../../static/svg/100-fill.svg","../../static/svg/100-fill.svg","../../static/svg/100-fill.svg","../../static/svg/100-fill.svg"],  // 请求服务器中指定的天气svg的url
					handledPrecip:0.00,
					dateOfWeek:"星期三",
					postDataList:[],
					baseAvatarUrl:this.$baseImageUrl,
					baseSwiperImageUrl:this.$baseSwiperImageUrl,
					pageIndex:1,
					pageSize:10,
					isListAllPost:false,
					likeOrCollectionOfUser:[],
					copyLikeOrCollectionOfUser:[],
					updatePostListIndex:[],  //记录那些需要更新帖子的下标
					currentUserLikePostFlag:[], // 标识那些post的点赞是有效的，初始都为flase
					isGotoPostDetailPage:false,
					postDetailPageIndex:-1,
					isLogin:false,
					searchTitle:"",
					loading:true,
					
			}
		},
		onShow(){
			// 有30%的概率可以刷新出现公告
			let precent = Math.floor(Math.random()*100)
			if(precent <= 10){
				this.showNotice()
			}
		},
		onReachBottom(){
			// 当上滑到底部时触发，主要用于上滑刷新
			if(!this.isListAllPost){
				this.pageIndex += 1
				getPageListAPI(this.pageIndex,this.pageSize)
				.then((res)=>{
					// 对res.data进行处理
					for(let i = 0;i < res.data.length;i++){
						res.data[i].createTime = handleTime(res.data[i].createTime)
					}
				let oldIndexOfPostDataList = this.postDataList.length
				this.postDataList = [...this.postDataList,...res.data]
				for(let i = oldIndexOfPostDataList;i < this.postDataList.length;i++){
					this.checkPostIsMyLike(i)
				}
				if(res.data.length < this.pageSize){
					// 表示数据库已经获取到最后了
					this.isListAllPost = true
				}
				})
			}
			
		},
		onLoad(){
			uni.setStorageSync("isNeedInit",true)
			this.init(1,this.pageSize)
			this.postDetailPageIndex = -1
			this.isGotoPostDetailPage = false
		},
	
		onHide(){
			// 对需要访问数据库的一些操作可以在这里进行，对操作结果没有太大的要求（也有可能会失败，由于后端接口）
			// 比如对帖子的点赞(目前好像也就只有这个...)
			// 构建需要更新的数据
			let updatePostList = []
			let userInfo = uni.getStorageSync("userInfo")
			for(let i = 0;i < this.updatePostListIndex.length;i++){
				let index = this.updatePostListIndex[i]
				if(this.currentUserLikePostFlag[index] == false){
					// 说明是需要删除的点赞，那么就需要给后端传递likeOrCollection记录的id，而该id可以再copyxxx中获得
					for(let k = 0;k < this.copyLikeOrCollectionOfUser.length;k++){
						if(this.copyLikeOrCollectionOfUser[k].postId == this.postDataList[index].id){
							// 这就是目标
							updatePostList[i] = {
								id:this.postDataList[index].id,
								likeCount:this.postDataList[index].likeCount,
								requestType:"like-no",
								openid:userInfo.openid,
								likeOrCollectionId:this.copyLikeOrCollectionOfUser[k].id
							}
							break
						}
					}
				}else{
					updatePostList[i] = {
						id:this.postDataList[index].id,
						likeCount:this.postDataList[index].likeCount,
						requestType:"like-yes",
						openid:userInfo.openid,
					}
				}
			}
			// 判断是否是进入详情页面
			if(this.isGotoPostDetailPage){
				// 构造更新对象
				updatePostList[updatePostList.length] = 
				{
					id:this.postDataList[this.postDetailPageIndex].id,
					lookCount:this.postDataList[this.postDetailPageIndex].lookCount + 1,
					requestType:"default"
				}
			}
			// 开始上传
			if(updatePostList.length!=0){
				postBatchUpdateAPI(updatePostList)
				.catch((err)=>{
					showErr("发送错误"+err)
				})
			}
			this.copyLikeOrCollectionOfUser = []
			this.updatePostListIndex = []
		},
		methods: {
			showNotice() {
			    // 展示公告信息
			    let noticeContent = "";
			    for (let i = 0; i < this.noticeList.length; i++) {
			        let notice = this.noticeList[i];
			        noticeContent += (i + 1) + ". " + notice.content + "\n"; // 使用 \n 换行
			    }
			    uni.showModal({
					title:"公告",
			        content: noticeContent,
			        showCancel: false,
			        confirmText: "我知道了",
			        confirmColor: "#4884fd"
			    });
			},
			clear(){
				this.searchTitle = ""
			},
			gotoTheTypePage(typeDes){
				// typeDes表示对选择功能的描述
				if(typeDes == "优质商家"){
					showErr("功能暂未开放")
					return;
				}
				else if(typeDes == '共享资源'){
					// 跳转到共享资源页面
					uni.navigateTo({
						url:"/pages/funpage/open-resource-page/open-resource-page"
					})
					return;
				}
				uni.navigateTo({
					url:"/pages/funpage/post-page-of-type/post-page-of-type?type=" + typeDes
				})
			},
			checkPostIsMyLike(index){
				// 获取当前的帖子我是否已经点赞
				let that = this
				for(let i = 0;i < this.likeOrCollectionOfUser.length;i++){
					if(this.likeOrCollectionOfUser[i].isLike && this.likeOrCollectionOfUser[i].postId==this.postDataList[index].id && this.likeOrCollectionOfUser[i].commentId == null){
						// 表示当前用户当前帖子的点赞状态
						// 并且讲该条记录进行删除，为了下一次不做无效的检验
						this.likeOrCollectionOfUser.splice(i,1)
						this.currentUserLikePostFlag[index] = true
						return;
					}
				}
				this.currentUserLikePostFlag[index] = false
			},
			clickLike(index){
				if(this.currentUserLikePostFlag[index]){
					// 说明当前是取消点赞
					this.postDataList[index].likeCount-=1
					this.currentUserLikePostFlag[index] = false
				}else{
					// 表示是新增点赞
					this.postDataList[index].likeCount+=1
					this.currentUserLikePostFlag[index] = true
				}
				let aimIndex = this.updatePostListIndex.indexOf(index)
				if(aimIndex == -1){
					// 表示在数组中没有这个值，那就增加，如果有那就删除，最后留下来的就是需要更新帖子的下标
					this.updatePostListIndex[this.updatePostListIndex.length] = index
				}
				else{
					// 删除
					this.updatePostListIndex.splice(aimIndex,1)
				}
			},
			flush(){
				// 刷新当前页面,包括刷新天气信息
				this.postDataList = []
				this.isListAllPost = false
				this.pageIndex = 1
				uni.showLoading({
					mask:true,
					title:"加载中..."
				})
				// 获取天气信息
				setTimeout(()=>{
					this.init(this.pageIndex,this.pageSize)
					// showSuccess("刷新成功")
					uni.hideLoading()
				},1000)
				
				
			},
			async init(pageIndex,pageSize){
				this.isLogin = uni.getStorageSync("flag")
				// 发起请求获取公告信息,这里100条其实远远足够了，因为不会有这么多的公告同时存在
				let res = await getNoticeAPI(1,100,1)
				if(res.code == 200){
					this.noticeList = res.data.pageDataList
				}
				// 获取轮播图配置信息
				let systemConfigRes = await getSystemConfigAPI()
				if(res.code == 200){
					this.swiperConfig.interval = systemConfigRes.data?.interval
					this.swiperConfig.duration = systemConfigRes.data?.duration
					this.swiperConfig.showSwiperCount = systemConfigRes.data?.swiperShowCount
				}
				// 获取轮播图信息 这里的请求参数只需要输入pageSize即可，默认只取第一页
				let swiperImageRes = await listSwiperImageWithPageAPI(this.swiperConfig.showSwiperCount)
				if(swiperImageRes.code == 200){
					this.swiperList = swiperImageRes.data.pageDataList
				}
				// 获取用户点赞和收藏信息
				if(uni.getStorageSync("flag")==true){
					// 当前账户处于登录状态，访问后端，获取用户点赞和收藏信息
					this.loading  = true
					getUserLikeOrCollectionAPI(uni.getStorageSync("userInfo").openid)
					.then((res)=>{
						if(res.code == 200){
							// 获取成功
							this.likeOrCollectionOfUser = res.data
							Object.assign(this.copyLikeOrCollectionOfUser,res.data)
						}else{
							showErr("发送请求错误",res.code)
						}
						getPageListAPI(pageIndex,pageSize)
						.then((res)=>{
							// 对res.data进行处理
							if(res.data.length < this.pageSize){
								this.isListAllPost = true
							}
							for(let i = 0;i < res.data.length;i++){
								res.data[i].createTime = handleTime(res.data[i].createTime)
							}
							let oldIndexOfPostDataList = this.postDataList.length
							// this.postDataList = [...this.postDataList,...res.data]
							for(let i = oldIndexOfPostDataList;i < this.postDataList.length;i++){
								this.checkPostIsMyLike(i)
							}
							this.$refs.paging.complete(res.data);
						})
					})
					.catch((err)=>{
						showErr("请求错误",err)
					})
				}
				else{
					// 没有登录状态
					this.postDataList = []
					this.loading = false
					this.$refs.paging.complete([]);
				}
				// 动态获取当前日期
				this.getDateOfWeek()
				// 判断当前时间，修改天气展示背景颜色
				let now = new Date();
				let nowHour = now.getHours();
				if(nowHour >= 18 && nowHour <= 20 ){
					this.changebackground = "isBeforeNight"
				}else if(nowHour >= 21 || nowHour <= 5){
					this.changebackground = "isNight"
				}
				else if(nowHour >= 6 && nowHour <= 10){
					this.changebackground = "isMorning"
				}else{
					this.changebackground = "isDay"
				};
				
				// 获取当前天气信息，10分钟更新一次
				const base = this.$baseImageUrl+"weatherSvg/"
				getWeatherAPI("common/getWeather").then((res)=>{
					if(res.code == "200"){
						this.todayWeather = res.data
						this.handledPrecip = ((this.todayWeather.now.precip)*100).toFixed(2)
						this.weatherSvgUrl[0] = base+res.data.now.icon+"-fill.svg"
						uni.setStorageSync("weatherText",res.data.now.text)
					}else{
						this.weatherSvgUrl[0] = "../../static/svg/100-fill.svg"
						uni.showModal({
							title:"系统错误",
							content:res.errMsg,
							showCancel:false
						})
					}
					this.loading  = false
				}).catch((err)=>{
					uni.showModal({
						title:"系统错误",
						content:err.errMsg,
						showCancel:false
					})
				});
				
				// 获取未来三天的天气预测信息(包含当天的哦)
				getFutherWeatherAPI("common/getFurtherWeather").then((res)=>{
					if(res.code == "200"){
						// 访问成功
						this.futherThreeDayWeather = res.data
						if(nowHour >= 6 && nowHour <= 17){
							this.weatherSvgUrl[1] = base + res.data.daily[0].iconDay+"-fill.svg"
							this.weatherSvgUrl[2] = base + res.data.daily[1].iconDay+"-fill.svg"
							this.weatherSvgUrl[3] = base + res.data.daily[2].iconDay+"-fill.svg"
						}else{
							this.weatherSvgUrl[1] = base + res.data.daily[0].iconNight+"-fill.svg"
							this.weatherSvgUrl[2] = base + res.data.daily[1].iconNight+"-fill.svg"
							this.weatherSvgUrl[3] = base + res.data.daily[2].iconNight+"-fill.svg"
						}
					}
				}).catch((err)=>{
					uni.showModal({
						title:"系统错误",
						content:err.errMsg,
						showCancel:false
					})
				});
				
			},
			getDateOfWeek(){
				// 获取当前日期
				let now = new Date()
				switch(now.getDay()){
					case 0: this.dateOfWeek = "星期天"; break;
					case 1: this.dateOfWeek = "星期一"; break;
					case 2: this.dateOfWeek = "星期二"; break;
					case 3: this.dateOfWeek = "星期三"; break;
					case 4: this.dateOfWeek = "星期四"; break;
					case 5: this.dateOfWeek = "星期五"; break;
					case 6: this.dateOfWeek = "星期六"; break;
				}
				
			},
			search(){
				const userInfo = uni.getStorageSync("userInfo")
				if(!userInfo){
					uni.showModal({
						content:"请先登录!是否跳转到登陆页面?",
						success(confirm){
							if(!confirm.cancel){
								uni.switchTab({
									url:'/pages/home/home'
								})
							}
						}
					})
				}
				else{
					uni.navigateTo({
						url:`/pages/funpage/post-page-of-type/post-page-of-type?type=搜索:${this.searchTitle}&content=${this.searchTitle}`
					})
				}
				
			},
			showImage(index){
				uni.previewImage({
					urls:[this.baseSwiperImageUrl + this.swiperList[index].url + '?time='+new Date().getTime()]
				})
			},
			// 跳转到post详情页面
			gotoDetailPage(index){
				this.isGotoPostDetailPage = true
				this.postDetailPageIndex = index
				// 将对应数据json对象转换为json格式的字符串，通过路径参数传递给详细信息页面
				// 访问数据库，查看当前帖子状态
				addPostLookHotAPI({id:this.postDataList[index].id})
				addBroswingHistoryAPI({postId:this.postDataList[index].id})
				getPostStateByPostIdAPI(this.postDataList[index].id)
				.then((res)=>{
					if(res.code == 200){
						uni.navigateTo({
							url:"/pages/funpage/post-detail/post-detail?postId="+ this.postDataList[index].id
						})
					}else if(res.code == 222){
						uni.showModal({
							content:"帖子已经被删除"
						})
					}
					else if(res.code == 333){
						uni.showModal({
							content:"帖子已下架"
						})
					}
					else{
						showErr("发送错误",res.errMsg)
					}
				})
				.catch((err)=>{
					showErr("请求失败"+err)
				})
			}
		}
	}
</script>

<style scoped>
	*{margin: 0; padding: 0; box-sizing: border-box;overflow: hidden;}
	.isShow{
		visibility:visible;
	}
	.isHiddle{
		visibility: hidden;
	}
	.head-box{
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.head-box-item{
		/* margin-top: 3rpx; */
		width: 100%;
		display: flex;
		box-shadow: 0rpx 5rpx 2rpx lightgray;
		background-color: #2f4052;
	}
	.notice-box image{
		width: 36rpx;
		height: 36rpx;
		margin-left: 10rpx;
	}
	.swiper-box{
		width: 100%;
		height: 40rpx;
		margin-left: 5rpx;
		color: white;
		font-size: small;
		/* background-color: aliceblue; */
	}
	.circle-image-box,.circle-imgae-swiper{
		width: 100%;
		/* margin-top: 3rpx; */
		border-radius: 10rpx;
		height: 400rpx;
		box-shadow: 0rpx 5rpx 2rpx lightgray;
	}
	.circle-imgae-swiper image,.weather-box{
		width: 100%;
		border-radius: 10rpx;
		height: 400rpx;
	}
	.weather-box{
		color: white;
		background-color: #2f4052;
		display: flex;
		align-items: center;
		z-index: 100;
		font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
	}
	.weather-card{
		height: 90%;	
		width: 40%;
		z-index: 200;
		border-radius: 15rpx;
		margin: 0 30rpx;
		padding: 15rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	/* 黄昏 18-20 */
	.isBeforeNight{ 
		background:linear-gradient(to bottom,#b2b9be,#2f4052);
	}
	/* 夜晚 21-5 */
	.isNight{
		background:linear-gradient(to bottom,#595c5f,#2f4052);
	}
	/* 早上 6-10 */
	.isMorning{
		background:linear-gradient(to bottom,#1f2e4b,#6190e8);
	}
	/* 白天 11-18 */
	.isDay{
		background:linear-gradient(to bottom,#6190e8,#a7bfe8);
	}
	.weather-icon image{
		width: 56rpx;
		height: 56rpx;
	}
	.weather-card-weather-info{
		display: flex;
		justify-content: space-between;
	}
	.futher-weather-card{	
		width: 55%;
		height: 95%;
		background-color: #222831;
		margin-left: -80rpx;
		z-index: 150;
		border-radius: 15rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
	}
	.today-other-weather-info{
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		width: 70%;
		height: 40%;
		margin-left: 80rpx;
	}
	.today-other-weather-info-item{
		display: flex;
		justify-content: space-between;	
		font-size: small;
		color: #DFE0E1;
	}
	.further-weather-box{
		width: 70%;
		height: 50%;
		display: flex;
		margin-left: 80rpx;
		color: #DFE0E1;
	}
	.further-weather-item{
		font-size: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: 0rpx 12rpx;
		
	}
	.further-weather-item image{
		width: 36rpx;
		height: 36rpx;
	}
	
	.body-box-swiper{
		width: 100%;
		margin-top: 15rpx;
		height: 360rpx;
		border-radius: 15rpx;
		box-shadow: 0rpx 5rpx 2rpx lightgray;
	}
	.body-box-swiper .fun-box{
		width: 100%;
		height: 320rpx;
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		
	}
	.fun-item{
		width: 140rpx;
		height: 140rpx;
		background-color: white;
		margin: 15rpx;
		border-radius: 15rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;	
		padding: 5rpx;
	}
	.fun-item image{
		width: 65rpx;
		height: 65rpx;
	}
	.all-text{
		margin: 12rpx 3rpx;
		font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
		font-size: large;
		font-weight: bold;
		display: flex;
	}
	.line-box{
		width: 12rpx;
		height: 60rpx;
		margin-top: 10rpx;
		border-radius: 15rpx;
		background-color: #ff9c11;
	}
	.post-item-box{
		width: 100%;
		display: flex;
		flex-direction: column;
		margin-top: 12rpx;
	}
	.post-item{
		width: 100%;
		min-height: 220rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		margin: 30rpx 0rpx;
		border: 1rpx solid lightgray;
		box-shadow: 0rpx 5rpx 2rpx lightgray;
	}
	.post-item-base-info{
		display: flex;
		justify-content: space-around;
		align-items: center;
		font-size: small;
		border-bottom: 1rpx dashed lightgray;
	}
	.post-item-base-info image{
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		margin-top: -50%;
		background-color: #1f2e4b;
	}
	.post-item-type,.post-item-top{
		border-radius: 15rpx;
		background-color: #b95c00;
		color: white;
	}
	.post-item-top{
		background-color: #d30000;
	}
	.post-item-title{
		display: flex;
		flex-wrap: wrap;
	}
	.post-item-title-box{
		font-size: small;
		margin: 15rpx 60rpx;
	}
	.post-item-title-box image{
		width: 46rpx;
		height: 46rpx;
	}
	.post-item-iamge-info-box{
		display: flex;
		justify-content: center;
		align-items: center;	
		margin-left: 60rpx;
		font-size: small;
	}
	.post-item-other-info-box{
		margin: 5rpx 0rpx;
		font-size: small;
		color: lightgray;
		display: flex;
		justify-content: space-around;
		position: relative;
		/* bottom: -30rpx; */
	}
	
	.post-item-other-info-box image{
		width: 30rpx;
		height: 30rpx;
	}
	.other-info-look,.other-info-comment,.other-info-like,.post-item-name{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.flush-icon-box,.search-icon-box{
		width: 120rpx;
		height: 120rpx;
		background-color: white;
	}
	.flush-icon,.flush-icon-box,.search-icon-box{
		width: 80rpx;
		height: 80rpx;
		position: fixed;
		top: 88%;
		right: 7%;
		border-radius: 50%;
	}
	.search-icon-box{
		width: 75rpx;
		height: 75rpx;
		top: 80%;
		right: 7%;
		background-color: #1f2e4b ;
	}
	.search-icon{
		width: 80rpx;
		height: 80rpx;
		position: fixed;
		top: 80%;
		right: 7%;
		border-radius: 50%;
	}
	.post-title-text{
		white-space: nowrap;
		width: 50%;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	/deep/ .uni-searchbar{
		background-color:#2f4052 ;
	}
	/deep/ .uni-searchbar__box {
		height: 64rpx !important;
	}
	/deep/ .uni-searchbar__cancel{
		color:#fff;
	}
	
</style>