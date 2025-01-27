<template>
	<view class="root">
		<view>
			<NavigationSelf title="发布" :showBack="false"></NavigationSelf>
		</view>
		<!-- head头部部分用于编写帖子相关文字描述信息 -->
		<view class="icon-box">
			<image src="../../static/编辑.png"></image>
		</view>
		<view class="head-box">
			<view class="head-box-item,title-box">
				<!-- <view class="box-lable">标题:</view> -->
				<input v-model="postData.title" type="text" placeholder="4~15个字描述你的需求" maxlength="15"/>
			</view>
			<view class="head-box-item,describetion-box">
				<!-- <view class="box-lable">描述:</view> -->
				<textarea v-model="postData.content" placeholder="详细描述你的需求,禁止发布重复内容,广告营销类,色情等违法违规内容." maxlength="300"></textarea>
			</view>
		</view>
		<view class="body-box">
			<view class="body-box-type">
				<label class="body-box-type-item">类型</label>
				<picker class="body-box-type-item" mode="selector" :range="typeRangeList" :value="postData.indexType" @change="bindPickerChangeOfType">{{typeRangeList[postData.indexType]}}</picker>
				<view class="body-box-type-item,right-arrow-icon-box">
					<image src="../../static/向右箭头 (1).png"></image>
				</view>
			</view>
			<view class="body-box-type-button-box">
				<view class="radio-group-box" v-if="postData.indexType==1">
					<radio-group class="sell-or-by"  @change="bindRadioGroupChange">
						<radio  value="sell" color="#3582E9" checked>卖</radio>
						<radio value="buy" color="#3582E9">买</radio>	
					</radio-group>
				</view>
				<view class="radio-group-box" v-if="postData.indexType==3">
					<radio-group class="recruit-or-rent"  @change="bindRadioGroupChange">
						<radio  value="recruit" color="#3582E9" checked>招聘</radio>
						<radio value="rent" color="#3582E9">出租</radio>	
					</radio-group>
				</view>
			</view>
			<view class="body-box-upload">
				<view class="body-box-upload-info">
					<label>图片上传</label>
					<view> {{base64ImageListIndex}}/9 </view>
				</view>
				<view class="body-box-upload-image">
					<uni-file-picker 
						v-model="base64ImageList"
						fileMediatype="image"
						file-extname="jpg"
						mode="grid"
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
				<view class="body-box-switch-info,flex-displey">
					<view class="body-box-switch-info-item,open-comment,flex-displey">
						<view class="label">开启评论</view>
						<switch v-if="postData.openComment" @change="bindSwitchChangeOfComment" checked color="#FF7F00" style="transform: scale(0.7);"></switch>
						<switch v-else @change="bindSwitchChangeOfComment" color="#FF7F00" style="transform: scale(0.7);"></switch>
					</view>
					<view class="body-box-switch-info-item,open-comment,flex-displey">
						<view class="label">置顶</view>
						<picker v-if="postData.isTop" class="body-box-switch-info-top-picker" mode="selector" :range="topRangeList" :value="postData.indexTop" @change="bindPickerChangeOfTop">{{topRangeList[postData.indexTop]}}</picker>
						<switch @change="bindSwitchChange" color="#FF7F00" style="transform: scale(0.7);" :checked="postData.isTop"></switch>
					</view>
				</view>
				<view class="foot-box,flex-displey">
					<view>联系方式:</view>
					<view class="contact-info-box">
						<view class="contact-info-box-item">
							<label>联系人:</label>
							<input type="text" v-model="postData.contactor" placeholder="请输入联系人" maxlength="15"/>
						</view>
						<view class="contact-info-box-item">
							<label>手机号:</label>
							<input type="text" v-model="postData.phone" placeholder="请输入手机号" maxlength="11"/>
						</view>
						<view class="contact-info-box-item">
							<label>微信号:</label>
							<input type="text" v-model="postData.wechat" placeholder="请输入微信号" maxlength="30"/>
						</view>
						<view class="contact-info-box-item">
							<label>qq号:</label>
							<input type="text" v-model="postData.qq" placeholder="请输入QQ号" maxlength="20"/>
						</view>
					</view>
				</view>
				<view class="button-box">
					<button type="primary" class="post-button" size="mini" @click="post()">发布</button>
					<button class="post-button" size="mini" @click="save()">保存</button>
				</view>
			</view>
		</view>
		<canvas canvas-id="compressCanvas"></canvas>
	</view>
</template>

<script>
	import { showErr,showSuccess,myCompressImage} from "../../common/common-js"
	import NavigationSelf from "../common-components/head/head.vue"
	import {postAPI} from "../../api/PostApi.js"
	export default {
		components:{
			NavigationSelf
		},
		onShow() {
			let initFlag = uni.getStorageSync("isNeedInit")
			// 更新userInfo信息
			this.userInfo = uni.getStorageSync("userInfo")
			if(initFlag){
				this.init()
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
					this.postData.openid = userInfo.openid
					this.postData.name = userInfo.name
					this.userInfo = userInfo
				}
			}
		},
		onHide(){
			console.log("onhide执行..")
			uni.setStorageSync("isNeedInit",false)
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
				typeRangeList:["请选择圈子","二手闲置","求问求帮","兼职招聘","校园交友","寻人寻物","学习交流"],
				topRangeList:["1小时30积分哦","1小时","2小时","3小时","4小时","5个小时"],
				base64ImageList:[],
				base64ImageListIndex:0,
				userInfo:null,
				selectFlag:false,
				postedCache:uni.getStorageSync("postedCache"),
				postData:{
					title:"",
					content:"",
					type:"",
					typeSecond:"", // 卖还是买 或者招聘或者出租
					openComment:true,
					topTime:0,
					contactor:"",
					phone:"",
					wechat:"",
					qq:"",
					openid:"",
					indexType:0,
					indexTop:0,
					isTop:false,
					base64ImageList:[],
					avatar:"",
					name:""
				}
			}
		},
		methods: {
			bindPickerChangeOfType(e){
				this.postData.indexType = e.detail.value
				this.postData.type = this.typeRangeList[this.postData.indexType]
				if(this.postData.type == "二手闲置"){
					this.postData.typeSecond = "sell"
				}else if(this.postData.type == "兼职招聘"){
					this.postData.typeSecond = "recruit"
				}
				console.log(e)
			},
			bindPickerChangeOfTop(e){
				this.postData.indexTop = e.detail.value
				console.log(e)
			},
			bindRadioGroupChange(e){
				console.log(e)
				this.postData.typeSecond = e.detail.value
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
							console.log("保存临时图片成功",imageBase64Data)
						})
					}catch(err){
						console.log("保存临时图片error",err);
						showErr("第"+(i+1)+"张图片上传失败")
					}
				}
			},
			deleteImg(e){
				this.base64ImageList.splice(e.index,1)
				this.base64ImageListIndex--;
				console.log(e.index)
			},
			bindSwitchChange(e){
				this.postData.isTop = e.detail.value
				console.log(e.detail.value)
			},
			bindSwitchChangeOfComment(e){
				this.postData.openComment = e.detail.value
			},
			save(){
				uni.setStorageSync("savePostData",this.postData);
				// 在更新存储前，先删除base64ImageList_前缀的所有缓存
				const prefix = "Base64ImageList_";
				const storageInfo = uni.getStorageInfoSync();
				// 遍历，并进行删除
				storageInfo.keys.forEach(key => {
				  if (key.startsWith(prefix)) {
				    wx.removeStorageSync(key);
				  }
				});
				console.log("storageInfo",storageInfo);
				uni.setStorageSync("Base64ImageListIndex",this.base64ImageListIndex);
				for(let i = 0;i < this.base64ImageListIndex;i++){
					uni.setStorageSync("Base64ImageList_"+i,this.base64ImageList[i]);
				}
				uni.showToast({
					icon:"success",
					title:"保存成功"
				})
			},
			post(){
				// 发布帖子
				// 1. 检验请求信息是否完善 这里标题 和 类型是必填项
				if(this.postData.title == ""){
					showErr("标题不能为空")
				}else if(this.postData.type == "" || this.postData.indexType==0){
					showErr("请选择类型")
				}
				else if(this.postData.isTop && this.postData.indexTop == 0){
					showErr("请选择置顶时间")
				}
				else if(this.postData.isTop && this.postData.indexTop *30 - this.userInfo.point > 0){
					// 检验当前积分是否足够,注意置顶规则为1小时30积分
					showErr("积分不足")
				}
				else if(this.userInfo.todayPost-1 < 0){
					showErr("今日剩余发帖数为0")
				}
				else if(this.postedCache.length+1 > 20){
					showErr("已到达最大发帖数")
				}
				else{
					this.userInfo.todayPost-=1
					// 2. 数据验证通过 ，构造数据发起请求
					for(let i = 0;i < this.base64ImageListIndex;i++){
						this.postData.base64ImageList[i] = this.base64ImageList[i].url
					}
					this.postData.avatar = this.userInfo.avatar
					this.postData.topTime = this.postData.indexTop
					// 3. 发起请求
					uni.showLoading({
						title:"上传中..."
					})
					postAPI(this.postData)
					.then((res)=>{
						if(res.code == 200){
							// 上传成功，将数据进行清空，包括保存的数据哦
							uni.removeStorageSync("savePostData")
							for(let i = 0;i < this.base64ImageListIndex;i++){
								uni.removeStorageSync("Base64ImageList_"+i)
							}
							uni.removeStorageSync("Base64ImageListIndex")
							// 重置页面
							this.base64ImageListIndex = 0
							this.base64ImageList = []
							this.postData.base64ImageList = []
							this.postData.base64ImageListIndex = 0
							this.postData.openComment = true	
							this.postData.title = ''
							this.postData.content = ''
							this.postData.indexType = 0
							this.postData.indexTop = 0
							this.postData.isTop = false
							this.postData.contactor = ''
							this.postData.phone =''
							this.postData.wechat = ''
							this.postData.qq = ''
							this.init()
							uni.hideLoading()
							uni.showModal({
								content:"上传成功",
								showCancel:false,
								success(){
									uni.switchTab({
										url:"/pages/home/home"
									})
								}
							})
						}
						else if(res.code == 110){
							// 110表示上传的信息中有敏感词汇，提示给用户
							uni.showModal({
								content:"存在敏感词汇"+res.data,
								showCancel:false,
								
							})
							uni.hideLoading()
						}
					}).catch((err)=>{
						// showErr(err)
						uni.hideLoading()
					})
				}
			},
			init(){
				console.log("执行init...")
				// 模板信息
				let saveModelData = uni.getStorageSync("modelData")
				let savePostData = uni.getStorageSync("savePostData")
				if(savePostData!=''){
					console.log("使用用户之前保存的帖子信息")
					this.postData = savePostData
				}
				// 如果当前用户没有保存过编辑的帖子信息并且当前模板处于启用状态，则启用模板
				else if(saveModelData != ''){
					if(saveModelData.isUse){
						this.postData.title = ""
						this.postData.content = ""
						this.postData.indexType = 0
						this.postData.indexTop = 0
						this.postData.isTop = false
						this.postData.openComment = saveModelData.isOpenComment
						this.base64ImageListIndex =saveModelData.base64ImageListIndex
						this.base64ImageList = saveModelData.modelImageList
						this.postData.contactor = saveModelData.contactor
						this.postData.phone = saveModelData.phone
						this.postData.wechat = saveModelData.wechat
						this.postData.qq = saveModelData.qq
					}
				}
				// 获取当前保存图片
				let saveBase64ImageListIndex = uni.getStorageSync("Base64ImageListIndex")
				if(saveBase64ImageListIndex!=''){
					this.base64ImageList = []
					this.base64ImageListIndex = saveBase64ImageListIndex
					for(let i = 0;i < saveBase64ImageListIndex;i++){
						this.base64ImageList[i] = uni.getStorageSync("Base64ImageList_"+i)
					}
				}			
			}
			
		}
	}
</script>

<style scoped>
	*{
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
	}
	.root{
		font-size: small;
	}
	.flex-displey{
		display: flex;
		flex-direction: column;
	}
	.icon-box{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.icon-box image{
		width: 64rpx;
		height: 64rpx;
	}
	.main-box{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	input,textarea{
		width: 100%;
		border-bottom: 1rpx solid lightgray;
		background: white;
	}
	textarea{
		margin-left: -5rpx;
		border:1rpx solid lightgray ;
		border-radius: 15rpx;
		height: 200rpx;
	}
	.head-box,.body-box{
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 15rpx;
		border-bottom: 2rpx solid gray;
	}
	.body-box{
		border-bottom: 0rpx;
	}
	.head-box-item,.contact-info-box-item{
		width: 95%;
		margin-top: 30rpx;
		display: flex;
		justify-content:space-between;
		align-items: center;
	}
	.contact-info-box-item{
		width: 100%;
		font-size:small;
		justify-content: space-between;
	}
	.contact-info-box-item label{
		width: 25%;
		color: lightgray;
		display: inline;
	}
	.describetion-box{
		align-items: flex-start;
		border-left:1rpx solid lightgray ;
		margin-bottom: 30rpx;
	}
	.body-box-type{
		width: 95%;
		display: flex;
		justify-content: space-between;
	}
	.right-arrow-icon-box,.right-arrow-icon-box image{
		width: 50rpx;
		height: 50rpx;
	}
	.body-box-type picker,.body-box-switch-info-top-picker{
		font-size: small;
		color: #FF7F00;
		text-decoration-style: solid;
	}
	.body-box-type-button-box{
		width: 95%;
		height: 60rpx;
		display: flex;
		justify-content:center;
		margin-top: 32rpx;
	}
	.body-box-upload{
		width: 95%;
		height: 300rpx;
		margin-top: 6rpx;
	}
	.body-box-upload-info{
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.body-box-upload-info lable{
		font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
	}
	.body-box-upload-info view{
		font-size: small;
		color: #666666;
	}
	.body-box-upload-image{
		width: 100%;
		margin-top: 18rpx;
		border-bottom: 1rpx solid lightgray;
	}
	.open-comment{
		flex-direction: row;
		justify-content:space-between;
		align-items: center;
	}
	.body-box-switch-info-item{
		margin: 6rpx 0;
	}
	.foot-box{
		margin-top: 12rpx;
		border-top: 1rpx solid lightgray;
	}
	.button-box{
		margin-top: 22rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.button-box button{
		margin: 60rpx 60rpx;
	}
	radio{
		margin: 0rpx 32rpx;
	}
	
</style>
