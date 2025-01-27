import {httpOFGet,httpOFPost,httpOfGetWithNotToken} from "../pages/js/globalRequest.js"

export function getWeatherAPI(path){
	return httpOfGetWithNotToken(path,false)
}

export function getFutherWeatherAPI(path){
	return httpOfGetWithNotToken(path,false)
}

export function getPageListAPI(pageIndex,pageSize,name=null){
	return httpOfGetWithNotToken("post/page?pageIndex="+pageIndex+"&pageSize="+pageSize,false);
}

export function getUserLikeOrCollectionAPI(openid){
	return httpOFGet("likeOrCollection/myLikeOrCollection?openid="+openid,false)
}

export function getNoticeAPI(pageIndex,pageSize,typeCode){
	return httpOFGet("back/notice/list?pageIndex="+pageIndex+"&pageSize="+pageSize+"&typeCode="+typeCode)
}
