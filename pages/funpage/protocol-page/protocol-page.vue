<template>
	<view class="protocol-container">
		<NavigationSelf title="用户使用协议" />
		
		<!-- 协议标题 -->
		<view class="header">
			<text class="title">使用协议</text>
			<text class="subtitle">请仔细阅读以下协议内容</text>
		</view>

		<!-- 协议前言 -->
		<view class="intro-section">
			在使用南泰生活助手前，您需要仔细阅读以下协议。如果您对以下协议任何条款表示异议，您可以选择不使用南泰生活助手。当您完成登录即表示您已将完全认可本协议中的所有条款。
		</view>

		<!-- 协议内容区 -->
		<scroll-view 
			class="content-section" 
			scroll-y 
			:scroll-top="scrollTop"
			@scroll="handleScroll"
			@scrolltolower="handleScrollToLower"
		>
			<!-- 使用规则 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">使用规则</text>
				</view>
				<view class="section-content">
					<text class="paragraph">
						用户注册或者授权登录成功后，南泰生活助手会给予每一个用户创建一个账户并分配一个用户唯一标识，用户应当对其账户进行所有活动和事件负法律责任。
					</text>
					<text class="paragraph">
						用户需要对南泰生活助手的注册信息的真实性，合法性，有效性承担全部责任，用户不得冒充他人；不得利用他人的名义发布任何信息；不得恶意使用注册账号导致其他用户误认。否则南泰生活助手有权利对其停止服务，收回账号并由用户承担所有法律责任。
					</text>
				</view>

				<!-- 禁止行为列表 -->
				<view class="warning-list">
					<text class="warning-title">禁止行为：</text>
					<view class="warning-items">
						<view class="warning-item" v-for="(item, index) in prohibitedBehaviors" :key="index">
							{{ index + 1 }}. {{ item }}
						</view>
					</view>
				</view>
			</view>

			<!-- 知识产权 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">知识产权</text>
				</view>
				<view class="section-content">
					<text class="paragraph">
						1. 南泰生活助手的所有内容，包括但不限于文字、图片、音频、视频、图表、标识、版面设计、电子文档等均受中华人民共和国著作权法及其他相关法律法规的保护。
					</text>
					<text class="paragraph">
						2. 未经南泰生活助手及相关权利人的明确书面许可，任何人不得以任何方式擅自复制、转载、传播、修改、出版、发行、创造衍生作品或以其他任何方式使用这些内容。
					</text>
					<text class="paragraph">
						3. 用户在平台上发布的原创内容，其著作权归用户本人所有。用户发布的内容即视为授予南泰生活助手一项永久的、不可撤销的、免费的、可再许可的使用权。
					</text>
				</view>
			</view>

			<!-- 个人隐私 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">个人隐私</text>
				</view>
				<view class="section-content">
					<text class="paragraph">
						1. 我们高度重视用户的隐私保护，承诺按照相关法律法规保护用户的个人信息安全。
					</text>
					<text class="paragraph">
						2. 我们收集的信息包括：
					</text>
					<view class="info-list">
						<text class="info-item">• 账号信息（学号、姓名等）</text>
						<text class="info-item">• 设备信息（设备型号、操作系统等）</text>
						<text class="info-item">• 日志信息（使用时间、访问记录等）</text>
						<text class="info-item">• 位置信息（如您授权）</text>
					</view>
					<text class="paragraph">
						3. 我们承诺：
					</text>
					<view class="promise-list">
						<text class="promise-item">• 不会将您的个人信息出售或出租给任何第三方</text>
						<text class="promise-item">• 采取严格的安全措施保护您的个人信息</text>
						<text class="promise-item">• 仅在必要的范围内使用您的个人信息</text>
					</view>
				</view>
			</view>

			<!-- 免责声明 -->
			<view class="section warning">
				<view class="section-header">
					<text class="section-title">免责声明</text>
				</view>
				<view class="section-content">
					<text class="paragraph highlight">
						1. 南泰生活助手是一个由个人开发者维护的信息分享平台，仅为方便校园信息交流使用。平台与任何机构或组织均无从属关系。
					</text>
					<text class="paragraph">
						2. 以下情况，平台开发者不承担任何责任：
					</text>
					<view class="disclaimer-list">
						<text class="disclaimer-item">• 因不可抗力导致的服务中断或数据丢失</text>
						<text class="disclaimer-item">• 用户个人信息泄露系由用户自身原因导致</text>
						<text class="disclaimer-item">• 用户间因使用平台产生的纠纷</text>
						<text class="disclaimer-item">• 第三方未经授权使用用户账号产生的后果</text>
						<text class="disclaimer-item">• 平台服务的及时性、安全性、准确性等方面的风险</text>
					</view>
					<text class="paragraph">
						3. 作为个人开发维护的平台，我们会尽最大努力确保平台的稳定运行，但不对服务的持续性和稳定性作出保证。
					</text>
					<text class="paragraph">
						4. 平台开发者保留在任何时候修改或中断服务而不需通知用户的权利。
					</text>
				</view>
			</view>

			<!-- 定义和解释部分 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">定义和解释</text>
				</view>
				<view class="section-content">
					<text class="paragraph">
						1. "南泰生活助手"：指由个人开发者开发和运营的校园信息服务平台。
					</text>
					<text class="paragraph">
						2. "用户"：指注册、登录、使用本平台的所有自然人。
					</text>
					<text class="paragraph">
						3. "内容"：指用户使用南泰生活助手平台时发布的所有文字、图片、视频、音频等信息。
					</text>
					<text class="paragraph highlight">
						4. 特别说明：本平台为个人开发者独立开发维护的非营利性平台，与任何机构或组织无关。
					</text>
				</view>
			</view>

			<!-- 账号管理部分 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">账号管理</text>
				</view>
				<view class="section-content">
					<text class="paragraph">
						1. 用户应妥善保管账号密码，因账号密码保管不当造成的损失由用户自行承担。
					</text>
					<text class="paragraph">
						2. 如发现账号被他人非法使用，应立即通知平台。
					</text>
					<text class="paragraph">
						3. 平台有权在以下情况时，暂停或终止提供服务：
					</text>
					<view class="list-items">
						<text class="list-item">• 提供虚假注册信息</text>
						<text class="list-item">• 违反平台规则或相关法律法规</text>
						<text class="list-item">• 平台认为用户行为可能损害平台或他人权益</text>
					</view>
				</view>
			</view>

			<!-- 用户行为规范 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">用户行为规范</text>
				</view>
				<view class="section-content">
					<text class="paragraph">
						用户在使用南泰生活助手服务时须遵守以下规定：
					</text>
					<view class="list-items">
						<text class="list-item">• 遵守中华人民共和国相关法律法规</text>
						<text class="list-item">• 遵守所有与网络服务有关的网络协议、规定和程序</text>
						<text class="list-item">• 不得利用平台从事违法违规活动</text>
						<text class="list-item">• 不得干扰平台的正常运营</text>
						<text class="list-item">• 不得利用平台发布虚假信息或侵犯他人权益</text>
					</view>
				</view>
			</view>

			<!-- 信息安全与隐私保护补充 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">信息安全与隐私保护补充</text>
				</view>
				<view class="section-content">
					<text class="paragraph">
						1. 信息使用范围：
					</text>
					<view class="list-items">
						<text class="list-item">• 提供和改进服务</text>
						<text class="list-item">• 确保平台安全运营</text>
						<text class="list-item">• 向您推送相关信息</text>
						<text class="list-item">• 处理您的反馈或请求</text>
					</view>
					<text class="paragraph">
						2. 信息保护措施：
					</text>
					<view class="list-items">
						<text class="list-item">• 数据加密存储和传输</text>
						<text class="list-item">• 访问权限控制</text>
						<text class="list-item">• 定期安全评估</text>
					</view>
				</view>
			</view>

			<!-- 知识产权补充 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">知识产权补充</text>
				</view>
				<view class="section-content">
					<text class="paragraph">
						4. 用户保证其上传内容拥有合法权利，如因知识产权问题引起纠纷，由用户承担全部责任。
					</text>
					<text class="paragraph">
						5. 平台有权但无义务对涉嫌侵权内容进行处理。
					</text>
				</view>
			</view>

			<!-- 协议修改 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">协议修改</text>
				</view>
				<view class="section-content">
					<text class="paragraph">
						1. 平台保留随时修改本协议的权利，修改后的协议将在平台公布。
					</text>
					<text class="paragraph">
						2. 如用户不同意修改后的协议，应当停止使用平台服务。继续使用则视为接受修改后的协议。
					</text>
				</view>
			</view>

			<!-- 服务说明 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">服务说明</text>
				</view>
				<view class="section-content">
					<text class="paragraph">
						1. 本平台为非营利性质的信息服务平台，主要用于校园信息的分享和交流。
					</text>
					<text class="paragraph">
						2. 平台的维护和更新完全依赖个人开发者的业余时间，服务质量可能受到以下因素影响：
					</text>
					<view class="list-items">
						<text class="list-item">• 开发者的个人时间安排</text>
						<text class="list-item">• 技术和资源的限制</text>
						<text class="list-item">• 不可预见的系统故障</text>
					</view>
					<text class="paragraph">
						3. 用户理解并同意，使用本平台服务时可能存在一定的风险和局限性。
					</text>
				</view>
			</view>

			<!-- 争议解决 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">争议解决</text>
				</view>
				<view class="section-content">
					<text class="paragraph">
						1. 本协议受中华人民共和国法律管辖。
					</text>
					<text class="paragraph">
						2. 平台开发者承诺秉持善意原则处理用户反馈的问题。
					</text>
					<text class="paragraph">
						3. 协议履行过程中发生的争议，应首先通过友好协商解决。
					</text>
					<text class="paragraph">
						4. 协商不成的，任何一方均可向开发者所在地有管辖权的人民法院提起诉讼。
					</text>
				</view>
			</view>
		</scroll-view>

		<!-- 底部按钮 -->
		<view class="bottom-buttons">
			<button 
				class="btn agree" 
				:class="{'btn-disabled': !hasReadToBottom}"
				:disabled="!hasReadToBottom"
				@click="confirm"
			>
				{{ hasReadToBottom ? '同意协议' : '请阅读完整协议' }}
			</button>
			<button class="btn cancel" @click="cancle">取消</button>
		</view>
	</view>
</template>

<script>
	import NavigationSelf from "../../common-components/head/head.vue";
	export default {
		components:{
			NavigationSelf
		},
		data() {
			return {
				prohibitedBehaviors: [
					'危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一',
					'煽动民族仇恨、民族歧视，破坏民族团结',
					'散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪',
					'侮辱或者诽谤他人，侵害他人合法权益',
					'含有法律、行政法规禁止的其他内容'
				],
				hasReadToBottom: false,
				scrollTop: 0,
				scrollViewHeight: 0,
				contentHeight: 0,
			}
		},
		mounted() {
			const query = uni.createSelectorQuery().in(this);
			query.select('.content-section').boundingClientRect(data => {
				setTimeout(()=>{
					this.scrollViewHeight = data.height;
				},100)
			}).exec();
			
			query.select('.content-section >>> :last-child').boundingClientRect(data => {
				this.contentHeight = data?.bottom;
			}).exec();
		},
		methods: {
			cancle(){
				uni.navigateBack()
			},
			handleScroll(e) {
				// 使用防抖减少 scrollTop 更新频率
				if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
				this.scrollTimeout = setTimeout(() => {
					this.scrollTop = e.detail.scrollTop;
				}, 100);
			},
			handleScrollToLower() {
				this.hasReadToBottom = true;
				uni.vibrateShort({
					success: function () {
						console.log('震动成功');
					}
				});
			},
			confirm() {
				if (!this.hasReadToBottom) {
					uni.showToast({
						title: '请先阅读完整协议内容',
						icon: 'none'
					});
					return;
				}
				uni.setStorageSync("isConfirmProtocal", true);
				uni.navigateBack();
			},
			calculateScrollViewHeight() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.content-section').boundingClientRect(data => {
					this.scrollViewHeight = data.height;
				}).exec();
			}
		}
	}
</script>

<style scoped>
	.protocol-container {
		min-height: 100vh;
		background-color: #f8f8f8;
		padding-bottom: 120rpx;
	}

	.header {
		padding: 40rpx;
		text-align: center;
		background-color: #fff;
	}

	.title {
		font-size: 36rpx;
		font-weight: 600;
		color: #333;
	}

	.subtitle {
		font-size: 24rpx;
		color: #999;
		margin-top: 8rpx;
	}

	.intro-section {
		margin: 20rpx;
		padding: 30rpx;
		background-color: #fff;
		border-radius: 12rpx;
		font-size: 28rpx;
		line-height: 1.6;
		color: #666;
	}

	.content-section {
		margin: 20rpx;
		height: calc(100vh - 400rpx);
	}

	.section {
		margin-bottom: 30rpx;
		padding: 30rpx;
		background-color: #fff;
		border-radius: 12rpx;
	}

	.section-header {
		margin-bottom: 20rpx;
		border-left: 8rpx solid #007AFF;
		padding-left: 20rpx;
	}

	.section-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
	}

	.section-content {
		font-size: 28rpx;
		line-height: 1.6;
		color: #666;
	}

	.paragraph {
		display: block;
		margin-bottom: 20rpx;
	}

	.warning-list {
		margin-top: 20rpx;
	}

	.warning-title {
		color: #ff4d4f;
		font-weight: 500;
		margin-bottom: 16rpx;
		display: block;
	}

	.warning-items {
		color: #ff4d4f;
		font-size: 26rpx;
		line-height: 1.6;
	}

	.warning-item {
		margin-bottom: 12rpx;
		padding-left: 20rpx;
	}

	.bottom-buttons {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 20rpx 40rpx;
		background-color: #fff;
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
		display: flex;
		justify-content: space-between;
		gap: 20rpx;
	}

	.btn {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 40rpx;
		font-size: 28rpx;
		transition: all 0.3s ease;
	}

	.agree {
		position: relative;
		overflow: hidden;
		background-color: #007AFF;
		color: #fff;
	}

	.cancel {
		background-color: #f5f5f5;
		color: #666;
	}

	.btn-disabled {
		background-color: #cccccc !important;
		cursor: not-allowed;
		opacity: 0.8;
	}

	/* 适配iPhone底部安全区 */
	@supports (padding-bottom: constant(safe-area-inset-bottom)) {
		.bottom-buttons {
			padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
		}
	}

	@supports (padding-bottom: env(safe-area-inset-bottom)) {
		.bottom-buttons {
			padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
		}
	}

	.info-list,
	.promise-list,
	.disclaimer-list {
		padding-left: 30rpx;
		margin: 16rpx 0;
	}

	.info-item,
	.promise-item,
	.disclaimer-item {
		display: block;
		font-size: 26rpx;
		color: #666;
		line-height: 1.6;
		margin-bottom: 12rpx;
	}

	.highlight {
		color: #ff4d4f;
		font-weight: 500;
	}

	.warning .section-content {
		color: #666;
	}

	.list-items {
		padding-left: 30rpx;
		margin: 12rpx 0;
	}

	.list-item {
		display: block;
		font-size: 26rpx;
		color: #666;
		line-height: 1.8;
		margin-bottom: 10rpx;
		position: relative;
	}

	/* 添加滚动提示 */
	.content-section::after {
		content: '请阅读完整协议内容';
		display: block;
		text-align: center;
		padding: 20rpx 0;
		color: #999;
		font-size: 24rpx;
	}

	/* 已阅读到底部时隐藏提示 */
	.content-section.read-to-bottom::after {
		display: none;
	}

	/* 按钮过渡动画 */
	.btn {
		transition: all 0.3s ease;
	}

	/* 添加波纹效果 */
	.agree:not(.btn-disabled):active::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 300%;
		height: 300%;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		transform: translate(-50%, -50%) scale(0);
		animation: ripple 0.6s ease-out;
	}

	@keyframes ripple {
		from {
			transform: translate(-50%, -50%) scale(0);
		}
		to {
			transform: translate(-50%, -50%) scale(1);
			opacity: 0;
		}
	}

	/* 适配暗黑模式 */
	@media (prefers-color-scheme: dark) {
		.btn-disabled {
			background-color: #333333 !important;
		}
		
		.content-section::after {
			color: #666;
		}
	}
</style>
