<template>
	<view class="container">
		<NavigationSelf title="举报" bg="#c50000"></NavigationSelf>
		
		<view class="content">
			<view class="form-item">
				<text class="form-label">举报内容</text>
				<view class="input-container">
					<input :value="content" disabled class="form-input readonly"/>
				</view>
			</view>

			<view class="form-item">
				<text class="form-label">举报类型</text>
				<picker 
					class="picker" 
					mode="selector" 
					:range="rangeData" 
					:value="index" 
					@change="changeType"
				>
					<view class="picker-value">{{rangeData[index]}}</view>
				</picker>
			</view>

			<view class="form-item">
				<text class="form-label">举报描述</text>
				<view class="textarea-container">
					<uni-easyinput 
						type="textarea" 
						v-model="postData.reportDes" 
						placeholder="请输入描述"
						class="form-textarea"
					></uni-easyinput>
				</view>
			</view>

			<view class="form-item">
				<text class="form-label">相关图片</text>
				<text class="form-tip">可以额外截图提供图片(最多4张)</text>
				<uni-file-picker
					v-model="base64ImageList"
					fileMediatype="image"
					file-extname="jpg"
					mode="grid"
					limit="4"
					size-type="compress"
					auto-upload="false"
					:image-styles="imgStyle"
					@select="select" 
					@sourceType="album"
					@success="success" 
					@fail="fail" 
					@delete="deleteImg"
				/>
			</view>

			<text class="warning-text">请勿恶意举报，如若发现将导致账号封禁</text>

			<view class="button-box">
				<button class="action-btn primary-btn" @click="submitReport">提交</button>
				<button class="action-btn" @click="back">返回</button>
			</view>
		</view>
	</view>
</template>

<script>
	import NavigationSelf from "../../common-components/head/head.vue"
	import {myCompressImage,showErr,showSuccess} from "../../../common/common-js.js"
	import {postReportAPI} from "../../../api/ReportAPI.js"
	export default {
		components:{
			NavigationSelf
		},
		onLoad(option){
			// 将获取的postData存储起来
			this.reportData = JSON.parse(option.jsonStr)
			this.content = this.reportData.content
			if(option.type=="post"){
				this.postData.postId = this.reportData.id
			}else{
				// 表示举报的评论信息
				this.postData.postId = this.reportData.postId
				this.postData.commentId = this.reportData.commentId
			}
		},
		data() {
			return {
				imgStyle:{
					// 上传图片的样式
					"height": 75,	// 边框高度
					"width": 75,	// 边框宽度
					"border":{ // 如果为 Boolean 值，可以控制边框显示与否
						"color":"#eee",		// 边框颜色
						"width":"1px",		// 边框宽度
						"style":"solid", 	// 边框样式
						"radius":"10%"// 边框圆角，支持百分比
					},
					"background-color":"loghtgray"
				},
				reportData:null,
				rangeData:[
				"点击选择",
				   "违反发帖规定",
				   "广告或垃圾信息",
				   "涉及隐私信息",
				   "抄袭或恶意转载",
				   "虚假信息或欺诈",
				   "人身攻击或诽谤",
				   "其他违规行为"
				],
				base64ImageList:[],  // 主要用于回显图片对象
				index:0,
				content:"",
				postData:{ // 构建的上传数据对象
					postId:null,
					commentId:null,
					base64ImageList:[], // 存储的是图片的base64字符串
					openid:uni.getStorageSync("userInfo").openid,
					reportType:"",
					reportDes:"",
				}
			}
		},
		methods: {
			submitReport(){
				if(this.index == 0){
					uni.showModal({
						content:"请选择举报类型",
						showCancel:false
					})
					return
				}
				uni.showLoading({
					mask:true,
					title:"上传中..."
				})
				this.postData.base64ImageList = this.base64ImageList.map((obj)=>{
					return obj.url
				})
				postReportAPI(this.postData)
				.then((res)=>{
					if(res.code == 200){
						uni.hideLoading()
						showSuccess("举报成功，等待管理员审核!")
						console.log("成功")
						setTimeout(()=>{
							uni.navigateBack()
						},2000)
					}else{
						showErr("举报失败:"+res.errMsg)
					}
					
				})
				.catch((err)=>{
					uni.hideLoading()
					console.error("在请求举报接口发送错误",err)
				})
			},
			changeType(e){
				console.log(e)
				this.index = e.detail.value
				this.postData.reportType = this.rangeData[this.index]
			},
			select(e){
				let that = this
				// 将上传的图片进行压缩myCompressImage方法返回的是base64格式的图片信息
				let tempFilePaths = e.tempFilePaths
				for(const path of tempFilePaths){
					myCompressImage(path)
					.then((imageBase64Data)=>{
						let base64ImgItem = {
							"name":"第" +(this.base64ImageList.length + 1	)+ "图片.png",
							"extname":"jpg",
							"url":imageBase64Data
						};
						that.$set(this.base64ImageList,this.base64ImageList.length,base64ImgItem)
					})
					.catch((err)=>{
						console.error("压缩图片发送错误",err)
					})
				}
				
			},
			deleteImg(e){
				this.base64ImageList.splice(e.index,1)
				console.log(e.index)
			},
			back(){
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped>
.container {
	min-height: 100vh;
	background-color: #f8f8f8;
}

.content {
	padding: 30rpx;
}

.form-item {
	margin-bottom: 40rpx;
	background-color: #fff;
	padding: 30rpx;
	border-radius: 12rpx;
}

.form-label {
	display: block;
	font-size: 28rpx;
	color: #333;
	margin-bottom: 16rpx;
	font-weight: 500;
}

.form-tip {
	display: block;
	font-size: 24rpx;
	color: #999;
	margin-bottom: 16rpx;
}

.input-container {
	position: relative;
	width: 100%;
}

.form-input {
	width: 100%;
	height: 88rpx;
	padding: 0 20rpx;
	border: 2rpx solid #e0e0e0;
	border-radius: 8rpx;
	font-size: 28rpx;
	background-color: #fff;
}

.form-input.readonly {
	background-color: #f5f5f5;
	color: #999;
}

.picker {
	width: 100%;
}

.picker-value {
	width: 100%;
	height: 88rpx;
	line-height: 88rpx;
	padding: 0 20rpx;
	border: 2rpx solid #e0e0e0;
	border-radius: 8rpx;
	font-size: 28rpx;
	color: #409eff;
}

.textarea-container {
	position: relative;
	width: 100%;
}

.form-textarea {
	width: 100%;
	min-height: 200rpx;
	font-size: 28rpx;
}

:deep(.uni-easyinput__content) {
	border: 2rpx solid #e0e0e0 !important;
	border-radius: 8rpx !important;
	min-height: 200rpx;
}

:deep(.uni-file-picker__container) {
	margin-top: 16rpx;
}

.warning-text {
	display: block;
	text-align: center;
	font-size: 24rpx;
	color: #999;
	margin: 40rpx 0;
}

.button-box {
	display: flex;
	justify-content: space-between;
	gap: 20rpx;
	padding: 0 30rpx 40rpx;
}

.action-btn {
	flex: 1;
	height: 88rpx;
	line-height: 88rpx;
	border: none;
	border-radius: 44rpx;
	font-size: 28rpx;
	font-weight: 500;
	transition: all 0.3s ease;
	background-color: #f0f0f0;
	color: #333;
}

.primary-btn {
	background-color: #c50000;
	color: white;
}

.action-btn:active {
	opacity: 0.8;
}
</style>
