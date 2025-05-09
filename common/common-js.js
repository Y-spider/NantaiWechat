
function backToFrontPage() {
    uni.navigateBack();
}

function navigateToPage(path) {
    uni.navigateTo({
        url: path
    });
}

function showErr(ErroMsg){
	// uni.showToast({
	// 	icon:"none",
	// 	title:ErroMsg,
	// 	duration:2000
	// })
	uni.showModal({
		content:ErroMsg,
		showCancel:false
	})
}

function showSuccess(successMsg){
	 // return new Promise((resolve,reject)=>{
		//  uni.showToast({
		//  	icon:"none",
		//  	title:successMsg,
		//  	duration:2000,
		// 	success(){
		// 		resolve()
		// 	},
		// 	fail() {
		// 		reject()
		// 	}
		//  })
	 // })
	 uni.showModal({
	 	content:successMsg,
		showCancel:false
	 })
}
// 该函数的功能是获取当前日期的字符串 xxxx年xx月xx日
function handleDate(){
	let now = new Date()
	let res;
	res = now.getFullYear() + "-"
	res+= now.getMonth()+"-"
	res+=now.getDate()
	return res
}

function showModelWithNoCancle(content){
	uni.showModal({
		content,
		showCancel:false
	})
}

// 压缩图片
function myCompressImage(imageTempFilePath){
	// 使用uniapp提供的图片压缩方法compressImage进行压缩
	// 由于只该方法只能对.jpg格式的图片进行压缩，那么就只能要求用户传递的照片为jpg格式了
	// 其实只要是使用手机拍照的图片格式都是jpg格式，只有少部分的图片是png，所以这里也就不进行处理类
	return new Promise((resolve,reject)=>{
		uni.compressImage({	
			src:imageTempFilePath,
			quality:60,
			success(res) {
				// 转换为base64格式
				let imageBase64Data = uni.getFileSystemManager().readFileSync(res.tempFilePath,"base64",0)
				resolve("data:image/jpeg;base64,"+imageBase64Data)
				
			},
			fail(err){
				resolve(err)
			}
		})
	})
}
function handleTime(timeStr){
	// 用于处理时间,传入一个time的时间字符串，字符串格式为
	let oldTime = new Date(timeStr)
	let nowTime = new Date()
	let oldTimeStamp = oldTime.getTime()
	let nowTimeStamp = nowTime.getTime()
	let diffTimeStampOfMinutes = parseInt((nowTimeStamp - oldTimeStamp)/60000) // 转换为s
	let diffTimeStampOfHours = parseInt(diffTimeStampOfMinutes/60)
	let style_1 = (oldTime.getMonth()+1) +"-"+ oldTime.getDate() + " "+oldTime.getHours()+":"+oldTime.getMinutes()
	// 对比两个时间差，返回处理后的时间字符串
	// 处理的规则是，如果在1小时之内，则返回xx分钟，超过1小时，但是不超过6小时，那么就返回x小时前，如果超过6小时
	// 那么就返回几月记号 如果超过1年的那就不进行任何处理了，直接返回原来的日期字符串即可。
	let diffYear = nowTime.getFullYear() - oldTime.getFullYear()
	let diffMonth = (nowTime.getMonth()+1) - (oldTime.getMonth()+1)
	let diffDay = nowTime.getDate() - oldTime.getDate()
	// 开始判断
	if(diffYear > 1){
		// 表示超过1年，不进行任何处理
		return timeStr
	}
	else if(diffMonth > 0){
		return style_1
	}
	else if(diffDay > 0){
		// 进一步判断当前两个时间具体相差多少时间(因为有可能是这种情况 2024-5-5 23:55 2024-5-6 0:11) 这样就会造成误判
		// 对秒进行判断
		if(diffTimeStampOfHours > 6){
			// 说明大于6个小时
			return style_1
		}
		
	}
	// 这里是天数小于一天的情况
	if(diffTimeStampOfHours <= 12 && diffTimeStampOfHours >= 1){
		// 表示时间差在1小时到6小时之间
		return diffTimeStampOfHours + "小时前"
	}else if(diffTimeStampOfMinutes > 0 && diffTimeStampOfMinutes <59){
		// 表示时间差小于1小时，返回xxx分钟前
		return diffTimeStampOfMinutes + "分钟前"
	}else if(diffTimeStampOfHours > 12){
		return style_1
	}else{
		return "1分钟前"
	}
	
}

function encodeInp(input){
const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
 var output = "";
	var chr1, chr2, chr3 = "";
	var enc1, enc2, enc3, enc4 = "";
	var i = 0;
	do {
		chr1 = input.charCodeAt(i++);
		chr2 = input.charCodeAt(i++);
		chr3 = input.charCodeAt(i++);
		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;
		if (isNaN(chr2)) {
			enc3 = enc4 = 64
		} else if (isNaN(chr3)) {
			enc4 = 64
		}
		output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
		chr1 = chr2 = chr3 = "";
		enc1 = enc2 = enc3 = enc4 = ""
	} while (i < input.length);
	return output
}

function calcFileSize(fileSize){
	// 计算文件的大小，并返回相应的结果 接收的文件大小单位为B   返回B,KB或者MB
	if(fileSize<1024){
		return fileSize+" B"
	}
	let sizeKB = (fileSize/1024).toFixed(2)
	if(sizeKB < 1024){
		return sizeKB+" KB"
	}
	
	let sizeMB = (sizeKB/1024).toFixed(2)
	return sizeMB+" MB"
}

function removeAllStorage(){
	// 清空所有小程序缓存信息
	let storageInfo = uni.getStorageInfoSync()
	let keys = storageInfo.keys
	for(let i = 0;i < keys.length;i++){
		uni.removeStorageSync(keys[i])
	}
}

export {
 backToFrontPage,
 navigateToPage,
 showErr,
 showSuccess,
 handleDate,
 myCompressImage,
 handleTime,
 encodeInp,
 calcFileSize,
 removeAllStorage
 };