<template>
  <view class="container">
    <view class="user-list">
      <view 
        class="user-item" 
        v-for="(user, index) in followedUsers" 
        :key="index"
      >
        <image class="avatar" :src="user.avatar" />
        <view class="user-info">
          <text class="user-name">{{ user.name }}</text>
          <text class="user-description">{{ user.description }}</text>
          <text class="like-count">粉丝数: {{ user.likeCount }}</text>
        </view>
        <button class="unfollow-button" @click="unfollowUser(user.id)">已关注</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      followedUsers: [
        { id: 1, name: '袁一琦宝贝喵', description: '女生，泰州学院', likeCount: 10, avatar: 'https://picsum.photos/64/64?random=1' },
        { id: 2, name: '是个泡泡', description: '粉丝数 57.6万', likeCount: 576000, avatar: 'https://picsum.photos/64/64?random=2' },
        { id: 3, name: '小吱小苹果', description: '现居仙东济宁，90后天秤座男生', likeCount: 5, avatar: 'https://picsum.photos/64/64?random=3' },
        { id: 4, name: '未那大叔', description: '粉丝数 203.7万', likeCount: 2037000, avatar: 'https://picsum.photos/64/64?random=4' },
        // ... 更多用户数据
      ]
    }
  },
  methods: {
    unfollowUser(userId) {
      // 取消关注逻辑
      console.log(`取消关注用户ID: ${userId}`);
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20rpx;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.user-item {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 10rpx;
  padding: 15rpx;
  box-shadow: 0 2rpx 5rpx rgba(0, 0, 0, 0.1);
}

.avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  margin-right: 15rpx;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.user-description {
  font-size: 24rpx;
  color: #999;
  margin: 4rpx 0;
}

.like-count {
  font-size: 24rpx;
  color: #666;
}

.unfollow-button {
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 20rpx;
  padding: 10rpx 15rpx;
  font-size: 24rpx;
  cursor: pointer;
  transition: background-color 0.3s;
}

.unfollow-button:hover {
  background-color: #ff4d4d;
}
</style> 