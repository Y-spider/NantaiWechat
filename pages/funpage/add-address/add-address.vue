<template>
	<view>
		<NavigationSelf :title="title"></NavigationSelf>
		<view class="form">
			<view style="display: flex;justify-content: space-between;gap: 30rpx; margin: 30rpx 0;">
				<view style="font-weight: bolder;">地址信息</view>
				<view>
					<switch @change="changeSwitch" :checked="ruleForm.isDefault" color="#FFCC33" style="transform:scale(0.7);"/>
					默认收货地址
				</view>
			</view>
			<uni-forms ref="baseForm" v-model="ruleForm" :rules="rules">
				<uni-forms-item label="姓名" name="contactPeople" required>
					<uni-easyinput v-model="ruleForm.contactPeople" placeholder="请输入联系人" />
				</uni-forms-item>
				<uni-forms-item label="手机号" name="phone" required>
					<uni-easyinput v-model="ruleForm.phone" placeholder="请输入联系手机号" />
				</uni-forms-item>
				<uni-forms-item label="所在地区" name="addressDistrict" required>
					<uni-easyinput v-model="ruleForm.addressDistrict" placeholder="省 市 区 街道" />
				</uni-forms-item>
				<uni-forms-item label="详细地址" name="addressDetail" required>
					<uni-easyinput v-model="ruleForm.addressDetail" placeholder="小区 写字楼 门牌号等" />
					<!-- 暂时不加地图选择收货地址 -->
				</uni-forms-item>
				<button class="button" @click="submit">保存地址</button>
			</uni-forms>
		</view>
	</view>
</template>

<script>
	import NavigationSelf from "../../common-components/head/head.vue";
	import {addAddressAPI,modifyAddressAPI,getByIdAPI} from "@/api/addressApi.js"
	import { showErr, showSuccess } from "../../../common/common-js";
	export default {
		components: {
			NavigationSelf
		},
		data() {
			return {
				title: "添加收货地址",
				ruleForm: {
					id:null,
					contactPeople: "",
					phone: "",
					addressDistrict: "",
					addressDetail: "",
					isDefault: false
				},
				rules: {
					contactPeople: {
						rules: [{ required: true, errorMessage: "请填写联系人" }]
					},
					phone: {
						rules: [{ required: true, errorMessage: "请填写手机号" }]
					},
					addressDistrict: {
						rules: [{ required: true, errorMessage: "请填写地址" }]
					},
					addressDetail: {
						rules: [{ required: true, errorMessage: "请填写详细地址" }]
					}
				}
			};
		},
		onLoad(option){
			this.title = option.title
			this.ruleForm.id = option?.id || null
			if(this.ruleForm.id){
				getByIdAPI(this.ruleForm.id).then((res)=>{
					if(res.code == 200){
						this.ruleForm.id = res.data.id
						this.ruleForm.contactPeople = res.data.contactPeople
						this.ruleForm.phone = res.data.phone
						this.ruleForm.addressDistrict = res.data.addressDistrict
						this.ruleForm.addressDetail = res.data.addressDetail
						this.ruleForm.isDefault = res.data.isDefault
					}
				})
			}
		},
		methods: {
			changeSwitch(e) {
				this.ruleForm.isDefault = !this.ruleForm.isDefault;
			},
			submit() {
				this.$refs.baseForm.validate().then((res) => {
					if(this.ruleForm.id){
						modifyAddressAPI(this.ruleForm).then((res)=>{
							if(res.code == 200){
								showSuccess("保存成功")
								uni.navigateBack()
								return
							}
							else{
								showErr(res.errMsg)
							}
						}).catch((err)=>{
							showErr(err + "")
						})
					}
					else{
						addAddressAPI(this.ruleForm).then((res)=>{
							if(res.code == 200){
								showSuccess("保存成功")
								uni.navigateBack()
							}
							else{
								showErr(res.errMsg)
							}
							
						}).catch((err)=>{
							showErr(err+"")
						})
					}
				}).catch((err) => {
					console.log("表单错误信息：", err);
				});
			}
		}
	};
</script>