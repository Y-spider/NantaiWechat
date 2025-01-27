import {httpOFGet,httpOfGetWithNotToken,httpOFPost} from "../pages/js/globalRequest.js";

// 获取系统配置信息
export function getSystemConfigAPI(){
	return httpOFGet("config")
}