<template>
	<view>
		<NavigationSelf :title="postData.title" :backUrl="backUrl"></NavigationSelf>
		<view class="poster-info">
			<view class="post-info-base-info">
				<view class="avatar">
					<image :src="imageUrl"></image>
				</view>
				<view class="name-time-box">
					<view class="name">{{ postData.name }}</view>
					<view class="time">{{ postData.createTime }}</view>
				</view>
			</view>
			<view class="fun-box" v-if="postData.state == 1">
				<view class="like" @click="clickCollection()" v-if="isShowCollection">
					<image v-if="collectionFlag" src="../../../static/收藏(1).png"></image>
					<image v-else src="../../../static/收藏.png"></image>
				</view>
				<view class="report" @click="gotoReport('post')">
					<image src="../../../static/举报.png"></image>
				</view>
			</view>
		</view>
		<view style="display: flex;align-items: center; margin-top: 30rpx;">
			<view style="width: 16rpx; height: 16rpx; border-radius: 50%; background-color: yellow; margin-left: 5rpx;">
			</view>
			<view style="margin-left: 15rpx; ">内容</view>
		</view>
		<view class="post-detail-info-box">
			<view class="post-content">{{ postData.content }}</view>
			<view class="image-box">
				<image mode="aspectFill" v-for="(item, index) in imageUrlList" :key="index" :src="imageBaseUrl + item" @click="showImage(index)">
				</image>
			</view>
		</view>
		<view class="contact-info">
			<text style="color: #1296db;" @click="isShowContactMethod = !isShowContactMethod">联系方式</text></text>
			<view v-if="isShowContactMethod" class="contact">
				<view @click="copyInfo(postData.contactor)">联系人: <text>{{ postData.contactor }}</text><text
						v-if="postData.contactor" style="color: red;">【点击复制】</text></view>
				<view @click="copyInfo(postData.phone)">电话: <text>{{ postData.phone }}</text><text v-if="postData.phone"
						style="color: red;">【点击复制】</text></view>
				<view @click="copyInfo(postData.wechat)">微信: <text>{{ postData.wechat }}</text><text v-if="postData.wechat"
						style="color: red;">【点击复制】</text></view>
				<view @click="copyInfo(postData.qq)">QQ: <text>{{ postData.qq }}</text><text v-if="postData.qq"
						style="color: red;">【点击复制】</text></view>
			</view>
		</view>
		<view style="display: flex;align-items: center; margin-top: 30rpx;">
			<view style="width: 16rpx; height: 16rpx; border-radius: 50%; background-color: #333; margin-left: 5rpx;">
			</view>
			<view style="margin-left: 15rpx; ">评论区</view>
		</view>
		<x-skeleton type="list" :loading="isLoading" :configs="{ gridRows: 5 }">
			<view v-if="postData.state == 1" class="comment-box" style="height: auto;">
				<view class="comment-item" v-for="(comment, index) in commentList" :key="index">
					<view class="base-info-box">
						<view class="avatar" v-cloak>
							<image :src="baseAvatarUrl + comment.avatar + '?time=' + new Date().getTime()"></image>
						</view>
						<view class="name-and-time" @click="replyComment(comment, null)">
							<view>{{ comment.name }}</view>
							<view>{{ comment.createTime }}</view>
						</view>
					</view>
					<view class="comment-text" @click="replyComment(comment, null)">
						{{ comment.content }}
					</view>
					<view class="other-info-box">
						<view class="delet" v-if="comment.openid == userInfo.openid" style="margin:0rpx 15rpx;">
							<!-- 删除评论 -->
							<uni-icons type="trash" size="22" color="red"
								@click="deletComment(comment, index, null)"></uni-icons>
						</view>
						<view class="reply" @click="gotoReport('commentOfParent', index)">
							<image src="../../../static/举报.png"></image>
						</view>
						<view class="like">
							<image v-if="currentUserLikePostFlag[index] == false" src="../../../static/赞.png"
								@click="clickLike(index)"></image>
							<image v-else src="../../../static/赞 (1).png" @click="clickLike(index)"></image>
							<text>{{ comment.likeCount }}</text>
						</view>
						<view v-if="comment.childrenCount != 0" style="display: flex;" @click="getChildCommentList(index)">
							<text style="font-size: small;color: #0036a2;">展开查看{{ comment.childrenCount }}条评论</text>
							<image src="../../../static/向下箭头.png" style="width: 32rpx; height: 32rpx;"></image>
						</view>
					</view>
					<!-- 回复评论区 -->
					<view v-if="showChildFlag[index] == true" class="replayComment">
						<view class="comment-box" v-for="(commentChild, childIndex) in commentListOfChild" :key="childIndex">
							<view class="comment-item" style="border-bottom: 0rpx;">
								<view class="base-info-box" @click="replyComment(comment, commentChild)">
									<view class="avatar" v-cloak>
										<image :src="baseAvatarUrl + commentChild.avatar + '?time=' + new Date().getTime()">
										</image>
									</view>
									<view class="name-and-time">
										<view v-if="commentChild.openid != userInfo.openid">{{ commentChild.name }} >
											{{ commentChild.otherName }}</view>
										<view v-else><text style="color: #1296db;"> 我 &nbsp;</text> >
											{{ commentChild.otherName }}</view>
										<view>{{ commentChild.createTime }}</view>
									</view>
								</view>
								<view class="comment-text" @click="replyComment(comment, commentChild)">
									{{ commentChild.content }}
								</view>
								<view class="other-info-box">
									<view class="delet" v-if="commentChild.openid == userInfo.openid">
										<!-- 删除评论 -->
										<uni-icons type="trash" size="22" color="red"
											@click="deletComment(commentChild, childIndex, comment)"></uni-icons>
									</view>
									<view class="reply" @click="gotoReport('commentOfChild', childIndex)">
										<image src="../../../static/举报.png"></image>
									</view>
									<view class="like">
										<image v-if="currentUserLikePostFlagOfChild[childIndex].like == false"
											src="../../../static/赞.png" @click="clickLikeOfChild(index, childIndex)"></image>
										<image v-else src="../../../static/赞 (1).png"
											@click="clickLikeOfChild(index, childIndex)"></image>
										<text>{{ commentChild.likeCount }}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-if="isBottomFlag" style="height: 220rpx;">
				<StateComponent></StateComponent>
			</view>
		</x-skeleton>
		<view class="comment-input" v-if="postData.openComment">
			<view v-if="replayTipText != ''" style="color: lightgray;margin-left: 15rpx;display:flex;align-items:center;">
				<view>回复:<text style="color: #1296db;">{{ replayTipText }}</text></view>
				<uni-icons type="trash-filled" size="20" style="margin-left: 30rpx;"
					@click="resetPostCommentForm"></uni-icons>

			</view>
			<view ref="commentInput" style="display: flex; justify-content: space-between; align-items: center;">
				<view style="margin-left: 30rpx; width: 80%;"><uni-easyinput v-model="postCommentInfo.content"
						borderColor="#fff" style="border: #1296db; margin-left: 15rpx;" placeholder="请输入评论"
						:focus="fcous"></uni-easyinput></view>
				<uni-icons type="paperplane-filled" size="30" style="color: #2f4052;margin:0 20rpx;"
					@click="postComment()"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script>
import NavigationSelf from "../../common-components/head/head.vue"
import { getImageUrlAPI, postCommnetAPI, getCommentAPI, batchUpdateCommentAPI, deleteCommentByCommentIdAPI } from "../../../api/postDetailApi.js"
import { showErr, showSuccess, handleTime } from "../../../common/common-js.js"
import { getUserLikeOrCollectionAPI } from "../../../api/IndexApi.js"
import StateComponent from "../../common-components/stateComponent/stateComponent.vue"
import { getPostByPostIdAPI } from "../../../api/PostApi"
export default {
	components: {
		NavigationSelf,
		StateComponent
	},
	data() {
		return {
			isShowContactMethod: false,  // 是否展开联系方式
			postData: {},
			userInfo: null,
			isLike: false,
			imageUrlList: [],
			imageUrl: "",
			imageBaseUrl: this.$baseImageUrl,
			commentList: [],
			replayTipText: "", // 回复提示信息 xxx回复xxxx 当是作者时，显示作者回复xxxx
			postCommentInfo: {
				postId: "",
				openid: "", // 评论人的id
				avatar: "", // 评论人的头像
				content: "", // 评论内容
				otherOpenid: null,
				otherAvatar: null,
				otherName: null,
				isReply: false,
				name: "",
				parentId: "",
				parentChildCount: 0
			},
			baseAvatarUrl: this.$baseImageUrl,
			commentListOfChild: [],
			showChildFlag: [],
			isBottomFlag: false,
			pageIndex: 1,
			pageSize: 10,
			isShowCollection: true, // 标志当前是否显示收藏功能，如果当前帖子是当前用户发布的，则隐藏收藏按钮
			likeOrCollectionOfUser: [],
			copyLikeOrCollectionOfUser: [],
			updateCommentListIndex: [],  //记录那些需要更新评论的下标
			updateCommentChildListIndex: [], // 记录那些需要更新子评论的下标和当前点赞的状态(方便后面构建更新对象) ｛index:xx,like:xx｝
			updateCommentListOfChildObject: [], // 记录那些需要需要更新的子评论
			currentUserLikePostFlag: [], // 标识那些post的点赞是有效的，初始都为flase
			currentUserLikePostFlagOfChild: [], // 表示回复帖子的点赞是否有效，初始化为{parentIndex,childIndex,like}
			isLookChildCommentIndex: [], // 用于标识是否已经查看过一次子评论，如果有则将对应评论的index下标存储在数组中
			collectionFlag: false, // 表示当前用户对当前帖子的收藏状态
			isNeedUpdateCollection: false, // 标识是否更新收藏状态
			likeOrCollectionOfCollectionId: null,// 记录当前如果初始状态为收藏状态时的收藏记录id
			isLoading: true,
			fcous: false,
			backUrl:"" // 返回上級路徑

		}
	},
	onReachBottom() {
		// 下拉刷新
		let that = this
		if (!this.isBottomFlag) {
			this.pageIndex += 1
			getCommentAPI(this.pageIndex, this.pageSize, this.postData.id, -1)
				.then((res) => {
					if (res.code == 200) {
						for (let i = 0; i < res.data.length; i++) {
							res.data[i].createTime = handleTime(res.data[i].createTime)
							that.showChildFlag[i] = false
						}
						that.commentList = [...this.commentList, ...res.data]
						for (let t = this.currentUserLikePostFlag.length; t < this.commentList.length; t++) {
							this.checkPostIsMyLike(t, 1, 1)
						}
						if (res.data.length < that.pageSize) {
							// 表示已经到最后了
							that.isBottomFlag = true
						}
					} else {
						showErr("加载失败")
					}
				})
				.catch((err) => {
					console.error("发送系统错误", err)
				})
		}

	},
	onUnload() {
		// 开始检查 updateCommentListIndex 和 updateCommentChildListIndex 中的下标 以及isNeedUpdateCollection状态，然后进行构造更新数据
		let updateDataList = []
		// 1. 先判断是否需要更新收藏状态
		if (this.isNeedUpdateCollection) {
			// 需要更新收藏状态
			if (this.collectionFlag) {
				// 表示需要添加收藏记录
				updateDataList[updateDataList.length] = {
					openid: this.userInfo.openid,
					postId: this.postData.id,
					requestType: "collection-yes"
				}
			}
			else {
				// 表示需要删除收藏记录
				updateDataList[updateDataList.length] = {
					openid: this.userInfo.openid,
					postId: this.postData.id,
					requestType: "collection-no",
					likeOrCollectionId: this.likeOrCollectionOfCollectionId
				}
			}
		}
		//2. 判断需要更新的父评论
		for (let i = 0; i < this.updateCommentListIndex.length; i++) {
			let parentCommentIndex = this.updateCommentListIndex[i]
			if (this.currentUserLikePostFlag[parentCommentIndex]) {
				// 说明是点赞需要添加记录
				updateDataList[updateDataList.length] = {
					commentId: this.commentList[parentCommentIndex].commentId,
					likeCount: this.commentList[parentCommentIndex].likeCount,
					openid: this.userInfo.openid,
					postId: this.postData.id,
					requestType: "like-yes"
				}
			}
			else {
				// 表示需要取消点赞，需要删除记录
				// 获取到需要删除的点赞收藏记录的id
				for (let i = 0; i < this.copyLikeOrCollectionOfUser.length; i++) {
					if (this.copyLikeOrCollectionOfUser[i].commentId == this.commentList[parentCommentIndex].commentId) {
						updateDataList[updateDataList.length] = {
							commentId: this.commentList[parentCommentIndex].commentId,
							likeCount: this.commentList[parentCommentIndex].likeCount,
							openid: this.userInfo.openid,
							postId: this.postData.id,
							requestType: "like-no",
							likeOrCollectionId: this.copyLikeOrCollectionOfUser[i].id
						}
						break;
					}
				}
			}
		}
		// 判断需要更新的子评论
		for (let i = 0; i < this.updateCommentChildListIndex.length; i++) {
			let childComment = this.commentListOfChild[this.updateCommentChildListIndex[i].childIndex]
			if (this.updateCommentChildListIndex[i].like == true) {
				// 表示是点赞，需要向点赞表添加记录
				// 注意这里更新的是评论信息和点赞记录表，不是在首页的帖子信息和点赞记录表了(这里差点踩坑)
				updateDataList[updateDataList.length] =
				{
					commentId: childComment.commentId,
					likeCount: childComment.likeCount,
					openid: this.userInfo.openid,
					postId: this.postData.id,
					requestType: "like-yes"
				}
			}
			else {
				// 表示是取消点赞
				// 说明是需要删除的点赞，那么就需要给后端传递likeOrCollection记录的id，而该id可以再copyxxx中获得
				for (let t = 0; t < this.copyLikeOrCollectionOfUser.length; t++) {
					if (this.copyLikeOrCollectionOfUser[t].commentId == childComment.commentId) {
						updateDataList[updateDataList.length] =
						{
							commentId: childComment.commentId,
							likeCount: childComment.likeCount,
							openid: this.userInfo.openid,
							postId: this.postData.id,
							requestType: "like-no",
							likeOrCollectionId: this.copyLikeOrCollectionOfUser[t].id
						}
						break
					}
				}

			}
		}
		// 开始上传
		if (updateDataList.length != 0) {
			batchUpdateCommentAPI(updateDataList)
				.then((res) => {
					if (res.code == 200) {
						showSuccess("点赞成功")
					}
					else {
						showErr("点赞失败")
					}
				})
				.catch((err) => {
					showErr(err)
				})
		}
		this.copyLikeOrCollectionOfUser = []
		this.currentUserLikePostFlag = []
		this.currentUserLikePostFlagOfChild = []
	},
	onLoad(option) {
		// 在这里将在路径上的post帖子json对象字符串转换为json对象
		this.userInfo = uni.getStorageSync("userInfo")
		this.backUrl = option?.backUrl || ""
		getPostByPostIdAPI(option.postId).then((res)=>{
			if(res.code==200){
				this.postData = res.data
				this.postCommentInfo.postId = this.postData.id
				this.postCommentInfo.name = this.userInfo.name
				this.postCommentInfo.openid = this.userInfo.openid
				this.postCommentInfo.avatar = this.userInfo.avatar
				this.imageUrl = this.$baseImageUrl + this.postData.avatar + "?time=" + new Date().getTime()
				if (this.userInfo.openid == this.postData.openid) {
					this.isShowCollection = false
				}
				this.init()
			}
		})
	},
	methods: {
		deletComment(comment, index, parentComment) {
			// 删除评论
			let _this = this
			if (!comment.parentId) {
				// 表示这个是顶级评论
				uni.showModal({
					title: "警告",
					content: "您删除评论后所有的回复也将同步删除!!!",
					success(confirm) {
						if (confirm) {
							deleteCommentByCommentIdAPI(comment.commentId).then((res) => {
								if (res.code == 200) {
									_this.commentList.splice(index, 1)
									showSuccess("删除成功")
								}
							}).catch((err) => {
								showErr(err)
							})
						}
					}
				})
			} else {
				deleteCommentByCommentIdAPI(comment.commentId).then((res) => {
					if (res.code == 200) {
						this.commentListOfChild.splice(index, 1)
						parentComment.childrenCount--
						showSuccess("删除成功")
					}
				}).catch((err) => {
					showErr(err)
				})
			}


		},
		resetPostCommentForm() {
			// 重置表单数据
			this.postCommentInfo.parentId = null
			this.replayTipText = ''
			this.postCommentInfo.otherOpenid = null
			this.postCommentInfo.otherName = null
			this.postCommentInfo.otherAvatar = null
			this.postCommentInfo.isReply = false
		},
		init() {
			let that = this
			this.isLoading = true
			if (this.postData.imageCount != 0) {
				getImageUrlAPI(this.postData.id)
					.then((res) => {
						if (res.code == 200) {
							this.imageUrlList = res.data
						} else {
							showErr(res.code)
						}
					})
					.catch((err) => {
						showErr(err)
					})
			}
			// 获取到用户的点赞和收藏信息记录
			getUserLikeOrCollectionAPI(uni.getStorageSync("userInfo").openid)
				.then((res) => {
					if (res.code == 200) {
						// 获取成功
						this.likeOrCollectionOfUser = res.data
						Object.assign(this.copyLikeOrCollectionOfUser, res.data)
						// 再发起请求，访问后端，或取评论信息
						// 循环判断当前用户是否收藏该帖子，初始化收藏状态
						for (let i = 0; i < res.data.length; i++) {
							if (res.data[i].postId == this.postData.id && res.data[i].isCollection) {
								that.collectionFlag = true
								that.likeOrCollectionOfCollectionId = res.data[i].id
								break;
							}
						}
						getCommentAPI(that.pageIndex, that.pageSize, this.postData.id, -1)
							.then((res) => {
								if (res.code == 200) {
									for (let i = 0; i < res.data.length; i++) {
										res.data[i].createTime = handleTime(res.data[i].createTime)
										that.showChildFlag[i] = false
									}
									this.commentList = [...this.commentList, ...res.data]
									// 通过checkPostIsMyLike初始化currentUserLikePostFlag数组
									for (let t = this.currentUserLikePostFlag.length; t < this.commentList.length; t++) {
										this.checkPostIsMyLike(t, 1, 1)
									}

									if (res.data.length < that.pageSize) {
										// 表示已经到最后了
										that.isBottomFlag = true
									}
									this.isLoading = false
								}
								else {
									showErr(res.errMsg)
								}
							})
							.catch((err) => { showErr(err) })
					} else {
						showErr("错误代码" + res.code)
					}
				})
		},
		clickCollection() {
			this.isNeedUpdateCollection = !this.isNeedUpdateCollection
			this.collectionFlag = !this.collectionFlag
		},
		clickLike(index) {
			if (this.currentUserLikePostFlag[index]) {
				// 说明当前是取消点赞
				this.commentList[index].likeCount -= 1
				this.currentUserLikePostFlag[index] = false
			} else {
				// 表示是新增点赞
				this.commentList[index].likeCount += 1
				this.currentUserLikePostFlag[index] = true
			}
			let aimIndex = this.updateCommentListIndex.indexOf(index)
			if (aimIndex == -1) {
				// 表示在数组中没有这个值，那就增加，如果有那就删除，最后留下来的就是需要更新帖子的下标
				this.updateCommentListIndex[this.updateCommentListIndex.length] = index
			}
			else {
				// 删除
				this.updateCommentListIndex.splice(aimIndex, 1)
			}
		},
		clickLikeOfChild(parentIndex, childIndex) {
			//记录回复评论中的修改 parentIndex为父评论的下标，childIndex为子评论下标
			for (let i = 0; i < this.currentUserLikePostFlagOfChild.length; i++) {
				let commentObject = this.currentUserLikePostFlagOfChild[i]
				if (commentObject.parentIndex == parentIndex && commentObject.childIndex == childIndex) {
					// 修改updateCommentListOfChildObject的值，也就是修改点赞状态
					if (!commentObject.like) {
						// 点赞
						this.currentUserLikePostFlagOfChild[i].like = true
						//修改子评论点赞数
						this.commentListOfChild[childIndex].likeCount++
					}
					else {
						// 取消点赞
						this.currentUserLikePostFlagOfChild[i].like = false
						// 修改评论子评论点赞数
						this.commentListOfChild[childIndex].likeCount--
					}
					//检查子评论下标是否在更新记录下标数组中，如果在则移除，不在则添加
					let flag = false
					for (let t = 0; t < this.updateCommentChildListIndex.length; t++) {
						let obj = this.updateCommentChildListIndex[t]
						if (this.updateCommentChildListIndex[t].childIndex === childIndex && this.updateCommentChildListIndex[t].parentIndex === parentIndex) {
							// 表示有则,进行删除
							this.updateCommentChildListIndex.splice(t, 1)
							flag = true
							break
						}
					}
					// 检查是否有遍历到目标
					if (!flag) {
						// 没有遍历到，则进行添加
						this.updateCommentChildListIndex[this.updateCommentChildListIndex.length] = { "parentIndex": parentIndex, "childIndex": childIndex, "like": this.currentUserLikePostFlagOfChild[i].like }
					}
					break;
				}
			}
		},
		checkPostIsMyLike(index, level, parentIndex) {
			if (level == 1) {
				// 获取当前的帖子我是否已经点赞,表示对第一层评论进行回复
				for (let i = 0; i < this.likeOrCollectionOfUser.length; i++) {
					if (this.likeOrCollectionOfUser[i].isLike && this.likeOrCollectionOfUser[i].commentId == this.commentList[index].commentId) {
						// 表示当前用户当前评论的点赞状态
						// 有该条记录进行删除，为了下一次不做无效的检验
						this.likeOrCollectionOfUser.splice(i, 1)
						this.currentUserLikePostFlag[index] = true
						return;
					}
				}
				this.currentUserLikePostFlag[index] = false
			}
			else if (level == 2) {
				// 表示对回复的消息进行点赞状态进行对比
				for (let i = 0; i < this.likeOrCollectionOfUser.length; i++) {
					if (this.likeOrCollectionOfUser[i].isLike && this.likeOrCollectionOfUser[i].commentId == this.commentListOfChild[index].commentId) {
						// 表示当前用户当前评论的点赞状态
						// 有该条记录进行删除，为了下一次不做无效的检验
						this.likeOrCollectionOfUser.splice(i, 1)
						this.currentUserLikePostFlagOfChild[this.currentUserLikePostFlagOfChild.length] = { "parentIndex": parentIndex, "childIndex": index, "like": true }
						return;
					}
				}
				this.currentUserLikePostFlagOfChild[this.currentUserLikePostFlagOfChild.length] = { "parentIndex": parentIndex, "childIndex": index, "like": false }
			}
		},
		replyComment(parentComment, childComment) {
			// 回复评论,不能回复自己的帖子
			// 判断是否是点击的自己的帖子
			if (childComment != null && childComment.openid != this.userInfo.openid) {
				// 获取我发帖下面的其他人回复的评论
				this.replayTipText = childComment.name
				this.postCommentInfo.otherOpenid = childComment.openid
				this.postCommentInfo.otherAvatar = childComment.avatar
				this.postCommentInfo.otherName = childComment.name
			} else if (parentComment.openid != this.userInfo.openid) {
				// 回复其他人发布的根帖子
				this.replayTipText = parentComment.name
				this.postCommentInfo.otherOpenid = parentComment.openid
				this.postCommentInfo.otherAvatar = parentComment.avatar
				this.postCommentInfo.otherName = parentComment.name
			} else {
				// 回复的是自己的，不允许回复
				return
			}
			this.postCommentInfo.postId = this.postData.id
			this.postCommentInfo.openid = this.userInfo.openid
			this.postCommentInfo.avatar = this.userInfo.avatar
			this.isReply = true
			this.postCommentInfo.parentId = parentComment.commentId
			this.fcous = true

		},
		getChildCommentList(index) {
			// 如果showChildFlag为false，则表示需要向数据库获取子评论数据
			let that = this
			// 在进行获取子评论前，需要先判断待更新子评论下标数组中是否有待更新的子评论信息
			if (this.updateCommentChildListIndex.length != 0) {
				// 说明有需要更新的子评论信息
				// 构建更新需要的对象
				let updateChildCommentList = []
				for (let i = 0; i < this.updateCommentChildListIndex.length; i++) {
					let childComment = this.commentListOfChild[this.updateCommentChildListIndex[i].childIndex]
					if (this.updateCommentChildListIndex[i].like == true) {
						// 表示是点赞，需要向点赞表添加记录
						// 注意这里更新的是评论信息和点赞记录表，不是在首页的帖子信息和点赞记录表了(这里差点踩坑)
						updateChildCommentList[updateChildCommentList.length] =
						{
							commentId: childComment.commentId,
							likeCount: childComment.likeCount,
							openid: this.userInfo.openid,
							postId: this.postData.id,
							requestType: "like-yes"
						}
					}
					else {
						// 表示是取消点赞
						// 说明是需要删除的点赞，那么就需要给后端传递likeOrCollection记录的id，而该id可以再copyxxx中获得
						for (let i = 0; i < this.copyLikeOrCollectionOfUser.length; i++) {
							if (this.copyLikeOrCollectionOfUser[i].commentId != null && this.copyLikeOrCollectionOfUser[i].commentId == childComment.commentId) {
								updateChildCommentList[updateChildCommentList.length] =
								{
									commentId: childComment.commentId,
									likeCount: childComment.likeCount,
									openid: this.userInfo.openid,
									postId: this.postData.id,
									requestType: "like-no",
									likeOrCollectionId: this.copyLikeOrCollectionOfUser[i].id
								}
							}
						}

					}
				}
				// 上面构造完成，下面就请求接口，进行更新
				if (updateChildCommentList.length > 0) {
					batchUpdateCommentAPI(updateChildCommentList)
						.then((res) => {
							if (res.code == 200) {
								
							} else {
								console.error("服务器发送错误", res.errMsg)
							}
							// 删除信息
							that.updateCommentChildListIndex = []
						})
						.catch((err) => {
							console.error("前端发送错误", err)
							that.updateCommentChildListIndex = []
						})
				}


			}
			// 在进行前将所有当前已经开启的子评论全部关闭
			for (let i = 0; i < this.isLookChildCommentIndex.length; i++) {
				if (this.isLookChildCommentIndex[i] != index)
					this.$set(this.showChildFlag, this.isLookChildCommentIndex[i], false)
			}
			if (!this.showChildFlag[index]) {
				that.showChildFlag[index] = true
				that.currentUserLikePostFlagOfChild = []
				// 发送请求获取数据
				getCommentAPI(1, 2000, this.postData.id, this.commentList[index].commentId)
					.then((res) => {
						for (let i = 0; i < res.data.length; i++) {
							res.data[i].createTime = handleTime(res.data[i].createTime)
						}
						if (res.code == 200) {
							that.commentListOfChild = res.data
							// 表示是第一次展开需要进行初始化
							for (let i = 0; i < res.data.length; i++) {
								that.checkPostIsMyLike(i, 2, index)
							}
							that.isLookChildCommentIndex[that.isLookChildCommentIndex.length] = index
						} else {
							showErr(res.code)
						}
					})
					.catch((err) => {
						console.error("前端发送错误", err)
					})
			} else {
				this.$set(this.showChildFlag, index, false)
				
			}
		},
		postComment() {
			if(!this.postCommentInfo.content){
				return
			}
			// 发送评论
			uni.showLoading({
				title:"上传中...",
				mask:true
			})
			postCommnetAPI(this.postCommentInfo)
				.then((res) => {
					if (res.code == 110) {
						showErr("含有敏感词汇" + res.data)
						uni.hideLoading()
						return
					}
					else if (res.code == -1) {
						showErr("系统错误!请联系管理员")
						uni.hideLoading()
						return
					}
					this.pageIndex = 1
					this.commentList = []
					showSuccess("评论成功")
					this.postCommentInfo.content = ""
					this.init()
					uni.hideLoading()
				})
				.catch((err) => {
					uni.hideLoading()
					showErr(err)
				})
		},
		back() {
			// 返回上一级页面
			uni.navigateBack()
		},
		showImage(index) {
			uni.previewImage({
				urls: [this.imageBaseUrl + this.imageUrlList[index]]
			})
		},
		// 前往投诉举报页面
		gotoReport(type, index) {
			// 将页面数据进行json字符串化
			// 判断类型，是举报的是评论还是帖子
			let url = "/pages/funpage/post-report-page/post-report-page?type=" + type + "&jsonStr=";
			if (type == "post") {
				// 举报的帖子
				url += JSON.stringify(this.postData)
			}
			else if (type == "commentOfParent") {
				// 举报的根评论
				url += JSON.stringify(this.commentList[index])
			} else {
				// 举报的子评论
				url += JSON.stringify(this.commentListOfChild[index])
			}
			uni.navigateTo({
				url: url
			})
		},
		copyInfo(info) {
			uni.setClipboardData({
				data: info,
				success() {
					uni.showToast({
						icon: "success",
						title: info,
						duration: 1200
					})
				},
				fail() {
					uni.showToast({
						icon: "error",
						title: "复制失败",
						duration: 1000
					})
				}
			})
		},
	}
}
</script>

<style scoped>
* {
	margin: 0rpx;
	padding: 0rpx;
	box-sizing: border-box;
	font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
}

.poster-info {
	width: 100%;
	min-height: 200rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 3rpx solid lightgray;
}

.post-info-base-info {
	display: flex;
}

.avatar {
	width: 160rpx;
	height: 160rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}

.avatar image {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
}

.name-time-box {
	height: 120rpx;
	padding: 30rpx 15rpx;
	color: lightgray;
	font-size: small;
	display: flex;
	flex-direction: column;
}

.name-time-box .time {
	margin-top: 30rpx;
}

.fun-box {
	width: 120rpx;
	height: 120rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
}

.fun-box image {
	width: 50rpx;
	height: 50rpx;
}

.post-detail-info-box {
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-top: 30rpx;
	border-bottom: 2rpx solid lightgray;
}

.post-detail-info-box .post-content {
	width: 85%;
	font-size: small;
}

.image-box {
	width: 85%;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	flex-wrap: wrap;
	margin: 10rpx 5rpx;
}

.image-box image {
	width: 160rpx;
	height: 160rpx;
	border-radius: 10rpx;
	margin: 10rpx;
	object-fit: contain;
}

.contact-info {
	width: 85%;
}

.contact {
	margin: 15rpx 60rpx;
	color: #333333;
	font-size: small;
}

.contact view {
	margin-top: 15rpx;
}

.comment-item {
	width: 95%;
	min-height: 160rpx;
	display: flex;
	flex-direction: column;
	border-radius: 15rpx;
	border-bottom: 2rpx solid lightgray;
}

[v-cloak] {
	display: none;
}

.comment-item .base-info-box {
	display: flex;
}

.base-info-box .avatar {
	width: 80rpx;
	height: 80rpx;
	margin: 12rpx;
	display: flex;
}

.base-info-box .avatar image {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	background-color: #333;
}

.base-info-box .name-and-time {
	height: 80rpx;
	color: #333;
	font-size: small;
	margin-top: 12rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.comment-text {
	margin: 15rpx 80rpx;
	font-size: 26rpx;
}

.other-info-box {
	display: flex;
	width: 100%;
	flex-direction: row-reverse;
	align-items: center;
}

.other-info-box image {
	width: 36rpx;
	height: 36rpx;
}

.other-info-box .like,
.reply {
	display: flex;
	justify-content: center;
	align-items: center;
	color: lightgray;
}

.like {
	margin: 0rpx 20rpx;
}

.button-box {
	width: 100%;
	display: flex;
	justify-content: space-around;
	position: fixed;
	bottom: 30rpx;
	display: flex;
	justify-content: center;
}

.button-box-inner-box {
	width: 75%;
	display: flex;
	justify-content: space-around;

}

.replayComment {
	width: 100%;
	margin-left: 30rpx;
	display: flex;
	flex-direction: column;
}

.comment-input {
	height: 120rpx;
	width: 100%;
	position: fixed;
	display: flex;
	flex-direction: column;
	bottom: 0;
	justify-content: center;
	box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
	background-color: #f0f0f0;
}

.delet {
	margin: 10rpx;
}</style>
