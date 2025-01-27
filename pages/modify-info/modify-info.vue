<template >
	<view style="background-color: #2f4052;overflow: hidden;height: 100vh;">
		<NavigationSelf title="我的资料"></NavigationSelf>
		<!-- 信息部分 -->
		<view class="info-box">
			<view class="avatar">
				<button open-type="chooseAvatar" @chooseavatar="changeAavtar">1</button>
				<image :src="avatarAllUrl"></image>
			</view>
			<view class="info">
				<view class="info-item">
					<view class="label-info">名称：</view>
					<view class="label-info-value">
						<input type="nickname" v-model:value="postInfo.name" maxlength="10" placeholder="最大长度为10"/>
					</view>
				</view>
				<view class="info-item">
					<view class="label-info">积分：</view>
					<view class="label-info-value">
						<input disabled="true" v-bind:value="postInfo.point"/>
					</view>
				</view>
				<view class="info-item">
					<view class="label-info">总剩余/总次数：</view>
					<view class="label-info-value">
						<input disabled="true" :value="(userInfo.totalPost - postedCache.length) + '/' + userInfo.totalPost"/>
					</view>
				</view>
				<view class="info-item">
					<view class="label-info">今日剩余次数：</view>
					<view class="label-info-value">
						<input disabled="true" :value="postInfo.todayPost"/>
					</view>
				</view>
				<view class="button-box">
					<!-- 增加发帖数按钮 -->
					<view style="display: flex;justify-content: center;align-items: center; margin-left: 50rpx;">
						<button class="addButton" size="mini" @click="addPostCont()">增加今日发帖次数<text style="color: red;">(-{{nextAddNeedPoint}})</text></button>
						<uni-icons type="help" size="30" color="white" @click="toggle()" style="margin-left: 10rpx;"></uni-icons>
					</view>
					<!-- 确定，返回按钮 -->
					<button size="mini" class="backButton" @click="confirmChange()">确定</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import NavigationSelf from "../common-components/head/head.vue"
	import {modifyUserInfoAPI} from "../../api/ModifyApi.js"
	import {showErr,showSuccess,handleDate} from "../../common/common-js.js"
	export default {
		components:{
			NavigationSelf
		},
		onLoad() {
			// 从缓存中加载用户相关信息
			this.userInfo = uni.getStorageSync("userInfo")
			this.avatarAllUrl = this.$baseImageUrl+this.userInfo.avatar + "?"+new Date().getTime()
			// 将属性赋值给postinfo对象
			this.postInfo.openid = this.userInfo.openid
			this.postInfo.name = this.userInfo.name
			this.postInfo.point = this.userInfo.point
			this.postInfo.todayPost = this.userInfo.todayPost
			this.postInfo.avatar = this.userInfo.avatar
			this.additionalCountData = uni.getStorageSync("todayAdditionalCount")
			this.postedCache = uni.getStorageSync("postedCache")
			//计算下一次需要使用的积分数
			this.nextAddNeedPoint = (uni.getStorageSync("todayAdditionalCount").count+1) * 10 || 10
		},
		data() {
			return {
				posted:0,
				userInfo:"",
				avatarAllUrl:"",
				nextAddNeedPoint:10, // 下一次添加今日发帖数量所需要的积分
				//修改上传到服务器的信息
				postInfo:{
					openid:"",
					point:"",
					name:"",
					todayPost:"",
					avatar:""
				},
				additionalCountData:null ,// 记录当前已经添加次数信息
				postedCache:[]
			}
		},
		methods: {
			toggle() {
				uni.showModal({
					title:"增加发帖数规则",
					content:"增加次数不能超过最大上限，每天增加次数不限!\n 增加次数使用积分按照第一次10 第二次20 第3次30 逐渐递增",
					showCancel:false
				})
			},
			changeAavtar(e){
				console.log(e)
				this.avatarAllUrl = e.detail.avatarUrl
				let that = this
				// 将临时头像信息转换为base64格式
				uni.getFileSystemManager().readFile({
					filePath:this.avatarAllUrl,
					encoding:"base64",
					success(res){
						console.log("图片读取成功",res)
						that.postInfo.avatar ="data:image/png;base64," +  res.data
					}
					
				});
			},
			addPostCont(){
				// 增加的规则是起始一次积分为10，依次递增10 这里采用本地缓存进行存储当
				let additionalCount = uni.getStorageSync("todayAdditionalCount") // 获取今天额外添加次数
				console.log("todayStr",additionalCount.date != handleDate())
				if(additionalCount == null || additionalCount.date != handleDate()){
					let data  = {count:0,date:handleDate()}
					uni.setStorageSync("todayAdditionalCount",data)
					additionalCount = data
					this.additionalCountData = data
				}
				if(this.additionalCountData == null) {this.additionalCountData = additionalCount}
				let needPoint = 10*(this.additionalCountData.count+1)
				this.nextAddNeedPoint = needPoint + 10
				if(this.postInfo.point - needPoint < 0){
					showErr("积分不足")
				}else if(this.postInfo.todayPost == (this.userInfo.totalPost - this.postedCache.length)){
					showErr("已达到最大上限")
				}
				else{
					// 更新缓存
					this.additionalCountData.count+=1
					this.postInfo.todayPost +=1
					this.postInfo.point-=needPoint
				}
			},
			confirmChange(){
				let that = this
				uni.showModal({
					content:"确定修改?",
					success(e){
						if(e.confirm){
							// 发起请求
							modifyUserInfoAPI("user/modify",that.postInfo)
							.then((res)=>{
								if(res.code == 200){
									showSuccess(res.data).then(()=>{
										// 添加缓存
										uni.setStorageSync("todayAdditionalCount",that.additionalCountData)
										setTimeout(()=>{
											uni.navigateBack()
										},1000)
									})
								}
								else if(res.code == -1){
									showErr(res.errMsg)
								}
								else if(res.code == 110){
									showErr("新昵称包含敏感词汇:"+res.errMsg)
								}
							})
							.catch((err)=>{
								console.log(err)
								showErr(err)
							})
							
						}else if(e.cancel){
							uni.navigateBack()
						}
					}
				})
			}
		}
	}
</script>

<style scoped>
	*{margin: 0rpx; padding: 0rpx; box-sizing: border-box;}
	.info-box{
		overflow: hidden;
		color: white;
		width: 100%;
		height: 80vh;
		border-radius: 28rpx 28rpx 0rpx 0rpx;
		display: flex;
		margin-top: 220rpx;
		background-color: #2f4052;
		flex-direction: column;
		align-items: center;
		box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
	}
	.avatar{
		width: 160rpx;
		height: 160rpx;
		border-radius: 50%;
		position: absolute;
		margin-top: -45rpx;
		background-color: white;
		
		
	}
	.avatar image,button{
		width: 160rpx;
		height: 160rpx;
		border-radius: 50%;
	}
	.avatar button{
		z-index: 15;
		position: absolute;
		opacity: 0;
	}
	
	.info{
		width: 100%;
		margin-top: 100rpx;
		/* background-color: coral; */
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.info-item{
		width: 80%;
		border-bottom: 1rpx solid lightgray;
		font-family: 'Courier New', Courier, monospace;
		margin: 30rpx 0;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
	.info-item input{
		vertical-align: middle;
	}
	.label-info{
		width: 50%;
		display: flex;
		flex-wrap: nowrap;
	}
	.label-info-value{
		width: 50%;
		display: flex;
	}
	.addButton,.backButton{
		width: auto;
		height: auto;
		border-radius: 15rpx;
		background-color: #93D2F3;
		color: white;
		
	}
	.button-box{
		width: 100%;
		height: 120rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin-top: 50rpx;
	}
	.backButton{
		background-color: lightgray;
	}
</style>
