<template>
	<view class="container">
		<view class="header">
			<NavigationSelf title="发布" :showBack="false"></NavigationSelf>
		</view>
		
		<scroll-view scroll-y class="content">
			<!-- 标题输入区域 -->
			<view class="form-item">
				<text class="form-label">标题</text>
				<view class="input-container">
					<input 
						v-model="postData.title" 
						type="text" 
						placeholder="简短描述你想发布的内容（4~15字）" 
						maxlength="15"
						class="form-input"
					/>
					<text class="char-count">{{postData.title.length}}/15</text>
				</view>
			</view>

			<!-- 内容描述区域 -->
			<view class="form-item">
				<text class="form-label">描述</text>
				<view class="textarea-container">
					<textarea 
						v-model="postData.content" 
						placeholder="详细描述你要发布的内容，可以包括具体信息、价格、时间等（最多300字）" 
						maxlength="300"
						class="form-textarea"
					/>
					<text class="char-count">{{postData.content.length}}/300</text>
				</view>
			</view>

			<!-- 类型选择区域 -->
			<view class="form-item">
				<text class="form-label">类型</text>
				<view class="type-selector">
					<picker 
						class="type-picker" 
						mode="selector" 
						:range="typeRangeList" 
						:value="postData.indexType" 
						@change="bindPickerChangeOfType"
					>
						<view class="picker-value">
							<text>{{typeRangeList[postData.indexType] || '请选择发布类型'}}</text>
							<text class="picker-arrow">›</text>
						</view>
					</picker>
				</view>

				<!-- 二手类型选择 -->
				<view class="radio-group-box" v-if="postData.indexType==1">
					<radio-group class="radio-group" @change="bindRadioGroupChange">
						<label class="radio-item">
							<radio value="sell" color="#3582E9" checked />
							<text>卖</text>
						</label>
						<label class="radio-item">
							<radio value="buy" color="#3582E9" />
							<text>买</text>
						</label>
					</radio-group>
				</view>
				<!-- 商品价格 -->
				<view v-if="postData.indexType==1">
					<text class="form-label">价格</text>
					<view class="input-container">
						<input 
							v-model="postData.price" 
							type="number" 
							placeholder="请输入商品价格" 
							maxlength="15"
							class="form-input"
						/>
						<text class="char-count">元</text>
					</view>
				</view>
				<!-- 邮寄方式 -->
				<view v-if="postData.indexType==1">
					<text class="form-label">发货方式</text>
					<view class="type-selector">
						<picker 
							class="type-picker" 
							mode="selector" 
							:range="sendTypeList" 
							:value="sendTypeIndex" 
							@change="bindPickerSendType"
						>
							<view class="picker-value">
								<text>{{sendTypeList[sendTypeIndex]}}</text>
								<text class="picker-arrow">›</text>
							</view>
						</picker>
					</view>
				</view>

				<!-- 兼职类型选择 -->
				<view class="radio-group-box" v-if="postData.indexType==3">
					<radio-group class="radio-group" @change="bindRadioGroupChange">
						<label class="radio-item">
							<radio value="recruit" color="#3582E9" checked />
							<text>招聘</text>
						</label>
						<label class="radio-item">
							<radio value="rent" color="#3582E9" />
							<text>出租</text>
						</label>
					</radio-group>
				</view>
			</view>

			<!-- 图片上传区域 -->
			<view class="form-item">
				<view class="upload-header">
					<text class="form-label">图片上传</text>
					<text class="upload-count">{{base64ImageListIndex}}/9</text>
				</view>
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

			<!-- 设置区域 -->
			<view class="form-item">
				<view class="setting-item">
					<text>开启评论</text>
					<switch 
						:checked="postData.openComment" 
						@change="bindSwitchChangeOfComment" 
						color="#3582E9" 
						style="transform: scale(0.8);"
					/>
				</view>
				<view class="setting-item">
					<view class="setting-label">
						<text>置顶</text>
						<text class="setting-tip">30积分/小时</text>
					</view>
					<view class="top-setting">
						<picker 
							class="top-picker" 
							mode="selector" 
							:range="topRangeList" 
							:value="postData.indexTop" 
							:disabled="!postData.isTop"
							@change="bindPickerChangeOfTop"
						>
							<view class="picker-value" :class="{ 'picker-placeholder': !postData.isTop }">
								<text>{{ postData.isTop ? topRangeList[postData.indexTop] : '请选择置顶时长' }}</text>
								<text class="picker-arrow">›</text>
							</view>
						</picker>
						<switch 
							@change="bindSwitchChange" 
							color="#3582E9" 
							style="transform: scale(0.8);" 
							:checked="postData.isTop"
						/>
					</view>
				</view>
			</view>

			<!-- 联系方式 -->
			<view class="form-item">
				<text class="form-label">联系方式</text>
				<text class="form-tip">至少填写一种联系方式</text>
				<view class="contact-list">
					<view class="contact-item">
						<text class="contact-label">联系人</text>
						<input 
							type="text" 
							v-model="postData.contactor" 
							placeholder="请填写联系人姓名" 
							maxlength="15"
							class="contact-input"
						/>
					</view>
					<view class="contact-item">
						<text class="contact-label">手机号</text>
						<input 
							type="number" 
							v-model="postData.phone" 
							placeholder="请填写手机号码" 
							maxlength="11"
							class="contact-input"
						/>
					</view>
					<view class="contact-item">
						<text class="contact-label">微信号</text>
						<input 
							type="text" 
							v-model="postData.wechat" 
							placeholder="请填写微信号" 
							maxlength="30"
							class="contact-input"
						/>
					</view>
					<view class="contact-item">
						<text class="contact-label">QQ号</text>
						<input 
							type="number" 
							v-model="postData.qq" 
							placeholder="请填写QQ号码" 
							maxlength="20"
							class="contact-input"
						/>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 底部按钮 -->
		<view class="button-box">
			<button class="action-btn primary-btn" @click="post">发布</button>
			<button class="action-btn" @click="save">保存</button>
		</view>
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
				sendTypeList:["包邮","无需邮寄","顺丰到付"], // 邮寄方式
				typeRangeList:["请选择帖子类型","二手闲置","求问求帮","兼职招聘","校园交友","寻人寻物","学习交流"],
				topRangeList: ["1小时", "2小时", "3小时", "4小时", "5小时"],
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
					indexType:0, // 发帖类型下标
					indexTop:0,
					isTop:false,
					base64ImageList:[],
					avatar:"",
					name:"",
					price:0, // 商品价格
					sendType:"邮寄" //邮寄方式
				},
				sendTypeIndex:0,//
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
			},
			// 选择邮寄方式
			bindPickerSendType(e){
				this.sendTypeIndex = e.detail.value
				this.postData.sendType = this.sendTypeList[e.detail.value]
			},
			bindPickerChangeOfTop(e){
				this.postData.indexTop = e.detail.value
			},
			bindRadioGroupChange(e){
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
						})
					}catch(err){
						showErr("第"+(i+1)+"张图片上传失败")
					}
				}
			},
			deleteImg(e){
				this.base64ImageList.splice(e.index,1)
				this.base64ImageListIndex--;
			},
			bindSwitchChange(e){
				this.postData.isTop = e.detail.value
				if(!this.postData.isTop){
					this.postData.indexTop = 0
				}
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
				console.log("index="+this.postData.indexType)
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
				else if(this.postData.price<=0 && this.postData.indexType == 1){
					showErr("价格不能小于0")
				}
				else{
					if(this.postData.indexType != 1){
						this.postData.price = 0
						this.postData.sendType = ""
					}
					else{
						this.postData.sendType = this.sendTypeList[this.sendTypeIndex]
					}
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
						showErr(err)
						uni.hideLoading()
					})
				}
			},
			init(){
				// 模板信息
				let saveModelData = uni.getStorageSync("modelData")
				let savePostData = uni.getStorageSync("savePostData")
				if(savePostData!=''){
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
.container {
	min-height: 100vh;
	background-color: #f8f8f8;
	display: flex;
	flex-direction: column;
}

.content {
	flex: 1;
	padding: 30rpx 30rpx 0; /* 统一上下左右间距 */
}

.form-item {
	width: 85%;
	/* margin-bottom: 24rpx; /* 稍微减小卡片间的间距 */ 
	background-color: #fff;
	padding: 30rpx;
	border-radius: 12rpx;
	margin: 0rpx 5rpx 24rpx 5rpx; 
	/* 添加阴影效果增加边距感 */
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.form-label {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
	margin-bottom: 20rpx;
	display: block;
}

.input-container {
	position: relative;
	width: 90%;
}

.form-input {
	width: 100%;
	height: 88rpx;
	padding: 0 20rpx;
	border: 2rpx solid #eee;
	border-radius: 8rpx;
	font-size: 28rpx;
}

.textarea-container {
	position: relative;
}

.form-textarea {
	width: 90%;
	height: 200rpx;
	padding: 20rpx;
	border: 2rpx solid #eee;
	border-radius: 8rpx;
	font-size: 28rpx;
}

.char-count {
	position: absolute;
	right: 20rpx;
	bottom: 20rpx;
	font-size: 24rpx;
	color: #999;
}

.type-selector {
	width: 100%;
}

.picker-value {
	height: 88rpx;
	line-height: 88rpx;
	padding: 0 20rpx;
	border: 2rpx solid #eee;
	border-radius: 8rpx;
	font-size: 28rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.picker-arrow {
	color: #999;
	font-size: 32rpx;
}

.radio-group {
	display: flex;
	margin-top: 20rpx;
}

.radio-item {
	margin-right: 40rpx;
	font-size: 28rpx;
	display: flex;
	align-items: center;
}

.upload-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.upload-count {
	font-size: 24rpx;
	color: #999;
}

.setting-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	font-size: 28rpx;
}

.setting-label {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.setting-tip {
	font-size: 24rpx;
	color: #ff6b6b;
	background-color: #fff2f2;
	padding: 4rpx 12rpx;
	border-radius: 100rpx;
}

.setting-item:not(:last-child) {
	border-bottom: 2rpx solid #eee;
}

.top-setting {
	display: flex;
	align-items: center;
	gap: 20rpx;
	flex: 1;
	justify-content: flex-end;
}

.top-picker {
	flex: 1;
	max-width: 400rpx;
}

.picker-value {
	height: 88rpx;
	line-height: 88rpx;
	padding: 0 20rpx;
	border: 2rpx solid #eee;
	border-radius: 8rpx;
	font-size: 28rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: #333;
}

.picker-placeholder {
	color: #999;
}

.picker-arrow {
	color: #999;
	font-size: 32rpx;
	transform: rotate(90deg);
}

.contact-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.contact-item {
	display: flex;
	align-items: center;
}

.contact-label {
	width: 120rpx;
	font-size: 28rpx;
	color: #666;
}

.contact-input {
	flex: 1;
	height: 80rpx;
	padding: 0 20rpx;
	border: 2rpx solid #eee;
	border-radius: 8rpx;
	font-size: 28rpx;
}

.button-box {
	display: flex;
	gap: 20rpx;
	padding: 24rpx 30rpx;
	margin: 0 30rpx 30rpx; /* 添加左右边距，并确保底部有足够空间 */
	background-color: #fff;
	border-radius: 12rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
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
	background-color: #3582E9;
	color: white;
}

.action-btn:active {
	opacity: 0.8;
}

.upload-tip {
	font-size: 24rpx;
	color: #999;
	margin-right: auto;
	margin-left: 20rpx;
}

.form-tip {
	font-size: 24rpx;
	color: #999;
	margin-bottom: 20rpx;
	display: block;
}
</style>
