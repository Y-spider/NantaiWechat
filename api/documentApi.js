import {httpOFGet,httpOfGetWithNotToken,httpOFPost} from "../pages/js/globalRequest.js";

export function listDocumentPageAPI(pageIndex,pageSize,search,pageType,openid){
	let url=""
	if(search==null){
		url="document/page?pageIndex="+pageIndex+"&pageSize="+pageSize+"&pageType="+pageType
	}
	else{
		url="document/page?pageIndex="+pageIndex+"&pageSize="+pageSize+"&search="+search+"&pageType="+pageType
	}
	if(pageType == 2){
		url+="&openid="+openid
	}
	return httpOFGet(url)
}


export function listDocumentImageUrlAPI(documentId){
	return httpOFGet("document/getUrl?documentId="+documentId)
}

export function downloadFileAPI(documentId,url){
	return httpOFGet("document/download?documentId="+documentId+"&url="+url)
}

// 根据文档id获取文档信息

export function getDocumentById(id){
	return httpOFGet("document?id="+id)
}

export function getDocumentDownloadUrlAPI(documentId){
	return httpOFGet("document/getDownloadUrl?documentId="+documentId)
}
