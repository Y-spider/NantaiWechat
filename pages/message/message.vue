<template>
	<view style="max-height: 100vh;">
		<NavigationSelf boxBg="#2f4052" title="消息列表" :showBack="false"></NavigationSelf>
		<!-- 消息总结信息 -->
		<view style="height: 120rpx; position: fixed;">
			<view class="message-info">
				<view style="display: flex;justify-content: center;align-items: center;">
					<view class="dot"></view>
					<view class="summary">当前总消息为{{total}}条 {{noReadCount}}条未读</view>
				</view>
				<!-- <view class="quick-read">
					<button >一键已读</button>
				</view> -->
			</view>
			<view>
				<scroll-view class="scroll-view_H type-list" scroll-x="true" scroll-left="0">
					<view style="display: inline-block;" v-for="(item,index) in typeList" :key="index" @click="currentSelectedTypeIndex=index">
						<view :class="item.style">
							<img :src="baseIocnUrl + item.typeIcon" />
							<view class="type-text">{{item.type}}</view>
						</view>
					</view>
				</scroll-view>
				</view>
		</view>
		<!-- 占位 -->
		<view style="height: 120rpx; width: 100vw;">1</view>
		<view class="message-list">
			<view class="message-item" 
				v-for="(item,index) in messageList" 
				:key="index" 
				@longpress="handleDelete(item,index)"
				@click="handleToDetailPage(item)">
				<view class="message-other-info">
					<view class="message-type">
						{{item.typeName}}消息
					</view>
					<!-- <view class="message-type" v-if="item">
						审核通过
					</view> -->
					<view class="message-time">
						<view class="message-state" v-if="item.state==0">未读</view>
						<view class="message-state" style="background-color: green;" v-else>已读</view>
					</view>
				</view>
				<view class="message-text">{{item.content}}</view>
				<view style="display: flex;flex-direction: row-reverse;color: lightgray;font-size: small;">
					<view style="margin-right: 15rpx;">{{myHandleTime(item.createTime)}}</view>
				</view>
			</view>
		</view>
		<stateComponent v-if="isAll"></stateComponent>
	</view>
</template>

<script>
	import NavigationSelf from "../common-components/head/head.vue"
	import {handleTime} from "../../common/common-js.js"
	import stateComponent from "../common-components/stateComponent/stateComponent.vue"
	import {getMessageByOpenidAPI,getNoReadMessageCountAPI,deleteMessageAPI,modifyMessageAPI,getMessageTypeAPI} from "../../api/MessageApi.js"
	export default {
		components:{
			NavigationSelf,
			stateComponent
		},
		onShow(){
			getMessageTypeAPI().then((res)=>{
				this.typeList = res.data
				this.typeList[0].style = "type-item-selected"
				for(let i = 1;i < this.typeList.length;i++){
					this.typeList[i].style = "type-item-noSelected"
				}
			})
			let userInfo = uni.getStorageSync("userInfo")
			if(userInfo == ""){
				// 说明当前用户未进行登陆
				uni.showModal({
					content:"请先登录!",
					showCancel:false,
					success(e){
						if(e.confirm){
							uni.switchTab({
								url:"/pages/home/home"
							})
						}
					}
				})
			}
			else{
				// 用户已经登录
				this.isAll = false
				this.messageType = -1
				this.messageList = []
				this.pageInfo.pageIndex = 1
				this.openid = userInfo.openid
				this.init()
			}
		},
		onReachBottom(){
			if(!this.isAll){
				this.pageInfo.pageIndex+=1
				this.init()
			}
		},
		data() {
			return {
				// <!-- 消息类型选择列表  包含全部 收藏 评论 审核 系统	-->
				typeList:[
					// {icon:"../../static/全部消息.png",text:"全部",style:"type-item-selected",typeCode:-1},
					// {icon:"../../static/审核.png",text:"审核",style:"type-item-noSelected",typeCode:2},
					// {icon:"../../static/系统.png",text:"系统",style:"type-item-noSelected",typeCode:3},
					// {icon:"../../static/收藏.png",text:"收藏",style:"type-item-noSelected",typeCode:0},
					// {icon:"../../static/评论.png",text:"评论",style:"type-item-noSelected",typeCode:1},
					],
				baseIocnUrl:this.$baseImageUrl,
				currentSelectedTypeIndex:0, // 当前选中的消息类型下标
				isAll:false, // 是否加载完所有数据
				messageType:-1,
				openid:"",
				pageInfo:{
					pageIndex:1,
					pageSize:10
				},
				messageList:[], // 消息列表
				total:0 ,// 消息总条数
				noReadCount:0 // 消息未读数量
			}
		},
		methods: {
			// 跳转去消息详细页面
			handleToDetailPage(message){
				let postData = {
					id:message.id,
					state:1
				}
				modifyMessageAPI(postData).then((res)=>{
					// console.log("修改成功")
				})
				uni.navigateTo({
					url:`/pages/funpage/message-detail/message-detail?id=${message.id}`
				})
				
			},
			// 删除消息
			handleDelete(message,index){
				let that = this
				uni.showModal({
					content:"确定删除消息!",
					success(res){		
						if(res.confirm){
							deleteMessageAPI([message.id]).then((res)=>{
								// 删除成功
								console.log(that.messageList)
								that.messageList.splice(index,1)
								that.total -= 1
								if(message.state == 0){
									that.noReadCount -= 1
								}
							})	
						}
						else{
							console.log("用户取消删除...")
						}
					}
				})
			},
			init(){
				if(!this.isAll){
					getMessageByOpenidAPI(this.openid,this.messageType,this.pageInfo).then((res)=>{
						this.messageList = [...this.messageList,...res.data.pageDataList]
						this.isAll = res.data.pageInfo.isLastPage
						if(this.messageType == -1){
							this.total = parseInt(res.data.pageInfo.total)
							getNoReadMessageCountAPI(this.openid).then((res)=>{
								this.noReadCount = res.data.count
							})
						}
					})
				}
			},
			myHandleTime(time){
				return handleTime(time)
			}
		},
		watch:{
			currentSelectedTypeIndex:{
				handler(newValue,oldValue){
					if(newValue !== oldValue){
						this.typeList[newValue].style = "type-item-selected"
						this.typeList[oldValue].style = "type-item-noSelected"
						if(this.typeList[newValue].id == 1){
							// 表示查询的是所有信息
							this.messageType = -1
						}
						else{
							this.messageType = this.typeList[newValue].id
						}
						this.pageInfo.pageIndex = 1
						this.messageList = []
						this.isAll = false
						this.init()
					}
				}
			}
		}
	}
</script>

<style scoped>
	.type-list{
		width: 100vw;
		white-space: nowrap;
		display: flex;
		justify-content: space-around;
		align-items: center;
		background-color: #2f4052;
	}
	img{
		width: 50rpx;
		height: 50rpx;
	}
	.type-item-noSelected,.type-item-selected{
		width: 120rpx;
		height: 80rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		border-bottom: 2px solid white;
		color: white;
		margin: 0rpx 20rpx;
	}
	.type-item-noSelected{
		border-bottom: 2px solid #2f4052;
	}
	.message-info{
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #2f4052 ;
	}
	.dot{
		width: 26rpx;
		height: 26rpx;
		border-radius: 50%;
		box-sizing: border-box;
		background-color: #b95c00;
		margin:0rpx 15rpx ;
	}
	.summary{
		color: white;
		font-family: 'Courier New', Courier, monospace;
	}
	.quick-read button{
		width: 220rpx;
		height: 65rpx;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: lightgray;
	}
	.message-list{
		width: 100vw;
		display: flex;
		flex-direction: column;
		align-items: center;
		
	}
	.message-item{
		width: 97vw;
		height: 180rpx;
		display: flex;
		flex-direction: column;
		box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
		margin-top: 15rpx;
		
	}
	.message-text{
		flex-grow: 2;
		font-family: 'Courier New', Courier, monospace;
		padding: 10rpx;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.message-other-info{
		display: flex;
		flex-grow: 1;
		justify-content: space-between;
		align-items: center;
		padding: 0rpx 15rpx;
	}
	.message-time{
		display: flex;
		justify-content: center;
		align-items: center;
		color: lightgray;
	}
	.message-state{
		font-size: small;
		color: white;
		background-color: darkred;
		border-radius: 15rpx;
		margin: 0rpx 15rpx;
		padding: 10rpx;
	}
	.message-type{
		border-radius: 15rpx;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #b95c00;
	}
	.scroll-view-item_H {
			display: inline-block;
			width: 100%;
			height: 300rpx;
			line-height: 300rpx;
			text-align: center;
			font-size: 36rpx;
			background-color: #2f4052;
		}
</style>
