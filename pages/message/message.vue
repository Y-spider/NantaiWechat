<template>
	<view style="max-height: 100vh;">
		<NavigationSelf boxBg="#2f4052" title="消息列表" :showBack="false"></NavigationSelf>
		<!-- 消息总结信息 -->
		<view style="height: 120rpx; position: fixed;z-index: 999;">
			<view class="message-info">
				<view style="display: flex;justify-content: center;align-items: center;">
					<view class="dot"></view>
					<view class="summary">当前总消息为{{total}}条 {{noReadCount}}条未读</view>
				</view>
			</view>
			<view>
				<scroll-view :enable-flex="true" class="scroll-view_H type-list" scroll-x="true" scroll-left="0">
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
		<view class="fun-box">
			<button class="action-btn" @click="handleReadAll" :disabled="noReadCount == 0">
				<text class="btn-icon">✓</text>
				<text>一键已读</text>
			</button>
			<button v-if="!isSubAll" class="action-btn" @click="handleAllowSub">订阅消息</button>
			<button class="action-btn delete-btn" @click="handleDeleteAll" :disabled="total - noReadCount <= 0">
				<text class="btn-icon">×</text>
				<text>删除已读</text>
			</button>
		</view>
		<view class="message-list">
			<view class="message-item" 
				v-for="(item,index) in messageList" 
				:key="index" 
				@click="handleToDetailPage(item)"
				@longpress="handleDelete(item,index)"
			>
				<!-- 消息类型标签 -->
				<view class="message-tag-box">
					<text class="message-tag">{{item.typeName}}消息</text>
					<text class="message-status" :class="{'status-read': item.state === 1}">
						{{item.state === 0 ? '未读' : '已读'}}
					</text>
				</view>
				
				<!-- 消息内容 -->
				<view class="message-content">
					<text class="message-text">{{item.content}}</text>
				</view>
				
				<!-- 消息时间 -->
				<view class="message-footer">
					<text class="message-time">{{myHandleTime(item.createTime)}}</text>
				</view>
			</view>
			<view v-if="isAll && messageList.length>0" style="display: flex; justify-content: center; align-items: center;height: 32rpx;color: lightgray;">
				已经到底了哦...
			</view>
			<stateComponent v-else></stateComponent>
		</view>
	</view>
</template>

<script>
	import NavigationSelf from "../common-components/head/head.vue"
	import {handleTime, showErr, showSuccess} from "../../common/common-js.js"
	import stateComponent from "../common-components/stateComponent/stateComponent.vue"
	import {
		getMessageByOpenidAPI,
		getNoReadMessageCountAPI,
		deleteMessageAPI,
		modifyMessageAPI,
		getMessageTypeAPI,
		readAllMessageAPI,
		deleteAllMessageHasReadedAPI
		} from "../../api/MessageApi.js"
	export default {
		components:{
			NavigationSelf,
			stateComponent
		},
		onShow(){
			this.isSubAll = uni.getStorageSync("isSubAll")
			if(!this.isSubAll){
				let that = this
				wx.getSetting({
				  withSubscriptions: true,
				  success (res) {
					  console.log("resres",res)
					  let subComment =  res.subscriptionsSetting.itemSettings["-dW5f0x9CPMCGhBk0ITWfsE3XlZwYCidRyZjQ1kr0dQ"]=="accept"
					  let subReplayComment =  res.subscriptionsSetting.itemSettings["U2UqvpGWD6ZUcxiH5a7vqyF9dVb0JzLD2kDhPU9ecdU"]=="accept"
					  // let cahtMessageNotice =  res.subscriptionsSetting.itemSettings["Oqr81VmJ0iH03UtLY3F_eJ_0izhVCTNOCcQkTOzr8q0"]=="accept" 聊天通知
					  // let cahtNeedPayOrder =  res.subscriptionsSetting.itemSettings["mmCr4sUX-o8XytQkr3MZnH68n-gG_ucL9weo9Cu5Vmk"]=="accept" 账单支付结果通知
					  // let cahtSuccessOrder =  res.subscriptionsSetting.itemSettings["0HfSDVknCcY18K8VXrIoL4dIHKXwbqgO70eQgpEtQCE"]=="accept" 账单生成通知
					  that.$nextTick(()=>{
						   that.isSubAll = (subComment && subReplayComment)
							uni.setStorageSync("isSubAll",that.isSubAll)
					  })
				  }
				})
			}
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
				clickButton:true, // 记录是不是第一次点击
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
				isSubAll:false,
				messageList:[], // 消息列表
				total:0 ,// 消息总条数
				noReadCount:0 // 消息未读数量
			}
		},
		methods: {
			handleAllowSub() {
				if(this.clickButton || true){
					// 第一次调用，传入3个模板id
					wx.requestSubscribeMessage({
					  tmplIds: [
						"dW5f0x9CPMCGhBk0ITWfsE3XlZwYCidRyZjQ1kr0dQ",
					    "U2UqvpGWD6ZUcxiH5a7vqyF9dVb0JzLD2kDhPU9ecdU",
					  ],
					  success(res) {
					    console.log("第一次调用成功", res);
					    // 第二次调用，传入另外2个模板id
					  },
					  fail(err) {
					    console.log("第一次调用失败", err);
					  }
					});
				}
				// else{
				// 	wx.requestSubscribeMessage({
				// 	  tmplIds: [
				// 	    "mmCr4sUX-o8XytQkr3MZnH68n-gG_ucL9weo9Cu5Vmk",
				// 	    "0HfSDVknCcY18K8VXrIoL4dIHKXwbqgO70eQgpEtQCE"
				// 	  ],
				// 	  success(res) {
				// 	    console.log("第二次调用成功", res);
				// 	  },
				// 	  fail(err) {
				// 	    console.log("第二次调用失败", err);
				// 	  }
				// 	});
				// }
				this.clickButton=!this.clickButton
			},
			// 跳转去消息详细页面
			handleToDetailPage(message){
				let postData = {
					id:message.id,
					state:1
				}
				if(message.type==6){
					// 跳转到聊天页面
					uni.navigateTo({
						url:`/pages/funpage/chat-page/chat-page?title=聊天&openid=${message.accepterOpenid}&postId=${message.postId}`
					})
					return
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
			},
			handleReadAll(){
				// 实现一键已读的逻辑
				let that = this
				readAllMessageAPI().then((res)=>{
					if(res.code == 200){
						showSuccess("操作成功")
						that.init()
					}
					else{
						showErr("操作失败")
					}
				}).catch((err)=>{
					showErr(err)
				})
			},
			handleDeleteAll(){
				let that = this
				// 实现一键删除的逻辑
				uni.showModal({
					content:"确定一键删除所有已读信息?",
					success(option){
						if(option.confirm){
							deleteAllMessageHasReadedAPI().then((res)=>{
								if(res.code == 200){
									that.init()
									showSuccess("操作成功")
								}
								else{
									showErr("操作失败")
								}
							}).catch((err)=>{
								showErr("错误"+err)
							})
						}
					}
				})
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
		/* justify-content: space-around; */
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
	.message-list {
		padding: 20rpx 30rpx;
		padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
	}
	.message-item {
		position: relative;
		background-color: #fff;
		padding: 24rpx;
		margin-bottom: 20rpx;
		border-radius: 12rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
		z-index: 1;
	}
	.message-tag-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16rpx;
	}
	.message-tag {
		font-size: 26rpx;
		color: #ff9800;
		background-color: #fff8e6;
		padding: 4rpx 16rpx;
		border-radius: 6rpx;
	}
	.message-status {
		font-size: 24rpx;
		color: #ff6b6b;
		background-color: #fff2f2;
		padding: 4rpx 16rpx;
		border-radius: 100rpx;
	}
	.status-read {
		color: #52c41a;
		background-color: #f6ffed;
	}
	.message-content {
		margin-bottom: 16rpx;
		padding: 0 6rpx;
	}
	.message-text {
		font-size: 28rpx;
		color: #333;
		line-height: 1.6;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.message-footer {
		display: flex;
		justify-content: flex-end;
		padding: 0 6rpx;
	}
	.message-time {
		font-size: 24rpx;
		color: #999;
	}
	.message-item:active {
		opacity: 0.8;
		transform: scale(0.995);
		transition: all 0.2s;
	}
	.message-item::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		border-radius: 12rpx;
		pointer-events: none;
		transition: background-color 0.3s;
	}
	.message-item:active::after {
		background-color: rgba(0, 0, 0, 0.05);
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
	.fun-box {
		position: fixed;
		bottom: 60rpx;
		left: 0;
		right: 0;
		z-index: 999;
		height: 0rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: space-around;
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
		padding-bottom: env(safe-area-inset-bottom);
	}
	.action-btn {
		flex: 1;
		margin: 0rpx 15rpx;
		border: none;
		border-radius: 40rpx;
		font-size: 28rpx;
		color: #fff;
		background-color: #3582E9;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
	}
	.delete-btn {
		background-color: #ff6b6b;
	}
	.btn-icon {
		font-size: 32rpx;
		margin-right: 8rpx;
	}
	.action-btn:active {
		opacity: 0.8;
		transform: scale(0.98);
	}
</style>
