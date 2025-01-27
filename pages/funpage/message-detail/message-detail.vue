<!-- 消息详细信息页面 -->
<template>
	<view style="background-color: #e3e3e3;height: 100vh;">
		<NavigationSelf title="模块"></NavigationSelf>
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
					<view class="info-item">消息内容: <text class="text-content">{{message.content}}</text></view>
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
				let jsonStr = JSON.stringify(this.postInfo)
				if(this.reportInfo?.postId){
					getPostByPostIdAPI(this.reportInfo.postId).then((res)=>{
						jsonStr = JSON.stringify(res.data)
						uni.navigateTo({
							url:"/pages/funpage/post-detail/post-detail?postStr="+jsonStr
						})
					})
				}
				else{
					uni.navigateTo({
						url:"/pages/funpage/post-detail/post-detail?postStr="+jsonStr
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
	.box{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.info-box{
		display: flex;
		flex-direction: column;
		width: 96vw;
		background-color: brown;
		margin-top: 30rpx;
		border: 1px solid lightgray;
		background-color: #fff;
		font-weight: bold;
		font-size: larger;
		box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
		border-radius: 15rpx;
	}
	.text-content{
		font-size: medium;
		font-weight: 500;
		padding: 15rpx;
		margin-left: 15rpx;
		color: #ababab;
	}
	.info-item{
		padding-top: 15rpx;
		padding-left:15rpx ;
	}
	.fun-button-box{
		width: 100%;
		display: flex;
		flex-direction: row-reverse;
		margin-top: 50rpx;
	}
	.fun-button{
		height: 64rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #4e9deb;
		border:1rpx solid #4e9deb;
		border-radius: 15rpx;
		background-color: #fff;
		font-size: xx-small;
		margin: 30rpx 30rpx 30rpx 0rpx;
	}
	.exam-state-resolve{
		color: green;
	}
	.exam-state-reject{
		color: red;
	}
	.document-imgs{
		display: flex;
	}
	.img-box image{
		width: 128rpx;
		height: 128rpx;
		border-radius: 10rpx;
		margin: 10rpx;
	}
	
</style>
