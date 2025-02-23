<template>
	<!-- 资源共享页面 -->
	<view class="box">
		<PopWebsite :isShow="isShowWebSitePop"></PopWebsite>
		<PopDocument :isShow="isShowDocumentPop"></PopDocument>
		<NavigationSelf title="资源共享"></NavigationSelf>
	
		<uni-fab ref="fab" :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical"
					:direction="direction" @trigger="trigger" @fabClick="fabClick" />
		<view class="search-box">
			<!-- 搜索栏 -->
			<uni-search-bar class="uni-mt-10" radius="100" placeholder="请输入搜索内容" clearButton="none" cancelButton="none" @confirm="search" />
		</view>
		<view class="navigate-bar">
			<view class="navigate-item,website" >
				<view :class="styleList[0]" @click="changeChoose(0)" >网站</view>
			</view>
			<view class="show-type-picker"> <picker :range="showTypeList"  @change="changeShowType">{{realShowTypeContentList[pageType]}}</picker></view>
			<view class="navigate-item,doucment">
				<view :class="styleList[1]" @click="changeChoose(1)" >文档</view>
			</view>
		</view>
		<view class="website-content-box" v-if="selectedIndex==0">
			<!-- 展示常用网站信息区域 -->
			<view class="website-content-item" v-for="(website,index) in websiteDataList" :key="index" @longpress="copyUrl(website.url)">
				<view class="website-name" style="font-size: larger; margin: 5rpx 0rpx; display: flex;justify-content: space-between; font-size: small;">
					<view>网站名称：{{website.title}}</view>
					<view v-if="website.state==0" style="border-radius: 15rpx;background-color: #d30000;color: white; margin-right: 10rpx;">审核中</view>
				</view>
				<view class="website-url" style="margin: 5rpx 0rpx;">
					<view style="color: deepskyblue;" @click="copyUrl(website.url)">网站地址：{{website.url}}</view>
				</view>
				<view class="website-des" style="font-size: small; margin: 5rpx 0rpx;">
					<view style="display: flex;align-items: center; justify-content: space-between;">
						<view style="display: flex;align-items: center; justify-content: center; color: #7572cc;" @click="showWebSiteDes(index)"><text>点击查看详情</text><image v-if="isShowDesFlagList[index]==false" src="../../../static/向下箭头.png"></image> <image v-else src="../../../static/向上箭头.png"></image>
							<text style="color: #ccc; margin-left: 5rpx;">{{website.createTime}}</text>
						</view>
						<view style="display: flex;justify-content: center; align-items: center; margin: 15rpx 0rpx; margin-right: 50rpx;"><image src="../../../static/浏览.png" style="margin-left: 5rpx 0rpx;"></image><text style="padding-left: 5rpx;">{{website.lookCount}}</text></view>
					</view>
				</view>
				<view class="website-des-box" v-if="isShowDesFlagList[index]==true">
					<!-- 这里展示网站的描述信息 -->
					<view class="website-des">
						{{website.des}}
					</view>
				</view>
			</view>
		</view>
		<view class="document-content-box" v-else>
			<!-- 展示文档下载信息区域 -->
			<view class="document-content-item" v-for="(document,index) of docDataList" :key="index">
				<view class="base-info" style="display: flex; align-items: center; justify-content: space-between;">
					<view style="display: flex;justify-content: center;align-items: center;">
						<view class="avatar">
							<image mode="aspectFill" :src="baseImageUrl+document.avatar+'?time='+new Date().getTime()"></image>
						</view>
						<view class="post-info" style="color: #ccc; font-size: small;">
							<view>{{document.name}}</view>
							<view>{{document.createTime}}</view>
						</view>
					</view>
					<view v-if="document.state==0" style="height: 32rpx; font-size: small; border-radius: 15rpx;background-color: #d30000;color: white; margin-right: 10rpx;">审核中</view>
				</view>
				<view class="doc-name" style="font-size: small; margin-left: 12rpx; margin-top: 15rpx;">
					<view>{{document.docName}}</view>
					<text>大小: {{MycalcSize(document.docSize)}}</text>
				</view>
				<view class="doc-des" style="font-size: small; margin: 5rpx 0rpx;">
					<view style="display: flex;align-items: center; justify-content: space-between;">
						<view style="display: flex;align-items: center; justify-content: center; color: #7572cc;" @click="showDocmentInfo(index)">
							<text>点击查看详情</text><image v-if="isShowDocumentFlagList[index]==false" src="../../../static/向下箭头.png"></image> <image v-else src="../../../static/向上箭头.png"></image>
							<view><image v-if="document.imageCount!=0" src="../../../static/图片.png" style="width: 32rpx; height: 32rpx; margin-left: 10rpx;"> <text v-if="document.imageCount > 0">{{document.imageCount}}</text></image></view>
						</view>
						<view style="display: flex;justify-content: center; align-items: center; margin: 15rpx 0rpx; margin-right: 50rpx;"><image src="../../../static/下载.png" style="margin-left: 5rpx 0rpx;"></image><text style="padding-left: 5rpx;">{{document.downloadCount}}</text></view>
					</view>
				</view>
				<view v-if="isShowDocumentFlagList[index]==true">
					<view style="font-size: small; margin: 15rpx;">
						{{document.docDes}}
					</view>
					<view>
						<image class="document-iamge" v-for="(url,indexOfUrl) in documentImageUrlList" :key="indexOfUrl" :src="baseDocumentImageUrl+url+'?time='+new Date().getTime()" @click="showImag(indexOfUrl)">
							
						</image>
					</view>
					<view style="width: 100%; display: flex;flex-direction: row-reverse;" v-if="document.state!=0">
						<button size="mini" style="background-color: #332cff; margin:10rpx;color: white;" @click="downloadFile(index)">获取下载链接</button>
						<!-- <view class="downloadProgress" style="margin-left: 10rpx;" v-if="isShowDocumentDownloadProgress[index]==true">{{downloadProgress}}%</view> -->
					</view>
				</view>
			</view>
		</view>
		<StateComponent v-if="arriveBottomFlagList[0] == true || arriveBottomFlagList[1]==true"></StateComponent>
	</view>
</template>

<script>
	import NavigationSelf from "../../common-components/head/head.vue";
	import PopWebsite from "../../common-components/website-input-pop/pop-website.vue"
	import PopDocument from "../../common-components/document-input-pop/pop-document.vue"
	import {listWebSitePageAPI,modifyWebsiteInfoAPI} from "../../../api/websiteApi.js"
	import {listDocumentPageAPI,listDocumentImageUrlAPI,getDocumentDownloadUrlAPI} from  "../../../api/documentApi.js"
	import { showErr, showSuccess ,handleTime,calcFileSize} from "../../../common/common-js";
	import StateComponent from "../../common-components/stateComponent/stateComponent.vue"
		export default {
			components:{
				NavigationSelf,
				PopWebsite,
				PopDocument,
				StateComponent
			},
			async onLoad(){
				let res = await listWebSitePageAPI(this.pageIndexOfWebSite,this.pageSizeOfWebSite,null,this.pageType)
				if(res.code == 200){
					if(res.data.length < this.pageSizeOfWebSite){
						this.arriveBottomFlagList[0] = true
					}
					for(let i = 0; i< res.data.length;i++){
						res.data[i].createTime = handleTime(res.data[i].createTime)
						this.isShowDesFlagList[this.isShowDesFlagList.length] = false
						this.isNeedModifyWebSiteFlagList[this.isNeedModifyWebSiteFlagList.length] = false
					}
					this.websiteDataList = res.data
				}
				else{
					showErr(res.errMsg)
				}
				// 获取文档内容
				let res_doc = await listDocumentPageAPI(this.pageIndexOfDocument,this.pageSizeOfDocument,null,this.pageType)
				if(res_doc.code == 200){
					for(let i = 0;i < res_doc.data.openDocuments.length;i++){
						res_doc.data.openDocuments[i].createTime = handleTime(res_doc.data.openDocuments[i].createTime)
						this.isShowDocumentDownloadProgress[this.isShowDocumentDownloadProgress.length] = false
						if(res_doc.data.openDocuments[i].docDes == null){
							res_doc.data.openDocuments[i].docDes = ""
						}
						this.isShowDocumentFlagList[this.isShowDocumentFlagList.length] = false
					}
					this.docDataList = res_doc.data.openDocuments
					if(res_doc.data.openDocuments.length < this.pageSizeOfDocument){
						this.arriveBottomFlagList[1] = true
					}
				}
				else{
					showErr(res.errMsg)
				}
			},
			async onReachBottom(){
				// 下拉更新
				if(this.selectedIndex == 0){
					// 表示当前浏览的是网站部分
					if(this.arriveBottomFlagList[0] == false){
						// 表示需要发起请求
						// 根据不同的类型发起请求
						let nowPageType = this.pageType
						let res = null;
						if((nowPageType ==0 || nowPageType == 5 || nowPageType == 6) && this.searchContent != ""){
							res = await listWebSitePageAPI(++this.pageIndexOfWebSite,this.pageIndexOfWebSite,this.searchContent,nowPageType)
						}
						else if((nowPageType ==0 || nowPageType == 5 || nowPageType == 6) && this.searchContent == ""){
							res = await listWebSitePageAPI(++this.pageIndexOfWebSite,this.pageIndexOfWebSite,null,nowPageType)
						}
						else if((nowPageType == 1 || nowPageType == 3 || nowPageType == 4) && this.searchContent != ""){
							res = await listWebSitePageAPI(++this.pageIndexOfWebSite,this.pageIndexOfWebSite,this.searchContent,nowPageType)
						}
						else if((nowPageType == 1 || nowPageType == 3 || nowPageType == 4) && this.searchContent == ""){
							res = await listWebSitePageAPI(++this.pageIndexOfWebSite,this.pageIndexOfWebSite,null,nowPageType)
						}
						else if(nowPageType == 2 && this.searchContent != ""){
							res = await listWebSitePageAPI(++this.pageIndexOfWebSite,this.pageIndexOfWebSite,this.searchContent,nowPageType)
						}
						else if(nowPageType == 2 && this.searchContent == ""){
							res = await listWebSitePageAPI(++this.pageIndexOfWebSite,this.pageIndexOfWebSite,null,nowPageType,uni.getStorageSync("userInfo").openid)
						}
						// 处理获取的结果
						
						if(res.code == 200){
							for(let i = 0;i < res.data.length;i++){
								res.data[i].createTime = handleTime(res.data[i].createTime)
								this.isNeedModifyWebSiteFlagList[this.isNeedModifyWebSiteFlagList.length] = false
								this.isShowDesFlagList[this.isShowDesFlagList.length] = false
							}
							this.websiteDataList = [...this.websiteDataList,...res.data]
							if(res.data.length < this.pageSizeOfWebSite){
								this.$set(this.arriveBottomFlagList,0,true)
							}
						}
						else{
							showErr("系统错误"+res.errMsg)
						}
					}
					else{
						// 无需进行请求
					}
				}
				else if(this.arriveBottomFlagList[1] == false){
					// 表示当前浏览的是文档部分
					// 表示需要发起请求
					// 根据不同的类型发起请求
					let nowPageType = this.pageType
					let res_doc = null;
					if((nowPageType ==0 || nowPageType == 5 || nowPageType == 6) && this.searchContent != ""){
						res_doc = await listDocumentPageAPI(++this.pageIndexOfDocument,this.pageSizeOfDocument,this.searchContent,nowPageType)
					}
					else if((nowPageType ==0 || nowPageType == 5 || nowPageType == 6) && this.searchContent == ""){
						res_doc = await listDocumentPageAPI(++this.pageIndexOfDocument,this.pageSizeOfDocument,null,nowPageType)
					}
					else if((nowPageType == 1 || nowPageType == 3 || nowPageType == 4) && this.searchContent != ""){
						res_doc = await listDocumentPageAPI(++this.pageIndexOfDocument,this.pageSizeOfDocument,this.searchContent,nowPageType)
					}
					else if((nowPageType == 1 || nowPageType == 3 || nowPageType == 4) && this.searchContent == ""){
						res_doc = await listDocumentPageAPI(++this.pageIndexOfDocument,this.pageSizeOfDocument,null,nowPageType)
					}
					else if(nowPageType == 2 && this.searchContent != ""){
						res_doc = await listDocumentPageAPI(++this.pageIndexOfDocument,this.pageSizeOfDocument,this.searchContent,nowPageType)
					}
					else if(nowPageType == 2 && this.searchContent == ""){
						res_doc = await listDocumentPageAPI(++this.pageIndexOfDocument,this.pageSizeOfDocument	,null,nowPageType,uni.getStorageSync("userInfo").openid)
					}
					// 处理获取的结果
					
					if(res_doc.code == 200){
						for(let i = 0;i < res_doc.data.openDocuments.length;i++){
							this.isShowDocumentDownloadProgress[this.isShowDocumentDownloadProgress.length] = false
							res_doc.data.openDocuments[i].createTime = handleTime(res_doc.data.openDocuments[i].createTime)
							this.isShowDocumentFlagList[this.isShowDesFlagList.length] = false
						}
						this.docDataList = [...this.docDataList,...res_doc.data.openDocuments]
						if(res_doc.data.openDocuments.length < this.pageSizeOfWebSite){
							this.$set(this.arriveBottomFlagList,1,true)
						}
					}
					else{
						showErr("系统错误"+res.errMsg)
					}
					
				}

				
			},
			data() {
				return {
					styleList:["selected-style","no-selected-style"],
					selectedIndex:0, // 默认进入选中的是常用网站
					title: 'uni-fab',
					directionStr: '垂直',
					horizontal: 'right',
					vertical: 'bottom',
					direction: 'horizontal',
					pattern: {
						color: '#7A7E83',
						backgroundColor: '#fff',
						selectedColor: '#007AFF',
						buttonColor: '#ccc',
						iconColor: '#fff'
					},
					content:[
							{
								iconPath:this.$baseImageUrl+"/icon/网站.png",
								selectedIconPath: '',
								text: '网站',
								active: false
							},
							{
								iconPath: this.$baseImageUrl+"/icon/文档.png",
								selectedIconPath: '',
								text: '文档',
								active: false
							},
							
						],
					baseDocumentImageUrl:this.$baseDocumentImageUrl,
					websiteDataList:[],
					docDataList:[],
					isShowWebSitePop:false,
					isShowDocumentPop:false,
					pageIndexOfWebSite:1,
					pageSizeOfWebSite:5,
					pageIndexOfDocument:1,
					pageSizeOfDocument:6,
					arriveBottomFlagList:[false,false],  // 0表示网站 1表示文档
					isShowDesFlagList:[],
					isShowDocumentFlagList:[], // 显示详细文档信息
					isNeedModifyWebSiteFlagList:[],
					isShowDocumentDownloadProgress:[], // 标记是否显示下载进度
					oldShowDocumentDownloadProgressIndex:0, // 标记上次显示下载进度的文档列表下标
					baseImageUrl:this.$baseImageUrl,
					realShowTypeContentList:["全部","升序","我的","升序","降序","升序","降序"],// 真实在picker中显示的内容
					showTypeList:["全部","发布时间升序","我的发布","浏览量升序(网站有效)","浏览量降序(网站有效)","下载量升序(文档有效)","下载量降序(文档有效)"],
					pageType:0,  // 对应不同的type表示发起请求携带的参数不同
					documentImageUrlList:[],
					nowShowDocDesIndex:0,  // 记录当前已经打开详细信息的文档的下标
					searchContent:"", // 搜索框内容
					downloadProgress:0, // 下载进度
				}
			},
			methods: {
				MycalcSize(size){
					return calcFileSize(size)
				},
				downloadFile(index){
					let that = this
					uni.showModal({
						content:"获取下载链接每次需要花费10积分，有效时间为60分钟。",
						success(option){
							if(option.confirm){
								uni.showLoading({
									title:"获取中...",
									mask:false
								})
								getDocumentDownloadUrlAPI(that.docDataList[index].id).then((res)=>{
									if(res.code == 200){
										let additional = res.cache?"已经获取了链接,无需重复获取:":"获取链接成功:"
										uni.showModal({
											content:additional+res.data,
											showCancel:false,
											success(option){
												if(option.confirm){
													uni.setClipboardData({
														data:res.data,
														success(){
															showSuccess("复制链接成功!")
														}
													})
												}
											}
										})
									}
								}).catch((err)=>{
									showErr(err+"")
								})
							}
						}
					})
				},
				showImag(index){
					uni.previewImage({
						urls:[this.baseDocumentImageUrl + this.documentImageUrlList[index]]
					})
				},
				async changeShowType(e){
					let oldPageType = this.pageType
					this.pageType = e.detail.value
					// 根据不同的帖子类型，和当前显示的类型发起请求
					if(oldPageType != this.pageType){
						if(this.selectedIndex == 0){
							// 表示选择的网站
							// 需要处理的是网站相关信息
							// 将相关数据进行初始化
							this.websiteDataList = []
							this.$set(this.arriveBottomFlagList,0,false)
							this.pageIndexOfWebSite = 1
							this.isNeedModifyWebSiteFlagList = []
							this.isShowDesFlagList = []
							// 根据不同的pageType携带不同的数据，如果选择的是按照下载量进行升序和降序的，那么就按照pageType=0进行处理
							let res = null;
							let nowPageType = this.pageType
							if(nowPageType == 0 ||nowPageType == 5 || nowPageType == 6){
								res = await listWebSitePageAPI(this.pageIndexOfWebSite,this.pageSizeOfWebSite,null,0)
							}
							else if(nowPageType == 1 || nowPageType == 3 || nowPageType == 4){
								res = await listWebSitePageAPI(this.pageIndexOfWebSite,this.pageSizeOfWebSite,null,nowPageType)
							}
							else if(nowPageType == 2){
								res = await listWebSitePageAPI(this.pageIndexOfWebSite,this.pageSizeOfWebSite,null,nowPageType,uni.getStorageSync("userInfo").openid)
							}
							
							// 对返回结果进行处理
							if(res.code == 200){
								for(let i = 0;i < res.data.length ;i++){
									res.data[i].createTime = handleTime(res.data[i].createTime)
									this.isShowDesFlagList[this.isShowDesFlagList.length] = false
									this.isNeedModifyWebSiteFlagList[this.isNeedModifyWebSiteFlagList.length] = false
								}
								this.websiteDataList = res.data
								if(res.data.length < this.pageSizeOfWebSite){
									// 到底
									this.$set(this.arriveBottomFlagList,0,true)
								}
							}
							else{
								showErr("服务器错误"+res.errMsg)
							}
						}
						else{
							// 需要处理的是文档相关信息
							// 将相关数据进行初始化
							this.pageIndexOfDocument = 1
							this.docDataList = []
							this.$set(this.arriveBottomFlagList,1,false)
							this.isShowDocumentFlagList = []
							// 根据不同的pageType携带不同的数据，如果选择的是按照浏览量进行升序和降序的，
							// 那么就按照pageType=0进行处理
							let res_doc = null;
							let nowPageType = this.pageType
							if(nowPageType == 0 || nowPageType == 3 || nowPageType == 4){
								res_doc = await listDocumentPageAPI(this.pageIndexOfDocument,this.pageSizeOfDocument,null,0)
							}
							else if(nowPageType == 1 ||nowPageType == 5 || nowPageType == 6){
								res_doc = await listDocumentPageAPI(this.pageIndexOfDocument,this.pageSizeOfDocument,null,nowPageType)
							}
							else if(nowPageType == 2){
								res_doc = await listDocumentPageAPI(this.pageIndexOfDocument,this.pageSizeOfDocument,null,nowPageType,uni.getStorageSync("userInfo").openid)
							}
							
							// 对返回结果进行处理
							if(res_doc.code == 200){
								for(let i = 0;i < res_doc.data.openDocuments.length;i++){
									this.isShowDocumentDownloadProgress[this.isShowDocumentDownloadProgress.length] = false
									res_doc.data.openDocuments[i].createTime = handleTime(res_doc.data.openDocuments[i].createTime)
									if(res_doc.data.openDocuments[i].docDes == null){
										res_doc.data.openDocuments[i].docDes = ""
									}
									this.isShowDocumentFlagList[this.isShowDocumentFlagList.length] = false
								}
								this.docDataList = res_doc.data.openDocuments
								if(res_doc.data.openDocuments.length < this.pageSizeOfDocument){
									this.arriveBottomFlagList[1] = true
								}
							}
							else{
								showErr("服务器错误"+res.errMsg)
							}
							
						}
					}
				},
				async search(e){
					this.searchContent = e.value
					if(this.selectedIndex == 0){
						// 表示选择的网站
						// 需要处理的是网站相关信息
						// 将相关数据进行初始化
						this.websiteDataList = []
						this.$set(this.arriveBottomFlagList,0,false)
						this.pageIndexOfWebSite = 1
						this.isNeedModifyWebSiteFlagList = []
						this.isShowDesFlagList = []
						// 根据不同的pageType携带不同的数据，如果选择的是按照下载量进行升序和降序的，那么就按照pageType=0进行处理
						let res = null;
						let nowPageType = this.pageType
						if(nowPageType == 0 ||nowPageType == 5 || nowPageType == 6){
							res = await listWebSitePageAPI(this.pageIndexOfWebSite,this.pageSizeOfWebSite,e.value,0)
						}
						else if(nowPageType == 1 || nowPageType == 3 || nowPageType == 4){
							res = await listWebSitePageAPI(this.pageIndexOfWebSite,this.pageSizeOfWebSite,e.value,nowPageType)
						}
						else if(nowPageType == 2){
							res = await listWebSitePageAPI(this.pageIndexOfWebSite,this.pageSizeOfWebSite,null,nowPageType,uni.getStorageSync("userInfo").openid)
						}
						
						// 对返回结果进行处理
						if(res.code == 200){
							for(let i = 0;i < res.data.length ;i++){
								res.data[i].createTime = handleTime(res.data[i].createTime)
								this.isShowDesFlagList[this.isShowDesFlagList.length] = false
								this.isNeedModifyWebSiteFlagList[this.isNeedModifyWebSiteFlagList.length] = false
							}
							this.websiteDataList = res.data
							if(res.data.length < this.pageSizeOfWebSite){
								// 到底
								this.$set(this.arriveBottomFlagList,0,true)
							}
						}
						else{
							showErr("服务器错误"+res.errMsg)
						}
						
					}
					else{
						// 是对文档进行搜索
						// 需要处理的是文档相关信息
						// 将相关数据进行初始化
						this.pageIndexOfDocument = 1
						this.docDataList = []
						this.$set(this.arriveBottomFlagList,1,false)
						this.isShowDocumentFlagList = []
						// 根据不同的pageType携带不同的数据，如果选择的是按照浏览量进行升序和降序的，
						// 那么就按照pageType=0进行处理
						let res_doc = null;
						let nowPageType = this.pageType
						if(nowPageType == 0 || nowPageType == 3 || nowPageType == 4){
							res_doc = await listDocumentPageAPI(this.pageIndexOfDocument,this.pageSizeOfDocument,e.value,0)
						}
						else if(nowPageType == 1 ||nowPageType == 5 || nowPageType == 6){
							res_doc = await listDocumentPageAPI(this.pageIndexOfDocument,this.pageSizeOfDocument,e.value,nowPageType)
						}
						else if(nowPageType == 2){
							res_doc = await listDocumentPageAPI(this.pageIndexOfDocument,this.pageSizeOfDocument,null,nowPageType,uni.getStorageSync("userInfo").openid)
						}
						
						// 对返回结果进行处理
						if(res_doc.code == 200){
							for(let i = 0;i < res_doc.data.openDocuments.length;i++){
								this.isShowDocumentDownloadProgress[this.isShowDocumentDownloadProgress.length] = false
								res_doc.data.openDocuments[i].createTime = handleTime(res_doc.data.openDocuments[i].createTime)
								if(res_doc.data.openDocuments[i].docDes == null){
									res_doc.data.openDocuments[i].docDes = ""
								}
								this.isShowDocumentFlagList[this.isShowDocumentFlagList.length] = false
							}
							this.docDataList = res_doc.data.openDocuments
							if(res_doc.data.openDocuments.length < this.pageSizeOfDocument){
								this.arriveBottomFlagList[1] = true
							}
						}
						else{
							showErr("服务器错误"+res_doc.errMsg)
						}
						
					}
				},
				copyUrl(text){
					uni.setClipboardData({
						data:text,
						success() {
							showSuccess("复制网址成功")
						}
					})
				},
				async showDocmentInfo(index){
					this.documentImageUrlList = []
					this.$set(this.isShowDocumentFlagList,index,!this.isShowDocumentFlagList[index])
					if(index!=this.nowShowDocDesIndex){
						this.$set(this.isShowDocumentFlagList,this.nowShowDocDesIndex,false)
					}
					this.nowShowDocDesIndex = index
					if(this.isShowDocumentFlagList[index] && this.docDataList[index].imageCount > 0){
						// 表示当前帖子有图片信息，需要发起请求获取到图片的部分url
						let res = await listDocumentImageUrlAPI(this.docDataList[index].id)
						if(res.code == 200){
							this.documentImageUrlList = res.data
						}
						else{
							showErr(res.errMsg)
						}
					}
				},
				async showWebSiteDes(index){
					this.$set(this.isShowDesFlagList,index,!this.isShowDesFlagList[index])
					if(this.isNeedModifyWebSiteFlagList[index]==false && this.websiteDataList[index].state!=0){
						let postData = {
							lookCount:this.websiteDataList[index].lookCount+1,
							id:this.websiteDataList[index].id
						}
						let res = await modifyWebsiteInfoAPI(postData)
						if(res.code == 200){
							this.websiteDataList[index].lookCount+=1
							this.$set(this.isNeedModifyWebSiteFlagList,index,true)
						}
						else{
							showErr(res.errMsg)
						}
					}
				},
				fabClick(){
					this.isShowWebSitePop = false
					this.isShowDocumentPop = false
				},
				trigger(e){
					if(e.index == 0){
						this.isShowWebSitePop = !this.isShowWebSitePop
						this.isShowDocumentPop = !this.isShowWebSitePop
					}
					else{
						this.isShowDocumentPop = !this.isShowDocumentPop
						this.isShowWebSitePop = !this.isShowDocumentPop
					}
				},
				changeChoose(index){
					let nowStyleList = this.styleList
					this.selectedIndex = index
					if(index==0){
						nowStyleList[0] = "selected-style"
						nowStyleList[1] = "no-selected-style"
					}
					else{
						nowStyleList[1] = "selected-style"
						nowStyleList[0] = "no-selected-style"
					}
					this.$set(this.styleList,index,"selected-style")
				}
			}
		}
	</script>

<style scoped>
	html,body,.box{
		width: 100%;
		min-height: 100%;
	}
	.navigate-bar{
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 36rpx;
		
	}
	.navigate-item{
		width:50%;
		display:flex;
		justify-content: center;
		align-items: center;
	}
	.selected-style{
		color:#007AFF;
		/* 还要有下划线 */
		border-bottom: 10rpx solid #007AFF;
	},
	.no-selected-style{
		color: black;
		border: none;
	}
	
	.website-content-box{
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 15rpx;
	}
	.website-content-item,.document-content-item{
		width: 98%;
		display: flex;
		flex-direction: column;
		margin: 30rpx 0rpx;
		border-bottom: 3rpx solid #ccc;
	}
	img{
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
	}
	image{
		width: 32rpx;
		height: 32rpx;
	}
	.website-url{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.base-info{
		width: 100%;
		display: flex;
	}
	.avatar{
		margin-left: 18rpx;
	}
	.avatar image{
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
	}
	.post-info{
		margin-left: 12rpx;
	}
	.show-type-picker{
		width: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		border-bottom: 3rpx solid #ccc;
	}
	.document-iamge{
		width: 128rpx;
		height: 128rpx;
		border-radius: 15rpx;
		margin: 10rpx;
	}
	
	
</style>
