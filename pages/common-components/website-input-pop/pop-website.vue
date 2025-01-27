<template>
	<!-- 用于进行自定义弹出框 -->
	<view v-if="isShow">
		<view class="pop-box">
			<uni-forms class="uni-forms" ref="baseForm" :modelValue="baseFormData" label-width="160rpx">
				<uni-forms-item label="网站名称:" required>
					<input v-model="baseFormData.websiteName" placeholder="请输入网站名称" />
				</uni-forms-item>
				<uni-forms-item label="网站地址:" required>
					<input v-model="baseFormData.websiteUrl" placeholder="请输入网站网址" inputmode="url" />
				</uni-forms-item>
				<uni-forms-item label="网站描述:" style="display: flex;">
					<textarea style="border: 1rpx solid black; width: 95%;" v-model="baseFormData.websiteDes" placeholder="请简述一下网站功能" />
				</uni-forms-item>
			</uni-forms>
			<view class="button-box">
				<button size="mini" type="primary" @click="post()">上传</button>
				<button size="mini" type="primary" @click="getWebSiteDes()">AI生成网站描述</button>
				<!-- <button size="mini" style="background-color: #ccc;" @click="isShow=false">取消</button> -->
			</view>
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
					websiteName:"ProcessOn",
					websiteUrl:"https://www.processon.com/", 
					websiteDes:""
				},
			}
		},
		methods:{
			post(){
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
						uni.hideLoading()
					})
					.catch((err)=>{
						uni.hideLoading()
						console.error("请求post发送错误",err)
						showErr("请求发送错误")
					})
				}
			},
			getWebSiteDes(){
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
			}
		}
	}
</script>

<style scoped>
	.pop-box{
		width: 100vw;
		height: 100vh;
		z-index: 10;
		position: fixed;
		left: 50%;
		top: 50%;
		background-color: white;
		opacity: 1;
		transform: translate(-50%,-50%);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.button-box{
		width: 100%;
		color: white;
		display: flex;
		justify-content: space-around;
		margin-bottom: -30rpx;
	}
	input{
		/* width: 80%; */
		border-bottom: 5rpx solid lightgray;
	}
</style>