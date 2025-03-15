<template>
	<!-- 购买支付页面 -->
	<view style="background-color: #f7f7f7;height: 100vh;">
		<NavigationSelf :showBack="true"></NavigationSelf>
		<view class="box" style="display: flex;flex-direction: column;justify-content: center;width: 100vw;">
			<view class="post-info" style=" display: flex; gap: 15rpx;margin: 15rpx;background-color: #fff;">
				<view class="image-box">
					<image v-if="imageUrl.length > 0" mode="aspectFill" :src="baseImgUrl+imageUrl[0]" style="width: 260rpx;height: 260rpx;"></image>
					<image v-else mode="aspectFill" src="@/static/暂无图片无字.png" style="width: 260rpx;height: 260rpx;"></image>
				</view>
				<view class="infp-box" style="display: flex; flex-direction: column;gap: 5rpx;justify-content: space-between;">
					<view class="title">{{postData.title}}</view>
					<view class="price" style="color: red;">￥{{postData.price}}</view>
				</view>
			</view>
			<view class="address-card" style="display: flex; background-color: #fff; padding: 15rpx;margin: 15rpx;border-radius: 10%;">
				<view @click="toAddressPage" class="loacation-icon" style="width: 100vw;display: flex;justify-content: space-between;align-items: center; column-gap: 10rpx; gap: 15rpx;">
					<uni-icons type="map-pin-ellipse" size="30"></uni-icons>
					<view class="address" v-if="address">
						<view>{{address.addressDistrict}} {{address.addressDetail}}</view>
						<view class="contact-method" style="color: #d4d4d4;"> {{address.contactPeople}}  {{address.phone}}</view>
					</view>
					<view v-else>
						添加新地址
					</view>
					<uni-icons type="forward" size="30"></uni-icons>
				</view>	
			</view>
			<view class="post-method" style="width: 90vw;margin: 15rpx; display: flex;justify-content: space-between;
						border-radius: 30rpx;background-color: #fff;
						padding: 15rpx; line-height: 50rpx; align-items: center;"	
			>
				<text>运费</text>
				<text>{{postData.sendType}}</text>
			</view>
			<!-- 选择支付方式 -->
			<view style="width: 90vw;margin: 15rpx; display: flex;justify-content: space-between;
						border-radius: 30rpx;background-color: #fff;
						padding: 15rpx; line-height: 50rpx; align-items: center;">
				<text>支付方式</text>
				<picker mode = selector :range="payTypes" :value="payTypeIndex" @change="changePayType">
					<view class="uni-input" style="color: red;">{{payTypes[payTypeIndex]}}</view>
				</picker>
			</view>
			<view v-if="showOtherPayDialog"  style="width: 90vw;margin: 15rpx; display: flex;flex-direction: column;
						border-radius: 30rpx;background-color: #fff;
						padding: 15rpx; line-height: 50rpx; align-items: center;">
				<view style="width: 100%; display: flex;gap: 120rpx;column-gap: 30rpx;">
					<text>支付账号:</text>
					<input type="text" v-model="otherPayInfo.account" placeholder="请输入支付账号"/>
				</view>
			</view>
			<view v-if="showOtherPayDialog"  style="width: 90vw;margin: 15rpx; display: flex;flex-direction: column;
						border-radius: 30rpx;background-color: #fff;
						padding: 15rpx; line-height: 50rpx; align-items: center;">
				<view style="width: 100%; display: flex;gap: 120rpx;column-gap: 30rpx;">
					<text>支付密码:</text>
					<input type="password" v-model="otherPayInfo.password" placeholder="请输入支付密码"/>
				</view>
			</view>
			
			<view class="buy-button" style="width: 100vw;display: flex;justify-content: center; margin-top: 60rpx;">
				<view @click="doBuy" style="width: 80%; line-height:100rpx; display: flex;justify-content: center;align-items: center;color: white;background-color: #ff3b00;">确认购买 ￥{{postData.price}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import NavigationSelf from "../../common-components/head/head.vue"
	import { getPostByPostIdAPI } from "../../../api/PostApi"
	import { showErr, showSuccess } from "../../../common/common-js.js"
	import { getImageUrlAPI } from "../../../api/postDetailApi.js"
	import {getDefaultAddressAPI} from "@/api/addressApi.js"
	import {getPrePayIdAPI,payOrderOtherAPI} from "@/api/payApi.js"
	export default {
		components:{
			NavigationSelf
		},
		data() {
			return {
				otherPayInfo:{
					account:"",
					password:""
				},
				showOtherPayDialog:false, // 是否展示其他支付方案时输入信息
				payTypeIndex:0,
				payTypes:["微信支付","支付宝支付","中国邮政支付","中国银行支付","农业银行支付"], // 支付方式
				postId:"",
				postData:"",
				imageUrl:[],
				baseImgUrl:this.$baseImageUrl,
				address:null
			}
		},
		onLoad(option){
			this.postId = option?.postId
			this.init()
		},
		onShow(){
			this.init()
		},
		methods: {
			changePayType(e){
				// 改变支付方式
				this.payTypeIndex = e.detail.value
				if(this.payTypeIndex==0){
					this.showOtherPayDialog = false
					return
				}
				this.showOtherPayDialog = true
			},
			doBuy(){
				let payMethod = this.payTypes[this.payTypeIndex]
				console.log("this.otherPayInfo",this.otherPayInfo)
				if((this.otherPayInfo.account=="" || this.otherPayInfo.password=="")&&payMethod!="微信支付"){
					showErr("支付账号或密码不能为空!")
					return
				}
				uni.showLoading({
					mask:true,
					title:"支付中..."
				})
				// 发起购物请求
				getPrePayIdAPI(this.postId).then((res)=>{
					if(payMethod!="微信支付"){
						payOrderOtherAPI(payMethod,this.postId).then((res)=>{
							if(res.code == 200){
								uni.showModal({
									content:"支付成功!",
									showCancel:false,
									success(){
										uni.navigateBack()
									}
								})
							}
						}).catch((err)=>{
							console.log(err+"")
						}).finally(uni.hideLoading())
						return;
					}
					if(res.code == 200 && res.data){
						let orderInfo = {
						        "noneStr": res.data.nonceStr, // 随机字符串
						        "package": res.data.Ipackage,        // 固定值
						        "timeStamp": res.data.timeStamp,          // 时间戳（单位：秒）
						        "signType": res.data.signType ,// 签名，这里用的 MD5/RSA 签名
								"paySign":res.data.paySign
						    }
						uni.requestPayment({
						    "provider": "wxpay",
						    "nonceStr": res.data.nonceStr, // 随机字符串
						    "package": res.data.ipackage,        // 固定值
						    "timeStamp": res.data.timeStamp,          // 时间戳（单位：秒）
						    "signType": res.data.signType ,// 签名，这里用的 MD5/RSA 签名
						    "paySign":res.data.paySign,
						    success(res) {
								console.log("拉起支付成功",res)
							},
						    fail(e) {
								console.log("拉起支付失败",e)
								console.log(orderInfo)
							}
						}).finally(uni.hideLoading())
					}
				})
				
			},
			toAddressPage(){
				// 前往用户收货地址页面
				uni.navigateTo({
					url:"/pages/funpage/address/address"
				})
			},
			init(){
				getPostByPostIdAPI(this.postId).then((res)=>{
					this.postData = res.data
				}).catch((err)=>{
					showErr(err+"")
				})
				getImageUrlAPI(this.postId).then((res)=>{
					this.imageUrl = res.data
				}).catch((err)=>{
					showErr(err+"")
				})
				getDefaultAddressAPI().then((res)=>{
					this.address = res?.data
				}).catch((err)=>{
					showErr(err+"")
				})
			}
		}
	}
</script>

<style scoped>
	
</style>
