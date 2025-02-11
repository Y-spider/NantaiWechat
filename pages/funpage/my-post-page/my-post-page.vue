<template>
	<view>
		<z-paging ref="paging" v-model="myPostedDataList" @query="init">
		<NavigationSelf slot="top" title="我的发布"></NavigationSelf>
		<x-skeleton type="list" :loading="loading" :configs="{gridRows:10}">
		<uni-search-bar @confirm="search" placeholder="请输入帖子标题" v-model="searchTitle"
						@clear="clear">
					</uni-search-bar>
		<view class="post-show-box" style="font-size: small;">
			<view class="post-show-item" v-for="(post,index) in myPostedDataList" :key="index">
				<view class="head-line">
					<view class="post-no" style="margin-left: 10rpx; font-style: initial;" @click="copyValue(post.id)">NO.{{post.id}}</view>
					<view class="post-type" style="margin-right: 10rpx;">{{post.type}}</view>
				</view>
				<view class="content-line-1"  @click="goToPostDetailPage(index)">
					<view class="post-name" style="margin-left: 10rpx; font-size: normal; margin-left: 30rpx;">标题: {{post.title}}</view>
					<view class="post-look-and-comment" style="margin-right: 10rpx;">
						<view class="look-info-box">
							<image src="../../../static/浏览.png"></image>
							<text>{{post.lookCount}}</text>
						</view>
						<view class="comment-info-box">
							<image src="../../../static/评论.png"></image>
							<text>{{post.commentCount}}</text>
						</view>
						<view class="like-info-box">
							<image src="../../../static/赞.png"></image>
							<text>{{post.likeCount}}</text>
						</view>
						<view class="post-image-count">
							<image src="../../../static/图片.png"></image>
							<text>{{post.imageCount}}</text>
						</view>
					</view>
				</view>
				<view class="content-line-2"  @click="goToPostDetailPage(index)">
					<view class="post-time" style="margin-left: 10rpx; color: lightgray;">{{post.createTime}}</view>
					<view v-if="post.isTop" class="show-top-info" style="margin-right: 15rpx;">
						<view class="post-top" style="margin-right: 10rpx;">已置顶</view>
						<text style="color: red;">剩余:{{expireTimelist[index]}}</text>
					</view>
				</view>	
				<view class="fun-line">
					<view class="fun-lien-box-1">
						<!-- <view class="remove-post">
							<button v-if="post.state==1" size="mini" type="primary" style="margin-left: 5rpx;" @click="removePost(index)">下架</button>
							<button v-if="post.state==0" size="mini" type="primary" style="margin-left: 5rpx;" @click="removePost(index)">上架</button>
						</view> -->
						<view class="change-open-commnet-radio">
							<switch style="transform: scale(0.7);" :checked="post.openComment" @change="changeCommentState(index)">开启评论</switch>
						</view>
					</view>
					<view class="fun-line-box-2">
						<view class="delete-post">
							<button size="mini" type="warn" @click="deletePost(index)">删除</button>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- <StateComponent ></StateComponent> -->
		</x-skeleton>
		</z-paging>
	</view>
</template>

<script>
	import NavigationSelf from "../../common-components/head/head.vue";
	import {handleTime, showErr, showSuccess} from "../../../common/common-js"
	import {postBatchUpdateAPI,deletPostAPI,getTopPostByPostIdAPI,getMyPostAPI} from "../../../api/PostApi.js"
	import StateComponent from "../../common-components/stateComponent/stateComponent.vue"
	export default {
		components:{
			NavigationSelf,
			StateComponent
		},
		onLoad(){
			// 从本地缓存中获取到发帖数据
			this.userInfo = uni.getStorageSync("userInfo")
			this.init()
		},
		data() {
			return {
				myPostedDataList:[],
				isChangeOpenCommentFlagList:[],
				isNeedUpdateCommentStatePostIndex:[],
				expireTimelist:[],
				searchTitle:"",
				userInfo:{},
				loading:true,
				configs:{
					gridRows:10
				}
			}
		},
		destroyed(){
			this.handleBatchUpdatePostComment()
		},
		onHide(){
			this.handleBatchUpdatePostComment()
		},
		methods:{
			clear(){
				this.searchTitle = ""
				this.init()
			},
			search(){
				this.init()
			},
			copyValue(value){
				uni.setClipboardData({
					data:value,
					success(){
						uni.showToast({
							title:"复制成功!"
						})
					}
				})
			},
			init(){
				this.loading = true
				getMyPostAPI(this.userInfo.openid,this.searchTitle).then((res)=>{
					this.myPostedDataList = res.data
					for(let i = 0;i<this.myPostedDataList.length;i++){
						// 循环处理日期
						this.expireTimelist[this.expireTimelist.length] = ""
						this.myPostedDataList[i].createTime = handleTime(this.myPostedDataList[i].createTime)
						this.isChangeOpenCommentFlagList[i] = false
						if(this.myPostedDataList[i].isTop==true){
							console.log("do")
							this.calcRemindTopTime(i)
						}
					}
					this.$refs.paging.complete(this.myPostedDataList);
					this.loading = false
				})
				
			},
			handleBatchUpdatePostComment(){
				// 表示用户更新了开启评论或者禁止评论,需要进行更新
				// 构造更新数据
				let postDtaList = []
				for(let i = 0;i < this.isNeedUpdateCommentStatePostIndex.length;i++){
					let aimIndex = this.isNeedUpdateCommentStatePostIndex[i]
					postDtaList[postDtaList.length] = {
						requestType:"changeStateOfComment",
						openComment:this.myPostedDataList[aimIndex].openComment,
						id:this.myPostedDataList[aimIndex].id
					}
				}
				postBatchUpdateAPI(postDtaList)
				.then((res)=>{
					if(res.code == 200){
						console.log("更新成功")
					}else{
						showErr("更新失败",res.errMsg)
					}
				})
				.catch((err)=>{
					console.error("请求失败",err)
				})
			},
			calcRemindTopTime(index){
				// 计算当前置顶帖子的过期时间
				getTopPostByPostIdAPI(this.myPostedDataList[index].id)
				.then((res)=>{
					if(res.code == 200){
						// 计算剩余时间
						let expireTime = new Date(res.data.expireTime).getTime()
						let now = new Date().getTime()
						let diff = (expireTime - now)/(1000*60).toFixed(0)
						if((diff/60) > 0){
							let timeStr = parseInt(diff/60)+"h"+parseInt((diff-(parseInt(diff/60)*60)))+"min"
							this.$set(this.expireTimelist,index,timeStr)
						} 
						else{
							this.$set(this.expireTimelist,index,diff + "min")
						}
					}
					else{
						showErr(res.errMsg)
					}
				})
			},
			deletePost(index){
				// 构建上传对象
				let that = this
				let postData = {
					openid:uni.getStorageSync("userInfo").openid,
					id:this.myPostedDataList[index].id
				}
				uni.showModal({
					title:"确认删除，删除后15天可找管理员恢复!!!",
					success(e){
						if(e.confirm){
							deletPostAPI(postData)
							.then((res)=>{
								if(res.code == 200){
									showSuccess("删除成功")
									that.myPostedDataList.splice(index,1)
								}
								else{
									showErr("删除失败",res.errMsg)
								}
							})
						}
					}
				})
			},
			changeCommentState(index){
				this.isChangeOpenCommentFlagList[index] = !this.isChangeOpenCommentFlagList[index]
				this.myPostedDataList[index].openComment = !this.myPostedDataList[index].openComment 
				let aimIndex = this.isNeedUpdateCommentStatePostIndex.indexOf(index)
				if(aimIndex != -1){
					// 需要删除
					this.isNeedUpdateCommentStatePostIndex.splice(aimIndex,1)
				}
				else{
					// 不存在，加入
					this.isNeedUpdateCommentStatePostIndex[this.isNeedUpdateCommentStatePostIndex.length] = index
				}
			},
			goToPostDetailPage(index){
				// 跳转到帖子详细页面
				uni.navigateTo({
					url:"/pages/funpage/post-detail/post-detail?postId="+this.myPostedDataList[index].id
				})
			},
			removePost(index){
				// 下架帖子
				let postDataList = []
				if(this.myPostedDataList[index].state==1){
					postDataList[0] = {
						id:this.myPostedDataList[index].id,
						openid:uni.getStorageSync("userInfo").openid,
						requestType:"removePost",
						state:0
					}
				}
				else{
					postDataList[0] = {
						id:this.myPostedDataList[index].id,
						openid:uni.getStorageSync("userInfo").openid,
						requestType:"removePost",
						state:1
					}
				}
				postBatchUpdateAPI(postDataList)
				.then((res)=>{
					if(res.code == 200){
						if(postDataList[0].state==1){
							showSuccess("上架成功")
						}else{
							showSuccess("下架成功")
						}
						this.myPostedDataList[index].state = postDataList[0].state
					}
					else{
						showErr("操作失败",res.errMsg)
					}
				})
				.catch((err)=>{
					console.error("发生错误",err)
				})
			}
		}
	}
</script>
	
<style>
	*{margin: 0;
	 padding: 0;
	 box-sizing: border-box;
	 font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
	 font-size: small;
	 }
	.post-show-box{
		width: 100vw;
		min-height: 120rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 15rpx;
		}
		.post-show-item{
			width: 96%;
			border-bottom: 2rpx solid lightgray;
			margin: 15rpx 0rpx;
		}
		.head-line,.content-line-1,.content-line-2{
			display: flex;
			justify-content: space-between;
			margin: 15rpx 0rpx;
		}
		.content-line-2{
			display: flex;
			flex-direction: row-reverse;
		}
		.post-name{
			word-wrap: break-word; /*强制换行*/
			overflow: hidden; /*超出隐藏*/
			text-overflow: ellipsis;/*隐藏后添加省略号*/
			white-space: nowrap;/*强制不换行*/
		}
		.head-line .post-type,.post-top{
			border-radius: 15rpx;
			background-color: #b95c00;
			color: white;
		}
		.post-top{
			background-color: #d30000;
		}
		image{
			width: 30rpx;
			height: 30rpx;
		}
		.post-look-and-comment{
			display: flex;
			color: lightgray;
		}
		.comment-info-box,.look-info-box,.post-image-count,.like-info-box{
			margin: 0rpx 5rpx;
			display: flex;
			justify-content: center;
			align-items: center;	
		}
		.show-top-info{
			display: flex;
			justify-content: space-around;
		}
		.fun-line{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 30rpx;
		}
		.fun-lien-box-1,.fun-lien-box-2{
			display: flex;
			justify-content: space-between;
		}
		.fun-lien-box-1{
			width: 40%;
		}
		.delete-post{
			margin-left: 15rpx;
		}
</style>