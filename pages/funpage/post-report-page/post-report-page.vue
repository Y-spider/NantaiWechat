<template>
	<view>
		<NavigationSelf title="举报" bg="#c50000"></NavigationSelf>
		<view class="box">
			<view class="report-content-box">
				<text>举报内容:</text>
				<input :value="content" disabled="false" style="color: lightgray;"/>
			</view>
			<view class="report-type-box">
				<text>举报类型:</text>
				<picker style="margin-left: 15rpx;color: orange;" mode="selector" :range="rangeData"  :value="index" @change="changeType">
					<view class="uni-input ">{{rangeData[index]}}</view>
				</picker>
			</view>
			<view class="report-descrption-box">
				<text>举报描述:</text>
				<uni-easyinput type="textarea" v-model="postData.reportDes" placeholder="请输入描述"></uni-easyinput>
			</view>	
			<view class="report-image-box">
				<view style="margin: 10rpx 0rpx;">可以额外截图提供图片(最多4张)</view>
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
			<view style="font-size: small; color: lightgray; margin-top: 30rpx; width: 85%; display: flex;justify-content: center; align-items: center;">
				请勿恶意举报，如若发现将导致账号封禁
			</view>
			<view class="button-box">
				<button size="mini" @click="submitReport" type="primary">提交</button>
				<button size="mini" @click="back" style="background-color: lightgray;">返回</button>
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

<style>
	*{margin: 0; padding: 0; box-sizing: border-box;}
	.box{
		color: #262626;
		/* font-size: small; */
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		margin-top: 30rpx;
	}
	.report-content-box,.report-type-box{
		width: 85%;
		display: flex;
		align-items: center;
	}
	.report-content-box input{
		width: 70%;
		overflow: hidden;
		text-overflow: ellipsis;
		border-bottom: 1rpx solid lightgray;
	}
	.report-type-box,.report-descrption-box{
		margin-top: 30rpx;
	}
	picker{
		color: orange;
		border-bottom: 1rpx solid lightgray;
	}
	.report-descrption-box{
		width: 90%;
		display: flex;
	}
	.report-descrption-box textarea{
		width: 70%;
		height: 200rpx;
		margin-left: 15rpx;
	}
	.report-image-box{
		width: 85%;
		border-bottom: 1rpx solid lightgray;
	}
	.button-box{
		width: 85%;
		display: flex;
		margin-top: 45rpx;
		justify-content: space-around;
		align-items: center;
	}
	
	
</style>
