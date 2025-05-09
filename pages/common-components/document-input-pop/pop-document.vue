<template>
	<!-- 文档上传页面 -->
	<view v-if="isShow" class="pop-container">
		<view class="pop-box">
			<view class="content">
				<view class="form-item">
					<label>文件名称</label>
					<input :value="fileName" placeholder="可以手动修改" class="input" style="width: 92vw;"/>
				</view>

				<view class="form-item">
					<label>文件大小</label>
					<input disabled v-bind:value="showFileSize" class="input readonly"/>
				</view>

				<view class="form-item">
					<label>上传进度</label>
					<progress 
						:percent="uploadProgress" 
						show-info 
						stroke-width="3" 
						class="progress-bar"
						activeColor="#4CAF50"
						backgroundColor="#E0E0E0"
					/>
				</view>

				<view class="form-item">
					<label>上传图片</label>
					<uni-file-picker
						class="file-picker"
						v-model="base64ImageList"
						fileMediatype="image"
						file-extname="jpg,png,jpeg"
						mode="grid"
						:limit="6"
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

				<view class="form-item">
					<label>选择文件</label>
					<button 
						class="upload-btn" 
						@click="getFileFormLocal()"
					>选择上传文件</button>
				</view>

				<view class="form-item textarea-item">
					<label>文件描述</label>
					<textarea 
						class="textarea"
						v-model:value="fileDes" 
						maxlength="500" 
						placeholder="请输入文件描述（500字以内）"
						style="width: 92vw;"
					/>
				</view>

				<view class="submit-section">
					<button class="submit-btn" @click="uploadFile()">上传文件</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {showErr,showSuccess,calcFileSize,myCompressImage} from "../../../common/common-js.js"
	export default {
		name:"PopDocument",
		props:["isShow"],
		data(){
			return{
				imgStyle:{
					// 上传图片的样式
					"height": 60,	// 边框高度
					"width": 60,	// 边框宽度
					"border":{ // 如果为 Boolean 值，可以控制边框显示与否
						"color":"#eee",		// 边框颜色
						"width":"1px",		// 边框宽度
						"style":"solid", 	// 边框样式
						"radius":"10%"// 边框圆角，支持百分比
					},
					"background-color":"loghtgray"
				},
				base64ImageList:[],
				docTail:["doc","pdf"],
				fileSize:0,
				showFileSize:"",
				fileName:"",
				fileTempPath:"",
				uploadProgress:0,
				fileDes:"",
				base64ImageListIndex:0
			}
		},
		methods:{
			deleteImg(e){
				this.base64ImageList.splice(e.index,1)
				this.base64ImageListIndex--;
				console.log(e.index)
			},
			select(e){
				// 设置标识，如果是在选择图片时触发show，则不进行任何操作
				this.selectFlag = true
				for(let i = 0;i < e.tempFilePaths.length;i++){
					try{
						myCompressImage(e.tempFilePaths[i]).then((imageBase64Data)=>{
							let base64ImgItem = {
								"name":"第" +(this.base64ImageListIndex+1)+ "图片.png",
								"extname":"jpg",
								"url":imageBase64Data
							};
							this.base64ImageList[this.base64ImageListIndex++] = base64ImgItem;
						})
					}catch(err){
						showErr("第"+(i+1)+"张图片上传失败")
					}
				}
			},
			uploadFile(){
				// 判断文件大小，大于10MB不允许上传
				let unit = this.showFileSize.split(" ")[1]
				let size =Number( this.showFileSize.split(" ")[0])
				console.log("unit",unit,"size",size)
				if(unit=="MB"){
					if(size > 10){
						showErr("上传文件不能大于10MB")
						return;
					}
				}
				// 判断必要的数据字段
				if(this.fileName==""){
					showErr("文件名称不能为空!!")
					return;
				}
				
				// 将图片数据进行处理
				let postImageDataList = ""
				for(let i = 0;i < this.base64ImageList.length;i++){
					postImageDataList+=this.base64ImageList[i].url + "@"
				}
				let that = this
				let userInfo = uni.getStorageSync("userInfo")
				uni.showLoading({
					title: "上传中...",
					mask: true
				});
				const uploadTask = wx.uploadFile({
				  url: this.$fileUploadPath, //仅为示例，非真实的接口地址
				  filePath: this.fileTempPath,
				  name: 'file',
				  header:{
					  "token":uni.getStorageSync("token")
				  },
				  formData:{
				    docName:this.fileName,
					docSize:this.fileSize,
					openid:userInfo.openid,	
					avatar:userInfo.avatar,
					name:userInfo.name,
					docDes:this.fileDes,
					base64ImageList:postImageDataList
				  },
				  success (res){
					let result = JSON.parse(res.data)
				    if(result.code == 200){
						uni.hideLoading();
						uni.showModal({
							content:"上传成功，等待管理员审核!",
							showCancel:false
						})
						that.base64ImageList = [],
						that.fileSize = "",
						that.fileName = "",
						that.fileTempPath = "",
						that.uploadProgress = 0,
						that.fileDes = "",
						that.showFileSize = ""
						that.base64ImageListIndex = 0
					}
					else{
						showErr(result.errMsg)
					}
				  },
				  fail(err){
					  showErr("发送错误"+err)
				  }
				})
				uploadTask.onProgressUpdate((res) => {
				  this.uploadProgress = res.progress
				})
					
			},
			getFileFormLocal(){
				let that = this
				uni.chooseMessageFile({
					count:1,
					type:"file",
					extension:this.docTail,
					success(e){
						let type = e.tempFiles[0].type
						let res = e.tempFiles[0]
						if(type=="file"){
							console.log(res)
							that.fileName=res.name
							that.fileTempPath = res.path
							that.fileSize = res.size
							that.showFileSize = calcFileSize(res.size)
							that.uploadProgress = 0
						}
						else{
							if(type=="image")
								showErr("不支持上传图片")
							else if(type=="video"){
								showErr("不支持上传视频")
							}
						}
					},
					fail(err){
						showErr("调用失败",err)
					}
					
				})
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
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 1;
}

.pop-box {
	width: 100vw;
	height: 100vh;
	position: fixed;
	left: 50%;
	top: 60%;
	transform: translate(-50%, -50%);
	background-color: #fff;
	box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.1);
	overflow-y: auto;
}

.header {
	padding: 30rpx;
	text-align: center;
	border-bottom: 2rpx solid #f5f5f5;
}

.title {
	font-size: 36rpx;
	font-weight: 600;
	color: #333;
}

.content {
	padding: 30rpx;
}

.form-item {
	margin-bottom: 30rpx;
}

label {
	display: block;
	margin-bottom: 16rpx;
	font-size: 28rpx;
	color: #666;
}

.input {
	width: 100%;
	height: 80rpx;
	padding: 0 20rpx;
	border: 2rpx solid #e0e0e0;
	border-radius: 12rpx;
	font-size: 28rpx;
	background-color: #fff;
}

.input.readonly {
	background-color: #f5f5f5;
}

.progress-bar {
	margin-top: 10rpx;
}

.file-picker {
	border: 2rpx solid #e0e0e0;
	border-radius: 12rpx;
	padding: 20rpx;
}

.upload-btn {
	width: 100%;
	height: 80rpx;
	line-height: 80rpx;
	background-color: #f5f5f5;
	color: #666;
	font-size: 28rpx;
	border-radius: 12rpx;
	border: none;
}

.textarea-item {
	margin-bottom: 40rpx;
}

.textarea {
	width: 100%;
	height: 200rpx;
	padding: 20rpx;
	border: 2rpx solid #e0e0e0;
	border-radius: 12rpx;
	font-size: 28rpx;
	background-color: #fff;
}

.submit-section {
	margin-top: 40rpx;
	padding: 0 40rpx;
}

.submit-btn {
	width: 100%;
	height: 88rpx;
	line-height: 88rpx;
	background-color: #4CAF50;
	color: #fff;
	font-size: 32rpx;
	border-radius: 44rpx;
	border: none;
}

.submit-btn:active {
	opacity: 0.8;
}
</style>