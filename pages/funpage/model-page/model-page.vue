<template>
	<view class="main-box">
		<NavigationSelf title="模块"></NavigationSelf>
		<view class="model-item">
			<view>上传图片</view>
			<view class="image-upload-box">
				<uni-file-picker class="uni-file-picker"
					v-model="modelData.modelImageList"
					fileMediatype="image"
					file-extname="png,jpg"
					limit="1"
					auto-upload="false"
					:image-styles="imgStyle"
					@select="select" 
					@success="success" 
					@fail="fail" 
					@delete="deleteImg"
				/>
			</view>
			<view class="contact-method-box">
				<view class="contact-method-item">
					<view class="lavle">联系人:</view>
					<input type="text" placeholder="请输入联系人" v-model="modelData.contactor"/>
				</view>
				<view class="contact-method-item">
					<view class="lavle">手机号:</view>
					<input type="text" placeholder="请输入手机号" v-model="modelData.phone"/>
				</view>
				<view class="contact-method-item">
					<view class="lavle">微信号:</view>
					<input type="text" placeholder="请输入微信号" v-model="modelData.wechat"/>
				</view>
				<view class="contact-method-item">
					<view class="lavle">qq号:</view>
					<input type="text" placeholder="请输入QQ号" v-model="modelData.qq"/>
				</view>
			</view>
			<view class="radio-box">
				<view class="radio-item">
					<view>开启评论</view>
					<switch @change="bindSwitchChangeOfComment"  :checked="modelData.isOpenComment" color="#FF7F00" style="transform: scale(0.7);"></switch>
				</view>
				<view class="radio-item">
					<view>是否启动模版</view>
					<switch @change="bindSwitchChangeOfUse" :checked="modelData.isUse" color="#FF7F00" style="transform: scale(0.7);"></switch>
				</view>
			</view>
			<view class="button-box">
				<button type="warn" size="mini" @click="saveModel()">保存</button>
				<button type="default" size="mini" @click="back()">返回</button>
			</view>
		</view>
	</view>
</template>

<script>
	import NavigationSelf from "../../common-components/head/head.vue"
	export default {
		components:{
			NavigationSelf
		},
		onLoad(){
			let saveModelData = uni.getStorageSync("modelData");
			if(saveModelData!='' && saveModelData != null){
				this.modelData = saveModelData
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
				modelData:{
					base64ImageListIndex:0,
					modelImageList:[],
					contactor:"",
					phone:"",
					wechat:"",
					qq:"",
					isOpenComment:true,
					isUse:false
				}
			}
		},
		methods: {
			select(e){
				console.log(e)
				for(let i = 0;i < e.tempFilePaths.length;i++){
					try{
						const res = uni.getFileSystemManager().readFileSync(e.tempFilePaths[i],"base64",0);
						let base64ImgItem = {
							"name":"第" +(this.modelData.base64ImageListIndex+1)+ "图片.png",
							"extname":"png,jpg",
							"url":"data:image/png;base64,"+res
						};
						this.modelData.modelImageList[this.modelData.base64ImageListIndex++] = base64ImgItem;
						console.log("保存临时图片成功",res)
					}catch(err){
						console.log("保存临时图片error",err);
					}
				}
			},
			deleteImg(e){
				this.modelData.modelImageList.splice(e.index,1)
				this.modelData.base64ImageListIndex--;
				console.log(e.index)
			},
			saveModel(){
				try{
					uni.setStorageSync("modelData",this.modelData)
					uni.showToast({
						icon:"success",
						title:"保存成功"
					});
				}catch(err){console.log(err)}
			},
			bindSwitchChangeOfComment(e){
				this.modelData.isOpenComment = e.detail.value
			},
			bindSwitchChangeOfUse(e){
				this.modelData.isUse = e.detail.value
			},
			back(){
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped>
	*{margin: 0;padding: 0;box-sizing: border-box;}
	.main-box{
		font-size: small;
		color: lightgray;
	}
	.button-box{
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 120rpx;
	}
	.model-item{
		margin: 15rpx 0rpx;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		
	}
	.image-upload-box,.radio-box{
		width: 95%;
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
		margin-top: 60rpx;
		border-bottom: 1rpx solid lightgray;
	}
	.uni-file-picker{
		margin-bottom: 30rpx;
	}
	.radio-item{
		display: flex;
		justify-content: center;
		align-items: center;
		justify-content: space-between;
	}
	.contact-method-box{
		width: 95%;
		display: flex;
		flex-direction: column;
		margin-top:80rpx;
	}
	.contact-method-item{
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 30rpx 0rpx;
	}
	.contact-method-item input{
		width: 85%;
		color: black;
		border-bottom: 1rpx solid lightgray;
	}
	
</style>
