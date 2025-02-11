<template>
	<view class="container">
		<NavigationSelf title="使用指南"></NavigationSelf>
		
		<!-- 内容区域 -->
		<scroll-view scroll-y class="content">
			<!-- 欢迎语 -->
			<view class="welcome-section">
				<text class="welcome-title">欢迎使用南泰生活助手</text>
				<text class="welcome-subtitle">让南泰生活更加便捷</text>
			</view>
			<!-- 功能指南列表 -->
			<view class="guide-list">
				<!-- 首页功能指南 -->
				<view class="guide-item">
					<view class="guide-header">
						<text class="guide-title">首页指南</text>
						<text class="guide-desc">快速了解首页功能</text>
					</view>
					<image class="guide-image" src="https://www.chopper.love:6134/icon/index_1.png" mode="aspectFit" @click="previewImage('/index_1.png')"></image>
					<view class="guide-steps">
						<view class="step-item">
							<text class="step-num">1</text>
							<text class="step-text">在首页点击搜索框</text>
						</view>
						<view class="step-item">
							<text class="step-num">2</text>
							<text class="step-text">输入关键词进行搜索</text>
						</view>
						<view class="step-item">
							<text class="step-num">3</text>
							<text class="step-text">选择某个具体类型的，查看相关帖子</text>
						</view>
					</view>
				</view>
				
				<!-- 发布信息指南 -->
				<view class="guide-item">
					<view class="guide-header">
						<text class="guide-title">发布信息</text>
						<text class="guide-desc">快速发布你的校园信息</text>
					</view>
					<image class="guide-image" src="https://www.chopper.love:6134/icon/post_1.png" mode="aspectFit" @click="previewImage('/post_1.png')"></image>
					<view class="guide-steps">
						<view class="step-item">
							<text class="step-num">1</text>
							<text class="step-text">点击底部导航栏的"发布"按钮</text>
						</view>
						<view class="step-item">
							<text class="step-num">2</text>
							<text class="step-text">填写标题、描述和选择分类</text>
						</view>
						<view class="step-item">
							<text class="step-num">3</text>
							<text class="step-text">上传相关图片（选填）</text>
						</view>
						<view class="step-item">
							<text class="step-num">4</text>
							<text class="step-text">选择开启评论或者置顶当前发帖(选填)</text>
						</view>
						<view class="step-item">
							<text class="step-num">5</text>
							<text class="step-text">选择联系方式</text>
						</view>
					</view>
				</view>

				<!-- 消息通知指南 -->
				<view class="guide-item">
					<view class="guide-header">
						<text class="guide-title">消息通知</text>
						<text class="guide-desc">及时接收互动消息</text>
					</view>
					<image class="guide-image" src="https://www.chopper.love:6134/icon/message_1.png" mode="aspectFit" @click="previewImage('/message_1.png')"></image>
					<view class="guide-steps">
						<view class="step-item">
							<text class="step-num">1</text>
							<text class="step-text">点击顶部的消息图标可以进行切换类型</text>
						</view>
						<view class="step-item">
							<text class="step-num">2</text>
							<text class="step-text">查看评论、点赞等通知</text>
						</view>
						<view class="step-item">
							<text class="step-num">3</text>
							<text class="step-text">订阅消息按钮，授权后当帖子有新评论时会通知在微信界面(建议开启)并且请勾选上总是保持选项。</text>
						</view>
					</view>
				</view>
				<view class="guide-item">
					<view class="guide-header">
						<text class="guide-title">发帖规则</text>
						<text class="guide-desc">快速了解系统帖子发帖规则</text>
					</view>
					<image class="guide-image" src="https://www.chopper.love:6134/icon/id_info_1.png" mode="aspectFit" @click="previewImage('/id_info_1.png')"></image>
					<view class="guide-steps">
						<view class="step-item">
							<text class="step-num">1</text>
							<text class="step-text">可以在该页面点击头像修改头像，点击名称修改名称，此外还可以通过使用积分来增加进入发帖数</text>
						</view>
						<view class="step-item">
							<text class="step-num">2</text>
							<text class="step-text">发帖规则：系统会每日凌晨刷新所有用户的今日发帖数为5，若用户今日发帖数用完后还需继续发帖，那么可以使用积分兑换今日发帖数<p style="color: red;">注意今日额外添加的发帖数不会保留！！！请按需兑换</p>积分兑换规则：增加次数不能超过最大上限，每天增加次数不限!增加次数使用积分按照第一次10 第二次20 第3次30 逐渐递增
							</text>
						</view>
					</view>
				</view>
				<view class="guide-item">
					<view class="guide-header">
						<text class="guide-title">模版管理</text>
						<text class="guide-desc">快速了解模版使用规则</text>
					</view>
					<image class="guide-image" src="https://www.chopper.love:6134/icon/template_1.png" mode="aspectFit" @click="previewImage('/template_1.png')"></image>
					<view class="guide-steps">
						<view class="step-item">
							<text class="step-num">1</text>
							<text class="step-text">可以在该页面上传一张图片，如果想要上传微信二维码时，这个就十分的方便</text>
						</view>
						<view class="step-item">
							<text class="step-num">2</text>
							<text class="step-text">联系方式：预先填写你的联系方式</text>
						</view>
						<view class="step-item">
							<text class="step-num">3</text>
							<text class="step-text">开启评论：默认是对帖子评论开启的，但是也可以关闭，这样的话上传的帖子将不能进行评论</text>
						</view>
						<view class="step-item">
							<text class="step-num">4</text>
							<text class="step-text">是否启用模版：默认是不启动的，如果没用启用，用户编写保存后也是不生效的，请注意！</text>
						</view>
					</view>
				</view>
				<view class="guide-item">
					<view class="guide-header">
						<text class="guide-title">资源板块</text>
						<text class="guide-desc">快速了解资源共享</text>
					</view>
					<image class="guide-image" src="https://www.chopper.love:6134/icon/resource_1.png" mode="aspectFit" @click="previewImage('/resource_1.png')"></image>
					<view class="guide-steps">
						<view class="step-item">
							<text class="step-num">1</text>
							<text class="step-text">常用网站：在页面中可以查看和搜索用户分享的网站信息，包含网址，以及网址描述，点击网址可以快速复制。</text>
						</view>
						<view class="step-item">
							<text class="step-num">2</text>
							<text class="step-text">文档下载：在这里可以查看和搜索用户分享的文档信息，点击下载，可以进行下载！</text>
						</view>
						<view class="step-item">
							<text class="step-num">3</text>
							<text class="step-text">上传：点击有下角的 + 号可以展开上传网站和文档页面，在上传页面中可以进行上传对应的合法内容，注意这些内容需要后台管理人员审核后才可以被其他用户查看!</text>
						</view>
					</view>
				</view>
				<view class="guide-item">
					<view class="guide-header">
						<text class="guide-title">首页不显示数据问题</text>
						<text class="guide-desc">解决登陆后首页不显示数据问题</text>
					</view>
					<image class="guide-image" src="https://www.chopper.love:6134/icon/pull_fresh_1.png" mode="aspectFit" @click="previewImage('/pull_fresh_1.png')"></image>
					<view class="guide-steps">
						<view class="step-item">
							<text class="step-num">1</text>
							<text class="step-text">当用户第一次进入小程序时，需要登陆后才可以查看帖子信息，然而当用户登陆成功后返回首页时，发现页面没有变化，这个时候请下拉刷新即可!</text>
						</view>
					</view>
					<view class="guide-steps">
						<view class="step-item">
							<text class="step-num">2</text>
							<text class="step-text">当用户进入小程序时，可能会出现首页一直在加载，这个时候用户可以点击首页右上角三个点打开后选择重启微信小程序，这个bug由于技术原因暂时还没有解决，如果给你带来不好的体验深感歉意!</text>
						</view>
					</view>
				</view>
				<view class="guide-item">
					<view class="guide-header">
						<text class="guide-title">文档下载</text>
						<text class="guide-desc">了解文档下载规则</text>
					</view>
					<image class="guide-image" src="https://www.chopper.love:6134/icon/document_1.png" mode="aspectFit" @click="previewImage('/document_1.png')"></image>
					<image class="guide-image" src="https://www.chopper.love:6134/icon/document_2.png" mode="aspectFit" @click="previewImage('/document_2.png')"></image>
					<view class="guide-steps">
						<view class="step-item">
							<text class="step-num">1</text>
							<text class="step-text">用户每次可以使用10积分获取一次当前文档的下载链接，有效时间为60分钟，在此期间可以重复获取。获取的链接可以在浏览器中下载对应的文档。</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import NavigationSelf from "../../common-components/head/head.vue"
	export default {
		components:{
			NavigationSelf
		},
		data() {
			return {
				
			}
		},
		methods: {
			previewImage(url){
				let baseUrl = "https://www.chopper.love:6134/icon"
				uni.previewImage({
					urls:[baseUrl+url]
				})
			}
		}
	}
</script>

<style scoped>
.container {
	min-height: 100vh;
	background-color: #f8f8f8;
}

.content {
	flex: 1;
	padding: 30rpx;
}

.welcome-section {
	text-align: center;
	margin-bottom: 40rpx;
}

.welcome-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 12rpx;
}

.welcome-subtitle {
	font-size: 28rpx;
	color: #666;
}

.guide-list {
	width: 92vw;
	display: flex;
	flex-direction: column;
	gap: 30rpx;
}

.guide-item {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 24rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.guide-header {
	margin-bottom: 20rpx;
}

.guide-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 8rpx;
}

.guide-desc {
	font-size: 26rpx;
	color: #666;
}

.guide-image {
	width: 100%;
	height: 300rpx;
	border-radius: 12rpx;
	margin-bottom: 20rpx;
}

.guide-steps {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.step-item {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.step-num {
	width: 40rpx;
	height: 40rpx;
	background-color: #3582E9;
	color: white;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
}

.step-text {
	font-size: 28rpx;
	color: #333;
	flex: 1;
}
</style>
