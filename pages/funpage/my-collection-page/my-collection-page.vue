<template>
	<!-- 收藏帖子页面 -->
	<view>
		<z-paging ref="paging" v-model="myCollectionPostDataList" @query="init">
		<NavigationSelf slot=top title="我的收藏"></NavigationSelf>
		<x-skeleton type="list" :loading="loading" :configs="{gridRows:10}">
		<view class="post-item-box">
			<view class="post-item" v-for="(post,index) in myCollectionPostDataList" :key="index" @click="gotoDetailPage(index)"> 
				<view class="post-item-base-info">
					<view class="post-item-name" style="width: 40%;"><text style="text-align: left; width: 100%;">{{post.name}}</text></view>
					<view class="post-item-type">{{post.type}}</view>
					<view v-if="post.isDelete" class="post-item-delete">帖子已删除</view>
					<view v-if="post.isTop" class="post-item-top" :class="state">已置顶</view>
					<view class="pots-item-avatar">
						<image :src="baseAvatarUrl + post.avatar +'?time='+ new Date().getTime()"></image>
					</view>
				</view>
				<view class="post-item-title-box" >
					<view class="post-item-title">
						<text>{{post.title}}</text>
						<view v-if="post.imageCount != 0" class="post-item-iamge-info-box">
							<image src="../../../static/图片.png"></image>
							<view class="image-number" style="color: #1296db;">{{post.imageCount}}张图片</view>
						</view>
					</view>
					
				</view>
				<view class="post-item-other-info-box" style="justify-content: space-between;">
					<view class="other-info-time" style="width: 30%; margin-left: 30rpx;">{{post.createTime}}</view>
					<view style="width: 28%; display: flex;justify-content: space-around;">
						<view class="other-info-look">
							<image src="../../../static/浏览.png"></image>
							<text>{{post.lookCount}}</text>
						</view>
						<view class="other-info-comment">
							<image src="../../../static/评论.png"></image>
							<text>{{post.commentCount}}</text>
						</view>
						<view class="other-info-like">
							<image v-if="currentUserLikePostFlag[index]==false" src="../../../static/赞.png"></image>
							<image v-else src="../../../static/赞 (1).png"></image>
							<text>{{post.likeCount}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- <StateComponent v-if="isArriveBottom" ></StateComponent> -->
		</x-skeleton>
		</z-paging> 
	</view>
</template>

<script>
	import NavigationSelf from "../../common-components/head/head.vue";
	import {handleTime, showErr,showSuccess} from "../../../common/common-js"
	import {getCollectionPostAPI,deleteLikeOrCollectionRecordWithOpneidAndPostIdAPI} from "../../../api/PostApi.js"
	import StateComponent from "../../common-components/stateComponent/stateComponent.vue"
	export default {
		components:{
			NavigationSelf,
			StateComponent
		},
		data() {
			return {
				myCollectionPostDataList:[],
				baseAvatarUrl:this.$baseImageUrl,
				pageIndex:1,
				pagesSize:10,
				loading:true
			}
		},
		methods: {
			init(){
				this.loading = true
				getCollectionPostAPI(uni.getStorageSync("userInfo").openid,this.pageIndex,this.pagesSize)
				.then((res)=>{
					if(res.code == 200){
						for(let i = 0;i < res.data.length;i++){
							res.data[i].createTime = handleTime(res.data[i].createTime)
						}
						this.myCollectionPostDataList = res.data
						this.$refs.paging.complete(this.myCollectionPostDataList);
						this.loading = false
					}
					else{
						showErr(res.errMsg)
					}
				})
				.catch((err)=>{
					console.error("请求接口失败",err)
				})
			},
			gotoDetailPage(index){
				// 判断是否已经被删除，如果被删除，则无法进行跳转
				let that = this
				if(this.myCollectionPostDataList[index].isDelete){
					uni.showModal({
						content:"帖子已经被作者删除,是否删除该条记录?",
						success(e){
							if(e.confirm){
								deleteLikeOrCollectionRecordWithOpneidAndPostIdAPI(uni.getStorageSync("userInfo").openid,that.myCollectionPostDataList[index].id)
								.then((res)=>{
									if(res.code == 200){
										that.myCollectionPostDataList.splice(index,1)
									}else{
										showErr("删除失败",res.errMsg)
									}
								})
								.catch((err)=>{
									console.error("请求deleteLikeOrCollectionRecordWithOpneidAndPostIdAPI接口失败",err)
								})
							}
						}
					})
				}else{
					uni.navigateTo({
						url:"/pages/funpage/post-detail/post-detail?postId="+this.myCollectionPostDataList[index].id
					})
				}
			}
		}
	}
</script>

<style>
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
	.post-item-type,.post-item-top,.post-item-delete{
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
	.post-item-iamge-info-box{
		display: flex;
		justify-content: center;
		align-items: center;	
		margin-left: 60rpx;
		font-size: small;
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
