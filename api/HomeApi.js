import {httpOFGet,httpOfGetWithNotToken,httpOFPost} from "../pages/js/globalRequest.js";

export function loginAPI(path){
	return httpOfGetWithNotToken(path)
}

export function getCurrentUserInfoAPI(path){
	return httpOFGet(path,false);
}

export function logoutAPI(path){
	// 安全退出
	return httpOFGet(path)
}
// 获取用户的一些基本统计信息
export function getUserStaticAPI(){
	return httpOFGet("user/static")
}