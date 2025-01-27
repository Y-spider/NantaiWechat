<template>
	<!-- 主要用于展示不同种类帖子,注意其中二手闲置和兼职招聘应该给出单选按钮 -->
	<view>
		<z-paging ref="paging" v-model="postDataList" @query="init" >
		<NavigationSelf slot=top :title="type"></NavigationSelf>
		<view class="radio-box" slot="top">
			<!-- 二手闲置单选 -->
			<view class="sell-or-buy-radio-box" v-if="showRadioFlag[0] == true">
				<radio-group @change="radioChange">
					<radio value="all" checked>全部</radio>
					<radio value="buy" >买</radio>
					<radio value="sell" >卖</radio>
				</radio-group>
			</view>
			<view class="recruit-or-rent-radio-box" v-if="showRadioFlag[1] == true">
				<radio-group  @change="radioChange">
					<radio value="all" checked>全部</radio>
					<radio value="recruit">招聘</radio>
					<radio value="rent">出租</radio>
				</radio-group>
			</view>
		</view>
		<x-skeleton type="list" :loading="loading" :configs="{gridRows:10}">
		<view class="post-item-box">
			<view class="post-item" v-for="(post,index) in postDataList" :key="index">
				<view class="post-item-base-info" @click="gotoDetailPage(index)">
					<view class="post-item-name" style="width: 30%;"><text style="text-align: left; width: 100%;">{{post.name}}</text></view>
					<view class="post-item-type">{{post.type}}</view>
					<view v-if="post.isTop" class="post-item-top" :class="state">已置顶</view>
					<view class="pots-item-avatar">
						<image :src="baseAvatarUrl + post.avatar +'?time='+ new Date().getTime()"></image>
					</view>
				</view>
				<view class="post-item-title-box" @click="gotoDetailPage(index)">
					<view class="post-item-title">
						<text>{{post.title}}</text>
						<view v-if="post.imageCount != 0" class="post-item-iamge-info-box">
							<image src="../../../static/图片.png"></image>
							<view class="image-number" style="color: #1296db;">{{post.imageCount}}张图片</view>
						</view>
					</view>
					
				</view>
				<view class="post-item-other-info-box" style="justify-content: space-between;">
					<view class="other-info-time" style="width: 30%; text-align: center;">{{post.createTime}}</view>
					<view style="width: 28%; display: flex;justify-content: space-around;">
						<view class="other-info-look">
							<image src="../../../static/浏览.png"></image>
							<text>{{post.lookCount}}</text>
						</view>
						<view class="other-info-comment">
							<image src="../../../static/评论.png"></image>
							<text>{{post.commentCount}}</text>
						</view>
						<view class="other-info-like" @click="clickLike(index)">
							<image v-if="currentUserLikePostFlag[index]==false" src="../../../static/赞.png"></image>
							<image v-else src="../../../static/赞 (1).png"></image>
							<text>{{post.likeCount}}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- <StateComponent v-if="isListAllPost"></StateComponent> -->
		</view>
		</x-skeleton>
		</z-paging>
	</view>
</template>

<script>
	import NavigationSelf from "../../common-components/head/head.vue"
	import {showErr,showSuccess,handleTime} from "../../../common/common-js.js"
	import {getPostByTypeAPI,getPostBySearchAPI} from "../../../api/PostPageOfTypeApi.js"
	import {getUserLikeOrCollectionAPI} from "../../../api/IndexApi.js"
	import {postBatchUpdateAPI} from "../../../api/PostApi.js"
	import StateComponent from "../../common-components/stateComponent/stateComponent.vue"
	export default {
		components:{
			NavigationSelf,
			StateComponent
		},
		data() {
			return {
				type:null,   // type
				showRadioFlag:[false,false],  // 标识是否需要开启单选按钮，只有二手闲置和兼职招聘有哦，0表示二手闲置，1表示兼职招聘
				postDataList:[], // 帖子列表
				pageIndex:1,
				pageSize:10,
				isListAllPost:false,
				baseAvatarUrl:this.$baseImageUrl,
				likeOrCollectionOfUser:[],
				copyLikeOrCollectionOfUser:[],
				updatePostListIndex:[],  //记录那些需要更新帖子的下标
				currentUserLikePostFlag:[], // 标识那些post的点赞是有效的，初始都为flase
				isGotoPostDetailPage:false,
				postDetailPageIndex:-1,
				typeSecond:"all",
				searchContent:"",
				loading:true
			}
		},
		onHide(){
			// 对需要访问数据库的一些操作可以在这里进行，对操作结果没有太大的要求（也有可能会失败，由于后端接口）
			// 比如对帖子的点赞(目前好像也就只有这个...)
			// 构建需要更新的数据
			let updatePostList = []
			let userInfo = uni.getStorageSync("userInfo")
			for(let i = 0;i < this.updatePostListIndex.length;i++){
				let index = this.updatePostListIndex[i]
				if(this.currentUserLikePostFlag[index] == false){
					// 说明是需要删除的点赞，那么就需要给后端传递likeOrCollection记录的id，而该id可以再copyxxx中获得
					for(let k = 0;k < this.copyLikeOrCollectionOfUser.length;k++){
						if(this.copyLikeOrCollectionOfUser[k].postId == this.postDataList[index].id){
							// 这就是目标
							updatePostList[i] = {
								id:this.postDataList[index].id,
								likeCount:this.postDataList[index].likeCount,
								requestType:"like-no",
								openid:userInfo.openid,
								likeOrCollectionId:this.copyLikeOrCollectionOfUser[k].id
							}
							break
						}
					}
				}else{
					updatePostList[i] = {
						id:this.postDataList[index].id,
						likeCount:this.postDataList[index].likeCount,
						requestType:"like-yes",
						openid:userInfo.openid,
					}
				}
			}
			// 判断是否是进入详情页面
			if(this.isGotoPostDetailPage){
				// 构造更新对象
				updatePostList[updatePostList.length] = 
				{
					id:this.postDataList[this.postDetailPageIndex].id,
					lookCount:this.postDataList[this.postDetailPageIndex].lookCount + 1,
					requestType:"default"
				}
			}
			// 开始上传
			if(updatePostList.length!=0){
				postBatchUpdateAPI(updatePostList)
				.then((res)=>{
					if(res.code == 200){
						console.log("更新帖子点赞数成功")
					}
					else{
						console.error("更新点赞数失败",res.errMsg)
					}
				})
				.catch((err)=>{
					console.error("发送错误",err)
				})
			}
			this.copyLikeOrCollectionOfUser = []
			this.updatePostListIndex = []
		},
		onLoad(option){
			this.type = option.type
			console.log("option",option)
			if(this.type.indexOf("搜索:")!=-1){	
				// 表示是用户进行search搜索内容
				this.searchContent = option.content
			}else{
				// 判断type值，动态改变radio的显示
				if(this.type == "二手闲置"){
					this.showRadioFlag[0] = true
				}else if(this.type == "兼职招聘"){
					this.showRadioFlag[1] = true
				}
			}
		},
		methods: {
			radioChange(e){
				this.typeSecond = e.detail.value
				this.pageIndex = 1
				if(this.typeSecond == "all"){
					this.init(this.pageIndex,this.pageSize)
				}else{
					// 表示有访问第二层的数据
					this.init(this.pageIndex,this.pageSize)
				}
			},
			initOfSearch(pageIndex,pageSize){
				getUserLikeOrCollectionAPI(uni.getStorageSync("userInfo").openid)
				.then((res)=>{
					if(res.code == 200){
						// 获取成功
						this.likeOrCollectionOfUser = res.data
						Object.assign(this.copyLikeOrCollectionOfUser,res.data)
						// 获取到帖子信息
						getPostBySearchAPI(this.searchContent,pageIndex,pageSize)
						.then((res)=>{
							if(res.code == 200){
								// 检查当当前用户对当前帖子的点赞状态
								for(let i = 0;i < res.data.length;i++){
									res.data[i].createTime = handleTime(res.data[i].createTime)
								}
								let oldIndexOfPostDataList = this.postDataList.length
								for(let i = oldIndexOfPostDataList;i < this.postDataList.length;i++){
									this.checkPostIsMyLike(i)
								}
								this.$refs.paging.complete(res.data);
							}else{
								console.error("发生错误",res.errMsg)
							}
						})
						.catch((err)=>{
							console.error("请求失败",err)
						})
					}else{
						showErr("发送请求错误",res.errMsg)
					}
				})
			},
			init(pageIndex,pageSize){
				this.loading = true
				// 初始化数据
				// 1. 先获取当前用户所有的点赞信息
				if(this.type.indexOf("搜索:")!=-1){
					this.initOfSearch(pageIndex,pageSize)
					this.loading = false
					return
				}
				getUserLikeOrCollectionAPI(uni.getStorageSync("userInfo").openid)
				.then((res)=>{
					if(res.code == 200){
						// 获取成功
						this.likeOrCollectionOfUser = res.data
						Object.assign(this.copyLikeOrCollectionOfUser,res.data)
						// 获取到帖子信息
						getPostByTypeAPI(this.type,pageIndex,pageSize,this.typeSecond)
						.then((res)=>{
							if(res.code == 200){
								// 检查当当前用户对当前帖子的点赞状态
								for(let i = 0;i < res.data.length;i++){
									res.data[i].createTime = handleTime(res.data[i].createTime)
								}
								let oldIndexOfPostDataList = this.postDataList.length
								// this.postDataList = [...this.postDataList,...res.data]
								for(let i = oldIndexOfPostDataList;i < this.postDataList.length;i++){
									this.checkPostIsMyLike(i)
								}
								this.$refs.paging.complete(res.data);
								this.loading = false
							}else{
								console.error("发生错误",res.errMsg)
							}
						})
						.catch((err)=>{
							console.error("请求失败",err)
						})
					}else{
						showErr("发送请求错误",res.errMsg)
					}
				})
			},
			checkPostIsMyLike(index){
				// 获取当前的帖子我是否已经点赞
				let that = this
				for(let i = 0;i < this.likeOrCollectionOfUser.length;i++){
					if(this.likeOrCollectionOfUser[i].isLike && this.likeOrCollectionOfUser[i].postId==this.postDataList[index].id && this.likeOrCollectionOfUser[i].commentId == null){
						// 表示当前用户当前帖子的点赞状态
						// 并且讲该条记录进行删除，为了下一次不做无效的检验
						this.likeOrCollectionOfUser.splice(i,1)
						this.currentUserLikePostFlag[index] = true
						return;
					}
				}
				this.currentUserLikePostFlag[index] = false
			},
			clickLike(index){
				if(this.currentUserLikePostFlag[index]){
					// 说明当前是取消点赞
					this.postDataList[index].likeCount-=1
					this.currentUserLikePostFlag[index] = false
				}else{
					// 表示是新增点赞
					this.postDataList[index].likeCount+=1
					this.currentUserLikePostFlag[index] = true
				}
				let aimIndex = this.updatePostListIndex.indexOf(index)
				if(aimIndex == -1){
					// 表示在数组中没有这个值，那就增加，如果有那就删除，最后留下来的就是需要更新帖子的下标
					this.updatePostListIndex[this.updatePostListIndex.length] = index
				}
				else{
					// 删除
					this.updatePostListIndex.splice(aimIndex,1)
				}
			},
			gotoDetailPage(index){
				this.isGotoPostDetailPage = true
				this.postDetailPageIndex = index
				// 将对应数据json对象转换为json格式的字符串，通过路径参数传递给详细信息页面
				let jsonStr = JSON.stringify(this.postDataList[index])
				uni.navigateTo({
					url:"/pages/funpage/post-detail/post-detail?postStr="+jsonStr
				})
			}
		}
	}
</script>

<style>
	*{margin: 0rpx; padding: 0rpx; box-sizing: border-box;}
	.sell-or-buy-radio-box,.recruit-or-rent-radio-box{
		margin-top: 15rpx;
		display: flex;
		justify-content: center;
	}
	radio-group{
		width: 60%;
		display: flex;
		justify-content: space-around;
	}
	.post-item-box{
		width: 100%;
		display: flex;
		flex-direction: column;
		margin-top: 12rpx;
	}
	.post-item{
		width: 100%;
		min-height: 220rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		margin: 30rpx 0rpx;
		border: 1rpx solid lightgray;
		box-shadow: 0rpx 5rpx 2rpx lightgray;
	}
	.post-item-base-info{
		display: flex;
		justify-content: space-around;
		align-items: center;
		font-size: small;
		border-bottom: 1rpx dashed lightgray;
	}
	.post-item-base-info image{
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		margin-top: -50%;
		background-color: #1f2e4b;
	}
	.post-item-type,.post-item-top{
		border-radius: 15rpx;
		background-color: #b95c00;
		color: white;
	}
	.post-item-top{
		background-color: #d30000;
	}
	.post-item-title{
		display: flex;
		flex-wrap: wrap;
	}
	.post-item-title-box{
		font-size: small;
		margin: 15rpx 60rpx;
	}
	.post-item-title-box image{
		width: 46rpx;
		height: 46rpx;
	}
	.post-item-iamge-info-box{
		display: flex;
		justify-content: center;
		align-items: center;	
		margin-left: 60rpx;
		font-size: small;
	}
	.post-item-other-info-box{
		margin: 5rpx 0rpx;
		font-size: small;
		color: lightgray;
		display: flex;
		justify-content: space-around;
		position: relative;
		/* bottom: -30rpx; */
	}
	
	.post-item-other-info-box image{
		width: 30rpx;
		height: 30rpx;
	}
	.other-info-look,.other-info-comment,.other-info-like,.post-item-name{
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
