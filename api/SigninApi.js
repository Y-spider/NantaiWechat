// 签到页面相关api
import {httpOFGet,httpOFPost,httpOfGetWithNotToken} from "../pages/js/globalRequest.js"

export function signinAPI(openid){
	return httpOFGet("signin?openid="+openid)
}


export function getSignInInforAPI(openid){
	return httpOFGet("getSignInInfo?openid="+openid)
}