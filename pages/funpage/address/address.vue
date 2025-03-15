<!-- 用户收货地址页面 -->
<template>
	<view>
		<NavigationSelf title="选择地址"></NavigationSelf>
		<scroll-view class="list-box" scroll-y style="width: 100vw;height: 75vh;">
			<radio-group name="default" @change="radioChange">
			<view class="item" v-for="(address,index) in addressList" >
				<view class="default-radio">
					<radio :value="address.id" :checked="address.isDefault" />
				</view>
				<view class="address-info">
					<vewi style="width: 60vw;">
						<view>
						{{address.contactPeople}}   {{address.phone}}    
						<uni-tag :inverted="true" text="默认" type="success" />
						</view>
					</vewi>
					<view style="color: #d5d5d5;">
						{{address.addressDistrict}}{{address.addressDetail}}
					</view>
				</view>
				<view class="fun" style="display: flex; flex-direction: column;gap: 5rpx; width: 200rpx;">
					<button @click="toModifyPage(address)" size="mini" type="primary"> 修改</button>
					<button @click="deleteAddress(address)"size="mini" type="warn">删除</button>
				</view>
			</view>
			</radio-group>
		</scroll-view>
		<view class="add-button" style="width: 100vw;display: flex;justify-content: center;">
			<view @click="toAddAddress" style="width: 70%; display: flex;justify-content: center;align-items: center; background-color: #ff4e00;color: white;line-height: 120rpx;">添加新地址</view>
		</view>
	</view>
</template>

<script>
	import NavigationSelf from "../../common-components/head/head.vue"
	import {getDefaultAddressAPI,getAllAddressAPI,deleteAddressAPI,changeDefaultAddressAPI} from "@/api/addressApi.js"
	import { showErr, showSuccess } from "../../../common/common-js.js"
	export default {
		components:{
			NavigationSelf
		},
		data() {
			return {
				addressList:[],
				oldId:0
			}
		},
		created(){
			this.init()
		},
		onShow(){
			this.init()
		},
		methods: {
			toModifyPage(address){
				// 前往修改地址信息
				uni.navigateTo({
					url:`/pages/funpage/add-address/add-address?id=${address.id}&title=修改收货地址`
				})
			},
			deleteAddress(address){
				// 删除地址
				deleteAddressAPI(address.id).then((res)=>{
					if(res.code == 200){
						showSuccess("删除成功")
						this.init()
					}
					else{
						showErr(res.errMsh)
					}
				}).catch((err)=>{
					showErr(err+"")
				})
			},
			radioChange(e){
				let params = {
					newId:e.detail.value,
					oldId:this.oldId
				}
				changeDefaultAddressAPI(params.newId,params.oldId).then((res)=>{
					if(res.code == 200){
						uni.navigateBack()
					}
				})
				
			},
			toAddAddress(){
				uni.navigateTo({
					url:`/pages/funpage/add-address/add-address?title=添加收货地址`
				})
			},
			init(){
				getAllAddressAPI().then((res)=>{
					this.addressList = res.data
					this.oldId = this.addressList.find(address => address.isDefault === true).id
				}).catch((err)=>{
					showErr(err+"")
				})
			}
		}
	}
</script>

<style scoped>
.item {
  display: flex;
  gap: 20rpx;
  margin-top: 15rpx;
  background: linear-gradient(135deg, #f5f5f5, #ffffff); /* 渐变背景 */
  border: 1px solid #eaeaea; /* 边框 */
  border-radius: 10rpx; /* 圆角 */
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1); /* 阴影 */
  padding: 15rpx; /* 内边距 */
  position: relative; /* 相对定位 */
  overflow: hidden; /* 防止内容溢出 */
}

.item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.6)); /* 覆盖渐变效果 */
  z-index: -1; /* 确保内容在渐变层之上 */
}

.address-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60vw;
}

.default-radio {
  display: flex;
  align-items: center;
}

.fun {
  display: flex;
  flex-direction: column;
  gap: 5rpx;
  width: 300rpx;
}

.add-button {
  width: 100vw;
  display: flex;
  justify-content: center;
  margin-top: 20rpx;
}

.add-button view {
  width: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ff4e00;
  color: white;
  line-height: 120rpx;
  border-radius: 60rpx; /* 圆角按钮 */
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1); /* 按钮阴影 */
}
</style>
