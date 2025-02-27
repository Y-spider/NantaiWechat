<!-- 聊天页面 -->
<template>
	<view>
		<NavigationSelf :title="title" :backUrl="backUrl"></NavigationSelf>
		<scroll-view class="cu-chat" style="position: relative;top: -35rpx;height: 95vh;" 
		scroll-y 
		@scrolltoupper="handleScrollToUpper"
		:scroll-with-animation="true"
		>
			<view id="scroll-view-content">
				<view v-for="(message,index) in messageList" @longpress="deleteChat(message,index)">
					<view class="cu-item self" v-if="message.sender == userInfo.openid">
						<view class="main">
							<view class="content bg-green shadow">
								<text>{{message.content}}</text>
							</view>
						</view>
						<view class="cu-avatar radius" :style="senderUserInfo.avatar"></view>
						<view class="date">{{ myHandTime(message.timeStamp) }}</view>
					</view>
					<view class="cu-item" v-else>
						<view class="cu-avatar radius" :style="accepterUserInfo.avatar"></view>
						<view class="main">
							<view class="content shadow">
								<text>{{message.content}}</text>
							</view>
						</view>
						<view class="date "> {{ myHandTime(message.timeStamp) }}</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 聊天框 -->
		<view class="cu-bar foot input" :style="[{bottom:InputBottom+'px'}]">
			<view class="action">
				<text class="cuIcon-sound text-grey"></text>
			</view>
			<input class="solid-bottom" v-model="content" :adjust-position="false" :focus="false" maxlength="300" cursor-spacing="10"
			 @focus="InputFocus" @blur="InputBlur"></input>
			<view class="action">
				<text class="cuIcon-emojifill text-grey"></text>
			</view>
			<button class="cu-btn bg-green shadow" @click="sendMessage">发送</button>
		</view>

	</view>
</template>

<script>
	import NavigationSelf from "../../common-components/head/head.vue"
	import {showErr,showSuccess,handleTime} from "../../../common/common-js.js"
	import {getCurrentUserInfoAPI} from "@/api/HomeApi.js"
	import {getChatHistoryAPI,deleteChatHistoryAPI} from "@/api/PostApi.js"
	export default {
		components:{
			NavigationSelf
		},
		data() {
			return {
				InputBottom: 0,
				socket:null,
				userInfo:null,
				title:"聊天",
				content:"",
				accepterOpenid:null,
				messageList:[],
				postId:null,
				backUrl:"",
				accepterUserInfo:{name:"",avatar:""},
				senderUserInfo:{name:"",avatar:""},
				pageIndex:1,
				pageSize:10,
				isBottom:false
				
			}
		},
		onLoad(option){
			this.title = option.title
			this.accepterOpenid = option.openid
			this.postId = option.postId
			this.backUrl = option.backUrl
			getCurrentUserInfoAPI("user/getUserInfo?openid="+this.accepterOpenid).then((res)=>{
				this.accepterUserInfo = res.data
				this.accepterUserInfo.avatar = `background-image:url(${this.$baseImageUrl+res.data.avatar});`
			})
			let senderUserInfo = uni.getStorageSync("userInfo")
			this.senderUserInfo.avatar = `background-image:url(${this.$baseImageUrl+senderUserInfo.avatar});`
			this.connectWebSocket()
			this.init()
			uni.onSocketMessage((res)=>{
				let message = JSON.parse(res.data)
				this.$set(this.messageList,this.messageList.length,message)
			})
		},
		onUnload(){
			// 销毁前断开socket连接
			uni.closeSocket({
					success:() => {
						console.info("成功关闭websocket连接,安全推出")
					},
				})
		},
		methods: {
			deleteChat(message,index){
				// 长按删除聊天记录
				let that = this
				uni.showModal({
					title:"警告",
					content:"确定删除记录?",
					success(option){
						if(option.confirm){
							deleteChatHistoryAPI(message.id).then((res)=>{
								showSuccess("删除成功")
								that.messageList.splice(index,1)
							})
						}
					}
				})
			},
			handleScrollToUpper(e){
				if(this.isBottom) return
				let sender = this.userInfo.openid
				let accepter = this.accepterOpenid
				let postId = this.postId
				this.pageIndex += 1
				getChatHistoryAPI(sender,accepter,postId,this.pageIndex,this.pageSize).then((res)=>{
					const reversedData = res.data.pageDataList.reverse()
					if(reversedData.length < this.pageSize){
						this.isBottom = true
					}
					this.messageList = [...reversedData,...this.messageList]
				}).catch((err)=>{
					console.log("异常:"+err)
				})
			},
			connectWebSocket(){
				let isSuccess = true
				// 需要与后端简历websocket连接
				this.userInfo  = uni.getStorageSync("userInfo")
				this.socket = uni.connectSocket({
					header:{
						"token":this.userInfo.token
					},
					url:`wss://${this.$socketUrl}/chat?openid=${this.userInfo.openid}&postId=${this.postId}`,
					success(res){
						showSuccess("连接成功")
					},
					fail(){
						isSuccess = false
					},
					complete(){
						if(!isSuccess){
							showErr("网络异常")
						}
					},
				})
			},
			init(){
				let sender = this.userInfo.openid
				let accepter = this.accepterOpenid
				let postId = this.postId
				getChatHistoryAPI(sender,accepter,postId,this.pageIndex,this.pageSize).then((res)=>{
					const reversedData = res.data.pageDataList.reverse()
					this.messageList = [...this.messageList,...reversedData]
				}).catch((err)=>{
					console.log("异常:"+err)
				})
			},
			reSendMessage(){
				let that = this
				// 重新连接socket 并重新发送消息
				this.socket = uni.connectSocket({
						header:{
							"token":this.userInfo.token
						},
						url:`wss://${this.$socketUrl}/chat?openid=${this.userInfo.openid}&postId=${this.postId}`,
						success(){
							that.sendMessage()
						},
						fail(){
							showErr("网络错误，请稍后再试!")
						},
					})
			},
			myHandTime(time){
				return handleTime(time)
			},
			sendMessage(){
				if(!this.content) return
				let message = {
					sender:this.userInfo.openid,
					accepter:this.accepterOpenid,
					content:this.content,
					postId:this.postId
				}
				let that = this
				uni.sendSocketMessage({
					data:JSON.stringify(message),
					success(){
						that.$set(that.messageList,that.messageList.length,message)
						that.content = ""
					},
					fail(err){
						that.reSendMessage()
					},
				})
			},
			InputFocus(e) {
				this.InputBottom = e.detail.height
			},
			InputBlur(e) {
				this.InputBottom = 0
			}
		}
	}
</script>

<style scoped>
	@import "@/colorui/main.css";
	@import "@/colorui/icon.css";
</style>
