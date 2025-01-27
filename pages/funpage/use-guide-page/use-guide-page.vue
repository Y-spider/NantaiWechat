<template>
	<view>
		<form>
			<label>账号</label>
			<input v-model:value="userAccount" />
			<label>密码</label>
			<input v-model:value="password" type="safe-password"/>
			<button @click="doFun">提交</button>
		</form>
	</view>
</template>

<script>
	import {encodeInp} from "../../../common/common-js.js"
	import {loginClassAPI} from "../../../api/testApi.js"
	export default {
		data() {
			return {
				userAccount:"2102050235",
				password:"Yanwenguang123",
			}
		},
		methods: {
			doFun(){
				let encodeUserAccount = encodeInp(this.userAccount)
				let encodeUserPassword = encodeInp(this.password)
				let postEncodeStr = encodeUserAccount +"%%%"+encodeUserPassword
				console.log("加密后的字符串",postEncodeStr)
				let postData = {
					userAccount:this.userAccount,
					encoded:postEncodeStr
				}
				loginClassAPI(postData)
				.then((res)=>{
					if(res.code == 200){
						console.log(res)
					}
				})
			}
		}
	}
</script>

<style>

</style>
