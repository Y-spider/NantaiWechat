import {httpOFGet,httpOfGetWithNotToken,httpOFPost} from "../pages/js/globalRequest.js";

export function loginAPI(path){
	return httpOFGet(path)
}

export function getCurrentUserInfoAPI(path){
	return httpOfGetWithNotToken(path,false);
}

export function logoutAPI(path){
	// 安全退出
	return httpOFGet(path)
}