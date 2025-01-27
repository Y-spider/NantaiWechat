<template>
	<view>
		<NavigationSelf title="签到" bg="#57E30A"></NavigationSelf>
		<!-- 日期显示以及签到情况显示 -->
		<view class="head">
			<view class="singin-info-box">
				<view class="sign-info-item" v-for="date in signinDateList" v-bind:key="date.id">
					<view class="sign-info-item-date-info">
						<view class="day-key">{{date.dayKey}}</view>
						<view class="day-value">{{date.dayValue}}</view>
					</view>
					<view class="sigin-statu-icon">
						<image v-if="date.state=='miss'" src="../../../static/叉.png"></image>
						<image v-if="date.state=='today'" src="../../../static/今天.png"></image>
						<image v-if="date.state=='wait'" src="../../../static/待签到.png"></image>
						<image v-if="date.state=='ok'" src="../../../static/成功.png"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="body">
			<view class="rod-box">
				<view class="rod">
					<view class="nail,nail-left"></view>
					<view class="nail,nail-right"></view>
				</view>
				<view class="chain"></view>
			</view>
			<view class="singin-point-info">
				<view class="box-head">
					<view class="info-box">
						<view v-if="!isSinginTody" class="info-item,info-is-signed-tody">今日还未签到</view>
						<view v-if="isSinginTody" class="info-item,info-is-signed-tody">今日已完成签到</view>
						<veiw class="info-item,info-has-signed-day">本轮已经签到{{hasSignedDay}}天</veiw>
						<view class="info-item,info-now-point">当前积分: {{nowPoint}}</view>
						<view class="info-item,info-signin-rule"> 签到一次获得10积分，连续签到5天额外获得20积分,连续签到7天额外获取50积分 </view>
					</view>
					<view class="circle-box">
						<view class="circle-group,circle-1"></view>
						<view class="circle-group,circle-2"></view>
					</view>
				</view>
				<view class="box-body">
					<view class="button-box">
						<button v-if="!isSinginTody" class="signin-button" @click="signin()" size="mini">签到</button>
						<button class="back-button" @click="back()" size="mini">返回</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import NavigationSelf from "../../common-components/head/head.vue"
	import {backToFrontPage, showErr} from "../../../common/common-js.js"
	import {signinAPI,getSignInInforAPI} from "../../../api/SigninApi.js"
	export default {
		components:{
			NavigationSelf
		},
		data() {
			return {
				signinDateList:[
					{id:1,dayKey:"一",dayValue:6,state:"today"},
					{id:2,dayKey:"二",dayValue:7,state:"wait"},
					{id:3,dayKey:"三",dayValue:8,state:"wait"},
					{id:4,dayKey:"四",dayValue:9,state:"wait"},
					{id:5,dayKey:"五",dayValue:10,state:"wait"},
					{id:6,dayKey:"六",dayValue:11,state:"wait"},
					{id:7,dayKey:"日",dayValue:12,state:"wait"},
					],
					isSinginTody:false,
					hasSignedDay:0,
					nowPoint:0,
					today:0,
					nowStr:new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()
			}
		},
		methods: {
			compareTwoDate(date1,date2){
				// 比较两个时间是否相等,date1和date2的格式为 YYYY-MM-DD
				let year1 = date1.split("-")[0]
				let month1 = date1.split("-")[1]
				let day1 = date1.split("-")[2]
				let year2 = date2.split("-")[0]
				let month2 = date2.split("-")[1]
				let day2 = date2.split("-")[2]
				
				if(parseInt(year1) == parseInt(year2) && parseInt(month1) == parseInt(month2) && parseInt(day1) == parseInt(day2)){
					return true;
				}else{
					return false;
				}
			},
			init(){
				// 获取日期数据
				let now = new Date();
				console.log("initNow",now)
				let signinDateStorage = uni.getStorageSync("signinDateList");
				if(signinDateStorage=="" || now.getDay()==1){
					// 说明用户是第一次进行该签到页面,这个时候需要初始化相关日期数据
					let dayOfWeek = now.getDay();
					if(dayOfWeek == 0)
						dayOfWeek = 7;
					// 修改今天状态
					this.today = dayOfWeek;
					this.signinDateList[dayOfWeek-1].state = "today";
					this.signinDateList[dayOfWeek-1].dayValue = now.getDate();
					for(let i=0;i<dayOfWeek-1;i++){
						// 减去指定的天数，获取之前的日期
						let temp = new Date();
						let subday = dayOfWeek-1-i;
						temp.setDate(temp.getDate()-subday)
						this.signinDateList[i].state="miss";
						this.signinDateList[i].dayValue = temp.getDate();
					};
					for(let i=dayOfWeek,t = 1;i<7;i++,t++){
						// 加上天数，获取后面的日期
						let temp = new Date();
						temp.setDate(temp.getDate()+t);
						this.signinDateList[i].dayValue = temp.getDate();
						this.signinDateList[i].state = "wait";
					}
					// 获取数据库签到信息，再次进行验证(主要是上面要改就太烦了，索性就不改了，直接再进行一次)
					getSignInInforAPI(uni.getStorageSync("userInfo").openid)
					.then((res)=>{
						console.log("res",res)
						if(res.code == 200){
							let today = res.data.today
							let list = res.data.list
							let flag = false
							// 判断今天是否完成签到
							if(res.data.signInTime != null){
								let now = new Date()
								let serverSignInTimeOfYear = res.data.signInTime.split("T")[0].split("-")[0]
								let serverSignInTimeOfMonth = res.data.signInTime.split("T")[0].split("-")[1]
								let serverSignInTimeOfDay = res.data.signInTime.split("T")[0].split("-")[2].split(" ")[0]
								console.log("数据库 yrer="+serverSignInTimeOfYear+" month="+serverSignInTimeOfMonth+"  day"+serverSignInTimeOfDay)
								if(now.getFullYear()==serverSignInTimeOfYear && (now.getMonth()+1)==serverSignInTimeOfMonth&&now.getDate()==serverSignInTimeOfDay){
									flag = true
								}
							}
							if(flag){
								// 表示今天已经完成签到
								this.signinDateList[today-1].state = "ok"
								this.hasSignedDay++
							}else{
								this.signinDateList[today-1].state = "today"
							}
							console.log("list=",list)
							console.log("today=",today)
							for(let i = 0;i<today-1;i++){
								// 表示这是今天之前的签到信息
								list[i]?this.signinDateList[i].state="ok":this.signinDateList[i].state = "miss"
								if(list[i]){this.hasSignedDay++}
							}
							for(let i=today;i<7;i++){
								// 表示这是今天后面的签到信息
								this.signinDateList[i].state = "wait"
							}
							// 将初始化的签到信息存入到本地缓存中
							let singinData = {
								signinDateList:this.signinDateList,
								today:now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate(),
								isSignToday:flag
							}
							this.isSinginTody = flag
							// 获取已经签到的天数
						
							uni.setStorageSync("signinDateList",singinData)
						}else{
							showErr("系统发送错误",res.errMsg)
						}
					}).catch((err)=>{
						showErr("系统",1)
					})
				}
				else{
					// 缓存中有签到信息，根据当前时间，更新缓存
					let now = new Date()
					let dayOfWeek = now.getDay();
					if(dayOfWeek == 0)
						dayOfWeek = 7;
					this.signinDateList = signinDateStorage.signinDateList
					for(let i = 0;i < dayOfWeek-1;i++){
						if(this.signinDateList[i].state == "today" || this.signinDateList[i].state=="wait"){
							// 表示之前的某一次并没有进行签到
							this.signinDateList[i].state = "miss";
						}
					}
					// 将今天的状态修改为今天(之后是wait状态)
					this.signinDateList[dayOfWeek-1].state = "today";
					// 将初始化的签到信息存入到本地缓存中
					let singinData = {
						signinDateList:this.signinDateList,
						today:now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate(),
						isSignToday:false
					}
					uni.setStorageSync("signinDateList",singinData)
				}
			},
			signin(){
				// 发起请求，成功更新缓存
				signinAPI(uni.getStorageSync("userInfo").openid)
				.then((res)=>{
					if(res.code == 200){
						uni.showToast({
							icon:"success",
							title:"签到成功",
							duration:1000	
						})
						if(this.hasSignedDay+1==5){
							this.nowPoint +=30;
							this.hasSignedDay +=1;
						}
						else if(this.hasSignedDay + 1==7){
							this.nowPoint +=60;
							this.hasSignedDay+=1;
						}else{
							let now = new Date()
							this.nowPoint = this.nowPoint+10;
							this.hasSignedDay+=1
						}
						let now = new Date()
						// 更新数据
						let dayOfWeek = new Date().getDay();
						if(dayOfWeek == 0)
							dayOfWeek = 7
						this.signinDateList[dayOfWeek-1].state = "ok"
						let signData = {
							signinDateList:this.signinDateList,
							today:now.getFullYear() + "-"+(now.getMonth()+1)+"-"+now.getDate(),
							isSignToday:true
						}
						// 后端更新成功
						uni.setStorageSync("signinDateList",signData)
						setTimeout(()=>{
							uni.navigateBack()
						},1000)
					}else{
						showErr(res.errMsg)
					}
				})	
			},
			back(){
				backToFrontPage()
			}
		},
	
		onShow(){
			// 获取到缓存中存储的today信息(如果有缓存)
			let storageToday = uni.getStorageSync("signinDateList").today;
			if(storageToday=="" || storageToday==undefined || !this.compareTwoDate(this.nowStr,storageToday)){
				this.init()
				console.log("init成功")
			}else{
				console.log("不进行init")
				// 说明今天已经更新过一次初始化缓存了。就不用频繁更新了，只需要在完成签到时更新缓存即可。
				this.signinDateList = uni.getStorageSync("signinDateList").signinDateList;
			}
			// 获取用户信息，初始化积分信息
			let userInfo = uni.getStorageSync("userInfo")
			this.nowPoint = userInfo.point
			this.isSinginTody = uni.getStorageSync("signinDateList").isSignToday;
			// 初始化签到天数信息
			for(let i = 0;i<7;i++){
				let info = this.signinDateList[i]
				if(info.state == 'ok'){
					this.hasSignedDay+=1
				}
			}
		}
	}
</script>

<style scoped>
	.singin-info-box,.head{
		width: 100%;
		background-color: #2f4052;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}
	.singin-info-box{
		width: 85%;
		
	}
	.sign-info-item{
		width: 80rpx;
		height: 80%;
		margin: 0rpx 15rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.sign-info-item-date-info{
		color: white;
		font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 36rpx;
	}
	.sign-info-item-date-info .day-key{
		
	}
	.sigin-statu-icon image{
		margin-top: 5rpx;
		width: 30rpx;
		height: 30rpx;
	}
	.body{
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #2f4052;
	}
	.rod-box{
		width: 85%;
		height: 100rpx;
		/* border-top: 3rpx solid gray; */
		margin-top: 30rpx;
	}
	.rod{
		width: 100%;
		height: 15rpx;
		background:linear-gradient(to right,#98A7C8,#bc95c6);
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
	}
	.nail{
		width: 30rpx;
		height: 30rpx;
		background-color: lightblue;
		border-radius: 50%;
	}
	.nail-left{
		margin-left: -10rpx;
		background-color: #98A7C8;
	}
	.nail-right{
		margin-right: -10rpx;
		background-color: #bc95c6;	
	}
	.chain{
		width: 96%;
		height: 85rpx;
		border-left: 15rpx solid #98A7C8;
		border-right: 15rpx solid #bc95c6;
	}	
	.singin-point-info{
		width: 100%;
		height: 1000rpx;
		background-color: white;
		display: flex;
		border:none;
		flex-direction: column;
	}
	.box-head{
		width: 100%;
		height: 60%;
		background: linear-gradient(#98A7C8,#bc95c6);
		display: flex;
		flex-direction: column;
	}
	.circle-box{
		width: 100%;
		height: 100rpx;
		display: flex;
		margin-bottom: -50rpx;
		
	}
	.circle-group{
		width: 60%;
		height: 100rpx;
		background-color: white;
		border-radius: 75%;
		overflow-x: hidden;
	}
	.circle-1{
		background-color: #bc95c6;
		margin-left: -30rpx;
	}
	.info-box{
		width: 100%;
		height:100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 100rpx;
	}
	.info-item{
		color: white;
		font-size: 50rpx;
		font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
		margin: 15rpx;
	}
	.info-has-signed-day{
		color: #bc95c6;
		font-size: 34rpx;
		border-radius: 60rpx;
		background-color: white;
		
	}
	.info-now-point{
		font-size: 30rpx;
	}
	.info-signin-rule{
		width: 80%;
		font-size: 24rpx;
	}
	.box-body{
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.button-box{
		width: 80%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.signin-button{
		background-color: #bc95c6;
		color: white;
	}
	.back-button{
		background-color: lightgray;
		color: white;
	}
	
	

</style>