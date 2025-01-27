<!-- 启动页面 -->
<template>
<view class="container">
  <image class="logo" src="../../static/爱心.png"></image>
  <text class="text">小程序启动中，请稍候...</text>
</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad: function () {
		    setTimeout(function () {
		      wx.switchTab({
		        url: "/pages/index/index"
		      })
		    }, 3000)
		  },
		methods: {
			
		}
	}
</script>

<style scoped>
	.container {
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
	  align-items: center;
	  height: 100%;
	}
	
	.logo {
	  width: 200rpx;
	  height: 200rpx;
	}
	
	.text {
	  font-size: 28rpx;
	  color: #666;
	  margin-top: 20rpx;
	}
</style>
