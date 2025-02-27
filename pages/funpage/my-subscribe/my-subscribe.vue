<template>
	<view>
		<z-paging ref="paging" v-model="mySubscribeUserList" @query="init">
		<NavigationSelf slot="top" title="我的关注"></NavigationSelf>
		<x-skeleton type="list" :loading="loading" :configs="{gridRows:10}">
		<view class="subscribe-show-box" style="font-size: small;">
			<view class="user-show-item" v-for="user in mySubscribeUserList">
				<view class="info-box" @click="gotoUserPostPage(user)">
					<view class="avatar" style="display: flex; justify-content: center;align-items: center;">
						<image src="../../../static/兼职.png"></image>
					</view>
					<view class="info">
						<class class="title">{{user.name}}</class>
						<class class="fan-count">粉丝数 {{user.fanCount}}</class>
					</view>
				</view>
				<view class="change-button" @click="unSubscribeUser(user)" >
					<view style="color: #d9d9d9;background-color: #f5f5f5;
					line-height: 32rpx;line-height: 60rpx;margin-right: 15rpx;">
					已关注</view>
				</view>
			</view>
		</view>
		</x-skeleton>
		</z-paging>
	</view>
</template>

<script>
	import NavigationSelf from "../../common-components/head/head.vue";
	import {unSubscribeClientUserAPI,listAllSubscribeClientUserAPI} from "../../../api/subscribeApi.js"
	import {showErr,showSuccess} from "../../../common/common-js.js"
	export default {
		components:{
			NavigationSelf
		},
		data() {
			return {
				mySubscribeUserList:[], // 关注用户列表
				loading:true,
				pageIndex:1,
				pageSize:10
			}
		},
		methods: {
			gotoUserPostPage(user){
				// 跳转到关注用户发帖页面
				console.log("user",user)
				uni.navigateTo({
					url:"/pages/funpage/my-post-page/my-post-page?openid=" + user.openid + "&title=用户帖子" +"&flag=true"
				})
				
			},
			unSubscribeUser(user){
				// 取消关注
				let that = this
				uni.showModal({
					title:"确定取消关注?",
					content:"取消关注后将不会再接收该用户的相关发帖动态了",
					success(option){
						if(option.confirm){
							unSubscribeClientUserAPI(user.openid).then((res)=>{
								showSuccess("取关成功")
								that.init()
							})
						}
					}
				})
			},
			init(){
				this.loading = true
				listAllSubscribeClientUserAPI(this.pageIndex,this.pageSize).then((res)=>{
					if(res.code == 200){
						this.$refs.paging.complete(res.data.pageDataList);
					}
				})
				this.loading = false
			}
		}
	}
</script>

<style scoped>
	.user-show-item{
		display: flex;
		justify-content: space-between;
		width: 100vw;
		height: 120rpx;
		background-color: #ffffff;
		border-bottom: 2rpx solid #c8c8c8;
	}
	.info-box{
		display: flex;
	}
	.avatar image{
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		margin: 15rpx;
	}
	.info{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		font-size: large;
	}
	.fan-count{
		color: #c8c8c8;
	}
	.change-button{
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
