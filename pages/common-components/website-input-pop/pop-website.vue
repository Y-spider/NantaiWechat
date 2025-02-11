<template>
	<!-- 用于进行自定义弹出框 -->
	<view v-if="isShow" class="pop-container">
		<view class="header">
			<text class="title">网站上传</text>
		</view>
		
		<scroll-view scroll-y class="scroll-content">
			<view class="form-content">
				<view class="form-item">
					<text class="form-label required">网站名称</text>
					<view class="input-container">
						<input class="form-input" v-model="baseFormData.websiteName" placeholder="请输入网站名称" maxlength="50" />
						<text class="char-count">{{ baseFormData.websiteName.length }}/50</text>
					</view>
				</view>
				
				<view class="form-item">
					<text class="form-label required">网站地址</text>
					<view class="input-container">
						<input class="form-input" v-model="baseFormData.websiteUrl" placeholder="请输入网站网址" inputmode="url" @blur="formatUrl" />
						<text v-if="baseFormData.websiteUrl" class="clear-icon" @click="clearField" style="z-index: 999;">×</text>
					</view>
				</view>
				
				<view class="form-item">
					<text class="form-label required">网站描述</text>
					<view class="textarea-container">
						<textarea class="form-textarea" v-model="baseFormData.websiteDes" placeholder="请简述一下网站功能" maxlength="200" />
						<text class="char-count">{{ baseFormData.websiteDes.length }}/400</text>
					</view>
				</view>
			</view>
		</scroll-view>

		<view class="button-box safe-area-bottom" style="position: relative; top: -30vh;">
			<button class="action-btn" :disabled="isGenerating" @click="getWebSiteDes()">
				{{ isGenerating ? '生成中...' : 'AI生成描述' }}
			</button>
			<button class="action-btn primary-btn" :disabled="isUploading" @click="post()">
				{{ isUploading ? '上传中...' : '上传' }}
			</button>
		</view>
	</view>
</template>

<script>
	import {getWebSiteDesAPI,postWebSiteAPI} from "../../../api/websiteApi.js"
	import {showSuccess,showErr} from "../../../common/common-js.js"
	export default{
		name:"PopWebsite",
		props:["isShow"],
		data(){
			return {
				baseFormData:{
					websiteName:"",
					websiteUrl:"", 
					websiteDes:""
				},
				isGenerating: false,
				isUploading: false,
			}
		},
		methods:{
			post(){
				if (!this.validateUrl(this.baseFormData.websiteUrl)) {
					showErr("请输入有效的网址");
					return;
				}
				// 校验网站信息
				if(this.baseFormData.websiteName==""){
					showErr("请输出网站名称")
				}
				else if(this.baseFormData.websiteUrl==""){
					showErr("网址不能为空")
				}
				else if(this.baseFormData.websiteDes == ""){
					showErr("网站描述不能为空")
				}
				else{
					// 开始构建提交数据
					let postData = {
						openid:uni.getStorageSync("userInfo").openid,
						avatar:uni.getStorageSync("userInfo").avatar,
						title:this.baseFormData.websiteName,
						url:this.baseFormData.websiteUrl,
						des:this.baseFormData.websiteDes
					}
					uni.showLoading({
						title:"上传中...",
						mask:true,
					})
					this.isUploading = true;
					postWebSiteAPI(postData)
					.then((res)=>{
						if(res.code == 200){
							this.baseFormData.websiteDes = ""
							this.baseFormData.websiteName=""
							this.baseFormData.websiteUrl=""
							showSuccess("上传成功，等待管理员审核")
							uni.hideLoading()
						}
						else{
							uni.hideLoading()
							showErr(res.errMsg+"")
						}
						this.isUploading = false;
					})
					.catch((err)=>{
						uni.hideLoading()
						console.error("请求post发送错误",err)
						showErr("请求发送错误")
						this.isUploading = false;
					})
				}
			},
			getWebSiteDes(){
				if(!this.baseFormData.websiteUrl){
					showErr("网址不能为空!")
					return
				}
				this.isGenerating = true;
				let that = this
				if(this.baseFormData.websiteUrl==""){
					uni.showModal({
						title:"请输入网址",
						showCancel:false
					})
				}
				else{
					uni.showLoading({
						title:"AI生成中...",
						mask:true
					})
					// 发起请求
					getWebSiteDesAPI(this.baseFormData.websiteUrl)
					.then((res)=>{
						if(res.code == 200){
							console.info("生成网站描述成功",res.data)
							that.baseFormData.websiteDes = res.data
						}
						else{
							uni.showModal({
								content:"生成描述失败",
								showCancel:false
							})
						}
						uni.hideLoading()
					})
					.catch((err)=>{
						uni.hideLoading()
						console.error("请求getWebSiteDesAPI发送错误",err)
					})
				}
				this.isGenerating = false;
			},
			formatUrl() {
				let url = this.baseFormData.websiteUrl.trim();
				if (url && !url.startsWith('http')) {
					this.baseFormData.websiteUrl = `https://${url}`;
				}
			},
			clearField() {
				console.log("触发")
				this.baseFormData.websiteUrl = '';
			},
			validateUrl(url) {
				const pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
				return pattern.test(url);
			}
		}
	}
</script>

<style scoped>
	.pop-container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ffffff;
		z-index: 1;
		display: flex;
		flex-direction: column;
	}

	.header {
		height: 88rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		border-bottom: 2rpx solid #f5f5f5;
		padding: 0 30rpx;
	}

	.title {
		font-size: 32rpx;
		font-weight: 500;
		color: #333;
	}

	.scroll-content {
		flex: 1;
		background-color: #fff;
	}

	.form-content {
		padding: 30rpx;
	}

	.form-item {
		margin-bottom: 40rpx;
	}

	.form-label {
		display: block;
		font-size: 28rpx;
		color: #333;
		margin-bottom: 16rpx;
	}

	.form-label.required::before {
		content: "*";
		color: #ff4d4f;
		margin-right: 4rpx;
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
		transition: all 0.3s ease;
	}

	.form-input:focus {
		border-color: #409eff;
		box-shadow: 0 0 0 2rpx rgba(64,158,255,0.1);
	}

	.textarea-container {
		position: relative;
		width: 100%;
	}

	.form-textarea {
		width: 100%;
		height: 200rpx;
		padding: 20rpx;
		border: 2rpx solid #e0e0e0;
		border-radius: 8rpx;
		font-size: 28rpx;
		background-color: #fff;
		resize: none;
	}

	.form-textarea:focus {
		border-color: #409eff;
		box-shadow: 0 0 0 2rpx rgba(64,158,255,0.1);
	}

	.char-count {
		position: absolute;
		right: 20rpx;
		bottom: 20rpx;
		font-size: 24rpx;
		color: #999;
	}

	.clear-icon {
		position: absolute;
		right: 20rpx;
		top: 50%;
		transform: translateY(-50%);
		font-size: 36rpx;
		color: #999;
		cursor: pointer;
	}

	.button-box {
		display: flex;
		justify-content: space-between;
		gap: 20rpx;
		padding: 20rpx 30rpx;
		background-color: #fff;
		border-top: 2rpx solid #f5f5f5;
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
		background-color: #409eff;
		color: white;
	}

	.action-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>