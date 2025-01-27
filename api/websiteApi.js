import {httpOFGet,httpOfGetWithNotToken,httpOFPost} from "../pages/js/globalRequest.js";

export function getWebSiteDesAPI(url){
	return httpOFGet("common/generateWebsiteDes?url="+url)
}

export function postWebSiteAPI(data){
	return httpOFPost("website/save",data)
}

export function listWebSitePageAPI(pageIndex,pageSize,search,pageType,openid){
	let url=""
	if(search==null){
		url = "website/page?pageIndex="+pageIndex+"&pageSize="+pageSize+"&pageType="+pageType
	}
	else{
		url="website/page?pageIndex="+pageIndex+"&pageSize="+pageSize+"&search="+search+"&pageType="+pageType
	}
	if(pageType == 2){
		url += "&openid="+openid
	}
	return httpOFGet(url)
}

export function modifyWebsiteInfoAPI(data){
	return httpOFPost("website/modify",data)
}

export function getWebsiteById(id){
	return httpOFGet("website?id="+id)
}