<template>
	<!-- 文档上传页面 -->
	<view v-if="isShow">
		<view class="pop-box">
			<view class="line-box">
				<label>文件名称:</label>
				<input v-model:value="fileName" placeholder="可以手动修改"/>
			</view>
			<view class="line-box">
				<label>文件大小:</label>
				<input disabled v-bind:value="showFileSize"/>
			</view>
			<view class="line-box">
				<label>上传进度:</label>
				<progress :percent="uploadProgress" show-info stroke-width="3" />
			</view>
			<view class="line-box">
				<label>上传图片:</label>
				<uni-file-picker
					style="border: 1rpx solid black;"
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
			<view class="line-box">
				<label>选择文件:</label>
				<button size="mini" type="primary" @click="getFileFormLocal()" style="background-color: #ccc; margin-left: -60rpx;">选择上传文件</button>
			</view>
			<view class="line-box" style="display: flex;">
				<view style="height: 100%;"><label>文件描述:</label></view>
				<textarea style="border: 1rpx solid black;" v-model:value="fileDes" maxlength="500" placeholder="500字以内"/>
			</view>
			<view style="margin: 60rpx 0rpx;">
				<button type="primary" size="mini" @click="uploadFile()">上传</button>
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
						console.log("保存临时图片error",err);
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
						showSuccess("上传成功，等待管理员审核!")
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
					  console.log("发送错误"+err)
				  }
				})
				uploadTask.onProgressUpdate((res) => {
				  console.log('上传进度', res.progress)
				  this.uploadProgress = res.progress
				  console.log('已经上传的数据长度', res.totalBytesSent)
				  console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
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
						console.log("调用失败",err)
					}
					
				})
			}
		}
	}
</script>

<style scoped>
	.pop-box{
		width:100vw;
		z-index: 10;
		height:100vh;
		position: fixed;
		left: 50%;
		top: 50%;
		background-color: white;
		opacity: 1;
		transform: translate(-50%,-50%);
		border-radius: 30rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.line-box{
		width: 100vw;
		display: flex;
		align-items: center;
		margin: 15rpx 0rpx;
	}
	label{
		width: 200rpx;
		margin: 0rpx 10rpx;
	}
	input{
		width: 100%;
		border-bottom: 2rpx solid lightgray;
	}
	.body-box-upload-image{
		width: 100%;
		margin-top: 18rpx;
		border-bottom: 1rpx solid lightgray;
	}
</style>