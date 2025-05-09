<!-- 消息详细信息页面 -->
<template>
	<view style="background-color: #e3e3e3;height: 100vh;">
		<NavigationSelf :showBack="true"></NavigationSelf>
		<!--消息详细展示区域 -->
		<view class="box">
			<view class="info-box">
				<view class="info-item" @click="handleCopyText(message.id)">消息编号: <text class="text-content">{{message.id}} 【点击复制】</text></view>
				<view class="message-type" v-if="message">
					<!-- 消息类型 -->
					<view class="info-item" v-if="message.type==0">消息类型: <text class="text-content">收藏消息</text></view>
					<view class="info-item" v-if="message.type==1">消息类型: <text class="text-content">评论消息</text></view>
					<view class="info-item" v-if="message.type==2">消息类型: <text class="text-content">审核消息</text> </view>
					<view class="info-item" v-if="message.type==3">消息类型: <text class="text-content">系统消息</text></view>
				</view>
				<view class="time-info" v-if="message">
					<!-- 时间展示 -->
		 			<view class="info-item" v-if="message.type==4">收藏时间: <text class="text-content">{{myHnadleTime(message.createTime)}}</text></view>
					<view class="info-item" v-if="message.type==5">评论时间: <text class="text-content">{{myHnadleTime(message.createTime)}}</text></view>
				</view>
				<view class="operator-info" v-if="message.postId && postInfo">
					<!-- 收藏或者评论信息帖子信息 -->
					<view class="info-item">帖子标题: <text class="text-content">{{postInfo.title}}</text></view>
					<view class="info-item">帖子内容: <text class="text-content">{{postInfo.content}}</text></view>
				</view>
				<view class="operator-info" v-if="websiteInfo">
					<!-- 审核相关的展示信息 -->
					<!-- <view class="info-item">申请时间: <text class="text-content">{{myHnadleTime(message.createTime)}}</text></view> -->
					<view class="info-item" >申请时间: <text class="text-content">{{myHnadleTime(websiteInfo.createTime)}}</text></view>
					<view class="info-item">审核时间: <text class="text-content">{{myHnadleTime(message.createTime)}}</text></view>
					<view class="info-item">网站地址:<text class="text-content" @click="handleCopyText(websiteInfo.url)" > {{websiteInfo.url}} 【点击复制】</text> </view>
					<view  class="info-item">网站描述:<text class="text-content" > {{websiteInfo.des}}</text> </view>
					<view  class="info-item">审核结果:
						<text class="text-content exam-state-reject" v-if="!message.examRes"> 审核拒绝</text>
						<text class="text-content exam-state-resolve" v-else> 审核通过</text>
					</view>
				</view>
				<view class="operator-info" v-if="documentInof">
					<!-- 审核文档相关的展示信息 -->
					<view class="info-item">申请时间: <text class="text-content">{{myHnadleTime(documentInof.createTime)}}</text></view>
					<view class="info-item">审核时间: <text class="text-content">{{myHnadleTime(message.createTime)}}</text></view>
					<view  class="info-item">文档	名称:<text class="text-content"> {{documentInof.docName}}</text> </view>
					<view  class="info-item">文档描述:<text class="text-content" > {{documentInof.docDes}}</text> </view>
					<view class="info-item document-imgs" >
						<view class="img-box" v-for="(url,index) in imgList" :key="index" @click="handlePreviewImg([baseDocmentImageUrl + url])">
							<image :src="baseDocmentImageUrl + url"></image>
						</view>
					</view>
					<view  class="info-item">审核结果:
						<text class="text-content exam-state-reject" v-if="!message.examRes"> 审核拒绝</text>
						<text class="text-content exam-state-resolve" v-else> 审核通过</text>
					</view>
				</view>
				<view class="operator-info" v-if="reportInfo">
					<!-- 审核举报相关的展示信息 -->
					<view class="info-item">申请时间: <text class="text-content">{{myHnadleTime(reportInfo.createTime)}}</text></view>
					<view class="info-item">审核时间: <text class="text-content">{{myHnadleTime(message.createTime)}}</text></view>
					<view  class="info-item">举报类型:<text class="text-content"> {{reportInfo.reportType}}</text> </view>
					<view  class="info-item">举报描述:<text class="text-content" > {{reportInfo.reportDes}}</text> </view>
					<view class="info-item document-imgs" >
						<view class="img-box" v-for="(url,index) in imgList" :key="index" @click="handlePreviewImg([baseImgurl + url])">
							<image :src="baseImgurl + url"></image>
						</view>
					</view>
					<view  class="info-item">审核结果:
						<text class="text-content exam-state-reject" v-if="!message.examRes"> 审核拒绝</text>
						<text class="text-content exam-state-resolve" v-else> 审核通过</text>
					</view>
				</view>
				<view class="message-content">
					<view class="info-item">
						消息内容: <text class="text-content">{{message.content}}</text>
					</view>
					<view class="copy-button" v-if="message.content">
						<button size="mini" @click="copyContent">复制内容</button>
					</view>
				</view>
				<view class="fun-button-box">
					<view v-if="message.postId || reportInfo.postId"><button class="fun-button" @click="handleGoToPostDetail()">查看帖子</button></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import NavigationSelf from "../../common-components/head/head.vue"
	import {getMessageByIdAPI} from "@/api/MessageApi.js"
	import {handleTime, showErr, showSuccess } from "../../../common/common-js"
	import {getPostByPostIdAPI} from "@/api/PostApi.js"
	import {getWebsiteById} from "@/api/websiteApi.js"
	import {getReportByIdAPI,getReportImgByReportIdAPI} from "@/api/ReportAPI.js"
	import {getDocumentById,listDocumentImageUrlAPI} from "@/api/documentApi.js"
	export default {
		components:{
			NavigationSelf
		},
		onLoad(option){
			this.id = option.id
			this.init()
		},
		data() {
			return {
				id:null,
				message:null,
				postInfo:null,
				websiteInfo:null,
				documentInof:null,
				reportInfo:null,
				imgList:null,
				baseDocmentImageUrl:this.$baseDocumentImageUrl,
				baseImgurl:this.$baseImageUrl
			}
		},
		methods: {
			copyContent() {
				// 直接复制完整消息内容
				if(this.message.type == 3){
					// 复制
					 const urlRegex = /http[s]?:\/\/[^\s]+/g;
					const matches = this.message.content.match(urlRegex);
					if (matches && matches.length > 0) {
					     uni.setClipboardData({
					     	data: matches[0],
					     	success() {
					     		showSuccess("复制链接成功");
					     	},
					     	fail() {
					     		showErr("复制链接失败");
					     	}
					     });
						 return;
					    }
				}
				uni.setClipboardData({
					data: this.message.content,
					success() {
						showSuccess("复制成功");
					},
					fail() {
						showErr("复制失败");
					}
				});
			},
			init(){
				getMessageByIdAPI(this.id).then((res1)=>{
					this.message = res1.data
					if(this.message.postId != null){
						getPostByPostIdAPI(this.message.postId).then((res2)=>{
							this.postInfo = res2.data
						})
					}
					else if(this.message.websiteId != null){
						getWebsiteById(this.message.websiteId).then((res3)=>{
							this.websiteInfo = res3.data
						})
					}
					else if(this.message.documentId != null){
						getDocumentById(this.message.documentId).then((res4)=>{
							this.documentInof = res4.data
							if(res4.data.imageCount > 0){
								listDocumentImageUrlAPI(this.message.documentId).then((res5)=>{
									this.imgList = res5.data
								})
							}
						})
					}
					else if(this.message.reportId!=null){
						getReportByIdAPI(this.message.reportId).then(((res6)=>{
							this.reportInfo = res6.data
							getReportImgByReportIdAPI(this.reportInfo.reportId).then((res7)=>{
								this.imgList = res7.data
							})
						})).catch(err=>{
							showErr(err)
						})
					}
				})
				.catch((err)=>{
					showErr(err)
				})
			},
			handlePreviewImg(url){
				uni.previewImage({
					urls:url
				})
			},
			handleGoToPostDetail(){
				let id = this.postInfo.id
				if(this.reportInfo?.postId){
					getPostByPostIdAPI(this.reportInfo.postId).then((res)=>{
						jsonStr = JSON.stringify(res.data)
						uni.navigateTo({
							url:"/pages/funpage/post-detail/post-detail?postId="+id
						})
					})
				}
				else{
					uni.navigateTo({
						url:"/pages/funpage/post-detail/post-detail?postId="+id
					})
				}
			},
			myHnadleTime(time){
				return handleTime(time)
			},
			handleCopyText(content){
				uni.setClipboardData({
					data:content,
					success(){
						showSuccess("复制成功")
					}
				})
			}
		}
	}
</script>

<style scoped>
	.box {
		min-height: 100vh;
		background: #f8f9fa;
		padding: 30rpx 20rpx;
	}

	.info-box {
		background: #fff;
		border-radius: 24rpx;
		padding: 40rpx 30rpx;
		box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.06);
	}

	.info-item {
		position: relative;
		margin-bottom: 30rpx;
		padding-bottom: 20rpx;
		border-bottom: 2rpx solid #f5f5f5;
		font-size: 28rpx;
		color: #333;
		display: flex;
		align-items: flex-start;
	}

	.info-item:last-child {
		margin-bottom: 0;
		padding-bottom: 0;
		border-bottom: none;
	}

	.text-content {
		flex: 1;
		font-size: 28rpx;
		color: #666;
		line-height: 1.6;
		margin-left: 20rpx;
		word-break: break-all;
		white-space: pre-wrap;
	}

	.text-content[class*="exam-state-"] {
		display: inline-block;
		padding: 6rpx 20rpx;
		border-radius: 8rpx;
		font-weight: 500;
	}

	.exam-state-resolve {
		color: #52c41a;
		background: rgba(82, 196, 26, 0.1);
	}

	.exam-state-reject {
		color: #ff4d4f;
		background: rgba(255, 77, 79, 0.1);
	}

	.document-imgs {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
		margin-top: 20rpx;
	}

	.img-box {
		position: relative;
		width: 200rpx;
		height: 200rpx;
		border-radius: 12rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
	}

	.img-box:active {
		transform: scale(0.98);
	}

	.img-box image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.fun-button-box {
		margin-top: 40rpx;
		padding: 20rpx 0;
		display: flex;
		justify-content: flex-end;
		gap: 20rpx;
	}

	.fun-button {
		min-width: 160rpx;
		height: 72rpx;
		padding: 0 40rpx;
		background: linear-gradient(135deg, #4e9deb 0%, #3582E9 100%);
		color: #fff;
		border: none;
		border-radius: 36rpx;
		font-size: 28rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
		box-shadow: 0 4rpx 12rpx rgba(78, 157, 235, 0.2);
	}

	.fun-button:active {
		transform: translateY(2rpx);
		box-shadow: 0 2rpx 8rpx rgba(78, 157, 235, 0.2);
	}

	.message-content {
		display: flex;
		align-items: flex-start;
		margin-top: 20rpx;
		flex-wrap: wrap;
	}

	.message-content .info-item {
		flex: 1;
		min-width: 0;
	}

	.copy-button {
		margin-left: 20rpx;
		align-self: flex-start;
	}

	.copy-button button {
		height: 56rpx;
		padding: 0 30rpx;
		background: linear-gradient(135deg, #4e9deb 0%, #3582E9 100%);
		color: #fff;
		border: none;
		border-radius: 28rpx;
		font-size: 24rpx;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		white-space: nowrap;
		transition: all 0.3s ease;
		box-shadow: 0 4rpx 12rpx rgba(78, 157, 235, 0.2);
	}

	[class*="info-item"]:active {
		background: rgba(0, 0, 0, 0.02);
	}
</style>
