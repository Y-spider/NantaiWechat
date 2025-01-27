import {httpOFGet,httpOFPost} from "../pages/js/globalRequest.js"

export function postAPI(data){
	return httpOFPost("post",data)
};
export function postBatchUpdateAPI(data){
	return httpOFPost("post/modifyPost",data,false)
}

export function getPostByOpenidAPI(openid){
	return httpOFGet("post/listByOpenid?openid="+openid,false)
}

export function deletPostAPI(data){
	return httpOFPost("post/deletePost",data,false)
}

export function getCollectionPostAPI(openid,pageIndex,pageSize){
	return httpOFGet("post/getCollectionPost?openid="+openid+"&pageIndex="+pageIndex+"&pageSize="+pageSize)
}

export function deleteLikeOrCollectionRecordWithOpneidAndPostIdAPI(openid,postId){
	return httpOFGet("likeOrCollection/deletePostLikeOrCollection?openid="+openid+"&postId="+postId)
}

export function getPostStateByPostIdAPI(postId){
	return httpOFGet("post/getPostState?postId="+postId)	
}

export function getTopPostByPostIdAPI(postId){
	return httpOFGet("post/getTopPost?postId="+postId)
}

export function getPostByPostIdAPI(id){
	return httpOFGet(`post/${id}`)
}

// 获取我的发帖
export function getMyPostAPI(openid,searchTitle){
	if(searchTitle){
		return httpOFGet(`post/mypost?openid=${openid}&searchTitle=${searchTitle}`)
	}
	return httpOFGet(`post/mypost?openid=${openid}`)
}