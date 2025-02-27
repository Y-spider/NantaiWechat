import {httpOFGet,httpOfGetWithNotToken,httpOFPost} from "../pages/js/globalRequest.js";

// 关注用户
export function subscribeClientUserAPI(data){
	return httpOFPost("subscribe/add",data,false)
}

// 取消关注
export function unSubscribeClientUserAPI(subOpenid){
	return httpOFGet(`subscribe/delete?subOpenid=${subOpenid}`)
}

// 获取所有关注用户
export function listAllSubscribeClientUserAPI(pageIndex,pageSize){
	return httpOFGet(`subscribe/list?pageIndex=${pageIndex}&pageSize=${pageSize}`)
}

// 判断当前用户是被关注
export function judgeIsSubUserAPI(openid){
	return httpOFGet(`subscribe/judge?openid=${openid}`)
}